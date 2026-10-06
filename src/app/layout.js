import ClientLayout from "@/ClientLayout";
import { SidebarProvider } from "./candidates/hooks/SidebarContext";

import "./globals.css";


export const metadata = {
    title: "Pathfinder",
    description: "My application",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <SidebarProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </SidebarProvider>
            </body>
        </html>
    );
}