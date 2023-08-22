import { Level } from "./level.enum";


export class Source {
  lipid_name!: string;
  lipid_level!: Level;
  source!: string;

  constructor(data?: any) {
    if (data) {
      this.lipid_name = data.lipid_name;
      this.lipid_level = data.lipid_level;
      this.source = data.source;
    }
  }
}
