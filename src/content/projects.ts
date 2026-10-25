import type { MiniProject, Project } from "./types";

// Single source of truth for projects. Adding a project = adding an entry here.
// TODO(Razane): check every GitHub URL after renaming repos, and add `live` / `docs` once deployed.

export const projects: Project[] = [
  {
    slug: "factoryflow",
    title: "FactoryFlow",
    pitch: {
      en: "A factory's stock and production in one secure API, with 99 tests to prove it.",
      fr: "Le stock et la production d'une usine dans une seule API sécurisée, avec 99 tests pour le prouver.",
    },
    year: 2026,
    period: { en: "Aug – Oct 2026", fr: "Août – oct. 2026" },
    role: { en: "Solo · tracked in Jira (FAC-xx)", fr: "Solo · suivi dans Jira (FAC-xx)" },
    team: 1,
    category: ["api"],
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT", "Joi", "Swagger", "Jest", "Docker"],
    links: { github: "https://github.com/razaane/FactoryFlow" },
    marginNote: { en: "my favourite!", fr: "mon préféré !" },
    metrics: [
      { label: { en: "Tests", fr: "Tests" }, value: "99 passing" },
      { label: { en: "Test suites", fr: "Suites" }, value: "9" },
      { label: { en: "Coverage", fr: "Couverture" }, value: "~83%" },
      { label: { en: "Commits", fr: "Commits" }, value: "67" },
    ],
    tldr: [
      {
        en: "REST API for raw materials, stock movements and production orders.",
        fr: "API REST pour les matières premières, les mouvements de stock et les ordres de production.",
      },
      {
        en: "Layered architecture: routes → controllers → services → repositories.",
        fr: "Architecture en couches : routes → contrôleurs → services → repositories.",
      },
      {
        en: "99 passing tests in 9 suites, ~83% coverage, dockerised.",
        fr: "99 tests au vert dans 9 suites, ~83 % de couverture, dockerisée.",
      },
    ],
    architecture: {
      title: { en: "Request flow", fr: "Parcours d'une requête" },
      layers: ["Route", "Auth (JWT)", "Validator (Joi)", "Controller", "Service", "Repository", "MongoDB"],
    },
    tour: [
      {
        method: "GET",
        path: "/api/materials",
        status: 200,
        steps: [
          { layer: "Route", detail: { en: "GET /api/materials matched in materials.routes.js", fr: "GET /api/materials trouvé dans materials.routes.js" } },
          { layer: "Auth (JWT)", detail: { en: "Bearer token verified, user role attached", fr: "Jeton Bearer vérifié, rôle de l'utilisateur ajouté" } },
          { layer: "Validator (Joi)", detail: { en: "Query params ?page&limit validated", fr: "Paramètres ?page&limit validés" } },
          { layer: "Controller", detail: { en: "Reads the query, calls the service", fr: "Lit la requête, appelle le service" } },
          { layer: "Service", detail: { en: "Business rules: flags materials under minimum stock", fr: "Règles métier : signale les matières sous le stock minimum" } },
          { layer: "Repository", detail: { en: "Material.find().skip().limit()", fr: "Material.find().skip().limit()" } },
          { layer: "MongoDB", detail: { en: "Documents returned", fr: "Documents renvoyés" } },
        ],
        response: {
          success: true,
          page: 1,
          data: [
            { name: "Steel sheet 2mm", unit: "kg", stock: 1240, minStock: 300, lowStock: false },
            { name: "Copper wire", unit: "m", stock: 85, minStock: 200, lowStock: true },
          ],
        },
      },
      {
        method: "POST",
        path: "/api/production-orders",
        status: 201,
        steps: [
          { layer: "Route", detail: { en: "POST /api/production-orders", fr: "POST /api/production-orders" } },
          { layer: "Auth (JWT)", detail: { en: "Only managers may create orders", fr: "Seuls les responsables créent des ordres" } },
          { layer: "Validator (Joi)", detail: { en: "Body: product, quantity, materials[] validated", fr: "Corps : produit, quantité, materials[] validés" } },
          { layer: "Controller", detail: { en: "Passes the clean payload to the service", fr: "Transmet les données propres au service" } },
          { layer: "Service", detail: { en: "Stock check: every material must cover the order", fr: "Vérification du stock : chaque matière doit couvrir l'ordre" } },
          { layer: "Repository", detail: { en: "Creates the order and the OUT stock movements", fr: "Crée l'ordre et les mouvements de stock sortants" } },
          { layer: "MongoDB", detail: { en: "Order saved", fr: "Ordre enregistré" } },
        ],
        response: {
          success: true,
          data: { id: "po_0193", product: "Control panel", quantity: 40, status: "planned", stockChecked: true },
        },
      },
    ],
    story: {
      problem: {
        en: "A factory tracked raw materials, stock movements and production orders in separate places. Nobody could tell, before starting a production order, whether there was enough material to finish it.",
        fr: "Une usine suivait ses matières premières, ses mouvements de stock et ses ordres de production à des endroits différents. Personne ne pouvait dire, avant de lancer un ordre, s'il y avait assez de matière pour le terminer.",
      },
      built: [
        {
          title: { en: "Materials & stock movements", fr: "Matières & mouvements de stock" },
          body: { en: "CRUD for raw materials with IN/OUT movements, so stock is always the sum of its history.", fr: "CRUD des matières premières avec mouvements entrants/sortants : le stock est toujours la somme de son historique." },
        },
        {
          title: { en: "Production orders with a stock check", fr: "Ordres de production avec contrôle du stock" },
          body: { en: "An order is only accepted if every material it needs is in stock.", fr: "Un ordre n'est accepté que si chaque matière nécessaire est en stock." },
        },
        {
          title: { en: "JWT auth and roles", fr: "Authentification JWT et rôles" },
          body: { en: "Protected routes, role checks in a middleware, passwords hashed.", fr: "Routes protégées, rôles vérifiés dans un middleware, mots de passe hachés." },
        },
        {
          title: { en: "Validation and docs", fr: "Validation et documentation" },
          body: { en: "Joi schemas on every input and a Swagger UI describing each endpoint.", fr: "Schémas Joi sur chaque entrée et une Swagger UI qui décrit chaque endpoint." },
        },
        {
          title: { en: "Tests and Docker", fr: "Tests et Docker" },
          body: { en: "99 Jest tests in 9 suites; the API and MongoDB start with one Docker Compose command.", fr: "99 tests Jest dans 9 suites ; l'API et MongoDB démarrent avec une seule commande Docker Compose." },
        },
      ],
      hardest: {
        en: "The stock check before production. It touches several materials at once, so I moved it into the service layer, tested the edge cases first (exact stock, missing material, zero quantity) and only then wired the controller. The tests became the specification.",
        fr: "Le contrôle du stock avant production. Il touche plusieurs matières à la fois : je l'ai placé dans la couche service, j'ai d'abord testé les cas limites (stock exact, matière manquante, quantité nulle), puis seulement branché le contrôleur. Les tests sont devenus la spécification.",
      },
      learned: {
        en: "Layers are not ceremony: because each one has a single job, I could test the business rules without a database and change the database code without fear.",
        fr: "Les couches ne sont pas une cérémonie : comme chacune a un seul rôle, j'ai pu tester les règles métier sans base de données et modifier l'accès aux données sans crainte.",
      },
    },
    featured: true,
    order: 1,
  },
  {
    slug: "hosbank",
    title: "HosBank",
    pitch: {
      en: "A digital bank with three spaces, where every transfer is a SQL transaction.",
      fr: "Une banque digitale à trois espaces, où chaque virement est une transaction SQL.",
    },
    year: 2026,
    period: { en: "Aug – Oct 2026", fr: "Août – oct. 2026" },
    role: { en: "Lead developer", fr: "Développeuse principale" },
    team: 2,
    category: ["fullstack"],
    stack: ["Node.js", "Express", "EJS", "Tailwind CSS", "MySQL", "bcrypt", "Sessions"],
    links: { github: "https://github.com/razaane/HosBank" },
    marginNote: { en: "money never disappears", fr: "l'argent ne disparaît jamais" },
    metrics: [
      { label: { en: "Her commits", fr: "Ses commits" }, value: "~88 / 113" },
      { label: { en: "Spaces", fr: "Espaces" }, value: "3" },
      { label: { en: "Team", fr: "Équipe" }, value: "2" },
      { label: { en: "Architecture", fr: "Architecture" }, value: "N-tier" },
    ],
    tldr: [
      {
        en: "Three spaces: client, account manager and admin.",
        fr: "Trois espaces : client, gestionnaire de compte et admin.",
      },
      {
        en: "Transfers run inside SQL transactions: both sides commit or nothing does.",
        fr: "Les virements s'exécutent dans des transactions SQL : les deux côtés passent, ou rien.",
      },
      {
        en: "A bank account is created automatically when an admin approves a client.",
        fr: "Le compte bancaire est créé automatiquement quand un admin valide un client.",
      },
    ],
    architecture: {
      title: { en: "Strict N-tier flow", fr: "Flux N-tier strict" },
      layers: ["Route", "Session auth", "Validator", "Controller", "Service", "Repository", "MySQL"],
    },
    tour: [
      {
        method: "POST",
        path: "/transfers",
        status: 201,
        steps: [
          { layer: "Route", detail: { en: "POST /transfers from the client space", fr: "POST /transfers depuis l'espace client" } },
          { layer: "Session auth", detail: { en: "Session found, role = client", fr: "Session trouvée, rôle = client" } },
          { layer: "Validator", detail: { en: "Amount > 0, destination account exists", fr: "Montant > 0, compte destinataire existant" } },
          { layer: "Controller", detail: { en: "Calls transferService.send()", fr: "Appelle transferService.send()" } },
          { layer: "Service", detail: { en: "Checks balance, opens a transaction", fr: "Vérifie le solde, ouvre une transaction" } },
          { layer: "Repository", detail: { en: "Debit, credit and history row on one connection", fr: "Débit, crédit et historique sur une seule connexion" } },
          { layer: "MySQL", detail: { en: "COMMIT (or ROLLBACK on any error)", fr: "COMMIT (ou ROLLBACK à la moindre erreur)" } },
        ],
        response: {
          success: true,
          transfer: { id: 512, from: "HB-0042", to: "HB-0107", amount: 250.0, currency: "MAD", status: "completed" },
          balanceAfter: 1730.5,
        },
      },
    ],
    story: {
      problem: {
        en: "A bank needs three very different experiences: clients move money, account managers follow their clients, admins approve new accounts. And a transfer can never leave money half-sent.",
        fr: "Une banque a besoin de trois expériences très différentes : les clients déplacent de l'argent, les gestionnaires suivent leurs clients, les admins valident les nouveaux comptes. Et un virement ne doit jamais rester à moitié envoyé.",
      },
      built: [
        {
          title: { en: "Three role-based spaces", fr: "Trois espaces par rôle" },
          body: { en: "Client, account manager and admin, each with its own routes, views and guards.", fr: "Client, gestionnaire et admin, chacun avec ses routes, ses vues et ses gardes." },
        },
        {
          title: { en: "Transactional transfers", fr: "Virements transactionnels" },
          body: { en: "Debit, credit and history are written in one SQL transaction.", fr: "Débit, crédit et historique sont écrits dans une seule transaction SQL." },
        },
        {
          title: { en: "Approval flow", fr: "Flux de validation" },
          body: { en: "When an admin approves a client, the bank account is created automatically.", fr: "Quand un admin valide un client, le compte bancaire est créé automatiquement." },
        },
        {
          title: { en: "Secure sessions", fr: "Sessions sécurisées" },
          body: { en: "Passwords hashed with bcrypt, server-side sessions, EJS views styled with Tailwind.", fr: "Mots de passe hachés avec bcrypt, sessions côté serveur, vues EJS stylées avec Tailwind." },
        },
      ],
      hardest: {
        en: "Keeping transfers safe. The debit and the credit must happen together, so the repository takes one connection, begins a transaction and only commits when every query succeeded. Any error rolls everything back.",
        fr: "Sécuriser les virements. Le débit et le crédit doivent se produire ensemble : le repository prend une seule connexion, ouvre une transaction et ne valide que si toutes les requêtes ont réussi. Toute erreur annule l'ensemble.",
      },
      learned: {
        en: "Leading a team of two taught me to split work by layer, review every merge and keep the architecture strict even when a shortcut looks faster.",
        fr: "Mener une équipe de deux m'a appris à répartir le travail par couche, relire chaque merge et garder une architecture stricte même quand un raccourci semble plus rapide.",
      },
    },
    featured: true,
    order: 2,
  },
  {
    slug: "quickref",
    title: "QuickRef",
    pitch: {
      en: "Match assignments and allowances for a football league's referees, from Figma to final report.",
      fr: "Désignations et indemnités des arbitres d'une ligue de football, de Figma au rapport final.",
    },
    year: 2026,
    period: { en: "Mar – May 2026", fr: "Mars – mai 2026" },
    role: { en: "Solo · end-of-year project (PFR)", fr: "Solo · projet de fin d'année (PFR)" },
    team: 1,
    category: ["fullstack"],
    stack: ["Laravel 13", "PHP 8.4", "MySQL", "Tailwind CSS", "Figma", "UML"],
    links: { github: "https://github.com/razaane/QuickRef" },
    marginNote: { en: "I'm a referee too ♥", fr: "je suis arbitre aussi ♥" },
    metrics: [
      { label: { en: "Dashboards", fr: "Tableaux de bord" }, value: "2 roles" },
      { label: { en: "Deliverables", fr: "Livrables" }, value: "Spec · UML · Figma · report · pitch" },
      { label: { en: "League", fr: "Ligue" }, value: "Marrakech-Safi" },
      { label: { en: "Built by", fr: "Construit par" }, value: "a referee" },
    ],
    tldr: [
      {
        en: "Referee management for the Marrakech-Safi football league.",
        fr: "Gestion des arbitres de la ligue de football Marrakech-Safi.",
      },
      {
        en: "Assignments, match status and allowance payments in two role-based dashboards.",
        fr: "Désignations, statut des matchs et paiement des indemnités dans deux tableaux de bord par rôle.",
      },
      {
        en: "Full deliverables: specification, UML, Figma mock-ups, report and pitch.",
        fr: "Livrables complets : cahier des charges, UML, maquettes Figma, rapport et soutenance.",
      },
    ],
    architecture: {
      title: { en: "Laravel MVC", fr: "MVC Laravel" },
      layers: ["Route", "Auth + role middleware", "Form Request", "Controller", "Eloquent model", "MySQL"],
    },
    story: {
      problem: {
        en: "I referee in the Marrakech-Safi league. Assignments, match results and allowance payments were followed by hand, so referees did not always know where they were sent or what they were owed.",
        fr: "J'arbitre dans la ligue Marrakech-Safi. Les désignations, les résultats et le paiement des indemnités étaient suivis à la main : les arbitres ne savaient pas toujours où ils étaient désignés ni ce qu'on leur devait.",
      },
      built: [
        {
          title: { en: "Match assignments", fr: "Désignations" },
          body: { en: "The league assigns referees to matches; each referee sees their upcoming games.", fr: "La ligue désigne les arbitres ; chaque arbitre voit ses prochains matchs." },
        },
        {
          title: { en: "Match status", fr: "Statut des matchs" },
          body: { en: "Matches move from planned to played, and the dashboards update.", fr: "Les matchs passent de prévu à joué, et les tableaux de bord se mettent à jour." },
        },
        {
          title: { en: "Allowance payments", fr: "Paiement des indemnités" },
          body: { en: "Allowances are tracked per match so payments are clear for both sides.", fr: "Les indemnités sont suivies par match : les paiements sont clairs pour tout le monde." },
        },
        {
          title: { en: "Design first", fr: "Le design d'abord" },
          body: { en: "Figma mock-ups and UML diagrams came before the first line of PHP.", fr: "Maquettes Figma et diagrammes UML avant la première ligne de PHP." },
        },
      ],
      hardest: {
        en: "Designing for two very different users, the league and the referees, without building two apps. Role middleware and shared components kept one codebase with two clear dashboards.",
        fr: "Concevoir pour deux utilisateurs très différents, la ligue et les arbitres, sans construire deux applis. Un middleware de rôles et des composants partagés ont gardé une seule base de code avec deux tableaux de bord clairs.",
      },
      learned: {
        en: "Building for a world I know from the inside made every decision easier. It also taught me to deliver the whole package: spec, diagrams, design, code, report and pitch.",
        fr: "Construire pour un monde que je connais de l'intérieur a rendu chaque décision plus simple. J'ai aussi appris à livrer le tout : cahier des charges, diagrammes, design, code, rapport et soutenance.",
      },
    },
    featured: true,
    order: 3,
  },
  {
    slug: "wijha",
    title: "Wijha",
    pitch: {
      en: "A Moroccan travel super-app; I built host onboarding, KYC checks and the interactive map.",
      fr: "Une super-appli de voyage au Maroc ; j'ai construit l'onboarding des hôtes, la vérification KYC et la carte interactive.",
    },
    year: 2026,
    period: { en: "May – Jun 2026", fr: "Mai – juin 2026" },
    role: { en: "Co-developer", fr: "Co-développeuse" },
    team: 2,
    category: ["fullstack", "frontend"],
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "React Query", "Leaflet", "Laravel 11", "JWT"],
    links: { github: "https://github.com/razaane/Wijha" },
    marginNote: { en: "the map was so fun", fr: "la carte, un vrai plaisir" },
    metrics: [
      { label: { en: "Her commits", fr: "Ses commits" }, value: "34" },
      { label: { en: "Verticals", fr: "Univers" }, value: "4" },
      { label: { en: "Front-end", fr: "Front-end" }, value: "Next.js + TS" },
      { label: { en: "Team", fr: "Équipe" }, value: "2" },
    ],
    tldr: [
      {
        en: "Stays, activities, events and transport for travellers in Morocco.",
        fr: "Hébergements, activités, événements et transport pour voyager au Maroc.",
      },
      {
        en: "I built host onboarding with KYC verification and the Leaflet interactive map.",
        fr: "J'ai construit l'onboarding des hôtes avec vérification KYC et la carte interactive Leaflet.",
      },
      {
        en: "Also the traveller trips and ticket pages, plus UML diagrams.",
        fr: "Ainsi que les pages voyages et billets du voyageur, et les diagrammes UML.",
      },
    ],
    architecture: {
      title: { en: "Front-end to API", fr: "Du front à l'API" },
      layers: ["Next.js page", "React Query", "API client (JWT)", "Laravel route", "Controller", "Eloquent", "MySQL"],
    },
    story: {
      problem: {
        en: "Travelling in Morocco means juggling separate apps for a riad, a desert trip, a concert and a bus ticket. Wijha puts them in one place, and hosts need a trusted way to join.",
        fr: "Voyager au Maroc, c'est jongler entre des applis différentes pour un riad, une excursion dans le désert, un concert et un billet de bus. Wijha réunit tout, et les hôtes ont besoin d'une façon fiable de rejoindre la plateforme.",
      },
      built: [
        {
          title: { en: "Host onboarding", fr: "Onboarding des hôtes" },
          body: { en: "A step-by-step flow for hosts to create their profile and listings.", fr: "Un parcours étape par étape pour que les hôtes créent leur profil et leurs annonces." },
        },
        {
          title: { en: "KYC verification", fr: "Vérification KYC" },
          body: { en: "Identity checks before a host can publish, so travellers can trust listings.", fr: "Vérification d'identité avant publication, pour que les voyageurs puissent faire confiance aux annonces." },
        },
        {
          title: { en: "Interactive map", fr: "Carte interactive" },
          body: { en: "A Leaflet map to explore stays and activities across the country.", fr: "Une carte Leaflet pour explorer hébergements et activités dans tout le pays." },
        },
        {
          title: { en: "Trips and tickets", fr: "Voyages et billets" },
          body: { en: "Traveller pages for upcoming trips and their tickets, animated with Framer Motion.", fr: "Pages voyageur pour les prochains voyages et leurs billets, animées avec Framer Motion." },
        },
      ],
      hardest: {
        en: "Leaflet needs the browser's window, but Next.js renders on the server first. I loaded the map as a client-only component and kept the data fetching in React Query so the page stays fast and the map still feels instant.",
        fr: "Leaflet a besoin de la fenêtre du navigateur, mais Next.js rend d'abord côté serveur. J'ai chargé la carte comme composant client uniquement et gardé les données dans React Query : la page reste rapide et la carte paraît instantanée.",
      },
      learned: {
        en: "TypeScript and React Query changed how I think about front-end data: typed contracts with the API, caching, and loading states designed on purpose.",
        fr: "TypeScript et React Query ont changé ma façon de penser les données côté front : des contrats typés avec l'API, du cache, et des états de chargement pensés exprès.",
      },
    },
    featured: true,
    order: 4,
  },
  {
    slug: "cinehall",
    title: "CinéHall",
    pitch: {
      en: "Cinema seat booking with Stripe payments; I ran the repo for a team of five.",
      fr: "Réservation de places de cinéma avec paiement Stripe ; j'ai géré le dépôt pour une équipe de cinq.",
    },
    year: 2026,
    period: { en: "Mar – May 2026", fr: "Mars – mai 2026" },
    role: { en: "Repo owner & integrator", fr: "Propriétaire du dépôt & intégratrice" },
    team: 5,
    category: ["api"],
    stack: ["Laravel", "Sanctum", "Stripe", "Swagger", "MySQL", "Git-flow"],
    links: { github: "https://github.com/razaane/Cin-Hall-API-Backend-pour-la-R-servation-de-Si-ges-de-Cin-ma" },
    marginNote: { en: "10+ PRs merged!", fr: "10+ PR fusionnées !" },
    metrics: [
      { label: { en: "PRs reviewed & merged", fr: "PR relues & fusionnées" }, value: "10+" },
      { label: { en: "Branching", fr: "Branches" }, value: "Git-flow" },
      { label: { en: "Payments", fr: "Paiements" }, value: "Stripe" },
      { label: { en: "Team", fr: "Équipe" }, value: "5" },
    ],
    tldr: [
      {
        en: "REST API to browse showtimes, pick seats and pay with Stripe.",
        fr: "API REST pour parcourir les séances, choisir ses places et payer avec Stripe.",
      },
      {
        en: "I owned the repository: reviewed and merged 10+ pull requests and resolved conflicts.",
        fr: "J'étais responsable du dépôt : 10+ pull requests relues et fusionnées, conflits résolus.",
      },
      {
        en: "Git-flow with a develop branch, documented with Swagger.",
        fr: "Git-flow avec une branche develop, documentée avec Swagger.",
      },
    ],
    architecture: {
      title: { en: "Booking flow", fr: "Flux de réservation" },
      layers: ["Route", "Sanctum", "Form Request", "Controller", "Service", "Stripe", "MySQL"],
    },
    story: {
      problem: {
        en: "A cinema needs to sell seats online without selling the same seat twice, and five developers needed to build it together without breaking each other's work.",
        fr: "Un cinéma doit vendre ses places en ligne sans vendre deux fois la même, et cinq développeurs devaient la construire ensemble sans casser le travail des autres.",
      },
      built: [
        {
          title: { en: "Showtimes and seats", fr: "Séances et places" },
          body: { en: "Endpoints for films, showtimes, halls and seat availability.", fr: "Endpoints pour les films, séances, salles et disponibilité des places." },
        },
        {
          title: { en: "Stripe payments", fr: "Paiements Stripe" },
          body: { en: "A reservation is confirmed after payment.", fr: "Une réservation est confirmée après paiement." },
        },
        {
          title: { en: "Token auth", fr: "Authentification par jeton" },
          body: { en: "Laravel Sanctum protects bookings and user data.", fr: "Laravel Sanctum protège les réservations et les données des utilisateurs." },
        },
        {
          title: { en: "Team workflow", fr: "Workflow d'équipe" },
          body: { en: "Git-flow, a protected develop branch, PR reviews and a Swagger contract everyone could read.", fr: "Git-flow, une branche develop protégée, des revues de PR et un contrat Swagger lisible par tous." },
        },
      ],
      hardest: {
        en: "Being the integrator. With five people pushing features, merge conflicts were constant. I kept a develop branch, reviewed every pull request and resolved conflicts with their authors so main always worked.",
        fr: "Être l'intégratrice. Avec cinq personnes qui poussaient des fonctionnalités, les conflits étaient constants. J'ai gardé une branche develop, relu chaque pull request et résolu les conflits avec leurs auteurs pour que main fonctionne toujours.",
      },
      learned: {
        en: "Code review is a team skill. Clear branches, small PRs and kind, precise comments matter as much as the code itself.",
        fr: "La code review est une compétence d'équipe. Des branches claires, de petites PR et des commentaires précis et bienveillants comptent autant que le code.",
      },
    },
    featured: true,
    order: 5,
  },
  {
    slug: "sell4all",
    title: "Sell4All",
    pitch: {
      en: "Six months of shop data, cleaned and charted with JavaScript.",
      fr: "Six mois de données d'une boutique, nettoyées et visualisées en JavaScript.",
    },
    year: 2026,
    period: { en: "Sep – Oct 2026", fr: "Sept. – oct. 2026" },
    role: { en: "Solo", fr: "Solo" },
    team: 1,
    category: ["data"],
    stack: ["Node.js", "csv-parse", "Chart.js"],
    links: { github: "https://github.com/razaane/Sell4All" },
    marginNote: { en: "web dev × data science", fr: "dev web × data science" },
    metrics: [
      { label: { en: "Statistics", fr: "Statistiques" }, value: "mean · median" },
      { label: { en: "Cleaning", fr: "Nettoyage" }, value: "outliers · duplicates" },
      { label: { en: "Output", fr: "Sortie" }, value: "clean CSV" },
      { label: { en: "Chart", fr: "Graphique" }, value: "spend by country" },
    ],
    tldr: [
      {
        en: "Explored and cleaned a customer dataset with Node.js.",
        fr: "Exploration et nettoyage d'un jeu de données clients avec Node.js.",
      },
      {
        en: "Computed mean and median, removed outliers and duplicates.",
        fr: "Calcul de la moyenne et de la médiane, suppression des valeurs aberrantes et des doublons.",
      },
      {
        en: "Exported a clean CSV and charted spend by country with Chart.js.",
        fr: "Export d'un CSV propre et graphique des dépenses par pays avec Chart.js.",
      },
    ],
    architecture: {
      title: { en: "Data pipeline", fr: "Pipeline de données" },
      layers: ["Raw CSV", "csv-parse", "Clean (outliers)", "Dedupe", "Stats", "Clean CSV", "Chart.js"],
    },
    story: {
      problem: {
        en: "A shop had six months of customer data and one question: where does the money come from? The raw file had duplicates and suspicious tiny spends, so any chart drawn from it would lie.",
        fr: "Une boutique avait six mois de données clients et une question : d'où vient l'argent ? Le fichier brut contenait des doublons et de petites dépenses suspectes : tout graphique tiré de ces données aurait menti.",
      },
      built: [
        {
          title: { en: "Parsing", fr: "Lecture" },
          body: { en: "Read the CSV in Node.js with csv-parse and type every column.", fr: "Lecture du CSV en Node.js avec csv-parse et typage de chaque colonne." },
        },
        {
          title: { en: "Descriptive stats", fr: "Statistiques descriptives" },
          body: { en: "Mean and median spend, before and after cleaning.", fr: "Dépense moyenne et médiane, avant et après nettoyage." },
        },
        {
          title: { en: "Cleaning", fr: "Nettoyage" },
          body: { en: "Removed outliers and duplicate rows, then exported a clean CSV.", fr: "Suppression des valeurs aberrantes et des doublons, puis export d'un CSV propre." },
        },
        {
          title: { en: "Visualisation", fr: "Visualisation" },
          body: { en: "A Chart.js bar chart of spend by country.", fr: "Un graphique en barres Chart.js des dépenses par pays." },
        },
      ],
      hardest: {
        en: "Deciding what counts as dirty data. Removing too much hides real customers; removing too little skews the mean. Comparing mean and median after each step showed which rule actually mattered.",
        fr: "Décider ce qui est une donnée sale. Trop supprimer cache de vrais clients ; pas assez fausse la moyenne. Comparer moyenne et médiane après chaque étape a montré quelle règle comptait vraiment.",
      },
      learned: {
        en: "This is where my two studies meet: the same JavaScript I use for web apps can answer data questions, and statistics keep the charts honest.",
        fr: "C'est là que mes deux formations se rejoignent : le JavaScript de mes applis web peut répondre à des questions de données, et les statistiques gardent les graphiques honnêtes.",
      },
    },
    featured: true,
    order: 6,
  },
];

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const moreProjects: MiniProject[] = [
  {
    title: "MachineCare",
    blurb: { en: "Machine maintenance API with JWT auth, dockerised.", fr: "API de maintenance de machines avec JWT, dockerisée." },
    stack: ["Express", "MongoDB", "JWT", "Docker"],
    github: "https://github.com/razaane/MachineCare",
  },
  {
    title: "ToolShare",
    blurb: { en: "Tool-sharing API, in progress, test-first.", fr: "API de partage d'outils, en cours, tests d'abord." },
    stack: ["Express", "MongoDB", "Jest"],
    github: "https://github.com/razaane/ToolShare",
  },
  {
    title: "Smart-Bank",
    blurb: { en: "Vanilla JS single-page app with a router and an auth guard.", fr: "SPA en JS natif avec routeur et garde d'authentification." },
    stack: ["JavaScript", "Vite"],
    github: "https://github.com/razaane/Smart-Bank",
  },
  {
    title: "MarocExplore",
    blurb: { en: "Travel itineraries API with Sanctum and Swagger.", fr: "API d'itinéraires de voyage avec Sanctum et Swagger." },
    stack: ["Laravel", "Sanctum", "Swagger"],
    github: "https://github.com/razaane/MarocExplore",
  },
  {
    title: "EasyColoc",
    blurb: { en: "Shared-flat expenses, split fairly.", fr: "Dépenses de colocation, partagées équitablement." },
    stack: ["Laravel", "MySQL"],
    github: "https://github.com/razaane/EasyColoc",
  },
  {
    title: "Kari",
    blurb: { en: "Rental platform in PHP MVC.", fr: "Plateforme de location en PHP MVC." },
    stack: ["PHP", "MVC", "PDO"],
    github: "https://github.com/razaane/Kari",
  },
  {
    title: "Smart Wallet",
    blurb: { en: "A budget app rebuilt three times: V2 → 3.0 → MVC.", fr: "Une appli budget reconstruite trois fois : V2 → 3.0 → MVC." },
    stack: ["PHP", "OOP", "MVC"],
    github: "https://github.com/razaane",
  },
  {
    title: "SkyCast",
    blurb: { en: "Weather app fetching a public API.", fr: "Appli météo branchée sur une API publique." },
    stack: ["JavaScript", "API"],
    github: "https://github.com/razaane/SkyCast",
  },
  {
    title: "Bouncing Ball",
    blurb: { en: "A tiny canvas game. Also playable in The Lab.", fr: "Un petit jeu canvas. Jouable aussi dans Le Labo." },
    stack: ["JavaScript", "Canvas"],
    github: "https://github.com/razaane",
  },
];
