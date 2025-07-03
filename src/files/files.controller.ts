import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, NotFoundException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Post('incidencia/images')
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
