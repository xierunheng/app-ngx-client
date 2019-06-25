import { Directive, Input } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';


/**
 * [this Directive does nothing, but inherit NbPopoverDiretive and 'exportAs'
 * the selector name is the same with nebular
 * 等 nebular 发现这个问题后，这个类就不需要了，
 * 有空在GitHub上，提出这个issue
 * ]
 * @param {'nbPopover'}} {selector [description]
 */
@Directive({selector: '[nbPopover]', exportAs: 'nbPopover'})
export class MesPopoverDirective extends NbPopoverDirective {

}