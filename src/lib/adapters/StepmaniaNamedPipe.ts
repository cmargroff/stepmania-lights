import { Server, createServer } from 'net';
import { StepmaniaAdapter } from './StepmaniaAdapter';

export class StepmaniaNamedPipe extends StepmaniaAdapter {
  public server: Server
  constructor(path: string) {
    if(!path) {
      throw new Error("Pipe path was not provided to bind to")
    }
    super()
    this.server = createServer((socket) => {
      // socket.emit = this.emit // forward socket event to listners of this class
      socket.on("data", (data) => this.emit("data", data))
    })
    process.addListener("SIGINT", () => {
      this.server.close()
    })
    this.server.listen(path)
  }
}