export interface User {
  name: string
  email: string
  avatar: string
}

export interface FileData {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: User
  lastModified: string
}

