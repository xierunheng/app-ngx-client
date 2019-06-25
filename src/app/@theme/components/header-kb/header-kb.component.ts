import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'mes-header-kb',
	templateUrl: './header-kb.component.html',
	styleUrls: ['./header-kb.component.scss']
})
export class HeaderKbComponent implements OnInit {
  @Input() position = 'normal';

	constructor(private router: Router,
		private route: ActivatedRoute,) { }

	ngOnInit() {
	}

	goToHome() {
		this.router.navigate(['/pages']);
	}
}
