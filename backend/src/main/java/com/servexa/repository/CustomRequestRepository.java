package com.servexa.repository;

import com.servexa.model.CustomRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomRequestRepository extends JpaRepository<CustomRequest, Long> {
}
