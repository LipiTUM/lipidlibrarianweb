import { Component, Input } from '@angular/core';

import { OntologyGraphEdge } from 'src/app/models/ontology-graph-edge.model';


@Component({
  selector: 'app-ontology-graph-edge',
  standalone: true,
  imports: [],
  templateUrl: './ontology-graph-edge.component.html',
  styleUrls: ['./ontology-graph-edge.component.sass']
})
export class OntologyGraphEdgeComponent {
  @Input('edge') edge!: OntologyGraphEdge;
}
