import { useParams } from "react-router";
import type { Content } from "@tiptap/react";
import { useEffect, useState } from "react";
import { QuizView } from "./QuizView";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/animate-ui/primitives/base/collapsible";
import { useSection } from "../../hooks/section/useGetSection";
import React from "react";

const SimpleEditor = React.lazy(() => import("@/components/tiptap-templates/simple/simple-editor"));

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
      try {
        parsedContent = JSON.parse(loadedSection.data.sectionData);
      } catch {
        // Assume it's HTML string if JSON parsing fails
        parsedContent = loadedSection.data.sectionData;
      }
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
    <div className="flex xl:flex-row flex-col p-0 m-0 text-white w-full bg-neutral-950">
      <div className="xl:w-4/5 flex-1">
        {isContentLoaded && loadedForSection === sectionId ? (
          <React.Suspense fallback={<div className="p-4 text-gray-400">Loading content…</div>}>
            <SimpleEditor key={sectionId} content={content} editable={false} />
          </React.Suspense>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400"></p>
          </div>
        )}
      </div>

      <div className="xl:w-1/5 xl:border-t-0 border sticky top-30 h-fit">
        <div className="hidden xl:block p-2">
          <QuizView key={sectionId} quizData={parsedQuizData}></QuizView>
        </div>

        <div className="xl:hidden block ">
          <Collapsible>
            <CollapsibleTrigger className={'w-full p-2 border-y hover:bg-neutral-900 transition cursor-pointer font-semibold bg-neutral-900/30'}>
              Questions
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <QuizView quizData={parsedQuizData} key={sectionId}/>
            </CollapsiblePanel>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};
