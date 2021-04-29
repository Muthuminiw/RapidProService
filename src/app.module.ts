import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { CarsModule } from './cars/cars.module';
import { GraphQLModule } from '@nestjs/graphql';
import { BullModule } from '@nestjs/bull';
import { SocketModule } from './socket/socket.module';



@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths:['./**/*.graphql']
    }),
   CarsModule,SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private connection: Connection) { }
}
