/**
 * Общие интерфейсы и расширения типов
*/

export interface SQLFieldSettings{
  fc_sql: string
  join_sql?: string
}

export interface SQLMetadata{
  objectFieldsClauses: string,
  sqlParts: Record<string, SQLFieldSettings>,
  tail: string
}