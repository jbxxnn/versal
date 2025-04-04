import { File, FileSpreadsheet, FileText } from "lucide-react"

interface FileIconProps {
  type: string
}

export default function FileIcon({ type }: FileIconProps) {
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

