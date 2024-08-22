import { Data } from "./Data";

// export interface Major {
//   m_id: number;
//   name: string;
//   study_year: string;
//   specialization: string;
//   practice_group: string;
//   lab_group: string;
//   lvl_degree: number;
//   study_mode: number;
// }

export class Majors {
  major_id: number;
  name: string;
  study_year: string;
  specialization: string;
  practice_group: string;
  lab_group: string;
  lvl_degree: number;
  study_mode: number;

  constructor(
    id: number = -1,
    name: string = null,
    study_year: string = null,
    specialization: string = null,
    practice_group: string = null,
    lab_group: string = null,
    lvl_degree: number = 0,
    study_mode = 0,
  ) {
    this.major_id = id;
    this.name = name;
    this.study_year = study_year;
    this.specialization = specialization;
    this.practice_group = practice_group;
    this.lab_group = lab_group;
    this.lvl_degree = lvl_degree;
    this.study_mode = study_mode;
  }

  toString(m: Majors): string {
    return `${this.getStudyMode(m.study_mode)}`+ `\nStopień: ${m.lvl_degree}\nSemestr: ${m.study_year}\nKierunek: ${m.name}\nSpecjalizacja: ${m.specialization}\nGrupa ćwiczeniowa: ${m.practice_group}\nGrupa Laboratoryjna ${m.lab_group}`;
  }

  getStudyMode(s: number): string {
    if ((s = 1)) return `Stacjonarne`;
    else return "Niestacjonarne";
  }

  convertFromJSON(obj: Object[]): Majors[] {
    const majorsTable = obj.map((obj) => {
      return new Majors(
        obj["major_id"],
        obj["name"],
        obj["study_year"],
        obj["specialization"],
        obj["practice_group"],
        obj["lab_group"],
        obj["lvl_degree"],
        obj["study_mode"],
      );
    });
    return majorsTable;
  }

  convertToData(majors: Majors[], property: string, del: boolean): Data[] {
    let dataTable = [];
    for (const major of majors) {
      if (property != "all") {
        const data = new Data(major.major_id, major[property]);
        dataTable.push(data);
      } else {
        const data = new Data(major.major_id, this.toString(major));
        dataTable.push(data);
      }
    }
    if (del == true) {
      dataTable = this.deleteDuplicates(dataTable);
    }
    return dataTable;
  }

  convertOneToData(major: Majors): Data{
    return new Data(major.major_id, this.toString(major));
  }

  deleteDuplicates(data: Data[]): Data[] {
    let filtered: Data[] = [];
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].content !== "" &&
        !filtered.some((item) => item.content === data[i].content)
      ) {
        filtered.push(data[i]);
      }
    }
    return filtered;
  }
}
