import { spawnSync } from 'child_process';
import { constants, open, rmSync, statSync } from 'fs';
import { Socket } from 'net';
import { StepmaniaAdapter } from './StepmaniaAdapter';

export class StepmaniaFIFO extends StepmaniaAdapter {
  private pipe!: Socket
  constructor(path: string) {
    if (process.platform !== "linux") {
      throw new Event("FIFO Adapter only supports linux")
    }
    super()
    this.mkfifo(path)
    this.connectFifo(path)
    process.on("SIGINT", () => {
      if (!this.pipe.closed) {
        this.pipe.end()
        this.pipe.destroy()
      }
      rmSync(path)
      process.exit()
    })
  }
  private mkfifo(path: string) {
    const mk = spawnSync("mkfifo", [path])
    const s = statSync(path)
    if (!s.isFIFO()) {
      rmSync(path)
      throw new Event("Unable to create named pipe")
    }
  }
  private connectFifo (path: string) {
    open(path, constants.O_RDONLY | constants.O_NONBLOCK, (err, fd) => {
      if (err) {
        throw new Error("Unable to open FIFO")
        return
      }
      this.pipe = new Socket({ fd });
      // Now `pipe` is a stream that can be used for reading from the FIFO.
      this.pipe.on('data', (data) => {
        this.emit("data", data)
      });
    });
  }
}