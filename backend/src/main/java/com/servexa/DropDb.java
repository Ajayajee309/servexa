package com.servexa;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DropDb {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/?allowPublicKeyRetrieval=true&useSSL=false";
        String user = "root";
        String pass = "ajay@2007";
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            stmt.executeUpdate("DROP DATABASE IF EXISTS servexa_db");
            System.out.println("Database servexa_db dropped successfully.");
            
            stmt.executeUpdate("CREATE DATABASE servexa_db");
            System.out.println("Database servexa_db recreated successfully.");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
