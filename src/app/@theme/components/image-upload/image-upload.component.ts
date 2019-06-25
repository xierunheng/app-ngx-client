import { Component,Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'i-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit {
  @Input() foo: any;
  // files: any[];
  @Output() file: EventEmitter<string> = new EventEmitter();

  constructor() {
  }
  ngOnInit() {
    // this.files = new Array();
    this.file.emit("fileHolder");
    console.log(this.file);
  }

  onUploadFinished(fileHolder: any) {
    // if (fileHolder && fileHolder.length > 0) {
    //   fileHolder.map(f => {
    //    // this.files.push(f);
    //   });
    //  } 
    // console.log(fileHolder);
    this.file.emit("fileHolder");
    console.log(this.file);
  }

  onRemoved(file: any) {
    console.log(file);
  }

  onUploadStateChanged(state: boolean) {
    console.log(state);
  }

}
