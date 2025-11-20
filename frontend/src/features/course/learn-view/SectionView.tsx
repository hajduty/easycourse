import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useParams } from "react-router";
import { useSection } from "../hooks/section/useGetSection";
import type { Content } from "@tiptap/react";
import { useEffect, useState } from "react";

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
      try { parsedContent = JSON.parse(loadedSection.data.sectionData); } catch {}
    }

    setContent(parsedContent);
    setLoadedForSection(sectionId!);
    setIsContentLoaded(true);
  }, [sectionId, loadedSection.data]);

  return (
    <div className="flex flex-col md:flex-row p-0 m-0 text-white w-full bg-stone-950 h-full">
      <div className="md:w-4/5 overflow-y-scroll h-full">
        {isContentLoaded && loadedForSection === sectionId ? (
          <SimpleEditor key={sectionId} content={content} editable={false} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400"></p>
          </div>
        )}
      </div>

      <div className="md:w-1/5 md:block border-l p-8">
        <h1 className="font-semibold pb-4">Questions</h1>
      </div>
    </div>
  );
};