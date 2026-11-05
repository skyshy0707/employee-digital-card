import { Injectable } from '@nestjs/common';
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
  }

  async findById(id: number): Promise<Profile | null> {
  
    const raw = await this.prisma.profile.findUnique({
      where: { id },      
      include: {
        skills: true,
        experiences: {
          include: {
            position: {
              include: { company: true, job: true },
            },
          },
        },
      },
    })

    if (!raw) {
      return null;
    }

    return await this.mapProfile(raw);
  }

  private async mapProfile(raw: any): Promise<Profile> {

    const rawLinks: Array<Link> = await this.prisma.$queryRaw`
      SELECT 
        l.id AS id, 
        l.url AS url, 
        p.id AS project_id, 
        p.name AS project_name, 
        job.name AS job_name, 
        comp.name AS company_name
      FROM link l LEFT JOIN project p ON l.id = p.link_id LEFT JOIN experience e ON p.experience_id = e.id 
      LEFT JOIN position pos ON e.position_id = pos.id 
      LEFT JOIN company comp ON pos.company_id = comp.id 
      LEFT JOIN job job ON pos.job_id = job.id 
      WHERE l.profile_id = ${raw.id} ORDER BY id`
      

    const profile = new Profile()
    const projects = [] as Array<Project>

    profile.skills = (raw.skills ?? []).map((s: any) => {
      return s.name;
    });

    profile.links = (rawLinks ?? []).map((l: any) => {
      const link = new Link();
      link.id = l.id;
      link.url = l.url;
      link.provider = resolveLinkProvider(l.url);

      if (l.project_name){
        var project = new Project()
        project.id = l.project_id
        project.name = l.project_name
        project.url = l.url
        project.company = l.company_name
        projects.push(project)
      }
      return link;
    });

    profile.experience = (raw.experiences ?? []).map((e: any) => {
      const exp = new Experience();
      exp.id = e.id;
      exp.company = e.position.company.name;
      exp.position = e.position.job.name;
      exp.period = {
        from: e.period.from,
        to: e.period.to ?? null,
      } as Period;
      exp.achievements = e.achievements ?? [];
      return exp;
    });

    profile.projects = projects

    return profile;
  }
}
