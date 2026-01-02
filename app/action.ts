"use server";

import { postSchema } from "./schemas/blog";
import { z } from "zod";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

import { getToken } from "@/lib/auth-server";
import { revalidatePath, updateTag } from "next/cache";

export async function createBlogAction(formData: FormData) {
  try {
    const values = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      image: formData.get("image") as File,
    };

    const parsed = postSchema.safeParse(values);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return {
        error: "Invalid form data. Please check your inputs.",
      };
    }

    const token = await getToken();
    if (!token) {
      console.error("No authentication token found");
      return {
        error:
          "You must be logged in to create a post. Please log in and try again.",
      };
    }

    console.log("Generating upload URL...");
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    console.log("Uploading image...");
    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      console.error("Image upload failed:", await uploadResult.text());
      return {
        error: "Failed to upload image. Please try again.",
      };
    }

    const { storageId } = await uploadResult.json();
    console.log("Creating post with storageId:", storageId);

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );

    console.log("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create post. Please try again.",
    };
  }
  // revalidatePath("/blog");
  updateTag("blog");
  return { success: true };
}
