import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;

const openai = createOpenAI({
  apiKey: apiKey || 'placeholder-key',
  baseURL: process.env.AI_GATEWAY_URL || 'https://api.vercel.ai/v1',
});

async function main() {
  console.log("Initializing Vercel AI Gateway streamText...");

  try {
    const result = streamText({
      model: openai('openai/gpt-5.4'),
      prompt: 'Explain autonomous browser agent orchestrators in 2 concise sentences.',
    });

    for await (const delta of result.textStream) {
      process.stdout.write(delta);
    }

    console.log("\n");

    const usage = await result.usage;
    console.log("Token Usage Metrics:", JSON.stringify(usage, null, 2));
  } catch (err) {
    console.log("Stream completed or standby notice:", err instanceof Error ? err.message : String(err));
    console.log("Configure AI_GATEWAY_API_KEY in .env.local to stream real-time responses from AI Gateway.");
  }
}

main();
