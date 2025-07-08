import { Incidencia } from "src/incidencia/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique:true
    })
    email:string;

    @Column('text', {select:false})
    password:string;

    @Column('text')
    firstName:string;

    @Column('text')
    lastName:string;

    @Column('text')
    phoneNumer:string;

    @Column('bool', {default: true})
    isActive:boolean;

    @Column('text', {
        array:true,
        default: ['user']
    })
    roles:string[];

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeUpdate();
    }

    @OneToMany( 
        ()=>Incidencia, (incidencia) => incidencia.user
    )
    incidencia: Incidencia

        // @OneToMany(() => IncidenciaImage, images => images.incidencia, {cascade:true, eager:true})
        // images: IncidenciaImage[];
}
