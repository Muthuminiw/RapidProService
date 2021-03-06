import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CarsService } from './cars.service';


@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  // @Get()
  // findAllCars() {
  //   return this.carsService.getCars();
  // }



  @Get('exportdata/:ageLimit')
  exportCarDataToCsv(@Param('ageLimit') ageLimit: string) {
    return this.carsService.exportCarDataToCsv(ageLimit);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.carsService.deleteCar(id);
  // }

  //  @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
  //   return this.carsService.update(id, updateCarDto);
  // }

 

}
