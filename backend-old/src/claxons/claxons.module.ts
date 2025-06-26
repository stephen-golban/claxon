import { DrizzleModule } from "@/drizzle/drizzle.module";
import { Module } from "@nestjs/common";
import { ClaxonsController } from "./claxons.controller";
import { ClaxonsService } from "./claxons.service";

@Module({
  imports: [DrizzleModule],
  controllers: [ClaxonsController],
  providers: [ClaxonsService],
  exports: [ClaxonsService],
})
export class ClaxonsModule {}
