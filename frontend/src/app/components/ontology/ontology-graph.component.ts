import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';

import { Lipid } from 'src/app/models/lipid.model';
import { OntologyGraph } from 'src/app/models/ontology-graph.model';
import { OntologyGraphEdge } from 'src/app/models/ontology-graph-edge.model';
import { OntologyGraphNode } from 'src/app/models/ontology-graph-node.model';
import { OntologyGraphService } from 'src/app/services/ontology-graph.service';


@Component({
  selector: 'app-ontology-graph',
  standalone: true,
  imports: [
    NgFor,
  ],
  templateUrl: './ontology-graph.component.html',
  styleUrls: ['./ontology-graph.component.sass']
})
export class OntologyGraphComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  graph?: OntologyGraph;
  edges?: Array<OntologyGraphEdge>;
  nodes?: Array<OntologyGraphNode>;

  private _options: { width: number, height: number } = { width: 800, height: 600 };

  constructor(private ontologyGraphService: OntologyGraphService) { }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology && lipid.ontology.nodes.values()) {
        this.edges = lipid.ontology.edges;
        this.nodes = [ ...lipid.ontology.nodes.values() ];
      } else {
        this.edges = [];
        this.nodes = [];
      }
      this.graph = this.ontologyGraphService.getOntologyGraph(this.nodes, this.edges, this.options);
      this.graph.initSimulation(this.options);
    });
  }
}
