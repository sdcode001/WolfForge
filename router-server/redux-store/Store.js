const { createStore } = require('redux');
const {instanceReducer} = require('./Reducers')

const store = createStore(instanceReducer);

module.exports = {
    store
}