import pdfParse from 'pdf-parse';

interface PDFParseProgress {
  currentPage: number;
  totalPages: number;
  percentComplete: number;
}

export async function parsePDFWithProgress(
  fileBuffer: Buffer,
  onProgress?: (progress: PDFParseProgress) => void
): Promise<string> {
  try {
    // Get PDF info first (for progress tracking)
    const basicInfo = await pdfParse(fileBuffer, { max: 1 });
    const totalPages = basicInfo.numpages;
    
    let fullText = '';
    
    // Parse page by page for progress tracking
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageData = await pdfParse(fileBuffer, {
        pagerender: (pageData: any) => {
          return pageData.getTextContent().then((textContent: any) => {
            let pageText = '';
            let lastY: number | undefined;
            
            for (const item of textContent.items) {
              if (lastY !== item.transform[5] && pageText) {
                pageText += '\n';
              } else if (lastY === item.transform[5] && pageText) {
                pageText += ' ';
              }
              pageText += item.str;
              lastY = item.transform[5];
            }
            return pageText;
          });
        }
      });
      
      fullText += pageData.text + '\n';
      
      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages: totalPages,
          percentComplete: (pageNum / totalPages) * 100
        });
      }
    }
    
    // Clean text
    let cleanedText = fullText
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .trim();
    
    // Limit length
    const maxLength = 50000;
    if (cleanedText.length > maxLength) {
      cleanedText = cleanedText.substring(0, maxLength);
    }
    
    return cleanedText;
    
  } catch (error) {
    console.error("Enhanced PDF parsing error:", error);
    throw error;
  }
}