import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function TermsOfServiceScreen() {
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
          <Text style={s.topTitle}>Terms of Service</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.lastUpdated}>Last updated: June 20, 2026</Text>
          <Text style={s.intro}>
            Welcome to SHEREHE. These Terms of Service (&ldquo;Terms&rdquo;) govern
            your use of the SHEREHE app and services. By creating an account or using
            SHEREHE, you agree to these Terms. If you don&rsquo;t agree, please
            don&rsquo;t use the app.
          </Text>

          <Section number={1} title="Acceptance of Terms">
            <Para>
              By downloading, installing, or using SHEREHE, you confirm that you have
              read, understood, and agree to be bound by these Terms and our Privacy
              Policy, which is incorporated by reference.
            </Para>
            <Para>
              <Strong>Changes to these Terms</Strong> — We may update these Terms from
              time to time. If we make material changes, we will notify you via email
              and an in-app notice at least 14 days before the changes take effect.
              Your continued use of SHEREHE after the effective date constitutes
              acceptance of the updated Terms. If you disagree with any changes, you
              may delete your account before they take effect.
            </Para>
            <Para>
              <Strong>Electronic communications</Strong> — By using SHEREHE, you
              consent to receive communications from us electronically, including
              emails, push notifications, and in-app messages. You may opt out of
              non-essential communications at any time.
            </Para>
          </Section>

          <Section number={2} title="Account Registration &amp; Eligibility">
            <Para>
              <Strong>Age requirement</Strong> — You must be at least 13 years old (or
              the digital age of consent in your country, whichever is higher) to
              create a SHEREHE account and use the service.
            </Para>
            <Para>
              <Strong>Account creation</Strong> — You can sign in using Google or
              Apple. You are responsible for maintaining the security of your account
              and for all activities that occur under it. Do not share your account
              credentials with others.
            </Para>
            <Para>
              <Strong>Accurate information</Strong> — You agree to provide accurate and
              complete information when creating your account and creating events. If
              we discover that you&rsquo;ve provided false information, we reserve the
              right to suspend or terminate your account.
            </Para>
            <Para>
              <Strong>One account per person</Strong> — You may not create multiple
              accounts to circumvent plan limits, guest caps, or free trial
              restrictions. We reserve the right to merge or suspend duplicate
              accounts.
            </Para>
          </Section>

          <Section number={3} title="Event Creation &amp; Guest Management">
            <Para>
              <Strong>Host responsibility</Strong> — As the event host, you are solely
              responsible for the content of your event (including invitations, names,
              venue details, messages, dress codes, and schedules) and for managing
              guest data in compliance with applicable privacy laws. You represent that
              you have obtained any necessary consent from guests before adding their
              personal information (name, email, phone number) to SHEREHE.
            </Para>
            <Para>
              <Strong>Guest data</Strong> — You may only upload guest contact
              information for the purpose of sending event invitations and managing
              RSVPs through SHEREHE. You may not use guest data for marketing,
              solicitation, or any purpose unrelated to the event without explicit
              guest consent.
            </Para>
            <Para>
              <Strong>Invitation content</Strong> — Invitations sent through SHEREHE
              must be related to a genuine event. You may not use the invitation
              features to send spam, phishing attempts, or unsolicited commercial
              messages.
            </Para>
            <Para>
              <Strong>Photo upload permissions</Strong> — When you enable guest photo
              uploads for an event, you acknowledge that guests may upload photos that
              appear in the shared gallery. You are responsible for setting appropriate
              event privacy levels (Public, Private, or Passcode-protected) and
              communicating any photo-sharing expectations to your guests.
            </Para>
          </Section>

          <Section number={4} title="Payments, Subscriptions &amp; Cancellation">
            <Para>
              <Strong>Pricing model</Strong> — SHEREHE offers a free Starter plan
              (limited to 5 guests and 1 GB of photo storage) and one-time paid plans
              that cover a single event. Paid plans are not subscriptions — you pay
              once per event, and there are no recurring charges or auto-renewals.
            </Para>
            <Para>
              <Strong>Payment processing</Strong> — All payments are processed by Apple
              (via the App Store) or Google (via Google Play), depending on your
              device. SHEREHE does not directly collect or store your payment card
              details. Payment disputes and refund requests must be directed to Apple
              or Google in accordance with their respective refund policies.
            </Para>
            <Para>
              <Strong>How to cancel or change plans</Strong> — Since plans are
              one-time and tied to a specific event, there is no subscription to
              cancel. If you haven&rsquo;t sent invitations yet, you can delete your
              event and create a new one under a different plan at no extra charge. To
              switch to a different plan for an existing event, delete the event
              (and its associated data) and re-create it with the new plan. For
              refund requests, contact Apple or Google directly through your
              device&rsquo;s purchase history.
            </Para>
            <Para>
              <Strong>Price changes</Strong> — We may adjust plan prices from time to
              time. Price changes apply only to new events created after the change
              takes effect. Events created before a price change are unaffected.
            </Para>
            <Para>
              <Strong>Free plan limitations</Strong> — The free Starter plan is subject
              to guest and storage limits as described in the plan details. We may
              adjust free plan limits with reasonable notice. Exceeding free plan
              limits may prevent you from creating additional events until you upgrade.
            </Para>
          </Section>

          <Section number={5} title="Health &amp; Safety Disclaimer">
            <Para>
              <Strong>Event safety is your responsibility</Strong> — SHEREHE is a
              digital invitation and photo-sharing tool. We do not organize, host,
              manage, or supervise physical events. As the event host, you are solely
              responsible for the safety, security, and well-being of your guests at
              your event. This includes (but is not limited to) venue safety, food and
              drink service, crowd management, emergency preparedness, and compliance
              with local health and safety regulations.
            </Para>
            <Para>
              <Strong>No liability for incidents</Strong> — SHEREHE and its operators
              are not liable for any injuries, illnesses, damages, losses, or
              incidents — whether physical, emotional, or financial — that occur at or
              in connection with events organized using our platform. By using
              SHEREHE, you release us from any such claims.
            </Para>
            <Para>
              <Strong>Health guidance</Strong> — SHEREHE does not provide medical or
              health advice. The app does not monitor, assess, or guarantee compliance
              with health regulations at your event. You should follow all applicable
              public health guidelines, including those related to food safety, alcohol
              service, and infectious disease precautions.
            </Para>
            <Para>
              <Strong>Emergency services</Strong> — SHEREHE is not an emergency
              response tool. In case of an emergency at your event, contact local
              emergency services directly. The app does not have a built-in emergency
              alert or dispatch feature.
            </Para>
          </Section>

          <Section number={6} title="Acceptable Use &amp; Content Guidelines">
            <Para>
              You agree not to use SHEREHE for any purpose that is illegal, harmful, or
              violates the rights of others. Specifically:
            </Para>
            <Para>
              <Strong>Prohibited content</Strong> — You may not upload, share, or
              distribute content that is illegal, sexually explicit, harassing,
              threatening, hateful, defamatory, or that infringes on the intellectual
              property or privacy rights of others. This applies to event details,
              invitation copy, cover images, event photos, and any other content
              submitted through the app.
            </Para>
            <Para>
              <Strong>Photo guidelines</Strong> — Photos captured or uploaded to
              SHEREHE must be from your event and appropriate for all event guests.
              You may not upload photos of people who have not consented to being
              photographed at the event. We reserve the right to remove any photo
              that violates these guidelines or is reported by a guest.
            </Para>
            <Para>
              <Strong>Prohibited activities</Strong> — You may not: (a) use SHEREHE to
              send spam or unsolicited messages; (b) attempt to gain unauthorized
              access to other users&rsquo; accounts or data; (c) reverse-engineer,
              decompile, or tamper with the app; (d) use automated tools (bots,
              scrapers) to access or extract data from the service; (e) use the app to
              harass, stalk, or impersonate others; or (f) create events for fraudulent
              or deceptive purposes.
            </Para>
            <Para>
              <Strong>Enforcement</Strong> — We reserve the right to remove content,
              suspend accounts, or terminate access for violations of these guidelines
              without prior notice. We may also report illegal activity to law
              enforcement where appropriate.
            </Para>
          </Section>

          <Section number={7} title="Intellectual Property Rights">
            <Para>
              <Strong>Your content</Strong> — You retain ownership of all content you
              create and upload to SHEREHE, including event details, invitation copy,
              cover images, and event photos. By uploading content, you grant SHEREHE a
              limited, worldwide, royalty-free license to store, display, and transmit
              your content solely as necessary to provide the service (e.g., displaying
              your photos in the event gallery, sending your invitations to guests).
              This license ends when you delete your content or your account.
            </Para>
            <Para>
              <Strong>Our content</Strong> — SHEREHE owns all rights to the app itself,
              including its code, design, templates, branding, name, logo, and user
              interface. You may not copy, modify, distribute, or create derivative
              works from the SHEREHE app or any of its components without our prior
              written permission.
            </Para>
            <Para>
              <Strong>Templates</Strong> — The invitation templates provided in the app
              are SHEREHE&rsquo;s intellectual property. You may use them to create
              invitations for your events. You may not extract, resell, or redistribute
              the templates as standalone assets.
            </Para>
            <Para>
              <Strong>Trademarks</Strong> — &ldquo;SHEREHE&rdquo; and the SHEREHE logo
              are trademarks of the SHEREHE team. You may not use them in any way that
              implies endorsement, affiliation, or sponsorship without our written
              consent.
            </Para>
          </Section>

          <Section number={8} title="Limitation of Liability">
            <Para>
              <Strong>Service provided &ldquo;as is&rdquo;</Strong> — SHEREHE is
              provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
              without warranties of any kind, either express or implied. We do not
              guarantee that the app will be uninterrupted, error-free, secure, or
              that defects will be corrected. We are not liable for any loss of data,
              including photos, RSVPs, or event details, that may occur during use of
              the service.
            </Para>
            <Para>
              <Strong>Third-party services</Strong> — SHEREHE relies on third-party
              infrastructure providers (Supabase, RevenueCat, Resend, Twilio, and
              OpenAI). We are not liable for outages, data loss, or service
              interruptions caused by these providers beyond our reasonable control.
            </Para>
            <Para>
              <Strong>Cap on liability</Strong> — To the fullest extent permitted by
              applicable law, SHEREHE&rsquo;s total liability to you for any claims
              arising from your use of the app shall not exceed the amount you have
              paid to us for the specific event plan related to the claim in the 12
              months preceding the claim, or $50 USD if you have not made a payment.
              This limitation applies regardless of the legal theory (contract, tort,
              negligence, strict liability, or otherwise).
            </Para>
            <Para>
              <Strong>No consequential damages</Strong> — We are not liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including loss of profits, revenue, data, or goodwill, arising from your
              use of SHEREHE, even if we have been advised of the possibility of such
              damages.
            </Para>
            <Para>
              <Strong>Local laws</Strong> — Some jurisdictions do not allow the
              exclusion of certain warranties or the limitation of liability for
              certain types of damages. In those jurisdictions, our liability is
              limited to the maximum extent permitted by law.
            </Para>
          </Section>

          <Section number={9} title="Termination &amp; Account Closure">
            <Para>
              <Strong>Your right to terminate</Strong> — You may delete your account
              at any time from the Profile screen. Deleting your account permanently
              removes all your events, photos, RSVPs, guest data, and profile
              information from our servers. Data deletion begins immediately and
              completes within 7 days. Photo auto-deletion runs on the standard 30-day
              post-event schedule regardless of account status.
            </Para>
            <Para>
              <Strong>Our right to terminate</Strong> — We reserve the right to suspend
              or terminate your account and access to SHEREHE at any time, with or
              without notice, if: (a) you violate these Terms; (b) you engage in
              fraudulent, abusive, or illegal activity; (c) we are required to do so by
              law; or (d) we discontinue the service (in which case we will provide
              reasonable notice and an opportunity to export your data).
            </Para>
            <Para>
              <Strong>Effect of termination</Strong> — Upon termination, your right to
              use SHEREHE ceases immediately. We may retain limited information as
              required by law (e.g., for tax or legal compliance) for a period not
              exceeding what is legally necessary. Any data retention obligations are
              described in our Privacy Policy.
            </Para>
            <Para>
              <Strong>Survival</Strong> — Sections 5 (Health &amp; Safety Disclaimer),
              7 (Intellectual Property), 8 (Limitation of Liability), and 10 (Contact
              Information) survive termination of these Terms.
            </Para>
          </Section>

          <Section number={10} title="Contact Information &amp; Dispute Resolution">
            <Para>
              SHEREHE is created and operated by the SHEREHE team. Here&rsquo;s how to
              reach us for legal, billing, support, or any other questions:
            </Para>
            <Para>
              <Strong>General support</Strong> —{" "}
              <Text style={s.link}>hello@sherehe.app</Text>
            </Para>
            <Para>
              <Strong>Legal and privacy inquiries</Strong> —{" "}
              <Text style={s.link}>privacy@sherehe.app</Text>
            </Para>
            <Para>
              <Strong>Security vulnerabilities</Strong> —{" "}
              <Text style={s.link}>security@sherehe.app</Text>
            </Para>
            <Para>
              <Strong>Informal resolution</Strong> — We believe most disputes can be
              resolved through open communication. Before initiating any formal legal
              action, we ask that you contact us at{" "}
              <Text style={s.link}>privacy@sherehe.app</Text> so we can try to resolve
              the issue together. We commit to responding within 10 business days.
            </Para>
            <Para>
              <Strong>Governing law</Strong> — These Terms are governed by the laws of
              the jurisdiction where the SHEREHE team is based, without regard to
              conflict of law principles. Any dispute that cannot be resolved
              informally shall be resolved in the courts of that jurisdiction.
            </Para>
            <Para>
              <Strong>Platform terms</Strong> — Your use of SHEREHE is also subject to
              the terms and conditions of the platform through which you downloaded the
              app (Apple&rsquo;s App Store or Google Play). In the event of a conflict
              between these Terms and the applicable platform terms, the platform terms
              shall govern with respect to the download and purchase process only.
            </Para>
          </Section>

          <View style={s.footer}>
            <Text style={s.footerText}>
              Thank you for reading this far. We take these Terms seriously because we
              take your trust seriously. If anything is unclear, please reach out.
              We&rsquo;re real people and we&rsquo;ll respond.
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
