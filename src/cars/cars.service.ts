import { Injectable, Logger } from '@nestjs/common';
import { UpdateCarDto } from './dto/update-car.dto';
const { request, gql } = require('graphql-request')
const fetch = require("node-fetch");
const endpoint = 'http://localhost:5000/graphql';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CarsService {

  constructor(
    @InjectQueue('cardata') private readonly carDataQueue: Queue
  ) {}
  private readonly logger = new Logger(CarsService.name);

  async exportCarDataToCsv(ageLimit: string) {
    console.log("sarted 22222222222222222");
    await this.carDataQueue.add('exportByAge', {
      ageLimit:  ageLimit,
    });
    return { message: "Submitted Car data to Export" };


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
    let output = await request(endpoint, query, variables)
    const car = output.carById;


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
        carPatch: updateCarDto
      }
    }
    let output = await request(endpoint, query, variables)
    const cars = output.updateCarById.car;
    return cars;
  }

  async getAllCars(pageLimit: number, afterCsr: String) {
    console.log("This is After Cursor " + afterCsr);
    if ("" == afterCsr) {
      afterCsr = null;
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
      after: afterCsr

    }

    let output = await request(endpoint, query, variables)
    const cars = output.allCars;
    return cars;

  };
  
  async getAllCarsFilteredAsc(first: number, offset: number, orderBy: String,carModel:String) {
   console.log("Filtered cammeeee ");
    const query = gql`query ($first: Int, $offset: Int, $carModel: String, $orderBy: [CarsOrderBy!]) {
      allCars(
        first: $first
        offset: $offset
        orderBy: $orderBy
        filter: {carModel: {startsWith: $carModel}}
      ) {
        nodes {
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
        totalCount
      }
    }`;

    const variables = {
      "first": first,
      "offset": offset,
      "orderBy": orderBy,
      "carModel":carModel

    }

    let output = await request(endpoint, query, variables)
    const cars = output.allCars;
    console.log(cars);
    return cars;

  };

  async getAllCarsAsc(first: number, offset: number, orderBy: String) {
  
    const query = gql`query ($first:Int,$offset:Int,$orderBy:[CarsOrderBy!]){allCars(first:$first,offset:$offset,orderBy:$orderBy){
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
      totalCount
     
    }
}`;

    const variables = {
      "first": first,
      "offset": offset,
      "orderBy": orderBy

    }

    let output = await request(endpoint, query, variables)
    const cars = output.allCars;
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
    console.log("jjjjjjjjjjj " + cars);
    return cars;


  };

  

}
