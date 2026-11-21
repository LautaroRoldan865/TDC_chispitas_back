import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistorialEntity } from './historial.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { CrearHistorialDto } from './dtos/crear-historial.dto';
import { ResponseCurrentStateDto } from './dtos/reponse-current-state';
import { HistorialCompletoDTO } from './dtos/response-historial-completo';

@Injectable()
export class HistorialService {

    constructor(
        @InjectRepository(HistorialEntity)
        private readonly repository:Repository<HistorialEntity>,
    ) {}

    async crearHistorial(datos: CrearHistorialDto) {
        const historial = this.repository.create({
            ...datos,
            fecha: new Date()
        });

        return await this.repository.save(historial);
    }

    async obtenerHistorial(fechaDesde?: Date, fechaHasta?: Date): Promise<HistorialCompletoDTO> {
        const response =await this.repository.createQueryBuilder('historial')
            .where(fechaDesde ? 'historial.fecha >= :fechaDesde' : '1=1', { fechaDesde })
            .andWhere(fechaHasta ? 'historial.fecha <= :fechaHasta' : '1=1', { fechaHasta })
            .orderBy('historial.fecha', 'DESC')
            .getMany();
        
        const historialCompleto: HistorialCompletoDTO = {
            historial: response.map(h => ({ temperatura: h.temperatura, fechaHora: h.fecha.toISOString() })),
            temperaturaActual: response.length > 0 ? response[0].temperatura : 0,
            colorActual: response.length > 0 ? response[0].color : '',
            fechaDesde: fechaDesde ? fechaDesde.toISOString() : null,
            fechaHasta: fechaHasta ? fechaHasta.toISOString() : null
        };

        return historialCompleto;
    }

    async obtenerUltimoHistorial(): Promise<ResponseCurrentStateDto | null> {
        const response = await this.repository.createQueryBuilder('historial')
            .orderBy('historial.fecha', 'DESC')
            .getOne();
        
        if (!response) {
            return null;
        }else{
            const responseDto: ResponseCurrentStateDto = {
                temperatura: response.temperatura,
                color: response.color,
                velocityRmp: response.rpm,
                velocityPercent: response.velocidad
            };
            return responseDto;
        }
    }


}
