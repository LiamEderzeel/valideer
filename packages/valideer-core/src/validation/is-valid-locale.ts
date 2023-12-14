export const isValidLocale = (value: unknown): value is Extract<keyof ILanguages, string> => {
	if (typeof value !== "string") return false;

	return locales.includes(value);
};

export declare interface ILanguages {
	aa?: string; // Afar
	ab?: string; // Abkhazian
	ae?: string; // Avestan
	af?: string; // Afrikaans
	ak?: string; // Akan
	am?: string; // Amharic
	an?: string; // Aragonese
	ar?: string; // Arabic
	as?: string; // Assamese
	av?: string; // Avaric
	ay?: string; // Aymara
	az?: string; // Azerbaijani
	ba?: string; // Bashkir
	be?: string; // Belarusian
	bg?: string; // Bulgarian
	bh?: string; // Bihari languages
	bm?: string; // Bambara
	bi?: string; // Bislama
	bn?: string; // Bengali
	bo?: string; // Tibetan
	br?: string; // Breton
	bs?: string; // Bosnian
	ca?: string; // Catalan; Valencian
	ce?: string; // Chechen
	ch?: string; // Chamorro
	co?: string; // Corsican
	cr?: string; // Cree
	cs?: string; // Czech
	cu?: string; // Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic
	cv?: string; // Chuvash
	cy?: string; // Welsh
	da?: string; // Danish
	de?: string; // German
	dv?: string; // Divehi; Dhivehi; Maldivian
	dz?: string; // Dzongkha
	ee?: string; // Ewe
	el?: string; // Greek, Modern (1453-)
	en?: string; // English
	eo?: string; // Esperanto
	es?: string; // Spanish; Castilian
	et?: string; // Estonian
	eu?: string; // Basque
	fa?: string; // Persian
	ff?: string; // Fulah
	fi?: string; // Finnish
	fj?: string; // Fijian
	fo?: string; // Faroese
	fr?: string; // French
	fy?: string; // Western Frisian
	ga?: string; // Irish
	gd?: string; // Gaelic; Scottish Gaelic
	gl?: string; // Galician
	gn?: string; // Guarani
	gu?: string; // Gujarati
	gv?: string; // Manx
	ha?: string; // Hausa
	he?: string; // Hebrew
	hi?: string; // Hindi
	ho?: string; // Hiri Motu
	hr?: string; // Croatian
	ht?: string; // Haitian; Haitian Creole
	hu?: string; // Hungarian
	hy?: string; // Armenian
	hz?: string; // Herero
	ia?: string; // Interlingua (International Auxiliary Language Association)
	id?: string; // Indonesian
	ie?: string; // Interlingue; Occidental
	ig?: string; // Igbo
	ii?: string; // Sichuan Yi; Nuosu
	ik?: string; // Inupiaq
	io?: string; // Ido
	is?: string; // Icelandic
	it?: string; // Italian
	iu?: string; // Inuktitut
	ja?: string; // Japanese
	jv?: string; // Javanese
	ka?: string; // Georgian
	kg?: string; // Kongo
	ki?: string; // Kikuyu; Gikuyu
	kj?: string; // Kuanyama; Kwanyama
	kk?: string; // Kazakh
	kl?: string; // Kalaallisut; Greenlandic
	km?: string; // Central Khmer
	kn?: string; // Kannada
	ko?: string; // Korean
	kr?: string; // Kanuri
	ks?: string; // Kashmiri
	ku?: string; // Kurdish
	kv?: string; // Komi
	kw?: string; // Cornish
	ky?: string; // Kirghiz; Kyrgyz
	la?: string; // Latin
	lb?: string; // Luxembourgish; Letzeburgesch
	lg?: string; // Ganda
	li?: string; // Limburgan; Limburger; Limburgish
	ln?: string; // Lingala
	lo?: string; // Lao
	lt?: string; // Lithuanian
	lu?: string; // Luba-Katanga
	lv?: string; // Latvian
	mg?: string; // Malagasy
	mh?: string; // Marshallese
	mi?: string; // Maori
	mk?: string; // Macedonian
	ml?: string; // Malayalam
	mn?: string; // Mongolian
	mr?: string; // Marathi
	ms?: string; // Malay
	mt?: string; // Maltese
	my?: string; // Burmese
	na?: string; // Nauru
	nb?: string; // Bokmål, Norwegian; Norwegian Bokmål
	nd?: string; // Ndebele, North; North Ndebele
	ne?: string; // Nepali
	ng?: string; // Ndonga
	nl?: string; // Dutch; Flemish
	nn?: string; // Norwegian Nynorsk; Nynorsk, Norwegian
	no?: string; // Norwegian
	nr?: string; // Ndebele, South; South Ndebele
	nv?: string; // Navajo; Navaho
	ny?: string; // Chichewa; Chewa; Nyanja
	oc?: string; // Occitan (post 1500)
	oj?: string; // Ojibwa
	om?: string; // Oromo
	or?: string; // Oriya
	os?: string; // Ossetian; Ossetic
	pa?: string; // Panjabi; Punjabi
	pi?: string; // Pali
	pl?: string; // Polish
	ps?: string; // Pushto; Pashto
	pt?: string; // Portuguese
	qu?: string; // Quechua
	rm?: string; // Romansh
	rn?: string; // Rundi
	ro?: string; // Romanian; Moldavian; Moldovan
	ru?: string; // Russian
	rw?: string; // Kinyarwanda
	sa?: string; // Sanskrit
	sc?: string; // Sardinian
	sd?: string; // Sindhi
	se?: string; // Northern Sami
	sg?: string; // Sango
	si?: string; // Sinhala; Sinhalese
	sk?: string; // Slovak
	sl?: string; // Slovenian
	sm?: string; // Samoan
	sn?: string; // Shona
	so?: string; // Somali
	sq?: string; // Albanian
	sr?: string; // Serbian
	ss?: string; // Swati
	st?: string; // Sotho, Southern
	su?: string; // Sundanese
	sv?: string; // Swedish
	sw?: string; // Swahili
	ta?: string; // Tamil
	te?: string; // Telugu
	tg?: string; // Tajik
	th?: string; // Thai
	ti?: string; // Tigrinya
	tk?: string; // Turkmen
	tl?: string; // Tagalog
	tn?: string; // Tswana
	to?: string; // Tonga (Tonga Islands)
	tr?: string; // Turkish
	ts?: string; // Tsonga
	tt?: string; // Tatar
	tw?: string; // Twi
	ty?: string; // Tahitian
	ug?: string; // Uighur; Uyghur
	uk?: string; // Ukrainian
	ur?: string; // Urdu
	uz?: string; // Uzbek
	ve?: string; // Venda
	vi?: string; // Vietnamese
	vo?: string; // Volapük
	wa?: string; // Walloon
	wo?: string; // Wolof
	xh?: string; // Xhosa
	yi?: string; // Yiddish
	yo?: string; // Yoruba
	za?: string; // Zhuang; Chuang
	zh?: string; // Chinese
	zu?: string; // Zulu
}

export const locales: (Extract<keyof ILanguages, string> | string)[] = [
	"aa",
	"ab",
	"ae",
	"af",
	"ak",
	"am",
	"an",
	"ar",
	"as",
	"av",
	"ay",
	"az",
	"ba",
	"be",
	"bg",
	"bh",
	"bm",
	"bi",
	"bn",
	"bo",
	"br",
	"bs",
	"ca",
	"ce",
	"ch",
	"co",
	"cr",
	"cs",
	"cu",
	"cv",
	"cy",
	"da",
	"de",
	"dv",
	"dz",
	"ee",
	"el",
	"en",
	"eo",
	"es",
	"et",
	"eu",
	"fa",
	"ff",
	"fi",
	"fj",
	"fo",
	"fr",
	"fy",
	"ga",
	"gd",
	"gl",
	"gn",
	"gu",
	"gv",
	"ha",
	"he",
	"hi",
	"ho",
	"hr",
	"ht",
	"hu",
	"hy",
	"hz",
	"ia",
	"id",
	"ie",
	"ig",
	"ii",
	"ik",
	"io",
	"is",
	"it",
	"iu",
	"ja",
	"jv",
	"ka",
	"kg",
	"ki",
	"kj",
	"kk",
	"kl",
	"km",
	"kn",
	"ko",
	"kr",
	"ks",
	"ku",
	"kv",
	"kw",
	"ky",
	"la",
	"lb",
	"lg",
	"li",
	"ln",
	"lo",
	"lt",
	"lu",
	"lv",
	"mg",
	"mh",
	"mi",
	"mk",
	"ml",
	"mn",
	"mr",
	"ms",
	"mt",
	"my",
	"na",
	"nb",
	"nd",
	"ne",
	"ng",
	"nl",
	"nn",
	"no",
	"nr",
	"nv",
	"ny",
	"oc",
	"oj",
	"om",
	"or",
	"os",
	"pa",
	"pi",
	"pl",
	"ps",
	"pt",
	"qu",
	"rm",
	"rn",
	"ro",
	"ru",
	"rw",
	"sa",
	"sc",
	"sd",
	"se",
	"sg",
	"si",
	"sk",
	"sl",
	"sm",
	"sn",
	"so",
	"sq",
	"sr",
	"ss",
	"st",
	"su",
	"sv",
	"sw",
	"ta",
	"te",
	"tg",
	"th",
	"ti",
	"tk",
	"tl",
	"tn",
	"to",
	"tr",
	"ts",
	"tt",
	"tw",
	"ty",
	"ug",
	"uk",
	"ur",
	"uz",
	"ve",
	"vi",
	"vo",
	"wa",
	"wo",
	"xh",
	"yi",
	"yo",
	"za",
	"zh",
	"zu",
]
