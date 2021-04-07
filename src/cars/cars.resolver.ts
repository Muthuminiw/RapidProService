import { Query, Resolver } from "@nestjs/graphql";
import { CarsService } from "./cars.service";
import { Car } from "./entities/car.entity";


@Resolver()
export class CarsResolver {
  constructor(private readonly carsService: CarsService) {}


  // @Query(() => String)
  // async sayHello() {
  //   return 'Hello Graphql';
  // }

  @Query(returns => [Car])
  async getCars(): Promise<Car[]> {
    return await this.carsService.findAll();
  }



  
}