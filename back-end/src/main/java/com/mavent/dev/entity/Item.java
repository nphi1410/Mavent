package com.mavent.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@NoArgsConstructor
@Entity
@ToString
@Table(name = "Item")
public class Item {

    @Id
    @Column(name = "itemId")
    private String itemId;

    @Column(name = "sellerAccountId")
    private String sellerAccountId;

    @Column(name = "itemName")
    private String itemName;

    @Column(name = "price")
    private double price;

    @Column(name = "material")
    private String material;

    @Column(name = "weight")
    private double weight;

    @Column(name = "height")
    private double height;

    @Column(name = "width")
    private double width;

    @Column(name = "description")
    private String description;

    @Column(name = "isInStock")
    private boolean isInStock;

//    @Override
//    public String toString() {
//        return "Item{" +
//                "itemId='" + itemId + '\'' +
//                ", sellerAccountId='" + sellerAccountId + '\'' +
//                ", itemName='" + itemName + '\'' +
//                ", price=" + price +
//                ", material='" + material + '\'' +
//                ", weight=" + weight +
//                ", height=" + height +
//                ", width=" + width +
//                ", description='" + description + '\'' +
//                ", isInStock=" + isInStock +
//                '}';
//    }
}