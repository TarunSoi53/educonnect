import { GoogleGenAI } from "@google/genai";
import util from 'util';

const ai = new GoogleGenAI({ apiKey: "AIzaSyBF1vtAJdQ4hU53Bc0KsyMNROvSdX-2WPQ" });
let topicName="watercycle"
const prompt=`You are an experienced and dedicated teacher who has just finished teaching a comprehensive lesson on **[${topicName}]** to your class. To assess their understanding of the material, you need to create a multiple-choice quiz.

Your task is to generate a JSON object containing **exactly 20** multiple-choice questions related to **[Insert Specific Topic Here]**.  It is crucial that the generated quiz contains no fewer than 20 and no more than 20 questions. Each question must have four distinct answer choices, labeled 'a', 'b', 'c', and 'd'.  For each question, you must also clearly indicate the correct answer using the corresponding label.

The JSON object should adhere strictly to the following format:


{
  "topic": "[Insert Specific Topic Here]",
  "questions": [
    {
 "questionNo": "question no"
      "question": "[Question 1 Text]",
      "options": {
        "a": "[Option A for Question 1]",
        "b": "[Option B for Question 1]",
        "c": "[Option C for Question 1]",
        "d": "[Option D for Question 1]"
      },
      "answer": "[Correct Answer Label - a, b, c, or d]"
    },
    {
 "questionNo": "question no"
      "question": "[Question 2 Text]",
      "options": {
        "a": "[Option A for Question 2]",
        "b": "[Option B for Question 2]",
        "c": "[Option C for Question 2]",
        "d": "[Option D for Question 2]"
      },
      "answer": "[Correct Answer Label - a, b, c, or d]"
    },
    // ... (Continue for exactly 20 questions)
  ]
} `

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:prompt,
  });
  console.log(response.text);

  const jsonString = response.text.replace(/^```json\s*|\s*```$/g, '');

  // Parse the cleaned JSON string
  const data = JSON.parse(jsonString);
const newData= util.inspect(data, { depth: null, colors: true })
console.log(newData)

  
}

await main();