
export class UserGeneralModel {
    sequser: number;
    name: string;
    lastname: string;
    email: string;
    phonenumber: string;
    province: string;
    city: string;
    datecreate: Date;
    datelastmodify: Date;
    loginuser_codeuser: number;
    constructor(){
        this.sequser = 0;
        this.name = '';
        this.lastname = '';
        this.email = '';
        this.phonenumber = '';
        this.province = '';
        this.city = '';
        this.datecreate = new Date();
        this.datelastmodify = new Date();
        this.loginuser_codeuser = 0;
    }
}

export class ErrorLogin{
    message?: string;
    code?: string;
}
export class LoginUser {
    codeuser: number;
    username: string;
    password: string;
    changepassnextenter: string;
    duedatepass: Date;
    salt: string;
    status: string;
    datecreate: Date;
    datelastmodify: Date;
    loginusercol: string;
    token: string;
    constructor() {
        this.datecreate = new Date();
        this.datelastmodify = new Date();
        this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjUyNTM2MjUxNH0.OgFAgwyjSc12IkTJ6zpqkLq4Z69MKb03RUxbiRef5BQ';
        this.duedatepass = new Date();
    }

}