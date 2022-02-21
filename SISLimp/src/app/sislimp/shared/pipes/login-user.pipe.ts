import { Pipe, PipeTransform } from '@angular/core';
import { LoginUser } from 'src/app/sharedAll/models/usergeneral.model';

@Pipe({
  name: 'loginUserPipe'
})
export class LoginUserPipe implements PipeTransform {

  transform(value: string, legalperson: LoginUser[]): unknown {
    value = value ? value : null;
    let nameItem = value.toString();
    if (legalperson) {
      legalperson.forEach((user) => {
        if (value === user.codeuser.toString()) {
          nameItem = `${user.username}`
          return nameItem
        }
      });
    }
    return nameItem;
  }

}
