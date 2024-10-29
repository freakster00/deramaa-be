import { CreateAgentVerificationInput } from './create-agent-verification.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAgentVerificationInput extends PartialType(CreateAgentVerificationInput) {
  id: number;
}
