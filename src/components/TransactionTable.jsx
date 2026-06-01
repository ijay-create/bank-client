function TransactionTable({ transactions = [], currentUserId }) {
  const safeUserId = Number(currentUserId);

  return (
    <div className="transaction-section">
      <div className="transaction-header">
        <h2>Recent Transactions</h2>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => {
              const senderId = Number(transaction.sender_id);
              const receiverId = Number(transaction.receiver_id);

              const isSender = senderId === safeUserId;
              const isReceiver = receiverId === safeUserId;

              let type = "Transfer";
              if (isSender) type = "Sent";
              if (isReceiver) type = "Received";

              return (
                <tr key={transaction.id}>
                  <td>{type}</td>

                  <td className={isSender ? "debit" : "credit"}>
                    {isSender ? "-" : "+"}
                    ₦{Number(transaction.amount).toLocaleString()}
                  </td>

                  <td>
                    {new Date(transaction.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;