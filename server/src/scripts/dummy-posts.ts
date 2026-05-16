import { faker } from "@faker-js/faker";
import { queryDb } from "@/db/connect";

const users = [
  { id: 19 },
  { id: 20 },
  { id: 21 },
  { id: 22 },
  { id: 23 },
  { id: 24 },
  { id: 25 },
  { id: 26 },
  { id: 27 },
  { id: 28 },
  { id: 29 },
  { id: 30 },
];

const squads = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
];

const techTags = [
  "react",
  "nextjs",
  "typescript",
  "nodejs",
  "postgresql",
  "docker",
  "kubernetes",
  "aws",
  "golang",
  "python",
  "nestjs",
  "mongodb",
  "redis",
  "system-design",
  "microservices",
  "graphql",
  "rest-api",
  "devops",
  "security",
  "ai",
];

type SeedPostsOptions = {
  postsPerSquad?: number;
};

const generateSlug = (title: string) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") +
    "-" +
    faker.string.alphanumeric(6).toLowerCase()
  );
};

const generatePostContent = () => {
  return `
# ${faker.hacker.phrase()}

${faker.lorem.paragraphs(2)}

## Key Concepts

${faker.lorem.paragraphs(3)}

## Real World Use Case

${faker.lorem.paragraphs(2)}

## Challenges

${faker.lorem.paragraphs(2)}

## Final Thoughts

${faker.lorem.paragraphs(2)}
  `;
};

export async function seedPosts({ postsPerSquad = 10 }: SeedPostsOptions = {}) {
  console.log("Seeding posts...");

  try {
    let totalInsertedPosts = 0;

    for (const squad of squads) {
      const posts = Array.from({
        length: postsPerSquad,
      }).map(() => {
        const title = faker.helpers.arrayElement([
          faker.hacker.phrase(),
          faker.company.catchPhrase(),
          faker.lorem.sentence(),
        ]);

        const randomAuthor = faker.helpers.arrayElement(users);

        return {
          title,
          slug: generateSlug(title),

          thumbnail: faker.image.urlPicsumPhotos({
            width: 1200,
            height: 630,
          }),

          tags: faker.helpers.arrayElements(
            techTags,
            faker.number.int({
              min: 2,
              max: 5,
            }),
          ),

          content: generatePostContent(),

          squad_id: squad.id,

          author_id: randomAuthor.id,
        };
      });

      for (const post of posts) {
        await queryDb(
          `
          INSERT INTO posts (
            title,
            slug,
            thumbnail,
            tags,
            content,
            squad_id,
            author_id
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
          )
          `,
          [
            post.title,
            post.slug,
            post.thumbnail,
            post.tags,
            post.content,
            post.squad_id,
            post.author_id,
          ],
        );
      }

      totalInsertedPosts += posts.length;

      console.log(`Inserted ${posts.length} posts into squad ${squad.id}`);
    }

    console.log(`Successfully inserted ${totalInsertedPosts} posts`);
  } catch (error) {
    console.error("Error while seeding posts:", error);
  }
}
