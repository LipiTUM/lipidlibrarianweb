import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { Edge, NgxGraphModule, Node } from '@swimlane/ngx-graph';

import { Lipid } from 'src/app/models/lipid.model';
import { Ontology } from 'src/app/models/ontology.model';


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
      if (lipid && lipid.ontology) {
        let ontology = new Ontology(lipid.ontology)
        console.log("Ontology Graph: created ontology " + JSON.stringify(ontology))
        this.edges = ontology.edges! as unknown as Array<Edge>;
        this.nodes = ontology.nodes! as unknown as Array<Node>;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      console.log("Ontology Graph: initialized for lipid " + JSON.stringify(lipid?.nomenclature.name) + " with ontology " + JSON.stringify(lipid?.ontology))
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology) {
        let ontology = new Ontology(lipid.ontology)
        console.log("Ontology Graph: created ontology " + JSON.stringify(ontology))
        this.edges = ontology.edges! as unknown as Array<Edge>;
        this.nodes = ontology.nodes! as unknown as Array<Node>;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      console.log("Ontology Graph: updated for lipid " + JSON.stringify(lipid?.nomenclature.name) + " with ontology " + JSON.stringify(lipid?.ontology))
    });
  }
}
