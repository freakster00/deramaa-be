import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AgentVerificationService } from './agent-verification.service';
import { CreateAgentVerificationInput } from './dto/create-agent-verification.input';
import { UpdateAgentVerificationInput } from './dto/update-agent-verification.input';

@Resolver('AgentVerification')
export class AgentVerificationResolver {
  constructor(private readonly agentVerificationService: AgentVerificationService) {}

  @Mutation('createAgentVerification')
  create(@Args('createAgentVerificationInput') createAgentVerificationInput: CreateAgentVerificationInput) {
    return this.agentVerificationService.create(createAgentVerificationInput);
  }

  @Query('agentVerification')
  findAll() {
    return this.agentVerificationService.findAll();
  }

  @Query('agentVerification')
  findOne(@Args('id') id: number) {
    return this.agentVerificationService.findOne(id);
  }

  @Mutation('updateAgentVerification')
  update(@Args('updateAgentVerificationInput') updateAgentVerificationInput: UpdateAgentVerificationInput) {
    return this.agentVerificationService.update(updateAgentVerificationInput.id, updateAgentVerificationInput);
  }

  @Mutation('removeAgentVerification')
  remove(@Args('id') id: number) {
    return this.agentVerificationService.remove(id);
  }
}
