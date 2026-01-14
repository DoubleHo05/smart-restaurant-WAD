import { IsUUID } from 'class-validator';

export class AcceptBillRequestDto {
    @IsUUID()
    accepted_by: string;
}
