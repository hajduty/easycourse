import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Question } from "@/types/section";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useUpdateParticipant } from "../hooks/participant/useUpdateParticipant";
import { useParticipantInfo } from "../hooks/participant/useGetParticipant";
import { useAuth } from "@/providers/AuthProvider";

interface QuizViewProps {
  quizData: Question[];
}

export const QuizView = ({ quizData }: QuizViewProps) => {
  const { sectionId, courseId } = useParams<{ sectionId: string; courseId: string }>();
  const { user } = useAuth();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const updateParticipant = useUpdateParticipant();
  const participantInfo = useParticipantInfo(courseId!, user?.id!);

  const toggleOption = (qId: string, optionId: string) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [qId]: current.filter((id: string) => id !== optionId) };
      }
      return { ...prev, [qId]: [...current, optionId] };
    });
  };

  const setShortAnswer = (qId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const evaluateQuiz = () => {
    let total = 0;

    quizData.forEach(q => {
      if (q.type !== "short-answer" && q.options) {
        const correctIds = q.options.filter(o => o.isCorrect).map(o => o.id);
        const userIds = answers[q.id] || [];

        const correct =
          correctIds.length === userIds.length &&
          correctIds.every(id => userIds.includes(id));

        if (correct) total += 1;
      }

      if (q.type === "short-answer") {
        const correctAnswer = q.correctAnswer?.trim().toLowerCase();
        const userAnswer = (answers[q.id] || "").trim().toLowerCase();

        if (correctAnswer && userAnswer === correctAnswer) total += 1;
      }
    });

    setScore(total);
    setSubmitted(true);

    if (total === quizData.length) {
      const currentCompletedSections = participantInfo.data?.data.completedSectionIds || [];

      const newCompletedSections = currentCompletedSections.includes(sectionId!)
        ? currentCompletedSections
        : [...currentCompletedSections, sectionId!];

      updateParticipant.mutate({
        courseId: courseId!,
        userId: user?.id!,
        participantInfo: {
          ...participantInfo.data?.data!,
          completedSectionIds: newCompletedSections,
          lastCompletedSectionId: sectionId!,
        },
      });
    }
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
  }, []);

  return (
    <div className="flex flex-col p-4 gap-4 text-white w-full h-full">
      <h2 className="text-xl font-semibold hidden xl:block">Quiz</h2>

      <div className="relative flex-1 md:max-h-[620px] max-h-[350px] w-full overflow-clip">
        <div className={`absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-background to-transparent pointer-events-none 
            z-10 transition-opacity ease-out duration-300 ${showTop ? "opacity-100" : "opacity-0"}`}
        />
        <div
          ref={scrollRef}
          className="flex flex-col gap-2 md:max-h-[620px] max-h-[350px] overflow-y-scroll scrollbar-hide w-full pr-2"
        >
          {quizData.map((question, index) => {
            const userAnswer = answers[question.id];
            // WTFF
            // TODO: verify questions in backend
            const isCorrect = submitted
              ? question.type === "short-answer"
                ? userAnswer?.trim().toLowerCase() ===
                question.correctAnswer?.trim().toLowerCase()
                : question.options
                  ?.filter(o => o.isCorrect)
                  .map(o => o.id)
                  .every(id => userAnswer?.includes(id)) &&
                userAnswer?.length ===
                question.options.filter(o => o.isCorrect).length
              : null;

            return (
              <div
                key={question.id}
                className="border rounded-md p-4 bg-stone-950 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {index + 1}. {question.questionText}
                  </p>

                  {submitted && (
                    <span
                      className={
                        isCorrect ? "text-green-400 text-xs" : "text-red-400 text-xs"
                      }
                    >
                      {isCorrect ? "Correct" : "Wrong"}
                    </span>
                  )}
                </div>

                {question.type !== "short-answer" &&
                  question.options &&
                  question.options.map(option => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        disabled={submitted}
                        checked={answers[question.id]?.includes(option.id) || false}
                        onCheckedChange={() =>
                          toggleOption(question.id, option.id)
                        }
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}

                {/* SHORT ANSWER */}
                {question.type === "short-answer" && (
                  <Input
                    disabled={submitted}
                    placeholder="Your answer..."
                    value={answers[question.id] || ""}
                    onChange={e =>
                      setShortAnswer(question.id, e.target.value)
                    }
                  />
                )}

                {submitted && (
                  <div className="text-sm text-gray-400 pt-1">
                    Correct answer:{" "}
                    <span className="text-white">
                      {question.type === "short-answer"
                        ? question.correctAnswer
                        : question.options
                          ?.filter(o => o.isCorrect)
                          .map(o => o.text)
                          .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent 
          pointer-events-none z-10 transition-opacity ease-out duration-300 ${showBottom ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {!submitted ? (
        <Button className={`w-full ${quizData.length != 0 ? "" : "hidden"}`} onClick={evaluateQuiz}>
          Submit Quiz
        </Button>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <p className="text-lg font-medium">
            Score: {score} / {quizData.length}
          </p>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Retry Quiz
          </Button>
        </div>
      )}
    </div>
  );
};