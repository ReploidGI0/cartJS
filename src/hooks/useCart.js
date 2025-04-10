import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"

export const useCart = () => {
    
    /*
      Si la DB fuera o viniera de una API seria de esta forma 
      const [data, setData] = useState([]) 
      
      useEffect( () => {
        setData(db)
      }, [])
    
      Se usa useEffect por que no sabemos cuando o que tanto tardara en 
      traer la informacion, asi que nos sirve para traer la info hasta que
      el componente este listo
    
      Como en esta practica se esta utilizando un archivo local
      el useState tendra el valor db
      */

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : [] //Si localStorage tiene algo, si no []
      }
    
      const [data, setData] = useState(db) //La DB al ser un archivo local, su valor inicial puede quedar de esta forma
      const [cart, setCart] = useState(initialCart)//Se utiliza un arreglo vacio para ir añadiendo elementos poco a poco
    
      const MAX_ITEMS = 5
      const MIN_ITEMS = 1
    
      useEffect(() =>{
        localStorage.setItem('cart', JSON.stringify(cart)) //Cada que cambie carrito, guardara los cambios
      }, [cart])
    
      function addToCart(item){
        const itemExists = cart.findIndex((kit) => kit.id === item.id) //Detectar si un elemento existe en el carrito
        if(itemExists >= 0) { //Existe en el carrito
          if(cart[itemExists].quantity >= MAX_ITEMS) return //Limita la cantidad a 5
          const updatedCart = [...cart]//Spread operator para obtener una copia de guitar SIN MUTAR
          updatedCart[itemExists].quantity++
          setCart(updatedCart)
        } else {
          item.quantity = 1
          setCart(prevCart => [...prevCart, item])
        }
      }
    
      function removeFromCart(id){
        setCart(prevCart => prevCart.filter(kit => kit.id !== id)) //Filtra las guitarras cuyo ID sea diferente al ID que se esta pasando
      }
    
      function increaseQuantity(id){
        const updatedCart = cart.map(item => {  //.map genera una copia de un arreglo
          if(item.id === id && item.quantity < MAX_ITEMS){
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function decreaseQuantity(id){
        const updatedCart = cart.map(item => {
          if(item.id === id && item.quantity > MIN_ITEMS){
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function clearCart(){
        setCart([])
      }

      //State derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
    
      return{
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}