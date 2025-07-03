import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    getStaticIncidenciaImage (imageName: string){
        const path = join(__dirname, '../../static/images', imageName);
        console.log(path)
        if(!existsSync(path))
            throw new BadRequestException(`No incidencia found with image ${imageName}`);

        return path;
    }

}
