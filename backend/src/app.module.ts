import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { DatabaseModule } from "./database";
import { AuthModule, ClerkAuthGuard } from "./auth";
import { UsersModule } from "./users/users.module";
import { VehiclesModule } from "./vehicles/vehicles.module";
import { ClaxonsModule } from "./claxons/claxons.module";
import { ClaxonTemplatesModule } from "./claxon-templates/claxon-templates.module";
import { UploadModule } from "./upload/upload.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    ClaxonsModule,
    ClaxonTemplatesModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
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
