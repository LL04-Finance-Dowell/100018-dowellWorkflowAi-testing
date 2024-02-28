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

  // * The below function is same as the one above, it just has more console.logs for debugging.
  // const mainSetter = (modItems = items) => {
  //   return modItems.map((child) => {
  //     return boxId === child._id
  //       ? {
  //           ...child,
  //           column: child.column.map((col) => {
  //             return col.proccess_title === title
  //               ? {
  //                   ...col,
  //                   items: col.items.map((colItem) => {
  //                   
  //                     return colItem._id === item._id
  //                       ? {
  //                           ...colItem,
  //                           isSelected: !colItem.isSelected,
  //                         }
  //                       : colItem;
  //                   }),
  //                 }
  //               : col;
  //           }),
  //         }
  //       : child;
  //   });
  // };

  if (type === 'checkbox') {
    isSelectedItems = mainSetter();
  } else if (type === 'radio' || type === 'unselect_all') {
    // * Set 'isSelected' for all radio options and portfolio options for new teams to false
    const modItems = items.map((child) =>
      boxId === child._id
        ? {
          ...child,
          column: child.column.map((col) => {
            return {
              ...col,
              items: col.items.map((colItem) => {
                return { ...colItem, isSelected: false };
              }),
            };
          }),
        }
        : child
    );

    isSelectedItems = type !== 'unselect_all' ? mainSetter(modItems) : modItems;
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


export const extractAuthQueryParamsFromVerificationURL = (inputUrl) => {
  if (typeof inputUrl !== 'string') return ''

  try {
    const validUrl = new URL(inputUrl);
    const shortenedVerificationURL = validUrl.origin + inputUrl.split('verify/')[1]?.split('/')[1];
    const paramsPassed = new URL(shortenedVerificationURL).searchParams;
    return `role~${paramsPassed.get('auth_role')}~userType~${paramsPassed.get('user_type')}~portfolio~${paramsPassed.get('portfolio')}~username~${paramsPassed.get('username')}~org~${paramsPassed.get('org')}~product~${paramsPassed.get('product') ? paramsPassed.get('product') : paramsPassed.get(`${validUrl.origin}?product`)}`

  } catch (error) {
    return ''
  }
}

export const extractTokenFromVerificationURL = (inputUrl) => {
  if (typeof inputUrl !== 'string') return ''

  return inputUrl.split('verify/')[1]?.split('/')[0]
}

export const productName = "Workflow AI";

export const extractProcessIdFromProcessImportURL = (inputUrl) => {
  if (typeof inputUrl !== 'string') return ''

  return inputUrl.split('processes/process-import/')[1]?.split('/')[0]
}

export const processDetailReport =
{
  "scale_category": "nps scale",
  "no_of_scales": 7,
  "nps_score": 35,
  "nps_total_score": 70,
  "max_total_score": 10,
  "score_list": [
    1,
    3,
    2,
    10,
    7,
    4,
    8
  ],
  "normality_analysis": {
    "bins": 10,
    "allowed_error": 4,
    "series_count": 1,
    "list1": {
      "normality": "no",
      "auc_z_scores": 0,
      "actual_areas": 3.4195114614280935,
      "rectangle_area": 3.7302398462190056,
      "Kurt": "Leptokurtic curve",
      "ind_dev": 1,
      "slope": [
        0.36789614249311026
      ],
      "slope_percentage_deviation": 0.25,
      "calculated_slope": 1.8376730227286462,
      "evidence_counter": {
        "Mean equals to Median": {
          "Mean is within deviation": "yes",
          "Median is within deviation": "yes"
        },
        "Mean equals to Mode": {
          "Mean is within deviation": "yes",
          "Mode is within deviation": "yes"
        },
        "Mode equals to Median": {
          "Mode is within deviation": "yes",
          "Median is within deviation": "yes"
        },
        "Skewness is equal to 0": {
          "Standard deviation is within deviation": "yes"
        },
        "Kurtosis curve": "no",
        "Points in Range1": "no",
        "Points in Range2": "no",
        "Points in Range3": "no",
        "Satifies sigmoid function whose mirror image will give bell shaped curve": "no",
        "Rotational Symmetric": "no"
      }
    }
  },
  "central_tendencies": {
    "processSequenceId": "16",
    "poisson_dist": {
      "series": {
        "list1": [
          1,
          3,
          2,
          10,
          7,
          4,
          8
        ]
      },
      "minimumSeries": 7,
      "maximumSeries": 7,
      "minimumSeriesDatapoint": {
        "list1": 1
      },
      "minimumContinuousDatapoint": 1,
      "mean": {
        "list1": 5
      },
      "median": {
        "list1": 4
      },
      "mode": {
        "list1": [
          1,
          3,
          2,
          10,
          7,
          4,
          8
        ]
      },
      "standardDeviation": {
        "list1": 3.116774889895918
      },
      "moment1": {
        "list1": 0
      },
      "moment2": {
        "list1": 9.714285714285714
      },
      "moment3": {
        "list1": 8.571428571428571
      },
      "moment4": {
        "list1": 153.71428571428572
      },
      "normalDistribution": {
        "list1": 1.8832251101040818
      },
      "skewness": {
        "list1": 0.28309806525871234
      },
      "kurtosis": {
        "list1": -1.3711072664359858
      },
      "list-wise ranges": {
        "Range 1": {
          "range lists": [
            [
              2,
              3,
              4,
              7,
              8
            ]
          ],
          "lengths": [
            5
          ],
          "total_length": 1
        },
        "Range 2": {
          "range lists": [
            [
              1,
              10
            ]
          ],
          "lengths": [
            2
          ],
          "total_length": 1
        },
        "Range 3": {
          "range lists": [
            []
          ],
          "lengths": [
            0
          ],
          "total_length": 1
        }
      },
      "count_val": 7
    },
    "normal_dist": {
      "mergedSeries": null,
      "seriesLength": 7,
      "maxMergedSeries": 10,
      "minMergedSeries": 1,
      "mergedMean": 5,
      "mergedMedian": 4,
      "mergedMode": [
        1,
        3,
        2,
        10,
        7,
        4,
        8
      ],
      "mergedRanges": {
        "Range1": {
          "range lists": [
            [
              2,
              3,
              4,
              7,
              8
            ]
          ],
          "lengths": [
            5
          ],
          "total_length": 1
        },
        "Range2": {
          "range lists": [
            [
              1,
              10
            ]
          ],
          "lengths": [
            2
          ],
          "total_length": 1
        },
        "Range3": {
          "range lists": [
            []
          ],
          "lengths": [
            0
          ],
          "total_length": 1
        }
      },
      "mergedVariance": 9.714285714285714,
      "mergedMoment1": 0,
      "mergedMoment2": 9.714285714285714,
      "mergedMoment3": 8.571428571428571,
      "mergedMoment4": 153.71428571428572,
      "mergedSkewness": 0.28309806525871234,
      "mergedKurtosis": -1.3711072664359858
    }
  }
}

export const DocumentProcessDetailReport = {
  "scale_category": "nps scale",
  "no_of_scales": 12,
  "nps_score": 96,
  "nps_total_score": 120,
  "max_total_score": 10,
  "score_list": [
    10,
    10,
    4,
    10,
    10,
    4,
    10,
    10,
    4,
    10,
    10,
    4
  ],
  "scale_specific_data": {
    "net_promoter_score": 33.33333333333333,
    "promoters_percentage": 66.66666666666666,
    "passives_percentage": 0.0,
    "detractors_percentage": 33.33333333333333,
    "overall_nps_category": "majorly promoters"
  },
  "normality_analysis": {
    "title": "evaluation_module",
    "process_id": "abcdef12345document",
    "bins": 10.0,
    "allowed_error": 4.0,
    "series_count": 1,
    "list1": {
      "normality": "no",
      "auc_z_scores": -0.7,
      "actual_areas": 6.396597925352755,
      "rectangle_area": 3.3851375012865383,
      "Kurt": "Leptokurtic curve",
      "ind_dev": 1.0,
      "slope": [
        0.36789614249311026,
        0.37455606159782767
      ],
      "slope_percentage_deviation": 0.25,
      "calculated_slope": 2.0248682972773397,
      "evidence_counter": {
        "Mean equals to Median": {
          "Mean is within deviation": "yes",
          "Median is within deviation": "yes"
        },
        "Mean equals to Mode": {
          "Mean is within deviation": "yes",
          "Mode is within deviation": "yes"
        },
        "Mode equals to Median": "yes",
        "Skewness is equal to 0": {
          "Standard deviation is within deviation": "yes"
        },
        "Kurtosis curve": "no",
        "Points in Range1": "no",
        "Points in Range2": "no",
        "Points in Range3": "no",
        "Satifies sigmoid function whose mirror image will give bell shaped curve": "yes",
        "Rotational Symmetric": "no"
      }
    }
  },
  "central_tendencies": "Process Id already in use. Please enter a different Process Id & try again."
}

export const ScaleDetailReportData = {
  "scale_category": "nps scale",
  "no_of_scales": 12,
  "nps_score": 96,
  "nps_total_score": 120,
  "max_total_score": 10,
  "score_list": [
    10,
    10,
    4,
    10,
    10,
    4,
    10,
    10,
    4,
    10,
    10,
    4
  ],
  "scale_specific_data": {
    "net_promoter_score": 33.33333333333333,
    "promoters_percentage": 66.66666666666666,
    "passives_percentage": 0.0,
    "detractors_percentage": 33.33333333333333,
    "overall_nps_category": "majorly promoters"
  },
  "normality_analysis": {
    "title": "evaluation_module",
    "process_id": "abcdef12345document",
    "bins": 10.0,
    "allowed_error": 4.0,
    "series_count": 1,
    "list1": {
      "normality": "no",
      "auc_z_scores": -0.7,
      "actual_areas": 6.396597925352755,
      "rectangle_area": 3.3851375012865383,
      "Kurt": "Leptokurtic curve",
      "ind_dev": 1.0,
      "slope": [
        0.36789614249311026,
        0.37455606159782767
      ],
      "slope_percentage_deviation": 0.25,
      "calculated_slope": 2.0248682972773397,
      "evidence_counter": {
        "Mean equals to Median": {
          "Mean is within deviation": "yes",
          "Median is within deviation": "yes"
        },
        "Mean equals to Mode": {
          "Mean is within deviation": "yes",
          "Mode is within deviation": "yes"
        },
        "Mode equals to Median": "yes",
        "Skewness is equal to 0": {
          "Standard deviation is within deviation": "yes"
        },
        "Kurtosis curve": "no",
        "Points in Range1": "no",
        "Points in Range2": "no",
        "Points in Range3": "no",
        "Satifies sigmoid function whose mirror image will give bell shaped curve": "yes",
        "Rotational Symmetric": "no"
      }
    }
  },
  "central_tendencies": "Process Id already in use. Please enter a different Process Id & try again."
}

// export const dateTimeStampFormat = (date) => {
//   const [datePart, timePart] = date.split(",");
//   const [day, month, year] = datePart.trim().split("/");
//   const formattedDate = `${year}-${month}-${day}`;
//   return `${formattedDate}T${timePart.trim()}`;
// };

export const dateTimeStampFormat = (date) => {
  return `${date.split(",")[0].split(":").reverse().join("-")}T${
     date.split(",")[1]
   }`;
 };
 