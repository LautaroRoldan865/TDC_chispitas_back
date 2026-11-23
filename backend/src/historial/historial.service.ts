import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistorialEntity } from './historial.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { CrearHistorialDto } from './dtos/crear-historial.dto';
import { ResponseCurrentStateDto } from './dtos/reponse-current-state';
import { HistorialCompletoDTO } from './dtos/response-historial-completo';
import { TelegramService } from '../telegram/telegram.service';
import { ConfiguracionService } from '../configuracion/configuracion.service';

@Injectable()
export class HistorialService {

    constructor(
        @InjectRepository(HistorialEntity)
        private readonly repository:Repository<HistorialEntity>,
        private readonly telegramService: TelegramService,
        private readonly configuracionService: ConfiguracionService,
    ) {}

    async crearHistorial(datos: CrearHistorialDto) {
        const historial = this.repository.create({
            ...datos,
            fecha: new Date()
        });

        const guardado = await this.repository.save(historial);
        // 🔔 Lógica de alerta Telegram
        try {
            const configs = await this.configuracionService.obtenerActual();
            const config = configs[0]; // obtenerActual() devuelve un array
            if (config && config.alertas) {
                const min = config.setpoint - config.tolerancia;
                const max = config.setpoint + config.tolerancia;
                if (datos.temperatura < min || datos.temperatura > max) {
                    await this.telegramService.enviarMensaje(
                        `⚠️ Alerta de temperatura!\n` +
                        `Temperatura actual: ${datos.temperatura}°C\n` +
                        `Rango permitido: ${min}°C – ${max}°C`
                    );
                }
            }
        } catch {
            // No interrumpir el guardado si Telegram falla
        }
        return guardado;
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
