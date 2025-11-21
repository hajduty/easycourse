import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useParams } from "react-router";
import { useSection } from "../hooks/section/useGetSection";
import type { Content } from "@tiptap/react";
import { useEffect, useState } from "react";
import { QuizView } from "./QuizView";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/animate-ui/primitives/base/collapsible";

export const SectionView = () => {
  const { sectionId, courseId } = useParams<{ sectionId: string; courseId: string }>();
  const loadedSection = useSection(courseId!, sectionId!);

  const [content, setContent] = useState<Content>("");
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [loadedForSection, setLoadedForSection] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loadedSection.data || loadedSection.data.sectionId !== sectionId) return;

    let parsedContent: Content = "";
    if (loadedSection.data.sectionData) {
      try { parsedContent = JSON.parse(loadedSection.data.sectionData); } catch { }
    }

    setContent(parsedContent);
    setLoadedForSection(sectionId!);
    setIsContentLoaded(true);
  }, [sectionId, loadedSection.data]);

  const parsedQuizData = (() => {
    const raw = loadedSection.data?.sectionQuestions;
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  })();

  return (
    <div className="h-full flex xl:flex-row flex-col p-0 m-0 text-white w-full bg-stone-950">
      <div className="md:w-4/5 overflow-y-scroll h-full">
        {isContentLoaded && loadedForSection === sectionId ? (
          <SimpleEditor key={sectionId} content={content} editable={false} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400"></p>
          </div>
        )}
      </div>

      <div className="xl:w-1/5 border-l xl:border-t-0 border-t">
        <div className="hidden xl:block p-2">
          <QuizView key={sectionId} quizData={parsedQuizData}></QuizView>
        </div>

        <div className="xl:hidden block border-b">
          <Collapsible>
            <CollapsibleTrigger className={'w-full p-2 border-y hover:bg-stone-900 transition cursor-pointer font-semibold bg-stone-900/30'}>
              Questions
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <QuizView quizData={parsedQuizData} />
            </CollapsiblePanel>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};