const roundTo = require("round-to");

let padding = value => {
  if(isNaN(parseFloat(value)))
    return "-";
  return roundTo(value, 2).toPrecision(3);
};

let round = value => {
  return roundTo(value, 2);
};

module.exports = { padding, round };