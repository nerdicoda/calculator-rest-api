import { Request, Router } from 'express';
import { CalculatorCommandDto, CalculatorResultDto } from '../types';
import { NotFoundError } from '../error';

export const router = Router();

const mockResults: CalculatorResultDto[] = [
  {
    id: '1',
    result: 1,
    operator: '+',
    operand1: 1,
    operand2: 0,
    timestamp: 1688612539479,
  },
  {
    id: '2',
    result: 2,
    operator: '*',
    operand1: 2,
    operand2: 1,
    timestamp: 1688612540479,
  },
  {
    id: '3',
    message: 'Division by zero',
    operator: '/',
    operand1: 1,
    operand2: 0,
    timestamp: 1688612540479,
  },
];

/**
 * @openapi
 * /calculator:
 *   get:
 *     description: Get all calculations
 *     operationId: getAllCalculations
 *     tags:
 *       - calculator
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalculatorResult'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', (req: Request<{}, CalculatorResultDto[]>, res) => {
  res.send(mockResults);
});

/**
 * @openapi
 * /calculator/{id}:
 *   get:
 *     description: Get calculation by ID
 *     operationId: getCalculationById
 *     tags:
 *       - calculator
 *     parameters:
 *       - $ref: '#/components/parameters/CalculatorId'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalculatorResult'
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', (req: Request<{ id: string }, CalculatorResultDto>, res) => {
  const result = mockResults.find((r) => r.id === req.params.id);
  if (!result) {
    throw new NotFoundError(`Calculation not found for ID ${req.params.id}`);
  }
  res.send(result);
});

/**
 * @openapi
 * /calculator/{id}:
 *   delete:
 *     description: Delete calculation by ID
 *     operationId: deleteCalculationById
 *     tags:
 *       - calculator
 *     parameters:
 *       - $ref: '#/components/parameters/CalculatorId'
 *     responses:
 *       '204':
 *         description: Deleted
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', (req: Request<{ id: string }>, res) => {
  const deleteIndex = mockResults.findIndex((r) => r.id === req.params.id);
  if (deleteIndex === -1) {
    throw new NotFoundError(`Calculation not found for ID ${req.params.id}`);
  }
  mockResults.splice(deleteIndex, 1);
  res.status(204).end();
});

/**
 * @openapi
 * /calculator/{id}:
 *   put:
 *     description: Update a calculation
 *     operationId: updateCalculation
 *     tags:
 *       - calculator
 *     parameters:
 *       - $ref: '#/components/parameters/CalculatorId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/CalculatorCommand'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalculatorResult'
 *       '404':
 *         $ref: '#/components/responses/NotFoundError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  '/:id',
  (
    req: Request<{ id: string }, CalculatorResultDto, CalculatorCommandDto>,
    res
  ) => {
    const updateIndex = mockResults.findIndex((r) => r.id === req.params.id);
    if (updateIndex === -1) {
      throw new NotFoundError(`Calculation not found for ID ${req.params.id}`);
    }
    const { operator, operand1, operand2 } = req.body;
    let result: number | undefined;
    let message: string | undefined;
    switch (operator) {
      case '+':
        result = operand1 + operand2;
        break;
      case '-':
        result = operand1 - operand2;
        break;
      case '*':
        result = operand1 * operand2;
        break;
      case '/':
        if (operand2 === 0) {
          message = 'Division by zero';
        } else {
          result = operand1 / operand2;
        }
        break;
    }
    const updatedCalculation: CalculatorResultDto = {
      id: req.params.id,
      operator,
      operand1,
      operand2,
      timestamp: req.timestamp!,
      message,
      result,
    };
    mockResults[updateIndex] = updatedCalculation;
    res.send(updatedCalculation);
  }
);

/**
 * @openapi
 * /calculator:
 *   post:
 *     description: Create a calculation
 *     operationId: createCalculation
 *     tags:
 *       - calculator
 *     requestBody:
 *       $ref: '#/components/requestBodies/CalculatorCommand'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalculatorResult'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/',
  (req: Request<{}, CalculatorResultDto, CalculatorCommandDto>, res) => {
    const { operator, operand1, operand2 } = req.body;
    let result: number | undefined;
    let message: string | undefined;
    switch (operator) {
      case '+':
        result = operand1 + operand2;
        break;
      case '-':
        result = operand1 - operand2;
        break;
      case '*':
        result = operand1 * operand2;
        break;
      case '/':
        if (operand2 === 0) {
          message = 'Division by zero';
        } else {
          result = operand1 / operand2;
        }
        break;
    }
    const newCalculation: CalculatorResultDto = {
      id: '4',
      operator,
      operand1,
      operand2,
      timestamp: req.timestamp!,
      message,
      result,
    };
    mockResults.push(newCalculation);
    res.status(201).send(newCalculation);
  }
);
