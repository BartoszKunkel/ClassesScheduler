export class Data
{
    id: number;
    content: string;


    constructor(id: number = 0, content: string = ""){
        this.id = id;
        this.content = content;
    }

    toString(): string
    {
        return `ID: ` + `${this.id}` + ` Content: ` + `${this.content}`;
    }
}