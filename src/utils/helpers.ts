export const calculateAge = (birthDate: Date): number => {
  const currentDate = new Date();

  const year = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth() - birthDate.getMonth();

  const day = currentDate.getDate() < birthDate.getDate();

  if (month < 0 || (month === 0 && day)) {
    return year - 1;
  }

  return year;
};
