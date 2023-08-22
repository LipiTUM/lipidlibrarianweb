import { Source } from "./source.model";


export class StructureIdentifier {
  value?: string;
  structure_type?: string;
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.value = data.value;
      this.structure_type = data.structure_type;

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
