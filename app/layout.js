// app/layout.js (or wherever your RootLayout is)
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://source.zoom.us/3.12.0/css/bootstrap.css"
        />
        <link
          rel="stylesheet"
          href="https://source.zoom.us/3.12.0/css/react-select.css"
        />
        <script src="https://source.zoom.us/3.12.0/lib/vendor/react.min.js"></script>
        <script src="https://source.zoom.us/3.12.0/lib/vendor/react-dom.min.js"></script>
        <script src="https://source.zoom.us/3.12.0/lib/vendor/redux.min.js"></script>
        <script src="https://source.zoom.us/3.12.0/lib/vendor/redux-thunk.min.js"></script>
        <script src="https://source.zoom.us/3.12.0/lib/vendor/lodash.min.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Zoom Web SDK will inject UI here */}
        <div id="zmmtg-root"></div>
      </body>
    </html>
  );
}
