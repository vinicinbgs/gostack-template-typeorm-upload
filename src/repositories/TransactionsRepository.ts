import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    return transactions.reduce(
      ({ income, outcome, total }, transaction) => {
        return {
          income:
            transaction.type === 'income'
              ? income + +transaction.value
              : income,
          outcome:
            transaction.type === 'outcome'
              ? outcome + +transaction.value
              : outcome,
          total:
            transaction.type === 'outcome'
              ? total - +transaction.value
              : total + +transaction.value,
        };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }
}

export default TransactionsRepository;
