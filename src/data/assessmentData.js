export const assessmentData = {
  grammar: {
    id: "grammar",
    title: "Grammar Test",
    description: "Evaluate your understanding of english grammar rules.",
    questions: [
      {
        id: 1,
        type: "fill-in-blank",
        question: "The cat is sitting ___ the table.",
        options: ["on", "in", "at", "under"],
        correctAnswer: "on",
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "Which sentence is correct?",
        options: [
          "She don't like apples.",
          "She doesn't like apples.",
          "She not like apples.",
          "She no like apples.",
        ],
        correctAnswer: "She doesn't like apples.",
      },
      {
        id: 3,
        type: "fill-in-blank",
        question: "I ___ to the store yesterday.",
        options: ["go", "gone", "went", "going"],
        correctAnswer: "went",
      },
    ],
  },
  vocabulary: {
    id: "vocabulary",
    title: "Vocabulary Test",
    description: "Measure the breadth and depth of your vocabulary.",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Select the synonym for 'Happy'.",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correctAnswer: "Joyful",
      },
      {
        id: 2,
        type: "fill-in-blank",
        question: "A person who paints is called a ___.",
        options: ["Painter", "Doctor", "Teacher", "Driver"],
        correctAnswer: "Painter",
      },
    ],
  },
  speaking: {
    id: "speaking",
    title: "Speaking Ability Test",
    description: "Test your pronunciation, fluency, and coherence.",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question:
          "You meet someone new. What is the correct way to start a conversation?",
        options: [
          "tell me your name.",
          "what is your problem?",
          "hi, i'm ____, nice to meet you.",
          "why are you here?",
        ],
        correctAnswer: "hi, i'm ____, nice to meet you.",
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "How do you ask for directions politely?",
        options: [
          "Where is the bank?",
          "Tell me where the bank is.",
          "Excuse me, could you tell me where the bank is?",
          "I want the bank.",
        ],
        correctAnswer: "Excuse me, could you tell me where the bank is?",
      },
    ],
  },
};
