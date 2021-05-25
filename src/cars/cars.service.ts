import { Injectable, Logger } from '@nestjs/common';
import { UpdateCarDto } from './dto/update-car.dto';
const { request, gql } = require('graphql-request')
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./app.properties');
const endpoint = 'http://localhost:5000/graphql';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CarsService {
  // qury_getAllCarsFilteredAsc
  constructor(
    @InjectQueue('cardata') private readonly carDataQueue: Queue
  ) {}
  private readonly logger = new Logger(CarsService.name);

  async exportCarDataToCsv(ageLimit: string) {
  
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
  
    return output.deleteCarById.deletedCarId;
  }

  async update(idParam: string, updateCarDto: UpdateCarDto) {
    const query = gql`mutation($input:UpdateCarByIdInput!){
      updateCarById(input:$input){
        car{
          id
          email
          firstName
          carModel
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
    const carItem = output.updateCarById.car;
    return carItem;
  }

  async getAllCars(pageLimit: number, afterCsr: String) {
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

 console.log("This is consoles************** "+properties.get('qury_getAllCarsFilteredAsc'))
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
    return cars;


  };

  

}
