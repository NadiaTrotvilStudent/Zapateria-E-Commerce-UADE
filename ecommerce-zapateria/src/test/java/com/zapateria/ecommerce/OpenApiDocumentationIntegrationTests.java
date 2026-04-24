package com.zapateria.ecommerce;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OpenApiDocumentationIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void openApiPublicaTagsYEndpointsConsistentes() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tags[*].name", hasItem("Catalogo")))
                .andExpect(jsonPath("$.tags[*].name", hasItem("Carrito")))
                .andExpect(jsonPath("$.tags[*].name", hasItem("Ordenes")))
                .andExpect(jsonPath("$.tags[*].name", not(hasItem("carrito-controller"))))
                .andExpect(jsonPath("$.tags[*].name", not(hasItem("orden-controller"))))
                .andExpect(jsonPath("$.paths['/api/categorias']").exists())
                .andExpect(jsonPath("$.paths['/api/auth/login'].post.summary").value("Iniciar sesion"))
                .andExpect(jsonPath("$.paths['/api/carrito'].get.summary").value("Obtener carrito"))
                .andExpect(jsonPath("$.paths['/api/ordenes'].get.summary").value("Listar mis ordenes"))
                .andExpect(jsonPath("$.paths['/api/carrito'].get.parameters").doesNotExist())
                .andExpect(jsonPath("$.paths['/api/ordenes'].get.parameters").doesNotExist());
    }
}
