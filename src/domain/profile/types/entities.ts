import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

/**
 * Доменные сущности цифровой визитки.
 * Помечены декораторами GraphQL, чтобы Apollo Server мог определить
 * выходные типы для запросов.
 */

// Whole JsonField as result:
export class Period {

  from: Date;
  to: Date | null;
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

  @Field(() => GraphQLJSON)
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

  @Field(() => [String])
  skills: String[];

  @Field(() => [Experience])
  experience: Experience[];

  @Field(() => [Project])
  projects: Project[];
}
