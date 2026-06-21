import * as Contacts from "expo-contacts";
import {
  Check,
  Contact,
  Search,
  ShieldAlert,
  Users,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { C } from "@/constants/colors";
import { triggerHaptic } from "@/lib/haptics";
import { PressableScale } from "@/components/pressable/PressableScale";

export interface ImportedGuest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ContactPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (guests: ImportedGuest[]) => void;
}

type SheetPhase = "loading" | "permission" | "list" | "empty";

export default function ContactPickerSheet({
  visible,
  onClose,
  onSelect,
}: ContactPickerSheetProps) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<SheetPhase>("loading");
  const [allContacts, setAllContacts] = useState<Contacts.ExistingContact[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState<string>("");

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return allContacts;
    const q = search.toLowerCase();
    return allContacts.filter((c) => {
      const fullName =
        [c.firstName, c.middleName, c.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
      if (fullName.includes(q)) return true;
      if (c.emails?.some((e) => e.email?.toLowerCase().includes(q))) return true;
      if (
        c.phoneNumbers?.some((p) =>
          p.number?.replace(/\D/g, "").includes(q.replace(/\D/g, "")),
        )
      )
        return true;
      return false;
    });
  }, [allContacts, search]);

  const loadContacts = useCallback(async () => {
    setPhase("loading");
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        setPhase("permission");
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.FirstName,
          Contacts.Fields.MiddleName,
          Contacts.Fields.LastName,
          Contacts.Fields.Emails,
          Contacts.Fields.PhoneNumbers,
        ],
        sort: Contacts.SortTypes.FirstName,
      });

      if (data.length === 0) {
        setPhase("empty");
        return;
      }

      setAllContacts(data);
      setPhase("list");
    } catch {
      setPhase("permission");
    }
  }, []);

  useEffect(() => {
    if (visible) {
      setSelectedIds(new Set());
      setSearch("");
      setAllContacts([]);
      loadContacts();
    }
  }, [visible, loadContacts]);

  const toggleContact = useCallback(
    (id: string) => {
      triggerHaptic("light");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [],
  );

  const confirmSelection = useCallback(() => {
    triggerHaptic("success");
    const selected: ImportedGuest[] = [];
    for (const c of allContacts) {
      if (!selectedIds.has(c.id ?? "")) continue;
      const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ");
      const email = c.emails?.[0]?.email?.trim() ?? "";
      const rawPhone = c.phoneNumbers?.[0]?.number?.replace(/\s/g, "") ?? "";
      // Only include if there's a name AND at least one contact method
      if (fullName.trim() && (email || rawPhone)) {
        selected.push({
          id: `c_${Date.now()}_${selected.length}`,
          name: fullName.trim(),
          email,
          phone: rawPhone,
        });
      }
    }
    onSelect(selected);
    onClose();
  }, [selectedIds, allContacts, onSelect, onClose]);

  const selectedCount = selectedIds.size;

  /** Derive display name for a contact row. */
  const displayName = (c: Contacts.Contact): string =>
    [c.firstName, c.lastName].filter(Boolean).join(" ") || "(no name)";

  /** Derive subtitle – first email or phone. */
  const displaySubtitle = (c: Contacts.Contact): string => {
    const e = c.emails?.[0]?.email;
    if (e) return e;
    const p = c.phoneNumbers?.[0]?.number;
    if (p) return p;
    return "No contact info";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[s.container, { paddingTop: Math.max(insets.top, 8) }]}>
        {/* Header */}
        <View style={s.header}>
          <PressableScale
            onPress={onClose}
            haptic="light"
            pressedScale={0.92}
            style={s.closeBtn}
          >
            <X color={C.text} size={20} />
          </PressableScale>
          <Text style={s.headerTitle}>Import from Contacts</Text>
          {selectedCount > 0 ? (
            <PressableScale
              onPress={confirmSelection}
              haptic="success"
              pressedScale={0.94}
              style={s.addSelectedBtn}
            >
              <Check color={C.bg} size={16} />
              <Text style={s.addSelectedText}>Add {selectedCount}</Text>
            </PressableScale>
          ) : (
            <View style={{ width: 80 }} />
          )}
        </View>

        {/* Loading */}
        {phase === "loading" ? (
          <View style={s.center}>
            <ActivityIndicator color={C.pink} size="large" />
            <Text style={s.centerText}>Loading contacts…</Text>
          </View>
        ) : null}

        {/* Permission denied */}
        {phase === "permission" ? (
          <View style={s.center}>
            <ShieldAlert color={C.gold} size={44} />
            <Text style={s.centerTitle}>Contacts access needed</Text>
            <Text style={s.centerSub}>
              Sherehe needs access to your contacts so you can quickly add guests
              without typing every email or phone number.
            </Text>
            <PressableScale
              onPress={async () => {
                await Contacts.requestPermissionsAsync();
                loadContacts();
              }}
              style={s.permBtn}
              haptic="selection"
              pressedScale={0.96}
            >
              <Text style={s.permBtnText}>Open Settings</Text>
            </PressableScale>
          </View>
        ) : null}

        {/* Empty contacts */}
        {phase === "empty" ? (
          <View style={s.center}>
            <Users color={C.subtext} size={44} />
            <Text style={s.centerTitle}>No contacts found</Text>
            <Text style={s.centerSub}>
              Your contact list is empty. Add contacts to your device first, then
              come back to import them as guests.
            </Text>
          </View>
        ) : null}

        {/* Contact list */}
        {phase === "list" ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {/* Search bar */}
            <View style={s.searchBar}>
              <Search color={C.subtext} size={16} />
              <TextInput
                style={s.searchInput}
                placeholder="Search contacts…"
                placeholderTextColor={C.mute}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {search.length > 0 ? (
                <Pressable
                  onPress={() => setSearch("")}
                  hitSlop={8}
                  style={s.clearSearch}
                >
                  <X color={C.subtext} size={14} />
                </Pressable>
              ) : null}
            </View>

            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id ?? item.name ?? Math.random().toString()}
              renderItem={({ item: c }) => {
                const cid = c.id ?? "";
                const isSelected = selectedIds.has(cid);
                const hasInfo =
                  (c.emails && c.emails.length > 0) ||
                  (c.phoneNumbers && c.phoneNumbers.length > 0);
                return (
                  <Pressable
                    style={[s.contactRow, isSelected && s.contactRowSelected]}
                    onPress={() => toggleContact(cid)}
                  >
                    {/* Avatar circle */}
                    <View style={s.avatarCircle}>
                      <Contact color={C.subtext} size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={s.contactName}
                        numberOfLines={1}
                      >
                        {displayName(c)}
                      </Text>
                      {hasInfo ? (
                        <Text style={s.contactSub} numberOfLines={1}>
                          {displaySubtitle(c)}
                        </Text>
                      ) : (
                        <Text style={s.contactSubMuted} numberOfLines={1}>
                          No email or phone
                        </Text>
                      )}
                    </View>
                    <View
                      style={[
                        s.checkbox,
                        isSelected && s.checkboxSelected,
                        !hasInfo && s.checkboxDisabled,
                      ]}
                    >
                      {isSelected ? (
                        <Check color={C.bg} size={13} />
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: Math.max(insets.bottom, 16) + 20,
              }}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={s.noResults}>
                  <Text style={s.noResultsText}>
                    No contacts match "{search}"
                  </Text>
                </View>
              }
              ItemSeparatorComponent={() => <View style={s.separator} />}
            />
          </KeyboardAvoidingView>
        ) : null}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
  },
  headerTitle: {
    color: C.text,
    fontWeight: "700" as const,
    fontSize: 17,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.cardHi,
  },
  addSelectedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: C.pink,
  },
  addSelectedText: {
    color: C.bg,
    fontWeight: "700" as const,
    fontSize: 13,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.cardHi,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.hair,
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontSize: 14,
    padding: 0,
  },
  clearSearch: {
    padding: 4,
    borderRadius: 10,
    backgroundColor: C.card,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  contactRowSelected: {
    backgroundColor: "rgba(255,45,122,0.08)",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.hair,
  },
  contactName: {
    color: C.text,
    fontWeight: "600" as const,
    fontSize: 15,
  },
  contactSub: {
    color: C.subtext,
    fontSize: 12,
    marginTop: 2,
  },
  contactSubMuted: {
    color: C.mute,
    fontSize: 12,
    marginTop: 2,
    fontStyle: "italic",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.hair,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: C.pink,
    backgroundColor: C.pink,
  },
  checkboxDisabled: {
    opacity: 0.25,
  },
  separator: {
    height: 1,
    backgroundColor: C.hair,
    marginLeft: 52,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  centerText: {
    color: C.subtext,
    fontSize: 14,
    marginTop: 8,
  },
  centerTitle: {
    color: C.text,
    fontWeight: "700" as const,
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
  },
  centerSub: {
    color: C.subtext,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  permBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: C.pink,
  },
  permBtnText: {
    color: C.bg,
    fontWeight: "700" as const,
    fontSize: 14,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    color: C.mute,
    fontSize: 14,
  },
});
