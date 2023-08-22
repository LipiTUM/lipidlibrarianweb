import { Source } from "./source.model";


export class Synonym {
  value?: string;
  synonym_type?: string;
  sources: Array<Source> = [];

  constructor(data?: any) {
    if (data) {
      this.value = data.value;
      this.synonym_type = data.synonym_type;

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }
    }
  }
}
