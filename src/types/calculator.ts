import { components } from '../schemas';

export type CalculatorCommandDto = components['schemas']['CalculatorCommand'];

export type CalculatorResultDto = components['schemas']['CalculatorResult'];

export enum CalculatorCommandOperator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}

export interface CalculatorCommand {
  operator: CalculatorCommandOperator;
  operand1: number;
  operand2: number;
}

export interface CalculatorResult {
  value?: number;
  message?: string;
}

export interface CalculatorMetadata {
  id: string;
  timestamp: number;
}
