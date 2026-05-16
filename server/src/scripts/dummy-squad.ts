import { queryDb } from "@/db/connect";
import { faker } from "@faker-js/faker";

const TOTAL_SQUADS = 20;

const existingUsers = [
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

const squadCategories = [
  "frontend",
  "backend",
  "full-stack",
  "devops",
  "data-science",
  "AI",
  "mobile",
  "cloud",
  "security",
  "quality-assurance",
  "general",
];

const postPermissions = ["members", "moderators"];

const squadRoles = ["member", "moderator"];

const squadNames = [
  "React Engineers",
  "Node Masters",
  "Cloud Architects",
  "AI Builders",
  "DevOps Warriors",
  "TypeScript Ninjas",
  "Backend Systems",
  "Frontend Collective",
  "Security Experts",
  "Mobile Innovators",
  "Data Wizards",
  "Full Stack Hub",
  "QA Engineers",
  "Open Source Crew",
  "System Designers",
  "Distributed Minds",
  "Platform Engineers",
  "Infra Builders",
  "NextJS Community",
  "Postgres Experts",
];

const generateHandle = (name: string) => {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") +
    "-" +
    faker.number.int({ min: 100, max: 999 })
  );
};

const getRandomMembers = (adminId: number) => {
  const shuffled = faker.helpers.shuffle(existingUsers);

  const totalMembers = faker.number.int({
    min: 4,
    max: existingUsers.length,
  });

  const selectedMembers = shuffled.slice(0, totalMembers);

  const alreadyExists = selectedMembers.find((member) => member.id === adminId);

  if (!alreadyExists) {
    selectedMembers.push({ id: adminId });
  }

  return selectedMembers;
};

export async function seedSquads() {
  console.log("Seeding squads...");

  try {
    for (let i = 0; i < TOTAL_SQUADS; i++) {
      const squadName = squadNames[i] || faker.company.name() + " Squad";

      const admin = faker.helpers.arrayElement(existingUsers);

      const squadHandle = generateHandle(squadName);

      const squadResult = await queryDb(
        `
        INSERT INTO squads (
          name,
          squad_handle,
          description,
          thumbnail,
          category,
          is_public,
          admin_id,
          post_creation_allowed_to,
          invitation_permission,
          post_approval_required
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
          $10
        )
        RETURNING id
        `,
        [
          squadName,
          squadHandle,
          faker.lorem.paragraph(),
          faker.image.urlPicsumPhotos(),
          faker.helpers.arrayElement(squadCategories),
          faker.datatype.boolean(),
          admin.id,
          faker.helpers.arrayElement(postPermissions),
          faker.helpers.arrayElement(postPermissions),
          faker.datatype.boolean(),
        ],
      );

      const squadId = squadResult.rows[0].id;

      await queryDb(
        `
        INSERT INTO squad_members (
          squad_id,
          user_id,
          role
        )
        VALUES ($1, $2, $3)
        `,
        [squadId, admin.id, "admin"],
      );

      const members = getRandomMembers(admin.id);

      for (const member of members) {
        if (member.id === admin.id) {
          continue;
        }

        await queryDb(
          `
          INSERT INTO squad_members (
            squad_id,
            user_id,
            role
          )
          VALUES ($1, $2, $3)
          `,
          [squadId, member.id, faker.helpers.arrayElement(squadRoles)],
        );
      }

      console.log(`Squad created: ${squadName} (${members.length} members)`);
    }

    console.log("Squads seeded successfully");
  } catch (error) {
    console.error("Error while seeding squads:", error);
  }
}
