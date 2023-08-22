import { Synonym } from "./synonym.model";
import { StructureIdentifier } from "./structure-identifier.model";
import { Level } from "./level.enum";
import { Source } from "./source.model";


export class Nomenclature {
  lipid_category?: string;
  lipid_class?: string;
  sum_formula?: string;
  synonyms: Array<Synonym> = [];
  structure_identifiers: Array<StructureIdentifier> = [];
  level!: Level;
  lipid_class_abbreviation?: string;
  residues: Array<string> = [];
  name?: string;
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.lipid_category = data.lipid_category;
      this.lipid_class = data.lipid_class;
      this.sum_formula = data.sum_formula;

      if (data.synonyms) {
        for (let synonym_data of data.synonyms) {
          this.synonyms.push(new Synonym(synonym_data));
        }
      }

      if (data.structure_identifiers) {
        for (let structure_identifier_data of data.structure_identifiers) {
          this.structure_identifiers.push(new StructureIdentifier(structure_identifier_data));
        }
      }

      this.level = data.level;
      this.lipid_class_abbreviation = data.lipid_class_abbreviation;

      if (data.residues) {
        for (let residue_data of data.residues) {
          this.residues.push(residue_data);
        }
      }

      this.name = data.name;

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
