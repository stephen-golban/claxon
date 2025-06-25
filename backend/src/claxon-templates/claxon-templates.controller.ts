import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import type { ClaxonTemplatesService } from "./claxon-templates.service";
import type { CreateTemplateDto } from "./dto/create-template.dto";
import type { UpdateTemplateDto } from "./dto/update-template.dto";
import type { TemplateQueryDto } from "./dto/template-query.dto";
import { Public } from "../auth";

@Controller("claxon-templates")
export class ClaxonTemplatesController {
  constructor(
    private readonly claxonTemplatesService: ClaxonTemplatesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.claxonTemplatesService.create(createTemplateDto);
  }

  @Get()
  @Public()
  findAll(@Query() queryDto: TemplateQueryDto) {
    return this.claxonTemplatesService.findAll(queryDto);
  }

  @Get("category/:category")
  @Public()
  findByCategory(
    @Param("category") category: string,
    @Query() queryDto: TemplateQueryDto,
  ) {
    return this.claxonTemplatesService.findByCategory(category, queryDto);
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string, @Query() queryDto: TemplateQueryDto) {
    return this.claxonTemplatesService.findOne(id, queryDto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.claxonTemplatesService.update(id, updateTemplateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.claxonTemplatesService.remove(id);
  }
}
