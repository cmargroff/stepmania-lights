import { StepmaniaFIFO } from './adapters/StepmaniaFIFO'
import { StepmaniaNamedPipe } from './adapters/StepmaniaNamedPipe'
import { StepmaniaWin32Serial } from './adapters/StepmaniaWin32Serial'

export const autoConnect = (connection: string) => {
  const [method, ...options] = connection.split(":")
  switch (method) {
    case "PIPE":
    case "WIN32PIPE":
      return new StepmaniaNamedPipe(options[0])
    case "FIFO":
      return new StepmaniaFIFO(options)
    case "SERIAL":
    case "WIN32SERIAL":
      return new StepmaniaWin32Serial(options)
    default:
      throw new Error("No valid adapter type was provided")
  }
}