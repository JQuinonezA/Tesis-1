
export class SolService{
    seqsolservice: number;
    codeuser: number;
    services: string;
    nameuser: string;
    contacnumber: string;
    email: string;
    dateCreate: Date;
    status: string;
    //nopersist
    elementAsArray: any;
    constructor(){
        this.dateCreate = new Date();
    }
}