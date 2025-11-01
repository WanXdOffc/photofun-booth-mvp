import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const photos = sqliteTable('photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  imageUrl: text('image_url').notNull(),
  shareToken: text('share_token').unique(),
  filters: text('filters', { mode: 'json' }),
  overlays: text('overlays', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
});