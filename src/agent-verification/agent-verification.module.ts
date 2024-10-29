import { Module } from '@nestjs/common';
import { AgentVerificationService } from './agent-verification.service';
import { AgentVerificationResolver } from './agent-verification.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentVerification } from './entities/agent-verification.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([AgentVerification])
  ],
  providers: [AgentVerificationResolver, AgentVerificationService],
})
export class AgentVerificationModule {}
