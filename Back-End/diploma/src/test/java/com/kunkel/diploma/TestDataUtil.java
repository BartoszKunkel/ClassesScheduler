package com.kunkel.diploma;

import com.kunkel.diploma.models.dto.MajorDto;
import com.kunkel.diploma.models.dto.RoomsDto;
import com.kunkel.diploma.models.dto.SubjectsDto;
import com.kunkel.diploma.models.entities.*;


public class TestDataUtil {
    private TestDataUtil(){}

    public static MajorEntity createTestMajorA() {
        return MajorEntity.builder()
                .major_id(1L)
                .name("Informatyka")
                .study_year("I")
                .practice_group("Lab1")
                .lab_group("0")
                .specialization("AIiM")
                .lvl_degree(1)
                .study_mode(1)
                .build();
    }

    public static MajorEntity createTestMajorB() {
        return MajorEntity.builder()
                .major_id(2L)
                .name("Mechanika")
                .study_year("II")
                .practice_group("Lab2")
                .lab_group("Lab1")
                .specialization("Ogólna")
                .lvl_degree(2)
                .study_mode(2)
                .build();
    }

    public static RoomsEntity createTestRoomsA()
    {
        return RoomsEntity.builder()
                .r_id(1L)
                .building("C")
                .numer(112)
                .build();
    }

    public static RoomsEntity createTestRoomsB()
    {
        return RoomsEntity.builder()
                .r_id(2L)
                .building("A")
                .numer(1)
                .build();
    }



    public static SubjectsEntity createTestSubjectA()
    {
        return SubjectsEntity.builder()
                .s_id(1L)
                .name("Matematyka")
                .build();
    }

    public static SubjectsEntity createTestSubjectB()
    {
        return SubjectsEntity.builder()
                .s_id(2L)
                .name("Programowanie Obiektowe")
                .build();
    }

    public static TeacherEntity createTestTeacherA()
    {
        return TeacherEntity.builder()
                .t_id(1L)
                .name("Ktos")
                .surname("Ktosiowski")
                .a_degree("Dr")
                .build();
    }
    public static ClassesEntity createTestClassesA(final MajorEntity majorEntity, final RoomsEntity room, final SubjectsEntity subject, final TeacherEntity teacherEntity)
    {
        return ClassesEntity.builder()
                .c_id(1L)
                .roomid(room)
                .start_time("28.03.2024 12:00")
                .end_time("28.03.2024 10:00")
                .subjectid(subject)
                .teacherid(teacherEntity)
                .majorid(majorEntity)
                .build();
    }

    public static RoomsDto createTestRoomsDtoA()
    {
        return RoomsDto.builder()
                .r_id(1L)
                .building("C")
                .numer(112)
                .build();
    }

    public static RoomsDto createTestRoomsDtoB()
    {
        return RoomsDto.builder()
                .r_id(2L)
                .building("A")
                .numer(1)
                .build();
    }

    public static MajorDto createTestMajorDtoA() {
        return MajorDto.builder()
                .major_id(1L)
                .name("Informatyka")
                .study_year("I")
                .practice_group("Lab1")
                .lab_group("0")
                .specialization("AIiM")
                .lvl_degree(1)
                .build();
    }

    public static SubjectsDto createTestSubjectDtoA()
    {
        return SubjectsDto.builder()
                .s_id(1L)
                .name("Matematyka")
                .build();
    }

}
