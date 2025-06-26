CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_type" varchar(100) NOT NULL,
	"file_size" text,
	"upload_type" varchar(50) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

ALTER TABLE "uploads" ADD CONSTRAINT "uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;