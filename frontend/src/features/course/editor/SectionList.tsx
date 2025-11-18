import { Button } from "@/components/ui/button";
import { useCreateSection } from "../hooks/section/useCreateSection";
import { useEffect, useRef, useState, type FC } from "react";
import type { Section } from "@/types/section";
import { Spinner } from "@/components/ui/spinner";
import { CourseContent } from "../components/CourseContent";
import { Link } from "react-router";
import { useDeleteSection } from "../hooks/section/useDeleteSection";
import { useUpdateSection } from "../hooks/section/useUpdateSection";
import { PlusCircle } from "lucide-react";

interface SectionListProps {
  sections: Section[];
  courseId: string;
  courseTitle: string;
}

export const SectionList: FC<SectionListProps> = ({ sections, courseId, courseTitle }) => {
  const createSection = useCreateSection();
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="md:sticky md:w-1/5 md:border-b-0 border-b md:h-full h-fit border-r py-8 md:px-4 lg:px-4 xl:px-8 flex flex-col text-white">
      <div className="md:hidden mb-4">
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          {isOpen ? "Hide Sections" : "Show Sections"}
        </Button>
      </div>

      <div
        className={`flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300 ease-in-out
        ${isOpen ? "max-h-[1000px]" : "max-h-0"} md:max-h-full`}
      >
        <Link to={`/course/editor/${courseId}`}>
          <Button size={'sm'} variant={'ghost'} className="line-clamp-1 w-full">{courseTitle}</Button>
        </Link>
        <SectionsGradientList sections={sections} />
        <Button
          className="cursor-pointer"
          variant="default"
          onClick={onAdd}
        >
          {createSection.isPending && <Spinner />}
          <PlusCircle/>
          Add new section
        </Button>
      </div>
    </div>
  );
};

export function SectionsGradientList({ sections }: { sections: Section[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

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
  }, [sections]);

  const deleteSection = useDeleteSection(sections.at(0)?.courseId!);

  const updateSection = useUpdateSection();

  const handleDelete = (sectionId: string) => {
    deleteSection.mutate(sectionId);
  };

  const handleUpdate = (newTitle: string, sectionId: string, courseId: string) => {
    updateSection.mutate({
      data: {
        sectionId,
        courseId,
        title: newTitle,
      },
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="max-h-[600px] overflow-y-auto flex flex-col gap-4"
      >
        {sections.map((val) => (
          <Link key={val.sectionId} to={`section/${val.sectionId}`}>
            <CourseContent {...val} canDelete={true} onDelete={() => handleDelete(val.sectionId!)} onEdit={(newTitle) => handleUpdate(newTitle, val.sectionId!, val.courseId!)}/>
          </Link>
        ))}
      </div>

      {showTop && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 h-8
                     bg-linear-to-b from-white to-transparent
                     dark:from-stone-950/90"
        />
      )}

      {showBottom && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-12
                     bg-linear-to-t from-white to-transparent
                     dark:from-stone-950"
        />
      )}
    </div>
  );
}
