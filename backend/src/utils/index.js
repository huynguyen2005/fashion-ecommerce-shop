const _ = require("lodash");
const crypto = require("crypto");

module.exports = {
  getSelectData: (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
  },
  getUnSelectData: (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
  },
  getInfoData: ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
  },
  generateOTP: () => {
    return crypto.randomInt(100000, 1000000).toString();
  },
};
