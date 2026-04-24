# Ecommerce Zapateria

API REST de un ecommerce de zapateria, construida con Spring Boot 4.0.5, Java 21, MySQL 8.4 y autenticacion JWT.

Desarrollado como Trabajo Practico Obligatorio de la materia (UADE): permite registrar usuarios, publicar productos con multiples imagenes, navegar el catalogo por categoria, gestionar stock por variante (talle/color) y armar un carrito de compras con validacion de stock en cada operacion.

## Indice

- [Que Hace](#que-hace)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura Y Modelo De Datos](#arquitectura-y-modelo-de-datos)
- [Estructura Del Proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Levantar La Aplicacion](#levantar-la-aplicacion)
  - [Opcion 1: Todo en Docker](#opcion-1-todo-en-docker-mas-simple)
  - [Opcion 2: Solo MySQL en Docker + app local](#opcion-2-solo-mysql-en-docker-app-en-la-terminal-dev-local)
  - [Opcion 3: Sin Docker con H2 en memoria](#opcion-3-sin-docker-con-h2-en-memoria-perfil-local)
- [Base De Datos](#base-de-datos)
- [Tests](#tests)
- [Swagger / OpenAPI](#swagger--openapi)
- [Importar En Postman](#importar-en-postman)
- [Autenticacion](#autenticacion)
- [Rutas Publicas Y Protegidas](#rutas-publicas-y-protegidas)
- [Endpoints Por Dominio](#endpoints-por-dominio)
- [Comandos Utiles De Docker](#comandos-utiles-de-docker)
- [Smoke Test End-To-End](#smoke-test-end-to-end)
- [Campo Imagenes en Producto](#campo-imagenes-en-producto)
- [Troubleshooting](#troubleshooting)

## Que Hace

Funcionalidades principales, mapeadas a los casos de uso del TP:

### Gestion de usuarios
- Registro con `username`, `email`, `password`, `nombre`, `apellido`. El rol default es `CLIENTE`.
- Login por `email` + `password` con JWT (access 15min + refresh 7 dias, con rotacion).
- Tres roles: `CLIENTE` (navega y compra), `VENDEDOR` (publica productos), `ADMIN`.

### Catalogo de productos
- Listado publico de productos **ordenado alfabeticamente** (`GET /api/productos`).
- Listado publico de **categorias** (`GET /api/categorias`) para el home.
- Detalle de producto con descripcion e imagenes (`GET /api/productos/{id}`).
- Filtro por categoria: `GET /api/productos?categoriaId={id}`.
- Si una variante no tiene stock, el endpoint del carrito lo rechaza con mensaje claro.

### Gestion de productos (VENDEDOR / ADMIN)
- Alta de producto con **1 a 10 imagenes** (array de URLs), descripcion, precio, marca, categoria, genero, tipo.
- Gestion de stock via **variantes** (combinacion talle + color + stock).
- Edicion y eliminacion de productos.

### Carrito de compras (autenticado)
- Agregar producto, actualizar cantidad, eliminar item, vaciar.
- Valida stock en cada operacion contra la variante seleccionada.
- Calcula subtotales y total automaticamente.

### Ordenes
- Historial de compras del usuario autenticado.

## Stack Tecnologico

| Capa | Tecnologia |
|---|---|
| Lenguaje | Java 21 |
| Framework | Spring Boot 4.0.5 (Web MVC, Data JPA, Security) |
| Seguridad | OAuth2 Resource Server + JWT (HS256, Nimbus JOSE) |
| Persistencia (prod) | MySQL 8.4 |
| Persistencia (local/test) | H2 en memoria |
| ORM | Hibernate / JPA |
| Build | Maven (wrapper incluido: `./mvnw`) |
| Docs API | SpringDoc OpenAPI + Swagger UI |
| Validacion | Jakarta Bean Validation |
| Container | Docker + docker-compose (multi-stage build) |
| Boilerplate | Lombok |

## Arquitectura Y Modelo De Datos

Arquitectura clasica en capas Spring Boot: **Controller → Service → Repository (JPA) → MySQL**. DTOs para request/response, Entity para persistencia.

Entidades principales y relaciones:

```text
Usuario ─────< Producto (uno crea muchos)
Usuario ──1:1── Carrito ────< ItemCarrito >─── VarianteProducto
Usuario ─────< Orden ────< DetalleOrden >─── VarianteProducto
Usuario ─────< RefreshToken

Producto >─── Marca
         >─── Categoria
         >─── Genero
         >─── TipoProducto
         ────< VarianteProducto (talle + color + stock)
         ────< ImagenProducto    (url + orden)
```

- **Producto** es el articulo base (nombre, descripcion, precio, imagenes). No tiene stock propio: el stock vive en sus `VarianteProducto`.
- **VarianteProducto** representa la combinacion talle/color con stock individual. Es lo que se agrega al carrito.
- **ImagenProducto** permite 1 a 10 URLs ordenadas por producto.
- **Carrito** es 1:1 con Usuario (se crea lazy en el primer POST).

## Estructura Del Proyecto

```text
ecommerce-zapateria/
├── pom.xml                     # Dependencias Maven
├── Dockerfile                  # Build multi-stage (JDK → JRE)
├── README.md
└── src/main/
    ├── java/com/zapateria/ecommerce/
    │   ├── EcommerceZapateriaApplication.java
    │   ├── config/             # SecurityConfig, OpenApiConfig, LocalSeeder
    │   ├── controller/         # Endpoints REST (uno por dominio)
    │   ├── service/            # Logica de negocio
    │   ├── repository/         # Spring Data JPA
    │   ├── model/              # Entidades JPA
    │   ├── dto/
    │   │   ├── auth/           # Login, Registro, Refresh, AuthResponse
    │   │   ├── producto/       # ProductoRequest/Response, Variante*
    │   │   ├── catalogo/       # Marca, Genero, Tipo, Categoria responses
    │   │   ├── orden/          # OrdenResponse, DetalleOrdenResponse
    │   │   └── common/         # ErrorResponse
    │   ├── security/           # JwtService, UserDetailsService
    │   └── exception/          # BadRequest, NotFound, Unauthorized, GlobalHandler
    └── resources/
        ├── application.properties         # Default (MySQL local:3307)
        ├── application-docker.properties  # Perfil docker (MySQL container)
        └── application-local.properties   # Perfil local (H2 en memoria)
```

Raiz del repo:

```text
Zapateria-E-Commerce-UADE/
├── docker-compose.yml          # Stack: app + MySQL 8.4
└── ecommerce-zapateria/        # Proyecto Spring Boot
```

## Requisitos

Segun como la quieras correr:

| Flujo | Requisitos |
|---|---|
| Todo en Docker | Docker Desktop (incluye `docker compose`) |
| Dev local | Docker Desktop + Java 21 (JDK) |
| H2 in-memory (perfil `local`) | Java 21 (JDK). No requiere Docker ni MySQL |
| Solo tests | Java 21 (JDK). No requiere Docker ni MySQL |

En Mac con Homebrew:

```bash
brew install --cask docker
brew install openjdk@21
```

Acordate de abrir Docker Desktop una vez despues de instalarlo para que cree los symlinks del CLI.

## Levantar La Aplicacion

Hay tres formas de correr el stack. Todas dejan la API en `http://localhost:8080`.

### Opcion 1: Todo en Docker (mas simple)

Desde la raiz del repo:

```bash
docker compose up --build
```

Esto:

1. Construye la imagen de la app (multi-stage: JDK 21 para compilar, JRE 21 para runtime).
2. Levanta MySQL 8.4 y espera a que este healthy.
3. Arranca Spring Boot con el perfil `docker` activo, que apunta al host `mysql` de la red interna de Docker.

Para parar el stack: `docker compose down`. Los datos de MySQL persisten en el volumen `zapateria-mysql-data`, asi que al volver a levantar los usuarios/productos siguen ahi.

Para parar y borrar los datos: `docker compose down -v`.

### Opcion 2: Solo MySQL en Docker, app en la terminal (dev local)

Util para desarrollar con el IDE, hot reload de devtools, y breakpoints.

Desde la raiz del repo:

```bash
docker compose up -d mysql
```

Luego desde `ecommerce-zapateria/`:

```bash
./mvnw spring-boot:run
```

La app usa `application.properties` (sin perfil activo), que apunta a `localhost:3307` (el puerto que docker-compose expone para MySQL).

### Opcion 3: Sin Docker con H2 en memoria (perfil `local`)

Util para probar la API rapidamente en una maquina que no tiene Docker ni MySQL. Corre con H2 en memoria y siembra datos de catalogo + un usuario vendedor pre-cargado para testear.

Desde `ecommerce-zapateria/`:

```bash
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

Esto:

1. Activa el perfil `local`, que lee `application-local.properties` con H2 en memoria (`jdbc:h2:mem:zapateria`).
2. Ejecuta `LocalSeeder` al startup, que inserta:
   - **Categorias:** Zapatillas, Botas, Sandalias.
   - **Generos:** Hombre, Mujer, Unisex.
   - **Marcas:** Nike, Adidas.
   - **Tipos de producto:** Running, Casual.
   - **Usuario vendedor:** `vendedor1@test.com` / `Password123!` con rol `VENDEDOR` (para poder crear productos sin setup manual).

**Importante:** al ser in-memory, los datos se pierden cuando se apaga la app. Este flujo es solo para testing / demo / smoke tests. Para desarrollo real usar las opciones 1 o 2 con MySQL persistente.

Consola H2 (si queres inspeccionar tablas): [http://localhost:8080/h2-console](http://localhost:8080/h2-console) con JDBC URL `jdbc:h2:mem:zapateria`, user `sa`, sin password.

## Base De Datos

- **Motor:** MySQL 8.4.
- **Schema:** generado automaticamente por Hibernate (`spring.jpa.hibernate.ddl-auto=update`) a partir de las `@Entity` en `src/main/java/com/zapateria/ecommerce/model/`. No hay migraciones SQL.
- **Credenciales de dev** (hardcodeadas en `application.properties` y `docker-compose.yml`):
  - Base: `zapateria`
  - Usuario: `zapateria`
  - Password: `zapateria`
  - Root password: `root`

### Puertos

| Desde | Host | Puerto |
|---|---|---|
| Tu Mac → MySQL (cliente externo tipo DBeaver) | `localhost` | **3307** |
| Container de la app → MySQL (red interna Docker) | `mysql` | 3306 |

El puerto 3307 externo evita conflicto con cualquier otro MySQL que tengas corriendo localmente. Internamente Docker sigue usando 3306.

### Conectarse a la DB con un cliente grafico

Datos para DBeaver / TablePlus / MySQL Workbench / IntelliJ Database:

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Port | `3307` |
| Database | `zapateria` |
| User | `zapateria` |
| Password | `zapateria` |

### Conectarse por linea de comandos

Entrando al contenedor:

```bash
docker exec -it zapateria-mysql mysql -uzapateria -pzapateria zapateria
```

O desde tu Mac (si tenes instalado `mysql-client`):

```bash
mysql -h 127.0.0.1 -P 3307 -uzapateria -pzapateria zapateria
```

## Tests

Los tests usan H2 en memoria via el perfil `test`, asi que no necesitan Docker ni MySQL corriendo.

Desde `ecommerce-zapateria/`:

```bash
./mvnw test
```

## Swagger / OpenAPI

Con la app corriendo, disponible en:

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

## Importar En Postman

1. Abrir Postman.
2. Ir a `Import`.
3. Seleccionar `Link`.
4. Pegar:

```text
http://localhost:8080/v3/api-docs
```

5. Confirmar la importacion.

Postman genera una coleccion con todos los endpoints.

## Autenticacion

### Registro

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

Respuesta 201 con tokens y datos del usuario (rol `CLIENTE` por defecto).

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "juan@mail.com",
  "password": "password123"
}
```

Respuesta 200:

```json
{
  "tokenType": "Bearer",
  "accessToken": "...",
  "refreshToken": "...",
  "usuario": { "...": "..." }
}
```

### Usar el token

En Swagger UI:

1. Copiar el `accessToken`.
2. Ir a `Authorize`.
3. Pegar como: `Bearer TU_ACCESS_TOKEN`.
4. Confirmar.

En Postman / curl, agregar header:

```http
Authorization: Bearer TU_ACCESS_TOKEN
```

### Refresh Token

El `accessToken` dura **15 minutos**. Cuando vence, se usa el `refreshToken` (dura **7 dias**) para pedir uno nuevo:

```http
POST /api/auth/refresh
```

```json
{
  "refreshToken": "TU_REFRESH_TOKEN"
}
```

**Importante:** el refresh token se rota. Despues de llamar a `/api/auth/refresh`, el refresh token anterior deja de servir y hay que usar el nuevo que devuelve la respuesta.

### Logout

```http
POST /api/auth/logout
Authorization: Bearer TU_ACCESS_TOKEN
```

```json
{
  "refreshToken": "TU_REFRESH_TOKEN"
}
```

Revoca el refresh token.

## Rutas Publicas Y Protegidas

### Publicas (no requieren token)

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

### Requieren login (cualquier rol)

```text
GET  /api/usuarios/me
POST /api/auth/logout
```

### Requieren rol `VENDEDOR` o `ADMIN`

```text
POST   /api/productos
PUT    /api/productos/{id}
DELETE /api/productos/{id}
POST   /api/productos/{productoId}/variantes
```

## Endpoints Por Dominio

Tabla completa de endpoints agrupados por responsabilidad. Los `auth` indican si requieren token.

### Auth (`/api/auth`)

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| POST | `/register` | no | Crear usuario (rol CLIENTE). Retorna JWT. |
| POST | `/login` | no | Login email+password. Retorna JWT. |
| POST | `/refresh` | no | Renovar access token (rota refresh). |
| POST | `/logout` | si | Revoca el refresh token. |

### Usuarios (`/api/usuarios`)

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| GET | `/me` | si | Perfil del usuario autenticado. |

### Productos (`/api/productos`)

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| GET | `` | no | Listar productos ordenados alfabeticamente. Soporta `?categoriaId=`. |
| GET | `/{id}` | no | Detalle de un producto con imagenes y variantes. |
| POST | `` | VENDEDOR/ADMIN | Alta de producto (con array `imagenes`). |
| PUT | `/{id}` | VENDEDOR/ADMIN | Editar producto. |
| DELETE | `/{id}` | VENDEDOR/ADMIN | Eliminar producto. |

### Variantes (`/api/productos/{productoId}/variantes`)

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| GET | `` | no | Listar variantes (talle + color + stock) del producto. |
| POST | `` | VENDEDOR/ADMIN | Crear variante con stock inicial. |

### Catalogo auxiliar (publico)

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/categorias` | Categorias ordenadas alfabeticamente. |
| GET | `/api/marcas` | Marcas disponibles. |
| GET | `/api/generos` | Generos (Hombre, Mujer, Unisex). |
| GET | `/api/tipos-producto` | Tipos (Running, Casual, etc). |

### Carrito (`/api/carrito`)

Todos requieren autenticacion. Cada usuario tiene un unico carrito (1:1).

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `` | Ver carrito actual. |
| POST | `` | Agregar item. Body: `{varianteProductoId, cantidad}`. Valida stock. |
| PATCH | `/items/{itemId}` | Cambiar cantidad de un item. |
| DELETE | `/items/{itemId}` | Quitar un item. |
| DELETE | `` | Vaciar carrito. |

### Ordenes (`/api/ordenes`)

Todos requieren autenticacion. Solo lectura del historial propio.

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `` | Mis ordenes. |
| GET | `/{ordenId}` | Detalle de una orden propia. |

## Comandos Utiles De Docker

Desde la raiz del repo:

```bash
# Ver estado de los containers
docker compose ps

# Seguir los logs de la app
docker compose logs -f app

# Seguir los logs de MySQL
docker compose logs -f mysql

# Rebuildar la imagen despues de cambios en el codigo
docker compose up --build

# Parar todo (datos persisten)
docker compose down

# Parar y BORRAR los datos (cuidado)
docker compose down -v

# Abrir un shell dentro del contenedor de la app
docker exec -it zapateria-app sh

# Abrir el cliente mysql dentro del contenedor
docker exec -it zapateria-mysql mysql -uzapateria -pzapateria zapateria
```

## Smoke Test End-To-End

Con la app corriendo en perfil `local` (ver Opcion 3), este script valida el flujo completo del TP: registro, login, catalogo, alta de producto con multiples imagenes, variantes/stock, agregar al carrito, validacion de stock insuficiente, y borrado.

```bash
BASE=http://localhost:8080

# Registrar un cliente
curl -s -X POST $BASE/api/auth/register -H "Content-Type: application/json" \
  -d '{"username":"cliente1","email":"cliente1@test.com","password":"Password123!","nombre":"Ana","apellido":"Gomez"}'

# Login como el vendedor pre-seedeado
VTOKEN=$(curl -s -X POST $BASE/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"vendedor1@test.com","password":"Password123!"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['accessToken'])")

# Crear producto con 3 imagenes (vendedor)
curl -s -X POST $BASE/api/productos -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VTOKEN" \
  -d '{"nombre":"Air Max 90","descripcion":"Zapatilla clasica","precio":150.00,
       "imagenes":["https://img/a.jpg","https://img/b.jpg","https://img/c.jpg"],
       "marcaId":1,"tipoProductoId":1,"generoId":1,"categoriaId":1,"usuarioCreadorId":1}'

# Listar productos (publico, orden alfabetico)
curl -s $BASE/api/productos

# Listar categorias (publico)
curl -s $BASE/api/categorias
```

## Campo Imagenes en Producto

A partir de la ultima version, `Producto` soporta **una o mas imagenes** por producto. El campo `imagenes` es un array de URLs (entre 1 y 10, max 255 chars cada una):

```json
{
  "nombre": "Air Max 90",
  "descripcion": "...",
  "precio": 150.00,
  "imagenes": ["https://img.com/1.jpg", "https://img.com/2.jpg"],
  "marcaId": 1,
  "tipoProductoId": 1,
  "generoId": 1,
  "categoriaId": 1,
  "usuarioCreadorId": 1
}
```

Se persisten en la tabla `imagenes_producto` preservando el orden en el que se envian. La primera imagen se considera la "principal" para listados.

## Troubleshooting

**"ports are not available: 3306/3307/8080 already in use"**
Ya hay algo escuchando en ese puerto. Podes:
- Buscar y parar el proceso: `lsof -i :8080` (reemplazar puerto).
- O cambiar el mapeo en `docker-compose.yml` (ej. `"8081:8080"` para exponer la app en 8081).

**"command not found: docker"**
Docker Desktop no esta instalado o no se abrio nunca. Instalar y abrir Docker Desktop una vez para que cree los symlinks del CLI.

**La app no se conecta a MySQL (flujo local con `./mvnw`)**
Verificar que el contenedor esta corriendo: `docker compose ps`. Deberia decir `zapateria-mysql ... Up (healthy)`. Si no, `docker compose up -d mysql`.

**"Table 'zapateria.xxx' doesn't exist" despues de cambiar una entidad**
Hibernate esta en modo `update`, que agrega columnas pero no siempre resuelve todos los cambios de schema. Para arrancar limpio: `docker compose down -v` + `docker compose up --build`.
