import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { environment } from 'src/environments/environment';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService, private router: Router, 
    private toastr: ToastrService) { }

  private googleClientId = environment.googleClientId;

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(user => {
      if (!user) {
        this.loadGoogleOneTapSignIn();
      }
    });
  }
  
  private loadGoogleOneTapSignIn(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
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

  async handleCredentialResponse(response: CredentialResponse) {
    await this.accountService.loginWithGoogle(response.credential).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
        this.model = {};
      }
    })  
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
        this.model = {};
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
