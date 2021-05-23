import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';

import { CarsResolver } from './cars.resolver';
import { BullModule } from '@nestjs/bull';
// import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cardata',
    }),
  ],
  controllers: [CarsController],
  providers: [CarsService,CarsResolver,
    // AppGateway
  ]
})
export class CarsModule {}
