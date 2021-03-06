import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
const { request, gql } = require('graphql-request')
import { Job } from 'bull';

const endpoint = 'http://localhost:5000/graphql';
import { ExportToCsv } from 'export-to-csv';
const socketClusterClient = require('socketcluster-client');
const fs = require("fs");

@Processor('cardata')
export class CarDataProcessor {
  constructor() {

    this.socket = socketClusterClient.create({
      hostname: 'localhost',
      port: 8000
    });
  }
  private readonly logger = new Logger(CarDataProcessor.name);
  socket: any;
  @Process('exportByAge')
  async handleCarDataExportByAge(job: Job) {
    let ageLimit = job.data.ageLimit;
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

    const variables = {
      ageParam: ageLimit,
    }
    let output = await request(endpoint, query, variables)
    let exportedCarData = output.allCars.nodes;

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'export-by-agelimit : ' + ageLimit,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    const csvData = csvExporter.generateCsv(exportedCarData, true);
    fs.writeFile("export-by-age.csv", csvData, function (error) {
      if (error) throw error;
  
    });

    let result = await this.socket.invoke('csvExportProc', { username: 'bob' });



  }


}