import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const router: Router = Router();

router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

export default router;
