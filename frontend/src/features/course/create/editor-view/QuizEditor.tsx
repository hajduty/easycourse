import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Question, QuestionType } from "@/types/section"
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface QuizEditorProps {
  quizData: Question[];
  onSave: (updatedQuiz: Question[]) => void;
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

export const QuizEditor = ({ quizData, onSave, saveStatus }: QuizEditorProps) => {
  const [questions, setQuestions] = useState<Question[]>(quizData || []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const updateQuestion = (id: string, updater: (q: Question) => Question) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? updater(q) : q))
    );
  };

  const addQuestion = (type: QuestionType = "multiple-choice") => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      questionText: "",
      options: type !== "short-answer" ? [] : undefined,
      correctAnswer: type === "short-answer" ? "" : undefined,
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestionText = (id: string, text: string) => {
    updateQuestion(id, q => ({ ...q, questionText: text }));
  };

  const updateShortAnswer = (id: string, answer: string) => {
    updateQuestion(id, q => ({ ...q, correctAnswer: answer }));
  };

  const addOption = (qId: string) => {
    updateQuestion(qId, q => ({
      ...q,
      options: [
        ...(q.options || []),
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
    }));
  };

  const removeOption = (qId: string, optionId: string) => {
    updateQuestion(qId, q => ({
      ...q,
      options: q.options?.filter(o => o.id !== optionId),
    }));
  };

  const updateOptionText = (qId: string, optionId: string, text: string) => {
    updateQuestion(qId, q => ({
      ...q,
      options: q.options?.map(o => (o.id === optionId ? { ...o, text } : o)),
    }));
  };

  const toggleOptionCorrect = (qId: string, optionId: string) => {
    updateQuestion(qId, q => ({
      ...q,
      options: q.options?.map(o =>
        o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
      ),
    }));
  };

  const handleSave = () => {
    onSave(questions);
    console.log(questions);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      setShowTop(!atTop);
      setShowBottom(!atBottom);
    };

    update();
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, [questions]);

  return (
    <div className="flex flex-col pt-6 p-2 w-full h-full gap-4 text-white overflow-clip">
      <h1 className="">Add question</h1>
      <div className="flex gap-2 flex-wrap text-lg">
        <Button size="sm" onClick={() => addQuestion("multiple-choice")} variant={'outline'} className="text-xs w-full">
          <p>+ Multiple Choice</p>
        </Button>
        <Button size="sm" onClick={() => addQuestion("short-answer")} variant={'outline'} className="text-xs w-full">
          <p>+ Short Answer</p>
        </Button>
      </div>

      <h1 className="pt-4">Questions</h1>
      <div className="relative md:max-h-[620px] max-h-[350px] w-full">
        <div className={`absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-background to-transparent pointer-events-none 
            z-10 transition-opacity ease-out duration-300 ${showTop ? "opacity-100" : "opacity-0"}`}
        />
        <div ref={scrollRef} className="flex flex-col gap-2 md:max-h-[620px] max-h-[350px] overflow-y-scroll scrollbar-hide w-full">
          {questions.map(question => (
            <div key={question.id} className="border rounded-md bg-neutral-950">
              <div className="relative w-full">
                <Input
                  placeholder="Question text..."
                  value={question.questionText}
                  onChange={e => updateQuestionText(question.id, e.target.value)}
                  className="pr-10 rounded-none rounded-t"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeQuestion(question.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              {question.type !== "short-answer" && question.options && (
                <div className="flex flex-col">
                  {question.options.map(option => (
                    <div key={option.id} className="flex items-center ml-2">
                      <Checkbox
                        checked={option.isCorrect || false}
                        onCheckedChange={() => toggleOptionCorrect(question.id, option.id)}
                        className="-ml-1"
                      />
                      <div className="relative w-full ml-1">
                        <Input
                          placeholder="Option text..."
                          value={option.text}
                          onChange={e => updateOptionText(question.id, option.id, e.target.value)}
                          className="rounded-none"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeOption(question.id, option.id)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-none"
                        >
                          <Trash2 className="w-4 h-4 text-red-300" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full rounded-none rounded-b" onClick={() => addOption(question.id)}>
                    + Add Option
                  </Button>
                </div>
              )}

              {question.type === "short-answer" && (
                <Input
                  placeholder="Correct answer"
                  value={question.correctAnswer || ""}
                  onChange={e => updateShortAnswer(question.id, e.target.value)}
                  className="rounded-none rounded-b"
                />
              )}
            </div>

          ))}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent 
          pointer-events-none z-10 transition-opacity ease-out duration-300 ${showBottom ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="mt-auto">
        <Button
          size="sm"
          onClick={() => handleSave()}
          className={`
            "w-full cursor-pointer active:bg-neutral-500 transition-colors
            ${saveStatus === "saved" && "bg-emerald-500 hover:bg-emerald-600"}
            `}
        >
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
};
