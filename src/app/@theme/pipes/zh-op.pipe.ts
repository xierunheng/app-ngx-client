import { Pipe, PipeTransform } from '@angular/core';
import { MaterialData } from '../../@core/data/util.service';

@Pipe({ name: 'zhOp' })
export class ZhOpPipe implements PipeTransform {

  transform(input: string): string {
    return MaterialData.BodyOps[input].name || '';
  }
}
