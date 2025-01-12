
// dto/create-feedback.dto.ts
import { IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @MinLength(10, {
    message: 'Feedback must be at least 10 characters long'
  })
  content: string;
}