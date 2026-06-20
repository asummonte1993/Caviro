// =========================================================================
// SERVER BACK-END GRUPPO CAVIRO (Node.js + Express + File System)
// =========================================================================

// 1. Importiamo i moduli necessari
const express = require('express');
const path = require('path');
const fs = require('fs');

// 2. Inizializziamo l'applicazione Express
const app = express();
const PORT = 3000;

// 3. Middleware: Diciamo a Express di "servire" pubblicamente i file statici 
app.use(express.static('public'));

// =========================================================================
// 4. ROTTA PER IL DOWNLOAD E SALVATAGGIO DATI (LEAD GENERATION)
// =========================================================================
app.get('/download/report', (req, res) => {
    
    // Catturiamo i dati inviati dall'utente, incluso l'anno selezionato!
    const nomeUtente = req.query.nome || 'Utente Anonimo';
    const emailUtente = req.query.email || 'Email non fornita';
    const annoRichiesto = req.query.anno || '2025'; // Se per qualche motivo manca, di default è 2025
    
    // --- NUOVA LOGICA: SEPARIAMO DATA E ORA ---
    const dataOdierna = new Date();
    const soloData = dataOdierna.toLocaleDateString('it-IT'); // Genera solo "02/06/2026"
    const soloOra = dataOdierna.toLocaleTimeString('it-IT');  // Genera solo "12:32:05"
    
    // --- LOGICA CON INTESTAZIONE E CONTEGGIO DOWNLOAD ---
    const fileEsiste = fs.existsSync('contatti.csv');
    let testoDaSalvare = "";
    let numeroDownload = 1; 
    
    if (!fileEsiste) {
        // Se il file NON esiste, aggiungiamo l'intestazione con le colonne (incluso l'Anno)
        testoDaSalvare += "N°;Nome;Email;Data;Ora;Anno Scaricato\n";
    } else {
        // Se il file ESISTE, lo leggiamo per capire a che numero siamo arrivati
        const contenutoFile = fs.readFileSync('contatti.csv', 'utf8');
        const righe = contenutoFile.trim().split('\n');
        numeroDownload = righe.length;
    }
    
    // Aggiungiamo i dati dell'utente, inserendo anche l'anno richiesto alla fine
    testoDaSalvare += `${numeroDownload};${nomeUtente};${emailUtente};${soloData};${soloOra};${annoRichiesto}\n`;
    
    // Scriviamo tutto nel file
    fs.appendFile('contatti.csv', testoDaSalvare, (err) => {
        if (err) {
            console.error("Errore durante la scrittura del file CSV:", err);
        } else {
            console.log(`\n===================================================`);
            console.log(`🎉 NUOVO LEAD GENERATO PER IL GRUPPO CAVIRO!`);
            console.log(`👤 Utente: ${nomeUtente} (${emailUtente})`);
            console.log(`📄 Documento richiesto: Bilancio ${annoRichiesto}`);
            console.log(`📈 TOTALE DOWNLOAD DEL BILANCIO FINORA: ${numeroDownload}`);
            console.log(`===================================================\n`);
        }
    });

    // --- EROGAZIONE DINAMICA DEL FILE PDF ---
    let nomeFileLocale = '';
    let fileNameToDownload = '';

    // Selezioniamo il file corretto in base all'anno inviato dal menu a tendina HTML
    if (annoRichiesto === '2025') {
        nomeFileLocale = 'Bilancio_Caviro.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2025.pdf';
    } else if (annoRichiesto === '2024') {
        nomeFileLocale = 'Bilancio_Caviro_2024.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2024.pdf';
    } else if (annoRichiesto === '2023') {
        nomeFileLocale = 'Bilancio_Caviro_2023.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2023.pdf';
    } else {
        // Fallback di sicurezza
        nomeFileLocale = 'Bilancio_Caviro.pdf';
        fileNameToDownload = 'Bilancio_Sostenibilita_Caviro_2025.pdf';
    }

    // Costruiamo il percorso puntando correttamente alla cartella "documenti" come hai richiesto
    const filePath = path.join(__dirname, 'documenti', nomeFileLocale);

    res.download(filePath, fileNameToDownload, (err) => {
        if (err) {
            console.error("Errore di sistema durante l'erogazione del file:", err);
            res.status(500).send("<h1>Errore di sistema</h1><p>Ci scusiamo, il documento non è disponibile.</p>");
        }
    });
});

// =========================================================================
// 5. AVVIO DEL SERVER
// =========================================================================
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Server del Gruppo Caviro avviato con successo!`);
    console.log(`👉 Apri il tuo browser e visita: http://localhost:${PORT}`);
    console.log(`===================================================`);
});