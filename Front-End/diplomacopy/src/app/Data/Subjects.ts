import { Data } from "./Data";

export class Subjects
{
    s_id: number;
    name: string;
   



    constructor(id: number = 0, name: string = ""){
        this.s_id = id;
        this.name = name;
    }

    


    convertFromJSON(obj: Object[]): Subjects[]
    {
        
        const subjectsTable = obj.map(obj => {
                return new Subjects(obj['s_id'], obj['name']);
            });  
        return subjectsTable;
    }

    convertOneFromJSON(obj: Object): Subjects
    {
        
        const subject = new Subjects(obj['s_id'], obj['name']);  
        return subject;
    }

    convertToData(subjects: Subjects[]): Data[]
    {
        const dataTable = []; 
        for(const subject of subjects){
            const data = new Data(subject.s_id, subject.name);
            dataTable.push(data);
        }
        return dataTable;
    }

    convertOneToData(subject: Subjects): Data
    {
        return new Data(subject.s_id, subject.name);
    }

}