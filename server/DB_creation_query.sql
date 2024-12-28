CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum types for the 'role' and 'status' fields
CREATE TYPE user_role AS ENUM ('STUDENT', 'COACH', 'ADMIN');
CREATE TYPE booking_status AS ENUM ('SCHEDULED', 'CANCELLED', 'USED', 'EXPIRED');
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    category_id UUID REFERENCES facility_categories(id) ON DELETE SET NULL,
    capacity_per_court INT,
    number_of_courts INT NOT NULL,
    cover_image_url VARCHAR,    
    extra_image_urls VARCHAR[],
    description TEXT
);


-- Create the 'slots' table
CREATE TABLE slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    facility_id UUID not NULL REFERENCES facilities(id),
    courts_available_at_slot INT NOT NULL
);

-- Create the 'booking' table
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_date DATE NOT NULL,
    user_id VARCHAR not null REFERENCES users(id),
    slot_id UUID not NULL REFERENCES slots(id),
    status booking_status NOT NULL
);


-- Create the 'slot_days_availability' table
CREATE TABLE slot_days_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id UUID NOT NULL REFERENCES slots(id),
    day day_enum NOT NULL
);

