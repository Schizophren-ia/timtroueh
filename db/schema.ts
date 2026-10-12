import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(), email: text('email').notNull(), name: text('name').notNull(),
  phone: text('phone').notNull().default(''), university: text('university').notNull().default('UEH'),
  campus: text('campus').notNull().default('B'), role: text('role').notNull().default('student'), createdAt: text('created_at').notNull(),
});
export const demoAccounts = sqliteTable('demo_accounts', {
  email: text('email').primaryKey(), userId: text('user_id').notNull().unique().references(() => profiles.id),
});
export const demoOtps = sqliteTable('demo_otps', {
  email: text('email').primaryKey(), challenge: text('challenge').notNull().unique(), codeHash: text('code_hash').notNull(),
  purpose: text('purpose').notNull(), name: text('name').notNull(), attempts: integer('attempts').notNull().default(0),
  consumed: integer('consumed').notNull().default(0), expiresAt: integer('expires_at').notNull(), sentAt: integer('sent_at').notNull(),
});
export const demoSessions = sqliteTable('demo_sessions', {
  tokenHash: text('token_hash').primaryKey(), userId: text('user_id').notNull().references(() => profiles.id), expiresAt: integer('expires_at').notNull(),
});
export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(), code: text('code').notNull().unique(), title: text('title').notNull(),
  price: integer('price').notNull(), type: text('type').notNull(), district: text('district').notNull(),
  status: text('status').notNull().default('available'), ownerId: text('owner_id'), data: text('data').notNull(), updatedAt: text('updated_at').notNull(),
});
export const favorites = sqliteTable('favorites', {
  userId: text('user_id').notNull().references(() => profiles.id), roomId: text('room_id').notNull().references(() => rooms.id), createdAt: text('created_at').notNull(),
}, t => [primaryKey({ columns: [t.userId, t.roomId] })]);
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(), roomId: text('room_id').notNull().references(() => rooms.id), userId: text('user_id'), name: text('name').notNull(), category: text('category').notNull(),
  rating: integer('rating').notNull(), landlordScore: integer('landlord_score').notNull(), roomScore: integer('room_score').notNull(), infoScore: integer('info_score').notNull(),
  body: text('body').notNull(), status: text('status').notNull().default('pending'), checklist: text('checklist').notNull().default('[]'), createdAt: text('created_at').notNull(),
});
export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(), roomId: text('room_id').notNull().references(() => rooms.id), userId: text('user_id').notNull().references(() => profiles.id),
  message: text('message').notNull(), reply: text('reply').notNull().default(''), status: text('status').notNull().default('new'), createdAt: text('created_at').notNull(),
});
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().references(() => profiles.id), title: text('title').notNull(), body: text('body').notNull(),
  link: text('link').notNull(), read: integer('read').notNull().default(0), createdAt: text('created_at').notNull(),
});
