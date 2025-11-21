import { Button } from "@/components/ui/button";
import { useCreateSection } from "../hooks/section/useCreateSection";
import { useEffect, useRef, useState, type FC } from "react";
import type { Section } from "@/types/section";
import { Spinner } from "@/components/ui/spinner";
import { CourseContent } from "../components/CourseContent";
import { Link, useNavigate } from "react-router";
import { useDeleteSection } from "../hooks/section/useDeleteSection";
import { useUpdateSection } from "../hooks/section/useUpdateSection";
import { PlusCircle, GripVertical, Home } from "lucide-react";

interface SectionListProps {
  sections: Section[];
  courseId: string;
  courseTitle: string;
}

export const SectionList: FC<SectionListProps> = ({
  sections,
  courseId,
  courseTitle,
}) => {
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

  if (!sections) return <Spinner />;

  return (
    <div className="flex flex-col lg:flex-row text-white lg:w-1/5">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col border-b lg:border-b-0 lg:border-r p-6 lg:p-8 w-full">
        <h1 className="font-semibold text-lg">Course content</h1>

        <Link to={`/course/editor/${courseId}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full my-4 cursor-pointer"
          >
            <Home/>
            <p className="w-fit line-clamp-1">{courseTitle}</p>
          </Button>
        </Link>

        <div className="relative mt-2">
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-scroll scrollbar-hide">
            <SectionsGradientList sections={sections} />
          </div>
        </div>

        <Button
          className="cursor-pointer mt-4"
          variant="default"
          onClick={onAdd}
        >
          {createSection.isPending && <Spinner />}
          <PlusCircle />
          Add new section
        </Button>
      </div>

      <div className="lg:hidden w-full overflow-x-auto p-2">
        <div className="flex gap-2">
          <Link to={`/course/editor/${courseId}`}>
            <Button variant="outline" size="sm">
              Course page
            </Button>
          </Link>

          {sections.map((s) => (
            <Link
              key={s.sectionId}
              to={`/course/editor/${courseId}/section/${s.sectionId}`}
              className="shrink-0"
            >
              <div className="min-w-[200px]"> 
                <SectionsGradientList sections={[s]} />
              </div>
            </Link>
          ))}
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onAdd}
            size={'sm'}
          >
            {createSection.isPending && <Spinner />}
            <PlusCircle />
            Add new section
          </Button>
        </div>
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
    <div className="relative">
      {/* Top gradient overlay */}
      {showTop && (
        <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-background to-transparent pointer-events-none z-10" />
      )}
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div ref={scrollRef} className="max-h-[600px] overflow-y-auto scrollbar-hide flex flex-col gap-4">
            {items.map((id) => {
              const val = sectionState.find((s) => s.sectionId === id)!;
              return (
                <SortableSection key={id} section={val} onDelete={handleDelete} onEdit={handleUpdate}/>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Bottom gradient overlay */}
      {showBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />
      )}
    </div>

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
  const navigate = useNavigate();
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
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div onClick={() => navigate(`section/${section.sectionId}`)} className="flex-1">
        <CourseContent
          {...section}
          canDelete={true}
          onDelete={() => onDelete(section.sectionId!)}
          onEdit={(newTitle) => onEdit(newTitle, section.sectionId!, section.courseId!)}
        />
      </div>
    </div>
  );
}