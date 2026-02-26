import { useState, useEffect } from "react";
import Guitar from "./Components/Guitar";
import Header from "./Components/Header";
import { db } from "./data/db";

function App() {
  // Carrito INICIAL
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  // STATE
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function agregar y modificar
  function addToCart(guitarItem) {
    const itemExist = cart.findIndex((guitar) => guitar.id === guitarItem.id);
    if (itemExist >= 0) {
      if (cart[itemExist].quantity >= MAX_ITEMS) return;

      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      guitarItem.quantity = 1;
      setCart([...cart, guitarItem]);
    }
  }

  // Function Remove
  function removeFromCart(idGuitarItem) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== idGuitarItem));
  }

  // Funcion INCREMENTAR
  function increaseQuantity(idGuitarItem) {
    const updatedCart = cart.map((item) => {
      if (item.id === idGuitarItem && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    setCart(updatedCart);
  }

  // Funcion DECREMENTAR
  function decreaseQuantity(idGuitarItem) {
    const updatedCart = cart.map((item) => {
      if (item.id === idGuitarItem && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });

    setCart(updatedCart);
  }

  // Funcion LIMPIAR
  function clearCart() {
    setCart([]);
  }

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Guitarras Profesionales</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} setCart={setCart} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  );
}

export default App;
