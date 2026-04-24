package com.zapateria.ecommerce;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthSecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registroDevuelveTokensYUsuarioCliente() throws Exception {
        String username = "user-" + UUID.randomUUID();
        String email = username + "@mail.com";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "email": "%s",
                                  "password": "password123",
                                  "nombre": "Juan",
                                  "apellido": "Perez"
                                }
                                """.formatted(username, email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.usuario.email").value(email))
                .andExpect(jsonPath("$.usuario.roles[0]").value("CLIENTE"));
    }

    @Test
    void refreshTokenRotaYLogoutRevoca() throws Exception {
        JsonNode registro = registrarUsuario();
        String refreshToken = registro.get("refreshToken").asText();

        String refreshResponse = mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "refreshToken": "%s"
                                }
                                """.formatted(refreshToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String nuevoRefreshToken = objectMapper.readTree(refreshResponse).get("refreshToken").asText();

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "refreshToken": "%s"
                                }
                                """.formatted(refreshToken)))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + registro.get("accessToken").asText())
                        .content("""
                                {
                                  "refreshToken": "%s"
                                }
                                """.formatted(nuevoRefreshToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "refreshToken": "%s"
                                }
                                """.formatted(nuevoRefreshToken)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void catalogoEsPublicoPeroEscrituraDeProductosRequiereRolVendedorOAdmin() throws Exception {
        String accessTokenCliente = registrarUsuario().get("accessToken").asText();

        mockMvc.perform(get("/api/marcas"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + accessTokenCliente)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginConCredencialesInvalidasDevuelveUnauthorized() throws Exception {
        String username = "login-" + UUID.randomUUID();
        String email = username + "@mail.com";
        registrarUsuario(username, email);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "incorrecta"
                                }
                                """.formatted(email)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("Credenciales invalidas")));
    }

    private JsonNode registrarUsuario() throws Exception {
        String username = "user-" + UUID.randomUUID();
        String email = username + "@mail.com";
        return registrarUsuario(username, email);
    }

    private JsonNode registrarUsuario(String username, String email) throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "email": "%s",
                                  "password": "password123",
                                  "nombre": "Juan",
                                  "apellido": "Perez"
                                }
                                """.formatted(username, email)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response);
    }
}
