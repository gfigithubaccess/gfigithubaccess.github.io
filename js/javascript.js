
let alleRadioButtonsAusgewaehlt;

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

    kodierteAntwort = leseBewertungen(); // Hier kann ein error geworfen werden

    if (alleRadioButtonsAusgewaehlt === false) { // Mindestens ein Radio-Button wurde nicht ausgewählt.
        return;
    }

    let verschluesselteAntwort =  kodierteAntwort; //  verschluessle(kodierteAntwort); TODO: Verschlüeeslung einau

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
function anzeigenVerschluesseltesErgebnis(verschluesselterText) {

    let ausgabeText = "---" + text + "---";
    
    alert(ausgabeText);

    /*
    document.getElementById("questionArea").style.display = "none";  // verstecke das Frage-Area

    document.getElementById("output").innerHTML = ausgabeText;       // Zeige den Antworttext im Antwort-Area an
    document.getElementById("resultArea").style.display = "block";   // Zeige das Antwort-Area an
    */
}

/** Kopiert den param textToCopy in die Zwischenablage.
* Erzeugt eine temporäres Textelement, um den zu kopierenden Text in die Zwischenablage zu befördern.
*/
function kopiereStringInsClipboard(textToCopy) {
    var textElement = document.createElement('textarea');
    textElement.value = textToCopy;
    textElement.setAttribute('readonly', '');
    textElement.style.position = 'absolute';
    textElement.style.left = '-9999px';

    document.body.appendChild(textElement);
    textElement.select();
    document.execCommand('copy');
    document.body.removeChild(textElement);
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

    return "";

}

// Holt den Wert des Textfeldes mit der jeweiligen ID
function getTextFieldValue(textFieldId) {
    return document.getElementById(textFieldId).value;
}






