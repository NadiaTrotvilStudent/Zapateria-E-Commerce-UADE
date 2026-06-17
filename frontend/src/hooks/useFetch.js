import { useEffect, useState } from 'react';

// hook generico para hacer fetches desde los componentes.
// el flag ignore en el cleanup es para que si el componente se desmonta
// o cambian las deps rapido, no termine pisando el state con data vieja
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => fetcher())
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Error desconocido');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
