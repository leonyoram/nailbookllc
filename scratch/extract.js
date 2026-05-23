const fs = require('fs');

const logContent = fs.readFileSync('C:\\Users\\leony\\.gemini\\antigravity\\brain\\f240e52b-85eb-4d4b-8907-28d97d3b8232\\.system_generated\\logs\\overview.txt', 'utf8');

// The file was viewed: <viewed_file> ... lines_viewed>1-474</lines_viewed>
// But wait, the raw logs might contain the output of view_file.
// Let's just find the first occurrence of `File Path: `file:///d:/Antigravity/src/app/%28customer%29/%5BtenantSlug%5D/admin/staff/page.tsx`` and extract the lines.

const lines = logContent.split('\n');
let extractedLines = [];
let isCapturing = false;

for (const line of lines) {
  if (line.includes('File Path: `file:///d:/Antigravity/src/app/%28customer%29/%5BtenantSlug%5D/admin/staff/page.tsx`')) {
    isCapturing = true;
    extractedLines = []; // Reset to get the latest view if there are multiple
  }
  
  if (isCapturing) {
    if (line.match(/^\d+:/)) {
      extractedLines.push(line.replace(/^\d+:\s/, ''));
    } else if (line.includes('The above content does NOT show the entire file contents') || line.includes('The above content shows the entire')) {
      isCapturing = false;
      // We might have captured a chunk, let's keep it if it's the right one.
      // Actually we just want the lines after line 316.
    }
  }
}

fs.writeFileSync('d:/Antigravity/scratch/extracted.tsx', extractedLines.join('\n'));
console.log('Extracted', extractedLines.length, 'lines');
