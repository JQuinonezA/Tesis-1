import { Pipe, PipeTransform } from '@angular/core';
import { LegalPerson } from '../models/legalperson.model';

@Pipe({
  name: 'personaLegal'
})
export class PersonaLegalPipe implements PipeTransform {

  transform(value: unknown, legalperson: LegalPerson[]): unknown {
    value = value ? value : null;
    let nameItem = value.toString();
    if (legalperson) {
      legalperson.forEach((channel) => {
        if (value === channel.seqlegalperson) {
          nameItem = `${channel.seqlegalperson + ' - ' + channel.name}`
          return nameItem
        }
      });
    }
    return nameItem;
  }
}

