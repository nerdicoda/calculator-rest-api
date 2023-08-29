import { Request, Router } from 'express';
import { CalculatorCommandDto, CalculatorResultDto } from '../types';
import { CalculatorController } from '../controllers';

export class CalculatorRouter {
  static basePath = '/calculator';
  router: Router;

  constructor(private calculatorController: CalculatorController) {
    this.router = Router();
    this.createGetAllCalculations();
    this.createGetCalculationById();
    this.createDeleteCalculationById();
    this.createUpdateCalculation();
    this.createCreateCalculation();
  }

  private createGetAllCalculations() {
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
    this.router.get(
      '/',
      async (req: Request<{}, CalculatorResultDto[]>, res) => {
        res.send(await this.calculatorController.getAllCalculations());
      }
    );
  }

  private createGetCalculationById() {
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
    this.router.get(
      '/:id',
      async (req: Request<{ id: string }, CalculatorResultDto>, res) => {
        res.send(
          await this.calculatorController.getCalculationById(req.params.id)
        );
      }
    );
  }

  private createDeleteCalculationById() {
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
    this.router.delete('/:id', async (req: Request<{ id: string }>, res) => {
      await this.calculatorController.deleteCalculationById(req.params.id);
      res.status(204).end();
    });
  }

  private createUpdateCalculation() {
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
    this.router.put(
      '/:id',
      async (
        req: Request<{ id: string }, CalculatorResultDto, CalculatorCommandDto>,
        res
      ) => {
        res.send(
          await this.calculatorController.updateCalculation(
            req.params.id,
            req.body
          )
        );
      }
    );
  }

  private createCreateCalculation() {
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
    this.router.post(
      '/',
      async (
        req: Request<{}, CalculatorResultDto, CalculatorCommandDto>,
        res
      ) => {
        res
          .status(201)
          .send(await this.calculatorController.createCalculation(req.body));
      }
    );
  }
}
