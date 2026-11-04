import {sqliteTable,text,index,integer,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const requests=sqliteTable('provider_requests',{id:text('id').primaryKey(),organization:text('organization').notNull(),email:text('email').notNull(),evidence:text('evidence').notNull(),kind:text('kind').notNull(),status:text('status').notNull().default('pending'),createdAt:text('created_at').notNull(),reviewedAt:text('reviewed_at'),reviewedBy:text('reviewed_by')},t=>[index('requests_created').on(t.createdAt)]);
export const referrals=sqliteTable('referral_requests',{
  id:text('id').primaryKey(),tokenHash:text('token_hash').notNull(),name:text('name').notNull(),
  contact:text('contact').notNull(),method:text('method').notNull(),language:text('language').notNull(),
  providerId:text('provider_id'),assignedProviderId:text('assigned_provider_id'),connectionMethod:text('connection_method'),sourcePath:text('source_path').notNull(),locale:text('locale').notNull(),
  voicemail:integer('voicemail').notNull().default(0),shareConsent:integer('share_consent').notNull().default(0),
  consentVersion:text('consent_version').notNull(),consentedAt:text('consented_at').notNull(),
  status:text('status').notNull().default('new'),createdAt:text('created_at').notNull(),
  updatedAt:text('updated_at').notNull(),version:integer('version').notNull().default(0),
  notificationStatus:text('notification_status').notNull().default('not_requested'),
  notificationAttemptedAt:text('notification_attempted_at'),
},t=>[uniqueIndex('referrals_token').on(t.tokenHash),index('referrals_created').on(t.createdAt),index('referrals_contact_created').on(t.contact,t.createdAt)]);
export const referralEvents=sqliteTable('referral_events',{
  id:text('id').primaryKey(),referralId:text('referral_id').notNull().references(()=>referrals.id,{onDelete:'cascade'}),
  status:text('status').notNull(),providerId:text('provider_id'),connectionMethod:text('connection_method'),createdAt:text('created_at').notNull(),actor:text('actor').notNull(),
},t=>[index('referral_events_request').on(t.referralId,t.createdAt)]);

export const providerRequestTargets=sqliteTable('provider_request_targets',{
  requestId:text('request_id').primaryKey().references(()=>requests.id,{onDelete:'cascade'}),
  providerId:text('provider_id').notNull(),
  providerName:text('provider_name').notNull(),
});

export const sourceLinkChecks=sqliteTable('source_link_checks',{
  url:text('url').primaryKey(),
  outcome:text('outcome').notNull(),
  httpStatus:integer('http_status'),
  checkedAt:text('checked_at').notNull(),
});
