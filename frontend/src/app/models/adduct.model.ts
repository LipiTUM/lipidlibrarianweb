import { Mass } from "./mass.model";
import { Fragment } from "./fragment.model";
import { Source } from "./source.model";


export class Adduct {
  name?: string;
  swisslipids_name?: string;
  swisslipids_abbrev?: string;
  lipidmaps_name?: string;
  adduct_mass?: number;
  charge?: number;
  masses: Array<Mass> = [];
  mass?: number;
  fragments: Array<Fragment> = [];
  sources: Array<Source> = [];
  source?: string;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.swisslipids_name = data.swisslipids_name;
      this.swisslipids_abbrev = data.swisslipids_abbrev;
      this.lipidmaps_name = data.lipidmaps_name;
      this.adduct_mass = data.adduct_mass;
      this.charge = data.charge;

      if (data.masses) {
        for (let mass_data of data.masses) {
          this.masses.push(new Mass(mass_data));
        }
      }

      if (data.fragments) {
        for (let fragment_data of data.fragments) {
          this.fragments.push(new Fragment(fragment_data));
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
