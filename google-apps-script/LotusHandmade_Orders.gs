/**
 * =====================================================================
 *  LOTUS HANDMADE — ORDER MANAGEMENT SYSTEM (Google Apps Script)
 * ---------------------------------------------------------------------
 *  One script that creates and runs the whole order workflow:
 *
 *   1. A trilingual Google Form (English / සිංහල / தமிழ்) for order requests
 *   2. A Google Sheet with an "Orders" approval table + "Settings"
 *   3. Emails to the customer (in their chosen language):
 *        • Order received (thank you)
 *        • Order accepted  → PDF invoice + bank details + slip-upload link
 *        • Payment slip received
 *        • Payment confirmed
 *        • Order completed
 *        • Order cancelled
 *      and alert emails to the shop owner.
 *   4. A secure web page where customers upload their bank slip
 *      (no Google sign-in needed). Slips are saved to Google Drive.
 *
 *  HOW IT WORKS FOR THE OWNER
 *   • New request arrives  → row added to "Orders" with Status = New
 *   • Fill "Unit Price" + "Delivery Charge", set Status = Approved
 *       → customer gets acceptance email + invoice PDF + upload link
 *   • Customer uploads slip → Status becomes "Slip Received" automatically
 *   • Check the slip, set Status = Payment Confirmed → customer notified
 *   • Ship the order, set Status = Completed           → customer notified
 *
 *  SETUP: see SETUP-GUIDE.md (run setup() once, then deploy as Web app).
 * =====================================================================
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
var SHEET_ORDERS = 'Orders';
var SHEET_SETTINGS = 'Settings';

var COL = {
  ORDER_ID: 1, SUBMITTED: 2, LANG: 3, NAME: 4, EMAIL: 5, MOBILE: 6, WHATSAPP: 7,
  PRODUCT_ID: 8, PRODUCT: 9, QTY: 10, COLOUR: 11, ADDRESS: 12, CITY: 13, NOTES: 14,
  UNIT_PRICE: 15, DELIVERY: 16, TOTAL: 17, STATUS: 18, INVOICE: 19, SLIP: 20,
  SLIP_AT: 21, LAST_EMAIL: 22, TOKEN: 23, INTERNAL: 24
};
var HEADERS = [
  'Order ID', 'Submitted', 'Language', 'Customer Name', 'Email', 'Mobile', 'WhatsApp',
  'Product ID', 'Product', 'Quantity', 'Colour', 'Delivery Address', 'City', 'Customer Notes',
  'Unit Price (LKR)', 'Delivery Charge (LKR)', 'Total (LKR)', 'Status', 'Invoice', 'Payment Slip',
  'Slip Uploaded', 'Last Email', 'Token (do not edit)', 'Internal Notes'
];
var STATUSES = ['New', 'Approved', 'Slip Received', 'Payment Confirmed', 'Completed', 'Cancelled'];

var DEFAULT_SETTINGS = [
  ['Business Name', 'Lotus Handmade', 'Shown in emails, invoices and the upload page'],
  ['Website URL', 'https://dabared.github.io/lotus-handmade-creations/', 'Link included in every email'],
  ['Logo URL', 'https://dabared.github.io/lotus-handmade-creations/assets/images/brand/email-logo.png', 'PNG logo used in emails & invoices'],
  ['Notification Email', '', 'Where new-order and slip alerts are sent (defaults to your Google account)'],
  ['WhatsApp Number', '94773465559', 'International format, digits only'],
  ['Bank Name', 'ENTER BANK NAME', 'Shown on invoice & acceptance email'],
  ['Account Name', 'ENTER ACCOUNT NAME', ''],
  ['Account Number', 'ENTER ACCOUNT NUMBER', ''],
  ['Branch', 'ENTER BRANCH', ''],
  ['Payment Due (days)', '3', 'Days the customer has to pay after approval'],
  ['Invoice Note', 'Thank you for supporting handmade! Please use your Order ID as the payment reference.', 'Printed at the bottom of every invoice'],
  ['Upload Page URL', '', 'Filled automatically after you deploy the Web app (or paste the /exec URL here)'],
  ['Form URL', '', 'Filled by setup()'],
  ['Form Edit URL', '', 'Filled by setup()'],
  ['Website Prefill Settings', '', 'Filled by setup() — send this to your web developer to connect the website']
];

/* ------------------------------------------------------------------ */
/*  Translations                                                       */
/* ------------------------------------------------------------------ */
var T = {
  en: {
    langName: 'English',
    hello: 'Dear {name},',
    subj_received: 'We received your order request',
    subj_accepted: 'Your order is accepted – Invoice',
    subj_slip: 'Payment slip received',
    subj_payment: 'Payment confirmed',
    subj_completed: 'Your order is complete',
    subj_cancelled: 'About your order',
    received_intro: 'Thank you for choosing Lotus Handmade! We have received your order request.',
    received_next: 'We will review your request and confirm the price and delivery charge shortly.',
    accepted_intro: 'Good news — your order has been accepted. Your invoice is attached to this email.',
    accepted_pay: 'Please transfer the total amount to the bank account below and upload your bank slip using the button.',
    upload_btn: 'Upload payment slip',
    or_whatsapp: 'You can also send your bank slip on WhatsApp:',
    slip_intro: 'Thank you! We have received your payment slip. We will verify it and confirm shortly.',
    payment_intro: 'Your payment has been received and confirmed. We are now lovingly crafting your order.',
    completed_intro: 'Your order is complete and on its way to you. We hope you love it!',
    cancelled_intro: 'We are sorry — we are unable to fulfil your order this time. Please contact us if you have any questions.',
    order_details: 'Order details', order_no: 'Order No.', product: 'Product', product_id: 'Product ID',
    qty: 'Quantity', colour: 'Colour', unit_price: 'Unit price', delivery: 'Delivery charge', total: 'Total',
    address: 'Delivery address', city: 'City', notes: 'Your notes', bank_details: 'Bank details',
    bank: 'Bank', acc_name: 'Account name', acc_no: 'Account number', branch: 'Branch', due: 'Please pay by',
    reference: 'Payment reference', sign: 'With love,<br>The Lotus Handmade team', visit: 'Visit our website',
    upload_title: 'Upload your payment slip', upload_choose: 'Choose a file (photo or PDF, max 10 MB)',
    upload_submit: 'Upload slip', upload_ok: 'Thank you! Your payment slip has been received. We will confirm by email.',
    upload_err: 'Upload failed. Please try again.', upload_invalid: 'This link is not valid. Please use the link in your email.',
    upload_done: 'A slip has already been uploaded for this order. You can upload another file if needed.'
  },
  si: {
    langName: 'සිංහල',
    hello: 'හිතවත් {name},',
    subj_received: 'ඔබගේ ඇණවුම් ඉල්ලීම ලැබුණා',
    subj_accepted: 'ඔබගේ ඇණවුම පිළිගත්තා – ඉන්වොයිසිය',
    subj_slip: 'ගෙවීම් පත්‍රිකාව ලැබුණා',
    subj_payment: 'ගෙවීම තහවුරු කළා',
    subj_completed: 'ඔබගේ ඇණවුම සම්පූර්ණයි',
    subj_cancelled: 'ඔබගේ ඇණවුම පිළිබඳව',
    received_intro: 'Lotus Handmade තෝරාගැනීම ගැන ඔබට ස්තූතියි! ඔබගේ ඇණවුම් ඉල්ලීම අපට ලැබුණා.',
    received_next: 'අපි ඔබගේ ඉල්ලීම පරීක්ෂා කර, මිල සහ බෙදාහැරීමේ ගාස්තුව ඉක්මනින් තහවුරු කරන්නෙමු.',
    accepted_intro: 'සතුටුදායක පුවතක් — ඔබගේ ඇණවුම පිළිගෙන ඇත. ඉන්වොයිසිය මෙම ඊමේල් එකට අමුණා ඇත.',
    accepted_pay: 'කරුණාකර මුළු මුදල පහත බැංකු ගිණුමට ගෙවා, ගෙවීම් පත්‍රිකාව (bank slip) පහත බොත්තම හරහා උඩුගත කරන්න.',
    upload_btn: 'ගෙවීම් පත්‍රිකාව උඩුගත කරන්න',
    or_whatsapp: 'ගෙවීම් පත්‍රිකාව WhatsApp මගින්ද එවිය හැක:',
    slip_intro: 'ස්තූතියි! ඔබගේ ගෙවීම් පත්‍රිකාව අපට ලැබුණා. එය පරීක්ෂා කර ඉක්මනින් තහවුරු කරන්නෙමු.',
    payment_intro: 'ඔබගේ ගෙවීම ලැබී තහවුරු කර ඇත. අපි දැන් ඔබගේ ඇණවුම ආදරයෙන් සකසමින් සිටිමු.',
    completed_intro: 'ඔබගේ ඇණවුම සම්පූර්ණ කර ඔබ වෙත යවා ඇත. ඔබ එයට කැමති වේවායි අපි බලාපොරොත්තු වෙමු!',
    cancelled_intro: 'කණගාටුයි — මෙවර ඔබගේ ඇණවුම ඉටු කිරීමට අපට නොහැකි විය. කිසියම් ප්‍රශ්නයක් ඇත්නම් කරුණාකර අප අමතන්න.',
    order_details: 'ඇණවුම් විස්තර', order_no: 'ඇණවුම් අංකය', product: 'භාණ්ඩය', product_id: 'භාණ්ඩ අංකය',
    qty: 'ප්‍රමාණය', colour: 'වර්ණය', unit_price: 'ඒකක මිල', delivery: 'බෙදාහැරීමේ ගාස්තුව', total: 'මුළු මුදල',
    address: 'බෙදාහැරීමේ ලිපිනය', city: 'නගරය', notes: 'ඔබගේ සටහන්', bank_details: 'බැංකු විස්තර',
    bank: 'බැංකුව', acc_name: 'ගිණුම් නාමය', acc_no: 'ගිණුම් අංකය', branch: 'ශාඛාව', due: 'ගෙවිය යුතු දිනය',
    reference: 'ගෙවීම් සඳහනය', sign: 'ආදරයෙන්,<br>Lotus Handmade කණ්ඩායම', visit: 'අපගේ වෙබ් අඩවියට පිවිසෙන්න',
    upload_title: 'ගෙවීම් පත්‍රිකාව උඩුගත කරන්න', upload_choose: 'ගොනුවක් තෝරන්න (ඡායාරූපය හෝ PDF, උපරිම 10 MB)',
    upload_submit: 'උඩුගත කරන්න', upload_ok: 'ස්තූතියි! ඔබගේ ගෙවීම් පත්‍රිකාව ලැබුණා. අපි ඊමේල් මගින් තහවුරු කරන්නෙමු.',
    upload_err: 'උඩුගත කිරීම අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න.', upload_invalid: 'මෙම සබැඳිය වලංගු නැත. කරුණාකර ඊමේල් එකේ ඇති සබැඳිය භාවිතා කරන්න.',
    upload_done: 'මෙම ඇණවුම සඳහා දැනටමත් පත්‍රිකාවක් උඩුගත කර ඇත. අවශ්‍ය නම් තවත් ගොනුවක් උඩුගත කළ හැක.'
  },
  ta: {
    langName: 'தமிழ்',
    hello: 'அன்புள்ள {name},',
    subj_received: 'உங்கள் ஆர்டர் கோரிக்கை பெறப்பட்டது',
    subj_accepted: 'உங்கள் ஆர்டர் ஏற்கப்பட்டது – விலைப்பட்டியல்',
    subj_slip: 'வங்கி ரசீது பெறப்பட்டது',
    subj_payment: 'பணம் உறுதிப்படுத்தப்பட்டது',
    subj_completed: 'உங்கள் ஆர்டர் நிறைவடைந்தது',
    subj_cancelled: 'உங்கள் ஆர்டர் குறித்து',
    received_intro: 'Lotus Handmade-ஐத் தேர்ந்தெடுத்ததற்கு நன்றி! உங்கள் ஆர்டர் கோரிக்கை எங்களுக்குக் கிடைத்தது.',
    received_next: 'உங்கள் கோரிக்கையைச் சரிபார்த்து, விலை மற்றும் டெலிவரி கட்டணத்தை விரைவில் உறுதிப்படுத்துவோம்.',
    accepted_intro: 'மகிழ்ச்சியான செய்தி — உங்கள் ஆர்டர் ஏற்றுக்கொள்ளப்பட்டது. விலைப்பட்டியல் இந்த மின்னஞ்சலில் இணைக்கப்பட்டுள்ளது.',
    accepted_pay: 'மொத்தத் தொகையை கீழே உள்ள வங்கிக் கணக்கிற்கு செலுத்தி, வங்கி ரசீதை (bank slip) கீழே உள்ள பொத்தான் மூலம் பதிவேற்றவும்.',
    upload_btn: 'வங்கி ரசீதைப் பதிவேற்றவும்',
    or_whatsapp: 'வங்கி ரசீதை WhatsApp மூலமும் அனுப்பலாம்:',
    slip_intro: 'நன்றி! உங்கள் வங்கி ரசீது எங்களுக்குக் கிடைத்தது. அதைச் சரிபார்த்து விரைவில் உறுதிப்படுத்துவோம்.',
    payment_intro: 'உங்கள் பணம் பெறப்பட்டு உறுதிப்படுத்தப்பட்டது. இப்போது உங்கள் ஆர்டரை அன்புடன் தயாரித்து வருகிறோம்.',
    completed_intro: 'உங்கள் ஆர்டர் நிறைவடைந்து உங்களுக்கு அனுப்பப்பட்டுள்ளது. உங்களுக்குப் பிடிக்கும் என நம்புகிறோம்!',
    cancelled_intro: 'மன்னிக்கவும் — இம்முறை உங்கள் ஆர்டரை நிறைவேற்ற எங்களால் இயலவில்லை. கேள்விகள் இருந்தால் எங்களைத் தொடர்பு கொள்ளவும்.',
    order_details: 'ஆர்டர் விவரங்கள்', order_no: 'ஆர்டர் எண்', product: 'பொருள்', product_id: 'பொருள் குறியீடு',
    qty: 'அளவு', colour: 'நிறம்', unit_price: 'அலகு விலை', delivery: 'டெலிவரி கட்டணம்', total: 'மொத்தம்',
    address: 'டெலிவரி முகவரி', city: 'நகரம்', notes: 'உங்கள் குறிப்புகள்', bank_details: 'வங்கி விவரங்கள்',
    bank: 'வங்கி', acc_name: 'கணக்கு பெயர்', acc_no: 'கணக்கு எண்', branch: 'கிளை', due: 'செலுத்த வேண்டிய தேதி',
    reference: 'கட்டணக் குறிப்பு', sign: 'அன்புடன்,<br>Lotus Handmade குழு', visit: 'எங்கள் இணையதளத்தைப் பார்வையிடவும்',
    upload_title: 'வங்கி ரசீதைப் பதிவேற்றவும்', upload_choose: 'கோப்பைத் தேர்ந்தெடுக்கவும் (படம் அல்லது PDF, அதிகபட்சம் 10 MB)',
    upload_submit: 'பதிவேற்று', upload_ok: 'நன்றி! உங்கள் வங்கி ரசீது பெறப்பட்டது. மின்னஞ்சல் மூலம் உறுதிப்படுத்துவோம்.',
    upload_err: 'பதிவேற்றம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.', upload_invalid: 'இந்த இணைப்பு செல்லுபடியாகாது. மின்னஞ்சலில் உள்ள இணைப்பைப் பயன்படுத்தவும்.',
    upload_done: 'இந்த ஆர்டருக்கு ஏற்கனவே ரசீது பதிவேற்றப்பட்டுள்ளது. தேவைப்பட்டால் மற்றொரு கோப்பைப் பதிவேற்றலாம்.'
  }
};

/* Form labels for the customer-details section in each language */
var FORM_TEXT = {
  en: {
    section: 'Your details & delivery', sectionHelp: 'Please enter your contact and delivery details.',
    name: 'Full Name', email: 'Email Address', emailHelp: 'We will send your order confirmation and invoice to this email.',
    mobile: 'Mobile Number', wa: 'WhatsApp Number', waHelp: 'Leave blank if the same as your mobile number.',
    address: 'Delivery Address', city: 'City / Town', notes: 'Additional Instructions',
    notesHelp: 'Personalisation, gift message, the date you need it, etc.'
  },
  si: {
    section: 'ඔබගේ විස්තර සහ බෙදාහැරීම', sectionHelp: 'කරුණාකර ඔබගේ සම්බන්ධතා සහ බෙදාහැරීමේ විස්තර ඇතුළත් කරන්න.',
    name: 'සම්පූර්ණ නම', email: 'ඊමේල් ලිපිනය', emailHelp: 'ඇණවුම් තහවුරු කිරීම සහ ඉන්වොයිසිය මෙම ඊමේල් ලිපිනයට එවනු ලැබේ.',
    mobile: 'ජංගම දුරකථන අංකය', wa: 'WhatsApp අංකය', waHelp: 'ජංගම අංකයම නම් හිස්ව තබන්න.',
    address: 'බෙදාහැරීමේ ලිපිනය', city: 'නගරය', notes: 'අමතර උපදෙස්',
    notesHelp: 'නමක් එක් කිරීම, තෑගි පණිවිඩය, අවශ්‍ය දිනය ආදිය.'
  },
  ta: {
    section: 'உங்கள் விவரங்கள் மற்றும் டெலிவரி', sectionHelp: 'உங்கள் தொடர்பு மற்றும் டெலிவரி விவரங்களை உள்ளிடவும்.',
    name: 'முழு பெயர்', email: 'மின்னஞ்சல் முகவரி', emailHelp: 'ஆர்டர் உறுதிப்படுத்தல் மற்றும் விலைப்பட்டியல் இந்த மின்னஞ்சலுக்கு அனுப்பப்படும்.',
    mobile: 'கைபேசி எண்', wa: 'WhatsApp எண்', waHelp: 'கைபேசி எண்ணே என்றால் காலியாக விடவும்.',
    address: 'டெலிவரி முகவரி', city: 'நகரம்', notes: 'கூடுதல் குறிப்புகள்',
    notesHelp: 'பெயர் சேர்த்தல், பரிசு செய்தி, தேவைப்படும் தேதி போன்றவை.'
  }
};
var LANG_CHOICES = { 'English': 'en', 'සිංහල (Sinhala)': 'si', 'தமிழ் (Tamil)': 'ta' };

/* ------------------------------------------------------------------ */
/*  1. SETUP — run once                                                */
/* ------------------------------------------------------------------ */
function setup() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('SPREADSHEET_ID')) {
    throw new Error('Setup has already been run. Spreadsheet: ' +
      SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getUrl());
  }

  // --- Spreadsheet ---------------------------------------------------
  var ss = SpreadsheetApp.create('Lotus Handmade – Orders');
  var orders = ss.getSheets()[0].setName(SHEET_ORDERS);
  orders.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setBackground('#6D1A46').setFontColor('#FFFFFF').setFontWeight('bold').setWrap(true);
  orders.setFrozenRows(1);
  orders.setFrozenColumns(1);
  orders.setRowHeight(1, 42);
  var widths = [130, 140, 80, 160, 200, 110, 110, 90, 200, 70, 110, 240, 110, 220, 110, 120, 110, 140, 110, 110, 140, 200, 60, 200];
  widths.forEach(function (w, i) { orders.setColumnWidth(i + 1, w); });
  orders.hideColumns(COL.TOKEN);
  // Price columns highlighted in gold so the owner knows what to fill
  orders.getRange(1, COL.UNIT_PRICE, 1, 3).setBackground('#DDB04E').setFontColor('#4C1030');
  orders.getRange(1, COL.STATUS).setBackground('#DDB04E').setFontColor('#4C1030');
  var statusRule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
  orders.getRange(2, COL.STATUS, 999, 1).setDataValidation(statusRule);
  orders.getRange(2, COL.UNIT_PRICE, 999, 3).setNumberFormat('#,##0');
  orders.getRange(2, COL.SUBMITTED, 999, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  orders.getRange(2, COL.SLIP_AT, 999, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  addStatusColours_(orders);

  var settings = ss.insertSheet(SHEET_SETTINGS);
  settings.getRange(1, 1, 1, 3).setValues([['Setting', 'Value', 'Notes']])
    .setBackground('#6D1A46').setFontColor('#FFFFFF').setFontWeight('bold');
  settings.getRange(2, 1, DEFAULT_SETTINGS.length, 3).setValues(DEFAULT_SETTINGS);
  settings.getRange(2, 2, DEFAULT_SETTINGS.length, 1).setBackground('#FFF8EE');
  settings.setColumnWidth(1, 200); settings.setColumnWidth(2, 420); settings.setColumnWidth(3, 420);
  setSetting_(ss, 'Notification Email', Session.getEffectiveUser().getEmail());

  // --- Drive folders --------------------------------------------------
  var root = DriveApp.createFolder('Lotus Handmade – Orders');
  var invoices = root.createFolder('Invoices');
  var slips = root.createFolder('Payment Slips');
  DriveApp.getFileById(ss.getId()).moveTo(root);

  // --- Form -------------------------------------------------------------
  var form = buildForm_();
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  DriveApp.getFileById(form.getId()).moveTo(root);
  SpreadsheetApp.flush();
  // keep the raw responses tab at the end
  ss.getSheets().forEach(function (sh) {
    if (sh.getName().indexOf('Form') === 0) { ss.setActiveSheet(sh); ss.moveActiveSheet(ss.getNumSheets()); sh.setTabColor('#999999'); }
  });
  ss.setActiveSheet(orders); ss.moveActiveSheet(1);

  props.setProperties({
    SPREADSHEET_ID: ss.getId(), FORM_ID: form.getId(),
    INVOICE_FOLDER_ID: invoices.getId(), SLIP_FOLDER_ID: slips.getId(), ROOT_FOLDER_ID: root.getId()
  });

  // --- Triggers ---------------------------------------------------------
  ScriptApp.newTrigger('onOrderSubmit').forForm(form).onFormSubmit().create();
  ScriptApp.newTrigger('onSheetEdit').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('onSheetOpen').forSpreadsheet(ss).onOpen().create();

  // --- Links for the website -------------------------------------------
  var prefill = buildPrefillInfo_(form);
  setSetting_(ss, 'Form URL', form.getPublishedUrl());
  setSetting_(ss, 'Form Edit URL', form.getEditUrl());
  setSetting_(ss, 'Website Prefill Settings', JSON.stringify(prefill));

  Logger.log('✅ Setup complete');
  Logger.log('Orders sheet : ' + ss.getUrl());
  Logger.log('Order form   : ' + form.getPublishedUrl());
  Logger.log('Website settings (send to your developer): ' + JSON.stringify(prefill));
  Logger.log('NEXT: Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).');
}

function buildForm_() {
  var form = FormApp.create('Lotus Handmade – Order Request');
  form.setTitle('Lotus Handmade – Order Request / ඇණවුම් ඉල්ලීම / ஆர்டர் கோரிக்கை');
  form.setDescription(
    'Thank you for choosing handmade! Fill in this form and we will confirm the price and delivery by email.\n' +
    'අතින් සාදන ලද නිෂ්පාදන තෝරාගැනීමට ස්තූතියි! මෙම පෝරමය පුරවන්න; මිල සහ බෙදාහැරීම ඊමේල් මගින් තහවුරු කරන්නෙමු.\n' +
    'கைவினைப் பொருட்களைத் தேர்ந்தெடுத்ததற்கு நன்றி! இந்தப் படிவத்தை நிரப்பவும்; விலை மற்றும் டெலிவரியை மின்னஞ்சல் மூலம் உறுதிப்படுத்துவோம்.');
  form.setConfirmationMessage(
    'Thank you! Your order request has been sent. Please check your email.\n' +
    'ස්තූතියි! ඔබගේ ඇණවුම් ඉල්ලීම යවා ඇත. කරුණාකර ඔබගේ ඊමේල් පරීක්ෂා කරන්න.\n' +
    'நன்றி! உங்கள் ஆர்டர் கோரிக்கை அனுப்பப்பட்டது. உங்கள் மின்னஞ்சலைப் பார்க்கவும்.');
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  var ids = {};
  // Page 1 — product + language
  var lang = form.addMultipleChoiceItem().setTitle('Language / භාෂාව / மொழி').setRequired(true);
  ids.lang = lang.getId();
  ids.pid = form.addTextItem().setTitle('Product ID / භාණ්ඩ අංකය / பொருள் குறியீடு')
    .setHelpText('e.g. LHC-001 (filled automatically from the website)').getId();
  ids.pname = form.addTextItem().setTitle('Product Name / භාණ්ඩයේ නම / பொருளின் பெயர்').setRequired(true).getId();
  var qty = form.addTextItem().setTitle('Quantity / ප්‍රමාණය / அளவு').setRequired(true)
    .setValidation(FormApp.createTextValidation().setHelpText('Please enter a number / අංකයක් ඇතුළත් කරන්න / எண்ணை உள்ளிடவும்')
      .requireNumberGreaterThan(0).build());
  ids.qty = qty.getId();
  ids.colour = form.addTextItem().setTitle('Preferred Colour / කැමති වර්ණය / விருப்பமான நிறம்').getId();

  // Language sections
  var pages = {};
  ['en', 'si', 'ta'].forEach(function (code, idx) {
    var t = FORM_TEXT[code];
    var pb = form.addPageBreakItem().setTitle(t.section).setHelpText(t.sectionHelp);
    if (idx > 0) pb.setGoToPage(FormApp.PageNavigationType.SUBMIT); // previous section ends with submit
    pages[code] = pb;
    var emailValidation = FormApp.createTextValidation().requireTextIsEmail().build();
    var phoneValidation = FormApp.createTextValidation().requireTextMatchesPattern('^[0-9+ ()-]{9,16}$')
      .setHelpText(code === 'si' ? 'නිවැරදි දුරකථන අංකයක් ඇතුළත් කරන්න' : code === 'ta' ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter a valid phone number').build();
    ids[code] = {
      name: form.addTextItem().setTitle(t.name).setRequired(true).getId(),
      email: form.addTextItem().setTitle(t.email).setHelpText(t.emailHelp).setRequired(true).setValidation(emailValidation).getId(),
      mobile: form.addTextItem().setTitle(t.mobile).setRequired(true).setValidation(phoneValidation).getId(),
      wa: form.addTextItem().setTitle(t.wa).setHelpText(t.waHelp).getId(),
      address: form.addParagraphTextItem().setTitle(t.address).setRequired(true).getId(),
      city: form.addTextItem().setTitle(t.city).setRequired(true).getId(),
      notes: form.addParagraphTextItem().setTitle(t.notes).setHelpText(t.notesHelp).getId()
    };
  });
  lang.setChoices(Object.keys(LANG_CHOICES).map(function (label) {
    return lang.createChoice(label, pages[LANG_CHOICES[label]]);
  }));
  PropertiesService.getScriptProperties().setProperty('FORM_ITEM_IDS', JSON.stringify(ids));
  return form;
}

function buildPrefillInfo_(form) {
  var ids = JSON.parse(PropertiesService.getScriptProperties().getProperty('FORM_ITEM_IDS'));
  var r = form.createResponse();
  r.withItemResponse(form.getItemById(ids.pid).asTextItem().createResponse('PID'));
  r.withItemResponse(form.getItemById(ids.pname).asTextItem().createResponse('PNAME'));
  r.withItemResponse(form.getItemById(ids.qty).asTextItem().createResponse('7'));
  r.withItemResponse(form.getItemById(ids.colour).asTextItem().createResponse('PCOLOUR'));
  var url = r.toPrefilledUrl();
  var grab = function (marker) { var m = url.match(new RegExp('(entry\\.\\d+)=' + marker)); return m ? m[1] : ''; };
  return {
    url: form.getPublishedUrl(),
    fields: { productName: grab('PNAME'), productId: grab('PID'), quantity: grab('7'), colour: grab('PCOLOUR') }
  };
}

function addStatusColours_(sheet) {
  var range = sheet.getRange(2, COL.STATUS, 999, 1);
  var colours = { 'New': '#FBE3EB', 'Approved': '#FDF0C7', 'Slip Received': '#E3EEFB', 'Payment Confirmed': '#DDF1E3', 'Completed': '#C9E8D2', 'Cancelled': '#EEEEEE' };
  var rules = Object.keys(colours).map(function (s) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(colours[s]).setRanges([range]).build();
  });
  sheet.setConditionalFormatRules(rules);
}

/* ------------------------------------------------------------------ */
/*  2. New order from the form                                         */
/* ------------------------------------------------------------------ */
function onOrderSubmit(e) {
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var ids = JSON.parse(PropertiesService.getScriptProperties().getProperty('FORM_ITEM_IDS'));
    var ans = {};
    e.response.getItemResponses().forEach(function (ir) { ans[ir.getItem().getId()] = ir.getResponse(); });
    var lang = LANG_CHOICES[ans[ids.lang]] || 'en';
    var L = ids[lang];
    var ss = getSS_(), sh = ss.getSheetByName(SHEET_ORDERS);
    var row = sh.getLastRow() + 1;
    var orderId = nextOrderId_();
    var token = Utilities.getUuid().replace(/-/g, '');
    var mobile = String(ans[L.mobile] || '').trim();
    var values = [];
    values[COL.ORDER_ID - 1] = orderId;
    values[COL.SUBMITTED - 1] = e.response.getTimestamp();
    values[COL.LANG - 1] = lang;
    values[COL.NAME - 1] = String(ans[L.name] || '').trim();
    values[COL.EMAIL - 1] = String(ans[L.email] || '').trim();
    values[COL.MOBILE - 1] = "'" + mobile;
    values[COL.WHATSAPP - 1] = "'" + (String(ans[L.wa] || '').trim() || mobile);
    values[COL.PRODUCT_ID - 1] = String(ans[ids.pid] || '').trim();
    values[COL.PRODUCT - 1] = String(ans[ids.pname] || '').trim();
    values[COL.QTY - 1] = Number(ans[ids.qty]) || 1;
    values[COL.COLOUR - 1] = String(ans[ids.colour] || '').trim();
    values[COL.ADDRESS - 1] = String(ans[L.address] || '').trim();
    values[COL.CITY - 1] = String(ans[L.city] || '').trim();
    values[COL.NOTES - 1] = String(ans[L.notes] || '').trim();
    values[COL.UNIT_PRICE - 1] = '';
    values[COL.DELIVERY - 1] = '';
    values[COL.TOTAL - 1] = '=IF(OR(O' + row + '="",P' + row + '=""),"",O' + row + '*J' + row + '+P' + row + ')';
    values[COL.STATUS - 1] = 'New';
    values[COL.INVOICE - 1] = '';
    values[COL.SLIP - 1] = '';
    values[COL.SLIP_AT - 1] = '';
    values[COL.LAST_EMAIL - 1] = '';
    values[COL.TOKEN - 1] = token;
    values[COL.INTERNAL - 1] = '';
    sh.getRange(row, 1, 1, values.length).setValues([values]);
    SpreadsheetApp.flush();

    var order = readOrder_(sh, row);
    sendCustomerEmail_(order, 'received');
    markEmail_(sh, row, 'Received');
    notifyOwner_('🧶 New order ' + orderId + ' – ' + order.product,
      'A new order request has arrived.<br><br>' + detailsTable_(order, T.en, false) +
      '<p><b>Next:</b> open the Orders sheet, fill <i>Unit Price</i> and <i>Delivery Charge</i>, then set Status to <b>Approved</b>.</p>' +
      button_('Open Orders sheet', ss.getUrl()));
  } finally { lock.releaseLock(); }
}

function nextOrderId_() {
  var props = PropertiesService.getScriptProperties();
  var n = Number(props.getProperty('ORDER_SEQ') || 0) + 1;
  props.setProperty('ORDER_SEQ', String(n));
  return 'LH-' + Utilities.formatDate(new Date(), 'Asia/Colombo', 'yyMMdd') + '-' + ('000' + n).slice(-3);
}

/* ------------------------------------------------------------------ */
/*  3. Owner changes Status in the sheet                               */
/* ------------------------------------------------------------------ */
function onSheetEdit(e) {
  var sh = e.range.getSheet();
  if (sh.getName() !== SHEET_ORDERS || e.range.getRow() < 2 || e.range.getColumn() !== COL.STATUS || e.range.getNumRows() > 1) return;
  var status = e.value, row = e.range.getRow();
  if (!status) return;
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var order = readOrder_(sh, row);
    if (!order.email) { toast_('This order has no email address.'); return; }
    switch (status) {
      case 'Approved':
        if (!(order.unitPrice > 0) || order.delivery === '' || isNaN(order.delivery)) {
          e.range.setValue(e.oldValue || 'New');
          toast_('Please fill Unit Price and Delivery Charge (0 if free) before approving ' + order.id + '.');
          return;
        }
        var pdf = createInvoicePdf_(order);
        var file = DriveApp.getFolderById(prop_('INVOICE_FOLDER_ID')).createFile(pdf);
        sh.getRange(row, COL.INVOICE).setFormula('=HYPERLINK("' + file.getUrl() + '","INV-' + order.id + '")');
        sendCustomerEmail_(order, 'accepted', [pdf]);
        markEmail_(sh, row, 'Accepted + invoice');
        toast_('Acceptance email and invoice sent for ' + order.id);
        break;
      case 'Payment Confirmed':
        sendCustomerEmail_(order, 'payment'); markEmail_(sh, row, 'Payment confirmed');
        toast_('Payment confirmation sent for ' + order.id); break;
      case 'Completed':
        sendCustomerEmail_(order, 'completed'); markEmail_(sh, row, 'Completed');
        toast_('Completion email sent for ' + order.id); break;
      case 'Cancelled':
        sendCustomerEmail_(order, 'cancelled'); markEmail_(sh, row, 'Cancelled');
        toast_('Cancellation email sent for ' + order.id); break;
    }
  } finally { lock.releaseLock(); }
}

/* ------------------------------------------------------------------ */
/*  4. Emails                                                          */
/* ------------------------------------------------------------------ */
function sendCustomerEmail_(order, type, attachments) {
  var s = getSettings_(), t = T[order.lang] || T.en;
  var subjects = { received: t.subj_received, accepted: t.subj_accepted, slip: t.subj_slip, payment: t.subj_payment, completed: t.subj_completed, cancelled: t.subj_cancelled };
  var body = '<p>' + esc_(t.hello.replace('{name}', order.name)) + '</p>';
  var showPrice = type !== 'received' && type !== 'cancelled';
  if (type === 'received') {
    body += p_(t.received_intro) + p_(t.received_next) + detailsTable_(order, t, false);
  } else if (type === 'accepted') {
    body += p_(t.accepted_intro) + detailsTable_(order, t, true) + p_(t.accepted_pay) + bankBox_(order, t, s) +
      '<div style="text-align:center;margin:26px 0">' + button_(t.upload_btn, uploadLink_(order)) + '</div>' +
      (s['WhatsApp Number'] ? p_(t.or_whatsapp + ' <a href="https://wa.me/' + s['WhatsApp Number'] + '?text=' +
        encodeURIComponent(order.id) + '" style="color:#A2306A">+' + s['WhatsApp Number'] + '</a>', true) : '');
  } else if (type === 'slip') {
    body += p_(t.slip_intro) + detailsTable_(order, t, true);
  } else if (type === 'payment') {
    body += p_(t.payment_intro) + detailsTable_(order, t, true);
  } else if (type === 'completed') {
    body += p_(t.completed_intro) + detailsTable_(order, t, showPrice);
  } else if (type === 'cancelled') {
    body += p_(t.cancelled_intro) + detailsTable_(order, t, false);
  }
  var subject = subjects[type] + ' | ' + order.id + ' | ' + s['Business Name'];
  MailApp.sendEmail({
    to: order.email, subject: subject, htmlBody: wrapEmail_(subjects[type], body, t, s),
    body: stripHtml_(body), name: s['Business Name'], replyTo: s['Notification Email'] || '',
    attachments: attachments || []
  });
}

function notifyOwner_(subject, html) {
  var s = getSettings_();
  if (!s['Notification Email']) return;
  MailApp.sendEmail({ to: s['Notification Email'], subject: subject, htmlBody: wrapEmail_('Owner notification', html, T.en, s), name: s['Business Name'] + ' Orders' });
}

function wrapEmail_(title, inner, t, s) {
  var site = s['Website URL'];
  return '<!doctype html><html><body style="margin:0;padding:0;background:#F6EFF2">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F6EFF2;padding:24px 12px"><tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#FFFFFF;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#3E1529">' +
    '<tr><td style="background:#6D1A46;padding:22px 28px" align="left">' +
    '<a href="' + site + '"><img src="' + s['Logo URL'] + '" alt="' + esc_(s['Business Name']) + '" height="54" style="display:block;border:0;height:54px"></a></td></tr>' +
    '<tr><td style="height:4px;background:#DDB04E;font-size:0;line-height:0">&nbsp;</td></tr>' +
    '<tr><td style="padding:28px 28px 8px"><h1 style="margin:0 0 14px;font-size:22px;color:#6D1A46">' + esc_(title) + '</h1>' +
    '<div style="font-size:15px;line-height:1.6">' + inner + '</div>' +
    '<p style="margin:26px 0 6px;font-size:15px">' + t.sign + '</p></td></tr>' +
    '<tr><td style="padding:18px 28px 26px;border-top:1px solid #EBDCE3;font-size:13px;color:#6B4A5B" align="center">' +
    '<a href="' + site + '" style="color:#A2306A;font-weight:bold;text-decoration:none">' + esc_(t.visit) + ' →</a><br>' +
    '<span style="color:#9C8592">' + esc_(s['Business Name']) + ' · Handmade in Sri Lanka</span>' +
    (s['WhatsApp Number'] ? '<br><a href="https://wa.me/' + s['WhatsApp Number'] + '" style="color:#6B4A5B">WhatsApp +' + s['WhatsApp Number'] + '</a>' : '') +
    '</td></tr></table></td></tr></table></body></html>';
}

function detailsTable_(o, t, withPrice) {
  var rows = [[t.order_no, '<b>' + esc_(o.id) + '</b>'], [t.product, esc_(o.product) + (o.productId ? ' <span style="color:#9C8592">(' + esc_(o.productId) + ')</span>' : '')],
    [t.qty, o.qty], [t.colour, esc_(o.colour || '-')]];
  if (withPrice) {
    rows.push([t.unit_price, money_(o.unitPrice)], [t.delivery, money_(o.delivery)], [t.total, '<b style="color:#6D1A46;font-size:17px">' + money_(o.total) + '</b>']);
  }
  rows.push([t.address, esc_(o.address).replace(/\n/g, '<br>') + (o.city ? ', ' + esc_(o.city) : '')]);
  if (o.notes) rows.push([t.notes, esc_(o.notes).replace(/\n/g, '<br>')]);
  return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;border:1px solid #EBDCE3;border-radius:12px;border-collapse:separate;overflow:hidden">' +
    '<tr><td colspan="2" style="background:#F8EEF3;padding:10px 14px;font-weight:bold;color:#6D1A46">' + esc_(t.order_details) + '</td></tr>' +
    rows.map(function (r) {
      return '<tr><td style="padding:8px 14px;border-top:1px solid #F1E6EB;color:#6B4A5B;width:40%;vertical-align:top">' + esc_(r[0]) +
        '</td><td style="padding:8px 14px;border-top:1px solid #F1E6EB;vertical-align:top">' + r[1] + '</td></tr>';
    }).join('') + '</table>';
}

function bankBox_(o, t, s) {
  return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:12px 0;background:#FDF5E2;border-left:4px solid #DDB04E;border-radius:8px">' +
    '<tr><td style="padding:14px 16px;font-size:14px;line-height:1.7"><b style="color:#6D1A46">' + esc_(t.bank_details) + '</b><br>' +
    esc_(t.bank) + ': <b>' + esc_(s['Bank Name']) + '</b><br>' + esc_(t.acc_name) + ': <b>' + esc_(s['Account Name']) + '</b><br>' +
    esc_(t.acc_no) + ': <b>' + esc_(s['Account Number']) + '</b><br>' + esc_(t.branch) + ': <b>' + esc_(s['Branch']) + '</b><br>' +
    esc_(t.reference) + ': <b>' + esc_(o.id) + '</b><br>' + esc_(t.due) + ': <b>' + dueDate_(s) + '</b></td></tr></table>';
}

function button_(label, url) {
  return '<a href="' + url + '" style="display:inline-block;background:#6D1A46;color:#FFFFFF;text-decoration:none;font-weight:bold;padding:13px 26px;border-radius:999px;border-bottom:3px solid #DDB04E">' + esc_(label) + '</a>';
}
function p_(text, raw) { return '<p style="margin:0 0 12px">' + (raw ? text : esc_(text)) + '</p>'; }

/* ------------------------------------------------------------------ */
/*  5. Invoice PDF                                                     */
/* ------------------------------------------------------------------ */
function createInvoicePdf_(o) {
  var s = getSettings_(), logo = '';
  try {
    var img = UrlFetchApp.fetch(s['Logo URL']).getBlob();
    logo = 'data:' + img.getContentType() + ';base64,' + Utilities.base64Encode(img.getBytes());
  } catch (err) { /* invoice still works without the logo */ }
  var today = Utilities.formatDate(new Date(), 'Asia/Colombo', 'dd MMM yyyy');
  var html =
    '<html><head><style>body{font-family:Arial,Helvetica,sans-serif;color:#3E1529;font-size:12px;margin:0}' +
    '.head{background:#6D1A46;color:#fff;padding:22px 28px}.gold{height:5px;background:#DDB04E}' +
    '.wrap{padding:24px 28px}h1{color:#6D1A46;font-size:26px;margin:0}table{width:100%;border-collapse:collapse}' +
    '.items th{background:#F8EEF3;color:#6D1A46;text-align:left;padding:8px;border-bottom:2px solid #DDB04E}' +
    '.items td{padding:8px;border-bottom:1px solid #EBDCE3}.items th.r{text-align:right}.r{text-align:right}.tot td{font-weight:bold;font-size:14px;color:#6D1A46}' +
    '.box{background:#FDF5E2;border-left:4px solid #DDB04E;padding:12px 14px;margin-top:18px;line-height:1.7}.muted{color:#6B4A5B}</style></head><body>' +
    '<div class="head"><table><tr><td>' + (logo ? '<img src="' + logo + '" height="56">' : '<b style="font-size:22px;color:#F2BE3A">' + esc_(s['Business Name']) + '</b>') + '</td>' +
    '<td class="r" style="color:#fff"><div style="font-size:22px;font-weight:bold;color:#F2BE3A">INVOICE</div>' +
    'INV-' + esc_(o.id) + '<br>' + today + '</td></tr></table></div><div class="gold"></div>' +
    '<div class="wrap"><table><tr><td style="vertical-align:top;width:55%"><div class="muted">BILL TO</div><b style="font-size:14px">' + esc_(o.name) + '</b><br>' +
    esc_(o.address).replace(/\n/g, '<br>') + (o.city ? '<br>' + esc_(o.city) : '') + '<br>' + esc_(o.mobile) + '<br>' + esc_(o.email) + '</td>' +
    '<td style="vertical-align:top" class="r"><div class="muted">ORDER</div><b>' + esc_(o.id) + '</b><br><span class="muted">Payment due:</span> ' + dueDate_(s) + '</td></tr></table>' +
    '<br><table class="items"><tr><th>Item</th><th>Colour</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr>' +
    '<tr><td><b>' + esc_(o.product) + '</b><br><span class="muted">' + esc_(o.productId || '') + '</span>' + (o.notes ? '<br><span class="muted">' + esc_(o.notes) + '</span>' : '') + '</td>' +
    '<td>' + esc_(o.colour || '-') + '</td><td class="r">' + o.qty + '</td><td class="r">' + money_(o.unitPrice) + '</td><td class="r">' + money_(o.unitPrice * o.qty) + '</td></tr>' +
    '<tr><td colspan="4" class="r">Delivery charge</td><td class="r">' + money_(o.delivery) + '</td></tr>' +
    '<tr class="tot"><td colspan="4" class="r">TOTAL</td><td class="r">' + money_(o.total) + '</td></tr></table>' +
    '<div class="box"><b style="color:#6D1A46">Payment details</b><br>Bank: <b>' + esc_(s['Bank Name']) + '</b><br>Account name: <b>' + esc_(s['Account Name']) +
    '</b><br>Account number: <b>' + esc_(s['Account Number']) + '</b><br>Branch: <b>' + esc_(s['Branch']) + '</b><br>Reference: <b>' + esc_(o.id) + '</b></div>' +
    '<p class="muted" style="margin-top:22px">' + esc_(s['Invoice Note']) + '</p>' +
    '<p class="muted">' + esc_(s['Business Name']) + ' · ' + esc_(s['Website URL']) + (s['WhatsApp Number'] ? ' · WhatsApp +' + s['WhatsApp Number'] : '') + '</p>' +
    '</div></body></html>';
  return HtmlService.createHtmlOutput(html).getBlob().getAs(MimeType.PDF).setName('Invoice-' + o.id + '.pdf');
}

/* ------------------------------------------------------------------ */
/*  6. Bank-slip upload web page (deploy as Web app)                   */
/* ------------------------------------------------------------------ */
function doGet(e) {
  var s = getSettings_();
  var id = (e && e.parameter.order) || '', token = (e && e.parameter.t) || '';
  var found = findOrder_(id, token);
  var t = T[(found && found.order.lang) || (e && e.parameter.lang) || 'en'] || T.en;
  var content;
  if (!found) {
    content = '<p class="msg err">' + esc_(t.upload_invalid) + '</p>';
  } else {
    var o = found.order;
    content = '<h1>' + esc_(t.upload_title) + '</h1>' +
      '<div class="card"><div><span>' + esc_(t.order_no) + '</span><b>' + esc_(o.id) + '</b></div>' +
      '<div><span>' + esc_(t.product) + '</span><b>' + esc_(o.product) + ' × ' + o.qty + '</b></div>' +
      (o.total ? '<div><span>' + esc_(t.total) + '</span><b class="tot">' + money_(o.total) + '</b></div>' : '') + '</div>' +
      '<div class="bank"><b>' + esc_(t.bank_details) + '</b><br>' + esc_(t.bank) + ': ' + esc_(s['Bank Name']) + '<br>' + esc_(t.acc_name) + ': ' + esc_(s['Account Name']) +
      '<br>' + esc_(t.acc_no) + ': ' + esc_(s['Account Number']) + '<br>' + esc_(t.branch) + ': ' + esc_(s['Branch']) + '<br>' + esc_(t.reference) + ': ' + esc_(o.id) + '</div>' +
      (o.slip ? '<p class="msg info">' + esc_(t.upload_done) + '</p>' : '') +
      '<label class="file"><span>' + esc_(t.upload_choose) + '</span><input type="file" id="f" accept="image/*,application/pdf"></label>' +
      '<button id="b" onclick="up()">' + esc_(t.upload_submit) + '</button><p id="m" class="msg" style="display:none"></p>' +
      '<script>var ID=' + JSON.stringify(o.id) + ',TK=' + JSON.stringify(token) + ',OK=' + JSON.stringify(t.upload_ok) + ',ER=' + JSON.stringify(t.upload_err) + ';' +
      'function show(c,x){var m=document.getElementById("m");m.className="msg "+c;m.textContent=x;m.style.display="block"}' +
      'function up(){var f=document.getElementById("f").files[0];if(!f){show("err",ER);return}if(f.size>10485760){show("err","Max 10 MB");return}' +
      'var b=document.getElementById("b");b.disabled=true;b.textContent="…";var r=new FileReader();r.onload=function(){var d=r.result.split(",")[1];' +
      'google.script.run.withSuccessHandler(function(){show("ok",OK);b.style.display="none"}).withFailureHandler(function(){show("err",ER);b.disabled=false;b.textContent=' + JSON.stringify(t.upload_submit) + '})' +
      '.uploadSlip(ID,TK,f.name,f.type||"application/octet-stream",d)};r.readAsDataURL(f)}</script>';
  }
  var page = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc_(s['Business Name']) + '</title>' +
    '<style>body{margin:0;background:#F6EFF2;font-family:Arial,Helvetica,sans-serif;color:#3E1529}.top{background:#6D1A46;padding:18px 22px;border-bottom:4px solid #DDB04E}' +
    '.top img{height:46px}.box{max-width:520px;margin:22px auto;background:#fff;border-radius:16px;padding:24px;box-shadow:0 10px 30px -14px rgba(109,26,70,.35)}' +
    'h1{color:#6D1A46;font-size:22px;margin:0 0 16px}.card{border:1px solid #EBDCE3;border-radius:12px;margin-bottom:14px}.card div{display:flex;justify-content:space-between;gap:12px;padding:10px 14px;border-top:1px solid #F1E6EB}' +
    '.card div:first-child{border-top:0}.card span{color:#6B4A5B}.tot{color:#6D1A46;font-size:18px}.bank{background:#FDF5E2;border-left:4px solid #DDB04E;border-radius:8px;padding:12px 14px;line-height:1.7;font-size:14px;margin-bottom:16px}' +
    '.file{display:block;border:2px dashed #DDB04E;border-radius:12px;padding:16px;text-align:center;cursor:pointer;margin-bottom:14px}.file span{display:block;margin-bottom:8px;color:#6B4A5B}' +
    'button{width:100%;background:#6D1A46;color:#fff;border:0;border-radius:999px;padding:14px;font-size:16px;font-weight:bold;cursor:pointer}button:disabled{opacity:.6}' +
    '.msg{padding:12px 14px;border-radius:10px;margin-top:14px}.ok{background:#DDF1E3}.err{background:#FBE3EB}.info{background:#E3EEFB}a{color:#A2306A}</style></head><body>' +
    '<div class="top"><a href="' + s['Website URL'] + '"><img src="' + s['Logo URL'] + '" alt="' + esc_(s['Business Name']) + '"></a></div>' +
    '<div class="box">' + content + '<p style="text-align:center;margin-top:20px"><a href="' + s['Website URL'] + '">' + esc_(t.visit) + '</a></p></div></body></html>';
  return HtmlService.createHtmlOutput(page).setTitle(s['Business Name'] + ' – Payment slip')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function uploadSlip(orderId, token, fileName, mimeType, base64) {
  var found = findOrder_(orderId, token);
  if (!found) throw new Error('Invalid link');
  if (!/^image\/|^application\/pdf$/.test(mimeType)) throw new Error('Only images or PDF');
  var bytes = Utilities.base64Decode(base64);
  if (bytes.length > 10 * 1024 * 1024) throw new Error('File too large');
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var safe = String(fileName).replace(/[^\w.\-]+/g, '_').slice(-60);
    var file = DriveApp.getFolderById(prop_('SLIP_FOLDER_ID')).createFile(Utilities.newBlob(bytes, mimeType, orderId + '-slip-' + safe));
    var sh = found.sheet, row = found.row;
    sh.getRange(row, COL.SLIP).setFormula('=HYPERLINK("' + file.getUrl() + '","View slip")');
    sh.getRange(row, COL.SLIP_AT).setValue(new Date());
    var status = sh.getRange(row, COL.STATUS).getValue();
    if (status === 'Approved' || status === 'New') sh.getRange(row, COL.STATUS).setValue('Slip Received');
    var order = readOrder_(sh, row);
    sendCustomerEmail_(order, 'slip');
    markEmail_(sh, row, 'Slip received');
    notifyOwner_('💳 Payment slip uploaded – ' + orderId,
      'The customer uploaded a payment slip.<br><br>' + detailsTable_(order, T.en, true) +
      '<p>' + button_('View slip', file.getUrl()) + ' &nbsp; ' + button_('Open Orders sheet', getSS_().getUrl()) + '</p>' +
      '<p>After checking your bank account, set Status to <b>Payment Confirmed</b>.</p>');
    return true;
  } finally { lock.releaseLock(); }
}

function uploadLink_(o) {
  var base = getSettings_()['Upload Page URL'] || ScriptApp.getService().getUrl() || '';
  return base + (base.indexOf('?') > -1 ? '&' : '?') + 'order=' + encodeURIComponent(o.id) + '&t=' + o.token;
}

/* ------------------------------------------------------------------ */
/*  7. Menu & helpers                                                  */
/* ------------------------------------------------------------------ */
function onSheetOpen() {
  SpreadsheetApp.getUi().createMenu('🌸 Lotus Handmade')
    .addItem('Resend last email for selected order', 'resendSelected')
    .addItem('Show form & upload links', 'showLinks')
    .addToUi();
}

function resendSelected() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== SHEET_ORDERS) { toast_('Select a row in the Orders sheet.'); return; }
  var row = sh.getActiveRange().getRow(); if (row < 2) return;
  var order = readOrder_(sh, row);
  var map = { 'New': 'received', 'Approved': 'accepted', 'Slip Received': 'slip', 'Payment Confirmed': 'payment', 'Completed': 'completed', 'Cancelled': 'cancelled' };
  var type = map[order.status]; if (!type) return;
  var att = type === 'accepted' ? [createInvoicePdf_(order)] : [];
  sendCustomerEmail_(order, type, att); markEmail_(sh, row, 'Resent ' + order.status);
  toast_('Email resent to ' + order.email);
}

function showLinks() {
  var s = getSettings_();
  SpreadsheetApp.getUi().alert('Order form:\n' + s['Form URL'] + '\n\nUpload page:\n' + (s['Upload Page URL'] || ScriptApp.getService().getUrl() || 'Not deployed yet — Deploy → New deployment → Web app') +
    '\n\nWebsite settings:\n' + s['Website Prefill Settings']);
}

function readOrder_(sh, row) {
  var v = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  var qty = Number(v[COL.QTY - 1]) || 1, unit = Number(v[COL.UNIT_PRICE - 1]) || 0;
  var del = v[COL.DELIVERY - 1] === '' ? '' : Number(v[COL.DELIVERY - 1]);
  return {
    id: v[COL.ORDER_ID - 1], lang: v[COL.LANG - 1] || 'en', name: v[COL.NAME - 1], email: v[COL.EMAIL - 1],
    mobile: String(v[COL.MOBILE - 1]), whatsapp: String(v[COL.WHATSAPP - 1]), productId: v[COL.PRODUCT_ID - 1],
    product: v[COL.PRODUCT - 1], qty: qty, colour: v[COL.COLOUR - 1], address: String(v[COL.ADDRESS - 1]), city: v[COL.CITY - 1],
    notes: v[COL.NOTES - 1], unitPrice: unit, delivery: del, total: unit * qty + (Number(del) || 0),
    status: v[COL.STATUS - 1], slip: v[COL.SLIP - 1], token: v[COL.TOKEN - 1]
  };
}

function findOrder_(id, token) {
  if (!id || !token) return null;
  var sh = getSS_().getSheetByName(SHEET_ORDERS);
  var data = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), HEADERS.length).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][COL.ORDER_ID - 1] === id && data[i][COL.TOKEN - 1] === token) return { sheet: sh, row: i + 2, order: readOrder_(sh, i + 2) };
  }
  return null;
}

function getSS_() { return SpreadsheetApp.openById(prop_('SPREADSHEET_ID')); }
function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }

function getSettings_() {
  var rows = getSS_().getSheetByName(SHEET_SETTINGS).getDataRange().getValues(), out = {};
  rows.slice(1).forEach(function (r) { out[r[0]] = String(r[1]).trim(); });
  return out;
}
function setSetting_(ss, key, value) {
  var sh = ss.getSheetByName(SHEET_SETTINGS), rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) if (rows[i][0] === key) { sh.getRange(i + 1, 2).setValue(value); return; }
}
function markEmail_(sh, row, label) {
  sh.getRange(row, COL.LAST_EMAIL).setValue(label + ' – ' + Utilities.formatDate(new Date(), 'Asia/Colombo', 'yyyy-MM-dd HH:mm'));
}
function toast_(msg) { try { getSS_().toast(msg, 'Lotus Handmade', 6); } catch (e) { Logger.log(msg); } }
function dueDate_(s) {
  var d = new Date(); d.setDate(d.getDate() + (Number(s['Payment Due (days)']) || 3));
  return Utilities.formatDate(d, 'Asia/Colombo', 'dd MMM yyyy');
}
function money_(n) {
  if (n === '' || n === null || isNaN(n)) return '-';
  return 'LKR ' + Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}
function stripHtml_(h) { return h.replace(/<br\s*\/?>/g, '\n').replace(/<\/(p|tr|div)>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim(); }
