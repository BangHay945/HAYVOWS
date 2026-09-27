import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akun Hayvows | Platform Undangan Pernikahan Digital",
  description: "Masuk atau daftar ke platform Hayvows.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
