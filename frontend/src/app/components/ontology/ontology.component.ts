import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { Edge, Graph, NgxGraphModule, Node } from '@swimlane/ngx-graph';

import { Lipid } from 'src/app/models/lipid.model';


@Component({
  selector: 'app-ontology',
  standalone: true,
  imports: [
    NgxGraphModule
  ],
  templateUrl: './ontology.component.html',
  styleUrls: ['./ontology.component.sass']
})
export class OntologyComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  nodes: Array<Node> = [];
  edges: Array<Edge> = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      let graph: Graph;
      if (lipid) {
        graph = this.generateGraph(lipid);
      } else {
        graph = { edges: [], nodes: [] };
      }
      this.nodes = graph.nodes;
      this.edges = graph.edges;
    });
  }

  generateGraph(lipid: Lipid): Graph {
    let nodes: Array<Node> = [];
    let edges: Array<Edge> = [];

    nodes.push({
      id: 'root',
      label: 'Ontology Root'
    });

    for (let ontology_term of lipid.ontology_terms) {
      if (ontology_term.ontology_term) {
        nodes.push({
          id: ontology_term.ontology_term,
          label: ontology_term.ontology_term
        });
        edges.push({
          id: 'root-' + ontology_term.ontology_term,
          source: 'root',
          target: ontology_term.ontology_term,
        });
      }
      if (ontology_term.ontology_subgraph) {
        for (let ontology_edge of ontology_term.ontology_subgraph) {
          nodes.push({
            id: ontology_edge[0],
            label: ontology_edge[0]
          });
          nodes.push({
            id: ontology_edge[1],
            label: ontology_edge[1]
          });
          edges.push({
            id: '' + ontology_edge[0] + ontology_edge[1],
            source: ontology_edge[0],
            target: ontology_edge[1],
          });
        }
      }
    }

    return { nodes: nodes, edges: edges };
  }
}
