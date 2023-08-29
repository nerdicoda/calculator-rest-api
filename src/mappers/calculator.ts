import { Calculator } from '../models';
import { CalculatorResultDto } from '../types';
import { CalculatorCommandMapper } from './calculatorCommand';

export const CalculatorMapper = {
  toDto(domain: Calculator): CalculatorResultDto {
    const { command, result, metadata } = domain;
    if (!metadata || !result) {
      throw Error('Invalid calculator domain');
    }
    return {
      id: metadata.id,
      result: result.value,
      message: result.message,
      timestamp: metadata.timestamp,
      ...CalculatorCommandMapper.toDto(command),
    };
  },
};
