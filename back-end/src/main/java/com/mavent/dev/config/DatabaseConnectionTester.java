package com.mavent.dev.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.Connection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatabaseConnectionTester implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnectionTester.class);
    private final DataSource dataSource;

    public DatabaseConnectionTester(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        try (Connection conn = dataSource.getConnection()) {
            logger.info("✅ Database connected successfully!");
            logger.info("URL: {}", conn.getMetaData().getURL());
            logger.info("User: {}", conn.getMetaData().getUserName());
            logger.info("Database: {}", conn.getMetaData().getDatabaseProductName());
            logger.info("Version: {}", conn.getMetaData().getDatabaseProductVersion());
        } catch (Exception e) {
            logger.error("❌ Database connection failed:", e);
        }
    }
}
