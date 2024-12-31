import DeployButton from "@/components/deploy-button";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Solar Managements System",
  description: "This wepsite for learned and developed ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={kanit.className}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css"
          rel="stylesheet"
        />
        <script src="https://kit.fontawesome.com/4383344860.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        < Header />

        <div className="p-4 sm:ml-64 bg-gray-100">
          <div className="mt-14 ">{children}</div>
        </div>
      {/* <Footer /> */}
      
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}
