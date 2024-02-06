export class OntologyGraphNode implements d3.SimulationNodeDatum {
  id!: string;
  label!: string;

  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

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
