import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { environment } from 'src/environments/environment';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { DatasetService } from '../_services/dataset.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private _ngZone: NgZone, public accountService: AccountService, public datasetService: DatasetService, private router: Router, 
    private toastr: ToastrService) { }

  private googleClientId = environment.googleClientId;

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      this.accountService.currentUser$.subscribe(user => {
        if (!user) {
          this.loadGoogleOneTapSignIn();
        }
      });
    }
  }
  
  private loadGoogleOneTapSignIn(): void {
    // @ts-ignore
    if (window.google && window.google.accounts) {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("googleSignInButtonContainer"),
        { theme: "outline", size: "large", width: "100%" }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  handleLoginSuccess(): void {
    this.router.navigateByUrl('/datasets');
    this.model = {};
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.accountService.loginWithGoogle(response.credential).subscribe({
      next: () => {
        // NgZone ensures that Angular checks for changes after Google login
        this._ngZone.run(() => {
          this.handleLoginSuccess();
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }  

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.handleLoginSuccess();
      }
    })
  }

  logout() {
    this.datasetService.datasetCache.clear();
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
