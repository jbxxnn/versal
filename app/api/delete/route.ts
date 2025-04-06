import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { getPineconeIndex } from '@/lib/pinecone';
import { deleteDocument } from '@/lib/documentService';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename');
    const documentId = searchParams.get('documentId');

    if (!url || !filename || !documentId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Delete from Vercel Blob storage
    await del(url);

    // Delete from Pinecone using documentId
    const index = await getPineconeIndex(process.env.PINECONE_INDEX_NAME || 'documents');
    
    // Get all vectors with the matching documentId
    const queryResponse = await index.query({
      vector: new Array(1536).fill(0), // Dummy vector since we're using filter
      filter: { documentId },
      topK: 1000, // Adjust based on your needs
      includeMetadata: true,
    });

    // Delete vectors one by one to avoid issues with special characters
    for (const match of queryResponse.matches) {
      try {
        await index.deleteOne(match.id);
      } catch (error) {
        console.error(`Failed to delete vector ${match.id}:`, error);
      }
    }

    // Delete document metadata
    await deleteDocument(documentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 