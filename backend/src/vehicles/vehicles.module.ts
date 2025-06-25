import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { VehiclesService } from "./vehicles.service";
import { VehiclesController } from "./vehicles.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
