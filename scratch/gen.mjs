import { execSync } from 'child_process';

console.log("Finding process on port 3000...");
try {
  const output = execSync('netstat -ano | findstr :3000').toString();
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('LISTENING')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') {
        console.log("Killing PID", pid);
        try {
            execSync(`taskkill /F /PID ${pid}`);
            console.log("Killed");
        } catch(e){
            console.log("Failed to kill", pid);
        }
      }
    }
  }
} catch(e) {
  console.log("No process on port 3000 or error:", e.message);
}

// wait 2 seconds
try {
    execSync('timeout /t 2 /nobreak > NUL');
} catch(e) {}

try {
  console.log("Starting prisma generate...");
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log("Success");
} catch(e) {
  console.log("Error:", e.message);
}
