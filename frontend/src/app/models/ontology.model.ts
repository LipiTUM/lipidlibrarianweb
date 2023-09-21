import { Source } from "./source.model";


export class Ontology {
  ontology_terms: Array<string> = [];
  ontology_subgraph: Array<[string, string]> = [];
  ontology_subgraph_node_data: Map<string, string> = new Map<string, string>();
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      if (data.ontology_terms) {
        for (let ontology_terms_data of data.ontology_terms) {
          this.ontology_terms.push(ontology_terms_data);
        }
      }

      if (data.ontology_subgraph) {
        for (let ontology_subgraph_data of data.ontology_subgraph) {
          this.ontology_subgraph.push([ontology_subgraph_data[0], ontology_subgraph_data[1]]);
        }
      }

      if (data.ontology_subgraph_node_data) {
        //for (let ontology_subgraph_node_data_data of data.ontology_subgraph_node_data) {
        //  this.ontology_subgraph_node_data.set(ontology_subgraph_node_data_data, ontology_subgraph_node_data_data);
        //}
      }

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
