import { useEffect, useState } from "react";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/transactions`)
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }, []);

  return (
    <div>
      <p>{apiUrl}</p>
      <header>Header</header>

      <main>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.type} {transaction.amount}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
