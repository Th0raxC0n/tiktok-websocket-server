import { Injectable } from '@nestjs/common';
import { WebcastPushConnection } from 'tiktok-live-connector';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class TiktokLiveService {

  private tiktokUsername = 'randiilyn'//'randiilyn';
  private availableGifts: any[] = [];
  
  constructor(private eventsGateway: EventsGateway) {}
  onModuleInit() {
    this.connectToLiveStream();
  }
  connectToLiveStream() {
    const tiktokLiveConnection = new WebcastPushConnection(this.tiktokUsername, {
      // sessionId: 'e8a6f025b49868f9dc845d8e00d18c58',
      // requestPollingIntervalMs: 1000,
    });
    tiktokLiveConnection.connect().then(state => {
      console.info(`Connected to roomId ${state.roomId}`);
    }).catch(err => {
      console.error('Failed to connect', err);
    });

    tiktokLiveConnection.on('chat', data => {
      console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
      this.eventsGateway.sendChatMessageToAllClients(data);
    });
    tiktokLiveConnection.on('like', data => {
        console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
        this.eventsGateway.sendLikeNotificationToAllClients(data);
    });
    tiktokLiveConnection.on('follow', (data) => {
        console.log(data.uniqueId, "followed!");
        this.eventsGateway.sendFollowNotificationToAllClients(data);
    });
    tiktokLiveConnection.on('emote', data => {
        console.log(data);
        this.eventsGateway.sendEmoteNotificationToAllClients(data);
    });
    tiktokLiveConnection.on('gift', data => {
      /**TODO setup different event gateway for the consecutive gifts  */
        if (data.giftType === 1 && !data.repeatEnd) {
            console.log(`${data.uniqueId} is sending gift ${data.giftName} x${data.repeatCount}`);
            //this.eventsGateway.sendGiftNotificationToAllClients(data);
        } else {
            console.log(`${data.uniqueId} has sent gift ${data.giftName} x${data.repeatCount}`);
            this.eventsGateway.sendGiftNotificationToAllClients(data);
        }
    })


    tiktokLiveConnection.getAvailableGifts().then(gifts => {
      gifts.forEach(gift => {
        console.log(`Gift: ${gift.id} - ${gift.name}`);
      });
      this.availableGifts = gifts;
    });
  }
  getGifts() {
    return this.availableGifts;
  }
}
