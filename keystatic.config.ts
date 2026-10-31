import { collection, config, fields, singleton } from "@keystatic/core";

/**
 * Editable content for Breezeblock Cafe.
 *
 * Everything the owner may need to change lives here and is stored as JSON
 * files in /content. Pages only read this content, so no code edits are
 * needed for prices, hours, photos, events or announcements.
 *
 * Storage: local files while developing; GitHub when the env vars below are
 * set (this gives the owner a secure, login-protected admin at /keystatic on
 * the live site, and every save triggers a redeploy).
 */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined;

const image = (label: string, dir: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/images/${dir}`,
    publicPath: `/images/${dir}/`,
  });

export default config({
  storage: githubRepo
    ? { kind: "github", repo: githubRepo }
    : { kind: "local" },
  ui: {
    brand: { name: "Breezeblock Admin" },
    navigation: {
      "Cafe details": ["business", "announcement"],
      Menu: ["menu"],
      Photos: ["photos", "gallery"],
      "Page text": ["home", "story"],
      Events: ["events"],
    },
  },

  singletons: {
    business: singleton({
      label: "Business information",
      path: "content/business",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Business name" }),
        tagline: fields.text({ label: "Tagline" }),
        phoneGeneral: fields.text({
          label: "General enquiries & reservations phone",
          description: "As people would dial it, e.g. 078 175 2556",
        }),
        whatsappGeneral: fields.text({
          label: "WhatsApp number (international, digits only)",
          description: "e.g. 27781752556. Leave blank to hide WhatsApp buttons.",
        }),
        phoneEvents: fields.text({ label: "Venue hire & events phone" }),
        eventsContactName: fields.text({ label: "Events contact name" }),
        eventsWhatsappConfirmed: fields.checkbox({
          label: "Events number accepts WhatsApp",
          description:
            "Tick only once confirmed. Until then venue-hire buttons open an email.",
          defaultValue: false,
        }),
        email: fields.text({ label: "Email address" }),
        streetAddress: fields.text({ label: "Street address" }),
        suburb: fields.text({ label: "Suburb" }),
        city: fields.text({ label: "City" }),
        postalCode: fields.text({ label: "Postal code" }),
        hours: fields.array(
          fields.object({
            days: fields.text({ label: "Days", description: "e.g. Monday–Friday" }),
            dayCodes: fields.multiselect({
              label: "Days covered (for Google)",
              options: [
                { label: "Monday", value: "Monday" },
                { label: "Tuesday", value: "Tuesday" },
                { label: "Wednesday", value: "Wednesday" },
                { label: "Thursday", value: "Thursday" },
                { label: "Friday", value: "Friday" },
                { label: "Saturday", value: "Saturday" },
                { label: "Sunday", value: "Sunday" },
              ],
            }),
            opens: fields.text({ label: "Opens (24h)", description: "e.g. 07:00" }),
            closes: fields.text({ label: "Closes (24h)", description: "e.g. 16:00" }),
          }),
          {
            label: "Opening hours",
            itemLabel: (p) => p.fields.days.value || "Hours",
          }
        ),
        instagramUrl: fields.text({ label: "Instagram URL" }),
        facebookUrl: fields.text({ label: "Facebook URL" }),
        menuNotice: fields.text({
          label: "Menu notice",
          multiline: true,
        }),
      },
    }),

    announcement: singleton({
      label: "Announcement banner",
      path: "content/announcement",
      format: { data: "json" },
      schema: {
        enabled: fields.checkbox({ label: "Show banner", defaultValue: false }),
        text: fields.text({ label: "Banner text" }),
        linkLabel: fields.text({ label: "Link label (optional)" }),
        linkHref: fields.text({
          label: "Link address (optional)",
          description: "e.g. /events or https://…",
        }),
      },
    }),

    photos: singleton({
      label: "Key photographs",
      path: "content/photos",
      format: { data: "json" },
      schema: {
        hero: image("Home hero", "site", "Wide, landscape. The first thing visitors see."),
        heroAlt: fields.text({ label: "Hero description (alt text)" }),
        intro: image("Brand introduction", "site"),
        introAlt: fields.text({ label: "Brand introduction alt text" }),
        courtyardLarge: image("Courtyard, large", "site"),
        courtyardLargeAlt: fields.text({ label: "Courtyard large alt text" }),
        courtyardA: image("Courtyard, detail A", "site"),
        courtyardAAlt: fields.text({ label: "Detail A alt text" }),
        courtyardB: image("Courtyard, detail B", "site"),
        courtyardBAlt: fields.text({ label: "Detail B alt text" }),
        coffee: image("Coffee", "site"),
        coffeeAlt: fields.text({ label: "Coffee alt text" }),
        coffeeSecondary: image("Coffee, second photo", "site"),
        coffeeSecondaryAlt: fields.text({ label: "Coffee second alt text" }),
        stay: image("A place to stay awhile", "site"),
        stayAlt: fields.text({ label: "Stay awhile alt text" }),
        events: image("Events & venue hire", "site"),
        eventsAlt: fields.text({ label: "Events alt text" }),
        story: image("Our Story", "site"),
        storyAlt: fields.text({ label: "Our Story alt text" }),
        storySecondary: image("Our Story, second photo", "site"),
        storySecondaryAlt: fields.text({ label: "Our Story second alt text" }),
      },
    }),

    home: singleton({
      label: "Home page text",
      path: "content/home",
      format: { data: "json" },
      schema: {
        heroHeadline: fields.text({ label: "Hero headline", multiline: true }),
        heroText: fields.text({ label: "Hero supporting text", multiline: true }),
        introHeadline: fields.text({ label: "Introduction headline" }),
        introBody: fields.array(fields.text({ label: "Paragraph", multiline: true }), {
          label: "Introduction paragraphs",
          itemLabel: (p) => p.value.slice(0, 40) || "Paragraph",
        }),
        courtyardHeadline: fields.text({ label: "Courtyard headline" }),
        courtyardText: fields.text({ label: "Courtyard text", multiline: true }),
        courtyardFeatures: fields.array(fields.text({ label: "Feature" }), {
          label: "Courtyard features",
          itemLabel: (p) => p.value || "Feature",
        }),
        foodHeadline: fields.text({ label: "Food headline" }),
        signatureDishes: fields.array(
          fields.object({
            name: fields.text({ label: "Dish name" }),
            description: fields.text({ label: "Short description", multiline: true }),
            price: fields.text({ label: "Price (as on the menu)" }),
            note: fields.text({ label: "Note (e.g. Weekends only)" }),
            photo: image("Photo", "dishes"),
            photoAlt: fields.text({ label: "Photo alt text" }),
          }),
          { label: "Signature dishes", itemLabel: (p) => p.fields.name.value || "Dish" }
        ),
        coffeeHeadline: fields.text({ label: "Coffee headline" }),
        coffeeBody: fields.array(fields.text({ label: "Paragraph", multiline: true }), {
          label: "Coffee paragraphs",
          itemLabel: (p) => p.value.slice(0, 40) || "Paragraph",
        }),
        coffeeHighlights: fields.array(
          fields.object({
            name: fields.text({ label: "Drink" }),
            price: fields.text({ label: "Price" }),
          }),
          { label: "Coffee highlights", itemLabel: (p) => p.fields.name.value || "Drink" }
        ),
        stayHeadline: fields.text({ label: "Stay-awhile headline" }),
        stayPoints: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          { label: "Stay-awhile points", itemLabel: (p) => p.fields.title.value || "Point" }
        ),
        eventsHeadline: fields.text({ label: "Events headline" }),
        eventsBody: fields.text({ label: "Events text", multiline: true }),
        eventTypes: fields.array(fields.text({ label: "Event type" }), {
          label: "Events we host",
          itemLabel: (p) => p.value || "Event type",
        }),
        locationHeadline: fields.text({ label: "Location headline" }),
        locationText: fields.text({ label: "Location text", multiline: true }),
      },
    }),

    story: singleton({
      label: "Our Story page",
      path: "content/story",
      format: { data: "json" },
      schema: {
        headline: fields.text({ label: "Headline", multiline: true }),
        standfirst: fields.text({ label: "Opening line", multiline: true }),
        chapters: fields.array(
          fields.object({
            title: fields.text({ label: "Chapter title" }),
            body: fields.array(fields.text({ label: "Paragraph", multiline: true }), {
              label: "Paragraphs",
              itemLabel: (p) => p.value.slice(0, 40) || "Paragraph",
            }),
          }),
          { label: "Chapters", itemLabel: (p) => p.fields.title.value || "Chapter" }
        ),
        pullQuote: fields.text({ label: "Highlighted line", multiline: true }),
      },
    }),
  },

  collections: {
    menu: collection({
      label: "Menu categories",
      slugField: "name",
      path: "content/menu/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Category name" } }),
        kind: fields.select({
          label: "Appears under",
          options: [
            { label: "Food", value: "food" },
            { label: "Drinks", value: "drinks" },
          ],
          defaultValue: "food",
        }),
        order: fields.integer({
          label: "Order on page",
          description: "Lower numbers appear first.",
          defaultValue: 100,
        }),
        intro: fields.text({ label: "Intro line (optional)", multiline: true }),
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Item name" }),
            description: fields.text({ label: "Description", multiline: true }),
            price: fields.text({
              label: "Price",
              description: "Exactly as it should read, e.g. R85",
            }),
            group: fields.text({
              label: "Sub-heading (optional)",
              description: "Items sharing the same sub-heading are grouped together.",
            }),
            available: fields.checkbox({
              label: "Currently available",
              description: "Untick to hide without deleting.",
              defaultValue: true,
            }),
            photo: image("Photo (optional)", "menu"),
            photoAlt: fields.text({ label: "Photo alt text" }),
          }),
          {
            label: "Items",
            itemLabel: (p) =>
              `${p.fields.name.value || "Item"}${p.fields.price.value ? " — " + p.fields.price.value : ""}`,
          }
        ),
      },
    }),

    gallery: collection({
      label: "Gallery photos",
      slugField: "title",
      path: "content/gallery/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        image: image("Photograph", "gallery"),
        alt: fields.text({
          label: "Description (alt text)",
          description: "Describe what is in the photo, for screen readers and search.",
          multiline: true,
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Courtyard", value: "courtyard" },
            { label: "Interior", value: "interior" },
            { label: "Food", value: "food" },
            { label: "Coffee", value: "coffee" },
            { label: "Events", value: "events" },
            { label: "People & Community", value: "community" },
          ],
          defaultValue: "courtyard",
        }),
        order: fields.integer({ label: "Order", defaultValue: 100 }),
      },
    }),

    events: collection({
      label: "Events",
      slugField: "title",
      path: "content/events/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Event title" } }),
        date: fields.date({ label: "Date" }),
        time: fields.text({ label: "Time (optional)", description: "e.g. 15:00–19:00" }),
        description: fields.text({ label: "Description", multiline: true }),
        image: image("Poster or photo (optional)", "events"),
        imageAlt: fields.text({ label: "Image alt text" }),
        linkLabel: fields.text({ label: "Link label (optional)", description: "e.g. Get tickets" }),
        linkHref: fields.text({ label: "Link address (optional)" }),
      },
    }),
  },
});
