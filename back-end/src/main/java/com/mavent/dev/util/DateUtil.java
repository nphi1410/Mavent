package com.mavent.dev.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Utility class for date and time operations.
 */
public class DateUtil {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String ISO_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT);
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATETIME_FORMAT);
    private static final DateTimeFormatter ISO_DATETIME_FORMATTER = DateTimeFormatter.ofPattern(ISO_DATETIME_FORMAT);

    private DateUtil() {
        // Utility class - prevent instantiation
    }

    /**
     * Format LocalDate to string with default format.
     */
    public static String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DATE_FORMATTER);
    }

    /**
     * Format LocalDateTime to string with default format.
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATETIME_FORMATTER);
    }

    /**
     * Parse string to LocalDate with default format.
     */
    public static LocalDate parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateString, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + dateString + ". Expected format: " + DEFAULT_DATE_FORMAT, e);
        }
    }

    /**
     * Parse string to LocalDateTime with default format.
     */
    public static LocalDateTime parseDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateTimeString, DATETIME_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid datetime format: " + dateTimeString + ". Expected format: " + DEFAULT_DATETIME_FORMAT, e);
        }
    }

    /**
     * Check if a date is in the past.
     */
    public static boolean isPast(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isBefore(LocalDate.now());
    }

    /**
     * Check if a datetime is in the past.
     */
    public static boolean isPast(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isBefore(LocalDateTime.now());
    }

    /**
     * Check if a date is in the future.
     */
    public static boolean isFuture(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isAfter(LocalDate.now());
    }

    /**
     * Check if a datetime is in the future.
     */
    public static boolean isFuture(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isAfter(LocalDateTime.now());
    }
}
