import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidenciaModule } from './incidencia/incidencia.module';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';


@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      
    }),
    IncidenciaModule,
    CommonModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
