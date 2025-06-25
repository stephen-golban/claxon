import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ClaxonsService } from "./claxons.service";
import { ClaxonsController } from "./claxons.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [ClaxonsController],
  providers: [ClaxonsService],
  exports: [ClaxonsService],
})
export class ClaxonsModule {}
