import { IsBoolean, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(2)
    firstName:string;

    @IsString()
    @MinLength(2)
    lastName:string;

    @IsString()
    @MinLength(9)
    @MaxLength(11)
    phoneNumer:string;

    @IsBoolean()
    isActive:boolean;

}