import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Hyper-Local Charity Dashboard",
  description: "Continuity, reporting and impact dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
