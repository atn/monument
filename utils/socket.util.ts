import { EventEmitter } from 'events'

export class SocketManager extends EventEmitter {
  private ws: WebSocket
  private wsURL: string
  private heartbeatInterval: any

  constructor(url: string) {
    super()
    this.wsURL = url
    this.init()
  }

  async send(type: string, data?: any) {
    if (!this.ws) throw new Error('Websocket connection doesn\'t exist.')
    if (data) return this.ws.send(JSON.stringify({type, data}))
    return this.ws.send(JSON.stringify({type}))
  }

  async startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send('HEARTBEAT')
    }, 5000)
  }

  async close() {
    this.ws.close()
  }

  async init() {
    this.ws = new WebSocket(this.wsURL)

    this.ws.onopen = () => {
      this.startHeartbeat()
      this.emit('open')
    }

    this.ws.onclose = () => {
      this.emit('close')
      clearInterval(this.heartbeatInterval)
    }

    this.ws.onmessage = (msg) => {
      try {
        const body = JSON.parse(msg.data)
        this.emit('msg', body)
      } catch (err) {
        console.log(err)
      }
    }
  }

}