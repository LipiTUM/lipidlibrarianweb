import {Component, isDevMode, OnInit} from '@angular/core';
import {NgbAccordionModule, NgbCollapseModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {JsonPipe, NgIf} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {Checkbox} from "src/app/models/checkbox.model";
import {QueryService} from 'src/app/services/query.service';
import {Query} from 'src/app/models/query.model';
import {CheckboxComponent} from '../checkbox/checkbox.component';
import {NotificationService} from 'src/app/services/notification.service';
import {noBoxesCheckedValidator} from "src/app/directives/at-least-one-box-checked.directive";


@Component({
  selector: 'app-query-form',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbCollapseModule,
    CheckboxComponent,
    NgbDropdownModule
  ],
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.sass'],
})
export class QueryFormComponent implements OnInit {
  positiveAdducts: Array<Checkbox> = [
    {id: 1, value: '+H+', isSelected: true},
    {id: 2, value: '+2H+', isSelected: true},
    {id: 3, value: '+Na+', isSelected: true},
    {id: 4, value: '+NH4+', isSelected: true},
    {id: 5, value: '+[39]K+', isSelected: true},
    {id: 6, value: '+[7]Li+', isSelected: true},
    {id: 7, value: '+[6]Li+', isSelected: true},
    {id: 8, value: '+H+ -H2O', isSelected: true},
    {id: 9, value: '+CD3', isSelected: true},
  ];
  negativeAdducts: Array<Checkbox> = [
    {id: 1, value: '-H+', isSelected: true},
    {id: 2, value: '-2H+', isSelected: true},
    {id: 3, value: '-3H+', isSelected: true},
    {id: 4, value: '+CH3COO-', isSelected: true},
    {id: 5, value: '+HCOO-', isSelected: true},
    {id: 6, value: '+[35]Cl-', isSelected: true},
    {id: 7, value: '+[37]Cl-', isSelected: true},
    {id: 8, value: '+CH3OCOO-', isSelected: true},
    {id: 9, value: '-H+CH3COOH', isSelected: true},
    {id: 10, value: '-H+CH3COONa', isSelected: true},
    {id: 11, value: '-H+HCOOH', isSelected: true},
    {id: 12, value: '-H+HCOONa', isSelected: true},
    {id: 13, value: '-H+SO3-', isSelected: true},
    {id: 13, value: '+F-', isSelected: true},
  ];
  querySources: Array<Checkbox> = [
    {id: 1, value: 'ALEX123', isSelected: true},
    {id: 2, value: 'LipidMaps', isSelected: true},
    {id: 3, value: 'LipidOntology', isSelected: true},
    {id: 4, value: 'LINEX', isSelected: true},
    {id: 5, value: 'SwissLipids', isSelected: true},
  ];
  verboseForm = isDevMode();
  queryForm!: FormGroup;

  constructor(
    private router: Router,
    private queryService: QueryService,
    private notificationService: NotificationService
  ) {
  }

  get form(): { [key: string]: AbstractControl } {
    return this.queryForm.controls;
  }


  get is_mz_search() {
    return this.queryForm.get("mz_search")?.value == "mz_search";
  }

  get is_search_term() {
    return this.queryForm.get("mz_search")?.value == "search_term";
  }

  get is_advanced_search() {
    return this.queryForm.get("advanced")?.value;
  }

  get lipid_name() {
    return this.queryForm.get('lipid_name')!;
  }

  get mz_value() {
    return this.queryForm.get('mz_value')!;
  }

  get tolerance() {
    return this.queryForm.get('tolerance')!;
  }

  get positive_adducts() {
    return this.queryForm.get('positiveAdducts')!;
  }

  get negative_adducts() {
    return this.queryForm.get('negativeAdducts')!;
  }

  get query_sources() {
    return this.queryForm.get('sources')!;
  }


  get is_basic_search_valid() {
    return (!this.is_advanced_search && this.lipid_name.valid);
  }


  get is_advanced_search_valid() {
    return (this.is_advanced_search && this.query_sources.valid &&
      ((this.mz_value.valid && this.tolerance.valid && this.is_mz_search && (this.positive_adducts.valid || this.negative_adducts.valid)) ||
        (this.lipid_name.valid && this.is_search_term)));
  }

  updateArray(value: Array<Checkbox>, type: string): void {
    if (type == "positive") {
      this.queryForm.patchValue({positiveAdducts: value});
    } else if (type == "negative") {
      this.queryForm.patchValue({negativeAdducts: value});
    } else if (type == "databases") {
      this.queryForm.patchValue({sources: value});
    }
  }

  updateBasicSearchExamples(query_string: string) {
    this.queryForm.patchValue({lipid_name: query_string});
  }

  updateAdvancedSearchExamples(search_type: string, search_term: string, mz_value: number, tolerance: number, positiveAdducts: Array<string>, negativeAdducts: Array<string>, querySources: Array<string>) {
    if (search_type == "search_term") {
      this.queryForm.patchValue({mz_search: search_type});
      this.queryForm.patchValue({lipid_name: search_term});
      for (let i = 0; i < this.querySources.length; i++) {
        this.querySources[i].isSelected = querySources.includes(this.querySources[i].value);
      }
    } else if (search_type == "mz_search") {
      this.queryForm.patchValue({mz_search: search_type});
      this.queryForm.patchValue({mz_value: mz_value});
      this.queryForm.patchValue({tolerance: tolerance});
      for (let i = 0; i < this.positiveAdducts.length; i++) {
        this.positiveAdducts[i].isSelected = positiveAdducts.includes(this.positiveAdducts[i].value);
      }
      for (let i = 0; i < this.negativeAdducts.length; i++) {
        this.negativeAdducts[i].isSelected = negativeAdducts.includes(this.negativeAdducts[i].value);
      }
      for (let i = 0; i < this.querySources.length; i++) {
        this.querySources[i].isSelected = querySources.includes(this.querySources[i].value);
      }
    }
  }

  ngOnInit(): void {
    this.queryForm = new FormGroup({
      mz_search: new FormControl("not_selected"),
      advanced: new FormControl(false),
      lipid_name: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z-+\\/\\_\\(\\)\\;\\,\\.\\d: ]*")]),
      mz_value: new FormControl('', [Validators.required]),
      tolerance: new FormControl('0.05', [Validators.required, Validators.min(0), Validators.max(1)]),
      positiveAdducts: new FormControl(Array<Checkbox>, [noBoxesCheckedValidator]),
      negativeAdducts: new FormControl(Array<Checkbox>, [noBoxesCheckedValidator]),
      sources: new FormControl(Array<Checkbox>, [noBoxesCheckedValidator])
    });

    // Put a checkmark in all boxes (Postive Adducts, Negative Adducts, Sources)
    this.queryForm.patchValue({positiveAdducts: this.positiveAdducts});
    this.queryForm.patchValue({negativeAdducts: this.negativeAdducts});
    this.queryForm.patchValue({sources: this.querySources});
  }

  showQuerySuccessNotification(query_input: string): void {
    this.notificationService.show(
      "Successfully submitted a query for '" + query_input + "'.",
      {classname: "bg-success text-light", header: "Query Submitted"}
    );
  }

  showBackendNotAvailableNotification(): void {
    this.notificationService.show(
      "The backend server is not available right now, therefore no searches and calculations are possible. Please try again later.",
      {classname: "bg-danger text-light", header: "Connection Error"}
    );
  }

  onSubmit(): void {
    console.log("[query-form.component::onSubmit] Processing Submit Request");
    // Get user input
    var queryFormValues = this.queryForm.value;
    let query_string: string  = "";
    let query_filters: string = "";

    if (this.is_basic_search_valid) {
      console.log("[query-form.component::onSubmit] Basic Search");
      query_string = queryFormValues.lipid_name;
      query_filters = "source=ALEX123;source=LipidMaps;source=LipidOntology;source=LINEX;source=SwissLipids;cutoff=5;requeries=1";
    } else if (this.is_advanced_search_valid) {
      console.log("[query-form.component::onSubmit] Advanced Search");
      const getSelectedValues = (array: Array<Checkbox>): Array<string> => {
        return array
          .filter(x => x.isSelected)
          .map(x => x.value);
      };
      if (this.is_search_term) {
        console.log("[query-form.component::onSubmit] Search Type: search term");
        query_string = queryFormValues.lipid_name;
      } else if (this.is_mz_search) {
        console.log("[query-form.component::onSubmit] Search Type: m/z value");
        const selectedPositiveAdducts = getSelectedValues(this.positiveAdducts);
        const selectedNegativeAdducts = getSelectedValues(this.negativeAdducts);
        query_string = queryFormValues.mz_value + ';' +
          queryFormValues.tolerance + ';' +
          selectedPositiveAdducts.join(",") + ';' +
          selectedNegativeAdducts.join(",");
      }
      else {
        console.log("[query-form.component::onSubmit] No Search type found");
        return;
      }
      // get selected sources
      const selectedQuerySources = getSelectedValues(this.querySources);
      for(let source of selectedQuerySources){
        query_filters = query_filters + "source="+source+";";
      }
      query_filters = query_filters + "cutoff=5;requeries=1";
    } else {
      console.log("[query-form.component::onSubmit] Processing Submit Request Failed: Form Invalid");
      return;
    }

    console.log("[app.component::onSubmit] Processed Submit Request: query_string: " + query_string + "; query filters: "+ query_filters+"; Executing Query;")

    this.queryService.executeQuery(query_string, query_filters).subscribe({
      next: (data: any) => {
        let query = new Query(data);
        console.log("[query-form.component::onSubmit] Query Executed successfully: " + JSON.stringify(data) + ";")
        this.showQuerySuccessNotification(query_string);
        this.router.navigate(['/', 'query', query.id]).then(nav => {
          console.log("[query-form.component::onSubmit] Navigating to the corresponding Query View;");
        }, err => {
          console.log(err);
        });
      },
      error: (data: any) => {
        this.showBackendNotAvailableNotification();
        console.log("[query-form.component::onSubmit] Executing Query returned an Error: " + JSON.stringify(data) + ";");
      }
    });
  }
}
