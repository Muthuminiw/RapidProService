import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { PaginatedCarsResultDto } from './dto/paginatedCarsResult.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateCarDto } from './dto/update-car.dto';
const multer = require("multer");

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

 

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  findAll() {
    return this.carsService.findAll();
  }
  @Get('findAll')
  findAllInAscending() {
    return this.carsService.findAllInAscending();
  }
  @Get()
  findAllInAscPaginated(@Query() paginationDto: PaginationDto): Promise<PaginatedCarsResultDto> {
    paginationDto.page = Number(paginationDto.page)
    paginationDto.limit = Number(paginationDto.limit)

    return this.carsService.findAllInAscPaginated({
      ...paginationDto,
      limit: paginationDto.limit > 100 ? 100 : paginationDto.limit
    })
  }
 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
