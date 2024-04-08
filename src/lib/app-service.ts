import { goto } from "$app/navigation";
import { browser } from "$app/environment";

import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  getAuth,
  getRedirectResult,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { AppUser } from "./interfaces";

export class AppService {
  googleProvider = new GoogleAuthProvider();

  firebaseConfig = {
    apiKey: "AIzaSyBy0U4lU8Qw3sdmV8aZPO54FM3DSo83NX0",
    authDomain: "postocracy.firebaseapp.com",
  };
  
  // Initialize Firebase & Firebase Auth
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  currentUser: AppUser | undefined = undefined;
  currentUserLoaded: boolean = false;
  firebaseUser: User | undefined = undefined;
  reloadFlag: boolean = false;

  constructor() {
    if (browser) {
      this.auth.onAuthStateChanged((u: User | null) => {
        // if u is undefined, means we don't know user state
        // if u is null, means user is signed out
        // if u is an object, means user is signed in
        this.currentUserLoaded = true;
        if (!u) {
          this.currentUser = undefined;
          //First, we initialize our event
          const event = new Event('userUpdated');
          // Next, we dispatch the event.
          document.dispatchEvent(event);
          // Goto signed-out landing page
          goto("/");
        } else {
          this.firebaseUser = u;
          this.currentUser = new AppUser();

          if (u?.email) this.currentUser.email = u.email.replaceAll("#", "");
          if (u?.photoURL) 
            this.currentUser.photoUrl = u.photoURL;
          else
            this.currentUser.photoUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

          if (u?.displayName) {
            this.currentUser.userName = u.displayName;
          }
          else {
            this.currentUser.userName = "New User";
          }

          if (u.providerData && u.providerData.length > 0)
            this.currentUser.providerId = u.providerData[0].providerId;

          if (window.location.pathname.endsWith("/")) {
            goto("/home");
          }
          else {
            const event = new Event('userUpdated');
            document.dispatchEvent(event);
          }
        }
      });
    }
  }

  SignInWithGoogle(): void {
    const auth = getAuth();
    signInWithRedirect(auth, this.googleProvider);
  }

  RegisterWithEmail(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        sendEmailVerification(userCredential.user);
        goto("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode + " - " + errorMessage);

        this.ShowSnackbar(errorMessage);
      });
  }

  SignInWithEmail(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Signed in 
      goto("/home");
    })
    .catch((error2: { code: any; message: any; }) => {
      const errorCode = error2.code;
      const errorMessage = error2.message;
      console.error(errorCode + " - " + errorMessage);
      this.ShowSnackbar(errorMessage);
    });
  }

  SignOut(): void {
    const auth = getAuth();
    signOut(auth);
  }

  GetIdToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.firebaseUser) {
        this.firebaseUser
          .getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            resolve(idToken);
          });
      } else {
        resolve("");
      }
    });
  }

  ShowSnackbar(message: string) {
    var x = document.getElementById("snackbar");
    if (x) {
      x.innerHTML = message;
      x.className = "show";
    }
    
    setTimeout(function(){ if (x) {
      x.className = x.className.replace("show", ""); 
    }}, 3000);
  }

  RegisterModalDialogHandler: ((message: string, SubmitButtonText: string, type: number) => Promise<string>) | undefined = undefined;

  ShowDialog(message: string, SubmitButtonText: string, type: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.RegisterModalDialogHandler) {
        this.RegisterModalDialogHandler(message, SubmitButtonText, type).then((result: string) => {
          resolve(result);
        });
      }
      else {
        console.error("No dialog registered handler!");
      }
    });
  }
}

export let appService: AppService = new AppService();