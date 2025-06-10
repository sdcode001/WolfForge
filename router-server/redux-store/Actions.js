const ADD_INSTANCE = 'ADD_INSTANCE';
const REMOVE_INSTANCE = 'REMOVE_INSTANCE';
const UPDATE_INSTANCE_STATUS = 'UPDATE_INSTANCE_STATUS';
const UPDATE_INSTANCE_PROJECT_ID = 'UPDATE_INSTANCE_PROJECT_ID';
const UPDATE_INSTANCE_SOCKET_ID = 'UPDATE_INSTANCE_SOCKET_ID';


const addInstance = (ip, instance) => ({
    type: ADD_INSTANCE,
    payload: {ip, instance}
})

const removeInstance = (ip) => ({
    type: REMOVE_INSTANCE,
    payload: {ip}
})

const updateInstanceState = (ip, newStatus) => ({
    type: UPDATE_INSTANCE_STATUS,
    payload: {ip, newStatus}
})

const updateInstanceProjectId = (ip, newProjectId) => ({
    type: UPDATE_INSTANCE_PROJECT_ID,
    payload: {ip, newProjectId}
})

const updateInstanceSocketId = (ip, socketId) => ({
    type: UPDATE_INSTANCE_SOCKET_ID,
    payload: {ip, socketId}
})


module.exports = {
    ADD_INSTANCE,
    REMOVE_INSTANCE,
    UPDATE_INSTANCE_STATUS,
    UPDATE_INSTANCE_PROJECT_ID,
    UPDATE_INSTANCE_SOCKET_ID,
    addInstance,
    removeInstance,
    updateInstanceProjectId,
    updateInstanceState,
    updateInstanceSocketId
}