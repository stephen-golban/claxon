import { CurrentUser } from "@/common/decorators";
import type { NewClaxon, QueryClaxon, UpdateClaxon } from "@/drizzle/schema";
import type { User } from "@clerk/backend";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import type { ClaxonsService } from "./claxons.service";
import type { PaginationDto } from "./dto/pagination.dto";

@Controller("claxons")
export class ClaxonsController {
	constructor(private readonly claxonsService: ClaxonsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createClaxonDto: NewClaxon, @CurrentUser() user: User) {
		return this.claxonsService.create(createClaxonDto, user.id);
	}

	@Get("inbox")
	findInbox(
		@Query() paginationDto: PaginationDto & Partial<QueryClaxon>,
		@CurrentUser() user: User,
	) {
		return this.claxonsService.findInbox(user.id, paginationDto);
	}

	@Get("inbox/unread-count")
  getUnreadCount(@CurrentUser() user: User) {
    return this.claxonsService.getUnreadCount(user.id);
  }

	@Get("sent")
	findSent(
		@Query() paginationDto: PaginationDto & Partial<QueryClaxon>,
		@CurrentUser() user: User,
	) {
		return this.claxonsService.findSent(user.id, paginationDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string, @CurrentUser() user: User) {
		return this.claxonsService.findOne(id, user.id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateClaxonDto: UpdateClaxon,
		@CurrentUser() user: User,
	) {
		return this.claxonsService.update(id, updateClaxonDto, user.id);
	}
}
