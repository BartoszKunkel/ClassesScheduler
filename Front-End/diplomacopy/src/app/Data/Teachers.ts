import { Data } from "./Data";

export class Teachers
{
    t_id: number;
    name: string;
    surname: string;
    a_degree: string;
   



    constructor(id: number = 0, name: string = "", surname: string = "", a_degree: string = ""){
        this.t_id = id;
        this.name = name;
        this.surname = surname;
        this.a_degree = a_degree;
    }

    
    toString(t: Teachers): string
    {
        return `${t.a_degree}` + ` ` + ` ${t.name}` + ` ` + ` ${t.surname}`;
    }

    convertFromJSON(obj: Object[]): Teachers[]
    {
        
        const teachersTable = obj.map(obj => {
                return new Teachers(obj['t_id'], obj['name'], obj['surname'], obj['a_degree']);
            });  
        return teachersTable;
    }

    convertOneFromJSON(obj: Object): Teachers
    {
        
        const teacher = new Teachers(obj['t_id'], obj['name'], obj['surname'], obj['a_degree']);
        return teacher;
    }

    convertToData(teachers: Teachers[]): Data[]
    {
        const dataTable = []; 
        for(const teacher of teachers){
            const data = new Data(teacher.t_id, teacher.toString(teacher));
            dataTable.push(data);
        }
        return dataTable;
    }

    convertOneToData(teacher: Teachers): Data
    {
        const t: Teachers = new Teachers();
       
        return new Data(teacher.t_id, t.toString(teacher));
    }
}