async function loadSubjectsFromSupabase() {
    try {
        console.log("========== LOAD SUBJECTS ==========");
        console.log("🎓 Grade:", currentGrade);
        console.log("🏢 Department:", currentDept);
        console.log("📖 Term:", currentTerm);

        const { data, error } = await supabaseClient
            .from('subjects')
            .select('*')
            .ilike('grade', `%${currentGrade.trim()}%`)
            .ilike('term', `%${currentTerm.trim()}%`)
            .ilike('department', `%${currentDept.trim()}%`)
            .limit(30);

        if (error) throw error;

        console.log("📘 المواد المسترجعة من Supabase:", data);

        return data || [];

    } catch (error) {
        console.error("❌ خطأ في جلب المواد من Supabase:", error);
        return [];
    }
}
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