/* Supabase وهمي في الذاكرة لاختبار واجهة الإعلانات فقط (ليس اختبارًا لـ PostgreSQL الحقيقي).
   يحاكي: RLS (anon/user يرون النشط فقط ولا يكتبون، admin يرى ويكتب الكل)، والـ trigger (إعلان نشط واحد)،
   وبعض القيود (النوع، زوج الزر). يضبطه window.__ANN_CFG__ = { rows, role: 'anon'|'user'|'admin', mode: 'ok'|'error'|'missing'|'slow'|'hang' } */
(function () {
  const cfg = window.__ANN_CFG__ || {};
  const ROLE = cfg.role || 'anon';
  const MODE = cfg.mode || 'ok';
  const db = { announcements: JSON.parse(JSON.stringify(cfg.rows || [])) };
  window.__db = db;
  window.__queries = [];
  let seq = 1000;
  const httpOk = (u) => /^https?:\/\/\S+$/i.test(u);

  function checks(r) {
    if (!['info', 'important', 'support'].includes(r.announcement_type)) return false;
    if (!String(r.title || '').trim() || String(r.title).length > 150) return false;
    if (!String(r.description || '').trim() || String(r.description).length > 2000) return false;
    if (r.image_url && !httpOk(r.image_url)) return false;
    if (r.button_url && !httpOk(r.button_url)) return false;
    if (r.button_url && !r.button_text) return false;                         // نفس announcements_button_pair بعد 002
    if (r.button_text && !r.button_url && !String(r.copy_text || '').trim()) return false;
    return true;
  }
  const tick = () => new Date(Date.now() + (seq++) * 1000).toISOString();
  function trigger(row) {                       // نفس منطق trigger في 001_announcements.sql
    row.updated_at = tick();
    if (row.is_active) db.announcements.forEach(o => { if (o.id !== row.id && o.is_active) { o.is_active = false; o.updated_at = tick(); } });
  }
  const visible = (r) => ROLE === 'admin' ? true : r.is_active === true;   // RLS للقراءة

  function builder(table) {
    const q = { table, op: 'select', cols: '', filters: [], or: null, order: [], range: null, limit: null, single: false, payload: null, count: null };
    const api = {
      select(c, o) { q.cols = c || '*'; if (o && o.count) q.count = o.count; return api; },
      insert(v) { q.op = 'insert'; q.payload = v; return api; },
      update(v) { q.op = 'update'; q.payload = v; return api; },
      delete() { q.op = 'delete'; return api; },
      eq(k, v) { q.filters.push([k, v]); return api; },
      or(s) { q.or = s; return api; },
      order(c, o) { q.order.push([c, !(o && o.ascending === false)]); return api; },
      range(a, b) { q.range = [a, b]; return api; },
      limit(n) { q.limit = n; return api; },
      maybeSingle() { q.single = true; return api; },
      then(res, rej) {
        window.__queries.push({ table: q.table, op: q.op, cols: q.cols, filters: JSON.parse(JSON.stringify(q.filters)), limit: q.limit, single: q.single, readyState: document.readyState });
        if (MODE === 'hang' && table === 'announcements') return new Promise(() => {}).then(res, rej);
        const done = () => {
          if (MODE === 'error' && table === 'announcements') return { data: null, error: { code: 'XX000', message: 'boom' } };
          if (MODE === 'missing' && table === 'announcements') return { data: null, error: { code: '42P01', message: 'relation "announcements" does not exist' } };
          if (table !== 'announcements') return { data: [], error: null };
          const T = db.announcements;

          if (q.op === 'insert') {
            if (ROLE !== 'admin') return { data: null, error: { code: '42501', message: 'new row violates row-level security policy' } };
            const rows = (Array.isArray(q.payload) ? q.payload : [q.payload]).map(p => Object.assign({
              id: 'id-' + (seq++), announcement_type: 'info', is_active: false, image_url: null, button_text: null, button_url: null, copy_text: null, created_at: tick(), updated_at: tick() }, p));
            for (const r of rows) {
              if (!checks(r)) return { data: null, error: { code: '23514', message: 'check violation' } };
              trigger(r); T.push(r);
            }
            return { data: rows.map(r => Object.assign({}, r)), error: null };
          }

          let rows = T.filter(visible);
          q.filters.forEach(([k, v]) => { rows = rows.filter(r => String(r[k]) === String(v)); });
          if (q.or) {
            const parts = q.or.split(',').map(s => { const m = s.match(/^(\w+)\.ilike\.%(.*)%$/); return m ? [m[1], m[2].toLowerCase()] : null; }).filter(Boolean);
            rows = rows.filter(r => parts.some(([c, t]) => String(r[c] || '').toLowerCase().includes(t)));
          }

          if (q.op === 'update') {
            if (ROLE !== 'admin') return { data: [], error: null };            // RLS: صفر صفوف
            const changed = rows;
            for (const r of changed) {
              const draft = Object.assign({}, r, q.payload);
              if (!checks(draft)) return { data: null, error: { code: '23514', message: 'check violation' } };
              Object.assign(r, q.payload); trigger(r);
            }
            return { data: changed.map(r => Object.assign({}, r)), error: null };
          }
          if (q.op === 'delete') {
            if (ROLE !== 'admin') return { data: [], error: null };
            rows.forEach(r => T.splice(T.indexOf(r), 1));
            return { data: rows, error: null };
          }

          const total = rows.length;
          q.order.slice().reverse().forEach(([c, asc]) => rows.sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (asc ? 1 : -1)));
          if (q.range) rows = rows.slice(q.range[0], q.range[1] + 1);
          if (q.limit) rows = rows.slice(0, q.limit);
          if (q.single) return { data: rows[0] ? Object.assign({}, rows[0]) : null, error: null };
          return { data: rows.map(r => Object.assign({}, r)), error: null, count: q.count ? total : undefined };
        };
        return new Promise(r => setTimeout(() => r(done()), MODE === 'slow' ? 600 : 5)).then(res, rej);
      }
    };
    return api;
  }

  const session = ROLE === 'anon' ? null : { user: { id: 'u-' + ROLE, email: ROLE + '@example.com' } };
  window.supabase = {
    createClient() {
      return {
        from: builder,
        rpc: (name) => Promise.resolve({ data: name === 'is_admin' ? ROLE === 'admin' : null, error: null }),
        auth: {
          getSession: () => Promise.resolve({ data: { session }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
          signOut: () => Promise.resolve({ error: null })
        }
      };
    }
  };
})();
