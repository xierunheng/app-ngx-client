import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'mes-gc-help',
  templateUrl: './gc-help.component.html',
  styleUrls: ['./gc-help.component.scss']
})
export class GCHelpComponent {
  modal:any;
  data = [
    { key: '温度', value: '请按墙上量表左下角所示数字输入' },
    { key: '湿度', value: '请按墙上量表右下角所示数字输入' },
    { key: '胶量配比', value: '炎热天气时(室内气温28度以上)的配胶比为1公斤原釉配1.1-1.2克干胶;秋凉天气时(室内气温28度以下)的配胶比为1公斤原釉配1.0-1.1克干胶;'},
    { key: '比重', value: '将搅拌好的釉浆倒满比重杯，再用盖子合上，让盖子自动缓慢下沉直到停止,中间的孔会溢出多余的釉浆，这时用手指压住小孔，清洗掉溢出的釉浆，擦干后放到克称上称其重量,取数值输入系统。（比重参考值为1：1.74-1.75)' },
    { key: '流速', value: '取搅拌好的釉浆，倒入粘度计(流速杯)至满杯,放开杯底孔并同时启动计时器，直到釉浆的流动状态为断断续续状时，取计时器上的数值输入系统。(炎热天气流速参考值为26-32秒；秋凉天气流速参考值为30-38秒)' },
    { key: 'PH值', value: '取搅拌好的釉浆，插入PH试纸20-30秒，观察试纸酸碱色度的变化后，对比相应的PH值色卡，填入系统。(PH参考值8.5-9.5)' },
    { key: '吸干厚度', value: '在弹出检测窗口时去拿喷好釉的损坯打开看釉面的厚度。（厚度参考值为1.2-1.3毫米）'},
    { key: '吸干速度', value: '用2寸PVC环，平面且已上好水的土坯，抽取5毫升釉浆(搅拌好的釉浆)。操作如下：PVC环放到土坯上面，将抽取的5毫升釉浆挤压到PVC环里面，让釉浆覆盖环内的面积后开始计时5分钟后取掉PVC环,垂直切开釉面看釉面的厚度。(釉面吸干速度参考值为6-8分钟达到毫米)' }
  ]

  constructor(protected activeModal: NgbActiveModal) {
    this.modal = activeModal;
  }
}
