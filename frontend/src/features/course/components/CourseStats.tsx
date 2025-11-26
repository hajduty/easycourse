import { AreaChart, Area, XAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseResponse } from "@/types/course";
import { Activity } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";

interface CourseStatsProps {
  courses: CourseResponse[];
}

export const CourseStats = ({ courses }: CourseStatsProps) => {
  const chartData = courses.map(course => ({
    course: course.courseName,
    views: course.views,
  }));

  const ChartTooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { course, views } = payload[0].payload;
    return (
      <div className="bg-neutral-900 border border-neutral-700 rounded-md p-2 shadow-lg">
        <p className="text-xs font-semibold text-white truncate">{course}</p>
        <p className="text-xs text-green-400">Views: {views}</p>
      </div>
    );
  };

  return (
    <Card className="bg-neutral-950 w-full">
      <CardHeader className="pb-1.5">
        <CardTitle className="text-sm">Course Views</CardTitle>
        <CardDescription className="text-xs">Views per course</CardDescription>
      </CardHeader>

      <CardContent className="pb-1.5">
        <ChartContainer config={{ views: { label: "Views", color: "#22c55e" } }} className="max-h-[200px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="course"
              tick={{ fill: "#fff", fontSize: 10 }}
              tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + "…" : v}
            />
            <Tooltip content={<ChartTooltipContent />} cursor={false} />
            <Area dataKey="views" type="step" fill="#22c55e" fillOpacity={0.2} stroke="#22c55e" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <div className="px-6 py-1.5 flex items-center gap-2 text-xs font-medium">
        <Activity className="h-3.5 w-3.5" />
        <span>{courses.length} courses</span>
      </div>
    </Card>
  );
};