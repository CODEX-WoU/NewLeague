import React from "react";

interface EventCardProps {
  eventName: string;
  trainedBy: string;
  info: string;
  price: number;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  trainedBy,
  info,
  price,
  image,
}) => {
  return (
    <div className="relative shadow-xl mx-4 bg-white grid grid-rows-11">
      {/* Image: spans the first 7 rows */}
      <img
        src={image}
        className="w-full h-full object-cover row-span-6"
        alt={eventName}
      />

      {/* Event name, trainedBy, and Price: spans rows 8 to 10 and divided into 2 columns */}
      <div className="row-span-3 grid grid-cols-2 items-center pr-4 pl-8">
        <div>
          <h3 className="text-3xl tracking-tight mb-2 font-extrabold font-plain">
            {eventName}
          </h3>
          <p className="text-[#909090] tracking-tight text-lg font-semibold font-plain">
            Trained by -{" "}
            <span className="text-black font-sans font-semibold">
              {trainedBy}
            </span>
          </p>
        </div>
        <div className="flex justify-end">
          <span className="bg-red-500 text-white font-bold flex items-center justify-center w-14 h-14 rounded-full">
            {price} /-
          </span>
        </div>
      </div>

      {/* Info: spans the last 2 rows */}
      <div className="row-span-3 px-8 pb-4 text-slate-500 text-lg">{info}</div>
    </div>
  );
};

export default EventCard;
