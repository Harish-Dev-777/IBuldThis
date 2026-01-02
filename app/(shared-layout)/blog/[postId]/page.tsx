import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import CommandSection from "@/components/web/CommentSection";
import { Metadata } from "next";
import { PostPresence } from "@/components/web/postPresence";
import { getToken } from "@/lib/auth-server";

interface postIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({
  params,
}: postIdRouteProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });
  if (!post) {
    return {
      title: "Post not found",
      description: "Post not found",
    };
  }
  return {
    title: post.title,
    description: post.body,
  };
}

export default async function BlogPost({ params }: postIdRouteProps) {
  const { postId } = await params;
  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId: postId }),
    preloadQuery(api.comments.getCommentsByPostId, {
      postId: postId,
    }),
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!post) {
    return (
      <div className="py-28">
        <h1 className="text-5xl font-extrabold text-center tracking-tight">
          Post not found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-28 px-4 animate-in fade-in duration-500 relative ">
      <Link
        href="/blog"
        className={buttonVariants({ className: "mb-6 relative " })}
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>
      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YW5pbWV8ZW58MHx8MHx8fDA%3D"
          }
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-all duration-500"
        />
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground">
            Posted on {new Date(post._creationTime).toLocaleDateString()}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
      </div>
      <Separator className="my-4" />
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>
      <Separator className="my-4" />
      <CommandSection preloadedComments={preloadedComments} />
    </div>
  );
}
