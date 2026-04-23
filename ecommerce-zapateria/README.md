# Swagger / OpenAPI

Este proyecto expone documentacion interactiva de la API usando Swagger UI y OpenAPI.
Esto permite probar los endpoints desde el navegador o importar el contrato directamente en Postman.

## Levantar La Aplicacion

Desde la carpeta `ecommerce-zapateria`:

```bash
./mvnw spring-boot:run
```

Por defecto la API queda disponible en:

```text
http://localhost:8080
```

## URLs De Documentacion

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

OpenAPI JSON:

```text
http://localhost:8080/v3/api-docs
```

## Importar En Postman

1. Abrir Postman.
2. Ir a `Import`.
3. Seleccionar `Link`.
4. Pegar:

```text
http://localhost:8080/v3/api-docs
```

5. Confirmar la importacion.

Postman va a generar una coleccion con los endpoints disponibles.

## Probar Endpoints Protegidos

Primero hay que obtener un token.

Registro:

```http
POST /api/auth/register
```

```json
{
  "username": "juanperez",
  "email": "juan@mail.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Perez"
}
```

Login:

```http
POST /api/auth/login
```

```json
{
  "email": "juan@mail.com",
  "password": "password123"
}
```

La respuesta devuelve:

```json
{
  "tokenType": "Bearer",
  "accessToken": "...",
  "refreshToken": "..."
}
```

Para usar Swagger UI:

1. Copiar el `accessToken`.
2. Ir a `Authorize`.
3. Pegar el token como:

```text
Bearer TU_ACCESS_TOKEN
```

4. Confirmar.

Para usar Postman, agregar el header:

```http
Authorization: Bearer TU_ACCESS_TOKEN
```

## Refresh Token

El `accessToken` dura poco tiempo. Cuando vence, se usa el `refreshToken` para pedir uno nuevo:

```http
POST /api/auth/refresh
```

```json
{
  "refreshToken": "TU_REFRESH_TOKEN"
}
```

Importante: el refresh token se rota. Despues de llamar a `/api/auth/refresh`, el refresh token anterior deja de servir y hay que usar el nuevo que devuelve la respuesta.

## Rutas Publicas Y Protegidas

Publicas:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET /api/productos
GET /api/productos/{id}
GET /api/productos/{productoId}/variantes
GET /api/marcas
GET /api/generos
GET /api/tipos-producto
```

Requieren login:

```text
GET /api/usuarios/me
POST /api/auth/logout
```

Requieren rol `VENDEDOR` o `ADMIN`:

```text
POST /api/productos
PUT /api/productos/{id}
DELETE /api/productos/{id}
POST /api/productos/{productoId}/variantes
```

