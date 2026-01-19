import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  varchar,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// UserGroups table for organizing users and scoping research agent
export const userGroups = pgTable("user_groups", {
  id: serial("id").primaryKey(),
  collectionName: text("collection_name").notNull(),
  currentResearchPrompt: text("current_research_prompt"),
  currentLabPrompt: text("current_lab_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password_hash").notNull(),
  passwordSalt: text("password_salt"), // Make this nullable
  bioSex: text("bio_sex"),
  age: integer("age"),
  firstLine: text("first_line"),
  secondLine: text("second_line"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  height: text("height"), // in cm
  weight: text("weight"), // in kg
  activityLevel: text("activity_level"),
  healthState: text("health_state"),
  signupDate: timestamp("signup_date").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  emailVerified: boolean("email_verified").default(false),
  accountStatus: text("account_status").default("pending"),
  authProvider: text("auth_provider").default("local"),
  googleId: text("google_id").unique(),
  userGroupId: integer("user_group_id").references(() => userGroups.id),
  isAdmin: boolean("is_admin").default(false),
  // New onboarding fields
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  dob: text("dob"), // MM/DD/YYYY format
  phone: varchar("phone", { length: 10 }).unique(), // 10 digits only
  address: text("address"),
  selfReportedMeds: text("self_reported_meds"),
  allergies: text("allergies"),
  medicalConditions: text("medical_conditions"),
});

export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  uploadFiles: boolean("upload_files").notNull().default(false),
});

// Define relations
// Define relations for userGroups
export const userGroupRelations = relations(userGroups, ({ many }) => ({
  users: many(users),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  permissions: many(userPermissions),
  group: one(userGroups, {
    fields: [users.userGroupId],
    references: [userGroups.id],
  }),
}));

export const userPermissionsRelations = relations(
  userPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [userPermissions.userId],
      references: [users.id],
    }),
  }),
);

export const insertUserGroupSchema = createInsertSchema(userGroups)
  .pick({
    collectionName: true,
    currentResearchPrompt: true,
    currentLabPrompt: true,
  })
  .extend({
    collectionName: z
      .string()
      .min(3, "Collection name must be at least 3 characters"),
    currentResearchPrompt: z.string().optional(),
    currentLabPrompt: z.string().optional(),
  });

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
    bioSex: true,
    age: true,
    height: true,
    weight: true,
    activityLevel: true,
    healthState: true,
    emailVerified: true,
    accountStatus: true,
    authProvider: true,
    googleId: true,
    userGroupId: true,
    isAdmin: true,
    // New onboarding fields
    firstName: true,
    lastName: true,
    dob: true,
    phone: true,
    address: true,
    firstLine: true,
    secondLine: true,
    city: true,
    state: true,
    zipCode: true,
    selfReportedMeds: true,
    allergies: true,
    medicalConditions: true,
  })
  .extend({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordSalt: z.string().optional(),
    bioSex: z.string().optional(),
    age: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    activityLevel: z.string().optional(),
    healthState: z.string().optional(),
    emailVerified: z.boolean().optional().default(false),
    accountStatus: z.string().optional().default("pending"),
    authProvider: z.string().optional().default("local"),
    googleId: z.string().optional(),
    userGroupId: z.number().optional(),
    isAdmin: z.boolean().optional().default(false),
    // New onboarding field validations
    firstName: z.string().max(100, "First name must be 100 characters or less").optional(),
    lastName: z.string().max(100, "Last name must be 100 characters or less").optional(),
    dob: z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Date must be in MM/DD/YYYY format").optional(),
    phone: z.string()
      .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
      .refine((phone) => {
        // Extract the three parts of the phone number
        const areaCode = phone.substring(0, 3);
        const exchangeCode = phone.substring(3, 6);
        
        // Validate area code (NPA): Must start with 2-9, second digit 0-8, third digit 0-9
        const areaCodeFirstDigit = parseInt(areaCode[0]);
        const areaCodeSecondDigit = parseInt(areaCode[1]);
        const areaCodeThirdDigit = parseInt(areaCode[2]);
        
        if (areaCodeFirstDigit < 2 || areaCodeFirstDigit > 9) {
          return false; // Area code must start with 2-9
        }
        
        if (areaCodeSecondDigit < 0 || areaCodeSecondDigit > 8) {
          return false; // Second digit must be 0-8
        }
        
        if (areaCodeThirdDigit < 0 || areaCodeThirdDigit > 9) {
          return false; // Third digit must be 0-9
        }
        
        // Validate exchange code (NXX): Must start with 2-9, cannot be N11 format
        const exchangeFirstDigit = parseInt(exchangeCode[0]);
        const exchangeSecondDigit = parseInt(exchangeCode[1]);
        const exchangeThirdDigit = parseInt(exchangeCode[2]);
        
        if (exchangeFirstDigit < 2 || exchangeFirstDigit > 9) {
          return false; // Exchange code must start with 2-9
        }
        
        if (exchangeSecondDigit === 1 && exchangeThirdDigit === 1) {
          return false; // Cannot be N11 format (like 211, 411, 911)
        }
        
        return true;
      }, "Invalid US phone number format. Please enter a valid 10-digit US phone number (e.g., 2125551234)")
      .optional(),
    address: z.string().optional(),
    firstLine: z.string().optional(),
    secondLine: z.string().optional(),
    city: z.string().optional(),
    state: z.string().regex(/^[A-Z]{2}$/, "State must be 2 uppercase letters").optional(),
    zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be exactly 5 digits").optional(),
    selfReportedMeds: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
  });

export const healthProfileSchema = z.object({
  biologicalSex: z.enum(["M", "F", "other"]),
  age: z.number().min(18).max(120),
  medicalConditions: z.array(z.string()),
  primaryGoal: z.enum([
    "longevity",
    "performance",
    "weightLoss",
    "diseasePrevention",
    "generalHealth",
    "other",
  ]),
  completed: z.boolean().default(false),
  // Enhanced health profile fields
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  familyHistory: z
    .object({
      heartDisease: z.boolean().optional(),
      diabetes: z.boolean().optional(),
      cancer: z.boolean().optional(),
      mentalHealth: z.boolean().optional(),
      other: z.array(z.string()).optional(),
    })
    .optional(),
  lifestyleFactors: z
    .object({
      smokingStatus: z
        .enum(["never", "former", "current", "occasional"])
        .optional(),
      alcoholConsumption: z
        .enum(["none", "light", "moderate", "heavy"])
        .optional(),
      exerciseFrequency: z
        .enum(["none", "light", "moderate", "intense"])
        .optional(),
      dietType: z
        .enum([
          "omnivore",
          "vegetarian",
          "vegan",
          "pescatarian",
          "keto",
          "other",
        ])
        .optional(),
    })
    .optional(),
});

// LabVendor subclass of Vendor
export const labVendors = pgTable("lab_vendors", {
  vendorId: integer("vendor_id")
    .primaryKey()
    .references(() => vendors.id),
});

// Lab States Table
export const labStates = pgTable("lab_states", {
  id: serial("id").primaryKey(),
  name: varchar("state_name", { length: 20 }).notNull(),
});

// Labs Table
export const labs = pgTable("labs", {
  id: serial("id").primaryKey(),
  labVendorId: integer("vendor_id").references(() => labVendors.vendorId),
  name: text("name"),
  description: text("description").notNull(),
  remoteCode: varchar("remote_code", { length: 50 }),
  keyword: text("keyword"),
});

// Define relations for labs
export const labsRelations = relations(labs, ({ one, many }) => ({
  vendor: one(labVendors, {
    fields: [labs.labVendorId],
    references: [labVendors.vendorId],
  }),
  vendors: many(labsXVendor),
}));

// Orders superclass table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  // vendorId removed since we're moving to a multi-vendor model
  createdAt: timestamp("created_at").defaultNow().notNull(),
  orderNumber: varchar("order_number", { length: 50 }),
  orderStatus: varchar("order_status", { length: 50 }).default("pending"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  labId: integer("lab_id").references(() => labs.id),
  supplementId: integer("supplement_id").references(() => supplements.id),
  medicationId: integer("medication_id").references(() => medications.id),
  quantity: integer("quantity"),
  price: decimal("price", { precision: 10, scale: 2 }),
  vendorId: integer("vendor_id").references(() => vendors.id),
  labStateId: integer("lab_state_id").references(() => labStates.id),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  lab: one(labs, {
    fields: [orderItems.labId],
    references: [labs.id],
  }),
  supplement: one(supplements, {
    fields: [orderItems.supplementId],
    references: [supplements.id],
  }),
  medication: one(medications, {
    fields: [orderItems.medicationId],
    references: [medications.id],
  }),
  vendor: one(vendors, {
    fields: [orderItems.vendorId],
    references: [vendors.id],
  }),
  labState: one(labStates, {
    fields: [orderItems.labStateId],
    references: [labStates.id],
  }),
}));

// Vendor superclass table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  vendorName: varchar("name", { length: 100 }),
  vendorDescription: text("description"),
  vendorInternalCode: varchar("internal_code", { length: 50 }),
  vendorRemoteCode: varchar("remote_code", { length: 50 }),
  vendorUrl: varchar("url", { length: 255 }),
  vendorZone: varchar("zone", { length: 50 }),
});

// Lab to Vendor linking table
export const labsXVendor = pgTable(
  "labs_x_vendor",
  {
    id: serial("id").primaryKey(),
    labId: integer("lab_id")
      .notNull()
      .references(() => labs.id),
    vendorId: integer("vendor_id")
      .notNull()
      .references(() => labVendors.vendorId),
    price: decimal("price", { precision: 10, scale: 2 }),
    isAvailable: boolean("is_available").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// SupplementVendor subclass of Vendor
export const supplementVendors = pgTable("supplement_vendors", {
  vendorId: integer("vendor_id")
    .primaryKey()
    .references(() => vendors.id),
});

// MedVendor subclass of Vendor
export const medVendors = pgTable("med_vendors", {
  vendorId: integer("vendor_id")
    .primaryKey()
    .references(() => vendors.id),
});

// Supplement to Vendor linking table
export const supplementsXVendor = pgTable(
  "supplements_x_vendor",
  {
    id: serial("id").primaryKey(),
    supplementId: integer("supplement_id")
      .notNull()
      .references(() => supplements.id),
    vendorId: integer("vendor_id")
      .notNull()
      .references(() => supplementVendors.vendorId),
    price: decimal("price", { precision: 10, scale: 2 }),
    inStock: boolean("in_stock").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// Medication to Vendor linking table
export const medicationsXVendor = pgTable(
  "medications_x_vendor",
  {
    id: serial("id").primaryKey(),
    medicationId: integer("medication_id")
      .notNull()
      .references(() => medications.id),
    vendorId: integer("vendor_id")
      .notNull()
      .references(() => medVendors.vendorId),
    price: decimal("price", { precision: 10, scale: 2 }),
    inStock: boolean("in_stock").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// PrescriptionVendor subclass of Vendor
export const prescriptionVendors = pgTable("prescription_vendors", {
  vendorId: integer("vendor_id")
    .primaryKey()
    .references(() => vendors.id),
});

// Prescriptions table
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 50 }),
  prescriptionVendorId: integer("prescription_vendor_id").references(
    () => prescriptionVendors.vendorId,
  ),
  orderId: integer("order_id").references(() => orders.id),
});

// Supplements catalog table
export const supplements = pgTable("supplements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  sku: varchar("sku", { length: 50 }),
  imageUrl: varchar("image_url", { length: 255 }),
  category: varchar("category", { length: 50 }),
  benefits: text("benefits"),
  ingredients: text("ingredients"),
  dosage: text("dosage"),
  keyword: text("keyword"),
  vendorId: integer("vendor_id").references(() => supplementVendors.vendorId),
});

// Medications catalog table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  sku: varchar("sku", { length: 50 }),
  imageUrl: varchar("image_url", { length: 255 }),
  category: varchar("category", { length: 50 }),
  requiresPrescription: boolean("requires_prescription").default(false),
  sideEffects: text("side_effects"),
  dosage: text("dosage"),
  vendorId: integer("vendor_id").references(() => medVendors.vendorId),
});

// Define relations for orders and vendors
export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId],
  }),
}))

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  vendor: one(prescriptionVendors, {
    fields: [prescriptions.prescriptionVendorId],
    references: [prescriptionVendors.vendorId],
  }),
  order: one(orders, {
    fields: [prescriptions.orderId],
    references: [orders.id],
  }),
}));

// Define relations for supplements and medications
export const supplementsRelations = relations(supplements, ({ one, many }) => ({
  vendor: one(supplementVendors, {
    fields: [supplements.vendorId],
    references: [supplementVendors.vendorId],
  }),
  vendors: many(supplementsXVendor),
}));

export const medicationsRelations = relations(medications, ({ one, many }) => ({
  vendor: one(medVendors, {
    fields: [medications.vendorId],
    references: [medVendors.vendorId],
  }),
  vendors: many(medicationsXVendor),
}));

// Define relations for linking tables
export const supplementsXVendorRelations = relations(
  supplementsXVendor,
  ({ one }) => ({
    supplement: one(supplements, {
      fields: [supplementsXVendor.supplementId],
      references: [supplements.id],
    }),
    vendor: one(supplementVendors, {
      fields: [supplementsXVendor.vendorId],
      references: [supplementVendors.vendorId],
    }),
  }),
);

export const medicationsXVendorRelations = relations(
  medicationsXVendor,
  ({ one }) => ({
    medication: one(medications, {
      fields: [medicationsXVendor.medicationId],
      references: [medications.id],
    }),
    vendor: one(medVendors, {
      fields: [medicationsXVendor.vendorId],
      references: [medVendors.vendorId],
    }),
  }),
);

export const labsXVendorRelations = relations(labsXVendor, ({ one }) => ({
  lab: one(labs, {
    fields: [labsXVendor.labId],
    references: [labs.id],
  }),
  vendor: one(labVendors, {
    fields: [labsXVendor.vendorId],
    references: [labVendors.vendorId],
  }),
}));

// Payments table to track order payments
export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    stripeChargeId: varchar("stripe_charge_id", { length: 100 }),
    paymentStatus: varchar("payment_status", { length: 20 })
      .notNull()
      .default("pending"), // "pending", "confirmed", "refunded"
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    stripeSessionId: varchar("stripe_session_id", { length: 255 }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  }
);

// Signup whitelist table – only emails present here can register
export const signupWhitelist = pgTable("signup_whitelist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const signupWhitelistRelations = relations(signupWhitelist, ({}) => ({}));

// Define relation between payments and orders
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// Add payment field to ordersRelations
export const ordersToPaymentRelations = relations(orders, ({ one }) => ({
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId],
  }),
}));

// Email verification tokens table
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Define relations for email verification tokens
export const emailVerificationTokensRelations = relations(
  emailVerificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationTokens.userId],
      references: [users.id],
    }),
  }),
);

export type InsertUserGroup = z.infer<typeof insertUserGroupSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserGroup = typeof userGroups.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserPermissions = typeof userPermissions.$inferSelect;
export type HealthProfile = z.infer<typeof healthProfileSchema>;
export type Lab = typeof labs.$inferSelect;
export type LabVendorDb = typeof labVendors.$inferSelect;
export type LabState = typeof labStates.$inferSelect;

// Define the LabVendor interface used in the application
export interface LabVendor {
  vendorId: number;
}

// Define a custom UserLab interface to replace the removed table
export interface UserLab {
  userId: number;
  labId: number;
  labStateId: number;
  scheduledDate: Date | null;
  createdAt: Date;
  lab?: Lab;
  state?: LabState;
  vendor?: LabVendor;
}
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type SupplementVendor = typeof supplementVendors.$inferSelect;
export type MedVendor = typeof medVendors.$inferSelect;
export type PrescriptionVendor = typeof prescriptionVendors.$inferSelect;
export type Prescription = typeof prescriptions.$inferSelect;
export type Supplement = typeof supplements.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type EmailVerificationToken =
  typeof emailVerificationTokens.$inferSelect;
export type SupplementXVendor = typeof supplementsXVendor.$inferSelect;
export type MedicationXVendor = typeof medicationsXVendor.$inferSelect;
export type LabXVendor = typeof labsXVendor.$inferSelect;
export type FileAttachment = typeof fileAttachments.$inferSelect;
export type InsertFileAttachment = typeof fileAttachments.$inferInsert;

// Extended types for products with vendor information
export interface SupplementWithVendors extends Supplement {
  vendors?: (SupplementXVendor & { vendorName?: string })[];
}

export interface MedicationWithVendors extends Medication {
  vendors?: (MedicationXVendor & { vendorName?: string })[];
}

export interface LabWithVendors extends Lab {
  vendors?: (LabXVendor & { vendorName?: string })[];
}

// System Configuration table for storing application-wide settings
export const systemConfigurations = pgTable("system_configurations", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define SystemConfiguration type and schema
export type SystemConfiguration = typeof systemConfigurations.$inferSelect;
export type InsertSystemConfiguration =
  typeof systemConfigurations.$inferInsert;

export const insertSystemConfigurationSchema = createInsertSchema(
  systemConfigurations,
)
  .pick({
    key: true,
    value: true,
    description: true,
  })
  .extend({
    key: z.string().min(2, "Key must be at least 2 characters"),
    value: z.string(),
    description: z.string().optional(),
  });

// File attachments table
export const fileAttachments = pgTable("file_attachments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 1000 }).notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size_bytes").notNull(),
  userId: integer("user_id").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  description: text("description"),
  version: integer("version").default(1),
  isLatest: boolean("is_latest").default(true),
});

// Define relations for file attachments
export const fileAttachmentsRelations = relations(
  fileAttachments,
  ({ one }) => ({
    order: one(orders, {
      fields: [fileAttachments.orderId],
      references: [orders.id],
    }),
    uploader: one(users, {
      fields: [fileAttachments.userId],
      references: [users.id],
    }),
  }),
);

// Whitelist types
export type SignupWhitelist = typeof signupWhitelist.$inferSelect;
export type InsertSignupWhitelist = typeof signupWhitelist.$inferInsert;

// Medication questionnaire types
export type MedicationQuestionnaire = typeof medicationQuestionnaires.$inferSelect;
export type InsertMedicationQuestionnaire = typeof medicationQuestionnaires.$inferInsert;

// Consent agreement types
export type ConsentAgreement = typeof consentAgreements.$inferSelect;
export type InsertConsentAgreement = typeof consentAgreements.$inferInsert;

// Beluga API request types
export type BelugaApiRequest = typeof belugaApiRequests.$inferSelect;
export type InsertBelugaApiRequest = typeof belugaApiRequests.$inferInsert;

// Beluga webhook event types
export type BelugaWebhookEvent = typeof belugaWebhookEvents.$inferSelect;
export type InsertBelugaWebhookEvent = typeof belugaWebhookEvents.$inferInsert;

// Medication questionnaire responses table
export const medicationQuestionnaires = pgTable("medication_questionnaires", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  questionnaireType: varchar("questionnaire_type", { length: 50 }).notNull(), // 'ed' or 'weightloss'
  responses: jsonb("responses").notNull(), // Store all questionnaire responses as JSON
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Consent agreements table
export const consentAgreements = pgTable("consent_agreements", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  consentType: varchar("consent_type", { length: 50 }).notNull(), // 'telehealth' or 'privacy'
  agreed: boolean("agreed").notNull(),
  agreedAt: timestamp("agreed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations for medication questionnaires
export const medicationQuestionnairesRelations = relations(
  medicationQuestionnaires,
  ({ one }) => ({
    order: one(orders, {
      fields: [medicationQuestionnaires.orderId],
      references: [orders.id],
    }),
    user: one(users, {
      fields: [medicationQuestionnaires.userId],
      references: [users.id],
    }),
  }),
);

// Define relations for consent agreements
export const consentAgreementsRelations = relations(
  consentAgreements,
  ({ one }) => ({
    order: one(orders, {
      fields: [consentAgreements.orderId],
      references: [orders.id],
    }),
    user: one(users, {
      fields: [consentAgreements.userId],
      references: [users.id],
    }),
  }),
);

export const junctionUsers = pgTable("junction_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  localClientUserId: text("local_client_user_id").unique(),
  remoteClientUserId: text("remote_client_user_id").unique().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

export const junctionUsersRelations = relations(junctionUsers, ({ one }) => ({
  user: one(users, {
    fields: [junctionUsers.userId],
    references: [users.id],
  }),
}));

// Beluga API requests and responses storage
export const belugaApiRequests = pgTable("beluga_api_requests", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  masterId: varchar("master_id", { length: 100 }).notNull().unique(), // Beluga's unique identifier
  visitType: varchar("visit_type", { length: 50 }).notNull(), // 'ED' or 'weightloss'
  requestPayload: jsonb("request_payload").notNull(), // Full JSON request sent to Beluga
  responsePayload: jsonb("response_payload"), // Full JSON response from Beluga
  status: varchar("status", { length: 50 }).notNull().default('pending'), // 'pending', 'success', 'error'
  httpStatus: integer("http_status"), // HTTP status code from Beluga
  errorMessage: text("error_message"), // Error message if request failed
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"), // When we received the response
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // New webhook-specific fields
  visitStatus: varchar("visit_status", { length: 50 }).default('pending'), // 'pending', 'in_review', 'approved', 'rejected', 'completed', 'cancelled', 'failed'
  doctorResponse: jsonb("doctor_response"), // Doctor's response and prescription details
  webhookReceivedAt: timestamp("webhook_received_at"), // When we received the webhook
  visitId: varchar("visit_id", { length: 100 }), // Beluga's visit ID
  lastWebhookEvent: varchar("last_webhook_event", { length: 50 }), // Last webhook event type received
});

// Beluga webhook events audit trail
export const belugaWebhookEvents = pgTable("beluga_webhook_events", {
  id: serial("id").primaryKey(),
  masterId: varchar("master_id", { length: 100 }).notNull(), // Beluga's unique identifier
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'CONSULT_CANCELED', 'RX_WRITTEN', 'CONSULT_CONCLUDED', 'NAME_UPDATE'
  eventPayload: jsonb("event_payload").notNull(), // Full webhook payload
  processedAt: timestamp("processed_at").defaultNow().notNull(),
  processingStatus: varchar("processing_status", { length: 50 }).default('pending'), // 'pending', 'success', 'error'
  errorMessage: text("error_message"), // Error message if processing failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations for Beluga API requests
export const belugaApiRequestsRelations = relations(
  belugaApiRequests,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [belugaApiRequests.orderId],
      references: [orders.id],
    }),
    user: one(users, {
      fields: [belugaApiRequests.userId],
      references: [users.id],
    }),
    webhookEvents: many(belugaWebhookEvents),
  }),
);

// Define relations for Beluga webhook events
export const belugaWebhookEventsRelations = relations(
  belugaWebhookEvents,
  ({ one }) => ({
    belugaRequest: one(belugaApiRequests, {
      fields: [belugaWebhookEvents.masterId],
      references: [belugaApiRequests.masterId],
    }),
  }),
);