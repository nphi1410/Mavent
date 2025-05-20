package com.mavent.dev.repository;

import com.mavent.dev.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item,String> {
    Item findByItemId(String itemId);
}
