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
  createProductVariant,
} from '@/services/productsService.js';
import { useFetch } from '@/hooks/useFetch.js';
import Loader from '@/components/Loader.jsx';
import ErrorMessage from '@/components/ErrorMessage.jsx';

const emptyForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  imagenes: '',
  marcaId: '',
  tipoProductoId: '',
  generoId: '',
  categoriaId: '',
};

const emptyVariant = {
  talle: '',
  color: '',
  stock: '',
};

function ProductForm({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState(emptyForm);
  const [variantForm, setVariantForm] = useState(emptyVariant);
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

  const handleVariantChange = (event) => {
    const { name, value } = event.target;
    setVariantForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const variantHasData = Object.values(variantForm).some((value) => String(value).trim().length > 0);

  const validateVariant = () => {
    if (!variantHasData) {
      if (isEdit) return null;
      return 'Para crear un producto nuevo tenes que cargar al menos una variante con talle, color y stock.';
    }

    if (!variantForm.talle.trim() || !variantForm.color.trim() || variantForm.stock === '') {
      return 'Completa talle, color y unidades de stock de la variante.';
    }

    if (Number(variantForm.stock) < 0) {
      return 'El stock no puede ser negativo.';
    }

    if (!isEdit && Number(variantForm.stock) < 1) {
      return 'Para que el producto nuevo se pueda comprar, el stock inicial debe ser mayor a cero.';
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingSave(true);
    setErrorSave(null);

    try {
      const variantError = validateVariant();
      if (variantError) {
        throw new Error(variantError);
      }

      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
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

      const savedProduct = isEdit
        ? await updateProduct(id, payload, accessToken)
        : await createProduct(payload, accessToken);

      if (variantHasData) {
        await createProductVariant(savedProduct?.id || id, {
          talle: variantForm.talle.trim(),
          color: variantForm.color.trim(),
          stock: Number(variantForm.stock),
        }, accessToken);
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
        <div>
          <p className="eyebrow">Productos</p>
          <h1 id="product-form-title">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>
          <p>
            {isEdit
              ? 'Modifica los datos del producto o agrega una nueva variante de talle, color y stock.'
              : 'Completa los datos del producto y carga una variante inicial para que tenga unidades disponibles.'}
          </p>
        </div>
      </div>

      <form className="placeholder-panel form-panel" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej: Zapatilla urbana negra"
          required
          maxLength={100}
        />

        <label className="field-label" htmlFor="descripcion">Descripcion</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Ej: Calzado liviano para uso diario"
          required
          maxLength={500}
          rows={4}
        />

        <label className="field-label" htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          min="0.01"
          step="0.01"
          value={form.precio}
          onChange={handleChange}
          placeholder="Ej: 85000"
          required
        />

        <label className="field-label" htmlFor="imagenes">Imagenes (una por linea, min 1 max 10)</label>
        <textarea
          id="imagenes"
          name="imagenes"
          value={form.imagenes}
          onChange={handleChange}
          placeholder="https://ejemplo.com/zapatilla.jpg"
          required
          rows={4}
        />

        <div className="form-grid form-grid--two">
          <div>
            <label className="field-label" htmlFor="marcaId">Marca</label>
            <select id="marcaId" name="marcaId" value={form.marcaId} onChange={handleChange} required>
              <option value="">Seleccionar marca</option>
              {(marcas || []).map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="tipoProductoId">Tipo de producto</label>
            <select id="tipoProductoId" name="tipoProductoId" value={form.tipoProductoId} onChange={handleChange} required>
              <option value="">Seleccionar tipo</option>
              {(tipos || []).map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="generoId">Genero</label>
            <select id="generoId" name="generoId" value={form.generoId} onChange={handleChange} required>
              <option value="">Seleccionar genero</option>
              {(generos || []).map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="categoriaId">Categoria</label>
            <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
              <option value="">Seleccionar categoria</option>
              {(categorias || []).map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {isEdit && product?.variantes?.length > 0 && (
          <div className="variant-summary">
            <strong>Variantes actuales</strong>
            <div className="variant-summary__items">
              {product.variantes.map((variant) => (
                <span key={variant.id}>Talle {variant.talle} / {variant.color} / stock {variant.stock}</span>
              ))}
            </div>
          </div>
        )}

        <fieldset className="variant-fieldset">
          <legend>{isEdit ? 'Agregar nueva variante' : 'Variante inicial obligatoria'}</legend>
          <p>
            El stock real del producto se maneja por variante. Por eso se carga talle, color y unidades.
          </p>
          <div className="form-grid form-grid--three">
            <div>
              <label className="field-label" htmlFor="talle">Talle</label>
              <input
                id="talle"
                name="talle"
                value={variantForm.talle}
                onChange={handleVariantChange}
                placeholder="Ej: 38"
                required={!isEdit}
                maxLength={20}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="color">Color</label>
              <input
                id="color"
                name="color"
                value={variantForm.color}
                onChange={handleVariantChange}
                placeholder="Ej: Negro"
                required={!isEdit}
                maxLength={40}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="stock">Unidades / stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min={isEdit ? '0' : '1'}
                value={variantForm.stock}
                onChange={handleVariantChange}
                placeholder="Ej: 12"
                required={!isEdit}
              />
            </div>
          </div>
        </fieldset>

        {loadingSave && <Loader message="Guardando..." />}
        {errorSave && <ErrorMessage>{errorSave}</ErrorMessage>}

        <div className="form-actions">
          <button className="button button--primary" type="submit" disabled={loadingSave}>
            {loadingSave ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button className="button button--ghost" type="button" onClick={handleCancel} disabled={loadingSave}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
