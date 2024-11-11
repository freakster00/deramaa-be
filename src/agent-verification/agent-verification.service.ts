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
    private readonly agentVerificationRepository: Repository<AgentVerification>,
  ) {}

  async create(createAgentVerificationInput: CreateAgentVerificationInput): Promise<AgentVerification> {
    const newAgentVerification = this.agentVerificationRepository.create(createAgentVerificationInput);
    return await this.agentVerificationRepository.save(newAgentVerification);
  }

  async findAll(): Promise<AgentVerification[]> {
    return await this.agentVerificationRepository.find();
  }

  async findOne(id: number): Promise<AgentVerification> {
    return await this.agentVerificationRepository.findOne({ where: { requestId: id } });
  }

  async update(id: number, updateAgentVerificationInput: UpdateAgentVerificationInput): Promise<AgentVerification> {
    return await this.agentVerificationRepository.findOne({ where: { requestId: id } });
  }

  async remove(id: number): Promise<AgentVerification> {
    const agentVerification = await this.findOne(id);
    await this.agentVerificationRepository.delete(id);
    return agentVerification;
  }
}
