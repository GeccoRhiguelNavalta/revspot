import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";

export const metadata = {
  title: "RevSpot",
  description: "Instagram for car spotters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
