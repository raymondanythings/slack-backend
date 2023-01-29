import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import { onlineMap } from './online.map'
@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() public server: Server
  @SubscribeMessage('message')
  afterInit(server: Server) {
    console.log('websocket server init')
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name)
    if (onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {}
    }
    socket.emit('hello', socket.nsp.name)
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name)
    const newNamespace = socket.nsp
    delete onlineMap[socket.nsp.name][socket.id]
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]))
  }

  handleMessage(client: any, payload: any): string {
    return 'Hello world!'
  }
}

// namespace(채널 / 서버) -> room
