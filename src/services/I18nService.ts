// Internationalization (i18n) Service
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh';

interface Translation {
  [key: string]: string | Translation;
}

const translations: Record<LanguageCode, Translation> = {
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    balance: 'Balance',
    transactions: 'Transactions',
    settings: 'Settings',
    profile: 'Profile',
    support: 'Support',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    print: 'Print',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    users: 'Users',
    admins: 'Administrators',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    totalTransactions: 'Total Transactions',
    totalRevenue: 'Total Revenue',
    recentActivities: 'Recent Activities',
    noData: 'No data available',
    date: 'Date',
    amount: 'Amount',
    status: 'Status',
    actions: 'Actions',
    confirm: 'Confirm',
    description: 'Description',
  },
  es: {
    dashboard: 'Panel de Control',
    welcome: 'Bienvenido',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    balance: 'Saldo',
    transactions: 'Transacciones',
    settings: 'Configuración',
    profile: 'Perfil',
    support: 'Soporte',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    print: 'Imprimir',
    delete: 'Eliminar',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    yes: 'Sí',
    no: 'No',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    users: 'Usuarios',
    admins: 'Administradores',
    totalUsers: 'Total de Usuarios',
    activeUsers: 'Usuarios Activos',
    totalTransactions: 'Total de Transacciones',
    totalRevenue: 'Ingresos Totales',
    recentActivities: 'Actividades Recientes',
    noData: 'Sin datos disponibles',
    date: 'Fecha',
    amount: 'Cantidad',
    status: 'Estado',
    actions: 'Acciones',
    confirm: 'Confirmar',
    description: 'Descripción',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    welcome: 'Bienvenue',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'S\'inscrire',
    balance: 'Solde',
    transactions: 'Transactions',
    settings: 'Paramètres',
    profile: 'Profil',
    support: 'Support',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    print: 'Imprimer',
    delete: 'Supprimer',
    edit: 'Modifier',
    save: 'Enregistrer',
    cancel: 'Annuler',
    yes: 'Oui',
    no: 'Non',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information',
    users: 'Utilisateurs',
    admins: 'Administrateurs',
    totalUsers: 'Total des Utilisateurs',
    activeUsers: 'Utilisateurs Actifs',
    totalTransactions: 'Total des Transactions',
    totalRevenue: 'Revenu Total',
    recentActivities: 'Activités Récentes',
    noData: 'Aucune donnée disponible',
    date: 'Date',
    amount: 'Montant',
    status: 'Statut',
    actions: 'Actions',
    confirm: 'Confirmer',
    description: 'Description',
  },
  de: {
    dashboard: 'Armaturenbrett',
    welcome: 'Willkommen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    balance: 'Bilanz',
    transactions: 'Transaktionen',
    settings: 'Einstellungen',
    profile: 'Profil',
    support: 'Unterstützung',
    search: 'Suchen',
    filter: 'Filter',
    export: 'Exportieren',
    print: 'Drucken',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    save: 'Speichern',
    cancel: 'Abbrechen',
    yes: 'Ja',
    no: 'Nein',
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    warning: 'Warnung',
    info: 'Information',
    users: 'Benutzer',
    admins: 'Administratoren',
    totalUsers: 'Gesamtbenutzer',
    activeUsers: 'Aktive Benutzer',
    totalTransactions: 'Gesamttransaktionen',
    totalRevenue: 'Gesamtumsatz',
    recentActivities: 'Kürzliche Aktivitäten',
    noData: 'Keine Daten verfügbar',
    date: 'Datum',
    amount: 'Betrag',
    status: 'Status',
    actions: 'Aktionen',
    confirm: 'Bestätigen',
    description: 'Beschreibung',
  },
  zh: {
    dashboard: '仪表板',
    welcome: '欢迎',
    logout: '登出',
    login: '登录',
    register: '注册',
    balance: '余额',
    transactions: '交易',
    settings: '设置',
    profile: '个人资料',
    support: '支持',
    search: '搜索',
    filter: '过滤',
    export: '导出',
    print: '打印',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    cancel: '取消',
    yes: '是',
    no: '否',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    users: '用户',
    admins: '管理员',
    totalUsers: '总用户数',
    activeUsers: '活跃用户',
    totalTransactions: '总交易数',
    totalRevenue: '总收入',
    recentActivities: '最近的活动',
    noData: '没有可用数据',
    date: '日期',
    amount: '金额',
    status: '状态',
    actions: '操作',
    confirm: '确认',
    description: '描述',
  },
};

export class I18nService {
  private static currentLanguage: LanguageCode = 'en';

  static setLanguage(lang: LanguageCode): void {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  }

  static getLanguage(): LanguageCode {
    const saved = localStorage.getItem('language') as LanguageCode;
    if (saved && translations[saved]) {
      this.currentLanguage = saved;
    }
    return this.currentLanguage;
  }

  static t(key: string): string {
    const keys = key.split('.');
    let value: unknown = translations[this.currentLanguage];

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  }

  static getAvailableLanguages(): LanguageCode[] {
    return Object.keys(translations) as LanguageCode[];
  }

  static getLanguageName(lang: LanguageCode): string {
    const names: Record<LanguageCode, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文',
    };
    return names[lang];
  }
}
