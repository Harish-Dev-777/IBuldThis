import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

export const metadata: Metadata = {
  title: "Blog | IBuildThis",
  description: "Read our latest blog articles",
  category: "Web development",
  authors: [{ name: "Harish" }],
};

import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { connection } from "next/server";

const Blog = async () => {
  await connection();
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/auth/login?redirect=/blog");
  }
  return (
    <div className="relative min-h-screen bg-neutral-50/50 dark:bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Latest Articles
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>

        <LoadBlogs />
      </div>
    </div>
  );
};

export default Blog;

export async function LoadBlogs() {
  // "use cache"; // Removed "use cache" to prevent conflicts with dynamic auth
  // cacheLife("hours");
  // cacheTag("blog");
  const posts = await fetchQuery(api.posts.getPosts);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">
          No posts found yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post, i) => (
        <Link
          href={`/blog/${post._id}`}
          key={post._id}
          className="group relative flex flex-col h-full bg-card/50 backdrop-blur-sm border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={
                post.imageUrl ??
                "https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?w=800&auto=format&fit=crop&q=80"
              }
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-semibold bg-background/80 backdrop-blur-md rounded-full border shadow-sm">
                Web Development
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-6">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                <span>{new Date(post._creationTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>5 min read</span>
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
              {post.body}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 border">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-[10px]">H</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">Harish</span>
              </div>

              <div className="flex items-center gap-1 text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                Read Post
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
