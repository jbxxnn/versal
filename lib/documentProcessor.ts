import { OpenAIEmbeddings } from '@langchain/openai';
import { getPineconeIndex } from './pinecone';
import mammoth from 'mammoth';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'documents';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API_KEY,
  modelName: 'text-embedding-3-small',
  dimensions: 1536
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function processDocument(file: File): Promise<string> {
  const fileType = file.type;
  let text: string;
  // Generate a stable ID using file metadata, but clean it for Pinecone
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
  const documentId = `${cleanFileName}_${file.size}_${Date.now()}`;

  console.log('Processing file:', {
    name: file.name,
    type: fileType,
    size: file.size,
    documentId
  });

  try {
    // Extract text based on file type
    if (fileType === 'application/pdf') {
      const buffer = await file.arrayBuffer();
      const loader = new PDFLoader(new Blob([buffer]));
      const docs = await loader.load();
      text = docs.map((doc: Document) => doc.pageContent).join('\n');
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword') {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      text = result.value;
    } else if (fileType === 'text/plain' || 
               fileType === 'text/markdown' || 
               fileType === 'text/csv') {
      text = await file.text();
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text content extracted from file');
    }

    // Split text into chunks
    const chunks: Document[] = await textSplitter.createDocuments([text]);

    // Create embeddings for each chunk
    const vectors = await Promise.all(
      chunks.map(async (chunk: Document, index: number) => {
        const embedding = await embeddings.embedQuery(chunk.pageContent);
        return {
          id: `${documentId}-${index}`,
          values: embedding,
          metadata: {
            text: chunk.pageContent,
            filename: file.name,
            documentId,
            chunkIndex: index,
          },
        };
      })
    );

    // Store in Pinecone
    const index = await getPineconeIndex(PINECONE_INDEX_NAME);
    await index.upsert(vectors);
    
    console.log('Successfully processed and stored document in Pinecone');
    return documentId;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
} 