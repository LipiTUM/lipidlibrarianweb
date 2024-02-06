import { EventEmitter } from '@angular/core';
import * as d3 from 'd3';

import { OntologyGraphEdge } from "./ontology-graph-edge.model";
import { OntologyGraphNode } from "./ontology-graph-node.model";


const FORCES = {
  EDGES: 1 / 50,
  COLLISION: 1,
  CHARGE: -1
}

export class OntologyGraph {
  public ticker: EventEmitter<d3.Simulation<OntologyGraphNode, OntologyGraphEdge>> = new EventEmitter();
  public simulation!: d3.Simulation<any, any>;

  public nodes: OntologyGraphNode[] = [];
  public edges: OntologyGraphEdge[] = [];

  constructor(
    nodes: Array<OntologyGraphNode>,
    edges: Array<OntologyGraphEdge>,
    options: { width: number, height: number }
  ) {
    this.nodes = nodes;
    this.edges = edges;

    this.initSimulation(options);
  }

  initSimulation(options: { width: number, height: number }) {
    if (!options || !options.width || !options.height) {
        throw new Error('missing options when initializing simulation');
    }

    /** Creating the simulation */
    if (!this.simulation) {
        const ticker = this.ticker;

        // Creating the force simulation and defining the charges
        this.simulation = d3.forceSimulation()
          .force("charge", d3.forceManyBody().strength(FORCES.CHARGE)
        );

        // Connecting the d3 ticker to an angular event emitter
        this.simulation.on("tick", function () {
            ticker.emit(this);
        });

        this.simulation.nodes(this.nodes);
        this.simulation.force("edges", d3.forceLink(this.edges).strength(FORCES.EDGES));
    }

    /** Updating the central force of the simulation */
    this.simulation.force("centers", d3.forceCenter(options.width / 2, options.height / 2));

    /** Restarting the simulation internal timer */
    this.simulation.restart();
  }
}
