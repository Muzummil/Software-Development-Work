import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Components
import { CropperSettings } from 'ng2-img-cropper/src/cropperSettings';
import { ImageCropperComponent } from 'ng2-img-cropper/src/imageCropperComponent';
import { LoaderService } from '../services/loader.service';
import { AccountService } from '../../core/account/services/account.service';

declare var jQuery: any;

@Component({

    selector: 'build-file',
    templateUrl: 'buildFileUpload.component.html'

})


export class BuildFileUploadComponent implements OnInit {

    @Input() popupClass = 'custom_popup';
    @Input() custromfileInfo = {};

    @Output() selectedFile = new EventEmitter();

    public videoDurationSec = 31;
    public tagetFile: any = null;
    public targetFileBase64: any;
    public cropperSettings: CropperSettings;
    public dataCropAvatar: any = {};
    public selectImageDone$: BehaviorSubject<any> = new BehaviorSubject(false);
    public errorFileString$: BehaviorSubject<any> = new BehaviorSubject(null);
    public errorFile$: BehaviorSubject<any> = new BehaviorSubject(null);

    public signupThirdForm: FormGroup;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    @ViewChild('cropperAvatar', undefined) cropperAvatar: ImageCropperComponent;

    // Mode normal or cropper
    public modesHash = {normal: 'normal', cropper: 'cropper'};

    public fileInfo: any = {
        size: 2,
        format_list: ['image/jpeg', 'image/png'],
        title: 'profile_pic',
        sizeUnit: 'MB',
        mode: this.modesHash['cropper'],
        fileExtentions: ['.png, .jpg, .jpeg']
    };

    constructor(public _fb: FormBuilder,
                public loaderService: LoaderService,
                public accountService: AccountService) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        // 780x340
        this.cropperSettings.width = 190;
        this.cropperSettings.height = 230;

        this.cropperSettings.croppedWidth = 500;
        this.cropperSettings.croppedHeight = 500;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;

        this.dataCropAvatar = {};
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        for (let key in this.custromfileInfo) {

            if (this.custromfileInfo.hasOwnProperty(key)) {
                this.fileInfo[key] = this.custromfileInfo[key];
            }
        }

        this.signupThirdForm = this._fb.group({
            avatar: [''],
            cover: ['']
        });
    }

    public getValidateVideo(tagetFile) {
        let that = this;
        let vid = document.createElement('video');
        let fileURL = URL.createObjectURL(tagetFile);
        vid.src = fileURL;
        vid.ondurationchange = function () {
            if (this['duration'] > that.videoDurationSec) {
                that.errorFileString$
                    .next('Sorry! Your video should not be more than 30 seconds.' +
                        'Please record it again.');
                that.errorFile$.next(true);

            } else {
                that.errorFileString$.next(null);
                that.errorFile$.next(false);
            }
        };
    }

    public fileChange(event) {
        this.selectImageDone$.next(true);
        let image: any = new Image();

        this.tagetFile = event.target.files[0];

        // this.tagetFile[select_type] = event.target.files[0];
        let file: Blob = event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropperAvatar.setImage(image);
            that.errorFileString$.next(null);
            that.errorFile$.next(false);
        };

        myReader.readAsDataURL(file);
    }

    public createImage(event) {
        this.tagetFile = event.target.files[0];

        this.getValidateVideo(this.tagetFile);
        let file: Blob = event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onload = function (loadEvent: any) {
            that.targetFileBase64 = loadEvent.target.result;
            that.errorFileString$.next(null);
            that.errorFile$.next(false);
        };

        myReader.readAsDataURL(file);
    }

    public selectImage() {
        if (this.fileInfo.mode === this.modesHash['normal']) {
            this.selectedFile.emit({file: this.targetFileBase64});
        } else if (this.fileInfo.mode === this.modesHash['cropper']) {
            this.selectedFile.emit({file: this.dataCropAvatar.image});
        }
    }


}