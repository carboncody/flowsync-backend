import { PartialType } from '@nestjs/mapped-types';
import { CreateteamspaceDto } from './create-teamspace.dto';

export class UpdateteamspaceDto extends PartialType(CreateteamspaceDto) {}
