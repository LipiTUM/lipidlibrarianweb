export class OntologyGraphNode {
  id!: string;
  label!: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      if (data.label) {
        this.label = data.label;
      } else {
        this.label = data.id;
      }
    }
  }
}
