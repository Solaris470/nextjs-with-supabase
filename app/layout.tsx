import DeployButton from "@/components/deploy-button";
import Footer from "@/components/layout/footer";

import { Kanit } from "next/font/google";
import { createClient } from '@/utils/supabase/client';
import ClientLayout from "@/components/ClientLayout";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

        
        <ClientLayout userId={user?.id || ''}>
            {children}
          </ClientLayout>
        
      {/* <Footer /> */}
      
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}
