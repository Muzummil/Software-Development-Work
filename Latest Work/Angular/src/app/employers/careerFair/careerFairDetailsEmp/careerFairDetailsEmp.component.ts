import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
// directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CareerFairService } from '../../../core/services/careerFair.service';
declare var jQuery: any;

@Component({
    selector: 'career-fair-employer-details',
    templateUrl: 'careerFairDetailsEmp.component.html',
    styleUrls: ['./careerFairDetailsEmp.scss']
})

export class CareerFairDetailsEmpComponent implements OnInit, OnDestroy {

    public form1: FormGroup;
    public queryParamsObs;
    public errorFlag: boolean = false;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public selCareerFair = {};
    public errrorMessage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);
    public carrerFairId;
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public deletionSpinner$: BehaviorSubject<any> = new BehaviorSubject(null);
    public deletionError$: BehaviorSubject<any> = new BehaviorSubject(null);
    public deletionSuccess$: BehaviorSubject<any> = new BehaviorSubject(null);
    public gotApplicants$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalApplicants$: BehaviorSubject<any> = new BehaviorSubject(null);
    public careerFairApplicants: any;
    public showSpinner: boolean = false;
    public isPublic: boolean = true;
    public url: string = "";
    public queryParams: any;
    public activeParams: any;
    public page = 1;
    public genderObject = { '1':"Male",'2':"Female"}
    constructor(public accountService: AccountService,
        public _activeRoute: ActivatedRoute,
        public careerFairService: CareerFairService,
        public fb: FormBuilder,
        public _router: Router,
        public loaderService: LoaderService) {
            
        this.accountService.setPageSeo('careerFair');
        this.accountService.setSwitchFlag(false);
        this.url = this._router.url;
    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
        this.showSpinner = true;
        // URL Params Fetch
        this.activeParams = this._activeRoute.params.subscribe((params) => {
            this.queryParams = this._activeRoute.queryParams.subscribe((qparams) => {
                if (params['CareerFairTitle-id']) {
                    let paramList = params['CareerFairTitle-id'].split('-');
                    if(paramList[paramList.length - 1]==NaN){
                        let id = paramList[paramList.length - 1].split('?');
                        this.carrerFairId = id[0];
                    }else{
                        this.carrerFairId = +paramList[paramList.length - 1];
                    }
                    this.page = (qparams['page']) ? qparams['page'] : 1;
                    this.getData();
                }
            });

        });
    }
    getData(){
        if(this.carrerFairId){
            this.careerFairService.getCareerFairDetails(this.carrerFairId).subscribe((res) => {
                this.showSpinner = false;
                this.selCareerFair = res['career_fair'];
            },(error)=>{
                this.showSpinner = false;
                this._router.navigate(['employer/career-fairs']);
            });
            this.getCareerFairApplicants();
        }
    }
    public ngOnDestroy(): void {
        this.queryParams.unsubscribe();
        this.activeParams.unsubscribe();
    }
    public getCareerFairApplicants() {

        this.showSpinner = true;
        this.careerFairService.getCareerFairApplicants(this.carrerFairId, this.page).subscribe(res => {
            this.careerFairApplicants = res.career_fair_applications;
            if (this.careerFairApplicants.length > 0) {
                this.gotApplicants$.next(true);
            } else {
                this.gotApplicants$.next(false);
            }
            this.totalApplicants$.next(res.meta.total_count);
            this.showSpinner = false;
        }, (error) => {
            this.showSpinner = false;
            this.gotApplicants$.next(false);
        })
    }

    public onApplyCareerFair() {
        this.careerFairService.getJoinCareerFair(this.carrerFairId).subscribe((res) => {
            this.selCareerFair['applied_date'] = res['career_fair_application']['applied_date'];
            jQuery('.apply-career-fair').modal('hide');
        });
    }
    public createReffererUrl() {
        let loginUrl = this.accountService.getCurrLangUrl() + this.accountService.getPath()
            + '/login';
        loginUrl = loginUrl.replace(/([^:]\/)\/+/g, '$1');
        this._router.navigateByUrl(loginUrl + '?reffererUrl=' + window.location.pathname);
    }
    public deleteFair() {
        if (this.selCareerFair) {
            this.deletionSpinner$.next(true);
            this.careerFairService.deleteCareerFair(this.selCareerFair['id']).subscribe(res => {
                this.deletionSuccess$.next(true);
                this.deletionSpinner$.next(false);
                setTimeout(() => {
                    this.deletionSuccess$.next(false);
                    jQuery("#deletefair").modal('hide');
                    this._router.navigate(['employer/career-fairs']);
                }, 1000);
            }, (error) => {
                this.deletionSpinner$.next(false);
                this.deletionError$.next(true);
                setTimeout(() => {
                    jQuery("#deletefair").modal('hide');
                }, 1000);
            })
        }
    }

    public goBack() {
        window.history.back();
    }

}
