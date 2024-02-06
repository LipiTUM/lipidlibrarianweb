import { OntologyGraphEdge } from "./ontology-graph-edge.model";
import { OntologyGraphNode } from "./ontology-graph-node.model";
import { Source } from "./source.model";


export class Ontology {
  nodes: Map<string, OntologyGraphNode> = new Map<string, OntologyGraphNode>();
  edges: Array<OntologyGraphEdge> = [];
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      // fill nodes
      if (data.ontology_subgraph_node_data) {
        for (let [ontology_node_id, ontology_node_data] of (Object.entries(data.ontology_subgraph_node_data as [string, any]))) {
          ontology_node_data.id = ontology_node_id
          this.nodes.set(ontology_node_id, new OntologyGraphNode(ontology_node_data));
        }
      }

      for (let ontology_subgraph_data of data.ontology_subgraph) {
        if (!this.nodes.has(ontology_subgraph_data[0])) {
          this.nodes.set(ontology_subgraph_data[0], new OntologyGraphNode({ "id": ontology_subgraph_data[0] }));
        }
        if (!this.nodes.has(ontology_subgraph_data[1])) {
          this.nodes.set(ontology_subgraph_data[1], new OntologyGraphNode({ "id": ontology_subgraph_data[1] }));
        }
      }

      // TODO: Implement different colour for ontology_terms
      //if (data.ontology_terms) {
      //  for (let ontology_terms_data of data.ontology_terms) {
      //    this.ontology_terms.push(ontology_terms_data);
      //  }
      //}

      // fill edges
      if (data.ontology_subgraph) {
        for (let ontology_subgraph_data of data.ontology_subgraph) {
          if (ontology_subgraph_data[0] && ontology_subgraph_data[1] && this.nodes.has(ontology_subgraph_data[0]) && this.nodes.has(ontology_subgraph_data[1])) {
            this.edges.push(
              new OntologyGraphEdge(
                { "source": this.nodes.get(ontology_subgraph_data[0]), "target": this.nodes.get(ontology_subgraph_data[1])}
            ));
          }
        }
      }

      // fill sources
      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
