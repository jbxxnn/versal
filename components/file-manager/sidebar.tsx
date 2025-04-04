import Link from "next/link"
import { LayoutGrid } from "lucide-react"

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Showpad</h1>
      </div>
      <nav className="sidebar-nav">
        <Link href="#" className="nav-item active">
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
          <div className="collections-title">Collections</div>
          <div className="mt-2">
            <Link href="#" className="folder-item">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span>Product Demos</span>
            </Link>
            <Link href="#" className="folder-item">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span>Case Studies</span>
            </Link>
            <Link href="#" className="folder-item">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span>Sales Collateral</span>
            </Link>
            <Link href="#" className="folder-item">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span>Training Materials</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

