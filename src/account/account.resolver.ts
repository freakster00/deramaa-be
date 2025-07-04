import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authenticate.guard';
import { SuperAdminGuard } from 'src/auth/guards/superadmin.guard';
import { User } from './decorator/user.decorator';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation('sendOtp')
  sendOtp(@Args('sendOtpInput') sendOtpInput: any) {
    return this.accountService.sendOtp(sendOtpInput);
  }

  @Mutation('verifyOtp')
  verifyOtp(@Args('createAccountInput') createAccountInput: CreateAccountInput) {
    return this.accountService.create(createAccountInput);
  }


  @Mutation('createAccount')
  create(@Args('createAccountInput') createAccountInput: CreateAccountInput) {
    return this.accountService.create(createAccountInput);
  }
  @UseGuards(AuthGuard)
  @Mutation('removeaccount')
  removeaccount(@Args('id') id: number) {
    return this.accountService.removeaccount(id);
  }

  @Query('accounts')
  findAll(@Args("input") input:any) {
    return this.accountService.findAll(input);
  }

  @Query('account')
  findOne(@Args('id') id: number) {
    return this.accountService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation('updateAccount')
  update(@Args('updateAccountInput') updateAccountInput: UpdateAccountInput,@User() user) {
    return this.accountService.update(updateAccountInput,user);
  }

  @UseGuards(SuperAdminGuard)
  @Mutation('removeAccountAsSuperadmin')
  removeAccountAsSuperadmin(@Args('id') id: number) {
    return this.accountService.removeAccountAsSuperadmin(id);
  }
}
