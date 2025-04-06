"use client"

import { useState, useEffect } from "react"
import UploadModal from "./upload-modal"
import Sidebar from "./sidebar"
import Header from "./header"
import FileList from "./file-list"
import { FileData } from "./types"
import { toast } from "sonner"

export default function FileManager() {
  const [files, setFiles] = useState<FileData[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [folders, setFolders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/files')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch files')
      }

      setFiles(data.files || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch files')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles()
  }, [])

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const selectAllFiles = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(files.map((file) => file.id))
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      
      // Refresh the file list
      fetchFiles()
      
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    }
  }

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder)
  }

  return (
    <div className="file-manager">
      <Sidebar onFolderSelect={handleFolderChange} currentFolder={currentFolder} folders={folders} />
      <div className="main-content">
        <Header />
        <FileList
          files={files}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedFiles={selectedFiles}
          toggleFileSelection={toggleFileSelection}
          selectAllFiles={selectAllFiles}
          onUploadClick={() => setIsUploadModalOpen(true)}
          currentFolder={currentFolder}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchFiles}
        />
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleFileUpload}
        currentFolder={currentFolder}
      />
    </div>
  )
}

