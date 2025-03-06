import { OntologyGraphEdge } from "./ontology-graph-edge.model";
import { OntologyGraphNode } from "./ontology-graph-node.model";
import { Source } from "./source.model";


export class Ontology {
  ontology_terms: Array<string> = [];
  nodes: Array<OntologyGraphNode> = [];
  edges: Array<OntologyGraphEdge> = [];
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      let node_map: Map<string, OntologyGraphNode> = new Map<string, OntologyGraphNode>();

      // fill nodes
      if (data.ontology_subgraph_node_data) {
        for (let [ontology_node_id, ontology_node_name] of (Object.entries(data.ontology_subgraph_node_data as [string, string]))) {
          node_map.set(ontology_node_id, new OntologyGraphNode({ 'id': ontology_node_id, 'label': ontology_node_name }));
        }
      }

      if (data.ontology_subgraph) {
        for (let ontology_subgraph_data of data.ontology_subgraph) {
          if (!node_map.has(ontology_subgraph_data[0])) {
            node_map.set(ontology_subgraph_data[0], new OntologyGraphNode({ "id": ontology_subgraph_data[0], 'label': 'unknown' }));
          }
          if (!node_map.has(ontology_subgraph_data[1])) {
            node_map.set(ontology_subgraph_data[1], new OntologyGraphNode({ "id": ontology_subgraph_data[1], 'label': 'unknown' }));
          }
        }
      }

      // TODO: Implement different colour for ontology_terms
      if (data.ontology_terms) {
        for (let ontology_terms_data of data.ontology_terms) {
          this.ontology_terms.push(ontology_terms_data);
        }
      }

      // fill edges
      if (data.ontology_subgraph) {
        for (let ontology_subgraph_data of data.ontology_subgraph) {
          if (ontology_subgraph_data[0] && ontology_subgraph_data[1] && node_map.has(ontology_subgraph_data[0]) && node_map.has(ontology_subgraph_data[1])) {
            this.edges.push(
              new OntologyGraphEdge(
                { "source": node_map.get(ontology_subgraph_data[0])!.id, "target": node_map.get(ontology_subgraph_data[1])!.id }
            ));
          }
        }
      }

      this.nodes = [...node_map.values()]

      // fill sources
      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
