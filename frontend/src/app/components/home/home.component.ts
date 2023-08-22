import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HistoryService } from 'src/app/services/history.service';
import { QueryFormComponent } from '../query-form/query-form.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    QueryFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.historyService.setActive("", "");
  }

}
