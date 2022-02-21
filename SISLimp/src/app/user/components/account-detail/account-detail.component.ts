import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { UsersGeneralService } from 'src/app/page/components/login/users-general.service';
import { LoginUser, UserGeneralModel } from 'src/app/sharedAll/models/usergeneral.model';
import { AuthService } from 'src/app/sharedAll/serviceShared/auth.service';
import { CataloguesService } from 'src/app/sharedAll/serviceShared/catalogues.service';

const PROVINCECAT = 'PROVINCECAT';
const CITYCAT = 'CITYCAT'
@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css'],
  providers: [MessageService]
})
export class AccountDetailComponent implements OnInit {
  dropprovince: SelectItem[] = [];
  dropcity: SelectItem[] = [];
  dataUser: UserGeneralModel;
  formUser: FormGroup = new FormGroup({});
  editable: boolean = false;
  loginUser: LoginUser = new LoginUser();
  constructor(
    private userService: UsersGeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private catalogueService: CataloguesService,
    private messageService: MessageService,
  ) {
    this.dataUser = new UserGeneralModel();
    this.createForm();
    this.onEdit();
  }
  ngOnInit(): void {
    this.chargeData();
    this.getCatalogues();
  }
  chargeData() {
    this.userService.getUserExtraData(this.authService.codeUser).then(rest => {
      if (rest) {
        console.log(rest);
        this.dataUser = rest;
        this.createForm();
      }
    });
  }
  getCatalogues() {
    this.catalogueService.getCataloguebyCodeCat(PROVINCECAT).then(rest => {
      this.dropprovince = this.catalogueService.constructModel(rest);
    });
  }
  onChangueProvince(event: any) {
    console.log(event.value)
    this.catalogueService.getCataloguebyCodeCatAndCodeFather(CITYCAT, PROVINCECAT, event.value).then(rest => {
      this.dropcity = this.catalogueService.constructModel(rest);
    })
  }
  createForm() {
    this.formUser = this.formBuilder.group({
      nameuser: [this.dataUser.name, Validators.required],
      lastname: [this.dataUser.lastname, Validators.required],
      phonenumber: [this.dataUser.phonenumber, Validators.required],
      email: [this.dataUser.email, Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      province: [this.dataUser.province, Validators.required],
      city: ['', Validators.required],
    }, { validator: this.MustMatch("password", "confirmpassword") });
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
  fillConatainer() {
    if (this.formUser.controls.nameuser.valid) this.dataUser.name = this.formUser.controls.nameuser.value;
    if (this.formUser.controls.lastname.valid) this.dataUser.lastname = this.formUser.controls.lastname.value;
    if (this.formUser.controls.phonenumber.valid) this.dataUser.phonenumber = this.formUser.controls.phonenumber.value;
    if (this.formUser.controls.email.valid) this.dataUser.email = this.formUser.controls.email.value;
    if (this.formUser.controls.password.valid) this.loginUser.password = this.formUser.controls.password.value;
    if (this.formUser.controls.province.valid) this.dataUser.province = this.formUser.controls.province.value;
    if (this.formUser.controls.city.valid) this.dataUser.city = this.formUser.controls.city.value;
    if (this.loginUser.password != null && this.loginUser.password != '') {
      this.userService.updateLoginUSer(this.loginUser).then(rest => {
        if (rest != null) this.messageService.add({ severity: 'success', detail: 'Actualizado correctamente' });
      });
    }
    this.userService.updateDataUser(this.dataUser).then(rest => {
      if (rest != null) this.messageService.add({ severity: 'success', detail: 'Actualizado correctamente' });
      this.chargeData();
    });
  }
  onUpdate() {
    this.fillConatainer();
  }
  onEdit() {
    this.editable = !this.editable;
    if (this.editable) {
      this.formUser.disable();
    } else {
      this.formUser.enable();
    }
  }

}
