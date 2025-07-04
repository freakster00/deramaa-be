import { Module,forwardRef } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { MobileOTP } from './entities/otp.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account, MobileOTP]),
    forwardRef(()=>AuthModule)
  ],
  providers: [AccountResolver, AccountService],
  exports:[AccountService]
})
export class AccountModule {}
