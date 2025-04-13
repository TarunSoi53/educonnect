import { GoogleGenAI } from "@google/genai";
import util from 'util';
import Quiz from '../models/Quizz/quizModel.js';
import QuizQuestion from '../models/Quizz/QuizQuestionModel.js';
import Subject from '../models/Subject/SubjectModel.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateQuizForTopic = async (topicName, topicId,teacherId,subjectId,) => {
  console.log(teacherId);
  try {
    const prompt = `You are an experienced and dedicated teacher who has just finished teaching a comprehensive lesson on **[${topicName}]** to your class. To assess their understanding of the material, you need to create a multiple-choice quiz.

Your task is to generate a JSON object containing **exactly 20** multiple-choice questions related to **[${topicName}]**. It is crucial that the generated quiz contains no fewer than 20 and no more than 20 questions. Each question must have four distinct answer choices, labeled 'a', 'b', 'c', and 'd'. For each question, you must also clearly indicate the correct answer using the corresponding label.

The JSON object should adhere strictly to the following format:

{
  "topic": "${topicName}",
  "questions": [
    {
      "questionNo": 1,
      "question": "[Question 1 Text]",
      "options": {
        "a": "[Option A for Question 1]",
        "b": "[Option B for Question 1]",
        "c": "[Option C for Question 1]",
        "d": "[Option D for Question 1]"
      },
      "answer": "[Correct Answer Label - a, b, c, or d]"
    },
    // ... (Continue for exactly 20 questions)
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const jsonString = response.text.replace(/^```json\s*|\s*```$/g, '');
    const quizData = JSON.parse(jsonString);

    // Create the quiz
    const subjects = await Subject.find({ _id: subjectId })
   
    console.log("subjects here",subjects)
    console.log("department id is :", subjects[0]?.department)
    console.log("section id is :",subjects[0]?.section)
     

    console.log("subjects",subjects)
    const quiz = new Quiz({
      title: `Quiz for ${topicName}`,
      description: `Automatically generated quiz for ${topicName}`,
      department:subjects[0]?.department,
      section:subjects[0]?.section,
      topic: topicId,
      teacherId:teacherId,
      status: 'pending',
      
    });
    console.log("quiz",quiz)

    const savedQuiz = await quiz.save();

    // Create quiz questions
    const questions = quizData.questions.map((q, index) => ({
      quizId: savedQuiz._id,
      question: q.question,
      options: [q.options.a, q.options.b, q.options.c, q.options.d],
      correctAnswer: q.answer,
      questionNo: index + 1
    }));

    await QuizQuestion.insertMany(questions);

    return savedQuiz._id;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}; 