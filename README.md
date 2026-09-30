# StudyTrack

StudyTrack to frontendowa aplikacja CRUD do planowania nauki. Pozwala zarządzać tematami, oznaczać ich status, ustawiać priorytet oraz porządkować listę według kilku kryteriów.

## Uruchomienie

```bash
npm install
npm run dev
```

## Funkcje

- wyświetlanie 12 przykładowych tematów z paginacją po maksymalnie 5 elementów;
- dodawanie, edytowanie i usuwanie tematów;
- jeden kontrolowany formularz używany przy dodawaniu i edycji;
- wyszukiwanie po przedmiocie i temacie;
- filtrowanie po przedmiocie i statusie;
- sortowanie po terminie, nazwie, czasie i poziomie trudności;
- własny dialog formularza i dialog potwierdzenia usuwania;
- walidacja wymaganych pól i czytelne komunikaty błędów;
- responsywny interfejs bez backendu.

## Struktura

- `src/App.jsx` - dane, logika CRUD, filtry oraz komponenty aplikacji;
- `src/styles.css` - własna warstwa wizualna i responsywność;
- `src/main.jsx` - punkt startowy React.
