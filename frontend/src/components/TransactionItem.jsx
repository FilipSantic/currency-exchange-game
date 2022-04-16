function TransactionItem({ transaction }) {
  return (
    <div className="goal">
      <div>{new Date(transaction.createdAt).toLocaleString("hr-HR")}</div>
      <h2>Amount: {transaction.amount}</h2>
      <h2>Base: {transaction.base}</h2>
      <h2>Target: {transaction.target}</h2>
    </div>
  );
}

export default TransactionItem;