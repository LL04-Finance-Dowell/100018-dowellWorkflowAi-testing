import { timeZoneToCountryObj } from './timezonesObj';

export const formatDateAndTime = (dateTime) => {
  const newDate = new Date(dateTime);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return `${daysOfWeek[newDate.getDay()]} ${newDate.toLocaleString('default', {
    month: 'long',
  })} ${newDate.getDate()} ${newDate.getFullYear()} at ${newDate.toLocaleTimeString()}`;
};

export const setIsSelected = ({ items, item, boxId, title, type }) => {
  let isSelectedItems = [];
  const mainSetter = (modItems = items) => {
    return modItems.map((child) =>
      boxId === child._id
        ? {
            ...child,
            column: child.column.map((col) =>
              col.proccess_title === title
                ? {
                    ...col,
                    items: col.items.map((colItem) =>
                      colItem._id === item._id
                        ? {
                            ...colItem,
                            // isSelected: colItem.isSelected ? false : true,
                            isSelected: !colItem.isSelected,
                          }
                        : colItem
                    ),
                  }
                : col
            ),
          }
        : child
    );
  };

  if (type === 'checkbox') {
    isSelectedItems = mainSetter();
  } else if (type === 'radio') {
    // * Set isSelected for all options to false
    const modItems = items.map((child) => {
      return {
        ...child,
        column: child.column.map((col) => {
          return {
            ...col,
            items: col.items.map((colItem) => {
              return { ...colItem, isSelected: false };
            }),
          };
        }),
      };
    });

    isSelectedItems = mainSetter(modItems);
  }
  return isSelectedItems;
};

export const changeToTitleCase = (inputStr) => {
  if (typeof inputStr !== 'string') throw Error("'inputStr' must be a string");

  return (
    inputStr.slice(0, 1).toLocaleUpperCase() +
    inputStr.slice(1).toLocaleLowerCase()
  );
};

export const updateVerificationDataWithTimezone = (dataObj) => {
  if (typeof dataObj !== 'object') throw Error("'dataObj' must be an object");

  const outputDataObj = { ...dataObj };

  if (
    !dataObj.continent ||
    !dataObj.continent?.length < 1 ||
    !dataObj.city ||
    dataObj.city?.length < 1 ||
    !dataObj.country ||
    dataObj.country?.length < 1
  ) {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    outputDataObj.city = userTimezone.split('/')[1];
    outputDataObj.country = timeZoneToCountryObj[userTimezone]
      ? timeZoneToCountryObj[userTimezone]
      : '';
    outputDataObj.continent = userTimezone.split('/')[0];
  }

  return outputDataObj;
};
