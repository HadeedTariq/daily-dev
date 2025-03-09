import { Worker } from "bullmq";

import dotenv from "dotenv";
dotenv.config();

import nodeMailer from "nodemailer";

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

export const emailWorker = new Worker(
  "emailQueue",
  async ({ data: { email, magicLink } }) => {
    console.log(`📨 Sending email to ${email}...`);
    console.log("Worker received a job:", email);

    try {
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: String(process.env.NODE_MAILER_USER),
          pass: String(process.env.NODE_MAILER_PASSWORD),
        },
      });

      const info = await transporter.sendMail({
        from: "hadeedtariq12@gmail.com",
        to: email,
        subject: "Verification email",
        html: `
      <h1></h1>Please verify your registeration on daily dev by clicking the verification link below:</h1>
      <a href="${magicLink}">${magicLink}</a>
      `,
      });
      console.log(`✅ Email sent to ${email}`);
    } catch (err) {
      console.log(err);
    }
  },
  { connection: redis }
);
emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

emailWorker.on("error", (err) => {
  console.error("❌ Worker error:", err);
});

console.log("Email worker started...");
