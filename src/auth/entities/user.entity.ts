import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

}
