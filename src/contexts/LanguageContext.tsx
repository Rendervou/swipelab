import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'id' | 'en' | 'zh' | 'ja';

export const languages: Record<Language, { name: string; nativeName: string; flag: string }> = {
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
};

// Translation keys organized by category
export const translations: Record<Language, Record<string, string>> = {
  id: {
    // Auth
    'auth.welcome': 'Selamat datang',
    'auth.welcomeBack': 'Selamat datang kembali',
    'auth.signInContinue': 'Masuk untuk melanjutkan perjalanan desainmu',
    'auth.createAccount': 'Buat akun baru',
    'auth.startFeedback': 'Mulai dapatkan feedback untuk desainmu',
    'auth.email': 'Email',
    'auth.password': 'Kata sandi',
    'auth.confirmPassword': 'Konfirmasi kata sandi',
    'auth.name': 'Nama',
    'auth.signIn': 'Masuk',
    'auth.signUp': 'Daftar',
    'auth.signUpFree': 'Daftar gratis',
    'auth.noAccount': 'Belum punya akun?',
    'auth.hasAccount': 'Sudah punya akun?',
    'auth.emailPlaceholder': 'hello@contoh.com',
    'auth.namePlaceholder': 'Nama lengkapmu',
    'auth.passwordPlaceholder': '••••••••',
    'auth.selectLanguage': 'Pilih Bahasa',
    
    // Common
    'common.loading': 'Memuat...',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.create': 'Buat',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.all': 'Semua',
    'common.back': 'Kembali',
    'common.next': 'Selanjutnya',
    'common.submit': 'Kirim',
    'common.viewAll': 'Lihat Semua',
    
    // Hero/Landing
    'hero.tagline': 'Swipe ideas. Discover talent.',
    'hero.poweredBy': 'Powered by AI.',
    'hero.description': 'Komunitas desainer terbesar untuk berbagi karya dan mendapat feedback berkualitas.',
    
    // Services
    'services.title': 'Jasa Desainer',
    'services.description': 'Temukan jasa desain profesional dari talenta terbaik',
    'services.createNew': 'Buat Jasa Baru',
    'services.myServices': 'Jasa Saya',
    'services.basicPlan': 'Basic',
    'services.standardPlan': 'Standard',
    'services.premiumPlan': 'Premium',
    'services.days': 'hari',
    'services.revisions': 'revisi',
    'services.orderNow': 'Pesan Sekarang',
    'services.noServices': 'Belum ada jasa tersedia',
    'services.addService': 'Tambah Jasa',
    'services.serviceTitle': 'Judul Jasa',
    'services.serviceDescription': 'Deskripsi Jasa',
    'services.category': 'Kategori',
    'services.price': 'Harga',
    'services.deliveryTime': 'Waktu Pengerjaan',
    'services.faq': 'FAQ',
    'services.portfolio': 'Portfolio',
    'services.testimonials': 'Testimonial',
    
    // Categories
    'category.ui_ux_design': 'UI/UX Design',
    'category.graphic_design': 'Graphic Design',
    'category.illustration': 'Ilustrasi',
    'category.branding': 'Branding',
    'category.web_design': 'Web Design',
    'category.mobile_design': 'Mobile Design',
    'category.motion_graphics': 'Motion Graphics',
    'category.other': 'Lainnya',
    
    // Navigation
    'nav.feed': 'Feed',
    'nav.designers': 'Designer',
    'nav.services': 'Jasa',
    'nav.upload': 'Upload',
    'nav.dashboard': 'Dashboard',
    'nav.messages': 'Pesan',
    'nav.bookmarks': 'Bookmark',
    'nav.profile': 'Profil',
    'nav.logout': 'Keluar',
    'nav.login': 'Masuk',
  },
  en: {
    // Auth
    'auth.welcome': 'Welcome',
    'auth.welcomeBack': 'Welcome back',
    'auth.signInContinue': 'Sign in to continue your design journey',
    'auth.createAccount': 'Create your account',
    'auth.startFeedback': 'Start getting feedback on your designs',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Name',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signUpFree': 'Sign up free',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.emailPlaceholder': 'hello@example.com',
    'auth.namePlaceholder': 'Your full name',
    'auth.passwordPlaceholder': '••••••••',
    'auth.selectLanguage': 'Select Language',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.viewAll': 'View All',
    
    // Hero/Landing
    'hero.tagline': 'Swipe ideas. Discover talent.',
    'hero.poweredBy': 'Powered by AI.',
    'hero.description': 'The largest designer community to share work and get quality feedback.',
    
    // Services
    'services.title': 'Designer Services',
    'services.description': 'Find professional design services from top talent',
    'services.createNew': 'Create New Service',
    'services.myServices': 'My Services',
    'services.basicPlan': 'Basic',
    'services.standardPlan': 'Standard',
    'services.premiumPlan': 'Premium',
    'services.days': 'days',
    'services.revisions': 'revisions',
    'services.orderNow': 'Order Now',
    'services.noServices': 'No services available yet',
    'services.addService': 'Add Service',
    'services.serviceTitle': 'Service Title',
    'services.serviceDescription': 'Service Description',
    'services.category': 'Category',
    'services.price': 'Price',
    'services.deliveryTime': 'Delivery Time',
    'services.faq': 'FAQ',
    'services.portfolio': 'Portfolio',
    'services.testimonials': 'Testimonials',
    
    // Categories
    'category.ui_ux_design': 'UI/UX Design',
    'category.graphic_design': 'Graphic Design',
    'category.illustration': 'Illustration',
    'category.branding': 'Branding',
    'category.web_design': 'Web Design',
    'category.mobile_design': 'Mobile Design',
    'category.motion_graphics': 'Motion Graphics',
    'category.other': 'Other',
    
    // Navigation
    'nav.feed': 'Feed',
    'nav.designers': 'Designers',
    'nav.services': 'Services',
    'nav.upload': 'Upload',
    'nav.dashboard': 'Dashboard',
    'nav.messages': 'Messages',
    'nav.bookmarks': 'Bookmarks',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
  },
  zh: {
    // Auth
    'auth.welcome': '欢迎',
    'auth.welcomeBack': '欢迎回来',
    'auth.signInContinue': '登录以继续您的设计之旅',
    'auth.createAccount': '创建账户',
    'auth.startFeedback': '开始获取您设计的反馈',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.name': '姓名',
    'auth.signIn': '登录',
    'auth.signUp': '注册',
    'auth.signUpFree': '免费注册',
    'auth.noAccount': '还没有账户？',
    'auth.hasAccount': '已有账户？',
    'auth.emailPlaceholder': 'hello@example.com',
    'auth.namePlaceholder': '您的全名',
    'auth.passwordPlaceholder': '••••••••',
    'auth.selectLanguage': '选择语言',
    
    // Common
    'common.loading': '加载中...',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.create': '创建',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.all': '全部',
    'common.back': '返回',
    'common.next': '下一步',
    'common.submit': '提交',
    'common.viewAll': '查看全部',
    
    // Hero/Landing
    'hero.tagline': '滑动创意。发现人才。',
    'hero.poweredBy': '由AI驱动。',
    'hero.description': '最大的设计师社区，分享作品并获得优质反馈。',
    
    // Services
    'services.title': '设计师服务',
    'services.description': '寻找顶尖人才的专业设计服务',
    'services.createNew': '创建新服务',
    'services.myServices': '我的服务',
    'services.basicPlan': '基础版',
    'services.standardPlan': '标准版',
    'services.premiumPlan': '高级版',
    'services.days': '天',
    'services.revisions': '次修改',
    'services.orderNow': '立即订购',
    'services.noServices': '暂无可用服务',
    'services.addService': '添加服务',
    'services.serviceTitle': '服务标题',
    'services.serviceDescription': '服务描述',
    'services.category': '类别',
    'services.price': '价格',
    'services.deliveryTime': '交付时间',
    'services.faq': '常见问题',
    'services.portfolio': '作品集',
    'services.testimonials': '评价',
    
    // Categories
    'category.ui_ux_design': 'UI/UX 设计',
    'category.graphic_design': '平面设计',
    'category.illustration': '插画',
    'category.branding': '品牌设计',
    'category.web_design': '网页设计',
    'category.mobile_design': '移动端设计',
    'category.motion_graphics': '动态图形',
    'category.other': '其他',
    
    // Navigation
    'nav.feed': '动态',
    'nav.designers': '设计师',
    'nav.services': '服务',
    'nav.upload': '上传',
    'nav.dashboard': '仪表板',
    'nav.messages': '消息',
    'nav.bookmarks': '收藏',
    'nav.profile': '个人资料',
    'nav.logout': '退出',
    'nav.login': '登录',
  },
  ja: {
    // Auth
    'auth.welcome': 'ようこそ',
    'auth.welcomeBack': 'おかえりなさい',
    'auth.signInContinue': 'サインインしてデザインの旅を続けましょう',
    'auth.createAccount': 'アカウントを作成',
    'auth.startFeedback': 'デザインへのフィードバックを始めましょう',
    'auth.email': 'メール',
    'auth.password': 'パスワード',
    'auth.confirmPassword': 'パスワード確認',
    'auth.name': '名前',
    'auth.signIn': 'サインイン',
    'auth.signUp': '登録',
    'auth.signUpFree': '無料登録',
    'auth.noAccount': 'アカウントをお持ちでないですか？',
    'auth.hasAccount': '既にアカウントをお持ちですか？',
    'auth.emailPlaceholder': 'hello@example.com',
    'auth.namePlaceholder': 'フルネーム',
    'auth.passwordPlaceholder': '••••••••',
    'auth.selectLanguage': '言語を選択',
    
    // Common
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.create': '作成',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.all': 'すべて',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.submit': '送信',
    'common.viewAll': 'すべて表示',
    
    // Hero/Landing
    'hero.tagline': 'アイデアをスワイプ。才能を発見。',
    'hero.poweredBy': 'AI搭載。',
    'hero.description': '作品を共有し、質の高いフィードバックを得る最大のデザイナーコミュニティ。',
    
    // Services
    'services.title': 'デザイナーサービス',
    'services.description': 'トップタレントのプロフェッショナルデザインサービスを見つける',
    'services.createNew': '新しいサービスを作成',
    'services.myServices': 'マイサービス',
    'services.basicPlan': 'ベーシック',
    'services.standardPlan': 'スタンダード',
    'services.premiumPlan': 'プレミアム',
    'services.days': '日',
    'services.revisions': '回の修正',
    'services.orderNow': '今すぐ注文',
    'services.noServices': 'まだサービスがありません',
    'services.addService': 'サービスを追加',
    'services.serviceTitle': 'サービスタイトル',
    'services.serviceDescription': 'サービス説明',
    'services.category': 'カテゴリー',
    'services.price': '価格',
    'services.deliveryTime': '納期',
    'services.faq': 'よくある質問',
    'services.portfolio': 'ポートフォリオ',
    'services.testimonials': 'お客様の声',
    
    // Categories
    'category.ui_ux_design': 'UI/UXデザイン',
    'category.graphic_design': 'グラフィックデザイン',
    'category.illustration': 'イラスト',
    'category.branding': 'ブランディング',
    'category.web_design': 'Webデザイン',
    'category.mobile_design': 'モバイルデザイン',
    'category.motion_graphics': 'モーショングラフィックス',
    'category.other': 'その他',
    
    // Navigation
    'nav.feed': 'フィード',
    'nav.designers': 'デザイナー',
    'nav.services': 'サービス',
    'nav.upload': 'アップロード',
    'nav.dashboard': 'ダッシュボード',
    'nav.messages': 'メッセージ',
    'nav.bookmarks': 'ブックマーク',
    'nav.profile': 'プロフィール',
    'nav.logout': 'ログアウト',
    'nav.login': 'ログイン',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('swipelab-language');
    return (saved as Language) || 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swipelab-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
