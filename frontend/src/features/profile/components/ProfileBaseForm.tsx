import {
  HeartIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  PhoneOutgoingIcon
} from "lucide-react";
import {
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Transition
} from "@headlessui/react";
import { Fragment } from "react";

import ProfileForm from "./ProfileForm";
import HeaderProfile from "./HeaderProfile";
import ProfileImageForm from "./ProfileImagesForm";
import ProfileActivityForn from "./ProfileActivityForm";
import type { Tags } from "@/shared/schemas/tag-schema";
import ProfilePasswordForm from "./ProfilePasswordForm";  
import type { OwnProfileData } from "../schemas/profile-schema";

interface ProfileBaseFormProps {
  data: OwnProfileData;
  interests: Tags;
};

export default function ProfileBaseForm ({ data, interests }: ProfileBaseFormProps) {
  const categories = [
    { name: 'Profile', icon: UserCircleIcon, component: <ProfileForm interests={interests} data={data} /> },
    { name: 'Images', icon: PhoneOutgoingIcon, component: <ProfileImageForm userId={data.id} /> },
    { name: 'Activity', icon: HeartIcon, component: <ProfileActivityForn userId={data.id} /> },
    { name: 'Security', icon: ShieldCheckIcon, component: <ProfilePasswordForm /> }
  ];
  
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
      <HeaderProfile />

      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl border-pink-100 p-1">
          {categories.map((category) => (
            <Tab
              key={category.name}
              className="py-2 px-1 text-sm font-medium transition-colors focus:outline-none
                data-selected:border-b-2 data-selected:border-pink-400 data-selected:text-pink-500
                text-gray-500 hover:text-gray-700"
            >
              <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-2">
                <category.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{ category.name }</span>
              </div>
            </Tab>
          ))}          
        </TabList>
        <TabPanels className="mt-4">
          {categories.map((category) => (
            <TabPanel key={category.name} unmount={false} as={Fragment}>
              {({ selected }) => (
                <Transition
                  appear
                  as="div" // Maybe need to center component with className
                  show={selected}
                  enter="transition-opacity duration-300 ease-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opcity duration-150 ease-in"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {category.component}
                </Transition>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};
