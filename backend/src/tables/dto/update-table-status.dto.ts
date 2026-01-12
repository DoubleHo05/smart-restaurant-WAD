import { IsIn } from 'class-validator';

export class UpdateTableStatusDto {
  @IsIn(['available', 'occupied', 'reserved'], {
    message: 'Table status must be one of: available, occupied, reserved',
  })
  status: string;
}
