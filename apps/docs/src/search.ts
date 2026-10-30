import { ICONS, type Category } from './icons';

const persianNames: Record<string, string> = {
  Melli: 'ملی', Mellat: 'ملت', Saderat: 'صادرات', Tejarat: 'تجارت', Sepah: 'سپه',
  Keshavarzi: 'کشاورزی', Maskan: 'مسکن', Refah: 'رفاه', Post: 'پست بانک',
  SanatMadan: 'صنعت معدن', TaavonEslami: 'تعاون اسلامی', Pasargad: 'پاسارگاد',
  Saman: 'سامان', Parsian: 'پارسیان', Ayandeh: 'آینده', Karafarin: 'کارآفرین',
  EghtesadNovin: 'اقتصاد نوین', Sina: 'سینا', Shahr: 'شهر', Gardeshgari: 'گردشگری',
  KhavarMianeh: 'خاورمیانه خاور میانه', Dey: 'دی', Caspian: 'کاسپین', Sarmayeh: 'سرمایه',
  Resalat: 'رسالت', IranZamin: 'ایران زمین', IranEurope: 'ایران اروپا', IranVenezuela: 'ایران ونزوئلا',
  Noor: 'نور', MehrIran: 'مهر ایران', Melall: 'ملل', Tosee: 'توسعه', ToseeSaderat: 'توسعه صادرات',
  ToseeTaavon: 'توسعه تعاون', StandardChartered: 'استاندارد چارتر', BluBank: 'بلو بلوبانک',
  Bankino: 'بانکینو', Futurebank: 'فیوچر بانک', Zarrinpal: 'زرین پال زرین‌پال', PayIr: 'پی',
  Payping: 'پی پینگ', NextPay: 'نکست پی', Idpay: 'آیدی پی', Vandar: 'وندار', Digipay: 'دیجی پی',
  Zibal: 'زیبال', Hesabit: 'حسابیت', AsanPardakht: 'آسان پرداخت آپ', SnappPay: 'اسنپ پی',
  SamanKish: 'سامان کیش', PasargadPep: 'پرداخت الکترونیک پاسارگاد', Sadad: 'سداد',
  Shaparak: 'شاپرک', BankMarkazi: 'بانک مرکزی', SepahMergedAnsar: 'انصار',
  SepahMergedGhavamin: 'قوامین', SepahMergedHekmat: 'حکمت', SepahMergedKosar: 'کوثر',
  SepahMergedMehrEghtesad: 'مهر اقتصاد',
};

export type ViewMode = 'both' | 'color' | 'mono';
export const normalizeSearch = (text: string) => text.trim().toLowerCase()
  .replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\s\u200c-]+/g, '');

const searchable = ICONS.map(icon => ({ icon, text: normalizeSearch([
  icon.displayName, icon.key, icon.colorIcon, icon.monoIcon || '', persianNames[icon.key] || '',
].join(' ')) }));

export function filterIcons(search: string, category: Category, mode: ViewMode) {
  const query = normalizeSearch(search);
  return searchable.filter(({ icon, text }) =>
    (!query || text.includes(query)) && (category === 'all' || icon.category === category) &&
    (mode !== 'mono' || icon.monoIcon)
  ).map(({ icon }) => icon);
}
