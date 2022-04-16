import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTransaction } from "../features/transactions/transactionsSlice";
import { getData } from "../features/auth/authSlice";

function TransactionForm() {
  const [formData, setFormData] = useState({
    amount: "",
    base: "eur",
    target: "usd",
  });

  const dispatch = useDispatch();

  const { amount, base, target } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createTransaction({ amount, base, target }));
    setTimeout(function () {
      dispatch(getData());
    }, 500);
    setFormData({ amount: "", base: "eur", target: "usd" });
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Exchange amount</label>
          <input
            type="text"
            name="amount"
            id="amount"
            value={amount}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Base currency</label>
          <select value={base} name="base" id="base" onChange={onChange}>
            <option name="base" id="base" value="eur">
              EUR
            </option>
            <option name="base" id="base" value="usd">
              USD
            </option>
            <option name="base" id="base" value="gbp">
              GBP
            </option>
            <option name="base" id="base" value="aud">
              AUD
            </option>
            <option name="base" id="base" value="hrk">
              HRK
            </option>
          </select>
        </div>
        <div className="form-group">
          <label>Target currency</label>
          <select value={target} name="target" id="target" onChange={onChange}>
            <option name="target" id="target" value="eur">
              EUR
            </option>
            <option name="target" id="target" value="usd">
              USD
            </option>
            <option name="target" id="target" value="gbp">
              GBP
            </option>
            <option name="target" id="target" value="aud">
              AUD
            </option>
            <option name="target" id="target" value="hrk">
              HRK
            </option>
          </select>
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Confirm exchange
          </button>
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;