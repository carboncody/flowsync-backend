import { PrismaClient, TaskStatus, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const numOfUsers = 10;
  const numOfWorkspaces = 5;
  const numOfProjectsPerWorkspace = 3;
  const numOfListsPerProject = 3;
  const numOfTasksPerList = 5;

  const users = [];
  const generatedEmails = new Set();

  for (let i = 0; i < numOfUsers; i++) {
    let email = i === 0 && process.env.SEED_EMAIL ? process.env.SEED_EMAIL : faker.internet.email();

    while (generatedEmails.has(email)) {
      email = faker.internet.email();
    }
    generatedEmails.add(email);
    const user = await prisma.user.create({
      data: {
        email: email,
        profilePicture: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  for (let i = 0; i < numOfWorkspaces; i++) {
    const workspace = await prisma.workspace.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
      },
    });

    for (const user of users) {
      await prisma.userWorkspace.create({
        data: {
          userName: faker.person.firstName() + ' ' + faker.person.lastName(),
          workspaceId: workspace.id,
          userId: user.id,
          role: users.indexOf(user) === 0 ? UserRole.ADMIN : UserRole.BASIC,
        },
      });
    }

    for (let j = 0; j < numOfProjectsPerWorkspace; j++) {
      const project = await prisma.project.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          workspaceId: workspace.id,
          status: faker.helpers.arrayElement([
            'PLANNING',
            'ACTIVE',
            'ON_HOLD',
            'COMPLETED',
            'CANCELLED',
          ]),
        },
      });


        for (let l = 0; l < numOfTasksPerList; l++) {
          await prisma.task.create({
            data: {
              title: faker.lorem.sentence(),
              description: faker.lorem.paragraph(),
              workspaceId: workspace.id,
              projectId: project.id,
              status: faker.helpers.arrayElement([
                'TODO',
                'IN_PROGRESS',
                'BLOCKED',
                'REVIEW',
                'DONE',
              ]),
              dueDate: faker.date.future(),
              assignedTo: faker.helpers.arrayElement(users).id,
              priority: faker.helpers.arrayElement([
                'LOW',
                'MEDIUM',
                'HIGH',
                'URGENT',
              ]),
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
