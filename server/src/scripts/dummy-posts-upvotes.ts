import { queryDb } from "@/db/connect";
import { faker } from "@faker-js/faker";

const existingPosts = [
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
];

export async function seedPostStats() {
  console.log("Seeding post views and upvotes...");

  try {
    for (const post of existingPosts) {
      const views = faker.number.int({
        min: 20,
        max: 50000,
      });

      const upvotes = faker.number.int({
        min: 0,
        max: Math.floor(views * 0.35),
      });

      await queryDb(
        `
        INSERT INTO post_views (
          post_id,
          views
        )
        VALUES ($1, $2)
        ON CONFLICT (post_id)
        DO NOTHING
        `,
        [post.id, views],
      );

      await queryDb(
        `
        INSERT INTO post_upvotes (
          post_id,
          upvotes
        )
        VALUES ($1, $2)
        ON CONFLICT (post_id)
        DO NOTHING
        `,
        [post.id, upvotes],
      );

      console.log(`Post ${post.id} => ${views} views, ${upvotes} upvotes`);
    }

    console.log("Post stats seeded successfully");
  } catch (error) {
    console.error("Error while seeding post stats:", error);
  }
}
