import { Pipe, PipeTransform } from '@angular/core';
import { MaterialData } from '../../@core/data/util.service';

@Pipe({ name: 'zhState' })
export class ZhStatePipe implements PipeTransform {

  transform(input: string): string {
    let existOne = Object.values(MaterialData.BodyOps).find(item => item.state === input);
    return existOne.desc || '';
  }
}
