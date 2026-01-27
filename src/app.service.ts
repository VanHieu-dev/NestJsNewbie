import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHelloWorld() {
    return 'Hello World from Le Van Hieu'
  }
}
