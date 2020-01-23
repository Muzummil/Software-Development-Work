import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { AccountService } from '../../core/account/services/account.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';
import { BasicValidators } from '../../shared/validators/basicValidators';


let moment = require('moment-timezone');
let DetectRTC = require('detectrtc');
declare var jQuery: any;

declare var Intl: any;
declare var navigator: any;

@Component({

    selector: 'video-interview',
    templateUrl: 'interview.component.html',
    styleUrls: ['./interview.scss']

})

export class InterviewComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('messageBox') messageBox: any;
    public host = this.getUrlParameterByName('host', 'prod.vidyo.io');
    public token = this.getUrlParameterByName('token');
    public vidyoConnector;
    public isLoading = true;
    public isConnected = false;
    public isShowVideo = false;
    public isInterviewCompleted = false;
    public isVideoIntialized = false;
    public videoHeaderName = '';
    public isWorking = false;
    public isGotToken = false;
    public isConnectionError = false;
    public muteCamera = false;
    public muteMic = false;
    public hasError: boolean = false;
    public errorMessage = '';
    public errorMessageHash;
    public successMessage;
    public infoMessage;
    public isSuccess = false;
    public messages = [];
    public currentUserId;
    public isChatOpened: boolean = true;
    public interviewId;
    public applicationId;
    public interviewDetails;
    public activeRouterObs;
    public activeparams;
    public connectionCount = 0;
    public isCallNear = false;
    public pausedInterview = false;
    public currentUserName = '';
    public appointTimeCorrectZone;
    public browserSupportFlag: boolean = true;
    public remoteTerminate: boolean = false;
    public vcDetails;
    public vcDetailsSet: boolean = false;

    // Refresh every 15 sec if interview is not active
    public refreshTimer = Observable.interval(15000);
    public refreshTimerHandle = null;
    public browserTimeZone = '';

    // Forms
    public chatForm: FormGroup;

    public roomId;
    public user = {
        id: '',
        key: 'user_key',
        name: 'user_name_replaces_here',
        roomId: 'demoRoom',
        token: 'token_replaces_here'
    };
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public fb: FormBuilder,
                public accountService: AccountService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute) {

        this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // this.browserSupportFlag = DetectRTC.isWebRTCSupported;
        this.accountService.setSwitchFlag(false);
        this.currLan = this.accountService.getCurrLang();
        this.errorMessageHash = {invalid_interview:
                this.fixedTextHash['sorry_request_does_not_exist'][this.currLan]};
        this.infoMessage = this.fixedTextHash['interview_portal_active_in_ten'][this.currLan];

        this.activeparams = this.activeRouterObs = this._activeRoute.params
            .subscribe((selparams) => {

                this.applicationId = selparams['application_id'] || 80205;
                this.interviewId = selparams['interview_id'] || 65;

            });
        this.browserSupportFlag = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            (navigator.mediaDevices ? navigator.mediaDevices.getUserMedia : undefined));
    }

    public ngAfterViewInit() {
        this.loadVidyoClientLibrary();
    }

    public reloadPage() {
        window.location.reload(false);
    }

    public closeBox() {
        jQuery('.end-interview').modal('hide');
    }

    public currentTimeCloseToInterview() {
        if (this.interviewDetails['interview'] && this.interviewDetails.interview.appointment
            && this.interviewDetails.interview.time_zone) {

            let appointmentSplit = this.interviewDetails.interview.appointment.split('T');
            let appointmentTimeSplit = appointmentSplit[1].split('.');

            let time_diff = moment.tz(appointmentSplit[0] + ' ' + appointmentTimeSplit[0],
                this.interviewDetails.interview.time_zone)
                .diff(moment.tz(this.interviewDetails.interview.time_zone), 'minutes');
            this.isCallNear = (time_diff < 10.0) && (time_diff >
                (-1 * this.interviewDetails.interview.duration));

            if (!this.refreshTimerHandle && !this.isCallNear) {
                // Auto Refresh
                this.refreshTimerHandle = this.refreshTimer.subscribe((val) => {
                    this.currentTimeCloseToInterview();
                });
            }
            if (this.refreshTimerHandle && this.isCallNear) {
                this.stopRefresh();
            }

        }

    }

    public stopRefresh() {
        if (this.refreshTimerHandle) {
            this.refreshTimerHandle.unsubscribe();
        }
    }

    public getInterviewDetails() {

        this.accountService.getInterviewDetails(this.applicationId, this.interviewId)
            .subscribe((interviewDetails) => {
                if (interviewDetails == null) {
                    this.getErrorHandler(this.errorMessageHash['invalid_interview']);
                } else {
                    this.listenEvent();
                    this.interviewDetails = interviewDetails;
                    let appointmentSplit = this.interviewDetails.interview.appointment.split('T');
                    let appointmentTimeSplit = appointmentSplit[1].split('.');
                    this.appointTimeCorrectZone = moment.tz(appointmentSplit[0] + ' ' +
                        appointmentTimeSplit[0],
                        this.interviewDetails.interview.time_zone);
                    this.setVideoHeader();
                    this.isLoading = false;
                }

                this.currentTimeCloseToInterview();

            }, (error) => {
                this.getErrorHandler(this.errorMessageHash['invalid_interview']);

            });
    }

    public unsetError() {
        this.hasError = false;
        this.errorMessage = '';
    }

    public getErrorHandler(error) {
        this.hasError = true;
        this.errorMessage = error;
    }

    public generateToken() {

        this.infoMessage = '';
        this.accountService.getvidyoToken(this.applicationId, this.interviewId).subscribe((res) => {
            if (res['interview']) {
                this.currentUserId = this.user.id = res['interview']['calls'][0].user.id;
                this.user.name = res['interview']['calls'][0].user.first_name +
                    ' ' + res['interview']['calls'][0].user.last_name;
                this.user.key = (this.accountService.getCheckEmployer()) ?
                    'company-' + res['interview']['calls'][0].user.id : 'jobseeker-' +
                    res['interview']['calls'][0].user.id;
                this.user.token = res['interview']['calls'][0].token;
                this.user.roomId = res['interview']['calls'][0].room;
                Observable.of(1).delay(500).subscribe((res) => {
                    this.connectVidyo();
                });
                this.isGotToken = true;
            }
        }, (error) => {
            // Invalid Token messages should be shown as info messages
            this.infoMessage = error.error.error;
        });
        this.isGotToken = true;

    }

    public getCheckPartnerOnline() {
        return this.currentUserName != this.videoHeaderName;
    }

    public setVideoHeader() {
        this.videoHeaderName = this.getCurrentUserName();
    }

    public getCurrentUserName() {
        if (!this.accountService.getCheckEmployer()) {
            this.currentUserName = this.getJobSeekerName();
        } else {
            this.currentUserName = this.getEmployerName();
        }

        return this.currentUserName;
    }

    public getEmployerName() {
        return this.interviewDetails['interview']['employer']['first_name'] + ' ' +
            this.interviewDetails['interview']['employer']['last_name'];
    }

    public getJobSeekerName() {
        return this.interviewDetails['interview']['jobseeker']['first_name'] + ' ' +
            this.interviewDetails['interview']['jobseeker']['last_name'];
    }

    public listenEvent() {
        document.addEventListener('vidyoclient:ready', (e) => {
            this.vcDetails = e['detail']['VC'];
            this.vcDetailsSet = true;
            // this.renderVideo(e['detail']['VC']);
        });
    }

    public toggleCamera() {
        this.muteCamera = this.muteCamera ? false : true;
        this.vidyoConnector.SetCameraPrivacy({
            privacy: this.muteCamera
        });

    }

    public toggleMic() {
        this.muteMic = this.muteMic ? false : true;
        this.vidyoConnector.SetMicrophonePrivacy({privacy: this.muteMic});
    }

    public toggleConnect() {
        this.isWorking = this.isWorking ? false : true;
        if (this.isWorking) {
            this.connectVidyo();
        } else {
            this.disconnectVidyo();
        }
    }

    public makeConnection() {
        this.isWorking = true;
        this.connectVidyo();
    }

    public openChatWindow() {
        this.isChatOpened = true;
    }

    public renderVideo(VC) {
        VC.CreateVidyoConnector({
            viewId: 'renderer',                            // Div ID where the composited video will be rendered, see VidyoConnector.html
            viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default', // Visual style of the composited renderer
            remoteParticipants: 5,                        // Maximum number of participants
            logFileFilter: 'warning all@VidyoConnector info@VidyoClient',
            logFileName: '',
            userData: ''
        }).then((vidyoConnector) => {
            console.log('Create VIDEO IS SUCCESSFULL');
            this.successMessage = 'Create VIDEO IS SUCCESSFULL';
            this.isLoading = false;
            this.isVideoIntialized = true;
            this.isSuccess = true;
            this.hasError = false;
            this.vidyoConnector = vidyoConnector;
            this.registerDevices();
            this.generateToken();
        }).catch(() => {
            console.error('CreateVidyoConnector Failed');
            this.getErrorHandler('CreateVidyoConnector Failed');
            this.isSuccess = false;
            this.isConnectionError = true;
            this.isLoading = false;
        });

    }

    public registerDevices() {
        // Adding codes to register for devices
        this.vidyoConnector.RegisterLocalCameraEventListener({
            onAdded: function (localCamera) {
            },
            onRemoved: function (localCamera) {
            },
            onSelected: function (localCamera) {
            },
            onStateUpdated: function (localCamera, state) {
            }
        }).then(function () {
            console.log('RegisterLocalCameraEventListener Success');
        }).catch(function () {
            console.error('RegisterLocalCameraEventListener Failed');
        });

        this.vidyoConnector.RegisterLocalMicrophoneEventListener({
            onAdded: function (localMicrophone) {
            },
            onRemoved: function (localMicrophone) {
            },
            onSelected: function (localMicrophone) {
            },
            onStateUpdated: function (localMicrophone, state) {
            }
        }).then(function () {
            console.log('RegisterLocalMicrophoneEventListener Success');
        }).catch(function () {
            console.error('RegisterLocalMicrophoneEventListener Failed');
        });

        this.vidyoConnector.RegisterLocalSpeakerEventListener({
            onAdded: function (localSpeaker) {
            },
            onRemoved: function (localSpeaker) {
            },
            onSelected: function (localSpeaker) {
            },
            onStateUpdated: function (localSpeaker, state) {
            }
        }).then(function () {
            console.log('RegisterLocalSpeakerEventListener Success');
        }).catch(function () {
            console.error('RegisterLocalSpeakerEventListener Failed');
        });
    }

    public disconnectVidyo() {
        this.vidyoConnector.Disconnect();
        this.isConnected = false;
    }

    public endInterview() {
        if (this.accountService.getCheckEmployer()) {
            this.disconnectRemote();
        }
        this.disconnectVidyo();
        this.isShowVideo = false;
        this.isInterviewCompleted = true;

        this.releaseResource();

    }

    public scrollToBottom() {

        let objDiv = this.messageBox.nativeElement;
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    public joinInterview() {
        if (!this.browserSupportFlag || !this.vcDetailsSet || this.hasError || !this.isCallNear) {
            return;
        }
        this.renderVideo(this.vcDetails);
        this.isShowVideo = true;
    }

    public releaseResource() {

        if (this.vidyoConnector) {
            this.vidyoConnector.SelectLocalCamera({localCamera: null});
            this.vidyoConnector.SelectLocalMicrophone({localMicrophone: null});
            this.vidyoConnector.SelectLocalSpeaker({localSpeaker: null});
            this.vidyoConnector.Destruct();
        }

    }

    public connectVidyo() {
        this.isLoading = true;
        this.roomId = this.user.roomId || 'demoRoom';
        this.vidyoConnector.Connect({
            host: 'prod.vidyo.io',
            token: this.user.token,
            displayName: this.user.name,
            resourceId: this.user.roomId,

            onSuccess: () => {
                this.connectionCount++;
                this.successMessage = 'Connected SUCCESSFULL';
                this.isSuccess = true;
                this.isConnected = true;
                this.isLoading = false;
                this.hasError = false;

            },
            onFailure: (reason) => {
                // Failed
                this.isConnectionError = true;
                this.isSuccess = false;
                this.isLoading = false;
                this.getErrorHandler(reason);
                this.errorMessage = reason;
            },
            onDisconnected: (reason) => {
                // Disconnected
                this.isConnected = false;
                this.isSuccess = false;
                this.isLoading = false;
                this.getErrorHandler(reason);
            }
        }).then((status) => {

            if (status) {
                this.handlePaticipants();
                this.receiveMessage();
            } else {
                this.isConnectionError = true;
                this.getErrorHandler('ConnectCall Failed');
                this.isSuccess = false;
            }
        }).catch(() => {
            this.isConnectionError = true;
            this.isLoading = false;
            this.getErrorHandler('ConnectCall Failed');
            this.isSuccess = false;
        });
    }

    public receiveMessage() {
        let that = this;

        this.vidyoConnector.RegisterMessageEventListener({
            onChatMessageReceived: function (participant, chatMessage) {

                /* Message received from other participant */
                let chatMessageJson = JSON.parse(chatMessage.body);
                if (chatMessageJson['control'] === 'disconnect') {
                    that.remoteTerminate = true;
                    that.endInterview();
                } else {
                    that.openChatWindow();
                    if (that.user.name !== chatMessageJson.name) {
                        that.updateMessageList(chatMessageJson);
                    }
                }
            }
        }).then(() => {
            console.log('RegisterParticipantEventListener Success');
        }).catch(() => {
            console.error('RegisterParticipantEventListener Failed');
        });
    }

    public loadVidyoClientLibrary() {
        let webrtc = true;
        let plugin = false;

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'vidyoClientId';
        script.src = 'https://static.vidyo.io/latest/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&webrtc=' + webrtc + '&plugin=' + plugin;
        document.getElementsByTagName('head')[0].appendChild(script);

    }

    public getUrlParameterByName(name, _default = '') {
        let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || _default;
    }

    public ngOnInit(): void {
        window.scroll(0, 0);

        this.getInterviewDetails();
        let chatElements = {
            message_string: ['', Validators.compose(
                [Validators.required, Validators.minLength(1),
                    Validators.maxLength(1500), BasicValidators.noSpecialChars])]
        };

        this.chatForm = this.fb.group(chatElements);

    }

    public sendChatMessage() {

        if (this.chatForm.valid && this.isConnected && this.getCheckPartnerOnline()) {

            let message = '{"id":"' + this.user.id + '","name":"' + this.user.name + '","content":"'
                + this.chatForm.value.message_string
                + '","control":"chat","date": "'
                + new Date() + '"}';
            this.vidyoConnector.SendChatMessage({message});
            this.updateMessageList(JSON.parse(message));
            this.chatForm.reset();
        }

    }

    public disconnectRemote() {
        let message = '{"id":"","name":"","content":"Disconnect","control":"disconnect","date": "'
            + new Date() + '"}';
        this.vidyoConnector.SendChatMessage({message});

    }

    public toggleChat() {
        this.isChatOpened = (this.isChatOpened) ? false : true;
    }

    public handlePaticipants() {

        let that = this;
        this.vidyoConnector.RegisterParticipantEventListener(
            {
                onJoined: function (participant) {
                    /* Participant Joined */
                    that.videoHeaderName = participant.name;
                },
                onLeft: function (participant) {
                    /* Participant Left */
                    that.setVideoHeader();
                },
                onDynamicChanged: function (participants) { /* Ordered array of participants according to rank */
                },
                onLoudestChanged: function (participant, audioOnly) { /* Current loudest speaker */
                }
            }).then(function () {
            console.log('RegisterParticipantEventListener Success');
        }).catch(function () {
            console.error('RegisterParticipantEventListener Failed');
        });

    }

    public updateMessageList(message) {
        this.isChatOpened = true;
        this.messages.push(message);
        this.scrollToBottom();
    }

    public ngOnDestroy() {
        this.activeparams.unsubscribe();
        this.releaseResource();
        this.removeClientJs();
    }

    public removeClientJs() {
        // Removing vidyo client js
        let elem = document.getElementById('vidyoClientId');
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    }
}
