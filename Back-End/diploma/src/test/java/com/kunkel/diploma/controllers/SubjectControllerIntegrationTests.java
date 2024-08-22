package com.kunkel.diploma.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kunkel.diploma.TestDataUtil;
import com.kunkel.diploma.models.dto.SubjectsDto;
import com.kunkel.diploma.models.entities.SubjectsEntity;
import com.kunkel.diploma.services.SubjectService;
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import javax.print.attribute.standard.Media;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc
public class SubjectControllerIntegrationTests {

    private SubjectService subjectService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Autowired
    public SubjectControllerIntegrationTests(SubjectService subjectService, MockMvc mockMvc) {
        this.subjectService = subjectService;
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatCreateSubjectSuccessfullyReturnHttp201Created() throws Exception{
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        testSubjectA.setS_id(null);
        String subjectJson = objectMapper.writeValueAsString(testSubjectA);

        mockMvc.perform(
                MockMvcRequestBuilders.post("/subject")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subjectJson)
        ).andExpect(MockMvcResultMatchers.status().isCreated()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatCreateSubjectSuccessfullyReturnsSavedSubject() throws Exception{
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        testSubjectA.setS_id(null);
        String subjectJson = objectMapper.writeValueAsString(testSubjectA);

        mockMvc.perform(
                MockMvcRequestBuilders.post("/subject")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subjectJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.s_id").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.name").value("Matematyka")
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatListSubjectsReturnsHttpStatus200() throws Exception
    {
        mockMvc.perform(
                MockMvcRequestBuilders.get("/subjects")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.status().isOk()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatListSubjectsReturnsListOfMajors() throws Exception
    {
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        subjectService.save(testSubjectA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/subjects")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].s_id").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].name").value("Matematyka")
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFindOneSubjectSuccessfullyReturnsHttp200WhenSubjectExist() throws Exception
    {
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        subjectService.save(testSubjectA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/subjects/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFindOneSubjectSuccessfullyReturnsHttp404WhenNoSubjetExist() throws Exception
    {

        mockMvc.perform(
                MockMvcRequestBuilders.get("/subjects/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isNotFound()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFindOneSubjectReturnSubjectWhenSubjectExists() throws Exception{
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        subjectService.save(testSubjectA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/subjects/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.s_id").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.name").value("Matematyka")
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateSubjectRetunrsHttpStatus404WhenNoMajorExists() throws Exception
    {
        SubjectsDto testSubjectDtoA = TestDataUtil.createTestSubjectDtoA();
        String subjectsDtoJson = objectMapper.writeValueAsString(testSubjectDtoA);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/subjects/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subjectsDtoJson)
        ).andExpect(
                MockMvcResultMatchers.status().isNotFound()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateSubjectReturnsHttpStatus200WhenRoomExists() throws Exception
    {
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        SubjectsEntity savedSubject = subjectService.save(testSubjectA);

        SubjectsDto testSubjectDtoA = TestDataUtil.createTestSubjectDtoA();
        String subjetsDtoJson = objectMapper.writeValueAsString(testSubjectDtoA);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/subjects/" + savedSubject.getS_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subjetsDtoJson)
        ).andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateUpdatesExistingSubject() throws Exception
    {
        SubjectsEntity testSubjectA = TestDataUtil.createTestSubjectA();
        SubjectsEntity savedSubject = subjectService.save(testSubjectA);

        SubjectsEntity testSubjectB = TestDataUtil.createTestSubjectB();
        String subjectDtoUpdateJson = objectMapper.writeValueAsString(testSubjectB);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/subjects/" + savedSubject.getS_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subjectDtoUpdateJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.s_id").value(savedSubject.getS_id())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.name").value(testSubjectB.getName())
        );
    }


}
