import { WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TiktokLiveService } from 'src/tiktok-live/tiktok-live.service';
import { ModuleRef } from '@nestjs/core';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  
  private tiktokLiveService: TiktokLiveService;
  constructor(private moduleRef: ModuleRef) {}
  onModuleInit() {
    this.tiktokLiveService = this.moduleRef.get<TiktokLiveService>(TiktokLiveService, { strict: false });
  }
  @WebSocketServer()
  server: Server;
  sendChatMessageToAllClients(data: any) {
    this.server.emit('chat', data);
  }
  sendLikeNotificationToAllClients(data: any) {
    this.server.emit('like', data);
  }
  sendFollowNotificationToAllClients(data: any) {
    this.server.emit('follow', data);
  }
  sendGiftNotificationToAllClients(data: any) {
    this.server.emit('gift', data);
  }
  sendEmoteNotificationToAllClients(data: any) {
    this.server.emit('emote', data);
  }
  sendAllGiftsToAllClients(data: any) {
    this.server.emit('allGifts', data);
  }
//d
  
  @SubscribeMessage('REQUEST_ALL_GIFTS')
  async getAllGifts(client: Socket) {
    const gifts = this.tiktokLiveService.getGifts();
    this.server.emit('allGifts', gifts);
  }

}
