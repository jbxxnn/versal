"use server"

import { put } from "@vercel/blob"

export async function uploadToBlob(file: File) {
  try {
    const blob = await put(file.name, file, {
      access: "public",
    })

    return { success: true, data: blob }
  } catch (error) {
    console.error("Error uploading to blob:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

