import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CrearHistorialDto {
  @IsNumber()
  temperatura!: number;

  @IsNumber()
  rpm!: number;

  @IsNumber()
  velocidad!: number;

  @IsString()
  @MaxLength(50)
  color!: string;
}
