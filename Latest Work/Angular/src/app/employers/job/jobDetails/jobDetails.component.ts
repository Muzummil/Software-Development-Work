import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CompanyService } from '../../../core/services/company.service';
import { ErrorHandling } from '../../../core/services/errorHandling.service';
import { ConfigService } from '../../../shared/config.service';

var moment = require('moment');
declare var jQuery: any;

@Component({
    selector: 'employer-jobs-details',
    templateUrl: 'jobDetails.component.html',
    styleUrls: ['./jobDetails.scss']
})


export class JobsDetailsComponent implements OnInit {

    public loadedData: boolean = false;
    public activeRouteHolder;
    public joburl$: BehaviorSubject<any> = new BehaviorSubject(null);
    public selJobObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public selJobAnalysisObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public genderHash = { 'male': 'Male', 'female': 'Female', null: 'Any', '': 'Any' };
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public showNonDiscloseSalary = (ConfigService.SHOW_NON_DISCLOSE_SALARY === 'true'); 3
    public maxNationalities = 5;

    constructor(public accountService: AccountService,
        public loaderService: LoaderService,
        public _fb: FormBuilder,
        public _companyService: CompanyService,
        public _errorService: ErrorHandling,
        public _activeRoute: ActivatedRoute,
        public _router: Router) {

        this.accountService.setSwitchFlag(false);

    }
    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();

        this.activeRouteHolder = this._activeRoute.params.subscribe((selParams) => {
            window.scrollTo(0, 0);
            this.loadedData = true;
            let jobId;
            if (selParams['id']) {
                jobId = +selParams['id'];
            } else if (selParams['jobTitle-id']) {
                let paramList = selParams['jobTitle-id'].split('-');

                jobId = +paramList[paramList.length - 1];
            }

            this.getJobDetails(jobId);
        });

        this.loadedData = true;
    }

    public getIfExpired(endDate) {
        return moment(new Date()).isAfter(Date.parse(endDate));
    }

    public getJobDetails(jobId: number) {
        if (jobId > this._companyService.indeed_uk_fix) {
            jobId -= this._companyService.indeed_uk_fix;
        } else if (jobId > this._companyService.indeed_kuwait_fix) {
            jobId -= this._companyService.indeed_kuwait_fix;
        } else if (jobId > this._companyService.indeed_saudi_fix) {
            jobId -= this._companyService.indeed_saudi_fix;
        }

        this._companyService.getCompanyJob(jobId).subscribe((res) => {
            res['job']['ageRange'] = this.fixedTextHash['any'][this.currLan];
            if (res['job']['age_group'] && res['job']['age_group']['min_age'] && res['job']['age_group']['max_age']) {
                res['job']['ageRange'] = res['job']['age_group']['min_age'] + ' - ' + res['job']['age_group']['max_age'];
            }
            res['job']['nationality'] = this.fixedTextHash['all'][this.currLan];
            if (res['job']['geo_countries']) {
                let nationalityArry = res['job']['geo_countries'];
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
                    res['job']['nationality'] = nationality;
                }
            }
            
            this.selJobObs.next(res['job']);
            if (res['job'].city && res['job'].country) {
                this.joburl$.next(ConfigService.getDomain() +
                    this.accountService.getSpaceToDashLowerCase(res['job'].country.name)
                    + '/jobs/' + this.accountService
                        .getSpaceToDashLowerCase(res['job'].city.name) + '/' +
                    this.accountService.getSpaceToDashLowerCase(res['job'].sector.name)
                    + '/' + this.accountService
                        .getSpaceToDashLowerCase(res['job'].title) + '-' +
                    res['job']['id']);

                this.accountService
                    .setImageSeo(res['job']['company']['avatar']);
                this.accountService.setPageDynamicSeo([res['job']['title'] +
                    ' Vacancy in ' + res['job']['city']['name'] + ', ' +
                    res['job']['country']['name'] + ' with ' +
                    res['job']['company']['name']], true,
                    'New vacancy for ' + res['job']['title'] +
                    ' added on ' + res['job']['created_at'] + ' based in ' +
                    res['job']['city']['name'] + ', '
                    + res['job']['country']['name'] + ' with ' +
                    res['job']['company']['name'] + ' - Apply today!');
            }
        },
            (error) => {
                this._errorService.errorHandling(error);
            });
        this._companyService.getCompanyJobAnalysis(jobId).subscribe((res) => {

            this.selJobAnalysisObs.next(res['job_application_analysis']);
        },
            (error) => {
                this._errorService.errorHandling(error);
            });


    }

    public onBack() {
        this.accountService.backClick();
    }

    public getEmptySalaryValidation() {
        return (this.showNonDiscloseSalary) ? this.fixedTextHash['not_disclosed'][this.currLan] :
            'N/A';
    }

}
