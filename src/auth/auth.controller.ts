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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con los datos proporcionados' 
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    example: {
      id: 'uuid-generated',
      email: 'usuario@ejemplo.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumer: '555123456',
      isActive: true,
      roles: ['user'],
      token: 'jwt-token-generated'
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password is too short'],
      error: 'Bad Request'
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El usuario ya existe',
    example: {
      statusCode: 409,
      message: 'User already exists',
      error: 'Conflict'
    }
  })
  create(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica a un usuario y devuelve un token JWT' 
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    example: {
      id: 'uuid-generated',
      email: 'usuario@ejemplo.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumer: '555123456',
      isActive: true,
      roles: ['user'],
      token: 'jwt-token-generated'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized'
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    example: {
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request'
    }
  })
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiOperation({ 
    summary: 'Verificar estado de autenticación',
    description: 'Verifica si el token JWT es válido y devuelve información del usuario' 
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    example: {
      id: 'uuid-generated',
      email: 'usuario@ejemplo.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumer: '555123456',
      isActive: true,
      roles: ['user'],
      token: 'jwt-token-refreshed'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido o expirado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }
}
