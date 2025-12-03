import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const createCategory = async (req: Request, res: Response) => {
  const data = req.body;

  if (!data?.slug || !data?.name) {
    return res.status(400).json({
      message: "All category fields are required",
    });
  }

  const category = await db.insert(categories).values(data);

  if (!category.rowCount) {
    return res.status(400).json({
      message: "Failed to create category",
    });
  }

  res.status(201).json({
    message: "Category created successfully",
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = req.body;

  if (!slug) {
    return res.status(400).json({
      message: "Slug not found",
    });
  }

  const category = await db
    .update(categories)
    .set(data)
    .where(eq(categories.slug, slug));

  if (!category.rowCount) {
    return res.status(400).json({
      message: "Failed to update category",
    });
  }

  return res.status(200).json({
    message: "Category updated successfully",
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({
      message: "Slug not found",
    });
  }

  const category = await db.delete(categories).where(eq(categories.slug, slug));

  if (!category.rowCount) {
    return res.status(400).json({
      message: "Failed to delete category",
    });
  }

  return res.status(200).json({
    message: "Category deleted successfully",
  });
};

export const getCategories = async (req: Request, res: Response) => {
  const categoryList = await db.select().from(categories);

  return res.status(200).json({
    message: "Fetched category list successfully",
    data: categoryList,
  });
};
