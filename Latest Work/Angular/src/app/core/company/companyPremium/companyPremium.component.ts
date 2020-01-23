import {
    Component, OnInit, Input, EventEmitter, Output, AfterViewChecked, ViewChild,
    ElementRef, OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// validations
import { BasicValidators } from '../../../shared/validators/basicValidators';

// Models
import { City } from '../../../shared/models/City';
import { File } from '../../../shared/models/File';
import { CompanyPicture } from '../../../shared/models/Company';

// Services
import { CompanyService } from '../../../core/services/company.service';
import { ConfigService } from '../../../shared/config.service';
import { AccountService } from '../../../core/account/services/account.service';
import { ErrorHandling } from '../../../core/services/errorHandling.service';
import { LoaderService } from '../../../shared/services/loader.service';

let moment = require('moment');
require('dm-file-uploader');

declare var jQuery;

// Import Slider
require('jssor-slider');
declare var $JssorSlider$: any;
declare var $Jssor$: any;
declare var $Jease$: any;
declare var $JssorSlideshowRunner$: any;
declare var $JssorArrowNavigator$: any;
declare var $JssorThumbnailNavigator$: any;

@Component({
    selector: 'company-premium',
    templateUrl: 'companyPremium.component.html',
    styleUrls: ['./companyPremium.scss']
})

export class CompanyPremiumComponent implements OnInit, AfterViewChecked, OnDestroy {

    @Input() companyId: number = null;
    @Input() fromPage: string;
    @Input() editMode: boolean = false;

    @Output() backClick = new EventEmitter();

    @ViewChild('video1') video1: ElementRef;
    @ViewChild('video2') video2: ElementRef;
    // Forms
    public profileForm: FormGroup;
    public contactForm: FormGroup;
    public establishmentForm: FormGroup;
    public employerTypeForm: FormGroup;
    public employerGenderForm: FormGroup;
    public classificationForm: FormGroup;
    public aboutForm: FormGroup;
    public isPublic: boolean = false;
    public isEmployer: boolean = false;

    // Variables
    public followers: number;
    public company: any;
    public team: any;
    public jobs: any;
    public cultures: any;
    public queryParamsObs: any;
    public companyObj;
    public type_id = null;
    public size_id = null;
    public classification_id = null;
    public summary;
    public addressLine;
    public establishmentDate;
    public tabletScreen = ConfigService.tabletScreen;

    public canEditCompany: boolean = false;
    public video;
    public btn;
    public sector_id = null;
    public countryList;
    public typeList;
    public sizesList;
    public classificationsList;
    public phoneNo;
    public contact_country_id = null;
    public contact_country_name = null;
    public cityObj: City = new City();
    public lat;
    public lng;

    // Observable
    public commonData$: BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public mainPicUpdatedObs: BehaviorSubject<any> = new BehaviorSubject(false);
    public companyDetails$: Observable<any>;
    public sectors$: BehaviorSubject<any> = new BehaviorSubject(null);
    public typeList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sizesList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public classificationsList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobs$: Observable<any>;
    public folowers$: Observable<number>;
    public url$: BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public companyObj$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectorsList;
    public locationOffice$: Observable<any>;
    public logoUpdated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public coverUpdated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public pristineAboutFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public companyCultureObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public companyTeamObs: BehaviorSubject<any> = new BehaviorSubject(null);

    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);

    // Flags
    public loadingFlagsArray = [];

    public seoDesc =
        'Search for jobs and vacancies at [company_name]. Learn more about the company and' +
        'Apply for a job online directly.';

    public companyCulture;
    public companyAnalytics;
    public maxCountJobsMonthly = 0;

    public fileMainList = [];
    public file_profile: File;
    public file_cover: File;
    public fileNew;
    public percentUpload = 0;
    public companyTeam;

    // Show Hide Flags
    public viewProfileFlag: boolean = true;
    public viewCoverFlag: boolean = true;
    public viewContactFlag: boolean = true;
    public viewEstablishmentFlag: boolean = true;
    public viewEmployerCountFlag: boolean = true;
    public viewEmployerTypeFlag: boolean = true;
    public viewClassificationFlag: boolean = true;
    public viewAboutCompanyFlag: boolean = true;
    public viewPhotoGalleryFlag: boolean = true;
    public sliderRenderedFlag: boolean = true;
    public showpercentUploadFlag: boolean = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public screenwidth = 0;
    public mobileScreen = ConfigService.mobileScreen;
    public postHash = {
        company_name: 'name',
        facebook: 'facebook_page_url',
        linked_in: 'linkedin_page_url',
        twitter: 'twitter_page_url',
        google_plus: 'google_plus_page_url',
        sector_id: 'sector_id',
        contact_country_id: 'current_country_id',
        contact_city_id: 'current_city_id',
        phone_no: 'phone',
        address_line1: 'address_line1',
        address_line2: 'address_line2',
        website_url: 'website',
        po_box: 'po_box',
        latitude: 'latitude',
        longitude: 'longitude',
        email_address: 'contact_email',
        establishment_date: 'establishment_date',
        type_id: 'company_type_id',
        female_employees: 'total_female_employees',
        male_employees: 'total_male_employees',
        classification_id: 'company_classification_id',
        summary: 'summary',
        total_employees: 'total_employees'
    };

    constructor(public companyService: CompanyService,
                public loaderService: LoaderService,
                public fb: FormBuilder,
                public accountService: AccountService,
                public router: Router,
                public location: Location,
                public error: ErrorHandling) {

        this.location = location;
        this.loadingFlagsArray['companyLoader'] = true;

        this.file_profile = new File(this.fixedTextHash['upload_profile_image'][this.currLan],
            'profile', 'PNG, JPG', 3, 'MB');
        this.file_profile.classMap = 'myprofile';
        this.file_profile.root = 'company[avatar]';
        this.file_profile.cropperSettings_croppedWidth = 172;
        this.file_profile.cropperSettings_croppedHeight = 172;
        this.file_profile.cropperSettings_width = 172;
        this.file_profile.cropperSettings_height = 172;

        this.file_cover = new File(this.fixedTextHash['upload_cover_image'][this.currLan],
            'company_cover', 'PNG, JPG, WMV, MP4, MOV and WEBM',
            5, 'MB');
        this.file_cover.file_format_list = ['video/x-msvideo', 'video/avi', 'video/quicktime',
            'video/3gpp', 'video/x-ms-wmv', 'video/mp4', 'video/webm', 'video/x-la-asf',
            'video/x-ms-asf', 'image/jpeg', 'image/png'];

        this.file_cover.classMap = 'mycover';
        this.file_cover.root = 'company[cover]';

        this.accountService.setSwitchFlag(false);
        this.currLan = this.accountService.getCurrLang();
        this.screenwidth = window.innerWidth;

    }

    public getProcessedPhoneNo($event) {

        this.getTouch();
        if ($event.match === 'phone_no') {
            this.contactForm.controls['phone_no']['_value'] = $event.phone_no;
            this.phoneNo = $event.phone_no;
        }

    }

    public onDeleteCultureMember(id, index) {

        this.companyService.getDeleteCultureMember(this.companyId,
            this.companyCultureObs.value[index]['id']).subscribe((res) => {

            this.companyCultureObs.next(res);
            jQuery('.close_delete').modal('hide');

        });

    }

    public getCoOrdinates(mode = 3, customAddress = '') {
        let addressUrl = '';

        if (mode === 0) {
            addressUrl = customAddress;
        }
        if (mode === 1) {
            addressUrl = this.contact_country_name;
        }
        if (mode === 2) {
            addressUrl = this.cityObj.name + '+' + this.contact_country_name;
        }
        if (mode === 3) {
            addressUrl = this.contactForm.controls['address_line1'].value + '+' +
                this.contactForm.controls['address_line2'].value + '+' +
                this.contactForm.controls['po_box'].value + '+' +
                this.cityObj.name + '+' + this.contact_country_name;
        }

        this.companyService.getGoogleCoOrdinates(addressUrl).subscribe((res) => {
            if (res['results'].length > 0) {

                this.lat = res['results'][0].geometry.location.lat;
                this.lng = res['results'][0].geometry.location.lng;

                this.buildGoogleURL();
            }
        });
    }

    public onSelectCountry($event) {
        this.contact_country_id = $event.id;
        this.contact_country_name = $event.name;

        this.cityObj.id = null;
        this.cityObj.text = null;
        this.cityObj.name = null;
        this.cityObj.country_id = null;
        this.getCoOrdinates(1);

    }

    public getAverage(genderCount, totalCount) {
        return ( totalCount > 0 ) ? (genderCount * 100) / (totalCount) : 0;
    }

    public onSave(formName, viewFlag) {
        this.pristineAboutFlag$.next(false);
        let postData = {company: {}};
        if (this[formName + 'Form'].valid) {
            for (let key in this[formName + 'Form'].controls) {
                if (this[formName + 'Form'].controls.hasOwnProperty(key)) {
                    if (this.postHash[key]) {
                        postData['company'][this.postHash[key]] =
                            this[formName + 'Form'].controls[key].value;
                    }

                }
            }

            this.companyService.updateCompanyDetails(this.companyId, postData)
                .subscribe((res) => {

                    this.getSetCompany(res);
                    this[viewFlag] = true;

                },
                (error) => {
                    this.accountService.getErrorCheck(error);
                });
        }

    }

    public buildGoogleURL(coordinates = null, type = 'lng') {

        if (coordinates != null) {
            this.locationOffice$ = Observable.of({});
            this.locationOffice$['lat'] = (type === 'lat') ? coordinates : this.lat;
            this.locationOffice$['long'] = (type === 'lng') ? coordinates : this.lng;

            this.lat = (type === 'lat') ? coordinates : this.lat;
            this.lng = (type === 'lng') ? coordinates : this.lng;
            this.locationOffice$['google_url'] = 'https://www.google.com/maps/embed/v1/place?q=' +
                this.lat + ',' + this.lng + '&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';
        } else if (this.lat && this.lng) {
            this.locationOffice$ = Observable.of({});
            this.locationOffice$['lat'] = this.lat;
            this.locationOffice$['long'] = this.lng;
            this.locationOffice$['google_url'] = 'https://www.google.com/maps/embed/v1/place?q=' +
                this.lat + ',' + this.lng + '&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';
        } else {
            this.locationOffice$ = Observable.of({});
            this.locationOffice$['lat'] = this.lat;
            this.locationOffice$['long'] = this.lng;
            this.locationOffice$['google_url'] = 'https://www.google.com/maps/embed/v1/place?q=' +
                this.lat + ',' + this.lng + '&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';

        }
    }

    public ngAfterViewChecked(): void {
        if (!this.sliderRenderedFlag && this.viewPhotoGalleryFlag && this.companyObj$.value &&
            this.companyObj$.value.isPremium && this.companyCultureObs.value
            && this.companyCultureObs.value.length > 0) {
            this.getbuildSlider();
        }

    }

    public geBuildDropUpload() {

        let that = this;
        this.accountService.getAuthKey();
        Observable.of(1).delay(1000)
            .subscribe((x) => {

                jQuery('#drag-and-drop-zone').dmUploader({ //
                    url: ConfigService.getAPI() + 'companies/' + this.companyId + '/cultures/',
                    headers: {
                        Authorization: that.accountService.getAuthKey()
                    },
                    extraData: {
                        'culture[title]': 'Watch'
                    },
                    fieldName: 'culture[avatar]',
                    maxFileSize: 3000000, // 3 Megs
                    multiple: true,
                    dnd: true,
                    auto: true,
                    extFilter: ['jpg', 'jpeg', 'png'],
                    onDragEnter: function () {
                        // Happens when dragging something over the DnD area
                        // this.addClass('active');
                    },
                    onDragLeave: function () {
                        // Happens when dragging something OUT of the DnD area
                        // this.removeClass('active');
                    },
                    onInit: function () {
                        // Plugin is ready to use
                    },
                    onComplete: function () {
                        // All files in the queue are processed (success or error)
                    },
                    onNewFile: function (id, file) {
                        // When a new file is added using the file selector or the DnD area

                    },
                    onBeforeUpload: function (id) {
                        // about tho start uploading a file
                        that.showpercentUploadFlag = true;
                    },
                    onUploadProgress: function (id, percent) {
                        // Updating file progress
                        that.percentUpload = percent;
                    },
                    onUploadSuccess: function (id, data) {
                        // A file was successfully uploaded
                        that.showpercentUploadFlag = false;

                        let picture = new CompanyPicture();
                        picture.id = data['culture']['id'];
                        picture.name = data['culture']['title'];
                        picture.description = data['culture']['title'];
                        picture.image_url = data['culture']['avatar'];
                        picture.image_thumb_url = data['culture']['avatar'];
                        that.companyCultureObs.value.unshift(picture);

                    },
                    onUploadError: function (id, xhr, status, message) {
                        // Happens when an upload error happens
                    },
                    onFallbackMode: function () {
                        // When the browser doesn't support this plugin :(
                    },
                    onFileSizeError: function (file) {
                    }
                });
            });

    }

    public getbuildSlider() {

        this.sliderRenderedFlag = true;
        let jssor_1_SlideshowTransitions = [
            {
                $Duration: 1200,
                x: 0.3,
                $During: {$Left: [0.3, 0.7]},
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: -0.3,
                $SlideOut: true,
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: -0.3,
                $During: {$Left: [0.3, 0.7]},
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.3,
                $SlideOut: true,
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: 0.3,
                $During: {$Top: [0.3, 0.7]},
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: -0.3,
                $SlideOut: true,
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: -0.3,
                $During: {$Top: [0.3, 0.7]},
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: 0.3,
                $SlideOut: true,
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.3,
                $Cols: 2,
                $During: {$Left: [0.3, 0.7]},
                $ChessMode: {$Column: 3},
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.3,
                $Cols: 2,
                $SlideOut: true,
                $ChessMode: {$Column: 3},
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: 0.3,
                $Rows: 2,
                $During: {$Top: [0.3, 0.7]},
                $ChessMode: {$Row: 12},
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: 0.3,
                $Rows: 2,
                $SlideOut: true,
                $ChessMode: {$Row: 12},
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: 0.3,
                $Cols: 2,
                $During: {$Top: [0.3, 0.7]},
                $ChessMode: {$Column: 12},
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                y: -0.3,
                $Cols: 2,
                $SlideOut: true,
                $ChessMode: {$Column: 12},
                $Easing: {$Top: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.3,
                $Rows: 2,
                $During: {$Left: [0.3, 0.7]},
                $ChessMode: {$Row: 3},
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: -0.3,
                $Rows: 2,
                $SlideOut: true,
                $ChessMode: {$Row: 3},
                $Easing: {$Left: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.3,
                y: 0.3,
                $Cols: 2,
                $Rows: 2,
                $During: {$Left: [0.3, 0.7], $Top: [0.3, 0.7]},
                $ChessMode: {$Column: 3, $Row: 12},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Opacity: $Jease$.$Linear
                },
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.3,
                y: 0.3,
                $Cols: 2,
                $Rows: 2,
                $During: {$Left: [0.3, 0.7], $Top: [0.3, 0.7]},
                $SlideOut: true,
                $ChessMode: {$Column: 3, $Row: 12},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Opacity: $Jease$.$Linear
                },
                $Opacity: 2
            },
            {
                $Duration: 1200,
                $Delay: 20,
                $Clip: 3,
                $Assembly: 260,
                $Easing: {$Clip: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                $Delay: 20,
                $Clip: 3,
                $SlideOut: true,
                $Assembly: 260,
                $Easing: {$Clip: $Jease$.$OutCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                $Delay: 20,
                $Clip: 12,
                $Assembly: 260,
                $Easing: {$Clip: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                $Delay: 20,
                $Clip: 12,
                $SlideOut: true,
                $Assembly: 260,
                $Easing: {$Clip: $Jease$.$OutCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            }
        ];

        let jssor_1_options = {
            $AutoPlay: 1,
            $SlideshowOptions: {
                $Class: $JssorSlideshowRunner$,
                $Transitions: jssor_1_SlideshowTransitions,
                $TransitionsOrder: 1
            },
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$
            },
            $ThumbnailNavigatorOptions: {
                $Class: $JssorThumbnailNavigator$,
                $SpacingX: 5,
                $SpacingY: 5
            }
        };

        let jssor_1_slider = new $JssorSlider$('jssor_1', jssor_1_options);

        /*#region responsive code begin*/

        let MAX_WIDTH = 1920;

        function ScaleSlider() {
            let containerElement = jssor_1_slider.$Elmt.parentNode;
            let containerWidth = containerElement.clientWidth;

            if (containerWidth) {

                let expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);

                jssor_1_slider.$ScaleWidth(expectedWidth);
            } else {
                window.setTimeout(ScaleSlider, 30);
            }
        }

        ScaleSlider();

        $Jssor$.$AddEvent(window, 'load', ScaleSlider);
        $Jssor$.$AddEvent(window, 'resize', ScaleSlider);
        $Jssor$.$AddEvent(window, 'orientationchange', ScaleSlider);
        /*#endregion responsive code end*/

    }

    public myFunction(myBtn, myVideo) {

        this.video = (myVideo === 'myVideo')
            ? this.video1.nativeElement : this.video2.nativeElement;
        this.btn = document.getElementById(myBtn);
        if (this.video.paused) {
            this.video.play();
            this.btn.innerHTML = '<i class=\"zmdi zmdi-pause-circle-outline\"></i>';
        } else {
            this.video.pause();
            this.btn.innerHTML = '<i class=\"zmdi zmdi-play-circle-outline\"></i>';
        }
    }

    public ngOnDestroy() {
        if (this.isPublic === false) {

            if (this.queryParamsObs) {
                this.queryParamsObs.unsubscribe();
            }

            jQuery('#drag-and-drop-zone').dmUploader('destroy');
        }
    }

    public getTouch() {
        this.pristineFlag$.next(false);
    }

    public setDate($event) {
        this.establishmentDate = $event['selDate'];
    }

    public onMainUploaded($event) {

        if ($event['result']['culture']) {

            let newCultureFlag = true;
            this.companyCultureObs.value.forEach((selval, selIndex) => {

                if (selval.id === $event['result']['culture']['id']) {
                    newCultureFlag = false;
                    this.companyCultureObs.value[selIndex]['image_url'] =
                        $event['result']['culture']['avatar'];
                    this.companyCultureObs.value[selIndex]['image_thumb_url'] =
                        $event['result']['culture']['avatar'];
                    this.companyCultureObs.value[selIndex]['name'] =
                        $event['result']['culture']['title'];

                }

                this.mainPicUpdatedObs.next(true);
            });

            if (newCultureFlag === true) {

                let picture = new CompanyPicture();
                picture.id = $event['result']['culture']['id'];
                picture.name = $event['result']['culture']['title'];
                picture.description = $event['result']['culture']['title'];
                picture.image_url = $event['result']['culture']['avatar'];
                picture.image_thumb_url = $event['result']['culture']['avatar'];
                this.companyCultureObs.value.unshift(picture);

            }

            this.buildAddNewFile();
            this.onBuildFileuploaders();

        }
    }

    public buildAddNewFile() {

        this.fileNew = new File( this.fixedTextHash['add_new_office_picture'][this.currLan],
            'profile', 'PNG, JPG', 3, 'MB');
        this.fileNew.classMap = 'newculture';
        this.fileNew.mode = 'company_culture';
        this.fileNew.formParams.push({title: 'title', value: '', placeholder: 'title'});
        this.fileNew.selId = '';
        this.fileNew.method = 'POST';
        this.fileNew.root = 'culture[avatar]';
        this.fileNew.rootTag = 'culture';
        this.fileNew.cropperSettings_croppedWidth = 860;
        this.fileNew.cropperSettings_croppedHeight = 635;
        this.fileNew.cropperSettings_width = 860;
        this.fileNew.cropperSettings_height = 635;

    }

    public onBuildFileuploaders() {
        this.buildAddNewFile();
        this.companyCultureObs.subscribe((res) => {
            if (res) {
                res.forEach((selteam, cultureIndex) => {
                    this.fileMainList[cultureIndex] =
                        new File(this.fixedTextHash['edit_office_picture'][this.currLan],
                        'profile', 'PNG, JPG', 3, 'MB');
                    this.fileMainList[cultureIndex].classMap = 'myculturemain' + cultureIndex;
                    this.fileMainList[cultureIndex].mode = 'company_culture';
                    this.fileMainList[cultureIndex].formParams.push({
                        title: 'title',
                        value: selteam['name']
                    });
                    this.fileMainList[cultureIndex].selId = selteam['id'];
                    this.fileMainList[cultureIndex].method = 'PUT';
                    this.fileMainList[cultureIndex].root = 'culture[avatar]';
                    this.fileMainList[cultureIndex].rootTag = 'culture';
                    this.fileMainList[cultureIndex].cropperSettings_croppedWidth = 860;
                    this.fileMainList[cultureIndex].cropperSettings_croppedHeight = 635;
                    this.fileMainList[cultureIndex].cropperSettings_width = 860;
                    this.fileMainList[cultureIndex].cropperSettings_height = 635;
                    this.fileMainList[cultureIndex].file_optional = true;

                });
            }

        });
    }

    public ngOnInit() {

        this.loader();
        window.scroll(0, 0);
        this.isPublic = !this.accountService.getAuth();
        this.isEmployer = this.accountService.getCheckEmployer();
        this.canEditCompany = this.accountService.getEditCompany();

        let loadEvent = Observable.of(this.companyId);
        this.loadingFlagsArray['companyLoader'] = true;

        this.companyService.getCompanyAnalytics(this.companyId).subscribe((res) => {
            this.companyAnalytics = res;
            this.maxCountJobsMonthly = Math.max(...res['monthly_jobs_posted'][1]);
        });

        this.companyService.getCompanyTeam(this.companyId).subscribe((res) => {
            this.companyTeam = res;
            this.companyTeamObs.next(this.companyTeam);
        });

        this.companyService.getCompanyCulture(this.companyId).subscribe((res) => {

            this.companyCulture = res;
            this.companyCultureObs.next(this.companyCulture);
            this.sliderRenderedFlag = false;
        });

        this.companyService.getCompanyDetails(this.companyId, this.isPublic)
            .subscribe((res) => {
                this.getSetCompany(res);
                this.onBuildFileuploaders();

        }, (error) => {
            this.error.errorHandling(error);
        });

    }

    public  getSetCompany(res) {
        if (!this.accountService.getCheckEmployer()) {
            this.router.navigate([this.accountService.getCurrLangUrl()
            + this.accountService.getPath() +
            '/companies/' + this.accountService.getSpaceToDashLowerCase(res['name']) +
            '-' + res['id']]);
        }
        this.loadingFlagsArray['companyLoader'] = false;
        this.isAuthorized$.next(this.accountService.getAuth());
        this.company = res;
        this.accountService.setSwitchFlag(false);
        /*
             Redirect old url to new url
             */

        if ((this.accountService.getAuth() && !this.accountService.getCheckEmployer())
            || !this.accountService.getAuth()) {

            let redirectUrl = this.accountService.getCurrLangUrl() +
                this.accountService.getPath() + '/companies/' +
                this.accountService.getSpaceToDashLowerCase(this.company['name']) + '-' +
                this.companyId;
            this.router.navigate([redirectUrl]);

        }

        this.companyDetails$ = Observable.of(this.company);
        this.followers = this.company.follower;
        this.folowers$ = Observable.of(this.followers);
        let canonicalFlag = true;

        /**
         * Replacing placeholder with company name
         */
        this.seoDesc = this.seoDesc.replace('[company_name]', this.company['name']);
        this.accountService.setPageDynamicSeo([this.company['name'] + ''],
            canonicalFlag, this.seoDesc);
        if (res['lat'] && res['long']) {
            this.locationOffice$ = Observable.of({});
            this.locationOffice$['lat'] = res['lat'];
            this.locationOffice$['long'] = res['long'];
            this.locationOffice$['google_url'] = 'https://www.google.com/maps/embed/v1/place?q=' +
                res['lat'] + ',' + res['long'] + '&key=AIzaSyARNR0nd7PxryzgmXmivhpfWCFvnNBQWT0';
        }
        this.getBuildForms(
            res);

        this.loadTwitterScript();
    }

    public getBuildForms(res) {
        this.getInitializer(res);

        this.sector_id = res['sectorId'];

        // Profile Form
        this.profileForm = this.fb.group({
            id: [res['id']],
            company_name: [res['name'], Validators.required],
            facebook: [res['facebookUrl'], BasicValidators.url],
            linked_in: [res['linkedInUrl'], BasicValidators.url],
            twitter: [res['twitterUrl'], BasicValidators.url],
            google_plus: [res['googlePlusUrl'], BasicValidators.url],
            sector_id: [res['sectorId'], Validators.required]
        });

        // Contact Form
        this.contactForm = this.fb.group({
            id: [res['id']],
            contact_country_id: [res['country']['id'], Validators.required],
            contact_city_id: [res['city']['id'], Validators.required],
            phone_no: [res['phoneNo'], [Validators.required, BasicValidators.phoneNo]],
            address_line1: [res['addressLine'], Validators.required],
            address_line2: [res['addressLine2']],
            website_url: [res['websiteUrl']],
            po_box: [res['poBox']],
            latitude: [res['lat'], Validators.required],
            longitude: [res['long'], Validators.required],
            email_address: [res['contactEmail'], BasicValidators.email]
        });

        // Establishment Form
        this.establishmentForm = this.fb.group({
            id: [res['id']],
            establishment_date: [res['establishmentDate']]
        });

        // Type Form
        this.employerTypeForm = this.fb.group({
            id: [res['id']],
            type_id: [res['companyTypeId']]
        });

        // Gender Form
        this.employerGenderForm = this.fb.group({
            id: [res['id']],
            male_employees: [res['maleCount']],
            female_employees: [res['femaleCount']]
        });

        // Classification Form
        this.classificationForm = this.fb.group({
            id: [res['id']],
            classification_id: [res['classificationId'], Validators.required]
        });

        this.aboutForm = this.fb.group({
            id: [res['id']],
            summary: [res['summary'], Validators.compose([
                Validators.required,
                Validators.minLength(30),
                Validators.maxLength(1800)
            ])]
        });

    }

    public  getInitializer(res) {
        this.companyObj = res;
        this.companyObj$.next(this.companyObj);
        this.contact_country_id = res['country']['id'];
        this.contact_country_name = res['country']['name'];
        this.cityObj.id = res['city']['id'];
        this.cityObj.text = res['city']['name'];
        this.cityObj.name = res['city']['name'];
        this.cityObj.country_id = this.contact_country_id;
        this.sector_id = res['sectorId'];
        this.type_id = res['companyTypeId'];
        this.size_id = res['companySizeId'];
        this.classification_id = res['classificationId'];
        this.lat = res['lat'];
        this.lng = res['long'];
        this.phoneNo = res['phoneNo'];
        this.summary = res['summary'];
        this.addressLine = res['addressLine'];
        this.establishmentDate = moment(res['establishmentDate']).format('D MMM, YYYY');

        if (res.profileImage) {
            this.logoUpdated$.next(true);
        } else {
            this.logoUpdated$.next(false);
        }

        if (res.coverImage) {
            this.coverUpdated$.next(true);
        } else {
            this.coverUpdated$.next(false);
        }

        if (!this.lat || !this.lng) {
            this.getCoOrdinates(0, this.cityObj.name + '+' + this.contact_country_name);
        } else {
            this.buildGoogleURL();
        }
    }

    public loader() {

        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.countryList = this.loaderService.getCountries('none');
                this.countryList = {countries: this.countryList};
                this.commonData$.next(this.countryList);

                let sectors = this.loaderService.getSectors('alpha');
                this.sectorsList = sectors;
                this.sectors$.next(this.sectorsList);

                this.typeList = this.loaderService.getCompanyTypes();
                this.typeList$.next(this.typeList);

                this.sizesList = this.loaderService.getCompanySizes();
                this.sizesList$.next(this.sizesList);

                this.classificationsList = this.loaderService.getCompanyTypesClassifications();
                this.classificationsList$.next(this.classificationsList);
            }
        });

    }

    public onClickBack() {
        this.accountService.backClick();
    }

    public onDeleteImage() {
        this.companyService.deleteProfileImage(this.companyId).subscribe((res) => {
            this.logoUpdated$.next(false);
            this.companyObj.profileImage = res['company'].avatar;
            this.companyObj$.next(this.companyObj);
            jQuery('.close_delete').modal('hide');
        });

    }

    public loadTwitterScript() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = 'https://platform.twitter.com/widgets.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    public onDeleteCoverImage() {
        this.companyService.deleteProfileCoverImage(this.companyId).subscribe((res) => {

            this.companyObj.coverImage = res['company'].cover;
            this.companyObj$.next(this.companyObj);
            this.coverUpdated$.next(false);
            jQuery('.close_delete').modal('hide');
        });

    }

    public onAvatarUploaded($event) {

        if ($event.result.company) {
            this.logoUpdated$.next(true);
            this.companyObj.profileImage = $event.result.company.avatar;
            this.companyObj$.next(this.companyObj);

        }

    }

    public onCoverUploaded($event) {

        if ($event.result.company) {
            this.coverUpdated$.next(true);
            this.companyObj.coverImage = $event.result.company.cover;
            this.companyObj.coverType = $event.result.company.cover_content_type;
            this.companyObj.coverScreenShot = $event.result.company.video_cover_screenshot;
            this.companyObj$.next(this.companyObj);

        }

    }

}
