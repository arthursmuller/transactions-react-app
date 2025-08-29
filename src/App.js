import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';
const transactionsEndpint = 'transactions';

export async function listTransactions() {
  const response = await fetch(`${API_URL}/${transactionsEndpint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export async function createTransaction(data) {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => {});
    throw new Error(err.error || 'Failed to create transaction');
  }

  return await res.json();
}

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
      console.log("asdadsadsadsa")
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
        <h2>Transactions</h2>
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