import express from 'express';
import 'express-async-errors';
import { healthRouter, apiDocsRouter, CalculatorRouter } from './routes';
import {
  addTimestamp,
  errorHandler,
  logger,
  openApiValidator,
} from './middlewares';
import { CalculatorDao, MockCalculatorDao } from './daos';
import { CalculatorController } from './controllers';
import { MongoCalculatorDao } from './daos/calculator/mongo';
import { mongoClient } from './services/mongo';

const app = express();
const port = 3000;

app.use(express.json());
app.use(addTimestamp);
app.use(logger);
app.use(openApiValidator);

// const calculatorDao: CalculatorDao = new MockCalculatorDao();
const calculatorDao: CalculatorDao = new MongoCalculatorDao(mongoClient);
const calculatorController = new CalculatorController(calculatorDao);
const calculatorRouter = new CalculatorRouter(calculatorController);

app.use('/api-docs', apiDocsRouter);
app.use('/health', healthRouter);
app.use(CalculatorRouter.basePath, calculatorRouter.router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
