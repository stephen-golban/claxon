import { DrizzleModule } from "@/drizzle/drizzle.module";
import { Module } from "@nestjs/common";
import { ClaxonTemplatesController } from "./claxon-templates.controller";
import { ClaxonTemplatesService } from "./claxon-templates.service";

@Module({
  imports: [DrizzleModule],
  controllers: [ClaxonTemplatesController],
  providers: [ClaxonTemplatesService],
  exports: [ClaxonTemplatesService],
})
export class ClaxonTemplatesModule {}
