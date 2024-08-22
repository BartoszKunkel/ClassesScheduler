package com.kunkel.diploma.repositories;

import com.kunkel.diploma.TestDataUtil;
import com.kunkel.diploma.models.entities.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ClassesEntityRepositoryIntegrationTest {
    private ClassesRepository underTest;
    private MajorRepository majorRepository;
    private RoomsRepository roomsRepository;
    private SubjectsRepository subjectsRepository;
    private TeacherRepository teacherRepository;
    @Autowired
    public ClassesEntityRepositoryIntegrationTest(ClassesRepository underTest, MajorRepository majorRepository, RoomsRepository roomsRepository, SubjectsRepository subjectsRepository, TeacherRepository teacherRepository) {
        this.underTest = underTest;
        this.majorRepository = majorRepository;
        this.roomsRepository = roomsRepository;
        this.subjectsRepository = subjectsRepository;
        this.teacherRepository = teacherRepository;
    }




    @Test
    public void TestThatClassesCanBeCreatedandRecalled()
    {
        MajorEntity majorEntity = TestDataUtil.createTestMajorA();
        majorRepository.save(majorEntity);

        RoomsEntity room = TestDataUtil.createTestRoomsA();
        roomsRepository.save(room);

        SubjectsEntity subject = TestDataUtil.createTestSubjectA();
        subjectsRepository.save(subject);

        TeacherEntity teacherEntity = TestDataUtil.createTestTeacherA();
        teacherRepository.save(teacherEntity);

        ClassesEntity classesEntity = TestDataUtil.createTestClassesA(majorEntity,room,subject, teacherEntity);
        underTest.save(classesEntity);

        Optional<ClassesEntity> result = underTest.findById(classesEntity.getC_id());

        Assertions.assertThat(result.isPresent());
        Assertions.assertThat(result.get()).isEqualTo(classesEntity);
    }
}
