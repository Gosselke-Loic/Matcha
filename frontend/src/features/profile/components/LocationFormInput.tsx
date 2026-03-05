import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import { externApi } from "@/api/api";
import { photonApiSchema } from "../schemas/photon-api-schema";
import { locationQueryOptions } from "../services/location-options";

export const LocationFormInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const { register, setValue, getValues, formState: { errors } } = useFormContext();

  useEffect(() => {
    if (searchTerm === getValues("address")) {
      return ;
    };
    
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);

    return (() => clearTimeout(timer));
  }, [searchTerm, getValues]);

  const error = errors["address"];
  const { data, status } = useQuery(locationQueryOptions(debouncedTerm));

  const handleGPS = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      
      try {
        const data = await externApi.get(
          `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`, photonApiSchema
        );

        if (data.features && data.features.length > 0) {
          const properties = data.features[0].properties;

          setValue("address", properties.name, { shouldValidate: true });
          setValue("lat", latitude);
          setValue("lon", longitude);

          setSearchTerm(properties.name);
        };
      } catch (error) {
        // toast with try again later message
      };
    });
  };

  const renderList = () => {
    if (status === "pending") {
      return (<li className="p-2 text-blue-500 animate-pulse">Search in progress...</li>)
    };

    if (status === "error") {
      return (<li className="p-2 text-red-500">Unable to contact the geolocation service</li>)
    };

    if (!data?.features || data.features.length === 0) {
      return (<li className="p-2 text-gray-500 italic">No addresses founded.</li>)
    };

    { /* keep old data to prevent flickering, maybe need spinner UX */ }
    return (
      data.features.map((feature, idx) => (
        <li
          key={`${feature.properties.name}-${idx}`}
          className="p-2 hover:bg-pink-50 cursor-pointer text-sm"
          onClick={() => {
            const [lat, lon] = feature.geometry.coordinates;
            setValue('address', feature.properties.name, { shouldValidate: true });
            setValue('lat', lat);
            setValue('lon', lon);
            setSearchTerm(searchTerm);
          }}
        >
          {feature.properties.name}, {feature.properties.city}
        </li>
      ))
    );
  };

  return (
    <div className="space-y-2 border-l-2 border-pink-500 pl-4">
      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor="address" className="text-sm font-medium text-slate-700">
          Your address
        </label>

        <input
          {...register("address")}
          value={searchTerm}
          id="address"
          type="search"
          placeholder="City or address..."
          onChange={(e) => {
            const val = e.target.value;
            setSearchTerm(val);

            setValue("lat", undefined);
            setValue("lon", undefined);
          }}
          className={`px-3 py-2 border rounded-md outline-none transition-colors
            ${error?.message ? "border-red-500 focus:border-red-600" : "bg-slate-300 focus:border-pink-500"}
          `}
        />

        <button
          type="button"
          onClick={handleGPS}
          className="bg-gray-100 px-3 rounded hover:bg-gray-200"
        >
          Locate Me
        </button>
      </div>

      <ul className="absolute z-10 bg-white border rounded shadow-sm max-h-40 overflow-auto">
        {renderList()}
      </ul>

      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          { error.message.toString() }
        </span>
      )}

      <input type="hidden" {...register("lat")} />
      <input type="hidden" {...register("lon")} />
    </div>
  );
};
