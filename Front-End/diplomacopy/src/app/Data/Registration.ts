export class Registration
{
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    password: string;
    accesslvl: number;


    constructor(id: number = null, firstName: string = "", lastname: string ="", accesslvl: number = 0, username: string = "", password: string = ""){
        this.id = id;
        this.login = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastname;
        this.accesslvl = accesslvl;
    }
}