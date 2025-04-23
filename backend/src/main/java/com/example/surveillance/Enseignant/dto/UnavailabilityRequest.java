package com.example.surveillance.Enseignant.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Data
public class UnavailabilityRequest {
    @NotNull
    private LocalDate date;
    @NotEmpty
    private List<TimeSlot> slots;

    @Data
    public static class TimeSlot{
        @NotNull
        private LocalTime startTime;

        @NotNull
        private LocalTime endTime;
    }
}
