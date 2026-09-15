package com.example.carschool.dto;

import com.example.carschool.model.Instructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
public class InstructorSlotDTO {

    private final Instructor instructor;
    private int freeSlots;

    public InstructorSlotDTO(Instructor instructor,int freeSlots) {
        this.instructor = instructor;
        this.freeSlots = freeSlots;

    }

    public void decrement(){
        freeSlots--;
    }

}
