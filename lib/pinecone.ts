import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('Pinecone API key is missing');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

export const getPineconeIndex = async (indexName: string) => {
  try {
    // Check if index exists
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some((index: { name: string }) => index.name === indexName) ?? false;

    if (!indexExists) {
      console.log(`Creating index ${indexName}...`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embeddings dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });

      // Wait for index to be ready
      let indexReady = false;
      while (!indexReady) {
        try {
          const index = pinecone.Index(indexName);
          await index.describeIndexStats();
          indexReady = true;
        } catch (e) {
          console.log('Waiting for index to be ready...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    return pinecone.Index(indexName);
  } catch (error) {
    console.error('Error getting Pinecone index:', error);
    throw error;
  }
}; 