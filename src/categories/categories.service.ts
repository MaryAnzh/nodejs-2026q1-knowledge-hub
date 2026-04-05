import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { CategoryType } from 'src/types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InMemoryDB } from 'src/storage/in-memory.db';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: InMemoryDB) {}

  findAll(): CategoryType[] {
    return this.db.categories;
  }

  findOne(id: string): CategoryType | null {
    return this.db.categories.find((c) => c.id === id) || null;
  }

  create(dto: CreateCategoryDto): CategoryType {
    const category: CategoryType = {
      id: uuidV4(),
      name: dto.name,
      description: dto.description,
    };

    this.db.categories.push(category);
    return category;
  }

  update(id: string, dto: UpdateCategoryDto): CategoryType {
    const category = this.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }

    Object.assign(category, dto);
    return category;
  }

  remove(id: string): boolean {
    const exists = this.findOne(id);
    if (!exists) return false;

    this.db.categories = this.db.categories.filter((c) => c.id !== id);

    this.db.articles.forEach((a) => {
      if (a.categoryId === id) a.categoryId = null;
    });

    return true;
  }
}
