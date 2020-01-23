import { OnInit, Component, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
// directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../shared/config.service';
import { CareerFairService } from '../../../core/services/careerFair.service';
import {
    DateValidator,
    ExpLessThanValidator,
    TypeValidators
} from '../../../shared/validators/basicValidators';
import { File } from '../../../shared/models/File';
import { CropperSettings } from 'ng2-img-cropper';
import { City } from '../../../shared/models/City';
declare var jQuery: any;
let moment = require('moment');

@Component({
    selector: 'career-fair-add-edit',
    templateUrl: 'careerFairAddEdit.component.html',
    styleUrls: ['./careerFairAddEdit.scss']
})

export class CareerFairAddEditComponent implements OnInit, OnDestroy, AfterViewInit {

    public form1: FormGroup;
    public queryParamsObs;
    public errorFlag: boolean = false;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public selCareerFair = {};
    public errrorMessage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);
    public carrerFairId = null;
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public isPublic: boolean = true;
    public showSpinner = false;
    public careerFairForm: FormGroup;
    public cityObj: City = new City();
    public genderList;
    public loadDatePicker = false;
    public genderIdMapper = {any: 0 , male: 1, female: 2};
    public countryList;
    public cropperSettings: CropperSettings;
    public custromfileInfo = {
        size: 2,
        format_list: ['image/jpeg', 'image/png'],
        title: 'career_fair',
        sizeUnit: 'MB',
        mode: 'normal',
        fileExtentions: ['.png, .jpg, .jpeg']
    };
    public processRequest = false;
    public dataCropAvatar: any = {};
    public avatarImage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public startDate;
    public endDate;
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    // public selectedFromDate:any;
    public selectedFromDate:any = moment()._d;
    public minEndDate = moment();
    public ShowEndDate: boolean = true;

    constructor(public accountService: AccountService,
                public _activeRoute: ActivatedRoute,
                public careerFairService: CareerFairService,
                public cdr: ChangeDetectorRef,
                public fb: FormBuilder,
                public _router: Router,
                public loaderService: LoaderService) {

        this.accountService.setPageSeo('careerFair');

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        // Dimensions for image cropping
        this.cropperSettings.width = 190;
        this.cropperSettings.height = 230;

        this.cropperSettings.croppedWidth = 500;
        this.cropperSettings.croppedHeight = 500;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;

        this.careerFairForm = this.fb.group({
            id: [null],
            logo_image: [''],
            title: ['', Validators.required],
            address: ['', Validators.required],
            city_id: ['', Validators.required],
            country_id: ['', Validators.required],
            gender: ['', Validators.required],
            active: ['true', Validators.required],
            from: ['', Validators.required],
            to: ['', Validators.required],
        });

    }

    public ngOnDestroy() {
        if (this.queryParamsObs) {
            this.queryParamsObs.unsubscribe();
        }
    }

    public ngOnInit(): void {
        this.showSpinner = true;
        this.currLan = this.accountService.getCurrLang();
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.genderList = this.loaderService.getGender();
                let country = this.loaderService.getCountries('alphabetical', true);
                this.countryList = {countries: country};
                // URL Params Fetch
                this._activeRoute.params.subscribe((params) => {
                    this.isAuthorized$.next(this.accountService.getAuth());
                    this.isPublic = !this.accountService.getAuth();
                    this.carrerFairId =  params['id'];
                    if (params['id']) {
                        this.careerFairService.getCareerFairDetails( this.carrerFairId)
                            .subscribe((res) => {
                            this.showSpinner = false;
                            this.selCareerFair = res['career_fair'];
                            this.getFormCareerFair(res['career_fair']);
                        });
                    } else {
                        this.showSpinner = false;
                    }

                });
            }
        });

    }

    public getFormCareerFair(res) {
        this.careerFairForm.controls['title'].setValue(res.title);
        this.careerFairForm.controls['address'].setValue(res.address);
        this.careerFairForm.controls['country_id'].setValue(res.country.id);
        this.careerFairForm.controls['city_id'].setValue(res.city.id);
        this.careerFairForm.controls['gender'].setValue(res.gender);
        this.careerFairForm.controls['from'].setValue(res.from);
        this.careerFairForm.controls['to'].setValue(res.to);
        this.careerFairForm.controls['active'].setValue((res.active) ? 'true' : 'false');
        this.careerFairForm.controls['logo_image'].setValue(res.logo_image);
        this.cityObj = res.city;
        this.cityObj.text = res.city.name;
        this.startDate = res.from;
        this.endDate = res.to;
        this.cdr.detectChanges();
    }

    public getSelectCountry($event) {
        this.careerFairForm.controls['country_id'].setValue($event.id);
        this.careerFairForm.controls['city_id'].setValue('');
    }

    public addEditCareer() {

        this.pristineFlag$.next(false);
        if (this.careerFairForm.valid &&  !this.processRequest) {
            this.processRequest = true;
            this.showSpinner = true;
            this.careerFairForm.controls['gender'].setValue(this.genderIdMapper[this.careerFairForm.controls['gender'].value])
           if (this.carrerFairId) {
               this.careerFairService.updateCareerFair(this.carrerFairId,
                   this.careerFairForm.value)
                   .subscribe((res) => {
                    this.processRequest = false;
                    this.showSpinner = false;
                    this._router.navigate([this.accountService.getCurrLangUrl()+this.accountService.getPath()+'/career-fairs']);
                   },(error)=>{
                        this.showSpinner = false;                   
                   });
           } else {
               this.careerFairService.createCareerFair(this.careerFairForm.value)
                   .subscribe((res) => {
                    this.showSpinner = false;
                    this.processRequest = false;
                    this._router.navigate([this.accountService.getCurrLangUrl()+this.accountService.getPath()+'/career-fairs']);
                   },(error)=>{
                        this.showSpinner = false;
                   });
           }

        }
    }

    // Loading image.
    public loadFiles($event) {
        this.avatarImage$.next($event.file);
        this.careerFairForm.controls['logo_image'].setValue($event.file);
    }

    // back button
    public goBack() {
        window.history.back();
    }

    public selectStartDate(obj) {
        this.startDate = obj.value;
    }

    public selectEndDate(obj) {
        this.endDate = obj.value;

    }

    // To Set End Date Value
    public setEndDate(event) {
        this.selectedFromDate = moment(event.selDate)._d;
        this.endDate =  this.careerFairForm.controls['to'].value;
        this.ShowEndDate = false;
        this.minEndDate = moment(event.selDate, 'D MMM, YYYY')._d;
        setTimeout(() => { this.ShowEndDate = true}, 100);

        let from = new Date(this.careerFairForm.value.from);
        let to = new Date(this.careerFairForm.value.to);
        if (from > to) {
            this.careerFairForm.value.to = null;
            this.careerFairForm.controls['to'].setValue(null);
            this.endDate = null;
        }
    }

    public ngAfterViewInit() {
        // this.cdr.detectChanges();
    }

}
