import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash';
import { TreeviewItem } from 'ngx-treeview';

@Pipe({
	name: 'mesTreeitem'
})
export class TreeitemPipe implements PipeTransform {
	transform(objects: any[], textField: string): TreeviewItem[] {
		if (isNil(objects)) {
			return undefined;
		}
		let fields: string[] = textField ? textField.split(',') : undefined;
		return objects.map(object => {
			let text = fields && fields.length > 0 ? fields.map(field => object[field]).join('-') : object;
			return new TreeviewItem({ text: text, value: object, checked: false });
		});
	}
}