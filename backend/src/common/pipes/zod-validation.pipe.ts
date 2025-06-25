import type { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { BadRequestException, Injectable } from "@nestjs/common";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      throw new BadRequestException("Validation failed");
    }
  }
}
