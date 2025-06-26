import { ClaxonTemplatesModule } from "@/claxon-templates/claxon-templates.module";
import { ClaxonsModule } from "@/claxons/claxons.module";
import { ClerkAuthGuard, ClerkClientProvider } from "@/clerk";
import { GlobalExceptionFilter } from "@/common/filters";
import { ResponseInterceptor } from "@/common/interceptors";
import { UsersModule } from "@/users/users.module";
import { VehiclesModule } from "@/vehicles/vehicles.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { DrizzleModule } from "./drizzle/drizzle.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    AuthModule,
    UsersModule,
    ClaxonsModule,
    VehiclesModule,
    ClaxonTemplatesModule,
  ],
  controllers: [],
  providers: [
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
