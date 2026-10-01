"use client";

import { useState, useEffect } from "react";
import { getTemplate } from "@/templates/registry";
import type { Wedding, Guest, GuestMessage } from "@/types/wedding";
import { TrialWatermark } from "@/components/invitation/TrialWatermark";
import { TrialExpiredNotice } from "@/components/invitation/TrialExpiredNotice";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";
import { checkTrialStatus } from "@/lib/wedding/trial";

export default function InvitationClient({
  wedding,
  guest,
  messages,
  templateSlug,
}: {
  wedding: Wedding;
  guest: Guest | null;
  messages: GuestMessage[];
  templateSlug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Auto buka modal E-Pass langsung jika link URL mengandung ?epass=1 atau ?ticket=1
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("epass") === "1" ||
        params.get("epass") === "true" ||
        params.get("ticket") === "1" ||
        params.get("ticket") === "true"
      ) {
        setTicketModalOpen(true);
      }
    }
  }, []);

  // Kunci scroll layar saat cover masih aktif agar pas 100dvh dan tidak bisa di-scroll di mobile
  useEffect(() => {
    if (!isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyHeight = document.body.style.height;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalHtmlHeight = document.documentElement.style.height;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100dvh";
      document.body.style.overscrollBehavior = "none";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100dvh";
      document.documentElement.style.overscrollBehavior = "none";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;
        document.body.style.overscrollBehavior = "";
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.height = originalHtmlHeight;
        document.documentElement.style.overscrollBehavior = "";
      };
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.overscrollBehavior = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.documentElement.style.overscrollBehavior = "";
    }
  }, [isOpen]);
  const template = getTemplate(templateSlug);

  if (!template) return <div className="p-8 text-center">Template not found</div>;

  const coupleTitle = `${wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin"} & ${wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin"}`;

  // Cek masa aktif trial 3 hari berbasis paket undangan
  const trialStatus = checkTrialStatus(
    {
      plan: (wedding as any).plan,
      createdAt: wedding.createdAt,
      user: wedding.user,
    },
    wedding.isDemo
  );

  if (trialStatus.isExpired) {
    return <TrialExpiredNotice coupleTitle={coupleTitle} />;
  }

  const context = { wedding, guest, messages };
  const { Layout } = template;
  const firstEvent = wedding.events && wedding.events.length > 0 ? wedding.events[0] : null;

  return (
    <>
      <TrialWatermark
        isTrial={trialStatus.isTrial}
        daysRemaining={trialStatus.daysRemaining}
      />
      <Layout
        context={context}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onOpenTicket={() => setTicketModalOpen(true)}
      />

      {/* Guest Ticket Modal (Triggered directly from the Cover) */}
      {guest && (
        <GuestTicketModal
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          guestName={guest.name}
          guestSlug={guest.slug}
          guestAddress={guest.address}
          guestCategory={guest.category}
          guestCount={guest.guestCount}
          tableNumber={guest.tableNumber}
          sessionName={guest.sessionName}
          coupleTitle={coupleTitle}
          eventDate={firstEvent?.date}
          venueName={firstEvent?.venue}
          weddingSlug={wedding.slug}
          templateSlug={templateSlug}
          qrCode={(guest as any).qrCode}
        />
      )}

      {/* Permanent Canonical SEO Platform Backlink */}
      <footer className="sr-only" aria-label="Hayvows Digital Wedding Invitation Platform">
        <p>
          Undangan pernikahan digital ini dibuat dengan{" "}
          <a href="https://www.hayvows.com" rel="noopener">
            Hayvows Digital Wedding
          </a>
          . Buat undangan pernikahan online elegan dengan fitur buku tamu digital QR Code dan layar TV resepsi di{" "}
          <a href="https://www.hayvows.com" rel="noopener">
            www.hayvows.com
          </a>
          .
        </p>
      </footer>
    </>
  );
}