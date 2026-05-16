import { queryDb } from "@/db/connect";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const TOTAL_USERS = 10;
const SALT_ROUNDS = 16;

const generateUsername = (name: string) => {
  return (
    name.toLowerCase().replace(/\s+/g, "") +
    faker.number.int({ min: 100, max: 999 })
  );
};

const generateSocialLink = (platform: string, username: string): string => {
  switch (platform) {
    case "github":
      return `https://github.com/${username}`;

    case "linkedin":
      return `https://linkedin.com/in/${username}`;

    case "website":
      return `https://${username}.dev`;

    case "x":
      return `https://x.com/${username}`;

    case "youtube":
      return `https://youtube.com/@${username}`;

    case "stack_overflow":
      return `https://stackoverflow.com/users/${faker.number.int({
        min: 10000,
        max: 99999,
      })}/${username}`;

    case "reddit":
      return `https://reddit.com/u/${username}`;

    case "roadmap_sh":
      return `https://roadmap.sh/u/${username}`;

    case "codepen":
      return `https://codepen.io/${username}`;

    case "mastodon":
      return `https://mastodon.social/@${username}`;

    case "threads":
      return `https://threads.net/@${username}`;

    default:
      return "";
  }
};

const professions = [
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "DevOps Engineer",
  "AI Engineer",
  "Data Engineer",
  "Mobile Developer",
  "Cloud Engineer",
  "Cybersecurity Engineer",
  "Full Stack Developer",
];

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Meta",
  "OpenAI",
  "Stripe",
  "Vercel",
  "Cloudflare",
  "DigitalOcean",
];

const bios = [
  "Building scalable systems and exploring distributed architectures.",
  "Passionate about backend engineering and clean system design.",
  "Focused on cloud-native applications and developer experience.",
  "Love working with TypeScript, PostgreSQL, and modern web stacks.",
  "Exploring AI systems, infrastructure, and high-performance APIs.",
];

export const insertDummyUsers = async () => {
  try {
    for (let i = 0; i < TOTAL_USERS; i++) {
      const fullName = faker.person.fullName();
      const username = generateUsername(fullName);

      const profession = faker.helpers.arrayElement(professions);

      const email = faker.internet.email({
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ")[1] || "",
      });

      const password = "Sam@12345";

      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const avatar = faker.image.avatar();

      const userResult = await queryDb(
        `
        INSERT INTO users (
          name,
          username,
          avatar,
          email,
          profession,
          user_password,
          refresh_token,
          is_verified
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `,
        [fullName, username, avatar, email, profession, hashPassword, "", true],
      );

      const userId = userResult.rows[0].id;

      await queryDb(
        `
        INSERT INTO about (
          user_id,
          bio,
          company,
          readme,
          job_title
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          userId,
          faker.helpers.arrayElement(bios),
          faker.helpers.arrayElement(companies),
          faker.lorem.paragraphs(3),
          profession,
        ],
      );

      await queryDb(
        `
        INSERT INTO social_links (
          user_id,
          github,
          linkedin,
          website,
          x,
          youtube,
          stack_overflow,
          reddit,
          roadmap_sh,
          codepen,
          mastodon,
          threads
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12
        )
        `,
        [
          userId,
          generateSocialLink("github", username),
          generateSocialLink("linkedin", username),
          generateSocialLink("website", username),
          generateSocialLink("x", username),
          generateSocialLink("youtube", username),
          generateSocialLink("stack_overflow", username),
          generateSocialLink("reddit", username),
          generateSocialLink("roadmap_sh", username),
          generateSocialLink("codepen", username),
          generateSocialLink("mastodon", username),
          generateSocialLink("threads", username),
        ],
      );

      await queryDb(
        `
        INSERT INTO user_stats (
          followers,
          following,
          reputation,
          views,
          upvotes,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          faker.number.int({ min: 0, max: 10000 }),
          faker.number.int({ min: 0, max: 5000 }),
          faker.number.int({ min: 0, max: 50000 }),
          faker.number.int({ min: 0, max: 200000 }),
          faker.number.int({ min: 0, max: 25000 }),
          userId,
        ],
      );

      const streakLength = faker.number.int({
        min: 1,
        max: 365,
      });

      await queryDb(
        `
        INSERT INTO streaks (
          user_id,
          streak_start,
          streak_end,
          updated_at,
          streak_length,
          longest_streak
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          userId,
          faker.date.past(),
          faker.date.recent(),
          new Date(),
          streakLength,
          faker.number.int({
            min: streakLength,
            max: streakLength + 200,
          }),
        ],
      );

      console.log(`User ${i + 1} inserted`);
    }

    console.log("Dummy users inserted successfully");
  } catch (error) {
    console.error("Error inserting dummy users:", error);
  }
};
