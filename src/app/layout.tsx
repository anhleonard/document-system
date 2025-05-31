"use client";
import "./globals.css";
import localFont from "next/font/local";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Modal from "@/components/modal";
import ConfirmModal from "@/components/confirm-modal";
import Loading from "@/components/loading";
import { Alert } from "@/components/alert";

const Urbanist = localFont({
  src: [
    { path: "../assets/fonts/Urbanist-Thin.ttf", weight: "100" },
    { path: "../assets/fonts/Urbanist-ExtraLight.ttf", weight: "200" },
    { path: "../assets/fonts/Urbanist-Light.ttf", weight: "300" },
    { path: "../assets/fonts/Urbanist-Regular.ttf", weight: "400" },
    { path: "../assets/fonts/Urbanist-Medium.ttf", weight: "500" },
    { path: "../assets/fonts/Urbanist-SemiBold.ttf", weight: "600" },
    { path: "../assets/fonts/Urbanist-Bold.ttf", weight: "700" },
    { path: "../assets/fonts/Urbanist-ExtraBold.ttf", weight: "800" },
    { path: "../assets/fonts/Urbanist-Black.ttf", weight: "900" },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${Urbanist.className}`}>
        <Provider store={store}>
          <div className="w-full bg-white">{children}</div>
          <Modal />
          <ConfirmModal />
          <Loading />
          <Alert />
        </Provider>
      </body>
    </html>
  );
}
