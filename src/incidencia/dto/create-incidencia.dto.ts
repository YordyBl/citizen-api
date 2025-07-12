import { IsArray, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateIncidenciaDto {

        @ApiProperty({
            description: 'Título de la incidencia',
            example: 'Bache en calle principal',
            minLength: 1
        })
        @IsString()
        @MinLength(1)
		title:string;
        
        @ApiProperty({
            description: 'Descripción detallada de la incidencia',
            example: 'Hay un bache grande en la calle principal que puede causar daños a los vehículos',
            minLength: 1
        })
        @IsString()
        @MinLength(1)
		description:string;

        @ApiProperty({
            description: 'Detalles generados automáticamente (opcional)',
            example: 'Incidencia reportada por el sistema de IA',
            required: false
        })
        @IsString()
        @IsOptional()
        generated_details:string;

        @ApiProperty({
            description: 'Fecha en la que se reportó la incidencia',
            example: '2024-01-15T10:30:00Z'
        })
        @IsString()
		reported_date:string;

        @ApiProperty({
            description: 'Etiquetas asociadas a la incidencia (opcional)',
            example: ['infraestructura', 'urgente', 'calle'],
            type: [String],
            required: false
        })
        @IsString({each:true})
        @IsArray()
        @IsOptional()
		tags:string[];

        @ApiProperty({
            description: 'Latitud de la ubicación de la incidencia',
            example: '19.4326'
        })
        @IsString()
        lat:string;

        @ApiProperty({
            description: 'Longitud de la ubicación de la incidencia',
            example: '-99.1332'
        })
        @IsString()
        long:string;

        @ApiProperty({
            description: 'Nivel de prioridad de la incidencia',
            example: 'ALTA',
            enum: ['BAJA', 'MODERADA', 'ALTA']
        })
        @IsIn(['BAJA', 'MODERADA', 'ALTA'])
        priority:string;

        @ApiProperty({
            description: 'URLs de las imágenes asociadas a la incidencia',
            example: ['https://api.example.com/files/incidencia/image1.jpg', 'https://api.example.com/files/incidencia/image2.jpg'],
            type: [String]
        })
        @IsString({each:true})
        @IsArray()
        images: string[]
}
