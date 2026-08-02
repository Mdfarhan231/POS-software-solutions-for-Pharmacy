import "./globals.css";

export const metadata = {
  title: {
    default: "PharmaDesk POS",
    template: "%s | PharmaDesk POS",
  },
  description: "Pharmacy point-of-sale and inventory management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
