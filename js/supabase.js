const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from('subjects')
        .select('*')
        .limit(5);

    if (error) {
        console.error('❌ Supabase Error:', error);
        return;
    }

    //console.log('✅ Supabase Connected:', data);
}

testSupabaseConnection();


async function loadSubjectsFromSupabase() {
    try {
        console.log("========== LOAD SUBJECTS ==========");
        console.log("🌿 Program:", currentProgram);
        console.log("🎓 Grade:", currentGrade);
        console.log("🏢 Department:", currentDept);
        console.log("📖 Term:", currentTerm);

        const { data, error } = await supabaseClient
            .from('subjects')
            .select('*')
            .ilike('program', `%${currentProgram.trim()}%`)
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