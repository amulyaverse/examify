import * as pdfParse from 'pdf-parse';

export async function parsePDF(fileBuffer: Buffer): Promise<string> {
  try {
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      throw new Error(`PDF too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    }
    
    console.log(`Parsing PDF of size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    
    const options = {
      max: 100, // Max pages to parse
      version: 'v1.10.100'
    };
    
    const data = await pdfParse(fileBuffer, options);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("No text could be extracted from PDF");
    }
    
    // Clean the text
    let cleanedText = data.text
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .replace(/[^\x20-\x7E\n]/g, ' ') // Remove weird characters
      .trim();
    
    // Limit text length (OpenAI has token limits)
    const maxLength = 50000;
    if (cleanedText.length > maxLength) {
      console.warn(`PDF text truncated from ${cleanedText.length} to ${maxLength} characters`);
      cleanedText = cleanedText.substring(0, maxLength);
    }
    
    console.log(`Extracted ${data.numpages} pages, ${cleanedText.length} characters`);
    return cleanedText;
    
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}