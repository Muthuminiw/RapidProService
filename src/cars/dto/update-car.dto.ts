import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
    firstName:string;
    lastName:string;
    email:string;
    carModel:string;

}
