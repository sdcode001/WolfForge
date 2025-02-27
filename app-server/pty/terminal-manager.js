const {PTY} = require('./pty-service')


class TerminalManager { 
    //Dictonary for socketId to PTY object mapping
    sessions = {};

    constructor(){
        this.sessions = {}
    }

    createPTY(socket, username, projectId) { 
      let newPty = new PTY(socket, username, projectId)
      let terminal = newPty.createPTY();

      this.sessions[socket.id] = terminal;

      this.sessions[socket.id].on('exit', () => {
        this.sessions[socket.id].kill();
        delete this.sessions[socket.id];
      });
      //return process id of pty
      return terminal.pid;
    }

    writeTerminal(terminalId, data) {
        this.sessions[terminalId].writeTerminal(data);
    }

    clearTerminal(terminalId){
        this.sessions[terminalId].kill();
        delete this.sessions[terminalId];
    }
}

const terminalManager = new TerminalManager();

module.exports = {
    terminalManager
}