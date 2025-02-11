import { Worker } from "bullmq";

import nodeMailer from "nodemailer";

const connection = { host: "127.0.0.1", port: 6379 };

export const emailWorker = new Worker(
  "emailQueue",
  async ({ data: { email, magicLink } }) => {
    console.log(`📨 Sending email to ${email}...`);

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
  { connection }
);

console.log("Email worker started...");
