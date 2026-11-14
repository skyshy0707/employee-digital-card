import { ProfileRepository } from '@/domain/profile/types/contracts';
import { SQLMetadata } from './interfaces'

export abstract class BaseRepository extends ProfileRepository{
    metaSql: SQLMetadata
}