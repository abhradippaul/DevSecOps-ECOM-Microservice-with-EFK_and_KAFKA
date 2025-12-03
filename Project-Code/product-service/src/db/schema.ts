import { relations } from "drizzle-orm";
import {
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  short_description: varchar("short_description", { length: 150 }),
  description: varchar("description", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  sizes: sizeEnum("sizes").array(),
  colors: varchar("colors", { length: 20 }).array(),
  category_slug: varchar("category_slug", { length: 100 }).references(
    () => categories.slug,
    {
      onDelete: "set null",
    }
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const productRelations = relations(products, ({ one, many }) => ({
  cateogory: one(categories, {
    fields: [products.category_slug],
    references: [categories.slug],
  }),
}));

export const categories = pgTable("categories", {
  slug: varchar("slug", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryRelations = relations(categories, ({ one, many }) => ({
  product: many(products),
}));
