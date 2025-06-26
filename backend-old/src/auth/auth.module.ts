import { ClerkClientProvider, ClerkStrategy } from "@/clerk";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, PassportModule],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
