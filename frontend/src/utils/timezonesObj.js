const { countries, zones } = require("moment-timezone/data/meta/latest.json");
const timeZoneToCountryObj = {};

Object.keys(zones).forEach(z => {
    timeZoneToCountryObj[z] = countries[zones[z].countries[0]].name;
});

export { timeZoneToCountryObj }