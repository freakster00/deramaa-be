import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { MobileOTP } from './entities/otp.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account,MobileOTP])
  ],
  providers: [AccountResolver, AccountService,AuthService],
})
export class AccountModule {}
