import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowDownNarrowWide, SlidersHorizontal } from "lucide-react";

export const CourseFilter = ({value, onChange, descending}:{value: string, onChange: (sortBy: string, descending: boolean) => void, descending: boolean}) => {	
  const handleSortChange = (option: string) => {
    onChange(option, descending);
  };

  const toggleOrder = () => {
    onChange(value, !descending);
  };

  return (
    <div className="flex gap-2 text-stone-200 text-sm bg-stone-900 p-2 rounded-lg border items-center">
      <SlidersHorizontal size={18} />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row text-nowrap items-center gap-1 focus:outline-none">
          <span className="select-none">Sorting by:</span>
          <span className="font-medium text-white">{value}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark bg-stone-900 text-stone-200 border-stone-700">
          {["Popular", "Created"].map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleSortChange(option)}
              className={cn(
                "cursor-pointer",
                option === value && "bg-stone-800 text-white"
              )}
            >
              {option}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-stone-700" />
          <DropdownMenuItem
            onClick={toggleOrder}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>Order: {descending ? "Descending" : "Ascending"}</span>
            <ArrowDownNarrowWide
              className={`transition-transform duration-300 ${
                descending ? "rotate-0" : "rotate-180"
              }`}
              size={18}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
