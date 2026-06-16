# Frontend Zapateria E-Commerce

Base React + Vite para el frontend del e-commerce de zapateria.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

La app usa la variable:

```text
VITE_API_URL=http://localhost:8080/api
```

## Estructura

```text
src/
├── assets/
├── components/
├── context/
├── pages/
├── routes/
├── services/
└── styles/
```

## Rutas creadas

- `/login`
- `/register`
- `/home`
- `/productos/:id`
- `/carrito`
- `/checkout`
- `/productos/nuevo`
- `/productos/editar/:id`
- `/mis-productos`
- `/*`

`PrivateRoute` permite acceso libre por ahora y queda preparado para integrarse con `AuthContext`.
