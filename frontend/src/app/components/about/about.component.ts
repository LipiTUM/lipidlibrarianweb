import { Component, OnInit } from '@angular/core';

import { HistoryService } from 'src/app/services/history.service';


@Component({
    selector: 'app-about',
    standalone: true,
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.sass'],
})
export class AboutComponent implements OnInit {

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.historyService.setActive("", "");
  }
}
