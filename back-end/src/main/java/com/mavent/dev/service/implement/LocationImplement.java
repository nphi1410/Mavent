package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Location;
import com.mavent.dev.repository.LocationRepository;
import com.mavent.dev.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationImplement implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @Override
    public Location getLocationById(Integer locationId) {
        return locationRepository.findByLocationId(locationId);
    }
}
