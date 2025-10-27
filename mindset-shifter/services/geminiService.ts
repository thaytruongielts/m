import { GoogleGenAI, Type } from "@google/genai";
import type { TransformedBeliefs } from "../types";

const beliefSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The empowering belief in English." },
    tense: { type: Type.STRING, description: "The English tense used." },
    translation: { type: Type.STRING, description: "A Vietnamese translation of the English belief text." }
  },
  required: ["text", "tense", "translation"]
};

const transformedBeliefsSchema = {
  type: Type.OBJECT,
  properties: {
    logic: {
      type: Type.ARRAY,
      description: "Exactly 5 beliefs related to the Logic Brain.",
      items: beliefSchema
    },
    emotion: {
      type: Type.ARRAY,
      description: "Exactly 5 beliefs related to the Emotion Brain.",
      items: beliefSchema
    },
    animal: {
      type: Type.ARRAY,
      description: "Exactly 5 beliefs related to the Animal Brain (instinct, action).",
      items: beliefSchema
    },
  },
  required: ["logic", "emotion", "animal"]
};


export async function transformBelief(limitingBelief: string): Promise<TransformedBeliefs> {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mocked data.");
    return new Promise(resolve => setTimeout(() => resolve({
      logic: [
        { text: "My father served in the army, the largest-scale organization in Vietnam, which means I have inherited a blueprint for large-scale success.", tense: "Present Simple", translation: "Bố tôi phục vụ trong quân đội, tổ chức quy mô lớn nhất Việt Nam, điều đó có nghĩa là tôi đã thừa hưởng một khuôn mẫu cho sự thành công quy mô lớn." },
        { text: "Large scale is simply many people sharing a common direction; my powerful vision will attract many to join me.", tense: "Future Simple", translation: "Quy mô lớn chỉ đơn giản là nhiều người cùng chung một định hướng; tầm nhìn mạnh mẽ của tôi sẽ thu hút nhiều người tham gia cùng tôi." },
        { text: "I have been observing scalable systems my whole life through my father's experience.", tense: "Present Perfect Continuous", translation: "Tôi đã quan sát các hệ thống có thể mở rộng suốt cuộc đời mình qua kinh nghiệm của bố tôi." },
        { text: "I had already understood the principles of hierarchy and structure before I even started my business.", tense: "Past Perfect", translation: "Tôi đã hiểu các nguyên tắc về hệ thống cấp bậc và cấu trúc trước cả khi tôi bắt đầu kinh doanh." },
        { text: "By this time next year, I will have been leading a large-scale organization for a significant period.", tense: "Future Perfect Continuous", translation: "Vào thời điểm này năm sau, tôi sẽ đã đang lãnh đạo một tổ chức quy mô lớn được một thời gian đáng kể." }
      ],
      emotion: [
        { text: "My father's immense love for the army inspires my immense love for large-scale endeavors.", tense: "Present Simple", translation: "Tình yêu bao la của bố tôi dành cho quân đội truyền cảm hứng cho tình yêu bao la của tôi đối với những nỗ lực quy mô lớn." },
        { text: "I am feeling a deep connection to my father's legacy of discipline and commitment.", tense: "Present Continuous", translation: "Tôi đang cảm thấy một sự kết nối sâu sắc với di sản kỷ luật và cam kết của bố tôi." },
        { text: "I was always proud of my father's role, and now I channel that pride into my own large-scale projects.", tense: "Past Simple", translation: "Tôi đã luôn tự hào về vai trò của bố tôi, và bây giờ tôi chuyển niềm tự hào đó vào các dự án quy mô lớn của riêng mình." },
        { text: "Seeing my father's dedication gave me the passion I need to build something of a massive scale.", tense: "Past Simple", translation: "Việc chứng kiến sự cống hiến của bố đã cho tôi niềm đam mê cần thiết để xây dựng một thứ gì đó ở quy mô lớn." },
        { text: "I will feel immensely fulfilled when my team achieves its large-scale goals.", tense: "Future Simple", translation: "Tôi sẽ cảm thấy vô cùng mãn nguyện khi đội của mình đạt được các mục tiêu quy mô lớn." }
      ],
      animal: [
        { text: "I am scaling my operations daily; it is an action, a verb.", tense: "Present Continuous", translation: "Tôi đang mở rộng quy mô hoạt động của mình hàng ngày; đó là một hành động, một động từ." },
        { text: "I scaled my ambitions yesterday, and I am scaling them again today.", tense: "Past Simple & Present Continuous", translation: "Tôi đã mở rộng quy mô tham vọng của mình ngày hôm qua, và tôi lại đang mở rộng chúng ngày hôm nay." },
        { text: "I was constantly taking small, scalable actions while I planned my big move.", tense: "Past Continuous", translation: "Tôi đã liên tục thực hiện những hành động nhỏ có thể mở rộng trong khi tôi lên kế hoạch cho bước đi lớn của mình." },
        { text: "Scaling is my instinct; it is what I do.", tense: "Present Simple", translation: "Mở rộng quy mô là bản năng của tôi; đó là việc tôi làm." },
        { text: "I will be executing scalable strategies all day tomorrow.", tense: "Future Continuous", translation: "Tôi sẽ thực thi các chiến lược có thể mở rộng suốt cả ngày mai." }
      ]
    }), 1500));
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: `Based on the user's limiting belief, generate 15 empowering beliefs for large-scale growth.

**User's Limiting Belief:** "${limitingBelief}"

**Instructions:**
1.  **Analyze and Reuse Keywords:** Identify key nouns, verbs, and concepts from the user's belief (e.g., "bố tôi", "quân đội"). Weave these exact words or concepts into the new beliefs to make them personal and resonant.
2.  **Framework:** Generate exactly 15 beliefs, distributed as follows:
    *   **5 for the Logic Brain:** Reframe the situation logically. Find evidence in the limiting belief that actually supports large-scale success. Example: "Large scale is just many people with a common direction..."
    *   **5 for the Emotion Brain:** Connect the emotions from the original belief to the new, desired outcome. Example: "My father loved the army, therefore I love large scale."
    *   **5 for the Animal Brain:** Focus on instinct, action, and simple, repeatable behaviors. Frame "scaling" as a verb, an action. Example: "I am scaling daily."
3.  **Use 12 English Tenses:** Spread a variety of English tenses across the 15 beliefs to create a comprehensive mindset shift across time (past, present, future). Label each belief with the primary tense used (e.g., "Present Simple", "Past Perfect", "Future Continuous").
4.  **Translate:** Provide a Vietnamese translation for each English belief.
5.  **Output Format:** Return the result in the specified JSON format.
`,
    config: {
      systemInstruction: "You are a world-class mindset coach. You transform limiting beliefs into empowering ones using a specific framework involving 3 'brains' (Logic, Emotion, Animal) and the 12 English tenses. Your new beliefs must be positive, actionable, and directly counter the user's original statement by cleverly re-using their own words. You must also provide a Vietnamese translation for every belief.",
      responseMimeType: "application/json",
      responseSchema: transformedBeliefsSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as TransformedBeliefs;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", jsonText);
    throw new Error("The AI returned an invalid response format.");
  }
}