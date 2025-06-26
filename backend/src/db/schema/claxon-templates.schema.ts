import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { claxons } from "./claxons.schema";
import { timestamps } from "./util.schema";

export const claxonTemplates = pgTable(
	"claxon_templates",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		category: text("category").notNull(),
		isActive: boolean("is_active").notNull().default(true),
		messageEn: text("message_en").notNull(),
		messageRo: text("message_ro").notNull(),
		messageRu: text("message_ru").notNull(),
		icon: text("icon"),

		...timestamps,
	},
	(table) => [
		index("template_category_idx").on(table.category),
		index("template_is_active_idx").on(table.isActive),
	],
);

export const claxonTemplatesRelations = relations(
	claxonTemplates,
	({ many }) => ({
		claxons: many(claxons),
	}),
);

export type ClaxonTemplate = typeof claxonTemplates.$inferSelect;
export type NewClaxonTemplate = typeof claxonTemplates.$inferInsert;

export const insertClaxonTemplateSchema = createInsertSchema(claxonTemplates);
export const selectClaxonTemplateSchema = createSelectSchema(claxonTemplates);
export const updateClaxonTemplateSchema = insertClaxonTemplateSchema
	.partial()
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	});

export type UpdateClaxonTemplate = z.infer<typeof updateClaxonTemplateSchema>;

export const queryClaxonTemplateSchema = createSelectSchema(claxonTemplates)
	.pick({
		category: true,
	})
	.extend({
		language: z.enum(["en", "ro", "ru"]),
	})
	.partial();

export type QueryClaxonTemplate = z.infer<typeof queryClaxonTemplateSchema>;
