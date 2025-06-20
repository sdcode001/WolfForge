
//return [ip, InstanceState] | undefined
const getInstanceByProjectId = (state, projectId) => {
  return Object.entries(state).find(([ip, instance]) => instance.project_id === projectId);
};

//return [ip, InstanceState] | undefined
const getInstanceBySocketId = (state, socketId) => {
  return Object.entries(state).find(([ip, instance]) => instance.worker_socket_id === socketId);
};

//return [ip, InstanceState] | undefined
const getInstanceByStatus = (state, status) => {
  return Object.entries(state).find(([ip, instance]) => instance.status === status);
};

const getTotalInstancesCount = (state) => {
  return Object.entries(state).length;
}

module.exports = {
    getInstanceByProjectId,
    getInstanceBySocketId,
    getInstanceByStatus,
    getTotalInstancesCount
}