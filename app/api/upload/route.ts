import { put, list } from "@vercel/blob"
import { NextResponse } from "next/server"
import { processDocument } from "@/lib/documentProcessor"
import { createDocument } from "@/lib/documentService"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folderName = process.env.FOLDER_NAME || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if file already exists in Blob storage
    const { blobs } = await list()
    const existingFile = blobs.find(blob => 
      blob.pathname === `${folderName}/${file.name}`
    )

    if (existingFile) {
      return NextResponse.json(
        { error: "File with this name already exists" },
        { status: 400 }
      )
    }

    console.log("Processing file:", file.name, "Type:", file.type, "Size:", file.size)

    // Upload to Vercel Blob with folder structure
    const blob = await put(`${folderName}/${file.name}`, file, {
      access: "public",
    })

    // Process document and get documentId
    const documentId = await processDocument(file)

    // Store document metadata
    await createDocument(documentId, file.name, blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      documentId,
      type: file.type,
      size: file.size.toString(),
      lastModified: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

