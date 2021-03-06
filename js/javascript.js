
let alleRadioButtonsAusgewaehlt;
let antwortID;
let topmostUnclickedRadiobuttonGroupName;

/* Wird beim Drücken des Buttons aufgerufen.
*/
function okButtonGedrueckt() {

    try {
    
         
        console.log("Knopf wurde gedrückt");
    
        eingabenAuswerten();
    }
    catch (error) {
        let toStringResult = error.toString();
        if ((typeof toStringResult) === "string") {
            alert("FEHLER: " + toStringResult);
        } else {
            alert("Unbekannter FEHLER");
        }
        throw error;
    }
}


function eingabenAuswerten() {

    let kodierteAntwort;

    alleRadioButtonsAusgewaehlt = true; // Wir gehen davon, dass alles angeklickt wurde
    topmostUnclickedRadiobuttonGroupName = null; // Kein Radiobutton ist derzeit der oberste nicht geklickte


    kodierteAntwort = leseBewertungen(); // Hier kann ein error geworfen werden

    if (alleRadioButtonsAusgewaehlt === false) { // Mindestens ein Radio-Button wurde nicht ausgewählt.
        scrollToTopmostIncompleteFieldset();
        return;
    }

    let verschluesselteAntwort = "Ergebnis des Fragebogens: " + "---" + encrypt(kodierteAntwort, "A") + "---"; 

    anzeigenVerschluesseltesErgebnis(verschluesselteAntwort);

    kopiereStringInsClipboard(verschluesselteAntwort);
}
/*

    Referenten und Radio Buttons werden von 0 ... max gezählt, im Source und in Beschreibungen.

    Für Referent 0 und den Radio Button 0 heisst der Name des Radiobuttons "0_r0"
    Für Referent 2 und den Radio Button 3 heisst der Name des Radiobuttons "2_r3"


*/

/* Liest alle Bewertungen aus.
Wird aufgerufen, wenn der Anwender den OK Button anklickt.
*/
function leseBewertungen() {

    let kodierteBewertungen = ""; // Kodiert in unserem Format mit Separatoren | | | |      

    kodierteBewertungen += getUmfrageID().toString() + "|";

    kodierteBewertungen += getAntwortID().toString() + "|";
    console.log("Momentane randomID --> "+getAntwortID);

    console.log("Body: = " + document.body);


    let referentenAnzahl = document.body.getAttribute("anzahlreferenten");

    console.log("Body: Referentenanzahl = " + referentenAnzahl);

    kodierteBewertungen += leseMassnahmenVerlauf();
    kodierteBewertungen += leseMassnamenBetreuung();
    kodierteBewertungen += leseAllgemeineBewertungReferenten();



    for (let i = 0; i < referentenAnzahl; i++) {
        
        kodierteBewertungen += leseReferentenName(i);
        kodierteBewertungen += leseReferentenBewertung(i);
    }
  

    if (alleRadioButtonsAusgewaehlt === false) {
        return null;
    }

    // Füllen des Antwortstrings auf mindestens 1000 Zeichen:
    // Da diese Stopfzeichen keinen Element-Terminator enthalten,
    // und die Java-Klasse AzubiAntwort überflüssige Elemente am Ende ignoriert,
    // solange sie nicht so viele sind, um einen Referenten einzulesen, ist es egal,
    // ob hinten dran noch Text ist. Der Stopftext dient dazu, die Anonymität zu wahren,
    // indem eine Längenanalyse der verschlüsselten Antwortstrings erschwert wird.
    let filler = "miau"
    for(let i=kodierteBewertungen.length; i<200; i+=filler.length) {
        kodierteBewertungen = kodierteBewertungen + filler;
    }

    return kodierteBewertungen;

}


function leseReferentenName(referentenNummer) {

    var referentenName = document.body.getAttribute("referent" + referentenNummer);
    return referentenName + "|";
}


/* Abschnitt:  "1. Maßnahmenverlauf"
*/
function leseMassnahmenVerlauf() {

    let ergebnis = ""; // kodiertes Ergebnis der Bewertung des MassnahmenVerlaufs

    // 1.1 Wie empfinden Sie die Organisation der Maßnahme?
    ergebnis += leseRadioButton("a_r0");

    // 1.2 Wie zufrieden sind Sie mit dem Maßnahmenverlauf?
    ergebnis += leseRadioButton("a_r1");

    // Was Sie uns noch mitteilen möchten:
    ergebnis += leseTextFeld("a_t0");

    return ergebnis;
}

/* Abschnitt:  "2. Maßnahmenbetreuung"
*/
function leseMassnamenBetreuung() {

    let ergebnis = ""; // kodiertes Ergebnis

    // 2. Wie zufrieden sind Sie mit der Betreuung durch uns?
    ergebnis += leseRadioButton("b_r0");

    // Was Sie uns noch mitteilen möchten:
    ergebnis += leseTextFeld("b_t0");

    return ergebnis;

}

function leseAllgemeineBewertungReferenten() {

    let ergebnis = ""; // kodiertes Ergebnis

    ergebnis += leseTextFeld("c_t0");

    return ergebnis;
}

/* @param Referentennummer von 0...maxReferent */

function leseReferentenBewertung(referentenNummer) {

    let ergebnis = ""; // kodiertes Ergebnis der Bewertung eines Referenten

    // Wie war ihr / sein Unterricht vorbereitet?
    // Wie umfangreich war ihr / sein Fachwissen?
    // Wie ging sie / er auf spezielle theniatische Probleme ein?
    // Wie verstandlich konnte sie / er die lnhalte vermitteln?
    // Wie sagte lhnen ihr / sein Verhalten gegeniiber den Seminarteilnehmern zu?

    // Lesen aller 5 Radio-Buttons für einen Referenten
    for (let i = 0; i <= 4; i++) {
        let radioButtonGroupName = referentenNummer + "_" + "r" + i;
        ergebnis += leseRadioButton(radioButtonGroupName);
    }
    ergebnis += leseTextFeld(referentenNummer + "_text");  // Labels für Dozentenkommentare: 0_text, 1_text, ... 

    return ergebnis;
}

/* Liest den Wert der Radio-Button-Gruppe aus, gibt einen Wert 0...4 zurück und kodiert den
   String mit einem Separator.
*/
function leseRadioButton(radioButtonGroupName) {

    let ergebnis = "";

    ergebnis += getRadiobuttonValue(radioButtonGroupName); // Greift auf das HTML-Dokument zu

    ergebnis += "|";
    return ergebnis;
}

function leseTextFeld(textFeldName){

    let ergebnis = "";

    ergebnis += sanitize(getTextFieldValue(textFeldName));

    ergebnis += "|";
    return ergebnis;
}

function sanitize(text) {

    return text.replace(/\|/g, " ");

}

/* Zeigt die verschlüsselte Antwort an.
* Das geschieht durch verstecken des Frage-Areas und sichtbar machen des Antwort-Areas.
* Zusätzlich wird 
*/
function anzeigenVerschluesseltesErgebnis(ausgabeText) {

    document.getElementById("question_div").style.display = "none";  // verstecke das Frage-Area

    document.getElementById("result_area").value = ausgabeText;       // Zeige den Antworttext im Antwort-Area an
	
	document.getElementById("gesamt_result_div").style.display = "block";   // Zeige das gesamte Antwort-Area an
   
    if(leseBewertungen().length<=950) {
        
        document.getElementById("result_div").style.display = "block";   // Zeige das Antwort-Area an

    } else {

    document.getElementById("result_div_with_warning").style.display = "block";   // Zeige das Antwort-Area mit Warnung an

    }
   
}

/** Kopiert den param textToCopy in die Zwischenablage.
* Erzeugt eine temporäres Textelement, um den zu kopierenden Text in die Zwischenablage zu befördern.
*/
function kopiereStringInsClipboard(textToCopy) {
    var textElement = document.getElementById("result_area");
    let oldvalue = textElement.value;
    textElement.value = textToCopy;
    textElement.select();
    document.execCommand('copy');
    textElement.value = oldvalue;
	document.getElementById("result_area").style.display = "none";
}

// Holt den Value des ausgewählten Radiobuttons aus der Gruppe mit dem jeweiligen Namen
// @return value : 0,1,2,3,4 je nach Button, der angeklickt war (entsprechend -2,-1,0+1,+2)
function getRadiobuttonValue(radioButtonGroupName) {
    let elements = document.getElementsByName(radioButtonGroupName);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].checked) {
            document.getElementById(radioButtonGroupName + "_warnung").style.display = "none";
            return elements[i].value;
        }
    }

    /* Es wurde nichts angeklickt */

    document.getElementById(radioButtonGroupName + "_warnung").style.display = "block";

    alleRadioButtonsAusgewaehlt = false;
    if (topmostUnclickedRadiobuttonGroupName === null) topmostUnclickedRadiobuttonGroupName = radioButtonGroupName;

    return "";

}

// Holt den Wert des Textfeldes mit der jeweiligen ID
function getTextFieldValue(textFieldId) {
    return document.getElementById(textFieldId).value;
}

function getUmfrageID() {
    return document.getElementsByTagName("body")[0].getAttribute("umfrageID");
}

function getAntwortID() {

    if (antwortID === undefined) {
        antwortID = Math.floor((Math.random() * (Math.pow(2,31)-2)) + 1);
    }
    return antwortID;
    
}

function getTopNextFieldSet(radioButtonGroupName) {
    let initialRB = document.getElementsByName(radioButtonGroupName)[0];
    let theElement = initialRB;
    while(true) {
        console.log(theElement);
        if (theElement.tagName === "FIELDSET") return theElement;
        theElement = theElement.parentNode;
    }
}

function scrollToTopmostIncompleteFieldset() {
    let theFieldset = getTopNextFieldSet(topmostUnclickedRadiobuttonGroupName);
    theFieldset.scrollIntoView();
}
