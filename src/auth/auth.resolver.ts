import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { authenticateInput, RegenerateAccessTokenInput } from './dto/create-auth.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/authenticate.guard';
import { User } from 'src/account/decorator/user.decorator';
import { loginInput,LoginResponse } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('authenticate')
  authenticate(@Args('authenticateInput') authenticateInput: authenticateInput) {
    return this.authService.authenticate(authenticateInput);
  }
  
  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: loginInput,): Promise<LoginResponse>{
    return this.authService.accountlogin(loginInput)
    }
    

  @UseGuards(AuthGuard)
  @Mutation('regenerateAccessToken')
  regenerateAccessToken(@Args('regenerateAccessTokenInput') regenerateAccessTokenInput: RegenerateAccessTokenInput,@User() user) {
    return this.authService.regenerateAccessToken(regenerateAccessTokenInput,user);
  }

  @Mutation('forgotPassword')
  forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Mutation('resetPassword')
  resetPassword(@Args('token') token: string, @Args('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }
}
