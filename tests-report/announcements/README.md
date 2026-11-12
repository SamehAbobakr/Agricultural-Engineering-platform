# اختبارات نظام الإعلانات

```bash
python3 tests-report/announcements/run_tests.py         # واجهة الطلاب (79 فحصًا)
python3 tests-report/announcements/run_admin_tests.py   # وحدة لوحة الإدارة (43 فحصًا)
```
تستخدم Playwright + Supabase وهمي في الذاكرة (`stub.js`) يحاكي RLS وسلوك الـ trigger. **ليست بديلًا** عن اختبار SQL الحقيقي:
شغّل `database/announcements/tests/announcements_tests.sql` على Staging. اللقطات في `screenshots/`.
