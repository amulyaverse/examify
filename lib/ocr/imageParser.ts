import { createWorker } from 'tesseract.js';

export async function parseImage(fileBuffer: Buffer): Promise<string> {
  let worker = null;
  
  try {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      throw new Error(`Image too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    }
    
    console.log(`Processing image of size: ${(fileBuffer.length / 1024).toFixed(2)}KB`);
    
    // Create Tesseract worker
    worker = await createWorker('eng');
    
    // Convert buffer to base64
    const base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`;
    
    // Recognize text
    const { data } = await worker.recognize(base64Image);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("No text could be extracted from image");
    }
    
    // Clean the text
    let cleanedText = data.text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .trim();
    
    console.log(`Extracted ${cleanedText.length} characters from image`);
    return cleanedText;
    
  } catch (error) {
    console.error("Image parsing error:", error);
    throw new Error(`Failed to parse image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}