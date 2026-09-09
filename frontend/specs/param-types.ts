import type { OperationType } from './api-types';

/** Filtro temporal compartido por las consultas de operaciones. */
export interface DateRangeFilter {
  /** Fecha inicial inclusiva en formato YYYY-MM-DD; opcional. */
  startDate?: string;
  /** Fecha final inclusiva en formato YYYY-MM-DD; opcional. */
  endDate?: string;
}

/** Parámetros de consulta para la tabla de anomalías. */
export interface AlertsParams extends DateRangeFilter {
  /** Umbral numérico mínimo que activa una alerta; debe ser mayor o igual que cero. */
  threshold?: number;
}

/** Parámetros de consulta para la tabla comparativa de categorías. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Segmento utilizado para ordenar las categorías: B2B o B2C. */
  operationType: OperationType;
  /** Máximo de categorías solicitadas; entero entre 1 y 100. */
  limit?: number;
}
