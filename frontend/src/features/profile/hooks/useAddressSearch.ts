import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react"; 
import type { FieldValues, UseFormSetValue } from "react-hook-form";

import {
  photonApiSchema,
  type FeaturePhotonApiData
} from "../schemas/photon-api-schema";
import { externApi } from "@/api/api";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { locationQueryOptions } from "../services/location-options";

interface UseAddressSearchProps {
  setValue: UseFormSetValue<FieldValues>
};

export const useAddressSearch = (
  { setValue }: UseAddressSearchProps
) => {
  const [showList, setShowList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowList(false);
      }  
    };

    document.addEventListener("mousedown", handleClick);
    return (() => document.removeEventListener("mousedown", handleClick)); 
  }, []);

  const { data, status } = useQuery(locationQueryOptions(debouncedSearch, isSelected));

  const onSelectOption = (feature: FeaturePhotonApiData) => {
    const [lat, lon] = feature.geometry.coordinates;
    setValue('address', feature.properties.name, { shouldValidate: true });
    setValue('city', feature.properties.city);
    setValue('lat', lat);
    setValue('lon', lon);

    setIsSelected(true);
    setSearchTerm(feature.properties.name);

    setShowList(false);
  };

  // Spinner loading for locate me button?
  const handleGPS = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      
      try {
        const data = await externApi.get(
          `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`, photonApiSchema
        );

        if (data.features && data.features.length > 0) {
          const properties = data.features[0].properties;

          setValue('address', properties.name, { shouldValidate: true });
          setValue('city', properties.city);
          setValue('lat', latitude);
          setValue('lon', longitude);

          setSearchTerm(properties.name);
        };
        // toast success but no address founded
      } catch (error) {
        // toast with error try again later message
      };
    });
  };

  return ({
    status,
    showList,
    handleGPS,
    searchTerm,
    setShowList,
    containerRef,
    setSearchTerm,
    setIsSelected,
    onSelectOption,
    suggestions: data
  });
};
