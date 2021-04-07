import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
    first_name:string;
    last_name:string;
    email:string;
    car_make:string;
    car_model:string;
    vin:string;
    manufactured_date:Date;
    age_of_vehicle:string;

}
