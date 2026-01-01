"use client";

import { Loader2, MessagesSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comments";
import { Field, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Preloaded, usePreloadedQuery } from "convex/react";

export default function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const comments = usePreloadedQuery(props.preloadedComments);
  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment created successfully");
      } catch {
        toast.error("Failed to create comment");
      }
    });
  }
  if (comments === undefined) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessagesSquare className="size-5" />
        <h2 className="text-xl font-semibold">{comments.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  {...field}
                  placeholder="Share your thoughts..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span> Loading...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </Button>
        </form>
        {comments?.length > 0 && <Separator />}
        <section className="space-y-6">
          {comments?.map((comment) => {
            return (
              <div key={comment._id} className="flex gap-4">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${comment.authorName}?rounded=60`}
                    alt={comment.authorName}
                  />
                  <AvatarFallback>
                    {comment.authorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">
                      {comment.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </CardContent>
    </Card>
  );
}
