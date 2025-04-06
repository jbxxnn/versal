import { supabase } from './supabase';

export interface Document {
  id: string;
  document_id: string;
  filename: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export async function createDocument(documentId: string, filename: string, url: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        document_id: documentId,
        filename,
        url,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getDocumentByUrl(url: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('url', url)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('document_id', documentId);

  if (error) {
    throw error;
  }
} 