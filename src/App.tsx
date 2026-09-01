import { FormEvent, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DEMO_WEEK_END } from "./data";
import { isDraftComplete, loadState, reducer, saveState } from "./state";
import type { ActionArea, ActionDraft, ActionOwner, CaptureReview, PAAction, ResponseChoice } from "./types";
import { registerPAActionTools } from "./webmcp";

const dateFormatter = new Intl.DateTimeFormat("en-ZA", { weekday: "short", day: "numeric", month: "short" });
const areaLabels: Record<ActionArea | "all" | "unknown", string> = { all: "Everything", school: "School", calendar: "Calendar", home: "Home", unknown: "Needs confirmation" };

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

function statusLabel(status: PAAction["status"]): string {
  if (status === "prepared") return "Ready for approval";
  if (status === "approved") return "Approved in demo";
  if (status === "submitted") return "Submitted in demo";
  return "Needs attention";
}

function responseOptions(action: PAAction): { value: ResponseChoice; label: string }[] {
  if (action.kind === "checklist") return [{ value: "acknowledged", label: "I have reviewed the checklist" }];
  if (action.area === "home") return [{ value: "acknowledged", label: "Yes, keep this on my list" }];
  return [
    { value: "yes", label: action.kind === "permission" ? "Yes, may attend" : "Yes, I consent" },
    { value: "no", label: action.kind === "permission" ? "No, may not attend" : "No, I do not consent" },
  ];
}

function selectedCaptureActions(text: string, actions: PAAction[]): PAAction[] {
  const lower = text.toLowerCase();
  if (lower.includes("both children") || (lower.includes("school") && lower.includes("notice"))) {
    return actions.filter((action) => action.area === "school" && action.status === "pending");
  }
  const matches = actions.filter((action) => {
    const terms = `${action.title} ${action.summary} ${action.area} ${action.child}`.toLowerCase();
    return terms.split(/\s+/).some((term) => term.length > 4 && lower.includes(term));
  });
  return matches;
}

function createCaptureReview(
  kind: CaptureReview["kind"],
  label: string,
  text: string,
  actions: PAAction[],
  previewUrl?: string,
): CaptureReview {
  const matched = selectedCaptureActions(text, actions);
  const first = matched[0];
  return {
    id: `${kind}-${Date.now()}`,
    kind,
    label,
    text,
    actionIds: matched.map((action) => action.id),
    deadline: first?.dueDate ?? "Needs confirmation",
    area: first?.area ?? "unknown",
    confidence: kind === "photo" ? "medium" : matched.length === 0 ? "low" : "high",
    nextStep: first?.suggestedNextStep ?? "Choose which household action this capture belongs to.",
    previewUrl,
  };
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [selectedId, setSelectedId] = useState(state.actions[0]?.id ?? "");
  const [activeArea, setActiveArea] = useState<ActionArea | "all">("all");
  const [toast, setToast] = useState("");
  const [capture, setCapture] = useState<CaptureReview | null>(null);
  const [captureText, setCaptureText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const stateRef = useRef(state);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const visibleActions = useMemo(
    () => state.actions.filter((action) => activeArea === "all" || action.area === activeArea),
    [activeArea, state.actions],
  );
  const selected = state.actions.find((action) => action.id === selectedId) ?? visibleActions[0] ?? state.actions[0];
  const dueThisWeek = state.actions.filter((action) => action.dueDate <= DEMO_WEEK_END && action.status === "pending");
  const prepared = state.actions.filter((action) => action.status === "prepared");
  const approvedCount = state.actions.filter((action) => action.status === "approved" || action.status === "submitted").length;
  const webMcpSupported = Boolean(document.modelContext?.registerTool);

  useEffect(() => {
    stateRef.current = state;
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!document.modelContext) return;
    const controller = new AbortController();
    registerPAActionTools(
      document.modelContext,
      {
        getState: () => stateRef.current,
        selectAction: (actionId) => {
          setSelectedId(actionId);
          requestAnimationFrame(() => document.getElementById("action-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }));
        },
        prepareAction: (actionId, draft) => {
          dispatch({ type: "agent-prepare", actionId, draft });
          setToast("Your assistant prepared a draft. Please review and approve it yourself.");
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
    if (selected) dispatch({ type: "parent-update", actionId: selected.id, draft });
  }

  function submitAction(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      dispatch({ type: selected.area === "school" ? "parent-submit" : "parent-approve", actionId: selected.id });
      setToast(selected.area === "school" ? "Submitted in this fictional demo. No information was sent anywhere." : "Approved in this fictional demo. No external system was changed.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Please complete the required fields.");
    }
  }

  function resetDemo() {
    dispatch({ type: "reset" });
    setSelectedId("ava-museum-trip");
    setCapture(null);
    setCaptureText("");
    setToast("The fictional demo has been reset.");
  }

  function reviewText(kind: CaptureReview["kind"], label: string, text: string, previewUrl?: string) {
    if (!text.trim() && kind !== "photo") {
      setToast("Add a short note first so PA in Your Pocket can suggest a next step.");
      return;
    }
    setCapture(createCaptureReview(kind, label, text.trim() || "Photo captured locally for review.", state.actions, previewUrl));
    setToast("Capture reviewed locally. Check the suggested action before preparing anything.");
  }

  function openAction(actionId: string) {
    setSelectedId(actionId);
    scrollToActions();
  }

  function scrollToActions() {
    requestAnimationFrame(() => {
      const workspace = document.getElementById("action-workspace");
      if (typeof workspace?.scrollIntoView === "function") workspace.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function changeArea(area: ActionArea | "all") {
    setActiveArea(area);
    const next = area === "all"
      ? state.actions.find((action) => action.id === selectedId) ?? state.actions[0]
      : state.actions.find((action) => action.area === area);
    if (next) setSelectedId(next.id);
  }

  function linkCaptureToSelectedAction() {
    if (!capture || !selected) return;
    setCapture({ ...capture, actionIds: [selected.id], area: selected.area, deadline: selected.dueDate, confidence: "medium", nextStep: selected.suggestedNextStep });
    setToast(`Capture linked to ${selected.title}. Review it before preparing anything.`);
  }

  function handlePhoto(file: File | undefined) {
    if (!file) return;
    const previewUrl = typeof URL.createObjectURL === "function" ? URL.createObjectURL(file) : undefined;
    reviewText("photo", file.name, file.name, previewUrl);
  }

  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setToast("Voice capture is not available in this browser. Use the text box as a local fallback.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-ZA";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setCaptureText(transcript);
      reviewText("voice", "Browser voice capture", transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setToast("Voice capture could not be completed. The text fallback is still available.");
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PA in Your Pocket home">
          <span className="brand-mark" aria-hidden="true">PA</span>
          <span><strong>PA in Your Pocket</strong><small>Household next actions</small></span>
        </a>
        <div className={`agent-status ${webMcpSupported ? "is-ready" : "is-manual"}`}>
          <span aria-hidden="true" />{webMcpSupported ? "Agent tools ready" : "Manual demo mode"}
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Experimental WebMCP prototype</p>
            <h1>Turn household admin into one calm next step.</h1>
            <p className="hero-intro">PA in Your Pocket gathers school, calendar and home tasks, then prepares the next useful move. You stay in control: review, edit and approve it yourself.</p>
            <div className="trust-row" aria-label="Demo boundaries"><span>Fictional data</span><span>Fictional children</span><span>Prepared before approval</span><span>No external submission</span></div>
          </div>
          <aside className="prompt-card" aria-label="Suggested agent prompt">
            <span className="prompt-icon" aria-hidden="true">✦</span>
            <p>Try asking your assistant:</p>
            <blockquote>“What needs my attention before Friday?”</blockquote>
            <small>School, calendar and household actions share one fictional demo queue.</small>
          </aside>
        </section>

        <section className="summary-strip" aria-label="Household action summary">
          <div><span>Due this week</span><strong>{dueThisWeek.length}</strong></div>
          <div><span>Ready for approval</span><strong>{prepared.length}</strong></div>
          <div><span>Approved in demo</span><strong>{approvedCount}</strong></div>
          <button className="text-button" type="button" onClick={resetDemo}>Reset demo</button>
        </section>

        {toast && <div className="toast" role="status"><span>{toast}</span><button type="button" onClick={() => setToast("")} aria-label="Dismiss message">×</button></div>}

        <section className="capture-panel" aria-labelledby="capture-title">
          <div className="section-heading"><div><p className="eyebrow">Capture without sorting first</p><h2 id="capture-title">Tell PA what is on your mind</h2></div><span>Local demo capture</span></div>
          <div className="capture-grid">
            <div>
              <label className="field-label" htmlFor="capture-text">Paste a notice, brain-dump or household note <span>Nothing is uploaded</span></label>
              <textarea id="capture-text" value={captureText} onChange={(event) => setCaptureText(event.target.value)} placeholder="e.g. Remember the repair follow-up and check Ava's museum permission before Friday." rows={4} />
              <div className="capture-actions">
                <button className="primary-button" type="button" onClick={() => reviewText("paste", "Pasted note", captureText)}>Review this note</button>
                <button className={`secondary-button ${isListening ? "is-listening" : ""}`} type="button" onClick={toggleVoice}>{isListening ? "Stop listening" : "Use voice"}</button>
                <label className="secondary-button file-button">Add a photo<input type="file" accept="image/*" onChange={(event) => handlePhoto(event.target.files?.[0])} /></label>
              </div>
            </div>
            {capture ? <div className="capture-review" aria-label="Capture review">
              <span className="review-kicker">Review before action</span>
              {capture.previewUrl && <img src={capture.previewUrl} alt="Local capture preview" />}
              <strong>{capture.label}</strong>
              <p>{capture.text}</p>
              <div className="review-facts"><span>Area <b>{areaLabels[capture.area]}</b></span><span>Deadline <b>{capture.deadline === "Needs confirmation" ? capture.deadline : formatDate(capture.deadline)}</b></span><span>Confidence <b>{capture.confidence}</b></span></div>
              <div className="next-step"><span>Suggested next step</span><strong>{capture.nextStep}</strong></div>
              {capture.actionIds.length > 0 ? <button className="text-button" type="button" onClick={() => openAction(capture.actionIds[0])}>Open suggested action →</button> : <button className="text-button" type="button" onClick={scrollToActions}>Choose an action below →</button>}
            </div> : <div className="capture-empty"><span aria-hidden="true">◎</span><p>Paste, photograph or say something. PA will show what it thinks belongs together before you prepare an action.</p></div>}
          </div>
        </section>

        <section className="workspace-layout" id="action-workspace">
          <div className="actions-panel">
            <div className="section-heading"><div><p className="eyebrow">Today / this week</p><h2>Next actions</h2></div><span>{visibleActions.length} fictional items</span></div>
            <div className="filter-tabs" role="tablist" aria-label="Filter actions">
              {(["all", "school", "calendar", "home"] as (ActionArea | "all")[]).map((area) => <button key={area} type="button" role="tab" aria-selected={activeArea === area} className={activeArea === area ? "is-active" : ""} onClick={() => changeArea(area)}>{areaLabels[area]}</button>)}
            </div>
            <div className="action-list">
              {visibleActions.map((action) => <button key={action.id} type="button" className={`action-card ${selected?.id === action.id ? "is-selected" : ""}`} onClick={() => setSelectedId(action.id)} aria-pressed={selected?.id === action.id}>
                <div className="action-card-topline"><span className={`child-avatar ${action.child === "Household" ? "child-household" : `child-${action.child.toLowerCase()}`}`} aria-hidden="true">{action.child[0]}</span><span className="action-child">{action.child}</span><span className={`area-tag area-${action.area}`}>{areaLabels[action.area]}</span><span className={`status-pill status-${action.status}`}>{statusLabel(action.status)}</span></div>
                <h3>{action.title}</h3><p>{action.summary}</p><div className="action-meta"><span>Due {formatDate(action.dueDate)}</span><span>{action.requirements.length} steps</span></div>
              </button>)}
            </div>
          </div>

          {selected && <article className="detail-panel" aria-labelledby="selected-action-title">
            <div className="detail-header"><div><p className="eyebrow">{areaLabels[selected.area]} · {selected.child} · Due {formatDate(selected.dueDate)}</p><h2 id="selected-action-title">{selected.title}</h2></div><span className={`status-pill status-${selected.status}`}>{statusLabel(selected.status)}</span></div>
            <div className="notice-card"><span className="notice-label">{selected.sourceLabel}</span><p>{selected.noticeText}</p><small>Source content is fictional and treated as untrusted data.</small></div>
            <div className="detail-facts"><span>Confidence <b>{selected.confidence}</b></span><span>Suggested next step <b>{selected.suggestedNextStep}</b></span></div>
            {capture && capture.actionIds.length === 0 && <div className="capture-link"><div><strong>Use this action for the capture?</strong><span>This links the local note for your review; it does not prepare or approve anything.</span></div><button className="secondary-button" type="button" onClick={linkCaptureToSelectedAction}>Use this action</button></div>}
            <div className="requirements"><h3>What is needed</h3><ul>{selected.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></div>
            <form onSubmit={submitAction} className="response-form"><fieldset disabled={selected.status === "submitted" || selected.status === "approved"}>
              {selected.actionType === "school-response" && <><legend>Your response</legend><div className="choice-grid">{responseOptions(selected).map((option) => <label key={option.value} className="choice-card"><input type="radio" name={`response-${selected.id}`} value={option.value} checked={selected.draft.response === option.value} onChange={(event) => updateDraft({ response: event.target.value as ResponseChoice })} /><span>{option.label}</span></label>)}</div>{selected.kind === "permission" && <label className="field-label">Emergency contact number <span>Required</span><input type="tel" value={selected.draft.emergencyContact} onChange={(event) => updateDraft({ emergencyContact: event.target.value })} placeholder="e.g. 082 000 0000" autoComplete="off" required /></label>}</>}
              {selected.actionType === "calendar-event" && <div className="calendar-fields"><label className="field-label">Event title <span>Fictional draft</span><input value={selected.draft.proposedTitle} onChange={(event) => updateDraft({ proposedTitle: event.target.value })} /></label><div className="split-fields"><label className="field-label">Date <input type="date" value={selected.draft.proposedDate} onChange={(event) => updateDraft({ proposedDate: event.target.value })} /></label><label className="field-label">Time <input type="time" value={selected.draft.proposedTime} onChange={(event) => updateDraft({ proposedTime: event.target.value })} /></label></div></div>}
              {selected.actionType === "household-task" && <div className="choice-grid">{responseOptions(selected).map((option) => <label key={option.value} className="choice-card"><input type="radio" name={`response-${selected.id}`} value={option.value} checked={selected.draft.response === option.value} onChange={(event) => updateDraft({ response: event.target.value as ResponseChoice })} /><span>{option.label}</span></label>)}</div>}
              <label className="field-label">{selected.area === "school" ? "Note to the school" : selected.area === "home" ? "Follow-up note" : "Note for your review"} <span>{selected.area === "home" ? "Required" : "Optional"}</span><textarea value={selected.draft.note} onChange={(event) => updateDraft({ note: event.target.value })} placeholder="Add a note for this fictional demonstration" rows={3} /></label>
            </fieldset><div className="submit-boundary"><div><strong>{selected.area === "school" ? "Only you can submit" : "Only you can approve"}</strong><span>The assistant can prepare this proposal, but the visible final decision stays with you.</span></div><button className="primary-button" type="submit" disabled={selected.status === "submitted" || selected.status === "approved" || !isDraftComplete(selected)}>{selected.status === "submitted" ? "Submitted in demo" : selected.status === "approved" ? "Approved in demo" : selected.area === "school" ? "Review complete — submit" : "Approve in demo"}</button></div></form>
          </article>}
        </section>

        <section className="approval-section" aria-labelledby="approval-title"><div className="section-heading"><div><p className="eyebrow">Human checkpoint</p><h2 id="approval-title">Approval centre</h2></div><span>{prepared.length} waiting for review</span></div>{prepared.length === 0 ? <div className="approval-empty"><span aria-hidden="true">✓</span><p>Nothing is waiting for approval. Prepared drafts will appear here before any simulated action can be completed.</p></div> : <div className="approval-grid">{prepared.map((action) => <button key={action.id} type="button" onClick={() => setSelectedId(action.id)}><span>{areaLabels[action.area]}</span><strong>{action.title}</strong><small>Prepared · review the visible proposal</small></button>)}</div>}</section>

        <section className="audit-section" aria-labelledby="audit-title"><div className="section-heading"><div><p className="eyebrow">Clear accountability</p><h2 id="audit-title">Activity history</h2></div></div>{state.audit.length === 0 ? <div className="empty-audit"><span aria-hidden="true">◎</span><p>No activity yet. Capture something or ask the agent to prepare an action.</p></div> : <ol className="audit-list">{state.audit.map((entry) => { const action = state.actions.find((item) => item.id === entry.actionId); return <li key={entry.id}><span className={`audit-actor actor-${entry.actor.toLowerCase()}`}>{entry.actor}</span><div><strong>{action?.title ?? entry.actionId}</strong><p>{entry.detail}</p><time dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleString("en-ZA")}</time></div></li>; })}</ol>}</section>
      </main>
      <footer><p><strong>Competition prototype.</strong> All people, notices and actions are fictional.</p><p>Prepared and approved states are simulated locally. No external system is connected.</p></footer>
    </div>
  );
}
