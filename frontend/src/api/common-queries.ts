import { queryOptions } from "@tanstack/react-query";

export const commonWordsOptions = queryOptions({
  queryKey: ['common-words'],
  queryFn: async () => {
    const response = await fetch('/common-words.json');

    if (!response.ok) {
      throw new Error(
        'Error to load common words',
      );
    };

    const json = await response.json();
    
    return (new Set<string>(json));
  },
  staleTime: Infinity
});
