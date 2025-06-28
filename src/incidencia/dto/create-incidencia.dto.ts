import { IsArray, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateIncidenciaDto {

        @IsString()
        @MinLength(1)
		title:string;
        
        @IsString()
        @MinLength(1)
		description:string;

        @IsString()
		reported_date:string;

        @IsString({each:true})
        @IsArray()
		sizes:string[];

        @IsString({each:true})
        @IsArray()
        @IsOptional()
		tags:string[];

        @IsIn(['men', 'women', 'other'])
        gender:string;

        @IsString({each:true})
        @IsArray()
        images: string[]
}
