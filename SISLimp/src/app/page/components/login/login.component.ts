import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { LoginUser, UserGeneralModel } from 'src/app/sharedAll/models/usergeneral.model';
import { AuthService } from 'src/app/sharedAll/serviceShared/auth.service';
import { UsersGeneralService } from './users-general.service';
import { FuntionsSharedService } from '../../../sharedAll/serviceShared/funtions-shared.service';
import { CataloguesService } from '../../../sharedAll/serviceShared/catalogues.service';
const CITYCAT = 'CITYCAT';
const PROVINCECAT = 'PROVINCECAT';
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
  formPassword: FormGroup = new FormGroup({});
  cities: any[] = [];
  provinces: any[] = [];
  newUSer: UserGeneralModel = new UserGeneralModel();
  loginUser: LoginUser = new LoginUser();
  loginuser_codeuser: number = 0;
  dropCity: SelectItem[] = [];
  dropProvince: SelectItem[] = [];
  codeUser: number;
  mustChange: boolean;
  loginUserUpdate: LoginUser = new LoginUser();
  showChangePass: boolean = false;
  constructor(
    private loginService: AuthService,
    private userGeneralService: UsersGeneralService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    public sharedFuntions: FuntionsSharedService,
    private catalogueService: CataloguesService,

  ) {
    this.codeUser = this.loginService.codeUser;
  }

  ngOnInit() {
    this.active = 1;
    this.construcForm();
    this.getCatalogues();
  }

  async getCatalogues() {
    await this.catalogueService.getCataloguebyCodeCat(PROVINCECAT).then(rest => {
      this.provinces = this.catalogueService.constructModel(rest);
    });
  }
  onChangueProvince(event: any) {
    if (event) {
      if (event.target.value) {
        this.catalogueService.getCataloguebyCodeCatAndCodeFather(CITYCAT, PROVINCECAT, event.target.value).then(rest => {
          this.cities = this.catalogueService.constructModel(rest);
        });
      } else {
        this.cities = []
      }
    }


  }
  construcForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.formPassword = this.formBuilder.group({
      newpassword: ['', Validators.required],
      repassword: ['', Validators.required]
    }, { validator: this.MustMatch("newpassword", "repassword") });
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
    }, {
      validators: [this.MustMatch("password", "passwordConfirmation"),
      this.sharedFuntions.validateUsername('email')]
    })
  }
  async onLogin() {
    this.formLogin.markAllAsTouched();
    if (!this.formLogin.valid) {
      this.messageService.add({ severity: 'error', detail: 'Ingrese usuario y contraseña' });
      console.log('FORM', this.formLogin.value);
    } else {
      this.loginService.login(this.formLogin.value).subscribe(async rest => {
        if (rest) {
          await this.prevalidatePassword(this.codeUser);
          if (this.mustChange) {
            this.showChangePass = true;
          } else {
            this.router.navigate(['user']);
          }
        }
      })
    }
  }
  async prevalidatePassword(code: number) {
    let response: boolean;
    await this.userGeneralService.getUniqueLoginUser(code).then(rest => {
      if (rest?.changepassnextenter === "YES") {
        this.loginUserUpdate = rest;
        response = true;
      } else {
        response = false;
      }
    });
    return this.mustChange = response;
  }
  onPasschanged() {
    this.formPassword.markAllAsTouched()
    if (!this.formPassword.valid) {
      this.messageService.add({ severity: 'error', detail: 'Formulario incompleto' });
    } else {
      console.log("Antes", this.loginUserUpdate);
      this.loginUserUpdate.password = this.formPassword.controls.newpassword.value;
      this.loginUserUpdate.changepassnextenter = 'NO';
      console.log('On change');
      console.log(this.loginUserUpdate);
      this.userGeneralService.updateLoginUSer(this.loginUserUpdate).then(rest => {
        if (rest) {
          this.messageService.add({ severity: 'success', detail: 'Contraseña actualizada' });
          this.showChangePass = false;
          this.loginService.logOut();
        } else {
          this.messageService.add({ severity: 'error', detail: 'Error al actualizar' });
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
