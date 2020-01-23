import {Input, OnInit,Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
// import * as intlutils from "../../../assets/local_modules/intl-utils.js";

declare var jQuery:any;



@Component({
    selector: "jquery-tel",
    styleUrls: ['./intTelephone.scss'],
    template: `<div [class.arabic] = "isArabic"><input type="number" id="mobile_number_directive" (keyup)="onKeyUp()"  maxLength="9" (change)="onGetPhone()" (blur)="onGetPhone()"  placeholder="{{placeholder}}"  [class.error-feild]="errorFlag" class="int-tel-phoneNum" /></div>`
})


export class IntComponent implements OnInit{

    @Input() phone_no:string = "+971529518234";
    @Input() match:string = "phone_no";
    @Input() errorFlag:boolean = false;
    @Input() isArabic:boolean = false;
    //TODO: Placeholder not working fine!!
    @Input() maxLength:number = 9;
    @Input() placeholder:string = "Phone Number";
    @Input() tel_class:string = "int-tel-phoneNum";
    @Output() getProcessedPhoneNo = new EventEmitter();
    public form1:FormGroup;
    public elementRef:ElementRef;

    constructor(@Inject(ElementRef) elementRef:ElementRef,public _fb:FormBuilder) {
        this.elementRef = elementRef;
    }

    ngOnDestroy(){
        jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput("destroy");
    }
    ngOnInit() {


        if (jQuery(this.elementRef.nativeElement)) {
          jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput({
                initialCountry: "auto",
                  excludeCountries:['il'],
              autoHideDialCode: true,
              separateDialCode: true,
                  defaultCountry: "",
                  numberType: "MOBILE",
                  preventInvalidNumbers: true,
                geoIpLookup: function(callback) {
                    jQuery.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                        var countryCode = (resp && resp.country) ? resp.country : "";
                        callback(countryCode);
                    });
                },
                utilsScript: "../../../assets/local_modules/intl-utils.js" // just for formatting/placeholders etc

            })
        }
    }

    ngAfterViewInit() {
        if (jQuery(this.elementRef.nativeElement) && this.phone_no) {
            jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput("setNumber", this.phone_no);
            var that = this;
            jQuery(that.elementRef.nativeElement.querySelector('input')).on("countrychange", function(e, countryData) {
                // do something with countryData
                if (jQuery(that.elementRef.nativeElement)) {
                    that.getProcessedPhoneNo.emit({
                        match:that.match,
                        phone_no:jQuery(that.elementRef.nativeElement.querySelector('input')).intlTelInput("getNumber")
                    });
                }
            });
        }
    }

    onKeyUp(){
        jQuery("#mobile_number_directive").on("keypress", function(e){
            let currentValue = String.fromCharCode(e.which);
            let finalValue = jQuery(this).val() + currentValue;
            if(finalValue.length >= this.maxLength){
                e.preventDefault();
            }
        });
    }

    onGetPhone() {

        if (jQuery(this.elementRef.nativeElement)) {

            this.getProcessedPhoneNo.emit({
                match:this.match,
                phone_no:(this.elementRef.nativeElement.querySelector('input').value != '')?jQuery(this.elementRef.nativeElement.querySelector('input')).intlTelInput("getNumber"):''
            });

        }
    }

}
