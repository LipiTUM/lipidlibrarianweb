import { Source } from "./source.model";


export class OntologyTerm {
  ontology_term?: string;
  ontology_subgraph: Array<[string, string]> = [];
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.ontology_term = data.ontology_term;

      if (data.ontology_subgraph) {
        for (let ontology_subgraph_data of data.ontology_subgraph) {
          this.ontology_subgraph.push([ontology_subgraph_data[0], ontology_subgraph_data[1]]);
        }
      }

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
