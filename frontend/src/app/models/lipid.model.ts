import { Nomenclature } from "./nomenclature.model";
import { DatabaseIdentifier } from "./database-identifier.model";
import { Mass } from "./mass.model";
import { Ontology } from "./ontology.model";
import { Reaction } from "./reaction.model";
import { Adduct } from "./adduct.model";
import { Source } from "./source.model";


export class Lipid {
  id!: string;
  nomenclature: Nomenclature = new Nomenclature();
  ontology: Ontology = new Ontology();
  database_identifiers: Array<DatabaseIdentifier> = [];
  masses: Array<Mass> = [];
  reactions: Array<Reaction> = [];
  adducts: Array<Adduct> = [];
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.nomenclature = new Nomenclature(data.nomenclature);
      this.ontology = new Ontology(data.ontology);

      if (data.database_identifiers) {
        for (let database_identifier_data of data.database_identifiers) {
          this.database_identifiers.push(new DatabaseIdentifier(database_identifier_data));
        }
      }

      if (data.masses) {
        for (let mass_data of data.masses) {
          this.masses.push(new Mass(mass_data));
        }
      }

      if (data.reactions) {
        for (let reaction_data of data.reactions) {
          this.reactions.push(new Reaction(reaction_data));
        }
      }

      if (data.adducts) {
        for (let adduct_data of data.adducts) {
          this.adducts.push(new Adduct(adduct_data));
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
