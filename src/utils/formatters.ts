export const getCurrentDateInStringFormat = (): string => {
  const now = new Date();

  const year = now.getFullYear();

  let month = (now.getMonth() + 1).toString();
  if (+month < 10) {
    month = '0' + month;
  }

  let day = now.getDate().toString();
  if (+day < 10) {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
};
