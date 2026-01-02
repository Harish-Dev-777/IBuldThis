import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Post not found
        </h1>
        <Link href="/blog" className={buttonVariants({ variant: "ghost" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-20 pt-24 animate-in fade-in duration-700 bg-neutral-50/30 dark:bg-background">
      {/* Scroll Progress Bar (Optional - conceptual) */}

      <div className="container px-4 mx-auto max-w-5xl">
        {/* Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all articles
        </Link>

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              Web Development
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">Harish</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <time className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post._creationTime).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />5 min read
            </span>
          </div>

          {userId && (
            <div className="flex justify-center mt-2">
              <PostPresence roomId={post._id} userId={userId} />
            </div>
          )}
        </header>

        {/* Hero Image */}
        <div className="relative w-full aspect-[21/9] md:aspect-[2/1] bg-muted rounded-3xl overflow-hidden shadow-2xl mb-16 ring-1 ring-border/50">
          <Image
            src={
              post.imageUrl ??
              "https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?w=1200&auto=format&fit=crop&q=80"
            }
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent md:hidden" />
        </div>

        {/* Content Body */}
        <div className="max-w-2xl mx-auto">
          {/* Main Text */}
          <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {post.body}
          </div>

          <Separator className="my-12 opacity-50" />

          {/* Footer / Comments */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold tracking-tight">Comments</h3>
            <CommandSection preloadedComments={preloadedComments} />
          </div>
        </div>
      </div>
    </article>
  );
}
