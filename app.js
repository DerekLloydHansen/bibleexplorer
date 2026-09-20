const scriptureUrl = (ref) => {
  const match = ref.match(/^(.*?)(?:\s+)(\d+)(?::(\d+)(?:[–-](\d+))?)?$/);
  if (!match) return `https://www.churchofjesuschrist.org/study/scriptures?lang=eng#${encodeURIComponent(ref)}`;
  const [, rawBook, chapter, start, end] = match;
  const book = rawBook.trim();
  const slugMap = {
    '1 Nephi':'1-ne', '2 Nephi':'2-ne', '3 Nephi':'3-ne', 'Alma':'alma', 'Mosiah':'mosiah', 'Mormon':'morm', 'Moroni':'moro', 'Jacob':'jacob',
    'Doctrine and Covenants':'dc', 'D&C':'dc', 'Moses':'moses', 'Abraham':'abr',
    'Isaiah':'isa', 'Jeremiah':'jer', 'Hosea':'hosea', 'Amos':'amos', 'Malachi':'mal', '1 Samuel':'1-sam', 'Matthew':'matt', 'Revelation':'rev'
  };
  const slug = slugMap[book];
  if (!slug) return `https://www.churchofjesuschrist.org/study/scriptures?lang=eng#${encodeURIComponent(ref)}`;
  const testament = ['1 Nephi','2 Nephi','3 Nephi','Alma','Mosiah','Mormon','Moroni','Jacob'].includes(book) ? 'bofm' : ['Moses','Abraham'].includes(book) ? 'pgp' : book === 'D&C' || book === 'Doctrine and Covenants' ? 'dc-testament' : ['Matthew','Revelation'].includes(book) ? 'nt' : 'ot';
  const section = book === 'D&C' || book === 'Doctrine and Covenants' ? `${chapter}` : `${slug}/${chapter}`;
  const page = `https://www.churchofjesuschrist.org/study/scriptures/${testament}/${section}?lang=eng`;
  if (!start) return page;
  const range = end ? `${start}-${end}` : start;
  return `${page}&id=p${range}#p${start}`;
};
const bibleGatewayUrl = (ref, version) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=${version}`;
const YV_API_BASE = 'https://bibleexplorer-api.shakmatt.workers.dev';

const talks = {
  mcconkie: { label: 'Bruce R. McConkie · “Ten Keys to Understanding Isaiah”', url: 'https://www.churchofjesuschrist.org/study/ensign/1973/10/ten-keys-to-understanding-isaiah?lang=eng' },
  oaks: { label: 'Dallin H. Oaks · “Scripture Reading and Revelation”', url: 'https://www.churchofjesuschrist.org/study/ensign/1995/01/scripture-reading-and-revelation?id=p22&lang=eng' },
  eubank: { label: 'Sharon Eubank · “Christ: The Light That Shines in Darkness”', url: 'https://www.churchofjesuschrist.org/study/general-conference/2019/04/42eubank?lang=eng' }
};

const verses = [
  { n:1, text:'The vision of Isaiah the son of Amoz, which he saw concerning Judah and Jerusalem in the days of Uzziah, Jotham, Ahaz, and Hezekiah, kings of Judah.', refs:[['3 Ne. 23:1–3','3 Nephi 23:1–3']], note:'Opening superscription · prophetic vision', commentary:'Isaiah is introduced as a seer whose vision concerns covenant people and the holy city. The historical frame matters, but the word “vision” also invites a temple-shaped reading: the prophet sees from the presence of God and speaks into Israel’s public life.', barker:'The temple-theology conversation treats prophetic vision as participation in the heavenly court; hold that possibility alongside the historical setting.', hebrew:[['חֲזוֹן','vision'],['יְשַׁעְיָהוּ','Isaiah / the Lord saves'],['יְרוּשָׁלַ‍ִם','Jerusalem']], greek:[['ὅρασις','vision'],['Ἰσαΐου','of Isaiah'],['Ἰερουσαλήμ','Jerusalem']], talks:['mcconkie','oaks'] },
  { n:2, text:'Hear, O heavens, and give ear, O earth: for the Lord hath spoken, I have nourished and brought up children, and they have rebelled against me.', refs:[['D&C 1:1–2','D&C 1:1–2'],['D&C 76:1','D&C 76:1']], note:'Heaven and earth as witnesses', commentary:'The covenant lawsuit opens with cosmic witnesses. “Nourished” is parental covenant language: rebellion is not ignorance but a breach of a relationship already richly sustained by the Lord.', barker:'The heavenly-earthly courtroom is at home in ancient temple and royal imagery, where divine speech establishes order and judges disorder.', hebrew:[['שִׁמְעוּ','hear'],['בָּנִים','children'],['פָּשְׁעוּ','they rebelled']], greek:[['ἀκούσατε','hear!'],['υἱούς','children'],['ἠθέτησαν','they rejected / rebelled']], talks:['mcconkie','oaks'] },
  { n:3, text:'The ox knoweth his owner, and the ass his master’s crib: but Israel doth not know, my people doth not consider.', refs:[['1 Ne. 19:23–24','1 Nephi 19:23–24']], note:'Knowing is covenant recognition', commentary:'Animals recognize the one who feeds and shelters them; Israel has lost the more basic spiritual perception. In Restoration terms, scripture is meant to move from information to remembrance—knowing the Lord as covenant Lord.', barker:'The stable or manger image keeps the focus on sacred provision: the question is not ritual sophistication but recognition of the true source of life.', hebrew:[['יָדַע','know'],['בְּעָלָיו','its owner'],['יִשְׂרָאֵל','Israel']], greek:[['ἔγνω','knew'],['κύριον','master / lord'],['λαός','people']], talks:['mcconkie'] },
  { n:4, text:'Ah sinful nation, a people laden with iniquity, a seed of evildoers, children that are corrupters: they have forsaken the Lord, they have provoked the Holy One of Israel unto anger, they are gone away backward.', refs:[['2 Ne. 13:8','2 Nephi 13:8'],['D&C 38:10–12','D&C 38:10–12']], note:'Forsaking the Holy One', commentary:'The piling-up of titles and verbs makes apostasy feel communal and inherited, not merely private. Yet “Holy One of Israel” keeps covenant identity in view: the people are judged precisely because they belong to Him.', barker:'The title “Holy One” resonates with temple holiness, but Isaiah turns sacred identity into an ethical charge rather than a shield against judgment.', hebrew:[['קָדוֹשׁ','holy'],['עָזְבוּ','they forsook'],['נָסֹגוּ','they turned back']], greek:[['ἅγιον','holy one'],['ἐγκατέλιπον','they abandoned'],['ἀπεστράφησαν','they turned away']], talks:['mcconkie','oaks'] },
  { n:5, text:'Why should ye be stricken any more? ye will revolt more and more: the whole head is sick, and the whole heart faint.', refs:[['D&C 101:7–8','D&C 101:7–8']], note:'Wounds that have not taught repentance', commentary:'Isaiah shifts from accusation to diagnosis. Punishment by itself does not heal covenant illness; the deeper problem is a heart that refuses the instruction embedded in chastening.', hebrew:[['לָמָּה','why'],['תּוֹסִיפוּ','will you add / continue'],['חֹלִי','sickness']], greek:[['τί','why'],['προσετέθητε','were you added / struck'],['ἀσθενής','weak / faint']], talks:['oaks'] },
  { n:6, text:'From the sole of the foot even unto the head there is no soundness in it; but wounds, and bruises, and putrifying sores: they have not been closed, neither bound up, neither mollified with ointment.', refs:[['2 Ne. 28:32','2 Nephi 28:32'],['Alma 5:33','Alma 5:33']], note:'The body politic is diseased', commentary:'The whole body is wounded, so the remedy must be comprehensive. Isaiah’s imagery is deliberately physical: repentance is not cosmetic improvement but the Lord’s healing of a people whose injustice has become systemic.', hebrew:[['מַכָּה','wound'],['חַבּוּרָה','bruise'],['רָפָא','heal']], greek:[['πληγή','wound / plague'],['τραῦμα','wound'],['ἰάσασθαι','to heal']], talks:['oaks'] },
  { n:7, text:'Your country is desolate, your cities are burned with fire: your land, strangers devour it in your presence, and it is desolate, as overthrown by strangers.', refs:[['2 Ne. 13:8','2 Nephi 13:8']], note:'Covenant loss becomes visible', commentary:'The land itself testifies against the people. Isaiah links spiritual abandonment with social and political vulnerability; the covenant is not an escape from history but a way of inhabiting it faithfully.', hebrew:[['שְׁמָמָה','desolation'],['אֵשׁ','fire'],['זָרִים','strangers']], greek:[['ἔρημος','desolate'],['πυρί','fire'],['ἀλλότριοι','others / strangers']], talks:['mcconkie'] },
  { n:8, text:'And the daughter of Zion is left as a cottage in a vineyard, as a lodge in a garden of cucumbers, as a besieged city.', refs:[['2 Ne. 13:8','2 Nephi 13:8']], note:'Daughter of Zion · remnant image', commentary:'“Daughter of Zion” personifies Jerusalem as vulnerable and exposed. The little shelter left in a harvested field is both a picture of judgment and a hint of remnant theology: not everything is gone.', barker:'The vineyard and garden are charged sacred-space images; Isaiah reverses their abundance into a fragile shelter awaiting renewal.', hebrew:[['בַּת־צִיּוֹן','daughter of Zion'],['סֻכָּה','booth / shelter'],['מָצוֹר','siege']], greek:[['θυγάτηρ','daughter'],['Σιών','Zion'],['καταλειφθείσα','left behind']], talks:['mcconkie'] },
  { n:9, text:'Except the Lord of hosts had left unto us a very small remnant, we should have been as Sodom, and we should have been like unto Gomorrah.', refs:[['2 Ne. 10:20–22','2 Nephi 10:20–22'],['3 Ne. 9:14','3 Nephi 9:14']], note:'The remnant is mercy', commentary:'The remnant is not a human achievement; it is what the Lord leaves in mercy. Isaiah’s appeal to Sodom and Gomorrah makes survival itself a sign of grace and turns the reader toward repentance rather than presumption.', hebrew:[['שְׂרִיד','remnant'],['יְהוָה צְבָאוֹת','Lord of hosts'],['כִּמְעַט','almost / a little']], greek:[['σπέρμα','seed / remnant'],['κύριος σαβαώθ','Lord of hosts'],['ὡς Σόδομα','as Sodom']], talks:['mcconkie'] },
  { n:10, text:'Hear the word of the Lord, ye rulers of Sodom; give ear unto the law of our God, ye people of Gomorrah.', refs:[['2 Ne. 9:48','2 Nephi 9:48'],['D&C 1:17–20','D&C 1:17–20']], note:'The covenant lawsuit names the court', commentary:'Isaiah applies the names of notorious cities to Jerusalem’s rulers and people. The charge is not that they lack worship language; it is that their public life contradicts the law of God.', barker:'The language sounds like a liturgical indictment brought into the temple court: sacred status cannot protect an unjust society.', hebrew:[['שִׁמְעוּ','hear'],['דְּבַר־יְהוָה','word of the Lord'],['תּוֹרָה','law / teaching']], greek:[['ἀκούσατε','hear'],['λόγον','word'],['νόμον','law']], talks:['mcconkie','oaks'] },
  { n:11, text:'To what purpose is the multitude of your sacrifices unto me? saith the Lord: I am full of the burnt offerings of rams, and the fat of fed beasts; and I delight not in the blood of bullocks, or of lambs, or of he goats.', refs:[['1 Sam. 15:22','1 Samuel 15:22'],['D&C 1:30','D&C 1:30']], note:'Sacrifice without covenant fidelity', commentary:'Isaiah does not dismiss sacrifice as such; he rejects worship detached from obedience. The Lord’s question is about purpose: ritual cannot substitute for the transformed life that covenant worship is meant to create.', barker:'This is a classic temple-theology tension: the problem is not sacred ritual but a cult severed from justice, holiness, and the presence it claims to approach.', hebrew:[['זֶבַח','sacrifice'],['עוֹלוֹת','burnt offerings'],['חָפַצְתִּי','I delight / desire']], greek:[['θυσία','sacrifice'],['ὁλοκαυτώματα','burnt offerings'],['οὐ βούλομαι','I do not desire']], talks:['mcconkie','oaks'] },
  { n:12, text:'When ye come to appear before me, who hath required this at your hand, to tread my courts?', refs:[['D&C 109:8','D&C 109:8']], note:'Approaching the courts', commentary:'The verb “tread” is intentionally stark: people enter sacred courts, yet the Lord asks what He actually required. Presence in holy space must become a holy pattern of life.', barker:'The court language is an especially strong temple signal, but Isaiah’s point is corrective: proximity to the sanctuary is not the same as access to God.', hebrew:[['לֵרָאוֹת','to appear / be seen'],['חֲצֵרָי','my courts'],['בִּקֵּשׁ','required / sought']], greek:[['ὀφθῆναί','to appear'],['αὐλή','court'],['ἐκζητέω','seek / require']], talks:['oaks'] },
  { n:13, text:'Bring no more vain oblations; incense is an abomination unto me; the new moons and sabbaths, the calling of assemblies, I cannot away with; it is iniquity, even the solemn meeting.', refs:[['Isa. 29:13','Isaiah 29:13'],['Matt. 15:9','Matthew 15:9']], note:'Holy time turned hollow', commentary:'Every major worship marker is named—offering, incense, calendar, assembly—and every one is emptied by iniquity. Isaiah is asking whether the form of worship still carries the truth it signifies.', barker:'Incense, calendar, and assembly belong to temple ritual; the critique assumes their significance while exposing their divorce from holiness.', hebrew:[['מִנְחָה','offering'],['קְטֹרֶת','incense'],['עָוֶן','iniquity']], greek:[['μάταιος','vain'],['θυμίαμα','incense'],['ἀνομία','lawlessness']], talks:['mcconkie'] },
  { n:14, text:'Your new moons and your appointed feasts my soul hateth: they are a trouble unto me; I am weary to bear them.', refs:[['Hosea 2:11','Hosea 2:11'],['Amos 5:21','Amos 5:21']], note:'The Lord rejects religious performance', commentary:'Isaiah gives divine speech an emotional edge: God is weary of worship that burdens rather than blesses. The sacred calendar has become a performance that leaves neighbor and covenant neglected.', hebrew:[['שַׂנֵאתִי','I hate'],['מוֹעֲדִים','appointed times'],['נָשָׂא','to bear / carry']], greek:[['ἑορτή','feast'],['ἀπεχθάνομαι','hate'],['κοπιάω','grow weary']], talks:['oaks'] },
  { n:15, text:'And when ye spread forth your hands, I will hide mine eyes from you: yea, when ye make many prayers, I will not hear: your hands are full of blood.', refs:[['Isa. 59:2–3','Isaiah 59:2–3'],['D&C 101:7–8','D&C 101:7–8']], note:'Prayer and bloodshed cannot be separated', commentary:'The posture of prayer is visible, but so are the hands. Isaiah makes worship accountable to violence, exploitation, and the treatment of human beings made in God’s image.', hebrew:[['כַּפַּיִם','hands'],['דָּם','blood'],['תְּפִלָּה','prayer']], greek:[['χεῖρας','hands'],['αἷμα','blood'],['προσευχή','prayer']], talks:['oaks'] },
  { n:16, text:'Wash you, make you clean; put away the evil of your doings from before mine eyes; cease to do evil;', refs:[['D&C 50:10','D&C 50:10'],['Jer. 7:3','Jeremiah 7:3']], note:'Repentance as purification', commentary:'The commands move from washing to removing to ceasing. Repentance is both cleansing and cessation: a return to God that changes what stands before His eyes.', barker:'Purity language is at home in temple practice, yet Isaiah makes moral purification the condition of meaningful approach.', hebrew:[['רָחֲצוּ','wash yourselves'],['הִזַּכּוּ','make yourselves clean'],['חִדְלוּ','cease']], greek:[['λούσασθε','wash yourselves'],['καθαροί','clean'],['παύσασθε','stop / cease']], talks:['mcconkie','eubank'] },
  { n:17, text:'Learn to do well; seek judgment, relieve the oppressed, judge the fatherless, plead for the widow.', refs:[['Mosiah 4:16–18','Mosiah 4:16–18'],['Alma 34:28','Alma 34:28']], note:'Justice is the fruit of cleansing', commentary:'Isaiah’s alternative to hollow worship is concrete justice. The poor, fatherless, widow, and oppressed become the test of whether a people has learned to “do well.”', hebrew:[['לִמְדוּ','learn'],['מִשְׁפָּט','justice'],['אַלְמָנָה','widow']], greek:[['μάθετε','learn'],['κρίμα','justice / judgment'],['ὀρφανός','orphan / fatherless']], talks:['mcconkie'] },
  { n:18, text:'Come now, and let us reason together, saith the Lord: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.', refs:[['Alma 13:11','Alma 13:11'],['Rev. 7:14','Revelation 7:14']], note:'The colorfast promise of grace', commentary:'The Lord invites argument, not because sin is trivial, but because grace is stronger than the stain. In a Latter-day Saint reading, cleansing is covenantal and Christ-centered: repentance makes reunion possible.', barker:'The movement from scarlet to white evokes a priestly world of garments and purity, but Isaiah locates the miracle in the Lord’s invitation to return.', hebrew:[['לְכוּ־נָא','come now'],['שָׁנִים','scarlet'],['כַּשֶּׁלֶג','as snow']], greek:[['δεῦτε','come'],['διαλεχθῶμεν','let us reason / discuss'],['λευκανῶ','I will make white']], talks:['eubank','mcconkie'] },
  { n:19, text:'If ye be willing and obedient, ye shall eat the good of the land:', refs:[['D&C 64:34','D&C 64:34'],['D&C 101:58','D&C 101:58']], note:'Willing obedience and the land', commentary:'The promise is deliberately earthy: obedient covenant life bears fruit in the land. “Willing” keeps obedience from becoming mere external compliance; the heart must consent to the Lord’s order.', hebrew:[['תֹּאבוּ','be willing'],['תִּשְׁמְעוּ','obey / hear'],['טוּב','goodness']], greek:[['ἐάν θέλητε','if you are willing'],['εἰσακούσητε','if you obey / hear'],['φάγεσθε','you will eat']], talks:['oaks'] },
  { n:20, text:'But if ye refuse and rebel, ye shall be devoured with the sword: for the mouth of the Lord hath spoken it.', refs:[['D&C 1:37–38','D&C 1:37–38'],['D&C 101:7–8','D&C 101:7–8']], note:'The prophetic word is binding', commentary:'The two ways are set side by side. Isaiah’s final phrase grounds the warning in revelation: the prophet is not offering a private theory but reporting what the Lord has spoken.', hebrew:[['תְּמָאֲנוּ','you refuse'],['מְרִיתֶם','you rebel'],['פִּי־יְהוָה','mouth of the Lord']], greek:[['ἐὰν δὲ μὴ θέλητε','but if you are not willing'],['ἀπειθήσητε','disobey'],['στόμα Κυρίου','mouth of the Lord']], talks:['mcconkie','oaks'] },
  { n:21, text:'How is the faithful city become an harlot! it was full of judgment; righteousness lodged in it; but now murderers.', refs:[['2 Ne. 10:3–6','2 Nephi 10:3–6']], note:'Jerusalem as a broken bride', commentary:'The faithful city has become an unfaithful one. Isaiah uses marital betrayal to describe civic betrayal: a city built for justice now houses violence.', barker:'The bride/city image belongs to the symbolic vocabulary of Zion and temple; its force comes from the contrast between intended holiness and lived infidelity.', hebrew:[['קִרְיָה','city'],['נֶאֱמָנָה','faithful'],['זוֹנָה','harlot']], greek:[['πόλις','city'],['πιστή','faithful'],['πόρνη','harlot']], talks:['mcconkie'] },
  { n:22, text:'Thy silver is become dross, thy wine mixed with water:', refs:[['Isa. 1:25','Isaiah 1:25'],['Mal. 3:3','Malachi 3:3']], note:'Corruption of value', commentary:'Two images of adulteration—metal and wine—show that Judah’s problem is not absence of value but contamination. The Lord’s refining will recover what was meant to be pure.', hebrew:[['כֶּסֶף','silver'],['סִיגִים','dross'],['מָהַל','mix / dilute']], greek:[['ἀργύριον','silver'],['σίγμα','dross'],['κεκέραται','has been mixed']], talks:['mcconkie'] },
  { n:23, text:'Thy princes are rebellious, and companions of thieves: every one loveth gifts, and followeth after rewards: they judge not the fatherless, neither doth the cause of the widow come unto them.', refs:[['Mosiah 29:12–18','Mosiah 29:12–18'],['D&C 58:26–28','D&C 58:26–28']], note:'Leadership is tested by the vulnerable', commentary:'Isaiah brings corruption into the courtroom. Leaders are measured by whether the powerless receive justice, not by the public display of office or religious identity.', hebrew:[['שָׂרִים','princes / leaders'],['שֹׁחַד','bribe'],['יָתוֹם','fatherless']], greek:[['ἄρχοντες','rulers'],['δῶρα','gifts / bribes'],['χήρα','widow']], talks:['oaks'] },
  { n:24, text:'Therefore saith the Lord, the Lord of hosts, the mighty One of Israel, Ah, I will ease me of mine adversaries, and avenge me of mine enemies:', refs:[['D&C 101:58','D&C 101:58'],['D&C 133:2–3','D&C 133:2–3']], note:'The divine warrior speaks', commentary:'The repeated title “Lord of hosts” signals a shift from lawsuit to judgment. Yet the target is not merely “outsiders”: in context, the Lord’s adversaries include corrupt members of His own covenant society.', hebrew:[['אֲדוֹן','Lord'],['גִּבּוֹר','mighty'],['צָרַי','my adversaries']], greek:[['δεσπότης','master / Lord'],['ἰσχυρός','mighty'],['ἐχθροί','enemies']], talks:['mcconkie'] },
  { n:25, text:'And I will turn my hand upon thee, and purely purge away thy dross, and take away all thy tin:', refs:[['Mal. 3:3','Malachi 3:3'],['D&C 101:25','D&C 101:25']], note:'Refining as covenant mercy', commentary:'The hand that judges also refines. Isaiah’s metalwork metaphor holds severity and mercy together: the purpose of purging is not annihilation but the recovery of a people fit for faithful life.', barker:'Purification is a central temple metaphor; Isaiah’s distinctive move is to make the furnace a moral and communal process.', hebrew:[['יָד','hand'],['צָרַף','refine'],['בָּדִיל','tin / dross']], greek:[['χεῖρα','hand'],['καθαριῶ','I will cleanse'],['ἀποκαθαριῶ','I will purify']], talks:['oaks'] },
  { n:26, text:'And I will restore thy judges as at the first, and thy counsellors as at the beginning: afterward thou shalt be called, The city of righteousness, the faithful city.', refs:[['D&C 109:79–80','D&C 109:79–80'],['Moses 7:18','Moses 7:18']], note:'Restoration of the faithful city', commentary:'Judgment opens into restoration. The city is not simply repaired structurally; its name is changed because its public character has changed. Righteousness becomes communal and visible.', barker:'The city’s restoration echoes Zion as an ordered sacred community, not merely a private spiritual state.', hebrew:[['הָשִׁיבָה','restore'],['צֶדֶק','righteousness'],['נֶאֱמָנָה','faithful']], greek:[['ἀποκαταστήσω','I will restore'],['δικαιοσύνη','righteousness'],['πόλις πιστή','faithful city']], talks:['mcconkie'] },
  { n:27, text:'Zion shall be redeemed with judgment, and her converts with righteousness.', refs:[['2 Ne. 10:20–22','2 Nephi 10:20–22'],['D&C 84:2','D&C 84:2']], note:'Zion, judgment, righteousness', commentary:'Redemption is not detached from judgment; the city is redeemed by being brought back into right order. Converts are gathered into that order through righteousness, not merely affiliation.', barker:'Zion is both a place and a people. Temple theology helps keep those dimensions together: sacred space and a sanctified community belong to one another.', hebrew:[['צִיּוֹן','Zion'],['פָּדָה','redeem'],['שָׁב','return / convert']], greek:[['Σιών','Zion'],['λυτρώσεται','will be redeemed'],['ἐπιστρέφω','turn / convert']], talks:['mcconkie','oaks'] },
  { n:28, text:'And the destruction of the transgressors and of the sinners shall be together, and they that forsake the Lord shall be consumed.', refs:[['D&C 76:35–37','D&C 76:35–37'],['D&C 133:63','D&C 133:63']], note:'Forsaking the Lord', commentary:'The chapter’s hard edge returns: restoration does not erase moral consequence. Isaiah distinguishes between the refining of a people and the destruction of those who persist in forsaking the Lord.', hebrew:[['פֶּשַׁע','transgression'],['חָטָא','sin'],['עָזַב','forsake']], greek:[['παράπτωμα','transgression'],['ἁμαρτωλός','sinner'],['ἐγκαταλείπω','forsake']], talks:['mcconkie'] },
  { n:29, text:'For they shall be ashamed of the oaks which ye have desired, and ye shall be confounded for the gardens that ye have chosen.', refs:[['2 Ne. 9:37','2 Nephi 9:37'],['Isa. 57:5','Isaiah 57:5']], note:'Sacred trees turned to idols', commentary:'The oaks and gardens likely evoke sites of illicit worship. Isaiah contrasts created beauty with the false worship and political confidence invested in it.', barker:'Tree and garden imagery can carry Edenic and temple resonance, but here it is a parody of sacred space: desire has redirected worship toward substitutes.', hebrew:[['אֵלִים','terebinths / oaks'],['בָּחַר','choose'],['בּוּשׁ','be ashamed']], greek:[['δρύς','oak'],['κήπος','garden'],['αἰσχυνθήσεσθε','you will be ashamed']], talks:['mcconkie'] },
  { n:30, text:'For ye shall be as an oak whose leaf fadeth, and as a garden that hath no water.', refs:[['2 Ne. 9:37','2 Nephi 9:37'],['Jer. 17:5–8','Jeremiah 17:5–8']], note:'Life without living water', commentary:'The image turns from chosen groves to withering trees. Without the Lord, apparent rootedness becomes fragility; the garden’s beauty cannot survive when its water is gone.', hebrew:[['כְּאֵלָה','like an oak'],['נֹבֶלֶת','fading'],['מַיִם','water']], greek:[['ὡς δρῦς','as an oak'],['φυλλορροέω','shed leaves'],['ὕδωρ','water']], talks:['oaks'] },
  { n:31, text:'And the strong shall be as tow, and the maker of it as a spark, and they shall both burn together, and none shall quench them.', refs:[['D&C 133:41','D&C 133:41'],['Mal. 4:1','Malachi 4:1']], note:'The chapter ends at the furnace', commentary:'The “strong” and the “maker” become mutually combustible: power and the false object of power consume one another. Isaiah closes with a warning that anticipates the refining fire of the book’s later visions.', barker:'Fire is both judgment and transformation in temple symbolism; here Isaiah leaves the reader with the urgency of choosing what kind of material one is becoming.', hebrew:[['חָסֹן','strong / mighty'],['נְעֹרֶת','tow / straw fiber'],['נִצָּץ','spark']], greek:[['ἰσχυρός','strong'],['στιππύον','tow'],['σπινθήρ','spark']], talks:['mcconkie','oaks'] }
];

const youVersionState = { catalog: null, loading: null, error: null, byKey: new Map() };
const passageQueue = { active: 0, pending: [] };

function escapeHtml(value) {
  return String(value || '').replace(/[&<>\"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[character]));
}

function youVersionKey(version) { return `YV_${version.id}`; }
function youVersionLabel(version) {
  const abbreviation = version.localized_abbreviation || version.abbreviation || `Version ${version.id}`;
  return `${abbreviation} — ${version.localized_title || version.title || abbreviation}`;
}
function licensedEnglishVersions() {
  return (youVersionState.catalog || [])
    .filter((version) => (version.language_tag || '').toLowerCase().startsWith('en') && (!version.books || version.books.includes('ISA')))
    .sort((a, b) => youVersionLabel(a).localeCompare(youVersionLabel(b)));
}
function studyOptionsMarkup() {
  return '<optgroup label="Study texts"><option value="GREEK">Greek · LXX</option><option value="HEBREW">Hebrew · MT</option></optgroup>';
}
function versionOptionsMarkup() {
  const english = licensedEnglishVersions();
  if (!youVersionState.catalog) return `<option value="" disabled selected>Loading licensed English versions…</option>${studyOptionsMarkup()}`;
  if (youVersionState.error) return `<option value="" disabled selected>English versions unavailable</option>${studyOptionsMarkup()}`;
  if (!english.length) return `<option value="" disabled selected>No licensed English versions found</option>${studyOptionsMarkup()}`;
  youVersionState.byKey = new Map(english.map((version) => [youVersionKey(version), version]));
  const options = english.map((version) => `<option value="${youVersionKey(version)}">${escapeHtml(youVersionLabel(version))}</option>`).join('');
  return `<optgroup label="Licensed English versions">${options}</optgroup>${studyOptionsMarkup()}`;
}

function queuePassageRequest(task) {
  return new Promise((resolve, reject) => {
    passageQueue.pending.push({ task, resolve, reject });
    drainPassageQueue();
  });
}

function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function drainPassageQueue() {
  while (passageQueue.active < 3 && passageQueue.pending.length) {
    const job = passageQueue.pending.shift();
    passageQueue.active += 1;
    job.task().then(job.resolve).catch(job.reject).finally(() => {
      passageQueue.active -= 1;
      drainPassageQueue();
    });
  }
}

async function requestPassage(url) {
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetchWithTimeout(url, { cache: 'no-store' });
    if (response.ok) return response.json();
    if (response.status !== 429 && response.status < 500) break;
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }
  throw new Error(`YouVersion could not load this passage (${response?.status || 'network error'}).`);
}
function populateVersionSelectors() {
  document.querySelectorAll('.alternate-cell select').forEach((select) => {
    const previous = select.value;
    select.innerHTML = versionOptionsMarkup();
    if ([...select.options].some((option) => option.value === previous)) select.value = previous;
    else if (licensedEnglishVersions().length) select.value = youVersionKey(licensedEnglishVersions()[0]);
    const verse = verses.find((item) => item.n === Number(select.dataset.verse));
    const container = document.querySelector(`[data-alt-content="${verse.n}"]`);
    container.innerHTML = alternateMarkup(verse, select.value);
  });
  observeVisiblePassages();
}

function observeVisiblePassages() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const select = entry.target.querySelector('.alternate-cell select');
      if (select && select.value.startsWith('YV_') && !select.dataset.loaded) {
        select.dataset.loaded = 'true';
        updateAlternate(select);
      }
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '250px 0px' });
  document.querySelectorAll('.verse-row').forEach((row) => observer.observe(row));
}

async function getYouVersionCatalog() {
  if (youVersionState.catalog) return youVersionState.catalog;
  if (!youVersionState.loading) {
    youVersionState.loading = fetchWithTimeout(`${YV_API_BASE}/bibles`)
      .then((response) => {
        if (!response.ok) throw new Error(`Version list returned ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        youVersionState.catalog = Array.isArray(payload.data) ? payload.data : [];
        return youVersionState.catalog;
      })
      .catch((error) => {
        youVersionState.error = error;
        youVersionState.catalog = [];
        throw error;
      })
      .finally(() => { youVersionState.loading = null; });
  }
  return youVersionState.loading;
}

async function getYouVersionPassage(verse, versionKey) {
  await getYouVersionCatalog();
  const version = youVersionState.byKey.get(versionKey);
  if (!version) throw new Error('This English version is not available to the YouVersion app.');

  const passageId = `ISA.1.${verse.n}`;
  const passage = await queuePassageRequest(() => requestPassage(`${YV_API_BASE}/passage?versionId=${encodeURIComponent(version.id)}&passage=${encodeURIComponent(passageId)}&format=html`));
  return { content: passage.content || passage.html || '', attribution: version.copyright || version.promotional_content || `${version.title} (${version.abbreviation})` };
}

function linkedRef(label, ref) { return `<a class="ref-link" href="${scriptureUrl(ref)}" target="_blank" rel="noreferrer">${label}</a>`; }
function tokens(words) { return words.map(([word, gloss]) => `<span class="token" data-gloss="${gloss}">${word}</span>`).join(' '); }
function talkLinks(keys) { return keys.map((key) => `<a href="${talks[key].url}" target="_blank" rel="noreferrer">${talks[key].label}</a>`).join(''); }
function attributionMarkup(attribution) { return `<span class="attribution-info" tabindex="0" aria-label="Show copyright information"><span aria-hidden="true">ⓘ</span><span class="attribution-tooltip" role="tooltip">${escapeHtml(attribution)}</span></span>`; }

function alternateMarkup(verse, version = 'NLT') {
  if (version === 'GREEK') return `<div class="alt-content"><div class="license-note"><strong>Greek · Septuagint study anchors</strong>Hover individual words for a compact English gloss.</div><div class="lexical-block greek"><div class="lexical-label">Key Greek words</div><div class="lexical-text">${tokens(verse.greek)}</div></div></div>`;
  if (version === 'HEBREW') return `<div class="alt-content"><div class="license-note"><strong>Hebrew · Masoretic text anchors</strong>Hover individual words for a compact English gloss.</div><div class="lexical-block"><div class="lexical-label">Key Hebrew words</div><div class="lexical-text">${tokens(verse.hebrew)}</div></div></div>`;
  const v = youVersionState.byKey.get(version);
  const label = v ? youVersionLabel(v) : 'Licensed English version';
  const readUrl = v ? `https://www.bible.com/bible/${encodeURIComponent(v.id)}/ISA.1` : '#';
  return `<div class="alt-content"><div class="license-note"><strong>${escapeHtml(label)}</strong>YouVersion text will load through the protected proxy. Attribution is displayed from the version metadata.</div><div class="lexical-block"><div class="lexical-label">Reading link</div><a class="alt-link" href="${readUrl}" target="_blank" rel="noreferrer">Open Isaiah 1 in YouVersion ↗</a></div></div>`;
}

function rowMarkup(verse) {
  const refs = verse.refs.map(([label, ref]) => linkedRef(label, ref)).join('');
  return `<article class="verse-row">
    <div class="verse-num">${String(verse.n).padStart(2,'0')}</div>
    <div><div class="kjv-text">${verse.text}</div></div>
    <div class="alternate-cell"><div class="alt-control"><label class="sr-only" for="version-${verse.n}">English version or study text for Isaiah 1:${verse.n}</label><select id="version-${verse.n}" data-verse="${verse.n}" aria-label="English version or study text for Isaiah 1:${verse.n}">${versionOptionsMarkup()}</select><a class="alt-link" data-alt-link="${verse.n}" href="#" target="_blank" rel="noreferrer">read ↗</a></div><div data-alt-content="${verse.n}">${alternateMarkup(verse, 'GREEK')}</div></div>
    <div><div class="ref-cluster">${refs}</div><p class="commentary-copy"><strong>Commentary.</strong> ${verse.commentary}</p>${verse.barker ? `<div class="barker-note"><span>Temple theology lens</span>${verse.barker}</div>` : ''}<div class="talk-list"><div class="lexical-label">Related teaching</div>${talkLinks(verse.talks)}</div></div>
  </article>`;
}

const verseList = document.querySelector('#verseList');
verseList.innerHTML = verses.map(rowMarkup).join('');

function updateAlternate(select) {
  const verse = verses.find((item) => item.n === Number(select.dataset.verse));
  const container = document.querySelector(`[data-alt-content="${verse.n}"]`);
  const link = document.querySelector(`[data-alt-link="${verse.n}"]`);
  container.innerHTML = alternateMarkup(verse, select.value);
  if (['GREEK','HEBREW'].includes(select.value)) { link.textContent = 'study note'; link.href = 'https://www.churchofjesuschrist.org/study/scriptures/ot/isa/1?lang=eng'; }
  else {
    const version = youVersionState.byKey.get(select.value);
    if (!version) {
      link.textContent = 'read ↗';
      link.removeAttribute('href');
      return;
    }
    const label = youVersionLabel(version);
    link.textContent = 'read ↗';
    link.href = `https://www.bible.com/bible/${encodeURIComponent(version.id)}/ISA.1`;
    const loading = document.querySelector(`[data-alt-content="${verse.n}"] .license-note`);
    if (loading) loading.innerHTML = `<strong>${escapeHtml(label)}</strong>Loading licensed text from YouVersion…`;
    getYouVersionPassage(verse, select.value).then(({ content, attribution }) => {
      container.innerHTML = `<div class="alt-content yv-alt-content"><div class="yv-content" data-yv-sdk data-slot="yv-bible-renderer">${content}</div><div class="yv-attribution">${attributionMarkup(attribution)}</div></div>`;
    }).catch((error) => {
      delete select.dataset.loaded;
      container.innerHTML = `<div class="alt-content"><div class="license-note"><strong>YouVersion unavailable</strong>${escapeHtml(error.message)}</div><div class="lexical-block"><div class="lexical-label">Reading link</div><a class="alt-link" href="https://www.bible.com/bible/${encodeURIComponent(version.id)}/ISA.1" target="_blank" rel="noreferrer">Open Isaiah 1 in ${escapeHtml(label)} ↗</a></div></div>`;
    });
  }
}

document.querySelectorAll('.alternate-cell select').forEach((select) => select.addEventListener('change', () => {
  select.dataset.loaded = 'true';
  updateAlternate(select);
}));
getYouVersionCatalog().then(populateVersionSelectors).catch(() => populateVersionSelectors());
