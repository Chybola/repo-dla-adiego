import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

const startTopics = [
  { id: 1, subject: "Biologia", title: "Fotosynteza", dueDate: "2026-10-05", minutes: 45, priority: "Wysoki", status: "W trakcie" },
  { id: 2, subject: "Matematyka", title: "Funkcje kwadratowe", dueDate: "2026-10-07", minutes: 60, priority: "Wysoki", status: "Do zrobienia" },
  { id: 3, subject: "Historia", title: "Kongres wiedeński", dueDate: "2026-10-09", minutes: 35, priority: "Normalny", status: "Do zrobienia" },
  { id: 4, subject: "Angielski", title: "Phrasal verbs", dueDate: "2026-10-11", minutes: 25, priority: "Niski", status: "Zrobione" },
  { id: 5, subject: "Chemia", title: "Reakcje redoks", dueDate: "2026-10-12", minutes: 50, priority: "Wysoki", status: "W trakcie" },
  { id: 6, subject: "Fizyka", title: "Zasady dynamiki", dueDate: "2026-10-14", minutes: 40, priority: "Normalny", status: "Do zrobienia" },
  { id: 7, subject: "Polski", title: "Lalka", dueDate: "2026-10-16", minutes: 55, priority: "Wysoki", status: "Do zrobienia" },
  { id: 8, subject: "Geografia", title: "Klimat", dueDate: "2026-10-18", minutes: 30, priority: "Niski", status: "Zrobione" },
  { id: 9, subject: "Matematyka", title: "Ciągi", dueDate: "2026-10-20", minutes: 45, priority: "Normalny", status: "Do zrobienia" },
  { id: 10, subject: "Biologia", title: "Genetyka", dueDate: "2026-10-22", minutes: 60, priority: "Wysoki", status: "W trakcie" },
  { id: 11, subject: "Angielski", title: "Okresy warunkowe", dueDate: "2026-10-24", minutes: 35, priority: "Normalny", status: "Do zrobienia" },
  { id: 12, subject: "Chemia", title: "Wiązania chemiczne", dueDate: "2026-10-26", minutes: 40, priority: "Niski", status: "Do zrobienia" },
];

const emptyForm = {
  subject: "",
  title: "",
  dueDate: "",
  minutes: 30,
  priority: "Normalny",
  status: "Do zrobienia",
  needsReview: false,
  studyType: "Czytanie",
};

// okno 
function Dialog({ children }) {
  return (
    <div className="overlay">
      <div className="dialog">{children}</div>
    </div>
  );
}

function TopicForm({ topic, onClose, onSave }) {
  const [form, setForm] = useState(topic || emptyForm);
  const [error, setError] = useState("");

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.subject || !form.title || !form.dueDate) {
      setError("Uzupełnij przedmiot, temat i termin.");
      return;
    }
    onSave({ ...form, minutes: Number(form.minutes) });
  }

  return (
    <Dialog>
      <h2>{topic ? "Edytuj temat" : "Dodaj temat"}</h2>
      <form onSubmit={submit}>
        <label>
          Przedmiot
          <input name="subject" value={form.subject} onChange={change} />
        </label>
        <label>
          Temat
          <input name="title" value={form.title} onChange={change} />
        </label>
        <label>
          Termin
          <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
        </label>
        <label>
          Czas (min)
          <input type="number" name="minutes" min="5" value={form.minutes} onChange={change} />
        </label>
        <label>
          Priorytet
          <select name="priority" value={form.priority} onChange={change}>
            <option>Niski</option>
            <option>Normalny</option>
            <option>Wysoki</option>
          </select>
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={change}>
            <option>Do zrobienia</option>
            <option>W trakcie</option>
            <option>Zrobione</option>
          </select>
        </label>
        <label className="inline">
          <input type="checkbox" name="needsReview" checked={form.needsReview} onChange={change} />
          Powtórzyć przed terminem
        </label>
        <label className="inline">
          <input type="radio" name="studyType" value="Czytanie" checked={form.studyType === "Czytanie"} onChange={change} />
          Czytanie notatek
        </label>
        <label className="inline">
          <input type="radio" name="studyType" value="Ćwiczenia" checked={form.studyType === "Ćwiczenia"} onChange={change} />
          Rozwiązywanie ćwiczeń
        </label>
        {error && <p className="error">{error}</p>}
        <div className="buttons">
          <button type="button" onClick={onClose}>Anuluj</button>
          <button className="primary">Zapisz</button>
        </div>
      </form>
    </Dialog>
  );
}

// paginacja
function Pagination({ page, pageCount, onChange }) {
  const pages = [];
  for (let i = 1; i <= pageCount; i++) pages.push(i);

  return (
    <div className="pagination">
      {pages.map((p) => (
        <button key={p} className={p === page ? "primary" : ""} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [topics, setTopics] = useState(() => JSON.parse(localStorage.getItem("topics")) || startTopics);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(topics));
  }, [topics]);

  const subjects = [...new Set(topics.map((t) => t.subject))];

  // filtrowanie i sortowanie
  const filtered = topics
    .filter((t) => (t.subject + t.title).toLowerCase().includes(search.toLowerCase()))
    .filter((t) => !subject || t.subject === subject)
    .filter((t) => !status || t.status === status)
    .sort((a, b) => {
      const result = sortBy === "minutes" ? a.minutes - b.minutes : a[sortBy].localeCompare(b[sortBy]);
      return sortDir === "asc" ? result : -result;
    });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function saveTopic(values) {
    if (values.id) {
      setTopics(topics.map((t) => (t.id === values.id ? values : t)));
    } else {
      setTopics([{ ...values, id: Date.now() }, ...topics]);
    }
    setEditing(null);
  }

  function deleteTopic() {
    setTopics(topics.filter((t) => t.id !== deleting.id));
    setDeleting(null);
    setPage(1);
  }

  return (
    <main>
      <h1>StudyTrack</h1>

      <div className="filters">
        <input
          placeholder="Szukaj..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Wszystkie przedmioty</option>
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Wszystkie statusy</option>
          <option>Do zrobienia</option>
          <option>W trakcie</option>
          <option>Zrobione</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueDate">Termin</option>
          <option value="minutes">Czas nauki</option>
          <option value="title">Temat</option>
          <option value="subject">Przedmiot</option>
        </select>
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
          <option value="asc">Rosnąco</option>
          <option value="desc">Malejąco</option>
        </select>
        <button className="primary" onClick={() => setEditing(emptyForm)}>
          Dodaj temat
        </button>
      </div>

      {/* lista tematów */}
      <table>
        <thead>
          <tr>
            <th>Przedmiot</th>
            <th>Temat</th>
            <th>Termin</th>
            <th>Czas</th>
            <th>Priorytet</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((t) => (
            <tr key={t.id}>
              <td className="subject">{t.subject}</td>
              <td>{t.title}</td>
              <td className="muted">{t.dueDate}</td>
              <td className="muted">{t.minutes} min</td>
              <td className={t.priority}>{t.priority}</td>
              <td className={t.status.replace(" ", "-")}>{t.status}</td>
              <td>
                <button onClick={() => setEditing(t)}>Edytuj</button>
                <button onClick={() => setDeleting(t)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p>Brak tematów.</p>}

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      {/* okienka */}
      {editing && (
        <TopicForm topic={editing.id ? editing : null} onClose={() => setEditing(null)} onSave={saveTopic} />
      )}
      {deleting && (
        <Dialog>
          <h2>Usunąć temat "{deleting.title}"?</h2>
          <div className="buttons">
            <button onClick={() => setDeleting(null)}>Anuluj</button>
            <button className="danger" onClick={deleteTopic}>Usuń</button>
          </div>
        </Dialog>
      )}
    </main>
  );
}
