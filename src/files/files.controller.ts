import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, NotFoundException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Post('incidencia/images')
  @ApiOperation({ 
    summary: 'Subir imagen para incidencia',
    description: 'Permite subir una imagen que será asociada a una incidencia' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, GIF)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Imagen subida exitosamente',
    example: 'https://api.example.com/files/incidencia/01d08057-b9b0-451f-94d3-fb8751cf9b7c.png'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Archivo vacío o formato inválido',
    example: {
      statusCode: 400,
      message: 'File is empty',
      error: 'Bad Request'
    }
  })
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/images',
      filename: fileNamer
    })
  }))
  uploadIncidenciaImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('File is empty')
    }
      const secureUrl = `${this.configService.get('HOST_API')}/files/incidencia/${file.filename}`
    return secureUrl;
  }

  @Get('/incidencia/:imageName')
  @ApiOperation({ 
    summary: 'Obtener imagen de incidencia',
    description: 'Retorna una imagen asociada a una incidencia por su nombre' 
  })
  @ApiParam({
    name: 'imageName',
    description: 'Nombre del archivo de imagen',
    example: '01d08057-b9b0-451f-94d3-fb8751cf9b7c.png'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Imagen encontrada',
    schema: {
      type: 'string',
      format: 'binary'
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Imagen no encontrada',
    example: {
      statusCode: 404,
      message: 'File not found',
      error: 'Not Found'
    }
  })
  findProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
    console.log(imageName);
    const path = this.filesService.getStaticIncidenciaImage(imageName);

    res.sendFile(path);

    // res.status(403).json({
    //   ok:false,
    //   path:path
    // })

  }
}
