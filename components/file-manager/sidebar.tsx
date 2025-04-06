"use client"

import Link from "next/link"
import { LayoutGrid, FolderPlus } from "lucide-react"
import { useState, useEffect } from "react"

interface SidebarProps {
  onFolderSelect: (folder: string) => void
  currentFolder: string
  folders: string[]
}

export default function Sidebar({ onFolderSelect, currentFolder, folders }: SidebarProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [customFolders, setCustomFolders] = useState<{ name: string; path: string }[]>([])

  // Load custom folders from localStorage on mount
  useEffect(() => {
    const savedFolders = localStorage.getItem("fileManagerCustomFolders")
    if (savedFolders) {
      setCustomFolders(JSON.parse(savedFolders))
    }
  }, [])

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const folderPath = newFolderName.trim().toLowerCase().replace(/\s+/g, "-")
      const updatedFolders = [...customFolders, { name: newFolderName.trim(), path: folderPath }]

      setCustomFolders(updatedFolders)
      setNewFolderName("")
      setIsAddingFolder(false)

      // Save custom folders to localStorage
      localStorage.setItem("fileManagerCustomFolders", JSON.stringify(updatedFolders))
    }
  }

  // Combine system folders (from Blob) and custom folders
  const allFolders = [
    ...folders.map((folder) => ({
      name: folder.split("/").pop() || folder,
      path: folder,
    })),
    ...customFolders,
  ]

  // Remove duplicates
  const uniqueFolders = allFolders.filter(
    (folder, index, self) => index === self.findIndex((f) => f.path === folder.path),
  )

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Showpad</h1>
      </div>
      <nav className="sidebar-nav">
        <Link
          href="#"
          className={`nav-item ${currentFolder === "" ? "active" : ""}`}
          onClick={() => onFolderSelect("")}
        >
          <LayoutGrid className="nav-item-icon" />
          <span>All content</span>
        </Link>
        <Link href="#" className="nav-item">
          <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M15 3v18M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Presentations</span>
        </Link>
        <Link href="#" className="nav-item">
          <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-3 4v6m-3-3h6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Analytics</span>
        </Link>
        <div className="py-3">
          <div className="flex items-center justify-between px-3">
            <div className="text-xs font-medium uppercase text-gray-500">Collections</div>
            <button onClick={() => setIsAddingFolder(true)} title="collections" className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {isAddingFolder && (
            <div className="px-3 mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  autoFocus
                />
                <button onClick={handleAddFolder} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="mt-2">
            {uniqueFolders.map((folder) => (
              <div
                key={folder.path}
                className={`folder-item cursor-pointer ${currentFolder === folder.path ? "bg-gray-100" : ""}`}
                onClick={() => onFolderSelect(folder.path)}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

