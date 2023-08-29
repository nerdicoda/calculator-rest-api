import {
  CalculatorCommand,
  CalculatorCommandOperator,
  CalculatorMetadata,
  CalculatorResult,
} from '../types';

export class Calculator {
  constructor(
    public command: CalculatorCommand,
    public result?: CalculatorResult,
    public metadata?: CalculatorMetadata
  ) {
    this.execute();
    this.validate();
  }

  update(command: CalculatorCommand): void {
    this.command = command;
    this.result = undefined;
    this.execute();
    this.validate();
  }

  private validate(): void {
    if (
      this.result?.value === undefined &&
      this.result?.message === undefined
    ) {
      throw new Error('Invalid calculator result');
    }
  }

  private execute(): void {
    if (this.result !== undefined) {
      return;
    }
    const { operator, operand1, operand2 } = this.command;
    let result: number | undefined;
    let message: string | undefined;
    switch (operator) {
      case CalculatorCommandOperator.ADD:
        result = operand1 + operand2;
        break;
      case CalculatorCommandOperator.SUBTRACT:
        result = operand1 - operand2;
        break;
      case CalculatorCommandOperator.MULTIPLY:
        result = operand1 * operand2;
        break;
      case CalculatorCommandOperator.DIVIDE:
        if (operand2 === 0) {
          message = 'Division by zero';
        } else {
          result = operand1 / operand2;
        }
        break;
    }
    this.result = { value: result, message };
  }
}
