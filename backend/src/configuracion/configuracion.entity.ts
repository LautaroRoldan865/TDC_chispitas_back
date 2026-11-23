import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('configuracion')
export class ConfiguracionEntity {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column('float')
  setpoint!: number;

  @Column('float')
  tolerancia!: number;

  @Column('boolean')
  alertas!: boolean;

}