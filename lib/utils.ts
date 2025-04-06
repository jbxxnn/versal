import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts unique folder paths from a list of file paths
 *
 * @param paths Array of file paths
 * @returns Array of unique folder paths
 */
export function extractFoldersFromPaths(paths: string[]): string[] {
  const folders = new Set<string>()

  paths.forEach((path) => {
    const parts = path.split("/")

    // If there's at least one folder in the path
    if (parts.length > 1) {
      // Remove the filename (last part)
      parts.pop()

      // Add each level of the folder path
      let currentPath = ""
      parts.forEach((part) => {
        if (currentPath) {
          currentPath += "/" + part
        } else {
          currentPath = part
        }

        folders.add(currentPath)
      })
    }
  })

  return Array.from(folders)
}

/**
 * Formats a file size in bytes to a human-readable string
 *
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

/**
 * Determines file type from filename extension
 *
 * @param fileName Name of the file
 * @returns File type string
 */
export function getFileType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""

  switch (extension) {
    case "doc":
    case "docx":
      return "docx"
    case "xls":
    case "xlsx":
      return "xls"
    case "pdf":
      return "pdf"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image"
    default:
      return extension
  }
}

