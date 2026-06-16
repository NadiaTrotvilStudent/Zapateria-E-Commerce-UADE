import { useParams } from 'react-router-dom';

function ProductForm({ mode = 'create' }) {
  const { id } = useParams();
  const isEdit = mode === 'edit';

  return (
    <section className="page page--narrow" aria-labelledby="product-form-title">
      <div className="page__header">
        <p className="eyebrow">Productos</p>
        <h1 id="product-form-title">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>
        <p>
          {isEdit
            ? `Pantalla en construccion para editar el producto ${id}.`
            : 'Pantalla en construccion para publicar un producto.'}
        </p>
      </div>

      <div className="placeholder-panel">
        <p>Formulario temporal para datos, imagenes y variantes del producto.</p>
      </div>
    </section>
  );
}

export default ProductForm;
