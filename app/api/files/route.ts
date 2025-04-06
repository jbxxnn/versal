import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const folderName = process.env.FOLDER_NAME || "uploads"
    const { blobs } = await list()

    // Filter blobs to only include files from the specified folder
    const filteredBlobs = blobs.filter(blob => 
      blob.pathname.startsWith(`${folderName}/`)
    )

    // Get document metadata from Supabase just for document_ids
    const { data: documents, error } = await supabase
      .from('documents')
      .select('document_id,url')

    if (error) {
      throw error
    }

    // Transform blob data to our file format
    const filesWithMetadata = filteredBlobs.map(blob => {
      const document = documents?.find(doc => doc.url === blob.url)
      const fileName = blob.pathname.split("/").pop() || blob.pathname
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || ""
      let fileType = fileExtension

      // Determine file type from extension
      if (["doc", "docx"].includes(fileExtension)) fileType = "docx"
      else if (["xls", "xlsx"].includes(fileExtension)) fileType = "xls"
      else if (fileExtension === "pdf") fileType = "pdf"
      else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) fileType = "image"

      // Format file size
      const sizeInKB = blob.size / 1024
      const formattedSize = sizeInKB < 1024 
        ? `${sizeInKB.toFixed(1)} KB`
        : `${(sizeInKB / 1024).toFixed(1)} MB`

      return {
        id: blob.url,
        document_id: document?.document_id,
        name: fileName,
        filename: fileName,
        size: formattedSize,
        type: fileType,
        url: blob.url,
        uploadedBy: {
          name: "Blob Storage",
          email: "storage@vercel.com",
          avatar: "/placeholder.svg",
        },
        lastModified: new Date(blob.uploadedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }
    })

    return NextResponse.json({ files: filesWithMetadata })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

