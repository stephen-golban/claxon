import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import type { VehiclesService } from "./vehicles.service";
import type { CreateVehicleDto } from "./dto/create-vehicle.dto";
import type { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { CurrentUser, type AuthenticatedUser } from "../auth";

@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.vehiclesService.create(createVehicleDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.vehiclesService.findAllByUser(user.userId);
  }

  @Get("search/:plateNumber")
  searchByPlate(@Param("plateNumber") plateNumber: string) {
    return this.vehiclesService.searchByPlate(plateNumber);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.vehiclesService.findOne(id, user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto, user.userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.vehiclesService.remove(id, user.userId);
  }
}
