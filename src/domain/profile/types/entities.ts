import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Доменные сущности цифровой визитки.
 * Помечены декораторами GraphQL, чтобы Apollo Server мог определить
 * выходные типы для запросов.
 */

@ObjectType()
export class Period {
  @Field()
  from: string;

  @Field(() => String, { nullable: true })
  to: string | null;
}

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class Company {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class Job {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: number;

  @Field()
  /** Название компании (имя, а не id — для удобного отдачи через GraphQL). */
  company: string;

  @Field()
  /** Название должности (имя, а не id). */
  position: string;

  @Field(() => Period)
  period: Period;

  @Field(() => [String])
  achievements: string[];
}

@ObjectType()
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field(() => String, { nullable: true })
  /** Название компании или null, если опыт не привязан. */
  company: string | null;
}

@ObjectType()
export class Link {
  @Field(() => ID)
  id: number;

  @Field()
  url: string;

  @Field(() => String, { nullable: true })
  /** Вычисляемое поле: провайдер из хоста URL (GitHub, LinkedIn и т.п.). */
  provider?: string;

  @Field(() => Project, { nullable: true })
  project?: Project;
}


@ObjectType()
export class Profile {
  @Field(() => ID)
  id: number;

  @Field()
  name: string; // обязательное, уникальное

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [Link])
  links: Link[];

  @Field(() => [Skill])
  skills: Skill[];

  @Field(() => [Experience])
  experience: Experience[];

  @Field(() => [Project])
  projects: Project[];
}
