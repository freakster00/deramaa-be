import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';

@Resolver('Property')
export class PropertyResolver {
  constructor(private readonly service: PropertyService) { }

  @Mutation('createProperty')
  create(
    @Args('createPropertyInput') input: CreatePropertyInput,
  ) {
    return this.service.create(input);
  }

  @Query('properties')
  findAll(@Args('options') options: { skip?: number; take?: number }) {
    return this.service.findAll(options);
  }

  @Query('property')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation('updateProperty')
  update(
    @Args('updatePropertyInput') input: UpdatePropertyInput,
  ) {
    return this.service.update(input.id, input);
  }

  @Mutation('removeProperty')
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}
