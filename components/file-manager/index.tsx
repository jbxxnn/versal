"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"
import FileList from "./file-list"
import type { FileData } from "./types"

export default function FileManager() {
  // Mock data for the file list
  const [files] = useState<FileData[]>([
    {
      id: "1",
      name: "Dashboard tech requirements",
      size: "220 KB",
      type: "docx",
      uploadedBy: {
        name: "Amélie Laurent",
        email: "amelie@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Jan 4, 2024",
    },
    {
      id: "2",
      name: "Marketing site requirements",
      size: "488 KB",
      type: "docx",
      uploadedBy: {
        name: "Ammar Foley",
        email: "ammar@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Jan 5, 2024",
    },
    {
      id: "3",
      name: "Q4_2023 Reporting",
      size: "1.2 MB",
      type: "pdf",
      uploadedBy: {
        name: "Amélie Laurent",
        email: "amelie@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Jan 5, 2024",
    },
    {
      id: "4",
      name: "Q3_2023 Reporting",
      size: "1.3 MB",
      type: "pdf",
      uploadedBy: {
        name: "Sienna Hewitt",
        email: "sienna@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Jan 6, 2024",
    },
    {
      id: "5",
      name: "Q2_2023 Reporting",
      size: "1.1 MB",
      type: "pdf",
      uploadedBy: {
        name: "Olly Shroeder",
        email: "olly@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Jan 8, 2024",
    },
    {
      id: "6",
      name: "Q1_2023 Reporting",
      size: "1.8 MB",
      type: "pdf",
      uploadedBy: {
        name: "Mathilde Lewis",
        email: "mathilde@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Jan 6, 2024",
    },
    {
      id: "7",
      name: "FY_2022-23 Financials",
      size: "628 KB",
      type: "xls",
      uploadedBy: {
        name: "Sienna Hewitt",
        email: "sienna@untitledui.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      lastModified: "Dec 20, 2023",
    },
  ])

  const [activeTab, setActiveTab] = useState("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

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

  return (
    <div className="file-manager">
      <Sidebar />
      <div className="main-content">
        <Header />
        <FileList
          files={files}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedFiles={selectedFiles}
          toggleFileSelection={toggleFileSelection}
          selectAllFiles={selectAllFiles}
        />
      </div>
    </div>
  )
}

