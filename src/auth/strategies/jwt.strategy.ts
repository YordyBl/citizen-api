import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>, 

        configService: ConfigService
       
    ){
        super({ 

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            secretOrKey: configService.get('JWT_SECRET'),

        });
    }

    async validate(payload: JwtPayload ): Promise<User> {

        const {email, phoneNumer} = payload;
        
        const user = await this.userRepository.findOneBy({email})

        if(!user)
            throw new UnauthorizedException('Usuario no valido');

        if (!user.isActive)
            throw new UnauthorizedException('Cuenta inhabilitada comunicate con soporte!')

        return user;
    }
}