import { useEffect, useState } from "react";

const firstTopics = [
  [1, "Matematyka", "Funkcje kwadratowe", "Średni", "2026-10-02", false],
  [2, "Programowanie", "Komponenty React", "Trudny", "2026-10-04", false],
  [3, "Historia", "Europa w XIX wieku", "Łatwy", "2026-10-05", true],
  [4, "Biologia", "Układ krążenia", "Średni", "2026-10-07", false],
  [5, "Angielski", "Czasy przeszłe", "Łatwy", "2026-10-08", true],
  [6, "Fizyka", "Ruch jednostajny", "Średni", "2026-10-10", false],
  [7, "Chemia", "Reakcje redoks", "Trudny", "2026-10-11", false],
  [8, "Geografia", "Procesy endogeniczne", "Średni", "2026-10-13", false],
  [9, "Informatyka", "Bazy danych SQL", "Trudny", "2026-10-14", false],
  [10, "Polski", "Lalka - motywy", "Łatwy", "2026-10-15", true],
  [11, "WOS", "Samorząd terytorialny", "Łatwy", "2026-10-17", false],
  [12, "Matematyka", "Prawdopodobieństwo", "Trudny", "2026-10-19", false],
].map(([id, subject, title, level, date, done]) => ({
  id,
  subject,
  title,
  level,
  date,
  done,
}));

const empty = {
  subject: "",
  title: "",
  level: "Łatwy",
  date: "",
  done: false,
  important: false,
};

function Dialog({ title, children, close }) {
  return (
    <div className="overlay">
      <div className="dialog">
        <div className="dialog-head">
          <h2>{title}</h2>
          <button onClick={close}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Form({ selected, save, close }) {
  const [data, setData] = useState(selected || empty);
  const [error, setError] = useState("");
  const set = (name, value) => setData({ ...data, [name]: value });

  function submit(event) {
    event.preventDefault();
    if (!data.subject || !data.title || !data.date)
      return setError("Uzupełnij przedmiot, temat i termin.");
    save({ ...data, subject: data.subject.trim(), title: data.title.trim() });
  }

  return (
    <form onSubmit={submit}>
      {error && <p className="error">{error}</p>}
      <label>
        Przedmiot
        <input
          value={data.subject}
          onChange={(event) => set("subject", event.target.value)}
        />
      </label>
      <label>
        Temat
        <input
          value={data.title}
          onChange={(event) => set("title", event.target.value)}
        />
      </label>
      <label>
        Termin
        <input
          type="date"
          value={data.date}
          onChange={(event) => set("date", event.target.value)}
        />
      </label>
      <label>
        Poziom
        <select
          value={data.level}
          onChange={(event) => set("level", event.target.value)}
        >
          <option>Łatwy</option>
          <option>Średni</option>
          <option>Trudny</option>
        </select>
      </label>
      <label className="choice">
        <input
          type="checkbox"
          checked={data.done}
          onChange={(event) => set("done", event.target.checked)}
        />{" "}
        Ukończone
      </label>
      <fieldset>
        <legend>Priorytet</legend>
        <label className="choice">
          <input
            type="radio"
            name="priority"
            checked={data.important}
            onChange={() => set("important", true)}
          />{" "}
          Ważny
        </label>
        <label className="choice">
          <input
            type="radio"
            name="priority"
            checked={!data.important}
            onChange={() => set("important", false)}
          />{" "}
          Zwykły
        </label>
      </fieldset>
      <div className="buttons">
        <button type="button" onClick={close}>
          Anuluj
        </button>
        <button className="primary">Zapisz</button>
      </div>
    </form>
  );
}

function Pagination({ page, pages, change }) {
  if (pages < 2) return null;
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => change(page - 1)}>
        ←
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          className={page === i + 1 ? "current" : ""}
          key={i}
          onClick={() => change(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => change(page + 1)}>
        →
      </button>
    </div>
  );
}

export default function App() {
  const [topics, setTopics] = useState(firstTopics);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Wszystkie");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const perPage = 5;

  const subjects = [...new Set(topics.map((topic) => topic.subject))];
  let results = topics.filter((topic) =>
    `${topic.title} ${topic.subject}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  if (filter !== "Wszystkie")
    results = results.filter((topic) =>
      filter === "Ukończone"
        ? topic.done
        : filter === "Do zrobienia"
          ? !topic.done
          : topic.subject === filter,
    );
  results = [...results].sort((a, b) =>
    sort === "title"
      ? a.title.localeCompare(b.title)
      : a.date.localeCompare(b.date),
  );
  const pages = Math.ceil(results.length / perPage);
  const shown = results.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > Math.max(1, pages)) setPage(Math.max(1, pages));
  }, [page, pages]);
  function filterChange(setter, value) {
    setter(value);
    setPage(1);
  }
  function save(topic) {
    setTopics((all) =>
      topic.id
        ? all.map((item) => (item.id === topic.id ? topic : item))
        : [{ ...topic, id: Date.now() }, ...all],
    );
    setDialog(null);
  }
  function remove() {
    setTopics((all) => all.filter((item) => item.id !== dialog.topic.id));
    setDialog(null);
  }

  return (
    <main className="container">
      <header>
        <h1>StudyTrack</h1>
        <p>Plan nauki</p>
      </header>
      <div className="title-row">
        <div>
          <p>Projekt CRUD</p>
          <h2>Tematy do nauki</h2>
        </div>
        <button className="primary" onClick={() => setDialog({ type: "form" })}>
          + Dodaj temat
        </button>
      </div>
      <div className="filters">
        <input
          placeholder="Szukaj..."
          value={search}
          onChange={(event) => filterChange(setSearch, event.target.value)}
        />
        <select
          value={filter}
          onChange={(event) => filterChange(setFilter, event.target.value)}
        >
          <option>Wszystkie</option>
          <option>Do zrobienia</option>
          <option>Ukończone</option>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => filterChange(setSort, event.target.value)}
        >
          <option value="date">Termin</option>
          <option value="title">Nazwa A-Z</option>
        </select>
      </div>
      <p className="count">Liczba wyników: {results.length}</p>
      {shown.length ? (
        <div className="list">
          {shown.map((topic) => (
            <div className={topic.done ? "row done" : "row"} key={topic.id}>
              <div>
                <b>{topic.title}</b>
                <small>
                  {topic.subject} | {topic.level}
                </small>
              </div>
              <span>{topic.date}</span>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={topic.done}
                  onChange={() =>
                    setTopics((all) =>
                      all.map((item) =>
                        item.id === topic.id
                          ? { ...item, done: !item.done }
                          : item,
                      ),
                    )
                  }
                />{" "}
                {topic.done ? "Gotowe" : "Plan"}
              </label>
              <div className="row-buttons">
                <button onClick={() => setDialog({ type: "form", topic })}>
                  Edytuj
                </button>
                <button onClick={() => setDialog({ type: "delete", topic })}>
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">Brak wyników.</div>
      )}
      <Pagination page={page} pages={pages} change={setPage} />
      <footer>StudyTrack | dane są tylko w pamięci aplikacji</footer>
      {dialog?.type === "form" && (
        <Dialog
          title={dialog.topic ? "Edytuj temat" : "Dodaj temat"}
          close={() => setDialog(null)}
        >
          <Form
            selected={dialog.topic}
            save={save}
            close={() => setDialog(null)}
          />
        </Dialog>
      )}
      {dialog?.type === "delete" && (
        <Dialog title="Usunąć temat?" close={() => setDialog(null)}>
          <p>
            Czy usunąć: <b>{dialog.topic.title}</b>?
          </p>
          <div className="buttons">
            <button onClick={() => setDialog(null)}>Anuluj</button>
            <button className="delete" onClick={remove}>
              Usuń
            </button>
          </div>
        </Dialog>
      )}
    </main>
  );
}
