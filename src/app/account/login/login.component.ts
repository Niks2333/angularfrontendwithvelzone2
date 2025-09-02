import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/login.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService,private router: Router,
    private authFackservice: AuthfakeauthenticationService,private route: ActivatedRoute,public toastService: ToastService) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
     }

  ngOnInit(): void {
    if(sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
this.loginForm = this.formBuilder.group({
  username: ['admin', [Validators.required]], // ✅ just required, no email validation
  password: ['admin123', [Validators.required]],
});
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.loginForm.invalid) {
    return;
  }

  // prepare login model
const loginData = {
  Username: this.f['username'].value, // ✅ now using username
  password: this.f['password'].value
};


this.authenticationService.login(loginData).subscribe({
  next: (data: any) => {
if (data.token) {
  const userData = {
    token: data.token,
    username: loginData.Username,
    first_name: data.first_name || '',   // fallback to avoid undefined
    last_name: data.last_name || ''
  };
  sessionStorage.setItem('currentUser', JSON.stringify(userData));  // ✅ valid JSON
  sessionStorage.setItem('toast', 'true');
  this.router.navigate(['/']);
} else {
      this.toastService.show(data.Message, { classname: 'bg-danger text-white', delay: 15000 });
    }
  },
  error: (err) => {
    this.toastService.show('Login failed: ' + err.message, { classname: 'bg-danger text-white', delay: 15000 });
  }
});


}


    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.router.navigate(['/']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate(['/']);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
