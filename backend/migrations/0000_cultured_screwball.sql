CREATE TABLE "claxon_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"message_en" text NOT NULL,
	"message_ro" text NOT NULL,
	"message_ru" text NOT NULL,
	"icon" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE "claxons" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"recipient_id" text NOT NULL,
	"vehicle_id" text NOT NULL,
	"template_id" text,
	"license_plate" text NOT NULL,
	"type" text,
	"custom_message" text,
	"sender_language" text,
	"read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"clerk_id" text NOT NULL,
	"dob" text,
	"gender" text,
	"language" text,
	"last_name" text,
	"first_name" text,
	"avatar_url" text,
	"privacy_settings" text,
	"is_phone_public" boolean DEFAULT false,
	"notification_preferences" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);

CREATE TABLE "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"brand" text,
	"model" text,
	"color" text,
	"phase" text,
	"vin_code" text,
	"plate_type" text,
	"plate_number" text,
	"plate_country" text,
	"plate_left_part" text,
	"plate_right_part" text,
	"manufacture_year" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

ALTER TABLE "claxons" ADD CONSTRAINT "claxons_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "claxons" ADD CONSTRAINT "claxons_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "claxons" ADD CONSTRAINT "claxons_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "claxons" ADD CONSTRAINT "claxons_template_id_claxon_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."claxon_templates"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "template_category_idx" ON "claxon_templates" USING btree ("category");
CREATE INDEX "template_is_active_idx" ON "claxon_templates" USING btree ("is_active");
CREATE INDEX "claxon_sender_id_idx" ON "claxons" USING btree ("sender_id");
CREATE INDEX "claxon_recipient_id_idx" ON "claxons" USING btree ("recipient_id");
CREATE INDEX "claxon_vehicle_id_idx" ON "claxons" USING btree ("vehicle_id");
CREATE INDEX "claxon_template_id_idx" ON "claxons" USING btree ("template_id");
CREATE INDEX "claxon_read_idx" ON "claxons" USING btree ("read");
CREATE INDEX "claxon_type_idx" ON "claxons" USING btree ("type");
CREATE INDEX "claxon_read_at_idx" ON "claxons" USING btree ("read_at");
CREATE INDEX "claxon_sender_language_idx" ON "claxons" USING btree ("sender_language");
CREATE INDEX "phone_idx" ON "users" USING btree ("phone");
CREATE INDEX "email_idx" ON "users" USING btree ("email");
CREATE INDEX "clerk_id_idx" ON "users" USING btree ("clerk_id");
CREATE INDEX "vehicle_user_id_idx" ON "vehicles" USING btree ("user_id");
CREATE INDEX "vehicle_vin_code_idx" ON "vehicles" USING btree ("vin_code");
CREATE INDEX "vehicle_is_active_idx" ON "vehicles" USING btree ("is_active");
CREATE INDEX "vehicle_plate_number_idx" ON "vehicles" USING btree ("plate_number");