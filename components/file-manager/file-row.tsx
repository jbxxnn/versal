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

interface FileRowProps {
  file: FileData
  isSelected: boolean
  onSelect: () => void
}

export default function FileRow({ file, isSelected, onSelect }: FileRowProps) {
  return (
    <div className="file-row">
      <div className="flex items-center w-full">
        <div className="mr-3">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </div>
        <div className="flex items-center gap-3 flex-1">
          <div className="file-icon-container">
            <FileIcon type={file.type} />
          </div>
          <div className="file-details">
            <p className="file-name">{file.name}</p>
            <p className="file-meta">
              {file.size} • {file.type}
            </p>
          </div>
        </div>
        <div className="uploader">
          <Image
            src={file.uploadedBy.avatar || "/placeholder.svg"}
            alt={file.uploadedBy.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="uploader-details">
            <p className="uploader-name">{file.uploadedBy.name}</p>
            <p className="uploader-email">{file.uploadedBy.email}</p>
          </div>
        </div>
        <div className="modified-date">{file.lastModified}</div>
        <div className="actions-menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </button>
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

