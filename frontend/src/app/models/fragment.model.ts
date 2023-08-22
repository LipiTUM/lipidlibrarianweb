import { Mass } from "./mass.model";
import { Source } from "./source.model";


export class Fragment {
  name?: string;
  mass?: number;
  masses: Array<Mass> = [];
  sum_formula?: string;
  adduct_name?: string;
  sources: Array<Source> = [];
  source?: string;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      if (data.masses) {
        for (let mass_data of data.masses) {
          this.masses.push(new Mass(mass_data));
        }
      }
      this.sum_formula = data.sum_formula;

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
