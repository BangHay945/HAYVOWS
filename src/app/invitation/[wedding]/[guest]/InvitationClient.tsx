"use client";

import { useState } from "react";
import { getTemplate } from "@/templates/registry";
import type { Wedding, Guest, GuestMessage } from "@/types/wedding";
import { TrialWatermark } from "@/components/invitation/TrialWatermark";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";

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
  const template = getTemplate(templateSlug);

  if (!template) return <div className="p-8 text-center">Template not found</div>;

  const context = { wedding, guest, messages };
  const { Layout } = template;

  // Cek apakah pemilik wedding berstatus paket Basic / Uji Coba (Bukan Premium & Bukan Luxury)
  // Catatan: Jika isDemo true (undangan demo showcase platform), watermark uji coba disembunyikan
  const isTrial = !wedding.isDemo && (wedding.user?.plan === "basic" || !wedding.user?.plan);

  const coupleTitle = `${wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin"} & ${wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin"}`;
  const firstEvent = wedding.events && wedding.events.length > 0 ? wedding.events[0] : null;

  return (
    <>
      <TrialWatermark isTrial={isTrial} />
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
    </>
  );
}