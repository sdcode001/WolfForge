class InstanceState {
    instance_id;
    project_id;
    status; //0 = Idel, 1 = Busy
    user_count;

    constructor(instance_id, project_id, status, user_count){
        this.instance_id = instance_id;
        this.project_id = project_id;
        this.status = status;
        this.user_count = user_count
    }
}

module.exports = {
    InstanceState
}