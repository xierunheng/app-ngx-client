import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { LocalNotifications } from "nativescript-local-notifications";
import {Color} from "tns-core-modules/color";

@Component({
  selector: "mes-m-localnotification",
  moduleId: module.id,
  templateUrl: "./localnotification.component.html",
  styleUrls: ["./localnotification.component.css"],
  providers: []
})
export class LocalnotificationComponent implements OnInit{

  constructor(
    private routerExtensions: RouterExtensions,
  ){
    LocalNotifications.addOnMessageReceivedCallback(notificationData => {
      // console.log("Notification received: " + JSON.stringify(notificationData));
      if(notificationData){
        let stringNotificationData = JSON.stringify(notificationData);
        let channelIndex = stringNotificationData.indexOf('"channel":');
        let stringChannel = stringNotificationData.substring(channelIndex+11,stringNotificationData.length);
        let selector = stringChannel.substring(stringChannel.indexOf('selector')+10,stringChannel.indexOf('\','));
        if(selector==='mes-m-workalert-detail'){
          console.log(selector,'selector!!!');
          let id = stringChannel.substring(stringChannel.indexOf('id')+4,stringChannel.indexOf('\'}'));
          console.log(id,'123123123');
          this.routerExtensions.navigate([`/workalert/workalert-detail/${id}`]);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  backToHome(): void {
    this.routerExtensions.back();
  }

  pushNotification():void{
    LocalNotifications.schedule([{
      id: 1,
      title: '报警信息',//通知标题
      body: '打磨机故障',//通知的主题内容,对于ios必须设置
      color: new Color("red"),//设置箭头颜色
      // groupedMessages:["跟着习近平共赴文明之约", "保护生态环境 习近平的这些话值得牢记", "习近平为新时代创新发展打造“科普之翼”", "香者自香 臭者自臭:‘中国技术有害论’可以休矣", "将制造业“逼”回美国？  上海为何不说“晚安”？"], //仅限android
      groupedMessages:['告警等级：1','层级结构：设备处','设备：DMRob1[打磨机器人1#]','负责人：设备管理员1#','报警时间：2019-05-30 16:56'], //仅限android
      groupSummary:"设备故障", //仅限android 组消息摘要小标题
      ticker: 'The ticker',
      badge: 1,//图标上的消息数字
      sound: "customsound-ios.wav", // falls back to the default sound on Android
      bigTextStyle:false,//仅限android
      ongoing: false, // makes the notification ongoing (Android only)
      icon: '',//默认获取resources上的图标
      image: "",
      thumbnail: true,
      interval: 'minute',//重复通知
      channel: "{selector:'mes-m-workalert-detail',id:'5cb7ed19f14c1e10f4fb2624'}", // default: 'Channel'
      forceShowWhenInForeground:true,//始终显示通知
      notificationLed:true,//LED
      // at: new Date(new Date().getTime() + (0 * 1000)) // 10秒后发送通知,
      actions:[
        {
          id:'yes',
          type:'button',
          title:'Yes',
          launch:true,
          submitLabel:'OK',
          placeholder:'请输入',
          editable: true,
          choices: ["Red", "Yellow", "Green"]
        },
        {
          id:'no',
          type:'button',
          title:'No',
          launch:false,
          submitLabel:'OK',
          placeholder:'请输入',
          editable: true,
          choices: ["Red", "Yellow", "Green"]
        }]
    }]).then(
      function() {
        console.log("Notification scheduled");
      },
      function(error) {
        console.log("scheduling error: " + error);
      }
    )
  }

  cancelAllNotification(){

  }

}
