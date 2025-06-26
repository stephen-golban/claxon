import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Max, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  read?: string;
}
