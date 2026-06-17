import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  fetchProductById,
  fetchCategorias,
  fetchMarcas,
  fetchGeneros,
  fetchTiposProducto,
  createProduct,
  updateProduct,
} from '@/services/productsService.js';
import { useFetch } from '@/hooks/useFetch.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

function ProductForm({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagenes: '',
    marcaId: '',
    tipoProductoId: '',
    generoId: '',
    categoriaId: '',
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorSave, setErrorSave] = useState(null);

  const { data: product, loading: loadingProduct, error: errorProduct } = useFetch(
    () => (isEdit ? fetchProductById(id) : Promise.resolve(null)),
    [id, isEdit],
  );

  const { data: categorias } = useFetch(() => fetchCategorias(), []);
  const { data: marcas } = useFetch(() => fetchMarcas(), []);
  const { data: generos } = useFetch(() => fetchGeneros(), []);
  const { data: tipos } = useFetch(() => fetchTiposProducto(), []);

  // Precargar formulario en modo editar
  useEffect(() => {
    if (isEdit && product) {
      setForm({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        imagenes: (product.imagenes || []).join('\n'),
        marcaId: product.marcaId || '',
        tipoProductoId: product.tipoProductoId || '',
        generoId: product.generoId || '',
        categoriaId: product.categoriaId || '',
      });
    }
  }, [isEdit, product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingSave(true);
    setErrorSave(null);

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        imagenes: form.imagenes
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url.length > 0),
        marcaId: Number(form.marcaId),
        tipoProductoId: Number(form.tipoProductoId),
        generoId: Number(form.generoId),
        categoriaId: Number(form.categoriaId),
        usuarioCreadorId: user?.id || 1,
      };

      if (isEdit) {
        await updateProduct(id, payload, accessToken);
      } else {
        await createProduct(payload, accessToken);
      }
      navigate('/mis-productos');
    } catch (err) {
      setErrorSave(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  if (isEdit && loadingProduct) {
    return (
      <section className="page page--narrow" aria-labelledby="product-form-title">
        <Loader message="Cargando producto..." />
      </section>
    );
  }

  if (isEdit && errorProduct) {
    return (
      <section className="page page--narrow" aria-labelledby="product-form-title">
        <ErrorMessage>{errorProduct}</ErrorMessage>
      </section>
    );
  }

  return (
    <section className="page page--narrow" aria-labelledby="product-form-title">
      <div className="page__header">
        <p className="eyebrow">Productos</p>
        <h1 id="product-form-title">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>
        <p>
          {isEdit
            ? 'Modifica los datos del producto y guarda los cambios.'
            : 'Completa el formulario para publicar un producto en el catalogo.'}
        </p>
      </div>

      <form className="placeholder-panel form-panel" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required maxLength={100} />

        <label className="field-label" htmlFor="descripcion">Descripcion</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          maxLength={500}
          rows={4}
          style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)', color: 'var(--color-text)', font: 'inherit' }}
        />

        <label className="field-label" htmlFor="precio">Precio</label>
        <input id="precio" name="precio" type="number" min="0.01" step="0.01" value={form.precio} onChange={handleChange} required />

        <label className="field-label" htmlFor="imagenes">Imagenes (una por linea, min 1 max 10)</label>
        <textarea
          id="imagenes"
          name="imagenes"
          value={form.imagenes}
          onChange={handleChange}
          placeholder="https://ejemplo.com/img1.jpg"
          required
          rows={4}
          style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)', color: 'var(--color-text)', font: 'inherit' }}
        />

        <label className="field-label" htmlFor="marcaId">Marca</label>
        <select id="marcaId" name="marcaId" value={form.marcaId} onChange={handleChange} required>
          <option value="">Seleccionar marca</option>
          {(marcas || []).map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>

        <label className="field-label" htmlFor="tipoProductoId">Tipo de producto</label>
        <select id="tipoProductoId" name="tipoProductoId" value={form.tipoProductoId} onChange={handleChange} required>
          <option value="">Seleccionar tipo</option>
          {(tipos || []).map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <label className="field-label" htmlFor="generoId">Genero</label>
        <select id="generoId" name="generoId" value={form.generoId} onChange={handleChange} required>
          <option value="">Seleccionar genero</option>
          {(generos || []).map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
        </select>

        <label className="field-label" htmlFor="categoriaId">Categoria</label>
        <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
          <option value="">Seleccionar categoria</option>
          {(categorias || []).map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        {loadingSave && <Loader message="Guardando..." />}
        {errorSave && <ErrorMessage>{errorSave}</ErrorMessage>}

        <button className="button button--primary" type="submit" disabled={loadingSave}>
          {loadingSave ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </form>
    </section>
  );
}

export default ProductForm;
