declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    info: any;
    metadata: any;
  }
  
  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export = pdf;
} 