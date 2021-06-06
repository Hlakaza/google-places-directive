import { Directive, ElementRef, EventEmitter, Output, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
declare const google: any;
@Directive({
  selector: '[appGplacesmap]'
})
export class GplacesmapDirective implements AfterViewInit, OnDestroy {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Input() adressType: string = 'geocode';
  private element: HTMLInputElement;
  /**
   * @param {ElementRef} elRef will get a reference to the element where the directive is placed
   * @memberof GplacesmapDirective
   */
  constructor(elRef: ElementRef) {
     this.element = elRef.nativeElement;
   }

  ngAfterViewInit(): void {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.element,
      {
        componentRestrictions: { country: 'ZA' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(this.generateCleanObject(place))
    });
  }

  private generateCleanObject(address): any {
      const addressObjet = {};
      const location = {
       lat: address.geometry.location.lat(),
       long: address.geometry.location.lng(),
       formatted_address: address.formatted_address
      };
      address.address_components.map((element) => {
         addressObjet[element.types[0]] = element.long_name;
     });
      return {...addressObjet, ...location};
  }


  invokeEvent(place: Object): void {
    this.onSelect.emit(place);
  }

  ngOnDestroy(): void {
    this.onSelect.emit('');
  }

}
