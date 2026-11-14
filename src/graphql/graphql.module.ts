import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { DomainModule } from '@/domain/profile/domain.module';
import { ProfileResolver } from '@/graphql/profile.resolver';


@Module({
  imports: [
    DomainModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      introspection: true,
      path: '/api/graphql', // соответствует setGlobalPrefix('api') в main.ts
      playground: true, // Apollo Sandbox / GraphQL Playground
    }),
  ],
  providers: [ProfileResolver],
})
export class GraphqlModule {}
