import {
  CalculatorCommand,
  CalculatorCommandDto,
  CalculatorCommandOperator,
} from '../types';

const operatorMapping = Object.values(CalculatorCommandOperator).reduce(
  (mapping, value) => ({
    ...mapping,
    [value]: value,
  }),
  {}
) as { [k in CalculatorCommandOperator]: CalculatorCommandOperator };

export const CalculatorCommandMapper = {
  toDomain(dto: CalculatorCommandDto): CalculatorCommand {
    const { operator, operand1, operand2 } = dto;
    return {
      operator: operatorMapping[operator],
      operand1,
      operand2,
    };
  },
  toDto(command: CalculatorCommand): CalculatorCommandDto {
    const { operator, operand1, operand2 } = command;
    return {
      operator,
      operand1,
      operand2,
    };
  },
};
