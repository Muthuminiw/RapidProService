import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { PaginatedCarsResultDto } from './dto/paginatedCarsResult.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateCarDto } from './dto/update-car.dto';
const multer = require("multer");

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Get()
  findAllCars() {
    return this.carsService.getCars();
  }

  // @Get('SearchByModel/:searchKey')
  // searchWithWildChars(@Param('searchKey') searchKey: string) {
  //   return this.carsService.searchWithWildChars(searchKey);
  // }

  @Get('exportdata/:ageLimit')
  exportCarDataToCsv(@Param('ageLimit') ageLimit: string) {
    console.log('Done Export Starts')
    return this.carsService.exportCarDataToCsv(ageLimit);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.deleteCar(id);
  }

   @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.carsService.findOne(id);
  // }



  // @Get()
  // findAllInAscPaginated(@Query() paginationDto: PaginationDto): Promise<PaginatedCarsResultDto> {

  //   paginationDto.page = Number(paginationDto.page)
  //   paginationDto.limit = Number(paginationDto.limit)

  //   return this.carsService.findAllInAscPaginated({
  //     ...paginationDto,
  //     limit: paginationDto.limit > 100 ? 100 : paginationDto.limit
  //   })
  // }




  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.carsService.findOne(id);
  // }

 


}
