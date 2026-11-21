import { Body, Controller, Get, Post } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CrearHistorialDto } from './dtos/crear-historial.dto';
import { HistorialEntity } from './historial.entity';

@Controller('historial')
export class HistorialController {

    constructor(
        private readonly historialService: HistorialService
    ) {}

    @Post()
    async crearHistorial(@Body() historial: CrearHistorialDto): Promise<HistorialEntity> {
        return await this.historialService.crearHistorial(historial);
    }

    @Get()
    async obtenerHistorial() {
        return await this.historialService.obtenerHistorial();
    }

    @Get('current-state')
    async obtenerUltimoHistorial() {
        return await this.historialService.obtenerUltimoHistorial();
    }
}
