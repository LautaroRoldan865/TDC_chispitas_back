import { Injectable, NotFoundException } from "@nestjs/common";
import { CrearConfiguracionDto } from "./dtos/crear-configuracion.dto";
import { ConfiguracionEntity } from "./configuracion.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class ConfiguracionService {

    constructor(
        @InjectRepository(ConfiguracionEntity)
        private readonly repository:Repository<ConfiguracionEntity>,
    ) {}
    
    async crear(dto: CrearConfiguracionDto) {
        const nueva = this.repository.create(dto);
        const guardada = await this.repository.save(nueva);
        return guardada;
    }

    async obtenerActual() {
        const resultado = await this.repository.query(`
            SELECT *
            FROM configuracion
            ORDER BY id DESC
            LIMIT 1
        `);

        if (!resultado) {
            throw new NotFoundException('Todavía no hay una configuración cargada');
        }
        return resultado;
    }

}
