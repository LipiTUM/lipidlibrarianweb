import { Source } from "./source.model";


export class Mass {
  mass_type?: string;
  value?: number;
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.mass_type = data.mass_type;
      this.value = data.value;

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
