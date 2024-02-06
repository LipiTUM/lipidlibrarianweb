import { OntologyGraphNode } from "./ontology-graph-node.model";


export class OntologyGraphEdge implements d3.SimulationLinkDatum<OntologyGraphNode> {
  source!: OntologyGraphNode;
  target!: OntologyGraphNode;
  label?: string;

  constructor(data?: any) {
    if (data) {
      this.source = data.source;
      this.target = data.target;
      if (data.label) {
        this.label = data.label;
      }
    }
  }
}
