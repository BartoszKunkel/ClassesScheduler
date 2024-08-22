import { TmplAstInteractionDeferredTrigger } from "@angular/compiler";
import { HttpService } from "../Services/http.service";
import { Majors } from "./Majors";
import { Rooms } from "./Rooms";
import { Subjects } from "./Subjects";
import { Teachers } from "./Teachers";

export class ClassesEntity
{
    c_id: number;
    major: Majors;
    room: Rooms;
    subject: Subjects;
    teacher: Teachers;
    start_time: string;
    end_time: string;

    httpService: HttpService;

    constructor(m_obj: Majors = null, r_obj: Rooms = null, s_obj: Subjects = null, t_obj: Teachers = null, s_time: string = "", e_time: string = "",c_id: number = null){
        this.c_id = c_id;
        this.major = m_obj;
        this.room = r_obj;
        this.subject = s_obj;
        this.teacher = t_obj;
        this.start_time = s_time;
        this.end_time = e_time;
    }


    convertFromJSON(obj: Object[]): ClassesEntity[]
    {
        
        const classesTable = obj.map(obj => {
                return new ClassesEntity(obj['majorid'], obj['roomid'], obj['subjectid'], obj['teacherid'], obj['start_time'], obj['end_time'], obj['c_id']);
            });  
        return classesTable;
    }

    toEventString(c: ClassesEntity): string
    {
        return `${c.subject}` + `\n` + `${c.teacher}` + `\n` +`${c.room}`;
    }

    

}