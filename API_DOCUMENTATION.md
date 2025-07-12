# Citizen API - Documentación de Endpoints

## Configuración de Swagger

La API está completamente documentada con Swagger. Después de iniciar el servidor, puedes acceder a la documentación interactiva en:

```
http://localhost:{PORT}/api/docs
```

## Autenticación

La API utiliza JWT Bearer tokens para la autenticación. Para endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer {tu-jwt-token}
```

## Endpoints Disponibles

### 🔐 Autenticación (`/auth`)

#### 1. Registrar Usuario
- **Endpoint:** `POST /api/auth/register`
- **Descripción:** Crea un nuevo usuario en el sistema
- **Requiere Autenticación:** No
- **Parámetros del Body:**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumer": "555123456",
    "isActive": true
  }
  ```
- **Respuesta Exitosa (201):**
  ```json
  {
    "id": "uuid-generated",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumer": "555123456",
    "isActive": true,
    "roles": ["user"],
    "token": "jwt-token-generated"
  }
  ```

#### 2. Iniciar Sesión
- **Endpoint:** `POST /api/auth/login`
- **Descripción:** Autentica un usuario y devuelve un token JWT
- **Requiere Autenticación:** No
- **Parámetros del Body:**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123"
  }
  ```
- **Respuesta Exitosa (200):**
  ```json
  {
    "id": "uuid-generated",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumer": "555123456",
    "isActive": true,
    "roles": ["user"],
    "token": "jwt-token-generated"
  }
  ```

#### 3. Verificar Estado de Autenticación
- **Endpoint:** `GET /api/auth/check-status`
- **Descripción:** Verifica si el token JWT es válido
- **Requiere Autenticación:** Sí
- **Respuesta Exitosa (200):**
  ```json
  {
    "id": "uuid-generated",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumer": "555123456",
    "isActive": true,
    "roles": ["user"],
    "token": "jwt-token-refreshed"
  }
  ```

---

### 📁 Gestión de Archivos (`/files`)

#### 1. Subir Imagen para Incidencia
- **Endpoint:** `POST /api/files/incidencia/images`
- **Descripción:** Permite subir una imagen asociada a una incidencia
- **Requiere Autenticación:** No
- **Parámetros del Body:** Form-data con archivo
  - `file`: Archivo de imagen (JPG, PNG, GIF)
- **Respuesta Exitosa (201):**
  ```json
  "https://api.example.com/files/incidencia/01d08057-b9b0-451f-94d3-fb8751cf9b7c.png"
  ```

#### 2. Obtener Imagen de Incidencia
- **Endpoint:** `GET /api/files/incidencia/:imageName`
- **Descripción:** Retorna una imagen por su nombre
- **Requiere Autenticación:** No
- **Parámetros de Ruta:**
  - `imageName`: Nombre del archivo (ej: `01d08057-b9b0-451f-94d3-fb8751cf9b7c.png`)
- **Respuesta Exitosa (200):** Archivo binario de imagen

---

### 🚨 Gestión de Incidencias (`/incidencia`)

#### 1. Crear Nueva Incidencia
- **Endpoint:** `POST /api/incidencia`
- **Descripción:** Permite crear una nueva incidencia
- **Requiere Autenticación:** Sí
- **Parámetros del Body:**
  ```json
  {
    "title": "Bache en calle principal",
    "description": "Hay un bache grande en la calle principal que puede causar daños a los vehículos",
    "generated_details": "Incidencia reportada por el sistema de IA",
    "reported_date": "2024-01-15T10:30:00Z",
    "tags": ["infraestructura", "urgente", "calle"],
    "lat": "19.4326",
    "long": "-99.1332",
    "priority": "ALTA",
    "images": [
      "https://api.example.com/files/incidencia/image1.jpg",
      "https://api.example.com/files/incidencia/image2.jpg"
    ]
  }
  ```
- **Respuesta Exitosa (201):**
  ```json
  {
    "id": "uuid-generated",
    "title": "Bache en calle principal",
    "description": "Hay un bache grande en la calle principal que puede causar daños a los vehículos",
    "reported_date": "2024-01-15T10:30:00Z",
    "priority": "ALTA",
    "lat": "19.4326",
    "long": "-99.1332",
    "tags": ["infraestructura", "urgente", "calle"],
    "images": [
      { "id": 1, "url": "https://api.example.com/files/incidencia/image1.jpg" }
    ],
    "user": {
      "id": "user-uuid",
      "email": "usuario@ejemplo.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    }
  }
  ```

#### 2. Obtener Todas las Incidencias (Solo Admin)
- **Endpoint:** `GET /api/incidencia`
- **Descripción:** Retorna todas las incidencias con paginación
- **Requiere Autenticación:** Sí (Solo Admin)
- **Parámetros de Query:**
  - `limit` (opcional): Número máximo de elementos a retornar
  - `offset` (opcional): Número de elementos a saltar
- **Respuesta Exitosa (200):**
  ```json
  [
    {
      "id": "uuid-1",
      "title": "Bache en calle principal",
      "description": "Descripción del bache",
      "reported_date": "2024-01-15T10:30:00Z",
      "priority": "ALTA",
      "lat": "19.4326",
      "long": "-99.1332",
      "tags": ["infraestructura"],
      "images": [],
      "user": {
        "id": "user-uuid",
        "email": "usuario@ejemplo.com",
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    }
  ]
  ```

#### 3. Obtener Incidencia por ID o Título
- **Endpoint:** `GET /api/incidencia/:term`
- **Descripción:** Busca una incidencia específica por su ID o título
- **Requiere Autenticación:** Sí
- **Parámetros de Ruta:**
  - `term`: ID de la incidencia o título para buscar
- **Respuesta Exitosa (200):**
  ```json
  {
    "id": "uuid-generated",
    "title": "Bache en calle principal",
    "description": "Hay un bache grande en la calle principal",
    "reported_date": "2024-01-15T10:30:00Z",
    "priority": "ALTA",
    "lat": "19.4326",
    "long": "-99.1332",
    "tags": ["infraestructura", "urgente"],
    "images": [
      { "id": 1, "url": "https://api.example.com/files/incidencia/image1.jpg" }
    ],
    "user": {
      "id": "user-uuid",
      "email": "usuario@ejemplo.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    }
  }
  ```

#### 4. Buscar Incidencias por Título
- **Endpoint:** `GET /api/incidencia/title/:term`
- **Descripción:** Busca incidencias que contengan el término en su título
- **Requiere Autenticación:** Sí
- **Parámetros de Ruta:**
  - `term`: Término a buscar en los títulos
- **Parámetros de Query:**
  - `limit` (opcional): Número máximo de elementos a retornar
  - `offset` (opcional): Número de elementos a saltar
- **Respuesta Exitosa (200):** Array de incidencias que coinciden

#### 5. Actualizar Incidencia (Solo Admin)
- **Endpoint:** `PATCH /api/incidencia/:id`
- **Descripción:** Permite actualizar una incidencia existente
- **Requiere Autenticación:** Sí (Solo Admin)
- **Parámetros de Ruta:**
  - `id`: ID de la incidencia a actualizar
- **Parámetros del Body:** Campos opcionales de `CreateIncidenciaDto`
- **Respuesta Exitosa (200):** Incidencia actualizada

#### 6. Eliminar Incidencia (Solo Admin)
- **Endpoint:** `DELETE /api/incidencia/:id`
- **Descripción:** Permite eliminar una incidencia existente
- **Requiere Autenticación:** Sí (Solo Admin)
- **Parámetros de Ruta:**
  - `id`: ID de la incidencia a eliminar
- **Respuesta Exitosa (200):**
  ```json
  {
    "message": "Incidencia deleted successfully"
  }
  ```

---

## Códigos de Estado HTTP

### Respuestas Exitosas
- **200 OK**: Petición procesada correctamente
- **201 Created**: Recurso creado exitosamente

### Errores del Cliente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: No autorizado (token inválido o faltante)
- **403 Forbidden**: Acceso denegado (permisos insuficientes)
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: usuario ya existe)

### Errores del Servidor
- **500 Internal Server Error**: Error interno del servidor

---

## Validaciones y Reglas de Negocio

### Usuarios
- **Email**: Debe ser un email válido y único
- **Contraseña**: Mínimo 3 caracteres, debe contener al menos una mayúscula, una minúscula y un número
- **Nombre y Apellido**: Mínimo 2 caracteres
- **Teléfono**: Entre 9 y 11 caracteres

### Incidencias
- **Título**: Obligatorio, mínimo 1 carácter
- **Descripción**: Obligatorio, mínimo 1 carácter
- **Prioridad**: Debe ser uno de: `BAJA`, `MODERADA`, `ALTA`
- **Coordenadas**: Lat y Long como strings
- **Tags**: Array de strings (opcional)
- **Imágenes**: Array de URLs de imágenes

### Archivos
- **Formatos soportados**: JPG, PNG, GIF
- **Validación**: Se valida el tipo de archivo en el servidor

---

## Configuración para Desarrollo

1. **Iniciar el servidor:**
   ```bash
   npm run start:dev
   ```

2. **Acceder a la documentación:**
   ```
   http://localhost:{PORT}/api/docs
   ```

3. **Variables de entorno necesarias:**
   - `PORT`: Puerto del servidor
   - `HOST_API`: URL base de la API
   - Variables de base de datos y JWT

La documentación de Swagger está completamente configurada y proporciona una interfaz interactiva para probar todos los endpoints de la API. 