import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';

import { Lipid } from 'src/app/models/lipid.model';
import { OntologyGraph } from 'src/app/models/ontology-graph.model';
import { OntologyGraphEdge } from 'src/app/models/ontology-graph-edge.model';
import { OntologyGraphNode } from 'src/app/models/ontology-graph-node.model';
import { OntologyGraphService } from 'src/app/services/ontology-graph.service';
import { OntologyGraphDraggableBehaviourDirective } from 'src/app/directives/ontology-graph-draggable-behaviour.directive';
import { OntologyGraphZoomableBehaviourDirective } from 'src/app/directives/ontology-graph-zoomable-behaviour.directive';
import { OntologyGraphNodeComponent } from './ontology-graph-node.component';
import { OntologyGraphEdgeComponent } from './ontology-graph-edge.component';
import { Ontology } from 'src/app/models/ontology.model';


@Component({
    selector: 'app-ontology-graph',
    imports: [
        NgFor,
        OntologyGraphNodeComponent,
        OntologyGraphEdgeComponent,
        OntologyGraphDraggableBehaviourDirective,
        OntologyGraphZoomableBehaviourDirective,
    ],
    templateUrl: './ontology-graph.component.html',
    styleUrls: ['./ontology-graph.component.sass']
})
export class OntologyGraphComponent implements AfterViewInit, OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  graph?: OntologyGraph;
  edges?: Array<OntologyGraphEdge>;
  nodes?: Array<OntologyGraphNode>;

  _options: { width: number, height: number } = { width: 800, height: 600 };

  constructor(private ontologyGraphService: OntologyGraphService) { }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  ngAfterViewInit(): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology) {
        let ontology = new Ontology(lipid.ontology)
        console.log("Ontology Graph: created ontology " + JSON.stringify(ontology))
        this.edges = lipid.ontology.edges;
        this.nodes = lipid.ontology.nodes;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      this.graph = this.ontologyGraphService.getOntologyGraph(this.nodes, this.edges, this.options);
      console.log("Ontology Graph: created for lipid " + JSON.stringify(lipid?.nomenclature.name) + " with ontology " + JSON.stringify(lipid?.ontology))
      this.graph.initSimulation(this.options);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid && lipid.ontology) {
        let ontology = new Ontology(lipid.ontology)
        console.log("Ontology Graph: created ontology " + JSON.stringify(ontology))
        this.edges = lipid.ontology.edges;
        this.nodes = lipid.ontology.nodes;
      } else {
        this.edges = [];
        this.nodes = [];
      }
      this.graph = this.ontologyGraphService.getOntologyGraph(this.nodes, this.edges, this.options);
      console.log("Ontology Graph: updated for lipid " + JSON.stringify(lipid?.nomenclature.name) + " with ontology " + JSON.stringify(lipid?.ontology))
      this.graph.initSimulation(this.options);
    });
  }
}
