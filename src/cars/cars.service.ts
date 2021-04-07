import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { getConnection, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedCarsResultDto } from './dto/paginatedCarsResult.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) { }

  create(createCarDto: CreateCarDto) {
    const am = this.carRepository.create(createCarDto);
    this.carRepository.save(am);
    return am;
  }

  findAll() {
    return this.carRepository.find();
  }

  findAllInAscending() {
    return this.carRepository
    .createQueryBuilder()
    .orderBy("manufactured_date", "ASC")
    .execute();
    
  }

  async findAllInAscPaginated(paginationDto: PaginationDto): Promise<PaginatedCarsResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.carRepository.count()
    const cars = await this.carRepository.createQueryBuilder()
      .orderBy('manufactured_date', "ASC")
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany()

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: cars,
    }
  }


  findOne(id: string) {
    return this.carRepository.findOne({ where: { id } });
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    this.carRepository.update({ id }, updateCarDto);
    return this.carRepository.findOne({ id });
  }

  remove(id: string) {
    this.carRepository.delete({ id });
    return { deleted: true };
  }

}
