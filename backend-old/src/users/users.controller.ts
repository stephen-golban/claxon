import { CurrentUser } from "@/common/decorators";
import type { NewUser, UpdateUser } from "@/drizzle/schema";
import type { User } from "@clerk/backend";
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
} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: NewUser, @CurrentUser() user: User) {
    return this.usersService.create(createUserDto, user.id);
  }

  @Get("current")
  findCurrent(@CurrentUser() user: User) {
    return this.usersService.findByClerkId(user.id);
  }

  @Get("by-clerk-id/:clerkId")
  findByClerkId(@Param("clerkId") clerkId: string) {
    return this.usersService.findByClerkId(clerkId);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUser, @CurrentUser() user: User) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }
}
