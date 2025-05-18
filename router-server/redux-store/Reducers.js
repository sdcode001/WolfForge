const {
    ADD_INSTANCE,
    REMOVE_INSTANCE,
    UPDATE_INSTANCE_STATUS,
    UPDATE_INSTANCE_PROJECT_ID
} = require('./Actions')


//State will be a Dictionary<instance-ip, InstanceState>
const initialState = {}

function instanceReducer(state = initialState, action){
    switch(action.type){
        case ADD_INSTANCE: {
            return {
                ...state,
                [action.payload.ip]: action.payload.instance
            }
        }
        case REMOVE_INSTANCE: {
            const newState = {...state};
            delete newState[action.payload.ip]
            return newState;
        }
        case UPDATE_INSTANCE_STATUS: {
            return {
                ...state,
                [action.payload.ip]: {
                    ...state[action.payload.ip],
                    status: action.payload.newStatus
                }
            }
        }
        case UPDATE_INSTANCE_PROJECT_ID: {
            return {
                ...state,
                [action.payload.ip]: {
                    ...state[action.payload.ip],
                    project_id: action.payload.newProjectId
                }
            }
        }
        default: {
            return state;
        }
    }
}

module.exports = {
    instanceReducer
}