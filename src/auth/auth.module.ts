import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account])
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
