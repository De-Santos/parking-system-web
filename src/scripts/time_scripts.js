import { DateTime } from 'luxon';

export function formatDateTime(dateTimeString)  {
  const date = new Date(dateTimeString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function formatDate(date) {
  return DateTime.fromJSDate(date).toISO({ includeOffset: true });
}

