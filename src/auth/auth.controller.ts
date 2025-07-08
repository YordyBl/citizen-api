import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetHeaders } from './decorators/get-rawHeaders.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { META_ROLES, RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.login(loginUserDto);
  }


  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards( AuthGuard())
  testingPrivateRoute(
   @Req() request: Express.Request,
   @GetUser() user:User,
   @GetUser('email') userEmail:string,
   @GetHeaders() userHeaders: string[]
  ){
    //console.log(request)
    return {
      ok: true,
      user,
      userEmail,
      userHeaders,
      message : "probanding"
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards( AuthGuard(), UserRoleGuard)
  privateRoute2(
   @GetUser() user:User
  ){
    //console.log(request)
    return {
      ok: true,
      user,
      message : "probanding"
    }
  }


  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.user)
  privateRoute3(
   @GetUser() user:User
  ){
    //console.log(request)
    return {
      ok: true,
      user,
      message : "probanding"
    }
  }
  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
