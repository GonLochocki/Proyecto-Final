import * as fs from "fs/promises";

class Product {
  constructor(title, description, price, category, status, thumbnail, stock, code, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.category = category;
    this.status = true;
    this.thumbnail = thumbnail;
    this.stock = stock;
    this.code = code;
    this.id = id;
  }
}

export class ProductManager {
  static lastId = 0;
  static lastCode = 0;

  constructor(ruta) {
    this.products = [];
    this.ruta = ruta;
  }

  static getId() {
    return ++ProductManager.lastId;
  }

  static getCode() {
    return (ProductManager.lastCode += Math.random());
  }

  async init() {
    await this.writeFile();
  }

  async writeFile() {
    await fs.writeFile(this.ruta, JSON.stringify(this.products));
  }

  async readFile() {
    const products = await fs.readFile(this.ruta, "utf-8");
    this.products = JSON.parse(products);
    return this.products;
  }

  async addProduct({ title, description, price, category , thumbnail, stock }) {
    if (!title || !description || !price || !thumbnail || !stock) {
      throw new Error("You most fill out all the fields...");
    }

    const code = ProductManager.getCode();
    const status = true;

    const existsProduct = this.products.find((p) => p.code === code);

    if (!existsProduct) {
      const id = ProductManager.getId();
      const product = new Product(
        title,
        description,
        price,
        category,
        status,
        thumbnail,
        stock,
        code,
        id
      );
      await this.readFile();
      this.products.push(product);
      await this.writeFile();
      return product;
    } else {
      console.log(
        "There is a same product code in the collection..."
      );
    }
  }

  async getProducts(query = {}) {
    const products = await this.readFile();

    if (query.limit) {
      const limit = parseInt(query.limit);
      if (limit < products.length) return products.slice(0, limit);
    }
    return products;
  }

  async getProductById(id) {
    await this.readFile();
    const exists = this.products.find((p) => p.id === id);
    if (exists) {
      return exists;
    } else {
      console.log("No se encuentra en la coleccion");
    }
  }

  async updateProduct(id, updatedData) {
    await this.readFile();
    const indexProduct = this.products.findIndex((p) => p.id === id);
    if (indexProduct !== -1) {
      const updatedProduct = {
        ...this.products[indexProduct],
        ...updatedData,
      };
      this.products[indexProduct] = updatedProduct;
      await this.writeFile();
      return updatedProduct;
    } else {
      console.log("Product not found...");
    }
  }

  async deleteProduct(id) {
    const item = await this.getProductById(id);
    if(item){

      const newArray = this.products.filter((p) => p.id !== item.id);
      await fs.unlink(this.ruta);
      await this.init();
      await this.readFile();
      this.products = newArray;
      await this.writeFile();
    }else {
      throw new Error ("The product is not found...")
    }
  }
}
