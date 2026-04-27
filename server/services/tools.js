/**
 * Film Distribution Tools — Node.js equivalents of the Python distribution_tools.py
 */

const FESTIVAL_DATABASE = {
  // Tier 1 — Majors
  sundance: {
    name: "Sundance Film Festival", tier: 1, location: "Park City, UT, USA",
    month: "January", deadline: "Late August", fee: "$80-90",
    accepts: ["feature", "short", "documentary"],
    best_for: ["US indie drama", "debut features", "social issue docs"],
    prestige: "highest", website: "sundance.org",
    notes: "Most competitive US festival. World premiere required for main competition.",
  },
  cannes: {
    name: "Cannes Film Festival", tier: 1, location: "Cannes, France",
    month: "May", deadline: "March (invitation only)", fee: "N/A (invited)",
    accepts: ["feature", "short"],
    best_for: ["auteur cinema", "European prestige", "world cinema"],
    prestige: "highest", website: "festival-cannes.com",
    notes: "Invitation-only for Competition. La Semaine de la Critique and Critics' Week accept submissions.",
  },
  tiff: {
    name: "Toronto International Film Festival", tier: 1, location: "Toronto, Canada",
    month: "September", deadline: "April-May", fee: "$100-175",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Oscars launchpad", "audience favorites", "mainstream prestige"],
    prestige: "highest", website: "tiff.net",
    notes: "Best launchpad for awards season. Accepts non-world premieres unlike Sundance.",
  },
  berlinale: {
    name: "Berlin International Film Festival", tier: 1, location: "Berlin, Germany",
    month: "February", deadline: "October-November", fee: "€30-50",
    accepts: ["feature", "documentary", "short"],
    best_for: ["political cinema", "European arthouse", "social realism"],
    prestige: "highest", website: "berlinale.de",
    notes: "Strong political tradition. Forum and Panorama sections more accessible than Competition.",
  },
  venice: {
    name: "Venice Film Festival", tier: 1, location: "Venice, Italy",
    month: "August-September", deadline: "June", fee: "€50-80",
    accepts: ["feature", "documentary", "short"],
    best_for: ["arthouse prestige", "Oscars foreign language", "auteur cinema"],
    prestige: "highest", website: "labiennale.org/en/cinema",
    notes: "Opens awards season. Horizons section for more experimental/debut work.",
  },
  locarno: {
    name: "Locarno Film Festival", tier: 1, location: "Locarno, Switzerland",
    month: "August", deadline: "April-May", fee: "CHF 50-80",
    accepts: ["feature", "short"],
    best_for: ["debut films", "risk-taking cinema", "world cinema"],
    prestige: "very high", website: "locarnofestival.ch",
    notes: "Champions debut and second features. Piazza Grande screens to 8,000 people.",
  },
  // Tier 2 — Major Regional
  nyff: {
    name: "New York Film Festival", tier: 2, location: "New York, USA",
    month: "September-October", deadline: "May-June", fee: "$50-85",
    accepts: ["feature", "documentary", "short"],
    best_for: ["prestige arthouse", "awards positioning", "critics' darlings"],
    prestige: "very high", website: "filmlinc.org",
    notes: "Highly selective (20 features in Main Slate). No jury prizes — pure curatorial prestige.",
  },
  telluride: {
    name: "Telluride Film Festival", tier: 2, location: "Telluride, CO, USA",
    month: "September (Labor Day)", deadline: "Invitation only", fee: "N/A",
    accepts: ["feature"],
    best_for: ["Oscar season launch", "prestige drama", "awards contenders"],
    prestige: "very high", website: "telluridefilmfestival.org",
    notes: "No submissions — invitations only. Runs same weekend as TIFF.",
  },
  sxsw: {
    name: "SXSW Film & TV Festival", tier: 2, location: "Austin, TX, USA",
    month: "March", deadline: "October-November", fee: "$75-95",
    accepts: ["feature", "documentary", "short", "episodic"],
    best_for: ["genre films", "tech-forward storytelling", "US indie"],
    prestige: "high", website: "sxsw.com/film",
    notes: "Strong industry presence, good for genre. Accepts Texas premieres.",
  },
  tribeca: {
    name: "Tribeca Film Festival", tier: 2, location: "New York, USA",
    month: "June", deadline: "January", fee: "$65-85",
    accepts: ["feature", "documentary", "short", "episodic"],
    best_for: ["New York stories", "social justice docs", "debut features"],
    prestige: "high", website: "tribecafilm.com",
    notes: "Good industry access. Accepts North American and US premieres.",
  },
  hot_docs: {
    name: "Hot Docs Canadian International Documentary Festival", tier: 2, location: "Toronto, Canada",
    month: "April-May", deadline: "October-December", fee: "CAD $65-95",
    accepts: ["documentary"],
    best_for: ["feature docs", "investigative journalism", "social impact"],
    prestige: "high", website: "hotdocs.ca",
    notes: "Largest doc festival in North America. Excellent for doc sales.",
  },
  idfa: {
    name: "IDFA — International Documentary Film Festival Amsterdam", tier: 2, location: "Amsterdam, Netherlands",
    month: "November", deadline: "June-July", fee: "€40-60",
    accepts: ["documentary"],
    best_for: ["feature docs", "experimental nonfiction", "European sales"],
    prestige: "high", website: "idfa.nl",
    notes: "World's largest doc festival. Strong forum for co-productions.",
  },
  rotterdam: {
    name: "International Film Festival Rotterdam (IFFR)", tier: 2, location: "Rotterdam, Netherlands",
    month: "January-February", deadline: "September-October", fee: "€30-50",
    accepts: ["feature", "short", "documentary"],
    best_for: ["experimental cinema", "debut films", "risk-taking work"],
    prestige: "high", website: "iffr.com",
    notes: "Tiger Award for debut/second features. Strong for challenging work.",
  },
  san_sebastian: {
    name: "San Sebastián International Film Festival", tier: 2, location: "San Sebastián, Spain",
    month: "September", deadline: "May-June", fee: "€30-50",
    accepts: ["feature", "documentary"],
    best_for: ["Spanish/Latin American cinema", "European prestige"],
    prestige: "high", website: "sansebastianfestival.com",
    notes: "Strong for Ibero-American and European cinema. Good industry market.",
  },
  busan: {
    name: "Busan International Film Festival", tier: 2, location: "Busan, South Korea",
    month: "October", deadline: "June-July", fee: "₩30,000-50,000",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Asian cinema", "world cinema debut", "Pacific Rim sales"],
    prestige: "high", website: "biff.kr",
    notes: "Asia's most important festival. New Currents section for Asian debut/second films.",
  },
  karlovy_vary: {
    name: "Karlovy Vary International Film Festival", tier: 2, location: "Karlovy Vary, Czech Republic",
    month: "June-July", deadline: "March-April", fee: "€30-50",
    accepts: ["feature", "documentary"],
    best_for: ["Central/Eastern European cinema", "world cinema"],
    prestige: "high", website: "kviff.com",
    notes: "Strongest festival in Central Europe. Good for films seeking European distribution.",
  },
  edinburgh: {
    name: "Edinburgh International Film Festival", tier: 2, location: "Edinburgh, UK",
    month: "August", deadline: "March-April", fee: "£35-55",
    accepts: ["feature", "documentary", "short"],
    best_for: ["UK/Scottish cinema", "world cinema", "thriller/genre"],
    prestige: "high", website: "edfilmfest.org.uk",
    notes: "World's oldest film festival. World premiere prestige for UK films.",
  },
  bfi_london: {
    name: "BFI London Film Festival", tier: 2, location: "London, UK",
    month: "October", deadline: "June-July", fee: "£40-60",
    accepts: ["feature", "documentary", "short"],
    best_for: ["awards positioning UK", "prestige world cinema", "documentary"],
    prestige: "high", website: "bfi.org.uk/lff",
    notes: "Strong awards season position. Accepts UK premieres and world premieres.",
  },
  afi_fest: {
    name: "AFI Fest", tier: 2, location: "Los Angeles, USA",
    month: "October-November", deadline: "August", fee: "$65-85",
    accepts: ["feature", "documentary", "short"],
    best_for: ["awards season positioning", "Hollywood proximity", "world cinema"],
    prestige: "high", website: "afifest.afi.com",
    notes: "Free screenings, strong industry attendance. Good for awards-contending films.",
  },
  sarajevo: {
    name: "Sarajevo Film Festival", tier: 2, location: "Sarajevo, Bosnia & Herzegovina",
    month: "August", deadline: "March-April", fee: "€20-35",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Balkan/regional cinema", "social realism", "political film"],
    prestige: "high", website: "sff.ba",
    notes: "Most important festival in Southeast Europe. Heart of Europe award prestigious.",
  },
  cphdox: {
    name: "CPH:DOX Copenhagen Documentary Festival", tier: 2, location: "Copenhagen, Denmark",
    month: "March", deadline: "November-December", fee: "DKK 300-500",
    accepts: ["documentary", "hybrid"],
    best_for: ["experimental doc", "art/doc crossover", "Nordic cinema"],
    prestige: "high", website: "cphdox.dk",
    notes: "Strong for boundary-pushing documentary and hybrid work.",
  },
  sheffield_docfest: {
    name: "Sheffield DocFest", tier: 2, location: "Sheffield, UK",
    month: "June", deadline: "February-March", fee: "£30-50",
    accepts: ["documentary"],
    best_for: ["UK doc market", "investigative docs", "interactive/VR"],
    prestige: "high", website: "sheffdocfest.com",
    notes: "Major UK doc market. MeetMarket co-production event for projects in development.",
  },
  full_frame: {
    name: "Full Frame Documentary Film Festival", tier: 2, location: "Durham, NC, USA",
    month: "April", deadline: "November-December", fee: "$55-75",
    accepts: ["documentary"],
    best_for: ["feature docs", "intimate personal films", "social issue"],
    prestige: "high", website: "fullframefest.org",
    notes: "Beloved US doc festival. Strong for personal/intimate documentaries.",
  },
  true_false: {
    name: "True/False Film Fest", tier: 2, location: "Columbia, MO, USA",
    month: "February-March", deadline: "October-November", fee: "$45-65",
    accepts: ["documentary"],
    best_for: ["innovative doc", "hybrid nonfiction", "artistic documentary"],
    prestige: "high", website: "truefalse.org",
    notes: "Cult festival for adventurous documentary. No press — pure audience experience.",
  },
  annecy: {
    name: "Annecy International Animation Film Festival", tier: 2, location: "Annecy, France",
    month: "June", deadline: "January-February", fee: "€30-50",
    accepts: ["animated feature", "animated short"],
    best_for: ["animation", "animated documentary", "VR animation"],
    prestige: "highest for animation", website: "annecy.org",
    notes: "World's top animation festival. Essential for any animated feature or short.",
  },
  fantasia: {
    name: "Fantasia International Film Festival", tier: 2, location: "Montreal, Canada",
    month: "July", deadline: "April-May", fee: "CAD $50-70",
    accepts: ["feature", "short"],
    best_for: ["genre", "horror", "sci-fi", "action", "anime"],
    prestige: "high for genre", website: "fantasiafestival.com",
    notes: "Premier genre festival in North America. Strong for horror, sci-fi, Asian genre.",
  },
  sitges: {
    name: "Sitges Film Festival (Catalonia)", tier: 2, location: "Sitges, Spain",
    month: "October", deadline: "June-July", fee: "€30-50",
    accepts: ["feature", "short"],
    best_for: ["horror", "fantasy", "genre", "cult cinema"],
    prestige: "highest for genre", website: "sitgesfilmfestival.com",
    notes: "World's top genre festival. Essential for horror/fantasy features.",
  },
  tallinn: {
    name: "Tallinn Black Nights Film Festival (PÖFF)", tier: 2, location: "Tallinn, Estonia",
    month: "November", deadline: "June-July", fee: "€30-50",
    accepts: ["feature", "documentary", "short", "animation"],
    best_for: ["Baltic/Nordic cinema", "world cinema", "debut features"],
    prestige: "high", website: "poff.ee",
    notes: "FIAPF-accredited A-list festival. Strong for European cinema.",
  },
  clermont_ferrand: {
    name: "Clermont-Ferrand International Short Film Festival", tier: 2, location: "Clermont-Ferrand, France",
    month: "February", deadline: "September-October", fee: "€20-35",
    accepts: ["short"],
    best_for: ["short fiction", "short documentary", "animation shorts"],
    prestige: "highest for shorts", website: "clermont-filmfest.com",
    notes: "World's most important short film festival and market. Essential for shorts.",
  },
  // Tier 3 — Strong Regional/Specialty
  siff: {
    name: "Seattle International Film Festival", tier: 3, location: "Seattle, WA, USA",
    month: "May-June", deadline: "January-February", fee: "$50-70",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Northwest US audience", "world cinema", "doc"],
    prestige: "medium-high", website: "siff.net",
    notes: "Largest film festival in USA by attendance. Good audience reach.",
  },
  doc_nyc: {
    name: "DOC NYC", tier: 3, location: "New York, USA",
    month: "November", deadline: "July-August", fee: "$55-75",
    accepts: ["documentary"],
    best_for: ["feature docs", "short docs", "Oscar doc qualifying"],
    prestige: "medium-high", website: "docnyc.net",
    notes: "America's largest doc festival. Oscar qualifying for shorts.",
  },
  frameline: {
    name: "Frameline San Francisco International LGBTQ+ Film Festival", tier: 3, location: "San Francisco, USA",
    month: "June", deadline: "January-February", fee: "$40-60",
    accepts: ["feature", "documentary", "short"],
    best_for: ["LGBTQ+ cinema", "queer stories", "community audience"],
    prestige: "high within niche", website: "frameline.org",
    notes: "World's largest LGBTQ+ film festival. Excellent for queer-themed work.",
  },
  outfest: {
    name: "Outfest Los Angeles LGBTQ Film Festival", tier: 3, location: "Los Angeles, USA",
    month: "July", deadline: "March-April", fee: "$40-60",
    accepts: ["feature", "documentary", "short"],
    best_for: ["LGBTQ+ cinema", "LA industry access"],
    prestige: "high within niche", website: "outfest.org",
    notes: "Hollywood proximity makes this valuable for LGBTQ+ filmmakers seeking industry.",
  },
  bfi_flare: {
    name: "BFI Flare London LGBTQ+ Film Festival", tier: 3, location: "London, UK",
    month: "March", deadline: "November-December", fee: "£30-50",
    accepts: ["feature", "documentary", "short"],
    best_for: ["LGBTQ+ cinema", "UK/European queer film"],
    prestige: "high within niche", website: "bfi.org.uk/flare",
    notes: "Europe's largest LGBTQ+ film festival.",
  },
  inside_out: {
    name: "Inside Out 2SLGBTQ+ Film Festival", tier: 3, location: "Toronto, Canada",
    month: "May", deadline: "January", fee: "CAD $40-60",
    accepts: ["feature", "documentary", "short"],
    best_for: ["LGBTQ+ cinema", "Canadian queer film"],
    prestige: "high within niche", website: "insideout.ca",
    notes: "Canada's largest queer film festival.",
  },
  palm_springs: {
    name: "Palm Springs International Film Festival", tier: 3, location: "Palm Springs, CA, USA",
    month: "January", deadline: "September-October", fee: "$65-85",
    accepts: ["feature", "documentary"],
    best_for: ["foreign language Oscar campaigning", "world cinema gala"],
    prestige: "high", website: "psfilmfest.org",
    notes: "Major stop for foreign language Oscar campaigns. Strong gala screenings.",
  },
  palm_springs_shorts: {
    name: "Palm Springs International ShortFest", tier: 3, location: "Palm Springs, CA, USA",
    month: "June", deadline: "March-April", fee: "$40-55",
    accepts: ["short"],
    best_for: ["shorts Oscar qualifying", "short fiction", "animation shorts"],
    prestige: "high for shorts", website: "psfilmfest.org/shortfest",
    notes: "Largest short film festival in North America. Oscar qualifying.",
  },
  docaviv: {
    name: "DocAviv Tel Aviv International Documentary Film Festival", tier: 3, location: "Tel Aviv, Israel",
    month: "May", deadline: "January-February", fee: "₪150-250",
    accepts: ["documentary"],
    best_for: ["Israeli docs", "Middle East stories", "regional prestige"],
    prestige: "high within region", website: "docaviv.co.il",
    notes: "Israel's top documentary festival. Good for Middle East/Israeli co-productions.",
  },
  haifa: {
    name: "Haifa International Film Festival", tier: 3, location: "Haifa, Israel",
    month: "October", deadline: "June-July", fee: "₪100-200",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Israeli cinema", "Mediterranean cinema", "debut features"],
    prestige: "medium-high", website: "haifaff.co.il",
    notes: "Israel's oldest film festival. Good for Israeli and Mediterranean films.",
  },
  jerusalem: {
    name: "Jerusalem Film Festival", tier: 3, location: "Jerusalem, Israel",
    month: "July", deadline: "March-April", fee: "₪100-200",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Israeli cinema", "Jewish-themed films", "Mediterranean"],
    prestige: "medium-high", website: "jff.org.il",
    notes: "Cinémathèque Jerusalem runs this. Strong for Israeli and culturally Jewish films.",
  },
  santa_barbara: {
    name: "Santa Barbara International Film Festival", tier: 3, location: "Santa Barbara, CA, USA",
    month: "February", deadline: "October-November", fee: "$55-75",
    accepts: ["feature", "documentary", "short"],
    best_for: ["awards season launchpad", "international films", "Santa Barbara tribute"],
    prestige: "medium-high", website: "sbiff.org",
    notes: "Strong Hollywood industry presence. Tribute awards draw major talent.",
  },
  miami: {
    name: "Miami Film Festival", tier: 3, location: "Miami, FL, USA",
    month: "March", deadline: "November-December", fee: "$45-65",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Latin American cinema", "Spanish-language films", "Florida premiere"],
    prestige: "medium", website: "miamifilmfestival.com",
    notes: "Gateway for Latin American cinema in the US. Strong Spanish-language programming.",
  },
  austin: {
    name: "Austin Film Festival", tier: 3, location: "Austin, TX, USA",
    month: "October", deadline: "June-July", fee: "$50-70",
    accepts: ["feature", "documentary", "short", "episodic"],
    best_for: ["screenplay-driven films", "writing-focused stories"],
    prestige: "medium", website: "austinfilmfestival.com",
    notes: "Strong screenwriting competition alongside film program.",
  },
  fantastic_fest: {
    name: "Fantastic Fest", tier: 3, location: "Austin, TX, USA",
    month: "September", deadline: "June-July", fee: "$45-65",
    accepts: ["feature", "short"],
    best_for: ["genre", "horror", "sci-fi", "action", "cult film"],
    prestige: "high within genre", website: "fantasticfest.com",
    notes: "Beloved by genre fans and press. Good for cult/genre US premiere.",
  },
  overlook: {
    name: "Overlook Film Festival", tier: 3, location: "New Orleans, LA, USA",
    month: "April-May", deadline: "January-February", fee: "$45-65",
    accepts: ["feature", "short"],
    best_for: ["horror", "elevated genre", "dark cinema"],
    prestige: "medium-high within horror", website: "overlookfilmfest.com",
    notes: "Premier US horror festival. Great for elevated horror and dark genre work.",
  },
  frightfest: {
    name: "FrightFest", tier: 3, location: "London, UK",
    month: "August", deadline: "May-June", fee: "£30-50",
    accepts: ["feature", "short"],
    best_for: ["horror", "fantasy", "thriller", "UK genre"],
    prestige: "high within genre", website: "frightfest.co.uk",
    notes: "UK's most important horror festival. Runs during BFI Southbank's season.",
  },
  nantucket: {
    name: "Nantucket Film Festival", tier: 3, location: "Nantucket, MA, USA",
    month: "June", deadline: "February-March", fee: "$45-65",
    accepts: ["feature", "documentary", "short"],
    best_for: ["writer-directors", "story-driven drama", "US indie"],
    prestige: "medium", website: "nantucketfilmfestival.org",
    notes: "Focus on craft of screenwriting. Intimate industry event.",
  },
  woodstock: {
    name: "Woodstock Film Festival", tier: 3, location: "Woodstock, NY, USA",
    month: "October", deadline: "June-July", fee: "$40-60",
    accepts: ["feature", "documentary", "short"],
    best_for: ["US indie", "New York area premiere", "arthouse"],
    prestige: "medium", website: "woodstockfilmfestival.org",
    notes: "Lovely regional fest with NYC industry presence.",
  },
  aff_docs: {
    name: "American Film Festival (Poland)", tier: 3, location: "Wrocław, Poland",
    month: "November", deadline: "August-September", fee: "€25-40",
    accepts: ["documentary", "feature"],
    best_for: ["American indie films", "docs in Poland", "Central European reach"],
    prestige: "medium", website: "americanfilmfestival.pl",
    notes: "Good for American films seeking Central/Eastern European distribution.",
  },
  hamptons: {
    name: "Hamptons International Film Festival", tier: 3, location: "East Hampton, NY, USA",
    month: "October", deadline: "July-August", fee: "$50-70",
    accepts: ["feature", "documentary", "short"],
    best_for: ["awards-contending films", "Hamptons audience", "NYC industry"],
    prestige: "medium-high", website: "hamptonsfilmfest.org",
    notes: "Strong awards-season positioning. Affluent, film-literate audience.",
  },
  nashville: {
    name: "Nashville Film Festival", tier: 3, location: "Nashville, TN, USA",
    month: "April", deadline: "January-February", fee: "$40-60",
    accepts: ["feature", "documentary", "short", "music video"],
    best_for: ["music films", "Southern stories", "US indie"],
    prestige: "medium", website: "nashvillefilmfestival.org",
    notes: "Strong for music-related films. Good southern US premiere.",
  },
  morelia: {
    name: "Morelia International Film Festival", tier: 3, location: "Morelia, Mexico",
    month: "October", deadline: "June-July", fee: "MXN 500-800",
    accepts: ["feature", "documentary", "short"],
    best_for: ["Mexican cinema", "Latin American debut", "Spanish-language"],
    prestige: "high within region", website: "moreliafilmfest.com",
    notes: "Mexico's most prestigious film festival. Essential for Mexican and Latin filmmakers.",
  },
  ji_hlava: {
    name: "Ji.hlava International Documentary Film Festival", tier: 3, location: "Jihlava, Czech Republic",
    month: "October", deadline: "June-July", fee: "€20-35",
    accepts: ["documentary", "hybrid"],
    best_for: ["experimental doc", "Central European doc", "hybrid nonfiction"],
    prestige: "high within doc world", website: "ji-hlava.com",
    notes: "Central Europe's top doc festival. Strong for experimental and essay film.",
  },
};

const PLATFORM_DATABASE = {
  mubi: {
    name: "MUBI", tier: "prestige curated",
    model: "SVOD + theatrical", typical_fee: "$5,000-50,000 MG",
    submission: "Via sales agent or direct pitch to acquisitions",
    best_for: ["arthouse", "international", "festival circuit films"],
    notes: "30-day exclusive window per film. Prestige brand. Very selective.",
    contact: "acquisitions@mubi.com",
  },
  criterion_channel: {
    name: "The Criterion Channel", tier: "prestige curated",
    model: "SVOD", typical_fee: "Licensing deal, varies",
    submission: "Invitation only or via distributor",
    best_for: ["classic cinema", "arthouse", "director retrospectives"],
    notes: "Extremely selective. Focuses on established or acclaimed work.",
    contact: "Via established distributors only",
  },
  ovid: {
    name: "Ovid.tv", tier: "prestige curated",
    model: "SVOD", typical_fee: "Revenue share + small MG",
    submission: "Direct submissions accepted",
    best_for: ["world cinema", "documentary", "arthouse"],
    notes: "Good platform for festival films without major distributor. Curated but accessible.",
    contact: "content@ovid.tv",
  },
  fandor: {
    name: "Fandor", tier: "mid-tier curated",
    model: "SVOD", typical_fee: "Revenue share",
    submission: "Online submission portal",
    best_for: ["US indie", "world cinema", "documentary"],
    notes: "Solid home for quality indie films. Good discoverability.",
    contact: "content@fandor.com",
  },
  topic: {
    name: "Topic", tier: "mid-tier curated",
    model: "SVOD", typical_fee: "Licensing deal",
    submission: "Via submissions portal",
    best_for: ["international drama series", "prestige doc series", "world cinema"],
    notes: "First Look Media backed. Focus on international and politically engaged content.",
    contact: "programming@topic.com",
  },
  argo: {
    name: "Argo", tier: "mid-tier",
    model: "SVOD", typical_fee: "Revenue share",
    submission: "Direct submissions",
    best_for: ["world cinema", "arthouse", "film society audiences"],
    notes: "Partners with film societies and art house theaters.",
    contact: "content@argo.com",
  },
  guidedoc: {
    name: "GuideDoc", tier: "doc specialty",
    model: "SVOD", typical_fee: "Revenue share",
    submission: "Direct online submission",
    best_for: ["documentary", "investigative", "social issue doc"],
    notes: "Documentary-only platform. Good discoverability within the genre.",
    contact: "Via website",
  },
  kanopy: {
    name: "Kanopy", tier: "educational",
    model: "Library licensing", typical_fee: "$1,000-5,000 per year per title",
    submission: "Via distributor or direct to Kanopy",
    best_for: ["educational content", "documentary", "international cinema"],
    notes: "Library-funded streaming. Steady licensing income. Good for docs and world cinema.",
    contact: "content@kanopy.com",
  },
  netflix: {
    name: "Netflix", tier: "major SVOD",
    model: "SVOD + licensing", typical_fee: "$500K-10M+ for originals",
    submission: "Via established sales agents or direct to acquisitions (rare)",
    best_for: ["commercial docs", "prestige drama", "foreign language with broad appeal"],
    notes: "Extremely selective for acquisitions. Most deals via agents at markets. Realistic for: award-winning docs, buzzed festival films.",
    contact: "Via WME, CAA, or major sales agents",
  },
  amazon: {
    name: "Amazon Prime Video", tier: "major SVOD",
    model: "SVOD + AVOD", typical_fee: "Varies widely",
    submission: "Via Amazon Studios acquisitions or self-service Prime Video Direct",
    best_for: ["diverse range", "genre", "documentary"],
    notes: "Prime Video Direct allows self-publishing with rev share. Acquisitions arm for higher-profile films.",
    contact: "primevideodirect.amazon.com",
  },
  tubi: {
    name: "Tubi", tier: "AVOD",
    model: "Free ad-supported", typical_fee: "Revenue share or small flat fee",
    submission: "Via content portal or aggregator",
    best_for: ["older titles", "genre films", "building back catalog presence"],
    notes: "Free to viewers = lower prestige but broad reach. Good for films past their festival window.",
    contact: "partners.tubi.tv",
  },
  plex: {
    name: "Plex", tier: "AVOD",
    model: "Free ad-supported", typical_fee: "Revenue share",
    submission: "Via aggregator or direct",
    best_for: ["genre", "action", "documentary"],
    notes: "Growing AVOD platform. Good for catalog titles.",
    contact: "Via aggregators (Distribber, Quiver, etc.)",
  },
  vimeo_ott: {
    name: "Vimeo OTT / On Demand", tier: "self-distribution",
    model: "Transactional / subscription", typical_fee: "90% revenue to filmmaker",
    submission: "Self-service",
    best_for: ["community-driven films", "educational", "niche audience"],
    notes: "Best self-distribution option. Filmmaker keeps 90% of revenue. Good for direct fan sales.",
    contact: "vimeo.com/ott",
  },
  seed_and_spark: {
    name: "Seed&Spark", tier: "self-distribution",
    model: "SVOD + crowdfunding", typical_fee: "Revenue share (filmmaker-friendly)",
    submission: "Self-service",
    best_for: ["indie films", "social issue", "community-supported projects"],
    notes: "Combined crowdfunding + streaming. Strong for impact campaigns.",
    contact: "seedandspark.com",
  },
  sundance_now: {
    name: "Sundance Now / AMC+", tier: "mid-tier curated",
    model: "SVOD", typical_fee: "Licensing deal",
    submission: "Via sales agent or Sundance Institute connection",
    best_for: ["Sundance alumni", "indie drama", "prestige doc"],
    notes: "Sister service to AMC+. Strong for Sundance-brand films.",
    contact: "Via sales agents",
  },
};

const SALES_AGENT_DATABASE = {
  protagonist: {
    name: "Protagonist Pictures", location: "London, UK",
    specializes_in: ["prestige indie", "world cinema", "documentary"],
    notable_films: ["Weekend", "Lady Macbeth", "Saint Maud"],
    contact: "info@protagonistpictures.com",
    markets: ["Cannes", "TIFF", "Berlinale", "AFM"],
    notes: "One of UK's top sales agents. Strong European and US deals.",
  },
  memento: {
    name: "Memento International", location: "Paris, France",
    specializes_in: ["French cinema", "European arthouse", "genre"],
    notable_films: ["The Artist", "Rust and Bone"],
    contact: "info@memento-films.com",
    markets: ["Cannes", "EFM", "AFM"],
    notes: "Major French sales agent with global reach.",
  },
  deckert: {
    name: "Deckert Distribution", location: "Leipzig, Germany",
    specializes_in: ["documentary", "creative documentary", "European doc"],
    contact: "info@deckert-distribution.com",
    markets: ["IDFA", "Berlinale", "Hot Docs"],
    notes: "Europe's leading doc sales agent. Strong for creative documentary.",
  },
  films_boutique: {
    name: "Films Boutique", location: "Berlin, Germany",
    specializes_in: ["arthouse", "debut features", "world cinema"],
    contact: "films@filmsboutique.com",
    markets: ["Berlinale", "Cannes", "TIFF", "EFM"],
    notes: "Strong for debut and second features in the arthouse space.",
  },
  wide: {
    name: "Wide House", location: "Paris, France",
    specializes_in: ["documentary", "world cinema", "social issue"],
    contact: "info@widehouse.org",
    markets: ["IDFA", "Cannes", "Hot Docs", "TIFF"],
    notes: "Specializes in documentary and socially engaged cinema.",
  },
  cinephil: {
    name: "Cinephil", location: "Tel Aviv, Israel",
    specializes_in: ["Israeli cinema", "Middle East", "Mediterranean", "documentary"],
    contact: "info@cinephil.com",
    markets: ["TIFF", "Berlinale", "Hot Docs", "IDFA"],
    notes: "Israel's premier international sales agent. Essential for Israeli co-productions.",
  },
  submarine: {
    name: "Submarine Entertainment", location: "New York, USA",
    specializes_in: ["documentary", "indie film", "North American market"],
    contact: "info@submarine.com",
    markets: ["Sundance", "TIFF", "Hot Docs", "AFM"],
    notes: "Strong US-based sales agent for documentary and indie features.",
  },
  endeavor: {
    name: "WME / Endeavor Content", location: "Los Angeles, USA",
    specializes_in: ["prestige film", "commercial indie", "Oscar contenders"],
    contact: "Via agent representation",
    markets: ["Sundance", "TIFF", "Cannes", "AFM"],
    notes: "Major agency sales arm. Best for buzzed festival films with commercial potential.",
  },
};

// Anthropic tool definitions
const TOOLS = [
  {
    name: "get_festival_details",
    description: "Get detailed information about a specific film festival including deadlines, fees, tier, what types of films it programs, and strategic notes.",
    input_schema: {
      type: "object",
      properties: {
        festival_name: {
          type: "string",
          description: "Name or key of the festival (e.g. 'sundance', 'tiff', 'berlinale', 'cannes')"
        }
      },
      required: ["festival_name"]
    }
  },
  {
    name: "match_platforms",
    description: "Find streaming and distribution platforms that match a film's profile based on genre, budget tier, festival history, and distribution goals.",
    input_schema: {
      type: "object",
      properties: {
        genre: { type: "string", description: "Film genre (e.g. drama, documentary, horror)" },
        film_type: { type: "string", description: "Feature, short, or documentary" },
        budget_tier: { type: "string", description: "micro, indie, mid, upper_indie" },
        festival_tier: { type: "string", description: "Highest festival tier achieved: 1, 2, 3, or none" },
        goal: { type: "string", description: "Primary goal: revenue, audience, prestige, educational" },
        premiere_status: { type: "string", description: "Premiere status: world, us, north_american, international, or none" }
      },
      required: ["genre", "film_type", "goal"]
    }
  },
  {
    name: "find_sales_agents",
    description: "Find appropriate sales agents for a film based on its genre, country, and profile.",
    input_schema: {
      type: "object",
      properties: {
        genre: { type: "string", description: "Film genre" },
        country: { type: "string", description: "Country of production" },
        film_type: { type: "string", description: "feature, documentary, short" },
        budget_tier: { type: "string", description: "micro, indie, mid, upper_indie" },
        festival_history: { type: "string", description: "Brief description of festival history if any" }
      },
      required: ["genre", "film_type"]
    }
  },
  {
    name: "generate_submission_materials",
    description: "Generate a professional submission material for a film (logline, synopsis, director statement, or sales pitch).",
    input_schema: {
      type: "object",
      properties: {
        material_type: {
          type: "string",
          enum: ["logline", "short_synopsis", "long_synopsis", "director_statement", "sales_pitch"],
          description: "Type of material to generate"
        },
        film_title: { type: "string", description: "Title of the film" },
        genre: { type: "string", description: "Film genre" },
        logline: { type: "string", description: "One-sentence description of the film" },
        director_name: { type: "string", description: "Director's name" },
        themes: { type: "string", description: "Key themes and subject matter" },
        tone: { type: "string", description: "Tone: dramatic, comedic, lyrical, urgent, etc." }
      },
      required: ["material_type", "film_title", "genre"]
    }
  },
  {
    name: "build_deadline_calendar",
    description: "Build a submission deadline calendar for a set of target festivals given a target premiere month.",
    input_schema: {
      type: "object",
      properties: {
        target_festivals: {
          type: "array",
          items: { type: "string" },
          description: "List of festival keys/names (e.g. ['sundance', 'sxsw', 'tribeca'])"
        },
        target_premiere_month: {
          type: "string",
          description: "Desired premiere month/season (e.g. 'January 2026', 'Spring 2026')"
        },
        film_completion_status: {
          type: "string",
          description: "rough_cut, fine_cut, picture_lock, or completed"
        }
      },
      required: ["target_festivals"]
    }
  },
  {
    name: "estimate_submission_budget",
    description: "Estimate the total submission budget for a festival strategy including fees, FilmFreeway costs, and DCP/screener costs.",
    input_schema: {
      type: "object",
      properties: {
        festivals: {
          type: "array",
          items: { type: "string" },
          description: "List of target festival names"
        },
        include_travel: { type: "boolean", description: "Whether to include travel estimates" },
        film_type: { type: "string", description: "feature, short, or documentary" }
      },
      required: ["festivals"]
    }
  },
  {
    name: "generate_fee_waiver_request",
    description: "Generate a professional fee waiver request letter for a film festival.",
    input_schema: {
      type: "object",
      properties: {
        festival_name: { type: "string", description: "Name of the festival" },
        film_title: { type: "string", description: "Title of the film" },
        filmmaker_name: { type: "string", description: "Filmmaker's name" },
        reason: {
          type: "string",
          description: "Primary reason for fee waiver request (e.g. 'micro-budget film', 'student film', 'community-funded')"
        },
        film_brief: { type: "string", description: "Brief description of the film and its significance" }
      },
      required: ["festival_name", "film_title", "filmmaker_name", "reason"]
    }
  },
  {
    name: "find_niche_festivals",
    description: "Find niche or specialty festivals that specifically match a film's subject matter, genre, or identity.",
    input_schema: {
      type: "object",
      properties: {
        genre: { type: "string", description: "Film genre" },
        subject_tags: {
          type: "array",
          items: { type: "string" },
          description: "Subject matter tags (e.g. ['LGBTQ+', 'immigration', 'music', 'environment'])"
        },
        country: { type: "string", description: "Country of production" },
        film_type: { type: "string", description: "feature, short, or documentary" }
      },
      required: ["genre", "film_type"]
    }
  }
];

// ─── Tool handlers ─────────────────────────────────────────────────────────────

function getFestivalDetails({ festival_name }) {
  const key = festival_name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

  // Direct key lookup
  if (FESTIVAL_DATABASE[key]) {
    return JSON.stringify(FESTIVAL_DATABASE[key], null, 2);
  }

  // Fuzzy name search
  const nameSearch = festival_name.toLowerCase();
  for (const [k, fest] of Object.entries(FESTIVAL_DATABASE)) {
    if (fest.name.toLowerCase().includes(nameSearch) || k.includes(nameSearch)) {
      return JSON.stringify(fest, null, 2);
    }
  }

  // Partial key match
  for (const [k, fest] of Object.entries(FESTIVAL_DATABASE)) {
    if (k.includes(key.slice(0, 5)) || nameSearch.includes(k.slice(0, 5))) {
      return JSON.stringify(fest, null, 2);
    }
  }

  const available = Object.keys(FESTIVAL_DATABASE).slice(0, 20).join(", ");
  return `Festival "${festival_name}" not found. Available keys include: ${available}`;
}

function matchPlatforms({ genre, film_type, budget_tier, festival_tier, goal, premiere_status }) {
  const results = [];

  for (const [key, platform] of Object.entries(PLATFORM_DATABASE)) {
    let score = 0;
    let reasons = [];

    // Goal matching
    if (goal === "prestige" && platform.tier === "prestige curated") { score += 30; reasons.push("prestige tier match"); }
    if (goal === "revenue" && (platform.model.includes("SVOD") || platform.model.includes("Transactional"))) { score += 20; }
    if (goal === "educational" && platform.tier === "educational") { score += 40; reasons.push("educational platform"); }
    if (goal === "audience" && platform.tier === "AVOD") { score += 25; reasons.push("broad free audience"); }

    // Genre matching
    const genreLow = genre.toLowerCase();
    const bestFor = (platform.best_for || []).join(" ").toLowerCase();
    if (bestFor.includes(genreLow)) { score += 25; reasons.push(`genre match: ${genre}`); }
    if (genreLow.includes("doc") && bestFor.includes("documentary")) { score += 20; }
    if (genreLow.includes("horror") && (key === "tubi" || key === "plex")) { score += 15; }
    if (genreLow.includes("animation") || genreLow.includes("animated")) {
      if (bestFor.includes("animation")) { score += 25; reasons.push("animation platform"); }
    }

    // Festival tier boosting
    if (festival_tier === "1" && ["mubi", "criterion_channel", "netflix", "amazon"].includes(key)) {
      score += 20; reasons.push("appropriate for Tier 1 festival film");
    }
    if (!festival_tier || festival_tier === "none") {
      if (["ovid", "fandor", "vimeo_ott", "seed_and_spark", "tubi", "plex"].includes(key)) {
        score += 10; reasons.push("accessible without major festival pedigree");
      }
    }

    // Budget tier adjustments
    if (budget_tier === "micro" && ["vimeo_ott", "seed_and_spark", "tubi", "plex", "kanopy"].includes(key)) {
      score += 15; reasons.push("good for micro-budget");
    }

    // Self-distribution boost for micro budget
    if (budget_tier === "micro" && key === "vimeo_ott") score += 10;

    if (score > 20) {
      results.push({
        platform: platform.name,
        score,
        tier: platform.tier,
        model: platform.model,
        typical_fee: platform.typical_fee,
        submission: platform.submission,
        reasons,
        notes: platform.notes,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return "No strong platform matches found. Consider AVOD platforms (Tubi, Plex) for broad reach or Vimeo OTT for self-distribution.";
  }

  return JSON.stringify({ matched_platforms: results.slice(0, 8) }, null, 2);
}

function findSalesAgents({ genre, country, film_type, budget_tier, festival_history }) {
  const results = [];

  for (const [key, agent] of Object.entries(SALES_AGENT_DATABASE)) {
    let score = 0;
    let reasons = [];

    const spec = agent.specializes_in.join(" ").toLowerCase();
    const genreLow = genre.toLowerCase();
    const countryLow = (country || "").toLowerCase();

    // Genre matching
    if (spec.includes(genreLow)) { score += 30; reasons.push(`specializes in ${genre}`); }
    if (genreLow.includes("doc") && spec.includes("documentary")) { score += 25; }

    // Country matching
    if (countryLow.includes("israel") && key === "cinephil") { score += 40; reasons.push("Israel specialist"); }
    if (countryLow.includes("france") && key === "memento") { score += 30; reasons.push("French cinema specialist"); }
    if (countryLow.includes("uk") || countryLow.includes("british")) {
      if (key === "protagonist") { score += 30; reasons.push("UK cinema specialist"); }
    }
    if (countryLow.includes("german")) {
      if (["deckert", "films_boutique"].includes(key)) { score += 25; reasons.push("German market specialist"); }
    }

    // Documentary boosting
    if (genreLow.includes("doc") && ["deckert", "wide", "submarine"].includes(key)) {
      score += 20; reasons.push("doc specialist");
    }

    // Budget tier considerations
    if (budget_tier === "micro" || budget_tier === "indie") {
      if (["deckert", "films_boutique", "wide", "cinephil"].includes(key)) {
        score += 10; reasons.push("works with emerging filmmakers");
      }
    }
    if (budget_tier === "upper_indie" || (festival_history && festival_history.toLowerCase().includes("sundance"))) {
      if (key === "endeavor") { score += 20; reasons.push("handles prestige festival films"); }
    }

    if (score > 15) {
      results.push({
        agent: agent.name,
        location: agent.location,
        score,
        specializes_in: agent.specializes_in,
        markets: agent.markets,
        contact: agent.contact,
        reasons,
        notes: agent.notes,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return "No strong sales agent matches found based on the given criteria. Consider approaching agents directly at markets like AFM, EFM, or Cannes Marché with your materials.";
  }

  return JSON.stringify({ recommended_agents: results }, null, 2);
}

function generateSubmissionMaterials({ material_type, film_title, genre, logline, director_name, themes, tone }) {
  const director = director_name || "the director";
  const themeText = themes || `${genre} themes`;
  const toneText = tone || "compelling";
  const loglineText = logline || `A ${genre} film about ${themeText}`;

  const templates = {
    logline: `A ${toneText} ${genre} film — ${loglineText}`,

    short_synopsis: `"${film_title}" is a ${toneText} ${genre} film directed by ${director}.

${loglineText}

Exploring ${themeText}, the film invites audiences into a world that is both intimately personal and universally resonant. ${director}'s debut (or continuing) vision brings raw authenticity to the screen, creating a work that challenges and moves in equal measure.

Runtime: [X] minutes. Country of origin: [country]. Language: [language].`,

    long_synopsis: `"${film_title}" is a [runtime]-minute ${genre} film directed by ${director}.

[OPENING HOOK — Set the world and central conflict]
${loglineText}

[ACT STRUCTURE — 2-3 paragraphs]
As the film unfolds, [describe the journey, key characters, escalating stakes]. The world of [setting/community] becomes a lens through which ${director} examines ${themeText}.

[CLIMAX & RESOLUTION — without spoiling]
Ultimately, "${film_title}" arrives at a [describe emotional/thematic resolution] — a conclusion that resonates long after the credits roll.

[DIRECTOR'S VISION — 1 paragraph]
${director} brings [key filmmaking approach — observational style, visual poetry, etc.] to this project, drawing on [personal connection to subject/formal influences].

Country of origin: [country] | Language: [language(s)] | Runtime: [X] minutes`,

    director_statement: `"${film_title}" began as [personal origin of the project — a chance encounter, a newspaper story, a family memory].

I am drawn to [core subject matter] because [personal, artistic, or political motivation]. In a time when [broader cultural context], I believe this story matters because [why now, why this film].

Formally, I wanted to create a film that [describe visual/narrative approach]. I was influenced by [2-3 film/artistic influences] but ultimately sought a language that was entirely specific to this subject and these people.

The making of this film required [note of process — years of access, archival research, collaborative development, etc.]. What emerged is something I could not have planned: [describe unexpected discovery or revelation].

I hope audiences leave "${film_title}" feeling [desired emotional/intellectual response].

— ${director_name || '[Director Name]'}`,

    sales_pitch: `**"${film_title}"**
${genre.toUpperCase()} | [Runtime] min | [Country] | [Language]

**Logline:** ${loglineText}

**Why now:** [Market context — trend, news hook, cultural moment]

**The film:** ${toneText.charAt(0).toUpperCase() + toneText.slice(1)} in tone, "${film_title}" explores ${themeText} through [brief description of approach]. Directed by ${director}, the film delivers [key audience experience — emotional gut-punch, propulsive thriller, etc.].

**Festival trajectory:** [World Premiere / Screening at X Festival] — [Any awards, buzz]

**Target audience:** [2-3 sentence description of core audience and commercial opportunity]

**Comparable titles:** [Comp 1] ($X gross) | [Comp 2] ($X gross)

**Available territories:** World | All rights | [Specific territories if pre-sold]

**Contact:** [Sales agent name and email]`,
  };

  const material = templates[material_type];
  if (!material) {
    return `Unknown material type: ${material_type}. Available types: ${Object.keys(templates).join(", ")}`;
  }

  return `## ${material_type.replace(/_/g, " ").toUpperCase()} — "${film_title}"\n\n${material}\n\n---\n*Note: Review and customize bracketed sections with specific details before use.*`;
}

function buildDeadlineCalendar({ target_festivals, target_premiere_month, film_completion_status }) {
  const calendar = [];

  for (const festName of target_festivals) {
    const key = festName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    let festData = FESTIVAL_DATABASE[key];

    if (!festData) {
      // Try fuzzy match
      for (const [k, f] of Object.entries(FESTIVAL_DATABASE)) {
        if (f.name.toLowerCase().includes(festName.toLowerCase()) || k.includes(key.slice(0, 5))) {
          festData = f;
          break;
        }
      }
    }

    if (festData) {
      calendar.push({
        festival: festData.name,
        tier: festData.tier,
        fest_month: festData.month,
        submission_deadline: festData.deadline,
        fee: festData.fee,
        action_required: `Submit by ${festData.deadline}`,
        notes: festData.notes,
      });
    } else {
      calendar.push({
        festival: festName,
        tier: "unknown",
        fest_month: "unknown",
        submission_deadline: "Check FilmFreeway / festival website",
        fee: "unknown",
        action_required: `Look up deadline for ${festName}`,
        notes: "",
      });
    }
  }

  // Sort by approximate month order
  const monthOrder = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  calendar.sort((a, b) => {
    const aIdx = monthOrder.findIndex(m => (a.fest_month || "").includes(m));
    const bIdx = monthOrder.findIndex(m => (b.fest_month || "").includes(m));
    return (aIdx === -1 ? 12 : aIdx) - (bIdx === -1 ? 12 : bIdx);
  });

  const completionNote = film_completion_status
    ? `\nCompletion status: ${film_completion_status}. Ensure your film is fully deliverable by each submission deadline.`
    : "";

  const targetNote = target_premiere_month
    ? `\nTarget premiere: ${target_premiere_month}. Work backwards from this date when planning submissions.`
    : "";

  return JSON.stringify({
    deadline_calendar: calendar,
    notes: `${targetNote}${completionNote}\nAlways verify deadlines directly on FilmFreeway and festival websites as they change annually.`
  }, null, 2);
}

function estimateSubmissionBudget({ festivals, include_travel, film_type }) {
  let totalFees = 0;
  let items = [];
  const isShort = film_type === "short";

  for (const festName of festivals) {
    const key = festName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    let festData = FESTIVAL_DATABASE[key];

    if (!festData) {
      for (const [k, f] of Object.entries(FESTIVAL_DATABASE)) {
        if (f.name.toLowerCase().includes(festName.toLowerCase())) { festData = f; break; }
      }
    }

    if (festData) {
      const feeStr = festData.fee || "$50";
      // Parse fee range - take midpoint
      const numbers = feeStr.match(/\d+/g);
      let fee = 50;
      if (numbers && numbers.length >= 2) {
        fee = (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
      } else if (numbers && numbers.length === 1) {
        fee = parseInt(numbers[0]);
      }
      if (isShort) fee = Math.round(fee * 0.6); // Shorts often cheaper
      if (festData.tier === 1) fee = Math.round(fee * 1.2); // Tier 1 typically higher

      totalFees += fee;
      items.push({ festival: festData.name, tier: festData.tier, estimated_fee: `$${fee}` });
    } else {
      const defaultFee = isShort ? 35 : 55;
      totalFees += defaultFee;
      items.push({ festival: festName, tier: "unknown", estimated_fee: `~$${defaultFee}` });
    }
  }

  const filmfreewayFee = Math.round(festivals.length * 2); // ~$2 processing per submission
  const screenerCosts = isShort ? 0 : 150; // DCP/Vimeo screener link setup
  const materialsCost = 200; // Press kit, stills, etc.

  let travelCost = 0;
  let travelNote = "";
  if (include_travel) {
    const tier1Count = items.filter(i => i.tier === 1).length;
    travelCost = tier1Count * 2000 + (items.length - tier1Count) * 800;
    travelNote = `Travel estimate (${tier1Count} Tier 1 festivals × ~$2,000 + ${items.length - tier1Count} others × ~$800)`;
  }

  const subtotal = totalFees + filmfreewayFee + screenerCosts + materialsCost;
  const total = subtotal + travelCost;

  return JSON.stringify({
    budget_breakdown: {
      submission_fees: { amount: `$${totalFees}`, items },
      filmfreeway_processing: `$${filmfreewayFee}`,
      screener_setup: `$${screenerCosts}`,
      materials_press_kit: `$${materialsCost}`,
      travel: include_travel ? `$${travelCost} (${travelNote})` : "Not included",
      subtotal_no_travel: `$${subtotal}`,
      total_estimated: `$${total}`,
    },
    tips: [
      "Request fee waivers for festivals where your budget is tight — many grant them for micro-budget films",
      "Apply for early deadline discounts (typically 20-30% cheaper)",
      "FilmFreeway Pro subscription ($15/mo) can save on processing fees",
      `${isShort ? "Short films" : "Features"} should budget $${Math.round(total * 0.1)} as contingency`,
    ]
  }, null, 2);
}

function generateFeeWaiverRequest({ festival_name, film_title, director_name, reason, film_brief }) {
  const brief = film_brief || `an independent film that explores themes relevant to your programming`;

  return `## Fee Waiver Request — ${festival_name}

Dear ${festival_name} Submissions Team,

I am writing to respectfully request a fee waiver for my film **"${film_title}"** directed by **${director_name}**.

**About the Film:**
"${film_title}" is ${brief}. We believe it aligns with ${festival_name}'s programming and would resonate strongly with your audience.

**Reason for Request:**
${reason}. As a result, submission fees represent a significant financial barrier that limits our ability to reach festivals that would be an ideal home for this film.

**Our Commitment:**
We are genuinely excited about ${festival_name} specifically — not submitting to dozens of festivals indiscriminately. Your festival's reputation for [specific programming quality / community / mission] makes it a priority target for us.

If a full waiver is not possible, we would gratefully accept a partial reduction. We are happy to provide any additional information about the film or our financial situation.

Thank you for your time and consideration. We look forward to the possibility of sharing this work with your audience.

Sincerely,

${director_name}
[Contact email]
[Film website if applicable]

---
*Attachments: Screener link, synopsis, director bio available upon request*`;
}

function findNicheFestivals({ genre, subject_tags, country, film_type }) {
  const tags = (subject_tags || []).map(t => t.toLowerCase());
  const genreLow = genre.toLowerCase();
  const countryLow = (country || "").toLowerCase();

  const niches = [];

  // LGBTQ+ films
  if (tags.some(t => t.includes("lgbtq") || t.includes("queer") || t.includes("gay") || t.includes("lesbian") || t.includes("trans"))) {
    niches.push({ name: "Frameline SF LGBTQ+ Film Festival", location: "San Francisco, USA", why: "World's largest LGBTQ+ film festival", tier: 3 });
    niches.push({ name: "Outfest Los Angeles", location: "Los Angeles, USA", why: "Hollywood proximity + LGBTQ+ focus", tier: 3 });
    niches.push({ name: "BFI Flare London", location: "London, UK", why: "Europe's largest LGBTQ+ festival", tier: 3 });
    niches.push({ name: "Inside Out Toronto", location: "Toronto, Canada", why: "Canada's premier queer film festival", tier: 3 });
    niches.push({ name: "NewFest New York", location: "New York, USA", why: "NYC-based LGBTQ+ festival", tier: 3 });
    niches.push({ name: "Mezipatra Queer Film Festival", location: "Prague/Brno, Czech Republic", why: "Central European queer cinema", tier: 3 });
  }

  // Environmental / Nature films
  if (tags.some(t => t.includes("environment") || t.includes("climate") || t.includes("nature") || t.includes("ecology"))) {
    niches.push({ name: "Environmental Film Festival at Yale", location: "Yale, USA", why: "Top environmental film showcase", tier: 3 });
    niches.push({ name: "CMS Shark Film Festival", location: "Germany", why: "Ocean/marine focused", tier: 3 });
    niches.push({ name: "Green Film Festival in Seoul", location: "Seoul, South Korea", why: "Environmental cinema in Asia", tier: 3 });
  }

  // Animation
  if (genreLow.includes("animation") || genreLow.includes("animated") || tags.includes("animation")) {
    niches.push({ name: "Annecy International Animation Film Festival", location: "Annecy, France", why: "World's top animation festival", tier: 2 });
    niches.push({ name: "Ottawa International Animation Festival", location: "Ottawa, Canada", why: "North America's top animation festival", tier: 3 });
    niches.push({ name: "Stuttgart International Festival of Animated Film (ITFS)", location: "Stuttgart, Germany", why: "Major European animation festival", tier: 3 });
    niches.push({ name: "Anima Brussels Animation Film Festival", location: "Brussels, Belgium", why: "European animation showcase", tier: 3 });
  }

  // Horror / Genre
  if (genreLow.includes("horror") || genreLow.includes("thriller") || tags.includes("horror")) {
    niches.push({ name: "Fantastic Fest", location: "Austin, USA", why: "Premier US genre festival", tier: 3 });
    niches.push({ name: "Sitges Film Festival", location: "Sitges, Spain", why: "World's top genre/horror festival", tier: 2 });
    niches.push({ name: "FrightFest", location: "London, UK", why: "UK's premier horror festival", tier: 3 });
    niches.push({ name: "Overlook Film Festival", location: "New Orleans, USA", why: "Beloved US horror festival", tier: 3 });
    niches.push({ name: "Fantasia International Film Festival", location: "Montreal, Canada", why: "Top North American genre festival", tier: 2 });
    niches.push({ name: "Nightstream", location: "Online", why: "Horror/genre online festival coalition", tier: 3 });
  }

  // Music / Music documentaries
  if (tags.some(t => t.includes("music") || t.includes("musician") || t.includes("concert"))) {
    niches.push({ name: "Nashville Film Festival", location: "Nashville, USA", why: "Music film specialty", tier: 3 });
    niches.push({ name: "Camden International Film Festival", location: "Maine, USA", why: "Strong for music docs", tier: 3 });
    niches.push({ name: "Music Film Festival Berlin", location: "Berlin, Germany", why: "European music cinema", tier: 3 });
  }

  // Immigration / Diaspora
  if (tags.some(t => t.includes("immigr") || t.includes("diaspora") || t.includes("refugee") || t.includes("border"))) {
    niches.push({ name: "Arizona International Film Festival", location: "Tucson, USA", why: "Border/immigration focus", tier: 3 });
    niches.push({ name: "Los Angeles Latino International Film Festival", location: "Los Angeles, USA", why: "Latino/immigration stories", tier: 3 });
  }

  // Jewish / Israeli cinema
  if (countryLow.includes("israel") || tags.some(t => t.includes("jewish") || t.includes("israel") || t.includes("hebrew"))) {
    niches.push({ name: "DocAviv Tel Aviv", location: "Tel Aviv, Israel", why: "Israel's top documentary festival", tier: 3 });
    niches.push({ name: "Haifa International Film Festival", location: "Haifa, Israel", why: "Israel's oldest film festival", tier: 3 });
    niches.push({ name: "Jerusalem Film Festival", location: "Jerusalem, Israel", why: "Israeli and Jewish cinema focus", tier: 3 });
    niches.push({ name: "San Francisco Jewish Film Festival", location: "San Francisco, USA", why: "World's oldest Jewish film festival", tier: 3 });
    niches.push({ name: "New York Jewish Film Festival", location: "New York, USA", why: "Prestigious US Jewish cinema showcase", tier: 3 });
  }

  // African cinema
  if (countryLow.includes("africa") || tags.some(t => t.includes("africa") || t.includes("african"))) {
    niches.push({ name: "FESPACO Panafrican Film Festival", location: "Ouagadougou, Burkina Faso", why: "Africa's most prestigious film festival", tier: 2 });
    niches.push({ name: "Africa International Film Festival (AFRIFF)", location: "Lagos, Nigeria", why: "Nigeria's premier film festival", tier: 3 });
    niches.push({ name: "Durban International Film Festival", location: "Durban, South Africa", why: "South Africa's top film festival", tier: 3 });
  }

  // Short film specific
  if (film_type === "short") {
    niches.push({ name: "Clermont-Ferrand International Short Film Festival", location: "Clermont-Ferrand, France", why: "World's most important short film festival", tier: 2 });
    niches.push({ name: "Palm Springs International ShortFest", location: "Palm Springs, USA", why: "Largest US short film festival, Oscar qualifying", tier: 3 });
    niches.push({ name: "Aspen ShortsFest", location: "Aspen, USA", why: "Oscar qualifying short film festival", tier: 3 });
    niches.push({ name: "Rhode Island International Film Festival", location: "Rhode Island, USA", why: "Oscar qualifying", tier: 3 });
    niches.push({ name: "BAFTA-qualifying short film festivals (various)", location: "UK", why: "BAFTA qualification pathway", tier: 3 });
  }

  // Latin American cinema
  if (countryLow.includes("mexico") || countryLow.includes("colombia") || countryLow.includes("argentina") ||
      countryLow.includes("brazil") || countryLow.includes("chile") || tags.some(t => t.includes("latin"))) {
    niches.push({ name: "Morelia International Film Festival", location: "Morelia, Mexico", why: "Mexico's top festival", tier: 3 });
    niches.push({ name: "Festival Internacional de Cine de San Sebastián", location: "San Sebastián, Spain", why: "Strong Ibero-American programming", tier: 2 });
    niches.push({ name: "BAFICI Buenos Aires Independent Film Festival", location: "Buenos Aires, Argentina", why: "Major Latin American arthouse festival", tier: 3 });
    niches.push({ name: "Lima Film Festival (Transcinema)", location: "Lima, Peru", why: "Peru's premier film festival", tier: 3 });
  }

  if (niches.length === 0) {
    return `No specific niche festival matches found for genre: "${genre}" with tags: ${tags.join(", ") || "none"}. Consider browsing FilmFreeway's festival search by subject matter tags.`;
  }

  // Deduplicate
  const seen = new Set();
  const unique = niches.filter(n => {
    if (seen.has(n.name)) return false;
    seen.add(n.name);
    return true;
  });

  return JSON.stringify({
    niche_festival_recommendations: unique,
    tip: "These specialty festivals often have higher acceptance rates than generalist festivals and can build strong community audiences for your film."
  }, null, 2);
}

// ─── Tool dispatcher ──────────────────────────────────────────────────────────

async function callTool(name, input) {
  switch (name) {
    case "get_festival_details":      return getFestivalDetails(input);
    case "match_platforms":           return matchPlatforms(input);
    case "find_sales_agents":         return findSalesAgents(input);
    case "generate_submission_materials": return generateSubmissionMaterials(input);
    case "build_deadline_calendar":   return buildDeadlineCalendar(input);
    case "estimate_submission_budget": return estimateSubmissionBudget(input);
    case "generate_fee_waiver_request": return generateFeeWaiverRequest(input);
    case "find_niche_festivals":      return findNicheFestivals(input);
    default:                          return `Unknown tool: ${name}`;
  }
}

module.exports = { TOOLS, callTool, FESTIVAL_DATABASE, PLATFORM_DATABASE, SALES_AGENT_DATABASE };
