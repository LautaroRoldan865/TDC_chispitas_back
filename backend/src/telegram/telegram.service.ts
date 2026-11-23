import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly chatId: string;
  private readonly urlEnvio: string;

  constructor(config: ConfigService) {
    const token = config.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = config.getOrThrow<string>('TELEGRAM_CHAT_ID');
    this.urlEnvio = `https://api.telegram.org/bot${token}/sendMessage`;
  }

  async enviarMensaje(mensaje: string): Promise<void> {
    const texto = mensaje.trim();
    if (!texto) {
      throw new Error('El mensaje de Telegram está vacío.');
    }

    let respuesta: Response;
    try {
      respuesta = await fetch(this.urlEnvio, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: texto,
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new Error('No se pudo confirmar el envío a Telegram.');
    }

    if (!respuesta.ok) {
      throw new Error(`Telegram rechazó el mensaje (HTTP ${respuesta.status}).`);
    }

    const resultado = (await respuesta.json()) as { ok: boolean };
    if (!resultado.ok) {
      throw new Error('Telegram no confirmó el envío del mensaje.');
    }
  }
}