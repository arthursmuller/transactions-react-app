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
  const res = await fetch(`${API_URL}/${transactionsEndpint}`, {
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