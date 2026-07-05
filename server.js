
// GRUPPO CAVIRO (Node.js + Express + File System)

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// DOWNLOAD E SALVATAGGIO DATI (POST PER SICUREZZA GDPR)
app.post('/download/report', (req, res) => {
    
    // EVITARE CHE I SIMBOLI ROMPANO IL CSV
    const nomeUtente = (req.body.nome || 'Utente Anonimo').replace(/;/g, ' ');
    const emailUtente = (req.body.email || 'Email non fornita').replace(/;/g, ' ');
    const annoRichiesto = req.body.anno || '2025'; 
    
    const dataOdierna = new Date();
    const soloData = dataOdierna.toLocaleDateString('it-IT'); 
    const soloOra = dataOdierna.toLocaleTimeString('it-IT');  
    
    const fileEsiste = fs.existsSync('contatti.csv');
    let testoDaSalvare = "";
    let numeroDownload = 1; 
    
    if (!fileEsiste) {
        testoDaSalvare += "N°;Nome;Email;Data;Ora;Anno Scaricato\n";
    } else {
        const contenutoFile = fs.readFileSync('contatti.csv', 'utf8');
        const righe = contenutoFile.trim().split('\n');
        numeroDownload = righe.length;
    }
    
    testoDaSalvare += `${numeroDownload};${nomeUtente};${emailUtente};${soloData};${soloOra};${annoRichiesto}\n`;
    
    fs.appendFile('contatti.csv', testoDaSalvare, (err) => {
        if (err) {
            console.error("Errore durante la scrittura del file CSV:", err);
        } else {
            console.log(`\n===================================================`);
            console.log(`🎉 LEAD GENERATO`);
            console.log(`👤 Utente: ${nomeUtente} (${emailUtente})`);
            console.log(`📄 Documento richiesto: Bilancio ${annoRichiesto}`);
            console.log(`📈 TOTALE DOWNLOAD DEL BILANCIO : ${numeroDownload}`);
            console.log(`===================================================\n`);
        }
    });

    // SCELTA PDF
    let nomeFileLocale = '';
    let fileNameToDownload = '';

    if (annoRichiesto === '2024') {
        nomeFileLocale = 'Bilancio_Caviro_2024.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2024.pdf';
    } else if (annoRichiesto === '2023') {
        nomeFileLocale = 'Bilancio_Caviro_2023.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2023.pdf';
    } else {
        nomeFileLocale = 'Bilancio_Caviro.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2025.pdf';
    }

    const filePath = path.join(__dirname, 'documenti', nomeFileLocale);
    res.download(filePath, fileNameToDownload, (err) => {
        if (err) {
            console.error("Errore di sistema durante il download del file:", err);
            res.status(500).send("<h1>Errore di sistema</h1><p>Ci scusiamo, il documento non è disponibile.</p>");
        }
    });
});

app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Server del Gruppo Caviro avviato con successo!`);
    console.log(`👉 Apri il tuo browser e visita: http://localhost:${PORT}`);
    console.log(`===================================================`);
});