
package com.dev2life.backend.repository;

import com.dev2life.backend.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByUsuarioUid(String usuarioUid);

    Optional<Nota> findByIdAndUsuarioUid(Long id, String usuarioUid);
}
