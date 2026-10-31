import type { Business } from "./content";
import { mailHref, toIntl, waHref } from "./format";

const VENUE_MESSAGE =
  "Hi Breezeblock, I'd like to enquire about hiring the venue.\n\nEvent type:\nPreferred date:\nEstimated number of guests:\nAnything else:";

/**
 * Venue-hire enquiry link. Opens WhatsApp to the events number once the cafe
 * has confirmed that number takes WhatsApp messages; until then, a prefilled
 * email to the cafe's published address. (Switch on in the admin.)
 */
export function venueEnquiryHref(b: Business) {
  if (b.eventsWhatsappConfirmed && b.phoneEvents) {
    return waHref(toIntl(b.phoneEvents), VENUE_MESSAGE);
  }
  return mailHref(b.email, "Venue hire enquiry", VENUE_MESSAGE);
}

/** Table / general enquiry. The cafe publishes its general number for WhatsApp bookings. */
export function reservationHref(b: Business) {
  const msg =
    "Hi Breezeblock, I'd like to reserve a table.\n\nDate:\nTime:\nNumber of people:";
  return b.whatsappGeneral ? waHref(b.whatsappGeneral, msg) : `tel:+${toIntl(b.phoneGeneral)}`;
}
