import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
  ) { }

  async create(input: CreatePropertyInput) {
    try {
      const entity = this.repo.create(input);
      const saved = await this.repo.save(entity);

      return {
        success: true,
        message: 'Property created successfully',
        data: saved,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return {
          success: false,
          message: 'Failed to create property: Database error',
        };
      }

      console.error('Create Error:', error);
      return {
        success: false,
        message: 'Unexpected error occurred while creating property',
      };
    }
  }

  async findAll(options?: { skip?: number; take?: number }) {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;

    try {
      const [items, total] = await this.repo.findAndCount({
        skip,
        take,
        order: { createdAt: 'DESC' }, // optional: consistent order
      });

      return {
        success: true,
        message: 'Properties retrieved successfully',
        data: {
          items,
          totalItems: total,
        },
      };
    } catch (error) {
      console.error('FindAll Error:', error);
      return {
        success: false,
        message: 'Failed to retrieve properties',
        data: {
          items: [],
          totalItems: 0,
        },
      };
    }
  }


  async findOne(id: number) {
    try {
      const entity = await this.repo.findOne({ where: { id } as any });

      if (!entity) {
        return {
          success: false,
          message: `Property with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Property retrieved successfully',
        data: entity,
      };
    } catch (error) {
      console.error('FindOne Error:', error);
      return {
        success: false,
        message: 'Failed to retrieve property',
        data: null,
      };
    }
  }

  async update(id: number, input: UpdatePropertyInput) {
    try {
      const existing = await this.repo.findOne({ where: { id } as any });

      if (!existing) {
        return {
          success: false,
          message: `Property with ID ${id} not found`,
          data: null,
        };
      }

      await this.repo.update(id, input);
      const updated = await this.repo.findOne({ where: { id } as any });

      return {
        success: true,
        message: 'Property updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Update Error:', error);
      return {
        success: false,
        message: 'Failed to update property',
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const entity = await this.repo.findOne({ where: { id } as any });

      if (!entity) {
        return {
          success: false,
          message: `Property with ID ${id} not found`,
        };
      }

      await this.repo.remove(entity);

      return {
        success: true,
        message: 'Property removed successfully',
      };
    } catch (error) {
      console.error('Remove Error:', error);
      return {
        success: false,
        message: 'Failed to remove property',
      };
    }
  }
}
