import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbAccordionModule, NgbActiveOffcanvas, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

import { SessionService } from 'src/app/services/session.service';
import { TokenValidation } from "src/app/components/token/token.validation";


/**
 * The TokenComponent manages the UUID which defines the current workspace. It is stored as a Cookie and valid for 30 days.
 */
@Component({
  selector: 'app-token',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbCollapseModule
  ],
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.sass'],
})
export class TokenComponent implements OnInit {
  @Input() activeOffcanvas?: NgbActiveOffcanvas;
  @Input() reloadEvents$?: EventEmitter<any>;

  current_token: string = "";
  submitted = false;
  collapsed = true;

  tokenForm: FormGroup = new FormGroup({
    token: new FormControl(''),
  });

  constructor(
    public sessionService: SessionService,
    private formBuilder: FormBuilder
  ) { }

  /**
   * Gets the current token via the sessionService.
   *
   * @remarks
   * Implements OnInit
   */
  ngOnInit(): void {
    this.tokenForm = this.formBuilder.group(
      {
        token: ['', Validators.required],
      },
      {
        validators: [TokenValidation.uuidValidatorFactory('token')],
      }
    );

    this.current_token = this.sessionService.getToken();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.tokenForm.controls;
  }

  /**
   * Sets the token to the token entered in the HTML form via the sessionService.
   */
  onSubmit(): void {
    if (this.tokenForm.invalid) {
      this.submitted = true;
      return;
    } else {
      this.sessionService.setToken(this.tokenForm.value.token);
      this.current_token = this.sessionService.getToken();

      console.log(JSON.stringify(this.tokenForm.value, null, 2));

      this.submitted = false;
      this.tokenForm.reset();
    }
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  /**
   * Sets the token to a randomly generated UUID via the sessionService.
   */
  randomToken(): void {
    this.tokenForm.controls['token'].setValue(this.sessionService.generateToken());
  }
}
