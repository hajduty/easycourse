import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { imageUrl } from "@/lib/apiClient";
import { useCommentsForEntity, useDeleteComment } from "../hooks/useComment";
import type { Comment } from "@/types/comment";
import { useAuth } from "@/providers/AuthProvider";
import { Ellipsis, Trash2 } from "lucide-react";
import { Link } from "react-router";

interface CommentListProps {
  entityType: string;
  entityId: string;
}

interface CommentItemProps {
  comment: Comment;
  entityType: string;
  entityId: string;
}

const CommentItem = ({ comment, entityType, entityId }: CommentItemProps) => {
  const displayName = comment.username || comment.userId || "Unknown user";
  const profilePic = comment.userImagePath;
  const [showFullText, setShowFullText] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const {user} = useAuth();
  const deleteComment = useDeleteComment();

  const createdAtDate = typeof comment.createdAt === 'string' ? new Date(comment.createdAt) : comment.createdAt;

  useEffect(() => {
    if (textRef.current && comment.text) {
      const el = textRef.current;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 5;
      setHasMore(el.scrollHeight > maxHeight);
    }
  }, [comment.text]);

  const handleDelete = () => {
    if (comment.id) {
      deleteComment.mutate(Number(comment.id));
    }
  };

  return (
    <div className="w-full items-start flex py-4 gap-3">
      <Avatar className="mt-2">
        <AvatarImage src={profilePic ? imageUrl + profilePic : undefined} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2">
          <Link to={`/user/profile/${comment.userId}`}>
          <p className="font-semibold text-sm hover:underline">{displayName}</p>
          </Link>
          <span className="text-xs text-muted-foreground">
            {createdAtDate.toLocaleDateString()} at {createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {user?.id == comment.userId &&
            <Popover>
              <PopoverTrigger asChild>
                <Button className="ml-auto" variant={'ghost'} size={'sm'}>
                  <Ellipsis></Ellipsis>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full justify-start text-destructive hover:text-destructive"
                  disabled={deleteComment.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>}
        </div>

        {comment.text && (
          <>
            <p
              ref={textRef}
              className={`text-sm leading-relaxed mt-1 whitespace-pre-wrap wrap-break-word break-all ${!showFullText && hasMore ? 'line-clamp-5' : ''}`}
            >
              {comment.text}
            </p>
            {hasMore && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowFullText(!showFullText)}
                className="mt-1 p-0 h-auto text-xs text-muted-foreground hover:text-foreground justify-start"
              >
                {showFullText ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export const CommentList = ({ entityType, entityId }: CommentListProps) => {
  const { data: commentsResponse, isLoading: loading, error } = useCommentsForEntity(entityType, entityId);
  const [showAll, setShowAll] = useState(false);

  const comments = commentsResponse?.data || [];

  const displayedComments = showAll ? comments : comments.slice(0, 5);

  return (
    <div className="w-full">
      {displayedComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} entityType={entityType} entityId={entityId} />
      ))}
      {comments.length > 5 && (
        <div className="mt-4">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'Read More'}
          </Button>
        </div>
      )}
    </div>
  );
};
