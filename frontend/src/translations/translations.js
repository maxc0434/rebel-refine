export const translations = {
  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- FRANCAIS --------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region FRANCAIS

  fr: {
    //#region DATABASE
    database: {
      // Sexe
      male: "Homme",
      female: "Femme",

      // État civil (Clés = slugs envoyés par le select)
      single: "Célibataire",
      divorced: "Divorcé(e)",
      widowed: "Veuf(ve)",
      free_couple: "Couple libre",

      // Religion
      aucune: "Aucune",
      catholique: "Catholique",
      orthodoxe: "Orthodoxe",
      protestant: "Protestant",
      buddhist: "Bouddhiste",
      hindoue: "Hindoue",
      judaique: "Judaïque",
      islam: "Islam",
      atheist: "Athée",
      spiritual_but_not_religious: "Spirituel mais non religieux",
      other: "Autre",

      // Pays
      france: "🇫🇷 France",
      germany: "🇩🇪 Allemagne",
      italy: "🇮🇹 Italie",
      spain: "🇪🇸 Espagne",
      united_kingdom: "🇬🇧 Angleterre",
      belgium: "🇧🇪 Belgique",
      switzerland: "🇨🇭 Suisse",
      china: "🇨🇳 Chine",
      japan: "🇯🇵 Japon",
      russia: "🇷🇺 Russie",
      thailand: "🇹🇭 Thaïlande",
      vietnam: "🇻🇳 Vietnam",
    },
    //#endregion

    //#region GLOBAL
    age_suffix: "ans ",
    loading_profiles: "Chargement des profils...",
    members_unit: "Membres",
    save: "Enregistrer",
    saved: "Enregistré",
    delete: "Supprimer",
    deleted: "Supprimé !",
    cancel: "Annuler",
    error: "Erreur",
    error_occured: "Une erreur est survenue.",
    //#endregion

    //#region NAVBAR
    nav_home: "Accueil",
    nav_members: "Membres",
    nav_dashboard: "Tableau de bord",
    nav_shop: "Boutique",
    nav_logout: "DÉCONNEXION",
    nav_login: "SE CONNECTER",
    nav_register: "S'INSCRIRE",
    //#endregion NAVBAR

    //#region PRESENTATION-PAGE
    //#region Chargement
    loading_universe: "Chargement de l'univers Rebel Refine...",
    //#endregion

    //#region Alertes (SweetAlert)
    alert_gallery_title: "Accès Galerie",
    alert_gallery_text:
      "Pour accéder à la galerie des membres ainsi qu'aux profils et à la messagerie, vous devez vous connecter.",
    alert_gallery_confirm: "Connexion",
    alert_gallery_cancel: "Annuler",
    //#endregion

    //#region Banner Slider
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "Osez l'Orient, Vivez l'Inoubliable.",
    banner_1_desc:
      "Rencontrez des femmes authentiques en quête d'un homme européen moderne. Un pont entre deux mondes, bâti sur le respect.",
    banner_1_btn: "COMMENCER L'AVENTURE",

    banner_2_subtitle: "Le Rendez-vous de Deux Mondes.",
    banner_2_desc:
      "Découvrez des profils féminins authentiques et raffinés, sélectionnés pour un homme exigeant en quête d'une histoire sérieuse.",
    banner_2_btn: "CRÉER LE LIEN",
    //#endregion

    //#region Section Règles
    rules_title: "Les Règles de notre",
    rules_highlight: "Communauté",

    // Règle 1
    rule_men_title: "Accès Messieurs",
    rule_men_desc_part1: "Inscrivez-vous librement et profitez de",
    rule_men_desc_highlight: "5 crédits offerts",
    rule_men_desc_part2: "pour initier vos premiers échanges dès aujourd'hui.",

    // Règle 2
    rule_women_title: "Sélection Dames",
    rule_women_desc:
      "Par souci de sécurité, les profils féminins sont validés et inscrits exclusivement par l'administrateur.",
    rule_women_contact: "Contact : admin@tonsite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "Traduction par l'humain",
    rule_trans_desc_part1: "Communiquez sans limites. Vos messages sont",
    rule_trans_desc_highlight: "traduits par des traducteurs qualifiés",
    rule_trans_desc_part2:
      "pour garantir une fluidité totale dans vos échanges.",

    // Règle 4
    rule_kind_title: "Esprit Bienveillant",
    rule_kind_desc_part1: "Un espace fondé sur",
    rule_kind_desc_highlight1: "le respect mutuel",
    rule_kind_desc_part2: " dédié aux personnes recherchant des connexions",
    rule_kind_desc_highlight2: "authentiques, sincères",
    rule_kind_desc_part3: "et",
    rule_kind_desc_highlight3: "durables.",

    // Argument final
    rule_flex_title: "Liberté & Flexibilité",
    rule_flex_desc:
      "Pas d'abonnement mensuel. Une fois vos crédits de bienvenue utilisés, rechargez votre compte selon vos besoins.",
    //#endregion

    //#region Section Membres
    members_title: "Nos nouveaux",
    members_highlight: "membres",
    members_subtitle: "Voici les derniers profils ayant rejoint Rebel Refine.",
    members_btn: "Découvrir tous les membres",
    years_old: "ans",
    //#endregion

    //#region Section Concept
    concept_title: "À qui s'adresse notre",
    concept_highlight: "Cercle",
    concept_serenity_title: "Sérénité & Sécurité",
    concept_serenity_desc:
      "Profils vérifiés pour une expérience authentique et protégée.",
    concept_exclu_title: "Exclusivité",
    concept_exclu_desc:
      "Une interaction privilégiée réservée aux membres authentifiés.",
    //#endregion

    //#region Footer
    footer_ready: "Prêt à franchir le pas ?",
    footer_register: "Créer mon profil",
    footer_login: "Se connecter",
    //#endregion

    //#endregion PRESENTATION-PAGE

    //#region REGISTER-PAGE
    register_subtitle: "Rejoignez le groupe exclusif",
    register_form_title: "Créer un compte ",
    register_success:
      "Inscription réussie ! Un lien de confirmation vous a été envoyé par email.",
    register_error_generic: "Erreur lors de l'inscription",
    register_error_password: "Les mots de passe ne correspondent pas",

    register_label_gender: "Vous êtes :",
    register_gender_male: "un HOMME",
    register_gender_female: "une FEMME",

    register_label_country: "Pays/Langue d'origine :",
    register_country_placeholder: "-- Choisissez votre pays --",

    register_label_nickname: "Pseudo",
    register_nickname_placeholder: "Comment devons-nous vous appeler ?",

    register_label_email: "Votre adresse email prestigieuse",
    register_label_password: "Mot de passe",
    register_label_confirm: "Confirmation",

    register_btn_submit: "DEVENIR MEMBRE",
    register_footer_text: "Vous faites déjà partie du groupe ?",
    register_footer_link: "Se connecter",

    // Modale Contact Administration
    register_modal_title: "INSCRIPTION SÉCURISÉE",
    register_modal_text:
      "Pour garantir l'exclusivité et la sécurité de notre groupe, l'inscription des profils féminins est gérée directement par notre équipe d'administration.",
    register_modal_contact: "Contactez-nous par mail ou téléphone",
    register_modal_btn_back: "RETOUR",
    //#endregion REGISTER-PAGE

    //#region LOGIN-PAGE
    login_subtitle: "Trouvez votre partenaire idéal",
    login_error_invalid: "Identifiants incorrects",
    login_success_verified:
      "Compte vérifié avec succès ! Bienvenue à Rebel Refine.",

    login_label_email: "Email",
    login_label_password: "Mot de passe",
    login_forgot_password: "Mot de Passe Oublié ?",
    login_btn_submit: "SE CONNECTER",

    login_footer_no_account: "Pas encore de compte ?",
    login_footer_register_link:
      "Inscrivez-vous dès maintenant et gratuitement en cliquant ICI",

    // Modal Récupération
    login_modal_title: "Récupération de compte",
    login_modal_label: "Entrez votre adresse email :",
    login_modal_btn_send: "Envoyer le lien",
    login_modal_sending: "Envoi en cours...",
    //#endregion LOGIN-PAGE

    //#region HOME-PAGE
    home_welcome_back: "Ravi de vous revoir,",
    home_adventurer: "Aventurier",
    home_subtitle: "Votre partenaire idéal n'est plus qu'à un clic.",
    home_search_title: "Je recherche une femme",
    home_search_from: "De...",
    home_search_to: "A...",
    home_btn_search: "Trouver ma partenaire",

    // Section Nouveaux Membres
    home_new_members_title: "Nos nouveaux membres",
    home_new_members_desc:
      "Voici les derniers profils ayant rejoint Rebel Refine. Faites le premier pas !",
    home_btn_discover_all: "Découvrir toutes les membres",
    home_favorite_error: "Impossible de mettre à jour le favori.",

    // Section Stats (About)
    home_stats_title: "Tout commence par une rencontre",
    home_stats_desc:
      "Rejoignez une communauté grandissante et accédez à des milliers de profils.",
    home_stat_total: "Membres au Total",
    home_stat_online: "Membres en ligne",
    home_stat_males: "Hommes en ligne",
    home_stat_females: "Femmes en ligne",
    //#endregion

    //#region SEARCH-PAGE
    search_results_title: "Résultats",
    search_results_subtitle: "de la recherche :",
    search_btn_discover: "DÉCOUVRIR LE PROFIL",
    search_no_results: "Aucun profil ne correspond à vos critères.",
    //#endregion SEARCH-PAGE

    //#region MEMBERS-PAGE
    members_title_female: "Tous nos membres féminins",
    //#endregion

    //#region PROFILE-PAGE
    profile_age_label: "Âge :",
    profile_gallery_title: "Ma Galerie Photos",
    profile_no_photo: "Aucune photo dans la galerie.",
    profile_about_title: "À propos et Détails",
    profile_no_description: "Pas de description renseignée.",
    // Détails techniques
    profile_status: "Situation",
    profile_country: "Pays",
    profile_children: "Enfants",
    profile_religion: "Religion",
    // Mémo
    profile_memo_title: "MÉMO PRIVÉ",
    profile_memo_placeholder: "Écris ta note sur ce membre...",
    profile_memo_save_success: "Ton mémo a été mis à jour.",
    profile_memo_delete_confirm: "Supprimer la note ?",
    profile_memo_delete_warning: "Cette action est irréversible.",
    // Messages / Crédits
    profile_msg_confirm_title: "Êtes-vous sûr ?",
    profile_msg_confirm_text: "Cela vous coûtera 1 crédit.",
    profile_msg_send_btn: "Oui, Envoyer !",
    profile_msg_sent_success: "Envoyé !",
    profile_msg_remaining_credits: "Crédits restants : {{count}}",
    //#endregion

    //#region PROFILE MALE
    view_profile_back: "Retour au Tableau de bord",
    view_profile_loading: "Chargement du profil privé...",
    view_profile_other_info: "Autres Informations",
    view_profile_birthdate: "Date de naissance:",
    view_profile_country: "Pays",
    view_profile_status: "Statut Marital",
    view_profile_children: "Enfants",
    view_profile_religion: "Religion",
    view_profile_about: "À propos",
    view_profile_no_desc: "Aucune description.",
    view_profile_reply: "Répondre à",
    view_profile_error_title: "Oups !",
    view_profile_not_found: "Profil non renseigné",
    //#endregion

    //#region CREDITSHOP
    shop_title: "Rechargez vos",
    shop_title_gold: "Crédits",
    shop_subtitle:
      "Choisissez la formule qui vous ressemble pour continuer vos échanges.",
    shop_pack_credits: "Crédits",
    shop_pack_button: "Choisir ce pack",
    shop_error_login: "Vous devez être connecté",
    shop_error_payment_title: "Paiement impossible",
    shop_error_init: "Erreur lors de l'initialisation du paiement",
    // Packs
    pack_decouverte: "Découverte",
    pack_passion: "Passion",
    pack_elite: "Élite",
    //#endregion

    //#region RESETPASSWORD
    reset_title: "Nouveau mot de passe",
    reset_subtitle:
      "Choisissez un mot de passe robuste pour sécuriser votre compte.",
    reset_label: "MOT DE PASSE",
    reset_btn: "VALIDER LE CHANGEMENT",
    reset_success:
      "Succès ! Votre mot de passe est mis à jour.\nRedirection automatique vers la page de connexion...",
    reset_error_default: "Une erreur est survenue.",
    //#endregion

    //#region PAYMENT SUCCESS
    payment_success_swal_title: "Paiement validé !",
    payment_processing_title: "Traitement de votre commande...",
    //#endregion

    //#region TRANSLATORDASHBOARD
    translator_main_title: "Espace Modération & Traduction",
    translator_empty_state: "Aucun message en attente. Tout est à jour !",
    translator_label_source: "Message source",
    translator_label_translation: "Traduction",
    translator_placeholder: "Saisissez la traduction ici... ",
    translator_btn_send: "Valider et Envoyer",
    translator_success_title: "Traduction validée",
    translator_success_msg: "Le message a été envoyé avec succès.",
    translator_error_empty: "Veuillez saisir une traduction avant de valider.",
    //#endregion

    //#region DASHBOARD
    //BEFORE RENDER
    // Dashboard
    db_loading: "Chargement de votre profil...",
    db_error_load: "Erreur de connexion : impossible de récupérer vos données.",
    db_update_success_title: "Profil mis à jour !",
    db_update_success_text:
      "Vos modifications ont été enregistrées avec succès.",
    db_update_error: "Une erreur est survenue.",
    db_net_error: "Impossible de joindre le serveur.",
    db_pwd_mismatch: "Les mots de passe ne correspondent pas.",
    db_pwd_success_title: "Mot de passe mis à jour !",
    db_pwd_success_text: "Votre mot de passe a bien été mis à jour.",
    db_photo_del_error: "Erreur lors de la suppression",
    // Messagerie & Crédits
    msg_confirm_title: "Êtes-vous sûr ?",
    msg_confirm_text: "Cela vous coûtera 1 crédit.",
    msg_confirm_btn: "Oui, Envoyer !",
    msg_sent_title: "Envoyé !",
    msg_credits_left: "Crédits restants : ",
    msg_del_conv_title: "Supprimer la conversation ?",
    msg_del_conv_text:
      "Tous les messages avec ce contact seront effacés définitivement.",
    msg_del_confirm_btn: "Oui, supprimer",
    msg_del_cancel_btn: "Annuler",
    msg_del_success: "Supprimé !",

    //AFTER RENDER
    // Navigation & Header
    db_title: "Mon Tableau de Bord",
    db_welcome: "Bienvenue,",
    db_balance: "Votre solde :",
    db_credits: "Crédits",
    db_nav_title: "Navigation",
    db_tab_infos: "Mes Informations",
    db_tab_msg: "Ma Messagerie",
    db_tab_favs: "Mes Favoris",
    db_tab_purchases: "Mes Achats",
    db_tab_security: "Sécurité",

    // Profil & Galerie
    db_edit_btn: "Modifier mes infos",
    db_gallery_title: "Ma Galerie Photo",
    db_not_set: "Non renseigné",
    db_label_pseudo: "Pseudo",
    db_label_email: "Email (non modifiable)",
    db_label_country: "Pays (non modifiable)",
    db_label_birth: "Date de naissance",
    db_label_marital: "Situation Maritale",
    db_label_children: "Enfants",
    db_label_religion: "Religion / Spiritualité",
    db_label_interests: "Ma Présentation & Intérêts",

    // Options Select
    opts_choose: "Choisir...",
    opts_single: "Célibataire",
    opts_divorced: "Divorcé(e)",
    opts_widowed: "Veuf(ve)",
    opts_free_couple: "Couple libre",
    opts_none: "Aucun",
    opts_child_1: "1 enfant",
    opts_child_2: "2 enfants",
    opts_child_3: "3 enfants",
    opts_child_4: "4 enfants",
    opts_child_5plus: "5 enfants ou plus",
    opts_religion: "Spirituel mais non religieux",
    opts_religion_other: "Autre",

    // Boutons
    btn_save: "SAUVEGARDER",
    btn_cancel: "ANNULER",

    // Messagerie
    msg_title: "Mes Conversations",
    msg_empty: "Vous n'avez pas encore de messages.",
    msg_empty_sub:
      "Contactez un membre depuis son profil pour démarrer une discussion !",
    msg_user_default: "Utilisateur",
    msg_view_profile: "Voir son profil",
    msg_badge_new: "NOUVEAU",
    msg_reply: "→ Répondre",
    msg_delete_title: "Supprimer la conversation",

    // Favoris
    fav_title: "Mes Coups de Cœur",
    fav_count: "membres",
    fav_view_btn: "Voir le profil",

    // Achats / Historique
    buy_title: "Historique de mes achats",
    buy_count: "transactions",
    buy_added: "crédits",
    buy_date_prefix: "Le",
    buy_status_ok: "Accepté",
    buy_empty: "Vous n'avez pas encore effectué d'achats.",

    // Sécurité
    sec_title: "Sécurité du compte",
    sec_email_label: "Email de connexion",
    sec_pref_title: "Préférences d'envoi",
    sec_pref_confirm: "Confirmer avant d'envoyer un message",
    sec_pwd_change_title: "Changer le mot de passe",
    sec_pwd_old: "Ancien mot de passe",
    sec_pwd_new: "Nouveau mot de passe",
    sec_pwd_confirm: "Confirmer le nouveau mot de passe",
    sec_pwd_btn: "METTRE À JOUR LE MOT DE PASSE",

    sec_delete_title: "SUPPRESSION DU COMPTE",
    sec_delete_text:
      "Cette action anonymisera vos données et désactivera votre compte de façon permanente conformément au RGPD.",
    sec_delete_btn: "Supprimer mon compte",
    sec_delete_confirm:
      "Êtes-vous absolument sûr ? Cette action est irréversible.",

    //Alertes (Swal) lors de la suppression de compte
    delete_confirm_1: "Supprimer le compte ?",
    delete_confirm_2:
      "Dernier avertissement : tes photos et données seront définitivement anonymisées.",
    delete_btn_confirm: "Oui, supprimer !",
    nav_cancel: "Annuler",
    delete_farewell_title: "Adieu !",
    delete_success: "Ton compte a été anonymisé avec succès.",
    delete_error_title: "Erreur",
    delete_error_text: "Une erreur est survenue lors de la suppression.",

    //#endregion

    //#region ChatModal
    chat_private: "Conversation privée",
    chat_credits: " Crédit(s)",
    chat_no_credits: "Solde épuisé",
    chat_waiting_trans: "🕒 En attente de traduction...",
    chat_no_messages: "Aucun message. Envoyez le premier message !",
    chat_placeholder: "Écrivez votre message...",
    chat_placeholder_blocked:
      "Vous n'avez plus de crédits pour envoyer un message...",
    chat_send_btn: "Envoyer",
    chat_blocked_btn: "Bloqué",
    chat_alert_empty:
      "Votre solde est épuisé. Rechargez vos crédits pour poursuivre cette belle rencontre.",
    chat_shop_btn: "Boutique",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "Mon Espace Privé",
    db_welcome: "Bienvenue,",
    db_subtitle: "Voici votre tableau de bord exclusif.",
    db_tab_messages: "Ma Messagerie",
    db_tab_profile: "Mon Profil",
    db_tab_security: "Sécurité",
    db_section_convs: "Mes Conversations",
    db_no_messages: "Vous n'avez pas encore de messages.",
    db_contact_hint:
      "Contactez un membre depuis son profil pour démarrer une discussion !",
    db_view_profile: "Voir son profil",
    db_reply: "→ Répondre",
    db_badge_new: "NOUVEAU",

    // Profil & Galerie
    db_profile_intro:
      "Voici vos informations personnelles visibles par les hommes :",
    db_my_info: "Mes Informations Personnelles *",
    db_gallery: "Ma Galerie Photo",
    db_no_photos: "Aucune photo ajoutée pour le moment.",
    db_label_pseudo: "Pseudo",
    db_label_marital: "Statut Marital",
    db_label_children: "Enfants",
    db_label_religion: "Religion",
    db_label_interests: "Centres d'intérêt",
    db_contact_admin:
      "* Pour toute modification de donnée sur votre profil, contactez l'administrateur du site au 06XXXXXX ou par mail  admin@admin.com",

    // Sécurité
    db_sec_title: "Sécurité du compte",
    db_sec_email: "Email de connexion",
    db_sec_change_pwd: "Changer le mot de passe",
    db_sec_old_pwd: "Ancien mot de passe",
    db_sec_new_pwd: "Nouveau mot de passe",
    db_sec_conf_pwd: "Confirmer le nouveau mot de passe",
    db_sec_btn: "METTRE À JOUR LE MOT DE PASSE",

    // Alertes (Swal)
    db_alert_error_title: "Oups...",
    db_alert_pwd_mismatch: "Les mots de passe ne correspondent pas",
    db_alert_pwd_success: "Mot de passe mis à jour !",
    db_alert_del_title: "Supprimer la conversation ?",
    db_alert_del_text:
      "Tous les messages avec ce contact seront effacés définitivement.",
    db_alert_del_confirm: "Oui, supprimer",
    db_alert_del_cancel: "Annuler",
    db_alert_deleted: "Supprimé !",
    //#endregion
  },

  //#endregion FRANCAIS

  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- ANGLAIS --------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region ANGLAIS

  en: {
    //#region DATABASE EN
    database: {
      // Sexe
      male: "Male",
      female: "Female",

      // État civil
      single: "Single",
      divorced: "Divorced",
      widowed: "Widowed",
      free_couple: "Open relationship",

      // Religion
      aucune: "None",
      catholique: "Catholic",
      orthodoxe: "Orthodox",
      protestant: "Protestant",
      buddhist: "Buddhist",
      hindoue: "Hindu",
      judaique: "Jewish",
      islam: "Islam",
      atheist: "Atheist",
      spiritual_but_not_religious: "Spiritual but not religious",
      other: "Other",

      // Pays
      france: "🇫🇷 France",
      germany: "🇩🇪 Germany",
      italy: "🇮🇹 Italy",
      spain: "🇪🇸 Spain",
      united_kingdom: "🇬🇧 United Kingdom",
      belgium: "🇧🇪 Belgium",
      switzerland: "🇨🇭 Switzerland",
      china: "🇨🇳 China",
      japan: "🇯🇵 Japan",
      russia: "🇷🇺 Russia",
      thailand: "🇹🇭 Thailand",
      vietnam: "🇻🇳 Vietnam",
    },
    //#endregion

    //#region GLOBAL EN
    age_suffix: "years old",
    loading_profiles: "Loading profiles...",
    members_unit: "Members",
    save: "Save",
    saved: "Saved",
    delete: "Delete",
    deleted: "Deleted !",
    cancel: "Cancel",
    error: "Error",
    error_occured: "An error has occurred.",
    //#endregion GLOBAL EN

    //#region NAVBAR EN
    nav_home: "Home",
    nav_members: "Members",
    nav_dashboard: "Dashboard",
    nav_shop: "Shop",
    nav_logout: "LOGOUT",
    nav_login: "LOGIN",
    nav_register: "SIGN UP",
    //#endregion NAVBAR EN

    //#region PRESENTATION-PAGE EN
    //#region Chargement EN
    loading_universe: "Loading the Rebel Refine universe...",
    //#endregion

    //#region Alertes EN
    alert_gallery_title: "Gallery Access",
    alert_gallery_text:
      "To access the member gallery, profiles, and messaging, you must log in.",
    alert_gallery_confirm: "Login",
    alert_gallery_cancel: "Cancel",
    //#endregion

    //#region Banner Slider EN
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "Dare the Orient, Live the Unforgettable.",
    banner_1_desc:
      "Meet authentic women seeking a modern European man. A bridge between two worlds, built on respect.",
    banner_1_btn: "START THE ADVENTURE",

    banner_2_subtitle: "The Meeting of Two Worlds.",
    banner_2_desc:
      "Discover authentic and refined female profiles, selected for a demanding man seeking a serious story.",
    banner_2_btn: "CREATE THE LINK",
    //#endregion

    //#region Section Règles EN
    rules_title: "Our Community",
    rules_highlight: "Rules",

    // Règle 1
    rule_men_title: "Gentlemen's Access",
    rule_men_title: "Gentlemen's Access",
    rule_men_desc_part1: "Register freely and enjoy",
    rule_men_desc_highlight: "5 free credits",
    rule_men_desc_part2: "to start your first exchanges today.",

    // Règle 2
    rule_women_title: "Ladies' Selection",
    rule_women_desc:
      "For security reasons, female profiles are validated and registered exclusively by the administrator.",
    rule_women_contact: "Contact: admin@yoursite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "Human Translation",
    rule_trans_desc_part1: "Communicate without limits. Your messages are",
    rule_trans_desc_highlight: "translated by qualified translators",
    rule_trans_desc_part2: "to ensure total fluidity in your exchanges.",

    // Règle 4
    rule_kind_title: "Benevolent Spirit",
    rule_kind_desc_part1: "A space based on",
    rule_kind_desc_highlight1: "mutual respect",
    rule_kind_desc_part2: " dedicated to people seeking",
    rule_kind_desc_highlight2: "authentic, sincere",
    rule_kind_desc_part3: "and",
    rule_kind_desc_highlight3: "lasting connections.",

    // Argument Final
    rule_flex_title: "Freedom & Flexibility",
    rule_flex_desc:
      "No monthly subscription. Once your welcome credits are used, top up your account as needed via our secure packages.",
    //#endregion

    //#region Section Membres EN
    members_title: "Our new",
    members_highlight: "members",
    members_subtitle: "Here are the latest profiles to join Rebel Refine.",
    members_btn: "Discover all members",
    years_old: "years old",
    //#endregion

    //#region Section Concept EN
    concept_title: "Who is our",
    concept_highlight: "Circle for",
    concept_serenity_title: "Serenity & Security",
    concept_serenity_desc:
      "Verified profiles for an authentic and protected experience.",
    concept_exclu_title: "Exclusivity",
    concept_exclu_desc:
      "A privileged interaction reserved for authenticated members.",
    //#endregion

    //#region Footer EN
    footer_ready: "Ready to take the plunge?",
    footer_register: "Create my profile",
    footer_login: "Login",
    //#endregion

    //#endregion PRESENTATION-PAGE EN

    //#region REGISTER-PAGE EN
    register_subtitle: "Join the exclusive group",
    register_form_title: "Create an account",
    register_success:
      "Registration successful! A confirmation link has been sent to your email.",
    register_error_generic: "Error during registration",
    register_error_password: "Passwords do not match",

    register_label_gender: "You are:",
    register_gender_male: "a MAN",
    register_gender_female: "a WOMAN",

    register_label_country: "Country/Native language:",
    register_country_placeholder: "-- Choose your country --",

    register_label_nickname: "Nickname",
    register_nickname_placeholder: "How should we call you?",

    register_label_email: "Your prestigious email address",
    register_label_password: "Password",
    register_label_confirm: "Confirm Password",

    register_btn_submit: "BECOME A MEMBER",
    register_footer_text: "Already part of the group?",
    register_footer_link: "Log in",

    // Female Modal EN
    register_modal_title: "SECURE REGISTRATION",
    register_modal_text:
      "To ensure the exclusivity and security of our group, female profile registrations are managed directly by our administration team.",
    register_modal_contact: "Contact us by email or phone",
    register_modal_btn_back: "BACK",
    //#endregion REGISTER-PAGE EN

    //#region LOGIN-PAGE EN
    login_subtitle: "Find your ideal partner",
    login_error_invalid: "Invalid credentials",
    login_success_verified:
      "Account verified successfully! Welcome to Rebel Refine.",

    login_label_email: "Email",
    login_label_password: "Password",
    login_forgot_password: "Forgot Password?",
    login_btn_submit: "LOG IN",

    login_footer_no_account: "Don't have an account yet?",
    login_footer_register_link: "Register now for free by clicking HERE",

    // Modal Recovery EN
    login_modal_title: "Account Recovery",
    login_modal_label: "Enter your email address:",
    login_modal_btn_send: "Send link",
    login_modal_sending: "Sending...",
    //#endregion LOGIN-PAGE EN

    //#region HOME-PAGE EN
    home_welcome_back: "Nice to see you again,",
    home_adventurer: "Adventurer",
    home_subtitle: "Your ideal partner is just a click away.",
    home_search_title: "I am looking for a woman",
    home_search_from: "From...",
    home_search_to: "To...",
    home_btn_search: "Find my partner",

    // New Members Section EN
    home_new_members_title: "Our newest members",
    home_new_members_desc:
      "Here are the latest profiles to join Rebel Refine. Take the first step!",
    home_btn_discover_all: "Discover all members",
    home_favorite_error: "Unable to update favorite.",

    // Stats Section EN
    home_stats_title: "It all starts with a meeting",
    home_stats_desc:
      "Join a growing community and access thousands of profiles.",
    home_stat_total: "Total Members",
    home_stat_online: "Members Online",
    home_stat_males: "Males Online",
    home_stat_females: "Femmes Online",
    //#endregion HOME-PAGE EN

    //#region SEARCH-PAGE EN
    search_results_title: "Search",
    search_results_subtitle: "results:",
    search_btn_discover: "VIEW PROFILE",
    search_no_results: "No profiles match your criteria.",
    //#endregion SEARCH-PAGE EN

    //#region MEMBERS-PAGE EN
    members_title_female: "All our female members",
    //#endregion MEMBERS-PAGE EN

    //#region PROFILE-PAGE EN
    profile_age_label: "Age:",
    profile_gallery_title: "My Photo Gallery",
    profile_no_photo: "No photos in the gallery.",
    profile_about_title: "About & Details",
    profile_no_description: "No description provided.",
    // Détails techniques
    profile_status: "Status",
    profile_country: "Country",
    profile_children: "Children",
    profile_religion: "Religion",
    //Memos
    profile_memo_title: "PRIVATE MEMO",
    profile_memo_placeholder: "Write your note about this member...",
    profile_memo_save_success: "Your memo has been updated.",
    profile_memo_delete_confirm: "Delete note?",
    profile_memo_delete_warning: "This action cannot be undone.",
    //Messages / Crédits
    profile_msg_confirm_title: "Are you sure?",
    profile_msg_confirm_text: "This will cost 1 credit.",
    profile_msg_send_btn: "Yes, Send!",
    profile_msg_sent_success: "Sent!",
    profile_msg_remaining_credits: "Remaining credits: {{count}}",
    //#endregion

    //#region PROFILE MALE EN
    view_profile_back: "Back to Dashboard",
    view_profile_loading: "Loading private profile...",
    view_profile_other_info: "Other Information",
    view_profile_birthdate: "Birthdate:",
    view_profile_country: "Country",
    view_profile_status: "Marital Status",
    view_profile_children: "Children",
    view_profile_religion: "Religion",
    view_profile_about: "About",
    view_profile_no_desc: "No description available.",
    view_profile_reply: "Reply to",
    view_profile_error_title: "Oops!",
    view_profile_not_found: "Not specified",
    //#endregion

    //#region CREDITSHOP EN
    shop_title: "Top up your",
    shop_title_gold: "Credits",
    shop_subtitle:
      "Choose the plan that suits you best to continue your exchanges.",
    shop_pack_credits: "Credits",
    shop_pack_button: "Select this pack",
    shop_error_login: "You must be logged in",
    shop_error_payment_title: "Payment impossible",
    shop_error_init: "Error during payment initialization",
    // Packs
    pack_decouverte: "Discovery",
    pack_passion: "Passion",
    pack_elite: "Elite",
    //#endregion

    //#region RESETPASSWORD EN
    reset_title: "New Password",
    reset_subtitle: "Choose a strong password to secure your account.",
    reset_label: "PASSWORD",
    reset_btn: "VALIDATE CHANGE",
    reset_success:
      "Success! Your password has been updated.\nAutomatic redirection to the login page...",
    reset_error_default: "An error has occurred.",
    //#endregion

    //#region PAYMENTSUCCESS EN
    payment_success_swal_title: "Payment validated!",
    payment_processing_title: "Processing your order...",
    //#endregion

    //#region TRANSLATOR DASHBOARD EN
    translator_main_title: "Moderation & Translation Space",
    translator_empty_state: "No pending messages. Everything is up to date!",
    translator_label_source: "Source message",
    translator_label_translation: "Translation",
    translator_placeholder: "Enter translation here... ",
    translator_btn_send: "Validate and Send",
    translator_success_title: "Translation validated",
    translator_success_msg: "The message has been sent successfully.",
    translator_error_empty: "Please enter a translation before validating.",
    //#endregion

    //#region DASHBOARD EN
    //BEFORE RENDER
    // Dashboard
    db_loading: "Loading your profile...",
    db_error_load: "Connection error: unable to retrieve your data.",
    db_update_success_title: "Profile updated!",
    db_update_success_text: "Your changes have been saved successfully.",
    db_update_error: "An error occurred.",
    db_net_error: "Unable to reach the server.",
    db_pwd_mismatch: "Passwords do not match.",
    db_pwd_success_title: "Password updated!",
    db_pwd_success_text: "Your password has been successfully updated.",
    db_photo_del_error: "Error during deletion",
    // Messaging & Credits
    msg_confirm_title: "Are you sure?",
    msg_confirm_text: "This will cost you 1 credit.",
    msg_confirm_btn: "Yes, Send!",
    msg_sent_title: "Sent!",
    msg_credits_left: "Remaining credits: ",
    msg_del_conv_title: "Delete conversation?",
    msg_del_conv_text:
      "All messages with this contact will be permanently deleted.",
    msg_del_confirm_btn: "Yes, delete",
    msg_del_cancel_btn: "Cancel",
    msg_del_success: "Deleted!",

    //AFTER RENDER
    // Navigation & Header
    db_title: "My Dashboard",
    db_welcome: "Welcome,",
    db_balance: "Your balance:",
    db_credits: "Credits",
    db_nav_title: "Navigation",
    db_tab_infos: "My Information",
    db_tab_msg: "My Messages",
    db_tab_favs: "My Favorites",
    db_tab_purchases: "My Purchases",
    db_tab_security: "Security",

    // Profile & Gallery
    db_edit_btn: "Edit my info",
    db_gallery_title: "My Photo Gallery",
    db_not_set: "Not specified",
    db_label_pseudo: "Username",
    db_label_email: "Email (read-only)",
    db_label_country: "Country (read-only)",
    db_label_birth: "Date of Birth",
    db_label_marital: "Marital Status",
    db_label_children: "Children",
    db_label_religion: "Religion / Spirituality",
    db_label_interests: "My Bio & Interests",

    // Options Select
    opts_choose: "Choose...",
    opts_single: "Single",
    opts_divorced: "Divorced",
    opts_widowed: "Widowed",
    opts_free_couple: "Free couple",
    opts_none: "None",
    opts_child_1: "1 child",
    opts_child_2: "2 children",
    opts_child_3: "3 children",
    opts_child_4: "4 children",
    opts_child_5plus: "5 or more children",
    opts_religion: "Spiritual but not religious",
    opts_religion_other: "other",

    // Boutons
    btn_save: "SAVE CHANGES",
    btn_cancel: "CANCEL",

    // SweetAlert (Rappel du message précédent)
    msg_sent_title: "Success!",
    msg_credits_left: "Remaining credits:",

    // Messaging
    msg_title: "My Conversations",
    msg_empty: "You don't have any messages yet.",
    msg_empty_sub: "Contact a member from their profile to start a discussion!",
    msg_user_default: "User",
    msg_view_profile: "View profile",
    msg_badge_new: "NEW",
    msg_reply: "→ Reply",
    msg_delete_title: "Delete conversation",

    // Favorites
    fav_title: "My Favorites",
    fav_count: "members",
    fav_view_btn: "View profile",

    // Purchases / History
    buy_title: "Top-up History",
    buy_count: "transactions",
    buy_added: "credits",
    buy_date_prefix: "On",
    buy_status_ok: "Completed",
    buy_empty: "You haven't made any purchases yet.",

    // Security
    sec_title: "Account Security",
    sec_email_label: "Login Email",
    sec_pref_title: "Sending Preferences",
    sec_pref_confirm: "Confirm before sending a message",
    sec_pwd_change_title: "Change Password",
    sec_pwd_old: "Old Password",
    sec_pwd_new: "New Password",
    sec_pwd_confirm: "Confirm New Password",
    sec_pwd_btn: "UPDATE PASSWORD",
    sec_delete_title: "ACCOUNT DELETION",
    sec_delete_text:
      "This action will anonymize your data and permanently deactivate your account in compliance with GDPR.",
    sec_delete_btn: "Delete my account",
    sec_delete_confirm:
      "Are you absolutely sure? This action cannot be undone.",

    //Alertes (Swal) lors de la suppression
    delete_confirm_1: "Delete account?",
    delete_confirm_2:
      "Final warning: your photos and data will be permanently anonymized.",
    delete_btn_confirm: "Yes, delete it!",
    nav_cancel: "Cancel",
    delete_farewell_title: "Farewell!",
    delete_success: "Your account has been successfully anonymized.",
    delete_error_title: "Error",
    delete_error_text: "An error occurred during deletion.",

    //#endregion

    //#region ChatModal
    chat_private: "Private conversation",
    chat_credits: "Credit(s)",
    chat_no_credits: "Balance exhausted",
    chat_waiting_trans: "🕒 Waiting for translation...",
    chat_no_messages: "No messages yet. Send the first message!",
    chat_placeholder: "Write your message...",
    chat_placeholder_blocked: "You have no credits left to send a message...",
    chat_send_btn: "Send",
    chat_blocked_btn: "Blocked",
    chat_alert_empty:
      "Your balance is empty. Top up your credits to continue this beautiful encounter.",
    chat_shop_btn: "Shop",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "My Private Space",
    db_welcome: "Welcome,",
    db_subtitle: "Here is your exclusive dashboard.",
    db_tab_messages: "My Messages",
    db_tab_profile: "My Profile",
    db_tab_security: "Security",
    db_section_convs: "My Conversations",
    db_no_messages: "You don't have any messages yet.",
    db_contact_hint:
      "Contact a member from their profile to start a discussion!",
    db_view_profile: "View profile",
    db_reply: "→ Reply",
    db_badge_new: "NEW",

    // Profile & Gallery
    db_profile_intro:
      "Here is your personal information as seen by men visiting your profile:",
    db_my_info: "My Personal Information *",
    db_gallery: "My Photo Gallery",
    db_no_photos: "No photos added yet.",
    db_label_pseudo: "Nickname",
    db_label_marital: "Marital Status",
    db_label_children: "Children",
    db_label_religion: "Religion",
    db_label_interests: "Interests",
    db_contact_admin:
      "* For any changes to the information on your profile, please contact the site administrator at 06XXXXXX or by email at admin@admin.com",

    // Security
    db_sec_title: "Account Security",
    db_sec_email: "Login Email",
    db_sec_change_pwd: "Change Password",
    db_sec_old_pwd: "Old Password",
    db_sec_new_pwd: "New Password",
    db_sec_conf_pwd: "Confirm New Password",
    db_sec_btn: "UPDATE PASSWORD",

    // Alerts (Swal)
    db_alert_error_title: "Oops...",
    db_alert_pwd_mismatch: "Passwords do not match",
    db_alert_pwd_success: "Password updated successfully!",
    db_alert_del_title: "Delete conversation?",
    db_alert_del_text:
      "All messages with this contact will be permanently deleted.",
    db_alert_del_confirm: "Yes, delete it",
    db_alert_del_cancel: "Cancel",
    db_alert_deleted: "Deleted!",

    // Loader & Fallbacks
    db_loading: "Loading your space...",
    db_error_load: "Unable to load your information. Please try again.",
    db_not_set: "Not specified",

    //#endregion
  },

  //#endregion ANGLAIS

  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- ALLEMAND --------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region ALLEMAND
  de: {
    //#region DATABASE
    database: {
      // Sexe
      male: "Mann",
      female: "Frau",

      // État civil
      single: "Ledig",
      divorced: "Geschieden",
      widowed: "Verwitwet",
      free_couple: "Offene Beziehung",

      // Religion
      aucune: "Keine",
      catholique: "Katholisch",
      orthodoxe: "Orthodox",
      protestant: "Protestantisch",
      buddhist: "Buddhistisch",
      hindoue: "Hinduistisch",
      judaique: "Jüdisch",
      islam: "Islam",
      atheist: "Atheist",
      spiritual_but_not_religious: "Spirituell, aber nicht religiös",
      other: "Andere",

      // Pays
      france: "🇫🇷 Frankreich",
      germany: "🇩🇪 Deutschland",
      italy: "🇮🇹 Italien",
      spain: "🇪🇸 Spanien",
      united_kingdom: "🇬🇧 England",
      belgium: "🇧🇪 Belgien",
      switzerland: "🇨🇭 Schweiz",
      china: "🇨🇳 China",
      japan: "🇯🇵 Japan",
      russia: "🇷🇺 Russland",
      thailand: "🇹🇭 Thailand",
      vietnam: "🇻🇳 Vietnam",
    },
    //#endregion

    //#region GLOBAL
    age_suffix: "Jahre ",
    loading_profiles: "Profile werden geladen...",
    members_unit: "Mitglieder",
    save: "Speichern",
    saved: "Gespeichert",
    delete: "Löschen",
    deleted: "Gelöscht!",
    cancel: "Abbrechen",
    error: "Fehler",
    error_occured: "Ein Fehler ist aufgetreten.",
    //#endregion

    //#region NAVBAR
    nav_home: "Startseite",
    nav_members: "Mitglieder",
    nav_dashboard: "Dashboard",
    nav_shop: "Shop",
    nav_logout: "ABMELDEN",
    nav_login: "ANMELDEN",
    nav_register: "REGISTRIEREN",
    //#endregion NAVBAR

    //#region PRESENTATION-PAGE
    //#region Chargement
    loading_universe: "Das Rebel Refine Universum wird geladen...",
    //#endregion

    //#region Alertes (SweetAlert)
    alert_gallery_title: "Zugang zur Galerie",
    alert_gallery_text:
      "Um auf die Mitgliedergalerie, die Profile und das Nachrichtensystem zuzugreifen, müssen Sie sich anmelden.",
    alert_gallery_confirm: "Anmelden",
    alert_gallery_cancel: "Abbrechen",
    //#endregion

    //#region Banner Slider
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "Wagen Sie den Orient, erleben Sie das Unvergessliche.",
    banner_1_desc:
      "Treffen Sie authentische Frauen, die einen modernen europäischen Mann suchen. Eine Brücke zwischen zwei Welten, gebaut auf Respekt.",
    banner_1_btn: "DAS ABENTEUER STARTEN",

    banner_2_subtitle: "Der Treffpunkt zweier Welten.",
    banner_2_desc:
      "Entdecken Sie authentische und raffinierte Frauenprofile, ausgewählt für den anspruchsvollen Mann auf der Suche nach einer ernsthaften Geschichte.",
    banner_2_btn: "VERBINDUNG AUFBAUEN",
    //#endregion

    //#region Section Règles
    rules_title: "Die Regeln unserer",
    rules_highlight: "Gemeinschaft",

    // Règle 1
    rule_men_title: "Zugang für Herren",
    rule_men_desc_part1: "Registrieren Sie sich kostenlos und genießen Sie",
    rule_men_desc_highlight: "5 Gratis-Credits",
    rule_men_desc_part2: "um noch heute Ihre ersten Gespräche zu beginnen.",

    // Règle 2
    rule_women_title: "Damen-Auswahl",
    rule_women_desc:
      "Aus Sicherheitsgründen werden weibliche Profile ausschließlich durch den Administrator validiert und registriert.",
    rule_women_contact: "Kontakt: admin@tonsite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "Menschliche Übersetzung",
    rule_trans_desc_part1:
      "Kommunizieren Sie grenzenlos. Ihre Nachrichten werden",
    rule_trans_desc_highlight: "von qualifizierten Übersetzern übersetzt",
    rule_trans_desc_part2: "um einen reibungslosen Austausch zu garantieren.",

    // Règle 4
    rule_kind_title: "Wohlwollender Geist",
    rule_kind_desc_part1: "Ein Raum basierend auf",
    rule_kind_desc_highlight1: "gegenseitigem Respekt",
    rule_kind_desc_part2: " für Menschen, die nach Verbindungen suchen, die",
    rule_kind_desc_highlight2: "authentisch, aufrichtig",
    rule_kind_desc_part3: "und",
    rule_kind_desc_highlight3: "beständig sind.",

    // Argument final
    rule_flex_title: "Freiheit & Flexibilität",
    rule_flex_desc:
      "Kein monatliches Abonnement. Sobald Ihre Willkommens-Credits aufgebraucht sind, laden Sie Ihr Konto nach Bedarf auf.",
    //#endregion

    //#region Section Membres
    members_title: "Unsere neuen",
    members_highlight: "Mitglieder",
    members_subtitle:
      "Hier sind die neuesten Profile, die Rebel Refine beigetreten sind.",
    members_btn: "Alle Mitglieder entdecken",
    years_old: "Jahre",
    //#endregion

    //#region Section Concept
    concept_title: "An wen richtet sich unser",
    concept_highlight: "Kreis",
    concept_serenity_title: "Gelassenheit & Sicherheit",
    concept_serenity_desc:
      "Verifizierte Profile für ein authentisches und geschütztes Erlebnis.",
    concept_exclu_title: "Exklusivität",
    concept_exclu_desc:
      "Eine privilegierte Interaktion, die authentifizierten Mitgliedern vorbehalten ist.",
    //#endregion

    //#region Footer
    footer_ready: "Bereit für den nächsten Schritt?",
    footer_register: "Mein Profil erstellen",
    footer_login: "Anmelden",
    //#endregion

    //#endregion PRESENTATION-PAGE

    //#region REGISTER-PAGE
    register_subtitle: "Treten Sie der exklusiven Gruppe bei",
    register_form_title: "Konto erstellen",
    register_success:
      "Registrierung erfolgreich! Ein Bestätigungslink wurde Ihnen per E-Mail gesendet.",
    register_error_generic: "Fehler bei der Registrierung",
    register_error_password: "Die Passwörter stimmen nicht überein",

    register_label_gender: "Sie sind:",
    register_gender_male: "ein MANN",
    register_gender_female: "eine FRAU",

    register_label_country: "Herkunftsland/-sprache:",
    register_country_placeholder: "-- Wählen Sie Ihr Land --",

    register_label_nickname: "Benutzername",
    register_nickname_placeholder: "Wie sollen wir Sie nennen?",

    register_label_email: "Ihre prestigeträchtige E-Mail-Adresse",
    register_label_password: "Passwort",
    register_label_confirm: "Bestätigung",

    register_btn_submit: "MITGLIED WERDEN",
    register_footer_text: "Bereits Teil der Gruppe?",
    register_footer_link: "Anmelden",

    // Modale Contact Administration
    register_modal_title: "SICHERE REGISTRIERUNG",
    register_modal_text:
      "Um die Exklusivität und Sicherheit unserer Gruppe zu gewährleisten, wird die Registrierung weiblicher Profile direkt von unserem Administratorenteam verwaltet.",
    register_modal_contact: "Kontaktieren Sie uns per E-Mail oder Telefon",
    register_modal_btn_back: "ZURÜCK",
    //#endregion REGISTER-PAGE

    //#region LOGIN-PAGE
    login_subtitle: "Finden Sie Ihren idealen Partner",
    login_error_invalid: "Ungültige Anmeldedaten",
    login_success_verified:
      "Konto erfolgreich verifiziert! Willkommen bei Rebel Refine.",

    login_label_email: "E-Mail",
    login_label_password: "Passwort",
    login_forgot_password: "Passwort vergessen?",
    login_btn_submit: "ANMELDEN",

    login_footer_no_account: "Noch kein Konto?",
    login_footer_register_link:
      "Registrieren Sie sich jetzt kostenlos, indem Sie HIER klicken",

    // Modal Récupération
    login_modal_title: "Kontowiederherstellung",
    login_modal_label: "Geben Sie Ihre E-Mail-Adresse ein:",
    login_modal_btn_send: "Link senden",
    login_modal_sending: "Wird gesendet...",
    //#endregion LOGIN-PAGE

    //#region HOME-PAGE
    home_welcome_back: "Schön Sie wiederzusehen,",
    home_adventurer: "Abenteurer",
    home_subtitle: "Ihr idealer Partner ist nur einen Klick entfernt.",
    home_search_title: "Ich suche eine Frau",
    home_search_from: "Von...",
    home_search_to: "Bis...",
    home_btn_search: "Meinen Partner finden",

    // Section Nouveaux Membres
    home_new_members_title: "Unsere neuen Mitglieder",
    home_new_members_desc:
      "Hier sind die neuesten Profile, die Rebel Refine beigetreten sind. Machen Sie den ersten Schritt!",
    home_btn_discover_all: "Alle Mitglieder entdecken",
    home_favorite_error: "Favorit konnte nicht aktualisiert werden.",

    // Section Stats (About)
    home_stats_title: "Alles beginnt mit einer Begegnung",
    home_stats_desc:
      "Treten Sie einer wachsenden Gemeinschaft bei und greifen Sie auf Tausende von Profilen zu.",
    home_stat_total: "Mitglieder insgesamt",
    home_stat_online: "Mitglieder online",
    home_stat_males: "Männer online",
    home_stat_females: "Frauen online",
    //#endregion

    //#region SEARCH-PAGE
    search_results_title: "Ergebnisse",
    search_results_subtitle: "der Suche:",
    search_btn_discover: "PROFIL ENTDECKEN",
    search_no_results: "Kein Profil entspricht Ihren Kriterien.",
    //#endregion SEARCH-PAGE

    //#region MEMBERS-PAGE
    members_title_female: "Alle unsere weiblichen Mitglieder",
    //#endregion

    //#region PROFILE-PAGE
    profile_age_label: "Alter:",
    profile_gallery_title: "Meine Fotogalerie",
    profile_no_photo: "Keine Fotos in der Galerie.",
    profile_about_title: "Über mich & Details",
    profile_no_description: "Keine Beschreibung angegeben.",
    // Détails techniques
    profile_status: "Situation",
    profile_country: "Land",
    profile_children: "Kinder",
    profile_religion: "Religion",
    // Mémo
    profile_memo_title: "PRIVATES MEMO",
    profile_memo_placeholder: "Schreibe deine Notiz über dieses Mitglied...",
    profile_memo_save_success: "Dein Memo wurde aktualisiert.",
    profile_memo_delete_confirm: "Notiz löschen?",
    profile_memo_delete_warning:
      "Diese Aktion kann nicht rückgängig gemacht werden.",
    // Messages / Crédits
    profile_msg_confirm_title: "Sind Sie sicher?",
    profile_msg_confirm_text: "Dies kostet Sie 1 Credit.",
    profile_msg_send_btn: "Ja, Senden!",
    profile_msg_sent_success: "Gesendet!",
    profile_msg_remaining_credits: "Verbleibende Credits: {{count}}",
    //#endregion

    //#region PROFILE MALE
    view_profile_back: "Zurück zum Dashboard",
    view_profile_loading: "Privates Profil wird geladen...",
    view_profile_other_info: "Weitere Informationen",
    view_profile_birthdate: "Geburtsdatum:",
    view_profile_country: "Land",
    view_profile_status: "Familienstand",
    view_profile_children: "Kinder",
    view_profile_religion: "Religion",
    view_profile_about: "Über mich",
    view_profile_no_desc: "Keine Beschreibung.",
    view_profile_reply: "Antworten an",
    view_profile_error_title: "Hoppla!",
    view_profile_not_found: "Profil nicht ausgefüllt",
    //#endregion

    //#region CREDITSHOP
    shop_title: "Laden Sie Ihre",
    shop_title_gold: "Credits auf",
    shop_subtitle:
      "Wählen Sie das Paket, das zu Ihnen passt, um Ihre Gespräche fortzusetzen.",
    shop_pack_credits: "Credits",
    shop_pack_button: "Dieses Paket wählen",
    shop_error_login: "Sie müssen angemeldet sein",
    shop_error_payment_title: "Zahlung nicht möglich",
    shop_error_init: "Fehler bei der Initialisierung der Zahlung",
    // Packs
    pack_decouverte: "Entdeckung",
    pack_passion: "Leidenschaft",
    pack_elite: "Elite",
    //#endregion

    //#region RESETPASSWORD
    reset_title: "Neues Passwort",
    reset_subtitle: "Wählen Sie ein starkes Passwort, um Ihr Konto zu sichern.",
    reset_label: "PASSWORT",
    reset_btn: "ÄNDERUNG BESTÄTIGEN",
    reset_success:
      "Erfolg! Ihr Passwort wurde aktualisiert.\nAutomatische Weiterleitung zur Anmeldeseite...",
    reset_error_default: "Ein Fehler ist aufgetreten.",
    //#endregion

    //#region PAYMENT SUCCESS
    payment_success_swal_title: "Zahlung bestätigt!",
    payment_processing_title: "Ihre Bestellung wird bearbeitet...",
    //#endregion

    //#region TRANSLATORDASHBOARD
    translator_main_title: "Moderations- & Übersetzungsbereich",
    translator_empty_state: "Keine ausstehenden Nachrichten. Alles aktuell!",
    translator_label_source: "Quellnachricht",
    translator_label_translation: "Übersetzung",
    translator_placeholder: "Übersetzung hier eingeben...",
    translator_btn_send: "Validieren und Senden",
    translator_success_title: "Übersetzung bestätigt",
    translator_success_msg: "Die Nachricht wurde erfolgreich gesendet.",
    translator_error_empty:
      "Bitte geben Sie eine Übersetzung ein, bevor Sie bestätigen.",
    //#endregion

    //#region DASHBOARD
    //BEFORE RENDER
    db_loading: "Ihr Profil wird geladen...",
    db_error_load:
      "Verbindungsfehler: Ihre Daten konnten nicht abgerufen werden.",
    db_update_success_title: "Profil aktualisiert!",
    db_update_success_text: "Ihre Änderungen wurden erfolgreich gespeichert.",
    db_update_error: "Ein Fehler ist aufgetreten.",
    db_net_error: "Server nicht erreichbar.",
    db_pwd_mismatch: "Die Passwörter stimmen nicht überein.",
    db_pwd_success_title: "Passwort aktualisiert!",
    db_pwd_success_text: "Ihr Passwort wurde erfolgreich aktualisiert.",
    db_photo_del_error: "Fehler beim Löschen",
    // Messagerie & Crédits
    msg_confirm_title: "Sind Sie sicher?",
    msg_confirm_text: "Dies kostet Sie 1 Credit.",
    msg_confirm_btn: "Ja, Senden!",
    msg_sent_title: "Gesendet!",
    msg_credits_left: "Verbleibende Credits: ",
    msg_del_conv_title: "Gespräch löschen?",
    msg_del_conv_text:
      "Alle Nachrichten mit diesem Kontakt werden dauerhaft gelöscht.",
    msg_del_confirm_btn: "Ja, löschen",
    msg_del_cancel_btn: "Abbrechen",
    msg_del_success: "Gelöscht!",

    //AFTER RENDER
    db_title: "Mein Dashboard",
    db_welcome: "Willkommen,",
    db_balance: "Ihr Guthaben:",
    db_credits: "Credits",
    db_nav_title: "Navigation",
    db_tab_infos: "Meine Informationen",
    db_tab_msg: "Meine Nachrichten",
    db_tab_favs: "Meine Favoriten",
    db_tab_purchases: "Meine Käufe",
    db_tab_security: "Sicherheit",

    // Profil & Galerie
    db_edit_btn: "Infos bearbeiten",
    db_gallery_title: "Meine Fotogalerie",
    db_not_set: "Nicht angegeben",
    db_label_pseudo: "Benutzername",
    db_label_email: "E-Mail (nicht änderbar)",
    db_label_country: "Land (nicht änderbar)",
    db_label_birth: "Geburtsdatum",
    db_label_marital: "Familienstand",
    db_label_children: "Kinder",
    db_label_religion: "Religion / Spiritualiät",
    db_label_interests: "Meine Vorstellung & Interessen",

    // Options Select
    opts_choose: "Wählen...",
    opts_single: "Ledig",
    opts_divorced: "Geschieden",
    opts_widowed: "Verwitwet",
    opts_free_couple: "Offene Beziehung",
    opts_none: "Keine",
    opts_child_1: "1 Kind",
    opts_child_2: "2 Kinder",
    opts_child_3: "3 Kinder",
    opts_child_4: "4 Kinder",
    opts_child_5plus: "5 oder mehr Kinder",
    opts_religion: "Spirituell, aber nicht religiös",
    opts_religion_other: "Andere",

    // Boutons
    btn_save: "SPEICHERN",
    btn_cancel: "ABBRECHEN",

    // Messagerie
    msg_title: "Meine Gespräche",
    msg_empty: "Sie haben noch keine Nachrichten.",
    msg_empty_sub:
      "Kontaktieren Sie ein Mitglied über sein Profil, um ein Gespräch zu beginnen!",
    msg_user_default: "Benutzer",
    msg_view_profile: "Profil ansehen",
    msg_badge_new: "NEU",
    msg_reply: "→ Antworten",
    msg_delete_title: "Gespräch löschen",

    // Favoris
    fav_title: "Meine Favoriten",
    fav_count: "Mitglieder",
    fav_view_btn: "Profil ansehen",

    // Achats / Historique
    buy_title: "Kaufhistorie",
    buy_count: "Transaktionen",
    buy_added: "Credits",
    buy_date_prefix: "Am",
    buy_status_ok: "Akzeptiert",
    buy_empty: "Sie haben noch keine Käufe getätigt.",

    // Sécurité
    sec_title: "Kontosicherheit",
    sec_email_label: "Anmelde-E-Mail",
    sec_pref_title: "Versandeinstellungen",
    sec_pref_confirm: "Vor dem Senden einer Nachricht bestätigen",
    sec_pwd_change_title: "Passwort ändern",
    sec_pwd_old: "Altes Passwort",
    sec_pwd_new: "Neues Passwort",
    sec_pwd_confirm: "Neues Passwort bestätigen",
    sec_pwd_btn: "PASSWORT AKTUALISIEREN",

    sec_delete_title: "KONTO LÖSCHEN",
    sec_delete_text:
      "Diese Aktion wird Ihre Daten anonymisieren und Ihr Konto gemäß DSGVO dauerhaft deaktivieren.",
    sec_delete_btn: "Mein Konto löschen",
    sec_delete_confirm:
      "Sind Sie absolut sicher? Diese Aktion kann nicht rückgängig gemacht werden.",

    //Alertes (Swal) lors de la suppression de compte
    delete_confirm_1: "Konto löschen?",
    delete_confirm_2:
      "Letzte Warnung: Deine Fotos und Daten werden dauerhaft anonymisiert.",
    delete_btn_confirm: "Ja, löschen!",
    nav_cancel: "Abbrechen",
    delete_farewell_title: "Leb wohl!",
    delete_success: "Dein Konto wurde erfolgreich anonymisiert.",
    delete_error_title: "Fehler",
    delete_error_text: "Beim Löschen ist ein Fehler aufgetreten.",

    //#endregion

    //#region ChatModal
    chat_private: "Privates Gespräch",
    chat_credits: " Credit(s)",
    chat_no_credits: "Guthaben erschöpft",
    chat_waiting_trans: "🕒 Warten auf Übersetzung...",
    chat_no_messages: "Keine Nachrichten. Sende die erste Nachricht!",
    chat_placeholder: "Schreibe deine Nachricht...",
    chat_placeholder_blocked:
      "Du hast keine Credits mehr, um eine Nachricht zu senden...",
    chat_send_btn: "Senden",
    chat_blocked_btn: "Blockiert",
    chat_alert_empty:
      "Dein Guthaben ist erschöpft. Lade deine Credits auf, um diese schöne Begegnung fortzusetzen.",
    chat_shop_btn: "Shop",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "Mein privater Bereich",
    db_welcome: "Willkommen,",
    db_subtitle: "Hier ist Ihr exklusives Dashboard.",
    db_tab_messages: "Meine Nachrichten",
    db_tab_profile: "Mein Profil",
    db_tab_security: "Sicherheit",
    db_section_convs: "Meine Gespräche",
    db_no_messages: "Sie haben noch keine Nachrichten.",
    db_contact_hint:
      "Kontaktieren Sie ein Mitglied über sein Profil, um ein Gespräch zu beginnen!",
    db_view_profile: "Profil ansehen",
    db_reply: "→ Antworten",
    db_badge_new: "NEU",

    // Profil & Galerie
    db_profile_intro:
      "Hier sind Ihre persönlichen Informationen, die für Männer sichtbar sind:",
    db_my_info: "Meine persönlichen Informationen *",
    db_gallery: "Meine Fotogalerie",
    db_no_photos: "Noch keine Fotos hinzugefügt.",
    db_label_pseudo: "Benutzername",
    db_label_marital: "Familienstand",
    db_label_children: "Kinder",
    db_label_religion: "Religion",
    db_label_interests: "Interessen",
    db_contact_admin:
      "* Für Änderungen an Ihrem Profil kontaktieren Sie den Administrator unter 06XXXXXX oder per E-Mail admin@admin.com",

    // Sécurité
    db_sec_title: "Kontosicherheit",
    db_sec_email: "Anmelde-E-Mail",
    db_sec_change_pwd: "Passwort ändern",
    db_sec_old_pwd: "Altes Passwort",
    db_sec_new_pwd: "Neues Passwort",
    db_sec_conf_pwd: "Neues Passwort bestätigen",
    db_sec_btn: "PASSWORT AKTUALISIEREN",

    // Alertes (Swal)
    db_alert_error_title: "Hoppla...",
    db_alert_pwd_mismatch: "Die Passwörter stimmen nicht überein",
    db_alert_pwd_success: "Passwort aktualisiert!",
    db_alert_del_title: "Gespräch löschen?",
    db_alert_del_text:
      "Alle Nachrichten mit diesem Kontakt werden dauerhaft gelöscht.",
    db_alert_del_confirm: "Ja, löschen",
    db_alert_del_cancel: "Abbrechen",
    db_alert_deleted: "Gelöscht!",
    //#endregion
  },
  //#endregion

  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- CHINOIS --------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region CHINOIS
  zh: {
    //#region DATABASE
    database: {
      // Sexe
      male: "男士",
      female: "女士",

      // État civil
      single: "单身",
      divorced: "离异",
      widowed: "丧偶",
      free_couple: "开放式关系",

      // Religion
      aucune: "无",
      catholique: "天主教",
      orthodoxe: "东正教",
      protestant: "新教",
      buddhist: "佛教",
      hindoue: "印度教",
      judaique: "犹太教",
      islam: "伊斯兰教",
      atheist: "无神论者",
      spiritual_but_not_religious: "有灵性但无宗教信仰",
      other: "其他",

      // Pays
      france: "🇫🇷 法国",
      germany: "🇩🇪 德国",
      italy: "🇮🇹 意大利",
      spain: "🇪🇸 西班牙",
      united_kingdom: "🇬🇧 英国",
      belgium: "🇧🇪 比利时",
      switzerland: "🇨🇭 瑞士",
      china: "🇨🇳 中国",
      japan: "🇯🇵 日本",
      russia: "🇷🇺 俄罗斯",
      thailand: "🇹🇭 泰国",
      vietnam: "🇻🇳 越南",
    },
    //#endregion

    //#region GLOBAL
    age_suffix: "岁 ",
    loading_profiles: "个人资料加载中...",
    members_unit: "会员",
    save: "保存",
    saved: "已保存",
    delete: "删除",
    deleted: "已删除！",
    cancel: "取消",
    error: "错误",
    error_occured: "发生了一个错误。",
    //#endregion

    //#region NAVBAR
    nav_home: "首页",
    nav_members: "会员",
    nav_dashboard: "控制面板",
    nav_shop: "商店",
    nav_logout: "退出登录",
    nav_login: "登录",
    nav_register: "注册",
    //#endregion NAVBAR

    //#region PRESENTATION-PAGE
    //#region Chargement
    loading_universe: "正在加载 Rebel Refine 世界...",
    //#endregion

    //#region Alertes (SweetAlert)
    alert_gallery_title: "访问相册",
    alert_gallery_text: "要访问会员相册、个人资料和消息系统，您必须先登录。",
    alert_gallery_confirm: "登录",
    alert_gallery_cancel: "取消",
    //#endregion

    //#region Banner Slider
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "勇闯东方，体验难忘。",
    banner_1_desc:
      "遇见寻求现代欧洲男性的真实女性。在尊重的基础上搭建两个世界之间的桥梁。",
    banner_1_btn: "开始冒险",

    banner_2_subtitle: "两个世界的交汇点。",
    banner_2_desc: "为追求严肃故事的高标准男性，发现真实而精致的女性个人资料。",
    banner_2_btn: "建立联系",
    //#endregion

    //#region Section Règles
    rules_title: "我们的社区",
    rules_highlight: "规则",

    // Règle 1
    rule_men_title: "男士加入",
    rule_men_desc_part1: "免费注册并享受",
    rule_men_desc_highlight: "赠送的 5 个积分",
    rule_men_desc_part2: "从今天开始您的第一次交流。",

    // Règle 2
    rule_women_title: "女士筛选",
    rule_women_desc: "出于安全考虑，女性资料仅由管理员进行验证和注册。",
    rule_women_contact: "联系方式：admin@tonsite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "人工翻译",
    rule_trans_desc_part1: "沟通无国界。您的消息将由",
    rule_trans_desc_highlight: "资深翻译人员翻译",
    rule_trans_desc_part2: "以确保交流的完全流畅。",

    // Règle 4
    rule_kind_title: "友善精神",
    rule_kind_desc_part1: "一个建立在",
    rule_kind_desc_highlight1: "相互尊重",
    rule_kind_desc_part2: " 基础上的空间，致力于寻找",
    rule_kind_desc_highlight2: "真实、真诚",
    rule_kind_desc_part3: "且",
    rule_kind_desc_highlight3: "持久联系的人群。",

    // Argument final
    rule_flex_title: "自由与灵活",
    rule_flex_desc: "无每月订阅。欢迎积分用完后，根据您的需求为账户充值。",
    //#endregion

    //#region Section Membres
    members_title: "我们的新",
    members_highlight: "会员",
    members_subtitle: "以下是最新加入 Rebel Refine 的会员资料。",
    members_btn: "发现所有会员",
    years_old: "岁",
    //#endregion

    //#region Section Concept
    concept_title: "我们的圈子",
    concept_highlight: "面向人群",
    concept_serenity_title: "宁静与安全",
    concept_serenity_desc: "经过验证的个人资料，提供真实且受保护的体验。",
    concept_exclu_title: "专属特权",
    concept_exclu_desc: "仅限经过身份验证的会员享有的特权互动。",
    //#endregion

    //#region Footer
    footer_ready: "准备好迈出这一步了吗？",
    footer_register: "创建我的资料",
    footer_login: "登录",
    //#endregion

    //#endregion PRESENTATION-PAGE

    //#region REGISTER-PAGE
    register_subtitle: "加入专属群体",
    register_form_title: "创建账户",
    register_success: "注册成功！确认链接已发送至您的电子邮箱。",
    register_error_generic: "注册时出错",
    register_error_password: "密码不匹配",

    register_label_gender: "您是：",
    register_gender_male: "男士",
    register_gender_female: "女士",

    register_label_country: "原籍国/语言：",
    register_country_placeholder: "-- 选择您的国家 --",

    register_label_nickname: "昵称",
    register_nickname_placeholder: "我们该如何称呼您？",

    register_label_email: "您的电子邮箱",
    register_label_password: "密码",
    register_label_confirm: "确认密码",

    register_btn_submit: "成为会员",
    register_footer_text: "已经是该群体的一员？",
    register_footer_link: "登录",

    // Modale Contact Administration
    register_modal_title: "安全注册",
    register_modal_text:
      "为确保我们群体的专属地位和安全性，女性资料的注册由我们的管理团队直接处理。",
    register_modal_contact: "通过邮件或电话联系我们",
    register_modal_btn_back: "返回",
    //#endregion REGISTER-PAGE

    //#region LOGIN-PAGE
    login_subtitle: "寻找您的理想伴侣",
    login_error_invalid: "凭据不正确",
    login_success_verified: "账户验证成功！欢迎来到 Rebel Refine。",

    login_label_email: "电子邮箱",
    login_label_password: "密码",
    login_forgot_password: "忘记密码？",
    login_btn_submit: "登录",

    login_footer_no_account: "还没有账户？",
    login_footer_register_link: "点击此处立即免费注册",

    // Modal Récupération
    login_modal_title: "找回账户",
    login_modal_label: "输入您的电子邮箱：",
    login_modal_btn_send: "发送链接",
    login_modal_sending: "正在发送...",
    //#endregion LOGIN-PAGE

    //#region HOME-PAGE
    home_welcome_back: "很高兴再次见到您，",
    home_adventurer: "冒险家",
    home_subtitle: "您的理想伴侣只需轻轻一点。",
    home_search_title: "我正在寻找一位女性",
    home_search_from: "从...",
    home_search_to: "到...",
    home_btn_search: "寻找我的伴侣",

    // Section Nouveaux Membres
    home_new_members_title: "我们的新会员",
    home_new_members_desc: "以下是最新加入 Rebel Refine 的会员。迈出第一步吧！",
    home_btn_discover_all: "发现所有会员",
    home_favorite_error: "无法更新收藏。",

    // Section Stats (About)
    home_stats_title: "一切始于一次相遇",
    home_stats_desc: "加入不断壮大的社区，访问数以千计的个人资料。",
    home_stat_total: "会员总数",
    home_stat_online: "在线会员",
    home_stat_males: "在线男士",
    home_stat_females: "在线女士",
    //#endregion

    //#region SEARCH-PAGE
    search_results_title: "搜索",
    search_results_subtitle: "结果：",
    search_btn_discover: "查看个人资料",
    search_no_results: "没有符合您标准的资料。",
    //#endregion SEARCH-PAGE

    //#region MEMBERS-PAGE
    members_title_female: "我们所有的女性会员",
    //#endregion

    //#region PROFILE-PAGE
    profile_age_label: "年龄：",
    profile_gallery_title: "我的相册",
    profile_no_photo: "相册中暂无照片。",
    profile_about_title: "关于我与详情",
    profile_no_description: "未填写描述。",
    // Détails techniques
    profile_status: "现状",
    profile_country: "国家",
    profile_children: "子女",
    profile_religion: "宗教信仰",
    // Mémo
    profile_memo_title: "私人备忘录",
    profile_memo_placeholder: "写下关于该会员的笔记...",
    profile_memo_save_success: "您的备忘录已更新。",
    profile_memo_delete_confirm: "删除笔记？",
    profile_memo_delete_warning: "此操作不可逆。",
    // Messages / Crédits
    profile_msg_confirm_title: "您确定吗？",
    profile_msg_confirm_text: "这将消耗您 1 个积分。",
    profile_msg_send_btn: "是的，发送！",
    profile_msg_sent_success: "已发送！",
    profile_msg_remaining_credits: "剩余积分：{{count}}",
    //#endregion

    //#region PROFILE MALE
    view_profile_back: "返回控制面板",
    view_profile_loading: "私人资料加载中...",
    view_profile_other_info: "其他信息",
    view_profile_birthdate: "出生日期：",
    view_profile_country: "国家",
    view_profile_status: "婚姻状况",
    view_profile_children: "子女",
    view_profile_religion: "宗教信仰",
    view_profile_about: "关于我",
    view_profile_no_desc: "暂无描述。",
    view_profile_reply: "回复",
    view_profile_error_title: "噢！",
    view_profile_not_found: "资料未填写",
    //#endregion

    //#region CREDITSHOP
    shop_title: "充值您的",
    shop_title_gold: "积分",
    shop_subtitle: "选择适合您的方案以继续交流。",
    shop_pack_credits: "积分",
    shop_pack_button: "选择此套餐",
    shop_error_login: "您必须先登录",
    shop_error_payment_title: "无法付款",
    shop_error_init: "初始化付款时出错",
    // Packs
    pack_decouverte: "探索版",
    pack_passion: "激情版",
    pack_elite: "精英版",
    //#endregion

    //#region RESETPASSWORD
    reset_title: "新密码",
    reset_subtitle: "选择一个强密码以保护您的账户。",
    reset_label: "密码",
    reset_btn: "确认更改",
    reset_success: "成功！您的密码已更新。\n正在自动跳转到登录页面...",
    reset_error_default: "发生了一个错误。",
    //#endregion

    //#region PAYMENT SUCCESS
    payment_success_swal_title: "付款已确认！",
    payment_processing_title: "正在处理您的订单...",
    //#endregion

    //#region TRANSLATORDASHBOARD
    translator_main_title: "审核与翻译空间",
    translator_empty_state: "暂无待处理消息。全部已更新！",
    translator_label_source: "源消息",
    translator_label_translation: "翻译",
    translator_placeholder: "在此输入翻译...",
    translator_btn_send: "验证并发送",
    translator_success_title: "翻译已确认",
    translator_success_msg: "消息已成功发送。",
    translator_error_empty: "请在确认前输入翻译。",
    //#endregion

    //#region DASHBOARD
    //BEFORE RENDER
    db_loading: "正在加载您的个人资料...",
    db_error_load: "连接错误：无法检索您的数据。",
    db_update_success_title: "资料已更新！",
    db_update_success_text: "您的更改已成功保存。",
    db_update_error: "发生了一个错误。",
    db_net_error: "无法连接到服务器。",
    db_pwd_mismatch: "密码不匹配。",
    db_pwd_success_title: "密码已更新！",
    db_pwd_success_text: "您的密码已成功更新。",
    db_photo_del_error: "删除时出错",
    // Messagerie & Crédits
    msg_confirm_title: "您确定吗？",
    msg_confirm_text: "这将消耗您 1 个积分。",
    msg_confirm_btn: "是的，发送！",
    msg_sent_title: "已发送！",
    msg_credits_left: "剩余积分：",
    msg_del_conv_title: "删除对话？",
    msg_del_conv_text: "与此联系人的所有消息将被永久删除。",
    msg_del_confirm_btn: "是的，删除",
    msg_del_cancel_btn: "取消",
    msg_del_success: "已删除！",

    //AFTER RENDER
    db_title: "我的控制面板",
    db_welcome: "欢迎，",
    db_balance: "您的余额：",
    db_credits: "积分",
    db_nav_title: "导航",
    db_tab_infos: "我的信息",
    db_tab_msg: "我的消息",
    db_tab_favs: "我的收藏",
    db_tab_purchases: "我的购买",
    db_tab_security: "安全",

    // Profil & Galerie
    db_edit_btn: "编辑我的信息",
    db_gallery_title: "我的相册",
    db_not_set: "未填写",
    db_label_pseudo: "昵称",
    db_label_email: "电子邮箱（不可修改）",
    db_label_country: "国家（不可修改）",
    db_label_birth: "出生日期",
    db_label_marital: "婚姻状况",
    db_label_children: "子女",
    db_label_religion: "宗教 / 灵性",
    db_label_interests: "我的介绍与兴趣",

    // Options Select
    opts_choose: "选择...",
    opts_single: "单身",
    opts_divorced: "离异",
    opts_widowed: "丧偶",
    opts_free_couple: "开放式关系",
    opts_none: "无",
    opts_child_1: "1 个孩子",
    opts_child_2: "2 个孩子",
    opts_child_3: "3 个孩子",
    opts_child_4: "4 个孩子",
    opts_child_5plus: "5 个或更多孩子",
    opts_religion: "有灵性但无宗教信仰",
    opts_religion_other: "其他",

    // Boutons
    btn_save: "保存",
    btn_cancel: "取消",

    // Messagerie
    msg_title: "我的对话",
    msg_empty: "您还没有任何消息。",
    msg_empty_sub: "从会员的个人资料中联系他们以开始对话！",
    msg_user_default: "用户",
    msg_view_profile: "查看资料",
    msg_badge_new: "新消息",
    msg_reply: "→ 回复",
    msg_delete_title: "删除对话",

    // Favoris
    fav_title: "我的收藏",
    fav_count: "会员",
    fav_view_btn: "查看个人资料",

    // Achats / Historique
    buy_title: "购买记录",
    buy_count: "交易",
    buy_added: "积分",
    buy_date_prefix: "于",
    buy_status_ok: "已接受",
    buy_empty: "您还没有进行过任何购买。",

    // Sécurité
    sec_title: "账户安全",
    sec_email_label: "登录邮箱",
    sec_pref_title: "发送偏好",
    sec_pref_confirm: "发送消息前确认",
    sec_pwd_change_title: "更改密码",
    sec_pwd_old: "旧密码",
    sec_pwd_new: "新密码",
    sec_pwd_confirm: "确认新密码",
    sec_pwd_btn: "更新密码",

    sec_delete_title: "注销账户",
    sec_delete_text:
      "此操作将根据 GDPR 对您的数据进行匿名处理并永久停用您的账户。",
    sec_delete_btn: "注销我的账户",
    sec_delete_confirm: "您绝对确定吗？此操作不可逆。",

    //Alertes (Swal) lors de la suppression de compte
    delete_confirm_1: "注销账户？",
    delete_confirm_2: "最后警告：您的照片和数据将被永久匿名化。",
    delete_btn_confirm: "是的，注销！",
    nav_cancel: "取消",
    delete_farewell_title: "再见！",
    delete_success: "您的账户已成功匿名化。",
    delete_error_title: "错误",
    delete_error_text: "注销时发生错误。",

    //#endregion

    //#region ChatModal
    chat_private: "私人对话",
    chat_credits: " 积分",
    chat_no_credits: "余额不足",
    chat_waiting_trans: "🕒 等待翻译中...",
    chat_no_messages: "暂无消息。发送第一条消息吧！",
    chat_placeholder: "输入您的消息...",
    chat_placeholder_blocked: "您已无积分发送消息...",
    chat_send_btn: "发送",
    chat_blocked_btn: "已屏蔽",
    chat_alert_empty: "您的余额已用完。请充值积分以继续这段美好的相遇。",
    chat_shop_btn: "商店",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "我的私人空间",
    db_welcome: "欢迎，",
    db_subtitle: "这是您的专属控制面板。",
    db_tab_messages: "我的消息",
    db_tab_profile: "我的资料",
    db_tab_security: "安全",
    db_section_convs: "我的对话",
    db_no_messages: "您还没有任何消息。",
    db_contact_hint: "从会员的个人资料中联系他们以开始对话！",
    db_view_profile: "查看资料",
    db_reply: "→ 回复",
    db_badge_new: "新消息",

    // Profil & Galerie
    db_profile_intro: "以下是男士可见的您的个人信息：",
    db_my_info: "我的个人信息 *",
    db_gallery: "我的相册",
    db_no_photos: "目前未添加任何照片。",
    db_label_pseudo: "昵称",
    db_label_marital: "婚姻状况",
    db_label_children: "子女",
    db_label_religion: "宗教信仰",
    db_label_interests: "兴趣爱好",
    db_contact_admin:
      "* 如需修改您的资料信息，请拨打 06XXXXXX 或发送邮件至 admin@admin.com 联系管理员",

    // Sécurité
    db_sec_title: "账户安全",
    db_sec_email: "登录邮箱",
    db_sec_change_pwd: "更改密码",
    db_sec_old_pwd: "旧密码",
    db_sec_new_pwd: "新密码",
    db_sec_conf_pwd: "确认新密码",
    db_sec_btn: "更新密码",

    // Alertes (Swal)
    db_alert_error_title: "噢...",
    db_alert_pwd_mismatch: "密码不匹配",
    db_alert_pwd_success: "密码已更新！",
    db_alert_del_title: "删除对话？",
    db_alert_del_text: "与此联系人的所有消息将被永久删除。",
    db_alert_del_confirm: "是的，删除",
    db_alert_del_cancel: "取消",
    db_alert_deleted: "已删除！",
    //#endregion
  },

  //#endregion

  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- ITALIEN --------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region Italian
  it: {
    //#region DATABASE
    database: {
      // Sexe
      male: "Uomo",
      female: "Donna",

      // État civil
      single: "Celibe/Nubile",
      divorced: "Divorziato/a",
      widowed: "Vedovo/a",
      free_couple: "Coppia aperta",

      // Religion
      aucune: "Nessuna",
      catholique: "Cattolica",
      orthodoxe: "Ortodossa",
      protestant: "Protestante",
      buddhist: "Buddista",
      hindoue: "Induista",
      judaique: "Ebraica",
      islam: "Islam",
      atheist: "Ateo",
      spiritual_but_not_religious: "Spirituale ma non religioso",
      other: "Altro",

      // Pays
      france: "🇫🇷 Francia",
      germany: "🇩🇪 Germania",
      italy: "🇮🇹 Italia",
      spain: "🇪🇸 Spagna",
      united_kingdom: "🇬🇧 Inghilterra",
      belgium: "🇧🇪 Belgio",
      switzerland: "🇨🇭 Svizzera",
      china: "🇨🇳 Cina",
      japan: "🇯🇵 Giappone",
      russia: "🇷🇺 Russia",
      thailand: "🇹🇭 Thailandia",
      vietnam: "🇻🇳 Vietnam",
    },
    //#endregion

    //#region GLOBAL
    age_suffix: "anni ",
    loading_profiles: "Caricamento profili...",
    members_unit: "Membri",
    save: "Salva",
    saved: "Salvato",
    delete: "Elimina",
    deleted: "Eliminato!",
    cancel: "Annulla",
    error: "Errore",
    error_occured: "Si è verificato un errore.",
    //#endregion

    //#region NAVBAR
    nav_home: "Home",
    nav_members: "Membri",
    nav_dashboard: "Dashboard",
    nav_shop: "Negozio",
    nav_logout: "DISCONNESSIONE",
    nav_login: "ACCEDI",
    nav_register: "ISCRIVITI",
    //#endregion NAVBAR

    //#region PRESENTATION-PAGE
    //#region Chargement
    loading_universe: "Caricamento dell'universo Rebel Refine...",
    //#endregion

    //#region Alertes (SweetAlert)
    alert_gallery_title: "Accesso Galleria",
    alert_gallery_text:
      "Per accedere alla galleria dei membri, ai profili e alla messaggistica, devi effettuare l'accesso.",
    alert_gallery_confirm: "Accedi",
    alert_gallery_cancel: "Annulla",
    //#endregion

    //#region Banner Slider
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "Osa l'Oriente, vivi l'indimenticabile.",
    banner_1_desc:
      "Incontra donne autentiche in cerca di un uomo europeo moderno. Un ponte tra due mondi, costruito sul rispetto.",
    banner_1_btn: "INIZIA L'AVVENTURA",

    banner_2_subtitle: "L'incontro di due mondi.",
    banner_2_desc:
      "Scopri profili femminili autentici e raffinati, selezionati per un uomo esigente in cerca di una storia seria.",
    banner_2_btn: "CREA IL LEGAME",
    //#endregion

    //#region Section Règles
    rules_title: "Le Regole della nostra",
    rules_highlight: "Comunità",

    // Règle 1
    rule_men_title: "Accesso Signori",
    rule_men_desc_part1: "Iscriviti liberamente e approfitta di",
    rule_men_desc_highlight: "5 crediti omaggio",
    rule_men_desc_part2: "per iniziare i tuoi primi scambi oggi stesso.",

    // Règle 2
    rule_women_title: "Selezione Signore",
    rule_women_desc:
      "Per motivi di sicurezza, i profili femminili sono convalidati e registrati esclusivamente dall'amministratore.",
    rule_women_contact: "Contatto: admin@tonsite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "Traduzione umana",
    rule_trans_desc_part1: "Comunica senza limiti. I tuoi messaggi sono",
    rule_trans_desc_highlight: "tradotti da traduttori qualificati",
    rule_trans_desc_part2: "per garantire una fluidità totale nei tuoi scambi.",

    // Règle 4
    rule_kind_title: "Spirito Benevolo",
    rule_kind_desc_part1: "Uno spazio fondato sul",
    rule_kind_desc_highlight1: "rispetto reciproco",
    rule_kind_desc_part2: " dedicato a persone che cercano connessioni",
    rule_kind_desc_highlight2: "autentiche, sincere",
    rule_kind_desc_part3: "e",
    rule_kind_desc_highlight3: "durature.",

    // Argument final
    rule_flex_title: "Libertà & Flessibilità",
    rule_flex_desc:
      "Nessun abbonamento mensile. Una volta esauriti i crediti di benvenuto, ricarica il tuo account secondo le tue necessità.",
    //#endregion

    //#region Section Membres
    members_title: "I nostri nuovi",
    members_highlight: "membri",
    members_subtitle:
      "Ecco gli ultimi profili che si sono uniti a Rebel Refine.",
    members_btn: "Scopri tutti i membri",
    years_old: "anni",
    //#endregion

    //#region Section Concept
    concept_title: "A chi si rivolge il nostro",
    concept_highlight: "Cerchio",
    concept_serenity_title: "Serenità & Sicurezza",
    concept_serenity_desc:
      "Profili verificati per un'esperienza autentica e protetta.",
    concept_exclu_title: "Esclusività",
    concept_exclu_desc:
      "Un'interazione privilegiata riservata ai membri autenticati.",
    //#endregion

    //#region Footer
    footer_ready: "Pronto a fare il passo?",
    footer_register: "Crea il mio profilo",
    footer_login: "Accedi",
    //#endregion

    //#endregion PRESENTATION-PAGE

    //#region REGISTER-PAGE
    register_subtitle: "Unisciti al gruppo esclusivo",
    register_form_title: "Crea un account",
    register_success:
      "Iscrizione riuscita! Un link di conferma è stato inviato via email.",
    register_error_generic: "Errore durante l'iscrizione",
    register_error_password: "Le password non corrispondono",

    register_label_gender: "Sei:",
    register_gender_male: "un UOMO",
    register_gender_female: "una DONNA",

    register_label_country: "Paese/Lingua di origine:",
    register_country_placeholder: "-- Scegli il tuo paese --",

    register_label_nickname: "Nickname",
    register_nickname_placeholder: "Come dovremmo chiamarti?",

    register_label_email: "Il tuo indirizzo email di prestigio",
    register_label_password: "Password",
    register_label_confirm: "Conferma",

    register_btn_submit: "DIVENTA MEMBRO",
    register_footer_text: "Fai già parte del gruppo?",
    register_footer_link: "Accedi",

    // Modale Contact Administration
    register_modal_title: "ISCRIZIONE SICURA",
    register_modal_text:
      "Per garantire l'esclusività e la sicurezza del nostro gruppo, l'iscrizione dei profili femminili è gestita direttamente dal nostro team di amministrazione.",
    register_modal_contact: "Contattaci via mail o telefono",
    register_modal_btn_back: "INDIETRO",
    //#endregion REGISTER-PAGE

    //#region LOGIN-PAGE
    login_subtitle: "Trova il tuo partner ideale",
    login_error_invalid: "Credenziali non corrette",
    login_success_verified:
      "Account verificato con successo! Benvenuto in Rebel Refine.",

    login_label_email: "Email",
    login_label_password: "Password",
    login_forgot_password: "Password dimenticata?",
    login_btn_submit: "ACCEDI",

    login_footer_no_account: "Non hai ancora un account?",
    login_footer_register_link: "Iscriviti ora gratuitamente cliccando QUI",

    // Modal Récupération
    login_modal_title: "Recupero account",
    login_modal_label: "Inserisci il tuo indirizzo email:",
    login_modal_btn_send: "Invia link",
    login_modal_sending: "Invio in corso...",
    //#endregion LOGIN-PAGE

    //#region HOME-PAGE
    home_welcome_back: "Lieto di rivederti,",
    home_adventurer: "Avventuriero",
    home_subtitle: "Il tuo partner ideale è a un solo clic di distanza.",
    home_search_title: "Cerco una donna",
    home_search_from: "Da...",
    home_search_to: "A...",
    home_btn_search: "Trova il mio partner",

    // Section Nouveaux Membres
    home_new_members_title: "I nostri nuovi membri",
    home_new_members_desc:
      "Ecco gli ultimi profili che si sono uniti a Rebel Refine. Fai il primo passo!",
    home_btn_discover_all: "Scopri tutte le iscritte",
    home_favorite_error: "Impossibile aggiornare i preferiti.",

    // Section Stats (About)
    home_stats_title: "Tutto inizia con un incontro",
    home_stats_desc:
      "Unisciti a una comunità in crescita e accedi a migliaia di profili.",
    home_stat_total: "Membri Totali",
    home_stat_online: "Membri online",
    home_stat_males: "Uomini online",
    home_stat_females: "Donne online",
    //#endregion

    //#region SEARCH-PAGE
    search_results_title: "Risultati",
    search_results_subtitle: "della ricerca:",
    search_btn_discover: "SCOPRI IL PROFILO",
    search_no_results: "Nessun profilo corrisponde ai tuoi criteri.",
    //#endregion SEARCH-PAGE

    //#region MEMBERS-PAGE
    members_title_female: "Tutti i nostri membri femminili",
    //#endregion

    //#region PROFILE-PAGE
    profile_age_label: "Età:",
    profile_gallery_title: "La mia Galleria Foto",
    profile_no_photo: "Nessuna foto nella galleria.",
    profile_about_title: "Informazioni e Dettagli",
    profile_no_description: "Nessuna descrizione inserita.",
    // Détails techniques
    profile_status: "Situazione",
    profile_country: "Paese",
    profile_children: "Figli",
    profile_religion: "Religione",
    // Mémo
    profile_memo_title: "MEMO PRIVATO",
    profile_memo_placeholder: "Scrivi la tua nota su questo membro...",
    profile_memo_save_success: "Il tuo memo è stato aggiornato.",
    profile_memo_delete_confirm: "Eliminare la nota?",
    profile_memo_delete_warning: "Questa azione è irreversibile.",
    // Messages / Crédits
    profile_msg_confirm_title: "Sei sicuro?",
    profile_msg_confirm_text: "Ti costerà 1 credito.",
    profile_msg_send_btn: "Sì, Invia!",
    profile_msg_sent_success: "Inviato!",
    profile_msg_remaining_credits: "Crediti rimanenti: {{count}}",
    //#endregion

    //#region PROFILE MALE
    view_profile_back: "Torna alla Dashboard",
    view_profile_loading: "Caricamento profilo privato...",
    view_profile_other_info: "Altre Informazioni",
    view_profile_birthdate: "Data di nascita:",
    view_profile_country: "Paese",
    view_profile_status: "Stato Civile",
    view_profile_children: "Figli",
    view_profile_religion: "Religione",
    view_profile_about: "Informazioni",
    view_profile_no_desc: "Nessuna descrizione.",
    view_profile_reply: "Rispondi a",
    view_profile_error_title: "Ops!",
    view_profile_not_found: "Profilo non compilato",
    //#endregion

    //#region CREDITSHOP
    shop_title: "Ricarica i tuoi",
    shop_title_gold: "Crediti",
    shop_subtitle:
      "Scegli la formula più adatta a te per continuare i tuoi scambi.",
    shop_pack_credits: "Crediti",
    shop_pack_button: "Scegli questo pack",
    shop_error_login: "Devi essere collegato",
    shop_error_payment_title: "Pagamento impossibile",
    shop_error_init: "Errore durante l'inizializzazione del pagamento",
    // Packs
    pack_decouverte: "Scoperta",
    pack_passion: "Passione",
    pack_elite: "Elite",
    //#endregion

    //#region RESETPASSWORD
    reset_title: "Nuova password",
    reset_subtitle:
      "Scegli una password robusta per proteggere il tuo account.",
    reset_label: "PASSWORD",
    reset_btn: "VALIDA IL CAMBIAMENTO",
    reset_success:
      "Successo! La tua password è stata aggiornata.\nReindirizzamento automatico alla pagina di login...",
    reset_error_default: "Si è verificato un errore.",
    //#endregion

    //#region PAYMENT SUCCESS
    payment_success_swal_title: "Pagamento convalidato!",
    payment_processing_title: "Elaborazione del tuo ordine...",
    //#endregion

    //#region TRANSLATORDASHBOARD
    translator_main_title: "Area Moderazione & Traduzione",
    translator_empty_state: "Nessun messaggio in attesa. Tutto aggiornato!",
    translator_label_source: "Messaggio sorgente",
    translator_label_translation: "Traduzione",
    translator_placeholder: "Inserisci qui la traduzione...",
    translator_btn_send: "Valida e Invia",
    translator_success_title: "Traduzione convalidata",
    translator_success_msg: "Il messaggio è stato inviato con successo.",
    translator_error_empty: "Inserisci una traduzione prima di convalidare.",
    //#endregion

    //#region DASHBOARD
    //BEFORE RENDER
    db_loading: "Caricamento del tuo profilo...",
    db_error_load: "Errore di connessione: impossibile recuperare i tuoi dati.",
    db_update_success_title: "Profilo aggiornato!",
    db_update_success_text: "Le tue modifiche sono state salvate con successo.",
    db_update_error: "Si è verificato un errore.",
    db_net_error: "Impossibile raggiungere il server.",
    db_pwd_mismatch: "Le password non corrispondono.",
    db_pwd_success_title: "Password aggiornata!",
    db_pwd_success_text: "La tua password è stata aggiornata correttamente.",
    db_photo_del_error: "Errore durante l'eliminazione",
    // Messagerie & Crédits
    msg_confirm_title: "Sei sicuro?",
    msg_confirm_text: "Ti costerà 1 credito.",
    msg_confirm_btn: "Sì, Invia!",
    msg_sent_title: "Inviato!",
    msg_credits_left: "Crediti rimanenti: ",
    msg_del_conv_title: "Eliminare la conversazione?",
    msg_del_conv_text:
      "Tutti i messaggi con questo contatto saranno cancellati definitivamente.",
    msg_del_confirm_btn: "Sì, elimina",
    msg_del_cancel_btn: "Annulla",
    msg_del_success: "Eliminato!",

    //AFTER RENDER
    db_title: "La mia Dashboard",
    db_welcome: "Benvenuto,",
    db_balance: "Il tuo saldo :",
    db_credits: "Crediti",
    db_nav_title: "Navigazione",
    db_tab_infos: "Le mie Informazioni",
    db_tab_msg: "La mia Messaggistica",
    db_tab_favs: "I miei Preferiti",
    db_tab_purchases: "I miei Acquisti",
    db_tab_security: "Sicurezza",

    // Profil & Galerie
    db_edit_btn: "Modifica le mie info",
    db_gallery_title: "La mia Galleria Foto",
    db_not_set: "Non inserito",
    db_label_pseudo: "Nickname",
    db_label_email: "Email (non modificabile)",
    db_label_country: "Paese (non modificabile)",
    db_label_birth: "Data di nascita",
    db_label_marital: "Stato Civile",
    db_label_children: "Figli",
    db_label_religion: "Religione / Spiritualità",
    db_label_interests: "La mia Presentazione & Interessi",

    // Options Select
    opts_choose: "Scegli...",
    opts_single: "Celibe/Nubile",
    opts_divorced: "Divorziato/a",
    opts_widowed: "Vedovo/a",
    opts_free_couple: "Coppia aperta",
    opts_none: "Nessuno",
    opts_child_1: "1 figlio",
    opts_child_2: "2 figli",
    opts_child_3: "3 figli",
    opts_child_4: "4 figli",
    opts_child_5plus: "5 o più figli",
    opts_religion: "Spirituale ma non religioso",
    opts_religion_other: "Altro",

    // Boutons
    btn_save: "SALVA",
    btn_cancel: "ANNULLA",

    // Messagerie
    msg_title: "Le mie Conversazioni",
    msg_empty: "Non hai ancora messaggi.",
    msg_empty_sub:
      "Contatta un membro dal suo profilo per iniziare una discussione!",
    msg_user_default: "Utente",
    msg_view_profile: "Vedi il suo profilo",
    msg_badge_new: "NUOVO",
    msg_reply: "→ Rispondi",
    msg_delete_title: "Elimina la conversazione",

    // Favoris
    fav_title: "I miei Colpi di Fulmine",
    fav_count: "membri",
    fav_view_btn: "Vedi il profilo",

    // Achats / Historique
    buy_title: "Cronologia dei miei acquisti",
    buy_count: "transazioni",
    buy_added: "crediti",
    buy_date_prefix: "Il",
    buy_status_ok: "Accettato",
    buy_empty: "Non hai ancora effettuato acquisti.",

    // Sécurité
    sec_title: "Sicurezza dell'account",
    sec_email_label: "Email di accesso",
    sec_pref_title: "Preferenze di invio",
    sec_pref_confirm: "Conferma prima di inviare un messaggio",
    sec_pwd_change_title: "Cambia la password",
    sec_pwd_old: "Vecchia password",
    sec_pwd_new: "Nuova password",
    sec_pwd_confirm: "Conferma la nuova password",
    sec_pwd_btn: "AGGIORNA LA PASSWORD",

    sec_delete_title: "ELIMINAZIONE ACCOUNT",
    sec_delete_text:
      "Questa azione renderà anonimi i tuoi dati e disattiverà il tuo account in modo permanente in conformità con il GDPR.",
    sec_delete_btn: "Elimina il mio account",
    sec_delete_confirm:
      "Sei assolutamente sicuro? Questa azione è irreversibile.",

    //Alertes (Swal) lors de la suppression de compte
    delete_confirm_1: "Eliminare l'account?",
    delete_confirm_2:
      "Ultimo avviso: le tue foto e i tuoi dati saranno resi anonimi definitivamente.",
    delete_btn_confirm: "Sì, elimina!",
    nav_cancel: "Annulla",
    delete_farewell_title: "Addio!",
    delete_success: "Il tuo account è stato reso anonimo con successo.",
    delete_error_title: "Errore",
    delete_error_text: "Si è verificato un errore durante l'eliminazione.",

    //#endregion

    //#region ChatModal
    chat_private: "Conversazione privata",
    chat_credits: " Credito(i)",
    chat_no_credits: "Saldo esaurito",
    chat_waiting_trans: "🕒 In attesa di traduzione...",
    chat_no_messages: "Nessun messaggio. Invia il primo messaggio!",
    chat_placeholder: "Scrivi il tuo messaggio...",
    chat_placeholder_blocked: "Non hai più crediti per inviare un messaggio...",
    chat_send_btn: "Invia",
    chat_blocked_btn: "Bloccato",
    chat_alert_empty:
      "Il tuo saldo è esaurito. Ricarica i tuoi crediti per continuare questo bell'incontro.",
    chat_shop_btn: "Negozio",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "Il mio Spazio Privato",
    db_welcome: "Benvenuta,",
    db_subtitle: "Ecco la tua dashboard esclusiva.",
    db_tab_messages: "La mia Messaggistica",
    db_tab_profile: "Il mio Profilo",
    db_tab_security: "Sicurezza",
    db_section_convs: "Le mie Conversazioni",
    db_no_messages: "Non hai ancora messaggi.",
    db_contact_hint:
      "Contatta un membro dal suo profilo per iniziare una discussione!",
    db_view_profile: "Vedi il suo profilo",
    db_reply: "→ Rispondi",
    db_badge_new: "NUOVO",

    // Profil & Galerie
    db_profile_intro:
      "Ecco le tue informazioni personali visibili agli uomini:",
    db_my_info: "Le mie Informazioni Personali *",
    db_gallery: "La mia Galleria Foto",
    db_no_photos: "Nessuna foto aggiunta al momento.",
    db_label_pseudo: "Nickname",
    db_label_marital: "Stato Civile",
    db_label_children: "Figli",
    db_label_religion: "Religione",
    db_label_interests: "Interessi",
    db_contact_admin:
      "* Per qualsiasi modifica ai dati del tuo profilo, contatta l'amministratore del sito al numero 06XXXXXX o via mail admin@admin.com",

    // Sécurité
    db_sec_title: "Sicurezza dell'account",
    db_sec_email: "Email di accesso",
    db_sec_change_pwd: "Cambia la password",
    db_sec_old_pwd: "Vecchia password",
    db_sec_new_pwd: "Nuova password",
    db_sec_conf_pwd: "Conferma la nuova password",
    db_sec_btn: "AGGIORNA LA PASSWORD",

    // Alertes (Swal)
    db_alert_error_title: "Ops...",
    db_alert_pwd_mismatch: "Le password non corrispondono",
    db_alert_pwd_success: "Password aggiornata!",
    db_alert_del_title: "Eliminare la conversazione?",
    db_alert_del_text:
      "Tutti i messaggi con questo contatto saranno cancellati definitivamente.",
    db_alert_del_confirm: "Sì, elimina",
    db_alert_del_cancel: "Annulla",
    db_alert_deleted: "Eliminato!",
    //#endregion
  },

  //#endregion

  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- RUSSE ----------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region RUSSIAN
  ru: {
    //#region DATABASE
    database: {
      // Sexe
      male: "Мужчина",
      female: "Женщина",

      // État civil
      single: "Холост / Не замужем",
      divorced: "Разведен(а)",
      widowed: "Вдовец / Вдова",
      free_couple: "Свободные отношения",

      // Religion
      aucune: "Нет",
      catholique: "Католицизм",
      orthodoxe: "Православие",
      protestant: "Протестантизм",
      buddhist: "Буддизм",
      hindoue: "Индуизм",
      judaique: "Иудаизм",
      islam: "Ислам",
      atheist: "Атеист",
      spiritual_but_not_religious: "Духовный, но не религиозный",
      other: "Другое",

      // Pays
      france: "🇫🇷 Франция",
      germany: "🇩🇪 Германия",
      italy: "🇮🇹 Италия",
      spain: "🇪🇸 Испания",
      united_kingdom: "🇬🇧 Англия",
      belgium: "🇧🇪 Бельгия",
      switzerland: "🇨🇭 Швейцария",
      china: "🇨🇳 Китай",
      japan: "🇯🇵 Япония",
      russia: "🇷🇺 Россия",
      thailand: "🇹🇭 Таиланд",
      vietnam: "🇻🇳 Вьетнам",
    },
    //#endregion

    //#region GLOBAL
    age_suffix: "лет ",
    loading_profiles: "Загрузка профилей...",
    members_unit: "Участники",
    save: "Сохранить",
    saved: "Сохранено",
    delete: "Удалить",
    deleted: "Удалено!",
    cancel: "Отмена",
    error: "Ошибка",
    error_occured: "Произошла ошибка.",
    //#endregion

    //#region NAVBAR
    nav_home: "Главная",
    nav_members: "Участники",
    nav_dashboard: "Панель управления",
    nav_shop: "Магазин",
    nav_logout: "ВЫХОД",
    nav_login: "ВОЙТИ",
    nav_register: "РЕГИСТРАЦИЯ",
    //#endregion NAVBAR

    //#region PRESENTATION-PAGE
    //#region Chargement
    loading_universe: "Загрузка вселенной Rebel Refine...",
    //#endregion

    //#region Alertes (SweetAlert)
    alert_gallery_title: "Доступ к галерее",
    alert_gallery_text:
      "Чтобы получить доступ к галерее участников, профилям и сообщениям, необходимо войти в систему.",
    alert_gallery_confirm: "Войти",
    alert_gallery_cancel: "Отмена",
    //#endregion

    //#region Banner Slider
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "Открой для себя Восток, проживи незабываемое.",
    banner_1_desc:
      "Встречайте искренних женщин в поиске современного европейского мужчины. Мост между двумя мирами, построенный на уважении.",
    banner_1_btn: "НАЧАТЬ ПРИКЛЮЧЕНИЕ",

    banner_2_subtitle: "Место встречи двух миров.",
    banner_2_desc:
      "Откройте для себя подлинные и изысканные женские профили, отобранные для требовательных мужчин, ищущих серьезную историю.",
    banner_2_btn: "СОЗДАТЬ СВЯЗЬ",
    //#endregion

    //#region Section Règles
    rules_title: "Правила нашего",
    rules_highlight: "Сообщества",

    // Règle 1
    rule_men_title: "Доступ для мужчин",
    rule_men_desc_part1: "Регистрируйтесь свободно и воспользуйтесь",
    rule_men_desc_highlight: "5 подарочными кредитами",
    rule_men_desc_part2: "чтобы начать общение уже сегодня.",

    // Règle 2
    rule_women_title: "Отбор женщин",
    rule_women_desc:
      "В целях безопасности женские профили проверяются и регистрируются исключительно администратором.",
    rule_women_contact: "Контакт: admin@tonsite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "Живой перевод",
    rule_trans_desc_part1: "Общайтесь без границ. Ваши сообщения",
    rule_trans_desc_highlight: "переводятся квалифицированными переводчиками",
    rule_trans_desc_part2:
      "для обеспечения полной беглости вашего общения.",

    // Règle 4
    rule_kind_title: "Дух доброжелательности",
    rule_kind_desc_part1: "Пространство, основанное на",
    rule_kind_desc_highlight1: "взаимном уважении",
    rule_kind_desc_part2: " для людей, ищущих",
    rule_kind_desc_highlight2: "подлинные, искренние",
    rule_kind_desc_part3: "и",
    rule_kind_desc_highlight3: "долгосрочные связи.",

    // Argument final
    rule_flex_title: "Свобода и гибкость",
    rule_flex_desc:
      "Никаких ежемесячных подписок. После использования приветственных кредитов пополняйте счет по мере необходимости.",
    //#endregion

    //#region Section Membres
    members_title: "Наши новые",
    members_highlight: "участники",
    members_subtitle: "Последние профили, присоединившиеся к Rebel Refine.",
    members_btn: "Посмотреть всех участников",
    years_old: "лет",
    //#endregion

    //#region Section Concept
    concept_title: "Для кого наш",
    concept_highlight: "Круг",
    concept_serenity_title: "Спокойствие и безопасность",
    concept_serenity_desc:
      "Проверенные профили для подлинного и защищенного опыта.",
    concept_exclu_title: "Эксклюзивность",
    concept_exclu_desc:
      "Привилегированное взаимодействие только для аутентифицированных участников.",
    //#endregion

    //#region Footer
    footer_ready: "Готовы сделать шаг?",
    footer_register: "Создать профиль",
    footer_login: "Войти",
    //#endregion

    //#endregion PRESENTATION-PAGE

    //#region REGISTER-PAGE
    register_subtitle: "Присоединяйтесь к эксклюзивной группе",
    register_form_title: "Создать аккаунт",
    register_success:
      "Регистрация прошла успешно! Ссылка для подтверждения отправлена на вашу почту.",
    register_error_generic: "Ошибка при регистрации",
    register_error_password: "Пароли не совпадают",

    register_label_gender: "Вы:",
    register_gender_male: "МУЖЧИНА",
    register_gender_female: "ЖЕНЩИНА",

    register_label_country: "Страна / Родной язык:",
    register_country_placeholder: "-- Выберите страну --",

    register_label_nickname: "Никнейм",
    register_nickname_placeholder: "Как нам вас называть?",

    register_label_email: "Ваш престижный e-mail",
    register_label_password: "Пароль",
    register_label_confirm: "Подтверждение",

    register_btn_submit: "СТАТЬ УЧАСТНИКОМ",
    register_footer_text: "Уже в группе?",
    register_footer_link: "Войти",

    // Modale Contact Administration
    register_modal_title: "БЕЗОПАСНАЯ РЕГИСТРАЦИЯ",
    register_modal_text:
      "Чтобы гарантировать эксклюзивность и безопасность нашей группы, регистрация женских профилей осуществляется напрямую нашей администрацией.",
    register_modal_contact: "Свяжитесь с нами по почте или телефону",
    register_modal_btn_back: "НАЗАД",
    //#endregion REGISTER-PAGE

    //#region LOGIN-PAGE
    login_subtitle: "Найдите своего идеального партнера",
    login_error_invalid: "Неверные учетные данные",
    login_success_verified:
      "Аккаунт успешно подтвержден! Добро пожаловать в Rebel Refine.",

    login_label_email: "Email",
    login_label_password: "Пароль",
    login_forgot_password: "Забыли пароль?",
    login_btn_submit: "ВОЙТИ",

    login_footer_no_account: "Еще нет аккаунта?",
    login_footer_register_link: "Зарегистрируйтесь сейчас бесплатно, нажав ЗДЕСЬ",

    // Modal Récupération
    login_modal_title: "Восстановление аккаунта",
    login_modal_label: "Введите ваш e-mail:",
    login_modal_btn_send: "Отправить ссылку",
    login_modal_sending: "Отправка...",
    //#endregion LOGIN-PAGE

    //#region HOME-PAGE
    home_welcome_back: "Рады вас видеть снова,",
    home_adventurer: "Искатель приключений",
    home_subtitle: "Ваш идеальный партнер на расстоянии одного клика.",
    home_search_title: "Я ищу женщину",
    home_search_from: "От...",
    home_search_to: "До...",
    home_btn_search: "Найти партнера",

    // Section Nouveaux Membres
    home_new_members_title: "Наши новые участники",
    home_new_members_desc:
      "Последние профили, присоединившиеся к Rebel Refine. Сделайте первый шаг!",
    home_btn_discover_all: "Посмотреть всех женщин",
    home_favorite_error: "Не удалось обновить избранное.",

    // Section Stats (About)
    home_stats_title: "Все начинается со встречи",
    home_stats_desc:
      "Присоединяйтесь к растущему сообществу и получите доступ к тысячам профилей.",
    home_stat_total: "Всего участников",
    home_stat_online: "Участников онлайн",
    home_stat_males: "Мужчин онлайн",
    home_stat_females: "Женщин онлайн",
    //#endregion

    //#region SEARCH-PAGE
    search_results_title: "Результаты",
    search_results_subtitle: "поиска:",
    search_btn_discover: "ПОСМОТРЕТЬ ПРОФИЛЬ",
    search_no_results: "Профили по вашим критериям не найдены.",
    //#endregion SEARCH-PAGE

    //#region MEMBERS-PAGE
    members_title_female: "Все наши женщины-участницы",
    //#endregion

    //#region PROFILE-PAGE
    profile_age_label: "Возраст:",
    profile_gallery_title: "Моя фотогалерея",
    profile_no_photo: "В галерее нет фотографий.",
    profile_about_title: "О себе и детали",
    profile_no_description: "Описание не указано.",
    // Détails techniques
    profile_status: "Статус",
    profile_country: "Страна",
    profile_children: "Дети",
    profile_religion: "Религия",
    // Mémo
    profile_memo_title: "ЛИЧНАЯ ЗАМЕТКА",
    profile_memo_placeholder: "Напишите заметку об этом участнике...",
    profile_memo_save_success: "Заметка обновлена.",
    profile_memo_delete_confirm: "Удалить заметку?",
    profile_memo_delete_warning: "Это действие необратимо.",
    // Messages / Crédits
    profile_msg_confirm_title: "Вы уверены?",
    profile_msg_confirm_text: "Это будет стоить 1 кредит.",
    profile_msg_send_btn: "Да, отправить!",
    profile_msg_sent_success: "Отправлено!",
    profile_msg_remaining_credits: "Осталось кредитов: {{count}}",
    //#endregion

    //#region PROFILE MALE
    view_profile_back: "Вернуться в панель управления",
    view_profile_loading: "Загрузка профиля...",
    view_profile_other_info: "Другая информация",
    view_profile_birthdate: "Дата рождения:",
    view_profile_country: "Страна",
    view_profile_status: "Семейное положение",
    view_profile_children: "Дети",
    view_profile_religion: "Религия",
    view_profile_about: "О себе",
    view_profile_no_desc: "Нет описания.",
    view_profile_reply: "Ответить",
    view_profile_error_title: "Ой!",
    view_profile_not_found: "Профиль не заполнен",
    //#endregion

    //#region CREDITSHOP
    shop_title: "Пополните ваши",
    shop_title_gold: "Кредиты",
    shop_subtitle:
      "Выберите подходящий пакет, чтобы продолжить общение.",
    shop_pack_credits: "Кредитов",
    shop_pack_button: "Выбрать этот пакет",
    shop_error_login: "Необходимо войти в систему",
    shop_error_payment_title: "Оплата невозможна",
    shop_error_init: "Ошибка инициализации оплаты",
    // Packs
    pack_decouverte: "Ознакомительный",
    pack_passion: "Страсть",
    pack_elite: "Элитный",
    //#endregion

    //#region RESETPASSWORD
    reset_title: "Новый пароль",
    reset_subtitle: "Выберите надежный пароль для защиты вашего аккаунта.",
    reset_label: "ПАРОЛЬ",
    reset_btn: "ПОДТВЕРДИТЬ ИЗМЕНЕНИЕ",
    reset_success:
      "Успешно! Ваш пароль обновлен.\nАвтоматическое перенаправление на страницу входа...",
    reset_error_default: "Произошла ошибка.",
    //#endregion

    //#region PAYMENT SUCCESS
    payment_success_swal_title: "Оплата подтверждена!",
    payment_processing_title: "Обработка вашего заказа...",
    //#endregion

    //#region TRANSLATORDASHBOARD
    translator_main_title: "Зона модерации и перевода",
    translator_empty_state: "Нет сообщений в очереди. Все обновлено!",
    translator_label_source: "Исходное сообщение",
    translator_label_translation: "Перевод",
    translator_placeholder: "Введите перевод здесь...",
    translator_btn_send: "Подтвердить и отправить",
    translator_success_title: "Перевод подтвержден",
    translator_success_msg: "Сообщение успешно отправлено.",
    translator_error_empty: "Пожалуйста, введите перевод перед подтверждением.",
    //#endregion

    //#region DASHBOARD
    //BEFORE RENDER
    db_loading: "Загрузка вашего профиля...",
    db_error_load: "Ошибка подключения: не удалось получить данные.",
    db_update_success_title: "Профиль обновлен!",
    db_update_success_text: "Ваши изменения успешно сохранены.",
    db_update_error: "Произошла ошибка.",
    db_net_error: "Не удалось связаться с сервером.",
    db_pwd_mismatch: "Пароли не совпадают.",
    db_pwd_success_title: "Пароль обновлен!",
    db_pwd_success_text: "Ваш пароль был успешно обновлен.",
    db_photo_del_error: "Ошибка при удалении",
    // Messagerie & Crédits
    msg_confirm_title: "Вы уверены?",
    msg_confirm_text: "Это будет стоить 1 кредит.",
    msg_confirm_btn: "Да, отправить!",
    msg_sent_title: "Отправлено!",
    msg_credits_left: "Осталось кредитов: ",
    msg_del_conv_title: "Удалить переписку?",
    msg_del_conv_text: "Все сообщения с этим контактом будут удалены навсегда.",
    msg_del_confirm_btn: "Да, удалить",
    msg_del_cancel_btn: "Отмена",
    msg_del_success: "Удалено!",

    //AFTER RENDER
    db_title: "Моя панель управления",
    db_welcome: "Добро пожаловать,",
    db_balance: "Ваш баланс:",
    db_credits: "Кредитов",
    db_nav_title: "Навигация",
    db_tab_infos: "Моя информация",
    db_tab_msg: "Мои сообщения",
    db_tab_favs: "Мое избранное",
    db_tab_purchases: "Мои покупки",
    db_tab_security: "Безопасность",

    // Profil & Galerie
    db_edit_btn: "Изменить данные",
    db_gallery_title: "Моя фотогалерея",
    db_not_set: "Не указано",
    db_label_pseudo: "Никнейм",
    db_label_email: "Email (нельзя изменить)",
    db_label_country: "Страна (нельзя изменить)",
    db_label_birth: "Дата рождения",
    db_label_marital: "Семейное положение",
    db_label_children: "Дети",
    db_label_religion: "Религия / Духовность",
    db_label_interests: "О себе и интересы",

    // Options Select
    opts_choose: "Выбрать...",
    opts_single: "Холост / Не замужем",
    opts_divorced: "Разведен(а)",
    opts_widowed: "Вдовец / Вдова",
    opts_free_couple: "Свободные отношения",
    opts_none: "Нет",
    opts_child_1: "1 ребенок",
    opts_child_2: "2 детей",
    opts_child_3: "3 детей",
    opts_child_4: "4 детей",
    opts_child_5plus: "5 и более детей",
    opts_religion: "Духовный, но не религиозный",
    opts_religion_other: "Другое",

    // Boutons
    btn_save: "СОХРАНИТЬ",
    btn_cancel: "ОТМЕНА",

    // Messagerie
    msg_title: "Мои переписки",
    msg_empty: "У вас еще нет сообщений.",
    msg_empty_sub: "Напишите участнику из его профиля, чтобы начать общение!",
    msg_user_default: "Пользователь",
    msg_view_profile: "Профиль",
    msg_badge_new: "НОВОЕ",
    msg_reply: "→ Ответить",
    msg_delete_title: "Удалить переписку",

    // Favoris
    fav_title: "Мои симпатии",
    fav_count: "участников",
    fav_view_btn: "Профиль",

    // Achats / Historique
    buy_title: "История покупок",
    buy_count: "транзакций",
    buy_added: "кредитов",
    buy_date_prefix: "Дата:",
    buy_status_ok: "Принято",
    buy_empty: "Вы еще не совершали покупок.",

    // Sécurité
    sec_title: "Безопасность аккаунта",
    sec_email_label: "Email для входа",
    sec_pref_title: "Настройки отправки",
    sec_pref_confirm: "Подтверждать перед отправкой сообщения",
    sec_pwd_change_title: "Сменить пароль",
    sec_pwd_old: "Старый пароль",
    sec_pwd_new: "Новый пароль",
    sec_pwd_confirm: "Подтвердите новый пароль",
    sec_pwd_btn: "ОБНОВИТЬ ПАРОЛЬ",

    sec_delete_title: "УДАЛЕНИЕ АККАУНТА",
    sec_delete_text: "Это действие анонимизирует ваши данные и навсегда деактивирует аккаунт в соответствии с GDPR.",
    sec_delete_btn: "Удалить мой аккаунт",
    sec_delete_confirm: "Вы абсолютно уверены? Это действие необратимо.",

    //Alertes (Swal) lors de la suppression de compte
    delete_confirm_1: "Удалить аккаунт?",
    delete_confirm_2: "Последнее предупреждение: ваши фото и данные будут окончательно анонимизированы.",
    delete_btn_confirm: "Да, удалить!",
    nav_cancel: "Отмена",
    delete_farewell_title: "Прощайте!",
    delete_success: "Ваш аккаунт был успешно анонимизирован.",
    delete_error_title: "Ошибка",
    delete_error_text: "При удалении произошла ошибка.",

    //#endregion

    //#region ChatModal
    chat_private: "Приватная беседа",
    chat_credits: " Кредит(ы)",
    chat_no_credits: "Баланс исчерпан",
    chat_waiting_trans: "🕒 Ожидание перевода...",
    chat_no_messages: "Нет сообщений. Напишите первым!",
    chat_placeholder: "Введите ваше сообщение...",
    chat_placeholder_blocked: "У вас нет кредитов для отправки сообщения...",
    chat_send_btn: "Отправить",
    chat_blocked_btn: "Заблокировано",
    chat_alert_empty: "Ваш баланс исчерпан. Пополните счет, чтобы продолжить это прекрасное знакомство.",
    chat_shop_btn: "Магазин",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "Мое личное пространство",
    db_welcome: "Добро пожаловать,",
    db_subtitle: "Ваша эксклюзивная панель управления.",
    db_tab_messages: "Мои сообщения",
    db_tab_profile: "Мой профиль",
    db_tab_security: "Безопасность",
    db_section_convs: "Мои переписки",
    db_no_messages: "У вас еще нет сообщений.",
    db_contact_hint: "Напишите участнику из его профиля, чтобы начать общение!",
    db_view_profile: "Профиль",
    db_reply: "→ Ответить",
    db_badge_new: "НОВОЕ",

    // Profil & Galerie
    db_profile_intro: "Ваша личная информация, видимая мужчинам:",
    db_my_info: "Мои личные данные *",
    db_gallery: "Моя фотогалерея",
    db_no_photos: "Фотографии пока не добавлены.",
    db_label_pseudo: "Никнейм",
    db_label_marital: "Семейное положение",
    db_label_children: "Дети",
    db_label_religion: "Религия",
    db_label_interests: "Интересы",
    db_contact_admin:
      "* Для любого изменения данных вашего профиля свяжитесь с администратором сайта по номеру 06XXXXXX или по почте admin@admin.com",

    // Sécurité
    db_sec_title: "Безопасность аккаунта",
    db_sec_email: "Email для входа",
    db_sec_change_pwd: "Сменить пароль",
    db_sec_old_pwd: "Старый пароль",
    db_sec_new_pwd: "Новый пароль",
    db_sec_conf_pwd: "Подтвердите новый пароль",
    db_sec_btn: "ОБНОВИТЬ ПАРОЛЬ",

    // Alertes (Swal)
    db_alert_error_title: "Ой...",
    db_alert_pwd_mismatch: "Пароли не совпадают",
    db_alert_pwd_success: "Пароль обновлен!",
    db_alert_del_title: "Удалить переписку?",
    db_alert_del_text: "Все сообщения с этим контактом будут удалены навсегда.",
    db_alert_del_confirm: "Да, удалить",
    db_alert_del_cancel: "Отмена",
    db_alert_deleted: "Удалено!",
    //#endregion
  },
  //#endregion
   
  // -------------------------------------------------------------------------------------------------
  // -------------------------------------------- ESPAGNOL -------------------------------------------
  // -------------------------------------------------------------------------------------------------

  //#region ESPAGNOL
  es: {
    //#region DATABASE
    database: {
      // Sexe
      male: "Hombre",
      female: "Mujer",

      // État civil
      single: "Soltero/a",
      divorced: "Divorciado/a",
      widowed: "Viudo/a",
      free_couple: "Pareja abierta",

      // Religion
      aucune: "Ninguna",
      catholique: "Católica",
      orthodoxe: "Ortodoxa",
      protestant: "Protestante",
      buddhist: "Budista",
      hindoue: "Hinduista",
      judaique: "Judaica",
      islam: "Islam",
      atheist: "Ateo",
      spiritual_but_not_religious: "Espiritual pero no religioso",
      other: "Otro",

      // Pays
      france: "🇫🇷 Francia",
      germany: "🇩🇪 Alemania",
      italy: "🇮🇹 Italia",
      spain: "🇪🇸 España",
      united_kingdom: "🇬🇧 Reino Unido",
      belgium: "🇧🇪 Bélgica",
      switzerland: "🇨🇭 Suiza",
      china: "🇨🇳 China",
      japan: "🇯🇵 Japón",
      russia: "🇷🇺 Rusia",
      thailand: "🇹🇭 Tailandia",
      vietnam: "🇻🇳 Vietnam",
    },
    //#endregion

    //#region GLOBAL
    age_suffix: "años ",
    loading_profiles: "Cargando perfiles...",
    members_unit: "Miembros",
    save: "Guardar",
    saved: "¡Guardado!",
    delete: "Eliminar",
    deleted: "¡Eliminado!",
    cancel: "Cancelar",
    error: "Error",
    error_occured: "Ha ocurrido un error.",
    //#endregion

    //#region NAVBAR
    nav_home: "Inicio",
    nav_members: "Miembros",
    nav_dashboard: "Panel",
    nav_shop: "Tienda",
    nav_logout: "CERRAR SESIÓN",
    nav_login: "ENTRAR",
    nav_register: "REGISTRARSE",
    //#endregion NAVBAR

    //#region PRESENTATION-PAGE
    //#region Chargement
    loading_universe: "Cargando el universo Rebel Refine...",
    //#endregion

    //#region Alertes (SweetAlert)
    alert_gallery_title: "Acceso a la Galería",
    alert_gallery_text:
      "Para acceder a la galería de miembros, perfiles y mensajería, debes iniciar sesión.",
    alert_gallery_confirm: "Iniciar sesión",
    alert_gallery_cancel: "Cancelar",
    //#endregion

    //#region Banner Slider
    banner_1_title: "REBEL REFINE",
    banner_1_subtitle: "Atrévete con Oriente, vive lo inolvidable.",
    banner_1_desc:
      "Encuentra mujeres auténticas que buscan a un hombre europeo moderno. Un puente entre dos mundos, construido sobre el respeto.",
    banner_1_btn: "COMENZAR LA AVENTURA",

    banner_2_subtitle: "El encuentro de dos mundos.",
    banner_2_desc:
      "Descubre perfiles femeninos auténticos y refinados, seleccionados para hombres exigentes que buscan una historia seria.",
    banner_2_btn: "CREAR EL VÍNCULO",
    //#endregion

    //#region Section Règles
    rules_title: "Las Reglas de nuestra",
    rules_highlight: "Comunidad",

    // Règle 1
    rule_men_title: "Acceso Caballeros",
    rule_men_desc_part1: "Regístrate libremente y disfruta de",
    rule_men_desc_highlight: "5 créditos de regalo",
    rule_men_desc_part2: "para comenzar tus primeros intercambios hoy mismo.",

    // Règle 2
    rule_women_title: "Selección Damas",
    rule_women_desc:
      "Por razones de seguridad, los perfiles femeninos son validados y registrados exclusivamente por el administrador.",
    rule_women_contact: "Contacto: admin@tonsite.com | 06 XX XX XX XX",

    // Règle 3
    rule_trans_title: "Traducción Humana",
    rule_trans_desc_part1: "Comunícate sin límites. Tus mensajes son",
    rule_trans_desc_highlight: "traducidos por traductores cualificados",
    rule_trans_desc_part2:
      "para garantizar una fluidez total en tus conversaciones.",

    // Règle 4
    rule_kind_title: "Espíritu Benévolo",
    rule_kind_desc_part1: "Un espacio basado en el",
    rule_kind_desc_highlight1: "respeto mutuo",
    rule_kind_desc_part2: " dedicado a personas que buscan conexiones",
    rule_kind_desc_highlight2: "auténticas, sinceras",
    rule_kind_desc_part3: "y",
    rule_kind_desc_highlight3: "duraderas.",

    // Argument final
    rule_flex_title: "Libertad y Flexibilidad",
    rule_flex_desc:
      "Sin suscripción mensual. Una vez agotados tus créditos de bienvenida, recarga tu cuenta según tus necesidades.",
    //#endregion

    //#region Section Membres
    members_title: "Nuestros nuevos",
    members_highlight: "miembros",
    members_subtitle: "Estos son los últimos perfiles que se han unido a Rebel Refine.",
    members_btn: "Descubrir todos los miembros",
    years_old: "años",
    //#endregion

    //#region Section Concept
    concept_title: "A quién se dirige nuestro",
    concept_highlight: "Círculo",
    concept_serenity_title: "Serenidad y Seguridad",
    concept_serenity_desc:
      "Perfiles verificados para una experiencia auténtica y protegida.",
    concept_exclu_title: "Exclusividad",
    concept_exclu_desc:
      "Una interacción privilegiada reservada a miembros autenticados.",
    //#endregion

    //#region Footer
    footer_ready: "¿Listo para dar el paso?",
    footer_register: "Crear mi perfil",
    footer_login: "Iniciar sesión",
    //#endregion

    //#endregion PRESENTATION-PAGE

    //#region REGISTER-PAGE
    register_subtitle: "Únete al grupo exclusivo",
    register_form_title: "Crear una cuenta",
    register_success:
      "¡Registro exitoso! Se ha enviado un enlace de confirmación por correo electrónico.",
    register_error_generic: "Error durante el registro",
    register_error_password: "Las contraseñas no coinciden",

    register_label_gender: "Eres:",
    register_gender_male: "un HOMBRE",
    register_gender_female: "una MUJER",

    register_label_country: "País / Lengua de origen:",
    register_country_placeholder: "-- Elige tu país --",

    register_label_nickname: "Apodo",
    register_nickname_placeholder: "¿Cómo debemos llamarte?",

    register_label_email: "Tu correo electrónico de prestigio",
    register_label_password: "Contraseña",
    register_label_confirm: "Confirmar contraseña",

    register_btn_submit: "CONVERTIRSE EN MIEMBRO",
    register_footer_text: "¿Ya formas parte del grupo?",
    register_footer_link: "Iniciar sesión",

    // Modale Contact Administration
    register_modal_title: "REGISTRO SEGURO",
    register_modal_text:
      "Para garantizar la exclusividad y la seguridad de nuestro grupo, el registro de perfiles femeninos es gestionado directamente por nuestro equipo de administración.",
    register_modal_contact: "Contáctanos por email o teléfono",
    register_modal_btn_back: "VOLVER",
    //#endregion REGISTER-PAGE

    //#region LOGIN-PAGE
    login_subtitle: "Encuentra a tu pareja ideal",
    login_error_invalid: "Credenciales incorrectas",
    login_success_verified:
      "¡Cuenta verificada con éxito! Bienvenido a Rebel Refine.",

    login_label_email: "Email",
    login_label_password: "Contraseña",
    login_forgot_password: "¿Has olvidado tu contraseña?",
    login_btn_submit: "ENTRAR",

    login_footer_no_account: "¿Aún no tienes cuenta?",
    login_footer_register_link:
      "Regístrate gratis haciendo clic AQUÍ",

    // Modal Récupération
    login_modal_title: "Recuperación de cuenta",
    login_modal_label: "Introduce tu dirección de email:",
    login_modal_btn_send: "Enviar enlace",
    login_modal_sending: "Enviando...",
    //#endregion LOGIN-PAGE

    //#region HOME-PAGE
    home_welcome_back: "Encantado de verte de nuevo,",
    home_adventurer: "Aventurero",
    home_subtitle: "Tu pareja ideal está a solo un clic.",
    home_search_title: "Busco una mujer",
    home_search_from: "De...",
    home_search_to: "A...",
    home_btn_search: "Encontrar mi pareja",

    // Section Nouveaux Membres
    home_new_members_title: "Nuestras nuevas usuarias",
    home_new_members_desc:
      "Aquí están los últimos perfiles que se han unido a Rebel Refine. ¡Da el primer paso!",
    home_btn_discover_all: "Descubrir todas las usuarias",
    home_favorite_error: "No se pudo actualizar los favoritos.",

    // Section Stats (About)
    home_stats_title: "Todo comienza con un encuentro",
    home_stats_desc:
      "Únete a una comunidad en crecimiento y accede a miles de perfiles.",
    home_stat_total: "Miembros Totales",
    home_stat_online: "Miembros online",
    home_stat_males: "Hombres online",
    home_stat_females: "Mujeres online",
    //#endregion

    //#region SEARCH-PAGE
    search_results_title: "Resultados",
    search_results_subtitle: "de la búsqueda:",
    search_btn_discover: "VER PERFIL",
    search_no_results: "No hay perfiles que coincidan con tus criterios.",
    //#endregion SEARCH-PAGE

    //#region MEMBERS-PAGE
    members_title_female: "Todas nuestras usuarias",
    //#endregion

    //#region PROFILE-PAGE
    profile_age_label: "Edad:",
    profile_gallery_title: "Mi Galería de Fotos",
    profile_no_photo: "No hay fotos en la galería.",
    profile_about_title: "Información y Detalles",
    profile_no_description: "Sin descripción.",
    // Détails techniques
    profile_status: "Situación",
    profile_country: "País",
    profile_children: "Hijos",
    profile_religion: "Religión",
    // Mémo
    profile_memo_title: "NOTA PRIVADA",
    profile_memo_placeholder: "Escribe tu nota sobre este miembro...",
    profile_memo_save_success: "Tu nota ha sido actualizada.",
    profile_memo_delete_confirm: "¿Eliminar la nota?",
    profile_memo_delete_warning: "Esta acción es irreversible.",
    // Messages / Crédits
    profile_msg_confirm_title: "¿Estás seguro?",
    profile_msg_confirm_text: "Te costará 1 crédito.",
    profile_msg_send_btn: "¡Sí, enviar!",
    profile_msg_sent_success: "¡Enviado!",
    profile_msg_remaining_credits: "Créditos restantes: {{count}}",
    //#endregion

    //#region PROFILE MALE
    view_profile_back: "Volver al Panel",
    view_profile_loading: "Cargando perfil privado...",
    view_profile_other_info: "Otra Información",
    view_profile_birthdate: "Fecha de nacimiento:",
    view_profile_country: "País",
    view_profile_status: "Estado Civil",
    view_profile_children: "Hijos",
    view_profile_religion: "Religión",
    view_profile_about: "Sobre mí",
    view_profile_no_desc: "Sin descripción.",
    view_profile_reply: "Responder a",
    view_profile_error_title: "¡Ops!",
    view_profile_not_found: "Perfil no completado",
    //#endregion

    //#region CREDITSHOP
    shop_title: "Recarga tus",
    shop_title_gold: "Créditos",
    shop_subtitle:
      "Elige el paquete que mejor se adapte a ti para continuar tus intercambios.",
    shop_pack_credits: "Créditos",
    shop_pack_button: "Elegir este pack",
    shop_error_login: "Debes estar conectado",
    shop_error_payment_title: "Pago imposible",
    shop_error_init: "Error al iniciar el pago",
    // Packs
    pack_decouverte: "Descubrimiento",
    pack_passion: "Pasión",
    pack_elite: "Élite",
    //#endregion

    //#region RESETPASSWORD
    reset_title: "Nueva contraseña",
    reset_subtitle: "Elige una contraseña robusta para proteger tu cuenta.",
    reset_label: "CONTRASEÑA",
    reset_btn: "VALIDAR CAMBIO",
    reset_success:
      "¡Éxito! Tu contraseña ha sido actualizada.\nRedirigiendo al login...",
    reset_error_default: "Ha ocurrido un error.",
    //#endregion

    //#region PAYMENT SUCCESS
    payment_success_swal_title: "¡Pago confirmado!",
    payment_processing_title: "Procesando tu pedido...",
    //#endregion

    //#region TRANSLATORDASHBOARD
    translator_main_title: "Área de Moderación y Traducción",
    translator_empty_state: "No hay mensajes pendientes. ¡Todo al día!",
    translator_label_source: "Mensaje original",
    translator_label_translation: "Traducción",
    translator_placeholder: "Introduce la traducción aquí...",
    translator_btn_send: "Validar y Enviar",
    translator_success_title: "Traducción validada",
    translator_success_msg: "El mensaje ha sido enviado con éxito.",
    translator_error_empty: "Por favor, introduce una traducción antes de validar.",
    //#endregion

    //#region DASHBOARD
    //BEFORE RENDER
    db_loading: "Cargando tu perfil...",
    db_error_load: "Error de conexión: no se pudieron recuperar tus datos.",
    db_update_success_title: "¡Perfil actualizado!",
    db_update_success_text: "Tus cambios se han guardado correctamente.",
    db_update_error: "Ha ocurrido un error.",
    db_net_error: "No se pudo conectar con el servidor.",
    db_pwd_mismatch: "Las contraseñas no coinciden.",
    db_pwd_success_title: "¡Contraseña actualizada!",
    db_pwd_success_text: "Tu contraseña ha sido actualizada correctamente.",
    db_photo_del_error: "Error al eliminar",
    // Messagerie & Crédits
    msg_confirm_title: "¿Estás seguro?",
    msg_confirm_text: "Te costará 1 crédito.",
    msg_confirm_btn: "¡Sí, enviar!",
    msg_sent_title: "¡Enviado!",
    msg_credits_left: "Créditos restantes: ",
    msg_del_conv_title: "¿Eliminar conversación?",
    msg_del_conv_text: "Todos los mensajes con este contacto se borrarán permanentemente.",
    msg_del_confirm_btn: "Sí, eliminar",
    msg_del_cancel_btn: "Cancelar",
    msg_del_success: "¡Eliminado!",

    //AFTER RENDER
    db_title: "Mi Panel de Control",
    db_welcome: "Bienvenido,",
    db_balance: "Tu saldo:",
    db_credits: "Créditos",
    db_nav_title: "Navegación",
    db_tab_infos: "Mis Datos",
    db_tab_msg: "Mis Mensajes",
    db_tab_favs: "Mis Favoritos",
    db_tab_purchases: "Mis Compras",
    db_tab_security: "Seguridad",

    // Profil & Galerie
    db_edit_btn: "Editar mis datos",
    db_gallery_title: "Mi Galería de Fotos",
    db_not_set: "No definido",
    db_label_pseudo: "Apodo",
    db_label_email: "Email (no modificable)",
    db_label_country: "País (no modificable)",
    db_label_birth: "Fecha de nacimiento",
    db_label_marital: "Estado Civil",
    db_label_children: "Hijos",
    db_label_religion: "Religión / Espiritualidad",
    db_label_interests: "Mi Presentación e Intereses",

    // Options Select
    opts_choose: "Elegir...",
    opts_single: "Soltero/a",
    opts_divorced: "Divorciado/a",
    opts_widowed: "Viudo/a",
    opts_free_couple: "Pareja abierta",
    opts_none: "Ninguno",
    opts_child_1: "1 hijo",
    opts_child_2: "2 hijos",
    opts_child_3: "3 hijos",
    opts_child_4: "4 hijos",
    opts_child_5plus: "5 o más hijos",
    opts_religion: "Espiritual pero no religioso",
    opts_religion_other: "Otro",

    // Boutons
    btn_save: "GUARDAR",
    btn_cancel: "CANCELAR",

    // Messagerie
    msg_title: "Mis Conversaciones",
    msg_empty: "Aún no tienes mensajes.",
    msg_empty_sub: "¡Contacta con un miembro desde su perfil para iniciar un chat!",
    msg_user_default: "Usuario",
    msg_view_profile: "Ver perfil",
    msg_badge_new: "NUEVO",
    msg_reply: "→ Responder",
    msg_delete_title: "Eliminar conversación",

    // Favoris
    fav_title: "Mis Flechazos",
    fav_count: "miembros",
    fav_view_btn: "Ver perfil",

    // Achats / Historique
    buy_title: "Historial de compras",
    buy_count: "transacciones",
    buy_added: "créditos",
    buy_date_prefix: "El",
    buy_status_ok: "Aceptado",
    buy_empty: "Aún no has realizado compras.",

    // Sécurité
    sec_title: "Seguridad de la cuenta",
    sec_email_label: "Email de acceso",
    sec_pref_title: "Preferencias de envío",
    sec_pref_confirm: "Confirmar antes de enviar un mensaje",
    sec_pwd_change_title: "Cambiar contraseña",
    sec_pwd_old: "Contraseña antigua",
    sec_pwd_new: "Nueva contraseña",
    sec_pwd_confirm: "Confirmar nueva contraseña",
    sec_pwd_btn: "ACTUALIZAR CONTRASEÑA",

    sec_delete_title: "ELIMINAR CUENTA",
    sec_delete_text: "Esta acción anonimizará tus datos y desactivará tu cuenta permanentemente según el RGPD.",
    sec_delete_btn: "Eliminar mi cuenta",
    sec_delete_confirm: "¿Estás absolutamente seguro? Esta acción es irreversible.",

    //Alertes (Swal) lors de la suppression de compte
    delete_confirm_1: "¿Eliminar cuenta?",
    delete_confirm_2: "Último aviso: tus fotos y datos serán anonimizados definitivamente.",
    delete_btn_confirm: "¡Sí, eliminar!",
    nav_cancel: "Cancelar",
    delete_farewell_title: "¡Adiós!",
    delete_success: "Tu cuenta ha sido anonimizada correctamente.",
    delete_error_title: "Error",
    delete_error_text: "Ocurrió un error durante la eliminación.",

    //#endregion

    //#region ChatModal
    chat_private: "Conversación privada",
    chat_credits: " Crédito(s)",
    chat_no_credits: "Saldo agotado",
    chat_waiting_trans: "🕒 Esperando traducción...",
    chat_no_messages: "Sin mensajes. ¡Envía el primero!",
    chat_placeholder: "Escribe tu mensaje...",
    chat_placeholder_blocked: "No tienes créditos para enviar mensajes...",
    chat_send_btn: "Enviar",
    chat_blocked_btn: "Bloqueado",
    chat_alert_empty: "Saldo agotado. Recarga tus créditos para continuar este encuentro.",
    chat_shop_btn: "Tienda",
    //#endregion

    //#region FEMALE DASHBOARD
    db_title: "Mi Espacio Privado",
    db_welcome: "Bienvenida,",
    db_subtitle: "Este es tu panel exclusivo.",
    db_tab_messages: "Mis Mensajes",
    db_tab_profile: "Mi Perfil",
    db_tab_security: "Seguridad",
    db_section_convs: "Mis Conversaciones",
    db_no_messages: "Aún no tienes mensajes.",
    db_contact_hint: "¡Contacta con un miembro desde su perfil para iniciar un chat!",
    db_view_profile: "Ver perfil",
    db_reply: "→ Responder",
    db_badge_new: "NUEVO",

    // Profil & Galerie
    db_profile_intro: "Tu información personal visible para los hombres:",
    db_my_info: "Mis Datos Personales *",
    db_gallery: "Mi Galería de Fotos",
    db_no_photos: "No hay fotos añadidas por ahora.",
    db_label_pseudo: "Apodo",
    db_label_marital: "Estado Civil",
    db_label_children: "Hijos",
    db_label_religion: "Religión",
    db_label_interests: "Intereses",
    db_contact_admin:
      "* Para cualquier modificación en los datos de tu perfil, contacta al administrador en el 06XXXXXX o por email admin@admin.com",

    // Sécurité
    db_sec_title: "Seguridad de la cuenta",
    db_sec_email: "Email de acceso",
    db_sec_change_pwd: "Cambiar contraseña",
    db_sec_old_pwd: "Contraseña antigua",
    db_sec_new_pwd: "Nueva contraseña",
    db_sec_conf_pwd: "Confirmar nueva contraseña",
    db_sec_btn: "ACTUALIZAR CONTRASEÑA",

    // Alertes (Swal)
    db_alert_error_title: "¡Ops!",
    db_alert_pwd_mismatch: "Las contraseñas no coinciden",
    db_alert_pwd_success: "¡Contraseña actualizada!",
    db_alert_del_title: "¿Eliminar conversación?",
    db_alert_del_text: "Todos los mensajes con este contacto se borrarán permanentemente.",
    db_alert_del_confirm: "Sí, eliminar",
    db_alert_del_cancel: "Cancelar",
    db_alert_deleted: "¡Eliminado!",
    //#endregion
  },
  //#endregion
};
