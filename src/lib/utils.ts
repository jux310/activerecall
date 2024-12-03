/**
 * Splits a string into chunks of specified size
 */
export function chunk(text: string, size: number): string[] {
  const chunks: string[] = [];
  let index = 0;
  
  while (index < text.length) {
    // Find the last period before the chunk size to avoid splitting sentences
    let end = Math.min(index + size, text.length);
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      if (lastPeriod > index) {
        end = lastPeriod + 1;
      }
    }
    
    chunks.push(text.slice(index, end).trim());
    index = end;
  }
  
  return chunks;
}