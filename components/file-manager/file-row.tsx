"use client"

import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import type { FileData } from "./types"
import FileIcon from "./file-icon"
import { MoreVertical, FileText, ExternalLink, Download, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface FileRowProps {
  file: {
    id: string;
    document_id: string;
    filename: string;
    url: string;
    created_at: string;
    updated_at: string;
    type?: string;
    size?: string;
    lastModified?: string;
    uploadedBy?: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

export default function FileRow({ file, isSelected, onSelect, onDelete }: FileRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      // Create a minimum delay promise
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
      
      // Delete request promise
      const deletePromise = fetch(
        `/api/delete?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(file.filename)}&documentId=${encodeURIComponent(file.document_id)}`,
        {
          method: 'DELETE',
        }
      );

      // Wait for both the minimum delay and the delete request
      const [response] = await Promise.all([deletePromise, minDelay]);

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      // Add a small delay before closing to show success state
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('File deleted successfully')
      onDelete?.()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="file-row">
        <div className="flex items-center w-full">
          <div className="mr-3">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          </div>
          <div className="flex items-center gap-3 flex-1">
            <div className="file-icon-container">
              <FileIcon type={file.type || 'unknown'} />
            </div>
            <div className="file-details">
              <p className="file-name">
                {file.url ? (
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {file.filename}
                  </a>
                ) : (
                  file.filename
                )}
              </p>
              <p className="file-meta">
                {file.size || 'Unknown size'} • {file.type || 'Unknown type'}
              </p>
            </div>
          </div>
          <div className="uploader">
            <Image
              src={file.uploadedBy?.avatar || "/placeholder.svg"}
              alt={file.uploadedBy?.name || "Uploader"}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="uploader-details">
              <p className="uploader-name">{file.uploadedBy?.name || 'Unknown'}</p>
              <p className="uploader-email">{file.uploadedBy?.email || 'Unknown'}</p>
            </div>
          </div>
          <div className="modified-date">{file.lastModified || 'Unknown'}</div>
          <div className="actions-menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md hover:bg-gray-100" disabled={isDeleting}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800">
                <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                {file.url && (
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      Open in browser
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Available offline</span>
                    </div>
                    <Switch />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem 
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete file'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open)
          }
        }}
      >
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              {isDeleting ? 'Deleting...' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {isDeleting 
                ? 'Please wait while we delete the file and its embeddings...'
                : 'This action cannot be undone. This will permanently delete the file and its embeddings.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <button
              onClick={handleDelete}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                isDeleting 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

