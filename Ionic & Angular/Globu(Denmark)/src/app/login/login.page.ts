import { Component, OnInit, NgModule } from '@angular/core';
import { AuthService} from "../core/auth.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  loginpageFront: boolean = true;

  forgotEmail: string;

  signupForm: FormGroup;
  detailForm: FormGroup;

  userState;

  constructor(public toastController: ToastController, private alertCtrl: AlertController, public fb: FormBuilder, public auth: AuthService, private router:Router) { }

  ngOnInit() {
        if(localStorage.getItem("isLoggedIn")){
          this.router.navigate(['/home']);
        }
        // First Step
        this.signupForm = this.fb.group({
          'email': ['', [
            Validators.required,
            Validators.email
            ]
          ],
          'password': ['', [
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
            Validators.minLength(6),
            Validators.maxLength(25),
            Validators.required
            ]
          ],
          'region': ['', [
            ]
          ],
        });
    
        // Second Step
        this.detailForm = this.fb.group({
          'catchPhrase': ['', [ Validators.required ] ]
        });
  }

  //Using getters will make your code look pretty
  get email() {return this.signupForm.get('email')}
  get password() {return this.signupForm.get('password')}

  // Step 1
  signup() {
    return this.auth.emailSignUp(this.email.value, this.password.value)
  }

  async login() {
      this.auth.emailLogin2(this.email.value, this.password.value).subscribe(res=>{
        console.log(res);
        //you can add other validations
        if(res.user){
            localStorage.setItem("isLoggedIn","true");
            this.router.navigate(['/home']);
        }else{
            console.log("user is not logged in");
        }
      });
    // await this.auth.emailLogin(this.email.value, this.password.value);
    }

    async presentToast(forgotEmail: string) {
      const toast = await this.toastController.create({
        message: "Email sendt til " + forgotEmail,
        duration: 2000,
        position: "bottom"
      });
      toast.present();
    }
  

   async forgotpassword() {
      const alert = await this.alertCtrl.create({
        header: 'Nulstil kodeord',
        subHeader: 'Udsfyld venligst din email.' ,
        message: 'Der bliver sendt en email med nulstillingsguide.',
        inputs: [
          {
            name: 'email',
            type: 'text',
            placeholder: 'Din email',
            value: this.forgotEmail,
          }
        ],
        buttons: [
          {
            text: 'Afbryd',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Nulstil',
            handler: (data) => {
              this.auth.resetPassword(data.email);
              this.presentToast(data.email);
            }
          }
        ]
      });
      await alert.present();
    }

}
