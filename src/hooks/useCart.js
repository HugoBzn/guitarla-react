import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {
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

  // State Derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.quantity * item.price, 0), [cart]);

  return {
    data,
    cart,
    isEmpty,
    cartTotal,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
  };
};
