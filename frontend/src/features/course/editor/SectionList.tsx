import { Button } from "@/components/ui/button";
import { useCreateSection } from "../hooks/section/useCreateSection";
import { useEffect, useRef, useState, type FC } from "react";
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
    <div className="md:sticky md:w-1/5 h-full border-r p-4 md:p-8 flex flex-col text-white">
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
        <h1 className="font-semibold pb-4 hidden md:block">Sections</h1>
        <SectionsGradientList sections={sections} />
        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={onAdd}
        >
          {createSection.isPending && <Spinner />}
          Add new section
        </Button>
      </div>
    </div>
  );
};

export function SectionsGradientList({ sections }: {sections: Section[]}) {
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

    update(); // run on mount (important)
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, [sections]); // rerun if list changes

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="max-h-[600px] overflow-y-auto pr-2 flex flex-col gap-4"
      >
        {sections.map((val: any) => (
          <Link key={val.sectionId} to={`section/${val.sectionId}`}>
            <CourseContent {...val} canDelete={true} />
          </Link>
        ))}
      </div>

      {/* Top gradient */}
      {showTop && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 h-8
                     bg-linear-to-b from-white to-transparent
                     dark:from-stone-950/90"
        />
      )}

      {/* Bottom gradient */}
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
