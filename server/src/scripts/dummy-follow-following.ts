import { queryDb } from "@/db/connect";
import { faker } from "@faker-js/faker";

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

export async function seedFollowers() {
  console.log("Seeding followers and follow notifications...");

  try {
    const createdRelationships = new Set<string>();

    for (const user of users) {
      const possibleUsersToFollow = users.filter(
        (targetUser) => targetUser.id !== user.id,
      );

      const shuffledUsers = faker.helpers.shuffle(possibleUsersToFollow);

      const totalFollowing = faker.number.int({
        min: 2,
        max: Math.min(8, shuffledUsers.length),
      });

      const selectedUsers = shuffledUsers.slice(0, totalFollowing);

      for (const targetUser of selectedUsers) {
        const relationshipKey = `${user.id}-${targetUser.id}`;

        if (createdRelationships.has(relationshipKey)) {
          continue;
        }

        createdRelationships.add(relationshipKey);

        await queryDb(
          `
          INSERT INTO followers (
            follower_id,
            followed_id
          )
          VALUES ($1, $2)
          ON CONFLICT (follower_id, followed_id)
          DO NOTHING
          `,
          [user.id, targetUser.id],
        );

        await queryDb(
          `
          INSERT INTO follow_notifications (
            user_id,
            actor_id,
            action_type,
            is_read
          )
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (user_id, actor_id, action_type)
          DO NOTHING
          `,
          [
            targetUser.id,
            user.id,
            "follow",
            faker.datatype.boolean({
              probability: 0.35,
            }),
          ],
        );

        console.log(`User ${user.id} followed user ${targetUser.id}`);
      }
    }

    console.log("Followers seeded successfully");
  } catch (error) {
    console.error("Error while seeding followers:", error);
  }
}
