import { Employee } from './employee.model';
export class AgreementHistory{
    seqagreehistory: number;
    ruc: string;
    name: string;
    location: string;
    principallocation: string;
    phone: string;
    type: string;
    datestart: string;
    dateend: string;
    schedule: string;
    servicedetail: string;
    subtotal: number;
    area: number;
    legalperson_seqlegalperson: number;
    addededServices: string;
    employeeAssig: string;
    status: string;
    
    //nopersit
    elementsAsArray: Employee[];

}