"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Assessment from "@/components/Assessment";
import AssessmentSelection from "@/components/AssessmentSelection";
import AssessmentQuestion from "@/components/AssessmentQuestion";
import AssessmentResult from "@/components/AssessmentResult";

const AssessmentScreen = () => {
    const [step, setStep] = useState("intro");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
    const [scores, setScores] = useState({});
    const [assessmentData, setAssessmentData] = useState(null);
    const [noQuestions, setNoQuestions] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/questions");
                const response = await res.json();

                if (response.success && response.data.length > 0) {
                    const transformedData = {};

                    response.data.forEach((question, index) => {
                        const category = question.category.toLowerCase();

                        if (!transformedData[category]) {
                            transformedData[category] = {
                                id: category,
                                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Test`,
                                description: `Test your ${category} skills.`,
                                questions: [],
                            };
                        }

                        transformedData[category].questions.push({
                            id: index + 1,
                            type: "multiple-choice",
                            question: question.question,
                            options: question.options,
                            correctAnswer: question.correctAnswer,
                        });
                    });

                    setAssessmentData(transformedData);
                    setNoQuestions(false);
                } else {
                    setNoQuestions(true);
                    setAssessmentData(null);
                }
            } catch (error) {
                console.error("Failed to load assessment data", error);
                setNoQuestions(true);
            }
        };

        fetchData();
    }, []);

    const handleStartAssessment = () => setStep("selection");

    const handleSelectionComplete = (types) => {
        setSelectedTypes(types);
        setCurrentTypeIndex(0);
        setScores({});
        setStep("question");
    };

    const handleQuestionComplete = (score, isSectionComplete) => {
        const currentType = selectedTypes[currentTypeIndex];

        if (!assessmentData[currentType]) return;

        setScores((prev) => ({
            ...prev,
            [currentType]: {
                title: assessmentData[currentType].title,
                score: (prev[currentType]?.score || 0) + score,
                total: assessmentData[currentType].questions.length,
            },
        }));

        if (isSectionComplete) {
            if (currentTypeIndex < selectedTypes.length - 1) {
                setCurrentTypeIndex((prev) => prev + 1);
            } else {
                setStep("result");
            }
        }
    };

    const handleSkip = (isSectionComplete) => {
        const currentType = selectedTypes[currentTypeIndex];

        if (assessmentData && assessmentData[currentType]) {
            setScores((prev) => {
                if (prev[currentType]) return prev;
                return {
                    ...prev,
                    [currentType]: {
                        title: assessmentData[currentType].title,
                        score: 0,
                        total: assessmentData[currentType].questions.length,
                    },
                };
            });
        }

        if (isSectionComplete) {
            if (currentTypeIndex < selectedTypes.length - 1) {
                setCurrentTypeIndex((prev) => prev + 1);
            } else {
                setStep("result");
            }
        }
    };

    const handleRetake = () => {
        setStep("selection");
        setSelectedTypes([]);
        setCurrentTypeIndex(0);
        setScores({});
    };

    const handleJoinWorkshop = () => router.push("/courses");

    // ---- EMPTY STATES ----

    if (noQuestions) {
        return (
            <div className="flex h-screen items-center justify-center text-center px-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">
                        No questions available 😕
                    </h2>
                    <p className="text-gray-500 mb-4">
                        There are currently no assessment questions added.
                    </p>
                    <button
                        onClick={handleJoinWorkshop}
                        className="px-4 py-2 bg-redy text-white rounded-lg"
                    >
                        Explore Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!assessmentData) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    // ---- SAFE PROGRESS ----

    const totalQuestions = selectedTypes.reduce((acc, type) => {
        const section = assessmentData[type];
        if (!section || !Array.isArray(section.questions)) return acc;
        return acc + section.questions.length;
    }, 0);

    const currentType = selectedTypes[currentTypeIndex] || null;

    const completedQuestionsCount = selectedTypes
        .slice(0, currentTypeIndex)
        .reduce((acc, type) => {
            const section = assessmentData[type];
            if (!section || !Array.isArray(section.questions)) return acc;
            return acc + section.questions.length;
        }, 0);

    return (
        <div className="w-full h-dvh overflow-hidden font-[dm_mono] selection:bg-redy selection:text-whitey bg-whitey flex flex-col uppercase">
            <div className="flex-1 overflow-y-auto">
                {step === "intro" && (
                    <Assessment
                        onStart={handleStartAssessment}
                        onJoinWorkshop={handleJoinWorkshop}
                    />
                )}

                {step === "selection" && (
                    <AssessmentSelection onStart={handleSelectionComplete} />
                )}

                {step === "question" &&
                    currentType &&
                    assessmentData[currentType] &&
                    assessmentData[currentType].questions.length > 0 && (
                        <AssessmentQuestion
                            key={currentType}
                            data={assessmentData[currentType]}
                            onNext={handleQuestionComplete}
                            onSkip={handleSkip}
                            totalQuestions={totalQuestions}
                            completedQuestionsCount={completedQuestionsCount}
                        />
                    )}

                {step === "question" &&
                    currentType &&
                    (!assessmentData[currentType] ||
                        assessmentData[currentType].questions.length === 0) && (
                        <div className="flex h-full w-full flex-col items-center justify-center text-center px-6">
                            <div className="max-w-md">
                                <h2 className="text-3xl font-bold text-redy mb-4">
                                    Under Maintenance
                                </h2>
                                <p className="text-gray-500 mb-8 text-lg">
                                    The {currentType} section is currently being
                                    updated.
                                </p>
                                <button
                                    onClick={() =>{currentTypeIndex < selectedTypes.length - 1 ? handleSkip(true) : router.push("/courses")}}
                                    className="px-6 py-3 bg-redy text-whitey rounded-lg font-bold hover:bg-red-600 transition-colors uppercase tracking-widest cursor-pointer"
                                >
                                    {currentTypeIndex < selectedTypes.length - 1
                                        ? "Next Section"
                                        : "checkout courses"}
                                </button>
                            </div>
                        </div>
                    )}

                {step === "result" && (
                    <AssessmentResult
                        scores={scores}
                        onRetake={handleRetake}
                        onJoinWorkshop={handleJoinWorkshop}
                    />
                )}
            </div>
        </div>
    );
};

export default AssessmentScreen;
