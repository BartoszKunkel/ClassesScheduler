package com.kunkel.diploma.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.kunkel.diploma.TestDataUtil;
import com.kunkel.diploma.models.dto.MajorDto;
import com.kunkel.diploma.models.entities.MajorEntity;
import com.kunkel.diploma.services.MajorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcExtensionsKt;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc
public class MajorControllerIntegrationTests {

    private MajorService majorService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Autowired
    public MajorControllerIntegrationTests(MockMvc mockMvc, MajorService majorService)
    {
        this.mockMvc = mockMvc;
        this.majorService = majorService;
        this.objectMapper = new ObjectMapper();
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatCreateMajorSuccessfullyReturnHttp201Created() throws Exception
    {
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        testMajorA.setMajor_id(null);
        String majorJson = objectMapper.writeValueAsString(testMajorA);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/major")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(majorJson)
        ).andExpect(
                MockMvcResultMatchers.status().isCreated()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatCreateMajorSuccessffullyReturnsSavedMajor() throws Exception
    {
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        testMajorA.setMajor_id(null);
        String majorJson = objectMapper.writeValueAsString(testMajorA);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/major")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(majorJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.major_id").isNumber()
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.name").value("Informatyka")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.study_year").value("I")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.practice_group").value("Lab1")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.lab_group").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.specialization").value("AIiM")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.lvl_degree").value(1)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.study_mode").value(1)
        );
    }


    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatListMajorsReturnsHttpStatus200() throws Exception{
        mockMvc.perform(
                MockMvcRequestBuilders.get("/major")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatListMajorsReturnsListOfMajors() throws Exception{
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        majorService.save(testMajorA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/major")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].major_id").isNumber()
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].name").value("Informatyka")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].study_year").value("I")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].practice_group").value("Lab1")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].lab_group").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].specialization").value("AIiM")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].lvl_degree").value(1)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].study_mode").value(1)
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFindOneMajorSuccessfullyReturnsHttp200WhenMajorExist() throws Exception {
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        majorService.save(testMajorA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/major/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
          MockMvcResultMatchers.status().isOk()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFindOneMajorSuccessfullyReturnsHttp404WhenNoMajorExist() throws Exception
    {
        mockMvc.perform(
                MockMvcRequestBuilders.get("/major/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.status().isNotFound()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatGetMajorReturnsRoomWhenMajorExistis() throws Exception{
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        majorService.save(testMajorA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/major/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.major_id").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.name").value("Informatyka")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.study_year").value("I")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.practice_group").value("Lab1")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.lab_group").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.specialization").value("AIiM")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.lvl_degree").value(1)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.study_mode").value(1)
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateMajorReturnsHttpStatus404WhenNoMajorExist() throws Exception{
        MajorDto testMajorDtoA = TestDataUtil.createTestMajorDtoA();
        String majorsDtoJson = objectMapper.writeValueAsString(testMajorDtoA);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/major/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(majorsDtoJson)
        ).andExpect(MockMvcResultMatchers.status().isNotFound()
        );
    }


    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateMajorReturnsHttpStatus200WhenRoomExist() throws Exception{
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        MajorEntity savedMajor = majorService.save(testMajorA);

        MajorDto testMajorDtoA = TestDataUtil.createTestMajorDtoA();
        String majorsDtoJson = objectMapper.writeValueAsString(testMajorDtoA);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/major/" + savedMajor.getMajor_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(majorsDtoJson)
        ).andExpect(MockMvcResultMatchers.status().isOk()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateUpdatesExistingMajor() throws Exception{
        MajorEntity testMajorA = TestDataUtil.createTestMajorA();
        MajorEntity savedMajorA = majorService.save(testMajorA);

        MajorEntity testMajorB = TestDataUtil.createTestMajorB();
        String majorDtoUpdateJson = objectMapper.writeValueAsString(testMajorB);


        mockMvc.perform(
                MockMvcRequestBuilders.put("/major/" + savedMajorA.getMajor_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(majorDtoUpdateJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.major_id").value(savedMajorA.getMajor_id())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.name").value(testMajorB.getName())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.study_year").value(testMajorB.getStudy_year())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.practice_group").value(testMajorB.getPractice_group())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.lab_group").value(testMajorB.getLab_group())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.specialization").value(testMajorB.getSpecialization())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.lvl_degree").value(testMajorB.getLvl_degree())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.study_mode").value(testMajorB.getStudy_mode())
        );
    }

}
