import { presetTaskStatuses } from '../src/constants/presetTaskStatuses';
import { faker } from '@faker-js/faker';
import {
  PrismaClient,
  ProjectStatus,
  TaskPriority,
  UserRole,
  UserStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const numOfUsers = 10;
  const numOfWorkspaces = 5;
  const numOfProjectsPerWorkspace = 3;
  const numOfTasksPerteamspace = 10;
  const teamspaceNames = ['Engineering', 'Design', 'Marketing'];

  const users = [];
  const generatedEmails = new Set();

  for (let i = 0; i < numOfUsers; i++) {
    let email =
      i === 0 && process.env.SEED_EMAIL
        ? process.env.SEED_EMAIL
        : faker.internet.email();

    while (generatedEmails.has(email)) {
      email = faker.internet.email();
    }
    generatedEmails.add(email);

    const user = await prisma.user.create({
      data: {
        email: email,
        profilePicture: faker.image.avatar(),
        status: UserStatus.COMPLETE,
      },
    });
    users.push(user);
  }

  for (let i = 0; i < numOfWorkspaces; i++) {
    const companyName = faker.company.name();
    const workspace = await prisma.workspace.create({
      data: {
        name: companyName,
        description: faker.company.catchPhrase(),
        urlSlug: faker.helpers
          .slugify(companyName)
          .toLowerCase()
          .replace(/-+/g, '-'),
      },
    });

    for (const user of users) {
      await prisma.userWorkspace.create({
        data: {
          userName: faker.person.fullName(),
          workspaceId: workspace.id,
          userId: user.id,
          role: users.indexOf(user) === 0 ? UserRole.ADMIN : UserRole.BASIC,
        },
      });
    }

    for (let j = 0; j < numOfProjectsPerWorkspace; j++) {
      await prisma.project.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          workspaceId: workspace.id,
          status: faker.helpers.arrayElement(Object.values(ProjectStatus)),
        },
      });
    }

    const seedUser =
      users.find((u) => u.email === process.env.SEED_EMAIL) || users[0];

    for (const name of teamspaceNames) {
      const teamspace = await prisma.teamspace.create({
        data: {
          name: name,
          acronym: name.substring(0, 3).toUpperCase(),
          workspaceId: workspace.id,
          description: faker.company.buzzNoun(),
        },
      });

      const taskStatusIds = [];

      for (const status of presetTaskStatuses) {
        const createdStatus = await prisma.taskStatus.create({
          data: {
            name: status.name,
            index: status.index,
            description: status.description,
            teamspaceId: teamspace.id,
          },
        });
        taskStatusIds.push(createdStatus.id);
      }

      await prisma.userTeamspace.create({
        data: {
          userId: seedUser.id,
          teamspaceId: teamspace.id,
          role: UserRole.ADMIN,
        },
      });

      for (let k = 0; k < numOfTasksPerteamspace; k++) {
        await prisma.task.create({
          data: {
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            statusId: faker.helpers.arrayElement(taskStatusIds),
            priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
            dueDate: faker.date.future(),
            assignedTo: faker.helpers.arrayElement(users).id,
            teamspaceId: teamspace.id,
          },
        });
      }
    }
  }

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
