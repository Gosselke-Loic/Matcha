import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"; 
import { useFormContext } from "react-hook-form"; 

export const LocationFormInput = () => {
  const {  } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);

    return (() => clearTimeout(timer));
  }, [searchTerm]);

  // put a try catch for externapi?  
};
