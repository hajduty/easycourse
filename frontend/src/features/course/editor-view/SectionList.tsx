import { Button } from "@/components/ui/button";
import { useCreateSection } from "../hooks/section/useCreateSection";
import { useEffect, useRef, useState, type FC } from "react";
import type { Section } from "@/types/section";
import { Spinner } from "@/components/ui/spinner";
import { CourseContent } from "../components/CourseContent";
import { Link } from "react-router";
import { useDeleteSection } from "../hooks/section/useDeleteSection";
import { useUpdateSection } from "../hooks/section/useUpdateSection";
import { PlusCircle, GripVertical } from "lucide-react";

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
          <Button size={'sm'} variant={'ghost'} className="line-clamp-1 w-full cursor-pointer">{courseTitle}</Button>
        </Link>
        <SectionsGradientList sections={sections} />
        <Button
          className="cursor-pointer"
          variant="default"
          onClick={onAdd}
        >
          {createSection.isPending && <Spinner />}
          <PlusCircle />
          Add new section
        </Button>
      </div>
    </div>
  );
};

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateCourse } from "../hooks/course/useUpdateCourse";

export function SectionsGradientList({ sections: initialSections }: { sections: Section[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sectionState, setSectionState] = useState<Section[]>(initialSections);

  useEffect(() => {
    setSectionState(initialSections);
  }, [initialSections])

  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [items, setItems] = useState(sectionState.map((s) => s.sectionId!));

  useEffect(() => {
    setItems(sectionState.map((s) => s.sectionId!));
  }, [initialSections]);

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
  }, [sectionState]);

  const deleteSection = useDeleteSection(sectionState.at(0)?.courseId!);
  const updateSection = useUpdateSection();
  const updateCourse = useUpdateCourse();

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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionState.findIndex((s) => s.sectionId === active.id);
    const newIndex = sectionState.findIndex((s) => s.sectionId === over.id);

    // Move sections in the array
    const newSections = arrayMove(sectionState, oldIndex, newIndex);

    // Update their order
    const updatedSections = newSections.map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));

    // Update local state
    setSectionState(updatedSections);
    setItems(updatedSections.map((s) => s.sectionId!)); // Keep IDs for any UI that needs them

    // Update backend
    updateCourse.mutate({
      courseId: updatedSections[0]?.courseId!,
      data: {
        sections: updatedSections,
        courseName: '',
        courseDescription: '',
      }
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div ref={scrollRef} className="max-h-[600px] overflow-y-auto flex flex-col gap-4">
          {items.map((id) => {
            const val = sectionState.find((s) => s.sectionId === id)!;
            return (
              <SortableSection key={id} section={val} onDelete={handleDelete} onEdit={handleUpdate} />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableSection({
  section,
  onDelete,
  onEdit,
}: {
  section: Section;
  onDelete: (id: string) => void;
  onEdit: (newTitle: string, sectionId: string, courseId: string) => void;
}) {
  if (!section) {
    return <Spinner />
  }
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.sectionId!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {/* Drag handle - only this part triggers drag */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Clickable link - separate from drag handler */}
      <Link to={`section/${section.sectionId}`} className="flex-1">
        <CourseContent
          {...section}
          canDelete={true}
          onDelete={() => onDelete(section.sectionId!)}
          onEdit={(newTitle) => onEdit(newTitle, section.sectionId!, section.courseId!)}
        />
      </Link>
    </div>
  );
}