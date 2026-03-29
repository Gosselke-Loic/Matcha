import { useSuspenseQueries } from "@tanstack/react-query"; 
import { Tab, TabGroup, TabPanel, TabPanels } from "@headlessui/react";

import { profileViewersOptions, profileLikersOptions } from "../services/profile-options";

interface ProfileActivityProps {
  userId: number;
}

export default function ProfileActivity({ userId }: ProfileActivityProps) {
  const [{ data: likers, data: visitors }] = useSuspenseQueries({
    queries: [profileLikersOptions(userId), profileViewersOptions(userId)]
  });

  const tabs = [
    { id: 'likes', label: "", title: "", data: likers, empty: "" },
    { id: 'visitors', label: "", title: "", data: visitors, empty: "" }
  ];
  
  return (
    <div className="container mx-auto p-4">
      <TabGroup className="flex gap-4 border-b border-gray-200 mb-6 md:hidden">
        {tabs.map((tab) => (
        <Tab
          key={tab.id}
          className="py-2 px-4 text-sm font-medium focus:outline-none
            data-selected:border-b-2 data-selected:border-pink-600 data-selected:text-pink-600"
        >
          {tab.label}
        </Tab>
        ))}
      </TabGroup>

      <TabPanels className="md:grid md:grid-cols-2 md:gap-8">
        {tabs.map((tab) => (
          <TabPanel
            key={tab.id}
            static={true}
            className="ui-not-selected:hidden md:block!"
          >
            <h2 className="hidden md:block text-xl font-bold mb-4">
              {tab.title}
            </h2>

            {/* component list */}
          </TabPanel>
        ))}
      </TabPanels>
    </div>
  );
};
