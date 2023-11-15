import { Router } from "express";
import { cartManager } from "./cartManager.js";

export const cartRouter = Router();
const cm = new cartManager("./src/carts.json");

cartRouter.post("/", async (req, res) => {
  await cm.init();
  const cart = await cm.addCart();
  
  res.json({
    IdCarrito: cart.id,
  });
});

cartRouter.get("/:cid", (req, res)=>{
  let cartId = parseInt(req.params.cid);
  const cart = cm.carts.find((cart)=> cart.id === cartId);
  if(cart){
    res.json(cart.products)
  }else{
    res.json({
      status: "error",
      message: "Cart not found..."
    })
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res)=>{
  let cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  try{
    const cart = await cm.addProductCart(cartId, productId);
    res.json(cart.products)
  }catch(error){
    res.json({
      error: error.message
    })
  }
})

