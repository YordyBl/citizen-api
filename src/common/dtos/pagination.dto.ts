import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto{
    
    @ApiProperty({
        description: 'Número máximo de elementos a retornar',
        example: 10,
        minimum: 1,
        required: false
    })
    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    limit?: number;

    @ApiProperty({
        description: 'Número de elementos a saltar para la paginación',
        example: 0,
        minimum: 0,
        required: false
    })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    offset?:number;
}