

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.accounts (id, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    SET search_path = '';
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" "uuid" NOT NULL,
    "phone" "text" NOT NULL,
    "email" "text",
    "dob" "text",
    "gender" "text",
    "language" "text" DEFAULT 'ro'::"text",
    "last_name" "text",
    "first_name" "text",
    "avatar_url" "text",
    "privacy_settings" "jsonb" DEFAULT '{}'::"jsonb",
    "is_phone_public" boolean DEFAULT false,
    "notification_preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."claxon_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "message_en" "text" NOT NULL,
    "message_ro" "text" NOT NULL,
    "message_ru" "text" NOT NULL,
    "icon" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."claxon_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."claxons" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "vehicle_id" "uuid" NOT NULL,
    "template_id" "uuid",
    "license_plate" "text" NOT NULL,
    "type" "text",
    "custom_message" "text",
    "sender_language" "text" DEFAULT 'ro'::"text",
    "read" boolean DEFAULT false,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."claxons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vehicles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "brand" "text",
    "model" "text",
    "color" "text",
    "phase" "text",
    "vin_code" "text",
    "plate_type" "text",
    "plate_number" "text",
    "plate_country" "text" DEFAULT 'MD'::"text",
    "plate_left_part" "text",
    "plate_right_part" "text",
    "manufacture_year" integer,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."vehicles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."claxon_templates"
    ADD CONSTRAINT "claxon_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."claxons"
    ADD CONSTRAINT "claxons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vehicles"
    ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");



CREATE INDEX "accounts_email_idx" ON "public"."accounts" USING "btree" ("email");



CREATE INDEX "accounts_phone_idx" ON "public"."accounts" USING "btree" ("phone");



CREATE INDEX "claxon_templates_category_idx" ON "public"."claxon_templates" USING "btree" ("category");



CREATE INDEX "claxon_templates_is_active_idx" ON "public"."claxon_templates" USING "btree" ("is_active");



CREATE INDEX "claxons_read_at_idx" ON "public"."claxons" USING "btree" ("read_at");



CREATE INDEX "claxons_read_idx" ON "public"."claxons" USING "btree" ("read");



CREATE INDEX "claxons_recipient_id_idx" ON "public"."claxons" USING "btree" ("recipient_id");



CREATE INDEX "claxons_sender_id_idx" ON "public"."claxons" USING "btree" ("sender_id");



CREATE INDEX "claxons_sender_language_idx" ON "public"."claxons" USING "btree" ("sender_language");



CREATE INDEX "claxons_template_id_idx" ON "public"."claxons" USING "btree" ("template_id");



CREATE INDEX "claxons_type_idx" ON "public"."claxons" USING "btree" ("type");



CREATE INDEX "claxons_vehicle_id_idx" ON "public"."claxons" USING "btree" ("vehicle_id");



CREATE INDEX "vehicles_is_active_idx" ON "public"."vehicles" USING "btree" ("is_active");



CREATE INDEX "vehicles_plate_number_idx" ON "public"."vehicles" USING "btree" ("plate_number");



CREATE INDEX "vehicles_user_id_idx" ON "public"."vehicles" USING "btree" ("user_id");



CREATE INDEX "vehicles_vin_code_idx" ON "public"."vehicles" USING "btree" ("vin_code");



CREATE OR REPLACE TRIGGER "update_accounts_updated_at" BEFORE UPDATE ON "public"."accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_claxon_templates_updated_at" BEFORE UPDATE ON "public"."claxon_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_claxons_updated_at" BEFORE UPDATE ON "public"."claxons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_vehicles_updated_at" BEFORE UPDATE ON "public"."vehicles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."claxons"
    ADD CONSTRAINT "claxons_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."claxons"
    ADD CONSTRAINT "claxons_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."claxons"
    ADD CONSTRAINT "claxons_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."claxon_templates"("id");



ALTER TABLE ONLY "public"."claxons"
    ADD CONSTRAINT "claxons_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vehicles"
    ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE;



CREATE POLICY "Active vehicles are searchable by plate" ON "public"."vehicles" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Authenticated users can view active templates" ON "public"."claxon_templates" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND ("is_active" = true)));



CREATE POLICY "Recipients can update claxons (mark as read)" ON "public"."claxons" FOR UPDATE USING (("auth"."uid"() = "recipient_id"));



CREATE POLICY "Users can delete their own vehicles" ON "public"."vehicles" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."accounts" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own vehicles" ON "public"."vehicles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can send claxons" ON "public"."claxons" FOR INSERT WITH CHECK (("auth"."uid"() = "sender_id"));



CREATE POLICY "Users can update their own profile" ON "public"."accounts" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own vehicles" ON "public"."vehicles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view claxons they received" ON "public"."claxons" FOR SELECT USING (("auth"."uid"() = "recipient_id"));



CREATE POLICY "Users can view claxons they sent" ON "public"."claxons" FOR SELECT USING (("auth"."uid"() = "sender_id"));



CREATE POLICY "Users can view their own profile" ON "public"."accounts" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own vehicles" ON "public"."vehicles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."claxon_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."claxons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vehicles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";



GRANT ALL ON TABLE "public"."claxon_templates" TO "anon";
GRANT ALL ON TABLE "public"."claxon_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."claxon_templates" TO "service_role";



GRANT ALL ON TABLE "public"."claxons" TO "anon";
GRANT ALL ON TABLE "public"."claxons" TO "authenticated";
GRANT ALL ON TABLE "public"."claxons" TO "service_role";



GRANT ALL ON TABLE "public"."vehicles" TO "anon";
GRANT ALL ON TABLE "public"."vehicles" TO "authenticated";
GRANT ALL ON TABLE "public"."vehicles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
