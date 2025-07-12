import { IsBoolean, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto{

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com'
    })
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty({
        description: 'Contraseña del usuario',
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

}