import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrCreate({ title }: Request): Promise<Category> {
    const find = await this.findOne({
      where: `LOWER(title) = LOWER('${title}')`,
    });

    if (!find) {
      return this.save({
        title,
      });
    }
    return find;
  }
}

export default CategoriesRepository;
