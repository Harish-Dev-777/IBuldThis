import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
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

const Blog = async () => {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/auth/login?redirect=/blog");
  }
  return (
    <div className="container mx-auto px-4 py-28 relative z-10">
      <div className="text-center pb-12 relative z-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blogs
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts and trends from the world.
        </p>
      </div>
      <div className="relative z-10">
        <LoadBlogs />
      </div>
    </div>
  );
};

export default Blog;

export async function LoadBlogs() {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const posts = await fetchQuery(api.posts.getPosts);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden ">
            <Image
              src={
                post.imageUrl ??
                "https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YW5pbWV8ZW58MHx8MHx8fDA%3D"
              }
              alt="blog image"
              fill
              className="rounded-t-lg object-cover hover:scale-105 transition-all duration-300"
            />
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
              <p className="text-muted-foreground line-clamp-3 ">{post.body}</p>
            </Link>
          </CardContent>
          <Link
            className={buttonVariants({
              className: "w-full",
            })}
            href={`/blog/${post._id}`}
          >
            Read More
          </Link>
        </Card>
      ))}
    </div>
  );
}
