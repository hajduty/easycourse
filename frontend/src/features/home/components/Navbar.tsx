import { Notebook, Menu, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router";
import { AccountDialog } from "./AccountDialog";
import { useAuth } from "@/providers/AuthProvider";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

export const Navbar = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky overflow-visible top-0 z-50 w-full px-4 py-2 border-b backdrop-blur-3xl border-neutral-900 text-white flex items-center font-bold dark">
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
        >
          Rankings
        </Button>
      </div>

      <div className="ml-auto hidden md:flex items-center gap-2 [&>svg]:hidden list-none">
        {authenticated ?
          (<NavigationMenu >
            <NavigationMenuItem className="[&>svg]:hidden">
              <NavigationMenuTrigger >
                <UserIcon className="mr-2 h-4 w-4" />
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-48 list-none">
                <NavigationMenuLink
                  asChild
                  className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-neutral-800 rounded"
                >
                  <Button variant="ghost" onClick={() => navigate("/user/profile")} className="w-full justify-start">
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Button>
                </NavigationMenuLink>
                <NavigationMenuLink
                  asChild
                  className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-neutral-800 rounded"
                >
                  <AccountDialog />
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
          ) : (<Link to={"/auth"}><><Button variant={'ghost'}>Sign Up</Button></></Link>)}
      </div>

      <div className="ml-auto md:hidden">
        <Sheet>
          <SheetTitle />
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-white" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-neutral-950 text-white border-neutral-900">
            <div className="flex flex-col gap-4 mt-8 font-semibold">
              <button
                className="px-4 py-2 rounded hover:bg-neutral-800 transition text-left"
                onClick={() => navigate("/course")}
              >
                Learn
              </button>
              <button
                className="px-4 py-2 rounded hover:bg-neutral-800 transition text-left"
                onClick={() => navigate("/course/create")}
              >
                Create
              </button>
              <button
                className="px-4 py-2 rounded hover:bg-neutral-800 transition text-left"
              >
                Rankings
              </button>

              {authenticated ? (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="px-3 py-2 rounded hover:bg-neutral-800 transition text-left flex items-center gap-2"
                    onClick={() => navigate("/user/profile")}
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </button>
                  <AccountDialog></AccountDialog>
                </div>
              ) : (
                <button
                  className="px-4 py-2 rounded hover:bg-neutral-800 transition text-left flex items-center gap-2"
                  onClick={() => navigate("/auth")}
                >
                  <UserIcon className="h-4 w-4" />
                  Login
                </button>
              )}

            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};