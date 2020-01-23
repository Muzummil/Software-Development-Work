import { Input, Component, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { ConfigService } from '../config.service';
let QRCode = require('qrcode')
declare var jQuery: any;

@Component({

    selector: 'qr-code',
    template: `<img src="">`,
    styleUrls: ['./qr-code.scss']
})

export class QrCodeComponent implements AfterViewInit {

    @Input() url;

    public elementRef: ElementRef;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    public ngAfterViewInit() {
        let that = this
        
        this.url = ConfigService.DOMAIN + this.url;
        QRCode.toDataURL(this.url, function (err, qrcode) {
            that.elementRef.nativeElement.querySelector('img').src = qrcode;
        });

    }

}
