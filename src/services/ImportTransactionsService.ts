import { getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const csvFilePath = path.resolve('src/__tests__/import_template.csv');

    const data = await this.loadCSV(csvFilePath);

    const transactions = data.map(async ([title, type, value, category]) => {
      const transactionsRepository = getCustomRepository(
        TransactionsRepository,
      );

      const categoriesRepository = getCustomRepository(CategoriesRepository);

      const categoryObject = await categoriesRepository.findOrCreate({
        title: category,
      });

      return transactionsRepository.save({
        title,
        type,
        value,
        category_id: categoryObject?.id,
      });
    });

    return Promise.all(transactions);
  }

  async loadCSV(filePath: string): Promise<any[]> {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
