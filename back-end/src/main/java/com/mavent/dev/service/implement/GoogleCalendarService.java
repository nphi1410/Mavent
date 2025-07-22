package com.mavent.dev.service.implement;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.mavent.dev.entity.Meeting;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GoogleCalendarService {

    public Calendar getCalendarService(String accessToken) {
        GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

        return new Calendar.Builder(
                credential.getTransport(),
                credential.getJsonFactory(),
                credential
        ).setApplicationName("Event Manager").build();
    }

    public String addMeetingEvent(String accessToken, Meeting meeting) throws IOException {
        Calendar calendar = getCalendarService(accessToken);

        Event event = new Event()
                .setSummary(meeting.getTitle())
                .setLocation(meeting.getLocation())
                .setDescription(meeting.getDescription());

        event.setStart(new EventDateTime().setDateTime(new DateTime(String.valueOf(meeting.getMeetingDatetime()))));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(String.valueOf(meeting.getEndDatetime()))));

        Event created = calendar.events().insert("primary", event).execute();
        return created.getId();
    }

    public void updateMeetingEvent(String accessToken, Meeting meeting, String eventId) throws IOException {
        Calendar calendar = getCalendarService(accessToken);
        Event event = calendar.events().get("primary", eventId).execute();

        event.setSummary(meeting.getTitle())
                .setLocation(meeting.getLocation())
                .setDescription(meeting.getDescription())
                .setStart(new EventDateTime().setDateTime(new DateTime(String.valueOf(meeting.getMeetingDatetime()))))
                .setEnd(new EventDateTime().setDateTime(new DateTime(String.valueOf(meeting.getEndDatetime()))));

        calendar.events().update("primary", eventId, event).execute();
    }

    public void deleteMeetingEvent(String accessToken, String eventId) throws IOException {
        Calendar calendar = getCalendarService(accessToken);
        calendar.events().delete("primary", eventId).execute();
    }
}
