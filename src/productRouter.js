import { Router } from "express"
import { ProductManager } from "./productManager.js";

export const productRouter = Router()

const pm = new ProductManager("./src/products.json");
pm.init();

productRouter.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    if (limit) {
      const products = await pm.getProducts({ limit });
      res.json(products);
    } else {
      res.json(await pm.getProducts());
    }
  });
  
  productRouter.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    const searched = await pm.getProductById(id);
    if (searched) {
      res.json(searched);
    } else {
      res.json({
        error: "The product is not found in the collection...",
      });
    }
  });
  
  productRouter.post("/", async (req, res) => {
    const productBody = req.body;
    let product = await pm.addProduct(productBody);
    res.json(product);
  });
  
  productRouter.put("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    const before = await pm.getProductById(id);
    const productUpdate = req.body;
    const updatedProduct = await pm.updateProduct(id, productUpdate);
    res.json({
      before: before,
      Updated: updatedProduct,
    });
  });
  
  productRouter.delete("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    const deleted = await pm.getProductById(id);
    await pm.deleteProduct(id);
    res.json({
      deleted: deleted,
    });
  });