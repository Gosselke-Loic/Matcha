import { useFormContext } from "react-hook-form";

import { useAddressSearch } from "../hooks/use-address-search";

export const LocationFormInput = () => {  
  const {
    register,
    setValue,
    formState: { errors }
  } = useFormContext();
  const error = errors["address"];

  const {
    status,
    showList,
    handleGPS,
    searchTerm,
    setShowList,
    suggestions,
    containerRef,
    setSearchTerm,
    setIsSelected,
    onSelectOption
  } = useAddressSearch({ setValue });

  const renderList = () => {
    if (status === "pending") {
      return (<li className="p-2 text-blue-500 animate-pulse">Search in progress...</li>)
    };

    if (status === "error") {
      return (<li className="p-2 text-red-500">Unable to contact the geolocation service</li>)
    };

    if (!suggestions || suggestions.length === 0) {
      return (<li className="p-2 text-gray-500 italic">No addresses founded.</li>)
    };

    return (
      suggestions.map((feature, idx) => (
        <li
          key={`${feature.properties.name}-${idx}`}
          className="relative p-2 hover:bg-pink-50 cursor-pointer text-sm"
          onClick={() => {onSelectOption(feature)}}
        >
          {feature.properties.name}, {feature.properties.city}
        </li>
      ))
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex"
      >
        <label htmlFor="address" className="text-sm font-medium text-slate-700">
          Your address
        </label>

        <input
          {...register("address")}
          value={searchTerm}
          type="search"
          onChange={(e) => {
            setIsSelected(false);
            setSearchTerm(e.target.value);
            setValue("lat", undefined);
            setValue("lon", undefined);
            setValue("city", undefined);
          }}
          onFocus={() => setShowList(true)}
          placeholder="City or address..."
          className={`block w-full px-3 py-2 border rounded-md outline-none transition-colors
            ${error?.message ? "border-red-500 focus:border-red-600" : "bg-slate-300 focus:border-pink-500"}
          `}
        />

        <button
          type="button"
          onClick={handleGPS}
          className="shrink-0 font-semibold bg-gray-100 px-3 rounded hover:bg-pink-200"
        >
          Locate Me
        </button>
      </div>

      {showList && (  
        <ul className="absolute w-full mt-1 z-50 bg-white border rounded shadow-sm max-h-40 overflow-auto">
          {renderList()}
        </ul>
      )}

      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          { error.message.toString() }
        </span>
      )}

      <input type="hidden" {...register("lat")} />
      <input type="hidden" {...register("lon")} />
      <input type="hidden" {...register("city")} /> 
    </div>
  );
};
