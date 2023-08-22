import { Source } from "./source.model";


export class DatabaseIdentifier {
  database?: string;
  identifier?: string;
  sources: Array<Source> = [];
  url?: string;

  constructor(data?: any) {
    if (data) {
      this.database = data.database;
      this.identifier = data.identifier;

      if (data.sources) {
        for (let source_data of data.sources) {
          this.sources.push(new Source(source_data));
        }
      }

      this.url = data.url;
    }
  }
}
