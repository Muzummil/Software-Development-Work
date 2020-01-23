import {Input, Component, Output, EventEmitter, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {ConfigService} from "../config.service";
import { ShareButtons } from '@ngx-share/core';

declare var jQuery:any;

@Component({

    selector: "share-social-media",
    styleUrls: ['./socialMedia.scss'],
    template: `
      <div class="rrssb-buttons">
        <a shareButton="facebook" class="fb" url="{{url}}"   [innerHTML]="fbTemp"></a>
        <a shareButton="twitter" class="twitter" url="{{url}}"     [innerHTML]="twttTemp"></a>
        <a shareButton="linkedin" class="linkedin" url="{{url}}"     [innerHTML]="inTemp"></a>
        <a shareButton="whatsapp" class="whatsap" url="{{url}}"    [innerHTML]="watsapTemp"></a>
        <div class=" clearfix "></div>
      </div>
`
})


export class SocialMediaComponent {

    @Input() url;
    @Input() image = ConfigService.shareImage;
    @Input() title:string = "This is the email subject and/or tweet text";
    @Input() description:string = ConfigService.META_DESC;
    @Input() emailBody:string = "email body";
    // @Output() getProcessedPhoneNo = new EventEmitter();

    fbTemp   =   '<div class="rrssb-facebook"><span class="soc-rounds facebook popup"><i class="zmdi zmdi-facebook"></i></span></div>';
    twttTemp = '<div class="rrssb-twitter"> <span class="soc-rounds twitter popup"><i class="zmdi zmdi-twitter"></i> </span> </div>';
    inTemp   = '<div class="rrssb-linkedin"><span class="soc-rounds linkedin popup"><i class="zmdi zmdi-linkedin"></i></span></div>';
    googleTemp = '<div class="rrssb-googleplus"><span class="soc-rounds google-plus popup"><i class="zmdi zmdi-google-plus"></i></span></div>'
    watsapTemp = '<div class="rrssb-watsap"><span class="soc-rounds watsap popup"><i class="zmdi zmdi-whatsapp"></i></span></div>'

    public form1:FormGroup;
    public elementRef:ElementRef;

    constructor(@Inject(ElementRef) elementRef:ElementRef, public _fb:FormBuilder, public share: ShareButtons) {
        this.elementRef = elementRef;

    }





}
