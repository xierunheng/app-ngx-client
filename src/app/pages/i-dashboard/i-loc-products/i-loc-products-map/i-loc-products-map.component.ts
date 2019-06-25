import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mes-i-loc-products-map',
  templateUrl: './i-loc-products-map.component.html',
  styleUrls: ['./i-loc-products-map.component.scss']
})
export class ILocProductsMapComponent implements OnInit {
@Output() select: EventEmitter<number> = new EventEmitter();

  selectedRoom: null;
  sortedRooms = [];
  viewBox = '-20 -20 618.88 407.99';
  isIE = !!(navigator.userAgent.match(/Trident/)
            || navigator.userAgent.match(/MSIE/)
            || navigator.userAgent.match(/Edge/));
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
  roomSvg = {
    borders: [{
      d: 'M186.21,130.05H216.37V160H186.21Z',
    }],
    stokedAreas: [
      { d: 'M562.71,225V354h-290V319H418.37a6.09,6.09,0,0,0,6.09-6.09V225Z' },
      { d: 'M8.09,130V347.91A6.09,6.09,0,0,0,14.18,354h54V130Z' },
      { d: 'M216.37,49.82H358.8V92.5H216.37Z' },
    ],
    rooms: [
      {
        id: '质检部',
        name: { text: '质检部', x: 142, y: 240.8 },
        area: { d: 'M68.18,130V359.9A6.09,6.09,0,0,0,74.27,366h136a6.09,6.09,0,0,0,6.09-6.09V160H186.21V130Z' },
        border: { d: 'M96,130H68.18V359.9A6.09,6.09,0,0,0,74.27,366h136a6.09,6.09,0,0,0,6.09-6.09V225 M152.71,' +
          '130H186.21V160H218.5' },
      },
      {
        id: '生产部',
        name: { text: '生产部', x: 109, y: 66 },
        area: { d: 'M152.71,130h63.66V8.09A6.09,6.09,0,0,0,210.27,2H8.09A6.09,6.09,0,0,0,2,8.09V123.95A6.09,' +
          '6.09,0,0,0,8.09,130H96Z' },
        border: { d: 'M152.71,130h63.66V8.09A6.09,6.09,0,0,0,210.27,2H8.09A6.09,6.09,0,0,0,2,8.09V123.95A6.09' +
          ',6.09,0,0,0,8.09,130H96' },
      },
      {
        id: '包装区',
        name: { text: '包装区', x: 468, y: 134 },
        area: { d: 'M358.8,160V49.82a6.09,6.09,0,0,1,6.09-6.09H570.78a6.09,6.09,0,0,1,6.09,6.09V218.9a6.09' +
          ',6.09,0,0,1-6.09,6.09h-212Z' },
        border: { d: 'M358.8,160V49.82a6.09,6.09,0,0,1,6.09-6.09H570.78a6.09,6.09,0,0,1,6.09,6.09V218.9a6.09' +
          ',6.09,0,0,1-6.09,6.09h-212' },
      },
      {
        id: '1#优等仓',
        name: { text: '1#优等仓', x: 320, y: 273 },
        area: { d: 'M216.37,354V92.5H358.8V225H424.39V319H272.71V354Z' },
        border: { d: 'M216.37,225V356 M216.21,162V92.5H358.8V160 M358.8,225H424.39V312.91a6.09,' +
          '6.09,0,0,1,-6.09,6.09H272.71V356' },
      },
    ],
  };

  constructor() {
    this.selectRoom('登窑组');
  }

  private sortRooms() {
    this.sortedRooms = this.roomSvg.rooms.slice(0).sort((a, b) => {
      if (a.id === this.selectedRoom) {
        return 1;
      }
      if (b.id === this.selectedRoom) {
        return -1;
      }
      return 0;
    });
  }

  selectRoom(roomName) {
    this.select.emit(roomName);
    this.selectedRoom = roomName;
    this.sortRooms();
  }

  ngOnInit() {
  }

}
