/* automatic conversion from sosi.h - TODO convert to single json object */
var sositypes = {
    "ADM_GRENSE": ["administrativGrense", "String"],
    "ADRESSE": ["adresse", "String"],
    "ADRESSEREFKODE": ["adresseReferansekode", "String"],
    "AJOURFØRTAV": ["ajourførtAv", "String"],
    "AJOURFØRTDATO": ["ajourførtDato", "Date"],
    "DATO": ["Dato", "Date"],
    "AKGEOLTEMA": ["annetKvTema", "Integer"],
    "AKVA_ART": ["akvaArt", "Integer"],
    "AKVA_ENHET": ["akvaEnhet", "Integer"],
    "AKVA_KONSTR": ["akvaKonstruksjon", "Integer"],
    "AKVA_NR": ["akvaKonsesjonsnummer", "Integer"],
    "AKVA_STATUS": ["akvaKonsesjonsstatus", "String"],
    "AKVA_TYPE": ["akvaKonsesjonstype", "String"],
    "AKVAKONSESJONSFORMÅL": ["akvaKonsesjonsformål", "String"],
    "AKVATEMP": ["akvaTemperatur", "Integer"],
    "AKVSYMBOL": ["andreKvSymbol", "Integer"],
    "ALDERBESKRIVELSE": ["alderBeskrivelse", "String"],
    "ALGE_KONS": ["algeKonsentrasjon", "Integer"],
    "ALGE_TYP": ["algeType", "String"],
    "ALM-TYP": ["allmenningtype", "String"],
    "ALT_AREALBYGNING": ["alternativtArealBygning", "Real"],
    "ALTERN_FNR": ["altForekomstNr", "String"],
    "ALTERNATIVTNAVN": ["alternativtNavn", "String"],
    "ANBELINTYP": ["annenBergartLinjetype", "Integer"],
    "ANDREKILDERBELASTNING": ["andrekilderBelastning", "Integer"],
    "ANKRINGSBRUK": ["ankringsbruk", "Integer"],
    "ANKRTYP": ["ankringstype", "Integer"],
    "ANLEGGNØDSTRØM": ["anleggNødstrøm", "String"],
    "ANLEGGSNUMMER": ["anleggsnummer", "String"],
    "ANNEN_VANNB_ELEK": ["annenVannbehandlingAvhElektrisitet", "String"],
    "ANNENLUFTHAVN": ["annenLufthavn", "Integer"],
    "ANNENMATRENHET": ["annenMatrEnhet", "String"],
    "ANT_ANALYS": ["antallAnalyser", "Integer"],
    "ANT_ANS": ["antallAnsatte", "Integer"],
    "ANT_ÅRSV": ["antallÅrsverk", "Integer"],
    "ANTALL_BAD": ["antallBad", "Integer"],
    "ANTALL_BOENHETER": ["antallBoenheter", "Integer"],
    "ANTALL_ETASJER": ["antall etasjer", "Integer"],
    "ANTALL_ROM": ["antallRom", "Integer"],
    "ANTALL_RØKLØP": ["antallRøkløp", "Real"],
    "ANTALL_WC": ["antallWC", "Integer"],
    "ANTALLFASTBOENDE": ["antallFastboende", "Integer"],
    "ANTALLFRITIDSBOLIGER": ["antallFritidsboliger", "Integer"],
    "ANTALLIDENTISKELYS": ["antallIdentiskeLys", "Integer"],
    "ANTALLSKISPOR": ["antallSkispor", "Integer"],
    "ANTALLSKORSTEINER": ["antallSkorsteiner", "Integer"],
    "ANTDRIFT": ["landbruksregAntBedrifter", "Integer"],
    "ARAVGRTYPE": ["arealressursAvgrensingType", "Integer"],
    "ARDYRKING": ["arealressursDyrkbarjord", "Integer"],
    "AREAL": ["areal", "Real"],
    "AREALBRUK_RESTR": ["arealbrukRestriksjon", "Integer"],
    "AREALENHET": ["arealenhet", "String"],
    "AREALINNSJØ": ["arealInnsjø", "Real"],
    "AREALKILDE": ["arealkilde", "Integer"],
    "AREALMERKNAD": ["arealmerknad", "String"],
    "AREALNEDBØRFELT": ["arealNedbørfelt", "String"],
    "AREALREGINE": ["arealRegine", "Real"],
    "AREALST": ["arealbruksstatus", "Integer"],
    "AREALVERDI_IND": ["arealverdiindikator", "String"],
    "ARENKEL": ["arealressursGruppertEnkel", "Integer"],
    "ARGRUNNF": ["arealressursGrunnforhold", "Integer"],
    "ARKARTSTD": ["arealressursKartstandard", "String"],
    "ARNFJBRUK": ["arealressursNaturgrunnlagForJordbruk", "Integer"],
    "ARSKOGBON": ["arealressursSkogbonitet", "Integer"],
    "ART_ENGELSK": ["engelskArtsnavn", "String"],
    "ART_LATIN": ["vitenskapeligArtsnavn", "String"],
    "ART_NORSK": ["norskArtsnavn", "String"],
    "ART_TAKSONOMI": ["taksonomiskKode", "Integer"],
    "ARTRESLAG": ["arealressursTreslag", "Integer"],
    "ARTYPE": ["arealressursArealtype", "Integer"],
    "ARUTETYPE": ["annenRutetype", "String"],
    "ARVANLIG": ["arealressursGruppertVanlig", "Integer"],
    "ARVEGET": ["arealressursVegetasjonsdekke", "Integer"],
    "ASKOG": ["potensiellSkogbonitet", "Integer"],
    "ATIL": ["arealtilstand", "Integer"],
    "AVFALLSDEP": ["avfallDeponiEgnethet", "Integer"],
    "AVFALLTYPE": ["avfallType", "Integer"],
    "AVGIFTSBELAGT": ["avgiftsbelagt", "String"],
    "AVGJDATO": ["avgjørelsesdato", "Date"],
    "AVGRENSNINGSTYPE": ["avgrensningstype", "Integer"],
    "AVKJ": ["avkjørselsbestemmelse", "Integer"],
    "AVKLARTEIERE": ["avklartEiere", "String"],
    "AVLØP": ["avløp", "Integer"],
    "AVLØP_TILKNYTNING": ["tilknyttetKommunaltAvløp", "String"],
    "AVLØPINNSJØ": ["avløpInnsjø", "Real"],
    "AVLØPRENSEPRINSIPP": ["avløpRenseprinsipp", "String"],
    "AVLØPSANLEGGEIERFORM": ["avløpsanleggEierform", "Integer"],
    "AVLØPSANLEGGTYPE": ["avløpsanleggtype", "Integer"],
    "AVSETNING": ["avsetningstype", "Integer"],
    "AVSETNRATE": ["avsetnRate", "String"],
    "BAKKEOPPLØSNING": ["bakkeoppløsning", "Real"],
    "BARMARKSLØYPETYPE": ["barmarksløypeType", "String"],
    "BEALDERBST": ["bergartAlderBestemmelse", "String"],
    "BEBYGD_AREAL": ["bebygdAreal", "Real"],
    "BEFARGEKO": ["cmykFargekode", "String"],
    "BEHSTAT": ["behandlingsstatus", "Integer"],
    "BEITEBRUKERID": ["reinbeitebrukerID", "String"],
    "BEITETID": ["beitetid", "String"],
    "BEITETIDVEDTAK": ["beitetidVedtak", "String"],
    "BEKJSAMSET": ["bergartKjemiskSammensetning", "String"],
    "BEKORNSTR": ["bergartKornstørrelse", "String"],
    "BELIGG": ["omgivelsetypeTraséseksjon", "Integer"],
    "BELIGGENHET": ["beliggenhet", "String"],
    "BELYSNING": ["belysning", "String"],
    "BEREGNET": ["beregningsDato", "Date"],
    "BEREGNETÅR": ["beregnetÅr", "String"],
    "BERGFARGE": ["bergartFarge", "String"],
    "BERGGRENSETYPE": ["berggrunnGrensetype", "Integer"],
    "BESK_ELEMENT": ["beskrivelseElement", "String"],
    "BESKRIV": ["tiltaksbeskrivelse", "String"],
    "BESKRIVELSE": ["beskrivelse", "String"],
    "BESTEMMELSEOMRNAVN": ["bestemmelseOmrådeNavn", "String"],
    "BESTRUKTUR": ["bergartStruktur", "String"],
    "BESYMBOLTY": ["bergartSymbol", "Integer"],
    "BETEKSTUR": ["bergartTekstur", "String"],
    "BETJENINGSGRAD": ["betjeningsgrad", "String"],
    "BILDE-BIT-PIXEL": ["bitsPerPixel", "Integer"],
    "BILDE-FIL": ["bildeFil", "String"],
    "PLANPÅSKRIFTTYPE": ["planpåskriftype", "Integer"],
    "BILDEKATEGORI": ["bildekategori", "Integer"],
    "BILDEMÅLESTOKK": ["bildemålestokk", "Integer"],
    "BILDENUMMER": ["bildenummer", "Integer"],
    "BILDE-SYS": ["bildeSystem", "Integer"],
    "BILDE-TYPE": ["bildeType", "String"],
    "BILDE-UNDERTYPE": ["bildeUndertype", "String"],
    "BISPENUMMER": ["bispenummer", "Integer"],
    "BKLASSIFIK": ["berggrunnKlassifikasjon", "Integer"],
    "BLOKK": ["steinOgBlokk", "String"],
    "BLOKKAREAL": ["blokkareal", "Real"],
    "BMANDEL": ["bmAndel", "Integer"],
    "BMANTALL": ["bmAntall", "Integer"],
    "BMARSTID": ["bmÅrstid", "Integer"],
    "BMART": ["bmArt", "String"],
    "BMENHET": ["bmEnhet", "Integer"],
    "BMFUNK": ["bmOmrådefunksjon", "Integer"],
    "BMFUNKVAL": ["bmFunksjonskvalitet", "Integer"],
    "BMKILDTYP": ["bmKildetype", "Integer"],
    "BMKILDVURD": ["bmKildevurdering", "Integer"],
    "BMNATYP": ["bmNaturtype", "String"],
    "BMNATYPMARIN": ["bmNaturtypeMarin", "String"],
    "BMNATYPMARINUTF": ["bmNaturtypeMarinUtforming", "String"],
    "BMNATYPUTF": ["bmNaturtypeUtforming", "String"],
    "BMREGDATO": ["bmRegistreringsdato", "Date"],
    "BMTRUETKAT": ["bmTruethetskategori", "String"],
    "BMVERDI": ["bmVerdi", "String"],
    "BMVILTVEKT": ["bmViltvekt", "Integer"],
    "BNR": ["bruksnummer", "Integer"],
    "BOKST": ["bokstav", "String"],
    "BOLTTYPE": ["boltType", "Integer"],
    "BOREDAGER": ["antallBoredager", "Integer"],
    "BOREDATO": ["boredato", "Date"],
    "BOREDYP": ["boredyp", "Real"],
    "BOREFIRMA": ["borefirma", "String"],
    "BOREINNRETN": ["boreinnretningsnavn", "String"],
    "BORESLUTT": ["boreslutt", "Date"],
    "BORESTART": ["borestart", "Date"],
    "BORETYPE": ["boringType", "Integer"],
    "BORHELNING": ["gfborehHelning", "Integer"],
    "BORHULLNR": ["borhullNummer", "String"],
    "BORLENGDE": ["gfborehLengde", "Real"],
    "BORRETNING": ["gfborehRetning", "Integer"],
    "BOT_OK_INT": ["botaniskØkologiskInteresse", "String"],
    "BRANSJE": ["bransje", "String"],
    "BREDDE": ["trasébredde", "Integer"],
    "BRENNVIDDE": ["brennvidde", "Real"],
    "BRENSELTANKNEDGR": ["brenseltankNedgravd", "Integer"],
    "BRETYPE": ["bretype", "Integer"],
    "BRUDDLENGDE": ["bruddlengde", "Real"],
    "BRUEIER": ["brueier", "String"],
    "BRUK_GRAD": ["kulturlandskapBrukGrad", "String"],
    "BRUKONSTRTYPE": ["brukonstruksjonstype", "String"],
    "BRUKSAREAL": ["bruksareal", "Real"],
    "BRUKSAREALANNET": ["bruksarealTilAnnet", "Real"],
    "BRUKSAREALBOLIG": ["bruksarealTilBolig", "Real"],
    "BRUKSAREALTOTALT": ["bruksarealTotalt", "Real"],
    "BRUKSENHETSTYPE": ["bruksenhetstype", "String"],
    "BRUKSFREKVENS": ["friluftsområdeBruksfrekvens", "Integer"],
    "BRUKSNAVN": ["bruksnavn", "String"],
    "BRUMATERIAL": ["brumaterial", "String"],
    "BRUOVERBRU": ["bruOverBru", "String"],
    "BRUTRAFIKKTYPE": ["brutrafikktype", "String"],
    "BRUÅPNING": ["bruåpningsmåte", "String"],
    "BRØNN_REGNR": ["brønnRegNr", "Integer"],
    "BRØNN_RESULTAT": ["brønnresultat", "String"],
    "BRØNNKLASSE": ["petroleumsbrønnklasse", "String"],
    "BRØNNTYPE": ["petroleumsbrønntype", "String"],
    "BRØYTEAREALTILGANG": ["brøytearealtilgang", "Integer"],
    "BRØYTEAREALTYPE": ["brøytearealtype", "Integer"],
    "BRØYTEBREDDE": ["brøytebredde", "Integer"],
    "BRØYTEPRIORITET": ["brøyteprioritet", "String"],
    "BRØYTERESTRIKSJON": ["brøyterestriksjon", "String"],
    "BRØYTESIDE": ["brøyteside", "String"],
    "BRØYTETYPE": ["brøytetype", "String"],
    "BUNNTYP": ["bunntype", "String"],
    "BUNNTYPE": ["bunntype", "Integer"],
    "BYDELSNAVN": ["bydelsnavn", "String"],
    "BYDELSNUMMER": ["bydelsnummer", "Integer"],
    "BYGGHØYDEIMETER": ["bygghøydeIMeter", "Integer"],
    "BYGGNR": ["bygningsnummer", "Integer"],
    "BYGGSTAT": ["bygningsstatus", "String"],
    "BYGGTYP_NBR": ["bygningstype", "Integer"],
    "BYGGVERK": ["byggverkbestemmelse", "Integer"],
    "BYGN_ENDR_KODE": ["bygningsendringskode", "String"],
    "BYGN_ENDR_LØPENR": ["endringsløpenummer", "Integer"],
    "BYGN_HIST_DATO": ["bygningshistorikkDato", "Date"],
    "BYGN_REF_TYPE": ["bygningReferansetype", "String"],
    "BYGN_SAKSNR": ["bygnSaksnr", "String"],
    "BYGNINGSFUNKSJON": ["bygningsfunksjon", "Integer"],
    "BÆREEVNEBENEVNELSE": ["bæreevnebenevnelse", "String"],
    "BØYE_FORM": ["bøyeform", "Integer"],
    "BÅNDLAGTFREMTIL": ["båndlagtFremTil", "Date"],
    "CLEIER": ["CL_Eier", "String"],
    "D": ["dybde", "Integer"],
    "DA_ANNET": ["landbruksregArealAnnet", "Integer"],
    "DA_JORD_D": ["landbruksregArealJordIDrift", "Real"],
    "DA_JORD_E": ["landbruksregArealJordbruk", "Integer"],
    "DA_SKOG": ["landbruksregArealSkog", "Integer"],
    "DAMFORMÅL": ["damFormål", "String"],
    "DAMFUNKSJON": ["damFunksjon", "Integer"],
    "DAMLENGDE": ["damLengde", "Real"],
    "DAMTYPE": ["damType", "String"],
    "DATAFANGSTDATO": ["datafangstdato", "Date"],
    "DATAUTTAKSDATO": ["datauttaksdato", "Date"],
    "DATERMETOD": ["dateringMetode", "Integer"],
    "DATUM": ["datum", "String"],
    "DEFORMASJONFASE": ["deformasjonFase", "Integer"],
    "DEKKENAVN": ["dekkeEnhetNavn", "String"],
    "DEKKETYPE": ["dekketype", "String"],
    "DEKNINGSNUMMER": ["dekningsnummer", "String"],
    "DEL_BRED": ["posisjonBredde", "Integer"],
    "DEL_DYBD": ["posisjonDybde", "Integer"],
    "DELOMRÅDENAVN": ["delområdenavn", "String"],
    "DELOMRÅDENUMMER": ["delområdenummer", "String"],
    "DELSTREKNINGSNUMMER": ["delstrekningsnummer", "String"],
    "DEPONISTATUS": ["deponistatus", "Integer"],
    "DEPONITYPE": ["deponitype", "Integer"],
    "DESINFANLAVHELEK": ["desinfAnleggAvhElektrisitet", "String"],
    "DIGITALISERINGSMÅLESTOKK": ["digitaliseringsmålestokk", "Integer"],
    "DIM-BREDDE": ["tekstTegnBredde", "Real"],
    "DIM-HØYDE": ["tekstTegnHøyde", "Real"],
    "DISTKODE": ["reinbeitedistriktID", "String"],
    "DK_MANDEL": ["dyrkningspotensialMandel", "Integer"],
    "DK_MANDEL_A": ["nedklassifiseringMandel", "Integer"],
    "DK_NEDBOR": ["nedbørsbasert", "Integer"],
    "DK_NEDBOR_A": ["nedklassifiseringNedbør", "Integer"],
    "DK_VANN": ["vanningsbasert", "Integer"],
    "DK_VANN_A": ["nedklassifiseringVanning", "Integer"],
    "DOKUMENTASJONSTYPE": ["dokumentasjonType", "Integer"],
    "D-REF-INT": ["vertikalReferanseInternasjonalDybde", "Integer"],
    "DRIFTFHOLD": ["driftForhold", "Integer"],
    "DRIFTMETOD": ["driftMetode", "Integer"],
    "DRSENTER": ["jordregisterDriftssenter", "Integer"],
    "DYBDE": ["dybde", "Real"],
    "DYBDE_MAX": ["maximumsdybde", "Real"],
    "DYBDE_MIN": ["minimumsdybde", "Real"],
    "DYBDEFJELL": ["dybdeTilFjell", "Real"],
    "DYBDEKVIKKLEIRE": ["dybdeTilKvikkleire", "Real"],
    "DYBDEMÅLEMETODE": ["dybemålemetode", "Integer"],
    "DYBDE-REF": ["dybdeReferanse", "String"],
    "DYBDETYPE": ["dybdetype", "Integer"],
    "DYPMIDDEL": ["dypMiddel", "Integer"],
    "DYPSTØRSTMÅLT": ["dypStørstMålt", "Integer"],
    "SERIENUMMER": ["serienummer", "String"],
    "DYRKING": ["jordregisterDyrkingsjord", "String"],
    "EIER": ["geodataeier", "String"],
    "EIERFORHOLD": ["eierforhold", "String"],
    "EIERFORM": ["eierformType", "Integer"],
    "EKOORD-H": ["jordregisterKoordinatHøyde", "Integer"],
    "EKOORD-N": ["jordregisterKoordinatNord", "Integer"],
    "EKOORD-Ø": ["jordregisterKoordinatØst", "Integer"],
    "ENDRET_TID": ["tidspunktEndring", "Date"],
    "ENDRET_TYPE": ["typeEndring", "String"],
    "ENDRINGSGRAD": ["endringsgrad", "String"],
    "ENERGIKILDE": ["energikilde", "String"],
    "ENHET": ["enhet", "Real"],
    "ENHET-D": ["enhetDybde", "Real"],
    "ENHET-H": ["enhetHøyde", "Real"],
    "EROSJONGS": ["erosjonsrisikoGrasdekke", "Integer"],
    "EROSJONHP": ["erosjonsrisikoHøstpløying", "Integer"],
    "ETABLERINGSDATO": ["etableringsdato", "Date"],
    "ETABLERT": ["fastmerkeEtableringsdato", "Date"],
    "ETASJENUMMER": ["etasjenummer", "Integer"],
    "ETASJEPLAN": ["etasjeplan", "String"],
    "ETASJETALL": ["etasjetall", "String"],
    "ETAT": ["etat", "String"],
    "F_TYPE": ["fiskeType", "Integer"],
    "FAGOMRÅD": ["ledningsfagområde", "Integer"],
    "FALLHØYDE": ["fallHøyde", "Real"],
    "FAO_KODE": ["faoKode", "String"],
    "FARTØY_ID": ["fartøyIdentifikasjon", "String"],
    "FASADE": ["fasade", "Integer"],
    "FBNAVN": ["fiskebedriftsnavn", "String"],
    "FBNR": ["fiskebruksnummer", "Integer"],
    "FBNR_FYLK": ["fiskebruksnummerFylke", "String"],
    "FELTNAVN": ["feltbetegnelse", "String"],
    "FELTREGISTRERTAV": ["feltegistrertAv", "String"],
    "FIGF_ID": ["figurFørSkifteIdent", "Integer"],
    "FILM": ["film", "String"],
    "FIRMA": ["firmanavn", "String"],
    "FISK_KODE": ["artskode", "Integer"],
    "FISKE_BEDR_ANDEL": ["fiskebedriftsandel", "Integer"],
    "FISKE_BEDR_EIER": ["fiskebedriftseier", "String"],
    "FISKE_BEDR_OMR": ["fiskebedriftsområde", "Integer"],
    "FISKE_BEDR_PROD": ["fiskebedriftsprodukt", "Integer"],
    "FISKE_BEDR_SERVICE": ["fiskebedriftservice", "Integer"],
    "FISKE_KAP_ENH": ["fiskekapasitetEnhet", "Integer"],
    "FISKE_KAPASITET": ["fiskekapasitet", "Integer"],
    "FISKE_TYPE": ["fisketype", "Integer"],
    "FISKERI_BRUK_TYPE": ["fiskeribrukstype", "Integer"],
    "FISKERI_RESS_TYPE": ["fiskeriressursOmrådetype", "Integer"],
    "FISKERIREDSKAP_GEN_AKTIV": ["fiskeriredskapGenAktiv", "Integer"],
    "FISKERIREDSKAP_GEN_PASSIV": ["fiskeriredskapGenPassiv", "Integer"],
    "FISKERIREDSKAP_SPES_AKTIV": ["fiskeriredskapSpesAktiv", "Integer"],
    "FISKERIREDSKAP_SPES_PASSIV": ["fiskeriredskapSpesPassiv", "Integer"],
    "FJELL": ["fjellblotninger", "Integer"],
    "FJORDID": ["fjordidentifikasjon", "String"],
    "FLODBOLGEHOYDE": ["flodbolgehoyde", "Integer"],
    "FLOMLAVPUNKT": ["flomLavPunkt", "Real"],
    "FLYFIRMA": ["flyfirma", "String"],
    "FLYHØYDE": ["flyhøyde", "Integer"],
    "FLYRESTR": ["flyRestriksjon", "Integer"],
    "FMADKOMST": ["fastmerkeAdkomst", "String"],
    "FMDIM": ["fastmerkeDiameter", "Integer"],
    "FMHREF": ["fastmerkeHøyderef", "String"],
    "FMIDDATO": ["fastmerkeIdDato", "Date"],
    "FMIDGML": ["fastmerkeIdGammel", "String"],
    "FMINST": ["fastmerkeInstitusjon", "String"],
    "FMKOMM": ["fastmerkeKommune", "Integer"],
    "FMMERK": ["fastmerkeMerknader", "String"],
    "FMNAVN": ["fastmerkeNavn", "String"],
    "FMNUMMER": ["fastmerkeNummer", "String"],
    "FMREFBER": ["fastmerkeRefGrunnrisBeregning", "String"],
    "FMREFHBER": ["fastmerkeRefHøydeBeregning", "String"],
    "FMRESTR": ["fastmerkeRestriksjon", "String"],
    "FMSREF": ["fastmerkeSentrumRef", "String"],
    "FNR": ["festenummer", "Integer"],
    "FONTENE_TYPE": ["fontenetype", "Integer"],
    "FOREKNAVN": ["navnRastoffobj", "String"],
    "FOREKOM_ID": ["identRastoffobj", "Integer"],
    "FORHOLDANDREHUS": ["forholdAndreHus", "String"],
    "FORHÅNDSTALL": ["forhåndstall", "Integer"],
    "FORLENGET_DATO": ["forlengetDato", "Date"],
    "FORMASJON": ["formasjonTotalDyp", "String"],
    "FORMELFLATE": ["kvFormFlatetype", "Integer"],
    "FORMELLIN": ["kvFormLinjetype", "Integer"],
    "FORMELPKT": ["kvFormPunkttype", "Integer"],
    "FORMÅLSEKSJON": ["formålSeksjonKode", "String"],
    "FORUR_AREAL": ["forurensetAreal", "Integer"],
    "FORUR_GRUNNTYPE": ["forurensetGrunnType", "Integer"],
    "FORUR_HOVEDGRUPPE": ["forurensningHovedgruppe", "Integer"],
    "FORV_MYND": ["forvaltningMyndighet", "String"],
    "FORV_PLAN": ["forvaltningPlan", "Integer"],
    "FOSSILTYPE": ["fossilNavn", "String"],
    "FOTODATO": ["fotodato", "Date"],
    "FOTOGRAF": ["fotograf", "String"],
    "FOTRUTETYPE": ["fotrutetype", "Integer"],
    "FRASPORNODEKILOMETER": ["fraSpornodeKilometer", "Real"],
    "FRASPORNODETEKST": ["fraSpornodeTekst", "String"],
    "FRASPORNODETYPE": ["fraSpornodeType", "String"],
    "F-REF-INT": ["friseilingReferanseInternasjonal", "Integer"],
    "FREG": ["jordregisterFreg", "Integer"],
    "FRIDRIFTSTILSYN": ["friluftslivsområdeDriftstilsyn", "Integer"],
    "FRIEGNETHET": ["friluftslivsområdeEgnethet", "Integer"],
    "FRIPLANST": ["friluftslivsområdePlanStatus", "Integer"],
    "FRISEILHØYDE": ["friseilingshøyde", "Real"],
    "FRISEIL-REF": ["frilseilingReferanse", "String"],
    "FRISIKRING": ["friluftslivSikring", "Integer"],
    "FRISPERR": ["frisperring", "Integer"],
    "FRISTMATRIKKELFØRINGSKRAV": ["fristMatrikkelføringskrav", "Date"],
    "FRISTOPPMÅLING": ["fristOppmåling", "Date"],
    "FRITILRETTELEGGING": ["friluftslivsområdeTilrettelegging", "Integer"],
    "FRITYPE": ["friluftslivsområdeType", "String"],
    "FRIVERDI": ["friluftslivsområdeVerdi", "String"],
    "F-STRENG": ["formatertStreng", "String"],
    "FUNDAMENTERING": ["fundamentering", "Integer"],
    "FYDELTEMA": ["fylkesdeltema", "Integer"],
    "FYLKESNR": ["fylkesnummer", "Integer"],
    "FYRLISTEKARAKTER": ["fyrlisteKarakter", "String"],
    "FYRLISTENUMMER": ["fyrlistenummer", "String"],
    "FYSENHET": ["fysiskEnhet", "Integer"],
    "FYSISKMILJØ": ["fysiskMiljø", "Integer"],
    "FYSPARAM": ["fysiskParameter", "Integer"],
    "FYSSTR": ["fysiskStorrelse", "Real"],
    "FØLGER_TERRENGDET": ["følgerTerrengdetalj", "String"],
    "FØRSTEDATAFANGSTDATO": ["førsteDatafangstdato", "Date"],
    "FØRSTEDIGITALISERINGSDATO": ["førsteDigitaliseringsdato", "Date"],
    "GARDIDNR": ["landbruksregProdusentId", "Integer"],
    "GATENAVN": ["gatenavn", "String"],
    "GATENR": ["gatenummer", "Integer"],
    "GENRESTR": ["generellrestriksjon", "Integer"],
    "GEOALDER": ["geolAlder", "Integer"],
    "GEOALDER_FRA": ["geolMaksAlder", "Integer"],
    "GEOALDER_TIL": ["geolMinAlder", "Integer"],
    "GEOBESK": ["geolBeskrivelse", "String"],
    "GEO-DATUM": ["geoDatumInternasjonal", "Integer"],
    "GEOFELTNR": ["geologFeltnummer", "String"],
    "GEOFORMASJ": ["geolFormasjonNavn", "String"],
    "GEOGRUPPE": ["geolGruppeNavn", "String"],
    "GEOHOVERDI": ["geolHorisontalverdi", "Integer"],
    "GEOKARTNR": ["geolKartnummer", "Integer"],
    "GEOKOORD": ["geoKoordinatverdiEnhet", "Integer"],
    "GEOLOKNR": ["geolLokalitetnummer", "Real"],
    "GEO-PROJ": ["geoProjeksjon", "Integer"],
    "GEOPÅVISNINGTYPE": ["geolPavisningtype", "Integer"],
    "GEOSITENO": ["geositeNummer", "Integer"],
    "GEO-SONE": ["geoSoneProjeksjon", "Integer"],
    "GEOVERDIVURD": ["geolVerdivurdering", "Integer"],
    "GEOVEVERDI": ["geolVertikalverdi", "Integer"],
    "GFANOMALI": ["geofAnomali", "Integer"],
    "GFDYPSTR": ["geofDyp", "Real"],
    "GFDYPTYPE": ["geofDyptype", "Integer"],
    "GFFALLBREGMET": ["geofFallBeregnMetode", "Integer"],
    "GFFALLSTR": ["geofFallstorrelse", "Integer"],
    "GFFLATE": ["geofFlate", "Integer"],
    "GFL_INFO": ["geofLinjeInfo", "Integer"],
    "GFLINJE": ["geofTolkLinjetype", "Integer"],
    "GFMETODE": ["geofMetode", "Integer"],
    "GFP_INFO": ["geofPunktInfo", "Integer"],
    "GFSTROK": ["geofStrokretning", "Integer"],
    "GFTOLK": ["geofTolkMetode", "Integer"],
    "GFUTLLEN": ["geofLengdeUtlegg", "Integer"],
    "GFUTLRETN": ["geofRetningUtlegg", "Integer"],
    "GFUTLTYPE": ["geofTypeUtlegg", "Integer"],
    "GJENNOMFØRINGSFRIST": ["gjennomføringsfrist", "Date"],
    "GJENTAKSINTERVAL": ["gjentaksInterval", "Integer"],
    "GJERDETYPE": ["sikringGjerdetype", "Integer"],
    "GKEKSTRAKT": ["geokEkstrakt", "Integer"],
    "GKENHET": ["geokEnhet", "Integer"],
    "GKFRADYP": ["geokFraDyp", "Integer"],
    "GKFRAKSJON": ["geokFraksjon", "Integer"],
    "GKHORISONT": ["geokHorisont", "Integer"],
    "GKHOVMEDIUM": ["geokHovedmedium", "Integer"],
    "GKMEDIUM": ["geokMedium", "Integer"],
    "GKRETSNAVN": ["grunnkretsnavn", "String"],
    "GKTILDYP": ["geokTilDyp", "Integer"],
    "GKVARIABEL": ["geokVariabel", "String"],
    "GNR": ["gårdsnummer", "Integer"],
    "GR_TYPE": ["grensetypeSjø", "Integer"],
    "GRAVERT": ["gravertTekst", "String"],
    "GRDANNELSE": ["grotteDannelse", "Integer"],
    "GRDIMSJOND": ["grotteDimDiameter", "Integer"],
    "GRDIMSJONH": ["grotteDimHoyre", "Integer"],
    "GRDIMSJONO": ["grotteDimOver", "Integer"],
    "GRDIMSJONU": ["grotteDimUnder", "Integer"],
    "GRDIMSJONV": ["grotteDimVenstre", "Integer"],
    "GRENSEMERKENEDSATTI": ["grensemerkeNedsasttI", "String"],
    "GRENSEPUNKTNUMMER": ["grensepunktnummer", "String"],
    "GRENSEPUNKTTYPE": ["grensepunkttype", "Integer"],
    "GRENSEVEDTAK": ["grenseVedtak", "String"],
    "GRFORMELM": ["grotteFormElement", "Integer"],
    "GRGANGFORM": ["grotteGaForm", "Integer"],
    "GRGANGTYPE": ["grotteGaType", "String"],
    "GRHOYDE": ["grotteHoyde", "Integer"],
    "GRLINTYPE": ["grotteLinjetype", "Integer"],
    "GROTLEGEME": ["grotteLegeme", "String"],
    "GROTNOYAKT": ["grotteNoyaktighet", "String"],
    "GROTTELAST": ["grotteLast", "Integer"],
    "GROTTENAVN": ["grotteNavn", "String"],
    "GROTTEPLAN": ["grottePlan", "String"],
    "GROTTLENKE": ["grotteLenke", "Integer"],
    "GRPKTTYPE": ["grottePktType", "Integer"],
    "GRPUNKTNR": ["grottePktNummer", "String"],
    "GRUNNBORINGREF": ["grunnBoringReferanse", "String"],
    "GRUNNFHOLD": ["losmGrunnforhold", "Integer"],
    "GRUNNGASS": ["grunnGass", "Integer"],
    "GRUNNKRETS": ["grunnkretsnummer", "Integer"],
    "GRUNNLINJENAVN": ["grunnlinjepunktnavn", "String"],
    "GRUNNLINJENUMMER": ["grunnlinjepunktnummer", "String"],
    "GRUNNRISSREFERANSESPOR": ["grunnrissreferanseSpor", "String"],
    "GRUNNVANN": ["grunnvannPotensiale", "Integer"],
    "GRUNNVERDI": ["grunnVerdi", "Real"],
    "GRVARSEL": ["grotteVarsel", "Integer"],
    "GVAKT_PROS": ["geoVernAktivProsess", "String"],
    "GVAREAL": ["geoVernAreal", "String"],
    "GVDLIKEHOLD": ["geoVernVedlikehold", "String"],
    "GVERNE_ID": ["geoVernObjektId", "Integer"],
    "GVERNETYPE": ["geoVernTematype", "Integer"],
    "GVERNHTYPE": ["geoVernHovedtype", "String"],
    "GVERNKRT_A": ["geoVernAKriterie", "String"],
    "GVERNKRT_B": ["geoVernBKriterie", "String"],
    "GVERNKRT_C": ["geoVernCKriterie", "String"],
    "GVERNVERDI": ["geoVernVerdi", "Integer"],
    "GVGRENSETY": ["geoVernGrensetype", "Integer"],
    "GVHINNHLD": ["geoVernHovInnhold", "String"],
    "GVINNGREP": ["geoVernInngrep", "String"],
    "GVLITTRTUR": ["geoVernLitteratur", "String"],
    "GVOFFNTLGJ": ["geoVernOffentliggjoring", "String"],
    "GVOMR_NAVN": ["geoVernOmrNavn", "String"],
    "GVPROALDER": ["geoVernProsessalder", "Integer"],
    "GVSAKSTATUS": ["geoVernSakStatus", "Integer"],
    "GVSTATUS": ["geoVernType", "Integer"],
    "GVSYSTEM": ["geoVernSystem", "String"],
    "GVTINNHLD": ["geoVernTilleggInnhold", "String"],
    "GVVKT_PROS": ["geoVernViktigProsess", "String"],
    "GYLDIGFRA": ["gyldigFra", "Date"],
    "GYLDIGTIL": ["gyldigTil", "Date"],
    "H": ["høyde", "Integer"],
    "H_EUREF89": ["høydeOverEuref89", "Real"],
    "H_KAT_LANDSK": ["hovedkategoriLandskap", "String"],
    "HAR_HEIS": ["harHeis", "String"],
    "HASTIGHETSENHET": ["hastighetsenhet", "String"],
    "HAVNE_D_ADM": ["havnedistriktadministrasjon", "Integer"],
    "HAVNE_ID": ["havneidentifikasjon", "Integer"],
    "HAVNEAVSNITTNUMMER": ["havneavsnittnummer", "Integer"],
    "HAVNEAVSNITTSTATUS": ["havneavsnittstatus", "String"],
    "HAVNEAVSNITTTYPE": ["havneavsnitttype", "String"],
    "HAVNETERMINALISPSNUMMER": ["havneterminalISPSnummer", "Integer"],
    "HAVNETERMINALNUMMER": ["havneterminalnummer", "Integer"],
    "HAVNETERMINALSTATUS": ["havneterminalstatus", "String"],
    "HAVNETERMINALTYPE": ["havneterminaltype", "String"],
    "HBERGKODE": ["hovedBergKode", "Integer"],
    "HELLING": ["helling", "Integer"],
    "HENDELSE": ["trasénodeHendelsestype", "Integer"],
    "HENSYNSONENAVN": ["hensynSonenavn", "String"],
    "HFLOM": ["vannstandRegHøyestRegistrerte", "Real"],
    "HINDERFLATE_TYPE": ["hinderFlateType", "Integer"],
    "HINDERFLATEPENETRERINGSTYPE": ["hinderflatepenetreringstype", "Integer"],
    "HJELPELINJETYPE": ["hjelpelinjetype", "String"],
    "HJEMMELSGRUNNLAG": ["hjemmelsgrunnlag", "String"],
    "HJULTRYKK": ["hjultrykk", "String"],
    "H-MÅLEMETODE": ["målemetodeHøyde", "Integer"],
    "H-NØYAKTIGHET": ["nøyaktighetHøyde", "Integer"],
    "HOB": ["høydeOverBakken", "Real"],
    "HOLDNINGSKLASSE": ["holdningsklasse", "Integer"],
    "HOR_BÆREKONSTR": ["horisontalBærekonstr", "Integer"],
    "HOVEDPARSELL": ["hovedParsell", "Integer"],
    "HOVEDTEIG": ["hovedteig", "String"],
    "HREF": ["høydereferanse", "String"],
    "H-REF-INT": ["høydeReferanseInternasjonal", "Integer"],
    "HRV": ["vannstandHøyesteRegulert", "Real"],
    "HUSHOLDBELASTNING": ["husholdBelastning", "Integer"],
    "HUSLØPENR": ["husLøpenr", "Integer"],
    "HUSNR": ["husNr", "Integer"],
    "HVANN": ["vannstandHøyestRegistrert", "Real"],
    "HYTTE_ID": ["hytteId", "Integer"],
    "HYTTEEIER": ["hytteeier", "Integer"],
    "HØYDE": ["høyde", "Real"],
    "HØYDE_TIL_NAV": ["høydeTilNavet", "Integer"],
    "HØYDE-REF": ["høyde-Referanse", "String"],
    "HØYDEREFERANSESPOR": ["høydereferanseSpor", "String"],
    "HØYDE-TYPE": ["høydeType", "String"],
    "ID": ["identifikasjon", "String"],
    "IKRAFT": ["ikrafttredelsesdato", "Date"],
    "IMOTOPPMERKETYPE": ["imoToppmerketype", "Integer"],
    "IMP": ["impedimentprosentSkog", "Integer"],
    "INDEKSMIN": ["indeksMineral", "String"],
    "INDIKATOR": ["indikatorFastmerkenummer", "String"],
    "INDUSTRIBELASTNING": ["industriBelastning", "Integer"],
    "INFILT": ["infiltrasjonEvne", "Integer"],
    "INFORMASJON": ["informasjon", "String"],
    "FAGOMRÅDEGRUPPE": ["fagområdegruppe", "String"],
    "FAGOMRÅDE_FULLT_NAVN": ["fagområdets fulle navn", "String"],
    "INON_AVS": ["inngrepsfriSoneAvstand", "Real"],
    "INONSONE": ["inngrepsfrieNaturområderINorgeSone", "String"],
    "INRT_FUNKSJON": ["innretningsfunksjon", "String"],
    "INRT_HOVEDTYPE": ["innretningshovedtype", "String"],
    "INRT_MATR": ["innretningsmaterialtype", "String"],
    "INRT_NAVN": ["innretningsnavn", "String"],
    "INRT_TYPE": ["innretningstype", "String"],
    "INST_EFFEKT": ["installertEffekt", "Integer"],
    "INSTALLASJONSBØYEKATEGORI": ["installasjonsbøyekategori", "Integer"],
    "INSTALLERT_ÅR": ["installertÅr", "Date"],
    "INT_STAT": ["internasjonalStatus", "Integer"],
    "J_LREG": ["jordregisterLreg", "String"],
    "JERNBANEEIER": ["jernbaneeier", "String"],
    "JERNBANETYPE": ["jernbanetype", "String"],
    "JORD": ["jordklassifikasjon", "Integer"],
    "JORDARB": ["anbefaltJordarbeiding", "Integer"],
    "JORDART": ["losmassetype", "Integer"],
    "JREGAREAL": ["jordregisterAreal", "Real"],
    "JREGEKODE": ["jordregisterStatusEiendom", "Integer"],
    "JRFIGNR": ["jordregisterFigurnummer", "Integer"],
    "JSR_AREAL": ["jordskifteArealtilstand", "Integer"],
    "JSVSAK": ["jordskifterettenSaksnummer", "String"],
    "JXAREAL": ["annetareal", "Integer"],
    "KABELTYPE": ["kabeltype", "Integer"],
    "KAI_DYBDE": ["kaiDybde", "Real"],
    "KAI_TYPE": ["kaiTypeInformasjon", "Integer"],
    "KALIBRERINGSRAPPORT": ["kalibreringsrapport", "String"],
    "KAMERATYPE": ["kameratype", "String"],
    "KAPASITETLANGEKJØRETØY": ["kapasitetLangekjøretøy", "Integer"],
    "KAPASITETPERSONBILER": ["kapasitetPersonbiler", "Integer"],
    "KAPASITETPERSONEKVIVALENTER": ["kapasitetPersonekvivalenter", "Integer"],
    "KARDINALMERKETYPE": ["kardinalmerketype", "Integer"],
    "KARTID": ["kartbladindeks", "String"],
    "KARTLEGGINGSETAPPE": ["kartleggingsetappe", "String"],
    "KARTREG": ["kartregistrering", "Integer"],
    "KARTSIGNATUR": ["kartsignatur", "String"],
    "KARTTYPE": ["karttype", "String"],
    "KBISPENR": ["bispedømmenummer", "Integer"],
    "KILDEPRIVATVANNF": ["kildePrivatVannforsyning", "Integer"],
    "KJELLER": ["kjeller", "Integer"],
    "KJERNEOMRÅDESTATUS": ["kjerneområdestatus", "String"],
    "KJØKKENTILGANG": ["kjøkkentilgang", "Integer"],
    "KLASSIFISERING": ["kulturlandskapKlassifisering", "String"],
    "KLOR_FØR_FORBRUK": ["klorKontakttidFørForbruk", "Integer"],
    "KLORO_MAKS": ["klorofyllMaksimum", "Integer"],
    "KLOTPAR": ["klotoideParameter", "Real"],
    "KLOTRAD1": ["klotoideRadius 1", "Real"],
    "KLOTRAD2": ["klotoideRadius 2", "Real"],
    "RUTEVANSKELIGHETSGRAD": ["rutevanskelighetsgrad", "String"],
    "RWY_BÆREEVNE_BEN": ["bæreevnebenevnelse", "String"],
    "RWY_TYPE": ["rullebaneType", "String"],
    "RWYMERK": ["rullebaneoppmerking", "Integer"],
    "RYDDEBREDDE": ["ryddebredde", "Integer"],
    "RØR_ENDE_PKT": ["ledningsendepunkt", "String"],
    "RØR_START_PKT": ["ledningsstartpunkt", "String"],
    "RØRLEDNINGSTYPE": ["rørledningstype", "Integer"],
    "SAK_AVSLUTT": ["sakAvsluttet", "String"],
    "SAKSNR": ["saksnummer", "Integer"],
    "SAKSOMF": ["saksomfang", "Integer"],
    "SAKSTYPE": ["sakstype", "Integer"],
    "SALINITET": ["salinitet", "Integer"],
    "SAT_KOM_ID": ["satellittkommunikasjonsId", "String"],
    "SCANNEROPPLØSNING": ["scanneroppløsning", "Real"],
    "SEDDYBDEME": ["sedDybdeMeter", "Real"],
    "SEDDYBDEMS": ["sedDybdeMillisekund", "Real"],
    "SEDKORNSTR": ["sedKornstorrelse", "Integer"],
    "SEDMEKTME": ["sedMektighetMeter", "Real"],
    "SEDMEKTMS": ["sedMektighetMillisekund", "Real"],
    "SEFRAK_FUNK_KODE": ["sefrakFunksjonsKode", "Integer"],
    "SEFRAK_FUNK_STAT": ["sefrakFunksjonsstatus", "String"],
    "KM_ANTALL": ["kulturminneAntall", "Integer"],
    "KM_BETEGN": ["kulturminneBetegnelse", "String"],
    "KM_DAT": ["kulturminneDatering", "String"],
    "KM_DATKVAL": ["kulturminneDateringKvalitet", "String"],
    "KM_FUNK_NÅ": ["kulturminneNåværendeFunksjon", "String"],
    "KM_FUNK_OP": ["kulturminneOpprinneligFunksjon", "String"],
    "KM_HOVEDGRUPPE": ["kulturminneHovedgruppe", "String"],
    "KM_KATEGORI": ["kulturminneKategori", "String"],
    "KM_MAT": ["kulturminneHovedMateriale", "String"],
    "KM_SYNLIG": ["kulturminneSynlig", "String"],
    "KM_VERNEVERDI": ["kulturminneVerneverdi", "String"],
    "KODDRIFT": ["landbruksregBedriftskode", "Integer"],
    "KOM_KALLSIGNAL": ["komKallSignal", "String"],
    "KOM_KANAL": ["komKanal", "String"],
    "KOMM": ["kommunenummer", "Integer"],
    "KOMM_ALT_AREAL": ["kommAlternativtAreal", "Real"],
    "KOMM_ALT_AREAL2": ["kommAlternativtAreal2", "Real"],
    "KOMMENTAR": ["kommentar", "String"],
    "KOMMENTAR_TYPE": ["kommentarType", "String"],
    "KOMMSEK": ["kommuneSekundær", "Integer"],
    "KOMPONENT": ["komponent", "String"],
    "KONSTA1": ["konstantA1", "Real"],
    "KONSTA2": ["konstantA2", "Real"],
    "KONSTB1": ["konstantB1", "Real"],
    "KONSTB2": ["konstantB2", "Real"],
    "KONSTC1": ["konstantC1", "Real"],
    "KONSTC2": ["konstantC2", "Real"],
    "KONTAKTPERSON": ["kontaktperson", "String"],
    "KOORDKVALKODE": ["koordinatkvalitetKode", "String"],
    "KOPIDATO": ["kopidato", "Date"],
    "KOPL_BRU": ["koplingBruksområde", "String"],
    "KOPL_KAT": ["koplingskategori", "Integer"],
    "KOPL_NAV": ["koplingsnavn", "String"],
    "KOPL_TYP": ["koplingstype", "String"],
    "KORTNAVN": ["kortnavn", "String"],
    "KOSTHOLDART": ["kostholdArt", "String"],
    "KOSTHOLDSRÅDTYPE": ["kostholdsrådType", "Integer"],
    "KP": ["knutePunkt", "Integer"],
    "KPANGITTHENSYN": ["angittHensyn", "Integer"],
    "KPAREALFORMÅL": ["arealformål", "Integer"],
    "KPBÅNDLEGGING": ["båndlegging", "Integer"],
    "KPDETALJERING": ["detaljering", "Integer"],
    "KPFARE": ["fare", "Integer"],
    "KPGJENNOMFØRING": ["gjennomføring", "Integer"],
    "KPINFRASTRUKTUR": ["infrastruktur", "Integer"],
    "KPINFRASTRUKTURLINJE": ["infrastrukturLinje", "Integer"],
    "KPJURLINJE": ["juridisklinje", "Integer"],
    "KPRESTENAVN": ["prestegjeldnavn", "String"],
    "KPRESTENR": ["prestegjeldnummer", "Integer"],
    "KPROSTINAVN": ["prostinavn", "String"],
    "KPROSTINR": ["prostinummer", "Integer"],
    "KPSIKRING": ["sikring", "Integer"],
    "KPSTØY": ["støy", "Integer"],
    "KRAFTVERKTYP": ["kraftverktype", "String"],
    "KRETSNAVN": ["kretsnavn", "String"],
    "KRETSNUMMER": ["kretsnummer", "String"],
    "KRETSTYPEKODE": ["kretstypekode", "String"],
    "KRETSTYPENAVN": ["kretstypenavn", "String"],
    "KULT_HIST_INT": ["kulturhistoriskInteresse", "String"],
    "KVIKKLEIRESVURD": ["stabilitetVurderingKvikkleire", "Integer"],
    "KYSTKONSTRUKSJONSTYPE": ["kystkonstruksjonstype", "Integer"],
    "KYSTREF": ["kystreferanse", "String"],
    "KYSTTYP": ["kysttype", "Integer"],
    "KYSTVERKSDISTRIKT": ["kystverksdistrikt", "Integer"],
    "LAGRET_DATO": ["lagretDato", "Date"],
    "LAND1": ["førsteLand", "String"],
    "LAND2": ["annetLand", "String"],
    "LANDEMERKEKATEGORI": ["landeberkekategori", "Integer"],
    "LANDKODE": ["landkode", "String"],
    "LATERALMERKETYPE": ["lateralmerketype", "Integer"],
    "LDEL": ["landsdelområde", "Integer"],
    "LEDN_BRU": ["ledningbruksområde", "String"],
    "LEDN_NAV": ["ledningsnavn", "String"],
    "LEDN_TYP": ["ledningstype", "Integer"],
    "LEDNINGSEIER": ["ledningseier", "String"],
    "LEKEREKRTYPE": ["lekeRekreasjonstype", "String"],
    "LENGDE": ["lengde", "Real"],
    "LENGDEENHET": ["lengdeenhet", "String"],
    "LENGDEOVERLAPP": ["lengdeoverlapp", "Integer"],
    "LENGDESEKTORLINJE1": ["lengdeSektorlinje1", "Real"],
    "LENGDESEKTORLINJE2": ["lengdeSektorlinje2", "Real"],
    "LETE_AREAL": ["leteareal", "Real"],
    "LH_BEREDSKAP": ["lufthavnBeredskapskode", "Integer"],
    "LHAREAL": ["lufthavnArealer", "Integer"],
    "LHDISTTYPE": ["lufthavndistansetype", "Integer"],
    "LHELEV": ["lufthavnelevasjon", "Real"],
    "LHFDET": ["lufthavnForsvarsObjektDetalj", "Integer"],
    "LHFM_TYPE": ["lufthavnFastmerketype", "Integer"],
    "LHINST_TYPE": ["lufthavnInstrumenteringType", "Integer"],
    "LHLYS_OPPHØYD_NEDFELT": ["lufthavnLysOpphøydNedfelt", "String"],
    "LHLYSFARGE": ["lufthavnlysFarge", "Integer"],
    "LHLYSRETN": ["lufhavnLysretning", "Integer"],
    "LHLYSTYPE": ["lufthavnlystype", "Integer"],
    "LHSKILTKATEGORI": ["lufthavnskiltkatagori", "Integer"],
    "LHSKILTLYS": ["lufthavnskiltlys", "String"],
    "LHSKILTTYPE": ["lufthavnskilttype", "Integer"],
    "LINEAMENTTYPE": ["lineamentType", "Integer"],
    "LINK": ["link", "String"],
    "LJORDKL": ["lokalJordressurs", "Integer"],
    "LJORDKL_A": ["nedklassifiseringLokalJordressurs", "Integer"],
    "LOK_NAVN": ["lokalitetsnavn", "String"],
    "LOK_NR": ["lokalitetsnummer", "Integer"],
    "LOSLIGHET": ["loslighetGrad", "Integer"],
    "LOSMKORNSTR": ["losmKornstorrelse", "Integer"],
    "LOSMOVERFLATETYPE": ["losmOverflateType", "Integer"],
    "LOVDISP": ["dispensasjonType", "Integer"],
    "LOVREFBESKRIVELSE": ["lovreferanseBeskrivelse", "String"],
    "LOVREFERANSE": ["lovreferanseType", "Integer"],
    "LR_AKTIV": ["landbruksregAktiv", "Integer"],
    "LR_TYPE": ["landbruksregType", "Integer"],
    "LRV": ["vannstandLavestRegulert", "Real"],
    "LUFTHAVNHINDERTREGRUPPE": ["lufthavnhinderTregruppe", "String"],
    "LVANN": ["vannstandLavestRegistrert", "Real"],
    "LYSHØYDE": ["lyshøyde", "Real"],
    "LØPENR": ["bruksenhetLøpenr", "Integer"],
    "MAGASINNR": ["magasinNr", "Integer"],
    "MAKSHØYDE": ["makshøyde", "Real"],
    "MAKSIMALREKKEVIDDE": ["maksimalRekkevidde", "Real"],
    "MAKSSNØHØYDE": ["maksSnøhøyde", "Integer"],
    "MANGELMATRIKKELFØRINGSKRAV": ["mangelMatrikkelføringskrav", "String"],
    "MARKID": ["jordregisterMarkslagKobling", "Integer"],
    "MARKSLAGAVGRTYPE": ["markslagAvgrensingType", "Integer"],
    "MASSEENHET": ["masseenhet", "String"],
    "MATERIALE": ["materialeBolt", "Integer"],
    "MATERIALE_YTTERV": ["materialeYttervegg", "Integer"],
    "MATR_KODE": ["materiellkode", "String"],
    "MATRIKKELKOMMUNE": ["matrikkelkommune", "Integer"],
    "MATRTYPE": ["materialType", "Integer"],
    "MATRUNTYPE": ["materialUndertype", "String"],
    "MAX_ELEMENT_PKT": ["maksAntallPunktGeometritype1", "Integer"],
    "MAX_OBJEKT_PKT": ["maksAntallPunktGeometritype2", "Integer"],
    "MAX_REF_OBJEKT": ["maksAntallGeometriReferanse", "Integer"],
    "MAX-AVVIK": ["maksimaltAvvik", "Integer"],
    "MAX-N": ["maksimumNord", "Integer"],
    "MAX-Ø": ["maksimumØst", "Integer"],
    "MEDIUM": ["medium", "String"],
    "MEKT50": ["mektighetFemtiProsent", "Real"],
    "MERKEFORM": ["merkeform", "Integer"],
    "MERKELISTENUMMER": ["merkelistenummer", "Integer"],
    "MERKEMØNSTER": ["merkemønster", "Integer"],
    "METADATALINK": ["metadatalink", "String"],
    "METALINTYP": ["metamorfLinjetype", "String"],
    "METAMOGRAD": ["metamorfGrad", "Integer"],
    "METER-FRA": ["veglenkeMeterFra", "Integer"],
    "METER-TIL": ["veglenkeMeterTil", "Integer"],
    "MGENHETBESKRIV": ["mgEnhetBeskrivelse", "String"],
    "MGENHETOPPLOSN": ["mgEnhetOpplosning", "Integer"],
    "MGINSTRUMENT": ["mgInstrument", "String"],
    "MGLINJENR": ["mgLinjenummer", "String"],
    "MGPOSNR": ["mgPosisjonnummer", "Integer"],
    "MGTOKTNR": ["mgToktnummer", "String"],
    "MILITÆRØVELSETYPE": ["militærøvelsetype", "Integer"],
    "MILJOTIL": ["miljøtiltak", "Integer"],
    "MINHØYDE": ["minhøyde", "Real"],
    "MIN-N": ["minimumNord", "Integer"],
    "MIN-Ø": ["minimumØst", "Integer"],
    "MYNDIGHET": ["vedtaksmyndighet", "String"],
    "MYR": ["myrklassifikasjon", "Integer"],
    "MÅLEMETODE": ["målemetode", "Integer"],
    "MÅLESTOKK": ["målestokk", "Integer"],
    "MÅLTALL": ["måltall", "Real"],
    "NASJONALTOPPMERKETYPE": ["nasjonalToppmerketype", "Integer"],
    "NASJVIKTIG": ["rastoffViktighetOmfang", "String"],
    "NAVIGASJONSINSTALLASJONSEIER": ["navigasjonsinstallasjonseier", "String"],
    "NAVLYS_KARAKTER": ["navigasjonslyskarakter", "Integer"],
    "NAVLYSTYPE": ["navlysType", "Integer"],
    "NAVN": ["navn", "String"],
    "NAVNTYPE": ["navnetype", "Integer"],
    "NEDSENKETKANTSTEIN": ["nedsenketKantstein", "String"],
    "NEDSTENGT_DATO": ["nedstengtDato", "Date"],
    "NETT_NIV": ["ledningsnettNivå", "String"],
    "NEVNER": ["nevner", "Real"],
    "NOMINELLREKKEVIDDE": ["nominellRekkevidde", "Real"],
    "NORD": ["nord", "Integer"],
    "NYMATRIKULERT": ["nymatrikulert", "String"],
    "NÆRINGSGRUPPE": ["næringsgruppe", "String"],
    "NØYAKTIGHET": ["nøyaktighet", "Integer"],
    "NØYAKTIGHETSKLASSE": ["nøyaktighetsklasse", "Integer"],
    "NÅVÆRENDE_AREAL": ["nåværendeAreal", "Real"],
    "OBJTYPE": ["objekttypenavn", "String"],
    "OBSERVERTFLOM": ["observertFlom", "Real"],
    "OBSLINID": ["obsLinId", "String"],
    "OMKRETSINNSJØ": ["omkretsInnsjø", "Integer"],
    "OMRKODE": ["reinbeiteområdeID", "String"],
    "OMRNAVN": ["områdenavn", "String"],
    "OMRTYPE": ["dumpefelttype", "Integer"],
    "OMRÅDEID": ["områdeid", "Integer"],
    "OMTVISTET": ["omtvistet", "String"],
    "OPAREALAVGRTYPE": ["operativArealavgrensningtype", "Integer"],
    "OPERATØR": ["petroleumsoperatør", "String"],
    "OPLAREAL": ["arealbruk", "Integer"],
    "OPLAREALUTDYP": ["arealbruksutdyping", "String"],
    "OPLRESTR": ["arealbruksrestriksjoner", "Integer"],
    "OPLRETNL": ["arealbruksretningslinjer", "Integer"],
    "OPPARBEIDING": ["opparbeiding", "Integer"],
    "OPPDATERINGSDATO": ["oppdateringsdato", "Date"],
    "OPPDRAGSGIVER": ["oppdragsgiver", "String"],
    "OPPGITTAREAL": ["oppgittAreal", "Real"],
    "OPPHAV": ["opphav", "String"],
    "OPPMÅLINGIKKEFULLFØRT": ["oppmålingIkkeFullført", "String"],
    "OPPMÅLTKOTE": ["oppmåltKote", "Real"],
    "OPPMÅLTÅR": ["oppmåltÅr", "Integer"],
    "OPPRETTET_AAR": ["opprettetÅr", "Date"],
    "OPPRINNELIGBILDEFORMAT": ["bildeType", "String"],
    "OPPRINNELIGBILDESYS": ["BildeSystem", "Integer"],
    "OPPRINNELIGSOSIALTMILJØ": ["opprinneligSosialtMiljø", "Integer"],
    "OPPRINNELSE": ["opprinnelse", "String"],
    "OPPSTARTSÅR": ["oppstartsår", "Date"],
    "OPPTAKSMETODE": ["opptaksmetode", "Integer"],
    "OPPVARMING": ["oppvarming", "String"],
    "ORGANISK": ["organiskAndel", "Integer"],
    "ORGNR": ["organsisasjonsnummer", "Integer"],
    "ORIENTERINGSDATA": ["orienteringsdata", "String"],
    "ORIENTERINGSMETODE": ["orienteringsmetode", "Integer"],
    "ORIGINALDATAVERT": ["originalDatavert", "String"],
    "ORIGO-N": ["origoNord", "Integer"],
    "ORIGO-Ø": ["origoØst", "Integer"],
    "OVERGRUPPE": ["overgruppeNavn", "String"],
    "PBTILTAK": ["tiltakstype", "Integer"],
    "PETLITOKODE": ["petrofLitologi", "String"],
    "PETMETAKODE": ["petrofMetamorfose", "String"],
    "PETROLEUM_KOORD_STATUS": ["petroleumKoordinatstatus", "String"],
    "PETROLEUMLEDNINGFUNKSJON": ["petroleumsledningsfunksjon", "String"],
    "PETROLEUMLEDNINGTYPE": ["petroleumsledningstype", "String"],
    "PETROLEUMSANDEL": ["petroleumsandel", "Real"],
    "PETROLEUMSDATAKILDE": ["petroleumsdatakilde", "String"],
    "PETROLEUMSFELTNAVN": ["petroleumsfeltnavn", "String"],
    "PETROLEUMSFELTTYPE": ["petroleumsfelttype", "String"],
    "PETROLEUMSPARTNERE": ["petroleumspartnere", "String"],
    "PETSTRATKODE": ["petrofStratigrafi", "String"],
    "PILARKATEGORI": ["pilarkategori", "Integer"],
    "PIXEL-STØRR": ["pixelstørrelse", "Real"],
    "PLANBEST": ["planbestemmelse", "Integer"],
    "PLANERING": ["planeringsgrad", "Integer"],
    "PLANID": ["planidentifikasjon", "String"],
    "PLANNAVN": ["plannavn", "String"],
    "FORSLAGSSTILLERTYPE": ["forslagsstillerType", "Integer"],
    "PLANSTAT": ["planstatus", "Integer"],
    "PLANTYPE": ["plantype", "Integer"],
    "PLASS": ["plasseringskode", "Integer"],
    "PLFMERK": ["oppstillingplattformmerking", "Integer"],
    "PLOGSJIKTTEKSTUR": ["plogsjiktTekstur", "Integer"],
    "POBS": ["observasjonstype", "Integer"],
    "POLITIDISTRIKTID": ["politidistriktId", "Integer"],
    "POS_KVAL": ["posisjonKvalitet", "Integer"],
    "POS_TYPE": ["posisjonType", "Integer"],
    "BITS_PR_PIXEL": ["bitsPrPixel", "Integer"],
    "POSTNAVN": ["poststedsnavn", "String"],
    "POSTNR": ["postnummer", "Integer"],
    "PREPARERING": ["løypepreparering", "String"],
    "PRIMÆRSTREKNINGSNUMMER": ["primærstrekningsnummer", "Integer"],
    "PRIOMR": ["prioritetområde", "String"],
    "PRIORITET": ["kulturlandskapPrioritet", "String"],
    "PRIVAT_KLOAKKR": ["privatKloakkRensing", "Integer"],
    "PRODUKT": ["produkt", "String"],
    "PRODUKT_FULLT_NAVN": ["produktFullstendigNavn", "String"],
    "PRODUKTGRUPPE": ["produktgruppe", "String"],
    "PRODUSENT": ["geodataprodusent", "String"],
    "PROJEK": ["projeksjon", "String"],
    "PROSELV": ["prosentElv", "Real"],
    "PROSESS_HISTORIE": ["prosesshistorie", "String"],
    "PROSHAV": ["prosentHav", "Real"],
    "PROSINNSJØ": ["prosentInnsjø", "Real"],
    "PROSJEKTNAVN": ["prosjektnavn", "String"],
    "PROSJEKTSTART": ["prosjektstartår", "Integer"],
    "PROSLAND": ["prosentLand", "Real"],
    "PROSTINUMMER": ["prostinummer", "Integer"],
    "PROVEMATR": ["proveMaterial", "String"],
    "PTYPE": ["punktType", "String"],
    "PUKKVERKTYPE": ["pukkverktype", "Integer"],
    "PUMPER_NØDSTR": ["pumperNødstrøm", "String"],
    "PUMPES_VANNET": ["pumperVannet", "String"],
    "PUNKTBESKR": ["punktBeskrivelse", "String"],
    "PUNKTFESTE": ["punktfeste", "String"],
    "PÅVIRKNINGSGRAD": ["påvirkningsgrad", "Integer"],
    "R_FNR": ["forekomstNummer", "Integer"],
    "R_LNR": ["lokalNummer", "Integer"],
    "R_ONR": ["omrNummer", "Integer"],
    "R_PNR": ["proveNummer", "Integer"],
    "R_RESERVER": ["rastoffReserver", "Integer"],
    "RACONFREKVENSBÅND": ["raconFrekvensbånd", "String"],
    "RACONKARAKTER": ["raconkarakter", "String"],
    "RACONMORSETEGN": ["raconmorsetegn", "String"],
    "RACONRESPONSINTERVALL": ["raconresponsintervall", "String"],
    "RACONTYPE": ["racontype", "Integer"],
    "RADAR_FYR_TYPE": ["radarfyrtype", "Integer"],
    "RADARREFLEKTOR": ["radarReflektor", "String"],
    "RADARSTASJONSTYPE": ["radarstasjonstype", "Integer"],
    "RADIO_FYR_TYPE": ["radiofyrtype", "Integer"],
    "RADIOAKTIV": ["radioaktivitetNiva", "Integer"],
    "RADIOFYRMODULASJON": ["radiofyrmodulasjon", "String"],
    "RADIUS": ["radius", "Real"],
    "RADRISKOMR": ["naturlRadioaktivStraling", "Integer"],
    "RAPPORTERINGSÅR": ["rapporteringsår", "Date"],
    "REFERANSE": ["referanse", "String"],
    "REFERANSENUMMER": ["referansenummer", "String"],
    "REGFORM": ["reguleringsformål", "Integer"],
    "REGFORMUTDYP": ["reguleringsformålsutdyping", "String"],
    "REGISTRERINGKRETSNR": ["registreringKretsnr", "Integer"],
    "REGISTRERT_DATO": ["registrertDato", "Date"],
    "REGMETOD": ["registreringsmetode", "Integer"],
    "REGULERTHØYDE": ["regulertHøyde", "Real"],
    "REINDRIFTANLTYP": ["reindriftsanleggstype", "Integer"],
    "REINDRIFTKONNAVN": ["reindriftKonvensjonsområdenavn", "String"],
    "REKKEVIDDEGRØNN": ["rekkeviddeGrønn", "Real"],
    "REKKEVIDDEGUL": ["rekkeviddeGul", "Real"],
    "REKKEVIDDEHVIT": ["rekkeviddeHvit", "Real"],
    "REKKEVIDDERØD": ["rekkeviddeRød", "Real"],
    "RENHET": ["retningsenhet", "Integer"],
    "RENOVASJON": ["renovasjon", "Integer"],
    "RESIPIENTTYPE": ["resipienttype", "String"],
    "RESTR_OMR": ["restriksjonsområde", "String"],
    "RESTRIKSJONSTYPE": ["restriksjonstype", "Integer"],
    "RET_SYS": ["retningsreferanse", "Integer"],
    "RETN": ["retningsverdi", "Real"],
    "RETNINGSEKTORLINJE1": ["retningSektorlinje1", "Real"],
    "RETNINGSEKTORLINJE2": ["retningSektorlinje2", "Real"],
    "RISIKOVURDERING": ["risikovurdering", "String"],
    "RKB": ["rkb", "Real"],
    "RKB_TD": ["rkbTotaltDyp", "Real"],
    "ROTASJON": ["rotasjon", "Integer"],
    "RPANGITTHENSYN": ["angitthensyn", "Integer"],
    "RPAREALFORMÅL": ["arealformål", "Integer"],
    "RPBÅNDLEGGING": ["båndlegging", "Integer"],
    "RPDETALJERING": ["detaljering", "Integer"],
    "RPFARE": ["fare", "Integer"],
    "RPGJENNOMFØRING": ["gjennomføring", "Integer"],
    "RPINFRASTRUKTUR": ["infrastruktur", "Integer"],
    "RPJURLINJE": ["juridisklinje", "Integer"],
    "RPJURPUNKT": ["juridiskpunkt", "Integer"],
    "RPPÅSKRIFTTYPE": ["påskriftType", "Integer"],
    "RPSIKRING": ["sikring", "Integer"],
    "RPSTØY": ["støy", "Integer"],
    "RSL_JREG": ["referansesystemForLandskapJordbruksregioner", "String"],
    "RSL_REG": ["referansesystemForLandskapRegioner", "String"],
    "RSL_UREG": ["referansesystemForLandskapUReg", "String"],
    "RTALLHØY": ["reintallHøyeste", "Integer"],
    "RTALLVEDTAK": ["reintallVedtak", "String"],
    "RULLEBANEDISTANSETYPE": ["rullebanedistansetype", "Integer"],
    "RULLEBANERETNING": ["rullebaneretning", "Integer"],
    "RUTEBREDDE": ["rutebredde", "Integer"],
    "RUTEFØLGER": ["ruteFølger", "String"],
    "RUTEMERKING": ["ruteMerking", "String"],
    "RUTENETTYPE": ["rutenettype", "String"],
    "RUTENR": ["rutenummer", "String"],
    "SEFRAK_TILTAK": ["sefrakTiltak", "Integer"],
    "SEFRAKBREDDE": ["sefrakbredde", "Integer"],
    "SEFRAKKOMMUNE": ["sefrakKommune", "Integer"],
    "SEFRAKLENGDE": ["sefraklengde", "Integer"],
    "SEIL_BREDDE": ["seilingsbredde", "Real"],
    "SEIL_DYBDE": ["seilingsdybde", "Real"],
    "SEKSJONERT": ["seksjonert", "String"],
    "SEKTORTEKST": ["sektortekst", "String"],
    "SEKUNDÆRSTREKNINGSNUMMER": ["sekundærstrekningsnummer", "Integer"],
    "SENTRUMSSONENAVN": ["sentrumssonenavn", "String"],
    "SENTRUMSSONENUMMER": ["sentrumssonenummer", "Integer"],
    "SEPTIKTANK": ["septiktank", "String"],
    "SERIEKODE1": ["serie1", "String"],
    "SERIEKODE2": ["serie2", "String"],
    "SERIEKODE3": ["serie3", "String"],
    "SERVMERK": ["servituttMerknad", "String"],
    "SERVTYPE": ["servituttType", "String"],
    "SESOMR": ["reindriftSesongområde", "Integer"],
    "SFOTRUTETYPE": ["spesialFotrutetype", "String"],
    "SIDEOVERLAPP": ["sideoverlapp", "Integer"],
    "SIGNALGRUPPE": ["signalgruppe", "String"],
    "SIGNALNR": ["signalnummer", "String"],
    "SIGNALPERIODE": ["signalperiode", "String"],
    "SIGNALSEKVENS": ["signalsekvens", "String"],
    "SIGNH": ["signalHøyde", "Real"],
    "SIGNHREF": ["signalHøydeRef", "String"],
    "SIGNTYPE": ["signalType", "String"],
    "SIKKERÅR": ["ledningsalderReferanse", "Integer"],
    "SIKTEDYP": ["sikteDyp", "Integer"],
    "SIST_VURDERT_AAR": ["sistVurdertÅr", "Date"],
    "SISTBEFART": ["sisteBefaringsdato", "Integer"],
    "SJØ_RESTRIKSJON": ["sjørestriksjon", "Integer"],
    "SJØ_SIGFRQ": ["sjøsignalfrekvens", "Integer"],
    "SJØ_STATUS": ["sjøstatus", "Integer"],
    "SJØ_TRAFIKK": ["sjøtrafikk", "Integer"],
    "SJØMERKEFARGE": ["sjømerkefarge", "Integer"],
    "SJØMERKESYSTEM": ["sjømerkesystem", "Integer"],
    "SKAL_AVGR_BYGN": ["skalAvgrenseBygning", "String"],
    "SKALAENHET": ["skalaenhet", "String"],
    "SKILTGRUPPE": ["skiltgruppe", "String"],
    "SKILØYPETYPE": ["skiløypetype", "Integer"],
    "SKJERMINGFUNK": ["skjermingsfunksjon", "String"],
    "SKOG": ["jordregisterSkogtype", "Integer"],
    "SKOGREIS": ["jordregisterSkogreisningsmark", "Integer"],
    "SKOLEKRETSTYPE": ["skolekretsnavn", "String"],
    "SKREDALDERBEST": ["skredAlderBestemmelse", "String"],
    "SKREDBESKRIVELSE": ["skredBeskrivelse", "String"],
    "SKREDBREDDE": ["skredBredde", "Integer"],
    "SKREDEVAKUERING": ["skredEvakuering", "Integer"],
    "SKREDFALLHØYDE": ["skredFallhoyde", "Integer"],
    "SKREDFAREGR_KL": ["skredFaregradKlasse", "String"],
    "SKREDFAREGRADSCORE": ["skredFaregradScore", "Integer"],
    "SKREDFAREVURD": ["snoSteinSkredfareVurdering", "Integer"],
    "SKREDKONSSCORE": ["skredSkadKonsekvensScore", "Integer"],
    "SKREDKVALKARTLEGGING": ["skredKvalKartlegging", "Integer"],
    "SKREDLENGDE": ["skredLengde", "Integer"],
    "SKREDMALEMETODE": ["skredMalemetode", "Integer"],
    "SKREDOBSGUID": ["skredObservasjonGUID", "Integer"],
    "SKREDOMKOMNE": ["skredAntallOmkomne", "Integer"],
    "SKREDOMRID": ["skredOmrID", "Integer"],
    "SKREDOMRNAVN": ["skredOmrNavn", "String"],
    "SKREDREDNING": ["skredRedning", "Integer"],
    "SKREDRISIKO_KL": ["skredRisikoKvikkleireKlasse", "Integer"],
    "SKREDSKADEANNEN": ["skredSkadeAnnen", "Integer"],
    "SKREDSKADEOBJEKTER": ["skredSkadeObjekter", "Integer"],
    "SKREDSKADESAMFERDSEL": ["skredSkadeSamferdsel", "Integer"],
    "SKREDSKADETYPE": ["skredSkadType", "Integer"],
    "SKREDSKADKONS_KL": ["skredSkadeKonsekvensKlasse", "Integer"],
    "SKREDSTATSANN": ["skredStatistikkSannsynlighet", "String"],
    "SKREDTIDHENDELSE": ["skredTidspunktHendelse", "String"],
    "SKREDTIDUSIKKERH": ["skredTidUsikkerhet", "String"],
    "SKREDTYPE": ["skredtype", "Integer"],
    "SKREDUTLOMRHELNING": ["skredUtlosningOmrHelning", "Integer"],
    "SKREDUTLOPOMRTYPE": ["skredUtlopOmrType", "Integer"],
    "SKREDUTLOSNINGOMRTYPE": ["skredUtlosningOmrType", "Integer"],
    "SKREDVOLUM": ["skredVolum", "String"],
    "SKRETSNAVN": ["skolekretsnavn", "String"],
    "SKRETSNR": ["skolekretsnummer", "Integer"],
    "SKRIFTKODE": ["presentasjonskode", "Integer"],
    "SKYLD": ["skyld", "Real"],
    "SKYVGRINDL": ["skyvegrenseInndeling", "Integer"],
    "SLUSETYP": ["sluseType", "Integer"],
    "SMÅBÅTHAVNFASILITET": ["småbåthavnfasilitet", "Integer"],
    "SNAVN": ["stedsnavn", "String"],
    "SNDATO": ["statusdato", "Date"],
    "SNITT_HØ": ["snitthøyde", "Integer"],
    "SNKILDE": ["stedsnavnkilde", "String"],
    "SNLØPENR": ["arkivløpenummer", "Integer"],
    "SNMERK": ["stedsnavnmerknad", "String"],
    "SNMYND": ["stedsnavnVedtaksmyndighet", "String"],
    "SNR": ["seksjonsnummer", "Integer"],
    "SNREGDATO": ["stedsnavnRegistreringsdato", "Date"],
    "SNSAKSNR": ["arkivsaksnummer", "Integer"],
    "SNSKRSTAT": ["stedsnavnSkrivemåtestatus", "String"],
    "SNSPRÅK": ["språk", "String"],
    "SNTYSTAT": ["stedsnavnTypestatus", "String"],
    "SNØSCOOTERLØYPETYPE": ["snøscooterløypeType", "String"],
    "SOGNNUMMER": ["sognnummer", "Integer"],
    "SONENAUT": ["soneNautisk", "Integer"],
    "SONETYPE": ["sonetype", "String"],
    "SOSIELEMENT": ["sosiElementnavn", "String"],
    "SOSI-NIVÅ": ["sosiKompleksitetNivå", "Integer"],
    "SOSI-VERSJON": ["sosiVersjon", "String"],
    "SP_ABONTRE": ["skogbrplanKlassAktueltTreslag", "Integer"],
    "SP_AGJBON": ["skogbrplanKlassAktSnittBon", "Integer"],
    "SP_ALDER": ["skogbrplanBeskrivBestandAlder", "Integer"],
    "SP_ANDEREG": ["skogbrplanTreslagAntTreDaaEReg", "Integer"],
    "SP_ANDFREG": ["skogbrplanTreslagAntTreDaaFReg", "Integer"],
    "SP_AVOLPRDA": ["skogbrplanGrunnlagVolumDaaFelt", "Real"],
    "SP_AVOLTOT": ["skogbrplanGrunnlagVolumBestFelt", "Integer"],
    "SP_BAREAL": ["skogbrplanBeskrivBestandDaa", "Real"],
    "SP_BERTYPE": ["skogbrplanGrunnlagBerType", "Integer"],
    "SP_BESTDELNR": ["skogbrplanBestandDelNr", "Integer"],
    "SP_BESTNR": ["skogbrplanBestandNr", "Integer"],
    "SP_BEVNE": ["skogbrplanTerrengBæreevneBestand", "Integer"],
    "SP_BMIDDIAM": ["skogbrplanBeskrivBestSnittDiam", "Integer"],
    "SP_BMIDGRFL": ["skogbrplanBeskrivBestandSnittM2", "Integer"],
    "SP_BMIDHO": ["skogbrplanBeskrivBestandSnittH", "Real"],
    "SP_BRATT": ["skogbrplanTerrengBestandBratthet", "Integer"],
    "SP_BTILVPRDA": ["skogbrplanTilvekstBeregnDaa", "Real"],
    "SP_BTILVPROS": ["skogbrplanTilvekstBeregnProsent", "Real"],
    "SP_BVOLPRDA": ["skogbrplanTilvekstBeregnM3", "Real"],
    "SP_DENDR": ["skogbrplanAdmDatoEndring", "Date"],
    "SP_DREG": ["skogbrplanAdmDatoEtablering", "Date"],
    "SP_ELEMTYPE": ["skogbrplanFlerKoderElementtype", "Integer"],
    "SP_FARAND": ["skogbrplanFlerKoderArealProsent", "Integer"],
    "SP_FAREAL": ["skogbrplanFlerKoderArealDaa", "Integer"],
    "SP_FRAND": ["skogbrplanFlerKoderSpesBehPros", "Integer"],
    "SP_FRAREAL": ["skogbrplanFlerKoderSpesBehDaa", "Integer"],
    "SP_GREND": ["skogbrplanTeigGrend", "Integer"],
    "SP_GRFL": ["skogbrplanTetthetGrunnflatesum", "Integer"],
    "SP_HBAR": ["skogbrplanBeskrivBarHøydehkl2", "Integer"],
    "SP_HKL": ["skogbrplanBeskrivHogstklasse", "Integer"],
    "SP_HLAUV": ["skogbrplanBeskrivLauvHøydehkl2", "Integer"],
    "SP_HOVEDGR": ["skogbrplanGrunnlagHovedgruppe", "Integer"],
    "SP_HOYDE": ["skogbrplanTetthetMHøyde", "Integer"],
    "SP_IMPANDEL": ["skogbrplanKlassImpProsent", "Integer"],
    "SP_IMPTYPE": ["skogbrplanKlassImpType", "Integer"],
    "SP_LILEN": ["skogbrplanTerrengLiLengde", "Integer"],
    "SP_MINTRSP": ["skogbrplanTerrengMinTranspUtst", "Integer"],
    "SP_PBONTRE": ["skogbrplanKlassPotTreslag", "Integer"],
    "SP_PGJBON": ["skogbrplanKlassPotSnittBon", "Integer"],
    "SP_PRIO": ["skogbrplanTiltakProritet", "Integer"],
    "SP_REG": ["skogbrplanGrunnlagRegion", "Integer"],
    "SP_SJIKT": ["skogbrplanBeskrivSjiktning", "Integer"],
    "SP_SKOGTYP": ["skogbrplanBeskrivSkogtype", "Integer"],
    "SP_SUNNH": ["skogbrplanBeskrivSunnhet", "Integer"],
    "SP_SVPROS": ["skogbrplanGrunnlagSvinnProsent", "Integer"],
    "SP_TAKSTTYPE": ["skogbrplanGrunnlagTaksttype", "Integer"],
    "SP_TARAND": ["skogbrplanTiltakProsent", "Integer"],
    "SP_TAREAL": ["skogbrplanTiltakAreal", "Real"],
    "SP_TEIGNR": ["skogbrplanTeigNr", "Integer"],
    "SP_TERJEVN": ["skogbrplanTerrengJevnhet", "Integer"],
    "SP_TILT": ["skogbrplanTiltakBestand", "Integer"],
    "SP_TILVKOR": ["skogbrplanGrunnlagTilvekstkorr", "Integer"],
    "SP_TNAVN": ["skogbrplanTeigNavn", "String"],
    "SP_TOTVOL": ["skogbrplanTilvekstVolumBestand", "Integer"],
    "SP_TREEREG": ["skogbrplanBeskrivTreERegulering", "Integer"],
    "SP_TREFREG": ["skogbrplanBeskrivTreFRegulering", "Integer"],
    "SP_TRESLAG": ["skogbrplanTreslag", "Integer"],
    "SP_TRESLHO": ["skogbrplanTreslagHøyde", "Integer"],
    "SP_VOLAND": ["skogbrplanTreslagProsent", "Integer"],
    "SP_VOLKORR": ["skogbrplanTreslagKorrVolumUBark", "Integer"],
    "SP_VOLSALG": ["skogbrplanTreslagSalgsvolumUBark", "Integer"],
    "SP_VOLUKORR": ["skogbrplanTreslagUkorrVolumUBark", "Integer"],
    "SP_AAR": ["skogbrplanTiltakÅr", "Integer"],
    "SPERRING": ["sperring", "String"],
    "SPES_SKILØYPETYPE": ["spesialSkiløypetype", "String"],
    "SPESIALMERKETYPE": ["spesialmerketype", "Integer"],
    "SPESIALSYKKELRUTETYPE": ["spesialsykkelrutetype", "String"],
    "SPOR_HASTIGHET": ["sporhastighet", "Integer"],
    "SPORANTALL": ["sporantall", "String"],
    "SPORAVGRENINGSNR": ["sporavgreningsnummer", "String"],
    "SPORAVGRENINGSPUNKTNR": ["sporavgreningspunktnummer", "String"],
    "SPORAVGRENINGSPUNKTTYPE": ["sporavgreningspunkttype", "String"],
    "SPORAVGRENINGSTYPE": ["sporavgreningstype", "String"],
    "SPORKM": ["sporKilometer", "Real"],
    "SPORNUMMER": ["spornummer", "String"],
    "SPORPUNKTNUMMER": ["sporpunktnummer", "String"],
    "SPORPUNKTTYPE": ["sporpunkttype", "String"],
    "SPORTYPE": ["sportype", "String"],
    "SSR-ID": ["ssrId", "Integer"],
    "SSR-OBJID": ["objId", "Integer"],
    "STANDARDENHET": ["standardenhet", "String"],
    "STASJONSFORMÅL": ["stasjonsformål", "String"],
    "STASJONSNR": ["stasjonsnummer", "Integer"],
    "STASJONSPARAMETER": ["stasjonsparameter", "Integer"],
    "STASJONSTYPE": ["stasjonstype", "String"],
    "STASJONTYP": ["stasjonstype", "String"],
    "STAT": ["typeStatus", "Integer"],
    "STATUS": ["status", "String"],
    "STED": ["sted", "String"],
    "STED_VERIF": ["stedfestingVerifisert", "String"],
    "STENGESDATO": ["stengesDato", "Date"],
    "STORBUE": ["storbue", "Integer"],
    "STREKNINGSNUMMER": ["strekningsnummer", "Integer"],
    "STRENG": ["generellTekststreng", "String"],
    "STRIPENUMMER": ["stripenummer", "String"],
    "STRUKTUROVERBIKKET": ["strukturOverbikket", "String"],
    "STRUKTURPUNKTTYPE": ["strukturPunkttype", "Integer"],
    "STRØMHAST": ["strømhastighet", "Real"],
    "STRØMRETN": ["strømretning", "Integer"],
    "STØYENHET": ["støyenhet", "String"],
    "STØYINTERVALL": ["støyintervall", "Integer"],
    "STØYKILDE": ["støykilde", "String"],
    "STØYKILDEIDENTIFIKASJON": ["Støykildeidentifikasjon", "String"],
    "STØYKILDENAVN": ["støykildenavn", "String"],
    "STØYMETODE": ["støymetode", "String"],
    "STØYNIVÅ": ["støynivå", "Integer"],
    "STØYSONEKATEGORI": ["støysonekategori", "String"],
    "SUM_ALT_AREAL": ["sumAlternativtAreal", "Real"],
    "SUM_ALT_AREAL2": ["sumAlternativtAreal2", "Real"],
    "SUM_ANTALLBOENH": ["sumAntallBoenheter", "Integer"],
    "SUM_BRUKSARTOT": ["sumBruksarealTotalt", "Real"],
    "SUM_BRUKSTILANN": ["sumBruksarealTilAnnet", "Real"],
    "SUM_BRUKSTILBOL": ["sumBruksarealTilBolig", "Real"],
    "SYKKELRUTETYPE": ["sykkelrutetype", "Integer"],
    "SYNBARHET": ["synbarhet", "Integer"],
    "SYSKODE": ["referansesystemKode", "Integer"],
    "TAKFORM": ["takform", "Integer"],
    "TAKSKJEGG": ["takskjegg", "Integer"],
    "TAKTEKKING": ["taktekking", "Integer"],
    "TDIM-BREDDE": ["tekstTegnbredde", "Real"],
    "TDIM-HØYDE": ["tekstTegnhøyde", "Real"],
    "TEGNFORKL": ["tegnforklaring", "String"],
    "TEGNSETT": ["tegnsett", "String"],
    "TEIGE_ID": ["teigEtterSkifteIdent", "Integer"],
    "TEIGF_ID": ["teigFørSkitfeIdent", "Integer"],
    "TEIGFLEREMATRSAMMEEIER": ["teigFlereMatrSammeEier", "String"],
    "TEIGMEDFLEREMATRENHETER": ["teigMedFlereMatrikkelenheter", "String"],
    "TEIGNR": ["jordregisterEiendomTeigNummer", "Integer"],
    "TEKSTURKODE1": ["teksturkode", "String"],
    "TEKSTURKODE2": ["teksturkode2", "String"],
    "TEKSTURKODE3": ["teksturkode3", "String"],
    "TELEFAXNR": ["telefaxnummer", "Integer"],
    "TELEFONNR": ["telefonnummer", "Integer"],
    "TELLER": ["teller", "Real"],
    "TEMAJUST": ["geolTemajustering", "Integer"],
    "TEMAKVAL": ["temaKvalitet", "String"],
    "TERSKELFUNKSJON": ["terskelFunksjon", "String"],
    "TERSKELTYP": ["terskelType", "String"],
    "TETTSTEDNAVN": ["tettstednavn", "String"],
    "TIDOPPHOLDVANN": ["tidOppholdVann", "Integer"],
    "TIDREF": ["tidreferanse", "String"],
    "TIDSANGIVELSE": ["tidsangivelse", "Integer"],
    "TIDSENHET": ["tidsenhet", "String"],
    "TIDSLUTT": ["periodeSlutt", "Date"],
    "TIDSPUNKT": ["tidspunkt", "Date"],
    "TIDSTART": ["periodeStart", "Date"],
    "TILDELT_AREAL": ["tildeltAreal", "Real"],
    "TILDELT_DATO": ["tilldeltDato", "Date"],
    "TILGJENGELIGHETSVURDERING": ["tilgjengelighetsvurdering", "String"],
    "TILLEGG": ["flatetillegg", "Integer"],
    "TILLEGGSAREAL": ["tilleggsareal", "Integer"],
    "TILSPORNODEKILOMETER": ["tilSpornodeKilometer", "Real"],
    "TILSPORNODETEKST": ["tilSpornodeTekst", "String"],
    "TILSPORNODETYPE": ["tilSpornodeType", "String"],
    "TILSYS": ["tilKoordinatsystem", "Integer"],
    "TILTAKNR": ["tiltaksnummer", "Integer"],
    "TINGLYST": ["tinglyst", "String"],
    "TIPPVOLUM": ["deponitippVolum", "Integer"],
    "TOKTID": ["toktId", "String"],
    "TOT_PROD": ["totalProduksjon", "Integer"],
    "TOTALAREALKM2": ["totalarealKm2", "Real"],
    "TOTALBELASTNING": ["totalBelastning", "Integer"],
    "TRAFIKKBELASTNING": ["trafikkbelastning", "Integer"],
    "TRAFIKKFARE": ["trafikkfare", "String"],
    "TRE_D_NIVÅ": ["treDNivå", "Integer"],
    "TRE_TYP": ["treType", "Integer"],
    "TRNORD": ["tekstReferansePunktNord", "Integer"],
    "TRØST": ["tekstReferansePunktØst", "Integer"],
    "TSKOG": ["tilleggsopplysningerSkog", "Integer"],
    "TSKYV": ["tekstForskyvning", "Real"],
    "TSTED": ["tettstednummer", "Integer"],
    "TVIST": ["tvist", "String"],
    "TWYMERK": ["taksebaneoppmerking", "Integer"],
    "TYPE_BR": ["trasebreddetype", "Integer"],
    "TYPE_VANNFOR_ANL": ["typeVannforsyningsanlegg", "Integer"],
    "TYPEDUMPEOMRÅDE": ["typeDumpeområde", "Integer"],
    "TYPEINNSJØ": ["typeInnsjø", "Integer"],
    "TYPESAMFLINJE": ["samferdselslinjeType", "Integer"],
    "TYPESAMFPUNKT": ["samferdselspunkt", "Integer"],
    "UB_ANL_TYP": ["utmarkbeiteAnleggstype", "Integer"],
    "UB_DYRESL": ["utmarkbeiteDyreslag", "String"],
    "UFULLSTENDIGAREAL": ["ufullstendigAreal", "String"],
    "UNDERBYGNINGKONSTR": ["underbygningKonstr", "Integer"],
    "UNDERGRUNN": ["undergrunn", "String"],
    "UNDERLAG": ["fastmerkeUnderlag", "Integer"],
    "UNDERLAGSTYPE": ["underlagstype", "Integer"],
    "UNDERSAMMENFØYNINGSKALBESTÅ": ["underSammenføyningSkalBestå", "String"],
    "UNDERSAMMENFØYNINGSKALUTGÅ": ["underSammenføyningSkalUtgå", "String"],
    "UNDERSOKELSENR": ["undersokelseNummer", "Integer"],
    "UNDERTYPE": ["undertypeVersjon", "String"],
    "UNR": ["underNr", "Integer"],
    "UREGJORDSAMEIE": ["uregistrertJordsameie", "String"],
    "UTEAREAL": ["uteoppholdsareal", "Integer"],
    "UTGÅR_DATO": ["utgårDato", "Date"],
    "UTGÅTT": ["utgått", "String"],
    "UTNTALL": ["utnyttingstall", "Real"],
    "UTNTYP": ["utnyttingstype", "Integer"],
    "UTNYTTBAR_KAP": ["utnyttbarMagasinkapasitet", "Real"],
    "UTSLIPPTYPE": ["utslipptype", "String"],
    "UTV_TILL_NR": ["tillatelsesnummer", "String"],
    "UTV_TILL_TYPE": ["utvinningstillatelsestype", "String"],
    "UTVALGSAK": ["utvalgssaksnummer", "Integer"],
    "UTVALGSMET": ["utvalgMetode", "String"],
    "UUFASILITET": ["universellutformingFasilitet", "String"],
    "VALUTAENHET": ["valutaenhet", "String"],
    "VANNBR": ["vannbredde", "Integer"],
    "VANNFORSYNING": ["vannforsyning", "Integer"],
    "VANNFØRINGMIDLERE": ["vannføringMidlere", "Integer"],
    "VANNFØRINGMINSTE": ["vannføringMinste", "Integer"],
    "VANNFØRINGSTØRST": ["vannføringStørst", "Integer"],
    "VANNLAGR": ["vannlagringsevne", "Integer"],
    "VASSDRAGNAVN": ["vassdragsnavn", "String"],
    "VASSDRAGSNR": ["vassdragsnummer", "String"],
    "VATNLNR": ["vatnLøpenummer", "Integer"],
    "V-DELTA-MAX": ["vertikaltDeltaMaksimum", "Integer"],
    "V-DELTA-MIN": ["vertikaltDeltaMinimum", "Integer"],
    "VEDLIKEH": ["vedlikeholdsansvarlig", "String"],
    "VEDTAK": ["vedtakstype", "Integer"],
    "VEDTAKSDATO": ["vedtaksdato", "Date"],
    "VEGKATEGORI": ["vegkategori", "String"],
    "VEGNUMMER": ["vegnummer", "Integer"],
    "VEGOVERVEG": ["vegOverVeg", "String"],
    "VEGREKKVERKTYPE": ["vegrekkverkType", "String"],
    "VEGSPERRINGTYPE": ["vegsperringtype", "String"],
    "VEGSTATUS": ["vegstatus", "String"],
    "VERDI": ["verdi", "Integer"],
    "VERDI1": ["verdi", "String"],
    "VERDI2": ["tilVerdi", "String"],
    "VERDIANNA": ["verdiAnnenUtnyttelseGrunn", "Real"],
    "VERDIBEITE": ["verdiBeiterett", "Real"],
    "VERDIGRUNN": ["verdiGrunn", "Real"],
    "VERDIJAKT": ["verdiJaktrett", "Real"],
    "VERDISKOG": ["verdiSkogProduksjon", "Real"],
    "VERIFISERINGSDATO": ["verifiseringsdato", "Date"],
    "VERN_FORMAL": ["verneFormål", "String"],
    "VERN_LOV": ["vernelov", "String"],
    "VERN_MOT": ["vernskogType", "Integer"],
    "VERN_PARA": ["verneparagraf", "String"],
    "VERNEDATO": ["vernedato", "Date"],
    "VERNEFORM": ["verneform", "String"],
    "VERNEPLAN": ["verneplan", "Integer"],
    "VERNTEMA": ["verneTema", "Integer"],
    "VERNTYPE": ["vernetype", "String"],
    "VERSJON": ["versjon", "String"],
    "VERT_BÆREKONSTR": ["vertikalBærekonstruksjon", "Integer"],
    "VERTNIV": ["vertikalnivå", "Integer"],
    "VFLATE": ["delteigKlassifisering", "Integer"],
    "VFRADATO": ["veglenkeFraDato", "Date"],
    "VIKTIG": ["viktighet", "Integer"],
    "VINDRETN": ["vindretning", "Integer"],
    "VINKELENHET": ["vinkelenhet", "String"],
    "VIRKSOMHET": ["typeRastoffVirksomhet", "Integer"],
    "VISUELLTYDELIGHET": ["visuellTydelighet", "Integer"],
    "VKJORFLT": ["feltoversikt", "String"],
    "VKRETSNAVN": ["valgkretsnavn", "String"],
    "VKRETSNR": ["valgkretsnummer", "Integer"],
    "VLENKEID": ["veglenkeIdentifikasjon", "Integer"],
    "VOLUM_M3": ["rastoffVolum", "Integer"],
    "VOLUMENHET": ["volumenhet", "String"],
    "VOLUMINNSJØ": ["volumInnsjø", "Integer"],
    "VRAKTYP": ["vraktype", "Integer"],
    "VTILDATO": ["veglenkeTilDato", "Date"],
    "VURDERING": ["vurdering", "String"],
    "VURDERTDATO": ["vurdertDato", "Date"],
    "VÆSKETYPE": ["petroleumsvæsketype", "Integer"],
    "WRBKODE": ["WRBgruppe", "String"],
    "YTTERVEGG": ["yttervegg", "Integer"],
    "ØST": ["øst", "Integer"],
    "ÅPNESDATO": ["åpnesDato", "Date"],
    "ÅR": ["årstall", "Integer"],
    "ÅRSTIDBRUK": ["årstidbruk", "String"],
    "VEDTAKENDELIGPLANDATO": ["vedtakEndeligPlanDato", "Date"],
    "KUNNGJØRINGSDATO": ["kunngjøringsdato", "Date"],
    "KPBESTEMMELSEHJEMMEL": ["kpBestemmelseHjemmel", "Integer"],
    "RPBESTEMMELSEHJEMMEL": ["rpBestemmelseHjemmel", "Integer"],
    "CCDBRIKKELENGDE": ["ccdBrikkelengde", "Integer"],
    "CCDBRIKKESIDE": ["ccdBrikkeside", "Integer"],
    "BILDEOPPLØSNING": ["bildeoppløsning", "Real"],
    "BILDEFILFORMAT": ["bildefilformat", "Integer"],
    "STATLIGNR": ["statlignummer", "Integer"],
    "AEROTRIANGULERING": ["aerotriangulering", "Integer"],
    "PROSJEKTRAPPORTLINK": ["prosjektrapportlink", "String"],
    "BILDEFILIR": ["bildefilIr", "String"],
    "BILDEFILPAN": ["bildefilPan", "String"],
    "BILDEFILRGB": ["bildefilRGB", "String"],
    "BILDEFILMULTI": ["bildefilMulti", "String"],
    "ORTOFOTOTYPE": ["ortofototype", "Integer"],
    "KAMERALØPENUMMER": ["løpenummer", "Integer"],
    "PRODUKSJONSRAPPORTLINK": ["produksjonsrapportlink", "String"],
    "PRODUKTSPESIFIKASJONSLINK": ["produktspesifikasjonslink", "String"],
    "SAKSÅR": ["saksår", "Integer"],
    "SEKVENSNUMMER": ["sekvensnummer", "Integer"],
    "UTNTALL_MIN": ["utnyttingstall_minimum", "Real"],
    "GYLDIGTILDATO": ["gyldigTilDato", "Date"],
    "PIXELSTØRRELSE": ["pixelstørrelse", "Real"],
    "HENDELSESDATO": ["Hendelsesdato", "Date"],
    "NPPLANBESTEMMELSETYPE": ["planbestemmelsetype", "Integer"],
    "NPPLANTEMA": ["planTema", "Integer"],
    "FAGOMRÅDE_LINK": ["link til fagområde", "String"],
    "PRODUKT_LINK": ["produktLink", "String"],

    "ADRESSEBRUKSENHET": ["adresseBruksenhet", Array(3)],
    "ADRESSEKOMMENTAR": ["adresseKommentar", Array(5)],
    "ADRESSEREFERANSE": ["adresseReferanse", Array(2)],
    "ADRESSETILLEGG": ["adresseTillegg", Array(3)],
    "AID": ["gateadresseId", Array(3)],
    "AJOURFØRING": ["ajourføring", Array(2)],
    "AKVA_KONS_INFO": ["akvaKonsesjonsinformasjon", Array(7)],
    "AKVA_PRØVE_INFO": ["akvaPrøvetakinformasjon", Array(9)],
    "ANDEL": ["andel", Array(2)],
    "AREALFORDELING": ["arealfordeling", Array(5)],
    "BELASTNINGBOF5": ["belastningBOF5", Array(4)],
    "BELASTNINGFOSFOR": ["belastningFosfor", Array(4)],
    "BEREGNETAREAL": ["beregnetAreal", Array(2)],
    "BILDEINFORMASJON": ["bildeinformasjon", Array(3)],
    "BMARTOBS": ["bmArtsobservasjon", Array(4)],
    "BMARTREG": ["bmArtsregistrering", Array(8)],
    "BMKILDE": ["bmKilde", Array(2)],
    "BMNATYPTILLEGG": ["bmNaturtypeTillegg", Array(2)],
    "BRUKSENHET": ["bruksenhet", Array(10)],
    "BYDELID": ["bydelId", Array(2)],
    "BYGG_KOMMENTARER": ["bygningKommentar", Array(5)],
    "BYGN_STAT_HIST": ["bygningsstatusHistorikk", Array(3)],
    "BYGNING_TILLEGG": ["bygningTillegg", Array(15)],
    "BYGNINGSREF": ["bygningsreferanse", Array(2)],
    "DELOMRåDEID": ["delområdeId", Array(2)],
    "DPOT_GRAS": ["dyrkingpotensjalGras", Array(4)],
    "DPOT_KORN": ["dyrkingpotensjalKorn", Array(4)],
    "DPOT_POTET": ["dyrkingpotensjalPotet", Array(4)],
    "EKOORD": ["jordregisterEiendomsteigkoordinat", Array(3)],
    "ENDRINGSFLAGG": ["endringsflagg", Array(2)],
    "ENDRINGSVURDERING": ["endringsvurdering", Array(2)],
    "ETASJE": ["etasje", Array(8)],
    "ETASJEDATA": ["etasjedata", Array(6)],
    "FELTREGISTRERT": ["feltregistrert", Array(3)],
    "FIRMA_EIER": ["firmaeier", Array(7)],
    "FISKE_BEDR_ID": ["fiskebedriftsidentifikasjon", Array(6)],
    "FISKE_BEDR_INFO": ["fiskebedriftsinformasjon", Array(2)],
    "FISKE_BEDR_MARKED": ["fiskebedriftsmarked", Array(2)],
    "FISKE_BEDR_TJENESTE": ["fiskebedriftstjeneste", Array(3)],
    "FISKERI_REDSKAP": ["fiskeriredskap", Array(4)],
    "FISKERI_RESS_ART": ["fiskeriressursomrÃadeArt", Array(6)],
    "FISKERI_RESSURS": ["fiskeriressurs", Array(2)],
    "FMDATO": ["fastmerkeDato", Array(2)],
    "FMIDNY": ["fastmerkeIdNy", Array(4)],
    "FMSIGN": ["fastmerkeSignal", Array(2)],
    "FMSTATUS": ["fastmerkeStatus", Array(2)],
    "FMTYPE": ["fastmerkeType", Array(5)],
    "FORUR_GRUNN_EIENDOM": ["forurensetGrunnEiendom", Array(2)],
    "GRENSE_MELLOM": ["grenseMellomNasjonerSjÃ", Array(2)],
    "GRUNNKRETSID": ["grunnkretsId", Array(2)],
    "HAVNE_D_INFO": ["havnedistriktInformasjon", Array(2)],
    "HOVEDMåLRUBRIKK": ["hovedmålRubrikk", Array(2)],
    "HOVEDNR": ["landbruksregHovedNR", Array(1)],
    "HYTTEINFORMASJON": ["hytteinformasjon", Array(3)],
    "JORDTYPE": ["jordtype", Array(6)],
    "JREGMARK": ["jordregisterMarkslag", Array(10)],
    "JREGTEIG": ["jordregisterEiendomsteig", Array(4)],
    "KAI_INFO": ["kaiInformasjon", Array(3)],
    "KAMERAINFORMASJON": ["kamerainformasjon", Array(9)],
    "KM_DAT_INFO": ["kulturminneDateringInfo", Array(2)],
    "KM_DATERING": ["kulturminneDateringGruppe", Array(2)],
    "KOMMUNALKRETS": ["kommunalKrets", Array(4)],
    "KOPIDATA": ["kopidata", Array(3)],
    "KOPLING": ["koplingsegenskaper", Array(8)],
    "KURSLINJE_INFO": ["kurslinjeinformasjon", Array(4)],
    "KVALITET": ["kvalitet", Array(6)],
    "LEDNING": ["ledningsegenskaper", Array(8)],
    "LEGGEåR": ["leggeÅr", Array(2)],
    "LGID": ["landbruksregGrunneiendomNr", Array(8)],
    "MATRIKKELADRESSEID": ["matrikkeladresseId", Array(2)],
    "MATRIKKELNUMMER": ["matrikkelnummer", Array(5)],
    "OVERLAPP": ["overlapp", Array(2)],
    "POST": ["postadministrativeOmråder", Array(2)],
    "REGISTRERINGSVERSJON": ["registreringsversjon", Array(2)],
    "RESIPIENT": ["resipient", Array(5)],
    "RETNING": ["retningsvektor", Array(3)],
    "RØR_DIMENSJON": ["ledningsdimensjon", Array(2)],
    "SAK": ["saksinformasjon", Array(4)],
    "SEFRAK_ID": ["sefrakId", Array(3)],
    "SEFRAKFUNKSJON": ["sefrakFunksjon", Array(2)],
    "SENTRUMSSONEID": ["sentrumssoneId", Array(2)],
    "SERV": ["servituttgruppe", Array(3)],
    "SKRETSID": ["skolekretsID", Array(2)],
    "SP_ADM": ["skogbrplanAdmDataGruppe", Array(2)],
    "SP_AKLASS": ["skogbrplanKlassGruppe", Array(6)],
    "SP_BESTAND": ["skogbrplanBestandGruppe", Array(2)],
    "SP_BSKRIV": ["skogbrplanBeskrivBestandGruppe", Array(13)],
    "SP_FLBRELEM": ["skogbrplanFlerKoderGruppe", Array(5)],
    "SP_GRLVOL": ["skogbrplanGrunnlagVolBer", Array(8)],
    "SP_TEIG": ["skogbrplanTeigGruppe", Array(4)],
    "SP_TERKLASS": ["skogbrplanTerrengGruppe", Array(5)],
    "SP_TETTHOYD": ["skogbrplanTetthetGruppe", Array(2)],
    "SP_TILTAK": ["skogbrplanTiltakGruppe", Array(5)],
    "SP_TILVVOL": ["skogbrplanTilvekstGruppe", Array(4)],
    "SP_TRESL": ["skogbrplanTreslagGruppe", Array(8)],
    "TETTSTEDID": ["tettstedId", Array(2)],
    "UNIVERSELLUTFORMING": ["universellUtforming", Array(3)],
    "UTNYTT": ["utnytting", Array(2)],
    "UTSLIPP": ["utslipp", new Array(3)],
    "UTV_TILL_PART": ["utvinningstillatelsespartner", Array(2)],
    "VERN": ["vern", Array(4)],
    "VKRETS": ["valgkretsId", Array(2)],
    "VNR": ["vegident", Array(3)],
    "VPA": ["vegparsell", Array(3)]
};

sositypes["ADRESSEBRUKSENHET"][1][1] = ["etasjenummer", "Integer"];
sositypes["ADRESSEBRUKSENHET"][1][2] = ["etasjeplan", "String"];
sositypes["ADRESSEBRUKSENHET"][1][0] = ["bruksenhetLøpenr", "Integer"];
sositypes["ADRESSEKOMMENTAR"][1][0] = ["etat", "String"];
sositypes["ADRESSEKOMMENTAR"][1][2] = ["kommentar", "String"];
sositypes["ADRESSEKOMMENTAR"][1][1] = ["kommentarType", "String"];
sositypes["ADRESSEKOMMENTAR"][1][4] = ["lagretDato", "Date"];
sositypes["ADRESSEKOMMENTAR"][1][3] = ["saksnummer", "Integer"];
sositypes["ADRESSEREFERANSE"][1][1] = ["adresseReferansekode", "String"];
sositypes["ADRESSEREFERANSE"][1][0] = ["referanse", "String"];
sositypes["ADRESSETILLEGG"][1][1] = ["adresseKommentar", "String"];
sositypes["ADRESSETILLEGG"][1][2] = ["adresseReferanse", "String"];
sositypes["ADRESSETILLEGG"][1][0] = ["kartbladindeks", "String"];
sositypes["AID"][1][2] = ["bokstav", "String"];
sositypes["AID"][1][0] = ["gatenummer", "Integer"];
sositypes["AID"][1][1] = ["husnummer", "Integer"];
sositypes["AJOURFØRING"][1][1] = ["ajourførtAv", "String"];
sositypes["AJOURFØRING"][1][0] = ["ajourførtDato", "Date"];
sositypes["AKVA_KONS_INFO"][1][1] = ["akvaKonsesjonsnummer", "Integer"];
sositypes["AKVA_KONS_INFO"][1][4] = ["konsesjonsstatus", "String"];
sositypes["AKVA_KONS_INFO"][1][6] = ["konsesjonstype", "String"];
sositypes["AKVA_KONS_INFO"][1][5] = ["konsesjonsformål", "String"];
sositypes["AKVA_KONS_INFO"][1][0] = ["fiskebruksnummerFylke", "String"];
sositypes["AKVA_KONS_INFO"][1][2] = ["lokalitetsnavn", "String"];
sositypes["AKVA_KONS_INFO"][1][3] = ["lokalitetsnummer", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][7] = ["akvaTemperatur", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][1] = ["algekonsentrasjon", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][0] = ["algetype", "String"];
sositypes["AKVA_PRØVE_INFO"][1][5] = ["klorofyllMaksimum", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][8] = ["salinitet", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][6] = ["sikteDyp", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][2] = ["strømretning", "Integer"];
sositypes["AKVA_PRØVE_INFO"][1][4] = ["vindretning", "Integer"];
sositypes["ANDEL"][1][1] = ["nevner", "Real"];
sositypes["ANDEL"][1][0] = ["teller", "Real"];
sositypes["AREALFORDELING"][1][4] = ["prosentElv", "Real"];
sositypes["AREALFORDELING"][1][2] = ["prosentHav", "Real"];
sositypes["AREALFORDELING"][1][3] = ["prosentInnsjø", "Real"];
sositypes["AREALFORDELING"][1][1] = ["prosentLand", "Real"];
sositypes["AREALFORDELING"][1][0] = ["totalarealKm2", "Real"];
sositypes["BELASTNINGBOF5"][1][2] = ["andrekilderBelastning", "Integer"];
sositypes["BELASTNINGBOF5"][1][0] = ["husholdBelastning", "Integer"];
sositypes["BELASTNINGBOF5"][1][1] = ["industriBelastning", "Integer"];
sositypes["BELASTNINGBOF5"][1][3] = ["totalbelastning", "Integer"];
sositypes["BELASTNINGFOSFOR"][1][2] = ["andrekilderBelastning", "Integer"];
sositypes["BELASTNINGFOSFOR"][1][0] = ["husholdBelastning", "Integer"];
sositypes["BELASTNINGFOSFOR"][1][1] = ["industriBelastning", "Integer"];
sositypes["BELASTNINGFOSFOR"][1][3] = ["totalbelastning", "Integer"];
sositypes["BEREGNETAREAL"][1][0] = ["areal", "Real"];
sositypes["BEREGNETAREAL"][1][1] = ["arealmerknad", "String"];
sositypes["BILDEINFORMASJON"][1][1] = ["brennvidde", "Real"];
sositypes["BILDEINFORMASJON"][1][2] = ["fotograf", "String"];
sositypes["BILDEINFORMASJON"][1][0] = ["kameratype", "String"];
sositypes["BMARTOBS"][1][1] = ["bmAntall", "Integer"];
sositypes["BMARTOBS"][1][0] = ["bmArt", "String"];
sositypes["BMARTOBS"][1][2] = ["bmEnhet", "Integer"];
sositypes["BMARTOBS"][1][3] = ["bmRegistreringsdato", "Date"];
sositypes["BMARTREG"][1][6] = ["bmÅrstid", "Integer"];
sositypes["BMARTREG"][1][0] = ["bmArt", "String"];
sositypes["BMARTREG"][1][2] = ["bmOmrådefunksjon", "Integer"];
sositypes["BMARTREG"][1][5] = ["bmFunksjonskvalitet", "Integer"];
sositypes["BMARTREG"][1][7] = ["bmKilde", "String"];
sositypes["BMARTREG"][1][1] = ["bmRegistreringsdato", "Date"];
sositypes["BMARTREG"][1][3] = ["bmTruethetskategori", "String"];
sositypes["BMARTREG"][1][4] = ["bmViltvekt", "Integer"];
sositypes["BMKILDE"][1][1] = ["bmKildetype", "Integer"];
sositypes["BMKILDE"][1][0] = ["bmKildevurdering", "Integer"];
sositypes["BMNATYPTILLEGG"][1][1] = ["bmAndel", "Integer"];
sositypes["BMNATYPTILLEGG"][1][0] = ["bmNaturtype", "String"];
sositypes["BRUKSENHET"][1][7] = ["antallBad", "Integer"];
sositypes["BRUKSENHET"][1][6] = ["antallRom", "Integer"];
sositypes["BRUKSENHET"][1][8] = ["antallWC", "Integer"];
sositypes["BRUKSENHET"][1][5] = ["bruksareal", "Real"];
sositypes["BRUKSENHET"][1][4] = ["bruksenhetstype", "String"];
sositypes["BRUKSENHET"][1][2] = ["etasjenummer", "Integer"];
sositypes["BRUKSENHET"][1][1] = ["etasjeplan", "String"];
sositypes["BRUKSENHET"][1][9] = ["kjøkkenTilgang", "Integer"];
sositypes["BRUKSENHET"][1][3] = ["bruksenhetLøpenr", "Integer"];
sositypes["BRUKSENHET"][1][0] = ["matrikkelnummer", "String"];
sositypes["BYDELID"][1][0] = ["bydelsnavn", "String"];
sositypes["BYDELID"][1][1] = ["bydelsnummer", "Integer"];
sositypes["BYGG_KOMMENTARER"][1][3] = ["bygnSaksnr", "String"];
sositypes["BYGG_KOMMENTARER"][1][0] = ["etat", "String"];
sositypes["BYGG_KOMMENTARER"][1][2] = ["kommentar", "String"];
sositypes["BYGG_KOMMENTARER"][1][1] = ["kommentarType", "String"];
sositypes["BYGG_KOMMENTARER"][1][4] = ["lagretDato", "Date"];
sositypes["BYGN_STAT_HIST"][1][0] = ["bygningsstatus", "String"];
sositypes["BYGN_STAT_HIST"][1][1] = ["bygningshistorikkDato", "Date"];
sositypes["BYGN_STAT_HIST"][1][2] = ["registrertDato", "Date"];
sositypes["BYGNING_TILLEGG"][1][0] = ["alternativtArealBygning", "Real"];
sositypes["BYGNING_TILLEGG"][1][1] = ["antallEtasjer", "Integer"];
sositypes["BYGNING_TILLEGG"][1][2] = ["antallRøkløp", "Real"];
sositypes["BYGNING_TILLEGG"][1][3] = ["brenseltankNedgravd", "Integer"];
sositypes["BYGNING_TILLEGG"][1][14] = ["bygningKommentar", "String"];
sositypes["BYGNING_TILLEGG"][1][13] = ["bygningsreferanse", "String"];
sositypes["BYGNING_TILLEGG"][1][9] = ["fundamentering", "Integer"];
sositypes["BYGNING_TILLEGG"][1][12] = ["horisontalBærekonstr", "Integer"];
sositypes["BYGNING_TILLEGG"][1][5] = ["kartbladindeks", "String"];
sositypes["BYGNING_TILLEGG"][1][6] = ["kildePrivatVannforsyning", "Integer"];
sositypes["BYGNING_TILLEGG"][1][10] = ["materialeIYttervegg", "Integer"];
sositypes["BYGNING_TILLEGG"][1][7] = ["privatKloakkRensing", "Integer"];
sositypes["BYGNING_TILLEGG"][1][8] = ["renovasjon", "Integer"];
sositypes["BYGNING_TILLEGG"][1][4] = ["septiktank", "String"];
sositypes["BYGNING_TILLEGG"][1][11] = ["vertikalBærekonstr", "Integer"];
sositypes["BYGNINGSREF"][1][1] = ["bygningReferansetype", "String"];
sositypes["BYGNINGSREF"][1][0] = ["referanse", "String"];
sositypes["DELOMRåDEID"][1][0] = ["delområdenavn", "String"];
sositypes["DELOMRåDEID"][1][1] = ["delområdenummer", "String"];
sositypes["DPOT_GRAS"][1][2] = ["nedbørsbasert", "Integer"];
sositypes["DPOT_GRAS"][1][3] = ["nedklassifiseringNedbør", "Integer"];
sositypes["DPOT_GRAS"][1][0] = ["vanningsbasert", "Integer"];
sositypes["DPOT_GRAS"][1][1] = ["nedklassifiseringVanning", "Integer"];
sositypes["DPOT_KORN"][1][2] = ["nedbørsbasert", "Integer"];
sositypes["DPOT_KORN"][1][3] = ["nedklassifiseringNedbør", "Integer"];
sositypes["DPOT_KORN"][1][0] = ["vanningsbasert", "Integer"];
sositypes["DPOT_KORN"][1][1] = ["nedklassifiseringVanning", "Integer"];
sositypes["DPOT_POTET"][1][2] = ["nedbørsbasert", "Integer"];
sositypes["DPOT_POTET"][1][3] = ["nedklassifiseringNedbør", "Integer"];
sositypes["DPOT_POTET"][1][0] = ["vanningsbasert", "Integer"];
sositypes["DPOT_POTET"][1][1] = ["nedklassifiseringVanning", "Integer"];
sositypes["EKOORD"][1][2] = ["jordregisterKoordinatHøyde", "Integer"];
sositypes["EKOORD"][1][0] = ["jordregisterKoordinatNord", "Integer"];
sositypes["EKOORD"][1][1] = ["jordregisterKoordinatØst", "Integer"];
sositypes["ENDRINGSFLAGG"][1][1] = ["tidspunktEndring", "Date"];
sositypes["ENDRINGSFLAGG"][1][0] = ["typeEndring", "String"];
sositypes["ENDRINGSVURDERING"][1][0] = ["endringsgrad", "String"];
sositypes["ENDRINGSVURDERING"][1][1] = ["vurdertDato", "Date"];
sositypes["ETASJE"][1][2] = ["antallBoenheter", "Integer"];
sositypes["ETASJE"][1][4] = ["bruksarealTilAnnet", "Real"];
sositypes["ETASJE"][1][3] = ["bruksarealTilBolig", "Real"];
sositypes["ETASJE"][1][5] = ["bruksarealTotalt", "Real"];
sositypes["ETASJE"][1][1] = ["etasjenummer", "Integer"];
sositypes["ETASJE"][1][0] = ["etasjeplan", "String"];
sositypes["ETASJE"][1][6] = ["kommAlternativtAreal", "Real"];
sositypes["ETASJE"][1][7] = ["kommAlternativtAreal2", "Real"];
sositypes["ETASJEDATA"][1][4] = ["sumAlternativtAreal", "Real"];
sositypes["ETASJEDATA"][1][5] = ["sumAlternativtAreal2", "Real"];
sositypes["ETASJEDATA"][1][0] = ["sumAntallBoenheter", "Integer"];
sositypes["ETASJEDATA"][1][3] = ["sumBruksarealTotalt", "Real"];
sositypes["ETASJEDATA"][1][2] = ["sumBruksarealTilAnnet", "Real"];
sositypes["ETASJEDATA"][1][1] = ["sumBruksarealTilBolig", "Real"];
sositypes["FELTREGISTRERT"][1][2] = ["ajourføring", "String"];
sositypes["FELTREGISTRERT"][1][1] = ["datafangstdato", "Date"];
sositypes["FELTREGISTRERT"][1][0] = ["feltregistrertAv", "String"];
sositypes["FIRMA_EIER"][1][2] = ["adresse", "String"];
sositypes["FIRMA_EIER"][1][0] = ["firmanavn", "String"];
sositypes["FIRMA_EIER"][1][1] = ["bedriftseier", "String"];
sositypes["FIRMA_EIER"][1][6] = ["kontaktperson", "String"];
sositypes["FIRMA_EIER"][1][3] = ["postnummer", "Integer"];
sositypes["FIRMA_EIER"][1][5] = ["telefaxnummer", "Integer"];
sositypes["FIRMA_EIER"][1][4] = ["telefonnummer", "Integer"];
sositypes["FISKE_BEDR_ID"][1][4] = ["antallAnsatte", "Integer"];
sositypes["FISKE_BEDR_ID"][1][5] = ["antallÅrsverk", "Integer"];
sositypes["FISKE_BEDR_ID"][1][0] = ["fiskebedriftsnavn", "String"];
sositypes["FISKE_BEDR_ID"][1][2] = ["fiskebruksnummer", "Integer"];
sositypes["FISKE_BEDR_ID"][1][1] = ["fiskebruksnummerFylke", "String"];
sositypes["FISKE_BEDR_ID"][1][3] = ["firmaeier", "String"];
sositypes["FISKE_BEDR_INFO"][1][1] = ["artskode", "Integer"];
sositypes["FISKE_BEDR_INFO"][1][0] = ["fisketype", "Integer"];
sositypes["FISKE_BEDR_MARKED"][1][0] = ["fiskebedriftsandel", "Integer"];
sositypes["FISKE_BEDR_MARKED"][1][1] = ["fiskebedriftsområde", "Integer"];
sositypes["FISKE_BEDR_TJENESTE"][1][2] = ["fiskebedriftservice", "Integer"];
sositypes["FISKE_BEDR_TJENESTE"][1][1] = ["fiskekapasitetEnhet", "Integer"];
sositypes["FISKE_BEDR_TJENESTE"][1][0] = ["fiskekapasitet", "Integer"];
sositypes["FISKERI_REDSKAP"][1][0] = ["fiskeriredskapGenAktiv", "Integer"];
sositypes["FISKERI_REDSKAP"][1][1] = ["fiskeriredskapGenPassiv", "Integer"];
sositypes["FISKERI_REDSKAP"][1][2] = ["fiskeriredskapSpesAktiv", "Integer"];
sositypes["FISKERI_REDSKAP"][1][3] = ["fiskeriredskapSpesPassiv", "Integer"];
sositypes["FISKERI_RESS_ART"][1][3] = ["engelskArtsnavn", "String"];
sositypes["FISKERI_RESS_ART"][1][2] = ["vitenskapeligArtsnavn", "String"];
sositypes["FISKERI_RESS_ART"][1][1] = ["norskArtsnavn", "String"];
sositypes["FISKERI_RESS_ART"][1][0] = ["taksonomiskKode", "Integer"];
sositypes["FISKERI_RESS_ART"][1][4] = ["faoKode", "String"];
sositypes["FISKERI_RESS_ART"][1][5] = ["artskode", "Integer"];
sositypes["FISKERI_RESSURS"][1][0] = ["fiskeriressursområdeArt", "String"];
sositypes["FISKERI_RESSURS"][1][1] = ["periode", "String"];
sositypes["FMDATO"][1][1] = ["beregningsDato", "Date"];
sositypes["FMDATO"][1][0] = ["fastmerkeEtableringsdato", "Date"];
sositypes["FMIDNY"][1][1] = ["fastmerkeInstitusjon", "String"];
sositypes["FMIDNY"][1][0] = ["fastmerkeKommune", "Integer"];
sositypes["FMIDNY"][1][2] = ["fastmerkeNummer", "String"];
sositypes["FMIDNY"][1][3] = ["indikatorFastmerkenummer", "String"];
sositypes["FMSIGN"][1][1] = ["signalHøyde", "Real"];
sositypes["FMSIGN"][1][0] = ["signalType", "String"];
sositypes["FMSTATUS"][1][1] = ["typeStatus", "Integer"];
sositypes["FMSTATUS"][1][0] = ["verifiseringsdato", "Date"];
sositypes["FMTYPE"][1][0] = ["boltType", "Integer"];
sositypes["FMTYPE"][1][3] = ["fastmerkeDiameter", "Integer"];
sositypes["FMTYPE"][1][4] = ["gravertTekst", "String"];
sositypes["FMTYPE"][1][1] = ["materialeBolt", "Integer"];
sositypes["FMTYPE"][1][2] = ["fastmerkeUnderlag", "Integer"];
sositypes["FORUR_GRUNN_EIENDOM"][1][1] = ["arealbrukRestriksjon", "Integer"];
sositypes["FORUR_GRUNN_EIENDOM"][1][0] = ["matrikkelnummer", "String"];
sositypes["GRENSE_MELLOM"][1][0] = ["førsteLand", "String"];
sositypes["GRENSE_MELLOM"][1][1] = ["annetLand", "String"];
sositypes["GRUNNKRETSID"][1][1] = ["grunnkretsnavn", "String"];
sositypes["GRUNNKRETSID"][1][0] = ["grunnkretsnummer", "Integer"];
sositypes["HAVNE_D_INFO"][1][1] = ["havnedistriktAdministrasjon", "Integer"];
sositypes["HAVNE_D_INFO"][1][0] = ["kommune", "Integer"];
sositypes["HOVEDMåLRUBRIKK"][1][1] = ["bredde", "Integer"];
sositypes["HOVEDMåLRUBRIKK"][1][0] = ["lengde", "Integer"];
sositypes["HOVEDNR"][1][1] = [" kommunenummer", "Integer"];
sositypes["HOVEDNR"][1][0] = ["matrikkelnummer", "String"];
sositypes["HYTTEINFORMASJON"][1][1] = ["betjeningsgrad", "String"];
sositypes["HYTTEINFORMASJON"][1][0] = ["hytteId", "Integer"];
sositypes["HYTTEINFORMASJON"][1][2] = ["hytteeier", "Integer"];
sositypes["JORDTYPE"][1][0] = ["serie1", "String"];
sositypes["JORDTYPE"][1][2] = ["serie2", "String"];
sositypes["JORDTYPE"][1][4] = ["serie3", "String"];
sositypes["JORDTYPE"][1][1] = ["tekstur1", "String"];
sositypes["JORDTYPE"][1][3] = ["tekstur2", "String"];
sositypes["JORDTYPE"][1][5] = ["tekstur3", "String"];
sositypes["JREGMARK"][1][1] = ["potensiellSkogbonitetOmkodet", "Integer"];
sositypes["JREGMARK"][1][0] = ["arealtilstand", "Integer"];
sositypes["JREGMARK"][1][7] = ["jordregisterDyrkingsjord", "String"];
sositypes["JREGMARK"][1][6] = ["jordregisterFreg", "Integer"];
sositypes["JREGMARK"][1][5] = ["jordregisterLreg", "String"];
sositypes["JREGMARK"][1][3] = ["jordklassifikasjon", "Integer"];
sositypes["JREGMARK"][1][4] = ["myrklassifikasjon", "Integer"];
sositypes["JREGMARK"][1][8] = ["jordregisterSkogtype", "Integer"];
sositypes["JREGMARK"][1][9] = ["jordregisterSkogreisningsmark", "Integer"];
sositypes["JREGMARK"][1][2] = ["tilleggsopplysningerSkog", "Integer"];
sositypes["JREGTEIG"][1][2] = ["jordregisterDriftssenter", "Integer"];
sositypes["JREGTEIG"][1][3] = ["jordregisterStatusEiendom", "Integer"];
sositypes["JREGTEIG"][1][0] = ["matrikkelnummer", "String"];
sositypes["JREGTEIG"][1][1] = ["jordregisterEiendomTeigNummer", "Integer"];
sositypes["KAI_INFO"][1][1] = ["kaiDybde", "Real"];
sositypes["KAI_INFO"][1][0] = ["kaiType", "Integer"];
sositypes["KAI_INFO"][1][2] = ["kommunenummer", "Integer"];
sositypes["KAMERAINFORMASJON"][1][4] = ["bildekategori", "Integer"];
sositypes["KAMERAINFORMASJON"][1][3] = ["brennvidde", "Real"];
sositypes["KAMERAINFORMASJON"][1][7] = ["film", "String"];
sositypes["KAMERAINFORMASJON"][1][8] = ["kalibreringsrapport", "String"];
sositypes["KAMERAINFORMASJON"][1][1] = ["kameratype", "String"];
sositypes["KAMERAINFORMASJON"][1][0] = ["opptaksmetode", "Integer"];
sositypes["KM_DAT_INFO"][1][0] = ["sefrakTiltak", "Integer"];
sositypes["KM_DAT_INFO"][1][1] = ["tidsangivelse", "Integer"];
sositypes["KM_DATERING"][1][0] = ["kulturminneDatering", "String"];
sositypes["KM_DATERING"][1][1] = ["kulturminneDateringKvalitet", "String"];
sositypes["KOMMUNALKRETS"][1][3] = ["kretsnavn", "String"];
sositypes["KOMMUNALKRETS"][1][2] = ["kretsnummer", "String"];
sositypes["KOMMUNALKRETS"][1][0] = ["kretstypekode", "String"];
sositypes["KOMMUNALKRETS"][1][1] = ["kretstypenavn", "String"];
sositypes["KOPIDATA"][1][2] = ["kopidato", "Date"];
sositypes["KOPIDATA"][1][0] = ["områdeId", "Integer"];
sositypes["KOPIDATA"][1][1] = ["originalDatavert", "String"];
sositypes["KOPLING"][1][1] = ["fagområde", "Integer"];
sositypes["KOPLING"][1][4] = ["bruksområde", "String"];
sositypes["KOPLING"][1][2] = ["koplingskategori", "Integer"];
sositypes["KOPLING"][1][0] = ["koplingsnavn", "String"];
sositypes["KOPLING"][1][3] = ["koplingstype", "String"];
sositypes["KOPLING"][1][7] = ["bildelink", "String"];
sositypes["KOPLING"][1][5] = ["materiellkode", "String"];
sositypes["KOPLING"][1][6] = ["verdi", "Integer"];
sositypes["KURSLINJE_INFO"][1][0] = ["fartøyIdentifikasjon", "String"];
sositypes["KURSLINJE_INFO"][1][1] = ["satellittkommunikasjonsId", "String"];
sositypes["KURSLINJE_INFO"][1][3] = ["sporhastighet", "Integer"];
sositypes["KURSLINJE_INFO"][1][2] = ["tidspunkt", "Date"];
sositypes["KVALITET"][1][3] = ["målemetodeHøyde", "Integer"];
sositypes["KVALITET"][1][4] = ["nøyaktighetHøyde", "Integer"];
sositypes["KVALITET"][1][5] = ["maksimaltAvvik", "Integer"];
sositypes["KVALITET"][1][0] = ["målemetode", "Integer"];
sositypes["KVALITET"][1][1] = ["nøyaktighet", "Integer"];
sositypes["KVALITET"][1][2] = ["synbarhet", "Integer"];
sositypes["LEDNING"][1][1] = ["fagområde", "Integer"];
sositypes["LEDNING"][1][3] = ["bruksområde", "String"];
sositypes["LEDNING"][1][0] = ["ledningsnavn", "String"];
sositypes["LEDNING"][1][2] = ["ledningstype", "Integer"];
sositypes["LEDNING"][1][7] = ["leggeår", "String"];
sositypes["LEDNING"][1][6] = ["lengde", "Real"];
sositypes["LEDNING"][1][5] = ["materiellkode", "String"];
sositypes["LEDNING"][1][4] = ["nettnivå", "String"];
sositypes["LEGGEåR"][1][0] = ["alderReferanse", "Integer"];
sositypes["LEGGEåR"][1][1] = ["årstall", "Integer"];
sositypes["LGID"][1][7] = ["landbruksregAktiv", "Integer"];
sositypes["LGID"][1][6] = ["landbruksregType", "Integer"];
sositypes["LGID"][1][0] = ["matrikkelnummer", "String"];
sositypes["MATRIKKELADRESSEID"][1][0] = ["matrikkelnummer", "String"];
sositypes["MATRIKKELADRESSEID"][1][1] = ["undernr", "Integer"];
sositypes["MATRIKKELNUMMER"][1][2] = ["bruksnummer", "Integer"];
sositypes["MATRIKKELNUMMER"][1][3] = ["festenummer", "Integer"];
sositypes["MATRIKKELNUMMER"][1][1] = ["gårdsnummer", "Integer"];
sositypes["MATRIKKELNUMMER"][1][0] = ["matrikkelkommune", "Integer"];
sositypes["MATRIKKELNUMMER"][1][4] = ["seksjonsnummer", "Integer"];
sositypes["OVERLAPP"][1][0] = ["lengdeoverlapp", "Integer"];
sositypes["OVERLAPP"][1][1] = ["sideoverlapp", "Integer"];
sositypes["POST"][1][1] = ["poststedsnavn", "String"];
sositypes["POST"][1][0] = ["postnummer", "Integer"];
sositypes["REGISTRERINGSVERSJON"][1][0] = ["produkt", "String"];
sositypes["REGISTRERINGSVERSJON"][1][1] = ["versjon", "String"];
sositypes["RESIPIENT"][1][2] = ["fjordId", "String"];
sositypes["RESIPIENT"][1][0] = ["resipientnavn", "String"];
sositypes["RESIPIENT"][1][4] = ["resipienttype", "String"];
sositypes["RESIPIENT"][1][1] = ["vassdragsnummer", "String"];
sositypes["RESIPIENT"][1][3] = ["vatnLøpenummer", "Integer"];
sositypes["RETNING"][1][1] = ["retningsenhet", "Integer"];
sositypes["RETNING"][1][2] = ["retningsreferanse", "Integer"];
sositypes["RETNING"][1][0] = ["retningsverdi", "Real"];
sositypes["RØR_DIMENSJON"][1][1] = ["lengdeenhet", "String"];
sositypes["RØR_DIMENSJON"][1][0] = ["måltall", "Real"];
sositypes["SAK"][1][3] = ["vedtaksmyndighet", "String"];
sositypes["SAK"][1][0] = ["saksnummer", "Integer"];
sositypes["SAK"][1][2] = ["utvalgssaksnummer", "Integer"];
sositypes["SAK"][1][1] = ["vedtaksdato", "Date"];
sositypes["SEFRAK_ID"][1][2] = ["husLøpenr", "Integer"];
sositypes["SEFRAK_ID"][1][1] = ["registreringKretsnr", "Integer"];
sositypes["SEFRAK_ID"][1][0] = ["SEFRAKkommune", "Integer"];
sositypes["SEFRAKFUNKSJON"][1][0] = ["sefrakFunksjonskode", "Integer"];
sositypes["SEFRAKFUNKSJON"][1][1] = ["sefrakFunksjonsstatus", "String"];
sositypes["SENTRUMSSONEID"][1][1] = ["sentrumssonenavn", "String"];
sositypes["SENTRUMSSONEID"][1][0] = ["sentrumssonenummer", "Integer"];
sositypes["SERV"][1][2] = ["informasjon", "String"];
sositypes["SERV"][1][0] = ["matrikkelnummer", "String"];
sositypes["SERV"][1][1] = ["servituttType", "String"];
sositypes["SKRETSID"][1][1] = ["skolekretsnavn", "String"];
sositypes["SKRETSID"][1][0] = ["skolekretsnummer", "Integer"];
sositypes["SP_ADM"][1][0] = ["skogbrplanAdmDatoEndring", "Date"];
sositypes["SP_ADM"][1][1] = ["skogbrplanAdmDatoEtablering", "Date"];
sositypes["SP_AKLASS"][1][0] = ["skogbrplanKlassAktueltTreslag", "Integer"];
sositypes["SP_AKLASS"][1][1] = ["skogbrplanKlassAktSnittBon", "Integer"];
sositypes["SP_AKLASS"][1][3] = ["skogbrplanKlassImpProsent", "Integer"];
sositypes["SP_AKLASS"][1][2] = ["skogbrplanKlassImpType", "Integer"];
sositypes["SP_AKLASS"][1][4] = ["skogbrplanKlassPotTreslag", "Integer"];
sositypes["SP_AKLASS"][1][5] = ["skogbrplanKlassPotSnittBon", "Integer"];
sositypes["SP_BESTAND"][1][1] = ["skogbrplanBestandDelNr", "Integer"];
sositypes["SP_BESTAND"][1][0] = ["skogbrplanBestandNr", "Integer"];
sositypes["SP_BSKRIV"][1][2] = ["skogbrplanBeskrivBestandAlder", "Integer"];
sositypes["SP_BSKRIV"][1][3] = ["skogbrplanBeskrivBestandDaa", "Real"];
sositypes["SP_BSKRIV"][1][6] = ["skogbrplanBeskrivBestSnittDiam", "Integer"];
sositypes["SP_BSKRIV"][1][4] = ["skogbrplanBeskrivBestandSnittM2", "Integer"];
sositypes["SP_BSKRIV"][1][5] = ["skogbrplanBeskrivBestandSnittH", "Real"];
sositypes["SP_BSKRIV"][1][7] = ["skogbrplanBeskrivBarHøydehkl2", "Integer"];
sositypes["SP_BSKRIV"][1][0] = ["skogbrplanBeskrivHogstklasse", "Integer"];
sositypes["SP_BSKRIV"][1][8] = ["skogbrplanBeskrivLauvHøydehkl2", "Integer"];
sositypes["SP_BSKRIV"][1][9] = ["skogbrplanBeskrivSjiktning", "Integer"];
sositypes["SP_BSKRIV"][1][1] = ["skogbrplanBeskrivSkogtype", "Integer"];
sositypes["SP_BSKRIV"][1][10] = ["skogbrplanBeskrivSunnhet", "Integer"];
sositypes["SP_BSKRIV"][1][11] = ["skogbrplanBeskrivTreERegulering", "Integer"];
sositypes["SP_BSKRIV"][1][12] = ["skogbrplanBeskrivTreFRegulering", "Integer"];
sositypes["SP_FLBRELEM"][1][0] = ["skogbrplanFlerKoderElementtype", "Integer"];
sositypes["SP_FLBRELEM"][1][1] = ["skogbrplanFlerKoderArealProsent", "Integer"];
sositypes["SP_FLBRELEM"][1][2] = ["skogbrplanFlerKoderArealDaa", "Integer"];
sositypes["SP_FLBRELEM"][1][3] = ["skogbrplanFlerKoderSpesBehPros", "Integer"];
sositypes["SP_FLBRELEM"][1][4] = ["skogbrplanFlerKoderSpesBehDaa", "Integer"];
sositypes["SP_GRLVOL"][1][3] = ["skogbrplanGrunnlagVolumDaaFelt", "Real"];
sositypes["SP_GRLVOL"][1][4] = ["skogbrplanGrunnlagVolumBestFelt", "Integer"];
sositypes["SP_GRLVOL"][1][0] = ["skogbrplanGrunnlagBerType", "Integer"];
sositypes["SP_GRLVOL"][1][2] = ["skogbrplanGrunnlagHovedgruppe", "Integer"];
sositypes["SP_GRLVOL"][1][6] = ["skogbrplanGrunnlagRegion", "Integer"];
sositypes["SP_GRLVOL"][1][5] = ["skogbrplanGrunnlagSvinnProsent", "Integer"];
sositypes["SP_GRLVOL"][1][1] = ["skogbrplanGrunnlagTaksttype", "Integer"];
sositypes["SP_GRLVOL"][1][7] = ["skogbrplanGrunnlagTilvekstkorr", "Integer"];
sositypes["SP_TEIG"][1][3] = ["matrikkelnummer", "String"];
sositypes["SP_TEIG"][1][2] = ["skogbrplanTeigGrend", "Integer"];
sositypes["SP_TEIG"][1][0] = ["skogbrplanTeigNr", "Integer"];
sositypes["SP_TEIG"][1][1] = ["skogbrplanTeigNavn", "String"];
sositypes["SP_TERKLASS"][1][0] = ["skogbrplanTerrengBæreevneBestand", "Integer"];
sositypes["SP_TERKLASS"][1][1] = ["skogbrplanTerrengBestandBratthet", "Integer"];
sositypes["SP_TERKLASS"][1][2] = ["skogbrplanTerrengLiLengde", "Integer"];
sositypes["SP_TERKLASS"][1][3] = ["skogbrplanTerrengMinTranspUtst", "Integer"];
sositypes["SP_TERKLASS"][1][4] = ["skogbrplanTerrengJevnhet", "Integer"];
sositypes["SP_TETTHOYD"][1][0] = ["skogbrplanTetthetGrunnflatesum", "Integer"];
sositypes["SP_TETTHOYD"][1][1] = ["skogbrplanTetthetMHøyde", "Integer"];
sositypes["SP_TILTAK"][1][3] = ["skogbrplanTiltakProritet", "Integer"];
sositypes["SP_TILTAK"][1][1] = ["skogbrplanTiltakProsent", "Integer"];
sositypes["SP_TILTAK"][1][4] = ["skogbrplanTiltakAreal", "Real"];
sositypes["SP_TILTAK"][1][0] = ["skogbrplanTiltakBestand", "Integer"];
sositypes["SP_TILTAK"][1][2] = ["skogbrplanTiltakÅr", "Integer"];
sositypes["SP_TILVVOL"][1][0] = ["skogbrplanTilvekstBeregnDaa", "Real"];
sositypes["SP_TILVVOL"][1][1] = ["skogbrplanTilvekstBeregnProsent", "Real"];
sositypes["SP_TILVVOL"][1][2] = ["skogbrplanTilvekstBeregnM3", "Real"];
sositypes["SP_TILVVOL"][1][3] = ["skogbrplanTilvekstVolumBestand", "Integer"];
sositypes["SP_TRESL"][1][4] = ["skogbrplanTreslagAntTreDaaEReg", "Integer"];
sositypes["SP_TRESL"][1][3] = ["skogbrplanTreslagAntTreDaaFReg", "Integer"];
sositypes["SP_TRESL"][1][0] = ["skogbrplanTreslag", "Integer"];
sositypes["SP_TRESL"][1][1] = ["skogbrplanTreslagHøyde", "Integer"];
sositypes["SP_TRESL"][1][2] = ["skogbrplanTreslagProsent", "Integer"];
sositypes["SP_TRESL"][1][5] = ["skogbrplanTreslagKorrVolumUBark", "Integer"];
sositypes["SP_TRESL"][1][7] = ["skogbrplanTreslagSalgsvolumUBark", "Integer"];
sositypes["SP_TRESL"][1][6] = ["skogbrplanTreslagUkorrVolumUBark", "Integer"];
sositypes["TETTSTEDID"][1][1] = ["tettstednavn", "String"];
sositypes["TETTSTEDID"][1][0] = ["tettstednummer", "Integer"];
sositypes["UNIVERSELLUTFORMING"][1][2] = ["informasjon", "String"];
sositypes["UNIVERSELLUTFORMING"][1][0] = ["tilgjengelighetsvurdering", "String"];
sositypes["UNIVERSELLUTFORMING"][1][1] = ["universellutformingFasilitet", "String"];
sositypes["UTNYTT"][1][1] = ["utnyttingstall", "Real"];
sositypes["UTNYTT"][1][0] = ["utnyttingstype", "Integer"];
sositypes["UTSLIPP"][1][0] = ["komponent", "String"];
sositypes["UTSLIPP"][1][1] = ["massestørrelse", "String"];
sositypes["UTSLIPP"][1][2] = ["utslippType", "String"];
sositypes["UTV_TILL_PART"][1][1] = ["petroleumsandel", "Real"];
sositypes["UTV_TILL_PART"][1][0] = ["petroleumspartnere", "String"];
sositypes["VERN"][1][0] = ["vernelov", "String"];
sositypes["VERN"][1][1] = ["verneparagraf", "String"];
sositypes["VERN"][1][3] = ["vernedato", "Date"];
sositypes["VERN"][1][2] = ["vernetype", "String"];
sositypes["VKRETS"][1][1] = ["valgkretsnavn", "String"];
sositypes["VKRETS"][1][0] = ["valgkretsnummer", "Integer"];
sositypes["VNR"][1][0] = ["vegkategori", "String"];
sositypes["VNR"][1][2] = ["vegnummer", "Integer"];
sositypes["VNR"][1][1] = ["vegstatus", "String"];
sositypes["VPA"][1][0] = ["hovedParsell", "Integer"];
sositypes["VPA"][1][1] = ["veglenkeMeterFra", "Integer"];
sositypes["VPA"][1][2] = ["veglenkeMeterTil", "Integer"];
window.SOSI.types = sositypes;
