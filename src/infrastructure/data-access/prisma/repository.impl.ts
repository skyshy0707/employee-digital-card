import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { PrismaService } from '@/infrastructure/data-access/prisma/prisma.service';
import { ProfileRepository } from '@/domain/profile/types/contracts';
import {
  Profile,
  Skill,
  Link,
  Experience,
  Project,
  Period,
} from '@/domain/profile/types/entities';
import { resolveLinkProvider } from '@/infrastructure/data-access/utils/link-provider';

/**
 * Реализация ProfileRepository на базе Prisma.
 * Загружает профиль со всеми связями и маппит в доменные сущности.
 */
@Injectable()
export class PrismaProfileRepository extends ProfileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.metaSql = {
      objectFieldsClauses: 'profile.*',
      sqlParts: {
        skills: {
          fc_sql: 's.id AS skill_id, s.name AS skill_name',
          join_sql: `INNER JOIN "_ProfileToSkill" skill_m2m ON skill_m2m."A" = profile.id
                    INNER JOIN skill s ON skill_m2m."B" = s.id`
        },
        experience: {
          fc_sql: 'exp.id AS experience_id, exp.achievements, exp.from, exp.to, j.name AS position, c.name AS company',
          join_sql: `INNER JOIN experience exp ON profile.id = exp.profile_id 
                    LEFT JOIN position pos ON exp.position_id = pos.id
                    LEFT JOIN job j ON pos.job_id = j.id
                    LEFT JOIN company c ON pos.company_id = c.id`
        },
        links: {
          fc_sql: 'l.id AS link_id, l.url AS url',
          join_sql: `LEFT JOIN link l ON profile.id = l.profile_id
                    `
        },
        projects: {
          fc_sql: 'p.id AS project_id, p.name AS project_name, l_1.url AS project_url',
          join_sql: `
                    LEFT JOIN link l_1 ON l_1.profile_id = $1
                    LEFT JOIN project p ON p.link_id = l_1.id
                    `
        }
      },
      tail: 'WHERE profile.id = $1 ORDER BY id'
    }
  }

  async findById(id: number, uFields: string[]): Promise<Profile | null> {
    const selectFields = [this.metaSql.objectFieldsClauses]
    const joinClauses: string[] = []

    for (let f of uFields){
      var fc = this.metaSql.sqlParts[f]
      if (fc){
        selectFields.push(fc.fc_sql)
        if (fc.join_sql){
          joinClauses.push(fc.join_sql!)
        }
      }
    }

    const sql = `
      SELECT ${selectFields.join(', ')}
      FROM profile
      ${joinClauses.join('\n')}
      ${this.metaSql.tail}
    `

    const raw = await this.prisma.$queryRawUnsafe<any[]>(
      sql,
      ...[id]
    )

    if (!raw.length) {
      return null;
    }

    return await this.mapProfile(raw);
  }

  private async mapProfile(raw: any): Promise<Profile> {

    const profile = new Profile()
    const skills = new Map<number, string>()
    const links = new Map<number, Link>()
    const experiences = new Map<number, Experience>()
    const projects = new Map<number, Project>()



    profile.id = raw[0].id
    profile.name = raw[0].name
    profile.description = raw[0].description

    for (let row of raw){
      if (row.skill_id && !skills.has(row.skull_id)){
        var skill: string = row.skill_name
        skills.set(row.skill_id, skill)
      }
      if (row.experience_id && !experiences.has(row.experience_id)){
        var experience = new Experience()
        experience.id = row.experience_id
        experience.achievements = row.achievements ?? []
        experience.period = new Period()
        experience.period.from = row.from
        experience.period.to = row.to
        experience.company = row.company
        experience.position = row.position
        experiences.set(row.experience_id, experience)
      }
      if (row.link_id && !links.has(row.link_id)){
        var link = new Link()
        link.id = row.link_id
        link.url = row.url
        link.provider = resolveLinkProvider(row.url)
        links.set(row.link_id, link)
      }
      if (row.project_id && !projects.has(row.project_id)){
        var project = new Project()
        project.id = row.project_id
        project.url = row.project_url
        project.name = row.project_name
        project.company = row.company
        projects.set(row.project_id, project)
      }
    }

    profile.skills = Array.from(skills.values())
    profile.experience = Array.from(experiences.values())
    profile.links = Array.from(links.values())
    profile.projects = Array.from(projects.values())

    return profile;
  }
}
