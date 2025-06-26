import { CurrentUser } from "@/common/decorators";
import type { NewVehicle, QueryVehicle, UpdateVehicle } from "@/drizzle/schema";
import type { User } from "@clerk/backend";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";

@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVehicleDto: NewVehicle, @CurrentUser() user: User) {
    return this.vehiclesService.create(createVehicleDto, user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryVehicle, @CurrentUser() user: User) {
    return this.vehiclesService.findAllByUser(user.id, queryDto);
  }

  @Get("search/:plateNumber")
  searchByPlate(@Param("plateNumber") plateNumber: string) {
    return this.vehiclesService.searchByPlate(plateNumber);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: User) {
    return this.vehiclesService.findOne(id, user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateVehicleDto: UpdateVehicle,
    @CurrentUser() user: User,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto, user.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.vehiclesService.remove(id, user.id);
  }
}
