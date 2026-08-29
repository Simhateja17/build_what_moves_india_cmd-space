"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

/* ------------------------------------------------------------------
   Language.

   An access portal that only speaks English excludes most of the people
   it exists for. s.6(1) of the RTI Act itself lets a request be made in
   Hindi or the official language of the area — so the portal insisting
   on English is not just unkind, it is narrower than the statute.

   The dictionary is intentionally keyed by the English source string for
   feature copy as well as by short semantic keys. That makes it possible to
   localise static data (FAQ entries, assistant prompts and case notices)
   without duplicating the data model or allowing one screen to silently
   fall back to a second wording.
------------------------------------------------------------------- */

export type Locale = "en" | "hi";

export const LOCALES: Array<{ id: Locale; label: string; short: string }> = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिन्दी", short: "हि" },
];

type Dict = Record<string, string>;
export type TranslationValues = Record<string, string | number>;

const EN: Dict = {
  "nav.home": "Home",
  "nav.requests": "My requests",
  "nav.file": "File a request",
  "nav.help": "Help",

  "stage.filed": "Filed",
  "stage.with_department": "With the department",
  "stage.needs_you": "Action needed",
  "stage.answered": "Answered",
  "stage.closed": "Closed",
  "stage.in_appeal": "In appeal",

  "filter.all": "All",
  "filter.appeal": "In appeal",

  "list.title": "My requests",
  "list.search": "Search by number, department, or subject",
  "list.appNo": "Application no.",
  "list.department": "Department",
  "list.status": "Status",
  "list.deadline": "Deadline",
  "list.lastUpdated": "Last updated",
  "list.view": "View",
  "list.filed": "Filed",

  "lang.label": "Language",
  "lang.partial":
    "Navigation and statuses are in Hindi. Detailed guidance is still in English.",
};

const HI: Dict = {
  "nav.home": "मुख्य पृष्ठ",
  "nav.requests": "मेरे आवेदन",
  "nav.file": "नया आवेदन",
  "nav.help": "सहायता",

  "stage.filed": "दायर किया गया",
  "stage.with_department": "विभाग के पास",
  "stage.needs_you": "आपकी कार्रवाई ज़रूरी",
  "stage.answered": "उत्तर मिला",
  "stage.closed": "बंद",
  "stage.in_appeal": "अपील में",

  "filter.all": "सभी",
  "filter.appeal": "अपील में",

  "list.title": "मेरे आवेदन",
  "list.search": "संख्या, विभाग या विषय से खोजें",
  "list.appNo": "आवेदन संख्या",
  "list.department": "विभाग",
  "list.status": "स्थिति",
  "list.deadline": "समय-सीमा",
  "list.lastUpdated": "अंतिम अपडेट",
  "list.view": "देखें",
  "list.filed": "दायर",

  "lang.label": "भाषा",
  "lang.partial": "पूरा पोर्टल हिन्दी में उपलब्ध है।",

  // Shared chrome and accessibility labels.
  "Skip to main content": "मुख्य सामग्री पर जाएँ",
  Main: "मुख्य मेनू",
  Notifications: "सूचनाएँ",
  "Close menu": "मेनू बंद करें",
  Profile: "प्रोफ़ाइल",
  "Sign out": "साइन आउट",
  Login: "लॉग इन",
  "Sign in": "साइन इन",
  "+ File RTI": "+ RTI आवेदन भरें",
  "Right to Information home": "सूचना का अधिकार — मुख्य पृष्ठ",
  "Open request": "आवेदन खोलें",
  "Unread reply": "न पढ़ा गया उत्तर",
  "An appeal is live on this request": "इस आवेदन पर अपील लंबित है",
  "Go back one step": "एक चरण पीछे जाएँ",
  "Go back a step": "एक चरण पीछे जाएँ",
  "Loading…": "लोड हो रहा है…",
  "Working…": "काम हो रहा है…",
  Now: "अभी",

  // Common actions and labels.
  Home: "मुख्य पृष्ठ",
  Requests: "आवेदन",
  Alerts: "सूचनाएँ",
  Help: "सहायता",
  "My RTIs": "मेरे RTI आवेदन",
  "My requests": "मेरे आवेदन",
  "File a request": "नया आवेदन भरें",
  "Track without signing in": "बिना साइन इन किए आवेदन ट्रैक करें",
  "Demo sign in": "डेमो साइन इन",
  "Portal guidelines": "पोर्टल के दिशा-निर्देश",
  FAQ: "अक्सर पूछे जाने वाले प्रश्न",
  "Contact us": "हमसे संपर्क करें",
  Contact: "संपर्क",
  View: "देखें",
  "View all": "सभी देखें",
  "View all requests": "सभी आवेदन देखें",
  "View all activity": "सारी गतिविधि देखें",
  "Read response": "उत्तर पढ़ें",
  "See details": "विवरण देखें",
  Continue: "जारी रखें",
  Cancel: "रद्द करें",
  Back: "पीछे",
  Edit: "बदलें",
  Change: "बदलें",
  Add: "जोड़ें",
  Remove: "हटाएँ",
  Copy: "कॉपी करें",
  "Copied ✓": "कॉपी हो गया ✓",
  Close: "बंद करें",
  Clear: "साफ़ करें",
  or: "या",
  Optional: "वैकल्पिक",
  "(optional)": "(वैकल्पिक)",

  // Home and public pages.
  "Right to Information Act, 2005": "सूचना का अधिकार अधिनियम, 2005",
  "An independent redesign concept, not an official Government of India site":
    "भारत सरकार की आधिकारिक वेबसाइट नहीं, एक स्वतंत्र पुनर्रचना अवधारणा",
  "Try the demo": "डेमो देखें",
  "How it works": "यह कैसे काम करता है",
  "Get assistance": "सहायता लें",
  "See an example": "उदाहरण देखें",
  "Find the right department": "सही विभाग खोजें",
  "No signup is required. A demonstration account is provided.":
    "साइन अप की ज़रूरत नहीं है। डेमो खाता पहले से उपलब्ध है।",
  "Nothing is submitted without explicit confirmation.":
    "आपकी स्पष्ट पुष्टि के बिना कुछ भी जमा नहीं किया जाएगा।",
  "Road, sewage, water, school, hospital and nine more.":
    "सड़क, सीवर, पानी, स्कूल, अस्पताल और नौ अन्य विषय।",
  "You have the right to ask.": "आपको पूछने का अधिकार है।",
  "The law requires an answer.": "कानून जवाब देना ज़रूरी करता है।",
  "Any citizen of India may request records held by a public authority, and the law requires a reply within 30 days. RTI Saral is built to make that right straightforward to exercise.":
    "भारत का कोई भी नागरिक किसी सार्वजनिक प्राधिकरण के पास मौजूद रिकॉर्ड माँग सकता है और कानून 30 दिनों में उत्तर देना ज़रूरी करता है। RTI सरल इस अधिकार का उपयोग आसान बनाने के लिए बनाया गया है।",
  "Uncertain how to word your request?": "आवेदन कैसे लिखें, समझ नहीं आ रहा?",
  "Describe the problem.": "समस्या बताएँ।",
  "This will be phrased as a formal request.":
    "इसे औपचारिक आवेदन के रूप में लिखा जाएगा।",
  "Describe the problem in everyday language, and it will be converted into a formal request for records, not opinions, addressed to the officer required to respond. Every word may be reviewed before submission.":
    "समस्या को रोज़मर्रा की भाषा में बताएँ और इसे राय के बजाय रिकॉर्ड माँगने वाले औपचारिक आवेदन में बदला जाएगा, जिसे जवाब देने वाले अधिकारी को भेजा जाएगा। जमा करने से पहले हर शब्द की समीक्षा की जा सकती है।",
  "Uncertain which office to approach?":
    "किस कार्यालय से संपर्क करें, समझ नहीं आ रहा?",
  "Uncertain which office is responsible?":
    "जिम्मेदार कार्यालय कौन-सा है, समझ नहीं आ रहा?",
  "The correct authority will be identified.":
    "सही प्राधिकरण की पहचान की जाएगी।",
  "A request sent to the wrong office is returned, fee included. Describe the issue, and the responsible office will be identified, along with the reason for that determination.":
    "गलत कार्यालय को भेजा गया आवेदन शुल्क सहित वापस हो सकता है। समस्या बताएँ और जिम्मेदार कार्यालय के साथ यह भी बताया जाएगा कि उसका निर्धारण क्यों किया गया।",
  "How to file an RTI": "RTI आवेदन कैसे भरें",
  "How to file an RTI online": "RTI ऑनलाइन आवेदन कैसे भरें",
  "Every screen is shown here in the order it will appear, so the process is known in advance.":
    "हर स्क्रीन उसी क्रम में दिखाई गई है जिसमें वह आएगी, ताकि पूरी प्रक्रिया पहले से समझ में रहे।",
  "Go to the RTI Online Portal": "RTI ऑनलाइन पोर्टल पर जाएँ",
  "Visit the official RTI Online Portal at rtionline.gov.in. Requests for central ministries and departments are received here.":
    "आधिकारिक RTI ऑनलाइन पोर्टल rtionline.gov.in पर जाएँ। केंद्रीय मंत्रालयों और विभागों के आवेदन यहाँ प्राप्त होते हैं।",
  "Register yourself": "अपना पंजीकरण करें",
  "Create an account with an email ID and mobile number. Both will be used to provide updates at every step.":
    "ईमेल आईडी और मोबाइल नंबर से खाता बनाएँ। दोनों का उपयोग हर चरण की जानकारी देने के लिए होगा।",
  "Login to your account": "अपने खाते में लॉग इन करें",
  "Sign in with the registered email ID and password. Every application submitted remains listed here.":
    "पंजीकृत ईमेल आईडी और पासवर्ड से साइन इन करें। जमा किए गए सभी आवेदन यहाँ सूचीबद्ध रहेंगे।",
  "Select the public authority": "सार्वजनिक प्राधिकरण चुनें",
  "Select the ministry, department and public authority that holds the record. An application sent to the wrong authority will be returned.":
    "रिकॉर्ड रखने वाला मंत्रालय, विभाग और सार्वजनिक प्राधिकरण चुनें। गलत प्राधिकरण को भेजा गया आवेदन वापस कर दिया जाएगा।",
  "Fill the RTI application form": "RTI आवेदन फॉर्म भरें",
  "Provide the required details and state the request clearly. Requests must be for records — files, orders, dates, amounts — not opinions.":
    "ज़रूरी विवरण दें और माँगी गई जानकारी स्पष्ट रूप से लिखें। आवेदन राय के लिए नहीं, बल्कि फाइल, आदेश, तारीख और राशि जैसे रिकॉर्ड के लिए होना चाहिए।",
  "Pay the application fee": "आवेदन शुल्क दें",
  "The fee is ₹10, payable by UPI, net banking, card or wallet. No fee applies for a BPL cardholder who attaches a copy of the certificate.":
    "शुल्क ₹10 है, जिसका भुगतान UPI, नेट बैंकिंग, कार्ड या वॉलेट से किया जा सकता है। प्रमाणपत्र की प्रति लगाने वाले BPL कार्डधारक से कोई शुल्क नहीं लिया जाता।",
  "Submit your application": "अपना आवेदन जमा करें",
  "Review the details before submission. A unique registration number is issued immediately and is required for tracking and appeals.":
    "जमा करने से पहले विवरण जाँचें। तुरंत एक विशिष्ट पंजीकरण संख्या जारी होती है, जो ट्रैकिंग और अपील के लिए ज़रूरी है।",
  "Receive acknowledgement": "पावती प्राप्त करें",
  "Receipt is confirmed by email with the registration number, and by SMS if a mobile number was provided.":
    "पंजीकरण संख्या के साथ ईमेल से पावती मिलेगी और मोबाइल नंबर देने पर SMS भी आएगा।",
  "Track your application": "अपना आवेदन ट्रैक करें",
  "The registration number may be used at any time to check the current status of the request.":
    "आवेदन की वर्तमान स्थिति देखने के लिए पंजीकरण संख्या का उपयोग कभी भी किया जा सकता है।",
  "Receive information, or appeal": "जानकारी पाएँ या अपील करें",
  "A reply is required within 30 days, or 48 hours where life or liberty is concerned. If no reply is received, a First Appeal may be filed free of cost.":
    "उत्तर 30 दिनों में देना ज़रूरी है; जीवन या स्वतंत्रता से जुड़े मामले में 48 घंटे में। उत्तर न मिलने पर प्रथम अपील निःशुल्क दाखिल की जा सकती है।",
  "The route, in plain language": "पूरी प्रक्रिया, आसान भाषा में",
  "General information": "सामान्य जानकारी",
  "Citizen support": "नागरिक सहायता",
  "About the RTI Act": "RTI अधिनियम के बारे में",
  "Why this law exists": "यह कानून क्यों है",
  "The Right to Information Act, 2005 gives every citizen of India the right to request records held by a public authority. Files, orders, reports, dates, spending details: any record held by a government office may be requested, and the law requires the responsible office to answer within a fixed time.":
    "सूचना का अधिकार अधिनियम, 2005 भारत के हर नागरिक को सार्वजनिक प्राधिकरण के पास मौजूद रिकॉर्ड माँगने का अधिकार देता है। फाइल, आदेश, रिपोर्ट, तारीख और खर्च का विवरण—सरकारी कार्यालय के पास मौजूद कोई भी रिकॉर्ड माँगा जा सकता है और जिम्मेदार कार्यालय को तय समय में उत्तर देना होता है।",
  "Who can file an RTI": "RTI कौन दाखिल कर सकता है",
  "This right belongs to you": "यह अधिकार आपका है",
  "Any citizen of India may file a request, with no exceptions. No explanation is required for making a request, and there is no need to show that the matter affects you personally. The request need only describe what is sought clearly enough to be located.":
    "भारत का कोई भी नागरिक आवेदन दाखिल कर सकता है। आवेदन देने के लिए कारण बताने या यह साबित करने की ज़रूरत नहीं कि मामला आपसे व्यक्तिगत रूप से जुड़ा है। बस माँगी गई जानकारी इतनी स्पष्ट होनी चाहिए कि रिकॉर्ड खोजा जा सके।",
  "What information you can ask for": "आप कौन-सी जानकारी माँग सकते हैं",
  "Records held by the government": "सरकार के पास मौजूद रिकॉर्ड",
  "Copies of files, orders, contracts, reports, inspection records, expenditure details and more may be requested. The clearest requests ask for records and facts already held, rather than for opinion or justification.":
    "फाइल, आदेश, अनुबंध, रिपोर्ट, निरीक्षण रिकॉर्ड और खर्च के विवरण की प्रतियाँ माँगी जा सकती हैं। सबसे स्पष्ट आवेदन पहले से मौजूद रिकॉर्ड और तथ्यों के लिए होते हैं, राय या कारण बताने के लिए नहीं।",
  "Fees and exemptions": "शुल्क और छूट",
  "The fee is not a barrier": "शुल्क रुकावट नहीं है",
  "A small fee applies to most requests, along with charges for copies. The fee is waived entirely for a BPL cardholder. Where a category of information is exempt under the Act, the exact reason for withholding it must still be provided.":
    "अधिकांश आवेदनों पर छोटा शुल्क और प्रतियों का खर्च लगता है। BPL कार्डधारक के लिए शुल्क पूरी तरह माफ़ है। अधिनियम के तहत किसी जानकारी को छूट प्राप्त हो, तब भी उसे रोकने का सटीक कारण देना होगा।",
  "Response and appeal timelines": "उत्तर और अपील की समय-सीमा",
  "Fixed timelines apply": "तय समय-सीमा लागू होती है",
  "A reply is required within 30 days. If that deadline is missed, or a request is refused without reason or answered only in part, a First Appeal may be filed. Every deadline and next step remains visible throughout.":
    "30 दिनों में उत्तर देना ज़रूरी है। समय-सीमा निकल जाए, बिना कारण आवेदन अस्वीकार हो या अधूरा उत्तर मिले, तो प्रथम अपील दाखिल की जा सकती है। हर समय-सीमा और अगला कदम लगातार दिखाई देता है।",
  "Know more": "और जानें",
  "What RTI Saral does": "RTI सरल क्या करता है",
  "Slide {index} of {count}": "{count} में स्लाइड {index}",
  "Show slide {index}: {eyebrow}": "स्लाइड {index} दिखाएँ: {eyebrow}",
  "State Emblem of India": "भारत का राजचिह्न",
  "A redesign concept for the Government of India's RTI Online portal, built for the Build What Moves India hackathon.":
    "Build What Moves India हैकाथॉन के लिए बनाया गया भारत सरकार के RTI ऑनलाइन पोर्टल का पुनर्रचना अवधारणा मॉडल।",
  "The law behind it": "इसके पीछे का कानून",
  "In this demo": "इस डेमो में",
  "s.6(2) — no reason need be given": "धारा 6(2) — कारण बताना ज़रूरी नहीं",
  "s.7(1) — {days} days to reply, 48 hours where life or liberty is concerned":
    "धारा 7(1) — उत्तर के लिए {days} दिन; जीवन या स्वतंत्रता से जुड़े मामलों में 48 घंटे",
  "s.19 — first appeal in {first} days, second in {second}":
    "धारा 19 — प्रथम अपील {first} दिनों में, द्वितीय अपील {second} दिनों में",
  "s.20 — ₹{perDay} a day against the officer, up to ₹{cap}":
    "धारा 20 — अधिकारी पर प्रतिदिन ₹{perDay}, अधिकतम ₹{cap}",
  "This is an independent design concept and is not an official Government of India website. All data shown is fictional and created for demonstration. The real portal is at rtionline.gov.in.":
    "यह एक स्वतंत्र डिज़ाइन अवधारणा है और भारत सरकार की आधिकारिक वेबसाइट नहीं है। यहाँ दिखाई गई सभी जानकारी डेमो के लिए काल्पनिक है। वास्तविक पोर्टल rtionline.gov.in पर है।",
  "Local demo": "स्थानीय डेमो",
  "Fictional case data": "काल्पनिक आवेदन डेटा",
  "Independent concept": "स्वतंत्र अवधारणा",

  // Authentication and identity.
  "Sign in to track your RTI requests":
    "अपने RTI आवेदनों को ट्रैक करने के लिए साइन इन करें",
  "Everything in this demo is fictional and runs entirely in your browser. No government system is contacted, and nothing you type is stored anywhere.":
    "इस डेमो की सारी जानकारी काल्पनिक है और यह पूरी तरह आपके ब्राउज़र में चलता है। किसी सरकारी प्रणाली से संपर्क नहीं किया जाता और आपके द्वारा लिखी कोई जानकारी कहीं संग्रहीत नहीं होती।",
  "What you will find inside": "डेमो में आपको मिलेगा",
  "A pension request": "पेंशन का आवेदन",
  "A request they ignored": "एक अनदेखा किया गया आवेदन",
  "A split request": "कई कार्यालयों में बाँटा गया आवेदन",
  "still inside its 30-day window — the normal, working case.":
    "अभी 30 दिनों की समय-सीमा में है — सामान्य स्थिति।",
  "— move the clock forward and watch the penalty run against the officer.":
    "— घड़ी आगे बढ़ाकर देखें कि अधिकारी पर जुर्माना कैसे लगता है।",
  "— one question quietly scattered across three offices.":
    "— एक प्रश्न चुपचाप तीन कार्यालयों में बाँटा गया है।",
  "Citizen sign in": "नागरिक साइन इन",
  "Test credentials are filled in for you.":
    "परीक्षण विवरण आपके लिए भर दिए गए हैं।",
  "Email address": "ईमेल पता",
  Password: "पासवर्ड",
  "Enter both your email and password to continue.":
    "जारी रखने के लिए अपना ईमेल और पासवर्ड दोनों दर्ज करें।",
  "Continue as demo citizen": "डेमो नागरिक के रूप में जारी रखें",
  "Test credentials": "परीक्षण विवरण",
  "Need help? Read the FAQ": "मदद चाहिए? FAQ पढ़ें",
  "New here?": "पहली बार आए हैं?",
  "See how this works first": "पहले देखें कि यह कैसे काम करता है",

  // Request list, dashboard and dates.
  "Search your requests": "अपने आवेदनों में खोजें",
  "Filter by status": "स्थिति के अनुसार फ़िल्टर करें",
  "No requests match your search.": "आपकी खोज से कोई आवेदन नहीं मिला।",
  "Try a different search or filter.": "कोई दूसरी खोज या फ़िल्टर आज़माएँ।",
  "Requires your attention": "आपकी कार्रवाई ज़रूरी है",
  "Recent requests": "हाल के आवेदन",
  "Recent activity": "हाल की गतिविधि",
  "There are no pending actions on your requests.":
    "आपके आवेदनों पर कोई लंबित कार्रवाई नहीं है।",
  "Need help wording a request?": "आवेदन लिखने में मदद चाहिए?",
  "Namaste, {name}": "नमस्ते, {name}",
  "in total": "कुल",
  "with the department": "विभाग के पास",
  answered: "उत्तर मिला",
  "View {count} more": "{count} और देखें",
  "{count} task": "{count} कार्य",
  "{count} tasks": "{count} कार्य",
  "Nothing is waiting on you.": "आपकी ओर से कुछ लंबित नहीं है।",
  "{count} {unit}, most urgent first.": "{count} {unit}, सबसे ज़रूरी पहले।",
  "{count} new": "{count} नए",
  "{count} item needs your attention":
    "{count} आइटम पर आपकी कार्रवाई ज़रूरी है",
  "{count} items need your attention":
    "{count} आइटम पर आपकी कार्रवाई ज़रूरी है",
  Updates: "अपडेट",
  "You are up to date": "आप पूरी तरह अपडेट हैं",
  "Mark all as read": "सभी को पढ़ा हुआ चिह्नित करें",
  "Needs your attention": "आपकी कार्रवाई ज़रूरी है",
  Latest: "नवीनतम",
  "Past week": "पिछला सप्ताह",
  "Past month": "पिछला महीना",
  Older: "पुराने",
  "Payment needs confirmation": "भुगतान की पुष्टि ज़रूरी है",
  "Payment not yet matched to an RTI": "भुगतान अभी RTI से नहीं जुड़ा है",
  "Check payment": "भुगतान जाँचें",
  "Supporting document requested": "सहायक दस्तावेज़ माँगा गया",
  "Response received": "उत्तर प्राप्त हुआ",
  "Second Appeal available": "द्वितीय अपील उपलब्ध है",
  "First Appeal available": "प्रथम अपील उपलब्ध है",
  "Their answer fell short — you can appeal":
    "उनका उत्तर अधूरा है — आप अपील कर सकते हैं",
  "RTI transferred to another office": "RTI दूसरे कार्यालय को भेजा गया",
  "Additional document requested": "अतिरिक्त दस्तावेज़ माँगा गया",
  "Second Appeal now available": "द्वितीय अपील अब उपलब्ध है",
  "Second Appeal registered": "द्वितीय अपील पंजीकृत",
  "Their answer fell short": "उनका उत्तर अधूरा है",
  "Appeal now available": "अपील अब उपलब्ध है",
  "Appeal filing date passed": "अपील दाखिल करने की तारीख निकल गई",
  "Appeal deadline approaching": "अपील की समय-सीमा पास है",
  "Deadline approaching": "समय-सीमा पास है",
  "₹10 was debited but a registration number has not yet been received. Do not make another payment; check the status of this payment.":
    "₹10 की राशि कट गई है, लेकिन अभी पंजीकरण संख्या नहीं मिली है। दोबारा भुगतान न करें; भुगतान की स्थिति जाँचें।",
  "The Appellate Authority had 30 days to decide, and 45 at the very outside. Both have passed with no decision. A Second Appeal may be filed before the Central Information Commission, free of cost.":
    "अपीलीय प्राधिकरण को निर्णय के लिए 30 दिन और अधिकतम 45 दिन मिले थे। दोनों समय-सीमाएँ बिना निर्णय के बीत गई हैं। केंद्रीय सूचना आयोग के समक्ष द्वितीय अपील निःशुल्क दाखिल की जा सकती है।",
  "The usual 30-day filing period has passed. A delayed appeal may still be accepted, provided the delay is explained.":
    "सामान्य 30-दिन की दाखिल करने की अवधि बीत गई है। देरी का कारण बताने पर विलंबित अपील अभी भी स्वीकार की जा सकती है।",
  "File by {date}. {days} day{plural} remaining.":
    "{date} तक दाखिल करें। {days} दिन बाकी हैं।",
  "No updates yet. Actions taken by a department on your requests will appear here.":
    "अभी कोई अपडेट नहीं है। आपके आवेदनों पर विभाग की कार्रवाई यहाँ दिखाई देगी।",
  "A reply has been received from {office} regarding {subject}.":
    "{office} से {subject} के संबंध में उत्तर प्राप्त हुआ है।",
  "A hearing for your appeal has been fixed for {date}. You may attend in person, send a representative, or ask that the appeal be decided on your written submission alone.":
    "आपकी अपील पर {date} को सुनवाई तय है। आप स्वयं उपस्थित हो सकते हैं, प्रतिनिधि भेज सकते हैं या केवल लिखित प्रस्तुति के आधार पर निर्णय का अनुरोध कर सकते हैं।",
  "{office} replied, but withheld what you asked for. A refusal is a decision you are entitled to challenge, and filing an appeal is free of cost. {deadline}":
    "{office} ने उत्तर दिया, लेकिन माँगी गई जानकारी रोक दी। यह ऐसा निर्णय है जिसे आप चुनौती दे सकते हैं और अपील निःशुल्क है। {deadline}",
  "The Public Authority is {days} days past the legal deadline. Under the Act, this silence is deemed a refusal, and filing an appeal is free of cost. {deadline}":
    "कानूनी समय-सीमा से {days} दिन बीत चुके हैं। अधिनियम के तहत यह चुप्पी अस्वीकृति मानी जाती है और अपील निःशुल्क है। {deadline}",
  "Your appeal against {office} has been registered. The Appellate Authority is required to decide within 30 days, and within 45 at the outside where it records its reasons for taking longer.":
    "{office} के विरुद्ध आपकी अपील पंजीकृत हो गई है। अपीलीय प्राधिकरण को 30 दिनों में और अधिकतम 45 दिनों में, देरी का कारण दर्ज करके, निर्णय करना होगा।",
  "The Appellate Authority's 45 days lapsed with no decision on your appeal regarding {subject}. The Central Information Commission can now be approached, free of cost.":
    "{subject} से जुड़ी आपकी अपील पर अपीलीय प्राधिकरण की 45 दिन की अवधि बिना निर्णय के बीत गई है। अब केंद्रीय सूचना आयोग से निःशुल्क संपर्क किया जा सकता है।",
  "Your appeal against {office} is now before the Central Information Commission, which sits outside the department.":
    "{office} के विरुद्ध आपकी अपील अब केंद्रीय सूचना आयोग के समक्ष है, जो विभाग से स्वतंत्र है।",
  "{office} claimed an exemption over your request regarding {subject} instead of answering it. An appeal may be filed free of cost.":
    "{office} ने {subject} के संबंध में उत्तर देने के बजाय छूट का दावा किया। अपील निःशुल्क दाखिल की जा सकती है।",
  "The {limit} the law allows has passed with no reply regarding {subject}. An appeal may be filed free of cost.":
    "{subject} के संबंध में कानून द्वारा दी गई {limit} की अवधि बिना उत्तर के बीत गई है। अपील निःशुल्क दाखिल की जा सकती है।",
  "The usual 30-day period has passed. You may still file a delayed First Appeal, provided the reason for the delay is included.":
    "सामान्य 30-दिन की अवधि बीत गई है। देरी का कारण शामिल करके आप अभी भी विलंबित प्रथम अपील दाखिल कर सकते हैं।",
  "File a First Appeal by {date}. {days} day{plural} remaining.":
    "{date} तक प्रथम अपील दाखिल करें। {days} दिन बाकी हैं।",
  "{office} has {days} day{plural} remaining to respond.":
    "{office} के पास उत्तर देने के लिए {days} दिन बाकी हैं।",
  "The office has requested documentary proof that you are the pensioner's son, before personal details can be released to you":
    "व्यक्तिगत जानकारी जारी करने से पहले कार्यालय ने पेंशनभोगी के पुत्र होने का दस्तावेज़ी प्रमाण माँगा है",
  "The Appellate Authority has fixed a hearing on your appeal. You may attend in person, send a representative, or ask that the appeal be decided on your written submission alone":
    "अपीलीय प्राधिकरण ने आपकी अपील पर सुनवाई तय की है। आप स्वयं उपस्थित हो सकते हैं, प्रतिनिधि भेज सकते हैं या केवल लिखित प्रस्तुति के आधार पर निर्णय का अनुरोध कर सकते हैं",
  "Part of this application concerned two other offices and has been transferred to them. Each office has 30 days to respond, counted from the date of receipt":
    "इस आवेदन का एक भाग दो अन्य कार्यालयों से संबंधित था और उन्हें भेज दिया गया है। प्रत्येक कार्यालय को प्राप्ति की तारीख से 30 दिनों में उत्तर देना होगा",
  task: "कार्य",
  tasks: "कार्य",
  "Action needed": "कार्रवाई ज़रूरी",
  Deadline: "समय-सीमा",
  Reply: "उत्तर",
  "Open →": "खोलें →",
  Unread: "न पढ़ा गया",
  Update: "अपडेट",
  today: "आज",
  yesterday: "कल",
  tomorrow: "कल",
  "in {count} days": "{count} दिनों में",
  "{count} days ago": "{count} दिन पहले",

  // Profile and account.
  "Citizen account": "नागरिक खाता",
  "RTIs filed": "दायर RTI आवेदन",
  "Your account": "आपका खाता",
  Payments: "भुगतान",
  "Fees paid and their status": "जमा शुल्क और उनकी स्थिति",
  "Saved responses": "सहेजे गए उत्तर",
  "Every answer you have received": "आपको मिले सभी उत्तर",
  "How this works": "यह कैसे काम करता है",
  "What the law gives you, in plain words":
    "कानून आपको क्या अधिकार देता है, सरल शब्दों में",
  Preferences: "प्राथमिकताएँ",
  "Show official terms": "आधिकारिक शब्द दिखाएँ",
  "Department wording under every status":
    "हर स्थिति के नीचे विभाग की शब्दावली",
  "Email updates": "ईमेल अपडेट",
  "SMS deadline reminders": "SMS समय-सीमा अनुस्मारक",
  "Three days before each deadline": "हर समय-सीमा से तीन दिन पहले",
  "not sent in this demo": "इस डेमो में भेजे नहीं जाते",
  "Preferences are saved on this device.": "प्राथमिकताएँ इस डिवाइस पर सेव हैं।",
  "This is a redesign concept. Nothing here reaches a real government system, and no data leaves your browser.":
    "यह एक पुनर्रचना अवधारणा है। यहाँ से किसी वास्तविक सरकारी प्रणाली तक पहुँच नहीं है और आपका डेटा आपके ब्राउज़र से बाहर नहीं जाता।",

  // Filing and validation.
  "New request": "नया आवेदन",
  "Step 1 of 4 · about 5 minutes": "चरण 1 / 4 · लगभग 5 मिनट",
  "Select a filing method": "आवेदन भरने का तरीका चुनें",
  "Select the option that matches what you already know. Both lead to the same review and submission.":
    "जो जानकारी आपको पहले से पता है, उसके अनुसार विकल्प चुनें। दोनों तरीके एक ही समीक्षा और जमा करने की प्रक्रिया तक ले जाते हैं।",
  Recommended: "अनुशंसित",
  "Get assistance preparing this request": "यह आवेदन तैयार करने में सहायता लें",
  "Answer a series of questions to identify the authority and prepare a clear request.":
    "कुछ सवालों के जवाब देकर सही प्राधिकरण पहचानें और स्पष्ट आवेदन तैयार करें।",
  "You describe the problem in your own words": "समस्या अपने शब्दों में बताएँ",
  "The responsible office is identified automatically":
    "जिम्मेदार कार्यालय अपने-आप पहचाना जाएगा",
  "The request is drafted for you": "आवेदन का मसौदा आपके लिए तैयार होगा",
  "Manual filing": "सीधे आवेदन भरें",
  "File directly": "सीधे आवेदन भरें",
  "Select the department and enter the request text directly.":
    "विभाग चुनें और आवेदन का पाठ सीधे दर्ज करें।",
  "Required information": "ज़रूरी जानकारी",
  "The ministry and office that holds the record":
    "रिकॉर्ड रखने वाला मंत्रालय और कार्यालय",
  "Your question, in your own words": "आपका प्रश्न, अपने शब्दों में",
  "₹10 by UPI (waived for BPL cardholders)":
    "UPI से ₹10 (BPL कार्डधारकों के लिए माफ़)",
  "Open the form": "फॉर्म खोलें",
  "Read the": "पढ़ें",
  "portal guidelines": "पोर्टल के दिशा-निर्देश",
  "To view a request already in progress, see":
    "पहले से चल रहे आवेदन को देखने के लिए देखें",
  "I already know the Central Government authority":
    "मुझे केंद्रीय सरकारी प्राधिकरण पहले से पता है",
  "Describe the problem": "समस्या बताएँ",
  "Continue to location": "स्थान पर जाएँ",
  "Choose the closest topic to continue":
    "जारी रखने के लिए सबसे नज़दीकी विषय चुनें",
  "Briefly describe the government record you need":
    "जिस सरकारी रिकॉर्ड की ज़रूरत है, उसका संक्षिप्त वर्णन करें",
  "What do you need information about?": "आपको किस विषय में जानकारी चाहिए?",
  "Tell us what happened in your own words. We’ll turn it into a request for records and help identify the public authority that is likely to hold them.":
    "अपने शब्दों में बताएँ कि क्या हुआ। हम इसे रिकॉर्ड माँगने वाले आवेदन में बदलेंगे और वह सार्वजनिक प्राधिकरण पहचानने में मदद करेंगे जिसके पास रिकॉर्ड होने की संभावना है।",
  "RTI can uncover records": "RTI रिकॉर्ड सामने ला सकता है",
  "Status, file notes, spending, contracts, rules, inspection reports and action taken.":
    "स्थिति, फाइल नोटिंग, खर्च, अनुबंध, नियम, निरीक्षण रिपोर्ट और की गई कार्रवाई।",
  "RTI does not fix the problem directly": "RTI समस्या को सीधे ठीक नहीं करता",
  "It cannot order a repair, settle a private dispute or replace an emergency or grievance service.":
    "यह मरम्मत का आदेश नहीं दे सकता, निजी विवाद नहीं सुलझा सकता और आपातकालीन या शिकायत सेवा का विकल्प नहीं है।",
  "Describe the issue": "समस्या का वर्णन करें",
  "Example: My passport police verification has been pending for five months. I want to know when the report was received and why my application is on hold.":
    "उदाहरण: मेरे पासपोर्ट का पुलिस सत्यापन पाँच महीने से लंबित है। मैं जानना चाहता/चाहती हूँ कि रिपोर्ट कब मिली और मेरा आवेदन क्यों रुका हुआ है।",
  "Do not include Aadhaar, bank details, passwords or medical records here.":
    "यहाँ आधार, बैंक विवरण, पासवर्ड या मेडिकल रिकॉर्ड शामिल न करें।",
  "Search road, pension, police, land…": "सड़क, पेंशन, पुलिस, ज़मीन खोजें…",
  "Your neighbourhood": "आपका पड़ोस",
  "Public services": "सार्वजनिक सेवाएँ",
  "Benefits and livelihoods": "लाभ और आजीविका",
  "Everything else": "अन्य सभी विषय",
  "Repairs, tenders, contractors and inspection reports":
    "मरम्मत, निविदाएँ, ठेकेदार और निरीक्षण रिपोर्ट",
  "Complaints, cleaning schedules and work orders":
    "शिकायतें, सफ़ाई का समय और कार्य आदेश",
  "Supply logs, tanker bills and quality reports":
    "आपूर्ति रिकॉर्ड, टैंकर बिल और गुणवत्ता रिपोर्ट",
  "Teacher vacancies, grants, meals and inspections":
    "शिक्षक रिक्तियाँ, अनुदान, भोजन और निरीक्षण",
  "Staff, medicines, equipment and patient services":
    "कर्मचारी, दवाइयाँ, उपकरण और मरीज सेवाएँ",
  "Repair logs, contracts and complaint action":
    "मरम्मत रिकॉर्ड, अनुबंध और शिकायत पर कार्रवाई",
  "Collection routes, staff rosters and contractor payments":
    "कचरा संग्रह मार्ग, कर्मचारी सूची और ठेकेदार भुगतान",
  "Card status, shop stock, allotment and complaints":
    "कार्ड की स्थिति, दुकान का स्टॉक, आवंटन और शिकायतें",
  "Application status, eligibility and payment records":
    "आवेदन की स्थिति, पात्रता और भुगतान रिकॉर्ड",
  "File movement, objections and reasons recorded for delay":
    "फाइल की आवाजाही, आपत्तियाँ और देरी के दर्ज कारण",
  "Outage logs, billing records and service standards":
    "बिजली कटौती रिकॉर्ड, बिल विवरण और सेवा मानक",
  "Muster rolls, job cards, wages and work records":
    "मस्टर रोल, जॉब कार्ड, मजदूरी और काम के रिकॉर्ड",
  "Refunds, recruitment, facilities and complaint records":
    "रिफंड, भर्ती, सुविधाएँ और शिकायत रिकॉर्ड",
  "Police verification, file movement, status and reasons for delay":
    "पुलिस सत्यापन, फाइल की आवाजाही, स्थिति और देरी के कारण",
  "Police, land, housing, exams, permits, taxes or another public record":
    "पुलिस, ज़मीन, आवास, परीक्षा, परमिट, कर या कोई अन्य सार्वजनिक रिकॉर्ड",
  "Any Indian language is okay": "कोई भी भारतीय भाषा चलेगी",
  "Closest matches": "सबसे नज़दीकी विषय",
  "Common topics": "सामान्य विषय",
  "Choose what best describes your request":
    "अपने आवेदन का सबसे सही वर्णन चुनें",
  "Browse all {count} topics": "सभी {count} विषय देखें",
  "Selected topic": "चुना गया विषय",
  "Find your topic": "अपना विषय खोजें",
  "No exact topic found": "कोई सटीक विषय नहीं मिला",
  "That does not mean RTI cannot help. Start with the general government-record path and tailor the records on the next screens.":
    "इसका मतलब यह नहीं कि RTI मदद नहीं कर सकता। सामान्य सरकारी रिकॉर्ड वाला रास्ता चुनें और अगले चरणों में रिकॉर्ड की जानकारी स्पष्ट करें।",
  Suggested: "सुझाया गया",
  "Search topics": "विषय खोजें",
  "Example requests": "उदाहरण आवेदन",
  "Continue to draft the request": "आवेदन के मसौदे पर जाएँ",
  "What can be requested?": "क्या माँगा जा सकता है?",
  "What is the school called?": "स्कूल का नाम क्या है?",
  "What is the hospital called?": "अस्पताल का नाम क्या है?",
  "Not sure": "पक्का नहीं है",
  "Additional detail": "अतिरिक्त जानकारी",
  Location: "स्थान",
  Authority: "प्राधिकरण",
  Draft: "मसौदा",
  Review: "समीक्षा",
  State: "राज्य",
  "Select your state": "अपना राज्य चुनें",
  "City, town or village": "शहर, कस्बा या गाँव",
  "e.g. Hyderabad": "जैसे, हैदराबाद",
  "City / town": "शहर / कस्बा",
  Village: "गाँव",
  "Find the department": "विभाग खोजें",
  "Choose your state to continue": "जारी रखने के लिए अपना राज्य चुनें",
  "The same problem is handled by different offices in different places.":
    "एक ही समस्या का काम अलग-अलग जगहों पर अलग कार्यालय देखते हैं।",
  "Central Government": "केंद्र सरकार",
  "State Government": "राज्य सरकार",
  "Local body": "स्थानीय निकाय",
  "This office does the work.": "यह कार्यालय यह काम करता है।",
  "This office holds the papers.": "रिकॉर्ड इसी कार्यालय के पास हैं।",
  "If this is not the correct office": "अगर यह सही कार्यालय नहीं है",
  "Go back to the suggested office": "सुझाए गए कार्यालय पर वापस जाएँ",
  "Address it to the": "इसे संबोधित करें",
  "Assumed: {value}.": "मान लिया गया: {value}।",
  "This portal accepts this application": "यह पोर्टल यह आवेदन स्वीकार करता है",
  "This is a State Government matter.": "यह राज्य सरकार से जुड़ा मामला है।",
  "This is not a Central Government office.":
    "यह केंद्रीय सरकारी कार्यालय नहीं है।",
  "⚠ Important notice": "⚠ महत्वपूर्ण सूचना",
  "Why?": "क्यों?",
  Jurisdiction: "अधिकार-क्षेत्र",
  "Filing route": "आवेदन जमा करने का रास्ता",
  "How to word it": "इसे कैसे लिखें",
  "Select the information sought": "माँगी जाने वाली जानकारी चुनें",
  "Select each item to include. Each selection becomes a numbered point in the request.":
    "जिस जानकारी को शामिल करना है, उसे चुनें। हर चयन आवेदन में क्रमांकित बिंदु बनेगा।",
  "Draft the request": "आवेदन का मसौदा बनाएँ",
  "Select at least one item to request.":
    "माँगने के लिए कम-से-कम एक बिंदु चुनें।",
  "Add a custom point": "अपना बिंदु जोड़ें",
  "Requests must be for facts and records":
    "आवेदन तथ्य और रिकॉर्ड के लिए होना चाहिए",
  "Show the difference": "अंतर देखें",
  "Review before submission": "जमा करने से पहले समीक्षा करें",
  "Continue to the form": "फॉर्म पर जाएँ",
  "Addressed to": "किसे संबोधित",
  "Information sought": "माँगी गई जानकारी",
  "Period covered": "अवधि",
  thing: "बिंदु",
  things: "बिंदु",
  "Not specified": "उल्लेख नहीं किया गया",
  "Copied to clipboard.": "क्लिपबोर्ड पर कॉपी हो गया।",
  "Could not copy automatically. Use Save as a file instead.":
    "अपने-आप कॉपी नहीं हो सका। इसके बजाय फ़ाइल के रूप में सेव करें।",
  "Copy the request": "आवेदन कॉपी करें",
  "Save as a file": "फ़ाइल के रूप में सेव करें",
  "Your request is ready": "आपका आवेदन तैयार है",
  "Check and finish": "जाँचें और पूरा करें",

  // Payments.
  "Check payment status": "भुगतान की स्थिति जाँचें",
  "Reference number": "संदर्भ संख्या",
  Amount: "राशि",
  "Amount debited": "डेबिट की गई राशि",
  "Bank reference": "बैंक संदर्भ",
  Started: "शुरू हुआ",
  "RTI registration number": "RTI पंजीकरण संख्या",
  "Your payment record": "आपका भुगतान रिकॉर्ड",
  "Copy reference": "संदर्भ कॉपी करें",
  Confirmed: "पुष्टि हो गई",
  "No. Nothing was charged.": "नहीं। कोई राशि नहीं काटी गई।",
  "Confirmation pending with the bank": "बैंक से पुष्टि लंबित है",
  "Payment protection": "भुगतान सुरक्षा",
  "Fee paid": "शुल्क जमा",
  "RTI registered": "RTI पंजीकृत",
  "Not started": "शुरू नहीं हुआ",
  "In progress": "प्रगति पर",
  Complete: "पूरा",
  "Not completed": "पूरा नहीं हुआ",
  Delayed: "विलंबित",
  "Pay using": "भुगतान का माध्यम",
  "Paying for": "भुगतान किसके लिए",
  "RTI application fee": "RTI आवेदन शुल्क",
  "Debit card": "डेबिट कार्ड",
  "Net banking": "नेट बैंकिंग",
  "Before you pay": "भुगतान से पहले",
  "Pay ₹{amount} and submit this request":
    "₹{amount} का भुगतान करके आवेदन जमा करें",
  Check: "जाँचें",
  "Matching payments": "मिलते-जुलते भुगतान",
  "Your payments": "आपके भुगतान",
  "No payments yet": "अभी कोई भुगतान नहीं",
  "Safe to pay again": "दोबारा भुगतान करना सुरक्षित है",
  "Do not pay again": "दोबारा भुगतान न करें",
  "No action required": "कोई कार्रवाई ज़रूरी नहीं",
  "Contacting the bank… {seconds}s":
    "बैंक से संपर्क हो रहा है… {seconds} सेकंड",
  "Checking…": "जाँच हो रही है…",
  "Check status now": "अभी स्थिति जाँचें",
  "Try payment again": "दोबारा भुगतान करें",
  "Track this request": "यह आवेदन ट्रैक करें",
  "Go to My requests": "मेरे आवेदनों पर जाएँ",
  "Track a request": "आवेदन ट्रैक करें",
  "Enter the registration number from your acknowledgement. You do not need an account.":
    "अपनी पावती में दी गई पंजीकरण संख्या दर्ज करें। आपको खाता बनाने की ज़रूरत नहीं है।",
  "Registration number": "पंजीकरण संख्या",
  "Show status": "स्थिति दिखाएँ",
  "No request found with that number. This may be verified against the acknowledgement email; the format is DOFPD/R/E/26/03310.":
    "इस संख्या से कोई आवेदन नहीं मिला। पावती वाले ईमेल से संख्या जाँचें; प्रारूप DOFPD/R/E/26/03310 है।",
  "Demo request:": "डेमो आवेदन:",
  "If already signed in, all requests are listed in":
    "अगर आप पहले से साइन इन हैं, तो सभी आवेदन यहाँ सूचीबद्ध हैं",
  "No registration number is required.": "पंजीकरण संख्या की ज़रूरत नहीं है।",
  "to see every request you have filed, with its response deadline tracked.":
    "अपने सभी आवेदनों और उनकी उत्तर समय-सीमा को ट्रैक करने के लिए।",

  // Guidelines, FAQ and support.
  "Before you file": "आवेदन भरने से पहले",
  "Guidelines for use of the RTI Online portal":
    "RTI ऑनलाइन पोर्टल के उपयोग के दिशा-निर्देश",
  "You accepted these guidelines": "आपने इन दिशा-निर्देशों को स्वीकार किया है",
  "I have read and understood the above guidelines.":
    "मैंने ऊपर दिए गए दिशा-निर्देश पढ़ और समझ लिए हैं।",
  "Tick the box to continue": "जारी रखने के लिए बॉक्स पर टिक करें",
  "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
  "Find answers to the most common questions about RTI.":
    "RTI से जुड़े सामान्य प्रश्नों के उत्तर पाएँ।",
  "Search for questions": "प्रश्न खोजें",
  "Search for questions...": "प्रश्न खोजें…",
  "FAQ categories": "FAQ श्रेणियाँ",
  Breadcrumb: "ब्रेडक्रंब",
  "Search and filter frequently asked questions":
    "अक्सर पूछे जाने वाले प्रश्न खोजें और फ़िल्टर करें",
  "No questions match": "कोई प्रश्न मेल नहीं खाता",
  "{count} questions match": "{count} प्रश्न मेल खाते हैं",
  "Link to this answer": "इस उत्तर की लिंक",
  General: "सामान्य",
  "Filing RTI": "RTI दाखिल करना",
  Payment: "भुगतान",
  "Status & Tracking": "स्थिति और ट्रैकिंग",
  Appeals: "अपील",
  Others: "अन्य",
  All: "सभी",
  "What is RTI?": "RTI क्या है?",
  "The Right to Information (RTI) Act, 2005 empowers Indian citizens to request information from public authorities. It promotes transparency and accountability in the working of public institutions.":
    "सूचना का अधिकार (RTI) अधिनियम, 2005 भारतीय नागरिकों को सार्वजनिक प्राधिकरणों से जानकारी माँगने का अधिकार देता है। यह सार्वजनिक संस्थाओं के कामकाज में पारदर्शिता और जवाबदेही बढ़ाता है।",
  "Who can file an RTI application?": "RTI आवेदन कौन दाखिल कर सकता है?",
  "Any citizen of India can file an RTI application. You do not need to explain why you want the information.":
    "भारत का कोई भी नागरिक RTI आवेदन दाखिल कर सकता है। आपको यह बताने की ज़रूरत नहीं कि जानकारी क्यों चाहिए।",
  "How do I file an RTI online?": "मैं ऑनलाइन RTI कैसे दाखिल करूँ?",
  "Choose Submit Request, select the appropriate public authority, write a clear request for existing records, add your contact details, and pay the prescribed application fee unless you are exempt.":
    "‘आवेदन जमा करें’ चुनें, सही सार्वजनिक प्राधिकरण चुनें, मौजूद रिकॉर्ड के लिए स्पष्ट आवेदन लिखें, संपर्क विवरण जोड़ें और छूट न होने पर निर्धारित आवेदन शुल्क दें।",
  "What is the application fee for filing an RTI?":
    "RTI दाखिल करने का आवेदन शुल्क कितना है?",
  "The standard application fee for a Central Government RTI request is ₹10. Applicants below the poverty line are exempt when valid proof is provided. Additional copying charges may apply.":
    "केंद्रीय सरकार के RTI आवेदन का सामान्य शुल्क ₹10 है। वैध प्रमाण देने पर गरीबी रेखा से नीचे के आवेदकों को छूट मिलती है। प्रतियों का अतिरिक्त शुल्क लग सकता है।",
  "How can I track the status of my RTI application?":
    "मैं अपने RTI आवेदन की स्थिति कैसे ट्रैक करूँ?",
  "If you are signed in, every request is in My requests with its current stage and how many of the 30 days are left — open one to see its full history. If you do not have an account, use Track a request and enter the registration number from your acknowledgement.":
    "साइन इन करने पर हर आवेदन ‘मेरे आवेदन’ में उसकी वर्तमान स्थिति और 30 दिनों में बचे समय के साथ दिखेगा—पूरा इतिहास देखने के लिए उसे खोलें। खाता न हो तो ‘आवेदन ट्रैक करें’ चुनकर पावती की पंजीकरण संख्या दर्ज करें।",
  "What is the time limit for a response?": "उत्तर देने की समय-सीमा क्या है?",
  "A public authority ordinarily has 30 days to respond. Requests concerning a person's life or liberty must be answered within 48 hours. Different statutory limits can apply in some transfer and third-party cases.":
    "सार्वजनिक प्राधिकरण को सामान्यतः 30 दिनों में उत्तर देना होता है। किसी व्यक्ति के जीवन या स्वतंत्रता से जुड़े आवेदन का उत्तर 48 घंटे में देना होगा। कुछ स्थानांतरण और तीसरे पक्ष के मामलों में अलग वैधानिक समय-सीमा लागू हो सकती है।",
  "What if I am not satisfied with the response?":
    "अगर मैं उत्तर से संतुष्ट नहीं हूँ तो क्या करूँ?",
  "You may file a First Appeal if the response is incomplete, misleading, refused, or otherwise unsatisfactory. You can also appeal when the public authority misses the legal response deadline.":
    "उत्तर अधूरा, भ्रामक, अस्वीकार किया गया या असंतोषजनक हो तो आप प्रथम अपील दाखिल कर सकते हैं। सार्वजनिक प्राधिकरण कानूनी समय-सीमा चूक जाए तब भी अपील की जा सकती है।",
  "How do I file a first appeal?": "मैं प्रथम अपील कैसे दाखिल करूँ?",
  "Open the relevant application, choose File First Appeal, select the reason for appeal, and submit it to the designated First Appellate Authority. There is no fee for a First Appeal on this portal.":
    "संबंधित आवेदन खोलें, ‘प्रथम अपील भरें’ चुनें, अपील का कारण चुनें और नामित प्रथम अपीलीय प्राधिकरण को जमा करें। इस पोर्टल पर प्रथम अपील का कोई शुल्क नहीं है।",
  "Can I file an RTI application in any language?":
    "क्या मैं किसी भी भाषा में RTI आवेदन दाखिल कर सकता हूँ?",
  "An application may be made in English, Hindi, or the official language of the area where the request is filed. Use clear, specific wording so the authority can identify the records.":
    "आवेदन अंग्रेज़ी, हिन्दी या उस क्षेत्र की आधिकारिक भाषा में दिया जा सकता है जहाँ आवेदन दाखिल हो रहा है। स्पष्ट और विशिष्ट शब्दों का उपयोग करें ताकि प्राधिकरण रिकॉर्ड पहचान सके।",
  "What information cannot be provided under RTI?":
    "RTI के तहत कौन-सी जानकारी नहीं दी जा सकती?",
  "Sections 8 and 9 of the RTI Act exempt limited categories such as information affecting national security, protected commercial confidence, certain personal information, and copyrighted material. Exempt portions should be separated where the remaining record can be disclosed.":
    "RTI अधिनियम की धाराएँ 8 और 9 राष्ट्रीय सुरक्षा, संरक्षित व्यावसायिक गोपनीयता, कुछ व्यक्तिगत जानकारी और कॉपीराइट सामग्री जैसी सीमित श्रेणियों को छूट देती हैं। बाकी रिकॉर्ड दिया जा सकता हो तो छूट वाले हिस्से अलग किए जाने चाहिए।",
  "No matching questions": "कोई मिलता-जुलता प्रश्न नहीं मिला",
  "Try another search term or category.": "कोई दूसरा शब्द या श्रेणी आज़माएँ।",
  "Clear search and filters": "खोज और फ़िल्टर साफ़ करें",
  "Additional assistance": "अतिरिक्त सहायता",
  "Contact support for further assistance.":
    "अधिक सहायता के लिए सपोर्ट से संपर्क करें।",
  "Contact Us": "हमसे संपर्क करें",
  "Assistance is available. Contact any of the channels below.":
    "सहायता उपलब्ध है। नीचे दिए गए किसी भी माध्यम से संपर्क करें।",
  "Enter your full name": "अपना पूरा नाम दर्ज करें",
  "Enter your email address": "अपना ईमेल पता दर्ज करें",
  "Enter application number": "आवेदन संख्या दर्ज करें",
  "Type your message here...": "अपना संदेश यहाँ लिखें…",
  "Before submitting a query, the FAQ section may be checked.":
    "प्रश्न भेजने से पहले FAQ अनुभाग देख सकते हैं।",
  "You may find answers to common questions there.":
    "वहाँ सामान्य प्रश्नों के उत्तर मिल सकते हैं।",
  "Support options": "सहायता के विकल्प",
  "Call Us": "हमें कॉल करें",
  "Email Us": "हमें ईमेल करें",
  "Live Chat": "लाइव चैट",
  "Write to Us": "हमें लिखें",
  "Mon – Fri (9:00 AM – 6:00 PM)": "सोम–शुक्र (सुबह 9:00 – शाम 6:00)",
  "(Toll Free)": "(टोल फ्री)",
  "We will respond within": "हम उत्तर देंगे",
  "1–2 working days": "1–2 कार्यदिवस में",
  "Chat with our support executive": "हमारे सहायता प्रतिनिधि से चैट करें",
  "RTI Online Support Desk": "RTI ऑनलाइन सहायता डेस्क",
  "Department of Personnel & Training,": "कार्मिक और प्रशिक्षण विभाग,",
  "North Block, New Delhi – 110001": "नॉर्थ ब्लॉक, नई दिल्ली – 110001",
  "Send a message": "संदेश भेजें",
  "Full Name": "पूरा नाम",
  "Email Address": "ईमेल पता",
  Subject: "विषय",
  "Select a subject": "विषय चुनें",
  "Application status": "आवेदन की स्थिति",
  "Payment issue": "भुगतान की समस्या",
  "Technical problem": "तकनीकी समस्या",
  Other: "अन्य",
  "Application Number": "आवेदन संख्या",
  Message: "संदेश",
  "Send Message": "संदेश भेजें",
  "The message has been sent. A response will be provided within 1–2 working days.":
    "संदेश भेज दिया गया है। 1–2 कार्यदिवस में उत्तर दिया जाएगा।",
  "View FAQ": "FAQ देखें",

  // Detail and appeals.
  "This request could not be found.": "यह आवेदन नहीं मिला।",
  Acknowledgement: "पावती",
  "Download acknowledgement": "पावती डाउनलोड करें",
  "Application received": "आवेदन प्राप्त हुआ",
  "Forwarded to the department": "विभाग को भेजा गया",
  "Reply from department": "विभाग का उत्तर",
  "Reply received": "उत्तर प्राप्त हुआ",
  "Documents submitted": "जमा किए गए दस्तावेज़",
  "Who is answerable": "जवाबदेह अधिकारी",
  "Your details on record": "रिकॉर्ड में आपके विवरण",
  "Your rights from here": "यहाँ से आपके अधिकार",
  "Hearing on your appeal": "आपकी अपील पर सुनवाई",
  "No fee": "कोई शुल्क नहीं",
  "First Appeal": "प्रथम अपील",
  "Second Appeal": "द्वितीय अपील",
  "File First Appeal": "प्रथम अपील भरें",
  "File Second Appeal": "द्वितीय अपील भरें",
  "Hearing scheduled": "सुनवाई तय हुई",
  "Upload document": "दस्तावेज़ अपलोड करें",
  "Information provided": "जानकारी दी गई",
  "Provided in part, refused in part": "कुछ जानकारी दी गई, कुछ रोकी गई",
  Refused: "अस्वीकार किया गया",
  Name: "नाम",
  Address: "पता",
  Mobile: "मोबाइल",
  Fee: "शुल्क",
  Ministry: "मंत्रालय",
  "Form requested": "माँगा गया प्रारूप",
  "Fee receipt": "शुल्क रसीद",
  "Basis of waiver": "छूट का आधार",
  "How you want to be heard": "आप किस तरह अपनी बात रखना चाहते हैं",
  "Attend in person": "व्यक्तिगत रूप से उपस्थित हों",
  "Send a representative": "प्रतिनिधि भेजें",
  "Decide on the written submission alone":
    "केवल लिखित प्रस्तुति पर निर्णय लें",
  "Supporting document": "सहायक दस्तावेज़",
  Confirm: "पुष्टि करें",
  "Submit appeal": "अपील जमा करें",
  "Being generated": "बनाया जा रहा है",
  Ground: "आधार",
  Hearing: "सुनवाई",

  // Dynamic plural/date phrases.
  "{count} day overdue": "{count} दिन की देरी",
  "{count} days overdue": "{count} दिनों की देरी",
  "{count} day left": "{count} दिन बाकी",
  "{count} days left": "{count} दिन बाकी",
  "With appellate authority": "अपीलीय प्राधिकरण के पास",
  Answered: "उत्तर मिल गया",
  "Clock stopped — fee due": "घड़ी रुकी है — शुल्क देना है",
  "Application number": "आवेदन संख्या",
  "Day {day} of the {limit}-day limit": "{limit} दिनों की सीमा में दिन {day}",
  "Step {step} of {total}": "{total} में से चरण {step}",
  "Step {step} of {total} · about 5 minutes":
    "चरण {step} / {total} · लगभग 5 मिनट",

  // Filing, payment, the request screens and both appeals.
  "(Optional)": "(वैकल्पिक)",
  "A First Appeal is free under the RTI Act.":
    "RTI अधिनियम के तहत प्रथम अपील निःशुल्क है।",
  "A First Appeal is free.": "प्रथम अपील निःशुल्क है।",
  "A Second Appeal is not open on this request yet":
    "इस आवेदन पर द्वितीय अपील अभी उपलब्ध नहीं है",
  "A Second Appeal to the Information Commission is free under the RTI Act.":
    "RTI अधिनियम के तहत सूचना आयोग में द्वितीय अपील निःशुल्क है।",
  "A blank has been left in this request. It may be completed on the draft screen.":
    "इस आवेदन में एक स्थान खाली छूट गया है। इसे प्रारूप स्क्रीन पर भरा जा सकता है।",
  "A complaint is not an appeal. It goes straight to the same Commission, at any time, and it is the remedy where an office refused to accept the application, refused to name a CPIO, charged a fee it was not entitled to, or gave information that was knowingly false. There is no deadline on it.":
    "शिकायत अपील नहीं है। यह सीधे उसी आयोग में, कभी भी की जा सकती है। यह उपाय तब है जब कार्यालय ने आवेदन लेने से मना किया हो, CPIO का नाम बताने से इनकार किया हो, ऐसा शुल्क लिया हो जिसका वह हकदार नहीं था, या जानबूझकर गलत जानकारी दी हो। इस पर कोई समय-सीमा नहीं है।",
  "A state office is not listed in the central ministry dropdowns, so this application names it directly. Section 6(3) still applies: if it reaches the wrong officer, they must forward it within 5 days rather than reject it.":
    "राज्य का कार्यालय केंद्रीय मंत्रालयों की सूची में नहीं होता, इसलिए यह आवेदन उसका नाम सीधे दर्ज करता है। धारा 6(3) फिर भी लागू है: यदि यह गलत अधिकारी तक पहुँचे, तो उसे अस्वीकार करने के बजाय 5 दिनों में आगे भेजना होगा।",
  "Accepted formats: PDF, JPG or PNG, up to 5 MB. A clear photograph of the document is acceptable.":
    "स्वीकृत प्रारूप: PDF, JPG या PNG, अधिकतम 5 MB। दस्तावेज़ की साफ़ तस्वीर भी मान्य है।",
  "Additional fee for the cost of supply":
    "जानकारी उपलब्ध कराने की लागत का अतिरिक्त शुल्क",
  "Address it to": "इसे इन्हें संबोधित करें",
  "All three are free. None of them requires a lawyer, and none of them may be refused for want of a form or a stamp.":
    "तीनों निःशुल्क हैं। किसी के लिए वकील ज़रूरी नहीं है, और किसी को फ़ॉर्म या स्टाम्प न होने के कारण अस्वीकार नहीं किया जा सकता।",
  "An Initiative of Department of": "एक पहल — विभाग",
  "Answers the request — s.5(1)": "आवेदन का उत्तर देते हैं — धारा 5(1)",
  "Appealing against": "किसके विरुद्ध अपील",
  Applicant: "आवेदक",
  "Applicant and RTI details": "आवेदक और RTI का विवरण",
  "Applicant and appeal details": "आवेदक और अपील का विवरण",
  "Applicant details": "आवेदक का विवरण",
  "Application Fee": "आवेदन शुल्क",
  "Application Submitted": "आवेदन जमा हुआ",
  "Applies to you": "आप पर लागू",
  "Asks for an opinion and a judgement. No file contains “the reason for negligence”, so the officer can honestly reply that no such record exists.":
    "यह राय और निर्णय माँगता है। किसी फ़ाइल में “लापरवाही का कारण” दर्ज नहीं होता, इसलिए अधिकारी सही-सही कह सकता है कि ऐसा कोई अभिलेख नहीं है।",
  "Back to My requests": "मेरे आवेदनों पर लौटें",
  "Back to this request": "इस आवेदन पर लौटें",
  "Back to your requests": "अपने आवेदनों पर लौटें",
  "Check Payment Status": "भुगतान की स्थिति जाँचें",
  "Choose the outcome to walk through. The default is the one that breaks people on the real portal.":
    "देखने के लिए परिणाम चुनें। डिफ़ॉल्ट वही है जो असली पोर्टल पर लोगों को सबसे ज़्यादा परेशान करता है।",
  "Complaint — section 18": "शिकायत — धारा 18",
  "Complete this field": "यह जानकारी भरें",
  "Continue anyway and prepare the draft":
    "फिर भी आगे बढ़ें और प्रारूप तैयार करें",
  "Correspondence about this request may be sent to either officer directly, quoting the registration number. Neither of them may charge you for doing so.":
    "इस आवेदन से जुड़ा पत्राचार पंजीकरण संख्या का उल्लेख करते हुए किसी भी अधिकारी को सीधे भेजा जा सकता है। इसके लिए कोई शुल्क नहीं लिया जा सकता।",
  "Create an Account": "खाता बनाएँ",
  "Day 0 — filed": "दिन 0 — दाखिल",
  "Day {day}": "दिन {day}",
  "Demo control": "डेमो नियंत्रण",
  "Demo control · time machine": "डेमो नियंत्रण · टाइम मशीन",
  "Demo control · what the bank does next":
    "डेमो नियंत्रण · बैंक आगे क्या करता है",
  "Demo time machine": "डेमो टाइम मशीन",
  Department: "विभाग",
  "Describe your request": "अपना आवेदन लिखें",
  Disposed: "निपटाया गया",
  "Do not know which department? Identify it from your problem →":
    "पता नहीं किस विभाग में जाना है? अपनी समस्या से विभाग पहचानें →",
  Done: "पूरा हुआ",
  "Drag to move this request through time and watch the law take effect.":
    "इस आवेदन को समय में आगे-पीछे खिसकाएँ और देखें कि कानून कैसे लागू होता है।",
  "File a First Appeal": "प्रथम अपील दाखिल करें",
  "File a Second Appeal": "द्वितीय अपील दाखिल करें",
  "File an RTI request": "RTI आवेदन दाखिल करें",
  "Filing a First Appeal is free and does not require a lawyer.":
    "प्रथम अपील दाखिल करना निःशुल्क है और इसके लिए वकील की ज़रूरत नहीं है।",
  "Filing method": "दाखिल करने का तरीका",
  "First Appeal submitted": "प्रथम अपील जमा हुई",
  "First Appeal — section 19(1)": "प्रथम अपील — धारा 19(1)",
  "Fix automatically": "अपने आप ठीक करें",
  "For SMS updates": "SMS अपडेट के लिए",
  "For example: Please provide the current status of pension case file PPO-2019/44871, the reason for the delay since January, and the name of the officer holding the file.":
    "उदाहरण: कृपया पेंशन फ़ाइल PPO-2019/44871 की वर्तमान स्थिति, जनवरी से हो रही देरी का कारण, और फ़ाइल जिस अधिकारी के पास है उसका नाम उपलब्ध कराएँ।",
  "Forgot Password?": "पासवर्ड भूल गए?",
  "General Information": "सामान्य जानकारी",
  "Ground for appeal": "अपील का आधार",
  "Ground for the Second Appeal": "द्वितीय अपील का आधार",
  "Hears a First Appeal — s.19(1)": "प्रथम अपील सुनते हैं — धारा 19(1)",
  "I confirm that the information given in this appeal is true and relates to the RTI application shown above.":
    "मैं पुष्टि करता/करती हूँ कि इस अपील में दी गई जानकारी सही है और ऊपर दिखाए गए RTI आवेदन से संबंधित है।",
  "I confirm that the information given in this appeal is true, that it relates to the RTI application and First Appeal shown above, and that the matter is not pending before any court.":
    "मैं पुष्टि करता/करती हूँ कि इस अपील में दी गई जानकारी सही है, यह ऊपर दिखाए गए RTI आवेदन और प्रथम अपील से संबंधित है, और यह मामला किसी न्यायालय में विचाराधीन नहीं है।",
  "I hold a Below Poverty Line card":
    "मेरे पास गरीबी रेखा से नीचे (BPL) का कार्ड है",
  "If a payment was made but no confirmation was received, its current status can be checked here, along with any action required.":
    "यदि भुगतान हो गया हो पर पुष्टि न मिली हो, तो उसकी वर्तमान स्थिति और ज़रूरी कार्रवाई यहाँ देखी जा सकती है।",
  "If no reply is given within that period, the failure is treated as a refusal under section 7(2), and an appeal may be filed free of cost.":
    "यदि उस अवधि में उत्तर नहीं मिलता, तो धारा 7(2) के तहत इसे अस्वीकृति माना जाता है और अपील निःशुल्क दाखिल की जा सकती है।",
  "If you record nothing, the hearing goes ahead on the date fixed and the appeal is decided whether or not you attend.":
    "यदि आप कुछ दर्ज नहीं करते, तो सुनवाई तय तारीख पर होगी और आपकी उपस्थिति के बिना भी अपील पर निर्णय हो जाएगा।",
  "In Progress": "प्रक्रिया में",
  "Issued under section 7(1). This is a record of an application received; it is not a reply to it.":
    "धारा 7(1) के तहत जारी। यह आवेदन प्राप्त होने का अभिलेख है; यह उसका उत्तर नहीं है।",
  "It is now part of this RTI case. Its status and decision deadline will appear in the timeline above.":
    "यह अब इसी RTI मामले का हिस्सा है। इसकी स्थिति और निर्णय की समय-सीमा ऊपर के क्रम में दिखाई देगी।",
  "It will not run again until the additional fee is paid, and the days it is stopped for do not count against the department.":
    "अतिरिक्त शुल्क जमा होने तक यह दोबारा नहीं चलेगी, और रुकी हुई अवधि विभाग के खाते में नहीं गिनी जाती।",
  "Keep current version": "मौजूदा रूप बनाए रखें",
  "Keep the receipt.": "रसीद संभालकर रखें।",
  "Listen to the draft": "प्रारूप सुनें",
  "Loading your requests…": "आपके आवेदन लोड हो रहे हैं…",
  "Ministry or department": "मंत्रालय या विभाग",
  "Names documents that exist, a period, and a post. Each item is either produced, or its absence is itself the answer.":
    "यह मौजूद दस्तावेज़ों, एक अवधि और एक पद का नाम लेता है। हर बिंदु या तो दिया जाएगा, या उसका न होना ही उत्तर होगा।",
  "No First Appeal has been filed on this request yet.":
    "इस आवेदन पर अभी तक कोई प्रथम अपील दाखिल नहीं हुई है।",
  "No fee is payable. Attach your BPL certificate and the ₹10 fee will be waived. This is a right under the RTI Rules, 2012, not a concession.":
    "कोई शुल्क देय नहीं है। अपना BPL प्रमाणपत्र संलग्न करें और ₹10 का शुल्क माफ़ हो जाएगा। यह RTI नियम, 2012 के तहत आपका अधिकार है, कोई रियायत नहीं।",
  "No fee.": "कोई शुल्क नहीं।",
  "No payment is ever left unexplained.":
    "कोई भी भुगतान बिना स्पष्टीकरण के नहीं छोड़ा जाता।",
  "No payment on this account matches that reference. If an amount was debited, it was not received by this portal. Such debits are reversed automatically by the bank. Retain the SMS as proof.":
    "इस खाते का कोई भुगतान उस संदर्भ से मेल नहीं खाता। यदि राशि कटी है, तो वह इस पोर्टल तक नहीं पहुँची। ऐसी कटौती बैंक अपने आप वापस कर देता है। प्रमाण के रूप में SMS संभालकर रखें।",
  "No reply yet from this office. Still inside its 30-day window.":
    "इस कार्यालय से अभी उत्तर नहीं आया है। यह अभी 30 दिन की अवधि के भीतर है।",
  "No request will ever require payment twice.":
    "किसी भी आवेदन के लिए दो बार भुगतान नहीं करना पड़ेगा।",
  "Note:": "ध्यान दें:",
  "Nothing on the record shows that the public interest in disclosure was weighed against the harm claimed. Section 8(2) requires that weighing, and its absence is itself a ground of appeal.":
    "अभिलेख में कहीं नहीं दिखता कि जानकारी देने के सार्वजनिक हित को दावे के नुकसान के मुकाबले तौला गया। धारा 8(2) इस तुलना को ज़रूरी बनाती है, और इसका न होना ही अपील का आधार है।",
  "Office within the ministry or department":
    "मंत्रालय या विभाग के भीतर का कार्यालय",
  Officers: "अधिकारी",
  "On the current portal this is called “Payment Reconciliation”":
    "मौजूदा पोर्टल पर इसे “Payment Reconciliation” कहा जाता है",
  "Once submitted,": "जमा होने के बाद,",
  "Once the ₹10 fee for a request is paid, it will appear here along with its current status.":
    "किसी आवेदन का ₹10 शुल्क जमा होते ही वह अपनी वर्तमान स्थिति के साथ यहाँ दिखाई देगा।",
  "Or type exact dates, e.g. 01/01/2026 to 30/06/2026":
    "या सटीक तारीखें लिखें, जैसे 01/01/2026 से 30/06/2026",
  "Over the limit. Attach the remaining text as a PDF.":
    "सीमा से अधिक। शेष पाठ PDF के रूप में संलग्न करें।",
  "PDF, JPG or PNG. Your original RTI application and your First Appeal are attached automatically — the Commission requires both, and this is the step people are most often sent back for.":
    "PDF, JPG या PNG। आपका मूल RTI आवेदन और प्रथम अपील अपने आप संलग्न हो जाते हैं — आयोग को दोनों चाहिए, और लोग सबसे ज़्यादा इसी चरण पर लौटाए जाते हैं।",
  "PDF, JPG or PNG. Your original RTI is attached automatically.":
    "PDF, JPG या PNG। आपका मूल RTI आवेदन अपने आप संलग्न हो जाता है।",
  "Penalty accruing against the officer": "अधिकारी पर लग रहा जुर्माना",
  "Personnel & Training, GOI": "कार्मिक एवं प्रशिक्षण विभाग, भारत सरकार",
  "Policy on payments": "भुगतान से जुड़ी नीति",
  "Print or save as PDF": "प्रिंट करें या PDF में सहेजें",
  "Public Authority": "लोक प्राधिकरण",
  "Quote this reference when contacting the department or the bank.":
    "विभाग या बैंक से संपर्क करते समय यह संदर्भ संख्या बताएँ।",
  "RTI Application Form": "RTI आवेदन फ़ॉर्म",
  "RTI provides access to records an office already holds: copies, figures, names, dates. It does not require an officer to provide an explanation. The same complaint, written two ways:":
    "RTI उन अभिलेखों तक पहुँच देता है जो कार्यालय के पास पहले से हैं: प्रतियाँ, आँकड़े, नाम, तारीखें। यह किसी अधिकारी से सफ़ाई देने की माँग नहीं करता। यही शिकायत दो तरह से लिखी गई:",
  "RTIPAY26… or your bank reference": "RTIPAY26… या आपका बैंक संदर्भ",
  Received: "प्राप्त",
  "Relief sought from the Appellate Authority":
    "अपीलीय प्राधिकरण से माँगी गई राहत",
  "Relief sought from the Commission": "आयोग से माँगी गई राहत",
  "Restore the written version": "लिखा हुआ रूप वापस लाएँ",
  "Review and submit": "समीक्षा करें और जमा करें",
  "Review and submit appeal": "अपील की समीक्षा करें और जमा करें",
  "Review the details below before submission.":
    "जमा करने से पहले नीचे दिया विवरण देख लें।",
  "Right of appeal": "अपील का अधिकार",
  "Second Appeal — section 19(3)": "द्वितीय अपील — धारा 19(3)",
  "Section 20 of the RTI Act, 2005": "RTI अधिनियम, 2005 की धारा 20",
  "Select Payment Mode": "भुगतान का तरीका चुनें",
  "Select Public Authority": "लोक प्राधिकरण चुनें",
  "Select a ministry or department": "मंत्रालय या विभाग चुनें",
  "Select the option that applies. The official wording will be sent to the department.":
    "जो लागू हो वह विकल्प चुनें। विभाग को आधिकारिक शब्दावली भेजी जाएगी।",
  "Selected by the assistant:": "सहायक द्वारा चुना गया:",
  "Skipped: {label}": "छोड़ा गया: {label}",
  "State your request clearly. You are entitled to request facts and documents already held by the government, and are not required to give a reason.":
    "अपना आवेदन साफ़-साफ़ लिखें। सरकार के पास पहले से मौजूद तथ्य और दस्तावेज़ माँगना आपका अधिकार है, और इसका कारण बताना ज़रूरी नहीं है।",
  "Step 4 of 4 · Payment": "चरण 4 / 4 · भुगतान",
  "Submitted. The office has received the requested document. The 30-day response period continues to run.":
    "जमा हो गया। कार्यालय को माँगा गया दस्तावेज़ मिल गया है। 30 दिन की उत्तर अवधि चलती रहेगी।",
  "Successfully!": "सफलतापूर्वक!",
  "Switch and rewrite": "बदलें और दोबारा लिखें",
  "The Appellate Authority has 30 days to decide, and 45 at the very outside — the longer period is open to it only where it records its reasons for taking it. The decision will appear on your status screen.":
    "अपीलीय प्राधिकरण को निर्णय के लिए 30 दिन मिलते हैं, और अधिकतम 45 — लंबी अवधि तभी ली जा सकती है जब उसका कारण दर्ज किया जाए। निर्णय आपकी स्थिति स्क्रीन पर दिखाई देगा।",
  "The Commission is the only body in this chain that can actually fine an officer. The current portal keeps the Second Appeal on a separate site with its own login, which is where most citizens give up.":
    "इस पूरी शृंखला में आयोग ही एकमात्र संस्था है जो अधिकारी पर सचमुच जुर्माना लगा सकती है। मौजूदा पोर्टल द्वितीय अपील को अलग साइट और अलग लॉगिन पर रखता है, और ज़्यादातर नागरिक वहीं हार मान लेते हैं।",
  "The Commission sits outside the department, and no time limit binds it. Hearings are commonly held by video link from a facility near you, so appearing in Delhi is usually not necessary. You will be sent a notice when your appeal is listed.":
    "आयोग विभाग से बाहर बैठता है और उस पर कोई समय-सीमा बाध्यकारी नहीं है। सुनवाई अक्सर आपके पास की सुविधा से वीडियो लिंक द्वारा होती है, इसलिए दिल्ली आना आमतौर पर ज़रूरी नहीं। आपकी अपील सूचीबद्ध होने पर आपको सूचना भेजी जाएगी।",
  "The clock is stopped.": "घड़ी रुकी हुई है।",
  "The current portal form asks for gender, rural or urban residence, and literacy status. None of this affects your rights under the Act, and this application does not request it.":
    "मौजूदा पोर्टल का फ़ॉर्म लिंग, ग्रामीण या शहरी निवास और साक्षरता की स्थिति पूछता है। इनमें से किसी का भी अधिनियम के तहत आपके अधिकारों पर असर नहीं पड़ता, इसलिए यह आवेदन इन्हें नहीं पूछता।",
  "The current portal makes you type this registration number and your email from memory, then solve a CAPTCHA, before it will even show you the appeal form.":
    "मौजूदा पोर्टल पर अपील का फ़ॉर्म देखने से पहले ही आपको यह पंजीकरण संख्या और ईमेल याद से टाइप करना पड़ता है और CAPTCHA हल करना पड़ता है।",
  "The portal has its own boxes for the address and your name, so it only needs the middle part.":
    "पोर्टल पर पते और नाम के अपने अलग खाने होते हैं, इसलिए उसे केवल बीच का हिस्सा चाहिए।",
  "The provision relied on": "जिस प्रावधान का सहारा लिया गया",
  "The reasons recorded": "दर्ज किए गए कारण",
  "The thirty-day clock starts from the date the office received your application, and the receipt is what proves that date.":
    "तीस दिन की गिनती उस तारीख से शुरू होती है जब कार्यालय को आपका आवेदन मिला, और वह तारीख यही रसीद साबित करती है।",
  "Their reply": "उनका उत्तर",
  "These are the twenty-one guidelines published on the official portal at rtionline.gov.in, reproduced word for word. Read them once; this page will not ask again.":
    "ये rtionline.gov.in पर प्रकाशित इक्कीस दिशानिर्देश हैं, हूबहू वही शब्द। इन्हें एक बार पढ़ लें; यह पृष्ठ दोबारा नहीं पूछेगा।",
  "These details are filled from your account and original application.":
    "यह विवरण आपके खाते और मूल आवेदन से भरा गया है।",
  "These details are filled from your account, your application and your First Appeal.":
    "यह विवरण आपके खाते, आपके आवेदन और प्रथम अपील से भरा गया है।",
  "This appeal is addressed to a senior officer within the same department, the Appellate Authority. It is filed free of cost, and the details below have been filled in from your original application.":
    "यह अपील उसी विभाग के वरिष्ठ अधिकारी, यानी अपीलीय प्राधिकरण को संबोधित है। यह निःशुल्क दाखिल होती है, और नीचे का विवरण आपके मूल आवेदन से भरा गया है।",
  "This appeal is against what the Appellate Authority did, not against the original officer. Select the option that applies.":
    "यह अपील अपीलीय प्राधिकरण के किए के विरुद्ध है, मूल अधिकारी के विरुद्ध नहीं। जो लागू हो वह विकल्प चुनें।",
  "This appeal leaves the department. It is addressed to the Central Information Commission, an independent body with the power to order the information released and to fine the officer responsible. It is filed free of cost, and the details below have been carried over from your application and your First Appeal.":
    "यह अपील विभाग से बाहर जाती है। यह केंद्रीय सूचना आयोग को संबोधित है, जो एक स्वतंत्र संस्था है और जानकारी देने का आदेश देने तथा ज़िम्मेदार अधिकारी पर जुर्माना लगाने की शक्ति रखती है। यह निःशुल्क दाखिल होती है, और नीचे का विवरण आपके आवेदन और प्रथम अपील से लिया गया है।",
  "This application has four steps.": "इस आवेदन के चार चरण हैं।",
  "This decides which Nodal Officer receives your request. If you pick the wrong one, Section 6(3) of the RTI Act requires them to forward it to the correct authority within 5 days — they cannot simply reject it.":
    "इससे तय होता है कि आपका आवेदन किस नोडल अधिकारी को मिलेगा। गलत विकल्प चुनने पर RTI अधिनियम की धारा 6(3) के तहत उन्हें इसे 5 दिनों में सही प्राधिकरण को भेजना होगा — वे इसे यूँ ही अस्वीकार नहीं कर सकते।",
  "This field may be left blank. Your application, the lack of a reply and the undecided First Appeal are attached and form the basis of this appeal.":
    "यह खाना खाली छोड़ा जा सकता है। आपका आवेदन, उत्तर का न मिलना और बिना निर्णय पड़ी प्रथम अपील संलग्न हैं और यही इस अपील का आधार हैं।",
  "This field may be left blank. Your original application and the lack of a response form the basis of this appeal.":
    "यह खाना खाली छोड़ा जा सकता है। आपका मूल आवेदन और उत्तर का न मिलना ही इस अपील का आधार हैं।",
  "This may be found in the bank SMS, UPI app, or the receipt issued at the time of payment. Leave this field blank to view all payments on this account.":
    "यह बैंक के SMS, UPI ऐप या भुगतान के समय मिली रसीद में मिल जाएगा। इस खाते के सभी भुगतान देखने के लिए इसे खाली छोड़ दें।",
  "This number will be recognised by the bank.": "यह संख्या बैंक पहचान लेगा।",
  "This payment could not be found.": "यह भुगतान नहीं मिला।",
  "This right already exists. The current portal never shows it to you — so almost nobody claims it.":
    "यह अधिकार पहले से मौजूद है। मौजूदा पोर्टल इसे कभी दिखाता ही नहीं — इसलिए इसका दावा लगभग कोई नहीं करता।",
  "This text is what the CPIO actually reads. From the day it reaches them, they have 30 days to answer — and if they do not, the law already treats that silence as a refusal you can appeal.":
    "यही पाठ CPIO वास्तव में पढ़ते हैं। उन तक पहुँचने के दिन से उन्हें उत्तर देने के लिए 30 दिन मिलते हैं — और यदि वे नहीं देते, तो कानून उस चुप्पी को ऐसी अस्वीकृति मानता है जिस पर आप अपील कर सकते हैं।",
  "Time allowed for a reply": "उत्तर के लिए दी गई अवधि",
  "Track RTI Application": "RTI आवेदन ट्रैक करें",
  "Use this as a starting point": "इसे शुरुआत के रूप में इस्तेमाल करें",
  "View First Appeal": "प्रथम अपील देखें",
  "View the response": "उत्तर देखें",
  "What actually happens": "असल में क्या होता है",
  "What was withheld": "क्या रोका गया",
  "What went wrong?": "क्या गड़बड़ हुई?",
  "With the Commission": "आयोग के पास",
  "With the department": "विभाग के पास",
  "You have changed this request yourself. Switching format will rewrite it and undo your edits.":
    "आपने यह आवेदन खुद बदला है। प्रारूप बदलने पर यह दोबारा लिखा जाएगा और आपके बदलाव हट जाएँगे।",
  "Your First Appeal has been filed": "आपकी प्रथम अपील दाखिल हो गई है",
  "Your RTI Application Number is": "आपकी RTI आवेदन संख्या है",
  "Your RTI details and authority are already attached to this appeal.":
    "आपके RTI का विवरण और संबंधित प्राधिकरण इस अपील के साथ पहले से संलग्न हैं।",
  "Your Second Appeal has been filed": "आपकी द्वितीय अपील दाखिल हो गई है",
  "Your appeal reaches the Appellate Authority through the same Nodal Officer. They have 30 days to decide, and 45 at the outside if they record why — after that you can go to the Central Information Commission, which is the body that can impose the Section 20 penalty.":
    "आपकी अपील उसी नोडल अधिकारी के ज़रिए अपीलीय प्राधिकरण तक पहुँचती है। उन्हें निर्णय के लिए 30 दिन मिलते हैं, और कारण दर्ज करने पर अधिकतम 45 — उसके बाद आप केंद्रीय सूचना आयोग जा सकते हैं, जो धारा 20 का जुर्माना लगा सकता है।",
  "Your name": "आपका नाम",
  "Your question": "आपका प्रश्न",
  "Your registration number arrives here, and it is the only way to track or appeal this request later. We keep it on your case so you never have to remember it.":
    "आपकी पंजीकरण संख्या यहाँ आती है, और आगे इस आवेदन को ट्रैक करने या अपील करने का यही एकमात्र रास्ता है। हम इसे आपके मामले के साथ रखते हैं ताकि आपको याद रखना न पड़े।",
  "Your right of appeal": "आपका अपील का अधिकार",
  "RTI ONLINE": "आरटीआई ऑनलाइन",
  "Right to Information": "सूचना का अधिकार",
  "a 30-day statutory response period begins. This application will be tracked automatically. If no response is received, the date on which a First Appeal becomes available will be shown, along with any penalty accruing against the officer.":
    "30 दिन की वैधानिक उत्तर अवधि शुरू हो जाती है। इस आवेदन पर अपने आप नज़र रखी जाएगी। उत्तर न मिलने पर वह तारीख दिखाई जाएगी जब प्रथम अपील की जा सकेगी, साथ ही अधिकारी पर लग रहा जुर्माना भी।",
  "go to My requests": "मेरे आवेदनों पर जाएँ",
  "it occurred.": "यह हुआ था।",
  overdue: "समय-सीमा बीत चुकी",
  "since you filed": "आपके दाखिल करने के बाद से",
  "still in time": "अभी समय के भीतर",
  "the file notings on": "इस पर की गई फ़ाइल टिप्पणियाँ",
  "this portal covers central government bodies only. A request intended for a state government will be returned without a refund. If your question concerns a state office, file it on that state's RTI portal.":
    "यह पोर्टल केवल केंद्र सरकार के निकायों के लिए है। राज्य सरकार के लिए भेजा गया आवेदन बिना शुल्क वापसी के लौटा दिया जाएगा। यदि आपका प्रश्न किसी राज्य कार्यालय से जुड़ा है, तो उसे उस राज्य के RTI पोर्टल पर दाखिल करें।",
  "to complete this part directly.": "इस हिस्से को सीधे पूरा करने के लिए।",
  why: "क्यों",
  "{count} days left before they must reply":
    "उत्तर देने की समय-सीमा में {count} दिन बाकी",
  "{count} days past the legal deadline":
    "कानूनी समय-सीमा से {count} दिन बीत चुके",
  "“Copies of all complaints received, inspection reports and file notings relating to the repair of Ganesh Nagar 3rd Cross Road between 01/03/2026 and 27/08/2026, and the name and designation of the officer responsible for its maintenance.”":
    "“01/03/2026 से 27/08/2026 के बीच गणेश नगर तीसरी क्रॉस रोड की मरम्मत से संबंधित प्राप्त सभी शिकायतों, निरीक्षण रिपोर्टों और फ़ाइल टिप्पणियों की प्रतियाँ, तथा इसके रखरखाव के लिए ज़िम्मेदार अधिकारी का नाम और पदनाम।”",
  "“Why has our road not been repaired for 6 months? Who is responsible for this negligence?”":
    "“हमारी सड़क 6 महीने से क्यों नहीं बनी? इस लापरवाही के लिए कौन ज़िम्मेदार है?”",
  "₹0 — waived, BPL certificate attached": "₹0 — माफ़, BPL प्रमाणपत्र संलग्न",
  "₹{amount} was debited under reference {ref}. Registration is still being confirmed. Do not make another payment.":
    "संदर्भ {ref} के तहत ₹{amount} कट गए हैं। पंजीकरण की पुष्टि अभी हो रही है। दोबारा भुगतान न करें।",
  "← Back": "← पीछे",
  "← Back to this request": "← इस आवेदन पर लौटें",
  "✎ Edit": "✎ संपादित करें",
  "✓ Has to be answered": "✓ उत्तर देना ही होगा",
  "✗ Likely to be refused": "✗ अस्वीकार होने की संभावना",
  "⤓ Save as a file": "⤓ फ़ाइल के रूप में सहेजें",
  "⧉ Copy": "⧉ कॉपी करें",
  "⧉ Copy the request": "⧉ आवेदन कॉपी करें",
  "📄 See an example": "📄 उदाहरण देखें",

  // Labels on the acknowledgement, payment and appeal screens.
  "Additional fee": "अतिरिक्त शुल्क",
  "Address for correspondence": "पत्राचार का पता",
  "Appeal number": "अपील संख्या",
  "Appellate Authority": "अपीलीय प्राधिकरण",
  "Application fee": "आवेदन शुल्क",
  Basis: "आधार",
  Before: "इससे पहले",
  Citizenship: "नागरिकता",
  "Date and time": "तारीख और समय",
  "Date forwarded to the CPIO": "CPIO को भेजे जाने की तारीख",
  "Date of receipt": "प्राप्ति की तारीख",
  Declaration: "घोषणा",
  "Demanded on": "माँगे जाने की तारीख",
  Email: "ईमेल",
  "Email ID": "ईमेल आईडी",
  "Enter Application Number": "आवेदन संख्या दर्ज करें",
  "Fee category": "शुल्क श्रेणी",
  Filed: "दाखिल",
  "Form in which access was sought": "जानकारी किस रूप में माँगी गई",
  "Heard by": "सुनवाई करने वाले",
  "How it sits": "यह कहाँ खड़ा है",
  "How it was worked out": "यह कैसे निकाला गया",
  "Joining link": "जुड़ने का लिंक",
  "Mobile Number": "मोबाइल नंबर",
  "Officer (CPIO)": "अधिकारी (CPIO)",
  "Paid on": "भुगतान की तारीख",
  "Pay Now": "अभी भुगतान करें",
  "Period allowed": "दी गई अवधि",
  "Public authority": "लोक प्राधिकरण",
  "RTI application": "RTI आवेदन",
  "Receipt number": "रसीद संख्या",
  "Received on": "प्राप्ति की तारीख",
  Register: "पंजीकरण करें",
  "Reply due on or before": "उत्तर की अंतिम तारीख",
  "Select Department": "विभाग चुनें",
  "Select State": "राज्य चुनें",
  Track: "ट्रैक करें",
  "User ID / Email ID": "यूज़र आईडी / ईमेल आईडी",
  Venue: "स्थान",
  "e.g. DOFPD/R/E/26/03310": "जैसे DOFPD/R/E/26/03310",
  "This text may be edited freely.": "यह पाठ आप जैसे चाहें बदल सकते हैं।",
};

const DICTS: Record<Locale, Dict> = { en: EN, hi: HI };

const LOCALE_KEY = "rti_saral_locale";

interface LocaleState {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Translate a key, falling back to English and then to the key itself. */
  t: (key: string, fallback?: string, values?: TranslationValues) => string;
}

const LocaleContext = createContext<LocaleState | null>(null);

/* The chosen locale is browser state, not React state, so it is read
   through useSyncExternalStore: that gives a stable server snapshot
   ("en") and the real value on the client without a setState-in-effect
   and without a hydration mismatch. */

let current: Locale = "en";
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  try {
    const saved = window.localStorage.getItem(LOCALE_KEY);
    if (saved === "hi" || saved === "en") current = saved;
  } catch {
    /* private mode — whatever is in memory stands */
  }
  return current;
}

/** The server has no browser storage, so it always renders English. */
function getServerSnapshot(): Locale {
  return "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Keep the document language honest, so screen readers and the browser's
  // own translation offer behave correctly.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    current = next;
    try {
      window.localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* not persisted, still applied for this session */
    }
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback(
    (key: string, fallback?: string, values?: TranslationValues) => {
      const template = DICTS[locale][key] ?? EN[key] ?? fallback ?? key;
      return values
        ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
            String(values[name] ?? match),
          )
        : template;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  // Usable outside the provider so a stray component never crashes the page.
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: (key, fallback, values) => {
        const template = EN[key] ?? fallback ?? key;
        return values
          ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
              String(values[name] ?? match),
            )
          : template;
      },
    };
  }
  return ctx;
}
