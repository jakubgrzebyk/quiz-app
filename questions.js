// Baza pytań do quizu
const questions = [
    {
        question: "Krzywą, która przedstawia zbiór wszystkich kombinacji nakładów dwóch czynników produkcji, których koszt całkowity jest taki sam, nazywamy:",
        answers: [
            { text: "Izokwantą", correct: false },
            { text: "Izokostą", correct: true },
            { text: "Krzywą obojętności", correct: false },
            { text: "Krzywą jednakowego produktu", correct: false }
        ]
    },
    {
        question: "Rynek sprzedawcy oznacza, że:",
        answers: [
            { text: "Popyt przewyższa podaż", correct: true },
            { text: "Podaż przewyższa popyt", correct: false },
            { text: "Popyt równa się podaży", correct: false },
            { text: "Cena równowagi jest niższa od ceny rynkowej", correct: false }
        ]
    },
    {
        question: "Rynek nabywcy oznacza, że:",
        answers: [
            { text: "Popyt przewyższa podaż", correct: false },
            { text: "Podaż przewyższa popyt", correct: true },
            { text: "Popyt równa się podaży", correct: false },
            { text: "Cena równowagi jest wyższa od ceny rynkowej", correct: false }
        ]
    },
    {
        question: "Produktywność krańcowa definiowana jest jako:",
        answers: [
            { text: "Całkowity produkt podzielony przez liczbę jednostek nakładu", correct: false },
            { text: "Zmiana produkcji całkowitej wywołana zmianą nakładu o jednostkę", correct: true },
            { text: "Stosunek nakładów do efektów", correct: false },
            { text: "Różnica między produkcją całkowitą a kosztami produkcji", correct: false }
        ]
    },
    {
        question: "Produktywność przeciętna definiowana jest jako:",
        answers: [
            { text: "Całkowity produkt podzielony przez liczbę jednostek nakładu", correct: true },
            { text: "Zmiana produkcji całkowitej wywołana zmianą nakładu o jednostkę", correct: false },
            { text: "Stosunek nakładów do efektów", correct: false },
            { text: "Różnica między produkcją całkowitą a kosztami produkcji", correct: false }
        ]
    },
    {
        question: "Miernikiem całkowitych dochodów osiąganych przez obywateli danego kraju, niezależnie od miejsca (kraju) świadczenia usług przez czynniki produkcji, jest:",
        answers: [
            { text: "Produkt Krajowy Brutto (PKB)", correct: false },
            { text: "Produkt Narodowy Brutto (PNB)", correct: true },
            { text: "Produkt Krajowy Netto (PKN)", correct: false },
            { text: "Dochód Narodowy (DN)", correct: false }
        ]
    },
    {
        question: "Do obliczenia PKB można stosować metodę:",
        answers: [
            { text: "Dochodową, wydatkową i produkcyjną", correct: true },
            { text: "Tylko dochodową", correct: false },
            { text: "Tylko wydatkową", correct: false },
            { text: "Tylko produkcyjną", correct: false }
        ]
    },
    {
        question: "Popyt efektywny można zdefiniować jako:",
        answers: [
            { text: "Popyt całkowity na rynku", correct: false },
            { text: "Popyt poparty siłą nabywczą", correct: true },
            { text: "Popyt potencjalny na dobra luksusowe", correct: false },
            { text: "Popyt na dobra pierwszej potrzeby", correct: false }
        ]
    },
    {
        question: "Cykle koniunkturalne powtarzające się co 8-10 lat nazywamy cyklami:",
        answers: [
            { text: "Kitchina", correct: false },
            { text: "Juglara", correct: true },
            { text: "Kondratiewa", correct: false },
            { text: "Kuznetsa", correct: false }
        ]
    },
    {
        question: "W badaniach ekonomicznych bezrobotny jest zdefiniowany jako:",
        answers: [
            { text: "Osoba niepracująca, nieaktywnie poszukująca pracy", correct: false },
            { text: "Osoba niepracująca, aktywnie poszukująca pracy i gotowa do jej podjęcia", correct: true },
            { text: "Osoba pracująca w niepełnym wymiarze czasu", correct: false },
            { text: "Osoba niezarejestrowana w urzędzie pracy", correct: false }
        ]
    },
    // Dodaj więcej pytań tutaj - możesz dodać 600 pytań
    // Przykład dodatkowych pytań:
    {
        question: "Inflacja definiowana jest jako:",
        answers: [
            { text: "Wzrost cen towarów i usług", correct: true },
            { text: "Spadek cen towarów i usług", correct: false },
            { text: "Wzrost wartości pieniądza", correct: false },
            { text: "Wzrost bezrobocia", correct: false }
        ]
    },
    {
        question: "Deflacja to:",
        answers: [
            { text: "Wzrost cen towarów i usług", correct: false },
            { text: "Spadek cen towarów i usług", correct: true },
            { text: "Spadek wartości pieniądza", correct: false },
            { text: "Spadek bezrobocia", correct: false }
        ]
    }
    // Kontynuuj dodawanie pytań aż do osiągnięcia 600
];