// A HTML elemek elérése azonosító alapján
const imageLoader = document.getElementById('imageLoader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('downloadButton');

// A szűrő csúszkák elérése
const contrastSlider = document.getElementById('contrast');
const saturateSlider = document.getElementById('saturate');
const blurSlider = document.getElementById('blur');
const brightnessSlider = document.getElementById('brightness');

// Egy globális változó a kép tárolására, hogy ne kelljen újra betölteni
let currentImage = null;

// Eseményfigyelő a fájlválasztóra
imageLoader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        return; // Nincs fájl, nincs teendő
    }

    const reader = new FileReader();

    // Amikor a fájl beolvasása befejeződött
    reader.onload = (event) => {
        const img = new Image();
        
        // Amikor a képfájl betöltődött a memóriába
        img.onload = () => {
            // Beállítjuk a vászon méretét a kép méretére
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Elmentjük a képet a globális változóba
            currentImage = img;
            
            // Alkalmazzuk az alapértelmezett szűrőket és kirajzoljuk a képet
            applyFilters();
        };
        // Beállítjuk a kép forrását a beolvasott adat URL-re
        img.src = event.target.result;
    };
    
    // Elindítjuk a fájl beolvasását
    reader.readAsDataURL(file);
});

// Egy eseményfigyelőt adunk az összes csúszkához
// ('input' eseményre figyel, ami valós időben frissül húzás közben)
[contrastSlider, saturateSlider, blurSlider, brightnessSlider].forEach(slider => {
    slider.addEventListener('input', applyFilters);
});

/**
 * Ez a fő függvény, ami alkalmazza a szűrőket.
 * Bármelyik csúszka megmozdul, ez a függvény lefut.
 */
function applyFilters() {
    if (!currentImage) {
        return; // Ha még nincs kép betöltve, ne csináljon semmit
    }

    // Kiolvassuk az értékeket a csúszkákból
    const contrast = contrastSlider.value;
    const saturate = saturateSlider.value;
    const blur = blurSlider.value;
    const brightness = brightnessSlider.value;

    // Összeállítjuk a CSS filter stringet
    // Ez a string mondja meg a vászonnak, milyen szűrőket használjon
    const filterString = 
        `contrast(${contrast}%) ` +
        `saturate(${saturate}%) ` +
        `blur(${blur}px) ` +
        `brightness(${brightness}%)`;

    // Alkalmazzuk a szűrőket a vászon "kontextusára"
    ctx.filter = filterString;

    // Töröljük a vásznat (ha esetleg volt rajta előző kép)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Rárajzoljuk a képet a vászonra az aktuális szűrőbeállításokkal
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
}

// Eseményfigyelő a letöltés gombra
downloadButton.addEventListener('click', () => {
    // Létrehozunk egy "link" elemet a memóriában
    const link = document.createElement('a');
    
    // Beállítjuk a letöltendő fájl nevét
    link.download = 'elesitett-kep.png';
    
    // A link "címe" maga a vászon tartalma lesz, PNG képként
    link.href = canvas.toDataURL('image/png');
    
    // "Rákattintunk" a linkre a kódból, ami elindítja a letöltést
    link.click();
});
