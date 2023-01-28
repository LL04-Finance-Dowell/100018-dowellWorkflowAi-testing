export const formatDateAndTime = (dateTime) => {
  const newDate = new Date(dateTime);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return `${daysOfWeek[newDate.getDay()]} ${newDate.toLocaleString("default", {
    month: "long",
  })} ${newDate.getDate()} ${newDate.getFullYear()} at ${newDate.toLocaleTimeString()}`;
};

export const setIsSelected = ({ items, item, boxId, title }) => {
  console.log("items", items);
  console.log("item", item);
  console.log("boxId", boxId);
  console.log("title", title);
  const isSelectedItems = items.map((child) =>
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
                          isSelected: colItem.isSelected ? false : true,
                        }
                      : colItem
                  ),
                }
              : col
          ),
        }
      : child
  );

  console.log("wwwwwwwwww", isSelectedItems);

  return isSelectedItems;
};
