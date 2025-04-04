"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Bell,
  ChevronDown,
  Download,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  Grid,
  LayoutGrid,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { Switch } from "@/components/ui/switch"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg", active && "bg-gray-100")}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

function FolderItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <span>{children}</span>
    </Link>
  )
}

function FileIcon({ type }: { type: string }) {
  switch (type) {
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "pdf":
      return <File className="h-5 w-5 text-red-500" />
    case "xls":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

function FileRow({
  file,
  isSelected,
  onSelect,
}: {
  file: {
    name: string
    size: string
    type: string
    uploadedBy: { name: string; email: string; avatar: string }
    lastModified: string
  }
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <div className="group flex items-center py-3 px-4 hover:bg-gray-50 border-b border-[#e1e2e3]">
      <div className="flex items-center w-full">
        <div className="mr-3">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </div>
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-gray-100 rounded-full p-2">
            <FileIcon type={file.type} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-normal text-sm text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {file.size} • {file.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-64">
          <Image
            src={file.uploadedBy.avatar || "/placeholder.svg?height=32&width=32"}
            alt={file.uploadedBy.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="min-w-0 flex-1">
            <p className="font-normal text-sm text-gray-900 truncate">{file.uploadedBy.name}</p>
            <p className="text-xs text-gray-500 truncate">{file.uploadedBy.email}</p>
          </div>
        </div>
        <div className="w-40 text-gray-500">{file.lastModified}</div>
        <div className="opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Open in browser</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Available offline</span>
                  </div>
                  <Switch />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete file</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default function FileManager() {
  // Mock data for the file list
  const files = [
    {
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
  ]

  return (
    <div className="flex h-screen bg-[#e1e2e3]">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#e1e2e3] bg-white font-mono">
        <div className="p-4">
          <h1 className="text-xl font-bold">Showpad</h1>
        </div>
        <nav className="space-y-1 px-2">
          <NavItem href="#" icon={<LayoutGrid className="h-4 w-4" />} active>
            All content
          </NavItem>
          <NavItem
            href="#"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M15 3v18M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          >
            Presentations
          </NavItem>
          <NavItem
            href="#"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-3 4v6m-3-3h6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            Analytics
          </NavItem>
          <div className="py-3">
            <div className="px-3 text-xs font-medium uppercase text-gray-500">Collections</div>
            <div className="mt-2">
              <FolderItem href="#">Product Demos</FolderItem>
              <FolderItem href="#">Case Studies</FolderItem>
              <FolderItem href="#">Sales Collateral</FolderItem>
              <FolderItem href="#">Training Materials</FolderItem>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-white font-mono">
        <header className="flex items-center justify-between border-b border-[#e1e2e3] px-6 py-4">
          <div className="w-96">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search files..." className="pl-9" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Avatar"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-lg font-medium mb-4">All files</h1>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" className="bg-white">
                    View all
                  </Button>
                  <Button variant="ghost">Documents</Button>
                  <Button variant="ghost">Spreadsheets</Button>
                  <Button variant="ghost">PDFs</Button>
                  <Button variant="ghost">Images</Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search" className="pl-9" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <span>Filters</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e1e2e3] rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="flex items-center py-3 px-4 bg-[#e1e2e3] border-b border-[#e1e2e3]">
                <div className="flex items-center w-full">
                  <div className="mr-3">
                    <Checkbox />
                  </div>
                  <div className="flex-1 font-medium text-gray-500">File name</div>
                  <div className="w-64 font-medium text-gray-500">Uploaded by</div>
                  <div className="w-40 font-medium text-gray-500">Last modified</div>
                  <div className="w-10"></div>
                </div>
              </div>

              {/* Table body */}
              <div>
                {files.map((file, index) => (
                  <FileRow key={index} file={file} isSelected={false} onSelect={() => {}} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center py-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-[#e1e2e3] font-mono text-xs">
                    1
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 font-mono text-xs">
                    2
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 font-mono text-xs">
                    3
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 font-mono text-xs">
                    4
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

