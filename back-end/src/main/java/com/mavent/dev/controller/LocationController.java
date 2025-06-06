package com.mavent.dev.controller;

import com.mavent.dev.entity.Location;
import com.mavent.dev.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping
    public List<Location> getAllLocations(){
        return locationService.getAllLocations();
    }

    @GetMapping("/{locationId}")
    public Location getLocation(@PathVariable Integer locationId){
        return locationService.getLocationById(locationId);
    }

}
