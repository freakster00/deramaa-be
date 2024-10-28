import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { authenticateInput, RegenerateAccessTokenInput } from './dto/create-auth.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/authenticate.guard';
import { User } from 'src/account/decorator/user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('authenticate')
  authenticate(@Args('authenticateInput') authenticateInput: authenticateInput) {
    return this.authService.authenticate(authenticateInput);
  }

  @UseGuards(AuthGuard)
  @Mutation('regenerateAccessToken')
  regenerateAccessToken(@Args('regenerateAccessTokenInput') regenerateAccessTokenInput: RegenerateAccessTokenInput,@User() user) {
    return this.authService.regenerateAccessToken(regenerateAccessTokenInput,user);
  }
}
