package com.kunkel.diploma.models.dto;

import lombok.Data;

@Data
public class TimeDto {
    private Long majorid;
    private Long subjectid;
    private Long roomid;
    private Long teacherid;
    private String start_time;
    private String end_time;

    public TimeDto(Long majorid, Long subjectid, Long roomid, Long teacherid, String start_time, String end_time) {
        this.majorid = majorid;
        this.subjectid = subjectid;
        this.roomid = roomid;
        this.teacherid = teacherid;
        this.start_time = start_time;
        this.end_time = end_time;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time = start_time;
    }

    public String getEnd_time() {
        return end_time;
    }

    public void setEnd_time(String end_time) {
        this.end_time = end_time;
    }

    public Long getMajorid() {
        return majorid;
    }

    public void setMajorid(Long majorid) {
        this.majorid = majorid;
    }

    public Long getSubjectid() {
        return subjectid;
    }

    public void setSubjectid(Long subjectid) {
        this.subjectid = subjectid;
    }

    public Long getRoomid() {
        return roomid;
    }

    public void setRoomid(Long roomid) {
        this.roomid = roomid;
    }

    public Long getTeacherid() {
        return teacherid;
    }

    public void setTeacherid(Long teacherid) {
        this.teacherid = teacherid;
    }

    @Override
    public String toString(){
        return "End time " + this.end_time + "\nStart time " + this.start_time + "\n Major Id " + this.majorid + "\n Room Id " + this.roomid + "\n Subject Id " + this.subjectid + "\n Teacher Id" + this.teacherid;
    }
}
