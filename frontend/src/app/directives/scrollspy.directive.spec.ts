import { ElementRef } from '@angular/core';
import { ScrollSpyDirective } from './scrollspy.directive';


describe('ScrollSpyDirective', () => {
  it('should create an instance', () => {
    const directive = new ScrollSpyDirective(new ElementRef(""));
    expect(directive).toBeTruthy();
  });
});
