export const formatDateForApi = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const [month, day, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};
