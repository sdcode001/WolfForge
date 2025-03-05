import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TerminalSocketService } from './terminal.socket.service';
import { ProjectMetaData } from '../../app.model';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit, OnDestroy, AfterViewInit {
   @Input({required: true}) projectData?: ProjectMetaData
   private terminal!: Terminal;
   private fitAddon!: FitAddon;
   terminalId?: string
   processId?: string
   commandBuffer = ''

   @ViewChild('terminalContainer', { static: true }) terminalContainer!: ElementRef;

   constructor(private terminalSocketService: TerminalSocketService) { }

   ngOnInit(){
     this.terminalSocketService.connect();

     this.terminalSocketService.on('terminal-connected').subscribe({
      next: (data) => {
        this.terminalId = data.TerminalId
        console.log(data.Message);
        this.terminalSocketService.emit('create-terminal', this.projectData)
      },
      error: (err) => {
        console.log(err);
      }
     })

     this.terminalSocketService.on('created-terminal').subscribe({
      next: (data) => {
        this.processId = data.ProcessId;
        console.log(`Pseudo Terminal created with processId: ${this.processId}`)
      },
      error: (err) => {
        console.log(err);
      }
     })

     this.terminalSocketService.on('terminal-result').subscribe({
      next: (data) => {
        //write data to xterm terminal
        console.log(data.result)
        this.terminal.write(data.result.replace(/\n/g, '\r\n')); 
        this.terminal.scrollToBottom()
        this.fitAddon.fit();
        // if (data.result instanceof ArrayBuffer) {
        //   console.log(this.arrayBufferToString(data.result))
        //   this.terminal.write(this.arrayBufferToString(data.result));
        // }
      },
      error: (err) => {
        console.log(err);
      }
     })

   }

  ngAfterViewInit() {
    this.initializeTerminal();
  }

  ngOnDestroy(){
    this.terminal.dispose();
    this.terminalSocketService.disconnect();
  }

  arrayBufferToString(buf: ArrayBuffer) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
  }

  private initializeTerminal() {
    this.terminal = new Terminal({
      cursorBlink: true,
      theme: { background: '#1e1e1e', foreground: '#ffffff' },
      rightClickSelectsWord: true,
      allowProposedApi: true,       
      scrollOnUserInput: true,
    });

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.terminalContainer.nativeElement);
    this.fitAddon.fit();

    //take user input and send to socket
    this.terminal.onData((data) => {
      if (data === '\r') {  //Enter key pressed
        this.terminal.write('\r\n'); //Move to new line
        this.terminalSocketService.emit('write-terminal', { terminalId: this.terminalId, command: this.commandBuffer + '\r' });
        this.commandBuffer = ''; 
      } else {
        this.commandBuffer += data;
        this.terminal.write(data);
      }
    });

    // Resize terminal on window resize
    window.addEventListener('resize', () => this.fitAddon.fit());
  }


}
