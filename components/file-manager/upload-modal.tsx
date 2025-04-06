"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import { X, Upload, File, AlertCircle } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (file: File) => void
  currentFolder: string
}

export default function UploadModal({ isOpen, onClose, onUploadComplete, currentFolder }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setError(null)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileType = (fileName: string): string => {
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
        return "image"
      default:
        return extension
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for visual feedback
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 5
        })
      }, 300)

      // Call the parent's upload handler
      await onUploadComplete(selectedFile)

      // Clear the interval and set to 100%
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Wait a moment to show 100% progress before closing
      setTimeout(() => {
        setIsUploading(false)
        onClose()
      }, 500)
    } catch (err) {
      console.error("Upload failed:", err)
      setError("Upload failed. Please check your connection and try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-[#e1e2e3]">
          <h2 className="text-lg font-medium">Upload File</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" disabled={isUploading} title="upload file">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-[#e1e2e3] rounded-lg p-8 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input type="file" title="upload file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="mb-2 text-sm">Drag and drop your file here, or</p>
              <button
                onClick={triggerFileInput}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                Browse Files
              </button>
              <p className="mt-4 text-xs text-gray-500">Supported formats: PDF, Word, Excel, PowerPoint, Images</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-[#e1e2e3] rounded-lg">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <File className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={isUploading}
                  title="uploading"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-[#e1e2e3]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#e1e2e3] rounded-md text-sm hover:bg-gray-50 transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={uploadFile}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}

