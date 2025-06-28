import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IncidenciaImage } from "./incidencia-image.entity";
import { IsOptional } from "class-validator";

@Entity()
export class Incidencia {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('varchar', { nullable: false, length: 500 })
    title:string;

    @Column('text', {
        nullable: false
    })
    description:string;

    @Column('timestamp')
    reported_date:string;

    @Column('text', {
        array:true
    })
    sizes:string[];

    @Column('text')
    gender:string;


    @Column('text', {
        array:true,
        default: []
    })
    tags:string[];
    //las before or after update van en la entity

    @OneToMany(() => IncidenciaImage, images => images.incidencia, {cascade:true})
    images: IncidenciaImage[];
}
