import React, { useState } from "react";
import { BookOpen, Type, Mic } from "lucide-react";

const AssessmentSelection = ({ onStart }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleSelection = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleStart = () => {
    if (selectedTypes.length > 0) {
      onStart(selectedTypes);
    }
  };

  const options = [
    {
      id: "grammar",
      title: "Grammar Test",
      description: "Evaluate your understanding of english grammar rules.",
      icon: <BookOpen className="w-6 h-6 text-redy" />,
    },
    {
      id: "vocabulary",
      title: "Vocabulary Test",
      description: "Measure the breadth and depth of your vocabulary.",
      icon: <Type className="w-6 h-6 text-redy" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto px-4">
      <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-center">
        Complete English Skill Assessment
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Choose a test to start your assessment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => toggleSelection(option.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4 h-full
              ${
                selectedTypes.includes(option.id)
                  ? "border-red-200 shadow-[0_0_15px_rgba(220,38,38,0.1)] bg-whitey"
                  : "border-gray-100 hover:border-gray-200 bg-whitey"
              }`}
          >
            <div className="p-2 bg-red-50 rounded-lg">{option.icon}</div>
            <div>
              <h3 className="text-lg font-bold mb-2">{option.title}</h3>
              <p className="text-sm text-gray-500 leading-tight">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end w-full mb-8 md:mb-0">
        <button
          onClick={handleStart}
          disabled={selectedTypes.length === 0}
          className={`px-8 py-3 w-full md:w-auto cursor-pointer rounded-md font-semibold transition-colors
            ${
              selectedTypes.length > 0
                ? "bg-redy text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default AssessmentSelection;
