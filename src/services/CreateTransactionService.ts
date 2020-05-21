import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryId: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryId,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw Error('type is different income or outcome');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw Error('Insufficient funds');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
