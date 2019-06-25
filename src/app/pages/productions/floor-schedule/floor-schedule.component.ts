import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Calendar } from '@fullcalendar/core';
import { Draggable, ThirdPartyDraggable } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle';

import { GlobalData } from '../../../@core/model/global';
import { HsService } from '../../../@core/data/hs.service';
import { JobOrderService } from '../../../@core/data/job-order.service';
import { JobResponseService } from '../../../@core/data/job-response.service';

@Component({
	selector: 'mes-floor-schedule',
	templateUrl: './floor-schedule.component.html',
	styleUrls: ['./floor-schedule.component.scss']
})
export class FloorScheduleComponent implements OnInit {
	// 汉化
	initialLocaleCode: string = 'zh-cn';
	// HierarchyScope, like
	//   [{ id: '5a30e51329d81420b81584c7',
	//     name: '原料制浆区',
	//     level: 'Area',
	//     path: ',传奇陶瓷,总厂,',
	//     remark: '1楼',
	//     enterprise: '传奇陶瓷',
	//     site: '总厂',
	//		 title: '原料制浆区',
	//     children: [] }];
	resources: any[] = [];

	// JobOrder like
	// [{ id: '5aa5da0a6ca10f27841a3724',
	//   resourceId: '5a73c6ed56527619fc0518a0',
	//   start: '2018-03-12T07:32:02.000Z',
	//   end: '2018-03-13T07:32:02.000Z',
	//   title: '小件修坯_Order3311-42_3' }];
	events: any[] = [];

	//日历控件
	calendar;

	schedulingJobOrder: any[] = [{
		id: 'CX20190319',
		title: 'CX20190319'
	}, {
		id: 'DM20190319',
		title: 'DM20190319'
	}, {
		id: 'PY20190319',
		title: 'PY20190319'
	}, {
		id: 'YS20190319',
		title: 'YS20190319'
	}, {
		id: 'QC20190319',
		title: 'QC20190319'
	}];

	constructor(private hsServie: HsService,
		private joService: JobOrderService,
		private jrServie: JobResponseService) {
	}

	ngOnInit() {
		GlobalData.hss$.subscribe(hss => {
			this.resources = this.hsServie.createResources(hss);
			this.joService.getJobOrdersProfileBy().subscribe(jos => {
				this.events = this.joService.createEvents(jos);
				console.log(this.events);
				this.initCalendar();
			})
		})

	}

	initCalendar(): void {
		let tooltip;
		let calendarEl: HTMLElement = document.getElementById('calendar')!;
		this.calendar = new Calendar(calendarEl, {
			// schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
			plugins: [listPlugin, timeGridPlugin, resourceTimelinePlugin, timeGridPlugin, dayGridPlugin, interactionPlugin],
			// now: '2018-02-07',
			// locale: this.initialLocaleCode,
			editable: true, // enable draggable events
			droppable: true, // this allows things to be dropped onto the calendar
			aspectRatio: 1.8,
			scrollTime: '00:00', // undo default 6am scrollTime
			header: {
				left: 'today prev,next',
				center: 'title',
				right: 'resourceTimelineDay,resourceTimelineThreeDays,timeGridWeek,dayGridMonth,listWeek'
			},
			defaultView: 'resourceTimelineDay',
			views: {
				resourceTimelineThreeDays: {
					type: 'resourceTimeline',
					duration: { days: 3 },
					slotDuration: '3:00',
					buttonText: '3 day'
				}
			},
			resourceAreaWidth: '24%', //资源所占空间
			resourceLabelText: '层级结构',
			resourceColumns: [
				{
					group: true,
					labelText: 'Enterprise',
					field: 'enterprise'
				},
				{
					group: true,
					labelText: 'Site',
					field: 'site'
				},
				{
					labelText: 'Area',
					field: 'name'
				}
			],
			resources: this.resources,
			// resources: 'https://fullcalendar.io/demo-resources.json?with-nesting&with-colors',
			events: this.events,
			// eventRender: function(info) {
			// 	tooltip = new Tooltip(info.el, {
			// 		title: info.event.title + '\r\n' + info.event.start + '-' + info.event.end,
			// 		placement: 'top',
			// 		trigger: 'hover',
			// 		container: 'body'
			// 	});
			// },
			drop: function(info) {
				// console.log(tooltip);
				// if(tooltip) {
				// 	tooltip.dispose();
				// }
				// if so, remove the element from the "Draggable Events" list
				info.draggedEl.parentNode.removeChild(info.draggedEl);
			}
		});
		this.calendar.render();

		let containerEl: HTMLElement = document.getElementById('external-events');
		let draggable = new Draggable(containerEl, {
			itemSelector: '.fc-event',
			eventData: function(eventEl) {
				return {
					title: eventEl.innerText
				};
			}
		})
	}

	confirm(): void {
		console.log(this.calendar);
		let rnEvents = this.calendar.getEvents();
		console.log(rnEvents);
	}
}
