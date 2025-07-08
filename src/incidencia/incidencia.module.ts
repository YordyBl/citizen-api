import { Module } from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { IncidenciaController } from './incidencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidencia, IncidenciaImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [IncidenciaController],
  providers: [IncidenciaService],
  imports: [TypeOrmModule.forFeature([Incidencia, IncidenciaImage]),
   AuthModule,
]
})
export class IncidenciaModule {}
