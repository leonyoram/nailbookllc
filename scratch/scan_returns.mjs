import fs from 'fs';
import path from 'path';

const actionsDir = 'd:/Antigravity/src/actions';
const files = fs.readdirSync(actionsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(actionsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // 1. Look for `return await prisma...`
    if (line.match(/return\s+await\s+prisma\.\w+\.(findMany|findUnique|findFirst|create|update)/)) {
      console.log(`[RETURN RAW PRISMA] ${file}:${index + 1}: ${line.trim()}`);
    }
    
    // 2. Look for returning variables that might be Prisma results
    // Example: return { success: true, promotion: promo }
    // This is harder to grep, but we can look for `return {`
  });
}
