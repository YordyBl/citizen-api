import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, HttpModule, AuthModule]
})
export class FilesModule {}
