import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {

  isSubmitted:boolean = false;
  constructor(private service: AuthService,
    private toastr: ToastrService
  ){}

  form = new FormGroup({
    fullName : new FormControl('',Validators.required),
    email : new FormControl('',[ Validators.required,Validators.email]),
    password : new FormControl('', [Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
    ])
  })

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value)
        .subscribe({
          next: (res:any) => {
            if(res.succeeded){
              this.form.reset();
              this.isSubmitted = false;
              this.toastr.success('Ne user created!', 'Registration Successful')
            }
            console.log(res)
          },
          error: err => {
            console.log('Error:', err);
          }
        });
    }
  }

    hasDiplayabeError(controlName: string):Boolean{
      const control = this.form.get(controlName);
      return Boolean(control?.invalid) && 
      (this.isSubmitted || Boolean(control?.touched))
    }

}
