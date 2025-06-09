package com.mavent.dev.service;

import com.mavent.dev.entity.Location;

import java.util.List;

public interface LocationService {
    List<Location> getAllLocations();
    Location getLocationById(Integer locationId);
}
