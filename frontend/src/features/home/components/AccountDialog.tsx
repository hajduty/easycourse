import { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Settings2Icon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { DeleteAccount } from "@/features/course/api";
import { useQueryClient } from "@tanstack/react-query";

export function AccountDialog() {
  const { user, logout, authenticated } = useAuth();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await DeleteAccount();

      if (res.success) {
        logout();
        queryClient.clear();

        setOpen(false);
      } else {
        console.error("Delete failed:", res.message);
        setOpen(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={!authenticated}>
        <Button variant="ghost" className="justify-start">
          <Settings2Icon className="h-4 w-4" />
          Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md dark text-white">
        <DialogHeader>
          <DialogTitle>Your Account</DialogTitle>
          <DialogDescription>
            Manage your account settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <div className="flex justify-between">
            <span className="text-neutral-400">Name:</span>
            <span className="font-normal">{user?.username || "Unknown"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Email:</span>
            <span className="font-normal">{user?.email || "Unknown"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Id:</span>
            <span className="font-normal">{user?.id || "Unknown"}</span>
          </div>
        </div>

        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="dark text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all your data.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="dark text-white">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => { logout(); setOpen(false) }}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
