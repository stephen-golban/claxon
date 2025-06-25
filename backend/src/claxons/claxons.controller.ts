import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import type { ClaxonsService } from "./claxons.service";
import type { CreateClaxonDto } from "./dto/create-claxon.dto";
import type { UpdateClaxonDto } from "./dto/update-claxon.dto";
import type { PaginationDto } from "./dto/pagination.dto";
import { CurrentUser, type AuthenticatedUser } from "../auth";

@Controller("claxons")
export class ClaxonsController {
  constructor(private readonly claxonsService: ClaxonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createClaxonDto: CreateClaxonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.claxonsService.create(createClaxonDto, user.userId);
  }

  @Get("inbox")
  findInbox(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.claxonsService.findInbox(user.userId, paginationDto);
  }

  @Get("inbox/unread-count")
  getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.claxonsService.getUnreadCount(user.userId);
  }

  @Get("sent")
  findSent(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.claxonsService.findSent(user.userId, paginationDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.claxonsService.findOne(id, user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateClaxonDto: UpdateClaxonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.claxonsService.update(id, updateClaxonDto, user.userId);
  }
}
