// DO NOT USE THIS / ONLY FOR TESTING


let text = "Hello!";

// type A = AES; type B = XOR
function encrypt(str, type) {
    switch (type) {
        case "A":
            // Key
            let secret = "Jupiter";
            let encrypted = CryptoJS.AES.encrypt(str, secret);
            encrypted = encrypted.toString();
            return "A" + encrypted;
        case "B":
            let encoded = "";
            for (i = 0; i < str.length; i++) {
                let a = str.charCodeAt(i);
                let b = a ^ 1;
                encoded = encoded + String.fromCharCode(b);
            }
            return "B" + encoded;
        case "C":
            return "C" + str;
    }
}

console.log("Cipher text A: " + encrypt(text, "A"));
console.log("Cipher text B: " + encrypt(text, "B"));
console.log("Cipher text C: " + encrypt(text, "C"));
document.getElementById("output").innerHTML = "Output in Console";
