var SOSI = window.SOSI || {};

/**
 * This is adopted from backbone.js which
 * is available for use under the MIT software license.
 * see http://github.com/jashkenas/backbone/blob/master/LICENSE
 */
(function (ns, undefined) {
    "use strict";

    ns.Base = function () {
        this.initialize.apply(this, arguments);
    };

    _.extend(ns.Base.prototype, {
        initialize: function () {}
    });

    ns.Base.extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }
            _.extend(child, parent, staticProps);
        var Surrogate = function () { this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }
        child.__super__ = parent.prototype;

        return child;
    };

}(SOSI));;/* automatic conversion from sosi.h - TODO convert to single json object */
var sositypes = window.SOSI.types || {};

sositypes["ADM_GRENSE"]=["administrativGrense", "String"];

sositypes["ADRESSE"]=["adresse", "String"];

sositypes["ADRESSEREFKODE"]=["adresseReferansekode", "String"];

sositypes["AJOURFØRTAV"]=["ajourførtAv", "String"];

sositypes["AJOURFØRTDATO"]=["ajourførtDato", "Date"];
sositypes["DATO"]=["Dato", "Date"];

sositypes["AKGEOLTEMA"]=["annetKvTema", "Integer"];

sositypes["AKVA_ART"]=["akvaArt", "Integer"];

sositypes["AKVA_ENHET"]=["akvaEnhet", "Integer"];

sositypes["AKVA_KONSTR"]=["akvaKonstruksjon", "Integer"];

sositypes["AKVA_NR"]=["akvaKonsesjonsnummer", "Integer"];

sositypes["AKVA_STATUS"]=["akvaKonsesjonsstatus", "String"];

sositypes["AKVA_TYPE"]=["akvaKonsesjonstype", "String"];

sositypes["AKVAKONSESJONSFORMÅL"]=["akvaKonsesjonsformål", "String"];

sositypes["AKVATEMP"]=["akvaTemperatur", "Integer"];

sositypes["AKVSYMBOL"]=["andreKvSymbol", "Integer"];

sositypes["ALDERBESKRIVELSE"]=["alderBeskrivelse", "String"];

sositypes["ALGE_KONS"]=["algeKonsentrasjon", "Integer"];

sositypes["ALGE_TYP"]=["algeType", "String"];

sositypes["ALM-TYP"]=["allmenningtype", "String"];

sositypes["ALT_AREALBYGNING"]=["alternativtArealBygning", "Real"];

sositypes["ALTERN_FNR"]=["altForekomstNr", "String"];

sositypes["ALTERNATIVTNAVN"]=["alternativtNavn", "String"];

sositypes["ANBELINTYP"]=["annenBergartLinjetype", "Integer"];

sositypes["ANDREKILDERBELASTNING"]=["andrekilderBelastning", "Integer"];

sositypes["ANKRINGSBRUK"]=["ankringsbruk", "Integer"];

sositypes["ANKRTYP"]=["ankringstype", "Integer"];

sositypes["ANLEGGNØDSTRØM"]=["anleggNødstrøm", "String"];

sositypes["ANLEGGSNUMMER"]=["anleggsnummer", "String"];

sositypes["ANNEN_VANNB_ELEK"]=["annenVannbehandlingAvhElektrisitet", "String"];

sositypes["ANNENLUFTHAVN"]=["annenLufthavn", "Integer"];

sositypes["ANNENMATRENHET"]=["annenMatrEnhet", "String"];

sositypes["ANT_ANALYS"]=["antallAnalyser", "Integer"];

sositypes["ANT_ANS"]=["antallAnsatte", "Integer"];

sositypes["ANT_ÅRSV"]=["antallÅrsverk", "Integer"];

sositypes["ANTALL_BAD"]=["antallBad", "Integer"];

sositypes["ANTALL_BOENHETER"]=["antallBoenheter", "Integer"];

sositypes["ANTALL_ETASJER"]=["antall etasjer", "Integer"];

sositypes["ANTALL_ROM"]=["antallRom", "Integer"];

sositypes["ANTALL_RØKLØP"]=["antallRøkløp", "Real"];

sositypes["ANTALL_WC"]=["antallWC", "Integer"];

sositypes["ANTALLFASTBOENDE"]=["antallFastboende", "Integer"];

sositypes["ANTALLFRITIDSBOLIGER"]=["antallFritidsboliger", "Integer"];

sositypes["ANTALLIDENTISKELYS"]=["antallIdentiskeLys", "Integer"];

sositypes["ANTALLSKISPOR"]=["antallSkispor", "Integer"];

sositypes["ANTALLSKORSTEINER"]=["antallSkorsteiner", "Integer"];

sositypes["ANTDRIFT"]=["landbruksregAntBedrifter", "Integer"];

sositypes["ARAVGRTYPE"]=["arealressursAvgrensingType", "Integer"];

sositypes["ARDYRKING"]=["arealressursDyrkbarjord", "Integer"];

sositypes["AREAL"]=["areal", "Real"];

sositypes["AREALBRUK_RESTR"]=["arealbrukRestriksjon", "Integer"];

sositypes["AREALENHET"]=["arealenhet", "String"];

sositypes["AREALINNSJØ"]=["arealInnsjø", "Real"];

sositypes["AREALKILDE"]=["arealkilde", "Integer"];

sositypes["AREALMERKNAD"]=["arealmerknad", "String"];

sositypes["AREALNEDBØRFELT"]=["arealNedbørfelt", "String"];

sositypes["AREALREGINE"]=["arealRegine", "Real"];

sositypes["AREALST"]=["arealbruksstatus", "Integer"];

sositypes["AREALVERDI_IND"]=["arealverdiindikator", "String"];

sositypes["ARENKEL"]=["arealressursGruppertEnkel", "Integer"];

sositypes["ARGRUNNF"]=["arealressursGrunnforhold", "Integer"];

sositypes["ARKARTSTD"]=["arealressursKartstandard", "String"];

sositypes["ARNFJBRUK"]=["arealressursNaturgrunnlagForJordbruk", "Integer"];

sositypes["ARSKOGBON"]=["arealressursSkogbonitet", "Integer"];

sositypes["ART_ENGELSK"]=["engelskArtsnavn", "String"];

sositypes["ART_LATIN"]=["vitenskapeligArtsnavn", "String"];

sositypes["ART_NORSK"]=["norskArtsnavn", "String"];

sositypes["ART_TAKSONOMI"]=["taksonomiskKode", "Integer"];

sositypes["ARTRESLAG"]=["arealressursTreslag", "Integer"];

sositypes["ARTYPE"]=["arealressursArealtype", "Integer"];

sositypes["ARUTETYPE"]=["annenRutetype", "String"];

sositypes["ARVANLIG"]=["arealressursGruppertVanlig", "Integer"];

sositypes["ARVEGET"]=["arealressursVegetasjonsdekke", "Integer"];

sositypes["ASKOG"]=["potensiellSkogbonitet", "Integer"];

sositypes["ATIL"]=["arealtilstand", "Integer"];

sositypes["AVFALLSDEP"]=["avfallDeponiEgnethet", "Integer"];

sositypes["AVFALLTYPE"]=["avfallType", "Integer"];

sositypes["AVGIFTSBELAGT"]=["avgiftsbelagt", "String"];

sositypes["AVGJDATO"]=["avgjørelsesdato", "Date"];

sositypes["AVGRENSNINGSTYPE"]=["avgrensningstype", "Integer"];

sositypes["AVKJ"]=["avkjørselsbestemmelse", "Integer"];

sositypes["AVKLARTEIERE"]=["avklartEiere", "String"];

sositypes["AVLØP"]=["avløp", "Integer"];

sositypes["AVLØP_TILKNYTNING"]=["tilknyttetKommunaltAvløp", "String"];

sositypes["AVLØPINNSJØ"]=["avløpInnsjø", "Real"];

sositypes["AVLØPRENSEPRINSIPP"]=["avløpRenseprinsipp", "String"];

sositypes["AVLØPSANLEGGEIERFORM"]=["avløpsanleggEierform", "Integer"];

sositypes["AVLØPSANLEGGTYPE"]=["avløpsanleggtype", "Integer"];

sositypes["AVSETNING"]=["avsetningstype", "Integer"];

sositypes["AVSETNRATE"]=["avsetnRate", "String"];

sositypes["BAKKEOPPLØSNING"]=["bakkeoppløsning", "Real"];

sositypes["BARMARKSLØYPETYPE"]=["barmarksløypeType", "String"];

sositypes["BEALDERBST"]=["bergartAlderBestemmelse", "String"];

sositypes["BEBYGD_AREAL"]=["bebygdAreal", "Real"];

sositypes["BEFARGEKO"]=["cmykFargekode", "String"];

sositypes["BEHSTAT"]=["behandlingsstatus", "Integer"];

sositypes["BEITEBRUKERID"]=["reinbeitebrukerID", "String"];

sositypes["BEITETID"]=["beitetid", "String"];

sositypes["BEITETIDVEDTAK"]=["beitetidVedtak", "String"];

sositypes["BEKJSAMSET"]=["bergartKjemiskSammensetning", "String"];

sositypes["BEKORNSTR"]=["bergartKornstørrelse", "String"];

sositypes["BELIGG"]=["omgivelsetypeTraséseksjon", "Integer"];

sositypes["BELIGGENHET"]=["beliggenhet", "String"];

sositypes["BELYSNING"]=["belysning", "String"];

sositypes["BEREGNET"]=["beregningsDato", "Date"];

sositypes["BEREGNETÅR"]=["beregnetÅr", "String"];

sositypes["BERGFARGE"]=["bergartFarge", "String"];

sositypes["BERGGRENSETYPE"]=["berggrunnGrensetype", "Integer"];

sositypes["BESK_ELEMENT"]=["beskrivelseElement", "String"];

sositypes["BESKRIV"]=["tiltaksbeskrivelse", "String"];

sositypes["BESKRIVELSE"]=["beskrivelse", "String"];

sositypes["BESTEMMELSEOMRNAVN"]=["bestemmelseOmrådeNavn", "String"];

sositypes["BESTRUKTUR"]=["bergartStruktur", "String"];

sositypes["BESYMBOLTY"]=["bergartSymbol", "Integer"];

sositypes["BETEKSTUR"]=["bergartTekstur", "String"];

sositypes["BETJENINGSGRAD"]=["betjeningsgrad", "String"];

sositypes["BILDE-BIT-PIXEL"]=["bitsPerPixel", "Integer"];

sositypes["BILDE-FIL"]=["bildeFil", "String"];

sositypes["PLANPÅSKRIFTTYPE"]=["planpåskriftype", "Integer"];

sositypes["BILDEKATEGORI"]=["bildekategori", "Integer"];

sositypes["BILDEMÅLESTOKK"]=["bildemålestokk", "Integer"];

sositypes["BILDENUMMER"]=["bildenummer", "Integer"];

sositypes["BILDE-SYS"]=["bildeSystem", "Integer"];

sositypes["BILDE-TYPE"]=["bildeType", "String"];

sositypes["BILDE-UNDERTYPE"]=["bildeUndertype", "String"];

sositypes["BISPENUMMER"]=["bispenummer", "Integer"];

sositypes["BKLASSIFIK"]=["berggrunnKlassifikasjon", "Integer"];

sositypes["BLOKK"]=["steinOgBlokk", "String"];

sositypes["BLOKKAREAL"]=["blokkareal", "Real"];

sositypes["BMANDEL"]=["bmAndel", "Integer"];

sositypes["BMANTALL"]=["bmAntall", "Integer"];

sositypes["BMARSTID"]=["bmÅrstid", "Integer"];

sositypes["BMART"]=["bmArt", "String"];

sositypes["BMENHET"]=["bmEnhet", "Integer"];

sositypes["BMFUNK"]=["bmOmrådefunksjon", "Integer"];

sositypes["BMFUNKVAL"]=["bmFunksjonskvalitet", "Integer"];

sositypes["BMKILDTYP"]=["bmKildetype", "Integer"];

sositypes["BMKILDVURD"]=["bmKildevurdering", "Integer"];

sositypes["BMNATYP"]=["bmNaturtype", "String"];

sositypes["BMNATYPMARIN"]=["bmNaturtypeMarin", "String"];

sositypes["BMNATYPMARINUTF"]=["bmNaturtypeMarinUtforming", "String"];

sositypes["BMNATYPUTF"]=["bmNaturtypeUtforming", "String"];

sositypes["BMREGDATO"]=["bmRegistreringsdato", "Date"];

sositypes["BMTRUETKAT"]=["bmTruethetskategori", "String"];

sositypes["BMVERDI"]=["bmVerdi", "String"];

sositypes["BMVILTVEKT"]=["bmViltvekt", "Integer"];

sositypes["BNR"]=["bruksnummer", "Integer"];

sositypes["BOKST"]=["bokstav", "String"];

sositypes["BOLTTYPE"]=["boltType", "Integer"];

sositypes["BOREDAGER"]=["antallBoredager", "Integer"];

sositypes["BOREDATO"]=["boredato", "Date"];

sositypes["BOREDYP"]=["boredyp", "Real"];

sositypes["BOREFIRMA"]=["borefirma", "String"];

sositypes["BOREINNRETN"]=["boreinnretningsnavn", "String"];

sositypes["BORESLUTT"]=["boreslutt", "Date"];

sositypes["BORESTART"]=["borestart", "Date"];

sositypes["BORETYPE"]=["boringType", "Integer"];

sositypes["BORHELNING"]=["gfborehHelning", "Integer"];

sositypes["BORHULLNR"]=["borhullNummer", "String"];

sositypes["BORLENGDE"]=["gfborehLengde", "Real"];

sositypes["BORRETNING"]=["gfborehRetning", "Integer"];

sositypes["BOT_OK_INT"]=["botaniskØkologiskInteresse", "String"];

sositypes["BRANSJE"]=["bransje", "String"];

sositypes["BREDDE"]=["trasébredde", "Integer"];

sositypes["BRENNVIDDE"]=["brennvidde", "Real"];

sositypes["BRENSELTANKNEDGR"]=["brenseltankNedgravd", "Integer"];

sositypes["BRETYPE"]=["bretype", "Integer"];

sositypes["BRUDDLENGDE"]=["bruddlengde", "Real"];

sositypes["BRUEIER"]=["brueier", "String"];

sositypes["BRUK_GRAD"]=["kulturlandskapBrukGrad", "String"];

sositypes["BRUKONSTRTYPE"]=["brukonstruksjonstype", "String"];

sositypes["BRUKSAREAL"]=["bruksareal", "Real"];

sositypes["BRUKSAREALANNET"]=["bruksarealTilAnnet", "Real"];

sositypes["BRUKSAREALBOLIG"]=["bruksarealTilBolig", "Real"];

sositypes["BRUKSAREALTOTALT"]=["bruksarealTotalt", "Real"];

sositypes["BRUKSENHETSTYPE"]=["bruksenhetstype", "String"];

sositypes["BRUKSFREKVENS"]=["friluftsområdeBruksfrekvens", "Integer"];

sositypes["BRUKSNAVN"]=["bruksnavn", "String"];

sositypes["BRUMATERIAL"]=["brumaterial", "String"];

sositypes["BRUOVERBRU"]=["bruOverBru", "String"];

sositypes["BRUTRAFIKKTYPE"]=["brutrafikktype", "String"];

sositypes["BRUÅPNING"]=["bruåpningsmåte", "String"];

sositypes["BRØNN_REGNR"]=["brønnRegNr", "Integer"];

sositypes["BRØNN_RESULTAT"]=["brønnresultat", "String"];

sositypes["BRØNNKLASSE"]=["petroleumsbrønnklasse", "String"];

sositypes["BRØNNTYPE"]=["petroleumsbrønntype", "String"];

sositypes["BRØYTEAREALTILGANG"]=["brøytearealtilgang", "Integer"];

sositypes["BRØYTEAREALTYPE"]=["brøytearealtype", "Integer"];

sositypes["BRØYTEBREDDE"]=["brøytebredde", "Integer"];

sositypes["BRØYTEPRIORITET"]=["brøyteprioritet", "String"];

sositypes["BRØYTERESTRIKSJON"]=["brøyterestriksjon", "String"];

sositypes["BRØYTESIDE"]=["brøyteside", "String"];

sositypes["BRØYTETYPE"]=["brøytetype", "String"];

sositypes["BUNNTYP"]=["bunntype", "String"];

sositypes["BUNNTYPE"]=["bunntype", "Integer"];

sositypes["BYDELSNAVN"]=["bydelsnavn", "String"];

sositypes["BYDELSNUMMER"]=["bydelsnummer", "Integer"];

sositypes["BYGGHØYDEIMETER"]=["bygghøydeIMeter", "Integer"];

sositypes["BYGGNR"]=["bygningsnummer", "Integer"];

sositypes["BYGGSTAT"]=["bygningsstatus", "String"];

sositypes["BYGGTYP_NBR"]=["bygningstype", "Integer"];

sositypes["BYGGVERK"]=["byggverkbestemmelse", "Integer"];

sositypes["BYGN_ENDR_KODE"]=["bygningsendringskode", "String"];

sositypes["BYGN_ENDR_LØPENR"]=["endringsløpenummer", "Integer"];

sositypes["BYGN_HIST_DATO"]=["bygningshistorikkDato", "Date"];

sositypes["BYGN_REF_TYPE"]=["bygningReferansetype", "String"];

sositypes["BYGN_SAKSNR"]=["bygnSaksnr", "String"];

sositypes["BYGNINGSFUNKSJON"]=["bygningsfunksjon", "Integer"];

sositypes["BÆREEVNEBENEVNELSE"]=["bæreevnebenevnelse", "String"];

sositypes["BØYE_FORM"]=["bøyeform", "Integer"];

sositypes["BÅNDLAGTFREMTIL"]=["båndlagtFremTil", "Date"];

sositypes["CLEIER"]=["CL_Eier", "String"];

sositypes["D"]=["dybde", "Integer"];

sositypes["DA_ANNET"]=["landbruksregArealAnnet", "Integer"];

sositypes["DA_JORD_D"]=["landbruksregArealJordIDrift", "Real"];

sositypes["DA_JORD_E"]=["landbruksregArealJordbruk", "Integer"];

sositypes["DA_SKOG"]=["landbruksregArealSkog", "Integer"];

sositypes["DAMFORMÅL"]=["damFormål", "String"];

sositypes["DAMFUNKSJON"]=["damFunksjon", "Integer"];

sositypes["DAMLENGDE"]=["damLengde", "Real"];

sositypes["DAMTYPE"]=["damType", "String"];

sositypes["DATAFANGSTDATO"]=["datafangstdato", "Date"];

sositypes["DATAUTTAKSDATO"]=["datauttaksdato", "Date"];

sositypes["DATERMETOD"]=["dateringMetode", "Integer"];

sositypes["DATUM"]=["datum", "String"];

sositypes["DEFORMASJONFASE"]=["deformasjonFase", "Integer"];

sositypes["DEKKENAVN"]=["dekkeEnhetNavn", "String"];

sositypes["DEKKETYPE"]=["dekketype", "String"];

sositypes["DEKNINGSNUMMER"]=["dekningsnummer", "String"];

sositypes["DEL_BRED"]=["posisjonBredde", "Integer"];

sositypes["DEL_DYBD"]=["posisjonDybde", "Integer"];

sositypes["DELOMRÅDENAVN"]=["delområdenavn", "String"];

sositypes["DELOMRÅDENUMMER"]=["delområdenummer", "String"];

sositypes["DELSTREKNINGSNUMMER"]=["delstrekningsnummer", "String"];

sositypes["DEPONISTATUS"]=["deponistatus", "Integer"];

sositypes["DEPONITYPE"]=["deponitype", "Integer"];

sositypes["DESINFANLAVHELEK"]=["desinfAnleggAvhElektrisitet", "String"];

sositypes["DIGITALISERINGSMÅLESTOKK"]=["digitaliseringsmålestokk", "Integer"];

sositypes["DIM-BREDDE"]=["tekstTegnBredde", "Real"];

sositypes["DIM-HØYDE"]=["tekstTegnHøyde", "Real"];

sositypes["DISTKODE"]=["reinbeitedistriktID", "String"];

sositypes["DK_MANDEL"]=["dyrkningspotensialMandel", "Integer"];

sositypes["DK_MANDEL_A"]=["nedklassifiseringMandel", "Integer"];

sositypes["DK_NEDBOR"]=["nedbørsbasert", "Integer"];

sositypes["DK_NEDBOR_A"]=["nedklassifiseringNedbør", "Integer"];

sositypes["DK_VANN"]=["vanningsbasert", "Integer"];

sositypes["DK_VANN_A"]=["nedklassifiseringVanning", "Integer"];

sositypes["DOKUMENTASJONSTYPE"]=["dokumentasjonType", "Integer"];

sositypes["D-REF-INT"]=["vertikalReferanseInternasjonalDybde", "Integer"];

sositypes["DRIFTFHOLD"]=["driftForhold", "Integer"];

sositypes["DRIFTMETOD"]=["driftMetode", "Integer"];

sositypes["DRSENTER"]=["jordregisterDriftssenter", "Integer"];

sositypes["DYBDE"]=["dybde", "Real"];

sositypes["DYBDE_MAX"]=["maximumsdybde", "Real"];

sositypes["DYBDE_MIN"]=["minimumsdybde", "Real"];

sositypes["DYBDEFJELL"]=["dybdeTilFjell", "Real"];

sositypes["DYBDEKVIKKLEIRE"]=["dybdeTilKvikkleire", "Real"];

sositypes["DYBDEMÅLEMETODE"]=["dybemålemetode", "Integer"];

sositypes["DYBDE-REF"]=["dybdeReferanse", "String"];

sositypes["DYBDETYPE"]=["dybdetype", "Integer"];

sositypes["DYPMIDDEL"]=["dypMiddel", "Integer"];

sositypes["DYPSTØRSTMÅLT"]=["dypStørstMålt", "Integer"];

sositypes["SERIENUMMER"]=["serienummer", "String"];

sositypes["DYRKING"]=["jordregisterDyrkingsjord", "String"];

sositypes["EIER"]=["geodataeier", "String"];

sositypes["EIERFORHOLD"]=["eierforhold", "String"];

sositypes["EIERFORM"]=["eierformType", "Integer"];

sositypes["EKOORD-H"]=["jordregisterKoordinatHøyde", "Integer"];

sositypes["EKOORD-N"]=["jordregisterKoordinatNord", "Integer"];

sositypes["EKOORD-Ø"]=["jordregisterKoordinatØst", "Integer"];

sositypes["ENDRET_TID"]=["tidspunktEndring", "Date"];

sositypes["ENDRET_TYPE"]=["typeEndring", "String"];

sositypes["ENDRINGSGRAD"]=["endringsgrad", "String"];

sositypes["ENERGIKILDE"]=["energikilde", "String"];

sositypes["ENHET"]=["enhet", "Real"];

sositypes["ENHET-D"]=["enhetDybde", "Real"];

sositypes["ENHET-H"]=["enhetHøyde", "Real"];

sositypes["EROSJONGS"]=["erosjonsrisikoGrasdekke", "Integer"];

sositypes["EROSJONHP"]=["erosjonsrisikoHøstpløying", "Integer"];

sositypes["ETABLERINGSDATO"]=["etableringsdato", "Date"];

sositypes["ETABLERT"]=["fastmerkeEtableringsdato", "Date"];

sositypes["ETASJENUMMER"]=["etasjenummer", "Integer"];

sositypes["ETASJEPLAN"]=["etasjeplan", "String"];

sositypes["ETASJETALL"]=["etasjetall", "String"];

sositypes["ETAT"]=["etat", "String"];

sositypes["F_TYPE"]=["fiskeType", "Integer"];

sositypes["FAGOMRÅD"]=["ledningsfagområde", "Integer"];

sositypes["FALLHØYDE"]=["fallHøyde", "Real"];

sositypes["FAO_KODE"]=["faoKode", "String"];

sositypes["FARTØY_ID"]=["fartøyIdentifikasjon", "String"];

sositypes["FASADE"]=["fasade", "Integer"];

sositypes["FBNAVN"]=["fiskebedriftsnavn", "String"];

sositypes["FBNR"]=["fiskebruksnummer", "Integer"];

sositypes["FBNR_FYLK"]=["fiskebruksnummerFylke", "String"];

sositypes["FELTNAVN"]=["feltbetegnelse", "String"];

sositypes["FELTREGISTRERTAV"]=["feltegistrertAv", "String"];

sositypes["FIGF_ID"]=["figurFørSkifteIdent", "Integer"];

sositypes["FILM"]=["film", "String"];

sositypes["FIRMA"]=["firmanavn", "String"];

sositypes["FISK_KODE"]=["artskode", "Integer"];

sositypes["FISKE_BEDR_ANDEL"]=["fiskebedriftsandel", "Integer"];

sositypes["FISKE_BEDR_EIER"]=["fiskebedriftseier", "String"];

sositypes["FISKE_BEDR_OMR"]=["fiskebedriftsområde", "Integer"];

sositypes["FISKE_BEDR_PROD"]=["fiskebedriftsprodukt", "Integer"];

sositypes["FISKE_BEDR_SERVICE"]=["fiskebedriftservice", "Integer"];

sositypes["FISKE_KAP_ENH"]=["fiskekapasitetEnhet", "Integer"];

sositypes["FISKE_KAPASITET"]=["fiskekapasitet", "Integer"];

sositypes["FISKE_TYPE"]=["fisketype", "Integer"];

sositypes["FISKERI_BRUK_TYPE"]=["fiskeribrukstype", "Integer"];

sositypes["FISKERI_RESS_TYPE"]=["fiskeriressursOmrådetype", "Integer"];

sositypes["FISKERIREDSKAP_GEN_AKTIV"]=["fiskeriredskapGenAktiv", "Integer"];

sositypes["FISKERIREDSKAP_GEN_PASSIV"]=["fiskeriredskapGenPassiv", "Integer"];

sositypes["FISKERIREDSKAP_SPES_AKTIV"]=["fiskeriredskapSpesAktiv", "Integer"];

sositypes["FISKERIREDSKAP_SPES_PASSIV"]=["fiskeriredskapSpesPassiv", "Integer"];

sositypes["FJELL"]=["fjellblotninger", "Integer"];

sositypes["FJORDID"]=["fjordidentifikasjon", "String"];

sositypes["FLODBOLGEHOYDE"]=["flodbolgehoyde", "Integer"];

sositypes["FLOMLAVPUNKT"]=["flomLavPunkt", "Real"];

sositypes["FLYFIRMA"]=["flyfirma", "String"];

sositypes["FLYHØYDE"]=["flyhøyde", "Integer"];

sositypes["FLYRESTR"]=["flyRestriksjon", "Integer"];

sositypes["FMADKOMST"]=["fastmerkeAdkomst", "String"];

sositypes["FMDIM"]=["fastmerkeDiameter", "Integer"];

sositypes["FMHREF"]=["fastmerkeHøyderef", "String"];

sositypes["FMIDDATO"]=["fastmerkeIdDato", "Date"];

sositypes["FMIDGML"]=["fastmerkeIdGammel", "String"];

sositypes["FMINST"]=["fastmerkeInstitusjon", "String"];

sositypes["FMKOMM"]=["fastmerkeKommune", "Integer"];

sositypes["FMMERK"]=["fastmerkeMerknader", "String"];

sositypes["FMNAVN"]=["fastmerkeNavn", "String"];

sositypes["FMNUMMER"]=["fastmerkeNummer", "String"];

sositypes["FMREFBER"]=["fastmerkeRefGrunnrisBeregning", "String"];

sositypes["FMREFHBER"]=["fastmerkeRefHøydeBeregning", "String"];

sositypes["FMRESTR"]=["fastmerkeRestriksjon", "String"];

sositypes["FMSREF"]=["fastmerkeSentrumRef", "String"];

sositypes["FNR"]=["festenummer", "Integer"];

sositypes["FONTENE_TYPE"]=["fontenetype", "Integer"];

sositypes["FOREKNAVN"]=["navnRastoffobj", "String"];

sositypes["FOREKOM_ID"]=["identRastoffobj", "Integer"];

sositypes["FORHOLDANDREHUS"]=["forholdAndreHus", "String"];

sositypes["FORHÅNDSTALL"]=["forhåndstall", "Integer"];

sositypes["FORLENGET_DATO"]=["forlengetDato", "Date"];

sositypes["FORMASJON"]=["formasjonTotalDyp", "String"];

sositypes["FORMELFLATE"]=["kvFormFlatetype", "Integer"];

sositypes["FORMELLIN"]=["kvFormLinjetype", "Integer"];

sositypes["FORMELPKT"]=["kvFormPunkttype", "Integer"];

sositypes["FORMÅLSEKSJON"]=["formålSeksjonKode", "String"];

sositypes["FORUR_AREAL"]=["forurensetAreal", "Integer"];

sositypes["FORUR_GRUNNTYPE"]=["forurensetGrunnType", "Integer"];

sositypes["FORUR_HOVEDGRUPPE"]=["forurensningHovedgruppe", "Integer"];

sositypes["FORV_MYND"]=["forvaltningMyndighet", "String"];

sositypes["FORV_PLAN"]=["forvaltningPlan", "Integer"];

sositypes["FOSSILTYPE"]=["fossilNavn", "String"];

sositypes["FOTODATO"]=["fotodato", "Date"];

sositypes["FOTOGRAF"]=["fotograf", "String"];

sositypes["FOTRUTETYPE"]=["fotrutetype", "Integer"];

sositypes["FRASPORNODEKILOMETER"]=["fraSpornodeKilometer", "Real"];

sositypes["FRASPORNODETEKST"]=["fraSpornodeTekst", "String"];

sositypes["FRASPORNODETYPE"]=["fraSpornodeType", "String"];

sositypes["F-REF-INT"]=["friseilingReferanseInternasjonal", "Integer"];

sositypes["FREG"]=["jordregisterFreg", "Integer"];

sositypes["FRIDRIFTSTILSYN"]=["friluftslivsområdeDriftstilsyn", "Integer"];

sositypes["FRIEGNETHET"]=["friluftslivsområdeEgnethet", "Integer"];

sositypes["FRIPLANST"]=["friluftslivsområdePlanStatus", "Integer"];

sositypes["FRISEILHØYDE"]=["friseilingshøyde", "Real"];

sositypes["FRISEIL-REF"]=["frilseilingReferanse", "String"];

sositypes["FRISIKRING"]=["friluftslivSikring", "Integer"];

sositypes["FRISPERR"]=["frisperring", "Integer"];

sositypes["FRISTMATRIKKELFØRINGSKRAV"]=["fristMatrikkelføringskrav", "Date"];

sositypes["FRISTOPPMÅLING"]=["fristOppmåling", "Date"];

sositypes["FRITILRETTELEGGING"]=["friluftslivsområdeTilrettelegging", "Integer"];

sositypes["FRITYPE"]=["friluftslivsområdeType", "String"];

sositypes["FRIVERDI"]=["friluftslivsområdeVerdi", "String"];

sositypes["F-STRENG"]=["formatertStreng", "String"];

sositypes["FUNDAMENTERING"]=["fundamentering", "Integer"];

sositypes["FYDELTEMA"]=["fylkesdeltema", "Integer"];

sositypes["FYLKESNR"]=["fylkesnummer", "Integer"];

sositypes["FYRLISTEKARAKTER"]=["fyrlisteKarakter", "String"];

sositypes["FYRLISTENUMMER"]=["fyrlistenummer", "String"];

sositypes["FYSENHET"]=["fysiskEnhet", "Integer"];

sositypes["FYSISKMILJØ"]=["fysiskMiljø", "Integer"];

sositypes["FYSPARAM"]=["fysiskParameter", "Integer"];

sositypes["FYSSTR"]=["fysiskStorrelse", "Real"];

sositypes["FØLGER_TERRENGDET"]=["følgerTerrengdetalj", "String"];

sositypes["FØRSTEDATAFANGSTDATO"]=["førsteDatafangstdato", "Date"];

sositypes["FØRSTEDIGITALISERINGSDATO"]=["førsteDigitaliseringsdato", "Date"];

sositypes["GARDIDNR"]=["landbruksregProdusentId", "Integer"];

sositypes["GATENAVN"]=["gatenavn", "String"];

sositypes["GATENR"]=["gatenummer", "Integer"];

sositypes["GENRESTR"]=["generellrestriksjon", "Integer"];

sositypes["GEOALDER"]=["geolAlder", "Integer"];

sositypes["GEOALDER_FRA"]=["geolMaksAlder", "Integer"];

sositypes["GEOALDER_TIL"]=["geolMinAlder", "Integer"];

sositypes["GEOBESK"]=["geolBeskrivelse", "String"];

sositypes["GEO-DATUM"]=["geoDatumInternasjonal", "Integer"];

sositypes["GEOFELTNR"]=["geologFeltnummer", "String"];

sositypes["GEOFORMASJ"]=["geolFormasjonNavn", "String"];

sositypes["GEOGRUPPE"]=["geolGruppeNavn", "String"];

sositypes["GEOHOVERDI"]=["geolHorisontalverdi", "Integer"];

sositypes["GEOKARTNR"]=["geolKartnummer", "Integer"];

sositypes["GEOKOORD"]=["geoKoordinatverdiEnhet", "Integer"];

sositypes["GEOLOKNR"]=["geolLokalitetnummer", "Real"];

sositypes["GEO-PROJ"]=["geoProjeksjon", "Integer"];

sositypes["GEOPÅVISNINGTYPE"]=["geolPavisningtype", "Integer"];

sositypes["GEOSITENO"]=["geositeNummer", "Integer"];

sositypes["GEO-SONE"]=["geoSoneProjeksjon", "Integer"];

sositypes["GEOVERDIVURD"]=["geolVerdivurdering", "Integer"];

sositypes["GEOVEVERDI"]=["geolVertikalverdi", "Integer"];

sositypes["GFANOMALI"]=["geofAnomali", "Integer"];

sositypes["GFDYPSTR"]=["geofDyp", "Real"];

sositypes["GFDYPTYPE"]=["geofDyptype", "Integer"];

sositypes["GFFALLBREGMET"]=["geofFallBeregnMetode", "Integer"];

sositypes["GFFALLSTR"]=["geofFallstorrelse", "Integer"];

sositypes["GFFLATE"]=["geofFlate", "Integer"];

sositypes["GFL_INFO"]=["geofLinjeInfo", "Integer"];

sositypes["GFLINJE"]=["geofTolkLinjetype", "Integer"];

sositypes["GFMETODE"]=["geofMetode", "Integer"];

sositypes["GFP_INFO"]=["geofPunktInfo", "Integer"];

sositypes["GFSTROK"]=["geofStrokretning", "Integer"];

sositypes["GFTOLK"]=["geofTolkMetode", "Integer"];

sositypes["GFUTLLEN"]=["geofLengdeUtlegg", "Integer"];

sositypes["GFUTLRETN"]=["geofRetningUtlegg", "Integer"];

sositypes["GFUTLTYPE"]=["geofTypeUtlegg", "Integer"];

sositypes["GJENNOMFØRINGSFRIST"]=["gjennomføringsfrist", "Date"];

sositypes["GJENTAKSINTERVAL"]=["gjentaksInterval", "Integer"];

sositypes["GJERDETYPE"]=["sikringGjerdetype", "Integer"];

sositypes["GKEKSTRAKT"]=["geokEkstrakt", "Integer"];

sositypes["GKENHET"]=["geokEnhet", "Integer"];

sositypes["GKFRADYP"]=["geokFraDyp", "Integer"];

sositypes["GKFRAKSJON"]=["geokFraksjon", "Integer"];

sositypes["GKHORISONT"]=["geokHorisont", "Integer"];

sositypes["GKHOVMEDIUM"]=["geokHovedmedium", "Integer"];

sositypes["GKMEDIUM"]=["geokMedium", "Integer"];

sositypes["GKRETSNAVN"]=["grunnkretsnavn", "String"];

sositypes["GKTILDYP"]=["geokTilDyp", "Integer"];

sositypes["GKVARIABEL"]=["geokVariabel", "String"];

sositypes["GNR"]=["gårdsnummer", "Integer"];

sositypes["GR_TYPE"]=["grensetypeSjø", "Integer"];

sositypes["GRAVERT"]=["gravertTekst", "String"];

sositypes["GRDANNELSE"]=["grotteDannelse", "Integer"];

sositypes["GRDIMSJOND"]=["grotteDimDiameter", "Integer"];

sositypes["GRDIMSJONH"]=["grotteDimHoyre", "Integer"];

sositypes["GRDIMSJONO"]=["grotteDimOver", "Integer"];

sositypes["GRDIMSJONU"]=["grotteDimUnder", "Integer"];

sositypes["GRDIMSJONV"]=["grotteDimVenstre", "Integer"];

sositypes["GRENSEMERKENEDSATTI"]=["grensemerkeNedsasttI", "String"];

sositypes["GRENSEPUNKTNUMMER"]=["grensepunktnummer", "String"];

sositypes["GRENSEPUNKTTYPE"]=["grensepunkttype", "Integer"];

sositypes["GRENSEVEDTAK"]=["grenseVedtak", "String"];

sositypes["GRFORMELM"]=["grotteFormElement", "Integer"];

sositypes["GRGANGFORM"]=["grotteGaForm", "Integer"];

sositypes["GRGANGTYPE"]=["grotteGaType", "String"];

sositypes["GRHOYDE"]=["grotteHoyde", "Integer"];

sositypes["GRLINTYPE"]=["grotteLinjetype", "Integer"];

sositypes["GROTLEGEME"]=["grotteLegeme", "String"];

sositypes["GROTNOYAKT"]=["grotteNoyaktighet", "String"];

sositypes["GROTTELAST"]=["grotteLast", "Integer"];

sositypes["GROTTENAVN"]=["grotteNavn", "String"];

sositypes["GROTTEPLAN"]=["grottePlan", "String"];

sositypes["GROTTLENKE"]=["grotteLenke", "Integer"];

sositypes["GRPKTTYPE"]=["grottePktType", "Integer"];

sositypes["GRPUNKTNR"]=["grottePktNummer", "String"];

sositypes["GRUNNBORINGREF"]=["grunnBoringReferanse", "String"];

sositypes["GRUNNFHOLD"]=["losmGrunnforhold", "Integer"];

sositypes["GRUNNGASS"]=["grunnGass", "Integer"];

sositypes["GRUNNKRETS"]=["grunnkretsnummer", "Integer"];

sositypes["GRUNNLINJENAVN"]=["grunnlinjepunktnavn", "String"];

sositypes["GRUNNLINJENUMMER"]=["grunnlinjepunktnummer", "String"];

sositypes["GRUNNRISSREFERANSESPOR"]=["grunnrissreferanseSpor", "String"];

sositypes["GRUNNVANN"]=["grunnvannPotensiale", "Integer"];

sositypes["GRUNNVERDI"]=["grunnVerdi", "Real"];

sositypes["GRVARSEL"]=["grotteVarsel", "Integer"];

sositypes["GVAKT_PROS"]=["geoVernAktivProsess", "String"];

sositypes["GVAREAL"]=["geoVernAreal", "String"];

sositypes["GVDLIKEHOLD"]=["geoVernVedlikehold", "String"];

sositypes["GVERNE_ID"]=["geoVernObjektId", "Integer"];

sositypes["GVERNETYPE"]=["geoVernTematype", "Integer"];

sositypes["GVERNHTYPE"]=["geoVernHovedtype", "String"];

sositypes["GVERNKRT_A"]=["geoVernAKriterie", "String"];

sositypes["GVERNKRT_B"]=["geoVernBKriterie", "String"];

sositypes["GVERNKRT_C"]=["geoVernCKriterie", "String"];

sositypes["GVERNVERDI"]=["geoVernVerdi", "Integer"];

sositypes["GVGRENSETY"]=["geoVernGrensetype", "Integer"];

sositypes["GVHINNHLD"]=["geoVernHovInnhold", "String"];

sositypes["GVINNGREP"]=["geoVernInngrep", "String"];

sositypes["GVLITTRTUR"]=["geoVernLitteratur", "String"];

sositypes["GVOFFNTLGJ"]=["geoVernOffentliggjoring", "String"];

sositypes["GVOMR_NAVN"]=["geoVernOmrNavn", "String"];

sositypes["GVPROALDER"]=["geoVernProsessalder", "Integer"];

sositypes["GVSAKSTATUS"]=["geoVernSakStatus", "Integer"];

sositypes["GVSTATUS"]=["geoVernType", "Integer"];

sositypes["GVSYSTEM"]=["geoVernSystem", "String"];

sositypes["GVTINNHLD"]=["geoVernTilleggInnhold", "String"];

sositypes["GVVKT_PROS"]=["geoVernViktigProsess", "String"];

sositypes["GYLDIGFRA"]=["gyldigFra", "Date"];

sositypes["GYLDIGTIL"]=["gyldigTil", "Date"];

sositypes["H"]=["høyde", "Integer"];

sositypes["H_EUREF89"]=["høydeOverEuref89", "Real"];

sositypes["H_KAT_LANDSK"]=["hovedkategoriLandskap", "String"];

sositypes["HAR_HEIS"]=["harHeis", "String"];

sositypes["HASTIGHETSENHET"]=["hastighetsenhet", "String"];

sositypes["HAVNE_D_ADM"]=["havnedistriktadministrasjon", "Integer"];

sositypes["HAVNE_ID"]=["havneidentifikasjon", "Integer"];

sositypes["HAVNEAVSNITTNUMMER"]=["havneavsnittnummer", "Integer"];

sositypes["HAVNEAVSNITTSTATUS"]=["havneavsnittstatus", "String"];

sositypes["HAVNEAVSNITTTYPE"]=["havneavsnitttype", "String"];

sositypes["HAVNETERMINALISPSNUMMER"]=["havneterminalISPSnummer", "Integer"];

sositypes["HAVNETERMINALNUMMER"]=["havneterminalnummer", "Integer"];

sositypes["HAVNETERMINALSTATUS"]=["havneterminalstatus", "String"];

sositypes["HAVNETERMINALTYPE"]=["havneterminaltype", "String"];

sositypes["HBERGKODE"]=["hovedBergKode", "Integer"];

sositypes["HELLING"]=["helling", "Integer"];

sositypes["HENDELSE"]=["trasénodeHendelsestype", "Integer"];

sositypes["HENSYNSONENAVN"]=["hensynSonenavn", "String"];

sositypes["HFLOM"]=["vannstandRegHøyestRegistrerte", "Real"];

sositypes["HINDERFLATE_TYPE"]=["hinderFlateType", "Integer"];

sositypes["HINDERFLATEPENETRERINGSTYPE"]=["hinderflatepenetreringstype", "Integer"];

sositypes["HJELPELINJETYPE"]=["hjelpelinjetype", "String"];

sositypes["HJEMMELSGRUNNLAG"]=["hjemmelsgrunnlag", "String"];

sositypes["HJULTRYKK"]=["hjultrykk", "String"];

sositypes["H-MÅLEMETODE"]=["målemetodeHøyde", "Integer"];

sositypes["H-NØYAKTIGHET"]=["nøyaktighetHøyde", "Integer"];

sositypes["HOB"]=["høydeOverBakken", "Real"];

sositypes["HOLDNINGSKLASSE"]=["holdningsklasse", "Integer"];

sositypes["HOR_BÆREKONSTR"]=["horisontalBærekonstr", "Integer"];

sositypes["HOVEDPARSELL"]=["hovedParsell", "Integer"];

sositypes["HOVEDTEIG"]=["hovedteig", "String"];

sositypes["HREF"]=["høydereferanse", "String"];

sositypes["H-REF-INT"]=["høydeReferanseInternasjonal", "Integer"];

sositypes["HRV"]=["vannstandHøyesteRegulert", "Real"];

sositypes["HUSHOLDBELASTNING"]=["husholdBelastning", "Integer"];

sositypes["HUSLØPENR"]=["husLøpenr", "Integer"];

sositypes["HUSNR"]=["husNr", "Integer"];

sositypes["HVANN"]=["vannstandHøyestRegistrert", "Real"];

sositypes["HYTTE_ID"]=["hytteId", "Integer"];

sositypes["HYTTEEIER"]=["hytteeier", "Integer"];

sositypes["HØYDE"]=["høyde", "Real"];

sositypes["HØYDE_TIL_NAV"]=["høydeTilNavet", "Integer"];

sositypes["HØYDE-REF"]=["høyde-Referanse", "String"];

sositypes["HØYDEREFERANSESPOR"]=["høydereferanseSpor", "String"];

sositypes["HØYDE-TYPE"]=["høydeType", "String"];

sositypes["ID"]=["identifikasjon", "String"];

sositypes["IKRAFT"]=["ikrafttredelsesdato", "Date"];

sositypes["IMOTOPPMERKETYPE"]=["imoToppmerketype", "Integer"];

sositypes["IMP"]=["impedimentprosentSkog", "Integer"];

sositypes["INDEKSMIN"]=["indeksMineral", "String"];

sositypes["INDIKATOR"]=["indikatorFastmerkenummer", "String"];

sositypes["INDUSTRIBELASTNING"]=["industriBelastning", "Integer"];

sositypes["INFILT"]=["infiltrasjonEvne", "Integer"];

sositypes["INFORMASJON"]=["informasjon", "String"];

sositypes["FAGOMRÅDEGRUPPE"]=["fagområdegruppe", "String"];

sositypes["FAGOMRÅDE_FULLT_NAVN"]=["fagområdets fulle navn", "String"];

sositypes["INON_AVS"]=["inngrepsfriSoneAvstand", "Real"];

sositypes["INONSONE"]=["inngrepsfrieNaturområderINorgeSone", "String"];

sositypes["INRT_FUNKSJON"]=["innretningsfunksjon", "String"];

sositypes["INRT_HOVEDTYPE"]=["innretningshovedtype", "String"];

sositypes["INRT_MATR"]=["innretningsmaterialtype", "String"];

sositypes["INRT_NAVN"]=["innretningsnavn", "String"];

sositypes["INRT_TYPE"]=["innretningstype", "String"];

sositypes["INST_EFFEKT"]=["installertEffekt", "Integer"];

sositypes["INSTALLASJONSBØYEKATEGORI"]=["installasjonsbøyekategori", "Integer"];

sositypes["INSTALLERT_ÅR"]=["installertÅr", "Date"];

sositypes["INT_STAT"]=["internasjonalStatus", "Integer"];

sositypes["J_LREG"]=["jordregisterLreg", "String"];

sositypes["JERNBANEEIER"]=["jernbaneeier", "String"];

sositypes["JERNBANETYPE"]=["jernbanetype", "String"];

sositypes["JORD"]=["jordklassifikasjon", "Integer"];

sositypes["JORDARB"]=["anbefaltJordarbeiding", "Integer"];

sositypes["JORDART"]=["losmassetype", "Integer"];

sositypes["JREGAREAL"]=["jordregisterAreal", "Real"];

sositypes["JREGEKODE"]=["jordregisterStatusEiendom", "Integer"];

sositypes["JRFIGNR"]=["jordregisterFigurnummer", "Integer"];

sositypes["JSR_AREAL"]=["jordskifteArealtilstand", "Integer"];

sositypes["JSVSAK"]=["jordskifterettenSaksnummer", "String"];

sositypes["JXAREAL"]=["annetareal", "Integer"];

sositypes["KABELTYPE"]=["kabeltype", "Integer"];

sositypes["KAI_DYBDE"]=["kaiDybde", "Real"];

sositypes["KAI_TYPE"]=["kaiTypeInformasjon", "Integer"];

sositypes["KALIBRERINGSRAPPORT"]=["kalibreringsrapport", "String"];

sositypes["KAMERATYPE"]=["kameratype", "String"];

sositypes["KAPASITETLANGEKJØRETØY"]=["kapasitetLangekjøretøy", "Integer"];

sositypes["KAPASITETPERSONBILER"]=["kapasitetPersonbiler", "Integer"];

sositypes["KAPASITETPERSONEKVIVALENTER"]=["kapasitetPersonekvivalenter", "Integer"];

sositypes["KARDINALMERKETYPE"]=["kardinalmerketype", "Integer"];

sositypes["KARTID"]=["kartbladindeks", "String"];

sositypes["KARTLEGGINGSETAPPE"]=["kartleggingsetappe", "String"];

sositypes["KARTREG"]=["kartregistrering", "Integer"];

sositypes["KARTSIGNATUR"]=["kartsignatur", "String"];

sositypes["KARTTYPE"]=["karttype", "String"];

sositypes["KBISPENR"]=["bispedømmenummer", "Integer"];

sositypes["KILDEPRIVATVANNF"]=["kildePrivatVannforsyning", "Integer"];

sositypes["KJELLER"]=["kjeller", "Integer"];

sositypes["KJERNEOMRÅDESTATUS"]=["kjerneområdestatus", "String"];

sositypes["KJØKKENTILGANG"]=["kjøkkentilgang", "Integer"];

sositypes["KLASSIFISERING"]=["kulturlandskapKlassifisering", "String"];

sositypes["KLOR_FØR_FORBRUK"]=["klorKontakttidFørForbruk", "Integer"];

sositypes["KLORO_MAKS"]=["klorofyllMaksimum", "Integer"];

sositypes["KLOTPAR"]=["klotoideParameter", "Real"];

sositypes["KLOTRAD1"]=["klotoideRadius 1", "Real"];

sositypes["KLOTRAD2"]=["klotoideRadius 2", "Real"];

sositypes["RUTEVANSKELIGHETSGRAD"]=["rutevanskelighetsgrad", "String"];

sositypes["RWY_BÆREEVNE_BEN"]=["bæreevnebenevnelse", "String"];

sositypes["RWY_TYPE"]=["rullebaneType", "String"];

sositypes["RWYMERK"]=["rullebaneoppmerking", "Integer"];

sositypes["RYDDEBREDDE"]=["ryddebredde", "Integer"];

sositypes["RØR_ENDE_PKT"]=["ledningsendepunkt", "String"];

sositypes["RØR_START_PKT"]=["ledningsstartpunkt", "String"];

sositypes["RØRLEDNINGSTYPE"]=["rørledningstype", "Integer"];

sositypes["SAK_AVSLUTT"]=["sakAvsluttet", "String"];

sositypes["SAKSNR"]=["saksnummer", "Integer"];

sositypes["SAKSOMF"]=["saksomfang", "Integer"];

sositypes["SAKSTYPE"]=["sakstype", "Integer"];

sositypes["SALINITET"]=["salinitet", "Integer"];

sositypes["SAT_KOM_ID"]=["satellittkommunikasjonsId", "String"];

sositypes["SCANNEROPPLØSNING"]=["scanneroppløsning", "Real"];

sositypes["SEDDYBDEME"]=["sedDybdeMeter", "Real"];

sositypes["SEDDYBDEMS"]=["sedDybdeMillisekund", "Real"];

sositypes["SEDKORNSTR"]=["sedKornstorrelse", "Integer"];

sositypes["SEDMEKTME"]=["sedMektighetMeter", "Real"];

sositypes["SEDMEKTMS"]=["sedMektighetMillisekund", "Real"];

sositypes["SEFRAK_FUNK_KODE"]=["sefrakFunksjonsKode", "Integer"];

sositypes["SEFRAK_FUNK_STAT"]=["sefrakFunksjonsstatus", "String"];

sositypes["KM_ANTALL"]=["kulturminneAntall", "Integer"];

sositypes["KM_BETEGN"]=["kulturminneBetegnelse", "String"];

sositypes["KM_DAT"]=["kulturminneDatering", "String"];

sositypes["KM_DATKVAL"]=["kulturminneDateringKvalitet", "String"];

sositypes["KM_FUNK_NÅ"]=["kulturminneNåværendeFunksjon", "String"];

sositypes["KM_FUNK_OP"]=["kulturminneOpprinneligFunksjon", "String"];

sositypes["KM_HOVEDGRUPPE"]=["kulturminneHovedgruppe", "String"];

sositypes["KM_KATEGORI"]=["kulturminneKategori", "String"];

sositypes["KM_MAT"]=["kulturminneHovedMateriale", "String"];

sositypes["KM_SYNLIG"]=["kulturminneSynlig", "String"];

sositypes["KM_VERNEVERDI"]=["kulturminneVerneverdi", "String"];

sositypes["KODDRIFT"]=["landbruksregBedriftskode", "Integer"];

sositypes["KOM_KALLSIGNAL"]=["komKallSignal", "String"];

sositypes["KOM_KANAL"]=["komKanal", "String"];

sositypes["KOMM"]=["kommunenummer", "Integer"];

sositypes["KOMM_ALT_AREAL"]=["kommAlternativtAreal", "Real"];

sositypes["KOMM_ALT_AREAL2"]=["kommAlternativtAreal2", "Real"];

sositypes["KOMMENTAR"]=["kommentar", "String"];

sositypes["KOMMENTAR_TYPE"]=["kommentarType", "String"];

sositypes["KOMMSEK"]=["kommuneSekundær", "Integer"];

sositypes["KOMPONENT"]=["komponent", "String"];

sositypes["KONSTA1"]=["konstantA1", "Real"];

sositypes["KONSTA2"]=["konstantA2", "Real"];

sositypes["KONSTB1"]=["konstantB1", "Real"];

sositypes["KONSTB2"]=["konstantB2", "Real"];

sositypes["KONSTC1"]=["konstantC1", "Real"];

sositypes["KONSTC2"]=["konstantC2", "Real"];

sositypes["KONTAKTPERSON"]=["kontaktperson", "String"];

sositypes["KOORDKVALKODE"]=["koordinatkvalitetKode", "String"];

sositypes["KOPIDATO"]=["kopidato", "Date"];

sositypes["KOPL_BRU"]=["koplingBruksområde", "String"];

sositypes["KOPL_KAT"]=["koplingskategori", "Integer"];

sositypes["KOPL_NAV"]=["koplingsnavn", "String"];

sositypes["KOPL_TYP"]=["koplingstype", "String"];

sositypes["KORTNAVN"]=["kortnavn", "String"];

sositypes["KOSTHOLDART"]=["kostholdArt", "String"];

sositypes["KOSTHOLDSRÅDTYPE"]=["kostholdsrådType", "Integer"];

sositypes["KP"]=["knutePunkt", "Integer"];

sositypes["KPANGITTHENSYN"]=["angittHensyn", "Integer"];

sositypes["KPAREALFORMÅL"]=["arealformål", "Integer"];

sositypes["KPBÅNDLEGGING"]=["båndlegging", "Integer"];

sositypes["KPDETALJERING"]=["detaljering", "Integer"];

sositypes["KPFARE"]=["fare", "Integer"];

sositypes["KPGJENNOMFØRING"]=["gjennomføring", "Integer"];

sositypes["KPINFRASTRUKTUR"]=["infrastruktur", "Integer"];

sositypes["KPINFRASTRUKTURLINJE"]=["infrastrukturLinje", "Integer"];

sositypes["KPJURLINJE"]=["juridisklinje", "Integer"];

sositypes["KPRESTENAVN"]=["prestegjeldnavn", "String"];

sositypes["KPRESTENR"]=["prestegjeldnummer", "Integer"];

sositypes["KPROSTINAVN"]=["prostinavn", "String"];

sositypes["KPROSTINR"]=["prostinummer", "Integer"];

sositypes["KPSIKRING"]=["sikring", "Integer"];

sositypes["KPSTØY"]=["støy", "Integer"];

sositypes["KRAFTVERKTYP"]=["kraftverktype", "String"];

sositypes["KRETSNAVN"]=["kretsnavn", "String"];

sositypes["KRETSNUMMER"]=["kretsnummer", "String"];

sositypes["KRETSTYPEKODE"]=["kretstypekode", "String"];

sositypes["KRETSTYPENAVN"]=["kretstypenavn", "String"];

sositypes["KULT_HIST_INT"]=["kulturhistoriskInteresse", "String"];

sositypes["KVIKKLEIRESVURD"]=["stabilitetVurderingKvikkleire", "Integer"];

sositypes["KYSTKONSTRUKSJONSTYPE"]=["kystkonstruksjonstype", "Integer"];

sositypes["KYSTREF"]=["kystreferanse", "String"];

sositypes["KYSTTYP"]=["kysttype", "Integer"];

sositypes["KYSTVERKSDISTRIKT"]=["kystverksdistrikt", "Integer"];

sositypes["LAGRET_DATO"]=["lagretDato", "Date"];

sositypes["LAND1"]=["førsteLand", "String"];

sositypes["LAND2"]=["annetLand", "String"];

sositypes["LANDEMERKEKATEGORI"]=["landeberkekategori", "Integer"];

sositypes["LANDKODE"]=["landkode", "String"];

sositypes["LATERALMERKETYPE"]=["lateralmerketype", "Integer"];

sositypes["LDEL"]=["landsdelområde", "Integer"];

sositypes["LEDN_BRU"]=["ledningbruksområde", "String"];

sositypes["LEDN_NAV"]=["ledningsnavn", "String"];

sositypes["LEDN_TYP"]=["ledningstype", "Integer"];

sositypes["LEDNINGSEIER"]=["ledningseier", "String"];

sositypes["LEKEREKRTYPE"]=["lekeRekreasjonstype", "String"];

sositypes["LENGDE"]=["lengde", "Real"];

sositypes["LENGDEENHET"]=["lengdeenhet", "String"];

sositypes["LENGDEOVERLAPP"]=["lengdeoverlapp", "Integer"];

sositypes["LENGDESEKTORLINJE1"]=["lengdeSektorlinje1", "Real"];

sositypes["LENGDESEKTORLINJE2"]=["lengdeSektorlinje2", "Real"];

sositypes["LETE_AREAL"]=["leteareal", "Real"];

sositypes["LH_BEREDSKAP"]=["lufthavnBeredskapskode", "Integer"];

sositypes["LHAREAL"]=["lufthavnArealer", "Integer"];

sositypes["LHDISTTYPE"]=["lufthavndistansetype", "Integer"];

sositypes["LHELEV"]=["lufthavnelevasjon", "Real"];

sositypes["LHFDET"]=["lufthavnForsvarsObjektDetalj", "Integer"];

sositypes["LHFM_TYPE"]=["lufthavnFastmerketype", "Integer"];

sositypes["LHINST_TYPE"]=["lufthavnInstrumenteringType", "Integer"];

sositypes["LHLYS_OPPHØYD_NEDFELT"]=["lufthavnLysOpphøydNedfelt", "String"];

sositypes["LHLYSFARGE"]=["lufthavnlysFarge", "Integer"];

sositypes["LHLYSRETN"]=["lufhavnLysretning", "Integer"];

sositypes["LHLYSTYPE"]=["lufthavnlystype", "Integer"];

sositypes["LHSKILTKATEGORI"]=["lufthavnskiltkatagori", "Integer"];

sositypes["LHSKILTLYS"]=["lufthavnskiltlys", "String"];

sositypes["LHSKILTTYPE"]=["lufthavnskilttype", "Integer"];

sositypes["LINEAMENTTYPE"]=["lineamentType", "Integer"];

sositypes["LINK"]=["link", "String"];

sositypes["LJORDKL"]=["lokalJordressurs", "Integer"];

sositypes["LJORDKL_A"]=["nedklassifiseringLokalJordressurs", "Integer"];

sositypes["LOK_NAVN"]=["lokalitetsnavn", "String"];

sositypes["LOK_NR"]=["lokalitetsnummer", "Integer"];

sositypes["LOSLIGHET"]=["loslighetGrad", "Integer"];

sositypes["LOSMKORNSTR"]=["losmKornstorrelse", "Integer"];

sositypes["LOSMOVERFLATETYPE"]=["losmOverflateType", "Integer"];

sositypes["LOVDISP"]=["dispensasjonType", "Integer"];

sositypes["LOVREFBESKRIVELSE"]=["lovreferanseBeskrivelse", "String"];

sositypes["LOVREFERANSE"]=["lovreferanseType", "Integer"];

sositypes["LR_AKTIV"]=["landbruksregAktiv", "Integer"];

sositypes["LR_TYPE"]=["landbruksregType", "Integer"];

sositypes["LRV"]=["vannstandLavestRegulert", "Real"];

sositypes["LUFTHAVNHINDERTREGRUPPE"]=["lufthavnhinderTregruppe", "String"];

sositypes["LVANN"]=["vannstandLavestRegistrert", "Real"];

sositypes["LYSHØYDE"]=["lyshøyde", "Real"];

sositypes["LØPENR"]=["bruksenhetLøpenr", "Integer"];

sositypes["MAGASINNR"]=["magasinNr", "Integer"];

sositypes["MAKSHØYDE"]=["makshøyde", "Real"];

sositypes["MAKSIMALREKKEVIDDE"]=["maksimalRekkevidde", "Real"];

sositypes["MAKSSNØHØYDE"]=["maksSnøhøyde", "Integer"];

sositypes["MANGELMATRIKKELFØRINGSKRAV"]=["mangelMatrikkelføringskrav", "String"];

sositypes["MARKID"]=["jordregisterMarkslagKobling", "Integer"];

sositypes["MARKSLAGAVGRTYPE"]=["markslagAvgrensingType", "Integer"];

sositypes["MASSEENHET"]=["masseenhet", "String"];

sositypes["MATERIALE"]=["materialeBolt", "Integer"];

sositypes["MATERIALE_YTTERV"]=["materialeYttervegg", "Integer"];

sositypes["MATR_KODE"]=["materiellkode", "String"];

sositypes["MATRIKKELKOMMUNE"]=["matrikkelkommune", "Integer"];

sositypes["MATRTYPE"]=["materialType", "Integer"];

sositypes["MATRUNTYPE"]=["materialUndertype", "String"];

sositypes["MAX_ELEMENT_PKT"]=["maksAntallPunktGeometritype1", "Integer"];

sositypes["MAX_OBJEKT_PKT"]=["maksAntallPunktGeometritype2", "Integer"];

sositypes["MAX_REF_OBJEKT"]=["maksAntallGeometriReferanse", "Integer"];

sositypes["MAX-AVVIK"]=["maksimaltAvvik", "Integer"];

sositypes["MAX-N"]=["maksimumNord", "Integer"];

sositypes["MAX-Ø"]=["maksimumØst", "Integer"];

sositypes["MEDIUM"]=["medium", "String"];

sositypes["MEKT50"]=["mektighetFemtiProsent", "Real"];

sositypes["MERKEFORM"]=["merkeform", "Integer"];

sositypes["MERKELISTENUMMER"]=["merkelistenummer", "Integer"];

sositypes["MERKEMØNSTER"]=["merkemønster", "Integer"];

sositypes["METADATALINK"]=["metadatalink", "String"];

sositypes["METALINTYP"]=["metamorfLinjetype", "String"];

sositypes["METAMOGRAD"]=["metamorfGrad", "Integer"];

sositypes["METER-FRA"]=["veglenkeMeterFra", "Integer"];

sositypes["METER-TIL"]=["veglenkeMeterTil", "Integer"];

sositypes["MGENHETBESKRIV"]=["mgEnhetBeskrivelse", "String"];

sositypes["MGENHETOPPLOSN"]=["mgEnhetOpplosning", "Integer"];

sositypes["MGINSTRUMENT"]=["mgInstrument", "String"];

sositypes["MGLINJENR"]=["mgLinjenummer", "String"];

sositypes["MGPOSNR"]=["mgPosisjonnummer", "Integer"];

sositypes["MGTOKTNR"]=["mgToktnummer", "String"];

sositypes["MILITÆRØVELSETYPE"]=["militærøvelsetype", "Integer"];

sositypes["MILJOTIL"]=["miljøtiltak", "Integer"];

sositypes["MINHØYDE"]=["minhøyde", "Real"];

sositypes["MIN-N"]=["minimumNord", "Integer"];

sositypes["MIN-Ø"]=["minimumØst", "Integer"];

sositypes["MYNDIGHET"]=["vedtaksmyndighet", "String"];

sositypes["MYR"]=["myrklassifikasjon", "Integer"];

sositypes["MÅLEMETODE"]=["målemetode", "Integer"];

sositypes["MÅLESTOKK"]=["målestokk", "Integer"];

sositypes["MÅLTALL"]=["måltall", "Real"];

sositypes["NASJONALTOPPMERKETYPE"]=["nasjonalToppmerketype", "Integer"];

sositypes["NASJVIKTIG"]=["rastoffViktighetOmfang", "String"];

sositypes["NAVIGASJONSINSTALLASJONSEIER"]=["navigasjonsinstallasjonseier", "String"];

sositypes["NAVLYS_KARAKTER"]=["navigasjonslyskarakter", "Integer"];

sositypes["NAVLYSTYPE"]=["navlysType", "Integer"];

sositypes["NAVN"]=["navn", "String"];

sositypes["NAVNTYPE"]=["navnetype", "Integer"];

sositypes["NEDSENKETKANTSTEIN"]=["nedsenketKantstein", "String"];

sositypes["NEDSTENGT_DATO"]=["nedstengtDato", "Date"];

sositypes["NETT_NIV"]=["ledningsnettNivå", "String"];

sositypes["NEVNER"]=["nevner", "Real"];

sositypes["NOMINELLREKKEVIDDE"]=["nominellRekkevidde", "Real"];

sositypes["NORD"]=["nord", "Integer"];

sositypes["NYMATRIKULERT"]=["nymatrikulert", "String"];

sositypes["NÆRINGSGRUPPE"]=["næringsgruppe", "String"];

sositypes["NØYAKTIGHET"]=["nøyaktighet", "Integer"];

sositypes["NØYAKTIGHETSKLASSE"]=["nøyaktighetsklasse", "Integer"];

sositypes["NÅVÆRENDE_AREAL"]=["nåværendeAreal", "Real"];

sositypes["OBJTYPE"]=["objekttypenavn", "String"];

sositypes["OBSERVERTFLOM"]=["observertFlom", "Real"];

sositypes["OBSLINID"]=["obsLinId", "String"];

sositypes["OMKRETSINNSJØ"]=["omkretsInnsjø", "Integer"];

sositypes["OMRKODE"]=["reinbeiteområdeID", "String"];

sositypes["OMRNAVN"]=["områdenavn", "String"];

sositypes["OMRTYPE"]=["dumpefelttype", "Integer"];

sositypes["OMRÅDEID"]=["områdeid", "Integer"];

sositypes["OMTVISTET"]=["omtvistet", "String"];

sositypes["OPAREALAVGRTYPE"]=["operativArealavgrensningtype", "Integer"];

sositypes["OPERATØR"]=["petroleumsoperatør", "String"];

sositypes["OPLAREAL"]=["arealbruk", "Integer"];

sositypes["OPLAREALUTDYP"]=["arealbruksutdyping", "String"];

sositypes["OPLRESTR"]=["arealbruksrestriksjoner", "Integer"];

sositypes["OPLRETNL"]=["arealbruksretningslinjer", "Integer"];

sositypes["OPPARBEIDING"]=["opparbeiding", "Integer"];

sositypes["OPPDATERINGSDATO"]=["oppdateringsdato", "Date"];

sositypes["OPPDRAGSGIVER"]=["oppdragsgiver", "String"];

sositypes["OPPGITTAREAL"]=["oppgittAreal", "Real"];

sositypes["OPPHAV"]=["opphav", "String"];

sositypes["OPPMÅLINGIKKEFULLFØRT"]=["oppmålingIkkeFullført", "String"];

sositypes["OPPMÅLTKOTE"]=["oppmåltKote", "Real"];

sositypes["OPPMÅLTÅR"]=["oppmåltÅr", "Integer"];

sositypes["OPPRETTET_AAR"]=["opprettetÅr", "Date"];

sositypes["OPPRINNELIGBILDEFORMAT"]=["bildeType", "String"];

sositypes["OPPRINNELIGBILDESYS"]=["BildeSystem", "Integer"];

sositypes["OPPRINNELIGSOSIALTMILJØ"]=["opprinneligSosialtMiljø", "Integer"];

sositypes["OPPRINNELSE"]=["opprinnelse", "String"];

sositypes["OPPSTARTSÅR"]=["oppstartsår", "Date"];

sositypes["OPPTAKSMETODE"]=["opptaksmetode", "Integer"];

sositypes["OPPVARMING"]=["oppvarming", "String"];

sositypes["ORGANISK"]=["organiskAndel", "Integer"];

sositypes["ORGNR"]=["organsisasjonsnummer", "Integer"];

sositypes["ORIENTERINGSDATA"]=["orienteringsdata", "String"];

sositypes["ORIENTERINGSMETODE"]=["orienteringsmetode", "Integer"];

sositypes["ORIGINALDATAVERT"]=["originalDatavert", "String"];

sositypes["ORIGO-N"]=["origoNord", "Integer"];

sositypes["ORIGO-Ø"]=["origoØst", "Integer"];

sositypes["OVERGRUPPE"]=["overgruppeNavn", "String"];

sositypes["PBTILTAK"]=["tiltakstype", "Integer"];

sositypes["PETLITOKODE"]=["petrofLitologi", "String"];

sositypes["PETMETAKODE"]=["petrofMetamorfose", "String"];

sositypes["PETROLEUM_KOORD_STATUS"]=["petroleumKoordinatstatus", "String"];

sositypes["PETROLEUMLEDNINGFUNKSJON"]=["petroleumsledningsfunksjon", "String"];

sositypes["PETROLEUMLEDNINGTYPE"]=["petroleumsledningstype", "String"];

sositypes["PETROLEUMSANDEL"]=["petroleumsandel", "Real"];

sositypes["PETROLEUMSDATAKILDE"]=["petroleumsdatakilde", "String"];

sositypes["PETROLEUMSFELTNAVN"]=["petroleumsfeltnavn", "String"];

sositypes["PETROLEUMSFELTTYPE"]=["petroleumsfelttype", "String"];

sositypes["PETROLEUMSPARTNERE"]=["petroleumspartnere", "String"];

sositypes["PETSTRATKODE"]=["petrofStratigrafi", "String"];

sositypes["PILARKATEGORI"]=["pilarkategori", "Integer"];

sositypes["PIXEL-STØRR"]=["pixelstørrelse", "Real"];

sositypes["PLANBEST"]=["planbestemmelse", "Integer"];

sositypes["PLANERING"]=["planeringsgrad", "Integer"];

sositypes["PLANID"]=["planidentifikasjon", "String"];

sositypes["PLANNAVN"]=["plannavn", "String"];

sositypes["FORSLAGSSTILLERTYPE"]=["forslagsstillerType", "Integer"];

sositypes["PLANSTAT"]=["planstatus", "Integer"];

sositypes["PLANTYPE"]=["plantype", "Integer"];

sositypes["PLASS"]=["plasseringskode", "Integer"];

sositypes["PLFMERK"]=["oppstillingplattformmerking", "Integer"];

sositypes["PLOGSJIKTTEKSTUR"]=["plogsjiktTekstur", "Integer"];

sositypes["POBS"]=["observasjonstype", "Integer"];

sositypes["POLITIDISTRIKTID"]=["politidistriktId", "Integer"];

sositypes["POS_KVAL"]=["posisjonKvalitet", "Integer"];

sositypes["POS_TYPE"]=["posisjonType", "Integer"];

sositypes["BITS_PR_PIXEL"]=["bitsPrPixel", "Integer"];

sositypes["POSTNAVN"]=["poststedsnavn", "String"];

sositypes["POSTNR"]=["postnummer", "Integer"];

sositypes["PREPARERING"]=["løypepreparering", "String"];

sositypes["PRIMÆRSTREKNINGSNUMMER"]=["primærstrekningsnummer", "Integer"];

sositypes["PRIOMR"]=["prioritetområde", "String"];

sositypes["PRIORITET"]=["kulturlandskapPrioritet", "String"];

sositypes["PRIVAT_KLOAKKR"]=["privatKloakkRensing", "Integer"];

sositypes["PRODUKT"]=["produkt", "String"];

sositypes["PRODUKT_FULLT_NAVN"]=["produktFullstendigNavn", "String"];

sositypes["PRODUKTGRUPPE"]=["produktgruppe", "String"];

sositypes["PRODUSENT"]=["geodataprodusent", "String"];

sositypes["PROJEK"]=["projeksjon", "String"];

sositypes["PROSELV"]=["prosentElv", "Real"];

sositypes["PROSESS_HISTORIE"]=["prosesshistorie", "String"];

sositypes["PROSHAV"]=["prosentHav", "Real"];

sositypes["PROSINNSJØ"]=["prosentInnsjø", "Real"];

sositypes["PROSJEKTNAVN"]=["prosjektnavn", "String"];

sositypes["PROSJEKTSTART"]=["prosjektstartår", "Integer"];

sositypes["PROSLAND"]=["prosentLand", "Real"];

sositypes["PROSTINUMMER"]=["prostinummer", "Integer"];

sositypes["PROVEMATR"]=["proveMaterial", "String"];

sositypes["PTYPE"]=["punktType", "String"];

sositypes["PUKKVERKTYPE"]=["pukkverktype", "Integer"];

sositypes["PUMPER_NØDSTR"]=["pumperNødstrøm", "String"];

sositypes["PUMPES_VANNET"]=["pumperVannet", "String"];

sositypes["PUNKTBESKR"]=["punktBeskrivelse", "String"];

sositypes["PUNKTFESTE"]=["punktfeste", "String"];

sositypes["PÅVIRKNINGSGRAD"]=["påvirkningsgrad", "Integer"];

sositypes["R_FNR"]=["forekomstNummer", "Integer"];

sositypes["R_LNR"]=["lokalNummer", "Integer"];

sositypes["R_ONR"]=["omrNummer", "Integer"];

sositypes["R_PNR"]=["proveNummer", "Integer"];

sositypes["R_RESERVER"]=["rastoffReserver", "Integer"];

sositypes["RACONFREKVENSBÅND"]=["raconFrekvensbånd", "String"];

sositypes["RACONKARAKTER"]=["raconkarakter", "String"];

sositypes["RACONMORSETEGN"]=["raconmorsetegn", "String"];

sositypes["RACONRESPONSINTERVALL"]=["raconresponsintervall", "String"];

sositypes["RACONTYPE"]=["racontype", "Integer"];

sositypes["RADAR_FYR_TYPE"]=["radarfyrtype", "Integer"];

sositypes["RADARREFLEKTOR"]=["radarReflektor", "String"];

sositypes["RADARSTASJONSTYPE"]=["radarstasjonstype", "Integer"];

sositypes["RADIO_FYR_TYPE"]=["radiofyrtype", "Integer"];

sositypes["RADIOAKTIV"]=["radioaktivitetNiva", "Integer"];

sositypes["RADIOFYRMODULASJON"]=["radiofyrmodulasjon", "String"];

sositypes["RADIUS"]=["radius", "Real"];

sositypes["RADRISKOMR"]=["naturlRadioaktivStraling", "Integer"];

sositypes["RAPPORTERINGSÅR"]=["rapporteringsår", "Date"];

sositypes["REFERANSE"]=["referanse", "String"];

sositypes["REFERANSENUMMER"]=["referansenummer", "String"];

sositypes["REGFORM"]=["reguleringsformål", "Integer"];

sositypes["REGFORMUTDYP"]=["reguleringsformålsutdyping", "String"];

sositypes["REGISTRERINGKRETSNR"]=["registreringKretsnr", "Integer"];

sositypes["REGISTRERT_DATO"]=["registrertDato", "Date"];

sositypes["REGMETOD"]=["registreringsmetode", "Integer"];

sositypes["REGULERTHØYDE"]=["regulertHøyde", "Real"];

sositypes["REINDRIFTANLTYP"]=["reindriftsanleggstype", "Integer"];

sositypes["REINDRIFTKONNAVN"]=["reindriftKonvensjonsområdenavn", "String"];

sositypes["REKKEVIDDEGRØNN"]=["rekkeviddeGrønn", "Real"];

sositypes["REKKEVIDDEGUL"]=["rekkeviddeGul", "Real"];

sositypes["REKKEVIDDEHVIT"]=["rekkeviddeHvit", "Real"];

sositypes["REKKEVIDDERØD"]=["rekkeviddeRød", "Real"];

sositypes["RENHET"]=["retningsenhet", "Integer"];

sositypes["RENOVASJON"]=["renovasjon", "Integer"];

sositypes["RESIPIENTTYPE"]=["resipienttype", "String"];

sositypes["RESTR_OMR"]=["restriksjonsområde", "String"];

sositypes["RESTRIKSJONSTYPE"]=["restriksjonstype", "Integer"];

sositypes["RET_SYS"]=["retningsreferanse", "Integer"];

sositypes["RETN"]=["retningsverdi", "Real"];

sositypes["RETNINGSEKTORLINJE1"]=["retningSektorlinje1", "Real"];

sositypes["RETNINGSEKTORLINJE2"]=["retningSektorlinje2", "Real"];

sositypes["RISIKOVURDERING"]=["risikovurdering", "String"];

sositypes["RKB"]=["rkb", "Real"];

sositypes["RKB_TD"]=["rkbTotaltDyp", "Real"];

sositypes["ROTASJON"]=["rotasjon", "Integer"];

sositypes["RPANGITTHENSYN"]=["angitthensyn", "Integer"];

sositypes["RPAREALFORMÅL"]=["arealformål", "Integer"];

sositypes["RPBÅNDLEGGING"]=["båndlegging", "Integer"];

sositypes["RPDETALJERING"]=["detaljering", "Integer"];

sositypes["RPFARE"]=["fare", "Integer"];

sositypes["RPGJENNOMFØRING"]=["gjennomføring", "Integer"];

sositypes["RPINFRASTRUKTUR"]=["infrastruktur", "Integer"];

sositypes["RPJURLINJE"]=["juridisklinje", "Integer"];

sositypes["RPJURPUNKT"]=["juridiskpunkt", "Integer"];

sositypes["RPPÅSKRIFTTYPE"]=["påskriftType", "Integer"];

sositypes["RPSIKRING"]=["sikring", "Integer"];

sositypes["RPSTØY"]=["støy", "Integer"];

sositypes["RSL_JREG"]=["referansesystemForLandskapJordbruksregioner", "String"];

sositypes["RSL_REG"]=["referansesystemForLandskapRegioner", "String"];

sositypes["RSL_UREG"]=["referansesystemForLandskapUReg", "String"];

sositypes["RTALLHØY"]=["reintallHøyeste", "Integer"];

sositypes["RTALLVEDTAK"]=["reintallVedtak", "String"];

sositypes["RULLEBANEDISTANSETYPE"]=["rullebanedistansetype", "Integer"];

sositypes["RULLEBANERETNING"]=["rullebaneretning", "Integer"];

sositypes["RUTEBREDDE"]=["rutebredde", "Integer"];

sositypes["RUTEFØLGER"]=["ruteFølger", "String"];

sositypes["RUTEMERKING"]=["ruteMerking", "String"];

sositypes["RUTENETTYPE"]=["rutenettype", "String"];

sositypes["RUTENR"]=["rutenummer", "String"];

sositypes["SEFRAK_TILTAK"]=["sefrakTiltak", "Integer"];

sositypes["SEFRAKBREDDE"]=["sefrakbredde", "Integer"];

sositypes["SEFRAKKOMMUNE"]=["sefrakKommune", "Integer"];

sositypes["SEFRAKLENGDE"]=["sefraklengde", "Integer"];

sositypes["SEIL_BREDDE"]=["seilingsbredde", "Real"];

sositypes["SEIL_DYBDE"]=["seilingsdybde", "Real"];

sositypes["SEKSJONERT"]=["seksjonert", "String"];

sositypes["SEKTORTEKST"]=["sektortekst", "String"];

sositypes["SEKUNDÆRSTREKNINGSNUMMER"]=["sekundærstrekningsnummer", "Integer"];

sositypes["SENTRUMSSONENAVN"]=["sentrumssonenavn", "String"];

sositypes["SENTRUMSSONENUMMER"]=["sentrumssonenummer", "Integer"];

sositypes["SEPTIKTANK"]=["septiktank", "String"];

sositypes["SERIEKODE1"]=["serie1", "String"];

sositypes["SERIEKODE2"]=["serie2", "String"];

sositypes["SERIEKODE3"]=["serie3", "String"];

sositypes["SERVMERK"]=["servituttMerknad", "String"];

sositypes["SERVTYPE"]=["servituttType", "String"];

sositypes["SESOMR"]=["reindriftSesongområde", "Integer"];

sositypes["SFOTRUTETYPE"]=["spesialFotrutetype", "String"];

sositypes["SIDEOVERLAPP"]=["sideoverlapp", "Integer"];

sositypes["SIGNALGRUPPE"]=["signalgruppe", "String"];

sositypes["SIGNALNR"]=["signalnummer", "String"];

sositypes["SIGNALPERIODE"]=["signalperiode", "String"];

sositypes["SIGNALSEKVENS"]=["signalsekvens", "String"];

sositypes["SIGNH"]=["signalHøyde", "Real"];

sositypes["SIGNHREF"]=["signalHøydeRef", "String"];

sositypes["SIGNTYPE"]=["signalType", "String"];

sositypes["SIKKERÅR"]=["ledningsalderReferanse", "Integer"];

sositypes["SIKTEDYP"]=["sikteDyp", "Integer"];

sositypes["SIST_VURDERT_AAR"]=["sistVurdertÅr", "Date"];

sositypes["SISTBEFART"]=["sisteBefaringsdato", "Integer"];

sositypes["SJØ_RESTRIKSJON"]=["sjørestriksjon", "Integer"];

sositypes["SJØ_SIGFRQ"]=["sjøsignalfrekvens", "Integer"];

sositypes["SJØ_STATUS"]=["sjøstatus", "Integer"];

sositypes["SJØ_TRAFIKK"]=["sjøtrafikk", "Integer"];

sositypes["SJØMERKEFARGE"]=["sjømerkefarge", "Integer"];

sositypes["SJØMERKESYSTEM"]=["sjømerkesystem", "Integer"];

sositypes["SKAL_AVGR_BYGN"]=["skalAvgrenseBygning", "String"];

sositypes["SKALAENHET"]=["skalaenhet", "String"];

sositypes["SKILTGRUPPE"]=["skiltgruppe", "String"];

sositypes["SKILØYPETYPE"]=["skiløypetype", "Integer"];

sositypes["SKJERMINGFUNK"]=["skjermingsfunksjon", "String"];

sositypes["SKOG"]=["jordregisterSkogtype", "Integer"];

sositypes["SKOGREIS"]=["jordregisterSkogreisningsmark", "Integer"];

sositypes["SKOLEKRETSTYPE"]=["skolekretsnavn", "String"];

sositypes["SKREDALDERBEST"]=["skredAlderBestemmelse", "String"];

sositypes["SKREDBESKRIVELSE"]=["skredBeskrivelse", "String"];

sositypes["SKREDBREDDE"]=["skredBredde", "Integer"];

sositypes["SKREDEVAKUERING"]=["skredEvakuering", "Integer"];

sositypes["SKREDFALLHØYDE"]=["skredFallhoyde", "Integer"];

sositypes["SKREDFAREGR_KL"]=["skredFaregradKlasse", "String"];

sositypes["SKREDFAREGRADSCORE"]=["skredFaregradScore", "Integer"];

sositypes["SKREDFAREVURD"]=["snoSteinSkredfareVurdering", "Integer"];

sositypes["SKREDKONSSCORE"]=["skredSkadKonsekvensScore", "Integer"];

sositypes["SKREDKVALKARTLEGGING"]=["skredKvalKartlegging", "Integer"];

sositypes["SKREDLENGDE"]=["skredLengde", "Integer"];

sositypes["SKREDMALEMETODE"]=["skredMalemetode", "Integer"];

sositypes["SKREDOBSGUID"]=["skredObservasjonGUID", "Integer"];

sositypes["SKREDOMKOMNE"]=["skredAntallOmkomne", "Integer"];

sositypes["SKREDOMRID"]=["skredOmrID", "Integer"];

sositypes["SKREDOMRNAVN"]=["skredOmrNavn", "String"];

sositypes["SKREDREDNING"]=["skredRedning", "Integer"];

sositypes["SKREDRISIKO_KL"]=["skredRisikoKvikkleireKlasse", "Integer"];

sositypes["SKREDSKADEANNEN"]=["skredSkadeAnnen", "Integer"];

sositypes["SKREDSKADEOBJEKTER"]=["skredSkadeObjekter", "Integer"];

sositypes["SKREDSKADESAMFERDSEL"]=["skredSkadeSamferdsel", "Integer"];

sositypes["SKREDSKADETYPE"]=["skredSkadType", "Integer"];

sositypes["SKREDSKADKONS_KL"]=["skredSkadeKonsekvensKlasse", "Integer"];

sositypes["SKREDSTATSANN"]=["skredStatistikkSannsynlighet", "String"];

sositypes["SKREDTIDHENDELSE"]=["skredTidspunktHendelse", "String"];

sositypes["SKREDTIDUSIKKERH"]=["skredTidUsikkerhet", "String"];

sositypes["SKREDTYPE"]=["skredtype", "Integer"];

sositypes["SKREDUTLOMRHELNING"]=["skredUtlosningOmrHelning", "Integer"];

sositypes["SKREDUTLOPOMRTYPE"]=["skredUtlopOmrType", "Integer"];

sositypes["SKREDUTLOSNINGOMRTYPE"]=["skredUtlosningOmrType", "Integer"];

sositypes["SKREDVOLUM"]=["skredVolum", "String"];

sositypes["SKRETSNAVN"]=["skolekretsnavn", "String"];

sositypes["SKRETSNR"]=["skolekretsnummer", "Integer"];

sositypes["SKRIFTKODE"]=["presentasjonskode", "Integer"];

sositypes["SKYLD"]=["skyld", "Real"];

sositypes["SKYVGRINDL"]=["skyvegrenseInndeling", "Integer"];

sositypes["SLUSETYP"]=["sluseType", "Integer"];

sositypes["SMÅBÅTHAVNFASILITET"]=["småbåthavnfasilitet", "Integer"];

sositypes["SNAVN"]=["stedsnavn", "String"];

sositypes["SNDATO"]=["statusdato", "Date"];

sositypes["SNITT_HØ"]=["snitthøyde", "Integer"];

sositypes["SNKILDE"]=["stedsnavnkilde", "String"];

sositypes["SNLØPENR"]=["arkivløpenummer", "Integer"];

sositypes["SNMERK"]=["stedsnavnmerknad", "String"];

sositypes["SNMYND"]=["stedsnavnVedtaksmyndighet", "String"];

sositypes["SNR"]=["seksjonsnummer", "Integer"];

sositypes["SNREGDATO"]=["stedsnavnRegistreringsdato", "Date"];

sositypes["SNSAKSNR"]=["arkivsaksnummer", "Integer"];

sositypes["SNSKRSTAT"]=["stedsnavnSkrivemåtestatus", "String"];

sositypes["SNSPRÅK"]=["språk", "String"];

sositypes["SNTYSTAT"]=["stedsnavnTypestatus", "String"];

sositypes["SNØSCOOTERLØYPETYPE"]=["snøscooterløypeType", "String"];

sositypes["SOGNNUMMER"]=["sognnummer", "Integer"];

sositypes["SONENAUT"]=["soneNautisk", "Integer"];

sositypes["SONETYPE"]=["sonetype", "String"];

sositypes["SOSIELEMENT"]=["sosiElementnavn", "String"];

sositypes["SOSI-NIVÅ"]=["sosiKompleksitetNivå", "Integer"];

sositypes["SOSI-VERSJON"]=["sosiVersjon", "String"];

sositypes["SP_ABONTRE"]=["skogbrplanKlassAktueltTreslag", "Integer"];

sositypes["SP_AGJBON"]=["skogbrplanKlassAktSnittBon", "Integer"];

sositypes["SP_ALDER"]=["skogbrplanBeskrivBestandAlder", "Integer"];

sositypes["SP_ANDEREG"]=["skogbrplanTreslagAntTreDaaEReg", "Integer"];

sositypes["SP_ANDFREG"]=["skogbrplanTreslagAntTreDaaFReg", "Integer"];

sositypes["SP_AVOLPRDA"]=["skogbrplanGrunnlagVolumDaaFelt", "Real"];

sositypes["SP_AVOLTOT"]=["skogbrplanGrunnlagVolumBestFelt", "Integer"];

sositypes["SP_BAREAL"]=["skogbrplanBeskrivBestandDaa", "Real"];

sositypes["SP_BERTYPE"]=["skogbrplanGrunnlagBerType", "Integer"];

sositypes["SP_BESTDELNR"]=["skogbrplanBestandDelNr", "Integer"];

sositypes["SP_BESTNR"]=["skogbrplanBestandNr", "Integer"];

sositypes["SP_BEVNE"]=["skogbrplanTerrengBæreevneBestand", "Integer"];

sositypes["SP_BMIDDIAM"]=["skogbrplanBeskrivBestSnittDiam", "Integer"];

sositypes["SP_BMIDGRFL"]=["skogbrplanBeskrivBestandSnittM2", "Integer"];

sositypes["SP_BMIDHO"]=["skogbrplanBeskrivBestandSnittH", "Real"];

sositypes["SP_BRATT"]=["skogbrplanTerrengBestandBratthet", "Integer"];

sositypes["SP_BTILVPRDA"]=["skogbrplanTilvekstBeregnDaa", "Real"];

sositypes["SP_BTILVPROS"]=["skogbrplanTilvekstBeregnProsent", "Real"];

sositypes["SP_BVOLPRDA"]=["skogbrplanTilvekstBeregnM3", "Real"];

sositypes["SP_DENDR"]=["skogbrplanAdmDatoEndring", "Date"];

sositypes["SP_DREG"]=["skogbrplanAdmDatoEtablering", "Date"];

sositypes["SP_ELEMTYPE"]=["skogbrplanFlerKoderElementtype", "Integer"];

sositypes["SP_FARAND"]=["skogbrplanFlerKoderArealProsent", "Integer"];

sositypes["SP_FAREAL"]=["skogbrplanFlerKoderArealDaa", "Integer"];

sositypes["SP_FRAND"]=["skogbrplanFlerKoderSpesBehPros", "Integer"];

sositypes["SP_FRAREAL"]=["skogbrplanFlerKoderSpesBehDaa", "Integer"];

sositypes["SP_GREND"]=["skogbrplanTeigGrend", "Integer"];

sositypes["SP_GRFL"]=["skogbrplanTetthetGrunnflatesum", "Integer"];

sositypes["SP_HBAR"]=["skogbrplanBeskrivBarHøydehkl2", "Integer"];

sositypes["SP_HKL"]=["skogbrplanBeskrivHogstklasse", "Integer"];

sositypes["SP_HLAUV"]=["skogbrplanBeskrivLauvHøydehkl2", "Integer"];

sositypes["SP_HOVEDGR"]=["skogbrplanGrunnlagHovedgruppe", "Integer"];

sositypes["SP_HOYDE"]=["skogbrplanTetthetMHøyde", "Integer"];

sositypes["SP_IMPANDEL"]=["skogbrplanKlassImpProsent", "Integer"];

sositypes["SP_IMPTYPE"]=["skogbrplanKlassImpType", "Integer"];

sositypes["SP_LILEN"]=["skogbrplanTerrengLiLengde", "Integer"];

sositypes["SP_MINTRSP"]=["skogbrplanTerrengMinTranspUtst", "Integer"];

sositypes["SP_PBONTRE"]=["skogbrplanKlassPotTreslag", "Integer"];

sositypes["SP_PGJBON"]=["skogbrplanKlassPotSnittBon", "Integer"];

sositypes["SP_PRIO"]=["skogbrplanTiltakProritet", "Integer"];

sositypes["SP_REG"]=["skogbrplanGrunnlagRegion", "Integer"];

sositypes["SP_SJIKT"]=["skogbrplanBeskrivSjiktning", "Integer"];

sositypes["SP_SKOGTYP"]=["skogbrplanBeskrivSkogtype", "Integer"];

sositypes["SP_SUNNH"]=["skogbrplanBeskrivSunnhet", "Integer"];

sositypes["SP_SVPROS"]=["skogbrplanGrunnlagSvinnProsent", "Integer"];

sositypes["SP_TAKSTTYPE"]=["skogbrplanGrunnlagTaksttype", "Integer"];

sositypes["SP_TARAND"]=["skogbrplanTiltakProsent", "Integer"];

sositypes["SP_TAREAL"]=["skogbrplanTiltakAreal", "Real"];

sositypes["SP_TEIGNR"]=["skogbrplanTeigNr", "Integer"];

sositypes["SP_TERJEVN"]=["skogbrplanTerrengJevnhet", "Integer"];

sositypes["SP_TILT"]=["skogbrplanTiltakBestand", "Integer"];

sositypes["SP_TILVKOR"]=["skogbrplanGrunnlagTilvekstkorr", "Integer"];

sositypes["SP_TNAVN"]=["skogbrplanTeigNavn", "String"];

sositypes["SP_TOTVOL"]=["skogbrplanTilvekstVolumBestand", "Integer"];

sositypes["SP_TREEREG"]=["skogbrplanBeskrivTreERegulering", "Integer"];

sositypes["SP_TREFREG"]=["skogbrplanBeskrivTreFRegulering", "Integer"];

sositypes["SP_TRESLAG"]=["skogbrplanTreslag", "Integer"];

sositypes["SP_TRESLHO"]=["skogbrplanTreslagHøyde", "Integer"];

sositypes["SP_VOLAND"]=["skogbrplanTreslagProsent", "Integer"];

sositypes["SP_VOLKORR"]=["skogbrplanTreslagKorrVolumUBark", "Integer"];

sositypes["SP_VOLSALG"]=["skogbrplanTreslagSalgsvolumUBark", "Integer"];

sositypes["SP_VOLUKORR"]=["skogbrplanTreslagUkorrVolumUBark", "Integer"];

sositypes["SP_AAR"]=["skogbrplanTiltakÅr", "Integer"];

sositypes["SPERRING"]=["sperring", "String"];

sositypes["SPES_SKILØYPETYPE"]=["spesialSkiløypetype", "String"];

sositypes["SPESIALMERKETYPE"]=["spesialmerketype", "Integer"];

sositypes["SPESIALSYKKELRUTETYPE"]=["spesialsykkelrutetype", "String"];

sositypes["SPOR_HASTIGHET"]=["sporhastighet", "Integer"];

sositypes["SPORANTALL"]=["sporantall", "String"];

sositypes["SPORAVGRENINGSNR"]=["sporavgreningsnummer", "String"];

sositypes["SPORAVGRENINGSPUNKTNR"]=["sporavgreningspunktnummer", "String"];

sositypes["SPORAVGRENINGSPUNKTTYPE"]=["sporavgreningspunkttype", "String"];

sositypes["SPORAVGRENINGSTYPE"]=["sporavgreningstype", "String"];

sositypes["SPORKM"]=["sporKilometer", "Real"];

sositypes["SPORNUMMER"]=["spornummer", "String"];

sositypes["SPORPUNKTNUMMER"]=["sporpunktnummer", "String"];

sositypes["SPORPUNKTTYPE"]=["sporpunkttype", "String"];

sositypes["SPORTYPE"]=["sportype", "String"];

sositypes["SSR-ID"]=["ssrId", "Integer"];

sositypes["SSR-OBJID"]=["objId", "Integer"];

sositypes["STANDARDENHET"]=["standardenhet", "String"];

sositypes["STASJONSFORMÅL"]=["stasjonsformål", "String"];

sositypes["STASJONSNR"]=["stasjonsnummer", "Integer"];

sositypes["STASJONSPARAMETER"]=["stasjonsparameter", "Integer"];

sositypes["STASJONSTYPE"]=["stasjonstype", "String"];

sositypes["STASJONTYP"]=["stasjonstype", "String"];

sositypes["STAT"]=["typeStatus", "Integer"];

sositypes["STATUS"]=["status", "String"];

sositypes["STED"]=["sted", "String"];

sositypes["STED_VERIF"]=["stedfestingVerifisert", "String"];

sositypes["STENGESDATO"]=["stengesDato", "Date"];

sositypes["STORBUE"]=["storbue", "Integer"];

sositypes["STREKNINGSNUMMER"]=["strekningsnummer", "Integer"];

sositypes["STRENG"]=["generellTekststreng", "String"];

sositypes["STRIPENUMMER"]=["stripenummer", "String"];

sositypes["STRUKTUROVERBIKKET"]=["strukturOverbikket", "String"];

sositypes["STRUKTURPUNKTTYPE"]=["strukturPunkttype", "Integer"];

sositypes["STRØMHAST"]=["strømhastighet", "Real"];

sositypes["STRØMRETN"]=["strømretning", "Integer"];

sositypes["STØYENHET"]=["støyenhet", "String"];

sositypes["STØYINTERVALL"]=["støyintervall", "Integer"];

sositypes["STØYKILDE"]=["støykilde", "String"];

sositypes["STØYKILDEIDENTIFIKASJON"]=["Støykildeidentifikasjon", "String"];

sositypes["STØYKILDENAVN"]=["støykildenavn", "String"];

sositypes["STØYMETODE"]=["støymetode", "String"];

sositypes["STØYNIVÅ"]=["støynivå", "Integer"];

sositypes["STØYSONEKATEGORI"]=["støysonekategori", "String"];

sositypes["SUM_ALT_AREAL"]=["sumAlternativtAreal", "Real"];

sositypes["SUM_ALT_AREAL2"]=["sumAlternativtAreal2", "Real"];

sositypes["SUM_ANTALLBOENH"]=["sumAntallBoenheter", "Integer"];

sositypes["SUM_BRUKSARTOT"]=["sumBruksarealTotalt", "Real"];

sositypes["SUM_BRUKSTILANN"]=["sumBruksarealTilAnnet", "Real"];

sositypes["SUM_BRUKSTILBOL"]=["sumBruksarealTilBolig", "Real"];

sositypes["SYKKELRUTETYPE"]=["sykkelrutetype", "Integer"];

sositypes["SYNBARHET"]=["synbarhet", "Integer"];

sositypes["SYSKODE"]=["referansesystemKode", "Integer"];

sositypes["TAKFORM"]=["takform", "Integer"];

sositypes["TAKSKJEGG"]=["takskjegg", "Integer"];

sositypes["TAKTEKKING"]=["taktekking", "Integer"];

sositypes["TDIM-BREDDE"]=["tekstTegnbredde", "Real"];

sositypes["TDIM-HØYDE"]=["tekstTegnhøyde", "Real"];

sositypes["TEGNFORKL"]=["tegnforklaring", "String"];

sositypes["TEGNSETT"]=["tegnsett", "String"];

sositypes["TEIGE_ID"]=["teigEtterSkifteIdent", "Integer"];

sositypes["TEIGF_ID"]=["teigFørSkitfeIdent", "Integer"];

sositypes["TEIGFLEREMATRSAMMEEIER"]=["teigFlereMatrSammeEier", "String"];

sositypes["TEIGMEDFLEREMATRENHETER"]=["teigMedFlereMatrikkelenheter", "String"];

sositypes["TEIGNR"]=["jordregisterEiendomTeigNummer", "Integer"];

sositypes["TEKSTURKODE1"]=["teksturkode", "String"];

sositypes["TEKSTURKODE2"]=["teksturkode2", "String"];

sositypes["TEKSTURKODE3"]=["teksturkode3", "String"];

sositypes["TELEFAXNR"]=["telefaxnummer", "Integer"];

sositypes["TELEFONNR"]=["telefonnummer", "Integer"];

sositypes["TELLER"]=["teller", "Real"];

sositypes["TEMAJUST"]=["geolTemajustering", "Integer"];

sositypes["TEMAKVAL"]=["temaKvalitet", "String"];

sositypes["TERSKELFUNKSJON"]=["terskelFunksjon", "String"];

sositypes["TERSKELTYP"]=["terskelType", "String"];

sositypes["TETTSTEDNAVN"]=["tettstednavn", "String"];

sositypes["TIDOPPHOLDVANN"]=["tidOppholdVann", "Integer"];

sositypes["TIDREF"]=["tidreferanse", "String"];

sositypes["TIDSANGIVELSE"]=["tidsangivelse", "Integer"];

sositypes["TIDSENHET"]=["tidsenhet", "String"];

sositypes["TIDSLUTT"]=["periodeSlutt", "Date"];

sositypes["TIDSPUNKT"]=["tidspunkt", "Date"];

sositypes["TIDSTART"]=["periodeStart", "Date"];

sositypes["TILDELT_AREAL"]=["tildeltAreal", "Real"];

sositypes["TILDELT_DATO"]=["tilldeltDato", "Date"];

sositypes["TILGJENGELIGHETSVURDERING"]=["tilgjengelighetsvurdering", "String"];

sositypes["TILLEGG"]=["flatetillegg", "Integer"];

sositypes["TILLEGGSAREAL"]=["tilleggsareal", "Integer"];

sositypes["TILSPORNODEKILOMETER"]=["tilSpornodeKilometer", "Real"];

sositypes["TILSPORNODETEKST"]=["tilSpornodeTekst", "String"];

sositypes["TILSPORNODETYPE"]=["tilSpornodeType", "String"];

sositypes["TILSYS"]=["tilKoordinatsystem", "Integer"];

sositypes["TILTAKNR"]=["tiltaksnummer", "Integer"];

sositypes["TINGLYST"]=["tinglyst", "String"];

sositypes["TIPPVOLUM"]=["deponitippVolum", "Integer"];

sositypes["TOKTID"]=["toktId", "String"];

sositypes["TOT_PROD"]=["totalProduksjon", "Integer"];

sositypes["TOTALAREALKM2"]=["totalarealKm2", "Real"];

sositypes["TOTALBELASTNING"]=["totalBelastning", "Integer"];

sositypes["TRAFIKKBELASTNING"]=["trafikkbelastning", "Integer"];

sositypes["TRAFIKKFARE"]=["trafikkfare", "String"];

sositypes["TRE_D_NIVÅ"]=["treDNivå", "Integer"];

sositypes["TRE_TYP"]=["treType", "Integer"];

sositypes["TRNORD"]=["tekstReferansePunktNord", "Integer"];

sositypes["TRØST"]=["tekstReferansePunktØst", "Integer"];

sositypes["TSKOG"]=["tilleggsopplysningerSkog", "Integer"];

sositypes["TSKYV"]=["tekstForskyvning", "Real"];

sositypes["TSTED"]=["tettstednummer", "Integer"];

sositypes["TVIST"]=["tvist", "String"];

sositypes["TWYMERK"]=["taksebaneoppmerking", "Integer"];

sositypes["TYPE_BR"]=["trasebreddetype", "Integer"];

sositypes["TYPE_VANNFOR_ANL"]=["typeVannforsyningsanlegg", "Integer"];

sositypes["TYPEDUMPEOMRÅDE"]=["typeDumpeområde", "Integer"];

sositypes["TYPEINNSJØ"]=["typeInnsjø", "Integer"];

sositypes["TYPESAMFLINJE"]=["samferdselslinjeType", "Integer"];

sositypes["TYPESAMFPUNKT"]=["samferdselspunkt", "Integer"];

sositypes["UB_ANL_TYP"]=["utmarkbeiteAnleggstype", "Integer"];

sositypes["UB_DYRESL"]=["utmarkbeiteDyreslag", "String"];

sositypes["UFULLSTENDIGAREAL"]=["ufullstendigAreal", "String"];

sositypes["UNDERBYGNINGKONSTR"]=["underbygningKonstr", "Integer"];

sositypes["UNDERGRUNN"]=["undergrunn", "String"];

sositypes["UNDERLAG"]=["fastmerkeUnderlag", "Integer"];

sositypes["UNDERLAGSTYPE"]=["underlagstype", "Integer"];

sositypes["UNDERSAMMENFØYNINGSKALBESTÅ"]=["underSammenføyningSkalBestå", "String"];

sositypes["UNDERSAMMENFØYNINGSKALUTGÅ"]=["underSammenføyningSkalUtgå", "String"];

sositypes["UNDERSOKELSENR"]=["undersokelseNummer", "Integer"];

sositypes["UNDERTYPE"]=["undertypeVersjon", "String"];

sositypes["UNR"]=["underNr", "Integer"];

sositypes["UREGJORDSAMEIE"]=["uregistrertJordsameie", "String"];

sositypes["UTEAREAL"]=["uteoppholdsareal", "Integer"];

sositypes["UTGÅR_DATO"]=["utgårDato", "Date"];

sositypes["UTGÅTT"]=["utgått", "String"];

sositypes["UTNTALL"]=["utnyttingstall", "Real"];

sositypes["UTNTYP"]=["utnyttingstype", "Integer"];

sositypes["UTNYTTBAR_KAP"]=["utnyttbarMagasinkapasitet", "Real"];

sositypes["UTSLIPPTYPE"]=["utslipptype", "String"];

sositypes["UTV_TILL_NR"]=["tillatelsesnummer", "String"];

sositypes["UTV_TILL_TYPE"]=["utvinningstillatelsestype", "String"];

sositypes["UTVALGSAK"]=["utvalgssaksnummer", "Integer"];

sositypes["UTVALGSMET"]=["utvalgMetode", "String"];

sositypes["UUFASILITET"]=["universellutformingFasilitet", "String"];

sositypes["VALUTAENHET"]=["valutaenhet", "String"];

sositypes["VANNBR"]=["vannbredde", "Integer"];

sositypes["VANNFORSYNING"]=["vannforsyning", "Integer"];

sositypes["VANNFØRINGMIDLERE"]=["vannføringMidlere", "Integer"];

sositypes["VANNFØRINGMINSTE"]=["vannføringMinste", "Integer"];

sositypes["VANNFØRINGSTØRST"]=["vannføringStørst", "Integer"];

sositypes["VANNLAGR"]=["vannlagringsevne", "Integer"];

sositypes["VASSDRAGNAVN"]=["vassdragsnavn", "String"];

sositypes["VASSDRAGSNR"]=["vassdragsnummer", "String"];

sositypes["VATNLNR"]=["vatnLøpenummer", "Integer"];

sositypes["V-DELTA-MAX"]=["vertikaltDeltaMaksimum", "Integer"];

sositypes["V-DELTA-MIN"]=["vertikaltDeltaMinimum", "Integer"];

sositypes["VEDLIKEH"]=["vedlikeholdsansvarlig", "String"];

sositypes["VEDTAK"]=["vedtakstype", "Integer"];

sositypes["VEDTAKSDATO"]=["vedtaksdato", "Date"];

sositypes["VEGKATEGORI"]=["vegkategori", "String"];

sositypes["VEGNUMMER"]=["vegnummer", "Integer"];

sositypes["VEGOVERVEG"]=["vegOverVeg", "String"];

sositypes["VEGREKKVERKTYPE"]=["vegrekkverkType", "String"];

sositypes["VEGSPERRINGTYPE"]=["vegsperringtype", "String"];

sositypes["VEGSTATUS"]=["vegstatus", "String"];

sositypes["VERDI"]=["verdi", "Integer"];

sositypes["VERDI1"]=["verdi", "String"];

sositypes["VERDI2"]=["tilVerdi", "String"];

sositypes["VERDIANNA"]=["verdiAnnenUtnyttelseGrunn", "Real"];

sositypes["VERDIBEITE"]=["verdiBeiterett", "Real"];

sositypes["VERDIGRUNN"]=["verdiGrunn", "Real"];

sositypes["VERDIJAKT"]=["verdiJaktrett", "Real"];

sositypes["VERDISKOG"]=["verdiSkogProduksjon", "Real"];

sositypes["VERIFISERINGSDATO"]=["verifiseringsdato", "Date"];

sositypes["VERN_FORMAL"]=["verneFormål", "String"];

sositypes["VERN_LOV"]=["vernelov", "String"];

sositypes["VERN_MOT"]=["vernskogType", "Integer"];

sositypes["VERN_PARA"]=["verneparagraf", "String"];

sositypes["VERNEDATO"]=["vernedato", "Date"];

sositypes["VERNEFORM"]=["verneform", "String"];

sositypes["VERNEPLAN"]=["verneplan", "Integer"];

sositypes["VERNTEMA"]=["verneTema", "Integer"];

sositypes["VERNTYPE"]=["vernetype", "String"];

sositypes["VERSJON"]=["versjon", "String"];

sositypes["VERT_BÆREKONSTR"]=["vertikalBærekonstruksjon", "Integer"];

sositypes["VERTNIV"]=["vertikalnivå", "Integer"];

sositypes["VFLATE"]=["delteigKlassifisering", "Integer"];

sositypes["VFRADATO"]=["veglenkeFraDato", "Date"];

sositypes["VIKTIG"]=["viktighet", "Integer"];

sositypes["VINDRETN"]=["vindretning", "Integer"];

sositypes["VINKELENHET"]=["vinkelenhet", "String"];

sositypes["VIRKSOMHET"]=["typeRastoffVirksomhet", "Integer"];

sositypes["VISUELLTYDELIGHET"]=["visuellTydelighet", "Integer"];

sositypes["VKJORFLT"]=["feltoversikt", "String"];

sositypes["VKRETSNAVN"]=["valgkretsnavn", "String"];

sositypes["VKRETSNR"]=["valgkretsnummer", "Integer"];

sositypes["VLENKEID"]=["veglenkeIdentifikasjon", "Integer"];

sositypes["VOLUM_M3"]=["rastoffVolum", "Integer"];

sositypes["VOLUMENHET"]=["volumenhet", "String"];

sositypes["VOLUMINNSJØ"]=["volumInnsjø", "Integer"];

sositypes["VRAKTYP"]=["vraktype", "Integer"];

sositypes["VTILDATO"]=["veglenkeTilDato", "Date"];

sositypes["VURDERING"]=["vurdering", "String"];

sositypes["VURDERTDATO"]=["vurdertDato", "Date"];

sositypes["VÆSKETYPE"]=["petroleumsvæsketype", "Integer"];

sositypes["WRBKODE"]=["WRBgruppe", "String"];

sositypes["YTTERVEGG"]=["yttervegg", "Integer"];

sositypes["ØST"]=["øst", "Integer"];

sositypes["ÅPNESDATO"]=["åpnesDato", "Date"];

sositypes["ÅR"]=["årstall", "Integer"];

sositypes["ÅRSTIDBRUK"]=["årstidbruk", "String"];

sositypes["VEDTAKENDELIGPLANDATO"]=["vedtakEndeligPlanDato", "Date"];

sositypes["KUNNGJØRINGSDATO"]=["kunngjøringsdato", "Date"];

sositypes["KPBESTEMMELSEHJEMMEL"]=["kpBestemmelseHjemmel", "Integer"];

sositypes["RPBESTEMMELSEHJEMMEL"]=["rpBestemmelseHjemmel", "Integer"];

sositypes["CCDBRIKKELENGDE"]=["ccdBrikkelengde", "Integer"];

sositypes["CCDBRIKKESIDE"]=["ccdBrikkeside", "Integer"];

sositypes["BILDEOPPLØSNING"]=["bildeoppløsning", "Real"];

sositypes["BILDEFILFORMAT"]=["bildefilformat", "Integer"];

sositypes["STATLIGNR"]=["statlignummer", "Integer"];

sositypes["AEROTRIANGULERING"]=["aerotriangulering", "Integer"];

sositypes["PROSJEKTRAPPORTLINK"]=["prosjektrapportlink", "String"];

sositypes["BILDEFILIR"]=["bildefilIr", "String"];

sositypes["BILDEFILPAN"]=["bildefilPan", "String"];

sositypes["BILDEFILRGB"]=["bildefilRGB", "String"];

sositypes["BILDEFILMULTI"]=["bildefilMulti", "String"];

sositypes["ORTOFOTOTYPE"]=["ortofototype", "Integer"];

sositypes["KAMERALØPENUMMER"]=["løpenummer", "Integer"];

sositypes["PRODUKSJONSRAPPORTLINK"]=["produksjonsrapportlink", "String"];

sositypes["PRODUKTSPESIFIKASJONSLINK"]=["produktspesifikasjonslink", "String"];

sositypes["SAKSÅR"]=["saksår", "Integer"];

sositypes["SEKVENSNUMMER"]=["sekvensnummer", "Integer"];

sositypes["UTNTALL_MIN"]=["utnyttingstall_minimum", "Real"];

sositypes["GYLDIGTILDATO"]=["gyldigTilDato", "Date"];

sositypes["PIXELSTØRRELSE"]=["pixelstørrelse", "Real"];

sositypes["HENDELSESDATO"]=["Hendelsesdato", "Date"];

sositypes["NPPLANBESTEMMELSETYPE"]=["planbestemmelsetype", "Integer"];

sositypes["NPPLANTEMA"]=["planTema", "Integer"];

sositypes["FAGOMRÅDE_LINK"]=["link til fagområde", "String"];

sositypes["PRODUKT_LINK"]=["produktLink", "String"];


sositypes["ADRESSEBRUKSENHET"] = ["adresseBruksenhet", Array(3)];

sositypes["ADRESSEKOMMENTAR"] = ["adresseKommentar", Array(5)];

sositypes["ADRESSEREFERANSE"] = ["adresseReferanse", Array(2)];

sositypes["ADRESSETILLEGG"] = ["adresseTillegg", Array(3)];

sositypes["AID"] = ["gateadresseId",Array(3)];

sositypes["AJOURFØRING"] = ["ajourføring",Array(2)];

sositypes["AKVA_KONS_INFO"] = ["akvaKonsesjonsinformasjon", Array(7)];

sositypes["AKVA_PRØVE_INFO"] = ["akvaPrøvetakinformasjon", Array(9)];

sositypes["ANDEL"] = ["andel", Array(2)];

sositypes["AREALFORDELING"] = ["arealfordeling",Array(5)];

sositypes["BELASTNINGBOF5"] = ["belastningBOF5",Array(4)];

sositypes["BELASTNINGFOSFOR"] = ["belastningFosfor",Array(4)];

sositypes["BEREGNETAREAL"] = ["beregnetAreal",Array(2)];

sositypes["BILDEINFORMASJON"] = ["bildeinformasjon",Array(3)];

sositypes["BMARTOBS"] = ["bmArtsobservasjon",Array(4)];

sositypes["BMARTREG"] = ["bmArtsregistrering",Array(8)];

sositypes["BMKILDE"] = ["bmKilde",Array(2)];

sositypes["BMNATYPTILLEGG"] = ["bmNaturtypeTillegg",Array(2)];

sositypes["BRUKSENHET"] = ["bruksenhet",Array(10)];

sositypes["BYDELID"] = ["bydelId",Array(2)];

sositypes["BYGG_KOMMENTARER"] = ["bygningKommentar",Array(5)];

sositypes["BYGN_STAT_HIST"] = ["bygningsstatusHistorikk",Array(3)];

sositypes["BYGNING_TILLEGG"] = ["bygningTillegg",Array(15)];

sositypes["BYGNINGSREF"] = ["bygningsreferanse",Array(2)];

sositypes["DELOMRåDEID"] = ["delområdeId",Array(2)];

sositypes["DPOT_GRAS"] = ["dyrkingpotensjalGras",Array(4)];

sositypes["DPOT_KORN"] = ["dyrkingpotensjalKorn",Array(4)];

sositypes["DPOT_POTET"] = ["dyrkingpotensjalPotet",Array(4)];

sositypes["EKOORD"] = ["jordregisterEiendomsteigkoordinat",Array(3)];

sositypes["ENDRINGSFLAGG"] = ["endringsflagg",Array(2)];

sositypes["ENDRINGSVURDERING"] = ["endringsvurdering",Array(2)];

sositypes["ETASJE"] = ["etasje",Array(8)];

sositypes["ETASJEDATA"] = ["etasjedata",Array(6)];

sositypes["FELTREGISTRERT"] = ["feltregistrert",Array(3)];

sositypes["FIRMA_EIER"] = ["firmaeier",Array(7)];

sositypes["FISKE_BEDR_ID"] = ["fiskebedriftsidentifikasjon",Array(6)];

sositypes["FISKE_BEDR_INFO"] = ["fiskebedriftsinformasjon",Array(2)];

sositypes["FISKE_BEDR_MARKED"] = ["fiskebedriftsmarked",Array(2)];

sositypes["FISKE_BEDR_TJENESTE"] = ["fiskebedriftstjeneste",Array(3)];

sositypes["FISKERI_REDSKAP"] = ["fiskeriredskap",Array(4)];

sositypes["FISKERI_RESS_ART"] = ["fiskeriressursomrÃadeArt",Array(6)];

sositypes["FISKERI_RESSURS"] = ["fiskeriressurs",Array(2)];

sositypes["FMDATO"] = ["fastmerkeDato",Array(2)];

sositypes["FMIDNY"] = ["fastmerkeIdNy",Array(4)];

sositypes["FMSIGN"] = ["fastmerkeSignal",Array(2)];

sositypes["FMSTATUS"] = ["fastmerkeStatus",Array(2)];

sositypes["FMTYPE"] = ["fastmerkeType",Array(5)];

sositypes["FORUR_GRUNN_EIENDOM"] = ["forurensetGrunnEiendom",Array(2)];

sositypes["GRENSE_MELLOM"] = ["grenseMellomNasjonerSjÃ",Array(2)];

sositypes["GRUNNKRETSID"] = ["grunnkretsId",Array(2)];

sositypes["HAVNE_D_INFO"] = ["havnedistriktInformasjon",Array(2)];

sositypes["HOVEDMåLRUBRIKK"] = ["hovedmålRubrikk",Array(2)];

sositypes["HOVEDNR"] = ["landbruksregHovedNR",Array(1)];

sositypes["HYTTEINFORMASJON"] = ["hytteinformasjon",Array(3)];

sositypes["JORDTYPE"] = ["jordtype",Array(6)];

sositypes["JREGMARK"] = ["jordregisterMarkslag",Array(10)];

sositypes["JREGTEIG"] = ["jordregisterEiendomsteig",Array(4)];

sositypes["KAI_INFO"] = ["kaiInformasjon",Array(3)];

sositypes["KAMERAINFORMASJON"] = ["kamerainformasjon",Array(9)];

sositypes["KM_DAT_INFO"] = ["kulturminneDateringInfo",Array(2)];

sositypes["KM_DATERING"] = ["kulturminneDateringGruppe",Array(2)];

sositypes["KOMMUNALKRETS"] = ["kommunalKrets",Array(4)];

sositypes["KOPIDATA"] = ["kopidata",Array(3)];

sositypes["KOPLING"] = ["koplingsegenskaper",Array(8)];

sositypes["KURSLINJE_INFO"] = ["kurslinjeinformasjon",Array(4)];

sositypes["KVALITET"] = ["kvalitet",Array(6)];

sositypes["LEDNING"] = ["ledningsegenskaper",Array(8)];

sositypes["LEGGEåR"] = ["leggeÅr",Array(2)];

sositypes["LGID"] = ["landbruksregGrunneiendomNr",Array(8)];

sositypes["MATRIKKELADRESSEID"] = ["matrikkeladresseId",Array(2)];

sositypes["MATRIKKELNUMMER"] = ["matrikkelnummer",Array(5)];

sositypes["OVERLAPP"] = ["overlapp",Array(2)];

sositypes["POST"] = ["postadministrativeOmråder",Array(2)];

sositypes["REGISTRERINGSVERSJON"] = ["registreringsversjon",Array(2)];

sositypes["RESIPIENT"] = ["resipient",Array(5)];

sositypes["RETNING"] = ["retningsvektor",Array(3)];

sositypes["RØR_DIMENSJON"] = ["ledningsdimensjon",Array(2)];

sositypes["SAK"] = ["saksinformasjon",Array(4)];

sositypes["SEFRAK_ID"] = ["sefrakId",Array(3)];

sositypes["SEFRAKFUNKSJON"] = ["sefrakFunksjon",Array(2)];

sositypes["SENTRUMSSONEID"] = ["sentrumssoneId",Array(2)];

sositypes["SERV"] = ["servituttgruppe",Array(3)];

sositypes["SKRETSID"] = ["skolekretsID",Array(2)];

sositypes["SP_ADM"] = ["skogbrplanAdmDataGruppe",Array(2)];

sositypes["SP_AKLASS"] = ["skogbrplanKlassGruppe",Array(6)];

sositypes["SP_BESTAND"] = ["skogbrplanBestandGruppe", Array(2)];

sositypes["SP_BSKRIV"] = ["skogbrplanBeskrivBestandGruppe",Array(13)];

sositypes["SP_FLBRELEM"] = ["skogbrplanFlerKoderGruppe",Array(5)];

sositypes["SP_GRLVOL"] = ["skogbrplanGrunnlagVolBer",Array(8)];

sositypes["SP_TEIG"] = ["skogbrplanTeigGruppe",Array(4)];

sositypes["SP_TERKLASS"] = ["skogbrplanTerrengGruppe",Array(5)];

sositypes["SP_TETTHOYD"] = ["skogbrplanTetthetGruppe",Array(2)];

sositypes["SP_TILTAK"] = ["skogbrplanTiltakGruppe",Array(5)];

sositypes["SP_TILVVOL"] = ["skogbrplanTilvekstGruppe",Array(4)];

sositypes["SP_TRESL"] = ["skogbrplanTreslagGruppe",Array(8)];

sositypes["TETTSTEDID"] = ["tettstedId",Array(2)];

sositypes["UNIVERSELLUTFORMING"] = ["universellUtforming",Array(3)];

sositypes["UTNYTT"] = ["utnytting",Array(2)];

sositypes["UTSLIPP"] = ["utslipp",Array(3)];

sositypes["UTV_TILL_PART"] = ["utvinningstillatelsespartner",Array(2)];

sositypes["VERN"] = ["vern",Array(4)];

sositypes["VKRETS"] = ["valgkretsId",Array(2)];

sositypes["VNR"] = ["vegident",Array(3)];

sositypes["VPA"] = ["vegparsell",Array(3)];

sositypes["ADRESSEBRUKSENHET"][1][1] = ["etasjenummer","Integer"];
sositypes["ADRESSEBRUKSENHET"][1][2] = ["etasjeplan","String"];
sositypes["ADRESSEBRUKSENHET"][1][0] = ["bruksenhetLøpenr","Integer"];
sositypes["ADRESSEKOMMENTAR"][1][0] = ["etat","String"];
sositypes["ADRESSEKOMMENTAR"][1][2] = ["kommentar","String"];
sositypes["ADRESSEKOMMENTAR"][1][1] = ["kommentarType","String"];
sositypes["ADRESSEKOMMENTAR"][1][4] = ["lagretDato","Date"];
sositypes["ADRESSEKOMMENTAR"][1][3] = ["saksnummer","Integer"];
sositypes["ADRESSEREFERANSE"][1][1] = ["adresseReferansekode","String"];
sositypes["ADRESSEREFERANSE"][1][0] = ["referanse","String"];
sositypes["ADRESSETILLEGG"][1][1] = ["adresseKommentar","String"];
sositypes["ADRESSETILLEGG"][1][2] = ["adresseReferanse","String"];
sositypes["ADRESSETILLEGG"][1][0] = ["kartbladindeks","String"];
sositypes["AID"][1][2] = ["bokstav","String"];
sositypes["AID"][1][0] = ["gatenummer","Integer"];
sositypes["AID"][1][1] = ["husnummer","Integer"];
sositypes["AJOURFØRING"][1][1] = ["ajourførtAv","String"];
sositypes["AJOURFØRING"][1][0] = ["ajourførtDato","Date"];
sositypes["AKVA_KONS_INFO"][1][1] = ["akvaKonsesjonsnummer","Integer"];
sositypes["AKVA_KONS_INFO"][1][4] = ["konsesjonsstatus","String"];
sositypes["AKVA_KONS_INFO"][1][6] = ["konsesjonstype","String"];
sositypes["AKVA_KONS_INFO"][1][5] = ["konsesjonsformål","String"];
sositypes["AKVA_KONS_INFO"][1][0] = ["fiskebruksnummerFylke","String"];
sositypes["AKVA_KONS_INFO"][1][2] = ["lokalitetsnavn","String"];
sositypes["AKVA_KONS_INFO"][1][3] = ["lokalitetsnummer","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][7] = ["akvaTemperatur","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][1] = ["algekonsentrasjon","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][0] = ["algetype","String"];
sositypes["AKVA_PRØVE_INFO"][1][5] = ["klorofyllMaksimum","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][8] = ["salinitet","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][6] = ["sikteDyp","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][2] = ["strømretning","Integer"];
sositypes["AKVA_PRØVE_INFO"][1][4] = ["vindretning","Integer"];
sositypes["ANDEL"][1][1] = ["nevner","Real"];
sositypes["ANDEL"][1][0] = ["teller","Real"];
sositypes["AREALFORDELING"][1][4] = ["prosentElv","Real"];
sositypes["AREALFORDELING"][1][2] = ["prosentHav","Real"];
sositypes["AREALFORDELING"][1][3] = ["prosentInnsjø","Real"];
sositypes["AREALFORDELING"][1][1] = ["prosentLand","Real"];
sositypes["AREALFORDELING"][1][0] = ["totalarealKm2","Real"];
sositypes["BELASTNINGBOF5"][1][2] = ["andrekilderBelastning","Integer"];
sositypes["BELASTNINGBOF5"][1][0] = ["husholdBelastning","Integer"];
sositypes["BELASTNINGBOF5"][1][1] = ["industriBelastning","Integer"];
sositypes["BELASTNINGBOF5"][1][3] = ["totalbelastning","Integer"];
sositypes["BELASTNINGFOSFOR"][1][2] = ["andrekilderBelastning","Integer"];
sositypes["BELASTNINGFOSFOR"][1][0] = ["husholdBelastning","Integer"];
sositypes["BELASTNINGFOSFOR"][1][1] = ["industriBelastning","Integer"];
sositypes["BELASTNINGFOSFOR"][1][3] = ["totalbelastning","Integer"];
sositypes["BEREGNETAREAL"][1][0] = ["areal","Real"];
sositypes["BEREGNETAREAL"][1][1] = ["arealmerknad","String"];
sositypes["BILDEINFORMASJON"][1][1] = ["brennvidde","Real"];
sositypes["BILDEINFORMASJON"][1][2] = ["fotograf","String"];
sositypes["BILDEINFORMASJON"][1][0] = ["kameratype","String"];
sositypes["BMARTOBS"][1][1] = ["bmAntall","Integer"];
sositypes["BMARTOBS"][1][0] = ["bmArt","String"];
sositypes["BMARTOBS"][1][2] = ["bmEnhet","Integer"];
sositypes["BMARTOBS"][1][3] = ["bmRegistreringsdato","Date"];
sositypes["BMARTREG"][1][6] = ["bmÅrstid","Integer"];
sositypes["BMARTREG"][1][0] = ["bmArt","String"];
sositypes["BMARTREG"][1][2] = ["bmOmrådefunksjon","Integer"];
sositypes["BMARTREG"][1][5] = ["bmFunksjonskvalitet","Integer"];
sositypes["BMARTREG"][1][7] = ["bmKilde","String"];
sositypes["BMARTREG"][1][1] = ["bmRegistreringsdato","Date"];
sositypes["BMARTREG"][1][3] = ["bmTruethetskategori","String"];
sositypes["BMARTREG"][1][4] = ["bmViltvekt","Integer"];
sositypes["BMKILDE"][1][1] = ["bmKildetype","Integer"];
sositypes["BMKILDE"][1][0] = ["bmKildevurdering","Integer"];
sositypes["BMNATYPTILLEGG"][1][1] = ["bmAndel","Integer"];
sositypes["BMNATYPTILLEGG"][1][0] = ["bmNaturtype","String"];
sositypes["BRUKSENHET"][1][7] = ["antallBad","Integer"];
sositypes["BRUKSENHET"][1][6] = ["antallRom","Integer"];
sositypes["BRUKSENHET"][1][8] = ["antallWC","Integer"];
sositypes["BRUKSENHET"][1][5] = ["bruksareal","Real"];
sositypes["BRUKSENHET"][1][4] = ["bruksenhetstype","String"];
sositypes["BRUKSENHET"][1][2] = ["etasjenummer","Integer"];
sositypes["BRUKSENHET"][1][1] = ["etasjeplan","String"];
sositypes["BRUKSENHET"][1][9] = ["kjøkkenTilgang","Integer"];
sositypes["BRUKSENHET"][1][3] = ["bruksenhetLøpenr","Integer"];
sositypes["BRUKSENHET"][1][0] = ["matrikkelnummer","String"];
sositypes["BYDELID"][1][0] = ["bydelsnavn","String"];
sositypes["BYDELID"][1][1] = ["bydelsnummer","Integer"];
sositypes["BYGG_KOMMENTARER"][1][3] = ["bygnSaksnr","String"];
sositypes["BYGG_KOMMENTARER"][1][0] = ["etat","String"];
sositypes["BYGG_KOMMENTARER"][1][2] = ["kommentar","String"];
sositypes["BYGG_KOMMENTARER"][1][1] = ["kommentarType","String"];
sositypes["BYGG_KOMMENTARER"][1][4] = ["lagretDato","Date"];
sositypes["BYGN_STAT_HIST"][1][0] = ["bygningsstatus","String"];
sositypes["BYGN_STAT_HIST"][1][1] = ["bygningshistorikkDato","Date"];
sositypes["BYGN_STAT_HIST"][1][2] = ["registrertDato","Date"];
sositypes["BYGNING_TILLEGG"][1][0] = ["alternativtArealBygning","Real"];
sositypes["BYGNING_TILLEGG"][1][1] = ["antallEtasjer","Integer"];
sositypes["BYGNING_TILLEGG"][1][2] = ["antallRøkløp","Real"];
sositypes["BYGNING_TILLEGG"][1][3] = ["brenseltankNedgravd","Integer"];
sositypes["BYGNING_TILLEGG"][1][14] = ["bygningKommentar","String"];
sositypes["BYGNING_TILLEGG"][1][13] = ["bygningsreferanse","String"];
sositypes["BYGNING_TILLEGG"][1][9] = ["fundamentering","Integer"];
sositypes["BYGNING_TILLEGG"][1][12] = ["horisontalBærekonstr","Integer"];
sositypes["BYGNING_TILLEGG"][1][5] = ["kartbladindeks","String"];
sositypes["BYGNING_TILLEGG"][1][6] = ["kildePrivatVannforsyning","Integer"];
sositypes["BYGNING_TILLEGG"][1][10] = ["materialeIYttervegg","Integer"];
sositypes["BYGNING_TILLEGG"][1][7] = ["privatKloakkRensing","Integer"];
sositypes["BYGNING_TILLEGG"][1][8] = ["renovasjon","Integer"];
sositypes["BYGNING_TILLEGG"][1][4] = ["septiktank","String"];
sositypes["BYGNING_TILLEGG"][1][11] = ["vertikalBærekonstr","Integer"];
sositypes["BYGNINGSREF"][1][1] = ["bygningReferansetype","String"];
sositypes["BYGNINGSREF"][1][0] = ["referanse","String"];
sositypes["DELOMRåDEID"][1][0] = ["delområdenavn","String"];
sositypes["DELOMRåDEID"][1][1] = ["delområdenummer","String"];
sositypes["DPOT_GRAS"][1][2] = ["nedbørsbasert","Integer"];
sositypes["DPOT_GRAS"][1][3] = ["nedklassifiseringNedbør","Integer"];
sositypes["DPOT_GRAS"][1][0] = ["vanningsbasert","Integer"];
sositypes["DPOT_GRAS"][1][1] = ["nedklassifiseringVanning","Integer"];
sositypes["DPOT_KORN"][1][2] = ["nedbørsbasert","Integer"];
sositypes["DPOT_KORN"][1][3] = ["nedklassifiseringNedbør","Integer"];
sositypes["DPOT_KORN"][1][0] = ["vanningsbasert","Integer"];
sositypes["DPOT_KORN"][1][1] = ["nedklassifiseringVanning","Integer"];
sositypes["DPOT_POTET"][1][2] = ["nedbørsbasert","Integer"];
sositypes["DPOT_POTET"][1][3] = ["nedklassifiseringNedbør","Integer"];
sositypes["DPOT_POTET"][1][0] = ["vanningsbasert","Integer"];
sositypes["DPOT_POTET"][1][1] = ["nedklassifiseringVanning","Integer"];
sositypes["EKOORD"][1][2] = ["jordregisterKoordinatHøyde","Integer"];
sositypes["EKOORD"][1][0] = ["jordregisterKoordinatNord","Integer"];
sositypes["EKOORD"][1][1] = ["jordregisterKoordinatØst","Integer"];
sositypes["ENDRINGSFLAGG"][1][1] = ["tidspunktEndring","Date"];
sositypes["ENDRINGSFLAGG"][1][0] = ["typeEndring","String"];
sositypes["ENDRINGSVURDERING"][1][0] = ["endringsgrad","String"];
sositypes["ENDRINGSVURDERING"][1][1] = ["vurdertDato","Date"];
sositypes["ETASJE"][1][2] = ["antallBoenheter","Integer"];
sositypes["ETASJE"][1][4] = ["bruksarealTilAnnet","Real"];
sositypes["ETASJE"][1][3] = ["bruksarealTilBolig","Real"];
sositypes["ETASJE"][1][5] = ["bruksarealTotalt","Real"];
sositypes["ETASJE"][1][1] = ["etasjenummer","Integer"];
sositypes["ETASJE"][1][0] = ["etasjeplan","String"];
sositypes["ETASJE"][1][6] = ["kommAlternativtAreal","Real"];
sositypes["ETASJE"][1][7] = ["kommAlternativtAreal2","Real"];
sositypes["ETASJEDATA"][1][4] = ["sumAlternativtAreal","Real"];
sositypes["ETASJEDATA"][1][5] = ["sumAlternativtAreal2","Real"];
sositypes["ETASJEDATA"][1][0] = ["sumAntallBoenheter","Integer"];
sositypes["ETASJEDATA"][1][3] = ["sumBruksarealTotalt","Real"];
sositypes["ETASJEDATA"][1][2] = ["sumBruksarealTilAnnet","Real"];
sositypes["ETASJEDATA"][1][1] = ["sumBruksarealTilBolig","Real"];
sositypes["FELTREGISTRERT"][1][2] = ["ajourføring","String"];
sositypes["FELTREGISTRERT"][1][1] = ["datafangstdato","Date"];
sositypes["FELTREGISTRERT"][1][0] = ["feltregistrertAv","String"];
sositypes["FIRMA_EIER"][1][2] = ["adresse","String"];
sositypes["FIRMA_EIER"][1][0] = ["firmanavn","String"];
sositypes["FIRMA_EIER"][1][1] = ["bedriftseier","String"];
sositypes["FIRMA_EIER"][1][6] = ["kontaktperson","String"];
sositypes["FIRMA_EIER"][1][3] = ["postnummer","Integer"];
sositypes["FIRMA_EIER"][1][5] = ["telefaxnummer","Integer"];
sositypes["FIRMA_EIER"][1][4] = ["telefonnummer","Integer"];
sositypes["FISKE_BEDR_ID"][1][4] = ["antallAnsatte","Integer"];
sositypes["FISKE_BEDR_ID"][1][5] = ["antallÅrsverk","Integer"];
sositypes["FISKE_BEDR_ID"][1][0] = ["fiskebedriftsnavn","String"];
sositypes["FISKE_BEDR_ID"][1][2] = ["fiskebruksnummer","Integer"];
sositypes["FISKE_BEDR_ID"][1][1] = ["fiskebruksnummerFylke","String"];
sositypes["FISKE_BEDR_ID"][1][3] = ["firmaeier","String"];
sositypes["FISKE_BEDR_INFO"][1][1] = ["artskode","Integer"];
sositypes["FISKE_BEDR_INFO"][1][0] = ["fisketype","Integer"];
sositypes["FISKE_BEDR_MARKED"][1][0] = ["fiskebedriftsandel","Integer"];
sositypes["FISKE_BEDR_MARKED"][1][1] = ["fiskebedriftsområde","Integer"];
sositypes["FISKE_BEDR_TJENESTE"][1][2] = ["fiskebedriftservice","Integer"];
sositypes["FISKE_BEDR_TJENESTE"][1][1] = ["fiskekapasitetEnhet","Integer"];
sositypes["FISKE_BEDR_TJENESTE"][1][0] = ["fiskekapasitet","Integer"];
sositypes["FISKERI_REDSKAP"][1][0] = ["fiskeriredskapGenAktiv","Integer"];
sositypes["FISKERI_REDSKAP"][1][1] = ["fiskeriredskapGenPassiv","Integer"];
sositypes["FISKERI_REDSKAP"][1][2] = ["fiskeriredskapSpesAktiv","Integer"];
sositypes["FISKERI_REDSKAP"][1][3] = ["fiskeriredskapSpesPassiv","Integer"];
sositypes["FISKERI_RESS_ART"][1][3] = ["engelskArtsnavn","String"];
sositypes["FISKERI_RESS_ART"][1][2] = ["vitenskapeligArtsnavn","String"];
sositypes["FISKERI_RESS_ART"][1][1] = ["norskArtsnavn","String"];
sositypes["FISKERI_RESS_ART"][1][0] = ["taksonomiskKode","Integer"];
sositypes["FISKERI_RESS_ART"][1][4] = ["faoKode","String"];
sositypes["FISKERI_RESS_ART"][1][5] = ["artskode","Integer"];
sositypes["FISKERI_RESSURS"][1][0] = ["fiskeriressursområdeArt","String"];
sositypes["FISKERI_RESSURS"][1][1] = ["periode","String"];
sositypes["FMDATO"][1][1] = ["beregningsDato","Date"];
sositypes["FMDATO"][1][0] = ["fastmerkeEtableringsdato","Date"];
sositypes["FMIDNY"][1][1] = ["fastmerkeInstitusjon","String"];
sositypes["FMIDNY"][1][0] = ["fastmerkeKommune","Integer"];
sositypes["FMIDNY"][1][2] = ["fastmerkeNummer","String"];
sositypes["FMIDNY"][1][3] = ["indikatorFastmerkenummer","String"];
sositypes["FMSIGN"][1][1] = ["signalHøyde","Real"];
sositypes["FMSIGN"][1][0] = ["signalType","String"];
sositypes["FMSTATUS"][1][1] = ["typeStatus","Integer"];
sositypes["FMSTATUS"][1][0] = ["verifiseringsdato","Date"];
sositypes["FMTYPE"][1][0] = ["boltType","Integer"];
sositypes["FMTYPE"][1][3] = ["fastmerkeDiameter","Integer"];
sositypes["FMTYPE"][1][4] = ["gravertTekst","String"];
sositypes["FMTYPE"][1][1] = ["materialeBolt","Integer"];
sositypes["FMTYPE"][1][2] = ["fastmerkeUnderlag","Integer"];
sositypes["FORUR_GRUNN_EIENDOM"][1][1] = ["arealbrukRestriksjon","Integer"];
sositypes["FORUR_GRUNN_EIENDOM"][1][0] = ["matrikkelnummer","String"];
sositypes["GRENSE_MELLOM"][1][0] = ["førsteLand","String"];
sositypes["GRENSE_MELLOM"][1][1] = ["annetLand","String"];
sositypes["GRUNNKRETSID"][1][1] = ["grunnkretsnavn","String"];
sositypes["GRUNNKRETSID"][1][0] = ["grunnkretsnummer","Integer"];
sositypes["HAVNE_D_INFO"][1][1] = ["havnedistriktAdministrasjon","Integer"];
sositypes["HAVNE_D_INFO"][1][0] = ["kommune","Integer"];
sositypes["HOVEDMåLRUBRIKK"][1][1] = ["bredde","Integer"];
sositypes["HOVEDMåLRUBRIKK"][1][0] = ["lengde","Integer"];
sositypes["HOVEDNR"][1][1] = [" kommunenummer","Integer"];
sositypes["HOVEDNR"][1][0] = ["matrikkelnummer","String"];
sositypes["HYTTEINFORMASJON"][1][1] = ["betjeningsgrad","String"];
sositypes["HYTTEINFORMASJON"][1][0] = ["hytteId","Integer"];
sositypes["HYTTEINFORMASJON"][1][2] = ["hytteeier","Integer"];
sositypes["JORDTYPE"][1][0] = ["serie1","String"];
sositypes["JORDTYPE"][1][2] = ["serie2","String"];
sositypes["JORDTYPE"][1][4] = ["serie3","String"];
sositypes["JORDTYPE"][1][1] = ["tekstur1","String"];
sositypes["JORDTYPE"][1][3] = ["tekstur2","String"];
sositypes["JORDTYPE"][1][5] = ["tekstur3","String"];
sositypes["JREGMARK"][1][1] = ["potensiellSkogbonitetOmkodet","Integer"];
sositypes["JREGMARK"][1][0] = ["arealtilstand","Integer"];
sositypes["JREGMARK"][1][7] = ["jordregisterDyrkingsjord","String"];
sositypes["JREGMARK"][1][6] = ["jordregisterFreg","Integer"];
sositypes["JREGMARK"][1][5] = ["jordregisterLreg","String"];
sositypes["JREGMARK"][1][3] = ["jordklassifikasjon","Integer"];
sositypes["JREGMARK"][1][4] = ["myrklassifikasjon","Integer"];
sositypes["JREGMARK"][1][8] = ["jordregisterSkogtype","Integer"];
sositypes["JREGMARK"][1][9] = ["jordregisterSkogreisningsmark","Integer"];
sositypes["JREGMARK"][1][2] = ["tilleggsopplysningerSkog","Integer"];
sositypes["JREGTEIG"][1][2] = ["jordregisterDriftssenter","Integer"];
sositypes["JREGTEIG"][1][3] = ["jordregisterStatusEiendom","Integer"];
sositypes["JREGTEIG"][1][0] = ["matrikkelnummer","String"];
sositypes["JREGTEIG"][1][1] = ["jordregisterEiendomTeigNummer","Integer"];
sositypes["KAI_INFO"][1][1] = ["kaiDybde","Real"];
sositypes["KAI_INFO"][1][0] = ["kaiType","Integer"];
sositypes["KAI_INFO"][1][2] = ["kommunenummer","Integer"];
sositypes["KAMERAINFORMASJON"][1][4] = ["bildekategori","Integer"];
sositypes["KAMERAINFORMASJON"][1][3] = ["brennvidde","Real"];
sositypes["KAMERAINFORMASJON"][1][7] = ["film","String"];
sositypes["KAMERAINFORMASJON"][1][8] = ["kalibreringsrapport","String"];
sositypes["KAMERAINFORMASJON"][1][1] = ["kameratype","String"];
sositypes["KAMERAINFORMASJON"][1][0] = ["opptaksmetode","Integer"];
sositypes["KM_DAT_INFO"][1][0] = ["sefrakTiltak","Integer"];
sositypes["KM_DAT_INFO"][1][1] = ["tidsangivelse","Integer"];
sositypes["KM_DATERING"][1][0] = ["kulturminneDatering","String"];
sositypes["KM_DATERING"][1][1] = ["kulturminneDateringKvalitet","String"];
sositypes["KOMMUNALKRETS"][1][3] = ["kretsnavn","String"];
sositypes["KOMMUNALKRETS"][1][2] = ["kretsnummer","String"];
sositypes["KOMMUNALKRETS"][1][0] = ["kretstypekode","String"];
sositypes["KOMMUNALKRETS"][1][1] = ["kretstypenavn","String"];
sositypes["KOPIDATA"][1][2] = ["kopidato","Date"];
sositypes["KOPIDATA"][1][0] = ["områdeId","Integer"];
sositypes["KOPIDATA"][1][1] = ["originalDatavert","String"];
sositypes["KOPLING"][1][1] = ["fagområde","Integer"];
sositypes["KOPLING"][1][4] = ["bruksområde","String"];
sositypes["KOPLING"][1][2] = ["koplingskategori","Integer"];
sositypes["KOPLING"][1][0] = ["koplingsnavn","String"];
sositypes["KOPLING"][1][3] = ["koplingstype","String"];
sositypes["KOPLING"][1][7] = ["bildelink","String"];
sositypes["KOPLING"][1][5] = ["materiellkode","String"];
sositypes["KOPLING"][1][6] = ["verdi","Integer"];
sositypes["KURSLINJE_INFO"][1][0] = ["fartøyIdentifikasjon","String"];
sositypes["KURSLINJE_INFO"][1][1] = ["satellittkommunikasjonsId","String"];
sositypes["KURSLINJE_INFO"][1][3] = ["sporhastighet","Integer"];
sositypes["KURSLINJE_INFO"][1][2] = ["tidspunkt","Date"];
sositypes["KVALITET"][1][3] = ["målemetodeHøyde","Integer"];
sositypes["KVALITET"][1][4] = ["nøyaktighetHøyde","Integer"];
sositypes["KVALITET"][1][5] = ["maksimaltAvvik","Integer"];
sositypes["KVALITET"][1][0] = ["målemetode","Integer"];
sositypes["KVALITET"][1][1] = ["nøyaktighet","Integer"];
sositypes["KVALITET"][1][2] = ["synbarhet","Integer"];
sositypes["LEDNING"][1][1] = ["fagområde","Integer"];
sositypes["LEDNING"][1][3] = ["bruksområde","String"];
sositypes["LEDNING"][1][0] = ["ledningsnavn","String"];
sositypes["LEDNING"][1][2] = ["ledningstype","Integer"];
sositypes["LEDNING"][1][7] = ["leggeår","String"];
sositypes["LEDNING"][1][6] = ["lengde","Real"];
sositypes["LEDNING"][1][5] = ["materiellkode","String"];
sositypes["LEDNING"][1][4] = ["nettnivå","String"];
sositypes["LEGGEåR"][1][0] = ["alderReferanse","Integer"];
sositypes["LEGGEåR"][1][1] = ["årstall","Integer"];
sositypes["LGID"][1][7] = ["landbruksregAktiv","Integer"];
sositypes["LGID"][1][6] = ["landbruksregType","Integer"];
sositypes["LGID"][1][0] = ["matrikkelnummer","String"];
sositypes["MATRIKKELADRESSEID"][1][0] = ["matrikkelnummer","String"];
sositypes["MATRIKKELADRESSEID"][1][1] = ["undernr","Integer"];
sositypes["MATRIKKELNUMMER"][1][2] = ["bruksnummer","Integer"];
sositypes["MATRIKKELNUMMER"][1][3] = ["festenummer","Integer"];
sositypes["MATRIKKELNUMMER"][1][1] = ["gårdsnummer","Integer"];
sositypes["MATRIKKELNUMMER"][1][0] = ["matrikkelkommune","Integer"];
sositypes["MATRIKKELNUMMER"][1][4] = ["seksjonsnummer","Integer"];
sositypes["OVERLAPP"][1][0] = ["lengdeoverlapp","Integer"];
sositypes["OVERLAPP"][1][1] = ["sideoverlapp","Integer"];
sositypes["POST"][1][1] = ["poststedsnavn","String"];
sositypes["POST"][1][0] = ["postnummer","Integer"];
sositypes["REGISTRERINGSVERSJON"][1][0] = ["produkt","String"];
sositypes["REGISTRERINGSVERSJON"][1][1] = ["versjon","String"];
sositypes["RESIPIENT"][1][2] = ["fjordId","String"];
sositypes["RESIPIENT"][1][0] = ["resipientnavn","String"];
sositypes["RESIPIENT"][1][4] = ["resipienttype","String"];
sositypes["RESIPIENT"][1][1] = ["vassdragsnummer","String"];
sositypes["RESIPIENT"][1][3] = ["vatnLøpenummer","Integer"];
sositypes["RETNING"][1][1] = ["retningsenhet","Integer"];
sositypes["RETNING"][1][2] = ["retningsreferanse","Integer"];
sositypes["RETNING"][1][0] = ["retningsverdi","Real"];
sositypes["RØR_DIMENSJON"][1][1] = ["lengdeenhet","String"];
sositypes["RØR_DIMENSJON"][1][0] = ["måltall","Real"];
sositypes["SAK"][1][3] = ["vedtaksmyndighet","String"];
sositypes["SAK"][1][0] = ["saksnummer","Integer"];
sositypes["SAK"][1][2] = ["utvalgssaksnummer","Integer"];
sositypes["SAK"][1][1] = ["vedtaksdato","Date"];
sositypes["SEFRAK_ID"][1][2] = ["husLøpenr","Integer"];
sositypes["SEFRAK_ID"][1][1] = ["registreringKretsnr","Integer"];
sositypes["SEFRAK_ID"][1][0] = ["SEFRAKkommune","Integer"];
sositypes["SEFRAKFUNKSJON"][1][0] = ["sefrakFunksjonskode","Integer"];
sositypes["SEFRAKFUNKSJON"][1][1] = ["sefrakFunksjonsstatus","String"];
sositypes["SENTRUMSSONEID"][1][1] = ["sentrumssonenavn","String"];
sositypes["SENTRUMSSONEID"][1][0] = ["sentrumssonenummer","Integer"];
sositypes["SERV"][1][2] = ["informasjon","String"];
sositypes["SERV"][1][0] = ["matrikkelnummer","String"];
sositypes["SERV"][1][1] = ["servituttType","String"];
sositypes["SKRETSID"][1][1] = ["skolekretsnavn","String"];
sositypes["SKRETSID"][1][0] = ["skolekretsnummer","Integer"];
sositypes["SP_ADM"][1][0] = ["skogbrplanAdmDatoEndring","Date"];
sositypes["SP_ADM"][1][1] = ["skogbrplanAdmDatoEtablering","Date"];
sositypes["SP_AKLASS"][1][0] = ["skogbrplanKlassAktueltTreslag","Integer"];
sositypes["SP_AKLASS"][1][1] = ["skogbrplanKlassAktSnittBon","Integer"];
sositypes["SP_AKLASS"][1][3] = ["skogbrplanKlassImpProsent","Integer"];
sositypes["SP_AKLASS"][1][2] = ["skogbrplanKlassImpType","Integer"];
sositypes["SP_AKLASS"][1][4] = ["skogbrplanKlassPotTreslag","Integer"];
sositypes["SP_AKLASS"][1][5] = ["skogbrplanKlassPotSnittBon","Integer"];
sositypes["SP_BESTAND"][1][1] = ["skogbrplanBestandDelNr","Integer"];
sositypes["SP_BESTAND"][1][0] = ["skogbrplanBestandNr","Integer"];
sositypes["SP_BSKRIV"][1][2] = ["skogbrplanBeskrivBestandAlder","Integer"];
sositypes["SP_BSKRIV"][1][3] = ["skogbrplanBeskrivBestandDaa","Real"];
sositypes["SP_BSKRIV"][1][6] = ["skogbrplanBeskrivBestSnittDiam","Integer"];
sositypes["SP_BSKRIV"][1][4] = ["skogbrplanBeskrivBestandSnittM2","Integer"];
sositypes["SP_BSKRIV"][1][5] = ["skogbrplanBeskrivBestandSnittH","Real"];
sositypes["SP_BSKRIV"][1][7] = ["skogbrplanBeskrivBarHøydehkl2","Integer"];
sositypes["SP_BSKRIV"][1][0] = ["skogbrplanBeskrivHogstklasse","Integer"];
sositypes["SP_BSKRIV"][1][8] = ["skogbrplanBeskrivLauvHøydehkl2","Integer"];
sositypes["SP_BSKRIV"][1][9] = ["skogbrplanBeskrivSjiktning","Integer"];
sositypes["SP_BSKRIV"][1][1] = ["skogbrplanBeskrivSkogtype","Integer"];
sositypes["SP_BSKRIV"][1][10] = ["skogbrplanBeskrivSunnhet","Integer"];
sositypes["SP_BSKRIV"][1][11] = ["skogbrplanBeskrivTreERegulering","Integer"];
sositypes["SP_BSKRIV"][1][12] = ["skogbrplanBeskrivTreFRegulering","Integer"];
sositypes["SP_FLBRELEM"][1][0] = ["skogbrplanFlerKoderElementtype","Integer"];
sositypes["SP_FLBRELEM"][1][1] = ["skogbrplanFlerKoderArealProsent","Integer"];
sositypes["SP_FLBRELEM"][1][2] = ["skogbrplanFlerKoderArealDaa","Integer"];
sositypes["SP_FLBRELEM"][1][3] = ["skogbrplanFlerKoderSpesBehPros","Integer"];
sositypes["SP_FLBRELEM"][1][4] = ["skogbrplanFlerKoderSpesBehDaa","Integer"];
sositypes["SP_GRLVOL"][1][3] = ["skogbrplanGrunnlagVolumDaaFelt","Real"];
sositypes["SP_GRLVOL"][1][4] = ["skogbrplanGrunnlagVolumBestFelt","Integer"];
sositypes["SP_GRLVOL"][1][0] = ["skogbrplanGrunnlagBerType","Integer"];
sositypes["SP_GRLVOL"][1][2] = ["skogbrplanGrunnlagHovedgruppe","Integer"];
sositypes["SP_GRLVOL"][1][6] = ["skogbrplanGrunnlagRegion","Integer"];
sositypes["SP_GRLVOL"][1][5] = ["skogbrplanGrunnlagSvinnProsent","Integer"];
sositypes["SP_GRLVOL"][1][1] = ["skogbrplanGrunnlagTaksttype","Integer"];
sositypes["SP_GRLVOL"][1][7] = ["skogbrplanGrunnlagTilvekstkorr","Integer"];
sositypes["SP_TEIG"][1][3] = ["matrikkelnummer","String"];
sositypes["SP_TEIG"][1][2] = ["skogbrplanTeigGrend","Integer"];
sositypes["SP_TEIG"][1][0] = ["skogbrplanTeigNr","Integer"];
sositypes["SP_TEIG"][1][1] = ["skogbrplanTeigNavn","String"];
sositypes["SP_TERKLASS"][1][0] = ["skogbrplanTerrengBæreevneBestand","Integer"];
sositypes["SP_TERKLASS"][1][1] = ["skogbrplanTerrengBestandBratthet","Integer"];
sositypes["SP_TERKLASS"][1][2] = ["skogbrplanTerrengLiLengde","Integer"];
sositypes["SP_TERKLASS"][1][3] = ["skogbrplanTerrengMinTranspUtst","Integer"];
sositypes["SP_TERKLASS"][1][4] = ["skogbrplanTerrengJevnhet","Integer"];
sositypes["SP_TETTHOYD"][1][0] = ["skogbrplanTetthetGrunnflatesum","Integer"];
sositypes["SP_TETTHOYD"][1][1] = ["skogbrplanTetthetMHøyde","Integer"];
sositypes["SP_TILTAK"][1][3] = ["skogbrplanTiltakProritet","Integer"];
sositypes["SP_TILTAK"][1][1] = ["skogbrplanTiltakProsent","Integer"];
sositypes["SP_TILTAK"][1][4] = ["skogbrplanTiltakAreal","Real"];
sositypes["SP_TILTAK"][1][0] = ["skogbrplanTiltakBestand","Integer"];
sositypes["SP_TILTAK"][1][2] = ["skogbrplanTiltakÅr","Integer"];
sositypes["SP_TILVVOL"][1][0] = ["skogbrplanTilvekstBeregnDaa","Real"];
sositypes["SP_TILVVOL"][1][1] = ["skogbrplanTilvekstBeregnProsent","Real"];
sositypes["SP_TILVVOL"][1][2] = ["skogbrplanTilvekstBeregnM3","Real"];
sositypes["SP_TILVVOL"][1][3] = ["skogbrplanTilvekstVolumBestand","Integer"];
sositypes["SP_TRESL"][1][4] = ["skogbrplanTreslagAntTreDaaEReg","Integer"];
sositypes["SP_TRESL"][1][3] = ["skogbrplanTreslagAntTreDaaFReg","Integer"];
sositypes["SP_TRESL"][1][0] = ["skogbrplanTreslag","Integer"];
sositypes["SP_TRESL"][1][1] = ["skogbrplanTreslagHøyde","Integer"];
sositypes["SP_TRESL"][1][2] = ["skogbrplanTreslagProsent","Integer"];
sositypes["SP_TRESL"][1][5] = ["skogbrplanTreslagKorrVolumUBark","Integer"];
sositypes["SP_TRESL"][1][7] = ["skogbrplanTreslagSalgsvolumUBark","Integer"];
sositypes["SP_TRESL"][1][6] = ["skogbrplanTreslagUkorrVolumUBark","Integer"];
sositypes["TETTSTEDID"][1][1] = ["tettstednavn","String"];
sositypes["TETTSTEDID"][1][0] = ["tettstednummer","Integer"];
sositypes["UNIVERSELLUTFORMING"][1][2] = ["informasjon","String"];
sositypes["UNIVERSELLUTFORMING"][1][0] = ["tilgjengelighetsvurdering","String"];
sositypes["UNIVERSELLUTFORMING"][1][1] = ["universellutformingFasilitet","String"];
sositypes["UTNYTT"][1][1] = ["utnyttingstall","Real"];
sositypes["UTNYTT"][1][0] = ["utnyttingstype","Integer"];
sositypes["UTSLIPP"][1][0] = ["komponent","String"];
sositypes["UTSLIPP"][1][1] = ["massestørrelse","String"];
sositypes["UTSLIPP"][1][2] = ["utslippType","String"];
sositypes["UTV_TILL_PART"][1][1] = ["petroleumsandel","Real"];
sositypes["UTV_TILL_PART"][1][0] = ["petroleumspartnere","String"];
sositypes["VERN"][1][0] = ["vernelov","String"];
sositypes["VERN"][1][1] = ["verneparagraf","String"];
sositypes["VERN"][1][3] = ["vernedato","Date"];
sositypes["VERN"][1][2] = ["vernetype","String"];
sositypes["VKRETS"][1][1] = ["valgkretsnavn","String"];
sositypes["VKRETS"][1][0] = ["valgkretsnummer","Integer"];
sositypes["VNR"][1][0] = ["vegkategori","String"];
sositypes["VNR"][1][2] = ["vegnummer","Integer"];
sositypes["VNR"][1][1] = ["vegstatus","String"];
sositypes["VPA"][1][0] = ["hovedParsell","Integer"];
sositypes["VPA"][1][1] = ["veglenkeMeterFra","Integer"];
sositypes["VPA"][1][2] = ["veglenkeMeterTil","Integer"];
window.SOSI.types = sositypes;
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function getValues(line) {
        return _.rest(line.split(" ")).join(" ").trim();
    }

    function getNumDots(num) {
        return new Array(num + 1).join(".");
    }

    function getKeyFromLine(line) {
        if (line.indexOf(":") !== -1) {
            return _.first(line.split(":")).trim();
        }
        return _.first(line.split(" ")).trim();
    }

    function cleanupLine(line) {
        if (line.indexOf('!') !== -1) {
            line = line.substring(0, line.indexOf('!'));
        }
        return line.replace(/\s\s*$/, '');
    }

    function getKey(line, parentLevel) {
        return cleanupLine(
            getKeyFromLine(
                line.replace(getNumDots(parentLevel), "")
            )
        );
    }

    function pushOrCreate(dict, val) {
        if (!_.isArray(dict.objects[dict.key])) {
            dict.objects[dict.key] = [];
        }
        dict.objects[dict.key].push(val);
    }

    function c2(str) {
        var substr = str.substr(0, _.lastIndexOf(str, ".") + 1);
        if (_.every(substr, function (character) {return (character === "."); })) {
            return substr.length;
        }
        return 0;
    }

    function countStartingDots(str) {
        var differs = _.find(str, function (character) {return (character !== "."); });
        if (differs) {
            str = str.substr(0, _.indexOf(str, differs));
        }
        if (_.every(str, function (character) {  return (character === "."); })) {
            return str.length;
        }
        return 0;
    }

    function isParent(line, parentLevel) {
        return (countStartingDots(line) === parentLevel);
    }

    function isEmpty(line) {
        return line === "";
    }

    function parseTree(data, parentLevel) {
        return _.reduce(_.reject(data, isEmpty), function (res, line) {
            line = cleanupLine(line);
            if (isParent(line, parentLevel)) {
                res.key = getKey(line, parentLevel);
                line = getValues(line);
            }
            if (!isEmpty(line)) {
                pushOrCreate(res, line);
            }
            return res;
        }, {objects: {}}).objects;
    }

    function setDataType(key, value) {
      var type = _.isArray(key) ? key : SOSI.types[key];
      if (type) {
        if (typeof(type[0]) == 'Object') {
        } else {
          if (type[1]=="Integer") {
            return parseInt(value);
          } else if (type[1]=="Real") {
            return parseFloat(value);
          } else if (type[1]=="Date") {
            if (value.length==8) {
              return new Date(parseInt(value.substring(0,4)), parseInt(value.substring(4,6))-1, parseInt(value.substring(6,8)));
            } else if (value.length==14) {
              return new Date(parseInt(value.substring(0,4)), parseInt(value.substring(4,6))-1, parseInt(value.substring(6,8)), 
                              parseInt(value.substring(8,10)), parseInt(value.substring(10,12)), parseInt(value.substring(12,14)));
            }
          } else if (type[1]=="String") {
            if (value[0] == '"' || value[0]=="'") return value.substring(1,value.length-1);
            return value;
          }
        }
      }
      return value;
    }

    function parseSpecial(key, subfields) { 
          return function (data) {
            if (!data) return null;
            if (_.isObject(data)) return data; // extended subfields

            if (_.isString(data)) { 
              return _.reduce(data.match(/"[^"]*"|'[^']*'|\S+/g), function (res, chunk, i) {
                res[subfields[i][0]] = setDataType(subfields[i], chunk);
                return res;
              }, {});
            }
          }
    };

    function getLongname (key) { // not tested
          var type = SOSI.types[key];
          return !!type && type[0] || key;
    };


    function parseSubdict(lines) {
        return _.reduce(parseTree(lines, 3), function (subdict, value, key) {
            subdict[getLongname(key)] = setDataType(key, value[0]);
            return subdict;
        }, {});
    }

    ns.util = {

        parseTree: parseTree,
        cleanupLine: cleanupLine,


        parseFromLevel2: function (data) {
            return _.reduce(parseTree(data, 2), function (dict, lines, key) {
                if (lines.length) {
                    if (lines[0][0] === ".") {
                        dict[getLongname(key)] = parseSubdict(lines);
                    } else if (lines.length > 1) {
                        dict[getLongname(key)] = _.map(lines, function(value){return setDataType(key, value);});
                    } else {
                        dict[getLongname(key)] = setDataType(key, lines[0]);
                    }
                }
                return dict;
            }, {});
        },

        specialAttributes: function() {
          var atts = {};
          _.each(SOSI.types, function(type,key) {
            if (_.isObject(type[1])) { // true for complex datatypes
              atts[type[0]]={name:type[0], createFunction:parseSpecial(key, type[1])};
          }});
          return atts;
        }(),

        round: function (number, numDecimals) {
            var pow = Math.pow(10, numDecimals);
            return Math.round(number * pow) / pow;
        }

    };

    ns.geosysMap = {
        2: {"srid": "EPSG:4326", def: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs "}
    };

    ns.koordsysMap = {
        1: {"srid": "EPSG:27391", "def": "+proj=tmerc +lat_0=58 +lon_0=-4.666666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        2: {"srid": "EPSG:27392", "def": "+proj=tmerc +lat_0=58 +lon_0=-2.333333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        3: {"srid": "EPSG:27393", "def": "+proj=tmerc +lat_0=58 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        4: {"srid": "EPSG:27394", "def": "+proj=tmerc +lat_0=58 +lon_0=2.5 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        5: {"srid": "EPSG:27395", "def": "+proj=tmerc +lat_0=58 +lon_0=6.166666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        6: {"srid": "EPSG:27396", "def": "+proj=tmerc +lat_0=58 +lon_0=10.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        7: {"srid": "EPSG:27397", "def": "+proj=tmerc +lat_0=58 +lon_0=14.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        8: {"srid": "EPSG:27398", "def": "+proj=tmerc +lat_0=58 +lon_0=18.33333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs"},
        9: {"srid": "EPSG:4273", "def": "+proj=longlat +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +no_defs"},
        21: {"srid": "EPSG:32631", "def": "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        22: {"srid": "EPSG:32632", "def": "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        23: {"srid": "EPSG:32633", "def": "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        24: {"srid": "EPSG:32634", "def": "+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        25: {"srid": "EPSG:32635", "def": "+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        26: {"srid": "EPSG:32636", "def": "+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"},
        31: {"srid": "EPSG:23031", def: "+proj=utm +zone=31 +ellps=intl +units=m +no_defs"},
        32: {"srid": "EPSG:23032", def: "+proj=utm +zone=32 +ellps=intl +units=m +no_defs"},
        33: {"srid": "EPSG:23033", def: "+proj=utm +zone=33 +ellps=intl +units=m +no_defs"},
        34: {"srid": "EPSG:23034", def: "+proj=utm +zone=34 +ellps=intl +units=m +no_defs"},
        35: {"srid": "EPSG:23035", def: "+proj=utm +zone=35 +ellps=intl +units=m +no_defs"},
        36: {"srid": "EPSG:23036", def: "+proj=utm +zone=36 +ellps=intl +units=m +no_defs"},
        50: {"srid": "EPSG:4230", def: "+proj=longlat +ellps=intl +no_defs"},
        72: {"srid": "EPSG:4322", def: "+proj=longlat +ellps=WGS72 +no_defs "},
        84: {"srid": "EPSG:4326", def: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs "},
        87: {"srid": "EPSG:4231", "def": "+proj=longlat +ellps=intl +no_defs "}

        //41 Lokalnett, uspes.
        //42 Lokalnett, uspes.
        //51 NGO-56A (Møre) NGO1948 Gauss-Krüger
        //52 NGO-56B (Møre) NGO1948 Gauss-Krüger
        //53 NGO-64A (Møre) NGO1948 Gauss-Krüger
        //54 NGO-64B (Møre) NGO1948 Gauss-Krüger
        //99 Egendefinert *
        //101 Lokalnett, Oslo
        //102 Lokalnett, Bærum
        //103 Lokalnett, Asker
        //104 Lokalnett, Lillehammer
        //105 Lokalnett,Drammen
        //106 Lokalnett, Bergen / Askøy
    };


    //add proj4 defs so that proj4js works
    _.each(ns.koordsysMap, function (koordsys) {
        if (proj4) { // newer proj4js (>=1.3.1)
            proj4.defs(koordsys.srid, koordsys.def);
        } else if (Proj4js) { //older proj4js (=< 1.1.0)
            Proj4js.defs[koordsys.srid] = koordsys.def;
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function getString(data, key) {
        var str = data[key] || "";
        return str.replace(/"/g, "");
    }

    function getNumber(data, key) {
        return parseFloat(data[key]);
    }

    function getSrid(koordsys) {
        koordsys = parseInt(koordsys, 10);
        if (ns.koordsysMap[koordsys]) {
            return ns.koordsysMap[koordsys].srid;
        }
        throw new Error("KOORDSYS = " + koordsys + " not found!");
    }

    function getSridFromGeosys(geosys) {
        if (_.isArray(geosys)) {
            throw new Error("GEOSYS cannot be parsed in uncompacted form yet.");
        } else {
            geosys = geosys.split(/\s+/);
        }
        if (ns.geosysMap[geosys[0]]) {
            return ns.geosysMap[geosys[0]];
        }
        throw new Error("GEOSYS = " + geosys + " not found!");
    }

    function parseBbox(data) {
        var ll = data["MIN-NØ"].split(/\s+/);
        var ur = data["MAX-NØ"].split(/\s+/);
        return [
            parseFloat(ll[1]),
            parseFloat(ll[0]),
            parseFloat(ur[1]),
            parseFloat(ur[0])
        ];
    }

    function parseOrigo(data) {
        data = _.filter(data.split(" "), function (element) {
            return element !== "";
        });
        return {
            "x": parseFloat(data[1]),
            "y": parseFloat(data[0])
        };
    }

    ns.Head = ns.Base.extend({
        initialize: function (data) {
            this.setData(data);
        },

        parse: function (data) {
            return ns.util.parseFromLevel2(data);
        },

        setData: function (data) {
            data = this.parse(data);
            this.eier = getString(data, "geodataeier");
            this.produsent = getString(data, "geodataprodusent");
            this.objektkatalog = getString(data, "OBJEKTKATALOG");
            this.verifiseringsdato = data["verifiseringsdato"];
            this.version = getNumber(data, "sosiVersjon");
            this.level = getNumber(data, "sosiKompleksitetNivå");
            this.kvalitet = ns.util.specialAttributes["kvalitet"].createFunction(data["kvalitet"]);
            this.bbox = parseBbox(data["OMRÅDE"]);
            this.origo = parseOrigo(data["TRANSPAR"]["ORIGO-NØ"]);
            this.enhet = parseFloat(data["TRANSPAR"]["enhet"]);
            this.vertdatum = getString(data["TRANSPAR"], "VERT-DATUM");
            if (data["TRANSPAR"]["KOORDSYS"]) {
                this.srid = getSrid(data["TRANSPAR"]["KOORDSYS"]);
            } else {
                this.srid = getSridFromGeosys(data["TRANSPAR"]["GEOSYS"]);
            }
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    ns.Point = ns.Base.extend({

        knutepunkt: false,

        initialize: function (line, origo, unit) { 
            if (_.isNumber(line)) { /* initialized directly with x and y */
              this.x = line;
              this.y = origo;
              return;
            }

            if (_.isArray(line)) {
                line = line[1];
            }

            var coords = line.split(/\s+/);

            var numDecimals = 0;
            if (unit < 1) {
                numDecimals = -Math.floor(Math.log(unit) / Math.LN10);
            }

            this.y = ns.util.round((parseInt(coords[0], 10) * unit) + origo.y, numDecimals);
            this.x = ns.util.round((parseInt(coords[1], 10) * unit) + origo.x, numDecimals);

            if (coords[2] && !isNaN(coords[2])) {
                this.z = ns.util.round(parseInt(coords[2], 10) * unit, numDecimals);
            }

            if (line.indexOf(".KP") !== -1) {
                this.setTiepoint(
                    line.substring(line.indexOf(".KP"), line.length).split(" ")[1]
                );
            }
        },

        setTiepoint: function (kode) {
            this.has_tiepoint = true;
            this.knutepunktkode = parseInt(kode, 10);
        }
    });

    ns.LineStringFromArc = ns.Base.extend({ // BUEP - an arc defined by three points on a circle
        initialize: function (lines, origo, unit) {
          var p = _.map(_.filter(lines, function(line){return line.indexOf("NØ")===-1}), function(coord) {
            return new ns.Point(coord, origo, unit);
          });
          if (p.length != 3) {
            throw new Error("BUEP er ikke definert med 3 punkter");
          }
          // in order to copy & paste my own formulas, we use the same variable names
          var e1 = p[0].x, e2 = p[1].x, e3 = p[2].x;
          var n1 = p[0].y, n2 = p[1].y, n3 = p[2].y;

          // helper constants 
          var p12  = (e1 * e1 - e2 * e2 + n1 * n1 - n2 * n2) / 2.0;
          var p13  = (e1 * e1 - e3 * e3 + n1 * n1 - n3 * n3) / 2.0;

          var dE12 = e1 - e2,
              dE13 = e1 - e3,
              dN12 = n1 - n2,
              dN13 = n1 - n3;

          // center of the circle 
          var cE = (dN13 * p12 - dN12 * p13) / (dE12 * dN13 - dN12 * dE13) ;
          var cN = (dE13 * p12 - dE12 * p13) / (dN12 * dE13 - dE12 * dN13) ;

          // radius of the circle 
          var r = Math.sqrt(Math.pow(e1 - cE,2) + Math.pow(n1 - cN,2));

          /* angles of points A and B (1 and 3) */
          var th1 = Math.atan2(n1 - cN, e1 - cE);
          var th3 = Math.atan2(n3 - cN, e3 - cE);

          /* interpolation step in radians */
          var dth = th3 - th1;
          if (dth < 0) {dth  += 2 * Math.PI;}
          if (dth > Math.PI) {
            dth = - 2*Math.PI + dth;
          }
          var npt = Math.floor(32 * dth / 2*Math.PI);
          if (npt < 0) npt=-npt;
          if (npt < 3) npt=3;

          dth = dth / (npt-1);

          this.kurve = Array(npt); 
          for (var i=0; i < npt; i++) {
            var x  = cE + r * Math.cos(th1 + dth * i);
            var y = cN + r * Math.sin(th1 + dth * i);
            if (isNaN(x)) { 
              throw new Error("BUEP: Interpolated "+x+" for point "+i+" of "+npt+" in curve.");
            }
            this.kurve[i] = new ns.Point(x,y);
          }
          
          this.knutepunkter = [];
        }
    });

    ns.LineString = ns.Base.extend({
        initialize: function (lines, origo, unit) {
            this.kurve = _.compact(_.map(lines, function (line) {
                if (line.indexOf("NØ") === -1) {
                    return new ns.Point(line, origo, unit);
                }
            }));

            this.knutepunkter = _.filter(this.kurve, function (punkt) {
                return punkt.has_tiepoint;
            });
        }
    });

    function createPolygon(refs, features) {
        var flate =  _.flatten(_.map(refs, function (ref) {
            var id = Math.abs(ref);
            var kurve = features.getById(id);
            if (!kurve) {
                throw new Error("Fant ikke KURVE " + id + " for FLATE");
            }
            var geom = kurve.geometry.kurve;
            if (ref < 0) {
                geom = _.clone(geom).reverse();
            }
            return _.initial(geom);
        }));
        flate.push(flate[0]);
        return flate;
    }

    function parseRefs(refs) {
        return _.map(refs.trim().split(" "), function (ref) {
            return parseInt(ref.replace(":", ""), 10);
        });
    }

    ns.Polygon = ns.Base.extend({
        initialize: function (refs, features) {
            var shell = refs;
            var holes = [];
            var index = refs.indexOf("(");
            if (index !== -1) {
                shell = refs.substr(0, index);
                holes = refs.substr(index, refs.length);
            }

            shell = parseRefs(shell);
            holes = _.map(
                _.reduce(holes, function (result, character) {
                    if (character === "(") {
                        result.push("");
                    } else if (character !== ")" && character !== "") {
                        result[result.length - 1] += character;
                    }
                    return result;
                }, []),
                parseRefs
            );

            this.flate = createPolygon(shell, features);

            this.holes = _.map(holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(Math.abs(hole[0]));
                    if (feature.geometryType === "FLATE") {
                        return feature.geometry.flate;
                    }
                }
                return createPolygon(hole, features);
            });
            this.shellRefs = shell;
            this.holeRefs = holes;
        }
    });
}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function createGeometry(geometryType, lines, origo, unit) {

        var geometryTypes = {
            "PUNKT": ns.Point,
            "TEKST": ns.Point, // a point feature with exsta styling hints - the geometry actually consists of up to three points
            "KURVE": ns.LineString,
            "BUEP" : ns.LineStringFromArc,
            "LINJE": ns.LineString, // old 4.0 name for unsmoothed KURVE
            "FLATE": ns.Polygon
        };

        if (!geometryTypes[geometryType]) {
            throw new Error("GeometryType " + geometryType + " is not handled (yet..?)");
        }
        return new geometryTypes[geometryType](lines, origo, unit);
    }

    ns.Feature = ns.Base.extend({

        initialize: function (data, origo, unit, features) {
            if (data.id === undefined || data.id === null) {
                throw new Error("Feature must have ID!");
            }
            this.id = data.id;
            this.parseData(data, origo, unit, features);
            this.geometryType = data.geometryType;
        },

        parseData: function (data, origo, unit) {

            var split = _.reduce(data.lines, function (dict, line) {
                if (line.indexOf("..NØ") !== -1) {
                    dict.foundGeom = true;
                }
                if (dict.foundGeom) {
                    dict.geom.push(line);
                } else {
                    if (line.indexOf("..REF") !== -1) {
                        dict.foundRef = true;
                        line = line.replace("..REF", "");
                    }
                    if (dict.foundRef) {
                        if (line[0] === '.') {
                            dict.foundRef = false;
                        } else {
                            dict.refs.push(line);
                        }
                    } else {
                        dict.attributes.push(line);
                    }
                }
                return dict;
            }, {
                "attributes": [],
                "geom": [],
                "refs": [],
                "foundGeom": false,
                "foundRef": false
            });

            this.attributes = ns.util.parseFromLevel2(split.attributes);
            this.attributes = _.reduce(this.attributes, function (attrs, value, key) {
                if (ns.util.specialAttributes[key]) {
                    attrs[key] = ns.util.specialAttributes[key].createFunction(value);
                } else {
                    attrs[key] = value;
                }
                return attrs;
            }, {});

            if (split.refs.length > 0) {
                this.attributes.REF = split.refs.join(" ");
            }
            if (this.attributes.ENHET) {
              unit = parseFloat(this.attributes.ENHET);
            }

            this.raw_data = {
                geometryType: data.geometryType,
                geometry: split.geom,
                origo: origo,
                unit: unit
            };
        },

        buildGeometry: function (features) {
            if (this.raw_data.geometryType === "FLATE") {
                this.geometry = new ns.Polygon(this.attributes.REF, features);
                this.geometry.center = new ns.Point(
                    this.raw_data.geometry,
                    this.raw_data.origo,
                    this.raw_data.unit
                );
                this.attributes = _.omit(this.attributes, "REF");
            } else {
                this.geometry = createGeometry(
                    this.raw_data.geometryType,
                    this.raw_data.geometry,
                    this.raw_data.origo,
                    this.raw_data.unit
                );
            }
            this.raw_data = null;
        }
    });

    ns.Features = ns.Base.extend({

        initialize: function (elements, head) {
            this.head = head;
            this.features = [];
            this.features = _.map(elements, function (value, key) {
                key = key.replace(":", "").split(/\s+/);
                var data = {
                    id: parseInt(key[1], 10),
                    geometryType: key[0],
                    lines: _.rest(value)
                };
                return new ns.Feature(data, head.origo, head.enhet);
            }, this);
        },

        ensureGeom: function (feature) {
            if (feature && !feature.geometry) {
                feature.buildGeometry(this);
            }
            return feature;
        },

        length: function () {
            return this.features.length;
        },

        at: function (idx) {
            return this.ensureGeom(this.features[idx]);
        },

        getById: function (id) {
            return this.ensureGeom(_.find(this.features, function (feature) {
                return (feature.id === id);
            }));
        },

        all: function () {
            return _.map(this.features, this.ensureGeom, this);
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    function writePoint(point) {
        return [point.x, point.y];
    }

    ns.Sosi2GeoJSON = ns.Base.extend({

        initialize: function (sosidata) {
            this.sosidata = sosidata;
        },

        dumps: function () {
            return {
                "type": "FeatureCollection",
                "features": this.getFeatures(),
                "crs": this.writeCrs()
            };
        },

        getFeatures: function () {
            return _.map(
                this.sosidata.features.all(),
                this.createGeoJsonFeature,
                this
            );
        },

        createGeoJsonFeature: function (sosifeature) {
            return {
                "type": "Feature",
                "id": sosifeature.id,
                "properties": sosifeature.attributes,
                "geometry": this.writeGeometry(sosifeature.geometry)
            };
        },

        writeGeometry: function (geom) {
            if (geom instanceof ns.Point) {
                return {
                    "type": "Point",
                    "coordinates": writePoint(geom)
                };
            }

            if ((geom instanceof ns.LineString) || (geom instanceof ns.LineStringFromArc)) {
                return {
                    "type": "LineString",
                    "coordinates": _.map(geom.kurve, writePoint)
                };
            }

            if (geom instanceof ns.Polygon) {
                var shell = _.map(geom.flate, writePoint);
                var holes = _.map(geom.holes, function (hole) {
                    return _.map(hole, writePoint);
                });
                return {
                    "type": "Polygon",
                    "coordinates": [shell].concat(holes)
                };
            }
            throw new Error("cannot write geometry!");
        },

        writeCrs: function () {
            return {
                "type": "name",
                "properties": {
                    "name": this.sosidata.hode.srid
                }
            };
        }
    });

    function mapArcs(refs, lines) {
        return _.map(refs, function (ref) {
            var index = lines[Math.abs(ref)].index;
            if (ref > 0) {
                return index;
            } else {
                return -(Math.abs(index) + 1);
            }
        });
    }

    ns.Sosi2TopoJSON = ns.Base.extend({

        initialize: function (sosidata) {
            this.sosidata = sosidata;
        },

        dumps: function (name) {
            var points = this.getPoints();
            var lines = this.getLines();
            var polygons = this.getPolygons(lines);
            var geometries = points.concat(_.map(lines, function (line) {
                return line.geometry;
            })).concat(polygons);

            var data = {
                "type": "Topology",
                "objects": {}
            };
            data.objects[name] = {
                "type": "GeometryCollection",
                "geometries": geometries
            };

            var arcs = _.map(_.sortBy(lines, function (line) {return line.index; }), function (line) {
                return line.arc;
            });

            if (arcs.length) {
                data.arcs = arcs;
            }
            return data;
        },

        getByType: function (type) {
            return _.filter(this.sosidata.features.all(), function (feature) {
                return (feature.geometry instanceof type);
            });
        },

        getPoints: function () {
            var points = this.getByType(ns.Point);
            return _.map(points, function (point) {
                var properties = _.clone(point.attributes);
                properties.id = point.id;
                return {
                    "type": "Point",
                    "properties": properties,
                    "coordinates": writePoint(point.geometry)
                };
            });
        },

        getLines: function () {
            var lines = this.getByType(ns.LineString);
            return _.reduce(lines, function (res, line, index) {
                var properties = _.clone(line.attributes);
                properties.id = line.id;
                res[line.id] = {
                    "geometry": {
                        "type": "LineString",
                        "properties": properties,
                        "arcs": [index]
                    },
                    "arc": _.map(line.geometry.kurve, writePoint),
                    "index": index
                };
                return res;
            }, {});
        },

        getPolygons: function (lines) {
            var polygons = this.getByType(ns.Polygon);
            return _.map(polygons, function (polygon) {
                var properties = _.clone(polygon.attributes);
                properties.id = polygon.id;

                var arcs = [mapArcs(polygon.geometry.shellRefs, lines)];

                arcs = arcs.concat(_.map(polygon.geometry.holeRefs, function (hole) {
                    if (hole.length === 1) {
                        var feature = this.sosidata.features.getById(hole[0]);
                        if (feature.geometry instanceof ns.Polygon) {
                            return mapArcs(feature.geometry.shellRefs, lines);
                        }
                    }
                    return mapArcs(hole, lines);
                }, this));

                return {
                    "type": "Polygon",
                    "properties": properties,
                    "arcs": arcs
                };
            }, this);
        }
    });

}(SOSI));
;var SOSI = window.SOSI || {};

(function (ns, undefined) {
    "use strict";

    var Def = ns.Base.extend({
    });

    var Objdef = ns.Base.extend({
    });

    var dumpTypes = {
        "geojson": ns.Sosi2GeoJSON,
        "topojson": ns.Sosi2TopoJSON
    };

    var SosiData = ns.Base.extend({
        initialize: function (data) {
            this.hode = new ns.Head(data["HODE"] || data["HODE 0"]);
            this.def = new Def(data["DEF"]); //Not sure if I will care about this
            this.objdef = new Objdef(data["OBJDEF"]); //Not sure if I will care about this
            this.features = new ns.Features(
                _.omit(data, ["HODE", "HODE 0", "DEF", "OBJDEF", "SLUTT"]),
                this.hode
            );
        },

        dumps: function (format) {
            if (dumpTypes[format]) {
                return new dumpTypes[format](this).dumps(_.rest(arguments));
            }
            throw new Error("Outputformat " + format + " is not supported!");
        }
    });

    function splitOnNewline(data) {
        return _.map(data.split("\n"), function (line) {
            if (line.indexOf("!") !== 0) { //ignore comments starting with ! also in the middle of the line
                line = line.split("!")[0];
            }
            return line.replace(/^\s+|\s+$/g, ''); // trim whitespace padding comments and elsewhere
        });
    }

    ns.Parser = ns.Base.extend({
        parse: function (data) {
            return new SosiData(ns.util.parseTree(splitOnNewline(data), 1));
        }
    });
}(SOSI));
