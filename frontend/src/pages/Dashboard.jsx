import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TransactionForm from "../components/TransactionForm";
import TransactionItem from '../components/TransactionItem';
import Spinner from "../components/Spinner";
import {
  getTransactions,
  reset,
} from "../features/transactions/transactionsSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { transactions, isLoading, isError, message } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }

    dispatch(getTransactions());

    return () => {
      dispatch(reset);
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Exchange Dashboard</p>
        <h3>
          EUR: {user && user.eur} <b>|</b> USD: {user && user.usd} <b>|</b> GBP: {user && user.gbp}{" "}
          <b>|</b> AUD: {user && user.aud} <b>|</b> HRK: {user && user.hrk}
        </h3>
      </section>

      <TransactionForm />

      <section className='content'>
        {transactions.length > 0 ? (
          <div className='transactions'>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction._id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <h3>You don't have any transactions</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;