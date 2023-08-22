import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[scrollSpy]',
  standalone: true
})
export class ScrollSpyDirective implements OnInit, OnDestroy {
  @Input() public spiedTags: Array<string> = [];
  @Input() public offset = 0;
  @Input() public debounceTime = 0;
  @Input() public defaultSection = "";
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string = this.defaultSection;
  private sectionChanges = new Subject();
  private subscription?: Subscription;

  constructor(private _el: ElementRef) {}

  public ngOnInit() {
    this.subscription = this.sectionChanges.pipe(debounceTime(this.debounceTime)).subscribe((e: any) => this.sectionChange.emit(e));
  }

  public ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string = "";
    const children = this._el.nativeElement.children;
    const scrollTop = event.target.scrollingElement.scrollTop;
    const parentOffset = event.target.scrollingElement.offsetTop;
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
        if ((element.offsetTop - parentOffset - this.offset) <= scrollTop) {
          currentSection = element.id;
        }
      }
    }
    if (currentSection === "") {
      currentSection = this.defaultSection;
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChanges.next(this.currentSection);
    }
  }
}
