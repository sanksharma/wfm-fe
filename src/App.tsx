import Tasks from "@/pages/Tasks";
import MainLayout from "@/components/layout/MainLayout";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "react-query";
import { useEffect } from "react";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";

function App() {
  useEffect(() => {
    FirebaseMessaging.addListener("notificationReceived", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });


    return () => {
      FirebaseMessaging.removeAllListeners();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Tasks />
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;
