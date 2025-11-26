import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const CourseSearch = ({value, onChange}:{value: string, onChange: (val: string) => void}) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
      <Input
        type="text"
        value={value}
        placeholder="Search courses..."
        className="w-full bg-neutral-900 text-neutral-200 placeholder-neutral-500 pl-10 pr-4 py-2 rounded-lg border border-neutral-700 focus:border-blue-500 focus:ring-0 focus:outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}