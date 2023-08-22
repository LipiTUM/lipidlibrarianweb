import { Level } from "./level.enum";


export class QueryResult {
  id!: string;
  file!: string;
  name!: string;
  level!: Level;
  timestamp!: Date;

  constructor(data?: any) {
    if (data) {
    this.id = data.lipid.id;
    this.file = data.lipid.file;
    this.name = data.lipid.name;
    this.level = data.lipid.level.split('.')[1];
    this.timestamp = new Date(data.timestamp);
    }
  }
}
