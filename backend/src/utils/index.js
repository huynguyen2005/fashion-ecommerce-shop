const _ = require('lodash');

module.exports = {
    getSelectData: (select = []) => {
        return Object.fromEntries(select.map(el => [el, 1]));
    },
    getUnSelectData: (select = []) => {
        return Object.fromEntries(select.map(el => [el, 0]));
    },
    getInfoData: ({ fields = [], object = {} }) => {
        return _.pick(object, fields);
    }
};  

