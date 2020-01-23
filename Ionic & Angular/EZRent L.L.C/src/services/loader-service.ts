import { Injectable } from "@angular/core";
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoaderService {
    constructor(public loadingCtrl: LoadingController
    ) {
    }
    public loading:any;
    startLoader(content:any) {
        this.loading = this.loadingCtrl.create({
          content: content
        });
        this.loading.present();
        setTimeout(() => {
          this.loading.dismiss();
        }, 5000);
      }
      stopLoader(){
        this.loading.dismiss();
  }
}