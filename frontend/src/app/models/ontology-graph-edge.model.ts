import { OntologyGraphNode } from "./ontology-graph-node.model";


export class OntologyGraphEdge {
  id!: string;
  source!: OntologyGraphNode;
  target!: OntologyGraphNode;
  label?: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.source + '-' + data.target;
      this.source = data.source;
      this.target = data.target;
      if (data.label) {
        this.label = data.label;
      }
    }
  }
}
