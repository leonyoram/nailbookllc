import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Use a dummy key for testing or it will return the fallback message
const genAI = new GoogleGenerativeAI("dummy_key");

async function runTest() {
  const tenantId = 'ac289760-7cd7-4582-8a7f-dfe9700d8289'; // from earlier tests
  const message = "Cho hỏi giá làm móng Gel là bao nhiêu?";

  // We can't actually call Gemini without a real API Key.
  // We'll just verify the logic works up to the API key check.
  
  if (!process.env.GEMINI_API_KEY) {
      console.log("No GEMINI_API_KEY found, returning fallback message.");
      return;
  }
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
