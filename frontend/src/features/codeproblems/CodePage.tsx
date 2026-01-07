import { usePageTitle } from "@/hooks/usePageTitle";

export const CodePage = () => {
  usePageTitle("Code Problems");
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Code Problems</h1>
      <p>Welcome to the Code Problems page! Here you can find various coding challenges to practice your skills.</p>
    </div>
  );
};