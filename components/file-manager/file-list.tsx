"use client"

import { ChevronDown, Search } from "lucide-react"
import FileRow from "./file-row"
import type { FileData } from "./types"
import { Checkbox } from "@/components/ui/checkbox"

interface FileListProps {
  files: FileData[]
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedFiles: string[]
  toggleFileSelection: (fileId: string) => void
  selectAllFiles: () => void
}

export default function FileList({
  files,
  activeTab,
  setActiveTab,
  selectedFiles,
  toggleFileSelection,
  selectAllFiles,
}: FileListProps) {
  return (
    <div className="content-area">
      <div className="content-header">
        <h1 className="content-title">All files</h1>
        <div className="filter-bar">
          <div className="filter-tabs">
            <button className={`filter-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
              View all
            </button>
            <button
              className={`filter-tab ${activeTab === "documents" ? "active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
            <button
              className={`filter-tab ${activeTab === "spreadsheets" ? "active" : ""}`}
              onClick={() => setActiveTab("spreadsheets")}
            >
              Spreadsheets
            </button>
            <button
              className={`filter-tab ${activeTab === "pdfs" ? "active" : ""}`}
              onClick={() => setActiveTab("pdfs")}
            >
              PDFs
            </button>
            <button
              className={`filter-tab ${activeTab === "images" ? "active" : ""}`}
              onClick={() => setActiveTab("images")}
            >
              Images
            </button>
          </div>
          <div className="filter-actions">
            <div className="relative w-64">
              <Search className="search-icon" />
              <input type="search" placeholder="Search" className="search-input" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <span>Filters</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="files-table">
        {/* Table header */}
        <div className="table-header">
          <div className="mr-3">
            <Checkbox
              checked={selectedFiles.length === files.length && files.length > 0}
              onCheckedChange={selectAllFiles}
            />
          </div>
          <div className="flex-1 table-header-cell">File name</div>
          <div className="w-64 table-header-cell">Uploaded by</div>
          <div className="w-40 table-header-cell">Last modified</div>
          <div className="w-10"></div>
        </div>

        {/* Table body */}
        <div>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={() => toggleFileSelection(file.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="flex items-center space-x-2">
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button">4</button>
          </div>
        </div>
      </div>
    </div>
  )
}

