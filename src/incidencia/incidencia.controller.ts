import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('incidencia')
export class IncidenciaController {



  constructor(private readonly incidenciaService: IncidenciaService) {}

  @Post()
  create(@Body() createIncidenciaDto: CreateIncidenciaDto) {
    return this.incidenciaService.create(createIncidenciaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.incidenciaService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.incidenciaService.findOnePlain(term);
  }

  @Get('title/:term')
  findMany(@Param('term') term: string, @Query() paginationDto: PaginationDto) {
    return this.incidenciaService.findByTitle(term, paginationDto);
  }


  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateIncidenciaDto: UpdateIncidenciaDto) {
    return this.incidenciaService.update(id, updateIncidenciaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidenciaService.remove(id);
  }
}
