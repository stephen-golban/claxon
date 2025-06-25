import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser, type AuthenticatedUser } from "../auth";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.create(createUserDto, user.userId);
  }

  @Get("current")
  findCurrent(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findByClerkId(user.userId);
  }

  @Get("by-clerk-id/:clerkId")
  findByClerkId(@Param("clerkId") clerkId: string) {
    return this.usersService.findByClerkId(clerkId);
  }

  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.update(user.userId, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.remove(user.userId);
  }
}
