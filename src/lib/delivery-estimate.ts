/**
 * Fuente única de verdad para la fecha estimada de entrega.
 *
 * Se cuenta en DÍAS NATURALES (calendario), no hábiles: la paquetería entrega
 * también en fin de semana, así que contar días hábiles inflaba la fecha
 * mostrada ~4 días respecto al tiempo real.
 *
 * Si cambian los tiempos de envío, se ajusta AQUÍ y se propaga a PDPs,
 * landing y checkout automáticamente.
 */

export const DELIVERY_MIN_DAYS = 4;
export const DELIVERY_MAX_DAYS = 7;

/** Copy corto reutilizable: "4 a 7 días" */
export const DELIVERY_RANGE_LABEL = `${DELIVERY_MIN_DAYS} a ${DELIVERY_MAX_DAYS} días`;

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Fechas límite del rango de entrega a partir de hoy. */
function getDeliveryWindow(): { earliest: Date; latest: Date } {
  const today = new Date();
  return {
    earliest: addCalendarDays(today, DELIVERY_MIN_DAYS),
    latest: addCalendarDays(today, DELIVERY_MAX_DAYS),
  };
}

/** Formato compacto para el resumen del checkout: "7 sep – 10 sep" */
export function getDeliveryRangeShort(): string {
  const { earliest, latest } = getDeliveryWindow();
  const fmt = (d: Date) =>
    d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  return `${fmt(earliest)} – ${fmt(latest)}`;
}

/**
 * Formato largo para las páginas de producto.
 * Mismo mes:  "lunes 7 y el jueves 10 de septiembre"
 * Cruza mes:  "lunes 28 de septiembre y el jueves 1 de octubre"
 */
export function getDeliveryRangeLong(): string {
  const { earliest, latest } = getDeliveryWindow();
  const weekday = (d: Date) => d.toLocaleDateString('es-MX', { weekday: 'long' });
  const month = (d: Date) => d.toLocaleDateString('es-MX', { month: 'long' });

  const sameMonth =
    earliest.getMonth() === latest.getMonth() &&
    earliest.getFullYear() === latest.getFullYear();

  const start = sameMonth
    ? `${weekday(earliest)} ${earliest.getDate()}`
    : `${weekday(earliest)} ${earliest.getDate()} de ${month(earliest)}`;

  const end = `${weekday(latest)} ${latest.getDate()} de ${month(latest)}`;

  return `${start} y el ${end}`;
}