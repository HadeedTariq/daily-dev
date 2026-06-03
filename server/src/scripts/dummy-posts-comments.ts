import { queryDb } from "@/db/connect";
import { faker } from "@faker-js/faker";

const existingUsers = [
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
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
