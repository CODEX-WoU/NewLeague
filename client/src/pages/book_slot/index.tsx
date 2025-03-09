import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../../config/axiosConfig";
interface Category {
  id: string;
  category_name: string;
  cover_image_url: string;
}

interface Facility {
  id: string;
  name: string;
  cover_image_url: string;
}

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  courts_available_at_slot: number;
  is_available: boolean;
  day: string;
}

const SlotBooking = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const today = new Date().toISOString().split("T")[0];
  const todayDay = new Date().toLocaleString("en-US", { weekday: "long" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await server.get<{ success: boolean; data: Category[] }>(
          "/facility/category",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data);
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, [token]);

  const fetchFacilities = async (categoryId: string) => {
    setLoading(true);
    try {
      const res = await server.get<{ success: boolean; data: Facility[] }>(
        `/facility?categoriesIdFilter=${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFacilities(res.data.data);
    } catch (err) {
      console.error("Error fetching facilities", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (facilityId: string) => {
    setLoading(true);
    try {
      const res = await server.post<{ success: boolean; data: Slot[] }>(
        "/slot/search",
        {
          sort: { sortBy: "startsAt", order: "asc" },
          filters: { facilities: [facilityId] },
          availability: { date: today },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const filteredSlots = res.data.data.filter(
        (slot) => slot.day === todayDay
      );
      console.log(facilityId);
      console.log(res.data);
      setSlots(filteredSlots);
    } catch (err) {
      console.error("Error fetching slots", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Select a Category</h2>
      <div className="flex gap-4 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => {
              setSelectedCategory(category.id);
              fetchFacilities(category.id);
              setFacilities([]);
              setSlots([]);
            }}
          >
            <img
              src={category.cover_image_url}
              alt={category.category_name}
              className="h-24 w-24 object-cover rounded"
            />
            <p>{category.category_name}</p>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <>
          <h2 className="text-xl font-bold mt-6">Select a Facility</h2>
          <div className="grid grid-cols-2 gap-4">
            {facilities.map((facility) => (
              <div key={facility.id} className="border p-4 rounded-lg shadow">
                <img
                  src={facility.cover_image_url}
                  alt={facility.name}
                  className="w-full h-32 object-cover"
                />
                <p className="text-lg font-semibold">{facility.name}</p>
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedFacility(facility.id);
                    fetchSlots(facility.id);
                    setSlots([]);
                  }}
                >
                  View Slots
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedFacility && (
        <>
          <h2 className="text-xl font-bold mt-6">Available Slots</h2>
          <div className="grid grid-cols-2 gap-4">
            {slots.length > 0 ? (
              slots.map((slot) => (
                <div key={slot.id} className="border p-4 rounded-lg shadow">
                  <p className="text-lg font-semibold">
                    {slot.start_time} - {slot.end_time}
                  </p>
                  <p>Courts Available: {slot.courts_available_at_slot}</p>
                  <button
                    className={`mt-2 px-4 py-2 rounded ${
                      slot.is_available
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!slot.is_available}
                  >
                    Select Slot
                  </button>
                </div>
              ))
            ) : (
              <p>No available slots for today.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SlotBooking;
