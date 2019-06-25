import { Component } from '@angular/core';

@Component({
  selector: 'mes-auth-block',
  styleUrls: ['./auth-block.component.scss'],
  template: `
    <ng-content></ng-content>
  `,
})
export class MesAuthBlockComponent {
}
