export interface User {
  name: string
  email: string
  avatar: string
}

export interface FileData {
  id: string;
  document_id: string;
  filename: string;
  url: string;
  created_at: string;
  updated_at: string;
  type?: string;
  size?: string;
  lastModified?: string;
  uploadedBy?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

