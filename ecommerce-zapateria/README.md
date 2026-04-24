# Ecommerce Zapateria

API REST de un ecommerce de zapateria, construida con Spring Boot 4.0.5, Java 21, MySQL 8.4 y autenticacion JWT.

## Indice

- [Requisitos](#requisitos)
- [Levantar La Aplicacion](#levantar-la-aplicacion)
  - [Opcion 1: Todo en Docker](#opcion-1-todo-en-docker-mas-simple)
  - [Opcion 2: Solo MySQL en Docker + app local](#opcion-2-solo-mysql-en-docker-app-en-la-terminal-dev-local)
- [Base De Datos](#base-de-datos)
- [Tests](#tests)
- [Swagger / OpenAPI](#swagger--openapi)
- [Importar En Postman](#importar-en-postman)
- [Autenticacion](#autenticacion)
- [Rutas Publicas Y Protegidas](#rutas-publicas-y-protegidas)
- [Comandos Utiles De Docker](#comandos-utiles-de-docker)
- [Troubleshooting](#troubleshooting)

## Requisitos

Segun como la quieras correr:

| Flujo | Requisitos |
|---|---|
| Todo en Docker | Docker Desktop (incluye `docker compose`) |
| Dev local | Docker Desktop + Java 21 (JDK) |
| Solo tests | Java 21 (JDK). No requiere Docker ni MySQL |

En Mac con Homebrew:

```bash
brew install --cask docker
brew install openjdk@21
```

Acordate de abrir Docker Desktop una vez despues de instalarlo para que cree los symlinks del CLI.

## Levantar La Aplicacion

Hay dos formas de correr el stack. Ambas dejan la API en `http://localhost:8080`.

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
