export interface Category {
  id: string;
  category_name: string;
  cover_image_url: string;
}

export interface Facility {
  id: string;
  name: string;
  cover_image_url: string;
}

export interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  courts_available_at_slot: number;
  is_available: boolean;
  day: string;
}

export interface Booking {
  id: string;
  booking_date: string;
  slot_id: string;
  status: "RESERVED" | "CANCELLED" | "USED" | "EXPIRED";
  user_id: string;
  student_id?: string;
  email: string;
  phone_no?: string;
  booker_name: string;
  start_time: string; // In format "HH:mm:ss"
  end_time: string; // In format "HH:mm:ss"
  day: string;
  facility_id: string;
  facility_name: string;
}
