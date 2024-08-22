package com.kunkel.diploma.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kunkel.diploma.TestDataUtil;
import com.kunkel.diploma.models.dto.RoomsDto;
import com.kunkel.diploma.models.entities.RoomsEntity;
import com.kunkel.diploma.services.RoomsService;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import javax.print.attribute.standard.Media;
import java.nio.CharBuffer;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc
public class RoomsControllerIntegrationTests {

    private RoomsService roomsService;
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Autowired
    public RoomsControllerIntegrationTests(MockMvc mockMvc, RoomsService roomsService) {
        this.mockMvc = mockMvc;
        this.roomsService = roomsService;
        this.objectMapper = new ObjectMapper();
    }


    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatCreateRoomsSuccessfullyReturnsHttp201Created() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        testRoomsA.setR_id(null);
        String roomsJson = objectMapper.writeValueAsString(testRoomsA);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomsJson)
        ).andExpect(
                MockMvcResultMatchers.status().isCreated()
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatCreateRoomsSuccessfullyReturnsSavedRoom() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        testRoomsA.setR_id(null);
        String roomsJson = objectMapper.writeValueAsString(testRoomsA);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomsJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.r_id").isNumber()
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.building").value("C")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.numer").value(112)
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatListRoomsReturnsHttpStatus200() throws Exception {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/rooms")
                    .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatListRoomsReturnsListOfRooms() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        roomsService.save(testRoomsA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].r_id").isNumber()
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].building").value("C")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$[0].numer").value(112)
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatGetRoomsReturnsHttpStatus200WhenRoomExist() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        roomsService.save(testRoomsA);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/rooms/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatGetRoomsReturnsHttpStatus404WhenNoRoomExist() throws Exception {
           mockMvc.perform(
                MockMvcRequestBuilders.get("/rooms/1")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatGetRoomsReturnsRoomWhenRoomExists() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        roomsService.save(testRoomsA);

//        MvcResult result = mockMvc.perform(
//                MockMvcRequestBuilders.get("/rooms/{id}", testRoomsA.getR_id())
//                        .contentType(MediaType.APPLICATION_JSON)
//        ).andReturn();
//
//        String content = result.getResponse().getContentAsString();
//        System.out.println("Odpowiedź JSON: " + content);

        mockMvc.perform(
                MockMvcRequestBuilders.get("/rooms/0")
                        .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.r_id").value(0)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.building").value("C")
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.numer").value(112)
        );
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateRoomsReturnsHttpStatus404WhenNoRoomExist() throws Exception {
        RoomsDto testRoomsDtoA = TestDataUtil.createTestRoomsDtoA();
        String roomsDtoJson = objectMapper.writeValueAsString(testRoomsDtoA);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/rooms/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomsDtoJson)
        ).andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateRoomsReturnsHttpStatus200WhenRoomExist() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        RoomsEntity savedRoom = roomsService.save(testRoomsA);

        RoomsDto testRoomsDtoA = TestDataUtil.createTestRoomsDtoA();
        String roomsDtoJson = objectMapper.writeValueAsString(testRoomsDtoA);

        mockMvc.perform(
                MockMvcRequestBuilders.put("/rooms/" + savedRoom.getR_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomsDtoJson)
        ).andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testThatFullUpdateUpdatesExistingRoom() throws Exception {
        RoomsEntity testRoomsA = TestDataUtil.createTestRoomsA();
        RoomsEntity savedRoom = roomsService.save(testRoomsA);

        RoomsEntity testRoomsB = TestDataUtil.createTestRoomsB();
        testRoomsB.setR_id(savedRoom.getR_id());
        String roomsDtoUpdateJson = objectMapper.writeValueAsString(testRoomsB);
        System.out.println(testRoomsB.getBuilding());
        System.out.println(roomsDtoUpdateJson);
        mockMvc.perform(
                MockMvcRequestBuilders.put("/rooms/" + savedRoom.getR_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomsDtoUpdateJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.r_id").value(savedRoom.getR_id())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.building").value(testRoomsB.getBuilding())
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.numer").value(testRoomsB.getNumer())
        );
    }
}
