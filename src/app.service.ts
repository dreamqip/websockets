import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private sequenceNumber = 0;

  incrementSequenceNumber(): void {
    this.sequenceNumber++;
  }

  getSequenceNumber(): number {
    return this.sequenceNumber;
  }

  resetSequenceNumber(): void {
    this.sequenceNumber = 0;
  }
}
