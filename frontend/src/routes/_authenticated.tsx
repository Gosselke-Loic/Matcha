import {
  Outlet,
  redirect,
  isRedirect,
  createFileRoute,
} from "@tanstack/react-router";

import Navbar from "@/shared/components/layouts/Navbar";
import Footer from "@/shared/components/layouts/Footer";
import ChatModal from "@/features/chat/components/ChatModal";
//import { useSocketSync } from "@/shared/hooks/useSocketSync";
import { GeneralError } from "@shared/components/errors/GeneralError";
import { authMeOptions } from "@/features/auth/services/auth-options";
import PageTransition from "@shared/components/transition/PageTransition";
import { chatUnreadMessagesCountOptions } from "@/features/chat/services/chat-options";
import { Suspense } from "react";

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    try {
      const user = await queryClient.ensureQueryData(authMeOptions);
      if (!user) throw new Error("Unauthorized");
    } catch (error) {
      if (isRedirect(error)) throw error;
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      });
    };
  },
  loader: async ({ context: { queryClient }}) => {
    await queryClient.ensureQueryData(chatUnreadMessagesCountOptions);
  },
  pendingComponent: () => <div> Replace for a custom component here </div>,
  pendingMs: 500,
  errorComponent: GeneralError,
  component: () => {
    //useSocketSync();
    
    return(
      <>
        <Suspense /* to do skeleton for fallback */>
          <Navbar />
        </Suspense>
        <PageTransition>
          <Outlet />
        </PageTransition>
        <ChatModal />
        <Footer />
      </>
    );
  },
  notFoundComponent: () => {
    <>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        { /* Not Found component */ }
      </div>
      <Footer />
    </>
  }
});
