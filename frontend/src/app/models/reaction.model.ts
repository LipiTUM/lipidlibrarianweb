import { DatabaseIdentifier } from "./database-identifier.model";
import { Source } from "./source.model";


export class Reaction {
  direction?: string;
  substrates: Array<string> = [];
  products: Array<string> = [];
  gene_names: Array<[string, Array<string>]> = [];
  linex_reaction_type?: string;
  linex_nl_participants: Array<string> = [];
  description?: string;
  database_identifiers: Array<DatabaseIdentifier> = [];
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.direction = data.direction;

      if (data.substrates) {
        for (let substrate_data of data.substrates) {
          this.substrates.push(substrate_data);
        }
      }

      if (data.products) {
        for (let product_data of data.products) {
          this.products.push(product_data);
        }
      }

      if (data.gene_names) {
        for (let gene_name_data of data.gene_names) {
          let reaction_list: Array<string> = [];
          for (let reaction of gene_name_data[1]) {
            reaction_list.push(reaction);
          }
          this.gene_names.push([gene_name_data[0], reaction_list]);
        }
      }

      this.linex_reaction_type = data.linex_reaction_type;

      if (data.linex_nl_participants) {
        for (let linex_nl_participant_data of data.linex_nl_participants) {
          this.linex_nl_participants.push(linex_nl_participant_data);
        }
      }

      this.description = data.description;

      if (data.database_identifiers) {
        for (let database_identifier_data of data.database_identifiers) {
          this.database_identifiers.push(new DatabaseIdentifier(database_identifier_data));
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
