
package com.dev2life.backend.controller;

import com.dev2life.backend.model.Nota;
import com.dev2life.backend.repository.NotaRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
@CrossOrigin(origins = "http://localhost:5173")
public class NotaController {

    private final NotaRepository repository;

    public NotaController(NotaRepository repository) {
        this.repository = repository;
    }

    private String obterUid(HttpServletRequest request) {
        Object uid = request.getAttribute("firebaseUid");

        if (uid == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado."
            );
        }

        return uid.toString();
    }

    @GetMapping
    public List<Nota> listar(HttpServletRequest request) {
        String uid = obterUid(request);
        return repository.findByUsuarioUid(uid);
    }

    @GetMapping("/{id}")
    public Nota buscarPorId(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String uid = obterUid(request);

        return repository.findByIdAndUsuarioUid(id, uid)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nota não encontrada."
                ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Nota criar(
            @Valid @RequestBody Nota dados,
            HttpServletRequest request
    ) {
        String uid = obterUid(request);

        Nota nota = new Nota();
        nota.setTitulo(dados.getTitulo());
        nota.setConteudo(dados.getConteudo());
        nota.setUsuarioUid(uid);

        return repository.save(nota);
    }

    @PutMapping("/{id}")
    public Nota atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Nota dados,
            HttpServletRequest request
    ) {
        String uid = obterUid(request);

        Nota nota = repository.findByIdAndUsuarioUid(id, uid)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nota não encontrada."
                ));

        nota.setTitulo(dados.getTitulo());
        nota.setConteudo(dados.getConteudo());

        return repository.save(nota);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String uid = obterUid(request);

        Nota nota = repository.findByIdAndUsuarioUid(id, uid)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nota não encontrada."
                ));

        repository.delete(nota);
    }
}
