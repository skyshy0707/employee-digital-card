import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- 1. Профиль (идемпотентно) ---
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      name: 'Иван Иванов',
      description: 'Backend-разработчик. Node.js, NestJS, TypeScript, GraphQL, PostgreSQL, Prisma, Docker.',
    },
    create: {
      name: 'Иван Иванов',
      description: 'Backend-разработчик. Node.js, NestJS, TypeScript, GraphQL, PostgreSQL, Prisma, Docker.',
    },
  });

  // --- 2. Навыки (идемпотентно) ---
  const skillNames = [
    'TypeScript',
    'Node.js',
    'NestJS',
    'GraphQL',
    'PostgreSQL',
    'Prisma',
    'Docker',
    'Git',
  ];
  const createdSkills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      skills: {
        set: createdSkills.map((skill) => ({ id: skill.id })),
      },
    },
  });

  // --- 3. Ссылки (идемпотентно по url) ---
  const ghLink = await prisma.link.upsert({
    where: { profileId_url: { profileId: profile.id, url: 'https://github.com/ivan-ivanov' } },
    update: {},
    create: { profileId: profile.id, url: 'https://github.com/ivan-ivanov' },
  });
  const liLink = await prisma.link.upsert({
    where: { profileId_url: { profileId: profile.id, url: 'https://linkedin.com/in/ivan-ivanov' } },
    update: {},
    create: { profileId: profile.id, url: 'https://linkedin.com/in/ivan-ivanov' },
  });
  const repoLink = await prisma.link.upsert({
    where: { profileId_url: { profileId: profile.id, url: 'https://github.com/ivan-ivanov/digital-profile' } },
    update: {},
    create: { profileId: profile.id, url: 'https://github.com/ivan-ivanov/digital-profile' },
  });

  // --- 4. Компании (идемпотентно) ---
  const companies = ['ООО Технологии', 'ЗАО Разработка', 'ИП Фриланс'];
  const companyRecords: Record<string, any> = {};
  for (const name of companies) {
    const rec = await prisma.company.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    companyRecords[name] = rec;
  }

  // --- 5. Должности (идемпотентно) ---
  const jobs = ['Стажёр', 'Junior Backend', 'Middle Backend', 'Senior Backend'];
  const jobRecords: Record<string, any> = {};
  for (const name of jobs) {
    const rec = await prisma.job.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    jobRecords[name] = rec;
  }

  // --- 6. Позиции (идемпотентно) ---
  const positions: Record<string, any> = {};
  for (const companyName of companies) {
    for (const jobName of jobs) {
      const rec = await prisma.position.upsert({
        where: {
          companyId_jobId: {
            companyId: companyRecords[companyName].id,
            jobId: jobRecords[jobName].id,
          },
        },
        update: {},
        create: {
          companyId: companyRecords[companyName].id,
          jobId: jobRecords[jobName].id,
        },
      });
      positions[`${companyName}|${jobName}`] = rec;
    }
  }

  // --- 7. Опыт работы (идемпотентно) ---
  const experiences = [
    {
      positionKey: 'ООО Технологии|Middle Backend',
      from: '2022-03', 
      to: '2024-06',
      achievements: [
        'Реализовал GraphQL API на NestJS с оптимизацией через DataLoader',
        'Перевёл сервис на Docker и настроил CI/CD',
      ],
    },
    {
      positionKey: 'ЗАО Разработка|Junior Backend',
      from: '2020-06', 
      to: '2022-02',
      achievements: ['Разрабатывал REST API на Node.js и Express'],
    },
    {
      positionKey: 'ИП Фриланс|Senior Backend',
      from: '2024-07', 
      to: null,
      achievements: ['Веду разработку цифровой визитки (этот проект)'],
    },
  ];
  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: {
        profileId_positionId: {
          profileId: profile.id,
          positionId: positions[exp.positionKey].id,
        },
      },
      update: {},
      create: {
        profileId: profile.id,
        positionId: positions[exp.positionKey].id,
        from: exp.from,
        to: exp.to,
        achievements: exp.achievements,
      },
    });
  }

  // --- 8. Проекты (идемпотентно) ---
  await prisma.project.upsert({
    where: {
      linkId: repoLink.id,
    },
    update: {
      name: 'Digital Profile',
      experience: {
        connect: { id: positions['ООО Технологии|Middle Backend'].id },
      },
    },
    create: {
      name: 'Digital Profile',
      link: {
        connect: { id: repoLink.id },
      },
      experience: {
        connect: { id: positions['ООО Технологии|Middle Backend'].id },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
