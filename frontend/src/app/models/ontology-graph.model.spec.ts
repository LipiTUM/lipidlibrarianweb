import { OntologyGraph } from './ontology-graph.model';


describe('OntologyGraph', () => {
  it('should create an instance', () => {
    expect(new OntologyGraph([], [], { width: 0, height: 0 })).toBeTruthy();
  });
});
