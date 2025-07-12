import { IsBoolean, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty({
        description: 'Contraseña del usuario (debe contener al menos una mayúscula, una minúscula y un número)',
        example: 'MiPassword123',
        minLength: 3,
        maxLength: 50
    })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan',
        minLength: 2
    })
    @IsString()
    @MinLength(2)
    firstName:string;

    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Pérez',
        minLength: 2
    })
    @IsString()
    @MinLength(2)
    lastName:string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '555123456',
        minLength: 9,
        maxLength: 11
    })
    @IsString()
    @MinLength(9)
    @MaxLength(11)
    phoneNumer:string;

    @ApiProperty({
        description: 'Estado de activación del usuario',
        example: true,
        default: true
    })
    @IsBoolean()
    isActive:boolean;

}