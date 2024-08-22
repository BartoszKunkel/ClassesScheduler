package com.kunkel.diploma.repositories;

import com.kunkel.diploma.TestDataUtil;
import com.kunkel.diploma.models.entities.MajorEntity;
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
public class MajorEntityDaoImplIntegrationTest {


    private MajorRepository underTest;

    @Autowired
    public MajorEntityDaoImplIntegrationTest(MajorRepository underTest) {
        this.underTest = underTest;
    }

    @Test
    public void testThatMajorCanBeCreatedAndRecalled() {
        MajorEntity majorEntity = TestDataUtil.createTestMajorA();
        underTest.save(majorEntity);
        Optional<MajorEntity> result = underTest.findById(majorEntity.getMajor_id());
        Assertions.assertThat(result).isPresent();
        Assertions.assertThat(result.get()).isEqualTo(majorEntity);
    }

//    @Test
//    public void testThatMultipleMajorCanBeCreatedAndRecalled()
//    {
//        Major majorA = TestDataUtil.createTestMajorA();
//        underTest.create(majorA);
//        Major majorB = TestDataUtil.createTestMajorB();
//        underTest.create(majorB);
//        Major majorC = TestDataUtil.createTestMajorC();
//        underTest.create(majorC);
//
//        List<Major> result = underTest.find();
//        Assertions.assertThat(result)
//                .hasSize(3)
//                .containsExactly(majorA, majorB, majorC);
//    }
//
//    @Test
//    public void testThatMajorCanBeUpdated()
//    {
//        Major majorA = TestDataUtil.createTestMajorA();
//        underTest.create(majorA);
//        majorA.setName("UPDATED");
//        underTest.update(majorA.getMajorID(), majorA);
//        Optional<Major> result = underTest.findOne(majorA.getMajorID());
//        Assertions.assertThat(result).isPresent();
//        Assertions.assertThat(result.get()).isEqualTo(majorA);
//    }
//
//    @Test
//    public void testThatMajorCanBeDeleted()
//    {
//        Major majorA = TestDataUtil.createTestMajorA();
//        underTest.create(majorA);
//        underTest.delete(majorA.getMajorID());
//        Optional<Major> result = underTest.findOne(majorA.getMajorID());
//        Assertions.assertThat(result).isEmpty();
//    }

}
