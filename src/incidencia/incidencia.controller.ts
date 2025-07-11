import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('incidencia')
export class IncidenciaController {



  constructor(private readonly incidenciaService: IncidenciaService) {}

  @Post()
  @Auth()
  create(@Body() createIncidenciaDto: CreateIncidenciaDto, @GetUser() user: User, ) {
    return this.incidenciaService.create(createIncidenciaDto, user);
  }


  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.incidenciaService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.incidenciaService.findOnePlain(term);
  }

  @Get('title/:term')
  @Auth()
  findMany(@Param('term') term: string, @Query() paginationDto: PaginationDto) {
    return this.incidenciaService.findByTitle(term, paginationDto);
  }


  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateIncidenciaDto: UpdateIncidenciaDto, @GetUser() user: User) {
    return this.incidenciaService.update(id, updateIncidenciaDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidenciaService.remove(id);
  }
}
