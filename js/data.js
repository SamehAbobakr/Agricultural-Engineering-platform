const departmentsList = [
    {
        name: "هندسة القوى والآلات الزراعية",
        desc: "المحركات والجرارات والآلات الزراعية",
        icon: "⚙️"
    },
    {
        name: "هندسة المنشآت الزراعية والتحكم البيئي",
        desc: "المنشآت الزراعية والصوب وأنظمة التحكم البيئي",
        icon: "🏗️"
    },
    {
        name: "هندسة نظم المياه والرى",
        desc: "هندسة الري وشبكات الصرف والمنشآت المائية",
        icon: "💧"
    },
    {
        name: "هندسة تصنيع المنتجات الغذائية",
        desc: "تصنيع وحفظ وجودة المنتجات الغذائية",
        icon: "🏭"
    },
    {
        name: "الشعبة العامة",
        desc: "المقررات العامة والمشتركة",
        icon: "📚"
    }
];

const subjectsData = {
    "الفرقة الأولى": {
        "الترم الأول": [
            { name: "رياضة عامة", prof: "قسم الرياضيات", lectures: 14, pdfs: 10, updated: "منذ يومين", icon: "📐", term: "الترم الأول" },
            { name: "حاسب آلي", prof: "قسم الحاسب", lectures: 12, pdfs: 10, updated: "اليوم", icon: "💻", term: "الترم الأول" },
            { name: "مورفولوجيا وتشريح نبات", prof: "قسم النبات", lectures: 15, pdfs: 12, updated: "منذ 3 أيام", icon: "🌿", term: "الترم الأول" },
            { name: "رسم هندسي", prof: "قسم الهندسة", lectures: 15, pdfs: 14, updated: "أمس", icon: "✏️", term: "الترم الأول" },
            { name: "تقنية ورش", prof: "قسم الورش", lectures: 10, pdfs: 8, updated: "منذ 4 أيام", icon: "🛠️", term: "الترم الأول" }
        ],
        "الترم الثاني": [
            { name: "قرآن كريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "منذ يومين", icon: "📖", term: "الترم الثاني" },
            { name: "فقه", prof: "قسم الشريعة", lectures: 12, pdfs: 8, updated: "منذ 3 أيام", icon: "⚖️", term: "الترم الثاني" },
            { name: "عقيدة", prof: "قسم العقيدة", lectures: 12, pdfs: 8, updated: "منذ 4 أيام", icon: "🛡️", term: "الترم الثاني" },
            { name: "مساحة", prof: "قسم المساحة والري", lectures: 14, pdfs: 11, updated: "اليوم", icon: "📐", term: "الترم الثاني" },
            { name: "مدخل هندسة زراعية", prof: "قسم الهندسة الزراعية", lectures: 12, pdfs: 10, updated: "أمس", icon: "🚜", term: "الترم الثاني" },
            { name: "فيزياء", prof: "قسم الفيزياء", lectures: 15, pdfs: 14, updated: "منذ يوم", icon: "⚡", term: "الترم الثاني" },
            { name: "ميكانيكا", prof: "قسم الميكانيكا", lectures: 15, pdfs: 12, updated: "منذ يومين", icon: "⚙️", term: "الترم الثاني" },
            { name: "تكنولوجيا أغذية", prof: "قسم تصنيع الأغذية", lectures: 12, pdfs: 10, updated: "منذ 5 أيام", icon: "🏭", term: "الترم الثاني" },
            { name: "رسم آلات", prof: "قسم الرسم الهندسي", lectures: 14, pdfs: 12, updated: "منذ يوم", icon: "✏️", term: "الترم الثاني" }
        ]
    },
    "الفرقة الثانية": {
        "الترم الأول": [
            { name: "هيدروليكا", prof: "قسم هندسة نظم المياه والرى", lectures: 15, pdfs: 12, updated: "اليوم", icon: "💧", term: "الترم الأول" },
            { name: "أراضٍ", prof: "قسم الأراضي", lectures: 12, pdfs: 10, updated: "أمس", icon: "🌱", term: "الترم الأول" },
            { name: "ثرموديناميك", prof: "قسم القوى الميكانيكية", lectures: 15, pdfs: 14, updated: "منذ يومين", icon: "🔥", term: "الترم الأول" },
            { name: "هندسة كهربية", prof: "قسم الهندسة الكهربية", lectures: 14, pdfs: 12, updated: "منذ 3 أيام", icon: "⚡", term: "الترم الأول" },
            { name: "أوتوكاد", prof: "قسم التصميم الهندسي", lectures: 10, pdfs: 15, updated: "اليوم", icon: "💻", term: "الترم الأول" },
            { name: "إنشاءات", prof: "قسم المنشآت الزراعية", lectures: 14, pdfs: 12, updated: "منذ 4 أيام", icon: "🏗️", term: "الترم الأول" }
        ],
        "الترم الثاني": [
            { name: "قرآن كريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
            { name: "سيرة نبوية", prof: "قسم السيرة والتاريخ", lectures: 12, pdfs: 8, updated: "منذ يومين", icon: "📜", term: "الترم الثاني" },
            { name: "إنجليزي", prof: "قسم اللغات", lectures: 14, pdfs: 10, updated: "منذ 3 أيام", icon: "🔤", term: "الترم الثاني" },
            { name: "برمجة وحاسب", prof: "قسم الحاسب الآلي", lectures: 15, pdfs: 12, updated: "اليوم", icon: "💻", term: "الترم الثاني" },
            { name: "معادلات تفاضلية", prof: "قسم الرياضيات", lectures: 15, pdfs: 14, updated: "أمس", icon: "🔢", term: "الترم الثاني" },
            { name: "انتقال حرارة", prof: "قسم القوى الميكانيكية", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "🔥", term: "الترم الثاني" },
            { name: "إنتاج محاصيل", prof: "قسم المحاصيل", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "🌾", term: "الترم الثاني" },
            { name: "نظرية الآلات", prof: "قسم الآلات الزراعية", lectures: 15, pdfs: 13, updated: "اليوم", icon: "⚙️", term: "الترم الثاني" }
        ]
    },
    "الفرقة الثالثة": {
        "هندسة القوى والآلات الزراعية": {
            "الترم الأول": [
                { name: "تصميم آلات", prof: "قسم القوى والآلات", lectures: 15, pdfs: 14, updated: "اليوم", icon: "📐", term: "الترم الأول" },
                { name: "إدارة ميكنة", prof: "قسم القوى والآلات", lectures: 14, pdfs: 12, updated: "أمس", icon: "📊", term: "الترم الأول" },
                { name: "ميكنة مسطحات", prof: "قسم القوى والآلات", lectures: 12, pdfs: 10, updated: "منذ يومين", icon: "🚜", term: "الترم الأول" },
                { name: "آلات مقاومة", prof: "قسم القوى والآلات", lectures: 13, pdfs: 11, updated: "منذ 3 أيام", icon: "⚙️", term: "الترم الأول" },
                { name: "محركات احتراق داخلي", prof: "قسم القوى الميكانيكية", lectures: 16, pdfs: 15, updated: "اليوم", icon: "🔥", term: "الترم الأول" },
                { name: "أجهزة قياس وتحكم", prof: "قسم التحكم الآلي", lectures: 14, pdfs: 12, updated: "منذ 4 أيام", icon: "🎛️", term: "الترم الأول" },
                { name: "الخصائص", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "منذ يومين", icon: "📋", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "التفسير", prof: "قسم الشريعة", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الآلات الزراعية", prof: "قسم القوى والآلات", lectures: 15, pdfs: 13, updated: "منذ يومين", icon: "🚜", term: "الترم الثاني" },
                { name: "القوى والجرارات", prof: "قسم القوى والآلات", lectures: 14, pdfs: 12, updated: "منذ 3 أيام", icon: "⚙️", term: "الترم الثاني" },
                { name: "ميكنة الإنتاج الزراعي", prof: "قسم القوى والآلات", lectures: 13, pdfs: 11, updated: "اليوم", icon: "🌾", term: "الترم الثاني" },
                { name: "هندسة التخزين", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "📦", term: "الترم الثاني" },
                { name: "التخطيط الهندسي", prof: "قسم التخطيط", lectures: 14, pdfs: 12, updated: "منذ يوم", icon: "📐", term: "الترم الثاني" },
                { name: "الإلكترونيات", prof: "قسم الهندسة الكهربية", lectures: 15, pdfs: 14, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "الإحصاء", prof: "قسم الرياضيات", lectures: 14, pdfs: 12, updated: "اليوم", icon: "📊", term: "الترم الثاني" }
            ]
        },
        "هندسة المنشآت الزراعية والتحكم البيئي": {
            "الترم الأول": [
                { name: "هندسة التخزين", prof: "قسم المنشآت الزراعية", lectures: 14, pdfs: 12, updated: "اليوم", icon: "📦", term: "الترم الأول" },
                { name: "مزارع الدواجن", prof: "قسم المنشآت الزراعية", lectures: 13, pdfs: 11, updated: "أمس", icon: "🐔", term: "الترم الأول" },
                { name: "آلات المقاومة", prof: "قسم القوى والآلات", lectures: 12, pdfs: 10, updated: "منذ يومين", icon: "⚙️", term: "الترم الأول" },
                { name: "إدارة المخلفات السائلة", prof: "قسم هندسة نظم المياه والرى", lectures: 15, pdfs: 13, updated: "منذ 3 أيام", icon: "♻️", term: "الترم الأول" },
                { name: "أجهزة القياس والتحكم", prof: "قسم التحكم الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🎛️", term: "الترم الأول" },
                { name: "الخصائص", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "📋", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "التفسير", prof: "قسم الشريعة", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "هندسة نظم المياه والرى", prof: "قسم هندسة نظم المياه والرى", lectures: 15, pdfs: 12, updated: "منذ يومين", icon: "💧", term: "الترم الثاني" },
                { name: "مواد البناء", prof: "قسم المنشآت الزراعية", lectures: 13, pdfs: 11, updated: "منذ 3 أيام", icon: "🧱", term: "الترم الثاني" },
                { name: "ميكنة الإنتاج الزراعي", prof: "قسم القوى والآلات", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🌾", term: "الترم الثاني" },
                { name: "المفاعلات الحيوية", prof: "قسم التحكم البيئي", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "🦠", term: "الترم الثاني" },
                { name: "تخطيط المنشآت", prof: "قسم المنشآت الزراعية", lectures: 14, pdfs: 12, updated: "منذ يوم", icon: "🏗️", term: "الترم الثاني" },
                { name: "الإلكترونيات", prof: "قسم الهندسة الكهربية", lectures: 15, pdfs: 14, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "الإحصاء", prof: "قسم الرياضيات", lectures: 14, pdfs: 12, updated: "اليوم", icon: "📊", term: "الترم الثاني" }
            ]
        },
        "هندسة نظم المياه والرى": {
            "الترم الأول": [
                { name: "هندسة التصنيع", prof: "قسم تصنيع الأغذية", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🏭", term: "الترم الأول" },
                { name: "إدارة الري الحقلي", prof: "قسم هندسة نظم المياه والرى", lectures: 15, pdfs: 13, updated: "أمس", icon: "💧", term: "الترم الأول" },
                { name: "ميكانيكا الموائع", prof: "قسم هندسة نظم المياه والرى", lectures: 16, pdfs: 14, updated: "منذ يومين", icon: "🌊", term: "الترم الأول" },
                { name: "المضخات", prof: "قسم القوى الميكانيكية", lectures: 13, pdfs: 11, updated: "منذ 3 أيام", icon: "⚙️", term: "الترم الأول" },
                { name: "أجهزة القياس والتحكم", prof: "قسم التحكم الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🎛️", term: "الترم الأول" },
                { name: "محركات الاحتراق الداخلي", prof: "قسم القوى الميكانيكية", lectures: 15, pdfs: 13, updated: "منذ 4 أيام", icon: "🔥", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "التفسير", prof: "قسم الشريعة", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الآلات الزراعية", prof: "قسم القوى والآلات", lectures: 15, pdfs: 13, updated: "منذ يومين", icon: "🚜", term: "الترم الثاني" },
                { name: "الهيدرولوجي والآبار", prof: "قسم الري والصرف", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🌊", term: "الترم الثاني" },
                { name: "نظم الري السطحي", prof: "قسم الري والصرف", lectures: 14, pdfs: 11, updated: "أمس", icon: "💧", term: "الترم الثاني" },
                { name: "نظم توصيل المياه", prof: "قسم الري والصرف", lectures: 13, pdfs: 10, updated: "منذ يومين", icon: "🚰", term: "الترم الثاني" },
                { name: "التخطيط", prof: "قسم التخطيط", lectures: 12, pdfs: 10, updated: "منذ 3 أيام", icon: "📐", term: "الترم الثاني" },
                { name: "الإلكترونيات", prof: "قسم الهندسة الكهربية", lectures: 15, pdfs: 14, updated: "منذ 4 أيام", icon: "⚡", term: "الترم الثاني" },
                { name: "ميكانيكا التربة", prof: "قسم الهندسة المدنية", lectures: 16, pdfs: 14, updated: "اليوم", icon: "🧱", term: "الترم الثاني" }
            ]
        },
        "هندسة تصنيع المنتجات الغذائية": {
            "الترم الأول": [
                { name: "هندسة التصنيع", prof: "قسم تصنيع الأغذية", lectures: 15, pdfs: 13, updated: "اليوم", icon: "🏭", term: "الترم الأول" },
                { name: "إدارة مخلفات الأغذية", prof: "قسم تصنيع الأغذية", lectures: 14, pdfs: 12, updated: "أمس", icon: "♻️", term: "الترم الأول" },
                { name: "أجهزة القياس والتحكم", prof: "قسم التحكم الآلي", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "🎛️", term: "الترم الأول" },
                { name: "الخصائص", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "منذ 3 أيام", icon: "📋", term: "الترم الأول" },
                { name: "اقتصاديات وإدارة المصانع", prof: "قسم الإدارة الهندسية", lectures: 13, pdfs: 11, updated: "اليوم", icon: "📈", term: "الترم الأول" },
                { name: "ميكروبيولوجيا الألبان والأغذية", prof: "قسم الصناعات الغذائية", lectures: 16, pdfs: 14, updated: "منذ يومين", icon: "🦠", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "التفسير", prof: "قسم الشريعة", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "تصميم الآلات", prof: "قسم التصميم", lectures: 15, pdfs: 13, updated: "منذ يومين", icon: "⚙️", term: "الترم الثاني" },
                { name: "هندسة التداول", prof: "قسم تصنيع الأغذية", lectures: 13, pdfs: 11, updated: "منذ 3 أيام", icon: "📦", term: "الترم الثاني" },
                { name: "هندسة التصنيع", prof: "قسم تصنيع الأغذية", lectures: 15, pdfs: 14, updated: "اليوم", icon: "🏭", term: "الترم الثاني" },
                { name: "هندسة التخزين", prof: "قسم المنشآت", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "🏢", term: "الترم الثاني" },
                { name: "المضخات", prof: "قسم القوى الميكانيكية", lectures: 13, pdfs: 11, updated: "منذ يوم", icon: "🔄", term: "الترم الثاني" },
                { name: "الإلكترونيات", prof: "قسم الهندسة الكهربية", lectures: 15, pdfs: 14, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "الإحصاء", prof: "قسم الرياضيات", lectures: 14, pdfs: 12, updated: "اليوم", icon: "📊", term: "الترم الثاني" }
            ]
        },
        "الشعبة العامة": {
            "الترم الأول": [
                { name: "هندسة التصنيع", prof: "قسم تصنيع الأغذية", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🏭", term: "الترم الأول" },
                { name: "الاقتصاد", prof: "قسم العلوم الاقتصادية", lectures: 12, pdfs: 10, updated: "أمس", icon: "📈", term: "الترم الأول" },
                { name: "محركات الاحتراق الداخلي", prof: "قسم القوى الميكانيكية", lectures: 16, pdfs: 14, updated: "منذ يومين", icon: "🔥", term: "الترم الأول" },
                { name: "أجهزة القياس والتحكم", prof: "قسم التحكم الآلي", lectures: 14, pdfs: 12, updated: "منذ 3 أيام", icon: "🎛️", term: "الترم الأول" },
                { name: "الخصائص", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "اليوم", icon: "📋", term: "الترم الأول" },
                { name: "تخطيط وري المسطحات", prof: "قسم الري والصرف", lectures: 15, pdfs: 13, updated: "منذ يومين", icon: "🌱", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "التفسير", prof: "قسم الشريعة", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "هندسة الري والصرف", prof: "قسم الري والصرف", lectures: 15, pdfs: 12, updated: "منذ يومين", icon: "💧", term: "الترم الثاني" },
                { name: "الآلات الزراعية", prof: "قسم القوى والآلات", lectures: 15, pdfs: 13, updated: "منذ 3 أيام", icon: "🚜", term: "الترم الثاني" },
                { name: "ميكنة الإنتاج الزراعي", prof: "قسم القوى والآلات", lectures: 13, pdfs: 11, updated: "اليوم", icon: "🌾", term: "الترم الثاني" },
                { name: "هندسة التخزين", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "📦", term: "الترم الثاني" },
                { name: "التخطيط", prof: "قسم التخطيط", lectures: 14, pdfs: 12, updated: "منذ يوم", icon: "📐", term: "الترم الثاني" },
                { name: "القوى والجرارات", prof: "قسم القوى والآلات", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "⚙️", term: "الترم الثاني" },
                { name: "الإحصاء", prof: "قسم الرياضيات", lectures: 14, pdfs: 12, updated: "اليوم", icon: "📊", term: "الترم الثاني" }
            ]
        }
    },
    "الفرقة الرابعة": {
        "هندسة القوى والآلات الزراعية": {
            "الترم الأول": [
                { name: "النظم الهيدروليكية", prof: "قسم القوى الميكانيكية", lectures: 14, pdfs: 12, updated: "اليوم", icon: "🚰", term: "الترم الأول" },
                { name: "هندسة التنظيف والتدريج والفصل", prof: "قسم القوى والآلات", lectures: 13, pdfs: 11, updated: "أمس", icon: "🔍", term: "الترم الأول" },
                { name: "الآلات الزراعية (ب)", prof: "قسم القوى والآلات", lectures: 15, pdfs: 13, updated: "منذ يومين", icon: "🚜", term: "الترم الأول" },
                { name: "هندسة البيوت المحمية", prof: "قسم التحكم البيئي", lectures: 14, pdfs: 12, updated: "منذ 3 أيام", icon: "🏡", term: "الترم الأول" },
                { name: "آلات ومعدات الاستصلاح", prof: "قسم القوى والآلات", lectures: 12, pdfs: 10, updated: "اليوم", icon: "⚙️", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "الحديث الشريف", prof: "قسم السنة والحديث", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الكهرباء الريفية", prof: "قسم الهندسة الكهربية", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "تشغيل وصيانة الآلات", prof: "قسم القوى والآلات", lectures: 15, pdfs: 13, updated: "منذ 3 أيام", icon: "🛠️", term: "الترم الثاني" },
                { name: "تطبيقات الحاسب الآلي في التخصص", prof: "قسم الحاسب الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "💻", term: "الترم الثاني" },
                { name: "الموارد المائية", prof: "قسم الري والصرف", lectures: 13, pdfs: 11, updated: "منذ 4 أيام", icon: "💧", term: "الترم الثاني" },
                { name: "هندسة الري والصرف", prof: "قسم الري والصرف", lectures: 15, pdfs: 13, updated: "منذ يومين", icon: "🌊", term: "الترم الثاني" },
                { name: "هندسة تدوير المخلفات الزراعية", prof: "قسم التخصص", lectures: 14, pdfs: 12, updated: "أمس", icon: "♻️", term: "الترم الثاني" },
                { name: "مشروع التخرج", prof: "هيئة التدريس", lectures: 20, pdfs: 15, updated: "اليوم", icon: "🎓", term: "الترم الثاني" }
            ]
        },
        "هندسة المنشآت الزراعية والتحكم البيئي": {
            "الترم الأول": [
                { name: "طاقات جديدة ومتجددة", prof: "قسم القوى الميكانيكية", lectures: 15, pdfs: 13, updated: "اليوم", icon: "☀️", term: "الترم الأول" },
                { name: "المباني الزراعية", prof: "قسم المنشآت الزراعية", lectures: 14, pdfs: 12, updated: "أمس", icon: "🏢", term: "الترم الأول" },
                { name: "هندسة تخطيط وري المسطحات الخضراء", prof: "قسم الري والصرف", lectures: 13, pdfs: 11, updated: "منذ يومين", icon: "🌱", term: "الترم الأول" },
                { name: "هندسة البيوت المحمية", prof: "قسم التحكم البيئي", lectures: 14, pdfs: 12, updated: "منذ 3 أيام", icon: "🏡", term: "الترم الأول" },
                { name: "التحكم البيئي", prof: "قسم التحكم البيئي", lectures: 15, pdfs: 13, updated: "اليوم", icon: "🎛️", term: "الترم الأول" },
                { name: "تطبيقات التحليل البعدي", prof: "قسم التخصص", lectures: 12, pdfs: 10, updated: "منذ 4 أيام", icon: "📐", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "الحديث الشريف", prof: "قسم السنة والحديث", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الكهرباء الريفية", prof: "قسم الهندسة الكهربية", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "تشوهات المباني", prof: "قسم المنشآت الزراعية", lectures: 13, pdfs: 11, updated: "منذ 3 أيام", icon: "🏗️", term: "الترم الثاني" },
                { name: "تطبيقات الحاسب الآلي في التخصص", prof: "قسم الحاسب الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "💻", term: "الترم الثاني" },
                { name: "الخرسانة", prof: "قسم الهندسة المدنية", lectures: 15, pdfs: 13, updated: "منذ 4 أيام", icon: "🧱", term: "الترم الثاني" },
                { name: "هندسة تدوير المخلفات الزراعية", prof: "قسم التخصص", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "♻️", term: "الترم الثاني" },
                { name: "ميكانيكا التربة", prof: "قسم الهندسة المدنية", lectures: 15, pdfs: 13, updated: "أمس", icon: "🌍", term: "الترم الثاني" },
                { name: "مشروع التخرج", prof: "هيئة التدريس", lectures: 20, pdfs: 15, updated: "اليوم", icon: "🎓", term: "الترم الثاني" }
            ]
        },
        "هندسة نظم المياه والرى": {
            "الترم الأول": [
                { name: "نظم الري بالرش", prof: "قسم الري والصرف", lectures: 15, pdfs: 13, updated: "اليوم", icon: "🚿", term: "الترم الأول" },
                { name: "آلات ومعدات الري الحديث", prof: "قسم الري والصرف", lectures: 14, pdfs: 12, updated: "أمس", icon: "⚙️", term: "الترم الأول" },
                { name: "هندسة الاستصلاح", prof: "قسم الري والصرف", lectures: 13, pdfs: 11, updated: "منذ يومين", icon: "🏗️", term: "الترم الأول" },
                { name: "مبادئ الاقتصاد الزراعي", prof: "قسم الاقتصاد", lectures: 12, pdfs: 10, updated: "منذ 3 أيام", icon: "📈", term: "الترم الأول" },
                { name: "معالجة واستخدام مياه الصرف", prof: "قسم الري والصرف", lectures: 14, pdfs: 12, updated: "اليوم", icon: "♻️", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "الحديث الشريف", prof: "قسم السنة والحديث", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الكهرباء الريفية", prof: "قسم الهندسة الكهربية", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "الري بالتنقيط", prof: "قسم الري والصرف", lectures: 15, pdfs: 13, updated: "منذ 3 أيام", icon: "💧", term: "الترم الثاني" },
                { name: "تطبيقات الحاسب الآلي في التخصص", prof: "قسم الحاسب الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "💻", term: "الترم الثاني" },
                { name: "البيوت المحمية", prof: "قسم التحكم البيئي", lectures: 13, pdfs: 11, updated: "منذ 4 أيام", icon: "🏡", term: "الترم الثاني" },
                { name: "هندسة تدوير المخلفات الزراعية", prof: "قسم التخصص", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "♻️", term: "الترم الثاني" },
                { name: "مشروع التخرج", prof: "هيئة التدريس", lectures: 20, pdfs: 15, updated: "اليوم", icon: "🎓", term: "الترم الثاني" }
            ]
        },
        "هندسة تصنيع المنتجات الغذائية": {
            "الترم الأول": [
                { name: "طاقات جديدة ومتجددة", prof: "قسم القوى الميكانيكية", lectures: 15, pdfs: 13, updated: "اليوم", icon: "☀️", term: "الترم الأول" },
                { name: "هندسة التنظيف والتدريج والفصل", prof: "قسم القوى والآلات", lectures: 14, pdfs: 12, updated: "أمس", icon: "🔍", term: "الترم الأول" },
                { name: "التحكم الآلي والرقمي", prof: "قسم التحكم الآلي", lectures: 13, pdfs: 11, updated: "منذ يومين", icon: "🎛️", term: "الترم الأول" },
                { name: "مبادئ الاقتصاد الزراعي", prof: "قسم الاقتصاد", lectures: 12, pdfs: 10, updated: "منذ 3 أيام", icon: "📈", term: "الترم الأول" },
                { name: "إعداد وتجهيز وتخزين وتصدير الحاصلات", prof: "قسم تصنيع الأغذية", lectures: 15, pdfs: 13, updated: "اليوم", icon: "📦", term: "الترم الأول" },
                { name: "محركات الاحتراق الداخلي", prof: "قسم القوى الميكانيكية", lectures: 14, pdfs: 12, updated: "منذ 4 أيام", icon: "🔥", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "الحديث الشريف", prof: "قسم السنة والحديث", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الكهرباء الريفية", prof: "قسم الهندسة الكهربية", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "هندسة تجفيف وحفظ المنتجات", prof: "قسم تصنيع الأغذية", lectures: 15, pdfs: 13, updated: "منذ 3 أيام", icon: "☀️", term: "الترم الثاني" },
                { name: "تطبيقات الحاسب الآلي في التخصص", prof: "قسم الحاسب الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "💻", term: "الترم الثاني" },
                { name: "هندسة المفاعلات الحيوية", prof: "قسم التحكم البيئي", lectures: 13, pdfs: 11, updated: "منذ 4 أيام", icon: "🦠", term: "الترم الثاني" },
                { name: "أمن مصانع الإنتاج الزراعي", prof: "قسم الإدارة الهندسية", lectures: 12, pdfs: 10, updated: "منذ يومين", icon: "🛡️", term: "الترم الثاني" },
                { name: "تطبيقات التحليل البعدي", prof: "قسم التخصص", lectures: 14, pdfs: 12, updated: "أمس", icon: "📐", term: "الترم الثاني" },
                { name: "مشروع التخرج", prof: "هيئة التدريس", lectures: 20, pdfs: 15, updated: "اليوم", icon: "🎓", term: "الترم الثاني" }
            ]
        },
        "الشعبة العامة": {
            "الترم الأول": [
                { name: "هندسة تداول وتعبئة وتجهيز الحاصلات", prof: "قسم تصنيع الأغذية", lectures: 15, pdfs: 13, updated: "اليوم", icon: "📦", term: "الترم الأول" },
                { name: "آلات ومعدات الري الحديث", prof: "قسم الري والصرف", lectures: 14, pdfs: 12, updated: "أمس", icon: "⚙️", term: "الترم الأول" },
                { name: "الآلات الزراعية (ب)", prof: "قسم القوى والآلات", lectures: 13, pdfs: 11, updated: "منذ يومين", icon: "🚜", term: "الترم الأول" },
                { name: "تصميم الآلات والجرارات الزراعية", prof: "قسم القوى والآلات", lectures: 15, pdfs: 14, updated: "منذ 3 أيام", icon: "📐", term: "الترم الأول" },
                { name: "آلات ومعدات الاستصلاح", prof: "قسم القوى والآلات", lectures: 12, pdfs: 10, updated: "اليوم", icon: "🏗️", term: "الترم الأول" },
                { name: "قياسات البيئة", prof: "قسم التحكم البيئي", lectures: 14, pdfs: 12, updated: "منذ 4 أيام", icon: "🌡️", term: "الترم الأول" }
            ],
            "الترم الثاني": [
                { name: "القرآن الكريم", prof: "قسم القرآن الكريم", lectures: 10, pdfs: 6, updated: "اليوم", icon: "📖", term: "الترم الثاني" },
                { name: "الحديث الشريف", prof: "قسم السنة والحديث", lectures: 12, pdfs: 8, updated: "أمس", icon: "📜", term: "الترم الثاني" },
                { name: "الكهرباء الريفية", prof: "قسم الهندسة الكهربية", lectures: 14, pdfs: 12, updated: "منذ يومين", icon: "⚡", term: "الترم الثاني" },
                { name: "تشغيل وصيانة الآلات", prof: "قسم القوى والآلات", lectures: 15, pdfs: 13, updated: "منذ 3 أيام", icon: "🛠️", term: "الترم الثاني" },
                { name: "تطبيقات الحاسب الآلي في التخصص", prof: "قسم الحاسب الآلي", lectures: 14, pdfs: 12, updated: "اليوم", icon: "💻", term: "الترم الثاني" },
                { name: "الخرسانة", prof: "قسم الهندسة المدنية", lectures: 15, pdfs: 13, updated: "منذ 4 أيام", icon: "🏗️", term: "الترم الثاني" },
                { name: "هندسة تدوير المخلفات الزراعية", prof: "قسم التخصص", lectures: 14, pdfs: 12, updated: "أمس", icon: "♻️", term: "الترم الثاني" },
                { name: "مشروع التخرج", prof: "هيئة التدريس", lectures: 20, pdfs: 15, updated: "اليوم", icon: "🎓", term: "الترم الثاني" }
            ]
        }
    }
};

const defaultSubjects = [
    { name: "مقررات عامة وتخصصية", prof: "هيئة التدريس", lectures: 12, pdfs: 10, updated: "محدث", icon: "📚", term: "الترم الأول" }
];