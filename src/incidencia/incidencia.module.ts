import { Module } from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { IncidenciaController } from './incidencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidencia, IncidenciaImage } from './entities';


@Module({
  controllers: [IncidenciaController],
  providers: [IncidenciaService],
  imports: [TypeOrmModule.forFeature([Incidencia, IncidenciaImage])]
})
export class IncidenciaModule {}
