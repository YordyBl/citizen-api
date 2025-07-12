// files.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, createReadStream } from 'fs';
import { join } from 'path';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class FilesService {
  constructor(private readonly httpService: HttpService) {}

  getStaticIncidenciaImage(imageName: string) {
    const path = join(__dirname, '../../static/images', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException(`No incidencia found with image ${imageName}`);
    }
    return path;
  }

  async clasificarImagenConFastAPI(imageName: string): Promise<any> {
    const imagePath = this.getStaticIncidenciaImage(imageName);
    const stream = createReadStream(imagePath);

    const form = new FormData();
    form.append('file', stream);

    const response$ = this.httpService.post(
      'http://localhost:8000/clasificar/',
      form,
      { headers: form.getHeaders() }
    );

    try {
      const result = await lastValueFrom(response$);
      return result.data;
    } catch (error) {
      throw new BadRequestException('Error al consumir FastAPI: ' + error.message);
    }
  }
}
