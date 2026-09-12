package com.example.carschool.dto;

import com.example.carschool.model.Route;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter  @Setter
public class RouteNoteDTO {

    private String pathGeoJson;
    private String routeName;

    private List<LocationNoteDTO> notes;

    public RouteNoteDTO(Route route, List<LocationNoteDTO> notes) {
        if(route != null){
            this.pathGeoJson = route.getPathGeoJson();
            this.routeName = route.getName();

        }
        this.notes = notes;
    }


}
