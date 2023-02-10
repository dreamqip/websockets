import { Injectable, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class BatchValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    // Will throw an error if the schema is not valid
    this.schema.parse(value);
    return value;
  }
}
