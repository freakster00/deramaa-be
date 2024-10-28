import { CreatePropertyInput } from './create-property.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePropertyInput extends PartialType(CreatePropertyInput) {
  id: number;
}
