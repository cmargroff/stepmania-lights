# stepmania-lights
A Stepmania sextet lighting library for NodeJS

## ⚠️ WIP Warning
This was developed for another project so it only currently fills the needs of that right now.

## Usage
Stepmania Sextet stream is a finnicky thing to set up on windows. You can use https://github.com/stepmania/stepmania/blob/master/src/arch/Lights/LightsDriver_SextetStream.md for more indepth setup. Stepmania on windows is a stream _client_ and sends data to the server.

The steps are this:
- Configure stepmania to stream data.
  - In the Preferences.ini set `LightsDriver=SextetStreamToFile` and set the `SextetStreamOutputFilename=.\StepMania-Lights-Output`
- Create symlink because stepmania does not properly handle named pipes.
  - In powershell `New-Item \\.\pipe\StepmaniaLightsOutput -ItemType SymbolicLink -Value [path to stepmania folder]\StepMania-Lights-Output` this symlinks the named pipe path to a file path that stepmania can use.
- Start your code that uses this library
- Start stepmania

Unfortunately the way stepmania also works hinders being able to restart the server while stepmania is running as well.

## Example
The library is event driven so that you can get only the data you want. Normally stepmania resends the complete set of lights as a message any time any light updates. Each event name represents 1 byte as an int val that changed in the stream.

The event names are:
  `"marquee"`,
  `"p1Buttons"`,
  `"p1Cabinet"`,
  `"p1Pad"`,
  `"p1Extended1"`,
  `"p1Extended2"`,
  `"p1Extended3"`,
  `"p2Buttons"`,
  `"p2Cabinet"`,
  `"p2Pad"`,
  `"p2Extended1"`,
  `"p2Extended2"`,
  `"p2Extended3"`

#### On Windows
```js
import { autoConnect } from 'stepmania-lights'

const PIPE_NAME = "StepMania-Lights-SextetStream"

const PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME

const stepmania = autoConnect("WIN32PIPE:" + PIPE_PATH)

stepmania.on("marquee", (val) => {
  const topLeft = val & 1
  const topRight = val >> 1 & 1
  const bottomLeft = val >> 2 & 1
  const bottomRight = val >> 3 & 1
  ...
})
```

#### On Linux
```js
import { autoConnect } from 'stepmania-lights'

const PIPE_NAME = "StepMania-Lights-SextetStream"

const PIPE_PATH = "/usr/local/games/stepmania/Data/" + PIPE_NAME

const stepmania = autoConnect("FIFO:" + PIPE_PATH) 

...

```

## Todo
- ~~Linux support~~
- Support more connection types
  - ~~FIFO~~
  - EXTIO
  - EXPORT
  - Win32Serial