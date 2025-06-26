import { Public } from "@/common/decorators";
import type { ClaxonTemplate, NewClaxonTemplate } from "@/drizzle/schema";
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
import { ClaxonTemplatesService } from "./claxon-templates.service";

@Controller("claxon-templates")
export class ClaxonTemplatesController {
  constructor(
    private readonly claxonTemplatesService: ClaxonTemplatesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: NewClaxonTemplate) {
    return this.claxonTemplatesService.create(dto);
  }

  @Get()
  @Public()
  findAll(@Query() dto: ClaxonTemplate) {
    return this.claxonTemplatesService.findAll(dto);
  }

  @Get("category/:category")
  @Public()
  findByCategory(
    @Param("category") category: string,
    @Query() dto: ClaxonTemplate,
  ) {
    return this.claxonTemplatesService.findByCategory(category, dto);
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string, @Query() dto: ClaxonTemplate) {
    return this.claxonTemplatesService.findOne(id, dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: ClaxonTemplate) {
    return this.claxonTemplatesService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.claxonTemplatesService.remove(id);
  }
}
