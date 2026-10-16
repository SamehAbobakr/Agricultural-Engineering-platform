export const INITIAL_DATA = {
    version: 4,
    theme: null, // null = يتبع إعداد الجهاز
    userProfile: {
        studentName: 'طالب هندسة زراعية',
        academicYear: '3',
        academicTerm: '2',
        gpa: '',
        quote: 'استعن بالله ولا تعجز.. كل خطوة تقربك من هدفك.',
        quickNotes: ''
    },
    progress: {}, // { [subjectId]: { totalFiles, reviewedFiles, link } }
    goals: []
};
