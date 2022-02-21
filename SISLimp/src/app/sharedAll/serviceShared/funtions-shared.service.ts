import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsersGeneralService } from '../../page/components/login/users-general.service';

@Injectable({
  providedIn: 'root'
})
export class FuntionsSharedService {

  constructor(
    private loginUserService: UsersGeneralService
  ) { }
  repair(imgs: any) {
    let TYPED_ARRAY: Uint8Array;
    if (imgs != null || imgs != undefined) TYPED_ARRAY = new Uint8Array(imgs?.data);
    let STRING_CHAR = new TextDecoder().decode(TYPED_ARRAY);
    let base64String = btoa(STRING_CHAR);
    let base64Stringtwo = atob(base64String);
    return base64Stringtwo;
  }
  enterOnlyNumbers(evt: any) {
    if (window.onkeyup) {
      var keynum = evt.keyCode;
    } else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá ascii.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    } else {
      //incorporar mensaje
      return false;
    }
  }
  emailValidator(emailControl: string) {
    // external validator
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[emailControl];
      if (control.errors && !control.errors.mustMatch) {
        return;
      }
      if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(control?.value)) {
        control.setErrors(null);
      } else {
        control.setErrors({ mustMatch: 'Correo incorrecto' });
      }
    }
  }
  validateUsername(userNameControl: string){
    return (form: FormGroup) => {
      const control = form.controls[userNameControl];
      if (control.errors && !control.errors.userNameFound) {
        return;
      }
      this.loginUserService.validateUsername(control?.value).then( rest => {
        if(rest.code !== '01'){
          control.setErrors(null);
        } else {
          control.setErrors({userNameFound: 'El usuario existe'})
        }
      })
    }
  }
  
}
