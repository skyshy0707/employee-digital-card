import { Query, Resolver, Args, Info, Int } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ProfileService } from '@/domain/profile/service';
import { Profile } from '@/domain/profile/types/entities';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { nullable: true })
  async profile(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<Profile | null> {
    const rawFields = info.fieldNodes[0]?.selectionSet?.selections
    const uFields: string[] = []

    rawFields?.forEach((selection) => {
      if(selection.kind  === 'Field'){
        uFields.push(selection.name.value)
      }
    })

    console.log(`uFields: ${uFields}, type: ${typeof uFields}`)
    return this.profileService.getProfile(id, uFields);
  }
}
