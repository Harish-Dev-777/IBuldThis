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
      throw new Error("something went wrong");
    }
    const token = await getToken();
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );
    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }
    const { storageId } = await uploadResult.json();
    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }
  // revalidatePath("/blog");
  updateTag("blog");
  return { success: true };
}
