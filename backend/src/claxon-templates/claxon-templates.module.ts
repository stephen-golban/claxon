import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ClaxonTemplatesService } from "./claxon-templates.service";
import { ClaxonTemplatesController } from "./claxon-templates.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [ClaxonTemplatesController],
  providers: [ClaxonTemplatesService],
  exports: [ClaxonTemplatesService],
})
export class ClaxonTemplatesModule {}
