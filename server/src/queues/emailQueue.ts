import { Queue } from "bullmq";
const connection = { host: "127.0.0.1", port: 6379 };

const emailQueue = new Queue("emailQueue", { connection });

async function addEmailJob(email: string, magicLink: string) {
  await emailQueue.add("sendEmail", { email, magicLink });
}

export { addEmailJob };
