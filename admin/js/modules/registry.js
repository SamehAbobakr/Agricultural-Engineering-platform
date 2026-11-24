/**
 * registry.js — وصف وحدات لوحة الإدارة (بيانات فقط)
 *
 * id:     المعرّف في الرابط (#/id)
 * group:  عنوان المجموعة في القائمة الجانبية
 * script: ملف الوحدة داخل admin/js/modules/ (يُحمَّل عند أول زيارة؛ الملف الواحد قد يعرّف عدة وحدات)
 * أي وحدة تُضاف هنا يجب أن يسجّل ملفها نفسه بـ AdminCrud.define(id, ...) أو AdminModules.define(id, ...)
 */
window.AdminRouter.register([
    { id: 'dashboard',     title: 'الرئيسية',              icon: 'dashboard', group: 'عام',              script: 'dashboard.js' },

    { id: 'subjects',      title: 'المواد الدراسية',       icon: 'library', group: 'المحتوى الدراسي',  script: 'subjects.js' },
    { id: 'files',         title: 'ملفات المواد',          icon: 'folder', group: 'المحتوى الدراسي',  script: 'files.js' },

    { id: 'more-items',    title: 'أقسام «المزيد»',        icon: 'layers', group: 'المزيد',           script: 'more.js' },
    { id: 'more-contents', title: 'محتوى الأقسام',         icon: 'folder', group: 'المزيد',           script: 'more.js' },
    { id: 'external',      title: 'المصادر الخارجية',      icon: 'link', group: 'المزيد',           script: 'more.js' },
    { id: 'top-years',     title: 'الأوائل',               icon: 'trophy', group: 'المزيد',           script: 'more.js' },
    { id: 'exams',         title: 'جداول الامتحانات',      icon: 'calendar', group: 'المزيد',           script: 'more.js' },

    { id: 'faculty',       title: 'هيئة التدريس',          icon: 'teacher', group: 'الأشخاص',          script: 'people.js' },
    { id: 'community',     title: 'مجتمع الطلاب والخريجين', icon: 'users', group: 'الأشخاص',          script: 'people.js' },

    { id: 'rooms',         title: 'الغرف',                 icon: 'layers', group: 'المسار التعليمي',  script: 'rooms.js' },
    { id: 'tasks',         title: 'المهام والمحتوى',       icon: 'circle-check', group: 'المسار التعليمي',  script: 'rooms.js' },
    { id: 'quiz',          title: 'أسئلة المهام',          icon: 'help', group: 'المسار التعليمي',  script: 'rooms.js' },

    { id: 'graduation',    title: 'مشاريع التخرج',         icon: 'cap', group: 'المحتوى الأكاديمي', script: 'graduation.js' },

    { id: 'announcements', title: 'إدارة الإعلانات',       icon: 'news', group: 'النظام',           script: 'announcements.js' },

    { id: 'admins',        title: 'المسؤولون',             icon: 'shield', group: 'النظام',           script: 'admins.js' }
]);
