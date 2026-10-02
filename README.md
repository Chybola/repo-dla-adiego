# StudyTrack

StudyTrack to frontendowa aplikacja CRUD do planowania nauki. Pozwala zarządzać tematami, oznaczać ich status, ustawiać priorytet oraz sortować listę po czasie nauki, temacie, przedmiocie lub czasie pozostałym do terminu.

## Uruchomienie

```bash
npm install
npm run dev
```

## Funkcje

- wyświetlanie 12 przykładowych tematów z paginacją po maksymalnie 5 elementów;
- dodawanie, edytowanie i usuwanie tematów;
- jeden kontrolowany formularz używany przy dodawaniu i edycji;
- kontrolowane pola wyboru formy nauki i powtórki;
- wyszukiwanie po przedmiocie i temacie;
- filtrowanie po przedmiocie i statusie;
- sortowanie po czasie nauki, temacie, przedmiocie lub czasie pozostałym do terminu, rosnąco albo malejąco;
- wspólny komponent dialogu formularza i potwierdzenia usuwania;
- komponent paginacji z maksymalnie 5 tematami na stronie;
- walidacja wymaganych pól i czytelne komunikaty błędów;
- tryb jasny i ciemny;
- responsywny interfejs bez backendu.

## Struktura

- `src/App.jsx` - dane, logika CRUD, filtry oraz komponenty aplikacji;
- `src/main.css` - własna warstwa wizualna i responsywność;
- `src/main.jsx` - punkt startowy React.
