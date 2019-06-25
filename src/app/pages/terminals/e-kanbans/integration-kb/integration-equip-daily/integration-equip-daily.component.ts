import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

interface CardSettings {
	title: string;
	iconClass: string;
	status: string;
	desc: string;
	type: string;
}

@Component({
	selector: 'mes-integration-equip-daily',
	templateUrl: './integration-equip-daily.component.html',
	styleUrls: ['./integration-equip-daily.component.scss']
})
export class IntegrationEquipDailyComponent implements OnInit, OnDestroy {
	private alive = true;
	colorFlag = 0;
	status: any[];

	lightCard: CardSettings = {
		title: '打浆',
		iconClass: 'nb-lightbulb',
		status: 'ON',
		desc: '8/8',
		type: 'primary',
	};
	rollerShadesCard: CardSettings = {
		title: '成型',
		iconClass: 'nb-roller-shades',
		status: 'ON',
		desc: '5/6',
		type: 'primary',
	};
	wirelessAudioCard: CardSettings = {
		title: '打磨',
		iconClass: 'nb-audio',
		status: 'ON',
		desc: '6/6',
		type: 'primary',
	};
	coffeeMakerCard: CardSettings = {
		title: '喷釉',
		iconClass: 'nb-coffee-maker',
		status: 'ON',
		desc: '1/1/2',
		type: 'primary',
	};
	coffeeMakerCard1: CardSettings = {
		title: '窑炉',
		iconClass: 'nb-coffee-maker',
		status: 'ON',
		desc: '3/3',
		type: 'secondary',
	};

	statusCards: any;

	commonStatusCardsSet: CardSettings[] = [
		this.lightCard,
		this.rollerShadesCard,
		this.wirelessAudioCard,
		this.coffeeMakerCard,
		this.coffeeMakerCard1,
	];

	statusCardsByThemes: {
		default: CardSettings[];
		cosmic: CardSettings[];
		corporate: CardSettings[];
	} = {
			default: this.commonStatusCardsSet,
			cosmic: this.commonStatusCardsSet,
			corporate: [
				{
					...this.lightCard,
					type: 'primary',
				},
				{
					...this.rollerShadesCard,
					//type: 'primary',
					type: 'warning',
				},
				{
					...this.wirelessAudioCard,
					type: 'primary',
				},
				{
					...this.coffeeMakerCard,
					type: 'danger',
				},
				{
					...this.coffeeMakerCard1,
					type: 'secondary',
				},
			],
		};
	constructor(private themeService: NbThemeService, ) {
		// this.themeService.getJsTheme()
		// 	.pipe(takeWhile(() => this.alive))
		// 	.subscribe(theme => {
		// 		console.log('theme', theme);
		// 		this.statusCards = this.statusCardsByThemes[theme.name];
		// 		console.log('statusCards', this.statusCards);
		// 	});
		this.init();
	}

	ngOnInit() {
	}

	init(){
      this.status = [
      {
      	title:'打浆',
      	status:'all on'
      },{
      	title:'成型',
      	status:'part on'
      },{
      	title:'打磨',
      	status:'all on'
      },{
      	title:'喷釉',
      	status:'unusual off'
      },{
      	title:'窑炉',
      	status:'all off'
      },];
	  this.themeService.getJsTheme()
		.pipe(takeWhile(() => this.alive))
		.subscribe(theme => {
			this.statusCards = this.statusCardsByThemes[theme.name];
			for(let i=0;i<this.statusCards.length;i++){
              switch(this.status[i].status){
              	case 'all on': 
              	  this.statusCards[i].type='primary';
                  break;
                case 'part on': 
              	  this.statusCards[i].type = 'warning';
                  break;
                case 'unusual off': 
              	  this.statusCards[i].type = 'danger';
                  break;
                case 'all off': 
              	  this.statusCards[i].type = 'secondary';
                  break;
              }
			}
		});
      
	}
	
	ngOnDestroy() {
		this.alive = false;
	}
 }   

	//有序闪烁
  // function changeColor() { 
  //        if (!this.colorFlag)
  //        {
  //       	 $("#setxfld").css("background","#FF9B1A");
  //       	 this.colorFlag = 1;
  //        }else{
  //       	 $("#setxfld").css("background","");
  //       	 this.colorFlag = 0;
  //        }
  //    }

  //    setInterval('changeColor()',1000);
