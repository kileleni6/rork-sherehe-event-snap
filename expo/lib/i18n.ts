// Lightweight i18n for SHEREHE — 12 starter languages with a curated subset
// of strings used across onboarding. We expose `t(key, lang)` so it works
// without React context for one-off lookups.

export type LangCode =
  | "en"
  | "es"
  | "fr"
  | "ar"
  | "sw"
  | "pt"
  | "hi"
  | "zh"
  | "de"
  | "it"
  | "ja"
  | "ru";

export interface LanguageDef {
  code: LangCode;
  name: string; // English name
  native: string; // Native script
  flag: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageDef[] = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦", rtl: true },
  { code: "sw", name: "Swahili", native: "Kiswahili", flag: "🇰🇪" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
];

type Dict = Record<string, string>;

const en: Dict = {
  welcome_title: "Welcome to SHEREHE",
  welcome_tag: "Create invites, collect RSVPs, and capture memories together.",
  get_started: "Get started",
  continue_guest: "Continue as guest",
  choose_language: "Choose your language",
  language_sub: "We'll translate the app and your invites.",
  who_are_you: "Who are you?",
  role_sub: "We'll tailor the experience.",
  role_host: "Event host",
  role_host_sub: "Plan and host your own event.",
  role_guest: "Guest",
  role_guest_sub: "Join an event you've been invited to.",
  sign_in: "Sign in",
  signin_sub: "Sync events across devices.",
  cont_google: "Continue with Google",
  cont_apple: "Continue with Apple",
  cont_phone: "Continue with phone",
  cont_email: "Continue with email",
  skip_now: "Skip for now",
  notif_title: "Stay in the loop",
  notif_sub: "Reminders, RSVPs, and the moment your gallery unlocks.",
  enable_notif: "Enable notifications",
  photo_title: "Capture the memories",
  photo_sub: "Allow camera & gallery access so you can shoot and share.",
  enable_photo: "Allow camera access",
  interests_title: "What do you love to host?",
  interests_sub: "We'll recommend templates for you.",
  ready_title: "You're all set",
  ready_sub: "Let's create your first event.",
  create_first: "Create my first event",
  continue: "Continue",
  search: "Search",
};

// Compact translations for the marketing-y screens. Non-translated keys
// gracefully fall back to English.
const dicts: Record<LangCode, Dict> = {
  en,
  es: {
    welcome_title: "Bienvenido a SHEREHE",
    welcome_tag: "Crea invitaciones, recibe confirmaciones y captura recuerdos juntos.",
    get_started: "Comenzar",
    continue_guest: "Continuar como invitado",
    choose_language: "Elige tu idioma",
    language_sub: "Traduciremos la app y tus invitaciones.",
    who_are_you: "¿Quién eres?",
    role_host: "Anfitrión",
    role_host_sub: "Organiza tu propio evento.",
    role_guest: "Invitado",
    role_guest_sub: "Únete a un evento.",
    sign_in: "Iniciar sesión",
    signin_sub: "Sincroniza tus eventos.",
    cont_google: "Continuar con Google",
    cont_apple: "Continuar con Apple",
    cont_phone: "Continuar con teléfono",
    cont_email: "Continuar con email",
    skip_now: "Omitir por ahora",
    notif_title: "Mantente al día",
    notif_sub: "Recordatorios, confirmaciones y avisos de galería.",
    enable_notif: "Activar notificaciones",
    photo_title: "Captura los recuerdos",
    photo_sub: "Permite cámara y galería para compartir fotos.",
    enable_photo: "Permitir cámara",
    interests_title: "¿Qué te gusta organizar?",
    ready_title: "¡Todo listo!",
    create_first: "Crear mi primer evento",
    continue: "Continuar",
  },
  fr: {
    welcome_title: "Bienvenue sur SHEREHE",
    welcome_tag: "Créez des invitations, recueillez les RSVP et capturez des souvenirs.",
    get_started: "Commencer",
    continue_guest: "Continuer en invité",
    choose_language: "Choisissez votre langue",
    who_are_you: "Qui êtes-vous ?",
    role_host: "Hôte",
    role_guest: "Invité",
    sign_in: "Se connecter",
    cont_google: "Continuer avec Google",
    cont_apple: "Continuer avec Apple",
    cont_phone: "Continuer par téléphone",
    cont_email: "Continuer par email",
    skip_now: "Passer",
    notif_title: "Restez informé",
    enable_notif: "Activer les notifications",
    photo_title: "Capturez les moments",
    enable_photo: "Autoriser la caméra",
    interests_title: "Qu'aimez-vous organiser ?",
    ready_title: "Vous êtes prêt !",
    create_first: "Créer mon premier événement",
    continue: "Continuer",
  },
  ar: {
    welcome_title: "مرحبًا بك في SHEREHE",
    welcome_tag: "أنشئ الدعوات، اجمع الردود، والتقط الذكريات معًا.",
    get_started: "ابدأ الآن",
    continue_guest: "متابعة كضيف",
    choose_language: "اختر لغتك",
    who_are_you: "من أنت؟",
    role_host: "مضيف",
    role_guest: "ضيف",
    sign_in: "تسجيل الدخول",
    cont_google: "المتابعة باستخدام Google",
    cont_apple: "المتابعة باستخدام Apple",
    cont_phone: "المتابعة بالهاتف",
    cont_email: "المتابعة بالبريد",
    skip_now: "تخطّي",
    notif_title: "ابقَ على اطلاع",
    enable_notif: "تفعيل الإشعارات",
    photo_title: "التقط اللحظات",
    enable_photo: "السماح بالكاميرا",
    interests_title: "ماذا تحب أن تستضيف؟",
    ready_title: "كل شيء جاهز",
    create_first: "إنشاء أول حدث",
    continue: "متابعة",
  },
  sw: {
    welcome_title: "Karibu SHEREHE",
    welcome_tag: "Tengeneza mialiko, kusanya majibu, na nasa kumbukumbu pamoja.",
    get_started: "Anza",
    continue_guest: "Endelea kama mgeni",
    choose_language: "Chagua lugha yako",
    who_are_you: "Wewe ni nani?",
    role_host: "Mwenyeji",
    role_guest: "Mgeni",
    sign_in: "Ingia",
    cont_google: "Endelea na Google",
    cont_apple: "Endelea na Apple",
    cont_phone: "Endelea na simu",
    cont_email: "Endelea na barua pepe",
    skip_now: "Ruka kwa sasa",
    notif_title: "Pata taarifa",
    enable_notif: "Washa arifa",
    photo_title: "Nasa kumbukumbu",
    enable_photo: "Ruhusu kamera",
    interests_title: "Unapenda kuandaa nini?",
    ready_title: "Uko tayari!",
    create_first: "Tengeneza tukio langu",
    continue: "Endelea",
  },
  pt: {
    welcome_title: "Bem-vindo ao SHEREHE",
    welcome_tag: "Crie convites, receba confirmações e capture memórias.",
    get_started: "Começar",
    continue_guest: "Continuar como convidado",
    choose_language: "Escolha o idioma",
    who_are_you: "Quem é você?",
    role_host: "Anfitrião",
    role_guest: "Convidado",
    sign_in: "Entrar",
    cont_google: "Continuar com Google",
    cont_apple: "Continuar com Apple",
    cont_phone: "Continuar com telefone",
    cont_email: "Continuar com email",
    skip_now: "Pular",
    notif_title: "Fique por dentro",
    enable_notif: "Ativar notificações",
    photo_title: "Capture os momentos",
    enable_photo: "Permitir câmera",
    interests_title: "O que você adora organizar?",
    ready_title: "Tudo pronto!",
    create_first: "Criar meu primeiro evento",
    continue: "Continuar",
  },
  hi: {
    welcome_title: "SHEREHE में आपका स्वागत है",
    welcome_tag: "निमंत्रण बनाएं, RSVP एकत्र करें और यादें कैप्चर करें।",
    get_started: "शुरू करें",
    continue_guest: "अतिथि के रूप में जारी रखें",
    choose_language: "अपनी भाषा चुनें",
    who_are_you: "आप कौन हैं?",
    role_host: "होस्ट",
    role_guest: "अतिथि",
    sign_in: "साइन इन",
    skip_now: "अभी छोड़ें",
    continue: "जारी रखें",
    create_first: "मेरा पहला इवेंट बनाएं",
    ready_title: "सब तैयार है!",
  },
  zh: {
    welcome_title: "欢迎来到 SHEREHE",
    welcome_tag: "创建邀请、收集回复并一起记录回忆。",
    get_started: "开始使用",
    continue_guest: "以访客继续",
    choose_language: "选择语言",
    who_are_you: "您是？",
    role_host: "活动主办人",
    role_guest: "宾客",
    sign_in: "登录",
    skip_now: "暂时跳过",
    continue: "继续",
    create_first: "创建第一个活动",
    ready_title: "一切就绪",
  },
  de: { welcome_title: "Willkommen bei SHEREHE", get_started: "Loslegen", continue: "Weiter" },
  it: { welcome_title: "Benvenuto su SHEREHE", get_started: "Inizia", continue: "Continua" },
  ja: { welcome_title: "SHEREHE へようこそ", get_started: "はじめる", continue: "続ける" },
  ru: { welcome_title: "Добро пожаловать в SHEREHE", get_started: "Начать", continue: "Продолжить" },
};

export function t(key: string, lang: LangCode = "en"): string {
  return dicts[lang]?.[key] ?? dicts.en[key] ?? key;
}

export function getLanguage(code: LangCode): LanguageDef {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
