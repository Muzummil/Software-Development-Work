import {Input, Component, ElementRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from "../config.service";
import { ShareButtons } from '@ngx-share/core';

@Component({

    selector: "share-social-media-2",
    template: `

  <div class="social-section rrssb-buttons">
    <div class="social-media">
        <div class="sb-buttons">
          <button shareButton="facebook" url="{{url}}"     [innerHTML]="fbTemp"></button>
          <button shareButton="twitter" url="{{url}}"      [innerHTML]="twttTemp"></button>
          <button shareButton="linkedin" url="{{url}}"     [innerHTML]="inTemp"></button>
          <button shareButton="whatsapp" url="{{url}}"    [innerHTML]="watsapTemp"></button>
        </div>
      <div class=" clearfix"></div>

    </div>
  </div>
`
})


export class SocialMedia2Component {


    fbTemp =   '<span class="rrssb-facebook"><div class="soc-rounds facebook popup"><div class="s-media facebook"><i class="zmdi zmdi-facebook"></i></div></div></span>';
    twttTemp = '<span class="rrssb-twitter"> <div class="soc-rounds twitter popup"> <div class="s-media twitter"><i class="zmdi zmdi-twitter"></i></div> </div> </span>';
    inTemp = '<span class="rrssb-linkedin"><div class="soc-rounds linkedin popup"><div class="s-media linkdin"><i class="zmdi zmdi-linkedin"></i></div></div></span>';
    googleTemp = '<span class="rrssb-googleplus"><div  class="soc-rounds google-plus popup"><div class="s-media google-plus"><i class="zmdi zmdi-google-plus"></i></div></div></span>'
    watsapTemp = '<span class="rrssb-watsap"><div  class="soc-rounds watsap popup"><div class="s-media watsap"><i class="zmdi zmdi-whatsapp"></i></div></div></span>'

    @Input() url;
    @Input() image = ConfigService.shareImage;
    @Input() title:string = "This is the email subject and/or tweet text";
    @Input() description:string = ConfigService.META_DESC;
    @Input() emailBody:string = "email body";
    // @Output() getProcessedPhoneNo = new EventEmitter();
    public form1:FormGroup;
    public elementRef:ElementRef;

    constructor(@Inject(ElementRef) elementRef:ElementRef, public _fb:FormBuilder, public share: ShareButtons) {
        this.elementRef = elementRef;

    }
}
