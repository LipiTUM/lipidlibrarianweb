import { ElementRef, Injectable } from '@angular/core';
import * as d3 from 'd3';

import { OntologyGraph } from 'src/app/models/ontology-graph.model';
import { OntologyGraphNode } from 'src/app/models/ontology-graph-node.model';
import { OntologyGraphEdge } from 'src/app/models/ontology-graph-edge.model';


@Injectable({
  providedIn: 'root'
})
export class OntologyGraphService {

  constructor() {}

  applyDraggableBehaviour(element: ElementRef, node: OntologyGraphNode, graph: OntologyGraph) {
    const d3element = d3.select(element);

    function started() {
      /** Preventing propagation of dragstart to parent elements */
      d3.event.sourceEvent.stopPropagation();

      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      d3.event.on("drag", dragged).on("end", ended);

      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call(d3.drag().on("start", started));
  }

  applyZoomableBehaviour(svgElement: ElementRef, containerElement: ElementRef) {
    let svg = d3.select(svgElement);
    let container = d3.select(containerElement);

    let zoomed = () => {
      const transform = d3.event.transform;
      container.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    }

    let zoom = d3.zoom().on("zoom", zoomed);
    svg.call(zoom);
  }

  getOntologyGraph(nodes: OntologyGraphNode[], edges: OntologyGraphEdge[], options: { width: number, height: number} ) {
    let graph = new OntologyGraph(nodes, edges, options);
    return graph;
  }
}
