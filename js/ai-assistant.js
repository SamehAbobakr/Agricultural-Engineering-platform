// js/ai-assistant.js

const SMART_SERVICE_URL =
    "https://kegawnvzoimaddnziotv.supabase.co/functions/v1/smart-service";


class SubjectAIAssistant {

    constructor(subject, metadata = {}) {

        if (!subject) {

            console.error(
                "خطأ: لم يتم تمرير بيانات المادة إلى المساعد الذكي."
            );

            this.subject = {
                name: "مادة غير معروفة",
                content: {}
            };

        } else {

            this.subject = subject;

        }


        this.metadata = {

            grade:
                metadata.grade ||
                this.subject.grade ||
                "غير محدد",

            department:
                metadata.department ||
                this.subject.department ||
                "غير محدد",

            term:
                metadata.term ||
                this.subject.term ||
                "غير محدد"

        };

    }


    getSubjectContext() {

        return {

            name:
                this.subject.name ||
                "مادة غير محددة",

            grade:
                this.metadata.grade,

            department:
                this.metadata.department,

            term:
                this.metadata.term,

            lecturesCount:
                this.subject.lectures || 0,

            pdfsCount:
                this.subject.pdfs || 0,

            prof:
                this.subject.prof ||
                "غير متوفر",

            content:
                this.subject.content || {}

        };

    }


    renderAssistantUI() {

        const context =
            this.getSubjectContext();


        return `

            <div
                class="fade-in material-view"
                style="
                    margin-top: 15px;
                    margin-bottom: 20px;
                    direction: rtl;
                    text-align: right;
                    border: 1px solid var(--primary-color, #2e7d32);
                    background: var(--card-bg, #fff);
                "
            >

                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid var(--border-color, #eaeaea);
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                    "
                >

                    <h3
                        style="
                            margin: 0;
                            color: var(--primary-color);
                        "
                    >
                        المساعد الذكي لمادة:
                        ${context.name}
                    </h3>


                    <button
                        class="tab-btn"
                        onclick="closeAIAssistant()"
                        style="
                            padding: 4px 10px;
                            font-size: 12px;
                            cursor: pointer;
                        "
                    >
                        إغلاق
                    </button>

                </div>


                <p
                    class="card-info"
                    style="margin-bottom: 15px;"
                >
                    <strong>الفرقة:</strong>
                    ${context.grade}

                    |

                    <strong>القسم:</strong>
                    ${context.department}

                    |

                    <strong>الترم:</strong>
                    ${context.term}

                    |

                    <strong>المحاضرات:</strong>
                    ${context.lecturesCount}

                    |

                    <strong>الملفات:</strong>
                    ${context.pdfsCount}
                </p>



                </div>


                <div style="margin-bottom: 15px;">

                    <textarea
                        id="aiQueryInput"
                        class="inner-search"
                        placeholder="اكتب سؤالك أو استفسارك هنا..."
                        style="
                            width: 100%;
                            height: 90px;
                            padding: 10px;
                            resize: vertical;
                            border-radius: 6px;
                            box-sizing: border-box;
                        "
                    ></textarea>

                </div>


                <div
                    style="
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 15px;
                    "
                >

                    <button
                        class="tab-btn active"
                        onclick="triggerAIAssistantQuery()"
                        style="
                            padding: 8px 20px;
                            cursor: pointer;
                        "
                    >
                        إرسال
                    </button>

                </div>


                <div
                    id="aiResponseArea"
                    class="card"
                    style="
                        margin: 0;
                        background: var(--bg-color, #f9f9f9);
                        min-height: 80px;
                        border: 1px dashed var(--border-color, #ccc);
                    "
                >

                    <p
                        class="card-info"
                        style="
                            margin: 0;
                            text-align: center;
                        "
                    >
                        ستظهر إجابة المساعد الذكي هنا...
                    </p>

                </div>

            </div>

        `;

    }



    async processQuery(query) {

        const responseArea =
            document.getElementById("aiResponseArea");


        if (!responseArea) {

            return;

        }


        if (!query || !query.trim()) {

            responseArea.innerHTML = `

                <p
                    class="card-info"
                    style="
                        margin: 0;
                        text-align: center;
                        color: var(--secondary-color);
                    "
                >
                    الرجاء كتابة سؤال أولاً.
                </p>

            `;

            return;

        }


        responseArea.innerHTML = `

            <p
                class="card-info"
                style="
                    margin: 0;
                    text-align: center;
                    color: var(--primary-color);
                "
            >
                جاري معالجة السؤال...
            </p>

        `;


        const context =
            this.getSubjectContext();


        try {

            const response = await fetch(
                SMART_SERVICE_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`

                    },

                    body: JSON.stringify({

                        query:
                            query.trim(),

                        subjectContext: {

                            name:
                                context.name,

                            grade:
                                context.grade,

                            department:
                                context.department,

                            term:
                                context.term

                        }

                    })

                }
            );


            let data = {};

            try {

                data =
                    await response.json();

            } catch (jsonError) {

                data = {};

            }


            if (!response.ok) {

                throw new Error(

                    data.error ||
                    `فشل الاتصال بالخدمة. رمز الخطأ: ${response.status}`

                );

            }


            if (!data.answer) {

                throw new Error(
                    "لم يتم استلام إجابة من المساعد الذكي."
                );

            }


            responseArea.innerHTML = `

                <div
                    style="
                        padding: 15px;
                        direction: rtl;
                        text-align: right;
                    "
                >

                    <h3
                        style="
                            margin-top: 0;
                            font-size: 15px;
                            color: var(--primary-color);
                        "
                    >
                        إجابة المساعد الذكي
                    </h3>


                    <div
                        id="aiAnswerText"
                        style="
                            line-height: 1.9;
                            white-space: pre-wrap;
                        "
                    ></div>

                </div>

            `;


            const answerElement =
                document.getElementById("aiAnswerText");


            if (answerElement) {

                answerElement.textContent =
                    data.answer;

            }


        } catch (error) {

            console.error(
                "AI Assistant Error:",
                error
            );


            responseArea.innerHTML = `

                <div
                    style="
                        padding: 10px;
                        text-align: right;
                        direction: rtl;
                    "
                >

                    <h3
                        style="
                            margin-top: 0;
                            font-size: 15px;
                            color: var(--secondary-color);
                        "
                    >
                        حدث خطأ
                    </h3>


                    <p
                        id="aiErrorText"
                        class="card-info"
                        style="
                            margin: 0;
                            line-height: 1.7;
                        "
                    ></p>

                </div>

            `;


            const errorElement =
                document.getElementById("aiErrorText");


            if (errorElement) {

                errorElement.textContent =
                    error.message ||
                    "حدث خطأ غير معروف.";

            }

        }

    }

}


let aiAssistantInstance = null;

function openAIAssistant(subject) {

    aiAssistantInstance =
        new SubjectAIAssistant(subject);


    const aiArea =
        document.getElementById("aiAssistantArea");


    if (!aiArea) {

        console.error(
            "لم يتم العثور على aiAssistantArea"
        );

        return;

    }


    aiArea.innerHTML =
        aiAssistantInstance.renderAssistantUI();


    aiArea.style.display =
        "block";

}

function closeAIAssistant() {

    const aiArea =
        document.getElementById("aiAssistantArea");


    if (aiArea) {

        aiArea.innerHTML = "";

        aiArea.style.display =
            "none";

    }


    aiAssistantInstance =
        null;

}



function triggerAIAssistantQuery() {

    if (!aiAssistantInstance) {

        console.error(
            "المساعد الذكي غير مهيأ."
        );

        return;

    }


    const inputField =
        document.getElementById("aiQueryInput");


    if (!inputField) {

        console.error(
            "لم يتم العثور على حقل السؤال."
        );

        return;

    }


    const query =
        inputField.value.trim();


    aiAssistantInstance.processQuery(
        query
    );

}

