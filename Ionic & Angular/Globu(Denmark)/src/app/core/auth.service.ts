import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";

import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";

import { Observable, of } from "rxjs";
import { switchMap, first } from "rxjs/operators";
import { ProfileService } from "./profile.service";

interface firebaseUser {
  uid: string;
  email: string;
  photoURL?: string;
  catchPrase?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: firebase.User = null;

  firebaseUserprofile: any[];

  user: Observable<firebaseUser>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private Lctrl: LoadingController,
    public ProfileFirebase: ProfileService
    ) {
  
      this.afAuth.auth.onAuthStateChanged
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState.pipe(
      switchMap(user => {
      if (user) {
      return this.afs.doc<firebaseUser>(`users/${this.afAuth.auth.currentUser.uid}`).valueChanges()
      } else {
        return of(null)
      }}))

    }

    getAuthenticatedUser(){
      return this.afAuth.authState;
    }

    isLoggedIntoFirebase() {
      if (this.currentUser == null) {
      return false
      }
      return true
    }

    async presentLoading() {
      const loading = await this.Lctrl.create({
        message: 'Vent venligst'
      });
      return await loading.present();
    }

     //CHECK IF USER IS LOGGED IN//

     isLoggedIn() {
      return this.afAuth.authState.pipe(
      first()).toPromise();
    }

  // async checkUserloggedin() {
  //   const user = await this.isLoggedIn()
  //   if (user) {
  //     this.router.navigate(['/home']);
  //     console.log('USER IS AUTHENTICATED');
  //   } else {
  //     console.log('USER IS NOT AUTHENTICATED')
  //   }
  // }
 

    async emailSignUp(email: string, password: string){
      await firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        return this.setUserDoc(user) // create initial user document
      })
      .catch(error => this.handleError(error));
    }

    //Update properties o the suer document
    updateUser(user: firebaseUser, data: any){
      return this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`).update(data)
    }

    //If error, console log and notify user
    handleError(error) {
      console.error(error)
    }

    setUserDoc(user) {

      const userRef: AngularFirestoreDocument<firebaseUser> = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`);

      const data: firebaseUser = {
        uid: this.afAuth.auth.currentUser.uid,
        email: this.afAuth.auth.currentUser.email || null,
        photoURL: 'https://goo.gl/Fz9nrQ'
      }

      return userRef.set(data)
    }


  /// Additional useful methods, not used in video

  async emailLogin(email: string, password: string) {
    try {
      this.presentLoading();
      firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        this.Lctrl.dismiss();
        if (user) {
          this.router.navigate(['/home']);
          console.log("User logged in");
          console.log(user.user.metadata.lastSignInTime);
        } else {
          console.log("User not signed up")
        }
      })
    }
    catch (error) {
      this.handleError(error);
    }
  }
  public emailLogin2(email: string, password: string) {
    return Observable.create(observer => {
      this.presentLoading();
        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
          this.Lctrl.dismiss();
          if (user) {
            // this.router.navigate(['/home']);
            console.log("User logged in");
            // console.log(user.user.metadata.lastSignInTime);
          } else {
            console.log("User not signed up")
          }
            observer.next(user);
            observer.complete();
        }, (error) => {
            const errorBody = JSON.parse(error['_body']);
            observer.error(errorBody);
        });
    });
  }
  
  // Sends email allowing user to reset password
  async resetPassword(email: string) {
    const fbAuth = this.afAuth.auth;

    try {
      await fbAuth.sendPasswordResetEmail(email);
      return console.log('Password update email sent');
    }
    catch (error) {
      return this.handleError(error);
    }
  }


  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }

     ////// OAuth Methods /////

     googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      return this.oAuthLogin(provider);
     }
  
     githubLogin() {
       const provider = new firebase.auth.GithubAuthProvider()
       return this.oAuthLogin(provider);
     }
  
     facebookLogin() {
      const provider = new firebase.auth.FacebookAuthProvider()
       return this.oAuthLogin(provider);
     }
  
     twitterLogin() {
       const provider = new firebase.auth.TwitterAuthProvider()
       return this.oAuthLogin(provider);
     }
  
  
    private async oAuthLogin(provider) {
      try {
        const credential = await this.afAuth.auth.signInWithPopup(provider);
        console.log('Welcome to Firestarter!!!');
        return this.setUserDoc(credential.user);
      }
      catch (error) {
        return this.handleError(error);
      }
    }
  
  
    //// Anonymous Auth ////
  
    async anonymousLogin() {
      try {
        const user = await this.afAuth.auth.signInAnonymously();
        console.log('Welcome to Firestarter!!!');
        return this.setUserDoc(user); // if using firestore
      }
      catch (error) {
        return this.handleError(error);
      }
    }
}
