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
    const d3element = d3.select(element.nativeElement);

    d3element.call(d3.drag().on("start", (event, d) => {
      /** Preventing propagation of dragstart to parent elements */
      event.sourceEvent.stopPropagation();

      if (!event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      event.on("drag", () => {
          node.fx = event.x;
          node.fy = event.y;
        }).on("end", () => {
          if (!event.active) {
            graph.simulation.alphaTarget(0);
          }

          node.fx = null;
          node.fy = null;
        });
    }));
  }

  applyZoomableBehaviour(svgElement: ElementRef, containerElement: ElementRef) {
    let svg = d3.select(svgElement.nativeElement);
    let container = d3.select(containerElement.nativeElement);

    let zoom = d3.zoom().on("zoom", (event) => {
      const transform = event.transform;
      container.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    });

    svg.call(zoom);
  }

  getOntologyGraph(nodes: OntologyGraphNode[], edges: OntologyGraphEdge[], options: { width: number, height: number} ) {
    let graph = new OntologyGraph(nodes, edges, options);
    return graph;
  }
}
