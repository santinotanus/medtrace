export const formatDate = (
  dateString?: string | null,
  options: { includeTime?: boolean } = {},
) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  const formatter = new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...(options.includeTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
  });

  return formatter.format(date);
};

export const formatRelativeTime = (dateString?: string | null) => {
  if (!dateString) return '';
  const now = Date.now();
  const value = new Date(dateString).getTime();
  if (Number.isNaN(value)) return '';

  const diff = now - value;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'Hace unos segundos';
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hace 1 día';
  if (days < 7) return `Hace ${days} días`;

  const weeks = Math.floor(days / 7);
  if (weeks === 1) return 'Hace 1 semana';
  if (weeks < 4) return `Hace ${weeks} semanas`;

  const months = Math.floor(days / 30);
  if (months === 1) return 'Hace 1 mes';
  return `Hace ${months} meses`;
};
