import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { Edge, NgxGraphModule, Node } from '@swimlane/ngx-graph';

import { Lipid } from 'src/app/models/lipid.model';


@Component({
    selector: 'app-ontology-graph',
    imports: [
        NgFor,
        NgxGraphModule,
    ],
    templateUrl: './ontology-graph.component.html',
    styleUrls: ['./ontology-graph.component.sass']
})
export class OntologyGraphComponent implements OnInit {
  @Input() lipid$?: Observable<Lipid | undefined>;
  edges: Array<Edge> = [];
  nodes: Array<Node> = [];

  _options: { width: number, height: number } = { width: 800, height: 600 };

  constructor() { }

  get options() {
    return this._options = {
      width: 800,
      height: 600
    };
  }

  ngOnInit(): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology) {
        this.edges = lipid.ontology.edges as unknown as Array<Edge>;
        this.nodes = lipid.ontology.nodes as unknown as Array<Node>;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      console.log("Ontology Graph: updated for lipid " + JSON.stringify(lipid?.nomenclature.name));
    });
  }
}
