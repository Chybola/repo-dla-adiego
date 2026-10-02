import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "studytrack-topics";
const PAGE_SIZE = 5;

const starterTopics = [
  {
    id: 1,
    subject: "Biologia",
    title: "Fotosynteza i oddychanie komórkowe",
    dueDate: "2026-10-05",
    minutes: 45,
    difficulty: "Średni",
    priority: "Wysoki",
    status: "W trakcie",
  },
  {
    id: 2,
    subject: "Matematyka",
    title: "Funkcje kwadratowe",
    dueDate: "2026-10-07",
    minutes: 60,
    difficulty: "Trudny",
    priority: "Wysoki",
    status: "Do zrobienia",
  },
  {
    id: 3,
    subject: "Historia",
    title: "Europa po kongresie wiedeńskim",
    dueDate: "2026-10-09",
    minutes: 35,
    difficulty: "Średni",
    priority: "Normalny",
    status: "Do zrobienia",
  },
  {
    id: 4,
    subject: "Angielski",
    title: "Phrasal verbs: praca i podróże",
    dueDate: "2026-10-11",
    minutes: 25,
    difficulty: "Łatwy",
    priority: "Niski",
    status: "Zrobione",
  },
  {
    id: 5,
    subject: "Chemia",
    title: "Reakcje utleniania i redukcji",
    dueDate: "2026-10-12",
    minutes: 50,
    difficulty: "Trudny",
    priority: "Wysoki",
    status: "W trakcie",
  },
  {
    id: 6,
    subject: "Fizyka",
    title: "Zasady dynamiki Newtona",
    dueDate: "2026-10-14",
    minutes: 40,
    difficulty: "Średni",
    priority: "Normalny",
    status: "Do zrobienia",
  },
  {
    id: 7,
    subject: "Polski",
    title: "„Lalka” — obraz społeczeństwa",
    dueDate: "2026-10-16",
    minutes: 55,
    difficulty: "Trudny",
    priority: "Wysoki",
    status: "Do zrobienia",
  },
  {
    id: 8,
    subject: "Geografia",
    title: "Procesy kształtujące klimat",
    dueDate: "2026-10-18",
    minutes: 30,
    difficulty: "Łatwy",
    priority: "Niski",
    status: "Zrobione",
  },
  {
    id: 9,
    subject: "Matematyka",
    title: "Ciągi arytmetyczne i geometryczne",
    dueDate: "2026-10-20",
    minutes: 45,
    difficulty: "Średni",
    priority: "Normalny",
    status: "Do zrobienia",
  },
  {
    id: 10,
    subject: "Biologia",
    title: "Dziedziczenie cech — podstawy genetyki",
    dueDate: "2026-10-22",
    minutes: 60,
    difficulty: "Trudny",
    priority: "Wysoki",
    status: "W trakcie",
  },
  {
    id: 11,
    subject: "Angielski",
    title: "Conditionals: okresy warunkowe",
    dueDate: "2026-10-24",
    minutes: 35,
    difficulty: "Średni",
    priority: "Normalny",
    status: "Do zrobienia",
  },
  {
    id: 12,
    subject: "Chemia",
    title: "Wiązania chemiczne i ich właściwości",
    dueDate: "2026-10-26",
    minutes: 40,
    difficulty: "Średni",
    priority: "Niski",
    status: "Do zrobienia",
  },
];

const emptyForm = {
  subject: "",
  title: "",
  dueDate: "",
  minutes: "30",
  difficulty: "Średni",
  priority: "Normalny",
  status: "Do zrobienia",
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

function TopicDialog({ topic, onClose, onSave }) {
  const [form, setForm] = useState(
    topic ? { ...topic, minutes: String(topic.minutes) } : emptyForm,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
    <div
      className="overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-dialog-title"
      >
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
      </section>
    </div>
  );
}

function DeleteDialog({ topic, onCancel, onConfirm }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="overlay"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <section
        className="dialog confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
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
      </section>
    </div>
  );
}

export default function App() {
  const [topics, setTopics] = useState(readTopics);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Wszystkie przedmioty");
  const [statusFilter, setStatusFilter] = useState("Wszystkie statusy");
  const [page, setPage] = useState(1);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  }, [topics]);

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
      .sort((first, second) => first.minutes - second.minutes);
  }, [topics, search, subjectFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredTopics.length / PAGE_SIZE));
  const visibleTopics = filteredTopics.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <h1>StudyTrack</h1>
        <p>Plan nauki</p>
      </header>

      <section className="workspace" aria-label="Plan nauki">
        <div className="section-heading">
          <h2>Tematy do nauki</h2>
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
        </div>

        <div className="list-meta">
          <span className="count">
            {filteredTopics.length === 0 ? (
              "Brak tematów"
            ) : (
              <>
                Wyniki{" "}
                <strong>
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filteredTopics.length)}
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
                {topic.status === "Zrobione" ? "✓" : ""}
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

        {pageCount > 1 && (
          <nav className="pagination" aria-label="Strony listy tematów">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
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
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              aria-label="Następna strona"
            >
              →
            </button>
          </nav>
        )}
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
