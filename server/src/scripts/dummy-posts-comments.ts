import { queryDb } from "@/db/connect";
import { faker } from "@faker-js/faker";

const existingUsers = [
  { id: 19 },
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
  { id: 20 },
];

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
  { id: 16 },
  { id: 17 },
  { id: 18 },
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
  { id: 31 },
  { id: 32 },
  { id: 33 },
  { id: 34 },
  { id: 35 },
  { id: 36 },
  { id: 37 },
  { id: 38 },
  { id: 39 },
  { id: 40 },
  { id: 41 },
  { id: 42 },
  { id: 43 },
  { id: 58 },
  { id: 44 },
  { id: 45 },
  { id: 46 },
  { id: 47 },
  { id: 48 },
  { id: 59 },
  { id: 60 },
  { id: 104 },
  { id: 105 },
  { id: 293 },
  { id: 49 },
  { id: 50 },
  { id: 51 },
  { id: 52 },
  { id: 53 },
  { id: 54 },
  { id: 55 },
  { id: 56 },
  { id: 57 },
  { id: 61 },
  { id: 62 },
  { id: 63 },
  { id: 64 },
  { id: 65 },
  { id: 66 },
  { id: 67 },
  { id: 68 },
  { id: 69 },
  { id: 70 },
  { id: 71 },
  { id: 72 },
  { id: 96 },
  { id: 97 },
  { id: 73 },
  { id: 74 },
  { id: 75 },
  { id: 76 },
  { id: 77 },
  { id: 78 },
  { id: 79 },
  { id: 80 },
  { id: 81 },
  { id: 98 },
  { id: 82 },
  { id: 83 },
  { id: 84 },
  { id: 85 },
  { id: 86 },
  { id: 99 },
  { id: 100 },
  { id: 101 },
  { id: 102 },
  { id: 103 },
  { id: 87 },
  { id: 88 },
  { id: 89 },
];

const generateCommentContent = () => {
  return faker.helpers.arrayElement([
    faker.lorem.sentences(1),
    faker.lorem.sentences(2),
    faker.hacker.phrase(),
    "This is actually a really good point.",
    "I faced the same issue recently.",
    "Can you explain this part a bit more?",
    "This helped me a lot. Thanks.",
    "Interesting approach honestly.",
    "I think there is a better way to optimize this.",
    "This architecture looks clean.",
    "PostgreSQL handles this very well.",
    "The scalability aspect here is important.",
    "This is underrated.",
    "The system design behind this is solid.",
  ]);
};

export async function seedPostComments() {
  console.log("Seeding post comments, replies and upvotes...");

  try {
    for (const post of existingPosts) {
      const totalComments = faker.number.int({
        min: 2,
        max: 15,
      });

      const createdComments: number[] = [];

      for (let i = 0; i < totalComments; i++) {
        const commentUser = faker.helpers.arrayElement(existingUsers);

        const commentResult = await queryDb(
          `
          INSERT INTO post_comments (
            post_id,
            user_id,
            content,
            edited
          )
          VALUES ($1, $2, $3, $4)
          RETURNING id
          `,
          [
            post.id,
            commentUser.id,
            generateCommentContent(),
            faker.datatype.boolean({
              probability: 0.15,
            }),
          ],
        );

        const commentId = commentResult.rows[0].id;

        createdComments.push(commentId);

        const shuffledUsers = faker.helpers.shuffle(existingUsers);

        const totalUpvotes = faker.number.int({
          min: 0,
          max: Math.min(6, existingUsers.length),
        });

        const selectedUpvoteUsers = shuffledUsers.slice(0, totalUpvotes);

        for (const upvoteUser of selectedUpvoteUsers) {
          await queryDb(
            `
            INSERT INTO comment_upvotes (
              comment_id,
              user_id
            )
            VALUES ($1, $2)
            ON CONFLICT (comment_id, user_id)
            DO NOTHING
            `,
            [commentId, upvoteUser.id],
          );
        }

        const totalReplies = faker.number.int({
          min: 0,
          max: 5,
        });

        for (let j = 0; j < totalReplies; j++) {
          const sender = faker.helpers.arrayElement(existingUsers);

          const possibleRecipients = existingUsers.filter(
            (user) => user.id !== sender.id,
          );

          const recipient =
            possibleRecipients.length > 0
              ? faker.helpers.arrayElement(possibleRecipients)
              : null;

          await queryDb(
            `
            INSERT INTO comment_replies (
              comment_id,
              sender_id,
              recipient_id,
              content,
              edited
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
              commentId,
              sender.id,
              recipient?.id || null,
              generateCommentContent(),
              faker.datatype.boolean({
                probability: 0.1,
              }),
            ],
          );
        }
      }

      console.log(
        `Post ${post.id} => ${createdComments.length} comments created`,
      );
    }

    console.log("Post comments seeded successfully");
  } catch (error) {
    console.error("Error while seeding post comments:", error);
  }
}
