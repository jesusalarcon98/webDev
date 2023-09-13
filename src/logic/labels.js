export const DATOS_FILTRADOS = (
  originalData,
  initialDate,
  finalDate,
  setFilteredDates
) => {
  const filteredDates = originalData.reduce((acc, item) => {
    const dateString = item.date.toString();
    const formattedDate = `${dateString.substr(0, 4)}/${dateString.substr(
      4,
      2
    )}/${dateString.substr(6, 2)}`;
    const currentDate = new Date(formattedDate);

    if (currentDate >= initialDate && currentDate <= finalDate) {
      return [...acc, formattedDate];
    }

    return acc;
  }, []);

  setFilteredDates(filteredDates);
};

export const FORMATTEDLABELS = (dataCovid) => {
  const labels = dataCovid.map((item) => {
    const dateString = item.date.toString();
    const formattedDate = `${dateString.substr(0, 4)}/${dateString.substr(
      4,
      2
    )}/${dateString.substr(6, 2)}`;
    return formattedDate;
  });
  return labels;
};

export const REVERSEDATA = (filterDates) => {
  const nextList = [...filterDates];
  nextList.reverse();
  return nextList;
};
