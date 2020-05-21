import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    if (!category)
      return response.status(400).json({
        messages: 'Informe a categoria',
      });

    const transactionService = new CreateTransactionService();

    const parsedValue = parseFloat(value);

    const categoryId = await categoriesRepository.findOrCreate({
      title: category,
    });

    const transaction = await transactionService.execute({
      title,
      value: parsedValue,
      type,
      categoryId: categoryId?.id,
    });

    return response.json(transaction).status(200);
  } catch (err) {
    return response.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionService = new DeleteTransactionService();

  await transactionService.execute({ id: request.params.id });

  return response.status(200).send();
});

transactionsRouter.post('/import', async (request, response) => {
  const transactionService = new ImportTransactionsService();

  const transactions = await transactionService.execute();

  return response.status(200).send(transactions);
});

export default transactionsRouter;
