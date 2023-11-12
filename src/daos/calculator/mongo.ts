import { CalculatorDao } from '.';
import omit from 'lodash.omit';
import { Calculator } from '../../models';
import { MongoCollections, MongoDatabases } from '../../services/mongo';
import { CalculatorCommandOperator } from '../../types';
import { Collection, MongoClient, ObjectId, WithId } from 'mongodb';
import { handleError } from '../../utils';

const databaseName = MongoDatabases.RESTAPI;
const collectionName = MongoCollections[databaseName].CALCULATORS;

interface MongoDbCalculatorData {
  _id?: ObjectId;
  res?: number;
  msg?: string;
  opr: '+' | '-' | '*' | '/';
  op1: number;
  op2: number;
  date: Date;
}

export class MongoCalculatorDao implements CalculatorDao {
  private collection: Collection<MongoDbCalculatorData>;

  constructor(private mongoClient: MongoClient) {
    const database = this.mongoClient.db(databaseName);
    this.collection =
      database.collection<MongoDbCalculatorData>(collectionName);
  }

  async create(calculator: Calculator): Promise<Calculator> {
    const calculationPersistence = this.toPersistence(calculator);
    try {
      const result = await this.collection.insertOne(calculationPersistence, {
        ignoreUndefined: true,
      });
      const insertedDocument = await this.collection.findOne({
        _id: result.insertedId,
      });
      if (insertedDocument) {
        return this.toDomain(insertedDocument);
      } else {
        throw new Error('Inserted document not found.');
      }
    } catch (error) {
      handleError(error, 'Error in create calculator');
    }
  }

  async read(id: string): Promise<Calculator | undefined> {
    try {
      const result = await this.collection.findOne({ _id: new ObjectId(id) });
      return result ? this.toDomain(result) : undefined;
    } catch (error) {
      handleError(error, `Error in read calculator for ID ${id}`);
    }
  }

  async upsert(id: string, calculator: Calculator): Promise<Calculator> {
    const calculationPersistence = this.toPersistence(calculator);
    try {
      const result = await this.collection.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: omit(calculationPersistence, 'date'),
          $currentDate: { date: true },
        },
        {
          returnDocument: 'after',
          upsert: true,
          ignoreUndefined: true,
        }
      );
      if (result) {
        return this.toDomain(result);
      } else {
        throw new Error('Updated document not found');
      }
    } catch (error) {
      handleError(error, `Error in upsert calculator for ID ${id}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      handleError(error, `Error in delete calculator for ID ${id}`);
    }
  }

  async list(): Promise<Calculator[]> {
    try {
      const result = await this.collection.find().toArray();
      return result.map((doc) => this.toDomain(doc));
    } catch (error) {
      handleError(error, 'Error in list calculator');
    }
  }

  private static toDate(timestamp?: number): Date {
    return timestamp ? new Date(timestamp) : new Date();
  }

  private static toTimestamp(date: Date): number {
    return date.valueOf();
  }

  private toPersistence(calculator: Calculator): MongoDbCalculatorData {
    return {
      _id: calculator.metadata?.id
        ? new ObjectId(calculator.metadata.id)
        : undefined,
      res: calculator.result?.value,
      msg: calculator.result?.message,
      opr: calculator.command.operator,
      op1: calculator.command.operand1,
      op2: calculator.command.operand2,
      date: MongoCalculatorDao.toDate(calculator.metadata?.timestamp),
    };
  }

  private static dbOperatorMapping = Object.values(
    CalculatorCommandOperator
  ).reduce(
    (mapping, value) => ({
      ...mapping,
      [value]: value,
    }),
    {}
  ) as { [k in CalculatorCommandOperator]: CalculatorCommandOperator };

  private toDomain(
    calculationPersistence: WithId<MongoDbCalculatorData>
  ): Calculator {
    const { _id, res, msg, opr, op1, op2, date } = calculationPersistence;
    return new Calculator(
      {
        operator: MongoCalculatorDao.dbOperatorMapping[opr],
        operand1: op1,
        operand2: op2,
      },
      { value: res, message: msg },
      { id: _id.toString(), timestamp: MongoCalculatorDao.toTimestamp(date) }
    );
  }
}
