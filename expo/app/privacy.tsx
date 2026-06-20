import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { C } from "@/constants/colors";

interface SectionProps {
  number: number;
  title: string;
  children: React.ReactNode;
}
function Section({ number, title, children }: SectionProps) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.numBadge}>
          <Text style={s.numText}>{number}</Text>
        </View>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <Text style={s.para}>{children}</Text>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <Text style={s.strong}>{children}</Text>;
}

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["#1A0410", "#0A0A0B", "#0A0A0B"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.topBar}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={10}>
            <ArrowLeft color={C.text} size={20} />
          </Pressable>
          <Text style={s.topTitle}>Privacy Policy</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.lastUpdated}>Last updated: June 20, 2026</Text>
          <Text style={s.intro}>
            SHEREHE (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is built
            on a foundation of trust. This Privacy Policy explains what information we
            collect, how we use it, and the choices you have. We&rsquo;ve written it in
            plain language because we believe privacy policies should be readable — not
            walls of legalese.
          </Text>

          <Section number={1} title="Information We Collect">
            <Para>
              We collect only the information needed to make SHEREHE work for you. Here
              is exactly what that includes:
            </Para>
            <Para>
              <Strong>Account information</Strong> — When you sign in with Google or
              Apple, we receive your name and email address from those providers. We
              never see your Google or Apple password. If you create a guest pass, you
              may optionally provide a name.
            </Para>
            <Para>
              <Strong>Event data</Strong> — The events you create, including the event
              name, type, date, time, venue, dress code, message, schedule, and guest
              list. This also includes the invitation template and cover photo you
              select.
            </Para>
            <Para>
              <Strong>Guest information</Strong> — When you invite guests, you provide
              their names and optionally their email addresses or phone numbers. Guests
              who RSVP may also provide meal preferences, plus-one names, and custom
              responses to any questions you&rsquo;ve added.
            </Para>
            <Para>
              <Strong>Photos and media</Strong> — Photos captured during your event
              using the in-app camera are uploaded to our servers so guests can view
              and contribute to the shared gallery. We also store any cover images you
              upload for your invitations.
            </Para>
            <Para>
              <Strong>Usage data</Strong> — Basic analytics such as which screens are
              visited and which features are used. This is anonymous and helps us
              improve the app. We do not track your location in the background.
            </Para>
            <Para>
              <Strong>Payment data</Strong> — When you purchase a premium plan, the
              transaction is processed entirely by Apple or Google. We never receive or
              store your credit card number. RevenueCat, our purchase infrastructure,
              tells us whether your subscription or one-time payment is active.
            </Para>
          </Section>

          <Section number={2} title="How We Use Your Information">
            <Para>Every piece of data we collect serves a specific purpose:</Para>
            <Para>
              <Strong>To deliver the service</Strong> — Your event details, guest
              lists, RSVPs, and photos are the core of SHEREHE. We store and display
              them so you can manage your event, guests can RSVP, and everyone can
              enjoy the shared photo gallery.
            </Para>
            <Para>
              <Strong>To send invitations</Strong> — When you choose to send branded
              email or SMS invitations, we use the guest contact details you provide
              solely to deliver those messages through Resend (email) or Twilio (SMS).
            </Para>
            <Para>
              <Strong>To improve the app</Strong> — Anonymous usage patterns help us
              understand which features people love and where we can improve. This data
              is aggregated and never tied to individual accounts.
            </Para>
            <Para>
              <Strong>To communicate with you</Strong> — We may send service-related
              emails (event confirmations, photo expiry reminders). You can opt out of
              non-essential communications at any time.
            </Para>
            <Para>
              We do <Strong>not</Strong> sell your personal data to third parties. We
              do <Strong>not</Strong> use your photos to train AI models. We do{" "}
              <Strong>not</Strong> run ads or build advertising profiles.
            </Para>
          </Section>

          <Section number={3} title="AI Processing &amp; Machine Learning">
            <Para>
              SHEREHE includes two optional AI-powered features, both of which process
              your data on-device or through our secure infrastructure:
            </Para>
            <Para>
              <Strong>AI Invitation Writer</Strong> — When you tap the AI write button,
              your event type, name, venue, and message are sent to an AI language
              model (hosted by OpenAI via our secure backend) to generate invitation
              copy suggestions. The model processes only the event context you provide —
              it does not learn from, store, or retain your data. No guest data or
              photos are ever sent to the AI.
            </Para>
            <Para>
              <Strong>Best-Moments Curation</Strong> — If you enable this feature, a
              selection of event photos is sent to an AI vision model to identify
              standout moments (smiles, groups, key interactions). The AI only analyzes
              photos from your event and returns curation scores. Photos are
              transmitted over encrypted connections and are not used for training,
              retained by the model, or shared with any third party beyond the
              processing provider.
            </Para>
            <Para>
              <Strong>Your control</Strong> — Both AI features are strictly opt-in. You
              can create invitations manually and skip AI curation entirely. You can
              also request deletion of any AI-generated outputs by contacting us.
            </Para>
            <Para>
              <Strong>Future AI features</Strong> — If we introduce new AI capabilities
              in the future, we will update this policy and, where required by law, ask
              for your explicit consent before processing your data with those features.
            </Para>
          </Section>

          <Section number={4} title="Photo &amp; Media Data">
            <Para>
              Photos are the heart of SHEREHE, and we take their handling seriously:
            </Para>
            <Para>
              <Strong>Upload and storage</Strong> — Photos captured through the in-app
              camera are encrypted in transit and stored on Supabase&rsquo;s secure
              cloud infrastructure. Photos are stored at the resolution they were
              captured — we do not downsample or compress them beyond standard web
              delivery optimization.
            </Para>
            <Para>
              <Strong>Access control</Strong> — Event hosts control who can see photos.
              Events can be set to Public (anyone with the link), Private (invited
              guests only), or Passcode-protected. Photos in Private and Passcode
              events are not publicly accessible.
            </Para>
            <Para>
              <Strong>Auto-deletion</Strong> — All event photos are automatically
              deleted from our servers 30 days after the event date. We send a reminder
              before deletion so you can download anything you want to keep. Premium
              plan holders get extended retention as described in their plan.
            </Para>
            <Para>
              <Strong>Your exports</Strong> — You can download individual photos or
              export your entire event gallery as a ZIP archive at any time before the
              auto-deletion date.
            </Para>
            <Para>
              <Strong>We do not scan your photos</Strong> — Beyond the optional AI
              Best-Moments curation, we do not run facial recognition, object
              detection, or any other automated analysis on your event photos. We do
              not claim ownership of your photos — they remain yours.
            </Para>
          </Section>

          <Section number={5} title="Third-Party Services &amp; Data Sharing">
            <Para>
              SHEREHE relies on a small set of carefully chosen infrastructure
              providers. Here is exactly what each one handles:
            </Para>
            <Para>
              <Strong>Supabase</Strong> — Our database and file storage provider. All
              event data, RSVPs, guest lists, user profiles, and photos are stored on
              Supabase. Supabase is SOC 2 certified and encrypts data at rest and in
              transit.
            </Para>
            <Para>
              <Strong>RevenueCat</Strong> — Manages in-app purchases and subscription
              status. RevenueCat receives your anonymous user ID and purchase
              transaction data from Apple or Google. It does not receive your name,
              email, event data, or photos.
            </Para>
            <Para>
              <Strong>Resend</Strong> — Sends invitation and notification emails on
              your behalf. When you use the email invitation feature, the guest&rsquo;s
              email address and the invitation content are transmitted to Resend solely
              for delivery.
            </Para>
            <Para>
              <Strong>Twilio</Strong> — Sends SMS invitations on your behalf. When you
              use the SMS invitation feature, the guest&rsquo;s phone number and a
              short message with the invite link are transmitted to Twilio solely for
              delivery.
            </Para>
            <Para>
              <Strong>OpenAI</Strong> — Processes AI Invitation Writer and
              Best-Moments curation requests. Only the specific data needed for each
              feature is transmitted (event context for invitations, selected photos
              for curation). OpenAI does not use this data to train its models.
            </Para>
            <Para>
              <Strong>Rork</Strong> — Provides the app hosting and CI/CD
              infrastructure. Rork does not have access to your event data, photos, or
              guest information stored in our Supabase database.
            </Para>
            <Para>
              We do not share your data with any other third parties except as required
              by law or to protect our rights.
            </Para>
          </Section>

          <Section number={6} title="Your Rights &amp; Choices">
            <Para>Depending on where you live, you have certain rights over your
              data. We extend these rights to all SHEREHE users regardless of
              location:
            </Para>
            <Para>
              <Strong>Access</Strong> — You can export all your data (events, RSVPs,
              guest lists, profile) as a JSON file from the Profile screen at any time.
              Photo downloads are available from each event gallery.
            </Para>
            <Para>
              <Strong>Correction</Strong> — You can edit your event details, profile
              name, and language preference directly in the app. To correct guest data,
              you can remove and re-add guests from your guest list.
            </Para>
            <Para>
              <Strong>Deletion</Strong> — You can delete individual events (including
              all associated photos, RSVPs, and guest data) from the event screen. You
              can delete your entire account from the Profile screen, which permanently
              removes all your data from our servers. Photo auto-deletion after 30 days
              is automatic and requires no action from you.
            </Para>
            <Para>
              <Strong>Opt-out of communications</Strong> — You can disable push
              notifications from your device settings. Service-related emails include an
              unsubscribe link.
            </Para>
            <Para>
              <Strong>Opt-out of AI features</Strong> — AI Invitation Writer and
              Best-Moments curation are completely optional. You can use SHEREHE fully
              without ever touching these features.
            </Para>
            <Para>
              <Strong>Data portability</Strong> — The JSON export from your Profile
              screen gives you a complete, machine-readable copy of your data that you
              can take to another service.
            </Para>
            <Para>
              To exercise any of these rights, use the in-app tools described above or
              contact us at <Text style={s.link}>privacy@sherehe.app</Text>. We will
              respond within 30 days.
            </Para>
          </Section>

          <Section number={7} title="Data Retention &amp; Deletion">
            <Para>
              <Strong>Event data</Strong> — Event details, RSVPs, and guest lists
              remain available in your account until you delete the event or your
              account. Deleted events are permanently removed from our servers within 7
              days.
            </Para>
            <Para>
              <Strong>Photos</Strong> — Event photos are automatically deleted 30 days
              after the event date (or longer for premium plans as specified during
              purchase). We send a reminder email before deletion. Once deleted, photos
              cannot be recovered.
            </Para>
            <Para>
              <Strong>Account deletion</Strong> — When you delete your SHEREHE account,
              all your events, photos, RSVPs, guest lists, and profile data are
              permanently removed. This process begins immediately and completes within
              7 days.
            </Para>
            <Para>
              <Strong>Backups</Strong> — Our database provider (Supabase) maintains
              encrypted backups for disaster recovery. These backups are retained for up
              to 30 days and are automatically purged. Data deleted from your account
              will be removed from backups through this normal rotation cycle.
            </Para>
            <Para>
              <Strong>Legal holds</Strong> — In the rare event we are required by law
              to preserve data (such as a valid legal request), we will retain only the
              specifically requested data for the required period and notify you unless
              prohibited by law.
            </Para>
          </Section>

          <Section number={8} title="Children&rsquo;s Privacy">
            <Para>
              SHEREHE is not intended for children under the age of 13 (or the relevant
              digital age of consent in your country). We do not knowingly collect
              personal information from children.
            </Para>
            <Para>
              If you are a parent or guardian and believe your child has provided us
              with personal information, please contact us immediately at{" "}
              <Text style={s.link}>privacy@sherehe.app</Text>. We will promptly
              investigate and delete any such data from our systems.
            </Para>
            <Para>
              Event hosts are responsible for ensuring that any photos of minors
              captured at their events comply with applicable laws and that they have
              obtained appropriate consent from parents or guardians where required.
            </Para>
          </Section>

          <Section number={9} title="Security Measures">
            <Para>
              We protect your data with industry-standard security practices:
            </Para>
            <Para>
              <Strong>Encryption</Strong> — All data transmitted between the app and our
              servers is encrypted using TLS 1.3. Data stored in our database is
              encrypted at rest using AES-256.
            </Para>
            <Para>
              <Strong>Authentication</Strong> — Sign-in is handled through Google and
              Apple&rsquo;s secure OAuth flows. We use Supabase Auth with row-level
              security policies to ensure each user can only access their own data.
            </Para>
            <Para>
              <Strong>Infrastructure</Strong> — Our database and storage run on
              Supabase, which maintains SOC 2 certification and undergoes regular
              third-party security audits.
            </Para>
            <Para>
              <Strong>Access control</Strong> — Only essential personnel have access to
              production systems, and all access is logged and audited.
            </Para>
            <Para>
              <Strong>Vulnerability reporting</Strong> — If you discover a security
              vulnerability, please email{" "}
              <Text style={s.link}>security@sherehe.app</Text> rather than disclosing
              it publicly. We take all reports seriously and will respond promptly.
            </Para>
            <Para>
              While we implement strong protections, no system is 100% secure. In the
              unlikely event of a data breach affecting your personal information, we
              will notify you promptly and in accordance with applicable law.
            </Para>
          </Section>

          <Section number={10} title="Contact Us">
            <Para>
              SHEREHE is operated by the SHEREHE team. If you have questions about this
              Privacy Policy, want to exercise your data rights, or need help with
              anything privacy-related, here&rsquo;s how to reach us:
            </Para>
            <Para>
              <Strong>Email</Strong> —{" "}
              <Text style={s.link}>privacy@sherehe.app</Text> (for privacy-specific
              inquiries) or{" "}
              <Text style={s.link}>hello@sherehe.app</Text> (for general support)
            </Para>
            <Para>
              <Strong>Response time</Strong> — We aim to respond to all privacy-related
              inquiries within 5 business days. Formal data rights requests will be
              acknowledged within 48 hours and resolved within 30 days.
            </Para>
            <Para>
              <Strong>Policy updates</Strong> — We will notify you of material changes
              to this policy via email and an in-app notice. The &ldquo;Last
              updated&rdquo; date at the top of this page reflects the most recent
              revision. Continuing to use SHEREHE after a policy update constitutes
              acceptance of the updated terms.
            </Para>
          </Section>

          <View style={s.footer}>
            <Text style={s.footerText}>
              This policy was last reviewed and updated on June 20, 2026. If you
              have questions, we&rsquo;re here to help.
            </Text>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "700" as const,
    letterSpacing: 0.3,
  },
  scroll: { paddingHorizontal: 18, paddingTop: 8 },
  lastUpdated: {
    color: C.mute,
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    marginBottom: 10,
  },
  intro: {
    color: C.subtext,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },

  // Section
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: { color: C.text, fontSize: 13, fontWeight: "800" as const },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800" as const,
    letterSpacing: -0.3,
    flex: 1,
  },
  sectionBody: { gap: 10, paddingLeft: 38 },

  // Text
  para: {
    color: C.subtext,
    fontSize: 14,
    lineHeight: 22,
  },
  strong: {
    color: C.text,
    fontWeight: "700" as const,
  },
  link: {
    color: C.pinkHi,
    fontWeight: "600" as const,
    textDecorationLine: "underline" as const,
  },

  // Footer
  footer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: C.hair,
  },
  footerText: {
    color: C.mute,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
