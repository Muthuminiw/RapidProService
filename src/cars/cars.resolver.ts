import { Body } from "@nestjs/common";
import { Query, Resolver, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { CarsService } from "./cars.service";
import { UpdateCarDto } from "./dto/update-car.dto";
import { Car } from "./entities/car.entity";


@Resolver()
export class CarsResolver {
  constructor(private readonly carsService: CarsService) {}


 

  @Query()
    async carById(@Args('id') id: string){
      console.log("This is ht")
        return  await   this.carsService.carById(id);
    };

      @Query()
    async getAllCars(@Args('first') first: number,
    @Args('after') after: string){
      return  await   this.carsService.getAllCars(first, after);
    }

    
    @Query()
    async getCars(){
      return  await this.carsService.getCars();
    }

    @Query()
    async searchCarsByModel(@Args('carModel') carModel: string,@Args('first') first: number,
    @Args('after') after: string){
      return  await   this.carsService.searchCarsByModel();
    }

    // @Query()
    // async allCars(@Args('first') first: number,
    //                 @Args('after') after: string){
    //   return  await   this.carsService.allCars(first, after);
    // }
    // @Query()
    // async car(@Args('id') id: string) {
    // return await this.carsService.read(id);
    // }

    @Query()
    async getCarByAge(@Args('ageLimit') ageLimit: string) {
    return await this.carsService.exportCarDataToCsv(ageLimit);
    }


    // @Mutation()
    // async createVehicle(@Args('firstName') firstName: string,
    //                     @Args('lastName') lastName : string,
    //                     @Args('carModel') carModel : string) {
    //     const updateCarDto: UpdateCarDto  = { firstName, lastName,carModel };
    //     return await this.carsService.createCar( updateCarDto);
    // }

    @Mutation()
    async updateCarById(@Args('id') id: string,
                        @Args('firstName') firstName: string, 
                        @Args('lastName') lastName : string,
                        @Args('email') email : string) {
        const updateCarDto: UpdateCarDto = {firstName, lastName,email}
        return await this.carsService.update(id, updateCarDto);
    }

    @Mutation()
    async deleteCar(@Args('id') id: string) {
        return await this.carsService.deleteCar(id);
    }
}