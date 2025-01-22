CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum types for the 'role' and 'status' fields
CREATE TYPE user_role AS ENUM ('STUDENT', 'COACH', 'ADMIN');
CREATE TYPE booking_status AS ENUM ('RESERVED', 'CANCELLED', 'USED', 'EXPIRED');
-- Create Enum type for 'day' field
CREATE TYPE day_enum AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday');


-- Create the 'users' table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone_no VARCHAR,
    role user_role NOT NULL,
    password VARCHAR NOT NULL
);

-- Create the 'programmes' table
CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course VARCHAR NOT NULL,
    specialization VARCHAR NOT NULL,
    year INT NOT NULL
);

-- Create the 'students' table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR not NULL REFERENCES users(id) ON DELETE CASCADE,
    programme_id UUID not null REFERENCES programmes(id)
);

CREATE TABLE facility_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR NOT NULL,
    description TEXT,
    cover_image_url VARCHAR
);

-- Create the 'facilities' table
CREATE TABLE facilities (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar NOT NULL,
	capacity_per_court int4 NULL,
	number_of_courts int4 NOT NULL,
	cover_image_url varchar NULL,
	extra_image_urls _varchar NULL,
	description text NULL,
	category_id uuid NULL,
	CONSTRAINT facilities_pkey PRIMARY KEY (id),
	CONSTRAINT facilities_category_fkey FOREIGN KEY (category_id) REFERENCES public.facility_categories(id) ON DELETE CASCADE
);

-- Create the 'slots' table
CREATE TABLE slots (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	start_time time NOT NULL,
	end_time time NOT NULL,
	facility_id uuid NOT NULL,
	courts_available_at_slot int4 NOT NULL,
	"day" public.day_enum NULL,
	payment_amount_inr float8 NULL,
	CONSTRAINT slots_pkey PRIMARY KEY (id),
	CONSTRAINT slots_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES facilities(id),
    CONSTRAINT unique_slot_combination UNIQUE (start_time, end_time, facility_id, "day")
);
-- Create the 'booking' table
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_date DATE NOT NULL,
    user_id VARCHAR not null REFERENCES users(id),
    slot_id UUID not NULL REFERENCES slots(id),
    status booking_status NOT NULL
);



