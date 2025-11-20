import { Notebook, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full px-4 py-2 bg-transparent border-b backdrop-blur-3xl border-stone-900 text-white flex items-center font-bold dark">
      <div className="flex items-center gap-2">
        <Notebook />
        <button
          className="select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          EasyCourse
        </button>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-4">
        <Button
          variant={'ghost'}
          className="px-4 py-1 rounded transition cursor-pointer"
          onClick={() => navigate("/course")}
        >
          Learn
        </Button>
        <Button
          variant={'ghost'}
          className="px-4 py-1 rounded transition cursor-pointer"
          onClick={() => navigate("/course/create")}
        >
          Create
        </Button>
        <Button
          variant={'ghost'}
          className="px-4 py-1 rounded transition cursor-pointer"
          onClick={() => navigate("/rankings")}
        >
          Rankings
        </Button>
      </div>

      <div className="ml-auto hidden md:flex items-center gap-2">
        <Button className="px-4 py-1 roundedtransition flex items-center gap-2 cursor-pointer" variant={'ghost'}>
          <Settings size={16} />
          Account
        </Button>
      </div>

      <div className="ml-auto md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-white" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-stone-950 text-white border-stone-900">
            <div className="flex flex-col gap-4 mt-8 font-semibold">
              <button
                className="px-4 py-2 rounded hover:bg-stone-800 transition text-left"
                onClick={() => navigate("/course")}
              >
                Learn
              </button>
              <button
                className="px-4 py-2 rounded hover:bg-stone-800 transition text-left"
                onClick={() => navigate("/course/create")}
              >
                Create
              </button>
              <button
                className="px-4 py-2 rounded hover:bg-stone-800 transition text-left"
                onClick={() => navigate("/rankings")}
              >
                Rankings
              </button>

              <button
                className="px-4 py-2 rounded hover:bg-stone-800 transition flex items-center gap-2"
                onClick={() => navigate("/account")}
              >
                <Settings size={16} />
                Account
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

