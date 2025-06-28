import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Incidencia } from "./incidencia.entity";

@Entity()
export class IncidenciaImage{
       
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text')
    url:string;

    @ManyToOne(()=>Incidencia, incidencia => incidencia.images)
    incidencia:Incidencia;

}