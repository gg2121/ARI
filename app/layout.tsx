import "./globals.css";
export const metadata = {
  title: "ARI — Scenario UI",
  description: "Minimal MVP Scenario UI"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );

}
