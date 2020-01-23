import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// services
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { StatsService } from '../../core/services/stats.service';

// Model
import { JobGraphs } from '../../jobseekers/job/models/Job';

require('../../../assets/local_modules/d3.min');
require('../../../assets/local_modules/topojson.min');

let Datamap = require('datamaps/dist/datamaps.world.min.js');

@Component({
    selector: 'stats-employer',
    templateUrl: 'stats.component.html',
    styleUrls: ['./stats.scss']
})

export class StatsComponent implements OnInit, OnDestroy {

    public companyId: number = null;
    public companyStats$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobsStats$: BehaviorSubject<any> = new BehaviorSubject(null);
    public graphStats$: BehaviorSubject<any> = new BehaviorSubject(null);
    public malePercent: number = 0;
    public femalePercent: number = 0;
    public totalJobViews: number = 0;
    public totalJobApplication: number = 0;
    public totalJobInterviews: number = 0;
    public totalJobShortlisted: number = 0;
    public totalJobSuccessful: number = 0;
    public total_cost_to_hire: number = 0;
    public total_days_to_hire: number = 0;

    public jobApplicantStatsByMonth = [];
    public jobApplicantStatsByQuarter = [];
    public jobApplicantStatsByYear = [];

    public jobStatsByMonth = [];
    public jobStatsByQuarter = [];
    public jobStatsByYear = [];

    public maxCountJobsMonthly = 0;
    public maxCountJobsQuarterly = 0;
    public maxCountJobsYearly = 0;

    public maxCountJobApplicantsMonthly = 0;
    public maxCountJobApplicantsQuarterly = 0;
    public maxCountJobApplicantsYearly = 0;

    public jobGraph = null;
    public viewMode = 'general';
    public activeRouterObs;
    public activeRouter2Obs;
    public candidateSearchCount = 0;
    public candidateSearchList = [];

    public isLoadingS: boolean = false;
    public isLoadingG: boolean = false;
    public algoliaError: boolean = false;
    public isLoadingAlgolia: boolean = false;
    public isLoadingC: boolean = false;
    public isLoadingA: boolean = false;
    public isLoadingE: boolean = false;
    public isLoadingN: boolean = false;
    public isLoadingBars: boolean = false;
    public isLoadingPieC: boolean = false;
    public isLoadingPieA: boolean = false;
    public isLoadingfollowers: boolean = false;
    public jobApplicationChartType = 'none';
    public jobChartType = 'monthly';
    public dataForMap = {};
    public showMoreKeywords: boolean = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public sumOfKeywords=0;

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public _statsService: StatsService,
                public _activeRoute: ActivatedRoute) {

        if (this.companyId == null) {
            this.companyId = this.accountService.getCompanyId();
        }
        this.accountService.setSwitchFlag(false);
    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
        this.accountService.setCustomSeo();
        this.isLoadingS = true;
        this.isLoadingC = true;
        this.isLoadingN = true;
        this.isLoadingE = true;
        this.isLoadingA = true;
        this.isLoadingBars = true;
        this.isLoadingPieC = true;
        this.isLoadingPieA = true;
        this.isLoadingfollowers = true;
        this.isLoadingAlgolia = true;
        this.algoliaError = true;
        this.getCadidateSearchStats(5);

        this.activeRouter2Obs = this._activeRoute.params.subscribe((selParams) => {
            window.scrollTo(0, 0);
            this.viewMode = 'general';
            if (selParams['statsmode'] === 'applicants-by-country') {
                this.viewMode = 'country';
            }
            if (selParams['statsmode'] === 'applicants-by-sector') {
                this.viewMode = 'sector';
            }
        });

        this._statsService.getCompanyGraphStats(this.accountService.getCompanyId())
            .subscribe((res) => {
            this.companyStats$.next(res);

            this.maxCountJobsMonthly = Math.max(...res['jobs_graph']['monthly'][1]);
            this.maxCountJobsQuarterly = Math.max(...res['jobs_graph']['quarterly'][1]);
            this.maxCountJobsYearly = Math.max(...res['jobs_graph']['yearly'][1]);

            this.jobStatsByMonth = res['jobs_graph']['monthly'];
            this.jobStatsByQuarter = res['jobs_graph']['quarterly'];
            this.jobStatsByYear = res['jobs_graph']['yearly'];

            this.isLoadingBars = false;
        }, (error) => {
            this.accountService.getErrorCheck(error);
        });

        this._statsService.getJobApplicantStats(this.accountService.getCompanyId())
            .subscribe((res) => {

            this.totalJobViews =
                res['job_applicants_graph']['counter_jobs_applicant_details']['total_job_views'];
            this.totalJobApplication = res['job_applicants_graph']['counter_jobs_applicant_details']
                ['total_job_applicants'];
            this.totalJobInterviews = res['job_applicants_graph']['counter_jobs_applicant_details']
                ['total_job_applicants_shortlisted'];
            this.totalJobShortlisted = res['job_applicants_graph']
                ['counter_jobs_applicant_details']['total_job_applicants_interviewed'];
            this.totalJobSuccessful = res['job_applicants_graph']
                ['counter_jobs_applicant_details']['total_job_applicants_successful'];
            this.total_cost_to_hire = res['job_applicants_graph']
                ['counter_jobs_applicant_details']['total_cost_to_hire'];
            this.total_days_to_hire = res['job_applicants_graph']
                ['counter_jobs_applicant_details']['total_days_to_hire'];

            this.maxCountJobApplicantsMonthly =
                Math.max(...res['job_applicants_graph']['monthly'][1]);
            this.maxCountJobApplicantsQuarterly =
                Math.max(...res['job_applicants_graph']['quarterly'][1]);
            this.maxCountJobApplicantsYearly =
                Math.max(...res['job_applicants_graph']['yearly'][1]);

            this.jobApplicantStatsByMonth = res['job_applicants_graph']['monthly'];
            this.jobApplicantStatsByQuarter = res['job_applicants_graph']['quarterly'];
            this.jobApplicantStatsByYear = res['job_applicants_graph']['yearly'];

            this.isLoadingBars = false;
        }, (error) => {
            this.accountService.getErrorCheck(error);
        });

        this._statsService
            .getCompanyJobStats(this.accountService.getCompanyId()).subscribe((res) => {

            let countryCodes = require('../../../data/country-code.json');
            res['job_applications'].job_applications_by_country.forEach((obj) => {
                this.dataForMap[countryCodes[obj['iso']]] = {fillKey: 'hasViewed'};
            });

            this.jobsStats$.next(res);
            if (res['job_applications']['job_applications_by_country']) {
                this.isLoadingC = false;
            }
            if (res['job_applications']['job_applications_by_nationality']) {
                this.isLoadingN = false;
            }
            if (res['job_applications']['job_applications_by_sector']) {
                this.isLoadingS = false;
            }
            if (res['job_applications']['job_applications_by_age_group']) {
                this.isLoadingA = false;
            }
            if (res['job_applications']['job_applications_by_education']) {
                this.isLoadingE = false;
            }
            // Gender Stats
            if (res['job_applications']['job_applications_by_gender']) {

                // tslint:disable-next-line:no-empty
                res['job_applications']['job_applications_by_gender'].forEach((selGender) => {
                    if (selGender['name'] === 'male') {
                        this.malePercent = selGender['percentage'];
                    }
                    if (selGender['name'] === 'female') {
                        this.femalePercent = selGender['percentage'];
                    }
                });
            }

            this.build_map();

        }, (error) => {
            this.accountService.getErrorCheck(error);
        });

        this._statsService
            .getCompanyFollowersPercentageStats(this.accountService.getCompanyId())
            .subscribe((res) => {
            this.graphStats$.next(res);
            this.isLoadingPieC = false;
            this.isLoadingPieA = false;
            this.isLoadingfollowers = false;
            this.jobGraph = this._getBuildCharts(res['followers']['followers_by_country'],
                res['followers']['followers_by_age'], res['followers']['followers_by_nationality']);
        }, (error) => {
            this.accountService.getErrorCheck(error);
        });
    }

    public getCadidateSearchStats(searchCount = 10) {
        window.scroll(0, 0);
        this.sumOfKeywords = 0;
        this.candidateSearchList = [];
        this.isLoadingAlgolia = true;
        this.algoliaError = false;
        this.accountService.getCandidateSearchCount().subscribe((resCandidateCount) => {

                this.accountService.getTopCandidateSearches(searchCount).subscribe(
                    (res) => {
                        this.setAlgoliaCadidatedetails(resCandidateCount, res);
                        this.isLoadingAlgolia = false;
                        this.algoliaError = false;
                    },
                    (error) => {
                        this.isLoadingAlgolia = false;
                        this.algoliaError = true;

                    });
            },
            (error) => {
                // For Non Production Environments load static
                this.isLoadingAlgolia = false;
                let resCandidateCount = require('../../../data/algolia-jobseeker-count.json');
                let res = require('../../../data/algolia-jobseekers.json');

                this.setAlgoliaCadidatedetails(resCandidateCount, res);
            });
    }



    public setAlgoliaCadidatedetails(resCandidateCount, res) {
        this.candidateSearchCount = resCandidateCount['count'];
        if (res['searches']) {
            // Country Empty Searches
            let nonEmptySearchList = res['searches'].filter((selVal) => {
                return (selVal['search'].replace(/\\"|\["|"]/g, '') !== ''); });
            // New Count
            let newCount = 0;
            nonEmptySearchList.forEach((selVal) => { newCount += selVal.count; });
            // Calculating new search Count

            res['searches'].forEach((selSearch) => {
                if (selSearch['search'].replace(/\\"|\["|"]/g, '') !== '') {
                    this.sumOfKeywords += selSearch['count'];
                }
            });
            // console.log(res['searches']);
            res['searches'].forEach((selSearch) => {
                if (selSearch['search'].replace(/\\"|\["|"]/g, '') !== '') {
                    this.candidateSearchList.push(
                        {
                            name: (selSearch['search'] === '') ? '' :
                            selSearch['search'].replace(/\\"|\["|"]/g, ''),
                            percent: selSearch['count']/this.sumOfKeywords * 100
                        });
                    }
            });
            // console.log(this.sumOfKeywords);
        }
    }

    public build_map() {
        new Datamap({
            element: document.getElementById('map_container'),
            geographyConfig: {
                highlightOnHover: false,
                popupOnHover: false
            },
            projection: 'mercator',
            fills: {
                defaultFill: '#f1f1f1',
                hasViewed: '#4AB6E6'
            },
            data: this.dataForMap
        });
    }

    public ngOnDestroy() {
        this.activeRouter2Obs.unsubscribe();
    }

    public _getBuildCharts(country, age, nationality) {

        let jobGraphs1 = new JobGraphs();
        jobGraphs1.mainLabel = 'By Country';
        jobGraphs1.options = {colors: ['#0b4882', '#1560a8', '#2c6cb5', '#3379bd', '#f1f1f1']};
        jobGraphs1.data = Array(['Heading', '']);
        let cnt1 = 0;

        country.labels.forEach((sel) => {

            jobGraphs1.data.push([sel, country.data[cnt1]]);
            cnt1++;
        });

        let jobGraphs2 = new JobGraphs();
        jobGraphs2.mainLabel = 'By Age';
        jobGraphs2.options = {colors: ['#0b4882', '#1560a8', '#2c6cb5', '#3379bd', '#f1f1f1']};
        jobGraphs2.data = Array(['Heading', '']);
        let cnt2 = 0;
        age.labels.forEach((sel) => {

            jobGraphs2.data.push([sel, age.data[cnt2]]);
            cnt2++;

        });

        let jobGraphs3 = new JobGraphs();
        jobGraphs3.mainLabel = 'By Nationality';
        jobGraphs3.options = {colors: ['#0b4882', '#1560a8', '#2c6cb5', '#3379bd', '#f1f1f1']};
        jobGraphs3.data = Array(['Heading', '']);
        let cnt3 = 0;
        nationality.labels.forEach((sel) => {

            jobGraphs3.data.push([sel, nationality.data[cnt3]]);
            cnt3++;
        });

        return {country: jobGraphs1, age: jobGraphs2, nationality: jobGraphs3};
    }

}
