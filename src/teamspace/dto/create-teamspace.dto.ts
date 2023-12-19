export class CreateteamspaceDto {
  name: string;
  acronym: string;
  description?: string;
  // INVESTIGATE : workspaceId is not included here as it's likely to be handled separately in the logic
}
