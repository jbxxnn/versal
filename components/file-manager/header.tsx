import { Bell, Grid, Search } from "lucide-react"
import Image from "next/image"

export default function Header() {
  return (
    <header className="header">
      <div className="search-container">
        <Search className="search-icon" />
        <input type="search" placeholder="Search files..." className="search-input" />
      </div>
      <div className="header-actions">
        <button className="p-2 rounded-md hover:bg-gray-100">
          <Grid className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100">
          <Bell className="w-4 h-4" />
        </button>
        <div className="avatar">
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
  )
}

