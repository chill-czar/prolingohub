"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/axios";

const CATEGORY_OPTIONS = [
  { value: "VOCABULARY", label: "Vocabulary" },
  { value: "GRAMMAR", label: "Grammar" },
  { value: "SPEAKING", label: "Speaking" },
];

export default function QuestionsTab() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/admin/questions");
      setQuestions(response.data.data);
    } catch (err) {
      setError(err.userMessage || "Failed to fetch questions");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.category || !formData.question || !formData.correctAnswer) {
      setError("Please fill in all required fields");
      return;
    }

    // Filter out empty options
    const filteredOptions = formData.options.filter((opt) => opt.trim() !== "");

    if (filteredOptions.length === 0) {
      setError("Please provide at least one option");
      return;
    }

    try {
      const submitData = {
        ...formData,
        options: filteredOptions,
      };

      if (editingQuestion) {
        await adminApi.put(
          `/api/admin/questions/${editingQuestion._id}`,
          submitData,
        );
      } else {
        await adminApi.post("/api/admin/questions", submitData);
      }

      await fetchQuestions();
      setShowDialog(false);
      resetForm();
    } catch (err) {
      setError(err.userMessage || "Failed to save question");
      console.error("Error saving question:", err);
    }
  };

  const handleDelete = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await adminApi.delete(`/api/admin/questions/${questionId}`);
      await fetchQuestions();
    } catch (err) {
      setError(err.userMessage || "Failed to delete question");
      console.error("Error deleting question:", err);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      category: question.category,
      question: question.question,
      options: [...question.options, "", "", "", ""].slice(0, 4), // Pad to 4 options
      correctAnswer: question.correctAnswer,
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      category: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setEditingQuestion(null);
    setError("");
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading questions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Questions Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage assessment questions by category
              </p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      placeholder="Enter the question text"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <Input
                          key={index}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Select
                      value={
                        formData.correctAnswer
                          ? formData.options
                              .findIndex(
                                (opt) => opt === formData.correctAnswer,
                              )
                              .toString()
                          : ""
                      }
                      onValueChange={(value) => {
                        const selectedIndex = parseInt(value);
                        const selectedOption = formData.options[selectedIndex];
                        setFormData({
                          ...formData,
                          correctAnswer: selectedOption,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.options
                          .filter((opt) => opt.trim() !== "")
                          .map((option, index) => (
                            <SelectItem
                              key={`option-${index}`}
                              value={index.toString()}
                            >
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingQuestion ? "Update" : "Create"} Question
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && !showDialog && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No questions found. Add your first question!
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell>
                        <Badge variant="secondary">{question.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={question.question}>
                          {question.question}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.options.slice(0, 2).map((option, index) => (
                            <Badge
                              key={index}
                              variant={
                                option === question.correctAnswer
                                  ? "default"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {option.length > 10
                                ? `${option.substring(0, 10)}...`
                                : option}
                            </Badge>
                          ))}
                          {question.options.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{question.options.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-xs">
                          {question.correctAnswer.length > 15
                            ? `${question.correctAnswer.substring(0, 15)}...`
                            : question.correctAnswer}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(question._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
