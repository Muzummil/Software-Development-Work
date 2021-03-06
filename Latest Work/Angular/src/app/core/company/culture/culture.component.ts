import { Input, Component, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

declare var jQuery: any;

@Component({
    selector: 'company-culture',
    templateUrl: 'culture.component.html',
    styleUrls: ['./culture.scss']
})

export class CultureComponent implements  AfterViewInit{

    @Input() culturesObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public activeImag: number = 0;

    public ngAfterViewInit() {

        Observable.of(1).delay(2000)
            .subscribe((x) => {
                jQuery('.carousel').carousel({
                    interval: false
                });

                jQuery(document).ready(function (jQuery) {

                    jQuery('#myCarousel').carousel({
                        interval: 5000
                    });

                    // Handles the carousel thumbnails
                    jQuery('[id^=carousel-selector-]').click(function () {
                        var id_selector = jQuery(this).attr("id");
                        try {
                            var id = /-(\d+)$/.exec(id_selector)[1];

                            jQuery('#myCarousel').carousel(parseInt(id));
                        } catch (e) {
                            console.log('Regex failed!', e);
                        }
                    });
                    // When the carousel slides, auto update the text
                    jQuery('#myCarousel').on('slid.bs.carousel', function (e) {
                        var id = jQuery('.item.active').data('slide-number');
                        jQuery('#carousel-text').html(jQuery('#slide-content-' + id).html());
                    });
                });

            });

    }

}
