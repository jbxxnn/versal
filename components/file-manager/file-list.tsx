"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search, Upload, FolderPlus, RefreshCw, Filter, ChevronLeft, ChevronRight } from "lucide-react"
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
  onUploadClick: () => void
  currentFolder: string
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
}

const ITEMS_PER_PAGE = 20

export default function FileList({
  files,
  activeTab,
  setActiveTab,
  selectedFiles,
  toggleFileSelection,
  selectAllFiles,
  onUploadClick,
  currentFolder,
  isLoading = false,
  error = null,
  onRefresh = () => {},
}: FileListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all")

  // Filter files based on search query and file type
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = (file.filename || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = fileTypeFilter === "all" || (file.type || '') === fileTypeFilter
      return matchesSearch && matchesType
    })
  }, [files, searchQuery, fileTypeFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentFiles = filteredFiles.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleFileTypeChange = (type: string) => {
    setFileTypeFilter(type)
    setCurrentPage(1)
  }

  const handleFileDelete = () => {
    onRefresh(); // Refresh the file list after deletion
  };

  return (
    <div className="content-area">
      <div className="content-header">
        <div className="flex items-center justify-between">
          <h1 className="content-title">{currentFolder ? `Folder: ${currentFolder}` : "All files"}</h1>
          <button onClick={onRefresh} title="All Files" className="p-2 rounded-md hover:bg-gray-100 text-gray-500" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
              onClick={onUploadClick}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button className="px-4 py-2 border border-[#e1e2e3] rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FolderPlus className="w-4 h-4" />
              <span>Create folder</span>
            </button>
          </div>
        </div>

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
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search files"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={fileTypeFilter}
                onChange={(e) => handleFileTypeChange(e.target.value)}
                aria-label="Filter by file type"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="docx">Word</option>
                <option value="xls">Excel</option>
                <option value="image">Images</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="files-table">
        {/* Table header */}
        <div className="table-header">
          <div className="mr-3">
            <Checkbox
              checked={selectedFiles.length === currentFiles.length && currentFiles.length > 0}
              onCheckedChange={selectAllFiles}
              aria-label="Select all files"
            />
          </div>
          <div className="flex-1 table-header-cell">File name</div>
          <div className="w-64 table-header-cell">Uploaded by</div>
          <div className="w-40 table-header-cell">Last modified</div>
          <div className="w-10"></div>
        </div>

        {/* Table body */}
        <div>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              <p>Loading files...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={onRefresh}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : currentFiles.length > 0 ? (
            currentFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                isSelected={selectedFiles.includes(file.id)}
                onSelect={() => toggleFileSelection(file.id)}
                onDelete={handleFileDelete}
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No files found. Upload some files to get started.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {currentFiles.length > 0 && (
          <div className="pagination">
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} of {filteredFiles.length} files
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

