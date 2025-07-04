import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {

    try {
      const {password, ...userData} = createUserDto;
      
      const user = this.userRepository.create({...userData,
           password: bcrypt.hashSync(password, 10)});

      await this.userRepository.save(user);
      delete user.password;
      
      return user;
    } catch (error) {
      this.handleDBErrors(error);
      
    }

  };


  async login (loginUserDto: LoginUserDto){

      const {email, password} = loginUserDto;

      const user = await this.userRepository.findOne(
        {
          where:{email},
          select: {email:true, password:true}
        }
      );

      if(!user) throw new UnauthorizedException('Usuario no registrado');
      console.log(bcrypt.compareSync(password, user.password));
      if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Contraseña incorrecta');
      
      return user;

  };


  private handleDBErrors(error:any){
    if(error.code === '23505') throw new BadRequestException('Usuario ya registrado');
    throw new InternalServerErrorException('Please check server logs')
  };

  //   findAll() {
  //     return `This action returns all auth`;
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} auth`;
  //   }

  //   update(id: number, updateAuthDto: UpdateAuthDto) {
  //     return `This action updates a #${id} auth`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} auth`;
  //   }
  // 
}
