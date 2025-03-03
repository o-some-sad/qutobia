//@ts-check
import Cart from "../models/cart.model.js";

export const addItem = async (item, user) => {
  try {
    let cart = await Cart.findOne({
        user
    })
    if(!cart){
        cart = await Cart.create({
            user,
            books: []
        })
    }

    
    
    
    
  } catch (error) {
    throw new Error('Failed to add to cart!');
  }
};

