import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const stripe = window.Stripe("pk_test_bvyBrZbSRaMYEXOeznlkED2G00aTGv1zec");
const elements = stripe.elements();

const styles = {
  input: "input-reset ba br-pill pl3 h2 w-50 f5"
};
const Checkout = ({ history }) => {
  const { client_secret } = useSelector(state => {
    return state.paymentState;
  });
  const card = elements.create("card", {
    classes: {
      base: "ba br-pill mb2"
    },
    style: {
      base: {
        fontSize: "16px"
      }
    }
  });

  const handlePay = async () => {
    try {
      const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: card }
      });
      console.log("handle pay paymentIntent", paymentIntent);
      if (paymentIntent.status === "succeeded") {
        history.push("/staff/invoice");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    card.mount("#card");
  }, []);

  return (
    <div className="w-90" style={{ margin: "auto" }}>
      <h1>this is checkout page</h1>
      <form
        className="flex flex-column"
        onSubmit={event => {
          event.preventDefault();
          handlePay(event);
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name on card"
          className="input-reset ba br-pill pl3 h2 mb2 f5"
        />
        <div className="flex mb2">
          <input
            type="text"
            name="email"
            placeholder="Email"
            className={styles.input}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className={styles.input}
          />
        </div>

        <div style={{ padding: ".5rem 1rem .5rem 1rem" }} id="card"></div>

        <button
          className="input-reset h2 ba b--black br-pill f5  bg-animate hover-bg-yellow pointer"
          type="submit"
        >
          Pay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
