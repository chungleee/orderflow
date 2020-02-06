import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import Preview from "./Preview";
import { handleCreateOrder } from "../../../redux/actions/orderActions";
const stripe = window.Stripe("pk_test_bvyBrZbSRaMYEXOeznlkED2G00aTGv1zec");
const elements = stripe.elements();

const styles = {
  input: "input-reset ba br-pill pl3 h2 mb2 f5"
};

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

const Checkout = ({ history }) => {
  const dispatch = useDispatch();
  const { client_secret } = useSelector(state => {
    return state.paymentState;
  });

  const { subtotal, cart } = useSelector(state => {
    return state.foodItemsState;
  });

  const { _id } = useSelector(state => {
    return state.authState.user;
  });

  const handlePay = async values => {
    try {
      const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: card }
      });
      console.log("handle pay paymentIntent", paymentIntent);

      if (paymentIntent.status === "succeeded") {
        const food_items_ids = cart.reduce((acc, current) => {
          return (acc = [...acc, current._id]);
        }, []);

        const data = {
          food_items: food_items_ids,
          price_total: subtotal.toString(),
          order_for: values.name,
          payment_type: paymentIntent.payment_method_types[0],
          order_owner: _id
        };

        dispatch(handleCreateOrder(data));
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
    <div className="flex vh-100">
      <aside className="w-70 br b--light-gray">
        <Preview />
      </aside>
      <div className="w-30" style={{ marginTop: "auto", marginBottom: "auto" }}>
        <Formik
          initialValues={{ name: "", email: "", phone: "" }}
          onSubmit={(values, actions) => {
            handlePay(values);
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleSubmit }) => {
            return (
              <form className="flex flex-column ph3" onSubmit={handleSubmit}>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  value={values.name}
                  placeholder="Name on card"
                  className={styles.input}
                />

                <input
                  onChange={handleChange}
                  type="text"
                  name="email"
                  value={values.email}
                  placeholder="Email"
                  className={styles.input}
                />

                <input
                  onChange={handleChange}
                  type="tel"
                  name="phone"
                  value={values.phone}
                  placeholder="Phone"
                  className={styles.input}
                />

                <div
                  style={{ padding: ".5rem 1rem .5rem 1rem" }}
                  id="card"
                ></div>

                <div className="mt5 mb3">
                  <h3 className="flex">
                    Total price:{" "}
                    <span style={{ marginLeft: "auto" }}>${subtotal}</span>
                  </h3>
                </div>

                <button
                  className="input-reset h2 ba b--black br-pill f5  bg-yellow pointer"
                  type="submit"
                >
                  Place your order
                </button>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Checkout;
