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
  "lang.partial": "Navigation and statuses are in Hindi. Detailed guidance is still in English.",
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
  "Update": "अपडेट",
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
  "View": "देखें",
  "View all": "सभी देखें",
  "View all requests": "सभी आवेदन देखें",
  "View all activity": "सारी गतिविधि देखें",
  "Read response": "उत्तर पढ़ें",
  "See details": "विवरण देखें",
  "Continue": "जारी रखें",
  "Cancel": "रद्द करें",
  "Back": "पीछे",
  "Edit": "बदलें",
  "Change": "बदलें",
  "Add": "जोड़ें",
  "Remove": "हटाएँ",
  "Copy": "कॉपी करें",
  "Copied ✓": "कॉपी हो गया ✓",
  "Close": "बंद करें",
  "Clear": "साफ़ करें",
  "or": "या",
  "Optional": "वैकल्पिक",
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
  "This will be phrased as a formal request.": "इसे औपचारिक आवेदन के रूप में लिखा जाएगा।",
  "Describe the problem in everyday language, and it will be converted into a formal request for records, not opinions, addressed to the officer required to respond. Every word may be reviewed before submission.":
    "समस्या को रोज़मर्रा की भाषा में बताएँ और इसे राय के बजाय रिकॉर्ड माँगने वाले औपचारिक आवेदन में बदला जाएगा, जिसे जवाब देने वाले अधिकारी को भेजा जाएगा। जमा करने से पहले हर शब्द की समीक्षा की जा सकती है।",
  "Uncertain which office to approach?": "किस कार्यालय से संपर्क करें, समझ नहीं आ रहा?",
  "Uncertain which office is responsible?": "जिम्मेदार कार्यालय कौन-सा है, समझ नहीं आ रहा?",
  "The correct authority will be identified.": "सही प्राधिकरण की पहचान की जाएगी।",
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
  "Public services": "सार्वजनिक सेवाएँ",
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
  "s.7(1) — {days} days to reply, 48 hours where life or liberty is concerned": "धारा 7(1) — उत्तर के लिए {days} दिन; जीवन या स्वतंत्रता से जुड़े मामलों में 48 घंटे",
  "s.19 — first appeal in {first} days, second in {second}": "धारा 19 — प्रथम अपील {first} दिनों में, द्वितीय अपील {second} दिनों में",
  "s.20 — ₹{perDay} a day against the officer, up to ₹{cap}": "धारा 20 — अधिकारी पर प्रतिदिन ₹{perDay}, अधिकतम ₹{cap}",
  "This is an independent design concept and is not an official Government of India website. All data shown is fictional and created for demonstration. The real portal is at rtionline.gov.in.":
    "यह एक स्वतंत्र डिज़ाइन अवधारणा है और भारत सरकार की आधिकारिक वेबसाइट नहीं है। यहाँ दिखाई गई सभी जानकारी डेमो के लिए काल्पनिक है। वास्तविक पोर्टल rtionline.gov.in पर है।",
  "Local demo": "स्थानीय डेमो",
  "Fictional case data": "काल्पनिक आवेदन डेटा",
  "Independent concept": "स्वतंत्र अवधारणा",

  // Authentication and identity.
  "Sign in to track your RTI requests": "अपने RTI आवेदनों को ट्रैक करने के लिए साइन इन करें",
  "Everything in this demo is fictional and runs entirely in your browser. No government system is contacted, and nothing you type is stored anywhere.":
    "इस डेमो की सारी जानकारी काल्पनिक है और यह पूरी तरह आपके ब्राउज़र में चलता है। किसी सरकारी प्रणाली से संपर्क नहीं किया जाता और आपके द्वारा लिखी कोई जानकारी कहीं संग्रहीत नहीं होती।",
  "What you will find inside": "डेमो में आपको मिलेगा",
  "A pension request": "पेंशन का आवेदन",
  "A request they ignored": "एक अनदेखा किया गया आवेदन",
  "A split request": "कई कार्यालयों में बाँटा गया आवेदन",
  "still inside its 30-day window — the normal, working case.": "अभी 30 दिनों की समय-सीमा में है — सामान्य स्थिति।",
  "— move the clock forward and watch the penalty run against the officer.": "— घड़ी आगे बढ़ाकर देखें कि अधिकारी पर जुर्माना कैसे लगता है।",
  "— one question quietly scattered across three offices.": "— एक प्रश्न चुपचाप तीन कार्यालयों में बाँटा गया है।",
  "Citizen sign in": "नागरिक साइन इन",
  "Test credentials are filled in for you.": "परीक्षण विवरण आपके लिए भर दिए गए हैं।",
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
  task: "कार्य",
  tasks: "कार्य",
  "Action needed": "कार्रवाई ज़रूरी",
  Deadline: "समय-सीमा",
  Reply: "उत्तर",
  "Open →": "खोलें →",
  "Unread": "न पढ़ा गया",
  "Update": "अपडेट",
  "today": "आज",
  yesterday: "कल",
  tomorrow: "कल",
  "in {count} days": "{count} दिनों में",
  "{count} days ago": "{count} दिन पहले",

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
  "The responsible office is identified automatically": "जिम्मेदार कार्यालय अपने-आप पहचाना जाएगा",
  "The request is drafted for you": "आवेदन का मसौदा आपके लिए तैयार होगा",
  "Manual filing": "सीधे आवेदन भरें",
  "File directly": "सीधे आवेदन भरें",
  "Select the department and enter the request text directly.":
    "विभाग चुनें और आवेदन का पाठ सीधे दर्ज करें।",
  "Required information": "ज़रूरी जानकारी",
  "The ministry and office that holds the record": "रिकॉर्ड रखने वाला मंत्रालय और कार्यालय",
  "Your question, in your own words": "आपका प्रश्न, अपने शब्दों में",
  "₹10 by UPI (waived for BPL cardholders)": "UPI से ₹10 (BPL कार्डधारकों के लिए माफ़)",
  "Open the form": "फॉर्म खोलें",
  "Read the": "पढ़ें",
  "portal guidelines": "पोर्टल के दिशा-निर्देश",
  "To view a request already in progress, see": "पहले से चल रहे आवेदन को देखने के लिए देखें",
  "I already know the Central Government authority": "मुझे केंद्रीय सरकारी प्राधिकरण पहले से पता है",
  "Describe the problem": "समस्या बताएँ",
  "Continue to location": "स्थान पर जाएँ",
  "Choose the closest topic to continue": "जारी रखने के लिए सबसे नज़दीकी विषय चुनें",
  "Briefly describe the government record you need": "जिस सरकारी रिकॉर्ड की ज़रूरत है, उसका संक्षिप्त वर्णन करें",
  "What do you need information about?": "आपको किस विषय में जानकारी चाहिए?",
  "Tell us what happened in your own words. We’ll turn it into a request for records and help identify the public authority that is likely to hold them.": "अपने शब्दों में बताएँ कि क्या हुआ। हम इसे रिकॉर्ड माँगने वाले आवेदन में बदलेंगे और वह सार्वजनिक प्राधिकरण पहचानने में मदद करेंगे जिसके पास रिकॉर्ड होने की संभावना है।",
  "RTI can uncover records": "RTI रिकॉर्ड सामने ला सकता है",
  "Status, file notes, spending, contracts, rules, inspection reports and action taken.": "स्थिति, फाइल नोटिंग, खर्च, अनुबंध, नियम, निरीक्षण रिपोर्ट और की गई कार्रवाई।",
  "RTI does not fix the problem directly": "RTI समस्या को सीधे ठीक नहीं करता",
  "It cannot order a repair, settle a private dispute or replace an emergency or grievance service.": "यह मरम्मत का आदेश नहीं दे सकता, निजी विवाद नहीं सुलझा सकता और आपातकालीन या शिकायत सेवा का विकल्प नहीं है।",
  "Describe the issue": "समस्या का वर्णन करें",
  "Example: My passport police verification has been pending for five months. I want to know when the report was received and why my application is on hold.": "उदाहरण: मेरे पासपोर्ट का पुलिस सत्यापन पाँच महीने से लंबित है। मैं जानना चाहता/चाहती हूँ कि रिपोर्ट कब मिली और मेरा आवेदन क्यों रुका हुआ है।",
  "Do not include Aadhaar, bank details, passwords or medical records here.": "यहाँ आधार, बैंक विवरण, पासवर्ड या मेडिकल रिकॉर्ड शामिल न करें।",
  "Search road, pension, police, land…": "सड़क, पेंशन, पुलिस, ज़मीन खोजें…",
  "Your neighbourhood": "आपका पड़ोस",
  "Public services": "सार्वजनिक सेवाएँ",
  "Benefits and livelihoods": "लाभ और आजीविका",
  "Everything else": "अन्य सभी विषय",
  "Repairs, tenders, contractors and inspection reports": "मरम्मत, निविदाएँ, ठेकेदार और निरीक्षण रिपोर्ट",
  "Complaints, cleaning schedules and work orders": "शिकायतें, सफ़ाई का समय और कार्य आदेश",
  "Supply logs, tanker bills and quality reports": "आपूर्ति रिकॉर्ड, टैंकर बिल और गुणवत्ता रिपोर्ट",
  "Teacher vacancies, grants, meals and inspections": "शिक्षक रिक्तियाँ, अनुदान, भोजन और निरीक्षण",
  "Staff, medicines, equipment and patient services": "कर्मचारी, दवाइयाँ, उपकरण और मरीज सेवाएँ",
  "Repair logs, contracts and complaint action": "मरम्मत रिकॉर्ड, अनुबंध और शिकायत पर कार्रवाई",
  "Collection routes, staff rosters and contractor payments": "कचरा संग्रह मार्ग, कर्मचारी सूची और ठेकेदार भुगतान",
  "Card status, shop stock, allotment and complaints": "कार्ड की स्थिति, दुकान का स्टॉक, आवंटन और शिकायतें",
  "Application status, eligibility and payment records": "आवेदन की स्थिति, पात्रता और भुगतान रिकॉर्ड",
  "File movement, objections and reasons recorded for delay": "फाइल की आवाजाही, आपत्तियाँ और देरी के दर्ज कारण",
  "Outage logs, billing records and service standards": "बिजली कटौती रिकॉर्ड, बिल विवरण और सेवा मानक",
  "Muster rolls, job cards, wages and work records": "मस्टर रोल, जॉब कार्ड, मजदूरी और काम के रिकॉर्ड",
  "Refunds, recruitment, facilities and complaint records": "रिफंड, भर्ती, सुविधाएँ और शिकायत रिकॉर्ड",
  "Police verification, file movement, status and reasons for delay": "पुलिस सत्यापन, फाइल की आवाजाही, स्थिति और देरी के कारण",
  "Police, land, housing, exams, permits, taxes or another public record": "पुलिस, ज़मीन, आवास, परीक्षा, परमिट, कर या कोई अन्य सार्वजनिक रिकॉर्ड",
  "Any Indian language is okay": "कोई भी भारतीय भाषा चलेगी",
  "Describe the issue": "समस्या का वर्णन करें",
  "See an example": "उदाहरण देखें",
  "Closest matches": "सबसे नज़दीकी विषय",
  "Common topics": "सामान्य विषय",
  "Choose what best describes your request": "अपने आवेदन का सबसे सही वर्णन चुनें",
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
  "Location": "स्थान",
  "Authority": "प्राधिकरण",
  "Draft": "मसौदा",
  "Review": "समीक्षा",
  "State": "राज्य",
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
  "This is not a Central Government office.": "यह केंद्रीय सरकारी कार्यालय नहीं है।",
  "⚠ Important notice": "⚠ महत्वपूर्ण सूचना",
  "Why?": "क्यों?",
  "Jurisdiction": "अधिकार-क्षेत्र",
  "Filing route": "आवेदन जमा करने का रास्ता",
  "How to word it": "इसे कैसे लिखें",
  "Select the information sought": "माँगी जाने वाली जानकारी चुनें",
  "Select each item to include. Each selection becomes a numbered point in the request.":
    "जिस जानकारी को शामिल करना है, उसे चुनें। हर चयन आवेदन में क्रमांकित बिंदु बनेगा।",
  "Draft the request": "आवेदन का मसौदा बनाएँ",
  "Select at least one item to request.": "माँगने के लिए कम-से-कम एक बिंदु चुनें।",
  "Add a custom point": "अपना बिंदु जोड़ें",
  "Requests must be for facts and records": "आवेदन तथ्य और रिकॉर्ड के लिए होना चाहिए",
  "Show the difference": "अंतर देखें",
  "Remove": "हटाएँ",
  "Review before submission": "जमा करने से पहले समीक्षा करें",
  "Continue to the form": "फॉर्म पर जाएँ",
  "Addressed to": "किसे संबोधित",
  "Information sought": "माँगी गई जानकारी",
  "Period covered": "अवधि",
  "thing": "बिंदु",
  "things": "बिंदु",
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
  "Amount": "राशि",
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
  "Pay ₹{amount} and submit this request": "₹{amount} का भुगतान करके आवेदन जमा करें",
  "Check": "जाँचें",
  "Matching payments": "मिलते-जुलते भुगतान",
  "Your payments": "आपके भुगतान",
  "No payments yet": "अभी कोई भुगतान नहीं",
  "File a request": "नया आवेदन भरें",
  "Safe to pay again": "दोबारा भुगतान करना सुरक्षित है",
  "Do not pay again": "दोबारा भुगतान न करें",
  "No action required": "कोई कार्रवाई ज़रूरी नहीं",
  "Contacting the bank… {seconds}s": "बैंक से संपर्क हो रहा है… {seconds} सेकंड",
  "Checking…": "जाँच हो रही है…",
  "Check status now": "अभी स्थिति जाँचें",
  "Try payment again": "दोबारा भुगतान करें",
  "Track this request": "यह आवेदन ट्रैक करें",
  "Go to My requests": "मेरे आवेदनों पर जाएँ",
  "Track a request": "आवेदन ट्रैक करें",
  "Enter the registration number from your acknowledgement. You do not need an account.": "अपनी पावती में दी गई पंजीकरण संख्या दर्ज करें। आपको खाता बनाने की ज़रूरत नहीं है।",
  "Registration number": "पंजीकरण संख्या",
  "Show status": "स्थिति दिखाएँ",
  "No request found with that number. This may be verified against the acknowledgement email; the format is DOFPD/R/E/26/03310.": "इस संख्या से कोई आवेदन नहीं मिला। पावती वाले ईमेल से संख्या जाँचें; प्रारूप DOFPD/R/E/26/03310 है।",
  "Demo request:": "डेमो आवेदन:",
  "If already signed in, all requests are listed in": "अगर आप पहले से साइन इन हैं, तो सभी आवेदन यहाँ सूचीबद्ध हैं",
  "No registration number is required.": "पंजीकरण संख्या की ज़रूरत नहीं है।",
  "to see every request you have filed, with its response deadline tracked.": "अपने सभी आवेदनों और उनकी उत्तर समय-सीमा को ट्रैक करने के लिए।",

  // Guidelines, FAQ and support.
  "Before you file": "आवेदन भरने से पहले",
  "Guidelines for use of the RTI Online portal": "RTI ऑनलाइन पोर्टल के उपयोग के दिशा-निर्देश",
  "You accepted these guidelines": "आपने इन दिशा-निर्देशों को स्वीकार किया है",
  "I have read and understood the above guidelines.": "मैंने ऊपर दिए गए दिशा-निर्देश पढ़ और समझ लिए हैं।",
  "Tick the box to continue": "जारी रखने के लिए बॉक्स पर टिक करें",
  "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
  "Find answers to the most common questions about RTI.": "RTI से जुड़े सामान्य प्रश्नों के उत्तर पाएँ।",
  "Search for questions": "प्रश्न खोजें",
  "Search for questions...": "प्रश्न खोजें…",
  "FAQ categories": "FAQ श्रेणियाँ",
  Breadcrumb: "ब्रेडक्रंब",
  "Search and filter frequently asked questions": "अक्सर पूछे जाने वाले प्रश्न खोजें और फ़िल्टर करें",
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
  "The Right to Information (RTI) Act, 2005 empowers Indian citizens to request information from public authorities. It promotes transparency and accountability in the working of public institutions.": "सूचना का अधिकार (RTI) अधिनियम, 2005 भारतीय नागरिकों को सार्वजनिक प्राधिकरणों से जानकारी माँगने का अधिकार देता है। यह सार्वजनिक संस्थाओं के कामकाज में पारदर्शिता और जवाबदेही बढ़ाता है।",
  "Who can file an RTI application?": "RTI आवेदन कौन दाखिल कर सकता है?",
  "Any citizen of India can file an RTI application. You do not need to explain why you want the information.": "भारत का कोई भी नागरिक RTI आवेदन दाखिल कर सकता है। आपको यह बताने की ज़रूरत नहीं कि जानकारी क्यों चाहिए।",
  "How do I file an RTI online?": "मैं ऑनलाइन RTI कैसे दाखिल करूँ?",
  "Choose Submit Request, select the appropriate public authority, write a clear request for existing records, add your contact details, and pay the prescribed application fee unless you are exempt.": "‘आवेदन जमा करें’ चुनें, सही सार्वजनिक प्राधिकरण चुनें, मौजूद रिकॉर्ड के लिए स्पष्ट आवेदन लिखें, संपर्क विवरण जोड़ें और छूट न होने पर निर्धारित आवेदन शुल्क दें।",
  "What is the application fee for filing an RTI?": "RTI दाखिल करने का आवेदन शुल्क कितना है?",
  "The standard application fee for a Central Government RTI request is ₹10. Applicants below the poverty line are exempt when valid proof is provided. Additional copying charges may apply.": "केंद्रीय सरकार के RTI आवेदन का सामान्य शुल्क ₹10 है। वैध प्रमाण देने पर गरीबी रेखा से नीचे के आवेदकों को छूट मिलती है। प्रतियों का अतिरिक्त शुल्क लग सकता है।",
  "How can I track the status of my RTI application?": "मैं अपने RTI आवेदन की स्थिति कैसे ट्रैक करूँ?",
  "If you are signed in, every request is in My requests with its current stage and how many of the 30 days are left — open one to see its full history. If you do not have an account, use Track a request and enter the registration number from your acknowledgement.": "साइन इन करने पर हर आवेदन ‘मेरे आवेदन’ में उसकी वर्तमान स्थिति और 30 दिनों में बचे समय के साथ दिखेगा—पूरा इतिहास देखने के लिए उसे खोलें। खाता न हो तो ‘आवेदन ट्रैक करें’ चुनकर पावती की पंजीकरण संख्या दर्ज करें।",
  "What is the time limit for a response?": "उत्तर देने की समय-सीमा क्या है?",
  "A public authority ordinarily has 30 days to respond. Requests concerning a person's life or liberty must be answered within 48 hours. Different statutory limits can apply in some transfer and third-party cases.": "सार्वजनिक प्राधिकरण को सामान्यतः 30 दिनों में उत्तर देना होता है। किसी व्यक्ति के जीवन या स्वतंत्रता से जुड़े आवेदन का उत्तर 48 घंटे में देना होगा। कुछ स्थानांतरण और तीसरे पक्ष के मामलों में अलग वैधानिक समय-सीमा लागू हो सकती है।",
  "What if I am not satisfied with the response?": "अगर मैं उत्तर से संतुष्ट नहीं हूँ तो क्या करूँ?",
  "You may file a First Appeal if the response is incomplete, misleading, refused, or otherwise unsatisfactory. You can also appeal when the public authority misses the legal response deadline.": "उत्तर अधूरा, भ्रामक, अस्वीकार किया गया या असंतोषजनक हो तो आप प्रथम अपील दाखिल कर सकते हैं। सार्वजनिक प्राधिकरण कानूनी समय-सीमा चूक जाए तब भी अपील की जा सकती है।",
  "How do I file a first appeal?": "मैं प्रथम अपील कैसे दाखिल करूँ?",
  "Open the relevant application, choose File First Appeal, select the reason for appeal, and submit it to the designated First Appellate Authority. There is no fee for a First Appeal on this portal.": "संबंधित आवेदन खोलें, ‘प्रथम अपील भरें’ चुनें, अपील का कारण चुनें और नामित प्रथम अपीलीय प्राधिकरण को जमा करें। इस पोर्टल पर प्रथम अपील का कोई शुल्क नहीं है।",
  "Can I file an RTI application in any language?": "क्या मैं किसी भी भाषा में RTI आवेदन दाखिल कर सकता हूँ?",
  "An application may be made in English, Hindi, or the official language of the area where the request is filed. Use clear, specific wording so the authority can identify the records.": "आवेदन अंग्रेज़ी, हिन्दी या उस क्षेत्र की आधिकारिक भाषा में दिया जा सकता है जहाँ आवेदन दाखिल हो रहा है। स्पष्ट और विशिष्ट शब्दों का उपयोग करें ताकि प्राधिकरण रिकॉर्ड पहचान सके।",
  "What information cannot be provided under RTI?": "RTI के तहत कौन-सी जानकारी नहीं दी जा सकती?",
  "Sections 8 and 9 of the RTI Act exempt limited categories such as information affecting national security, protected commercial confidence, certain personal information, and copyrighted material. Exempt portions should be separated where the remaining record can be disclosed.": "RTI अधिनियम की धाराएँ 8 और 9 राष्ट्रीय सुरक्षा, संरक्षित व्यावसायिक गोपनीयता, कुछ व्यक्तिगत जानकारी और कॉपीराइट सामग्री जैसी सीमित श्रेणियों को छूट देती हैं। बाकी रिकॉर्ड दिया जा सकता हो तो छूट वाले हिस्से अलग किए जाने चाहिए।",
  "No matching questions": "कोई मिलता-जुलता प्रश्न नहीं मिला",
  "Try another search term or category.": "कोई दूसरा शब्द या श्रेणी आज़माएँ।",
  "Clear search and filters": "खोज और फ़िल्टर साफ़ करें",
  "Additional assistance": "अतिरिक्त सहायता",
  "Contact support for further assistance.": "अधिक सहायता के लिए सपोर्ट से संपर्क करें।",
  "Contact Us": "हमसे संपर्क करें",
  "Assistance is available. Contact any of the channels below.": "सहायता उपलब्ध है। नीचे दिए गए किसी भी माध्यम से संपर्क करें।",
  "Enter your full name": "अपना पूरा नाम दर्ज करें",
  "Enter your email address": "अपना ईमेल पता दर्ज करें",
  "Enter application number": "आवेदन संख्या दर्ज करें",
  "Type your message here...": "अपना संदेश यहाँ लिखें…",
  "Before submitting a query, the FAQ section may be checked.": "प्रश्न भेजने से पहले FAQ अनुभाग देख सकते हैं।",
  "You may find answers to common questions there.": "वहाँ सामान्य प्रश्नों के उत्तर मिल सकते हैं।",
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
  "Decide on the written submission alone": "केवल लिखित प्रस्तुति पर निर्णय लें",
  "Supporting document": "सहायक दस्तावेज़",
  "Confirm": "पुष्टि करें",
  "Submit appeal": "अपील जमा करें",
  "Being generated": "बनाया जा रहा है",
  "Ground": "आधार",
  "Hearing": "सुनवाई",

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
  "Step {step} of {total} · about 5 minutes": "चरण {step} / {total} · लगभग 5 मिनट",
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
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
