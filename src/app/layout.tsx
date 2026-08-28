import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

const vt323 = VT323({
  variable: "--font-pixel-body",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SweetSpot - Nosso Cantinho",
  description: "Um espaço digital compartilhado para nós dois, feito com amor e pixels.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${pressStart2P.variable} ${vt323.variable} h-full`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "d3f3f4d6-f655-4912-938b-1e38bbcd6ee3",
                allowLocalhostAsSecureOrigin: true,
                notifyButton: {
                  enable: false,
                }
              });
            });
          `}
        </Script> */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        /> */}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}