import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

// import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private ngZone: NgZone, private fireAuth: AngularFireAuth, private fireStore: AngularFirestore, private router: Router) {
  }

  public currentUser: any;

  public userStatus: string = '';
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);

  get isLoggedIn(): boolean {
    return true;
  }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((userResponse) => {
        // add the user to the "Users" database
        let user = {
          id: userResponse.user?.uid,
          username: userResponse.user?.email,
          role: "user",
          refreshToken: userResponse.user?.refreshToken,
          uid: userResponse.user?.uid,
        }

        //add the user to the database
        this.fireStore.collection("Users").add(user)
          .then(user => {
            user.get().then(x => {
              //return the user data
              this.currentUser = x.data();
              this.setUserStatus(this.currentUser);
              //this.ngZone.run(() => this.router.navigate(["/"]));
            })
          }).catch(err => {
            console.log(err);
          })

        this.sendEmailForVarification(userResponse.user);
      })
      .catch((err) => {
        console.log("An error ocurred: ", err);
      })
  }

  //login method
  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        debugger;
        this.fireStore.collection("Users").ref.where("username", "==", user.user?.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            this.currentUser = userRef.data();
            this.setUserStatus(this.currentUser)
            debugger;
            this.ngZone.run(() => this.router.navigate(["/"]));
          })
        })

      }).catch(err => err)
  }

  logOut() {
    this.fireAuth.signOut()
      .then(() => {
        console.log("user signed Out successfully");
        //set current user to null to be logged out
        this.currentUser = null;
        //set the listenener to be null, for the UI to react
        this.setUserStatus(null);
        this.ngZone.run(() => this.router.navigate(["/login"]));

      }).catch((err) => {
        console.log(err);
      })
  }

  // forgot password
  forgotPassword(email: string) {
    this.fireAuth.sendPasswordResetEmail(email).then(() => {
      this.ngZone.run(() => this.router.navigate(["/verify-email"]));
    }, err => {
      alert('Something went wrong');
    })
  }

  // email varification
  sendEmailForVarification(user: any) {
    console.log(user);
    user.sendEmailVerification().then((res: any) => {
      this.ngZone.run(() => this.router.navigate(["/verify-email"]));
    }, (err: any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //sign in with google
  googleSignIn() {
    this.fireAuth.signInWithPopup(new GoogleAuthProvider).then(user => {
      this.fireStore.collection("Users").ref.where("username", "==", user.user?.email).onSnapshot(snap => {
        snap.forEach(userRef => {
          this.currentUser = userRef.data();
          this.setUserStatus(this.currentUser)
          this.ngZone.run(() => this.router.navigate(["/"]));
        })
      })

    }).catch(err => err)
  }

  userChanges() {
    this.fireAuth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        this.fireStore.collection("Users").ref.where("username", "==", currentUser.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            this.currentUser = userRef.data();
            //setUserStatus
            this.setUserStatus(this.currentUser);
            this.ngZone.run(() => this.router.navigate(["/"]));
          })
        })
      } else {
        // if there is no user logged in;
      }
    })
  }
}
