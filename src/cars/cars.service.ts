import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { getConnection, getRepository, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

import { PaginatedCarsResultDto } from './dto/paginatedCarsResult.dto';
import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs'
import { AppGateway } from 'src/app.gateway';

const { request, gql } = require('graphql-request')
const fetch = require("node-fetch");
const endpoint = 'http://localhost:5000/graphql';

@Injectable()
export class CarsService {
  constructor(
   
    private appGateway: AppGateway
  ) { }



  // async searchWithWildChars(searchKey: string) {
  //   if ("*" == searchKey.charAt(searchKey.length - 1)) {
  //     searchKey = searchKey.slice(0, searchKey.length - 1);
  //     var cars = await getRepository(Car)
  //       .createQueryBuilder("car")
  //       .where("car.car_model like :searchTag", { searchTag: `${searchKey}%` })
  //       .orderBy('manufactured_date', "ASC")
  //       .getMany();

  //     return cars;
  //   } else {

  //     var cars = await getRepository(Car)
  //       .createQueryBuilder("car")
  //       .where("car.car_model = :searchTag", { searchTag: `${searchKey}` })
  //       .orderBy('manufactured_date', "ASC")
  //       .getMany();

  //     return cars;
  //   }


  // }
  async exportCarDataToCsv(ageLimit: string) {

    const query = gql`query ($ageParam:BigFloat!){allCars(filter: {
      ageOfVehicle: {  greaterThan :$ageParam}
  }){nodes{
        
        id
        firstName
        lastName
        email
        carMake
        carModel
        ageOfVehicle}}}`;
    console.log(endpoint);
    console.log(query);
    const variables = {
      ageParam: ageLimit,
    }
    let output = await request(endpoint, query,variables)
    const cars = output.allCars.nodes;
    
    this.appGateway.server.emit('exportToCsv', 'AAAAAAAAAAA');

    return cars;

  }

  async carById(idParam: string) {

    const query = gql`query($id:UUID!){carById(id:$id){
      id
      firstName
      lastName
      email
      carMake
      carModel
      manufacturedDate
      ageOfVehicle
    }}`;
    console.log(endpoint);
    console.log(query);
    const variables = {
      id: idParam,
    }
    let output = await request(endpoint, query,variables)
    const car = output.carById;
    
    this.appGateway.server.emit('exportToCsv', 'AAAAAAAAAAA');

    return car;

  }

  


  async deleteCar(idParam: string) {
    const query = gql`mutation($id:UUID!) {
      deleteCarById(input:{id:$id}) {
       deletedCarId
      }}`;

    const variables = {
      id: idParam,
    }
    let output = await request(endpoint, query, variables)
    console.log(output);
    return output.deleteCarById.deletedCarId;
  }

  async update(idParam: string, updateCarDto: UpdateCarDto) {
    // this.carRepository.update({ id }, updateCarDto);
    // return this.carRepository.findOne({ id });
    const query = gql`mutation($input:UpdateCarByIdInput!){
      updateCarById(input:$input){
        car{
          id
          email
          firstName
          lastName
          ageOfVehicle
          vin
          manufacturedDate
        }
      }}`;

    const variables = {
      input: {
        id: idParam,
        carPatch:updateCarDto
      }
    }
    let output = await request(endpoint, query, variables)
    const cars = output.updateCarById.car;
    return cars;
  }

  // async findAllInAscPaginated(paginationDto: PaginationDto): Promise<PaginatedCarsResultDto> {
  //   const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

  //   const totalCount = await this.carRepository.count()
  //   const cars = await this.carRepository.createQueryBuilder()
  //     .orderBy('manufactured_date', "ASC")
  //     .offset(skippedItems)
  //     .limit(paginationDto.limit)
  //     .getMany()

  //   return {
  //     totalCount,
  //     page: paginationDto.page,
  //     limit: paginationDto.limit,
  //     data: cars,
  //   }
  // }


  // findOne(id: string) {
  //   return this.carRepository.findOne({ where: { id } });
  // }

  async getAllCars(pageLimit:number, afterCsr:String) {
    if(""==afterCsr){
      afterCsr=null;
    }
    const query = gql`query ($first:Int,$after:Cursor){allCars(first: $first, after:$after){
      nodes{
        id
        firstName
        lastName
        email
        carMake
        carModel 
        vin
        manufacturedDate
        ageOfVehicle
      }
      
      pageInfo{hasNextPage
      endCursor}
      
      totalCount}
    }`;
    
    const variables = {
        first: pageLimit,
        after:afterCsr
      
    }

    let output = await request(endpoint, query,variables)
    const cars = output.allCars;
    console.log("jjjjjjjjjjj "+cars);
    return cars;


  };



  async getCars() {
  
    const query = gql`query {allCars{
      nodes{
        id
        firstName
        lastName
        email
        carMake
        carModel 
        vin
        manufacturedDate
        ageOfVehicle
      }}
      
     
    }`;
    
  

    let output = await request(endpoint, query)
    const cars = output.allCars.nodes;
    console.log("jjjjjjjjjjj "+cars);
    return cars;


  };

  async searchCarsByModel() {
    const query = gql`query ($ageParam:BigFloat!,$pageLimit:Int,$after:Cursor){allCars(first: $pageLimit, after:$after){
      nodes{
        firstName
        carMake
      carModel
      ageOfVehicle}
      
      pageInfo{hasNextPage
      startCursor
      endCursor}
      
      totalCount}
    }`;
    console.log(endpoint);
    console.log(query);

    let output = await request(endpoint, query)
    const cars = output.allCars.nodes;
    return cars;


  };

}
