import { Injectable } from '@nestjs/common';
import { CreateAgentVerificationInput } from './dto/create-agent-verification.input';
import { UpdateAgentVerificationInput } from './dto/update-agent-verification.input';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentVerification } from './entities/agent-verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AgentVerificationService {

  constructor(
    @InjectRepository(AgentVerification)
    private readonly agentVerification: Repository<AgentVerification>,

  ){}
  create(createAgentVerificationInput: CreateAgentVerificationInput) {
    return 'This action adds a new agentVerification';
  }

  findAll() {
    return `This action returns all agentVerification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agentVerification`;
  }

  update(id: number, updateAgentVerificationInput: UpdateAgentVerificationInput) {
    return `This action updates a #${id} agentVerification`;
  }

  remove(id: number) {
    return `This action removes a #${id} agentVerification`;
  }
}
