import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ProfileResolver } from '@/graphql/profile.resolver';
import { DomainModule } from '@/domain/profile/domain.module';

@Module({
  imports: [
    DomainModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: true, // Apollo Sandbox / GraphQL Playground
    }),
  ],
  providers: [ProfileResolver],
})
export class GraphqlModule {}
