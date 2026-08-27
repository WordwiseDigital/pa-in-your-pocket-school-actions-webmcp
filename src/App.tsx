import { FormEvent, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DEMO_WEEK_END } from "./data";
import { isDraftComplete, loadState, reducer, saveState } from "./state";
import type { ActionDraft, ResponseChoice, SchoolAction } from "./types";
import { registerSchoolActionTools } from "./webmcp";

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

function statusLabel(status: SchoolAction["status"]): string {
  if (status === "prepared") return "Ready for your review";
  if (status === "submitted") return "Submitted by parent";
  return "Needs attention";
}

function responseOptions(action: SchoolAction) {
  if (action.kind === "checklist") {
    return [{ value: "acknowledged", label: "I have reviewed the checklist" }];
  }
  return [
    { value: "yes", label: action.kind === "permission" ? "Yes, may attend" : "Yes, I consent" },
    { value: "no", label: action.kind === "permission" ? "No, may not attend" : "No, I do not consent" },
  ];
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [selectedId, setSelectedId] = useState(state.actions[0]?.id ?? "");
  const [toast, setToast] = useState("");
  const stateRef = useRef(state);

  const selected = state.actions.find((action) => action.id === selectedId) ?? state.actions[0];
  const dueThisWeek = useMemo(
    () => state.actions.filter((action) => action.dueDate <= DEMO_WEEK_END),
    [state.actions],
  );
  const submittedCount = state.actions.filter((action) => action.status === "submitted").length;
  const webMcpSupported = Boolean(document.modelContext?.registerTool);

  useEffect(() => {
    stateRef.current = state;
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!document.modelContext) return;
    const controller = new AbortController();
    registerSchoolActionTools(
      document.modelContext,
      {
        getState: () => stateRef.current,
        selectAction: (actionId) => {
          setSelectedId(actionId);
          requestAnimationFrame(() => {
            document.getElementById("action-workspace")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        },
        prepareAction: (actionId, draft) => {
          dispatch({ type: "agent-prepare", actionId, draft });
          setToast("Your assistant prepared a response. Please review it before submitting.");
        },
      },
      controller.signal,
    ).catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("WebMCP tool registration failed", error);
      setToast("Site tools could not be registered in this browser.");
    });
    return () => controller.abort();
  }, []);

  function updateDraft(draft: Partial<ActionDraft>) {
    if (!selected) return;
    dispatch({ type: "parent-update", actionId: selected.id, draft });
  }

  function submitAction(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      dispatch({ type: "parent-submit", actionId: selected.id });
      setToast("Submitted in this fictional demo. No information was sent anywhere.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Please complete the required fields.");
    }
  }

  function resetDemo() {
    dispatch({ type: "reset" });
    setSelectedId("ava-museum-trip");
    setToast("The fictional demo has been reset.");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PA in Your Pocket School Actions home">
          <span className="brand-mark" aria-hidden="true">PA</span>
          <span>
            <strong>PA in Your Pocket</strong>
            <small>School Actions</small>
          </span>
        </a>
        <div className={`agent-status ${webMcpSupported ? "is-ready" : "is-manual"}`}>
          <span aria-hidden="true" />
          {webMcpSupported ? "Agent tools ready" : "Manual demo mode"}
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Experimental WebMCP prototype</p>
            <h1 id="page-title">Turn school admin into one calm next step.</h1>
            <p className="hero-intro">
              Your assistant can find what needs attention and prepare the response. You stay in
              control: review, edit and submit it yourself.
            </p>
            <div className="trust-row" aria-label="Demo boundaries">
              <span>Fictional children</span>
              <span>Simulated actions</span>
              <span>No external submission</span>
            </div>
          </div>
          <aside className="prompt-card" aria-label="Suggested agent prompt">
            <span className="prompt-icon" aria-hidden="true">✦</span>
            <p>Try asking your assistant:</p>
            <blockquote>“What must I do for both children before Friday?”</blockquote>
            <small>Demo week ends Friday, 4 September 2026.</small>
          </aside>
        </section>

        <section className="summary-strip" aria-label="School action summary">
          <div>
            <span>Due this week</span>
            <strong>{dueThisWeek.length}</strong>
          </div>
          <div>
            <span>Ready for review</span>
            <strong>{state.actions.filter((action) => action.status === "prepared").length}</strong>
          </div>
          <div>
            <span>Submitted</span>
            <strong>{submittedCount}</strong>
          </div>
          <button className="text-button" type="button" onClick={resetDemo}>Reset demo</button>
        </section>

        {toast && (
          <div className="toast" role="status">
            <span>{toast}</span>
            <button type="button" onClick={() => setToast("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        <section className="workspace-layout" id="action-workspace">
          <div className="actions-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">This week</p>
                <h2>School actions</h2>
              </div>
              <span>{state.actions.length} fictional items</span>
            </div>

            <div className="action-list">
              {state.actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={`action-card ${selected?.id === action.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedId(action.id)}
                  aria-pressed={selected?.id === action.id}
                >
                  <div className="action-card-topline">
                    <span className={`child-avatar child-${action.child.toLowerCase()}`} aria-hidden="true">
                      {action.child[0]}
                    </span>
                    <span className="action-child">{action.child}</span>
                    <span className={`status-pill status-${action.status}`}>{statusLabel(action.status)}</span>
                  </div>
                  <h3>{action.title}</h3>
                  <p>{action.summary}</p>
                  <div className="action-meta">
                    <span>Due {formatDate(action.dueDate)}</span>
                    <span>{action.requirements.length} steps</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <article className="detail-panel" aria-labelledby="selected-action-title">
              <div className="detail-header">
                <div>
                  <p className="eyebrow">{selected.child} · Due {formatDate(selected.dueDate)}</p>
                  <h2 id="selected-action-title">{selected.title}</h2>
                </div>
                <span className={`status-pill status-${selected.status}`}>{statusLabel(selected.status)}</span>
              </div>

              <div className="notice-card">
                <span className="notice-label">Fictional school notice</span>
                <p>{selected.noticeText}</p>
              </div>

              <div className="requirements">
                <h3>What is needed</h3>
                <ul>
                  {selected.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                </ul>
              </div>

              <form onSubmit={submitAction} className="response-form">
                <fieldset disabled={selected.status === "submitted"}>
                  <legend>Your response</legend>
                  <div className="choice-grid">
                    {responseOptions(selected).map((option) => (
                      <label key={option.value} className="choice-card">
                        <input
                          type="radio"
                          name={`response-${selected.id}`}
                          value={option.value}
                          checked={selected.draft.response === option.value}
                          onChange={(event) => updateDraft({ response: event.target.value as ResponseChoice })}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {selected.kind === "permission" && (
                    <label className="field-label">
                      Emergency contact number <span>Required</span>
                      <input
                        type="tel"
                        value={selected.draft.emergencyContact}
                        onChange={(event) => updateDraft({ emergencyContact: event.target.value })}
                        placeholder="e.g. 082 000 0000"
                        autoComplete="off"
                        required
                      />
                    </label>
                  )}

                  <label className="field-label">
                    Note to the school <span>Optional</span>
                    <textarea
                      value={selected.draft.note}
                      onChange={(event) => updateDraft({ note: event.target.value })}
                      placeholder="Add a fictional note for this demonstration"
                      rows={3}
                    />
                  </label>
                </fieldset>

                <div className="submit-boundary">
                  <div>
                    <strong>Only you can submit</strong>
                    <span>The agent can prepare this form, but this final action stays with the parent.</span>
                  </div>
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={selected.status === "submitted" || !isDraftComplete(selected)}
                  >
                    {selected.status === "submitted" ? "Submitted" : "Review complete — submit"}
                  </button>
                </div>
              </form>
            </article>
          )}
        </section>

        <section className="audit-section" aria-labelledby="audit-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Clear accountability</p>
              <h2 id="audit-title">Activity history</h2>
            </div>
          </div>
          {state.audit.length === 0 ? (
            <div className="empty-audit">
              <span aria-hidden="true">◎</span>
              <p>No activity yet. Ask the agent to prepare an action or complete one manually.</p>
            </div>
          ) : (
            <ol className="audit-list">
              {state.audit.map((entry) => {
                const action = state.actions.find((item) => item.id === entry.actionId);
                return (
                  <li key={entry.id}>
                    <span className={`audit-actor actor-${entry.actor.toLowerCase()}`}>{entry.actor}</span>
                    <div>
                      <strong>{action?.title ?? entry.actionId}</strong>
                      <p>{entry.detail}</p>
                      <time dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleString("en-ZA")}</time>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </main>

      <footer>
        <p><strong>Competition prototype.</strong> All people, notices and submissions are fictional.</p>
        <p>No school, payment or calendar system is connected.</p>
      </footer>
    </div>
  );
}
