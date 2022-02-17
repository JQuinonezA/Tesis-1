import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginUser, UserGeneralModel } from 'src/app/sharedAll/models/usergeneral.model';
import { AuthService } from 'src/app/sharedAll/serviceShared/auth.service';
import { UsersGeneralService } from './users-general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  active;
  formLogin: FormGroup = new FormGroup({});
  formNewUser: FormGroup = new FormGroup({});
  cities: any[] = [];
  provinces: any[] = [];
  newUSer: UserGeneralModel = new UserGeneralModel();
  loginUser: LoginUser = new LoginUser();
  loginuser_codeuser: number = 0;
  constructor(
    private loginService: AuthService,
    private userGeneralService: UsersGeneralService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.active = 1;
    this.construcForm();
    this.cities = [
      { name: 'Ciudad 1', code: 1 },
      { name: 'Ciudad 2', code: 2 },
      { name: 'Ciudad 3', code: 3 },
    ]
    this.provinces = [
      { name: 'Provincia 1', code: 1 },
      { name: 'Provincia 2', code: 2 },
      { name: 'Provincia 3', code: 3 },
    ]
    console.log(this.cities);
  }
  construcForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.formNewUser = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      conditions: ['', Validators.required]
    }, { validator: this.MustMatch("password", "passwordConfirmation") })
  }
  onLogin() {
    console.log(this.formLogin.value);
    this.formLogin.markAllAsTouched();
    if (!this.formLogin.valid) {
      this.messageService.add({ severity: 'error', detail: 'Ingrese usuario y contraseña' });
      console.log('FORM', this.formLogin.value);
    } else {
      this.loginService.login(this.formLogin.value).subscribe(rest => {
        if (rest) {
          this.router.navigate(['user'])
        }
      })
    }
  }

  MustMatch(controlName: string, matchingControlName: string) {

    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  onSaveUser() {
    console.log(this.formNewUser.value);
    this.formNewUser.markAllAsTouched();
    if (!this.formNewUser.valid) {
      this.messageService.add({ severity: 'error', detail: 'Formulario imcompleto' });
      console.log('FORM', this.formNewUser.value);
    } else {
      this.fillContainerLoginUSer(this.formNewUser);
    }
  }
  fillContainer(form: FormGroup) {
    this.newUSer.name = form.controls.name.value;
    this.newUSer.lastname = form.controls.lastname.value;
    this.newUSer.email = form.controls.email.value;
    this.newUSer.phonenumber = form.controls.phoneNumber.value;
    this.newUSer.province = form.controls.province.value;
    this.newUSer.city = form.controls.city.value;
    this.newUSer.loginuser_codeuser = this.loginuser_codeuser;
    this.userGeneralService.saveUser(this.newUSer).then(rest => {
      console.log("SAVED newUSer ?", rest);
      this.messageService.add({ severity: 'success', detail: 'Registrado correctamente' });

    })
  }
  async fillContainerLoginUSer(form: FormGroup) {
    this.loginUser.username = form.controls.email.value;
    this.loginUser.password = form.controls.password.value;
    this.loginUser.changepassnextenter = 'NO';
    this.loginUser.status = 'ACTIVO';
    this.loginUser.loginusercol = 'USER';
    await this.userGeneralService.createLoginUSer(this.loginUser).then(rest => {
      console.log("SAVED loginUser ?", rest);
      if (rest.codeuser != null && rest.codeuser != 0) this.loginuser_codeuser = rest.codeuser;
    });
    this.fillContainer(this.formNewUser);
  }
}
