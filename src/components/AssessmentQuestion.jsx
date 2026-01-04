import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const AssessmentQuestion = ({
  data,
  onNext,
  onSkip,
  totalQuestions,
  completedQuestionsCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = data.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsAnswered(true);
  };

  const handleNext = () => {
    const score = selectedOption === currentQuestion.correctAnswer ? 1 : 0;

    if (isLastQuestion) {
      onNext(score, true); // true indicates section complete
    } else {
      onNext(score, false);
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      onSkip(true);
    } else {
      onSkip(false);
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  // Calculate global progress
  // "completedQuestionsCount" covers previous sections
  // "currentQuestionIndex" is how many we've passed in this section (0-indexed)
  // We add 1 to show "current position" progress, so 1st question isn't 0%
  const currentGlobalQuestion =
    completedQuestionsCount + currentQuestionIndex + 1;
  const progressPercentage = (currentGlobalQuestion / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 flex flex-col h-full py-6">
      {/* Progress Bar */}
      <div className="shrink-0 mt-4">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-redy transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Phase: {data.title}</p>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center my-6">
        <div className="bg-whitey rounded-xl border border-red-100 p-6 md:p-8 shadow-sm w-full">
          <p className="text-gray-500 mb-4">
            Question {currentQuestionIndex + 1} Of {data.questions.length}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight hidden md:block">
            {currentQuestion.type === "fill-in-blank"
              ? "Choose the correct word to fill in the blank."
              : "Select the Correct Choice"}
          </h2>

          {currentQuestion.type === "fill-in-blank" && (
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 text-center text-lg font-medium">
              {currentQuestion.question}
            </div>
          )}
          {currentQuestion.type === "multiple-choice" && (
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 text-center text-lg font-medium">
              {currentQuestion.question}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === option;
              // eslint-disable-next-line no-unused-vars
              const isCorrect = option === currentQuestion.correctAnswer;

              let buttonStyle = "border-gray-200 hover:border-gray-300";
              if (isAnswered) {
                if (isSelected) {
                  buttonStyle = "bg-red-50 border-red-200 text-black";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`p-4 rounded-lg border text-left transition-all relative flex items-center justify-between ${buttonStyle}`}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-redy" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 pt-4 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            onClick={handleSkip}
            className="px-8 py-2 w-full md:w-auto rounded-md border border-red-200 text-redy font-medium hover:bg-red-50 transition-colors cursor-pointer text-center"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-8 py-2 w-full md:w-auto cursor-pointer rounded-md font-medium transition-colors text-center ${
              isAnswered
                ? "bg-redy text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLastQuestion ? "Finish Section" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestion;
