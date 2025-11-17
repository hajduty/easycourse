import { Button } from "@/components/ui/button";
import { useCreateSection } from "../hooks/useCreateSection";
import type { FC } from "react";
import type { Section } from "@/types/section";
import { Spinner } from "@/components/ui/spinner";
import { CourseContent } from "../components/CourseContent";
import { Link } from "react-router";

interface SectionListProps {
  sections: Section[];
  courseId: string;
}

export const SectionList: FC<SectionListProps> = ({ sections, courseId }) => {
  const createSection = useCreateSection();

  const onAdd = () => {
    const maxOrder =
      sections.length > 0
        ? Math.max(...sections.map((s) => s.order ?? 0))
        : 0;

    createSection.mutate({
      title: "Untitled section",
      courseId,
      order: maxOrder + 1,
    });
  };

  if (!sections)
    return <><Spinner></Spinner></>

  return (
    <div className="sticky md:w-1/5 h-full border-r p-8 flex flex-col text-white">
      <h1 className="font-semibold pb-4">Sections</h1>
      <div className="flex flex-col gap-4">
        {sections.map((val, index) => (
          <Link key={index} to={`section/${val.sectionId}`}>
            <CourseContent key={index} {...val}></CourseContent>
          </Link>
        ))}
        <Button className="cursor-pointer" variant={"secondary"} onClick={() => onAdd()}>
          {createSection.isPending && <Spinner></Spinner>}
          Add new section
          </Button>
      </div>
    </div>
  );
};
