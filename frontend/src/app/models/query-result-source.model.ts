export class QueryResultSource {
  name!: string;
  displayName: string = this.name;
  abbreviation: string = this.name;
  active: boolean = false;
  color: string = "#ffffff";

  constructor(name: string, active: boolean) {
    this.name = name;
    this.active = active;

    if (name === "swisslipids") {
      this.displayName = "SwissLipids";
      this.color = "#ff0000";
      this.abbreviation = "SL";
    } else if (name === "lipidmaps") {
      this.displayName = "LIPID MAPS";
      this.color = "#0000ff";
      this.abbreviation = "LM";
    } else if (name === "alex123") {
      this.displayName = "ALEX¹²³";
      this.color = "#00ffff";
      this.abbreviation = "AX";
    } else if (name === "lion") {
      this.displayName = "LION/web";
      this.color = "#ffff00";
      this.abbreviation = "LO";
    } else if (name === "linex") {
      this.displayName = "LINEX";
      this.color = "#00ff00";
      this.abbreviation = "LX";
    } else if (name === "lipidlibrarian") {
      this.displayName = "LipidLibrarian";
      this.color = "#ff00ff";
      this.abbreviation = "LL";
    }
  }
}
