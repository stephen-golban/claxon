import { CurrentUser } from "@/common/decorators";
import type { User } from "@clerk/backend";
import { Controller, Get } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  @Get("me")
  async getClerkUser(@CurrentUser() user: User) {
    return user;
  }
}
