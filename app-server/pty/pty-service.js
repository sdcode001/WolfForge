const pty = require('node-pty')
const os = require('os');
const path = require('path');


class PTY {
    socket = null;
    username = '';
    projectId = '';
    shell = '';
    terminal =  null;

    constructor(socket, username, projectId){
        this.socket = socket;
        this.projectId = projectId;
        this.username = username;
        this.shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    }

    createPTY() {
       this.terminal = pty.spawn(this.shell, [], {
        cols: 100,
        name: 'xterm',
        cwd: path.join(__dirname, `../workspace/${this.username}/${this.projectId}`)
       })

       this.terminal.on('data', (data) => {
         this.socket.emit('terminal-response', {data: Buffer.from(data, 'utf-8')});
       })

       return this.terminal;
    }

    writeTerminal(data){
      if(this.terminal!=null){
        this.terminal.write(data);
      }
    }
}


module.exports = {
    PTY
}

