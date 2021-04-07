import { Car } from "../entities/car.entity"

export class PaginatedCarsResultDto {
  data: Car[]
  page: number
  limit: number
  totalCount: number
}