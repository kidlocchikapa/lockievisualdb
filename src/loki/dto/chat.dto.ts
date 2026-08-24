import { IsUUID, IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LokiChatDto {
    @IsOptional()
    @IsUUID('4', { message: 'sessionId must be a valid session id' })
    sessionId?: string;

    @IsString()
    @IsNotEmpty({ message: 'message cannot be empty' })
    @MaxLength(2000, { message: 'message is too long (max 2000 chars)' })
    message: string;
}
