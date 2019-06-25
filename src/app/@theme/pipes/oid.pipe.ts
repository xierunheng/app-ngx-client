import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'oidPipe' })
export class OidPipe implements PipeTransform {

  transform(input: any[]): string[] {
    return input && input.length > 0 ? input.map(item => item.oid || '') : [];
  }
}
