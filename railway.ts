import { project, service, postgres } from "@railway/iac";

// 1. Создаем управляемую базу данных PostgreSQL прямо в Railway
const db = postgres("db", {
  name: "profile",
});

// 2. Объявляем наш NestJS бэкенд сервис
export const backend = service("app", {
  name: "profile",
  // Говорим Railway собирать проект строго по нашему Dockerfile
  source: {
    builder: "DOCKERFILE",
    dockerfilePath: "Dockerfile",
  },
  networking: {
    public: true, // Генерировать публичный URL (*.up.railway.app)
    port: 3000,
  },
  env: {
    DATABASE_URL: db.env.DATABASE_URL,
    NODE_ENV: "production",
  },
});

// Связываем всё в единый проект Railway
export default project({
  name: "employee-digital-card",
  resources: [db, backend],
});