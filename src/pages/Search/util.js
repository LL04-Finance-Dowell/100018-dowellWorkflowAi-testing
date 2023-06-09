const searchItemKeys = [
  {
    objectKey: 'document_name',
  },
  {
    objectKey: 'workflow_title',
    nestedObjectKey: true,
    parentObjectKey: 'workflows',
  },
  {
    objectKey: 'template_name',
  },
];

export const searchItemByKeyAndGroupResults = (searchVal, arrayToSearch) => {
  if (typeof searchVal !== 'string')
    throw Error("'searchVal' must be a string");
  if (!Array.isArray(arrayToSearch))
    throw Error("'arrayToSearch' must be an array");

  if (!arrayToSearch.every((item) => typeof item === 'object'))
    throw Error("Each item in 'arrayToSearch' must be an object");

  const outputResults = arrayToSearch
    .map((item) => {
      for (const keyToCheck of searchItemKeys) {
        if (
          keyToCheck.nestedObjectKey &&
          item[keyToCheck.parentObjectKey] &&
          item[keyToCheck.parentObjectKey][keyToCheck.objectKey]
        ) {
          if (
            item[keyToCheck.parentObjectKey][keyToCheck.objectKey]
              .toLocaleLowerCase()
              .includes(searchVal.toLocaleLowerCase())
          ) {
            return item;
          }
        }

        if (
          item[keyToCheck.objectKey] &&
          Array.isArray(item[keyToCheck.objectKey])
        ) {
          /** Works fine but to come back and uncomment after discussing */
          // if (item[keyToCheck.objectKey].some(d => d.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()))) {
          //     return item
          // }
          return null;
        }

        if (
          item[keyToCheck.objectKey] &&
          item[keyToCheck.objectKey]
            .toLocaleLowerCase()
            .includes(searchVal.toLocaleLowerCase())
        ) {
          return item;
        }
      }
      return null;
    })
    .filter((item) => item);

  return outputResults;
};
