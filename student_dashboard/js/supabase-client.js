const SUPABASE_URL = 'https://kegawnvzoimaddnziotv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0crKHKVfwNCtP5ieWDUpzg_4BeMZLkg';

// لو مكتبة Supabase ما اتحملتش (النت ضعيف مثلاً) الصفحة تفضل شغالة وتعرض رسالة خطأ بدل ما تنهار
export const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
