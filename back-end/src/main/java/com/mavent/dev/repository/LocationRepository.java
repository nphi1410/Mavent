package com.mavent.dev.repository;

import com.mavent.dev.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location,Integer> {
    Location findByLocationId(Integer locationId);
}
