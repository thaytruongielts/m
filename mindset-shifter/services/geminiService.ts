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

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
