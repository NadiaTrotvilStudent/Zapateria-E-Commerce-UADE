# Ecommerce Zapateria

Backend REST de una zapateria online hecho para un TP de UADE.

La idea del proyecto es cubrir el flujo basico de un ecommerce: registro y login de usuarios, catalogo publico, productos con imagenes y variantes, carrito con validacion de stock y consulta de ordenes del usuario autenticado.

No es una plataforma "enterprise" ni pretende serlo. Esta pensado para resolver bien el alcance del trabajo practico y dejar una base prolija para seguir agregando cosas si hace falta.

## Que incluye

- Registro de usuarios y login con JWT.
- Roles `CLIENTE`, `VENDEDOR` y `ADMIN`.
- Catalogo publico de productos y categorias.
- Productos con 1 a 10 imagenes.
- Stock manejado por variante (`talle` + `color`).
- Carrito por usuario con validacion de stock en cada cambio.
- Historial de ordenes del usuario autenticado.
- Swagger/OpenAPI para probar la API.

## Stack

- Java 17 para compilar el proyecto.
- Spring Boot 4.0.5.
- Spring Security + JWT.
- Spring Data JPA + Hibernate.
- MySQL 8.4 para desarrollo normal.
- H2 en memoria para perfil local y tests.
- Maven Wrapper (`./mvnw`).
- Docker Compose para levantar app + base.

Nota: el `Dockerfile` usa imagenes Temurin 21. Localmente conviene usar Java 17 o superior.

## Estructura general

Arquitectura clasica en capas:

`Controller -> Service -> Repository -> DB`

Entidades principales:

- `Usuario`
- `Producto`
- `VarianteProducto`
- `ImagenProducto`
- `Carrito`
- `ItemCarrito`
- `Orden`
- `DetalleOrden`
- `RefreshToken`

La decision importante del modelo es que el stock no vive en `Producto`, sino en `VarianteProducto`. Eso evita mezclar, por ejemplo, talle 40 negro con talle 42 blanco como si fueran el mismo item.

## Como correrlo

La API queda en `http://localhost:8080` en cualquiera de estos flujos.

### Opcion 1: todo con Docker

Desde la raiz del repo:

```bash
docker compose up --build
```

Esto levanta:

- MySQL en `localhost:3307`
- la app Spring Boot en `localhost:8080`

Para bajar todo:

```bash
docker compose down
```

Si tambien queres borrar los datos:

```bash
docker compose down -v
```

### Opcion 2: MySQL en Docker y app local

Primero, desde la raiz:

```bash
docker compose up -d mysql
```

Despues, desde `ecommerce-zapateria/`:

```bash
./mvnw spring-boot:run
```

Este flujo sirve mas si queres usar el IDE, poner breakpoints o iterar mas rapido.

### Opcion 3: sin Docker, con H2 en memoria

Desde `ecommerce-zapateria/`:

```bash
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

Este perfil no necesita MySQL. Es util para probar rapido o correr un smoke test sin levantar nada extra.

Con H2 los datos se pierden al apagar la app.

## Requisitos

Segun como lo quieras correr:

- Docker completo: Docker Desktop.
- App local contra MySQL: Docker Desktop + Java 17 o superior.
- Perfil `local`: Java 17 o superior.
- Solo tests: Java 17 o superior.

Si estas en Mac y te falta el entorno:

```bash
brew install --cask docker
brew install openjdk@21
```

## Base de datos

Para desarrollo con MySQL, la configuracion actual usa:

- host: `localhost`
- puerto: `3307`
- base: `zapateria`
- usuario: `zapateria`
- password: `zapateria`

Hibernate esta con `ddl-auto=update`, asi que el schema se va armando desde las entidades. No hay migraciones SQL en este repo.

Si queres conectarte desde DBeaver, TablePlus o algo parecido, esos mismos datos te alcanzan.

Por linea de comandos:

```bash
docker exec -it zapateria-mysql mysql -uzapateria -pzapateria zapateria
```

## Datos demo

El proyecto tiene un seeder para que no arranque vacio.

Segun el perfil, se cargan categorias, marcas, generos, tipos de producto y algunos productos de ejemplo. Tambien queda creado un vendedor para probar altas:

- `vendedor1@test.com`
- `Password123!`

Si corres el perfil `local`, tambien podes entrar a la consola H2 en:

`http://localhost:8080/h2-console`

Con estos datos:

- JDBC URL: `jdbc:h2:mem:zapateria`
- user: `sa`
- password: vacio

## Swagger y Postman

Con la app levantada:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Si queres importarlo en Postman, alcanza con pegar esta URL:

```text
http://localhost:8080/v3/api-docs
```

## Autenticacion

### Registro

`POST /api/auth/register`

```json
{
  "username": "juanperez",
  "email": "juan@mail.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Perez"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "juan@mail.com",
  "password": "password123"
}
```

La respuesta devuelve `accessToken`, `refreshToken` y los datos del usuario.

El `accessToken` dura 15 minutos y el `refreshToken` 7 dias. El refresh rota: cuando pedis uno nuevo, el anterior deja de servir.

### Header para endpoints protegidos

```http
Authorization: Bearer TU_ACCESS_TOKEN
```

## Rutas principales

### Publicas

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/productos
GET  /api/productos/{id}
GET  /api/productos/{productoId}/variantes
GET  /api/marcas
GET  /api/generos
GET  /api/tipos-producto
GET  /api/categorias
```

### Con login

```text
GET  /api/usuarios/me
POST /api/auth/logout
GET  /api/carrito
POST /api/carrito
PATCH /api/carrito/items/{itemId}
DELETE /api/carrito/items/{itemId}
DELETE /api/carrito
GET  /api/ordenes
GET  /api/ordenes/{ordenId}
```

### Solo `VENDEDOR` o `ADMIN`

```text
POST   /api/productos
PUT    /api/productos/{id}
DELETE /api/productos/{id}
POST   /api/productos/{productoId}/variantes
```

## Ejemplo rapido de flujo

Con la app corriendo:

```bash
BASE=http://localhost:8080

curl -s -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"cliente1","email":"cliente1@test.com","password":"Password123!","nombre":"Ana","apellido":"Gomez"}'

VTOKEN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendedor1@test.com","password":"Password123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[\"accessToken\"])")

curl -s -X POST $BASE/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VTOKEN" \
  -d '{"nombre":"Air Max 90","descripcion":"Zapatilla clasica","precio":150.00,"imagenes":["https://img/a.jpg","https://img/b.jpg"],"marcaId":1,"tipoProductoId":1,"generoId":1,"categoriaId":1,"usuarioCreadorId":1}'
```

## Imagenes de producto

Cada producto acepta un array `imagenes` con URLs. El limite actual es de 1 a 10 imagenes por producto.

Ejemplo:

```json
{
  "nombre": "Air Max 90",
  "descripcion": "Zapatilla clasica",
  "precio": 150.00,
  "imagenes": [
    "https://img.com/1.jpg",
    "https://img.com/2.jpg"
  ],
  "marcaId": 1,
  "tipoProductoId": 1,
  "generoId": 1,
  "categoriaId": 1,
  "usuarioCreadorId": 1
}
```

Se guardan en `imagenes_producto` respetando el orden recibido.

## Tests

Desde `ecommerce-zapateria/`:

```bash
./mvnw test
```

Los tests usan H2 en memoria con perfil `test`, asi que no dependen de MySQL ni de Docker.

## Comandos utiles

Desde la raiz del repo:

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f mysql
docker compose up --build
docker compose down
docker compose down -v
```

## Problemas comunes

### El puerto 8080 o 3307 ya esta en uso

Busca el proceso:

```bash
lsof -i :8080
```

O cambia los puertos en `docker-compose.yml`.

### `docker: command not found`

Docker Desktop no esta instalado o no se abrio nunca despues de instalarlo.

### La app no conecta a MySQL en el flujo local

Verifica que el contenedor este arriba:

```bash
docker compose ps
```

Si hace falta:

```bash
docker compose up -d mysql
```

### Cambiaste entidades y la base quedo rara

Con `ddl-auto=update`, algunos cambios de schema no quedan bien resueltos. Si queres arrancar limpio:

```bash
docker compose down -v
docker compose up --build
```
