import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('incidencia')
@Controller('incidencia')
export class IncidenciaController {

  constructor(private readonly incidenciaService: IncidenciaService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva incidencia',
    description: 'Permite a un usuario autenticado crear una nueva incidencia' 
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateIncidenciaDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Incidencia creada exitosamente',
    example: {
      id: 'uuid-generated',
      title: 'Bache en calle principal',
      description: 'Hay un bache grande en la calle principal que puede causar daños a los vehículos',
      reported_date: '2024-01-15T10:30:00Z',
      priority: 'ALTA',
      lat: '19.4326',
      long: '-99.1332',
      tags: ['infraestructura', 'urgente', 'calle'],
      images: [
        { id: 1, url: 'https://api.example.com/files/incidencia/image1.jpg' },
        { id: 2, url: 'https://api.example.com/files/incidencia/image2.jpg' }
      ],
      user: {
        id: 'user-uuid',
        email: 'usuario@ejemplo.com',
        firstName: 'Juan',
        lastName: 'Pérez'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    example: {
      statusCode: 400,
      message: ['title should not be empty'],
      error: 'Bad Request'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @Auth()
  create(@Body() createIncidenciaDto: CreateIncidenciaDto, @GetUser() user: User, ) {
    return this.incidenciaService.create(createIncidenciaDto, user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las incidencias (Solo Admin)',
    description: 'Retorna todas las incidencias con paginación. Solo usuarios con rol admin pueden acceder.' 
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de elementos a retornar' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Número de elementos a saltar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de incidencias obtenida exitosamente',
    example: [
      {
        id: 'uuid-1',
        title: 'Bache en calle principal',
        description: 'Descripción del bache',
        reported_date: '2024-01-15T10:30:00Z',
        priority: 'ALTA',
        lat: '19.4326',
        long: '-99.1332',
        tags: ['infraestructura'],
        images: [],
        user: {
          id: 'user-uuid',
          email: 'usuario@ejemplo.com',
          firstName: 'Juan',
          lastName: 'Pérez'
        }
      }
    ]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - Se requiere rol admin',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden'
    }
  })
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.incidenciaService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ 
    summary: 'Obtener incidencia por ID o título',
    description: 'Busca una incidencia específica por su ID o título' 
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'term',
    description: 'ID de la incidencia o título para buscar',
    example: 'uuid-de-incidencia'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Incidencia encontrada',
    example: {
      id: 'uuid-generated',
      title: 'Bache en calle principal',
      description: 'Hay un bache grande en la calle principal',
      reported_date: '2024-01-15T10:30:00Z',
      priority: 'ALTA',
      lat: '19.4326',
      long: '-99.1332',
      tags: ['infraestructura', 'urgente'],
      images: [
        { id: 1, url: 'https://api.example.com/files/incidencia/image1.jpg' }
      ],
      user: {
        id: 'user-uuid',
        email: 'usuario@ejemplo.com',
        firstName: 'Juan',
        lastName: 'Pérez'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Incidencia no encontrada',
    example: {
      statusCode: 404,
      message: 'Incidencia not found',
      error: 'Not Found'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @Auth()
  findOne(@Param('term') term: string) {
    return this.incidenciaService.findOnePlain(term);
  }

  @Get('title/:term')
  @ApiOperation({ 
    summary: 'Buscar incidencias por título',
    description: 'Busca incidencias que contengan el término especificado en su título' 
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'term',
    description: 'Término a buscar en los títulos',
    example: 'bache'
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de elementos a retornar' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Número de elementos a saltar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Incidencias encontradas',
    example: [
      {
        id: 'uuid-1',
        title: 'Bache en calle principal',
        description: 'Descripción del bache',
        reported_date: '2024-01-15T10:30:00Z',
        priority: 'ALTA',
        lat: '19.4326',
        long: '-99.1332',
        tags: ['infraestructura'],
        images: [],
        user: {
          id: 'user-uuid',
          email: 'usuario@ejemplo.com',
          firstName: 'Juan',
          lastName: 'Pérez'
        }
      }
    ]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @Auth()
  findMany(@Param('term') term: string, @Query() paginationDto: PaginationDto) {
    return this.incidenciaService.findByTitle(term, paginationDto);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar incidencia (Solo Admin)',
    description: 'Permite actualizar una incidencia existente. Solo usuarios con rol admin pueden actualizar.' 
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID de la incidencia a actualizar',
    example: 'uuid-de-incidencia'
  })
  @ApiBody({ type: UpdateIncidenciaDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Incidencia actualizada exitosamente',
    example: {
      id: 'uuid-generated',
      title: 'Bache en calle principal - ACTUALIZADO',
      description: 'Descripción actualizada del bache',
      reported_date: '2024-01-15T10:30:00Z',
      priority: 'MODERADA',
      lat: '19.4326',
      long: '-99.1332',
      tags: ['infraestructura', 'resuelto'],
      images: [
        { id: 1, url: 'https://api.example.com/files/incidencia/image1.jpg' }
      ],
      user: {
        id: 'user-uuid',
        email: 'usuario@ejemplo.com',
        firstName: 'Juan',
        lastName: 'Pérez'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    example: {
      statusCode: 400,
      message: ['priority must be one of the following values: BAJA, MODERADA, ALTA'],
      error: 'Bad Request'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - Se requiere rol admin',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden'
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Incidencia no encontrada',
    example: {
      statusCode: 404,
      message: 'Incidencia not found',
      error: 'Not Found'
    }
  })
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateIncidenciaDto: UpdateIncidenciaDto, @GetUser() user: User) {
    return this.incidenciaService.update(id, updateIncidenciaDto, user);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar incidencia (Solo Admin)',
    description: 'Permite eliminar una incidencia existente. Solo usuarios con rol admin pueden eliminar.' 
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID de la incidencia a eliminar',
    example: 'uuid-de-incidencia'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Incidencia eliminada exitosamente',
    example: {
      message: 'Incidencia deleted successfully'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - Se requiere rol admin',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden'
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Incidencia no encontrada',
    example: {
      statusCode: 404,
      message: 'Incidencia not found',
      error: 'Not Found'
    }
  })
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidenciaService.remove(id);
  }
}
