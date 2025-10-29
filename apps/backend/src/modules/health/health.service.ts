import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check(): string {
    return 'Hello World!';
  }
}
