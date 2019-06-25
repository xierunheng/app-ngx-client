import { Component, OnInit, OnDestroy } from '@angular/core';
import { Camera, SecurityCamerasData } from '../../../@core/data/security-cameras';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

import * as _ from 'lodash';

import { ScadaDataService } from '../../../@core/data/scadaData.service';

interface IOutputData {
  name: string;
  value: number;
}

interface IOutputDatas {
  name: string;
  _name: string;
  dataType: string;
  data: IOutputData[];
}

@Component({
  selector: 'mes-emaint-proseg',
  templateUrl: './emaint-proseg.component.html',
  styleUrls: ['./emaint-proseg.component.scss']
})
export class EmaintProsegComponent implements OnInit, OnDestroy {
  private alive = true;

  intervalSubscription: Subscription;
  liveTrimData: IOutputDatas[];
  liveGlazeData: IOutputDatas[];

  cameras: Camera[];
  selectedCamera: Camera;
  isSingleView = false;

  constructor(private securityCamerasService: SecurityCamerasData,
    private scadaService: ScadaDataService) {
    this.securityCamerasService.getCamerasData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((cameras: Camera[]) => {
        this.cameras = cameras;
        this.selectedCamera = this.cameras[0];
      });
  }

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.scadaService.getCountDatas().subscribe(countData => {
      this.scadaService.getPeriods().subscribe(periodData => {
        this.liveTrimData = [{
          name: '打磨次数',
          _name: 'PolCNT',
          dataType: 'countData',
          data: countData.PolCNT,
        }, {
          name: '打磨总节拍',
          _name: 'CT',
          dataType: 'periodData',
          data: periodData.CT,
        }, {
          name: '1#打磨节拍',
          _name: 'Pol1CT',
          dataType: 'periodData',
          data: periodData.Pol1CT,
        }, {
          name: '2#打磨节拍',
          _name: 'Pol2CT',
          dataType: 'periodData',
          data: periodData.Pol2CT,
        }, {
          name: '3#打磨节拍',
          _name: 'Pol3CT',
          dataType: 'periodData',
          data: periodData.Pol3CT,
        }];

        this.liveGlazeData = [{
          name: '喷釉次数',
          _name: 'PCNT',
          dataType: 'countData',
          data: countData.PCNT,
        }, {
          name: 'A面喷釉次数',
          _name: 'PACNT',
          dataType: 'countData',
          data: countData.PACNT,
        }, {
          name: 'B面喷釉次数',
          _name: 'PBCNT',
          dataType: 'countData',
          data: countData.PBCNT,
        }, {
          name: '喷釉节拍',
          _name: 'SprT',
          dataType: 'periodData',
          data: periodData.SprT,
        }, {
          name: '喷涂节拍',
          _name: 'StgCT',
          dataType: 'periodData',
          data: periodData.StgCT,
        }];
      })
      console.log(this.liveGlazeData);
      this.startReceivingLiveData();
    })
  }

  startReceivingLiveData() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(10 * 1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.scadaService.getCountData()),
      )
      .subscribe(countData => {
        this.scadaService.getPeriod().subscribe(periodData => {
          this.liveTrimData.forEach(item => {
            if (item.data.length >= 100) {
              item.data.shift();
            }
            item.data.push({
              value: item.dataType === 'countData' ? countData[item._name].quantity : periodData[item._name].quantity,
              name: new Date().toISOString(),
            })
          })
          this.liveTrimData = [...this.liveTrimData];

          this.liveGlazeData.forEach(item => {
            if (item.data.length >= 100) {
              item.data.shift();
            }
            item.data.push({
              value: item.dataType === 'countData' ? countData[item._name].quantity : periodData[item._name].quantity,
              name: new Date().toISOString(),
            })
          })
          this.liveGlazeData = [...this.liveGlazeData];
        })

      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
