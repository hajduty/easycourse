import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useParams } from "react-router";

export const SectionEditor = () => {
  const { sectionId } = useParams();

  return (
    <div className="h-full flex md:flex-row flex-col p-0 m-0">
      <div className="md:w-4/5 overflow-y-scroll h-full">
        <SimpleEditor sectionId={sectionId!} />
      </div>
      <div className="md:w-1/5 md:block border-l p-8">
        <h1 className="font-semibold pb-4">Questions</h1>
      </div>
    </div>
  );
};
