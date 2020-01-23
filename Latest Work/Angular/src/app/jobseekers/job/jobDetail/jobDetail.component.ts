import { OnInit, Component, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
// Service
import { JobseekerJobService } from './../services/jobseekerJob.service';
import { ConfigService } from '../../../shared/config.service';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ErrorHandling } from '../../../core/services/errorHandling.service';

declare var jQuery: any;
let moment = require('moment');

@Component({

    selector: 'job-detail',
    templateUrl: 'jobDetail.component.html',
    styleUrls: ['./jobDetail.scss']
})

export class JobDetailComponent implements OnInit, OnDestroy {

    @Input() jobId: number;
    @Input() fromPage: string;
    @Output() jobDetailsClick = new EventEmitter();
    @Output() backClick = new EventEmitter();

    public selJob$ = new BehaviorSubject(null);
    public similarJob$ = new BehaviorSubject(null);
    public similarCompanies;
    public similarCompanies$ = new BehaviorSubject(null);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public similarJobClick: boolean = false;
    public sub;
    public showtooltip: boolean = false;
    public showBack: boolean = false;
    public unSavedFlag: boolean = false;
    public isPublic: boolean = true;
    public isViewAnalytics: boolean = false;
    public showRank: boolean = false;
    public probabilityRankList = {};
    public showRankSpinner: boolean = false;
    public rank = 0;
    public savedFlag: boolean = false;
    public jobCharts$ = new BehaviorSubject(null);
    public jobUrl$ = new BehaviorSubject(null);
    public jobUrlDesc$ = new BehaviorSubject(null);
    public jobUrlImg$ = new BehaviorSubject(ConfigService.shareImage);

    public jobUrltitle$ = new BehaviorSubject(null);
    public errrorMessage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);
    public showAnimate = false;
    public showSpinner = false;
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;
    public invalidJob: boolean = false;
    public queryParams$;
    public params = {};

    public paramsList = { 'city-name': '', 'country': '', 'sector_name': '', 'jobTitle-id': '' };
    public genderHashAr = { 'male': 'ذكر', 'female': 'أنثى', 'null': 'غير محدد', '': 'غير محدد' };
    public genderHash = { 'male': 'Male', 'female': 'Female', 'null': 'Any', '': 'Any' };
    // Flags
    public applyJobFlag = false;

    // members
    public selJob = [];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public showNonDiscloseSalary = (ConfigService.SHOW_NON_DISCLOSE_SALARY === 'true');
    public maxNationalities = 5;

    constructor(public _jobservice: JobseekerJobService,
        public fb: FormBuilder,
        public _router: Router,
        public _activeRoute: ActivatedRoute,
        public accountService: AccountService,
        public loaderService: LoaderService,
        public _location: Location, public _errorService: ErrorHandling) {

    }

    public getJobAnalytics() {

        this._jobservice.getJobCharts(this.jobId)
            .subscribe((res) => {
                this.isViewAnalytics = true;
                this.jobCharts$.next(res['jobCharts']);
            });
    }

    public onApplyJob() {

        this._jobservice.applyJobNoAttach(this.jobId).subscribe((res) => {
            this.successFlag$.next(true);

            Observable.of(1).delay(2000)
                .subscribe((x) => {
                    this.successFlag$.next(false);
                    jQuery('.close_delete').modal('hide');
                    this.selJob$.value['appliedDate'] = res['job_application']['applied_date'];
                    this.selJob$.value['count_applications'] =
                        this.selJob$.value['count_applications'] + 1;

                });
        },
            (error) => {
                this.errrorMessage$
                    .next(this.fixedTextHash['error_job_apply_fail'][this.currLan]);
                Observable.of(1).delay(2000)
                    .subscribe((x) => {
                        this.errrorMessage$.next(null);
                        jQuery('.close_delete').modal('hide');

                    });

                this.accountService.getErrorCheck(error);
            });
    }

    public onClickBack() {
        this.showBack = false;
        this.accountService.backClick();
    }

    public ngOnDestroy() {
        this.queryParams$.unsubscribe();
        this.sub.unsubscribe();
    }

    public onSaveJob() {
        this._jobservice.saveJob(this.selJob['id']).subscribe((res) => {

            this.savedFlag = true;
            Observable.timer(1000).subscribe((res) => {
                this.savedFlag = false;
            });
            this.selJob['isSaved'] = true;
            this.selJob$.next(this.selJob);
        });
    }

    public onUnSaveJob() {
        this._jobservice.getDeleteSavedJobList([this.selJob['id']]).subscribe((res) => {

            this.unSavedFlag = true;
            Observable.timer(1000).subscribe((res) => {
                this.unSavedFlag = false;
            });

            this.selJob['isSaved'] = false;
            this.selJob$.next(this.selJob);
        });
    }

    public addScript(selJob) {
        let script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'jobDetails';

        let json_content = {
            '@context': 'http://schema.org/',
            '@type': 'JobPosting',
            'baseSalary': {
                '@type': 'MonetaryAmount',
                'currency': this.accountService.getCurrency(),
                'value': {
                    '@type': 'QuantitativeValue',
                    'minValue': selJob['salaryFrom'],
                    'maxValue': selJob['salaryTo'],
                    'unitText': 'MONTH'
                }
            },
            'datePosted': moment(selJob['createdDate']).format('YYYY-MM-DD'),
            'description': selJob['jobDescription'],
            'employmentType': selJob['jobTypeName'],
            'hiringOrganization': {
                '@type': 'Organization',
                'name': selJob['companyObj']['name'],
                'sameAs': ConfigService.getDomain() + '/companies/' + selJob['companyObj']['name'].split(' ').join('-') + '-' + selJob['companyObj']['id'],
                'logo': selJob['companyObj']['profileImage']
            },
            'identifier': {
                '@type': 'PropertyValue',
                'name': selJob['companyObj']['name'],
                'value': selJob['companyObj']['id']
            },
            'jobLocation': {
                '@type': 'Place',
                'address': {
                    '@type': 'PostalAddress',
                    'streetAddress': selJob['companyObj']['addressLine'],
                    'addressLocality': selJob['city'],
                    'addressRegion': selJob['city'],
                    'addressCountry': selJob['countryCountry']
                }
            },
            'title': selJob['title'],
            'validThrough': moment(selJob['endDate']).format('YYYY-MM-DD')
        };

        let content = '/*<![CDATA[*/' + JSON.stringify(json_content) + '/*]]>*/';

        let node = document.createTextNode(content);
        script.appendChild(node);
        document.getElementsByTagName('body')[0].appendChild(script);
    }

    public _loadDate() {
        window.scrollTo(0, 0);

        // URL Params Fetch
        this.queryParams$ = this._activeRoute.queryParams.subscribe((params) => {

            this.params = params;
            if (this.jobId > this._jobservice.indeed_uk_fix) {
                this.jobId -= this._jobservice.indeed_uk_fix;
            } else if (this.jobId > this._jobservice.indeed_kuwait_fix) {
                this.jobId -= this._jobservice.indeed_kuwait_fix;
            } else if (this.jobId > this._jobservice.indeed_saudi_fix) {
                this.jobId -= this._jobservice.indeed_saudi_fix;
            }

            this._jobservice.getJobDetails(this.jobId)
                .subscribe((res) => {
                    let jobUrl = ConfigService.getDomain() + '/' +
                        this.accountService.getPath() + '/jobs';
                    let jobPublicUrl = ConfigService.getDomain() +
                        this.accountService.getCurrLangUrl() + this.paramsList['country'] +
                        '/jobs';
                    this._activeRoute.url['_value'].forEach((selVal) => {
                        jobUrl += '/' + selVal;
                        jobPublicUrl += '/' + selVal;
                    });

                    this.showBack = true;

                    let todaydate = new Date();

                    if (res.selectedJobs.jobStatus === 'Open'
                        && res.selectedJobs.deleted === false
                        && moment(todaydate).isSameOrBefore(res.selectedJobs.endDate, 'day')
                        && moment(todaydate).isSameOrAfter(res.selectedJobs.startDate,
                            'day')) {
                        this.invalidJob = false;
                    } else {
                        this.invalidJob = true;
                    }
                    this.paramsList['country'] = this.accountService
                        .getSpaceToDashLowerCase(res['selectedJobs']['countryCountry']);
                    this.paramsList['city-name'] = this.accountService
                        .getSpaceToDashLowerCase(res['selectedJobs']['city']);
                    this.paramsList['sector_name'] = this.accountService
                        .getSpaceToDashLowerCase(res['selectedJobs']['sector']);
                    this.paramsList['jobTitle-id'] = this.accountService
                        .getSpaceToDashLowerCase(res['selectedJobs']['title']) + '-' +
                        res['selectedJobs']['id'];

                    /*
                    Redirect old url to new urls
                     */

                    let redirectUrl = this.accountService.getCurrLangUrl() +
                        this.accountService.getPath() + '/' + this.paramsList['country'] + '/jobs/'
                        + this.paramsList['city-name'] + '/' + this.paramsList['sector_name'] + '/'
                        + this.paramsList['jobTitle-id'];
                    this._router.navigate([redirectUrl], { queryParams: params });

                    /**
                     * Creating Date format for SEO description
                     */
                    let post_date = moment(res['selectedJobs'].createdDate)
                        .format('DD MMM, YYYY');

                    this.accountService
                        .setImageSeo(res['selectedJobs']['companyObj']['profileImage']);
                    this.accountService.setPageDynamicSeo([res['selectedJobs']['title'] +
                        ' Vacancy in ' + res['selectedJobs']['city'] + ', ' +
                        res['selectedJobs']['countryCountry'] + ' with ' +
                        res['selectedJobs']['companyObj']['name']], true,
                        'New vacancy for ' + res['selectedJobs']['title'] +
                        ' added on ' + post_date + ' based in ' + res['selectedJobs']['city'] + ', '
                        + res['selectedJobs']['countryCountry'] + ' with ' +
                        res['selectedJobs']['companyObj']['name'] + ' - Apply today!');
                    this.jobUrl$.next(jobPublicUrl);

                    if (res['selectedJobs']['title']) {
                        this.jobUrltitle$.next(res['selectedJobs']['title']
                            .replace(/[^a-zA-Z ]/g, ''));
                    }
                    if (res['selectedJobs']['companyObj']['name']) {
                        this.jobUrlDesc$.next(res['selectedJobs']['companyObj']['name']
                            .replace(/[^a-zA-Z ]/g, ''));
                    }

                    res['selectedJobs']['ageRange'] = this.fixedTextHash['any'][this.currLan];
                    if (res['selectedJobs']['ageFrom'] && res['selectedJobs']['ageTo']) {
                        res['selectedJobs']['ageRange'] = res['selectedJobs']['ageFrom'] + ' - ' + res['selectedJobs']['ageTo'];
                    }
                    res['selectedJobs']['nationality'] = this.fixedTextHash['all'][this.currLan];
                    if (res['selectedJobs']['nationialities']) {
                        let nationalityArry = res['selectedJobs']['nationialities'];
                        let nationality;
                        if (nationalityArry.length <= this.maxNationalities) {
                            nationalityArry.forEach(element => {
                                if (nationality) {
                                    nationality += ', ' + element['name'];
                                }
                                else {
                                    nationality = element['name'];
                                }
                            });
                            res['selectedJobs']['nationality'] = nationality;
                        }                        
                    }

                    this.jobUrlImg$.next(ConfigService.shareImage);

                    this.selJob = res['selectedJobs'];
                    this.selJob$.next(this.selJob);
                    this.similarJobClick = false;
                    this.addScript(this.selJob);

                }, (error) => {
                    this._errorService.errorHandling(error);
                });

        });

        if (!this.isPublic && this.screenwidth > this.windowSizeDivider) {

            this._jobservice.getSimilarCareers(this.jobId)
                .subscribe((res) => {
                    this.similarCompanies = res['similar_companies']['similarCompanies'];
                    this.similarCompanies$.next(this.similarCompanies);
                    this.similarJob$.next(res['similar_jobs']['similarJobs']);

                });

        }
    }

    public getJobUrl(url) {

        if (!this.similarJobClick) {
            this.similarJobClick = true;
            this._router.navigate([url]);

        }
    }

    public ngOnInit() {
        this.accountService.setSwitchFlag(false);
        this.currLan = this.accountService.getCurrLang();
        if (this.currLan == 'ar') {
            this.genderHash = this.genderHashAr;
        }
        this.screenwidth = window.innerWidth;
        this.sub = this._activeRoute.params.subscribe((params) => {
            this.isAuthorized$.next(this.accountService.getAuth());
            this.isPublic = !this.accountService.getAuth();
            this.getFixParams(params);
            this.showAnimate = false;
            this.showRank = false;
            this.showRankSpinner = false;

            if (params['jobTitle-id']) {
                let paramList = params['jobTitle-id'].split('-');
                this.jobId = +paramList[paramList.length - 1];
                this._loadDate();
            } else if (params['id']) {
                this.jobId = params['id'];
                this.paramsList['jobTitle-id'] =
                    this.accountService.getSpaceToDashLowerCase(params['jobTitle'])
                    + '-' + params['id'];
                this._loadDate();

            }
        });

    }

    public getFixParams(params) {
        this.paramsList['city-name'] = (params['city-name']) ? params['city-name'] : null;
        this.paramsList['country'] = (params['country']) ? params['country'] : null;
        this.paramsList['sector_name'] = (params['sector_name']) ? params['sector_name'] : null;
        this.paramsList['jobTitle-id'] = (params['jobTitle-id']) ? params['jobTitle-id'] : null;
    }

    public getRank() {

        this.showRank = true;
        this.showRankSpinner = true;
        if (this.isEmpty(this.probabilityRankList)) {
            this.getProbalilityRankList();
        } else {
            this.setRank(this.probabilityRankList);
        }

    }

    public getProbalilityRankList() {
        this._jobservice.getJobseekerProbabilitySuccess(this.jobId).subscribe((val) => {
            this.setRank(val);
        });
    }

    public setRank(val) {
        this.probabilityRankList = val;
        this.showRankSpinner = false;
        this.rank = val['response']['rank'];
    }

    public isEmpty(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    public showAnimation(classname, val = 1) {

        this.showSpinner = true;
        if (this.isEmpty(this.probabilityRankList)) {
            this._jobservice.getJobseekerProbabilitySuccess(this.jobId).subscribe((val) => {
                this.probabilityRankList = val;
                this.setAnimation(val, classname);
            });
        } else {
            this.setAnimation(this.probabilityRankList, classname);
        }

    }

    public getEmptySalaryValidation() {
        return (this.showNonDiscloseSalary) ? this.fixedTextHash['not_disclosed'][this.currLan] :
            'N/A';
    }

    private setAnimation(val, classname) {
        this.showAnimate = true;

        if (val['response']['probability']) {
            this.showSpinner = false;
            let c4 = jQuery(classname);
            c4.circleProgress({
                startAngle: -Math.PI / 6 * 3,
                value: (val['response']['probability'] / 100),
                thickness: 5,
                lineCap: 'round',
                fill: {
                    gradient: [ConfigService.SPINNER_COLOR_ONE, ConfigService.SPINNER_COLOR_TWO]
                }
            }).on('circle-animation-progress', function (event, progress, stepValue) {
                jQuery(this).find('strong').html((100 * stepValue).toFixed(1) + '<i>%</i>');
            });

            setTimeout(function () {
                c4.circleProgress('value', 0.7);
            }, 1000);
            setTimeout(function () {
                c4.circleProgress('value', 1.0);
            }, 1100);
            setTimeout(function () {
                c4.circleProgress('value', (val['response']['probability'] / 100));
            }, 2100);

        }
    }

    public createReffererUrl() {
        var loginUrl = this.accountService.getCurrLangUrl() + this.accountService.getPath() + '/login';
        this._router.navigateByUrl(loginUrl + "?reffererUrl=" + window.location.pathname);
    }
}
