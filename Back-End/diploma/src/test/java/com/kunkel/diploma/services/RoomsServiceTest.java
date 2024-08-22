package com.kunkel.diploma.services;

import com.kunkel.diploma.TestDataUtil;
import com.kunkel.diploma.models.entities.RoomsEntity;
import com.kunkel.diploma.repositories.RoomsRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
public class RoomsServiceTest {

    @Mock
    private RoomsRepository roomsRepository;

    @InjectMocks
    private RoomsService roomsService;
    @Autowired
    public RoomsServiceTest(RoomsService roomsService) {
        this.roomsService = roomsService;
    }




    @Test
    public void testFindRoomById()
    {
        RoomsEntity mockRoom = TestDataUtil.createTestRoomsA();
        roomsService.save(mockRoom);
        Optional<RoomsEntity> room = roomsService.findOne(mockRoom.getR_id());
        Assertions.assertThat(room).isPresent();

    }

}
