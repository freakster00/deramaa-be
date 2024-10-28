import { authenticateInput } from './create-auth.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuthInput extends PartialType(authenticateInput) {
  id: number;
}
