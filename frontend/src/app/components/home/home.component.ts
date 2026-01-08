import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { HistoryService } from 'src/app/services/history.service';
import { QueryFormComponent } from '../query-form/query-form.component';
import { SessionService } from 'src/app/services/session.service';


@Component({
    selector: 'app-home',
    imports: [
        RouterLink,
        QueryFormComponent,
        NgIf
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(
    private historyService: HistoryService,
    public sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.historyService.setActive("", "");
  }

}
