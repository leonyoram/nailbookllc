import fs from 'fs';
import path from 'path';

const actionsDir = 'd:/Antigravity/src/actions';
const files = fs.readdirSync(actionsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(actionsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // 2. Look for `return { success: true, obj }` without JSON.parse
    if (line.match(/return\s+\{.*success:\s*true.*,[^}]*\}/) && !line.includes('JSON.parse')) {
      // It might be returning a raw object.
      // Exclude simple returns like `return { success: true, count: X }`
      if (!line.match(/return\s+\{.*success:\s*true,\s*(count|id|message|url|token):\s*.*\}$/)) {
        console.log(`[RETURN OBJECT] ${file}:${index + 1}: ${line.trim()}`);
      }
    }
    
    // 3. Look for plain `return X;` where X is returned from Prisma
    if (line.match(/return\s+[a-zA-Z0-9]+;/) && !line.includes('return true') && !line.includes('return false') && !line.includes('return null') && !line.includes('return []')) {
       // Too noisy, maybe just search for Prisma schema mismatch
    }
  });
}
