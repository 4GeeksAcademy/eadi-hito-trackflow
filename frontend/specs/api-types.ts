/** Tipo de operación comercial que consume una vista comparativa. */
export type OperationType = 'B2B' | 'B2C';

/** Nivel de severidad permitido para una anomalía operativa. */
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Rango temporal disponible o aplicado por una consulta. */
export interface DateRangeReference {
  /** Fecha inicial inclusiva en formato YYYY-MM-DD; puede omitirse cuando no hay límite. */
  startDate?: string;
  /** Fecha final inclusiva en formato YYYY-MM-DD; puede omitirse cuando no hay límite. */
  endDate?: string;
}

/** Volumen resumido de una vista B2B o B2C dentro del rango consultado. */
export interface SegmentView {
  /** Cantidad total de operaciones del segmento. */
  total: number;
  /** Porcentaje del total combinado representado por el segmento, entre 0 y 100. */
  percentage: number;
}

/** Respuesta provisional para las facetas de rango y segmento B2B/B2C. */
export interface FacetsResponse {
  /** Rango de fechas usado para generar las facetas. */
  dateRange: DateRangeReference;
  /** Resumen de operaciones entre empresas (B2B). */
  b2b: SegmentView;
  /** Resumen de operaciones dirigidas al consumidor final (B2C). */
  b2c: SegmentView;
}

/** Anomalía individual que la tabla de alertas debe presentar. */
export interface AlertEntry {
  /** Identificador estable de la alerta. */
  id: string;
  /** Título breve y legible de la anomalía. */
  title: string;
  /** Explicación contextual para la persona operadora. */
  description: string;
  /** Severidad de la alerta, de baja a crítica. */
  severity: AlertSeverity;
  /** Métrica observada que disparó la alerta. */
  value: number;
  /** Umbral configurado contra el que se comparó la métrica. */
  threshold: number;
  /** Fecha y hora del evento en formato ISO 8601. */
  occurredAt: string;
}

/** Respuesta provisional de la tabla de anomalías operativas. */
export interface AlertsResponse {
  /** Rango de fechas utilizado para buscar anomalías. */
  dateRange: DateRangeReference;
  /** Umbral aplicado a la consulta. */
  threshold: number;
  /** Alertas ordenadas por severidad descendente y fecha descendente. */
  entries: AlertEntry[];
  /** Número total de alertas antes de cualquier límite visual. */
  total: number;
}

/** Categoría de producto agregada para la comparación B2B/B2C. */
export interface CategoryEntry {
  /** Identificador o nombre estable de la categoría de producto. */
  category: string;
  /** Cantidad de operaciones B2B en la categoría. */
  b2bTotal: number;
  /** Cantidad de operaciones B2C en la categoría. */
  b2cTotal: number;
  /** Porcentaje de la categoría dentro del volumen B2B, entre 0 y 100. */
  b2bPercentage: number;
  /** Porcentaje de la categoría dentro del volumen B2C, entre 0 y 100. */
  b2cPercentage: number;
}

/** Respuesta provisional de la tabla de categorías principales. */
export interface TopCategoriesResponse {
  /** Rango de fechas de la agregación. */
  dateRange: DateRangeReference;
  /** Segmento solicitado para ordenar o priorizar la comparación. */
  operationType: OperationType;
  /** Categorías ordenadas por el volumen del segmento solicitado. */
  entries: CategoryEntry[];
  /** Número total de categorías disponibles antes de aplicar limit. */
  total: number;
}
