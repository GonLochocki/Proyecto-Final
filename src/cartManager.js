import * as fs from "fs/promises";

export class cartManager {
  constructor(ruta) {
    this.ruta = ruta;
    this.carts = [];
  }

  static id = 0;

  async getId() {
    return ++cartManager.id;
  }

  async init() {
    await this.writeFile();
  }

  async writeFile() {
    return fs.writeFile(this.ruta, JSON.stringify(this.carts));
  }

  async readFile() {
    const carts = await fs.readFile(this.ruta, "utf-8");
    this.carts = JSON.parse(carts);
    return this.carts;
  }

  async addCart() {
    const carts = await this.readFile();
    let id = await this.getId();
    const cart = {
      id,
      products: [],
    };
    carts.push(cart);
    await this.writeFile();
    return cart;
  }

  async addProductCart(cartId, productId) { 
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (cart) {
      const indexProduct = cart.products.findIndex((p) => p.id === productId);
      if (indexProduct !== -1) {
        cart.products[indexProduct].quantity++;
      } else {
        const product = {id: productId, quantity: 1}
        cart.products.push(product);
      }
      await this.writeFile()
      return cart
    }else {
      throw new Error ("The cart is not found...");
    }
  }
}
