export class HistorialCompletoDTO {
  historial!: { temperatura: number; fechaHora: string }[];
  temperaturaActual!: number;
  colorActual!: string;
  fechaDesde!: string | null;
  fechaHasta!: string | null;
}