import { Input, OnInit, Component, ElementRef, Inject, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';


// import 'localrepo/mediaelement';
import 'jquery';

var mediaelement = require('localrepo/mediaelement/mediaelement-and-player.min.js');

declare var jQuery: any;


@Component({

    selector: "video-style",
    template: `
                <div class="video_fix">
                    <video width="100%" height="100%" controls [attr.poster]="(video_screenshot | async)" preload="none">
                        <source [attr.src]="(social_media_video | async)" type="video/mp4">
                    </video>
                    <div class=" clearfix"></div>
                </div>`
})


export class VideoComponent implements OnInit {

    @Input() social_media_video;
    @Input() video_screenshot;

    public elementRef: ElementRef;

    constructor(@Inject(ElementRef) elementRef: ElementRef, public _fb: FormBuilder, private _elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {


    }


    ngAfterViewInit() {


        jQuery(this.elementRef.nativeElement.querySelector('video'))
            .mediaelementplayer({
                alwaysShowControls: false,
                videoVolume: 'horizontal',
                features: ['playpause', 'progress', 'volume', 'fullscreen']
            });

    }

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            if (targetElement["className"] == "video-force-close modal fade in") {
                jQuery('.mejs-pause button').trigger("click");
                jQuery('.modal').modal('hide');
            }
        }
    }




}
