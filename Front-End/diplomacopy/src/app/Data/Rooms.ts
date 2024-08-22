import { Data } from "./Data";

export class Rooms
{
    r_id: number;
    building: string;
    numer: number;
    suffix: string;



    constructor(id: number = 0, building: string = "", numer: number = 0, suffix = ""){
        this.r_id = id;
        this.building = building;
        this.numer = numer;
        this.suffix = suffix;
    }

    


    toString(r: Rooms): string
    {
        return `${r.building}` + `${r.numer}` + `${this.addSuffix(r.suffix)}`;
    }

    addSuffix(s: string): string
    {
        if(s != null){
            return s
        }else{
            return ""}
    }

    convertFromJSON(obj: Object[]): Rooms[]
    {
        
        const roomsTable = obj.map(obj => {
                return new Rooms(obj['r_id'], obj['building'], obj['numer'], obj['suffix']);
            });  
        return roomsTable;
    }

    convertOneFromJSON(obj: Object): Rooms
    {   
        console.log(obj);
        const room = new Rooms(obj['r_id'], obj['building'], obj['numer'], obj['suffix']);
        return room;
    }

    convertToData(rooms: Rooms[]): Data[]
    {
        const dataTable = []; 
        for(const room of rooms){
            const data = new Data(room.r_id, room.toString(room));
            dataTable.push(data);
        }
        return dataTable;
    }

    convertOneToData(rooms: Rooms): Data{
        const r: Rooms = new Rooms();
        return new Data(rooms.r_id, r.toString(rooms));
    }

}