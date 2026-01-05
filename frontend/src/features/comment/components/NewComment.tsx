import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { imageUrl } from "@/lib/apiClient";
import { useCreateComment } from "../hooks/useComment";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface NewCommentProps {
  name: string;
  profilePic?: string;
  entityType: string;
  entityId: string;
}

export const NewComment = ({ name, profilePic, entityType, entityId }: NewCommentProps) => {
  const [comment, setComment] = useState("");
  const { user: currentUser, authenticated } = useAuth();
  const createComment = useCreateComment();

  const handleSubmit = async () => {
    if (!comment.trim() || !currentUser?.id) return;

    createComment.mutate({
      text: comment.trim(),
      entityId,
      entityType,
      userId: currentUser.id,
    });

    setComment("");
  };

  const canSubmit = comment.trim().length > 0 && !createComment.isPending;

  const commentForm = (
    <div className="w-full items-start flex py-4 gap-3">
      <Avatar className="mt-2">
        <AvatarImage src={profilePic ? imageUrl + profilePic : undefined} alt={name} className=""/>
        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col">
        <p className="font-semibold text-sm pb-1">{name}</p>

        <div className="grid w-full break-all">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            placeholder="Add a comment..."
            maxLength={1000}
            className="w-full bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground
            leading-tight overflow-hidden [grid-area:1/1] field-sizing-content"
          />
          <div
            aria-hidden="true"
            className="invisible whitespace-pre-wrap text-sm leading-tight px-0 py-0.5 [grid-area:1/1] break-all"
            >
            {comment || "x"}
          </div>
        </div>
        <Separator orientation={'horizontal'}/>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {comment.length}/1000
          </span>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {createComment.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!authenticated) {
    return (
      <div className="relative">
        <div className="blur-xs opacity-50 pointer-events-none">
          {commentForm}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center text-muted-foreground"><Link to={"/auth"} className="underline text-neutral-50">Login</Link> to comment on this Course</p>
        </div>
      </div>
    );
  }

  return commentForm;
};
