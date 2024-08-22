import { TmplAstInteractionDeferredTrigger } from "@angular/compiler";
import { HttpService } from "../Services/http.service";
import { Rooms } from "./Rooms";
import { Subjects } from "./Subjects";
import { Teachers } from "./Teachers";

export class Classes
{
    c_id: number;
    majorid: number;
    roomid: number;
    subjectid: number;
    teacherid: number;
    start_time: string;
    end_time: string;

    httpService: HttpService;

    constructor(m_id: number = null, r_id: number = null, s_id: number = null, t_id: number = null, s_time: string = "", e_time: string = "",c_id: number = null){
        this.c_id = c_id;
        this.majorid = m_id;
        this.roomid = r_id;
        this.subjectid = s_id;
        this.teacherid = t_id;
        this.start_time = s_time;
        this.end_time = e_time;
    }


    convertFromJSON(obj: Object[]): Classes[]
    {
        
        const classesTable = obj.map(obj => {
                return new Classes(obj['majorid'], obj['roomid'], obj['subjectid'], obj['teacherid'], obj['start_time'], obj['end_time'], obj['c_id']);
            });  
        return classesTable;
    }

    toEventString(c: Classes): string
    {
        return `${c.subjectid}` + `\n` + `${c.teacherid}` + `\n` +`${c.roomid}`;
    }

    

}