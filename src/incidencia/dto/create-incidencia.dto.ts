import { IsArray, IsIn, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateIncidenciaDto {

        @IsString()
        @MinLength(1)
		title:string;
        
        @IsString()
        @MinLength(1)
		description:string;

        @IsString()
        @IsOptional()
        generated_details:string;

        @IsString()
		reported_date:string;

        @IsString({each:true})
        @IsArray()
        @IsOptional()
		tags:string[];

        @IsString()
        lat:string;

        @IsString()
        long:string;

        @IsNumber()
        priority:number;

        @IsString({each:true})
        @IsArray()
        images: string[]
}
