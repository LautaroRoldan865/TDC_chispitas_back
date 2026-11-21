import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistorialService } from './historial/historial.service';
import { HistorialController } from './historial/historial.controller';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram/telegram.service';
import { ConfigController } from './configuracion/configuracion.controller';
import { ConfiguracionService } from './configuracion/configuracion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionEntity } from './configuracion/configuracion.entity';
import { HistorialEntity } from './historial/historial.entity';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: true,
      },
    }),

    
    
    TypeOrmModule.forFeature([HistorialEntity, ConfiguracionEntity]),
  ],
  controllers: [AppController, HistorialController, ConfigController],
  providers: [AppService, HistorialService, TelegramService, ConfiguracionService],
})
export class AppModule {}
