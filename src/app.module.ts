import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CarsModule } from './cars/cars.module';
import { GraphQLModule } from '@nestjs/graphql';
import { BullModule } from '@nestjs/bull';
// import { SocketModule } from './socket/socket.module';



@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths:['./**/*.graphql']
    }),BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
   CarsModule,
  //  SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
