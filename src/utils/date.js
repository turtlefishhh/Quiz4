export const toIsoDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const isSameDate = (dateString, compareDate = new Date()) => {
  if (!dateString) return false;
  return dateString === toIsoDate(compareDate);
};
