import React, { useState, useEffect, useCallback } from 'react';
import { listTransactions, createTransaction } from './api';

function App() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const isFormDataValid = description || amount
  const disableSubmit = submitting || !isFormDataValid

  const resetForm = () => {
    setDescription('');
    setAmount('');
  }
  
  const fetchTransactions = useCallback(async () => {
    try {
      setError(null);
      const data = await listTransactions();
      setTransactions(data);
    } catch (error) {
      setError('Failed to fetch transactions.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isFormDataValid) {
      return;
    }

    const newTransaction = {
      description,
      amount: parseFloat(amount),
    };

    try {
      setSubmitting(true)
      await createTransaction(newTransaction)
      resetForm();
      await fetchTransactions();
      setSubmitting(false)
    } catch (error) {
      setError('Failed to save the transaction.');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className='main'>
      <div className="bg-black p20">
        <h1>Transaction Manager</h1>

      <form onSubmit={handleSubmit} className='flex gap10 flexColumn flexCenter' >
        <div className="flex gap10 flexWrap">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Coffee"
            required
          />
        </div>
        <div className="flex gap10 flexWrap">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 4.50"
            step="0.01"
            required
          />
        </div>
        <div className="flex flexCenter fullW">
          <button className={"mt10"} disabled={disableSubmit} type="submit">Add Transaction</button>
        </div>
      </form>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div >
        <h2>Transactinos</h2>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((t, index) => (
              <li key={index} >
                <span>{t.description}</span>
                <span>${t.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p >No transactions yet.</p>
        )}
      </div>
      </div>

    </div>
  );
}

export default App;