import { Component, OnInit } from '@angular/core';

import { HistoryService } from 'src/app/services/history.service';


@Component({
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.sass'],
})
export class PageNotFoundComponent implements OnInit {

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.historyService.setActive("", "");
  }

}
