import { Component, Input } from '@angular/core';

import { OntologyGraphNode } from 'src/app/models/ontology-graph-node.model';


@Component({
    selector: 'app-ontology-graph-node',
    imports: [],
    templateUrl: './ontology-graph-node.component.html',
    styleUrls: ['./ontology-graph-node.component.sass']
})
export class OntologyGraphNodeComponent {
  @Input('node') node!: OntologyGraphNode;
}
