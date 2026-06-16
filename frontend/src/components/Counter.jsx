import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from '@/store/slices/counterSlice.js';

function Counter() {
  const [amount, setAmount] = useState(5);
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleAmountChange = (event) => {
    setAmount(Number(event.target.value));
  };

  return (
    <section className="counter-panel" aria-labelledby="counter-title">
      <div>
        <p className="eyebrow">Redux Toolkit</p>
        <h2 id="counter-title">Contador global</h2>
        <p>Ejemplo base de estado global preparado para futuros slices.</p>
      </div>

      <div className="counter-panel__value" aria-live="polite">
        {count}
      </div>

      <div className="counter-panel__actions">
        <button className="button button--secondary" type="button" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <button className="button button--primary" type="button" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button className="button button--ghost" type="button" onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>

      <div className="counter-panel__amount">
        <label htmlFor="counter-amount">Incrementar por</label>
        <input
          id="counter-amount"
          min="1"
          type="number"
          value={amount}
          onChange={handleAmountChange}
        />
        <button
          className="button button--primary"
          type="button"
          onClick={() => dispatch(incrementByAmount(amount))}
        >
          Sumar valor
        </button>
      </div>
    </section>
  );
}

export default Counter;
