import EventEmitter from 'events';

const LIGHT_MAP = [
  "marquee",
  "p1Buttons",
  "p1Cabinet",
  "p1Pad",
  "p1Extended1",
  "p1Extended2",
  "p1Extended3",
  "p2Buttons",
  "p2Cabinet",
  "p2Pad",
  "p2Extended1",
  "p2Extended2",
  "p2Extended3",
] as const

type Events = {
  data: [data: Buffer]
} & Record<typeof LIGHT_MAP[number], [number]>

export abstract class StepmaniaAdapter
  extends EventEmitter<Events> {
  private state = [
    0, // marquee
    0, 0, 0, 0, 0, 0, // p1
    0, 0, 0, 0, 0, 0, // p2
  ]
  constructor() {
    super()
    this.on("data", this.parse)
  }
  protected parse(data: Buffer) {
    for(var i = 0; i < LIGHT_MAP.length; i++) {
      const val = data.readInt8(i)
      if(this.state[i] !== val){
        this.emit(LIGHT_MAP[i], val)
        this.state[i] = val
      }
    }
  }
}