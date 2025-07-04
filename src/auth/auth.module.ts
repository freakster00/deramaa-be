import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account]),
    forwardRef(()=>AccountModule)
  ],
  providers: [AuthResolver, AuthService],
  exports:[AuthService],
})
export class AuthModule {}
