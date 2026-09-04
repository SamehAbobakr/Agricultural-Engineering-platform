// =========================================
// إنشاء عميل Supabase
// =========================================

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================================
// جلب المواد الدراسية حسب المسار الحالي
// (البرنامج / الفرقة / الترم / القسم)
// =========================================

async function loadSubjectsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('subjects')
            .select('*')
            .ilike('program', `%${currentProgram.trim()}%`)
            .ilike('grade', `%${currentGrade.trim()}%`)
            .ilike('term', `%${currentTerm.trim()}%`)
            .ilike('department', `%${currentDept.trim()}%`)
            .limit(30);

        if (error) throw error;

        return data || [];

    } catch (error) {
        console.error("❌ خطأ في جلب المواد من Supabase:", error);
        return [];
    }
}
