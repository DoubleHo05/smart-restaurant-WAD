import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
export class AttachModifiersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  modifier_group_ids: string[];
}
