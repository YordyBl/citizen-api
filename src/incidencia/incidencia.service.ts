import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {validate as isUUID} from 'uuid';
import { off } from 'process';
import { Incidencia, IncidenciaImage } from './entities';

@Injectable()
export class IncidenciaService {

  // Este es el manejador de errores

  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Incidencia)
    private readonly IncidenciaRepository: Repository<Incidencia>,
    @InjectRepository(IncidenciaImage)
    private readonly incidenciaImageRepository: Repository<IncidenciaImage>
  ) { }

  async create(createIncidenciaDto: CreateIncidenciaDto) {

    try {
      
      const {images = [], ...incidenciaDetails} = createIncidenciaDto

      const incidencia = this.IncidenciaRepository.create(
        {...incidenciaDetails, images:images.map(image=>this.incidenciaImageRepository.create({url:image}))}
      )

      await this.IncidenciaRepository.save(incidencia);

      return {...incidencia, images};

    } catch (error) {
      this.handleDBExceptions(error);
    }


    return 'This action adds a new incidencia';
  }

  async findAll(paginationDto: PaginationDto) {
      
    const {limit=10, offset=0} = paginationDto;

    const incidencias = await this.IncidenciaRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
    });
    
    return incidencias.map(incidencia =>({
      ...incidencia, images: incidencia.images.map(img=>img.url)
    }));
   
  }

  async findOne(term: string) {

    console.log(term);

     if (!term) {
        throw new BadRequestException('The search term must not be empty or undefined.');
        }

    let incidencia : Incidencia;

    if(isUUID(term)){
      incidencia = await this.IncidenciaRepository.findOneBy({id:term});
    }else {
        const queryBuilder = this.IncidenciaRepository.createQueryBuilder("incidencia");
        incidencia = await queryBuilder.where('title =:title', {
          title: term
        })
        .leftJoinAndSelect("incidencia.images", "images")
        .getOne();
    }

      if(!incidencia) 
          throw new NotFoundException('No existe esta incidencia');
      return incidencia
    
  }

  async findOnePlain(term:string){
    const {images=[], ...rest} = await this.findOne(term);
    return {...rest, images: images.map(image=> image.url)}
  }

  async findByTitle(title: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    if (!title) {
      throw new BadRequestException('The search term must not be empty or undefined.');
    }

    const incidencias = await this.IncidenciaRepository.createQueryBuilder('incidencia')
      .leftJoinAndSelect('incidencia.images', 'images')
      .where('incidencia.title LIKE :title', { title: `%${title}%` })
      .skip(offset)
      .take(limit)
      .getMany();

    return incidencias.map(incidencia => ({
      ...incidencia,
      images: incidencia.images.map(img => img.url),
    }));
  }



 async update(id: string, updateIncidenciaDto: UpdateIncidenciaDto) {

    const incidencia = await this.IncidenciaRepository.preload({
      id:  id,
      ...updateIncidenciaDto,
      images: []
    });

    if (!incidencia) throw new NotFoundException(`Incidencia con id: ${id} no existe`);
    try {
      await this.IncidenciaRepository.save(incidencia);
      return incidencia;
    } catch (error) {
      this.handleDBExceptions(error);
    }
     
  }

  async remove(id: string) {

    const incidencia = await this.findOne(id);

    await this.IncidenciaRepository.remove(incidencia);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }


}
