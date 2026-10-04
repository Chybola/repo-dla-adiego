import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "studytrack-topics";
const THEME_KEY = "studytrack-theme";
const PAGE_SIZE = 5;

const starterTopics = [
  ["Biologia", "Fotosynteza i oddychanie komórkowe", "2026-10-05", 45,
    "Średni", "Wysoki", "W trakcie"],
  ["Matematyka", "Funkcje kwadratowe", "2026-10-07", 60,
    "Trudny", "Wysoki", "Do zrobienia"],
  ["Historia", "Europa po kongresie wiedeńskim", "2026-10-09", 35,
    "Średni", "Normalny", "Do zrobienia"],
  ["Angielski", "Phrasal verbs: praca i podróże", "2026-10-11", 25,
    "Łatwy", "Niski", "Zrobione"],
  ["Chemia", "Reakcje utleniania i redukcji", "2026-10-12", 50,
    "Trudny", "Wysoki", "W trakcie"],
  ["Fizyka", "Zasady dynamiki Newtona", "2026-10-14", 40,
    "Średni", "Normalny", "Do zrobienia"],
  ["Polski", "„Lalka” — obraz społeczeństwa", "2026-10-16", 55,
    "Trudny", "Wysoki", "Do zrobienia"],
  ["Geografia", "Procesy kształtujące klimat", "2026-10-18", 30,
    "Łatwy", "Niski", "Zrobione"],
  ["Matematyka", "Ciągi arytmetyczne i geometryczne", "2026-10-20", 45,
    "Średni", "Normalny", "Do zrobienia"],
  ["Biologia", "Dziedziczenie cech — podstawy genetyki", "2026-10-22", 60,
    "Trudny", "Wysoki", "W trakcie"],
  ["Angielski", "Conditionals: okresy warunkowe", "2026-10-24", 35,
    "Średni", "Normalny", "Do zrobienia"],
  ["Chemia", "Wiązania chemiczne i ich właściwości", "2026-10-26", 40,
    "Średni", "Niski", "Do zrobienia"],
].map(
  ([subject, title, dueDate, minutes, difficulty, priority, status], index) => ({
    id: index + 1,
    subject,
    title,
    dueDate,
    minutes,
    difficulty,
    priority,
    status,
  }),
);

const emptyForm = {
  subject: "",
  title: "",
  dueDate: "",
  minutes: "30",
  difficulty: "Średni",
  priority: "Normalny",
  status: "Do zrobienia",
  needsReview: false,
  studyType: "Czytanie",
};

const statusClass = {
  "Do zrobienia": "todo",
  "W trakcie": "progress",
  Zrobione: "done",
};

function readTopics() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterTopics;
  } catch {
    return starterTopics;
  }
}

function formatDate(date) {
  if (!date) return "Bez terminu";
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function Dialog({ children, titleId, onClose, isAlert = false, className = "" }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className={`dialog ${className}`.trim()}
        role={isAlert ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {children}
      </section>
    </div>
  );
}
function TopicDialog({ topic, onClose, onSave }) {
  const [form, setForm] = useState(
    topic
      ? {
          ...emptyForm,
          ...topic,
          minutes: String(topic.minutes),
          needsReview: topic.needsReview ?? false,
          studyType: topic.studyType ?? "Czytanie",
        }
      : emptyForm,
  );
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.subject.trim() || !form.title.trim() || !form.dueDate) {
      setError("Uzupełnij przedmiot, temat i termin.");
      return;
    }
    const minutes = Number(form.minutes);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 600) {
      setError("Czas nauki musi wynosić od 5 do 600 minut.");
      return;
    }
    onSave({
      ...form,
      subject: form.subject.trim(),
      title: form.title.trim(),
      minutes,
    });
  }

  return (
    <Dialog titleId="topic-dialog-title" onClose={onClose}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">PLAN NAUKI</span>
            <h2 id="topic-dialog-title">
              {topic ? "Edytuj temat" : "Dodaj temat"}
            </h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form onSubmit={submit} noValidate>
          <label>
            Przedmiot
            <input
              autoFocus
              value={form.subject}
              onChange={(event) => update("subject", event.target.value)}
              placeholder="np. Biologia"
            />
          </label>
          <label>
            Temat
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="Czego chcesz się nauczyć?"
            />
          </label>
          <div className="form-grid">
            <label>
              Termin
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
              />
            </label>
            <label>
              Czas (min)
              <input
                type="number"
                min="5"
                max="600"
                step="5"
                value={form.minutes}
                onChange={(event) => update("minutes", event.target.value)}
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Trudność
              <select
                value={form.difficulty}
                onChange={(event) => update("difficulty", event.target.value)}
              >
                <option>Łatwy</option>
                <option>Średni</option>
                <option>Trudny</option>
              </select>
            </label> 
            <label>
              Priorytet
              <select
                value={form.priority}
                onChange={(event) => update("priority", event.target.value)}
              >
                <option>Niski</option>
                <option>Normalny</option>
                <option>Wysoki</option>
              </select>
            </label>
          </div>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              <option>Do zrobienia</option>
              <option>W trakcie</option>
              <option>Zrobione</option>
            </select>
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.needsReview}
              onChange={(event) => update("needsReview", event.target.checked)}
            />
            Powtórzyć temat przed terminem
          </label>
          <fieldset className="radio-field">
            <legend>Forma nauki</legend>
            {[
              ["Czytanie", "Czytanie notatek"],
              ["Ćwiczenia", "Rozwiązywanie ćwiczeń"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="studyType"
                  value={value}
                  checked={form.studyType === value}
                  onChange={(event) => update("studyType", event.target.value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="buttons">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Anuluj
            </button>
            <button className="primary" type="submit">
              {topic ? "Zapisz zmiany" : "Dodaj do planu"}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
    </Dialog>
  );
}

function DeleteDialog({ topic, onCancel, onConfirm }) {
  return (
    <Dialog
      titleId="delete-title"
      onClose={onCancel}
      isAlert
      className="confirm-dialog"
    >
        <span className="eyebrow">USUWANIE TEMATU</span>
        <h2 id="delete-title">Na pewno usunąć?</h2>
        <p>
          „{topic.title}” z przedmiotu {topic.subject} zostanie usunięty z
          Twojego planu.
        </p>
        <div className="buttons">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Zostaw temat
          </button>
          <button className="danger-button" type="button" onClick={onConfirm}>
            Usuń temat
          </button>
        </div>
    </Dialog>
  );
}

function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount < 2) return null;

  return (
    <nav className="pagination" aria-label="Strony listy tematów">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Poprzednia strona"
      >
        ←
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            className={page === pageNumber ? "current" : ""}
            aria-current={page === pageNumber ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Następna strona"
      >
        →
      </button>
    </nav>
  );
}

export default function App() {
  const [topics, setTopics] = useState(readTopics);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Wszystkie przedmioty");
  const [statusFilter, setStatusFilter] = useState("Wszystkie statusy");
  const [sortField, setSortField] = useState("timeUntil");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const subjects = useMemo(
    () =>
      [...new Set(topics.map((topic) => topic.subject))].sort((a, b) =>
        a.localeCompare(b, "pl"),
      ),
    [topics],
  );
  const filteredTopics = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pl");
    return topics
      .filter((topic) =>
        `${topic.subject} ${topic.title}`
          .toLocaleLowerCase("pl")
          .includes(query),
      )
      .filter(
        (topic) =>
          subjectFilter === "Wszystkie przedmioty" ||
          topic.subject === subjectFilter,
      )
      .filter(
        (topic) =>
          statusFilter === "Wszystkie statusy" || topic.status === statusFilter,
      )
      .sort((first, second) => {
        const firstValue =
          sortField === "timeUntil"
            ? new Date(`${first.dueDate}T00:00:00`).getTime() - Date.now()
            : first[sortField];
        const secondValue =
          sortField === "timeUntil"
            ? new Date(`${second.dueDate}T00:00:00`).getTime() - Date.now()
            : second[sortField];
        const comparison =
          typeof firstValue === "string"
            ? firstValue.localeCompare(secondValue, "pl")
            : firstValue - secondValue;
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [topics, search, subjectFilter, statusFilter, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredTopics.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleTopics = filteredTopics.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);
  function saveTopic(values) {
    if (editingTopic) {
      setTopics((current) =>
        current.map((topic) =>
          topic.id === editingTopic.id ? { ...topic, ...values } : topic,
        ),
      );
      setEditingTopic(null);
    } else {
      setTopics((current) => [{ ...values, id: Date.now() }, ...current]);
      setIsAdding(false);
    }
    setPage(1);
  }

  function removeTopic() {
    setTopics((current) =>
      current.filter((topic) => topic.id !== deletingTopic.id),
    );
    setDeletingTopic(null);
  }

  function toggleStatus(topic) {
    const nextStatus =
      topic.status === "Zrobione" ? "Do zrobienia" : "Zrobione";
    setTopics((current) =>
      current.map((item) =>
        item.id === topic.id ? { ...item, status: nextStatus } : item,
      ),
    );
  }

  function resetPageOn(setter, value) {
    setter(value);
    setPage(1);
  }

  const completedCount = topics.filter(
    (topic) => topic.status === "Zrobione",
  ).length;
  const activeCount = topics.length - completedCount;
  const completionRate =
    topics.length === 0 ? 0 : Math.round((completedCount / topics.length) * 100);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">S</span>
          <div>
            <h1>StudyTrack</h1>
            <p>Twój spokojny plan nauki</p>
          </div>
        </div>
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={theme === "dark"}
          onClick={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
        >
          <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          {theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
        </button>
      </header>

      <section className="workspace" aria-label="Plan nauki">
        <div className="welcome-panel">
          <div className="welcome-copy">
            <span className="eyebrow">MAŁE KROKI, DUŻY POSTĘP</span>
            <h2>Nauka pod kontrolą.</h2>
            <p>
              Wszystko, czego potrzebujesz, żeby uczyć się we własnym tempie.
            </p>
          </div>
          <div className="progress-card">
            <div className="progress-card-heading">
              <span>Twój postęp</span>
              <strong>{completionRate}%</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Ukończone tematy"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={completionRate}
            >
              <span style={{ width: `${completionRate}%` }} />
            </div>
            <p>
              Tematy ukończone: {completedCount} / {topics.length}
            </p>
          </div>
        </div>

        <div className="summary-grid" aria-label="Podsumowanie planu">
          <article className="summary-card">
            <span className="summary-icon icon-planned" aria-hidden="true">
              ✳
            </span>
            <div>
              <span>W planie</span>
              <strong>{topics.length}</strong>
            </div>
          </article>
          <article className="summary-card">
            <span className="summary-icon icon-active" aria-hidden="true">
              ↗
            </span>
            <div>
              <span>Aktywne</span>
              <strong>{activeCount}</strong>
            </div>
          </article>
          <article className="summary-card">
            <span className="summary-icon icon-completed" aria-hidden="true">
              ✓
            </span>
            <div>
              <span>Ukończone</span>
              <strong>{completedCount}</strong>
            </div>
          </article>
        </div>

        <div className="section-heading">
          <div>
            <span className="eyebrow">TWÓJ WORKSPACE</span>
            <h2>Tematy do nauki</h2>
          </div>
          <button
            className="primary add-button"
            type="button"
            onClick={() => setIsAdding(true)}
          >
            <span aria-hidden="true">+</span> Dodaj temat
          </button>
        </div>

        <div className="filter-panel">
          <label className="search-field">
            <input
              value={search}
              onChange={(event) => resetPageOn(setSearch, event.target.value)}
              placeholder="Szukaj przedmiotu lub tematu"
              aria-label="Szukaj przedmiotu lub tematu"
            />
          </label>
          <label className="visually-hidden" htmlFor="subject-filter">
            Filtruj przedmiot
          </label>
          <select
            id="subject-filter"
            value={subjectFilter}
            onChange={(event) =>
              resetPageOn(setSubjectFilter, event.target.value)
            }
          >
            <option>Wszystkie przedmioty</option>
            {subjects.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="status-filter">
            Filtruj status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              resetPageOn(setStatusFilter, event.target.value)
            }
          >
            <option>Wszystkie statusy</option>
            <option>Do zrobienia</option>
            <option>W trakcie</option>
            <option>Zrobione</option>
          </select>
          <label className="visually-hidden" htmlFor="sort-field">
            Sortuj według
          </label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(event) => setSortField(event.target.value)}
          >
            <option value="minutes">Czas nauki</option>
            <option value="title">Temat</option>
            <option value="subject">Przedmiot</option>
            <option value="timeUntil">Czas do terminu</option>
          </select>
          <label className="visually-hidden" htmlFor="sort-direction">
            Kierunek sortowania
          </label>
          <select
            id="sort-direction"
            value={sortDirection}
            onChange={(event) => setSortDirection(event.target.value)}
          >
            <option value="asc">Rosnąco</option>
            <option value="desc">Malejąco</option>
          </select>
        </div>

        <div className="list-meta">
          <span className="count">
            {filteredTopics.length === 0 ? (
              "Brak tematów"
            ) : (
              <>
                Wyniki{" "}
                <strong>
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredTopics.length)}
                </strong>{" "}
                z <strong>{filteredTopics.length}</strong>
              </>
            )}
          </span>
        </div>

        <div className="topic-list">
          <div className="list-header">
            <span>PRZEDMIOT / TEMAT</span>
            <span>TERMIN</span>
            <span>PRIORYTET</span>
            <span>STATUS</span>
            <span className="visually-hidden">Akcje</span>
          </div>
          {visibleTopics.map((topic) => (
            <article
              className={`topic-row ${topic.status === "Zrobione" ? "is-done" : ""}`}
              key={topic.id}
            >
              <button
                className={`check-button ${topic.status === "Zrobione" ? "checked" : ""}`}
                type="button"
                onClick={() => toggleStatus(topic)}
                aria-label={
                  topic.status === "Zrobione"
                    ? `Oznacz ${topic.title} jako do zrobienia`
                    : `Oznacz ${topic.title} jako zrobione`
                }
              >
                {topic.status === "Zrobione" ? "✓ " : ""}
              </button>
              <div className="topic-name">
                <span className="subject-label">{topic.subject}</span>
                <strong>{topic.title}</strong>
                <span className="topic-detail">
                  {topic.minutes} min <span aria-hidden="true">·</span>{" "}
                  {topic.difficulty}
                </span>
              </div>
              <time className="due-date" dateTime={topic.dueDate}>
                {formatDate(topic.dueDate)}
              </time>
              <span
                className={`priority priority-${topic.priority.toLocaleLowerCase("pl")}`}
              >
                {topic.priority}
              </span>
              <span className={`status status-${statusClass[topic.status]}`}>
                {topic.status}
              </span>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => setEditingTopic(topic)}
                  aria-label={`Edytuj ${topic.title}`}
                  title="Edytuj"
                >
                  Edytuj
                </button>
                <button
                  className="delete-action"
                  type="button"
                  onClick={() => setDeletingTopic(topic)}
                  aria-label={`Usuń ${topic.title}`}
                  title="Usuń"
                >
                  Usuń
                </button>
              </div>
            </article>
          ))}
          {filteredTopics.length === 0 && (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <strong>Nic tu nie ma</strong>
              <p>Zmień filtry albo dodaj nowy temat do planu.</p>
            </div>
          )}
        </div>

        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </section>

      <footer className="footer">
        <span>StudyTrack</span>
      </footer>

      {(isAdding || editingTopic) && (
        <TopicDialog
          topic={editingTopic}
          onClose={() => {
            setIsAdding(false);
            setEditingTopic(null);
          }}
          onSave={saveTopic}
        />
      )}
      {deletingTopic && (
        <DeleteDialog
          topic={deletingTopic}
          onCancel={() => setDeletingTopic(null)}
          onConfirm={removeTopic}
        />
      )}
    </main>
  );
}
