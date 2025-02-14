import { redis } from "@/db/connect";
import { Queue } from "bullmq";

const emailQueue = new Queue("emailQueue", { connection: redis });

async function addEmailJob(email: string, magicLink: string) {
  await emailQueue.add("sendEmail", { email, magicLink });
}

export { addEmailJob };
