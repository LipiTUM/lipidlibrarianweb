import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { Edge, NgxGraphModule, Node } from '@swimlane/ngx-graph';

import { Lipid } from 'src/app/models/lipid.model';
import { OntologyGraph } from 'src/app/models/ontology-graph.model';
import { OntologyGraphEdge } from 'src/app/models/ontology-graph-edge.model';
import { OntologyGraphNode } from 'src/app/models/ontology-graph-node.model';


@Component({
    selector: 'app-ontology-graph',
    imports: [
        NgFor,
        NgxGraphModule,
    ],
    templateUrl: './ontology-graph.component.html',
    styleUrls: ['./ontology-graph.component.sass']
})
export class OntologyGraphComponent implements AfterViewInit, OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  graph?: OntologyGraph;
  edges!: Array<Edge>;
  nodes!: Array<Node>;

  _options: { width: number, height: number } = { width: 800, height: 600 };

  constructor() { }

  get options() {
    return this._options = {
      width: 800,
      height: 600
    };
  }

  ngAfterViewInit(): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology && lipid.ontology.nodes) {
        this.edges = lipid.ontology.edges! as unknown as Array<Edge>;
        this.nodes = lipid.ontology.nodes! as unknown as Array<Node>;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      console.log("Ontology Graph: initialized for lipid " + JSON.stringify(lipid?.nomenclature.name))
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology && lipid.ontology.nodes) {
        this.edges = lipid.ontology.edges! as unknown as Array<Edge>;
        this.nodes = lipid.ontology.nodes! as unknown as Array<Node>;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      console.log("Ontology Graph: updated for lipid " + JSON.stringify(lipid?.nomenclature.name))
    });
  }
}
