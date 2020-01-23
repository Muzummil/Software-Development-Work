import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { JobseekerJobService } from '../../../jobseekers/job/services/jobseekerJob.service';
import { BehaviorSubject } from 'rxjs';

declare var jQuery;
let moment = require('moment');
@Component({

    selector: 'base-careers',
    templateUrl: 'baseCareers.component.html',
    styleUrls: ['./baseCareers.scss']
})

export class BaseCareersComponent  implements  AfterViewInit {

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public showSpinner$: BehaviorSubject<any> = new BehaviorSubject(true);
    public jobList$ = new BehaviorSubject([]);
    public itemsMainDiv = ('.MultiCarousel');
    public itemsDiv = ('.MultiCarousel-inner');
    public translateXval = 0;
    public itemWidth = 0;

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public jobService: JobseekerJobService,
                public router: Router, public _activeRoute: ActivatedRoute) {

        this.currLan = this.accountService.getCurrLang();
        this.accountService.setPageSeo('careers');
        this.jobService.getAllJobList('', '', '', null, 1, 4).subscribe((res) => {

                this.showSpinner$.next(false);
                res['jobs'].forEach((selJob, selJobCnt) => {
                    res['jobs'][selJobCnt].createdDate = moment(Date.parse(selJob.createdDate))
                        .format('D MMM, YYYY');
                });
                this.jobList$.next(res['jobs']);

            },
            (error) => {
                this.accountService.getErrorCheck(error);
            });
    }


    public ngAfterViewInit() {

        let that = this;
        jQuery('.leftLst, .rightLst').click(function () {
            let condition = jQuery(this).hasClass('leftLst');
            if (condition) {
                that.click(0, this);
            } else {
                that.click(1, this);
            }
        });
        this.resCarouselSize();
    }

    // this function define the size of the items
    public resCarouselSize() {
        let incno = 0;
        let dataItems = ('data-items');
        let itemClass = ('.item');
        let id = 0;
        let btnParentSb = '';
        let itemsSplit: string[] = [];
        let sampwidth = jQuery(this.itemsMainDiv).width();
        let bodyWidth = jQuery('body').width();
        let that = this;
        jQuery(this.itemsDiv).each(function () {
            id = id + 1;
            let itemNumbers = jQuery(this).find(itemClass).length;
            btnParentSb = jQuery(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            jQuery(this).parent().attr('id', 'MultiCarousel' + id);

            if (bodyWidth >= 1200) {
                incno = parseInt(itemsSplit[3], 10);
                that.itemWidth = sampwidth / incno;
            } else if (bodyWidth >= 992) {
                incno = parseInt(itemsSplit[2], 10);
                that.itemWidth = sampwidth / incno;
            } else if (bodyWidth >= 768) {
                incno = parseInt(itemsSplit[1], 10);
                that.itemWidth = sampwidth / incno;
            } else {
                incno = parseInt(itemsSplit[0], 10);
                that.itemWidth = sampwidth / incno;
            }
            jQuery(this).css({ transform: 'translateX(0px)', width: that.itemWidth * itemNumbers });
            jQuery(this).find(itemClass).each(function () {
                jQuery(this).outerWidth(that.itemWidth);
            });

            jQuery('.leftLst').addClass('over');
            jQuery('.rightLst').removeClass('over');

        });
    }

    // It is used to get some elements from btn
    public click(ell, ee) {
        let Parent = '#' + jQuery(ee).parent().attr('id');
        let slide = jQuery(Parent).attr('data-slide');
        this.resCarousel(ell, Parent, slide);
    }

    public resCarousel(e, el, s) {

        let leftBtn = ('.leftLst');
        let rightBtn = ('.rightLst');
        let divStyle = jQuery(el + ' ' + this.itemsDiv).css('transform');
        let values = divStyle.match(/-?[\d\.]+/g);
        let xds = Math.abs(values[4]);
        if (e == 0) {
            // @ts-ignore
            this.translateXval = parseInt(xds, 10) - parseInt(this.itemWidth * s, 10);
            jQuery(el + ' ' + rightBtn).removeClass('over');

            // @ts-ignore
            if (this.translateXval <= this.itemWidth / 2) {
                this.translateXval = 0;
                jQuery(el + ' ' + leftBtn).addClass('over');
            }
        } else if (e == 1) {
            let itemsCondition = jQuery(el).find(this.itemsDiv).width() - jQuery(el).width();
            // @ts-ignore
            this.translateXval = parseInt(xds, 10) + parseInt(this.itemWidth * s, 10);
            jQuery(el + ' ' + leftBtn).removeClass('over');

            // @ts-ignore
            if (this.translateXval >= itemsCondition - this.itemWidth / 2) {
                this.translateXval = itemsCondition;
                jQuery(el + ' ' + rightBtn).addClass('over');
            }
        }
        // translateXval = 380
        let that = this;
        jQuery(el + ' ' + this.itemsDiv).css('transform',
            'translateX(' + -this.translateXval + 'px)');
    }
}
