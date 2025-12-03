import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import { and, asc, desc, eq, ilike } from "drizzle-orm";

export const createProduct = async (req: Request, res: Response) => {
  const data = req.body;

  const { colors, images } = data;
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return res.status(400).json({ message: "Colors array is required!" });
  }

  if (!images || typeof images !== "object") {
    return res.status(400).json({ message: "Images object is required!" });
  }

  const missingColors = colors.filter((color) => !(color in images));

  if (missingColors.length > 0) {
    return res
      .status(400)
      .json({ message: "Missing images for colors!", missingColors });
  }

  const product = await db.insert(products).values(data);

  res.status(201).json({
    message: "Product created successfully",
    data: product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Id not found",
    });
  }

  const updatedProduct = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id));

  if (!updateProduct.length) {
    return res.status(400).json({
      message: "Product update unsuccessful",
    });
  }

  return res.status(200).json({
    message: "Product updated successfully",
    data: updatedProduct,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      message: "Id not found",
    });

  const deletedProduct = await db.delete(products).where(eq(products.id, id));

  if (!deleteProduct.length) {
    return res.status(400).json({
      message: "Product delete unsuccessful",
    });
  }

  return res.status(200).json(deletedProduct);
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit } = req.query;

  let condition = [];
  if (search) {
    condition.push(ilike(products.name, `%${search}`));
  }
  if (category) {
    condition.push(eq(products.category_slug, `%${category}`));
  }

  const productsList = await db
    .select()
    .from(products)
    .where(and(eq(products.category_slug, String(category) || "")))
    .orderBy(sort === "asc" ? asc(products.price) : desc(products.price))
    .limit(Number(limit) || 10);

  res.status(200).json({
    message: "Product fetched successfully",
    data: productsList,
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      message: "Id not found",
    });

  const product = await db.select().from(products).where(eq(products.id, id));

  if (!product.length) {
    return res.status(400).json({
      message: "Product not found",
    });
  }

  return res.status(200).json({
    message: "Product fetched successfully",
  });
};
