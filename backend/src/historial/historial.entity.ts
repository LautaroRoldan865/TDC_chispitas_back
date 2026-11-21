import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Historial')
export class HistorialEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column('float')
    temperatura!: number;

    @Column('timestamp')
    fecha!: Date;

    @Column('float')
    rpm!: number;

    @Column('float')
    velocidad!: number;

    @Column('varchar', { length: 50 })
    color!: string;
}