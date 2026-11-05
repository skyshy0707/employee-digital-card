import { Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from '@/domain/profile/service';
import { Profile } from '@/domain/profile/types/entities';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { nullable: true })
  async profile(id: number): Promise<Profile | null> {
    return this.profileService.getProfile(id);
  }
}
