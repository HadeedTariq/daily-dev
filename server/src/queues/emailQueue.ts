import { redis } from "@/db/connect";
import { Queue } from "bullmq";

const emailQueue = new Queue("emailQueue", { connection: redis });

async function addEmailJob(email: string, magicLink: string) {
  try {
    console.log("🚀 Adding job to queue...");
    const job = await emailQueue.add(
      "sendEmail",
      { email, magicLink },
      { delay: 5000 }
    );

    console.log(`✅ Job added successfully with ID: ${job.id}`);
  } catch (error) {
    console.error("❌ Error adding job:", error);
  }
}

export { addEmailJob };
