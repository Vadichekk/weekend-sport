import { format, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";

export function formatRange(start: Date, end: Date) {
  if (isSameMonth(start, end)) {
    return `${format(start, "d", { locale: ru })}–${format(end, "d MMMM", { locale: ru })}`;
  }
  return `${format(start, "d MMMM", { locale: ru })} – ${format(end, "d MMMM", { locale: ru })}`;
}

export function formatDate(value: Date) {
  return format(value, "d MMMM yyyy", { locale: ru });
}

export function formatDateTime(value: Date) {
  return format(value, "d MMMM yyyy, HH:mm", { locale: ru });
}
