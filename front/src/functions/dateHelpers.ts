import dayjs from 'dayjs';

export const relativeDate = (date, t) => {
  let ti = '';
  const now = dayjs();
  const d = dayjs(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  const days = now.diff(d, 'day');
  const hours = now.diff(d, 'h');
  const minutes = now.diff(d, 'm');

  if (days) {
    if (days === 1) ti = `${days} ${t('Day')} ${t('ago')}`;
    else ti = `${days} ${t('Days')} ${t('ago')}`;
  } else if (!days && hours) ti = hours + ' ' + t('Hours') + ' ' + t('ago');
  else if (!days && !hours && minutes) {
    if (minutes < 60) ti = t('Half an hour') + ' ' + t('ago');
    if (minutes < 30) ti = t('A quarter') + ' ' + t('ago');
    if (minutes < 15) ti = t('Minutes') + ' ' + t('ago');
  } else ti = t('A few moments') + ' ' + t('ago');

  return ti;
};
