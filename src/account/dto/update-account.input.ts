import { CreateAccountInput } from './create-account.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAccountInput {
  email?:string
  phone?:string
  firstname?:string
  lastname?:string
}
