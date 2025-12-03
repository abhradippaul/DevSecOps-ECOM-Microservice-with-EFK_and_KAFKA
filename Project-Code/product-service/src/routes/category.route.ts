import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router: Router = Router();

router.route("/").get(getCategories).post(createCategory);
router.route("/:slug").put(updateCategory).delete(deleteCategory);

export default router;
