const fasiCircolari = [
    {
        titolo: "1. La Vigna e i Viticoltori",
        testo: "Tutto inizia dai nostri 36.200 ettari di vigneti. Curiamo la terra con rispetto, raccogliendo l'uva dei nostri 11.500 viticoltori. I residui di potatura non vengono bruciati, ma raccolti per il recupero energetico.",
        immagine: "foto-campo.avif" 
    },
    {
        titolo: "2. La Cantina e il Vino",
        testo: "L'uva arriva nelle nostre cantine per diventare vino di eccellenza. Durante la pigiatura e la fermentazione, separiamo le vinacce e le fecce. Nel nostro modello, questi non sono rifiuti, ma preziose materie prime.",
        immagine: "cantinaevino.avif" 
    },
    {
        titolo: "3. Il Recupero in Caviro Extra",
        testo: "Gli scarti della cantina arrivano negli stabilimenti Caviro Extra. Qui estraiamo alcol, acido tartarico e polifenoli, destinati all'industria farmaceutica, cosmetica e alimentare, valorizzando ogni singola goccia.",
        immagine: "recupero.avif" 
    },
    {
        titolo: "4. Energia e Ritorno alla Terra",
        testo: "Ciò che resta viene inserito nei digestori per produrre Biometano ed energia pulita. Il residuo solido finale diventa fertilizzante naturale che torna a nutrire i nostri vigneti, chiudendo il 'Cerchio della Vite'.",
        immagine: "energia.avif" 
    }
];

function cambiaFase(indice) {
    const immagineDOM = document.getElementById('immagineFase');
    const titoloDOM = document.getElementById('titoloFase');
    const testoDOM = document.getElementById('testoFase');

    // Dissolvenza in uscita
    immagineDOM.style.opacity = 0;
    titoloDOM.style.opacity = 0;
    testoDOM.style.opacity = 0;

    // Cambio contenuti e dissolvenza in entrata dopo 400ms
    setTimeout(() => {
        immagineDOM.src = fasiCircolari[indice].immagine; // Qui il JS carica il tuo file locale!
        titoloDOM.innerText = fasiCircolari[indice].titolo;
        testoDOM.innerText = fasiCircolari[indice].testo;

        immagineDOM.style.opacity = 1;
        titoloDOM.style.opacity = 1;
        testoDOM.style.opacity = 1;
    }, 400);

    // Gestione colori dei bottoni
    const bottoni = document.querySelectorAll('.step-menu-item');
    bottoni.forEach(bottone => bottone.classList.remove('active'));
    document.getElementById('btn-fase-' + indice).classList.add('active');
}