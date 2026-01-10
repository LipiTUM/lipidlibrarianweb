import { Level } from "./level.enum";
import { QueryResultSource } from "./query-result-source.model";


export class QueryResult {
  id!: string;
  file!: string;
  name!: string;
  level!: Level;
  timestamp!: Date;
  sources: Array<QueryResultSource> = [];

  constructor(data?: any) {
    const all_sources = ["swisslipids", "lipidmaps", "alex123", "lion", "linex", "lipidlibrarian"];
    const this_sources = new Set()

    if (data) {
      this.id = data.id;
      this.file = data.file;
      this.name = data.name;
      this.level = data.level;
      this.timestamp = new Date(data.timestamp);

      if (data.sources) {
        for (let source of data.sources) {
          this_sources.add(source.source);
        }
      }

      const included_sources = [...new Set(all_sources)].filter(x => this_sources.has(x));
      const excluded_sources = [...new Set(all_sources)].filter(x => !this_sources.has(x));

      included_sources.forEach((source) => {
          this.sources.push(new QueryResultSource(source, true));
      });

      excluded_sources.forEach((source) => {
          this.sources.push(new QueryResultSource(source, false));
      });

      this.sources.sort(
        function(a, b) {
          if (a.name == b.name){
            return a.name.localeCompare(b.name);
          } else {
            return all_sources.indexOf(a.name) - all_sources.indexOf(b.name);
          }
        }
      );
    }
  }
}
