//@name flashback_hayaku_bridge
//@display-name RE:TRACE
//@api 3.0
//@version 1.9.48
/* v1.9.48 bounds RisuAI current-context calls, defers optional HAYAKU auto-repair discovery until after UI registration, renders transition data before the secondary compatibility sweep finishes, and uses manifest-local owner summaries with Storage SDK v1.8.5 route pre-resolution. */
/* v1.9.45 removes retired GRADIA compatibility completely. RE:TRACE now negotiates, inspects, hands off, verifies, diagnoses, and manages Memory Suite scopes only for FLASHBACK, HAYAKU, LIBRA, and LIA peers; GRADIA IPC/channels, handoff receipts, transition-journal fields, server-scope scanners, UI/debug surfaces, and owner-delete routes are removed. Existing GRADIA server files are never deleted or migrated. */
/* v1.9.43 adds an owner-gated optional automatic HAYAKU repair worker. It reacts to durable Recovery Vault debt events, leases exact worldline variants, disables source-fallback packets in automatic mode, suspends and reuses a verified candidate across first-observation rollback quarantine, and requires HAYAKU owner-side target/adoption readback before completion. HAYAKU-related analysis, viewing, handoff, backup, compatibility fallback, and server-scope scans remain completely inactive when a live authenticated HAYAKU owner is absent. */
/* v1.9.42 adds a non-destructive canonical identity layer to Memory Suite scope discovery: RisuAI chaId/chat.id aliases are retained alongside legacy physical scope IDs so owner scope matching and diagnostics can converge without rewriting peer storage keys. */
/* v1.9.41 adds suite-wide Memory Suite server diagnostics to the RE:TRACE debug export. RE:TRACE retrieves the privacy-scrubbed event journal and integrity state for all five active namespaces through the manager-only endpoint, while falling back to its own namespace/offline snapshot if the manager endpoint is unavailable. */
/* v1.9.40 makes RE:TRACE's own recovery/cold-start storage mode independent per chat scope and updates owner deletion/handoff proof to change only the target scope. Peer server inspection remains read-only and can never overwrite another plugin's routing policy. */
/* v1.9.39 adds shared Memory Suite background synchronization telemetry to RE:TRACE server connection. Initial seeding, mirror sync, and restore expose live phase/count/bytes/timing/retry diagnostics and continue after the panel closes without changing server-scope management, next-session handoff, or source-immutability rules. */
/* v1.9.38 adds a dedicated 서버 연결 side-panel page separate from Server Data Management. It exposes RE:TRACE storage mode, loopback URL editing, connection testing, server/protocol status, synchronization, recovery, and guarded pluginStorage deletion while preserving next-session handoff and scope-management behavior. */
/* v1.9.37 adds Server Data Management with explicit active, referenced-ancestor, orphan-candidate and unverified scope states. RE:TRACE derives a conservative scope index from all six Memory Suite namespaces, never auto-deletes missing-chat data, requires stable host inventory and owner proof, creates a server backup, and uses a two-step conditional deletion plan. */
//@allowed-ipc libra
//@allowed-ipc flashback_memory
//@allowed-ipc hayaku_locator_continuity
//@allowed-ipc lia_persona_linker
//@update-url https://raw.githubusercontent.com/rusinus12-droid/RETRACE/refs/heads/main/RETRACE.js
//@arg memory_suite_server_mode string Legacy 0.2.6 migration only; current scope modes are stored in the routing registry
//@arg memory_suite_server_url string Memory Suite server URL; blank uses http://127.0.0.1:47630
//@arg retrace_hayaku_auto_repair string true|false; optional automatic LLM repair for HAYAKU Recovery Vault debt; blank uses false
//@description LIBRA, HAYAKU, Flashback, and LIA Live Persona continuity analysis and next-session handoff bridge
//@author Hayaku

/* v1.9.37 adds Memory Suite serverization to RE:TRACE itself and makes next-session handoff server-aware. RE:TRACE durable recovery/cold-start/backup records can use plugin-only, mirror, or server-only storage; server-side Flashback/HAYAKU data is available to read-only fallback inspection when pluginStorage was intentionally cleared; LIBRA/LIA server presence is surfaced even when owner IPC is unavailable; and patched owner handoff receipts prove Memory Suite mirror/server synchronization before and after prepare/adopt/verify without weakening immutable-source safeguards. */
/* v1.9.35 fixes RE:TRACE runtime version reporting and hardens current-chat resolution against RisuAI's transient chat selection race. getCurrentChatIndex() may briefly throw while the host's character/chat page is switching; RE:TRACE now treats that as a soft host-context miss, falls back to the already-read character.chatPage when valid, retries the indexed resolver with short bounded delays, and only fails after both indexed and direct context paths are unavailable. This prevents the compatibility/transition panel from showing Cannot read properties of undefined (reading 'chatPage') while preserving exact character/chat identity checks before handoff writes. */
/* v1.9.34 gives GRADIA next-session owner handoff storage-safe IPC budgets instead of the old 6s prepare/verify ceiling: prepare/adopt now allow up to 90s and verify up to 60s, the GRADIA IPC transport cap is raised to 120s, and owner-side rejected receipts are no longer redundantly retried through the shared-runtime fallback. This prevents a healthy but storage-busy GRADIA prepare_session_handoff from aborting before target chat creation while preserving fail-closed receipt validation. */
/* v1.9.33 hardens LIBRA handoff error handling: remote owner rejections such as SOURCE_MUTATION_DETECTED are no longer retried through the same runtime API, while genuine IPC transport failures may still fall back. LIBRA IPC remote error codes are preserved when available so diagnostics distinguish transport failure from owner-side fail-closed safety checks. */
/* v1.9.32 makes FLASHBACK summary inspection fail-fast instead of waiting 8 seconds on every RE:TRACE refresh: summary IPC now uses a short timeout, concurrent summary reads share one in-flight request, a one-minute circuit breaker skips repeated stalled inspect calls and goes straight to the already-supported pluginStorage summary, expected summary timeouts are recorded in the debug export without noisy repeated console warnings, and any successful FLASHBACK inspect closes the circuit immediately. Full-record and handoff mutation timeouts remain unchanged. */
/* v1.9.31 fixes the in-panel confirmation regression introduced by v1.9.30: setBusy(true) no longer disables the RE:TRACE dialog confirm/cancel controls, and showRetraceDialog() force-enables its own controls before display so '승계 시작' remains clickable while background actions stay locked. */
/* v1.9.30 removes native window.confirm/window.alert dependencies from RE:TRACE UI actions and replaces them with an in-panel DOM dialog, preventing Tauri dialog IPC from being blocked by about:srcdoc CSP before continueToNextSession() can run. It also classifies already-materialized HAYAKU recovery_snapshot slot heads even after the RE:TRACE recovery capsule has been consumed, so a 9 current + 4 recovery ledger is displayed and handed off as Total 13 / Current 9 / Recovery 4 instead of Total 13 / Current 13 / Recovery 0. */
/* v1.9.29 reconciles stale HAYAKU handoff journals against the already-verified target pluginStorage archive before retrying owner IPC, so a target that HAYAKU has durably adopted is no longer reported forever as an unverified owner. It also adds a privacy-scrubbed RE:TRACE debug-log exporter to the top bar; the export is read-only, redacts credentials, omits raw chat/memory bodies, and includes current handoff journal, owner counts, HAYAKU durable readback, IPC health, compatibility state, and recent warnings. */
/* v1.9.28 makes RE:TRACE account for its own HAYAKU incremental-recovery capsules as first-class recovery_snapshot memory in both the read-only HAYAKU viewer and next-session handoff planning. Recovery adoption is now verified from durable packet bodies/turn coverage instead of trusting lastRecoveryId alone; viewer accounting shows Current/Recovery/Archive separately and can project any verified-but-not-yet-materialized recovery packets read-only; transition expectedRecords includes missing recovery capsule entries without mutating the source session, so HAYAKU owner handoff can archive the full current+recovery set and verify the exact total. */
/* v1.9.27 removes the user-facing '필수/비필수' labels from the compatibility panel. Participation-aware safety checks remain internal: the panel now describes only connection/compatibility state, so optional plugin absence is not visually misread as a global installation requirement. */
/* v1.9.26 fixes false HAYAKU '필수 누락' states: compatibility checks now bypass stale IPC cooldowns on retry, distinguish ledger-detected installation from an actually missing plugin, consume HAYAKU's shared compatibility beacon when available, and optionally verify enabled plugin metadata/source markers when the owner channel is temporarily unreachable. Required handoff still remains fail-closed until the live HAYAKU owner IPC answers. */
/* v1.9.25 added a shared-runtime HAYAKU compatibility fallback after plugin-channel capability IPC failure. That fallback helps legacy/shared-realm hosts but API-v3 iframe isolation means it cannot by itself prove another plugin's runtime on normal isolated hosts; v1.9.26 supersedes that limitation with retry, storage-beacon, and installed-metadata diagnostics.
 * v1.9.24 hardens WebRisu provider credential persistence without changing handoff behavior: the RE:TRACE provider profile remains durably stored in pluginStorage and is additionally mirrored to localPluginStorage/safeLocalStorage when available, every save is read back and verified, startup reconciles the newest verified copy into a missing backend, and explicit key clearing writes a newer empty state so stale local backups cannot resurrect a deleted credential.
 * v1.9.23 changes compatibility gating from installed-peer strictness to active-handoff participation: an installed but unused/inactive peer with a missing or outdated compatibility contract is shown as a non-blocking warning, while only peers whose data/state is actually required for this transition can block next-session creation. Missing optional peers remain neutral, warning acknowledgement never bypasses a required-owner block, and the home compatibility panel now distinguishes handoff-safe optional warnings from blocking incompatibilities.
 * v1.9.22 establishes RE:TRACE as the six-plugin compatibility hub. Flashback, HAYAKU, LIBRA, GRADIA, and LIA are discovered through retrace.peer_compatibility.v1 capability contracts rather than exact plugin versions; next-session handoff is blocked unless every installed/required peer advertises immutable-source, durable-readback, idempotent inheritance and returns a matching source-preservation receipt; the session home shows a live compatibility matrix and explicit warning acknowledgement; and future peer version bumps remain compatible as long as the protocol major, stable plugin ID, handoff contract, receipt schema, and required capabilities remain compatible.
 * v1.9.21 makes Flashback next-session handoff fail-closed and source-preserving: RE:TRACE now requires the Flashback v0.11.3+ immutable-source contract before any owner mutation, snapshots the source manifest/shards/worldline before target creation and re-verifies them after adoption, accepts only v4 preservation receipts, rejects legacy compacted source scopes until restored, and writes a v2 bridge marker that explicitly forbids source mutation/compaction.
 * v1.9.20 fixes long-session owner handoff completion after the LIBRA compatibility patch: Flashback IPC summary/adoption calls now have storage-safe timeouts instead of the old 1.8s/3s ceiling, a timed-out mutation is reconciled against the target Flashback manifest before being declared failed, summary reads can bypass a known-stalled IPC path and use the already-supported pluginStorage archive summary, and incomplete transition results now record the exact failing owner diagnostics.
 * v1.9.19 restores current LIBRA next-session handoff compatibility: canonical-only LIBRA receipts no longer require the retired World Additional counters, transition consistency uses a canonical-memory fingerprint that is stable across archive preparation metadata writes, LIBRA owner IPC handoff operations receive long-storage-safe timeouts, and newly-created target chats get a bounded activation-settle window before owner adoption.
 * v1.9.18 keeps RE:TRACE compatible with the storage-tier builds: the ordinary Flashback/HAYAKU viewers now page only the newest records without hydrating every historical archive layer, pluginStorage fallbacks can decode the immutable gzip archive wrappers, LIBRA/GRADIA handoff receipts are cross-checked against the prepared archive identity/digest, and summary-only runtime fallbacks remain summary-only.
 * v1.9.17 coordinates immutable shared-archive handoff for Flashback, HAYAKU,
 * LIBRA, and GRADIA Narrative Archive, and uses summary-only transition probes
 * so next-session validation checks archive ID/digest metadata without hydrating historical memory bodies, packet JSON, or vectors. */

(async () => {
  'use strict';

/* MEMORY SUITE STORAGE SDK v1.8.5
 * Scope-routed durable storage client shared by Flashback, HAYAKU, LIBRA, LIA and RE:TRACE.
 * The server stores opaque values. Each plugin keeps ownership of its own data schema.
 */
const createMemorySuiteStorageBridge = (rawOptions = {}) => {
  const options = rawOptions && typeof rawOptions === 'object' ? rawOptions : {};
  const namespace = String(options.namespace || '').trim().toLowerCase();
  const pluginId = String(options.pluginId || namespace || 'plugin').trim();
  const pluginVersion = String(options.pluginVersion || '').trim();
  const defaultUrl = String(options.defaultUrl || 'http://127.0.0.1:47630').replace(/\/+$/, '');
  const pluginPrefixes = Array.isArray(options.pluginPrefixes) ? options.pluginPrefixes.map(String) : [];
  const pluginKeys = new Set(Array.isArray(options.pluginKeys) ? options.pluginKeys.map(String) : []);
  const localPrefixes = Array.isArray(options.localPrefixes) ? options.localPrefixes.map(String) : [];
  const localKeys = new Set(Array.isArray(options.localKeys) ? options.localKeys.map(String) : []);
  const excludedKeys = new Set(Array.isArray(options.excludedKeys) ? options.excludedKeys.map(value => String(value).toLowerCase()) : []);
  const excludedPrefixes = Array.isArray(options.excludedPrefixes) ? options.excludedPrefixes.map(value => String(value).toLowerCase()) : [];
  const excludedContains = Array.isArray(options.excludedContains) ? options.excludedContains.map(value => String(value).toLowerCase()).filter(Boolean) : [];
  const modeArguments = [...new Set(['memory_suite_server_mode', ...(Array.isArray(options.modeArguments) ? options.modeArguments : [])].map(String))];
  const urlArguments = [...new Set(['memory_suite_server_url', ...(Array.isArray(options.urlArguments) ? options.urlArguments : [])].map(String))];
  const requiredCapabilities = ['kv.v1', 'keys.v1', 'revision.v1', 'digest.v1', 'idempotency.v1', 'tombstone.v1', 'readback.v1', 'namespace-integrity.v1'];
  const MODE_PLUGIN_ONLY = 'plugin_only';
  const MODE_MIRROR = 'mirror';
  const MODE_SERVER_ONLY = 'server_only';
  const VALID_MODES = new Set([MODE_PLUGIN_ONLY, MODE_MIRROR, MODE_SERVER_ONLY]);
  const displayName = String(options.displayName || pluginId || namespace || 'Plugin').trim();
  const managementButtonEnabled = options.managementButton !== false;
  const requestTimeoutMs = Math.max(5000, Math.min(120000, Number(options.requestTimeoutMs || 30000) || 30000));
  // Bootstrap is only a reachability/contract probe.  Keeping its deadline
  // separate prevents an offline loopback endpoint (or an HTML error page from
  // a browser interceptor) from blocking each plugin's local pluginStorage
  // startup for the full data-request timeout.
  const bootstrapRequestTimeoutMs = Math.max(750, Math.min(5000, Number(options.bootstrapRequestTimeoutMs || 1800) || 1800));
  const bootstrapFailureCacheMs = Math.max(1000, Math.min(60000, Number(options.bootstrapFailureCacheMs || 10000) || 10000));
  const configCacheMs = 30000;
  const bootstrapCacheMs = 30000;
  const sharedBootstrapFailures = (() => {
    const existing = createMemorySuiteStorageBridge.__memorySuiteBootstrapFailures;
    if (existing instanceof Map) return existing;
    const created = new Map();
    try {
      Object.defineProperty(createMemorySuiteStorageBridge, '__memorySuiteBootstrapFailures', {
        value: created, configurable: false, enumerable: false, writable: false
      });
    } catch (_) {}
    return created;
  })();
  const proxyCache = new WeakMap();
  const localProxyCache = new WeakMap();
  const migrationStateByLegacy = new WeakMap();
  const mutationTails = new Map();
  const autoMigratePlugin = options.autoMigratePlugin !== false;
  const autoMigrateLocal = options.autoMigrateLocal !== false;
  const migrationConcurrency = Math.max(1, Math.min(4, Number(options.migrationConcurrency || 2) || 2));
  const migrationRetryMs = Math.max(5000, Math.min(10 * 60 * 1000, Number(options.migrationRetryMs || 30000) || 30000));
  const currentScopeProvider = typeof options.currentScopeProvider === 'function' ? options.currentScopeProvider : null;
  const resolveKeyScopeProvider = typeof options.resolveKeyScope === 'function' ? options.resolveKeyScope : null;
  // Opt-in only: the plugin's resolver must be able to classify global/shared
  // keys and explicit scope-key records correctly when currentScope is null.
  const preResolveKeyScope = options.preResolveKeyScope === true;
  const scopeRoutingEnabled = options.scopeRouting !== false;
  const scopeCacheMs = Math.max(0, Math.min(10000, Number(options.scopeCacheMs || 0) || 0));
  const sharedRouteModeRaw = String(options.sharedRouteMode || MODE_MIRROR);
  const namespaceDelaySeed = Array.from(namespace).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const migrationDelayMs = Math.max(250, Math.min(10000, Number(options.migrationDelayMs || (700 + (namespaceDelaySeed % 7) * 240)) || 700));
  const state = {
    config: { at: 0, mode: MODE_PLUGIN_ONLY, url: defaultUrl },
    bootstrap: { at: 0, baseUrl: '', value: null, pending: null },
    status: { state: 'idle', at: 0, reason: '', serverVersion: '', url: defaultUrl, namespace },
    migration: {
      plugin: { state: 'idle', scanned: 0, migrated: 0, skipped: 0, failed: 0, at: 0, reason: '' },
      local: { state: 'idle', scanned: 0, migrated: 0, skipped: 0, failed: 0, at: 0, reason: '' }
    },
    warned: new Set(),
    legacy: { plugin: null, local: null },
    management: { registered: false, registering: false, handle: null, timer: null, root: null, lastResult: null },
    syncJob: { current: null, promise: null, retryTimer: null, persistTimer: null, loaded: false, listeners: new Set() },
    transientMode: '',
    diagnostics: { value: null, at: 0, pending: null, timer: null },
    scopeRouting: {
      current: null,
      currentAt: 0,
      registry: null,
      registryLoaded: false,
      registryLoading: null,
      transientModes: new Map(),
      routeCache: new Map(),
      lastLegacyImport: null
    }
  };
  const SYNC_JOB_SCHEMA = 'memory-suite.sync-job.v1';
  const SYNC_JOB_STORAGE_KEY = `__memory_suite_internal_sync_job_v1__:${namespace}`;
  const SYNC_JOB_RETRY_DELAYS_MS = Object.freeze([3000, 5000, 10000, 20000, 30000]);
  const SCOPE_ROUTING_SCHEMA = 'memory-suite.scope-routing.v1';
  const SCOPE_ROUTING_LOCAL_KEY = `__memory_suite_internal_scope_routes_v1__:${namespace}`;
  const SCOPE_ROUTING_SERVER_KEY = `__memory_suite_scope_routes_v1__:${namespace}`;
  const SCOPED_REMOTE_KEY_MARKER = '::memory-suite-scope:v1:';

  const safeText = value => String(value == null ? '' : value);
  const compact = (value, max = 500) => safeText(value).replace(/\s+/g, ' ').trim().slice(0, max);
  const jsonComparable = value => {
    try { return JSON.stringify(value); }
    catch (_) { return '__MEMORY_SUITE_UNSERIALIZABLE__'; }
  };
  const setStatus = (next, reason = '', extra = {}) => {
    state.status = { ...state.status, state: String(next || 'unknown'), reason: compact(reason), at: Date.now(), ...extra };
  };
  const warnOnce = (code, error) => {
    const key = String(code || 'warning');
    if (state.warned.has(key)) return;
    state.warned.add(key);
    try { console.warn(`[Memory Suite/${pluginId}] ${key}:`, error?.message || error || 'unknown'); } catch (_) {}
  };

  const storageValueBytes = value => {
    let serialized = '';
    try { serialized = JSON.stringify(value); } catch (_) { serialized = safeText(value); }
    if (serialized == null) serialized = '';
    try { if (typeof TextEncoder === 'function') return new TextEncoder().encode(String(serialized)).byteLength; } catch (_) {}
    return String(serialized).length * 2;
  };

  const syncJobTerminal = status => ['completed', 'failed', 'cancelled'].includes(String(status || ''));
  const cloneSyncJob = value => {
    if (!value || typeof value !== 'object') return null;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return { ...value }; }
  };
  const notifySyncJob = () => {
    const snapshot = cloneSyncJob(state.syncJob.current);
    for (const listener of Array.from(state.syncJob.listeners)) {
      try { listener(snapshot); } catch (_) {}
    }
  };
  const persistSyncJobNow = async () => {
    if (state.syncJob.persistTimer) { clearTimeout(state.syncJob.persistTimer); state.syncJob.persistTimer = null; }
    const legacy = state.legacy.plugin;
    const job = state.syncJob.current;
    if (!legacy || typeof legacy.setItem !== 'function' || !job) return false;
    try {
      const payload = JSON.stringify({ ...cloneSyncJob(job), persistedAt: Date.now() });
      const result = await legacy.setItem(SYNC_JOB_STORAGE_KEY, payload);
      return result !== false;
    } catch (_) { return false; }
  };
  const scheduleSyncJobPersist = (immediate = false) => {
    if (immediate) { void persistSyncJobNow(); return; }
    if (state.syncJob.persistTimer) return;
    state.syncJob.persistTimer = setTimeout(() => {
      state.syncJob.persistTimer = null;
      void persistSyncJobNow();
    }, 650);
    try { state.syncJob.persistTimer?.unref?.(); } catch (_) {}
  };
  const updateSyncJob = (patch = {}, options = {}) => {
    if (!state.syncJob.current) return null;
    const now = Date.now();
    state.syncJob.current = {
      ...state.syncJob.current,
      ...(patch && typeof patch === 'object' ? patch : {}),
      updatedAt: now,
      lastActivityAt: options.activity === false ? Number(state.syncJob.current.lastActivityAt || now) : now
    };
    scheduleSyncJobPersist(options.persist === 'immediate');
    notifySyncJob();
    return cloneSyncJob(state.syncJob.current);
  };
  const aggregateSyncJobSpaces = (spaces, completedPasses = {}) => {
    const values = [
      ...Object.values(spaces && typeof spaces === 'object' ? spaces : {}),
      ...Object.values(completedPasses && typeof completedPasses === 'object' ? completedPasses : {})
    ];
    const sum = key => values.reduce((total, row) => total + Math.max(0, Number(row?.[key] || 0) || 0), 0);
    return {
      totalItems: sum('totalItems'), processedItems: sum('processedItems'), processedBytes: sum('processedBytes'),
      transferredBytes: sum('transferredBytes'), uploaded: sum('uploaded'), restored: sum('restored'), matched: sum('matched'),
      removedByTombstone: sum('removedByTombstone'), failures: sum('failureCount'), conflicts: sum('conflictCount')
    };
  };
  const applySyncProgressToJob = progress => {
    const job = state.syncJob.current;
    if (!job || !progress || typeof progress !== 'object') return;
    const space = String(progress.space || job.currentSpace || 'plugin');
    const spaces = { ...(job.spaces || {}) };
    const completedPasses = { ...(job.completedPasses || {}) };
    const previous = spaces[space] || null;
    if (previous && Number(previous.startedAt || 0) > 0 && Number(progress.startedAt || 0) > 0
      && Number(previous.startedAt) !== Number(progress.startedAt)) {
      const prior = completedPasses[space] || {};
      completedPasses[space] = {
        totalItems: Number(prior.totalItems || 0) + Number(previous.totalItems || 0),
        processedItems: Number(prior.processedItems || 0) + Number(previous.processedItems || 0),
        processedBytes: Number(prior.processedBytes || 0) + Number(previous.processedBytes || 0),
        transferredBytes: Number(prior.transferredBytes || 0) + Number(previous.transferredBytes || 0),
        uploaded: Number(prior.uploaded || 0) + Number(previous.uploaded || 0),
        restored: Number(prior.restored || 0) + Number(previous.restored || 0),
        matched: Number(prior.matched || 0) + Number(previous.matched || 0),
        removedByTombstone: Number(prior.removedByTombstone || 0) + Number(previous.removedByTombstone || 0),
        failureCount: Number(prior.failureCount || 0) + Number(previous.failureCount || 0),
        conflictCount: Number(prior.conflictCount || 0) + Number(previous.conflictCount || 0),
        passCount: Number(prior.passCount || 0) + 1
      };
      spaces[space] = {};
    }
    spaces[space] = { ...(spaces[space] || {}), ...progress, space };
    const totals = aggregateSyncJobSpaces(spaces, completedPasses);
    updateSyncJob({
      spaces,
      completedPasses,
      ...totals,
      phase: String(progress.phase || job.phase || 'running'),
      currentSpace: space,
      currentKey: compact(progress.currentKey || '', 220),
      currentAction: String(progress.currentAction || progress.action || ''),
      status: job.status === 'paused' ? 'running' : job.status,
      message: String(progress.message || job.message || '')
    });
  };
  const subscribeSyncJob = listener => {
    if (typeof listener !== 'function') return () => {};
    state.syncJob.listeners.add(listener);
    try { listener(cloneSyncJob(state.syncJob.current)); } catch (_) {}
    return () => state.syncJob.listeners.delete(listener);
  };
  const getSyncJob = () => cloneSyncJob(state.syncJob.current);
  const loadPersistedSyncJob = async () => {
    if (state.syncJob.loaded) return getSyncJob();
    const legacy = state.legacy.plugin;
    if (!legacy || typeof legacy.getItem !== 'function') return null;
    state.syncJob.loaded = true;
    try {
      const raw = await legacy.getItem(SYNC_JOB_STORAGE_KEY);
      if (!raw) return null;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!parsed || parsed.schema !== SYNC_JOB_SCHEMA || parsed.namespace !== namespace) return null;
      const age = Date.now() - Math.max(0, Number(parsed.updatedAt || parsed.startedAt || 0) || 0);
      if (age > 24 * 60 * 60 * 1000) return null;
      if (!syncJobTerminal(parsed.status)) {
        parsed.status = 'paused';
        parsed.phase = 'resume_pending';
        parsed.message = '이전 동기화 작업을 다시 연결하고 있습니다.';
        parsed.nextRetryAt = 0;
      }
      state.syncJob.current = parsed;
      notifySyncJob();
      return getSyncJob();
    } catch (_) { return null; }
  };
  const clearPersistedSyncJob = async () => {
    const legacy = state.legacy.plugin;
    if (!legacy) return false;
    try {
      if (typeof legacy.removeItem === 'function') return (await legacy.removeItem(SYNC_JOB_STORAGE_KEY)) !== false;
      if (typeof legacy.setItem === 'function') return (await legacy.setItem(SYNC_JOB_STORAGE_KEY, null)) !== false;
    } catch (_) {}
    return false;
  };
  const retryableSyncError = error => {
    const message = String(error?.message || error || '').toLowerCase();
    const code = String(error?.code || '').toUpperCase();
    return ['TIMEOUT', 'NETWORK_ERROR', 'ECONNRESET', 'ECONNREFUSED', 'MEMORY_SUITE_SERVER_UNAVAILABLE'].includes(code)
      || /fetch|network|timeout|timed out|econn|connection|server_unavailable|bootstrap|http_50[0234]|503|socket|temporar/.test(message);
  };

  const normalizeServerAvailabilityError = error => {
    const rawMessage = compact(error?.message || error || 'memory_suite_server_unavailable', 700);
    const rawCode = String(error?.code || '').toUpperCase();
    const nativeJsonEnvelopeFailure = /expected double-quoted property name in json|unexpected token.*json|json(?:\.parse)?[^\n]*position\s+\d+/i.test(rawMessage);
    const unavailable = nativeJsonEnvelopeFailure || retryableSyncError(error)
      || ['MEMORY_SUITE_TIMEOUT', 'MEMORY_SUITE_SERVER_UNAVAILABLE'].includes(rawCode);
    if (!unavailable) return error instanceof Error ? error : new Error(rawMessage);
    const normalized = new Error('memory_suite_server_unavailable');
    normalized.code = 'MEMORY_SUITE_SERVER_UNAVAILABLE';
    normalized.retryable = true;
    return normalized;
  };

  const cachedBootstrapFailure = url => {
    const cached = sharedBootstrapFailures.get(String(url || ''));
    if (!cached) return null;
    if (Date.now() - Number(cached.at || 0) >= bootstrapFailureCacheMs) {
      sharedBootstrapFailures.delete(String(url || ''));
      return null;
    }
    const error = new Error(cached.message || 'memory_suite_server_unavailable');
    error.code = cached.code || 'MEMORY_SUITE_SERVER_UNAVAILABLE';
    error.retryable = true;
    error.cached = true;
    return error;
  };

  const apiCandidates = () => {
    const out = [];
    const add = value => {
      if (value && (typeof value === 'object' || typeof value === 'function') && !out.includes(value)) out.push(value);
    };
    try { if (typeof risuai !== 'undefined') add(risuai); } catch (_) {}
    try { if (typeof risuApi !== 'undefined') add(risuApi); } catch (_) {}
    try { if (typeof risuAPI !== 'undefined') add(risuAPI); } catch (_) {}
    try { if (typeof Risuai !== 'undefined') add(Risuai); } catch (_) {}
    try { if (typeof RisuAI !== 'undefined') add(RisuAI); } catch (_) {}
    try {
      if (typeof globalThis !== 'undefined') {
        add(globalThis.risuai);
        add(globalThis.risuApi);
        add(globalThis.risuAPI);
        add(globalThis.Risuai);
        add(globalThis.RisuAI);
        add(globalThis.__pluginApis__);
      }
    } catch (_) {}
    return out;
  };

  const getArgumentValue = async (names, fallback = '') => {
    for (const name of names) {
      for (const api of apiCandidates()) {
        try {
          let value;
          if (typeof api?.getArgument === 'function') value = await api.getArgument(name);
          else if (typeof api?.getArg === 'function') value = await api.getArg(name);
          if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
        } catch (_) {}
      }
    }
    return fallback;
  };

  const setArgumentValue = async (name, value) => {
    let lastError = null;
    for (const api of apiCandidates()) {
      try {
        const fn = typeof api?.setArgument === 'function' ? api.setArgument : (typeof api?.setArg === 'function' ? api.setArg : null);
        if (!fn) continue;
        const result = await fn.call(api, name, value);
        if (result === false) throw new Error('argument_write_rejected');
        return true;
      } catch (error) { lastError = error; }
    }
    const error = new Error(`memory_suite_argument_persistence_unavailable:${compact(lastError?.message || lastError || 'setArgument unavailable', 180)}`);
    error.code = 'MEMORY_SUITE_ARGUMENT_PERSISTENCE_UNAVAILABLE';
    throw error;
  };

  const normalizeMode = raw => {
    const value = String(raw || '').trim().toLowerCase().replace(/[ -]+/g, '_');
    if (['off', 'plugin', 'plugin_only', 'standalone', 'local', 'local_only'].includes(value)) return MODE_PLUGIN_ONLY;
    if (['mirror', 'dual', 'coexist', 'coexistence', 'plugin_server', 'plugin+server', 'plugin_and_server'].includes(value)) return MODE_MIRROR;
    if (['required', 'server', 'server_only', 'remote', 'remote_only'].includes(value)) return MODE_SERVER_ONLY;
    return MODE_PLUGIN_ONLY;
  };

  const modeLabel = mode => mode === MODE_MIRROR
    ? '플러그인 + 서버 병존'
    : (mode === MODE_SERVER_ONLY ? '서버 단독' : '플러그인 단독');

  const normalizeServerUrl = rawValue => {
    const raw = String(rawValue || defaultUrl).trim().replace(/\/+$/, '') || defaultUrl;
    try {
      const parsed = new URL(raw);
      const host = String(parsed.hostname || '').toLowerCase();
      if (parsed.protocol !== 'http:' || !['127.0.0.1', 'localhost', '::1'].includes(host)) {
        throw new Error('server_url_must_be_loopback_http');
      }
      return parsed.origin;
    } catch (error) {
      const wrapped = new Error(`invalid_memory_suite_server_url:${compact(error?.message || error, 180)}`);
      wrapped.code = 'MEMORY_SUITE_INVALID_SERVER_URL';
      throw wrapped;
    }
  };

  const resetBootstrapCache = () => {
    state.bootstrap = { at: 0, baseUrl: '', value: null, pending: null };
  };

  const readConfig = async (force = false) => {
    if (!force && state.transientMode && VALID_MODES.has(state.transientMode)) return { ...state.config, mode: state.transientMode };
    if (!force && Date.now() - Number(state.config.at || 0) < configCacheMs) return state.config;
    const rawMode = (await getArgumentValue(modeArguments, MODE_PLUGIN_ONLY)).trim().toLowerCase();
    const mode = state.transientMode && VALID_MODES.has(state.transientMode) ? state.transientMode : normalizeMode(rawMode);
    const rawUrl = await getArgumentValue(urlArguments, defaultUrl);
    const url = normalizeServerUrl(rawUrl);
    state.config = { at: Date.now(), mode, url };
    return state.config;
  };

  const persistMode = async modeValue => {
    const mode = normalizeMode(modeValue);
    state.transientMode = mode;
    try {
      await setArgumentValue(modeArguments[0] || 'memory_suite_server_mode', mode);
      state.config.at = 0;
      state.transientMode = '';
      const verified = await readConfig(true);
      if (verified.mode !== mode) throw new Error(`memory_suite_mode_readback_mismatch:${verified.mode}->${mode}`);
      setStatus('mode_changed', '', { mode, modeLabel: modeLabel(mode) });
      return verified;
    } catch (error) {
      state.transientMode = '';
      state.config.at = 0;
      throw error;
    }
  };

  const persistServerUrl = async urlValue => {
    const url = normalizeServerUrl(urlValue);
    await setArgumentValue(urlArguments[0] || 'memory_suite_server_url', url);
    state.config.at = 0;
    resetBootstrapCache();
    const verified = await readConfig(true);
    if (verified.url !== url) throw new Error(`memory_suite_url_readback_mismatch:${verified.url}->${url}`);
    setStatus('url_changed', '', { url });
    return verified;
  };

  const excluded = key => {
    const lower = String(key || '').toLowerCase();
    // Legacy chunk artifacts belong to the old storage adapter. The server stores
    // the hydrated logical record and must never promote individual chunk pieces.
    if (lower.includes('::chunk:v1:')) return true;
    if (excludedKeys.has(lower)) return true;
    if (excludedPrefixes.some(prefix => lower.startsWith(prefix))) return true;
    if (excludedContains.some(part => lower.includes(part))) return true;
    return false;
  };

  const matchesRoute = (space, key) => {
    const normalized = String(key || '');
    if (!normalized || excluded(normalized)) return false;
    const prefixes = space === 'local' ? localPrefixes : pluginPrefixes;
    const exact = space === 'local' ? localKeys : pluginKeys;
    return exact.has(normalized) || prefixes.some(prefix => normalized.startsWith(prefix));
  };

  const fetchApi = (url, init = {}) => {
    const requestInit = {
      ...init,
      networkRoute: 'local_network',
      requestTimeoutMs,
      logFetch: false
    };
    for (const api of apiCandidates()) {
      if (typeof api?.nativeFetch === 'function') return api.nativeFetch(url, requestInit);
      if (typeof api?.risuFetch === 'function') return api.risuFetch(url, requestInit);
    }
    if (typeof fetch === 'function') return fetch(url, requestInit);
    throw new Error('memory_suite_server_fetch_unavailable');
  };

  const withTimeout = async (promise, label, timeoutMs = requestTimeoutMs) => {
    const effectiveTimeoutMs = Math.max(250, Number(timeoutMs || requestTimeoutMs) || requestTimeoutMs);
    let timer = null;
    try {
      return await Promise.race([
        Promise.resolve(promise),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            const error = new Error(`${label || 'Memory Suite request'} timed out after ${effectiveTimeoutMs}ms`);
            error.code = 'MEMORY_SUITE_TIMEOUT';
            reject(error);
          }, effectiveTimeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const responseText = async (response, label, timeoutMs = requestTimeoutMs) => {
    if (typeof response?.text === 'function') return await withTimeout(response.text(), `${label} response`, timeoutMs);
    if (typeof response?.json === 'function') return JSON.stringify(await withTimeout(response.json(), `${label} response`, timeoutMs));
    if (typeof response === 'string') return response;
    if (response && typeof response === 'object' && Object.prototype.hasOwnProperty.call(response, 'data')) {
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    }
    return JSON.stringify(response || {});
  };

  const fetchJson = async (url, init = {}, label = 'Memory Suite request', timeoutMs = requestTimeoutMs) => {
    const response = await withTimeout(fetchApi(url, init), label, timeoutMs);
    const raw = await responseText(response, label, timeoutMs);
    let payload = null;
    try { payload = raw ? JSON.parse(raw) : {}; }
    catch (_) { throw new Error('memory_suite_server_invalid_json'); }
    const status = Number(response?.status || payload?.status || 0);
    const ok = typeof response?.ok === 'boolean' ? response.ok : (status ? status >= 200 && status < 300 : payload?.ok === true);
    if (!ok || payload?.ok !== true) {
      const error = new Error(payload?.error || `memory_suite_server_http_${status || 'unknown'}`);
      error.status = status;
      error.payload = payload;
      throw error;
    }
    return payload;
  };

  const validateBootstrapPayload = (payload, requestedUrl = '') => {
    if (payload?.schema !== 'memory-suite.storage.bootstrap.v1' || !payload?.token || !payload?.url) {
      throw new Error('memory_suite_bootstrap_contract_mismatch');
    }
    if (Number(payload.protocol?.major || 0) !== 1) throw new Error('memory_suite_protocol_major_incompatible');
    if (!Array.isArray(payload.namespaces) || !payload.namespaces.includes(namespace)) {
      throw new Error(`memory_suite_namespace_not_supported:${namespace}`);
    }
    for (const capability of requiredCapabilities) {
      if (payload.capabilities?.[capability] !== true) throw new Error(`memory_suite_capability_missing:${capability}`);
    }
    return {
      requestedUrl: requestedUrl || '',
      url: String(payload.url).replace(/\/+$/, ''),
      token: String(payload.token),
      version: String(payload.version || ''),
      protocol: payload.protocol || {},
      capabilities: payload.capabilities || {},
      namespaces: Array.isArray(payload.namespaces) ? payload.namespaces.slice() : []
    };
  };

  const bootstrapAtUrl = async urlValue => {
    const url = normalizeServerUrl(urlValue);
    const payload = await fetchJson(`${url}/bootstrap`, {
      method: 'GET',
      headers: {
        'X-Memory-Suite-Plugin': pluginId,
        'X-Memory-Suite-Plugin-Version': pluginVersion
      }
    }, 'Memory Suite connection test', bootstrapRequestTimeoutMs);
    return validateBootstrapPayload(payload, url);
  };

  const testConnection = async urlValue => {
    const config = await readConfig(true).catch(() => ({ mode: MODE_PLUGIN_ONLY, url: defaultUrl }));
    const url = normalizeServerUrl(urlValue || config.url || defaultUrl);
    const startedAt = Date.now();
    try {
      const connection = await bootstrapAtUrl(url);
      const integrityPayload = await fetchJson(`${connection.url}/v1/integrity?namespace=${encodeURIComponent(namespace)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${connection.token}`,
          'X-Memory-Suite-Plugin': pluginId,
          'X-Memory-Suite-Plugin-Version': pluginVersion
        }
      }, 'Memory Suite namespace integrity');
      const integrity = integrityPayload?.result || null;
      if (integrity?.ok !== true) throw new Error(`memory_suite_namespace_integrity_failed:${integrity?.result || 'unknown'}`);
      const result = {
        ok: true,
        url,
        serverUrl: connection.url,
        serverVersion: connection.version,
        protocol: connection.protocol,
        namespaces: connection.namespaces,
        integrity,
        records: Math.max(0, Number(integrity?.records || 0) || 0),
        liveRecords: Math.max(0, Number(integrity?.liveRecords || 0) || 0),
        tombstones: Math.max(0, Number(integrity?.tombstones || 0) || 0),
        fileBytes: Math.max(0, Number(integrity?.fileBytes || 0) || 0),
        durationMs: Date.now() - startedAt
      };
      if (url === config.url) {
        state.bootstrap = { at: Date.now(), baseUrl: config.url, value: connection, pending: null };
        setStatus('connected', '', { serverVersion: connection.version, url: connection.url, protocol: connection.protocol });
      }
      return result;
    } catch (error) {
      const normalized = normalizeServerAvailabilityError(error);
      const result = { ok: false, url, error: compact(normalized?.message || normalized, 700), durationMs: Date.now() - startedAt };
      if (url === config.url) setStatus('unavailable', result.error, { url });
      return result;
    }
  };

  const bootstrap = async (force = false, allowPluginOnly = false) => {
    const config = await readConfig();
    if (config.mode === MODE_PLUGIN_ONLY && allowPluginOnly !== true) return null;
    const cached = state.bootstrap;
    if (!force && cached.value && cached.baseUrl === config.url && Date.now() - Number(cached.at || 0) < bootstrapCacheMs) return cached.value;
    if (!force && cached.pending && cached.baseUrl === config.url) return await cached.pending;
    if (!force) {
      const offline = cachedBootstrapFailure(config.url);
      if (offline) throw offline;
    }
    const pending = (async () => {
      const payload = await fetchJson(`${config.url}/bootstrap`, {
        method: 'GET',
        headers: {
          'X-Memory-Suite-Plugin': pluginId,
          'X-Memory-Suite-Plugin-Version': pluginVersion
        }
      }, 'Memory Suite bootstrap', bootstrapRequestTimeoutMs);
      const value = validateBootstrapPayload(payload, config.url);
      sharedBootstrapFailures.delete(config.url);
      state.bootstrap = { at: Date.now(), baseUrl: config.url, value, pending: null };
      setStatus('connected', '', { serverVersion: value.version, url: value.url });
      return value;
    })();
    state.bootstrap = { at: 0, baseUrl: config.url, value: null, pending };
    try {
      return await pending;
    } catch (error) {
      const normalized = normalizeServerAvailabilityError(error);
      state.bootstrap = { at: 0, baseUrl: config.url, value: null, pending: null };
      if (normalized?.code === 'MEMORY_SUITE_SERVER_UNAVAILABLE') {
        sharedBootstrapFailures.set(config.url, { at: Date.now(), message: normalized.message, code: normalized.code });
      }
      setStatus('unavailable', normalized?.message || normalized, { url: config.url });
      // Offline is an expected state: pluginStorage remains authoritative and
      // the status object exposes the condition without noisy console warnings.
      // Contract/configuration failures still surface once for diagnosis.
      if (normalized?.code !== 'MEMORY_SUITE_SERVER_UNAVAILABLE') {
        warnOnce('server_bootstrap_failed', normalized);
      }
      throw normalized;
    }
  };

  const request = async (method, route, body = null, requestOptions = {}) => {
    const connection = await bootstrap(requestOptions.forceBootstrap === true, requestOptions.allowPluginOnly === true);
    if (!connection) throw new Error('memory_suite_server_not_enabled');
    const requestScope = requestOptions.scope && typeof requestOptions.scope === 'object'
      ? requestOptions.scope
      : state.scopeRouting.current;
    const requestScopeId = String(requestOptions.scopeId || requestScope?.scopeId || '').trim();
    const registeredMode = requestScopeId ? state.scopeRouting.registry?.entries?.[requestScopeId]?.mode : '';
    const transientMode = requestScopeId ? state.scopeRouting.transientModes.get(requestScopeId) : '';
    const requestMode = normalizeMode(requestOptions.storageMode || transientMode || registeredMode || state.config.mode || MODE_PLUGIN_ONLY);
    const init = {
      method,
      headers: {
        Authorization: `Bearer ${connection.token}`,
        'X-Memory-Suite-Plugin': pluginId,
        'X-Memory-Suite-Plugin-Version': pluginVersion,
        ...(requestScopeId ? { 'X-Memory-Suite-Scope-Id': encodeURIComponent(requestScopeId) } : {}),
        'X-Memory-Suite-Storage-Mode': requestMode,
        ...(requestOptions.extraHeaders && typeof requestOptions.extraHeaders === 'object' ? requestOptions.extraHeaders : {}),
        ...(body == null ? {} : { 'Content-Type': 'application/json' })
      },
      ...(body == null ? {} : { body: JSON.stringify(body) })
    };
    try {
      return await fetchJson(`${connection.url}${route}`, init, `Memory Suite ${method} ${route}`);
    } catch (error) {
      if (error?.status === 403 && requestOptions.authRetry !== false) {
        await bootstrap(true, requestOptions.allowPluginOnly === true);
        return await request(method, route, body, { ...requestOptions, authRetry: false });
      }
      setStatus('request_failed', error?.message || error, { route, method });
      throw error;
    }
  };

  const operationId = kind => {
    let unique = '';
    try { unique = globalThis?.crypto?.randomUUID?.() || ''; } catch (_) {}
    if (!unique) unique = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;
    const prefix = `${namespace}_${kind}_${pluginId}`.replace(/[^A-Za-z0-9._:-]/g, '_').slice(0, 80);
    return `${prefix}_${unique.replace(/[^A-Za-z0-9._:-]/g, '')}`.slice(0, 238);
  };

  const verifyReceipt = (payload, expectedId, expectedSpace, expectedKey) => {
    const receipt = payload?.result || {};
    if (receipt.schema !== 'memory-suite.storage.receipt.v1'
      || receipt.namespace !== namespace
      || receipt.operationId !== expectedId
      || receipt.space !== expectedSpace
      || receipt.key !== expectedKey
      || receipt.durable !== true
      || receipt.verified !== true
      || !receipt.digest
      || Number(receipt.revision || 0) < 1) {
      throw new Error('memory_suite_durable_receipt_invalid');
    }
    return receipt;
  };

  const statusReadback = async (id, requestOptions = {}) => {
    try {
      return await request('GET', `/v1/operations/${encodeURIComponent(namespace)}/${encodeURIComponent(id)}`, null, { authRetry: true, allowPluginOnly: requestOptions.allowPluginOnly === true });
    } catch (error) {
      if (error?.status === 404) return null;
      throw error;
    }
  };

  const remoteGet = async (space, key, requestOptions = {}) => {
    const payload = await request(
      'GET',
      `/v1/kv/get?namespace=${encodeURIComponent(namespace)}&space=${encodeURIComponent(space)}&key=${encodeURIComponent(key)}`,
      null,
      { allowPluginOnly: requestOptions.allowPluginOnly === true }
    );
    return payload?.result || {};
  };

  const remoteGetMany = async (space, keys = [], requestOptions = {}) => {
    const list = Array.isArray(keys) ? keys.map(value => String(value || '')).filter(Boolean).slice(0, 512) : [];
    if (!list.length) return { values: {} };
    const payload = await request(
      'POST',
      '/v1/kv/get-many',
      { namespace, space, keys: list },
      { allowPluginOnly: requestOptions.allowPluginOnly === true }
    );
    return payload?.result || { values: {} };
  };

  const remoteKeys = async (space, prefix = '', requestOptions = {}) => {
    const payload = await request(
      'GET',
      `/v1/kv/keys?namespace=${encodeURIComponent(namespace)}&space=${encodeURIComponent(space)}&prefix=${encodeURIComponent(prefix)}`,
      null,
      { allowPluginOnly: requestOptions.allowPluginOnly === true }
    );
    return payload?.result || { keys: [], tombstones: [] };
  };

  const remoteIntegrity = async (requestOptions = {}) => {
    const payload = await request(
      'GET',
      `/v1/integrity?namespace=${encodeURIComponent(namespace)}`,
      null,
      { allowPluginOnly: requestOptions.allowPluginOnly === true }
    );
    const result = payload?.result || {};
    if (result.ok !== true || String(result.result || '') !== 'ok') {
      const error = new Error(`memory_suite_namespace_integrity_failed:${result.result || 'unknown'}`);
      error.code = 'MEMORY_SUITE_INTEGRITY_FAILED';
      throw error;
    }
    return result;
  };

  const remoteMutate = async (kind, space, key, value, mutateOptions = {}) => {
    const id = operationId(kind);
    const expectedRevision = Number.isInteger(Number(mutateOptions.expectedRevision))
      ? Math.max(0, Number(mutateOptions.expectedRevision))
      : null;
    const body = {
      namespace,
      operationId: id,
      space,
      key,
      ...(kind === 'set' ? { value } : {}),
      ...(expectedRevision == null ? {} : { expectedRevision })
    };
    const verifyStored = async receipt => {
      const stored = await remoteGet(space, key, { allowPluginOnly: mutateOptions.allowPluginOnly === true });
      const valueMatches = kind === 'remove'
        ? stored.exists === false && stored.tombstone === true
        : stored.exists === true && jsonComparable(stored.value) === jsonComparable(value);
      if (!valueMatches
        || Number(stored.revision || 0) !== Number(receipt.revision || 0)
        || String(stored.digest || '') !== String(receipt.digest || '')) {
        throw new Error('memory_suite_end_to_end_readback_mismatch');
      }
      setStatus('durable', '', { operationId: id, revision: receipt.revision, key: compact(key, 180), space });
      return { ...receipt, endToEndVerified: true };
    };
    try {
      const payload = await request('POST', `/v1/kv/${kind}`, body, { allowPluginOnly: mutateOptions.allowPluginOnly === true });
      return await verifyStored(verifyReceipt(payload, id, space, key));
    } catch (error) {
      try {
        const status = await statusReadback(id, { allowPluginOnly: mutateOptions.allowPluginOnly === true });
        if (status) return await verifyStored(verifyReceipt(status, id, space, key));
      } catch (_) {}
      error.storageMutationIndeterminate = true;
      error.storageMutationKey = key;
      error.storageOperationId = id;
      throw error;
    }
  };

  const serializeMutation = async (space, key, factory) => {
    const lockKey = `${space}\n${key}`;
    const previous = mutationTails.get(lockKey) || Promise.resolve();
    const operation = Promise.resolve(previous).catch(() => undefined).then(factory);
    const tail = operation.then(() => undefined, () => undefined);
    mutationTails.set(lockKey, tail);
    tail.then(() => {
      if (mutationTails.get(lockKey) === tail) mutationTails.delete(lockKey);
    });
    return await operation;
  };

  const isNullishStorageValue = value => value === null || value === undefined || value === '';

  const legacyRead = async (legacy, key) => {
    if (!legacy || typeof legacy.getItem !== 'function') return null;
    return await legacy.getItem(key);
  };

  const legacyWriteVerified = async (legacy, key, value) => {
    if (!legacy || typeof legacy.setItem !== 'function') return false;
    const result = await legacy.setItem(key, value);
    if (result === false) return false;
    if (typeof legacy.getItem === 'function') {
      const readback = await legacy.getItem(key);
      if (jsonComparable(readback) !== jsonComparable(value)) {
        const error = new Error(`memory_suite_pluginstorage_readback_mismatch:${compact(key, 160)}`);
        error.code = 'MEMORY_SUITE_LOCAL_READBACK_MISMATCH';
        throw error;
      }
    }
    return true;
  };

  const legacyRemoveVerified = async (legacy, key) => {
    if (!legacy) return false;
    let result = false;
    if (typeof legacy.removeItem === 'function') result = (await legacy.removeItem(key)) !== false;
    else if (typeof legacy.setItem === 'function') result = (await legacy.setItem(key, null)) !== false;
    if (!result) return false;
    if (typeof legacy.getItem === 'function') {
      const readback = await legacy.getItem(key);
      if (!isNullishStorageValue(readback)) {
        const error = new Error(`memory_suite_pluginstorage_remove_readback_mismatch:${compact(key, 160)}`);
        error.code = 'MEMORY_SUITE_LOCAL_REMOVE_READBACK_MISMATCH';
        throw error;
      }
    }
    return true;
  };

  const legacyKeys = async legacy => {
    if (!legacy || typeof legacy.keys !== 'function') return null;
    const listed = await legacy.keys();
    return Array.isArray(listed) ? [...new Set(listed.map(String).filter(Boolean))] : [];
  };

  const chunkOwnerKey = key => {
    const raw = String(key || '');
    const marker = '::chunk:v1:';
    const index = raw.indexOf(marker);
    return index > 0 ? raw.slice(0, index) : '';
  };

  const isOwnedChunkArtifact = (space, key) => {
    const owner = chunkOwnerKey(key);
    return !!owner && matchesRoute(space, owner);
  };

  const listRoutedLegacyKeys = async (legacy, space, includeArtifacts = false) => {
    const listed = await legacyKeys(legacy);
    if (listed == null) {
      const error = new Error('memory_suite_pluginstorage_key_enumeration_required');
      error.code = 'MEMORY_SUITE_KEYS_UNAVAILABLE';
      throw error;
    }
    return listed.filter(key => matchesRoute(space, key) || (includeArtifacts && isOwnedChunkArtifact(space, key)));
  };

  const migrateFromLegacy = async (space, key, legacyGet = null) => {
    if (typeof legacyGet !== 'function') return { state: 'missing', value: null };
    return await serializeMutation(space, key, async () => {
      const current = await remoteGet(space, key);
      if (current.exists === true) return { state: 'server', value: current.value };
      if (current.tombstone === true) return { state: 'tombstone', value: null };
      const legacy = await legacyGet();
      if (legacy === null || legacy === undefined) return { state: 'missing', value: null };
      try {
        await remoteMutate('set', space, key, legacy, { expectedRevision: 0 });
        return { state: 'migrated', value: legacy };
      } catch (error) {
        if (error?.status === 409) {
          const afterConflict = await remoteGet(space, key);
          if (afterConflict.exists === true) return { state: 'server', value: afterConflict.value };
          if (afterConflict.tombstone === true) return { state: 'tombstone', value: null };
        }
        throw error;
      }
    });
  };

  const synchronizeLegacyWithServer = async (legacy, space = 'plugin', options = {}) => {
    if (!legacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const config = await readConfig(true);
    if (config.mode === MODE_PLUGIN_ONLY && options.allowPluginOnly !== true) {
      throw new Error('memory_suite_server_mode_required_for_sync');
    }
    const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
    const allowPluginOnly = options.allowPluginOnly === true;
    const progress = {
      schema: 'memory-suite.sync-progress.v1', namespace, space,
      phase: 'integrity_before', currentAction: '서버 무결성 확인', currentKey: '',
      totalItems: 0, processedItems: 0, processedBytes: 0, transferredBytes: 0,
      uploaded: 0, restored: 0, matched: 0, removedByTombstone: 0,
      failureCount: 0, conflictCount: 0, startedAt: Date.now(), lastActivityAt: Date.now()
    };
    const report = (phase, patch = {}) => {
      Object.assign(progress, patch || {}, { phase: String(phase || progress.phase), lastActivityAt: Date.now() });
      try { onProgress?.({ ...progress }); } catch (_) {}
    };
    report('integrity_before', { message: '서버 DATA 무결성을 확인하고 있습니다.' });
    const integrityBefore = await remoteIntegrity({ allowPluginOnly });
    report('inventory', { currentAction: '데이터 목록 조사', message: 'pluginStorage와 서버의 데이터 목록을 비교하고 있습니다.' });
    const localLogicalKeys = (await listRoutedLegacyKeys(legacy, space, false)).slice().sort();
    const serverListing = await remoteKeys(space, '', { allowPluginOnly });
    const serverKeys = new Set((serverListing.keys || []).map(String));
    const serverTombstones = new Set((serverListing.tombstones || []).map(String));
    const serverRecordBytes = new Map((Array.isArray(serverListing.records) ? serverListing.records : []).map(row => [String(row?.key || ''), Math.max(0, Number(row?.valueBytes || 0) || 0)]));
    const localSet = new Set(localLogicalKeys);
    const missingServerKeys = options.restoreMissingLocal === true
      ? Array.from(serverKeys).filter(key => matchesRoute(space, key) && !localSet.has(key)).sort()
      : [];
    progress.totalItems = localLogicalKeys.length + missingServerKeys.length;
    report('inventory_complete', {
      currentAction: '목록 조사 완료',
      localKeys: localLogicalKeys.length,
      serverKeys: serverKeys.size,
      serverTombstones: serverTombstones.size,
      message: `처리 대상 ${progress.totalItems.toLocaleString()}개를 확인했습니다.`
    });
    const result = {
      schema: 'memory-suite.sync.v1', namespace, space, startedAt: progress.startedAt,
      localKeys: localLogicalKeys.length, uploaded: 0, restored: 0, removedByTombstone: 0,
      matched: 0, conflicts: [], failures: [], integrityBefore, integrityAfter: null,
      totalItems: progress.totalItems, processedItems: 0, processedBytes: 0, transferredBytes: 0
    };
    // A failed plugin_only -> mirror transition must never consume the only local
    // copy merely because the server carries a deliberate scope-deletion tombstone.
    const protectedConflictKeys = new Set();

    for (const key of localLogicalKeys) {
      let localBytes = 0;
      let action = '비교';
      try {
        report('sync_local', { currentAction: 'pluginStorage → 서버 비교', currentKey: key });
        const localValue = await legacyRead(legacy, key);
        localBytes = isNullishStorageValue(localValue) ? 0 : storageValueBytes(localValue);
        if (isNullishStorageValue(localValue)) {
          action = '빈 값 건너뜀';
        } else {
          const remote = await remoteGet(space, key, { allowPluginOnly });
          if (remote.exists === true && jsonComparable(remote.value) === jsonComparable(localValue)) {
            result.matched += 1;
            action = '일치 확인';
          } else if (remote.tombstone === true && options.resurrectTombstones !== true) {
            if (options.allowOverwrite === false) {
              result.conflicts.push({ key, serverState: 'tombstone', localPreserved: true });
              protectedConflictKeys.add(key);
              action = '삭제 충돌 보존';
            } else if (options.restoreMissingLocal === true) {
              const removed = await legacyRemoveVerified(legacy, key);
              if (!removed) throw new Error('pluginstorage_tombstone_apply_failed');
              result.removedByTombstone += 1;
              action = '서버 삭제 상태 반영';
            } else {
              result.conflicts.push({ key, serverState: 'tombstone' });
              action = '삭제 충돌';
            }
          } else if (options.allowOverwrite === false && remote.exists === true) {
            result.conflicts.push({ key, serverState: 'value' });
            action = '기존 서버 값 충돌';
          } else {
            await remoteMutate('set', space, key, localValue, { allowPluginOnly });
            const verified = await remoteGet(space, key, { allowPluginOnly });
            if (verified.exists !== true || jsonComparable(verified.value) !== jsonComparable(localValue)) {
              throw new Error('post_sync_server_readback_mismatch');
            }
            result.uploaded += 1;
            progress.transferredBytes += localBytes;
            action = '업로드·검증';
          }
        }
      } catch (error) {
        result.failures.push({ key, error: compact(error?.message || error, 220) });
        action = '실패';
      } finally {
        result.processedItems += 1;
        result.processedBytes += localBytes;
        progress.processedItems = result.processedItems;
        progress.processedBytes = result.processedBytes;
        progress.uploaded = result.uploaded;
        progress.restored = result.restored;
        progress.matched = result.matched;
        progress.removedByTombstone = result.removedByTombstone;
        progress.failureCount = result.failures.length;
        progress.conflictCount = result.conflicts.length;
        report('sync_local', { currentAction: action, currentKey: key });
      }
    }

    if (options.restoreMissingLocal === true) {
      for (const key of missingServerKeys) {
        const remoteBytes = Math.max(0, Number(serverRecordBytes.get(key) || 0) || 0);
        let action = '서버 → pluginStorage 복구';
        try {
          report('restore_missing_local', { currentAction: action, currentKey: key });
          const remote = await remoteGet(space, key, { allowPluginOnly });
          if (remote.exists !== true) {
            action = '서버 값 없음';
          } else {
            const ok = await legacyWriteVerified(legacy, key, remote.value);
            if (!ok) throw new Error('pluginstorage_restore_write_failed');
            result.restored += 1;
            progress.transferredBytes += remoteBytes || storageValueBytes(remote.value);
            action = '복구·검증';
          }
        } catch (error) {
          result.failures.push({ key, error: compact(error?.message || error, 220) });
          action = '복구 실패';
        } finally {
          result.processedItems += 1;
          result.processedBytes += remoteBytes;
          progress.processedItems = result.processedItems;
          progress.processedBytes = result.processedBytes;
          progress.uploaded = result.uploaded;
          progress.restored = result.restored;
          progress.matched = result.matched;
          progress.removedByTombstone = result.removedByTombstone;
          progress.failureCount = result.failures.length;
          progress.conflictCount = result.conflicts.length;
          report('restore_missing_local', { currentAction: action, currentKey: key });
        }
      }
      // Tombstones for keys that were already present locally are handled in the
      // local-key pass above. Re-check only for values that survived unexpectedly.
      for (const key of serverTombstones) {
        if (!matchesRoute(space, key) || !localSet.has(key) || protectedConflictKeys.has(key)) continue;
        try {
          const current = await legacyRead(legacy, key);
          if (!isNullishStorageValue(current)) {
            const ok = await legacyRemoveVerified(legacy, key);
            if (!ok) throw new Error('pluginstorage_tombstone_apply_failed');
            result.removedByTombstone += 1;
          }
        } catch (error) {
          result.failures.push({ key, error: compact(error?.message || error, 220) });
        }
      }
    }

    report('integrity_after', { currentAction: '최종 무결성 확인', currentKey: '', message: '동기화 후 서버 DATA 무결성을 확인하고 있습니다.' });
    result.integrityAfter = await remoteIntegrity({ allowPluginOnly });
    result.finishedAt = Date.now();
    result.ok = result.failures.length === 0 && result.conflicts.length === 0;
    progress.failureCount = result.failures.length;
    progress.conflictCount = result.conflicts.length;
    progress.uploaded = result.uploaded;
    progress.restored = result.restored;
    progress.matched = result.matched;
    progress.removedByTombstone = result.removedByTombstone;
    report(result.ok ? 'space_complete' : 'space_incomplete', {
      currentAction: result.ok ? '공간 동기화 완료' : '동기화 확인 필요', currentKey: '',
      message: result.ok ? `${space} 저장소 동기화를 완료했습니다.` : `충돌 ${result.conflicts.length}건 · 실패 ${result.failures.length}건`
    });
    state.management.lastResult = result;
    if (!result.ok) {
      const error = new Error(`memory_suite_sync_incomplete:conflicts=${result.conflicts.length},failures=${result.failures.length}`);
      error.code = 'MEMORY_SUITE_SYNC_INCOMPLETE';
      error.result = result;
      throw error;
    }
    return result;
  };

  const verifyServerPreservation = async (legacy = state.legacy.plugin) => {
    if (!legacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const config = await readConfig(true);
    if (config.mode === MODE_PLUGIN_ONLY) {
      const error = new Error('plugin_only_mode_has_no_verified_server_copy');
      error.code = 'MEMORY_SUITE_SERVER_COPY_NOT_ACTIVE';
      throw error;
    }
    if (config.mode === MODE_MIRROR) {
      await synchronizeLegacyWithServer(legacy, 'plugin', { allowOverwrite: true, restoreMissingLocal: true });
    }
    const integrity = await remoteIntegrity();
    const keys = await listRoutedLegacyKeys(legacy, 'plugin', false);
    const result = { schema: 'memory-suite.server-preservation.v1', namespace, mode: config.mode, integrity, checked: 0, exact: 0, covered: 0, unsafe: [] };
    for (const key of keys) {
      const localValue = await legacyRead(legacy, key);
      if (isNullishStorageValue(localValue)) continue;
      const remote = await remoteGet('plugin', key);
      result.checked += 1;
      if (config.mode === MODE_MIRROR) {
        if (remote.exists === true && jsonComparable(remote.value) === jsonComparable(localValue)) result.exact += 1;
        else result.unsafe.push({ key, reason: remote.tombstone === true ? 'server_tombstone' : (remote.exists === true ? 'value_mismatch' : 'server_missing') });
      } else {
        if (remote.exists === true || remote.tombstone === true) result.covered += 1;
        else result.unsafe.push({ key, reason: 'server_has_no_record_or_tombstone' });
      }
    }
    result.ok = integrity.ok === true && result.unsafe.length === 0;
    if (!result.ok) {
      const error = new Error(`memory_suite_server_preservation_verification_failed:${result.unsafe.length}`);
      error.code = 'MEMORY_SUITE_SERVER_PRESERVATION_FAILED';
      error.result = result;
      throw error;
    }
    state.management.lastResult = result;
    return result;
  };

  const restoreServerSpaceToLegacy = async (legacy, space = 'plugin', options = {}) => {
    if (!legacy) throw new Error(`memory_suite_${space}_storage_unavailable`);
    const normalizedSpace = String(space || 'plugin') === 'local' ? 'local' : 'plugin';
    const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
    const progress = {
      schema: 'memory-suite.restore-progress.v1', namespace, space: normalizedSpace,
      phase: 'integrity_before', currentAction: '서버 무결성 확인', currentKey: '', totalItems: 0, processedItems: 0,
      processedBytes: 0, transferredBytes: 0, restored: 0, removed: 0, verified: 0, failureCount: 0,
      startedAt: Date.now(), lastActivityAt: Date.now()
    };
    const report = (phase, patch = {}) => {
      Object.assign(progress, patch || {}, { phase, lastActivityAt: Date.now() });
      try { onProgress?.({ ...progress }); } catch (_) {}
    };
    report('integrity_before', { message: '서버 DATA 무결성을 확인하고 있습니다.' });
    const integrity = await remoteIntegrity({ allowPluginOnly: options.allowPluginOnly === true });
    report('inventory', { currentAction: '복구 대상 조사', message: '서버 DATA와 pluginStorage를 비교하고 있습니다.' });
    const listing = await remoteKeys(normalizedSpace, '', { allowPluginOnly: options.allowPluginOnly === true });
    const serverKeys = (listing.keys || []).map(String).filter(key => matchesRoute(normalizedSpace, key)).sort();
    const tombstones = (listing.tombstones || []).map(String).filter(key => matchesRoute(normalizedSpace, key)).sort();
    const recordBytes = new Map((Array.isArray(listing.records) ? listing.records : []).map(row => [String(row?.key || ''), Math.max(0, Number(row?.valueBytes || 0) || 0)]));
    const localKeys = await listRoutedLegacyKeys(legacy, normalizedSpace, false);
    const represented = new Set([...serverKeys, ...tombstones]);
    const untracked = localKeys.filter(key => !represented.has(key));
    const pruneKeys = options.pruneUntracked === true ? untracked.slice().sort() : [];
    progress.totalItems = pruneKeys.length + serverKeys.length + tombstones.length;
    report('inventory_complete', { currentAction: '복구 대상 조사 완료', message: `복구·검증 대상 ${progress.totalItems.toLocaleString()}개를 확인했습니다.` });
    const result = {
      schema: 'memory-suite.restore-to-legacy-storage.v1', namespace, space: normalizedSpace,
      restored: 0, removed: 0, verified: 0, pruned: 0, failures: [],
      untrackedLocalKeys: untracked.slice(), integrity,
      totalItems: progress.totalItems, processedItems: 0, processedBytes: 0, transferredBytes: 0
    };

    if (options.pruneUntracked === true) {
      for (const key of pruneKeys) {
        let action = '추적되지 않은 로컬 값 정리';
        try {
          report('prune_local', { currentAction: action, currentKey: key });
          const ok = await legacyRemoveVerified(legacy, key);
          if (!ok) throw new Error('untracked_local_prune_failed');
          result.pruned += 1;
          action = '정리 완료';
        } catch (error) {
          result.failures.push({ key, error: compact(error?.message || error, 220) }); action = '정리 실패';
        } finally {
          result.processedItems += 1; progress.processedItems = result.processedItems; progress.failureCount = result.failures.length;
          report('prune_local', { currentAction: action, currentKey: key });
        }
      }
      result.untrackedLocalKeys = [];
    }

    for (let offset = 0; offset < serverKeys.length; offset += 256) {
      const batchKeys = serverKeys.slice(offset, offset + 256);
      let values = {};
      try { values = (await remoteGetMany(normalizedSpace, batchKeys, { allowPluginOnly: options.allowPluginOnly === true }))?.values || {}; }
      catch (_) {}
      for (const key of batchKeys) {
        const bytes = Math.max(0, Number(recordBytes.get(key) || 0) || 0);
        let action = '서버 → pluginStorage 복구';
        try {
          report('restore_values', { currentAction: action, currentKey: key });
          const remote = values[key] || await remoteGet(normalizedSpace, key, { allowPluginOnly: options.allowPluginOnly === true });
          if (remote.exists !== true) throw new Error('server_key_disappeared_during_restore');
          const ok = await legacyWriteVerified(legacy, key, remote.value);
          if (!ok) throw new Error('legacy_restore_write_failed');
          result.restored += 1; result.verified += 1; result.transferredBytes += bytes || storageValueBytes(remote.value);
          action = '복구·readback 검증';
        } catch (error) {
          result.failures.push({ key, error: compact(error?.message || error, 220) }); action = '복구 실패';
        } finally {
          result.processedItems += 1; result.processedBytes += bytes;
          progress.processedItems = result.processedItems; progress.processedBytes = result.processedBytes; progress.transferredBytes = result.transferredBytes;
          progress.restored = result.restored; progress.verified = result.verified; progress.failureCount = result.failures.length;
          report('restore_values', { currentAction: action, currentKey: key });
        }
      }
    }
    for (const key of tombstones) {
      let action = '서버 tombstone 반영';
      try {
        report('restore_tombstones', { currentAction: action, currentKey: key });
        const current = await legacyRead(legacy, key);
        if (!isNullishStorageValue(current)) {
          const ok = await legacyRemoveVerified(legacy, key);
          if (!ok) throw new Error('legacy_restore_tombstone_failed');
          result.removed += 1;
        }
        action = '삭제 상태 검증';
      } catch (error) {
        result.failures.push({ key, error: compact(error?.message || error, 220) }); action = 'tombstone 반영 실패';
      } finally {
        result.processedItems += 1; progress.processedItems = result.processedItems; progress.removed = result.removed; progress.failureCount = result.failures.length;
        report('restore_tombstones', { currentAction: action, currentKey: key });
      }
    }
    result.ok = result.failures.length === 0 && (options.requireFullCoverage !== true || result.untrackedLocalKeys.length === 0);
    report(result.ok ? 'space_complete' : 'space_incomplete', {
      currentAction: result.ok ? '복구 완료' : '복구 확인 필요', currentKey: '',
      message: result.ok ? `${normalizedSpace} 저장소 복구를 완료했습니다.` : `실패 ${result.failures.length}건 · 추적되지 않은 값 ${result.untrackedLocalKeys.length}건`
    });
    if (!result.ok) {
      const error = new Error(`memory_suite_legacy_restore_incomplete:space=${normalizedSpace},failures=${result.failures.length},untracked=${result.untrackedLocalKeys.length}`);
      error.code = 'MEMORY_SUITE_RESTORE_INCOMPLETE';
      error.result = result;
      throw error;
    }
    state.management.lastResult = result;
    return result;
  };

  const restoreServerToPluginStorage = async (options = {}) => await restoreServerSpaceToLegacy(
    options.legacy || state.legacy.plugin,
    'plugin',
    options
  );

  const verifyScopedLegacyPreservation = async (legacy, space, keys = []) => {
    const normalizedSpace = String(space || 'plugin') === 'local' ? 'local' : 'plugin';
    const requested = [...new Set((Array.isArray(keys) ? keys : []).map(String).filter(key => matchesRoute(normalizedSpace, key)))];
    const result = { schema: 'memory-suite.scoped-legacy-preservation.v1', namespace, space: normalizedSpace, requested: requested.length, exact: 0, tombstones: 0, failures: [] };
    if (!requested.length) return { ...result, ok: true };
    const values = (await remoteGetMany(normalizedSpace, requested, { allowPluginOnly: true }))?.values || {};
    for (const key of requested) {
      try {
        const remote = values[key] || await remoteGet(normalizedSpace, key, { allowPluginOnly: true });
        const local = await legacyRead(legacy, key);
        if (remote.tombstone === true || remote.exists === false) {
          if (!isNullishStorageValue(local)) throw new Error('local_value_survives_server_tombstone');
          result.tombstones += 1;
        } else if (remote.exists === true && jsonComparable(local) === jsonComparable(remote.value)) {
          result.exact += 1;
        } else {
          throw new Error(remote.exists === true ? 'local_value_mismatch' : 'server_record_missing');
        }
      } catch (error) { result.failures.push({ key, error: compact(error?.message || error, 220) }); }
    }
    result.ok = result.failures.length === 0;
    if (!result.ok) {
      const error = new Error(`memory_suite_scoped_legacy_preservation_failed:${normalizedSpace}:${result.failures.length}`);
      error.code = 'MEMORY_SUITE_SCOPE_PRESERVATION_FAILED';
      error.result = result;
      throw error;
    }
    return result;
  };

  const setModeSafely = async (requestedMode, operationOptions = {}) => {
    const target = normalizeMode(requestedMode);
    const current = await readConfig(true);
    if (target === current.mode) return { changed: false, from: current.mode, to: target, modeLabel: modeLabel(target) };
    const legacy = state.legacy.plugin;
    if (!legacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const onProgress = typeof operationOptions.onProgress === 'function' ? operationOptions.onProgress : null;
    try {
      if (current.mode === MODE_PLUGIN_ONLY && (target === MODE_MIRROR || target === MODE_SERVER_ONLY)) {
        const synchronized = await synchronizeAllLegacy({
          allowPluginOnly: true,
          allowOverwrite: false,
          restoreMissingLocal: target === MODE_MIRROR,
          onProgress
        });
        if (!synchronized.ok) throw new Error(`memory_suite_mode_seed_sync_failed:${synchronized.failures.length}`);
        // The first pass proves the existing server contains no conflicting data.
        // Only after that proof do new writes temporarily mirror to both stores while
        // a final settle pass closes the race between initial inventory and mode commit.
        state.transientMode = MODE_MIRROR;
        const settled = await synchronizeAllLegacy({
          allowPluginOnly: true,
          allowOverwrite: true,
          restoreMissingLocal: target === MODE_MIRROR,
          onProgress
        });
        if (!settled.ok) throw new Error(`memory_suite_mode_settle_sync_failed:${settled.failures.length}`);
        const integrity = await remoteIntegrity({ allowPluginOnly: true });
        if (integrity?.ok !== true) throw new Error(`memory_suite_mode_integrity_failed:${integrity?.result || 'unknown'}`);
      } else if (current.mode === MODE_MIRROR && target === MODE_SERVER_ONLY) {
        const synchronized = await synchronizeAllLegacy({ allowOverwrite: true, restoreMissingLocal: true, onProgress });
        if (!synchronized.ok) throw new Error(`memory_suite_mode_final_sync_failed:${synchronized.failures.length}`);
        const integrity = await remoteIntegrity();
        if (integrity?.ok !== true) throw new Error(`memory_suite_mode_integrity_failed:${integrity?.result || 'unknown'}`);
      } else if (current.mode === MODE_SERVER_ONLY && (target === MODE_MIRROR || target === MODE_PLUGIN_ONLY)) {
        const restored = await restoreAllLegacyFromServer({ pruneUntracked: true, requireFullCoverage: true, onProgress });
        if (!restored.ok) throw new Error(`memory_suite_mode_restore_failed:${restored.failures.length}`);
      }
      const config = await persistMode(target);
      return { changed: true, from: current.mode, to: target, modeLabel: modeLabel(target), config };
    } catch (error) {
      state.transientMode = '';
      state.config.at = 0;
      throw error;
    }
  };

  const synchronizeAllLegacy = async (options = {}) => {
    const result = { schema: 'memory-suite.sync-all.v1', namespace, plugin: null, local: null, uploaded: 0, restored: 0, matched: 0, failures: [], totalItems: 0, processedItems: 0, processedBytes: 0, transferredBytes: 0 };
    const forward = progress => { try { options.onProgress?.(progress); } catch (_) {} };
    if (state.legacy.plugin) {
      result.plugin = await synchronizeLegacyWithServer(state.legacy.plugin, 'plugin', {
        allowPluginOnly: options.allowPluginOnly === true,
        allowOverwrite: options.allowOverwrite !== false,
        restoreMissingLocal: options.restoreMissingLocal !== false,
        onProgress: forward
      });
      result.uploaded += Number(result.plugin?.uploaded || 0);
      result.restored += Number(result.plugin?.restored || 0);
      result.matched += Number(result.plugin?.matched || 0);
      result.totalItems += Number(result.plugin?.totalItems || 0);
      result.processedItems += Number(result.plugin?.processedItems || 0);
      result.processedBytes += Number(result.plugin?.processedBytes || 0);
      result.transferredBytes += Number(result.plugin?.transferredBytes || 0);
      result.failures.push(...(Array.isArray(result.plugin?.failures) ? result.plugin.failures.map(row => ({ space: 'plugin', ...row })) : []));
    }
    if (state.legacy.local && typeof state.legacy.local?.keys === 'function') {
      result.local = await synchronizeLegacyWithServer(state.legacy.local, 'local', {
        allowPluginOnly: options.allowPluginOnly === true,
        allowOverwrite: options.allowOverwrite !== false,
        restoreMissingLocal: options.restoreMissingLocal !== false,
        onProgress: forward
      });
      result.uploaded += Number(result.local?.uploaded || 0);
      result.restored += Number(result.local?.restored || 0);
      result.matched += Number(result.local?.matched || 0);
      result.totalItems += Number(result.local?.totalItems || 0);
      result.processedItems += Number(result.local?.processedItems || 0);
      result.processedBytes += Number(result.local?.processedBytes || 0);
      result.transferredBytes += Number(result.local?.transferredBytes || 0);
      result.failures.push(...(Array.isArray(result.local?.failures) ? result.local.failures.map(row => ({ space: 'local', ...row })) : []));
    }
    result.ok = result.failures.length === 0;
    return result;
  };

  const restoreAllLegacyFromServer = async (options = {}) => {
    const result = { schema: 'memory-suite.restore-all.v1', namespace, plugin: null, local: null, restored: 0, removed: 0, verified: 0, failures: [], totalItems: 0, processedItems: 0, processedBytes: 0, transferredBytes: 0 };
    const forward = progress => { try { options.onProgress?.(progress); } catch (_) {} };
    if (state.legacy.plugin) {
      result.plugin = await restoreServerSpaceToLegacy(state.legacy.plugin, 'plugin', {
        pruneUntracked: options.pruneUntracked === true,
        requireFullCoverage: options.requireFullCoverage === true,
        allowPluginOnly: options.allowPluginOnly === true,
        onProgress: forward
      });
      result.restored += Number(result.plugin?.restored || 0);
      result.removed += Number(result.plugin?.removed || 0);
      result.verified += Number(result.plugin?.verified || 0);
      result.totalItems += Number(result.plugin?.totalItems || 0);
      result.processedItems += Number(result.plugin?.processedItems || 0);
      result.processedBytes += Number(result.plugin?.processedBytes || 0);
      result.transferredBytes += Number(result.plugin?.transferredBytes || 0);
      result.failures.push(...(Array.isArray(result.plugin?.failures) ? result.plugin.failures.map(row => ({ space: 'plugin', ...row })) : []));
    }
    if (state.legacy.local && typeof state.legacy.local?.getItem === 'function') {
      result.local = await restoreServerSpaceToLegacy(state.legacy.local, 'local', {
        pruneUntracked: options.pruneUntracked === true,
        requireFullCoverage: options.requireFullCoverage === true,
        allowPluginOnly: options.allowPluginOnly === true,
        onProgress: forward
      });
      result.restored += Number(result.local?.restored || 0);
      result.removed += Number(result.local?.removed || 0);
      result.verified += Number(result.local?.verified || 0);
      result.totalItems += Number(result.local?.totalItems || 0);
      result.processedItems += Number(result.local?.processedItems || 0);
      result.processedBytes += Number(result.local?.processedBytes || 0);
      result.transferredBytes += Number(result.local?.transferredBytes || 0);
      result.failures.push(...(Array.isArray(result.local?.failures) ? result.local.failures.map(row => ({ space: 'local', ...row })) : []));
    }
    result.ok = result.failures.length === 0;
    return result;
  };

  const configureConnection = async (settings, operationOptions = {}) => {
    const requested = settings && typeof settings === 'object' ? settings : {};
    const current = await readConfig(true);
    const targetMode = normalizeMode(requested.mode ?? current.mode);
    const targetUrl = normalizeServerUrl(requested.url ?? current.url);
    const original = { ...current };
    const onProgress = typeof operationOptions.onProgress === 'function' ? operationOptions.onProgress : null;
    const report = (phase, patch = {}) => { try { onProgress?.({ schema: 'memory-suite.connection-progress.v1', namespace, space: String(patch.space || 'plugin'), phase, ...patch, lastActivityAt: Date.now() }); } catch (_) {} };
    let connectionTest = null;
    let restoredBeforeUrlChange = null;
    let seedSync = null;
    try {
      report('configuration_start', { currentAction: '설정 변경 준비', message: `${modeLabel(original.mode)} → ${modeLabel(targetMode)}` });
      if (targetMode === MODE_PLUGIN_ONLY) {
        const transition = current.mode === MODE_PLUGIN_ONLY
          ? { changed: false, from: current.mode, to: targetMode }
          : await setModeSafely(MODE_PLUGIN_ONLY, { onProgress });
        if (targetUrl !== original.url) await persistServerUrl(targetUrl);
        const config = await readConfig(true);
        report('configuration_complete', { currentAction: '설정 적용 완료', message: `${modeLabel(config.mode)}로 적용되었습니다.` });
        return { ok: true, from: original, to: config, transition, connectionTest: null, restoredBeforeUrlChange: null, seedSync: null };
      }

      report('connection_test', { currentAction: '서버 연결 확인', message: `${targetUrl} 연결을 확인하고 있습니다.` });
      connectionTest = await testConnection(targetUrl);
      if (!connectionTest.ok) {
        const error = new Error(`memory_suite_connection_test_failed:${connectionTest.error || 'unknown'}`);
        error.code = 'MEMORY_SUITE_CONNECTION_TEST_FAILED';
        error.connectionTest = connectionTest;
        throw error;
      }
      report('connection_ready', { currentAction: '서버 연결 확인 완료', message: `Memory Suite ${connectionTest.serverVersion || '-'} 연결됨` });

      if (targetUrl !== original.url && original.mode === MODE_SERVER_ONLY) {
        report('restore_before_url_change', { currentAction: '기존 서버 데이터 로컬 복구', message: '서버 주소 변경 전에 현재 서버 DATA를 pluginStorage로 안전하게 복구합니다.' });
        restoredBeforeUrlChange = await restoreAllLegacyFromServer({ pruneUntracked: true, requireFullCoverage: true, onProgress });
        if (!restoredBeforeUrlChange.ok) throw new Error(`memory_suite_restore_before_url_change_failed:${restoredBeforeUrlChange.failures.length}`);
      }

      if (targetUrl !== original.url) await persistServerUrl(targetUrl);
      resetBootstrapCache();

      if (targetUrl !== original.url) {
        report('seed_new_server', { currentAction: '새 서버 기준선 생성', message: '새 서버에 기존 데이터를 안전하게 복사하고 있습니다.' });
        seedSync = await synchronizeAllLegacy({
          allowPluginOnly: true,
          allowOverwrite: false,
          restoreMissingLocal: targetMode === MODE_MIRROR,
          onProgress
        });
        if (!seedSync.ok) throw new Error(`memory_suite_new_server_seed_failed:${seedSync.failures.length}`);
      }

      const refreshed = await readConfig(true);
      report('mode_transition', { currentAction: '저장 모드 전환 준비', message: '서버 기준선 검증이 끝나면 저장 모드를 확정합니다.' });
      const transition = refreshed.mode === targetMode
        ? { changed: false, from: refreshed.mode, to: targetMode }
        : await setModeSafely(targetMode, { onProgress });
      const config = await readConfig(true);
      await bootstrap(true, true);
      report('configuration_complete', { currentAction: '설정 적용 완료', message: `${modeLabel(config.mode)} · ${config.url}` });
      return { ok: true, from: original, to: config, transition, connectionTest, restoredBeforeUrlChange, seedSync };
    } catch (error) {
      state.transientMode = '';
      state.config.at = 0;
      report('configuration_rollback', { currentAction: '이전 설정 복구', message: compact(error?.message || error, 260) });
      try {
        const now = await readConfig(true).catch(() => null);
        if (now?.url !== original.url) await persistServerUrl(original.url);
        const afterUrl = await readConfig(true).catch(() => null);
        if (afterUrl && afterUrl.mode !== original.mode) await setModeSafely(original.mode, { onProgress });
      } catch (_) {}
      throw error;
    }
  };

  const createBackgroundJob = async (kind, target = {}) => {
    const currentConfig = await readConfig(true);
    const existing = state.syncJob.current;
    if (existing && !syncJobTerminal(existing.status)) {
      const sameTarget = existing.kind === kind
        && String(existing.targetMode || '') === String(target.mode || '')
        && String(existing.targetUrl || '') === String(target.url || '');
      if (sameTarget) return cloneSyncJob(existing);
      const error = new Error(`memory_suite_background_job_busy:${existing.kind}:${existing.status}`);
      error.code = 'MEMORY_SUITE_SYNC_JOB_BUSY';
      error.job = cloneSyncJob(existing);
      throw error;
    }
    let random = '';
    try { random = globalThis?.crypto?.randomUUID?.() || ''; } catch (_) {}
    if (!random) random = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    const job = {
      schema: SYNC_JOB_SCHEMA,
      namespace,
      pluginId,
      pluginVersion,
      jobId: `${namespace}_${kind}_${random}`.replace(/[^A-Za-z0-9._:-]/g, '_').slice(0, 220),
      kind,
      status: 'queued',
      phase: 'queued',
      sourceMode: currentConfig.mode,
      sourceUrl: currentConfig.url,
      targetMode: target.mode ? normalizeMode(target.mode) : currentConfig.mode,
      targetUrl: target.url ? normalizeServerUrl(target.url) : currentConfig.url,
      totalItems: 0,
      processedItems: 0,
      processedBytes: 0,
      transferredBytes: 0,
      uploaded: 0,
      restored: 0,
      matched: 0,
      removedByTombstone: 0,
      failures: 0,
      conflicts: 0,
      retryCount: 0,
      nextRetryAt: 0,
      currentSpace: '',
      currentKey: '',
      currentAction: '',
      message: '',
      spaces: {},
      startedAt: Date.now(),
      updatedAt: Date.now(),
      lastActivityAt: Date.now(),
      finishedAt: 0,
      result: null,
      error: ''
    };
    state.syncJob.current = job;
    state.syncJob.loaded = true;
    notifySyncJob();
    await persistSyncJobNow();
    return cloneSyncJob(job);
  };

  const completeBackgroundJob = async (result = null) => {
    updateSyncJob({
      status: 'completed', phase: 'completed', currentAction: '완료', currentKey: '',
      message: '작업이 안전하게 완료되었습니다.', result: result ? cloneSyncJob(result) : null,
      error: '', nextRetryAt: 0, finishedAt: Date.now()
    }, { persist: 'immediate' });
    return getSyncJob();
  };

  const failBackgroundJob = async error => {
    updateSyncJob({
      status: 'failed', phase: 'failed', currentAction: '작업 중단', currentKey: '',
      message: '작업을 완료하지 못했습니다.', error: compact(error?.message || error, 700),
      nextRetryAt: 0, finishedAt: Date.now()
    }, { persist: 'immediate' });
    return getSyncJob();
  };

  const executeBackgroundJob = async () => {
    const job = state.syncJob.current;
    if (!job || syncJobTerminal(job.status)) return getSyncJob();
    if (state.syncJob.promise) return state.syncJob.promise;
    if (state.syncJob.retryTimer) { clearTimeout(state.syncJob.retryTimer); state.syncJob.retryTimer = null; }
    updateSyncJob({ status: 'running', phase: job.phase === 'resume_pending' ? 'resuming' : (job.phase || 'starting'), nextRetryAt: 0, error: '' });
    const runner = (async () => {
      try {
        let result;
        if (job.kind === 'connection_config') {
          result = await configureConnection({ mode: job.targetMode, url: job.targetUrl }, { onProgress: applySyncProgressToJob });
        } else if (job.kind === 'manual_sync') {
          result = await synchronizeAllLegacy({ allowOverwrite: true, restoreMissingLocal: true, onProgress: applySyncProgressToJob });
          if (!result.ok) throw new Error(`sync_failures:${result.failures.length}`);
        } else if (job.kind === 'server_restore') {
          result = await restoreAllLegacyFromServer({ pruneUntracked: false, requireFullCoverage: false, onProgress: applySyncProgressToJob });
          if (!result.ok) throw new Error(`restore_failures:${result.failures.length}`);
        } else {
          throw new Error(`memory_suite_unknown_background_job:${job.kind}`);
        }
        await completeBackgroundJob(result);
        return result;
      } catch (error) {
        if (retryableSyncError(error) && Number(state.syncJob.current?.retryCount || 0) < 120) {
          const retryCount = Number(state.syncJob.current?.retryCount || 0) + 1;
          const delay = SYNC_JOB_RETRY_DELAYS_MS[Math.min(SYNC_JOB_RETRY_DELAYS_MS.length - 1, retryCount - 1)];
          updateSyncJob({
            status: 'paused', phase: 'waiting_for_server', currentAction: '서버 재연결 대기',
            message: `서버 연결이 일시적으로 끊겼습니다. ${Math.ceil(delay / 1000)}초 후 이어서 확인합니다.`,
            error: compact(error?.message || error, 420), retryCount, nextRetryAt: Date.now() + delay
          }, { persist: 'immediate' });
          state.syncJob.retryTimer = setTimeout(() => {
            state.syncJob.retryTimer = null;
            void executeBackgroundJob();
          }, delay);
          try { state.syncJob.retryTimer?.unref?.(); } catch (_) {}
          return null;
        }
        await failBackgroundJob(error);
        throw error;
      }
    })();
    state.syncJob.promise = runner.finally(() => { state.syncJob.promise = null; });
    return state.syncJob.promise;
  };

  const startConnectionConfigurationJob = async settings => {
    const requested = settings && typeof settings === 'object' ? settings : {};
    const current = await readConfig(true);
    const target = {
      mode: normalizeMode(requested.mode ?? current.mode),
      url: normalizeServerUrl(requested.url ?? current.url)
    };
    const job = await createBackgroundJob('connection_config', target);
    void executeBackgroundJob().catch(() => {});
    return job;
  };

  const startSynchronizationJob = async () => {
    const current = await readConfig(true);
    if (current.mode !== MODE_MIRROR) throw new Error('memory_suite_manual_sync_requires_mirror_mode');
    const job = await createBackgroundJob('manual_sync', { mode: current.mode, url: current.url });
    void executeBackgroundJob().catch(() => {});
    return job;
  };

  const startRestoreJob = async () => {
    const current = await readConfig(true);
    if (current.mode !== MODE_SERVER_ONLY) throw new Error('memory_suite_restore_requires_server_only_mode');
    const job = await createBackgroundJob('server_restore', { mode: current.mode, url: current.url });
    void executeBackgroundJob().catch(() => {});
    return job;
  };

  const resumePendingSyncJob = async () => {
    await loadPersistedSyncJob();
    const job = state.syncJob.current;
    if (!job || syncJobTerminal(job.status)) return cloneSyncJob(job);
    if (!state.legacy.plugin) return cloneSyncJob(job);
    void executeBackgroundJob().catch(() => {});
    return cloneSyncJob(job);
  };

  const waitForSyncJob = async (jobId = '', timeoutMs = 15 * 60 * 1000) => {
    const wanted = String(jobId || state.syncJob.current?.jobId || '');
    if (!wanted) return null;
    const current = state.syncJob.current;
    if (current?.jobId === wanted && syncJobTerminal(current.status)) return cloneSyncJob(current);
    return await new Promise((resolve, reject) => {
      let timer = null;
      const unsubscribe = subscribeSyncJob(job => {
        if (!job || job.jobId !== wanted || !syncJobTerminal(job.status)) return;
        if (timer) clearTimeout(timer);
        unsubscribe();
        resolve(job);
      });
      timer = setTimeout(() => {
        unsubscribe();
        reject(new Error(`memory_suite_sync_job_wait_timeout:${wanted}`));
      }, Math.max(1000, Number(timeoutMs || 0) || 15 * 60 * 1000));
    });
  };

  const getConnectionSettings = async (options = {}) => {
    const config = await readConfig(options.force === true);
    const result = {
      schema: 'memory-suite.connection-settings.v1',
      namespace,
      pluginId,
      pluginVersion,
      mode: config.mode,
      modeLabel: modeLabel(config.mode),
      url: config.url,
      status: { ...state.status },
      migration: { plugin: { ...state.migration.plugin }, local: { ...state.migration.local } },
      syncJob: getSyncJob(),
      diagnostics: {
        ready: !!state.diagnostics.value,
        reachable: state.diagnostics.value?.reachable ?? null,
        updatedAt: Number(state.diagnostics.at || 0),
        eventCount: Array.isArray(state.diagnostics.value?.events) ? state.diagnostics.value.events.length : 0,
        error: String(state.diagnostics.value?.error || '')
      }
    };
    if (options.test === true) result.connection = await testConnection(config.url);
    return result;
  };

  const prepareServerScopeDeletion = async (options = {}) => {
    const pluginLegacy = state.legacy.plugin;
    if (!pluginLegacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const localLegacy = state.legacy.local;
    const pluginKeys = [...new Set((Array.isArray(options.pluginKeys) ? options.pluginKeys : []).map(String).filter(key => matchesRoute('plugin', key)))];
    const localKeys = [...new Set((Array.isArray(options.localKeys) ? options.localKeys : []).map(String).filter(key => matchesRoute('local', key)))];
    const current = await readConfig(true);
    const proofNeedsTransientServer = current.mode === MODE_PLUGIN_ONLY;
    if (proofNeedsTransientServer) state.transientMode = MODE_MIRROR;
    let beforeIntegrity;
    try { beforeIntegrity = await remoteIntegrity(); }
    catch (error) { if (proofNeedsTransientServer) state.transientMode = ''; throw error; }
    let pluginRestore = null;
    let localRestore = null;
    let pluginSync = null;
    let localSync = null;

    if (current.mode === MODE_MIRROR) {
      pluginSync = await synchronizeLegacyWithServer(pluginLegacy, 'plugin', { allowOverwrite: true, restoreMissingLocal: true });
      if (localLegacy && typeof localLegacy?.getItem === 'function') {
        localSync = await synchronizeLegacyWithServer(localLegacy, 'local', { allowOverwrite: true, restoreMissingLocal: true });
      }
    } else if (current.mode === MODE_SERVER_ONLY) {
      pluginRestore = await restoreServerSpaceToLegacy(pluginLegacy, 'plugin', { pruneUntracked: false, requireFullCoverage: false });
      if (localLegacy && typeof localLegacy?.getItem === 'function') {
        localRestore = await restoreServerSpaceToLegacy(localLegacy, 'local', { pruneUntracked: false, requireFullCoverage: false });
      } else if (localKeys.length) {
        const error = new Error('memory_suite_local_storage_required_for_scope_preservation');
        error.code = 'MEMORY_SUITE_LOCAL_STORAGE_UNAVAILABLE';
        throw error;
      }
    }

    const pluginProof = await verifyScopedLegacyPreservation(pluginLegacy, 'plugin', pluginKeys);
    const localProof = localKeys.length
      ? await verifyScopedLegacyPreservation(localLegacy, 'local', localKeys)
      : { schema: 'memory-suite.scoped-legacy-preservation.v1', namespace, space: 'local', requested: 0, exact: 0, tombstones: 0, failures: [], ok: true };

    let modeChanged = false;
    if (proofNeedsTransientServer) state.transientMode = '';
    if (current.mode !== MODE_PLUGIN_ONLY) {
      await persistMode(MODE_PLUGIN_ONLY);
      modeChanged = true;
    }
    const verifiedMode = await readConfig(true);
    if (verifiedMode.mode !== MODE_PLUGIN_ONLY) throw new Error(`memory_suite_scope_delete_mode_transition_failed:${verifiedMode.mode}`);
    const afterIntegrity = await remoteIntegrity({ allowPluginOnly: true });
    const receipt = {
      schema: 'memory-suite.server-scope-delete-owner-receipt.v1',
      namespace, pluginId, pluginVersion,
      scopeId: String(options.scopeId || '').slice(0, 320),
      scopeKey: String(options.scopeKey || '').slice(0, 700),
      modeBefore: current.mode,
      modeAfter: MODE_PLUGIN_ONLY,
      modeChanged,
      verified: pluginProof.ok === true && localProof.ok === true && afterIntegrity.ok === true,
      pluginKeys: pluginKeys.length,
      localKeys: localKeys.length,
      pluginProof,
      localProof,
      pluginRestore,
      localRestore,
      pluginSync,
      localSync,
      integrityBefore: beforeIntegrity,
      integrityAfter: afterIntegrity,
      checkedAt: Date.now()
    };
    if (receipt.verified !== true) {
      const error = new Error('memory_suite_scope_delete_owner_proof_incomplete');
      error.code = 'MEMORY_SUITE_SCOPE_DELETE_OWNER_PROOF_INCOMPLETE';
      error.receipt = receipt;
      throw error;
    }
    state.management.lastResult = receipt;
    setStatus('scope_delete_owner_ready', '', { mode: MODE_PLUGIN_ONLY, scopeId: receipt.scopeId });
    return receipt;
  };

  const deletePluginStorageAfterServerVerification = async () => {
    const legacy = state.legacy.plugin;
    if (!legacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const current = await readConfig(true);
    if (current.mode === MODE_PLUGIN_ONLY) {
      const error = new Error('pluginStorage 삭제는 플러그인 + 서버 병존 또는 서버 단독 모드에서만 사용할 수 있습니다.');
      error.code = 'MEMORY_SUITE_DELETE_REQUIRES_SERVER_MODE';
      throw error;
    }
    const preservation = await verifyServerPreservation(legacy);
    let modeChanged = false;
    if (current.mode === MODE_MIRROR) {
      await persistMode(MODE_SERVER_ONLY);
      modeChanged = true;
    }
    const allKeys = await listRoutedLegacyKeys(legacy, 'plugin', true);
    const logicalKeys = allKeys.filter(key => matchesRoute('plugin', key));
    const artifactKeys = allKeys.filter(key => !matchesRoute('plugin', key) && isOwnedChunkArtifact('plugin', key));
    const failures = [];
    let deleted = 0;
    for (const key of logicalKeys) {
      try {
        const ok = await legacyRemoveVerified(legacy, key);
        if (!ok) throw new Error('pluginstorage_delete_failed');
        deleted += 1;
      } catch (error) { failures.push({ key, error: compact(error?.message || error, 220) }); }
    }
    for (const key of artifactKeys) {
      try {
        const ok = await legacyRemoveVerified(legacy, key);
        if (ok) deleted += 1;
      } catch (error) { failures.push({ key, error: compact(error?.message || error, 220) }); }
    }
    const remaining = await listRoutedLegacyKeys(legacy, 'plugin', true).catch(() => []);
    if (remaining.length) failures.push({ key: '*', error: `pluginstorage_keys_remaining:${remaining.length}` });
    const result = { schema: 'memory-suite.pluginstorage-delete.v1', namespace, preservation, modeChanged, mode: MODE_SERVER_ONLY, deleted, logicalDeleted: logicalKeys.length, artifactDeleted: artifactKeys.length, remaining, failures, ok: failures.length === 0 };
    state.management.lastResult = result;
    if (!result.ok) {
      const error = new Error(`memory_suite_pluginstorage_delete_incomplete:${failures.length}`);
      error.code = 'MEMORY_SUITE_PLUGINSTORAGE_DELETE_INCOMPLETE';
      error.result = result;
      throw error;
    }
    setStatus('pluginstorage_deleted', '', { mode: MODE_SERVER_ONLY, deleted });
    return result;
  };

  const migrateAllLegacy = async (legacy, space) => {
    const target = state.migration[space] || state.migration.plugin;
    const startedAt = Date.now();
    target.state = 'running'; target.at = startedAt; target.reason = '';
    target.scanned = 0; target.migrated = 0; target.skipped = 0; target.failed = 0;
    const config = await readConfig();
    if (config.mode === MODE_PLUGIN_ONLY) {
      target.state = 'plugin_only';
      return { ...target };
    }
    if (typeof legacy?.keys !== 'function' || typeof legacy?.getItem !== 'function') {
      target.state = 'lazy_only'; target.reason = 'legacy_key_enumeration_unavailable'; return { ...target };
    }
    if (config.mode === MODE_MIRROR && space === 'plugin') {
      try {
        const synced = await synchronizeLegacyWithServer(legacy, space, { allowOverwrite: true, restoreMissingLocal: true });
        target.scanned = synced.localKeys; target.migrated = synced.uploaded; target.skipped = synced.matched + synced.restored; target.failed = synced.failures.length;
        target.state = synced.ok ? 'complete' : 'partial'; target.at = Date.now();
        return { ...target, durationMs: Date.now() - startedAt };
      } catch (error) {
        target.state = 'partial'; target.failed += 1; target.reason = compact(error?.message || error, 240); target.at = Date.now();
        return { ...target, durationMs: Date.now() - startedAt };
      }
    }
    const listed = await legacy.keys();
    const keysToInspect = [...new Set((Array.isArray(listed) ? listed : []).map(String).filter(key => matchesRoute(space, key)))];
    target.scanned = keysToInspect.length;
    let cursor = 0;
    const worker = async () => {
      while (cursor < keysToInspect.length) {
        const index = cursor; cursor += 1; const key = keysToInspect[index];
        try {
          const result = await migrateFromLegacy(space, key, async () => await legacy.getItem(key));
          if (result.state === 'migrated') target.migrated += 1; else target.skipped += 1;
        } catch (error) { target.failed += 1; target.reason = compact(error?.message || error, 240); }
      }
    };
    await Promise.all(Array.from({ length: Math.min(migrationConcurrency, Math.max(1, keysToInspect.length)) }, () => worker()));
    target.state = target.failed > 0 ? 'partial' : 'complete'; target.at = Date.now();
    return { ...target, durationMs: Date.now() - startedAt };
  };

  const scheduleLegacyMigration = (legacy, space, force = false) => {
    const enabled = space === 'local' ? autoMigrateLocal : autoMigratePlugin;
    if (!enabled || !legacy || (typeof legacy !== 'object' && typeof legacy !== 'function')) return null;
    let record = migrationStateByLegacy.get(legacy);
    const timestamp = Date.now();
    if (!record) { record = { running: null, timer: null, completed: false, retryAt: 0, space }; migrationStateByLegacy.set(legacy, record); }
    if (record.running) return record.running;
    if (!force && record.completed) return null;
    if (!force && record.retryAt > timestamp) return null;
    if (record.timer) return null;
    record.timer = setTimeout(() => {
      record.timer = null;
      record.running = migrateAllLegacy(legacy, space)
        .then(result => {
          record.completed = result.state === 'complete' || result.state === 'plugin_only' || result.state === 'lazy_only';
          record.retryAt = result.state === 'partial' ? Date.now() + migrationRetryMs : 0;
          return result;
        })
        .catch(error => {
          record.completed = false; record.retryAt = Date.now() + migrationRetryMs;
          const target = state.migration[space] || state.migration.plugin;
          target.state = 'failed'; target.reason = compact(error?.message || error, 240); target.at = Date.now();
          warnOnce(`migration_${space}_${target.reason}`, error);
          return { ...target };
        })
        .finally(() => { record.running = null; });
    }, migrationDelayMs + (space === 'local' ? 900 : 0));
    try { record.timer?.unref?.(); } catch (_) {}
    return null;
  };

  const get = async (space, key, legacyGet = null, legacySet = null, legacyRemove = null) => {
    if (!matchesRoute(space, key)) return typeof legacyGet === 'function' ? await legacyGet() : null;
    const config = await readConfig();
    if (config.mode === MODE_PLUGIN_ONLY) return typeof legacyGet === 'function' ? await legacyGet() : null;
    if (config.mode === MODE_MIRROR) {
      const localValue = typeof legacyGet === 'function' ? await legacyGet() : null;
      if (cachedBootstrapFailure(config.url)) {
        setStatus('server_unavailable_local_only', 'memory_suite_server_unavailable', { mode: MODE_MIRROR, key: compact(key, 160), space });
        return localValue;
      }
      if (!isNullishStorageValue(localValue)) {
        try {
          const remote = await remoteGet(space, key);
          if (remote.tombstone === true) {
            if (typeof legacyRemove === 'function') await legacyRemove();
            setStatus('server_tombstone_applied', '', { mode: MODE_MIRROR, key: compact(key, 160), space });
            return null;
          }
          void serializeMutation(space, key, async () => {
            try {
              if (remote.exists !== true || jsonComparable(remote.value) !== jsonComparable(localValue)) {
                await remoteMutate('set', space, key, localValue);
              }
              setStatus('synced', '', { mode: MODE_MIRROR, key: compact(key, 160), space });
            } catch (error) {
              setStatus('local_ahead', error?.message || error, { mode: MODE_MIRROR, key: compact(key, 160), space });
            }
          });
          return localValue;
        } catch (error) {
          setStatus('server_unavailable_local_only', error?.message || error, { mode: MODE_MIRROR, key: compact(key, 160), space });
          return localValue;
        }
      }
      try {
        const remote = await remoteGet(space, key);
        if (remote.exists === true) {
          if (typeof legacySet === 'function') await legacySet(remote.value);
          return remote.value;
        }
        if (remote.tombstone === true && typeof legacyRemove === 'function') await legacyRemove();
        return null;
      } catch (error) {
        setStatus('server_unavailable_local_only', error?.message || error, { mode: MODE_MIRROR, key: compact(key, 160), space });
        return null;
      }
    }
    const remote = await remoteGet(space, key);
    if (remote.exists === true) return remote.value;
    if (remote.tombstone === true) return null;
    const migrated = await migrateFromLegacy(space, key, legacyGet);
    return migrated.value;
  };

  const set = async (space, key, value, legacySet = null) => {
    if (!matchesRoute(space, key)) return typeof legacySet === 'function' ? await legacySet(value) : false;
    const config = await readConfig();
    if (config.mode === MODE_PLUGIN_ONLY) return typeof legacySet === 'function' ? await legacySet(value) : false;
    if (config.mode === MODE_MIRROR) {
      const localOk = typeof legacySet === 'function' ? await legacySet(value) : false;
      if (!localOk) return false;
      try {
        await serializeMutation(space, key, () => remoteMutate('set', space, key, value));
        setStatus('synced', '', { mode: MODE_MIRROR, key: compact(key, 160), space });
      } catch (error) {
        setStatus('local_ahead', error?.message || error, { mode: MODE_MIRROR, key: compact(key, 160), space });
        warnOnce(`mirror_server_write_${compact(key, 80)}`, error);
      }
      return true;
    }
    await serializeMutation(space, key, () => remoteMutate('set', space, key, value));
    return true;
  };

  const remove = async (space, key, legacyGet = null, legacySet = null, legacyRemove = null) => {
    if (!matchesRoute(space, key)) return typeof legacyRemove === 'function' ? await legacyRemove() : false;
    const config = await readConfig();
    if (config.mode === MODE_PLUGIN_ONLY) return typeof legacyRemove === 'function' ? await legacyRemove() : false;
    if (config.mode === MODE_MIRROR) {
      const previousLocal = typeof legacyGet === 'function' ? await legacyGet() : null;
      try {
        await serializeMutation(space, key, () => remoteMutate('remove', space, key, null));
      } catch (error) {
        setStatus('mirror_delete_blocked', error?.message || error, { mode: MODE_MIRROR, key: compact(key, 160), space });
        return false;
      }
      const localOk = typeof legacyRemove === 'function' ? await legacyRemove() : false;
      if (!localOk) {
        if (!isNullishStorageValue(previousLocal)) {
          try { await serializeMutation(space, key, () => remoteMutate('set', space, key, previousLocal)); } catch (_) {}
        }
        setStatus('mirror_delete_rolled_back', 'pluginStorage remove failed', { mode: MODE_MIRROR, key: compact(key, 160), space });
        return false;
      }
      setStatus('synced', '', { mode: MODE_MIRROR, key: compact(key, 160), space });
      return true;
    }
    await serializeMutation(space, key, () => remoteMutate('remove', space, key, null));
    return true;
  };

  const keys = async (space, prefix = '', legacyKeysFn = null) => {
    const config = await readConfig();
    const legacy = typeof legacyKeysFn === 'function' ? await legacyKeysFn() : [];
    const legacyList = Array.isArray(legacy) ? legacy.map(String).filter(Boolean) : [];
    if (config.mode === MODE_PLUGIN_ONLY) return legacyList;
    let remote = { keys: [], tombstones: [] };
    try { remote = await remoteKeys(space, prefix); }
    catch (error) {
      if (config.mode === MODE_MIRROR) return legacyList;
      throw error;
    }
    const serverKeys = Array.isArray(remote.keys) ? remote.keys.map(String) : [];
    const tombstones = new Set(Array.isArray(remote.tombstones) ? remote.tombstones.map(String) : []);
    const hiddenLegacyKey = key => {
      if (!matchesRoute(space, key)) return false;
      if (tombstones.has(key)) return true;
      for (const tombstone of tombstones) if (key.startsWith(`${tombstone}::chunk:v1:`)) return true;
      return false;
    };
    return [...new Set([...serverKeys, ...legacyList.filter(key => !hiddenLegacyKey(key))])];
  };

  const createProxy = (legacy, space, cache) => {
    if (!legacy || (typeof legacy !== 'object' && typeof legacy !== 'function')) return legacy;
    state.legacy[space] = legacy;
    if (space === 'plugin') setTimeout(() => { void resumePendingSyncJob().catch(() => {}); }, 0);
    if (cache.has(legacy)) { scheduleLegacyMigration(legacy, space); return cache.get(legacy); }
    const proxy = Object.freeze({
      getItem: async key => await get(
        space,
        String(key),
        async () => typeof legacy.getItem === 'function' ? await legacy.getItem(key) : null,
        async next => typeof legacy.setItem === 'function' ? (await legacy.setItem(key, next)) !== false : false,
        async () => {
          if (typeof legacy.removeItem === 'function') return (await legacy.removeItem(key)) !== false;
          if (typeof legacy.setItem === 'function') return (await legacy.setItem(key, null)) !== false;
          return false;
        }
      ),
      setItem: async (key, value) => await set(space, String(key), value, async next => typeof legacy.setItem === 'function' ? (await legacy.setItem(key, next)) !== false : false),
      removeItem: async key => await remove(
        space,
        String(key),
        async () => typeof legacy.getItem === 'function' ? await legacy.getItem(key) : null,
        async next => typeof legacy.setItem === 'function' ? (await legacy.setItem(key, next)) !== false : false,
        async () => {
          if (typeof legacy.removeItem === 'function') return (await legacy.removeItem(key)) !== false;
          if (typeof legacy.setItem === 'function') return (await legacy.setItem(key, null)) !== false;
          return false;
        }
      ),
      keys: async () => await keys(space, '', async () => typeof legacy.keys === 'function' ? await legacy.keys() : []),
      migrateAll: async () => await migrateAllLegacy(legacy, space)
    });
    cache.set(legacy, proxy);
    scheduleLegacyMigration(legacy, space);
    return proxy;
  };

  const connectionPanelIdBase = `memory-suite-connection-${namespace}`.replace(/[^A-Za-z0-9_-]/g, '_');
  let connectionPanelSequence = 0;

  const htmlEscape = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const mountConnectionPanel = async (container, panelOptions = {}) => {
    if (!container || typeof container.querySelector !== 'function') return false;
    const instanceId = `${connectionPanelIdBase}-${++connectionPanelSequence}`;
    const title = String(panelOptions.title || `${displayName} · 서버 연결`).trim();
    const description = String(panelOptions.description || '저장 방식과 Memory Suite 서버 주소를 설정하고 연결 상태를 확인합니다.').trim();
    const config = await readConfig(true).catch(error => ({ mode: MODE_PLUGIN_ONLY, url: defaultUrl, error: compact(error?.message || error, 300) }));
    const fmtBytes = bytes => {
      const value = Math.max(0, Number(bytes || 0) || 0);
      if (value < 1024) return `${Math.round(value)} B`;
      if (value < 1024 ** 2) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)} KB`;
      if (value < 1024 ** 3) return `${(value / (1024 ** 2)).toFixed(value < 10 * 1024 ** 2 ? 1 : 0)} MB`;
      return `${(value / (1024 ** 3)).toFixed(2)} GB`;
    };
    const fmtDuration = ms => {
      const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
      if (total < 60) return `${total}초`;
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      if (minutes < 60) return `${minutes}분 ${seconds}초`;
      return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
    };
    const phaseLabel = phase => ({
      queued: '작업 준비', starting: '작업 시작', resuming: '이전 작업 재개', resume_pending: '재개 대기',
      configuration_start: '설정 변경 준비', connection_test: '서버 연결 확인', connection_ready: '서버 연결 확인 완료',
      seed_new_server: '새 서버 기준선 생성', mode_transition: '저장 모드 전환 준비',
      integrity_before: '서버 무결성 확인', inventory: '데이터 조사 중', inventory_complete: '데이터 조사 완료',
      sync_local: 'pluginStorage → 서버 동기화', restore_missing_local: '서버 → pluginStorage 보충',
      restore_before_url_change: '기존 서버 데이터 복구', prune_local: '로컬 정리', restore_values: '서버 데이터 복구',
      restore_tombstones: '삭제 상태 복구', integrity_after: '최종 무결성 확인', space_complete: '저장소 동기화 완료',
      space_incomplete: '동기화 확인 필요', configuration_complete: '설정 적용 완료', configuration_rollback: '이전 설정 복구',
      waiting_for_server: '서버 재연결 대기', completed: '완료', failed: '실패'
    }[String(phase || '')] || String(phase || '작업 중'));
    const jobTitle = job => job?.kind === 'manual_sync' ? '수동 동기화'
      : (job?.kind === 'server_restore' ? '서버 → pluginStorage 복구'
        : ((job?.sourceMode === MODE_PLUGIN_ONLY && job?.targetMode !== MODE_PLUGIN_ONLY) ? '초기 서버 동기화' : '저장 설정 전환'));

    container.innerHTML = `
      <section class="mscx" data-memory-suite-connection-panel="${htmlEscape(namespace)}">
        <style>
          #${instanceId}{--mscx-bg:rgba(15,23,42,.72);--mscx-card:rgba(30,41,59,.76);--mscx-soft:rgba(15,23,42,.68);--mscx-line:rgba(148,163,184,.25);--mscx-text:#eef4ff;--mscx-muted:#9eabc1;--mscx-accent:#7aa2ff;--mscx-good:#56d49b;--mscx-warn:#f0b65a;--mscx-danger:#fb7185;color:var(--mscx-text);display:grid;gap:14px;font:500 13px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-width:0}
          #${instanceId} *{box-sizing:border-box} #${instanceId} .mscx-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:2px 2px 0} #${instanceId} h2{margin:0;font-size:20px;line-height:1.25;color:var(--mscx-text)} #${instanceId} .mscx-head p{margin:6px 0 0;color:var(--mscx-muted);font-size:12px}
          #${instanceId} .mscx-state{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border:1px solid var(--mscx-line);border-radius:999px;background:var(--mscx-soft);white-space:nowrap;font-size:11px;font-weight:800;color:var(--mscx-muted)} #${instanceId} .mscx-dot{width:8px;height:8px;border-radius:50%;background:var(--mscx-muted)} #${instanceId} .mscx-state.good .mscx-dot{background:var(--mscx-good);box-shadow:0 0 0 4px rgba(86,212,155,.12)} #${instanceId} .mscx-state.warn .mscx-dot{background:var(--mscx-warn)} #${instanceId} .mscx-state.error .mscx-dot{background:var(--mscx-danger)}
          #${instanceId} .mscx-card{padding:14px;border:1px solid var(--mscx-line);border-radius:15px;background:var(--mscx-card);min-width:0} #${instanceId} .mscx-card-title{display:block;margin-bottom:9px;font-size:12px;font-weight:850;color:var(--mscx-text)}
          #${instanceId} .mscx-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px} #${instanceId} .mscx-mode{position:relative;display:grid;gap:4px;padding:12px;border:1px solid var(--mscx-line);border-radius:12px;background:var(--mscx-soft);cursor:pointer;min-width:0} #${instanceId} .mscx-mode.selected,#${instanceId} .mscx-mode:has(input:checked){border-color:var(--mscx-accent);box-shadow:0 0 0 1px var(--mscx-accent) inset;background:rgba(81,116,200,.13)} #${instanceId} .mscx-mode input{position:absolute;right:10px;top:10px;accent-color:var(--mscx-accent)} #${instanceId} .mscx-mode strong{padding-right:22px;font-size:12px;color:var(--mscx-text)} #${instanceId} .mscx-mode small{color:var(--mscx-muted);font-size:10px;line-height:1.45}
          #${instanceId} .mscx-url-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px} #${instanceId} input[type="url"],#${instanceId} input[type="password"]{width:100%;min-width:0;padding:10px 11px;border:1px solid var(--mscx-line);border-radius:10px;background:var(--mscx-soft);color:var(--mscx-text);font:500 12px ui-monospace,SFMono-Regular,Consolas,monospace;outline:none} #${instanceId} input[type="url"]:focus,#${instanceId} input[type="password"]:focus{border-color:var(--mscx-accent);box-shadow:0 0 0 3px rgba(122,162,255,.12)}
          #${instanceId} .mscx-actions{display:flex;flex-wrap:wrap;gap:8px} #${instanceId} button{min-height:38px;padding:8px 12px;border:1px solid var(--mscx-line);border-radius:10px;background:var(--mscx-soft);color:var(--mscx-text);font:750 11px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer} #${instanceId} button:hover{border-color:rgba(122,162,255,.65);background:rgba(70,94,150,.22)} #${instanceId} button.primary{background:rgba(55,97,181,.72);border-color:rgba(122,162,255,.75)} #${instanceId} button.danger{color:#ffe4e8;background:rgba(126,34,52,.55);border-color:rgba(251,113,133,.55)} #${instanceId} button:disabled{opacity:.45;cursor:not-allowed}
          #${instanceId} .mscx-info{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px} #${instanceId} .mscx-info div{padding:9px 10px;border:1px solid var(--mscx-line);border-radius:10px;background:var(--mscx-soft);min-width:0} #${instanceId} .mscx-info span{display:block;color:var(--mscx-muted);font-size:9px;font-weight:800} #${instanceId} .mscx-info strong{display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--mscx-text)}
          #${instanceId} .mscx-job{display:grid;gap:10px;border-color:rgba(122,162,255,.34);background:linear-gradient(180deg,rgba(35,55,97,.45),rgba(15,23,42,.58))} #${instanceId} .mscx-job[hidden]{display:none} #${instanceId} .mscx-job-head{display:flex;justify-content:space-between;gap:10px;align-items:center} #${instanceId} .mscx-job-head strong{font-size:13px} #${instanceId} .mscx-job-badge{font-size:10px;font-weight:850;color:var(--mscx-muted)}
          #${instanceId} .mscx-progress{height:9px;border-radius:999px;overflow:hidden;background:rgba(2,6,23,.6);border:1px solid rgba(148,163,184,.18)} #${instanceId} .mscx-progress>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--mscx-accent),var(--mscx-good));transition:width .25s ease} #${instanceId} .mscx-progress.indeterminate>i{width:38%;animation:mscx-slide 1.2s ease-in-out infinite}@keyframes mscx-slide{0%{transform:translateX(-110%)}100%{transform:translateX(290%)}}
          #${instanceId} .mscx-job-phase{font-size:12px;font-weight:800;color:var(--mscx-text)} #${instanceId} .mscx-job-message{font-size:10px;color:var(--mscx-muted)} #${instanceId} .mscx-job-stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px} #${instanceId} .mscx-job-stat{padding:8px;border-radius:9px;background:rgba(2,6,23,.38);border:1px solid rgba(148,163,184,.16);min-width:0} #${instanceId} .mscx-job-stat span{display:block;font-size:8px;color:var(--mscx-muted);font-weight:800} #${instanceId} .mscx-job-stat b{display:block;margin-top:2px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} #${instanceId} .mscx-job-current{padding:8px 9px;border-radius:9px;background:rgba(2,6,23,.35);font:500 9px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--mscx-muted);overflow-wrap:anywhere}
          #${instanceId} .mscx-message{min-height:56px;padding:11px 12px;border:1px solid var(--mscx-line);border-radius:11px;background:var(--mscx-soft);color:var(--mscx-muted);white-space:pre-wrap;font-size:11px} #${instanceId} .mscx-message.good{border-color:rgba(86,212,155,.35);color:#c9f8e4} #${instanceId} .mscx-message.error{border-color:rgba(251,113,133,.38);color:#ffd0d8} #${instanceId} .mscx-note{color:var(--mscx-muted);font-size:10px;line-height:1.5}
          @media(max-width:760px){#${instanceId} .mscx-modes{grid-template-columns:1fr}#${instanceId} .mscx-info{grid-template-columns:repeat(2,minmax(0,1fr))}#${instanceId} .mscx-job-stats{grid-template-columns:repeat(2,minmax(0,1fr))}#${instanceId} .mscx-url-row{grid-template-columns:1fr}#${instanceId} .mscx-head{display:grid}#${instanceId} .mscx-state{justify-self:start}}
        </style>
        <div id="${instanceId}">
          <div class="mscx-head"><div><h2>${htmlEscape(title)}</h2><p>${htmlEscape(description)}</p></div><div class="mscx-state" data-mscx-state><span class="mscx-dot"></span><span data-mscx-state-text>상태 확인 중</span></div></div>
          <div class="mscx-card"><span class="mscx-card-title">저장 방식</span><div class="mscx-modes">
            <label class="mscx-mode"><input type="radio" name="${instanceId}-mode" value="plugin_only"><strong>플러그인 단독 · 기본</strong><small>RisuAI pluginStorage만 사용합니다. 서버가 없어도 정상 작동합니다.</small></label>
            <label class="mscx-mode"><input type="radio" name="${instanceId}-mode" value="mirror"><strong>플러그인 + 서버 병존</strong><small>pluginStorage와 DATA 서버를 계속 동기화합니다.</small></label>
            <label class="mscx-mode"><input type="radio" name="${instanceId}-mode" value="server_only"><strong>서버 단독</strong><small>Memory Suite DATA를 영구 정본으로 사용합니다.</small></label>
          </div></div>
          <div class="mscx-card"><span class="mscx-card-title">서버 주소</span><div class="mscx-url-row"><input data-mscx-url type="url" spellcheck="false" value="${htmlEscape(config.url || defaultUrl)}"><button data-mscx-test type="button">연결 테스트</button></div><div class="mscx-note" style="margin-top:8px">별도 key 입력 없이 localhost·127.0.0.1·::1의 로컬 서버에 연결합니다. 기본 주소는 http://127.0.0.1:47630 입니다.</div></div>
          <div class="mscx-info"><div><span>현재 모드</span><strong data-mscx-mode-label>${htmlEscape(modeLabel(config.mode || MODE_PLUGIN_ONLY))}</strong></div><div><span>서버 버전</span><strong data-mscx-version>-</strong></div><div><span>프로토콜</span><strong data-mscx-protocol>-</strong></div><div><span>서버 데이터</span><strong data-mscx-records>-</strong></div><div><span>namespace</span><strong>${htmlEscape(namespace)}</strong></div></div>
          <div class="mscx-actions"><button data-mscx-apply class="primary" type="button">설정 적용</button><button data-mscx-sync type="button">지금 동기화</button><button data-mscx-restore type="button">서버 → pluginStorage 복구</button><button data-mscx-delete class="danger" type="button">플러그인 스토리지 삭제</button></div>
          <div class="mscx-card mscx-job" data-mscx-job hidden><div class="mscx-job-head"><strong data-mscx-job-title>초기 서버 동기화</strong><span class="mscx-job-badge" data-mscx-job-badge>작업 중</span></div><div class="mscx-progress" data-mscx-progress><i></i></div><div><div class="mscx-job-phase" data-mscx-job-phase>작업 준비</div><div class="mscx-job-message" data-mscx-job-message></div></div><div class="mscx-job-stats"><div class="mscx-job-stat"><span>진행</span><b data-mscx-job-items>-</b></div><div class="mscx-job-stat"><span>처리 용량</span><b data-mscx-job-bytes>-</b></div><div class="mscx-job-stat"><span>전송·복구</span><b data-mscx-job-transfer>-</b></div><div class="mscx-job-stat"><span>경과 시간</span><b data-mscx-job-elapsed>-</b></div><div class="mscx-job-stat"><span>마지막 활동</span><b data-mscx-job-activity>-</b></div><div class="mscx-job-stat"><span>재시도 / 실패</span><b data-mscx-job-retry>-</b></div></div><div class="mscx-job-current" data-mscx-job-current>현재 작업을 준비하고 있습니다.</div><div class="mscx-note">이 화면을 닫아도 작업은 계속됩니다. 새로고침 후에는 저장된 작업 영수증을 읽고 이미 서버에 일치하는 항목을 다시 전송하지 않고 이어서 확인합니다.</div></div>
          <div class="mscx-message" data-mscx-message>${htmlEscape(config.error ? `설정 읽기 실패: ${config.error}` : `현재 모드: ${modeLabel(config.mode || MODE_PLUGIN_ONLY)}`)}</div>
        </div>
      </section>`;

    const root = container.querySelector(`#${instanceId}`);
    if (!root) return false;
    let currentConfig = { ...config };
    let lastTerminalHandled = '';
    const q = selector => root.querySelector(selector);
    const modeInputs = () => Array.from(root.querySelectorAll(`input[name="${instanceId}-mode"]`));
    const selectedMode = () => modeInputs().find(input => input.checked)?.value || MODE_PLUGIN_ONLY;
    const updateModeSelectionStyles = () => modeInputs().forEach(input => input.closest?.('.mscx-mode')?.classList?.toggle('selected', input.checked === true));
    modeInputs().forEach(input => { input.checked = input.value === (currentConfig.mode || MODE_PLUGIN_ONLY); input.addEventListener?.('change', updateModeSelectionStyles); });
    updateModeSelectionStyles();
    const messageNode = q('[data-mscx-message]');
    const stateNode = q('[data-mscx-state]');
    const setMessage = (value, tone = '') => { if (messageNode) { messageNode.textContent = String(value || ''); messageNode.className = `mscx-message${tone ? ` ${tone}` : ''}`; } };
    const setConnectionUi = result => {
      const ok = result?.ok === true;
      if (stateNode) stateNode.className = `mscx-state ${ok ? 'good' : 'error'}`;
      const stateText = q('[data-mscx-state-text]'); if (stateText) stateText.textContent = ok ? '서버 연결됨' : ((currentConfig.mode || MODE_PLUGIN_ONLY) === MODE_PLUGIN_ONLY ? '플러그인 단독' : '서버 연결 안 됨');
      const version = q('[data-mscx-version]'); if (version) version.textContent = ok ? (result.serverVersion || '-') : '-';
      const protocol = q('[data-mscx-protocol]'); if (protocol) protocol.textContent = ok ? `${Number(result.protocol?.major || 0)}.${Number(result.protocol?.minor || 0)}` : '-';
      const records = q('[data-mscx-records]'); if (records) records.textContent = ok ? `${Number(result.liveRecords || 0).toLocaleString()}건` : '-';
    };
    const setPluginOnlyUi = () => {
      if (stateNode) stateNode.className = 'mscx-state warn';
      const stateText = q('[data-mscx-state-text]'); if (stateText) stateText.textContent = '플러그인 단독';
      const version = q('[data-mscx-version]'); if (version) version.textContent = '-';
      const protocol = q('[data-mscx-protocol]'); if (protocol) protocol.textContent = '-';
      const records = q('[data-mscx-records]'); if (records) records.textContent = '-';
    };
    const renderJob = job => {
      const node = q('[data-mscx-job]');
      if (!node) return;
      if (!job) { node.hidden = true; return; }
      node.hidden = false;
      const terminal = syncJobTerminal(job.status);
      const total = Math.max(0, Number(job.totalItems || 0) || 0);
      const processed = Math.max(0, Number(job.processedItems || 0) || 0);
      const percent = total > 0 ? Math.max(0, Math.min(100, processed / total * 100)) : 0;
      const progressNode = q('[data-mscx-progress]');
      if (progressNode) {
        progressNode.classList.toggle('indeterminate', !terminal && total <= 0);
        const bar = progressNode.querySelector('i'); if (bar && total > 0) bar.style.width = `${percent.toFixed(2)}%`; else if (bar && terminal) bar.style.width = job.status === 'completed' ? '100%' : '0%';
      }
      q('[data-mscx-job-title]').textContent = jobTitle(job);
      q('[data-mscx-job-badge]').textContent = job.status === 'completed' ? '완료' : (job.status === 'failed' ? '실패' : (job.status === 'paused' ? '일시 중지 · 자동 재시도' : (total > 0 ? `${percent.toFixed(1)}%` : '작업 중')));
      q('[data-mscx-job-phase]').textContent = phaseLabel(job.phase);
      q('[data-mscx-job-message]').textContent = job.message || (job.error ? job.error : '');
      q('[data-mscx-job-items]').textContent = total > 0 ? `${processed.toLocaleString()} / ${total.toLocaleString()}건` : `${processed.toLocaleString()}건 확인`;
      q('[data-mscx-job-bytes]').textContent = fmtBytes(job.processedBytes || 0);
      q('[data-mscx-job-transfer]').textContent = fmtBytes(job.transferredBytes || 0);
      const endAt = job.finishedAt || Date.now(); q('[data-mscx-job-elapsed]').textContent = fmtDuration(endAt - Number(job.startedAt || endAt));
      const activityAge = Math.max(0, Date.now() - Number(job.lastActivityAt || job.updatedAt || Date.now())); q('[data-mscx-job-activity]').textContent = activityAge < 1500 ? '방금 전' : `${fmtDuration(activityAge)} 전`;
      q('[data-mscx-job-retry]').textContent = `${Number(job.retryCount || 0)} / ${Number(job.failures || 0)}`;
      const currentBits = [job.currentAction, job.currentSpace ? `[${job.currentSpace}]` : '', job.currentKey].filter(Boolean); q('[data-mscx-job-current]').textContent = currentBits.join(' · ') || (terminal ? (job.status === 'completed' ? '모든 검증이 완료되었습니다.' : (job.error || '작업이 중단되었습니다.')) : '현재 작업을 준비하고 있습니다.');
      const active = !terminal;
      if (active && stateNode) {
        stateNode.className = job.status === 'paused' ? 'mscx-state warn' : 'mscx-state warn';
        const stateText = q('[data-mscx-state-text]'); if (stateText) stateText.textContent = job.status === 'paused' ? '동기화 일시 중지' : `${jobTitle(job)} 중`;
      }
      if (terminal && job.jobId && lastTerminalHandled !== job.jobId) {
        lastTerminalHandled = job.jobId;
        setMessage(job.status === 'completed'
          ? `${jobTitle(job)} 완료\n업로드 ${Number(job.uploaded || 0).toLocaleString()} · 복구 ${Number(job.restored || 0).toLocaleString()} · 일치 ${Number(job.matched || 0).toLocaleString()}`
          : `${jobTitle(job)} 실패\n${job.error || '상세 오류를 확인하세요.'}`, job.status === 'completed' ? 'good' : 'error');
        setTimeout(() => { void refreshActionState().then(async latest => { if (latest.mode === MODE_PLUGIN_ONLY) setPluginOnlyUi(); else setConnectionUi(await testConnection(latest.url)); }); }, 0);
      }
    };
    const refreshActionState = async () => {
      const current = await readConfig(true).catch(() => currentConfig); currentConfig = { ...current };
      const job = getSyncJob(); const activeJob = !!job && !syncJobTerminal(job.status);
      const modeLabelNode = q('[data-mscx-mode-label]'); if (modeLabelNode) modeLabelNode.textContent = modeLabel(current.mode);
      q('[data-mscx-apply]').disabled = activeJob;
      q('[data-mscx-sync]').disabled = activeJob || current.mode !== MODE_MIRROR;
      q('[data-mscx-restore]').disabled = activeJob || current.mode !== MODE_SERVER_ONLY;
      q('[data-mscx-delete]').disabled = activeJob || current.mode === MODE_PLUGIN_ONLY;
      modeInputs().forEach(input => { input.disabled = activeJob; input.checked = input.value === (activeJob ? (job.targetMode || current.mode) : current.mode); }); updateModeSelectionStyles();
      const url = q('[data-mscx-url]'); if (url) { url.disabled = activeJob; if (typeof document === 'undefined' || document.activeElement !== url) url.value = activeJob ? (job.targetUrl || current.url) : current.url; }
      renderJob(job);
      return current;
    };

    q('[data-mscx-test]').onclick = async () => {
      setMessage('서버 연결을 확인하고 있습니다…'); q('[data-mscx-test]').disabled = true;
      const result = await testConnection(q('[data-mscx-url]').value); setConnectionUi(result); renderJob(getSyncJob());
      setMessage(result.ok ? `연결 성공\nMemory Suite ${result.serverVersion || '-'} · Protocol ${Number(result.protocol?.major || 0)}.${Number(result.protocol?.minor || 0)} · DB ${result.integrity?.result || 'ok'} · 데이터 ${Number(result.liveRecords || 0).toLocaleString()}건 · ${result.durationMs}ms` : `연결 실패\n${result.error || '서버에 연결할 수 없습니다.'}`, result.ok ? 'good' : 'error');
      q('[data-mscx-test]').disabled = false;
    };

    q('[data-mscx-apply]').onclick = async () => {
      const targetMode = selectedMode(); const targetUrl = q('[data-mscx-url]').value;
      try {
        const current = await readConfig(true);
        if (targetMode === current.mode && normalizeServerUrl(targetUrl) === current.url) { setMessage('변경할 설정이 없습니다.', 'good'); return; }
        if (targetMode === MODE_PLUGIN_ONLY && current.mode === MODE_PLUGIN_ONLY) {
          q('[data-mscx-apply]').disabled = true; setMessage('서버 주소 설정을 적용하고 있습니다…');
          const result = await configureConnection({ mode: targetMode, url: targetUrl });
          setMessage(`설정 적용 완료\n${modeLabel(result.to.mode)} · ${result.to.url}`, 'good'); setPluginOnlyUi();
          await refreshActionState(); return;
        }
        const job = await startConnectionConfigurationJob({ mode: targetMode, url: targetUrl });
        setMessage(`설정 변경을 접수했습니다.\n현재 저장 모드는 데이터 안전을 위해 그대로 유지하며, ${jobTitle(job)}가 끝나면 ${modeLabel(job.targetMode)}로 자동 확정됩니다.`, 'good');
        renderJob(job); await refreshActionState();
      } catch (error) { setMessage(`설정 적용 시작 실패\n${error?.message || error}`, 'error'); await refreshActionState(); }
    };

    q('[data-mscx-sync]').onclick = async () => {
      try { const job = await startSynchronizationJob(); setMessage('수동 동기화를 백그라운드에서 시작했습니다. 이 화면을 닫아도 계속됩니다.', 'good'); renderJob(job); await refreshActionState(); }
      catch (error) { setMessage(`동기화 시작 실패\n${error?.message || error}`, 'error'); }
    };
    q('[data-mscx-restore]').onclick = async () => {
      try { const job = await startRestoreJob(); setMessage('서버 DATA 복구를 백그라운드에서 시작했습니다. 진행 상황은 아래에 계속 표시됩니다.', 'good'); renderJob(job); await refreshActionState(); }
      catch (error) { setMessage(`복구 시작 실패\n${error?.message || error}`, 'error'); }
    };

    let deleteArmedUntil = 0;
    q('[data-mscx-delete]').onclick = async () => {
      const button = q('[data-mscx-delete]'); if (getSyncJob() && !syncJobTerminal(getSyncJob().status)) { setMessage('진행 중인 동기화가 끝난 뒤 삭제할 수 있습니다.', 'error'); return; }
      if (Date.now() > deleteArmedUntil) {
        button.disabled = true; setMessage('삭제 전에 서버 DATA의 무결성과 보존 범위를 확인하고 있습니다…');
        try { const checked = await verifyServerPreservation(state.legacy.plugin); deleteArmedUntil = Date.now() + 30000; button.textContent = '검증 완료 · 다시 눌러 삭제'; setMessage(`서버 보존 검증 완료\nDB 무결성: ${checked.integrity?.result || 'ok'} · 항목 ${checked.checked}\n30초 안에 다시 누르면 pluginStorage를 삭제하고 서버 단독으로 전환합니다.`, 'good'); }
        catch (error) { deleteArmedUntil = 0; button.textContent = '플러그인 스토리지 삭제'; setMessage(`삭제 차단\n서버에 안전하게 보존됐다고 확인할 수 없습니다.\n${error?.message || error}`, 'error'); }
        finally { await refreshActionState(); if (deleteArmedUntil > Date.now()) button.disabled = false; }
        return;
      }
      deleteArmedUntil = 0; button.disabled = true; setMessage('서버 보존 상태를 다시 확인한 뒤 pluginStorage를 삭제합니다…');
      try { const result = await deletePluginStorageAfterServerVerification(); button.textContent = '플러그인 스토리지 삭제'; await clearPersistedSyncJob(); setMessage(`삭제 완료\n삭제 항목 ${result.deleted} · 저장 방식 서버 단독\n필요하면 복구 버튼으로 pluginStorage를 다시 만들 수 있습니다.`, 'good'); }
      catch (error) { button.textContent = '플러그인 스토리지 삭제'; setMessage(`삭제 실패 또는 중단\n${error?.message || error}\n검증되지 않은 데이터는 삭제하지 않았습니다.`, 'error'); }
      finally { await refreshActionState(); }
    };

    const unsubscribe = subscribeSyncJob(renderJob);
    const tick = setInterval(() => {
      if (!root.isConnected) { clearInterval(tick); unsubscribe(); return; }
      renderJob(getSyncJob());
    }, 1000);
    try { tick?.unref?.(); } catch (_) {}
    await resumePendingSyncJob().catch(() => null);
    await refreshActionState();
    if ((currentConfig.mode || MODE_PLUGIN_ONLY) !== MODE_PLUGIN_ONLY) void testConnection(currentConfig.url).then(result => { setConnectionUi(result); renderJob(getSyncJob()); }).catch(() => {}); else setPluginOnlyUi();
    renderJob(getSyncJob());
    return true;
  };

  const managementRootId = `memory-suite-management-${namespace}`.replace(/[^A-Za-z0-9_-]/g, '_');
  const managementButtonId = `memory-suite-management-button-${namespace}`.replace(/[^A-Za-z0-9_-]/g, '_');

  const closeManagementDialog = async () => {
    try { state.management.root?.remove?.(); } catch (_) {}
    state.management.root = null;
    for (const api of apiCandidates()) {
      try { if (typeof api?.hideContainer === 'function') { await api.hideContainer(); break; } } catch (_) {}
    }
  };

  const openManagementDialog = async () => {
    for (const api of apiCandidates()) {
      try { if (typeof api?.showContainer === 'function') { await api.showContainer('fullscreen'); break; } } catch (_) {}
    }
    if (typeof document === 'undefined' || !document.body) throw new Error('memory_suite_management_dom_unavailable');
    try { document.getElementById(managementRootId)?.remove?.(); } catch (_) {}
    const root = document.createElement('div');
    root.id = managementRootId;
    root.innerHTML = `<style>
      #${managementRootId}{position:fixed;inset:0;z-index:2147483000;background:rgba(4,8,15,.72);display:flex;align-items:center;justify-content:center;padding:18px}
      #${managementRootId} .ms-dialog-card{width:min(820px,100%);max-height:94vh;overflow:auto;background:#101827;border:1px solid #334155;border-radius:17px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.48)}
      #${managementRootId} .ms-dialog-close{display:flex;justify-content:flex-end;margin-top:12px} #${managementRootId} .ms-dialog-close button{padding:9px 14px;border:1px solid #475569;border-radius:9px;background:#1e293b;color:#eef3ff;cursor:pointer;font-weight:700}
    </style><div class="ms-dialog-card"><div data-ms-dialog-panel></div><div class="ms-dialog-close"><button data-ms-dialog-close type="button">닫기</button></div></div>`;
    document.body.appendChild(root);
    state.management.root = root;
    const host = root.querySelector('[data-ms-dialog-panel]');
    await mountConnectionPanel(host, { title: `${displayName} · 서버 연결`, description: '저장 방식, 서버 주소, 연결 상태와 복구·삭제 작업을 관리합니다.' });
    root.querySelector('[data-ms-dialog-close]').onclick = () => { void closeManagementDialog(); };
    return true;
  };

  const registerManagementButton = async () => {
    if (!managementButtonEnabled || state.management.registered || state.management.registering) return state.management.handle;
    state.management.registering = true;
    try {
      const api = apiCandidates().find(candidate => typeof candidate?.registerButton === 'function');
      if (!api) return null;
      const handle = await api.registerButton({
        name: `${displayName} 데이터 저장`, icon: '💾', iconType: 'html', location: 'hamburger', id: managementButtonId
      }, openManagementDialog);
      state.management.handle = handle || { id: managementButtonId };
      state.management.registered = true;
      return state.management.handle;
    } catch (error) {
      const message = String(error?.message || error || '');
      if (/duplicate|already|exists/i.test(message)) {
        state.management.registered = true;
        state.management.handle = { id: managementButtonId, duplicate: true };
        return state.management.handle;
      }
      warnOnce('management_button_registration_failed', error);
      return null;
    } finally { state.management.registering = false; }
  };

  const scheduleManagementRegistration = () => {
    if (!managementButtonEnabled || state.management.registered || state.management.timer) return;
    let attempts = 0;
    const tryRegister = async () => {
      state.management.timer = null; attempts += 1;
      const result = await registerManagementButton();
      if (!result && attempts < 8) {
        state.management.timer = setTimeout(tryRegister, Math.min(5000, 500 + attempts * 650));
        try { state.management.timer?.unref?.(); } catch (_) {}
      }
    };
    state.management.timer = setTimeout(tryRegister, 300);
    try { state.management.timer?.unref?.(); } catch (_) {}
  };


  // ---------------------------------------------------------------------------
  // Scope-routed storage layer v1.7
  // ---------------------------------------------------------------------------
  const normalizeScopeDescriptor = (value, fallbackId = '') => {
    const source = value && typeof value === 'object' ? value : (value ? { scopeId: value } : {});
    const scopeId = String(source.scopeId || source.scopeKey || source.key || fallbackId || '').trim().slice(0, 700);
    const canonicalCharacterIdRaw = String(source.canonicalCharacterId || source.canonical_character_id || '').trim().slice(0, 240);
    const canonicalChatIdRaw = String(source.canonicalChatId || source.canonical_chat_id || '').trim().slice(0, 240);
    const canonicalScopeIdRaw = String(source.canonicalScopeId || source.canonical_scope_id || '').trim().slice(0, 700);
    const aliases = [...new Set((Array.isArray(source.aliases) ? source.aliases : [])
      .concat([source.scopeKey, source.key, source.storageHash, source.chatId, source.chat_id, canonicalChatIdRaw, canonicalScopeIdRaw])
      .map(item => String(item || '').trim()).filter(Boolean))].slice(0, 24);
    if (!scopeId) return { scopeId: '', scopeKey: '', label: '현재 스코프 확인 불가', aliases, available: false };
    const characterId = String(source.characterId || source.character_id || '').trim().slice(0, 240);
    const chatId = String(source.chatId || source.chat_id || '').trim().slice(0, 240);
    const canonicalCharacterId = canonicalCharacterIdRaw || characterId;
    const canonicalChatId = canonicalChatIdRaw || chatId;
    const canonicalScopeId = canonicalScopeIdRaw || (canonicalCharacterId && canonicalChatId ? `canonical:char:${canonicalCharacterId}|chat:${canonicalChatId}` : '');
    const personaId = String(source.personaId || source.persona_id || '').trim().slice(0, 240);
    const characterName = String(source.characterName || source.character_name || '').trim().slice(0, 160);
    const chatTitle = String(source.chatTitle || source.chat_title || source.title || '').trim().slice(0, 200);
    const personaName = String(source.personaName || source.persona_name || '').trim().slice(0, 160);
    const label = String(source.label || source.displayName || [characterName, chatTitle].filter(Boolean).join(' / ') || chatTitle || chatId || scopeId).trim().slice(0, 260);
    return { ...source, scopeId, scopeKey: String(source.scopeKey || source.key || scopeId).trim().slice(0, 700), aliases, characterId, chatId, canonicalCharacterId, canonicalChatId, canonicalScopeId, personaId, characterName, chatTitle, personaName, label, available: source.available !== false };
  };

  const defaultCurrentScope = async () => {
    const apis = apiCandidates();
    let charIndex = -1, chatIndex = -1, character = null, chat = null, db = null;
    for (const api of apis) {
      try {
        if (charIndex < 0 && typeof api?.getCurrentCharacterIndex === 'function') charIndex = Number(await api.getCurrentCharacterIndex());
        if (chatIndex < 0 && typeof api?.getCurrentChatIndex === 'function') chatIndex = Number(await api.getCurrentChatIndex());
        if (!character && Number.isInteger(charIndex) && charIndex >= 0 && typeof api?.getCharacterFromIndex === 'function') character = await api.getCharacterFromIndex(charIndex);
        if (!chat && Number.isInteger(charIndex) && charIndex >= 0 && Number.isInteger(chatIndex) && chatIndex >= 0 && typeof api?.getChatFromIndex === 'function') chat = await api.getChatFromIndex(charIndex, chatIndex);
        if (!db && typeof api?.getDatabase === 'function') db = await api.getDatabase(['selectedPersona', 'personas']);
      } catch (_) {}
    }
    character = character && typeof character === 'object' ? character : {};
    chat = chat && typeof chat === 'object' ? chat : {};
    db = db && typeof db === 'object' ? db : {};
    const first = (...values) => values.map(item => String(item == null ? '' : item).trim()).find(Boolean) || '';
    // Keep the legacy physical routing IDs unchanged, but carry a canonical
    // RisuAI identity beside them. This prevents an update from orphaning existing
    // server/pluginStorage routes while allowing owner plugins to converge on chaId/chat.id.
    const characterId = first(character.id, character._id, character.uid, character.uuid, character.key, Number.isInteger(charIndex) && charIndex >= 0 ? `charIndex:${charIndex}` : '');
    const chatId = first(chat.id, chat._id, chat.uid, chat.uuid, chat.key, chat.chatId, Number.isInteger(chatIndex) && chatIndex >= 0 ? `chatIndex:${chatIndex}` : '');
    const canonicalCharacterId = first(character.chaId, character.characterId, character.charId, character.id, character._id, character.uid, character.uuid, character.key, characterId);
    const canonicalChatId = first(chat.id, chat.chatId, chat._id, chat.uid, chat.uuid, chat.key, chatId);
    const canonicalScopeId = canonicalCharacterId && canonicalChatId ? `canonical:char:${canonicalCharacterId}|chat:${canonicalChatId}` : '';
    let personaId = first(chat.bindedPersona, chat.boundPersonaId, chat.personaId);
    const selectedPersona = Number(db.selectedPersona);
    if (!personaId && Number.isInteger(selectedPersona) && Array.isArray(db.personas)) personaId = first(db.personas[selectedPersona]?.id, db.personas[selectedPersona]?._id, `personaIndex:${selectedPersona}`);
    if (!characterId || !chatId) return normalizeScopeDescriptor(null);
    const scopeId = `memory-suite:${namespace}:char:${characterId}|chat:${chatId}|persona:${personaId || 'default'}`;
    return normalizeScopeDescriptor({
      scopeId, scopeKey: scopeId, characterId, chatId, canonicalCharacterId, canonicalChatId, canonicalScopeId, personaId,
      characterName: first(character.nickname, character.name, character.charName),
      chatTitle: first(chat.name, chat.title, chat.chatName, chat.filename, chatId),
      aliases: [chatId, canonicalChatId, canonicalScopeId].filter(Boolean)
    });
  };

  const rawPluginStorage = () => {
    if (state.legacy.plugin?.getItem && state.legacy.plugin?.setItem) return state.legacy.plugin;
    for (const api of apiCandidates()) {
      try { if (api?.pluginStorage?.getItem && api?.pluginStorage?.setItem) return api.pluginStorage; } catch (_) {}
    }
    return null;
  };

  const rawDeviceStorage = async () => {
    if (state.legacy.local?.getItem && state.legacy.local?.setItem) return state.legacy.local;
    for (const api of apiCandidates()) {
      try {
        if (typeof api?.getLocalPluginStorage === 'function') {
          const store = await api.getLocalPluginStorage();
          if (store?.getItem && store?.setItem) return store;
        }
        if (api?.safeLocalStorage?.getItem && api?.safeLocalStorage?.setItem) return api.safeLocalStorage;
      } catch (_) {}
    }
    return null;
  };

  const parseScopeRegistry = raw => {
    let source = raw;
    if (typeof source === 'string') { try { source = JSON.parse(source); } catch (_) { source = null; } }
    source = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const entries = {};
    const incoming = source.entries && typeof source.entries === 'object' && !Array.isArray(source.entries) ? source.entries : {};
    for (const [scopeIdRaw, rowRaw] of Object.entries(incoming)) {
      const row = rowRaw && typeof rowRaw === 'object' ? rowRaw : {};
      const scope = normalizeScopeDescriptor(row, scopeIdRaw);
      if (!scope.scopeId) continue;
      entries[scope.scopeId] = { ...scope, mode: normalizeMode(row.mode), updatedAt: Math.max(0, Number(row.updatedAt || 0) || 0), source: String(row.source || 'registry').slice(0, 100) };
    }
    return {
      schema: SCOPE_ROUTING_SCHEMA,
      version: 1,
      namespace,
      pluginId,
      defaultMode: MODE_PLUGIN_ONLY,
      updatedAt: Math.max(0, Number(source.updatedAt || 0) || 0),
      legacyGlobalModeImported: source.legacyGlobalModeImported === true,
      entries
    };
  };

  const mergeScopeRegistries = (...values) => {
    const result = parseScopeRegistry(null);
    for (const value of values) {
      const registry = parseScopeRegistry(value);
      result.legacyGlobalModeImported = result.legacyGlobalModeImported || registry.legacyGlobalModeImported;
      result.updatedAt = Math.max(result.updatedAt, registry.updatedAt);
      for (const [scopeId, row] of Object.entries(registry.entries)) {
        const previous = result.entries[scopeId];
        if (!previous || Number(row.updatedAt || 0) >= Number(previous.updatedAt || 0)) result.entries[scopeId] = row;
      }
    }
    return result;
  };

  const writeScopeRegistryLocal = async registryValue => {
    const registry = parseScopeRegistry(registryValue);
    registry.updatedAt = Date.now();
    const payload = JSON.stringify(registry);
    let success = false;
    const pluginStore = rawPluginStorage();
    if (pluginStore?.setItem) {
      try {
        const result = await pluginStore.setItem(SCOPE_ROUTING_LOCAL_KEY, payload);
        if (result !== false) {
          const readback = await pluginStore.getItem?.(SCOPE_ROUTING_LOCAL_KEY);
          success = String(readback || '') === payload;
        }
      } catch (_) {}
    }
    const deviceStore = await rawDeviceStorage().catch(() => null);
    if (deviceStore?.setItem) {
      try { await deviceStore.setItem(SCOPE_ROUTING_LOCAL_KEY, payload); success = true; } catch (_) {}
    }
    if (!success) {
      const error = new Error('memory_suite_scope_routing_storage_unavailable');
      error.code = 'MEMORY_SUITE_SCOPE_ROUTING_STORAGE_UNAVAILABLE';
      throw error;
    }
    state.scopeRouting.registry = registry;
    state.scopeRouting.registryLoaded = true;
    return registry;
  };

  const loadScopeRegistry = async (force = false, tryServer = false) => {
    if (!force && state.scopeRouting.registryLoaded && state.scopeRouting.registry) return state.scopeRouting.registry;
    if (!force && state.scopeRouting.registryLoading) return await state.scopeRouting.registryLoading;
    const task = (async () => {
      let pluginRaw = null, deviceRaw = null, serverRaw = null;
      const pluginStore = rawPluginStorage();
      try { pluginRaw = await pluginStore?.getItem?.(SCOPE_ROUTING_LOCAL_KEY); } catch (_) {}
      const deviceStore = await rawDeviceStorage().catch(() => null);
      try { deviceRaw = await deviceStore?.getItem?.(SCOPE_ROUTING_LOCAL_KEY); } catch (_) {}
      if (tryServer && !pluginRaw && !deviceRaw) {
        try {
          const remote = await remoteGet('plugin', SCOPE_ROUTING_SERVER_KEY, { allowPluginOnly: true });
          if (remote.exists === true) serverRaw = remote.value;
        } catch (_) {}
      }
      const registry = mergeScopeRegistries(serverRaw, pluginRaw, deviceRaw);
      state.scopeRouting.registry = registry;
      state.scopeRouting.registryLoaded = true;
      return registry;
    })();
    state.scopeRouting.registryLoading = task;
    try { return await task; } finally { state.scopeRouting.registryLoading = null; }
  };

  const synchronizeScopeRegistryToServer = async registryValue => {
    const registry = parseScopeRegistry(registryValue || await loadScopeRegistry());
    try {
      await remoteMutate('set', 'plugin', SCOPE_ROUTING_SERVER_KEY, registry, { allowPluginOnly: true });
      return true;
    } catch (error) {
      setStatus('scope_route_server_pending', error?.message || error);
      return false;
    }
  };

  const hydrateScopeRegistryFromServer = async () => {
    if (!scopeRoutingEnabled) return null;
    try {
      const remote = await remoteGet('plugin', SCOPE_ROUTING_SERVER_KEY, { allowPluginOnly:true });
      if (remote.exists !== true || !remote.value) return null;
      const local = await loadScopeRegistry(false, false);
      const merged = mergeScopeRegistries(remote.value, local);
      const saved = await writeScopeRegistryLocal(merged);
      state.scopeRouting.routeCache.clear();
      setStatus('scope_routes_hydrated', '', { routeCount:Object.keys(saved.entries || {}).length });
      return saved;
    } catch (error) {
      // Scope metadata hydration is best-effort. It must never prevent plugin UI,
      // request hooks, or plugin-only scopes from starting while the server is down.
      setStatus('scope_routes_server_unavailable', error?.message || error);
      return null;
    }
  };

  const resolveCurrentScope = async (force = false) => {
    if (!scopeRoutingEnabled) return normalizeScopeDescriptor({ scopeId: '__plugin_global__', scopeKey: '__plugin_global__', label: `${displayName} 전역`, global: true });
    if (!force && scopeCacheMs > 0 && state.scopeRouting.current?.scopeId && Date.now() - Number(state.scopeRouting.currentAt || 0) < scopeCacheMs) return state.scopeRouting.current;
    let value = null;
    try { value = currentScopeProvider ? await currentScopeProvider({ namespace, pluginId, pluginVersion, force }) : await defaultCurrentScope(); }
    catch (error) { setStatus('scope_unavailable', error?.message || error); }
    const scope = normalizeScopeDescriptor(value);
    const previousScopeId = String(state.scopeRouting.current?.scopeId || '');
    state.scopeRouting.current = scope;
    state.scopeRouting.currentAt = Date.now();
    // Re-reading the same active chat must not throw away every resolved key
    // route. The old unconditional clear multiplied host-context work across a
    // ledger/archive scan even though the scope had not changed.
    if (previousScopeId !== String(scope.scopeId || '')) state.scopeRouting.routeCache.clear();
    return scope;
  };

  const registryEntryByAlias = (registry, aliasValue) => {
    const alias = String(aliasValue || '').trim();
    if (!alias) return null;
    for (const row of Object.values(registry?.entries || {})) {
      if (row.scopeId === alias || row.scopeKey === alias || (Array.isArray(row.aliases) && row.aliases.includes(alias))) return row;
    }
    return null;
  };

  const maybeImportLegacyGlobalMode = async (scope, registry) => {
    if (!scope?.scopeId || registry.entries[scope.scopeId] || registry.legacyGlobalModeImported) return registry;
    const legacyMode = normalizeMode(await getArgumentValue(modeArguments, MODE_PLUGIN_ONLY));
    registry.legacyGlobalModeImported = true;
    if (legacyMode !== MODE_PLUGIN_ONLY) {
      registry.entries[scope.scopeId] = { ...scope, mode: legacyMode, updatedAt: Date.now(), source: 'legacy_global_mode_current_scope' };
      state.scopeRouting.lastLegacyImport = { scopeId: scope.scopeId, mode: legacyMode, at: Date.now() };
    }
    const saved = await writeScopeRegistryLocal(registry);
    try { await setArgumentValue(modeArguments[0] || 'memory_suite_server_mode', MODE_PLUGIN_ONLY); } catch (_) {}
    return saved;
  };

  const readScopeMode = async (scopeInput = null, force = false) => {
    const scope = normalizeScopeDescriptor(scopeInput || await resolveCurrentScope(force));
    if (!scope.scopeId) return { scope, mode: MODE_PLUGIN_ONLY, modeLabel: modeLabel(MODE_PLUGIN_ONLY), explicit: false };
    let registry = await loadScopeRegistry(force, false);
    if (!scopeInput || scope.scopeId === state.scopeRouting.current?.scopeId) registry = await maybeImportLegacyGlobalMode(scope, registry);
    const stored = registry.entries[scope.scopeId];
    const transient = state.scopeRouting.transientModes.get(scope.scopeId);
    const mode = VALID_MODES.has(transient) ? transient : normalizeMode(stored?.mode || MODE_PLUGIN_ONLY);
    return { scope: stored ? normalizeScopeDescriptor(stored, scope.scopeId) : scope, mode, modeLabel: modeLabel(mode), explicit: !!stored };
  };

  const persistScopedMode = async (modeValue, scopeInput = null, persistOptions = {}) => {
    const target = normalizeMode(modeValue);
    const scope = normalizeScopeDescriptor(scopeInput || await resolveCurrentScope(true));
    if (!scope.scopeId || scope.available === false) {
      const error = new Error('memory_suite_current_scope_unavailable');
      error.code = 'MEMORY_SUITE_SCOPE_UNAVAILABLE';
      throw error;
    }
    const registry = await loadScopeRegistry(true, false);
    registry.entries[scope.scopeId] = { ...(registry.entries[scope.scopeId] || {}), ...scope, mode: target, updatedAt: Date.now(), source: String(persistOptions.source || 'user_scope_setting') };
    registry.legacyGlobalModeImported = true;
    const saved = await writeScopeRegistryLocal(registry);
    state.scopeRouting.transientModes.delete(scope.scopeId);
    state.config = { ...state.config, at: Date.now(), mode: target };
    void synchronizeScopeRegistryToServer(saved);
    setStatus('scope_mode_changed', '', { scopeId: scope.scopeId, scopeLabel: scope.label, mode: target, modeLabel: modeLabel(target) });
    return { scope, mode: target, modeLabel: modeLabel(target), registry: saved };
  };

  const anyServerScopedMode = async () => {
    const registry = await loadScopeRegistry(false, false);
    return Object.values(registry.entries || {}).some(row => normalizeMode(row.mode) !== MODE_PLUGIN_ONLY);
  };

  const normalizeRouteDescriptor = async (rawValue, space, key, currentScope) => {
    let raw = rawValue;
    if (typeof raw === 'string') raw = { scopeId: raw };
    raw = raw && typeof raw === 'object' ? raw : {};
    let kind = String(raw.kind || raw.type || '').trim().toLowerCase();
    if (!['scope', 'shared', 'global'].includes(kind)) kind = raw.global === true ? 'global' : (raw.shared === true ? 'shared' : 'scope');
    // Resolve an explicit scope or alias before falling back to the current scope.
    // Falling back first would silently assign an unknown historical key to the
    // currently open chat, which is unsafe for per-scope routing.
    let scope = normalizeScopeDescriptor(raw.scope || raw, '');
    if (kind === 'scope' && !scope.scopeId && raw.scopeAlias) {
      const registry = await loadScopeRegistry(false, false);
      scope = normalizeScopeDescriptor(registryEntryByAlias(registry, raw.scopeAlias));
    }
    if (kind === 'scope' && !scope.scopeId) scope = normalizeScopeDescriptor(currentScope);
    let mode = MODE_PLUGIN_ONLY;
    if (kind === 'scope') mode = (await readScopeMode(scope, false)).mode;
    else if (kind === 'shared') mode = (await anyServerScopedMode()) ? normalizeMode(sharedRouteModeRaw) : MODE_PLUGIN_ONLY;
    const remoteKey = String(raw.remoteKey || (raw.scopedContainer === true && scope.scopeId
      ? `${key}${SCOPED_REMOTE_KEY_MARKER}${encodeURIComponent(scope.scopeId)}`
      : key));
    return {
      routed: true, kind, space, key: String(key), logicalKey: String(key), remoteKey,
      scope, scopeId: scope.scopeId || '', scopeLabel: scope.label || '', mode,
      projectValue: typeof raw.projectValue === 'function' ? raw.projectValue : null,
      mergeValue: typeof raw.mergeValue === 'function' ? raw.mergeValue : null,
      removeValue: typeof raw.removeValue === 'function' ? raw.removeValue : null,
      scopedContainer: raw.scopedContainer === true,
      // Shared/global infrastructure is never swept or deleted as part of one chat scope.
      // A plugin may opt a truly scope-owned shared record in explicitly.
      includeInScopeSync: raw.includeInScopeSync === true || (raw.includeInScopeSync !== false && kind === 'scope'),
      metadata: raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {}
    };
  };

  const resolveScopedRoute = async (space, key, routeOptions = {}) => {
    const normalizedKey = String(key || '');
    if (!matchesRoute(space, normalizedKey)) return { routed: false, kind: 'global', space, key: normalizedKey, logicalKey: normalizedKey, remoteKey: normalizedKey, scopeId: '', mode: MODE_PLUGIN_ONLY };
    if (!scopeRoutingEnabled) return { routed: true, kind: 'global', space, key: normalizedKey, logicalKey: normalizedKey, remoteKey: normalizedKey, scopeId: '', mode: MODE_PLUGIN_ONLY };

    // Many durable keys already contain their immutable scope id, while shared
    // archive/control keys never need a chat scope. Let explicitly opted-in
    // resolvers classify those keys before touching the RisuAI character/chat
    // APIs. This keeps archive traversal proportional to storage layers instead
    // of layers multiplied by repeated current-chat discovery.
    let registry = null;
    let preResolved = null;
    if (preResolveKeyScope && resolveKeyScopeProvider) {
      try {
        registry = await loadScopeRegistry(false, false);
        preResolved = await resolveKeyScopeProvider({ namespace, pluginId, pluginVersion, space, key: normalizedKey, currentScope: null, registry });
      } catch (_) { preResolved = null; }
    }
    const preKind = String(preResolved?.kind || preResolved?.type || '').trim().toLowerCase();
    const preScope = preKind === 'scope' ? normalizeScopeDescriptor(preResolved?.scope || preResolved, '') : null;
    const preResolvedWithoutCurrent = preKind === 'shared'
      || preKind === 'global'
      || (preKind === 'scope' && Boolean(preScope?.scopeId) && !preResolved?.scopeAlias);
    if (preResolvedWithoutCurrent) {
      const routeScopeId = preKind === 'scope' ? preScope.scopeId : `__${preKind}__`;
      const preCacheKey = `${space}\n${normalizedKey}\n${routeScopeId}`;
      if (!routeOptions.noCache && state.scopeRouting.routeCache.has(preCacheKey)) return state.scopeRouting.routeCache.get(preCacheKey);
      const route = await normalizeRouteDescriptor(preResolved, space, normalizedKey, null);
      state.scopeRouting.routeCache.set(preCacheKey, route);
      return route;
    }

    const currentScope = normalizeScopeDescriptor(routeOptions.scope || await resolveCurrentScope(routeOptions.forceScope === true));
    const cacheKey = `${space}\n${normalizedKey}\n${currentScope.scopeId}`;
    if (!routeOptions.noCache && state.scopeRouting.routeCache.has(cacheKey)) return state.scopeRouting.routeCache.get(cacheKey);
    let raw = preResolved;
    try {
      raw = raw || (resolveKeyScopeProvider
        ? await resolveKeyScopeProvider({ namespace, pluginId, pluginVersion, space, key: normalizedKey, currentScope, registry: registry || await loadScopeRegistry(false, false) })
        : { kind: 'scope', ...currentScope });
    } catch (error) {
      setStatus('scope_route_failed', error?.message || error, { key: compact(normalizedKey, 180), space });
      raw = { kind: 'scope', ...currentScope };
    }
    const route = await normalizeRouteDescriptor(raw, space, normalizedKey, currentScope);
    state.scopeRouting.routeCache.set(cacheKey, route);
    return route;
  };

  const scopedRemoteKeyInfo = remoteKeyValue => {
    const remoteKey = String(remoteKeyValue || '');
    const index = remoteKey.lastIndexOf(SCOPED_REMOTE_KEY_MARKER);
    if (index < 0) return { logicalKey: remoteKey, scopeId: '' };
    let scopeId = '';
    try { scopeId = decodeURIComponent(remoteKey.slice(index + SCOPED_REMOTE_KEY_MARKER.length)); } catch (_) {}
    return { logicalKey: remoteKey.slice(0, index), scopeId };
  };

  const routeProjectValue = async (route, value) => {
    if (typeof route?.projectValue === 'function') return await route.projectValue(value, { route, scope: route.scope, namespace, pluginId });
    return value;
  };

  const routeMergeValue = async (route, remoteValue, localValue) => {
    if (typeof route?.mergeValue === 'function') return await route.mergeValue(remoteValue, localValue, { route, scope: route.scope, namespace, pluginId });
    return remoteValue;
  };

  const routeRemoveLocal = async (route, legacyGet, legacySet, legacyRemove) => {
    if (typeof route?.removeValue === 'function') {
      const local = typeof legacyGet === 'function' ? await legacyGet() : null;
      const next = await route.removeValue(local, { route, scope: route.scope, namespace, pluginId });
      if (next === undefined || next === null || next === '') return typeof legacyRemove === 'function' ? await legacyRemove() : false;
      return typeof legacySet === 'function' ? await legacySet(next) : false;
    }
    return typeof legacyRemove === 'function' ? await legacyRemove() : false;
  };

  const scopedBootstrap = async (force = false) => await bootstrap(force, true);
  const scopedServerGet = async (space, key) => await remoteGet(String(space || 'plugin'), String(key || ''), { allowPluginOnly: true });
  const scopedServerGetMany = async (space = 'plugin', keys = []) => await remoteGetMany(String(space || 'plugin'), keys, { allowPluginOnly: true });
  const scopedServerKeys = async (space = 'plugin', prefix = '') => await remoteKeys(String(space || 'plugin'), String(prefix || ''), { allowPluginOnly: true });
  const scopedServerIntegrity = async () => await remoteIntegrity({ allowPluginOnly: true });

  const scopedGet = async (space, key, legacyGet = null, legacySet = null, legacyRemove = null) => {
    const route = await resolveScopedRoute(space, key);
    if (!route.routed || route.mode === MODE_PLUGIN_ONLY) return typeof legacyGet === 'function' ? await legacyGet() : null;
    if (route.mode === MODE_MIRROR) {
      const localValue = typeof legacyGet === 'function' ? await legacyGet() : null;
      const config = await readConfig();
      if (cachedBootstrapFailure(config.url)) {
        setStatus('server_unavailable_local_only', 'memory_suite_server_unavailable', { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
        return localValue;
      }
      const projected = isNullishStorageValue(localValue) ? null : await routeProjectValue(route, localValue);
      if (!isNullishStorageValue(projected)) {
        try {
          const remote = await remoteGet(space, route.remoteKey, { allowPluginOnly: true });
          if (remote.tombstone === true) {
            await routeRemoveLocal(route, legacyGet, legacySet, legacyRemove);
            setStatus('server_tombstone_applied', '', { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
            return typeof legacyGet === 'function' ? await legacyGet() : null;
          }
          void serializeMutation(space, route.remoteKey, async () => {
            try {
              if (remote.exists !== true || jsonComparable(remote.value) !== jsonComparable(projected)) {
                await remoteMutate('set', space, route.remoteKey, projected, { allowPluginOnly: true });
              }
              setStatus('synced', '', { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
            } catch (error) {
              setStatus('local_ahead', error?.message || error, { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
            }
          });
          return localValue;
        } catch (error) {
          setStatus('server_unavailable_local_only', error?.message || error, { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
          return localValue;
        }
      }
      try {
        const remote = await remoteGet(space, route.remoteKey, { allowPluginOnly: true });
        if (remote.exists === true) {
          const merged = await routeMergeValue(route, remote.value, localValue);
          if (typeof legacySet === 'function') await legacySet(merged);
          return merged;
        }
        if (remote.tombstone === true) await routeRemoveLocal(route, legacyGet, legacySet, legacyRemove);
        return typeof legacyGet === 'function' ? await legacyGet() : null;
      } catch (error) {
        setStatus('server_unavailable_local_only', error?.message || error, { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
        return localValue;
      }
    }
    // server_only: never fall back silently when the server is unavailable.
    const remote = await remoteGet(space, route.remoteKey, { allowPluginOnly: true });
    if (remote.exists === true) return await routeMergeValue(route, remote.value, null);
    if (remote.tombstone === true) return null;
    const localValue = typeof legacyGet === 'function' ? await legacyGet() : null;
    const projected = isNullishStorageValue(localValue) ? null : await routeProjectValue(route, localValue);
    if (!isNullishStorageValue(projected)) {
      try { await remoteMutate('set', space, route.remoteKey, projected, { expectedRevision: 0, allowPluginOnly: true }); }
      catch (error) {
        if (error?.status !== 409) throw error;
      }
      const migrated = await remoteGet(space, route.remoteKey, { allowPluginOnly: true });
      if (migrated.exists === true) return await routeMergeValue(route, migrated.value, null);
    }
    return null;
  };

  const scopedSet = async (space, key, value, legacySet = null) => {
    const route = await resolveScopedRoute(space, key);
    if (!route.routed || route.mode === MODE_PLUGIN_ONLY) return typeof legacySet === 'function' ? await legacySet(value) : false;
    const projected = await routeProjectValue(route, value);
    if (route.mode === MODE_MIRROR) {
      const localOk = typeof legacySet === 'function' ? await legacySet(value) : false;
      if (!localOk) return false;
      try {
        await serializeMutation(space, route.remoteKey, () => remoteMutate('set', space, route.remoteKey, projected, { allowPluginOnly: true }));
        setStatus('synced', '', { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
      } catch (error) {
        setStatus('local_ahead', error?.message || error, { scopeId: route.scopeId, mode: route.mode, key: compact(key, 160), space });
        warnOnce(`mirror_server_write_${compact(key, 80)}`, error);
      }
      return true;
    }
    await serializeMutation(space, route.remoteKey, () => remoteMutate('set', space, route.remoteKey, projected, { allowPluginOnly: true }));
    return true;
  };

  const scopedRemove = async (space, key, legacyGet = null, legacySet = null, legacyRemove = null) => {
    const route = await resolveScopedRoute(space, key);
    if (!route.routed || route.mode === MODE_PLUGIN_ONLY) return typeof legacyRemove === 'function' ? await legacyRemove() : false;
    if (route.mode === MODE_MIRROR) {
      try { await serializeMutation(space, route.remoteKey, () => remoteMutate('remove', space, route.remoteKey, null, { allowPluginOnly: true })); }
      catch (error) { setStatus('mirror_delete_blocked', error?.message || error, { scopeId: route.scopeId, key: compact(key, 160), space }); return false; }
      const localOk = await routeRemoveLocal(route, legacyGet, legacySet, legacyRemove);
      if (!localOk) return false;
      return true;
    }
    await serializeMutation(space, route.remoteKey, () => remoteMutate('remove', space, route.remoteKey, null, { allowPluginOnly: true }));
    return true;
  };

  const scopedKeys = async (space, prefix = '', legacyKeysFn = null) => {
    const currentScope = await resolveCurrentScope(false);
    const legacy = typeof legacyKeysFn === 'function' ? await legacyKeysFn() : [];
    const legacyList = Array.isArray(legacy) ? legacy.map(String).filter(Boolean) : [];
    const visible = [];
    let requiresServer = false;
    for (const key of legacyList) {
      if (!matchesRoute(space, key)) { visible.push(key); continue; }
      const route = await resolveScopedRoute(space, key, { scope: currentScope });
      if (route.mode !== MODE_SERVER_ONLY) visible.push(key);
      if (route.mode !== MODE_PLUGIN_ONLY) requiresServer = true;
    }
    if (!requiresServer) return [...new Set(visible)];
    let remote = { keys: [], tombstones: [] };
    try { remote = await remoteKeys(space, prefix, { allowPluginOnly: true }); }
    catch (error) {
      if (requiresServer && (await readScopeMode(currentScope)).mode === MODE_SERVER_ONLY) throw error;
      return [...new Set(visible)];
    }
    const tombstones = new Set();
    for (const raw of Array.isArray(remote.tombstones) ? remote.tombstones : []) {
      const decoded = scopedRemoteKeyInfo(raw);
      if (decoded.scopeId && decoded.scopeId !== currentScope.scopeId) continue;
      tombstones.add(decoded.logicalKey);
    }
    for (const remoteKey of Array.isArray(remote.keys) ? remote.keys : []) {
      const decoded = scopedRemoteKeyInfo(remoteKey);
      if (decoded.scopeId && decoded.scopeId !== currentScope.scopeId) continue;
      const route = await resolveScopedRoute(space, decoded.logicalKey, { scope: decoded.scopeId ? { ...currentScope, scopeId: decoded.scopeId, scopeKey: decoded.scopeId } : currentScope });
      if (route.mode !== MODE_PLUGIN_ONLY && !tombstones.has(decoded.logicalKey)) visible.push(decoded.logicalKey);
    }
    return [...new Set(visible.filter(key => !tombstones.has(key)))];
  };

  const scheduleScopedAutomaticMigration = (legacy, space) => {
    const enabled = space === 'plugin' ? autoMigratePlugin : autoMigrateLocal;
    if (!enabled || !legacy || typeof legacy.keys !== 'function') return;
    const migration = state.migration[space];
    if (!migration || migration.scheduled === true || migration.state === 'running') return;
    migration.scheduled = true;
    const run = async () => {
      migration.scheduled = false;
      let scope = null;
      try {
        scope = await resolveCurrentScope(false);
        if (!scope?.scopeId) {
          state.migration[space] = { ...migration, state:'lazy_only', at:Date.now(), reason:'current_scope_unavailable', scheduled:false };
          return;
        }
        const modeState = await readScopeMode(scope, false);
        if (modeState.mode === MODE_PLUGIN_ONLY) {
          state.migration[space] = { ...migration, state:'idle', at:Date.now(), reason:'scope_plugin_only', scheduled:false };
          return;
        }
        state.migration[space] = { ...migration, state:'running', at:Date.now(), reason:'scope_automatic_migration', scheduled:false };
        const result = await scopedSynchronizeSpace(legacy, space, {
          scope, allowOverwrite:false, restoreMissingLocal:modeState.mode === MODE_MIRROR
        });
        state.migration[space] = {
          state:'complete', scanned:Number(result.totalItems || 0), migrated:Number(result.uploaded || 0),
          skipped:Number(result.matched || 0), failed:Number(result.failures?.length || 0), at:Date.now(),
          reason:`scope:${scope.scopeId}`, scheduled:false
        };
      } catch (error) {
        const keyEnumerationMissing = error?.code === 'MEMORY_SUITE_KEYS_UNAVAILABLE' || /key_enumeration/i.test(String(error?.message || ''));
        state.migration[space] = {
          ...state.migration[space], state:keyEnumerationMissing?'lazy_only':'partial', at:Date.now(),
          failed:Math.max(1, Number(error?.result?.failures?.length || 0) || 1), reason:compact(error?.message || error, 300), scheduled:false
        };
        if (!keyEnumerationMissing && retryableSyncError(error)) {
          setTimeout(() => scheduleScopedAutomaticMigration(legacy, space), migrationRetryMs);
        }
      }
    };
    const timer = setTimeout(() => { void run(); }, migrationDelayMs);
    try { timer?.unref?.(); } catch (_) {}
  };

  const createScopedProxy = (legacy, space, cache) => {
    if (!legacy || (typeof legacy !== 'object' && typeof legacy !== 'function')) return legacy;
    state.legacy[space] = legacy;
    if (cache.has(legacy)) return cache.get(legacy);
    const proxy = Object.freeze({
      getItem: async key => await scopedGet(
        space, String(key),
        async () => typeof legacy.getItem === 'function' ? await legacy.getItem(key) : null,
        async next => typeof legacy.setItem === 'function' ? (await legacy.setItem(key, next)) !== false : false,
        async () => {
          if (typeof legacy.removeItem === 'function') return (await legacy.removeItem(key)) !== false;
          if (typeof legacy.setItem === 'function') return (await legacy.setItem(key, null)) !== false;
          return false;
        }
      ),
      setItem: async (key, value) => await scopedSet(space, String(key), value, async next => typeof legacy.setItem === 'function' ? (await legacy.setItem(key, next)) !== false : false),
      removeItem: async key => await scopedRemove(
        space, String(key),
        async () => typeof legacy.getItem === 'function' ? await legacy.getItem(key) : null,
        async next => typeof legacy.setItem === 'function' ? (await legacy.setItem(key, next)) !== false : false,
        async () => {
          if (typeof legacy.removeItem === 'function') return (await legacy.removeItem(key)) !== false;
          if (typeof legacy.setItem === 'function') return (await legacy.setItem(key, null)) !== false;
          return false;
        }
      ),
      keys: async prefix => await scopedKeys(space, String(prefix || ''), async () => typeof legacy.keys === 'function' ? await legacy.keys() : [])
    });
    cache.set(legacy, proxy);
    scheduleScopedAutomaticMigration(legacy, space);
    if (space === 'plugin') setTimeout(() => {
      void (async () => {
        const scope = await resolveCurrentScope(false);
        const modeState = await readScopeMode(scope, false);
        if (modeState.mode === MODE_PLUGIN_ONLY) return;
        await hydrateScopeRegistryFromServer();
        await scopedResumePendingSyncJob();
      })().catch(() => {});
    }, 0);
    return proxy;
  };

  const scopeRouteMatches = (route, targetScope) => {
    if (!route?.routed || route.kind === 'global' || route.includeInScopeSync === false) return false;
    if (route.kind === 'shared') return route.includeInScopeSync === true;
    return !!targetScope?.scopeId && route.scopeId === targetScope.scopeId;
  };

  const collectScopedLegacyRows = async (legacy, space, scope) => {
    const listed = await legacyKeys(legacy);
    if (listed == null) {
      const error = new Error('memory_suite_pluginstorage_key_enumeration_required');
      error.code = 'MEMORY_SUITE_KEYS_UNAVAILABLE';
      throw error;
    }
    const rows = [];
    for (const key of listed.map(String).filter(Boolean)) {
      if (!matchesRoute(space, key)) continue;
      const route = await resolveScopedRoute(space, key, { scope, noCache: true });
      if (scopeRouteMatches(route, scope)) rows.push({ key, route });
    }
    return rows;
  };

  const scopedSynchronizeSpace = async (legacy, space = 'plugin', syncOptions = {}) => {
    if (!legacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const scope = normalizeScopeDescriptor(syncOptions.scope || await resolveCurrentScope(true));
    if (!scope.scopeId) throw new Error('memory_suite_current_scope_unavailable');
    const onProgress = typeof syncOptions.onProgress === 'function' ? syncOptions.onProgress : null;
    const progress = {
      schema: 'memory-suite.sync-progress.v2', namespace, space, scopeId: scope.scopeId, scopeLabel: scope.label,
      phase: 'integrity_before', currentAction: '서버 무결성 확인', currentKey: '', totalItems: 0, processedItems: 0,
      processedBytes: 0, transferredBytes: 0, uploaded: 0, restored: 0, matched: 0, removedByTombstone: 0,
      failureCount: 0, conflictCount: 0, startedAt: Date.now(), lastActivityAt: Date.now()
    };
    const report = (phase, patch = {}) => {
      Object.assign(progress, patch || {}, { phase: String(phase || progress.phase), lastActivityAt: Date.now() });
      try { onProgress?.({ ...progress }); } catch (_) {}
    };
    const integrityBefore = await remoteIntegrity({ allowPluginOnly: true });
    report('inventory', { message: `${scope.label || scope.scopeId} 데이터 목록을 조사하고 있습니다.` });
    const localRows = await collectScopedLegacyRows(legacy, space, scope);
    const listing = await remoteKeys(space, '', { allowPluginOnly: true });
    const remoteRecords = new Map((Array.isArray(listing.records) ? listing.records : []).map(row => [String(row?.key || ''), row]));
    const remoteKeysForScope = new Set();
    for (const remoteKey of Array.isArray(listing.keys) ? listing.keys : []) {
      const decoded = scopedRemoteKeyInfo(remoteKey);
      if (decoded.scopeId === scope.scopeId) remoteKeysForScope.add(remoteKey);
      else if (!decoded.scopeId) {
        const route = await resolveScopedRoute(space, decoded.logicalKey, { scope, noCache: true });
        if (scopeRouteMatches(route, scope) && route.remoteKey === remoteKey) remoteKeysForScope.add(remoteKey);
      }
    }
    const localRemoteKeys = new Set(localRows.map(row => row.route.remoteKey));
    const missingRemoteRows = syncOptions.restoreMissingLocal === true
      ? Array.from(remoteKeysForScope).filter(remoteKey => !localRemoteKeys.has(remoteKey))
      : [];
    progress.totalItems = localRows.length + missingRemoteRows.length;
    report('inventory_complete', { totalItems: progress.totalItems, currentAction: '목록 조사 완료' });
    const result = {
      schema: 'memory-suite.scope-sync.v1', namespace, space, scope, startedAt: progress.startedAt,
      totalItems: progress.totalItems, processedItems: 0, processedBytes: 0, transferredBytes: 0,
      uploaded: 0, restored: 0, matched: 0, removedByTombstone: 0, conflicts: [], failures: [],
      integrityBefore, integrityAfter: null
    };
    for (const row of localRows) {
      let bytes = 0, action = '비교';
      try {
        report('sync_local', { currentKey: row.key, currentAction: 'pluginStorage → 서버 비교' });
        const local = await legacyRead(legacy, row.key);
        const projected = isNullishStorageValue(local) ? null : await routeProjectValue(row.route, local);
        bytes = isNullishStorageValue(projected) ? 0 : storageValueBytes(projected);
        if (isNullishStorageValue(projected)) action = '빈 값 건너뜀';
        else {
          const remote = await remoteGet(space, row.route.remoteKey, { allowPluginOnly: true });
          if (remote.exists === true && jsonComparable(remote.value) === jsonComparable(projected)) { result.matched += 1; action = '일치 확인'; }
          else if (remote.tombstone === true && syncOptions.allowOverwrite === false) {
            result.conflicts.push({ key: row.key, remoteKey: row.route.remoteKey, reason: 'server_tombstone', localPreserved: true });
            action = '삭제 충돌 보존';
          } else {
            await remoteMutate('set', space, row.route.remoteKey, projected, { allowPluginOnly: true });
            result.uploaded += 1; result.transferredBytes += bytes; action = '서버 저장·검증 완료';
          }
        }
      } catch (error) { result.failures.push({ key: row.key, error: compact(error?.message || error, 240) }); action = '실패'; }
      finally {
        result.processedItems += 1; result.processedBytes += bytes;
        Object.assign(progress, { processedItems: result.processedItems, processedBytes: result.processedBytes, transferredBytes: result.transferredBytes, uploaded: result.uploaded, restored: result.restored, matched: result.matched, failureCount: result.failures.length, conflictCount: result.conflicts.length });
        report('sync_local', { currentKey: row.key, currentAction: action });
      }
    }
    for (const remoteKey of missingRemoteRows) {
      let bytes = Math.max(0, Number(remoteRecords.get(remoteKey)?.valueBytes || 0) || 0), action = '서버 → pluginStorage 복구';
      try {
        const decoded = scopedRemoteKeyInfo(remoteKey);
        const route = await resolveScopedRoute(space, decoded.logicalKey, { scope, noCache: true });
        const remote = await remoteGet(space, remoteKey, { allowPluginOnly: true });
        if (remote.exists === true) {
          const current = await legacyRead(legacy, decoded.logicalKey);
          const merged = await routeMergeValue(route, remote.value, current);
          if (!await legacyWriteVerified(legacy, decoded.logicalKey, merged)) throw new Error('pluginstorage_restore_failed');
          result.restored += 1; result.transferredBytes += bytes; action = '복구·readback 완료';
        }
      } catch (error) { result.failures.push({ key: remoteKey, error: compact(error?.message || error, 240) }); action = '복구 실패'; }
      finally {
        result.processedItems += 1; result.processedBytes += bytes;
        Object.assign(progress, { processedItems: result.processedItems, processedBytes: result.processedBytes, transferredBytes: result.transferredBytes, uploaded: result.uploaded, restored: result.restored, matched: result.matched, failureCount: result.failures.length, conflictCount: result.conflicts.length });
        report('sync_remote', { currentKey: remoteKey, currentAction: action });
      }
    }
    report('integrity_after', { currentKey: '', currentAction: '최종 무결성 확인', message: '현재 스코프 동기화 후 서버 DATA 무결성을 확인하고 있습니다.' });
    result.integrityAfter = await remoteIntegrity({ allowPluginOnly: true });
    result.ok = result.failures.length === 0 && result.conflicts.length === 0;
    report(result.ok ? 'scope_complete' : 'scope_incomplete', { currentKey: '', currentAction: result.ok ? '스코프 동기화 완료' : '확인 필요', message: result.ok ? `${scope.label || scope.scopeId} 동기화를 완료했습니다.` : `실패 ${result.failures.length} · 충돌 ${result.conflicts.length}` });
    if (!result.ok) {
      const error = new Error(`memory_suite_scope_sync_incomplete:${scope.scopeId}:failures=${result.failures.length},conflicts=${result.conflicts.length}`);
      error.code = 'MEMORY_SUITE_SCOPE_SYNC_INCOMPLETE'; error.result = result; throw error;
    }
    return result;
  };

  const scopedSynchronizeAll = async (syncOptions = {}) => {
    const scope = normalizeScopeDescriptor(syncOptions.scope || await resolveCurrentScope(true));
    const result = { schema: 'memory-suite.scope-sync-all.v1', namespace, scope, plugin: null, local: null, uploaded: 0, restored: 0, matched: 0, failures: [], totalItems: 0, processedItems: 0, processedBytes: 0, transferredBytes: 0 };
    const forward = progress => { try { syncOptions.onProgress?.(progress); } catch (_) {} };
    if (state.legacy.plugin) {
      result.plugin = await scopedSynchronizeSpace(state.legacy.plugin, 'plugin', { ...syncOptions, scope, onProgress: forward });
      for (const field of ['uploaded','restored','matched','totalItems','processedItems','processedBytes','transferredBytes']) result[field] += Number(result.plugin?.[field] || 0);
    }
    if (state.legacy.local && typeof state.legacy.local?.keys === 'function') {
      result.local = await scopedSynchronizeSpace(state.legacy.local, 'local', { ...syncOptions, scope, onProgress: forward });
      for (const field of ['uploaded','restored','matched','totalItems','processedItems','processedBytes','transferredBytes']) result[field] += Number(result.local?.[field] || 0);
    }
    result.ok = true;
    return result;
  };

  const scopedRestoreSpace = async (legacy, space = 'plugin', restoreOptions = {}) => {
    if (!legacy) throw new Error('memory_suite_pluginstorage_unavailable');
    const scope = normalizeScopeDescriptor(restoreOptions.scope || await resolveCurrentScope(true));
    if (!scope.scopeId) throw new Error('memory_suite_current_scope_unavailable');
    const onProgress = typeof restoreOptions.onProgress === 'function' ? restoreOptions.onProgress : null;
    const listing = await remoteKeys(space, '', { allowPluginOnly: true });
    const candidates = [];
    for (const remoteKey of Array.isArray(listing.keys) ? listing.keys : []) {
      const decoded = scopedRemoteKeyInfo(remoteKey);
      if (decoded.scopeId === scope.scopeId) candidates.push({ remoteKey, logicalKey: decoded.logicalKey });
      else if (!decoded.scopeId) {
        const route = await resolveScopedRoute(space, decoded.logicalKey, { scope, noCache: true });
        if (scopeRouteMatches(route, scope) && route.remoteKey === remoteKey) candidates.push({ remoteKey, logicalKey: decoded.logicalKey });
      }
    }
    const tombstones = [];
    for (const remoteKey of Array.isArray(listing.tombstones) ? listing.tombstones : []) {
      const decoded = scopedRemoteKeyInfo(remoteKey);
      if (decoded.scopeId === scope.scopeId) tombstones.push({ remoteKey, logicalKey: decoded.logicalKey });
    }
    const result = { schema: 'memory-suite.scope-restore.v1', namespace, space, scope, totalItems: candidates.length + tombstones.length, processedItems: 0, restored: 0, removed: 0, verified: 0, failures: [] };
    const report = (phase, patch = {}) => { try { onProgress?.({ schema:'memory-suite.sync-progress.v2', namespace, space, scopeId:scope.scopeId, scopeLabel:scope.label, phase, totalItems:result.totalItems, processedItems:result.processedItems, restored:result.restored, removedByTombstone:result.removed, failureCount:result.failures.length, lastActivityAt:Date.now(), ...patch }); } catch (_) {} };
    for (const row of candidates) {
      try {
        report('restore_values', { currentKey: row.logicalKey, currentAction: '서버 → pluginStorage 복구' });
        const route = await resolveScopedRoute(space, row.logicalKey, { scope, noCache: true });
        const remote = await remoteGet(space, row.remoteKey, { allowPluginOnly: true });
        if (remote.exists !== true) throw new Error('server_record_missing');
        const current = await legacyRead(legacy, row.logicalKey);
        const merged = await routeMergeValue(route, remote.value, current);
        if (!await legacyWriteVerified(legacy, row.logicalKey, merged)) throw new Error('pluginstorage_restore_failed');
        result.restored += 1; result.verified += 1;
      } catch (error) { result.failures.push({ key: row.logicalKey, error: compact(error?.message || error, 220) }); }
      finally { result.processedItems += 1; }
    }
    for (const row of tombstones) {
      try {
        const route = await resolveScopedRoute(space, row.logicalKey, { scope, noCache: true });
        await routeRemoveLocal(route, async () => legacyRead(legacy, row.logicalKey), async next => legacyWriteVerified(legacy, row.logicalKey, next), async () => legacyRemoveVerified(legacy, row.logicalKey));
        result.removed += 1;
      } catch (error) { result.failures.push({ key: row.logicalKey, error: compact(error?.message || error, 220) }); }
      finally { result.processedItems += 1; }
    }
    result.ok = result.failures.length === 0;
    if (!result.ok) { const error = new Error(`memory_suite_scope_restore_incomplete:${scope.scopeId}:${result.failures.length}`); error.code='MEMORY_SUITE_SCOPE_RESTORE_INCOMPLETE'; error.result=result; throw error; }
    state.management.lastResult = result;
    return result;
  };

  const scopedRestoreAll = async (restoreOptions = {}) => {
    const scope = normalizeScopeDescriptor(restoreOptions.scope || await resolveCurrentScope(true));
    const result = { schema:'memory-suite.scope-restore-all.v1', namespace, scope, plugin:null, local:null, failures:[], restored:0, removed:0, totalItems:0, processedItems:0 };
    const forward = progress => { try { restoreOptions.onProgress?.(progress); } catch (_) {} };
    if (state.legacy.plugin) { result.plugin = await scopedRestoreSpace(state.legacy.plugin, 'plugin', { ...restoreOptions, scope, onProgress:forward }); result.restored += result.plugin.restored; result.removed += result.plugin.removed; result.totalItems += result.plugin.totalItems; result.processedItems += result.plugin.processedItems; }
    if (state.legacy.local && typeof state.legacy.local?.keys === 'function') { result.local = await scopedRestoreSpace(state.legacy.local, 'local', { ...restoreOptions, scope, onProgress:forward }); result.restored += result.local.restored; result.removed += result.local.removed; result.totalItems += result.local.totalItems; result.processedItems += result.local.processedItems; }
    result.ok = true; return result;
  };

  const scopedVerifyPreservation = async (_legacy = state.legacy.plugin, verifyOptions = {}) => {
    const scope = normalizeScopeDescriptor(verifyOptions.scope || await resolveCurrentScope(true));
    if (!scope.scopeId) throw new Error('memory_suite_current_scope_unavailable');
    const integrity = await remoteIntegrity({ allowPluginOnly: true });
    const result = {
      schema:'memory-suite.scope-preservation.v2', namespace, scope, checked:0,
      failures:[], integrity, spaces:{ plugin:null, local:null }
    };
    const verifySpace = async (legacy, space) => {
      if (!legacy || typeof legacy.getItem !== 'function' || typeof legacy.keys !== 'function') return null;
      const rows = await collectScopedLegacyRows(legacy, space, scope);
      const spaceResult = { space, checked:0, total:rows.length, failures:[] };
      for (const row of rows) {
        if (row.route.kind !== 'scope') continue; // Shared/global metadata is not deleted by current-scope cleanup.
        try {
          const local = await legacyRead(legacy, row.key);
          const projected = isNullishStorageValue(local) ? null : await routeProjectValue(row.route, local);
          if (isNullishStorageValue(projected)) continue;
          const remote = await remoteGet(space, row.route.remoteKey, { allowPluginOnly:true });
          if (remote.exists !== true || jsonComparable(remote.value) !== jsonComparable(projected)) {
            spaceResult.failures.push({ key:row.key, remoteKey:row.route.remoteKey, reason:remote.tombstone?'server_tombstone':'value_mismatch_or_missing' });
          } else {
            spaceResult.checked += 1;
          }
        } catch (error) {
          spaceResult.failures.push({ key:row.key, remoteKey:row.route.remoteKey, reason:compact(error?.message || error, 240) });
        }
      }
      result.checked += spaceResult.checked;
      result.failures.push(...spaceResult.failures.map(row => ({ ...row, space })));
      return spaceResult;
    };
    result.spaces.plugin = await verifySpace(state.legacy.plugin, 'plugin');
    result.spaces.local = await verifySpace(state.legacy.local, 'local');
    result.ok = result.failures.length === 0;
    if (!result.ok) {
      const error = new Error(`memory_suite_scope_preservation_failed:${scope.scopeId}:${result.failures.length}`);
      error.code='MEMORY_SUITE_SCOPE_PRESERVATION_FAILED'; error.result=result; throw error;
    }
    return result;
  };

  const scopedSetModeSafely = async (requestedMode, operationOptions = {}) => {
    const target = normalizeMode(requestedMode);
    const scope = normalizeScopeDescriptor(operationOptions.scope || await resolveCurrentScope(true));
    const current = await readScopeMode(scope, true);
    if (target === current.mode) return { changed:false, from:current.mode, to:target, scope, modeLabel:modeLabel(target) };
    if (!state.legacy.plugin) throw new Error('memory_suite_pluginstorage_unavailable');
    const onProgress = typeof operationOptions.onProgress === 'function' ? operationOptions.onProgress : null;
    try {
      if (current.mode === MODE_PLUGIN_ONLY && target !== MODE_PLUGIN_ONLY) {
        const seeded = await scopedSynchronizeAll({ scope, allowOverwrite:false, restoreMissingLocal:target===MODE_MIRROR, onProgress });
        state.scopeRouting.transientModes.set(scope.scopeId, MODE_MIRROR);
        const settled = await scopedSynchronizeAll({ scope, allowOverwrite:true, restoreMissingLocal:target===MODE_MIRROR, onProgress });
        if (!seeded.ok || !settled.ok) throw new Error('memory_suite_scope_mode_seed_failed');
        await remoteIntegrity({ allowPluginOnly:true });
      } else if (current.mode === MODE_MIRROR && target === MODE_SERVER_ONLY) {
        await scopedSynchronizeAll({ scope, allowOverwrite:true, restoreMissingLocal:true, onProgress });
        await remoteIntegrity({ allowPluginOnly:true });
      } else if (current.mode === MODE_SERVER_ONLY && target !== MODE_SERVER_ONLY) {
        await scopedRestoreAll({ scope, onProgress });
      }
      const saved = await persistScopedMode(target, scope, { source:'safe_scope_mode_transition' });
      return { changed:true, from:current.mode, to:target, scope, modeLabel:modeLabel(target), config:saved };
    } catch (error) {
      state.scopeRouting.transientModes.delete(scope.scopeId);
      throw error;
    }
  };

  const scopedConfigureConnection = async (settings, operationOptions = {}) => {
    const source = settings && typeof settings === 'object' ? settings : {};
    const scope = normalizeScopeDescriptor(operationOptions.scope || await resolveCurrentScope(true));
    const currentUrl = normalizeServerUrl(await getArgumentValue(urlArguments, defaultUrl));
    const currentMode = (await readScopeMode(scope, true)).mode;
    const targetUrl = normalizeServerUrl(source.url || currentUrl);
    const targetMode = normalizeMode(source.mode || currentMode);

    // The server URL is plugin-global while storage modes are scope-local. Moving the
    // global URL while even one scope still depends on the old server would silently
    // split that plugin's scopes between two DATA roots. Refuse the change until every
    // known scope has been brought back to plugin_only. This is intentionally stricter
    // than timestamp-based migration and never rewrites another scope behind the user's back.
    if (targetUrl !== currentUrl) {
      const registry = await loadScopeRegistry(true, false);
      const serverBackedScopes = Object.values(registry?.entries || {})
        .filter(row => normalizeMode(row?.mode) !== MODE_PLUGIN_ONLY)
        .map(row => ({ scopeId:String(row?.scopeId || ''), scopeLabel:String(row?.label || row?.scopeId || ''), mode:normalizeMode(row?.mode) }));
      if (serverBackedScopes.length) {
        const error = new Error(`memory_suite_server_url_in_use:${serverBackedScopes.length}`);
        error.code = 'MEMORY_SUITE_SERVER_URL_IN_USE';
        error.details = { currentUrl, targetUrl, serverBackedScopes };
        error.userMessage = '서버를 사용하는 스코프가 남아 있어 서버 주소를 변경할 수 없습니다. 해당 스코프들을 먼저 플러그인 단독으로 전환해 주세요.';
        throw error;
      }
    }

    let connectionTest = null;
    if (targetMode !== MODE_PLUGIN_ONLY || targetUrl !== currentUrl) {
      connectionTest = await testConnection(targetUrl);
      if (!connectionTest.ok) { const error = new Error(`memory_suite_connection_test_failed:${connectionTest.error || 'unknown'}`); error.code='MEMORY_SUITE_CONNECTION_TEST_FAILED'; error.result=connectionTest; throw error; }
    }
    if (targetUrl !== currentUrl) await persistServerUrl(targetUrl);
    const modeResult = await scopedSetModeSafely(targetMode, { ...operationOptions, scope });
    const from = { mode:currentMode, modeLabel:modeLabel(currentMode), url:currentUrl, scope };
    const to = { mode:targetMode, modeLabel:modeLabel(targetMode), url:targetUrl, scope };
    return { ok:true, scope, url:targetUrl, mode:targetMode, modeLabel:modeLabel(targetMode), from, to, transition:modeResult, modeResult, connectionTest };
  };

  const scopedGetConnectionSettings = async (settingsOptions = {}) => {
    const scope = normalizeScopeDescriptor(settingsOptions.scope || await resolveCurrentScope(settingsOptions.force === true));
    const modeState = await readScopeMode(scope, settingsOptions.force === true);
    const url = normalizeServerUrl(await getArgumentValue(urlArguments, defaultUrl));
    state.config = { ...state.config, at: Date.now(), mode: modeState.mode, url };
    const connection = settingsOptions.test === true ? await testConnection(url) : null;
    return { namespace, pluginId, pluginVersion, scope, scopeId:scope.scopeId, scopeLabel:scope.label, mode:modeState.mode, modeLabel:modeLabel(modeState.mode), url, defaultMode:MODE_PLUGIN_ONLY, status:{...state.status, mode:modeState.mode, scopeId:scope.scopeId, scopeLabel:scope.label}, connection, syncJob:getSyncJob() };
  };

  const scopedCreateBackgroundJob = async (kind, target = {}) => {
    const scope = normalizeScopeDescriptor(target.scope || await resolveCurrentScope(true));
    if (!scope.scopeId || scope.available === false) {
      const error = new Error('memory_suite_current_scope_unavailable');
      error.code = 'MEMORY_SUITE_SCOPE_UNAVAILABLE';
      throw error;
    }
    const existing = state.syncJob.current;
    if (existing && !syncJobTerminal(existing.status)) {
      const sameTarget = String(existing.kind || '') === String(kind || '')
        && String(existing.scopeId || '') === scope.scopeId
        && String(existing.targetMode || '') === String(target.mode || '')
        && String(existing.targetUrl || '') === String(target.url || '');
      if (sameTarget) return cloneSyncJob(existing);
      const error = new Error(`memory_suite_background_job_busy:${existing.kind}:${existing.status}`);
      error.code = 'MEMORY_SUITE_SYNC_JOB_BUSY';
      error.job = cloneSyncJob(existing);
      throw error;
    }
    const now = Date.now();
    let random = '';
    try { random = globalThis?.crypto?.randomUUID?.() || ''; } catch (_) {}
    if (!random) random = `${now.toString(36)}_${Math.random().toString(36).slice(2,10)}`;
    const jobId = `${namespace}_${kind}_${scope.scopeId}_${random}`.replace(/[^A-Za-z0-9._:-]/g, '_').slice(0, 240);
    const currentMode = (await readScopeMode(scope, true)).mode;
    const currentUrl = normalizeServerUrl(await getArgumentValue(urlArguments, defaultUrl));
    state.syncJob.current = {
      schema: SYNC_JOB_SCHEMA, namespace, pluginId, pluginVersion,
      jobId, id: jobId, kind: String(kind || 'manual_sync'),
      scopeId: scope.scopeId, scopeKey: scope.scopeKey, scopeLabel: scope.label,
      sourceMode: currentMode, sourceUrl: currentUrl,
      targetMode: target.mode ? normalizeMode(target.mode) : currentMode,
      targetUrl: target.url ? normalizeServerUrl(target.url) : currentUrl,
      status: 'queued', phase: 'queued', message: '작업을 준비하고 있습니다.',
      startedAt: now, updatedAt: now, lastActivityAt: now, finishedAt: 0,
      totalItems: 0, processedItems: 0, processedBytes: 0, transferredBytes: 0,
      uploaded: 0, restored: 0, matched: 0, removedByTombstone: 0,
      failures: 0, conflicts: 0, retryCount: 0, nextRetryAt: 0,
      currentSpace: '', currentKey: '', currentAction: '', spaces: {}, completedPasses: {},
      result: null, error: ''
    };
    state.syncJob.loaded = true;
    notifySyncJob();
    await persistSyncJobNow();
    return getSyncJob();
  };

  const scopedExecuteBackgroundJob = async () => {
    const job = state.syncJob.current;
    if (!job || syncJobTerminal(job.status)) return getSyncJob();
    if (state.syncJob.promise) return state.syncJob.promise;
    if (state.syncJob.retryTimer) { clearTimeout(state.syncJob.retryTimer); state.syncJob.retryTimer = null; }
    const scope = normalizeScopeDescriptor({
      scopeId: job.scopeId, scopeKey: job.scopeKey || job.scopeId, label: job.scopeLabel || job.scopeId
    });
    updateSyncJob({
      status: 'running', phase: job.phase === 'resume_pending' ? 'resuming' : (job.phase || 'starting'),
      nextRetryAt: 0, error: ''
    });
    const runner = (async () => {
      try {
        let result;
        if (job.kind === 'connection_config') {
          result = await scopedConfigureConnection({ mode: job.targetMode, url: job.targetUrl }, { scope, onProgress: applySyncProgressToJob });
        } else if (job.kind === 'manual_sync') {
          const mode = (await readScopeMode(scope, true)).mode;
          if (mode !== MODE_MIRROR) throw new Error('memory_suite_manual_sync_requires_mirror_mode');
          result = await scopedSynchronizeAll({ scope, allowOverwrite: true, restoreMissingLocal: true, onProgress: applySyncProgressToJob });
        } else if (job.kind === 'server_restore') {
          const mode = (await readScopeMode(scope, true)).mode;
          if (mode !== MODE_SERVER_ONLY) throw new Error('memory_suite_restore_requires_server_only_mode');
          result = await scopedRestoreAll({ scope, onProgress: applySyncProgressToJob });
        } else {
          throw new Error(`memory_suite_unknown_background_job:${job.kind}`);
        }
        updateSyncJob({
          status: 'completed', phase: 'completed', currentAction: '완료', currentKey: '',
          message: '작업이 안전하게 완료되었습니다.', result: cloneSyncJob(result), error: '',
          nextRetryAt: 0, finishedAt: Date.now()
        }, { persist: 'immediate' });
        return result;
      } catch (error) {
        if (retryableSyncError(error) && Number(state.syncJob.current?.retryCount || 0) < 120) {
          const retryCount = Number(state.syncJob.current?.retryCount || 0) + 1;
          const delay = SYNC_JOB_RETRY_DELAYS_MS[Math.min(SYNC_JOB_RETRY_DELAYS_MS.length - 1, retryCount - 1)];
          updateSyncJob({
            status: 'paused', phase: 'waiting_for_server', currentAction: '서버 재연결 대기',
            message: `서버 연결이 일시적으로 끊겼습니다. ${Math.ceil(delay / 1000)}초 후 현재 스코프 작업을 이어서 확인합니다.`,
            error: compact(error?.message || error, 420), retryCount, nextRetryAt: Date.now() + delay
          }, { persist: 'immediate' });
          state.syncJob.retryTimer = setTimeout(() => {
            state.syncJob.retryTimer = null;
            void scopedExecuteBackgroundJob();
          }, delay);
          try { state.syncJob.retryTimer?.unref?.(); } catch (_) {}
          return null;
        }
        updateSyncJob({
          status: 'failed', phase: 'failed', currentAction: '작업 중단', currentKey: '',
          message: '작업을 완료하지 못했습니다.', error: compact(error?.message || error, 700),
          nextRetryAt: 0, finishedAt: Date.now()
        }, { persist: 'immediate' });
        throw error;
      }
    })();
    state.syncJob.promise = runner.finally(() => { state.syncJob.promise = null; });
    return state.syncJob.promise;
  };

  const scopedStartConnectionConfigurationJob = async settings => {
    const source = settings && typeof settings === 'object' ? settings : {};
    const scope = normalizeScopeDescriptor(source.scope || await resolveCurrentScope(true));
    const modeState = await readScopeMode(scope, true);
    const currentUrl = normalizeServerUrl(await getArgumentValue(urlArguments, defaultUrl));
    const job = await scopedCreateBackgroundJob('connection_config', {
      scope, mode: normalizeMode(source.mode ?? modeState.mode), url: normalizeServerUrl(source.url ?? currentUrl)
    });
    void scopedExecuteBackgroundJob().catch(() => {});
    return job;
  };
  const scopedStartSynchronizationJob = async (options = {}) => {
    const scope = normalizeScopeDescriptor(options.scope || await resolveCurrentScope(true));
    const modeState = await readScopeMode(scope, true);
    if (modeState.mode !== MODE_MIRROR) throw new Error('memory_suite_manual_sync_requires_mirror_mode');
    const url = normalizeServerUrl(await getArgumentValue(urlArguments, defaultUrl));
    const job = await scopedCreateBackgroundJob('manual_sync', { scope, mode: modeState.mode, url });
    void scopedExecuteBackgroundJob().catch(() => {});
    return job;
  };
  const scopedStartRestoreJob = async (options = {}) => {
    const scope = normalizeScopeDescriptor(options.scope || await resolveCurrentScope(true));
    const modeState = await readScopeMode(scope, true);
    if (modeState.mode !== MODE_SERVER_ONLY) throw new Error('memory_suite_restore_requires_server_only_mode');
    const url = normalizeServerUrl(await getArgumentValue(urlArguments, defaultUrl));
    const job = await scopedCreateBackgroundJob('server_restore', { scope, mode: modeState.mode, url });
    void scopedExecuteBackgroundJob().catch(() => {});
    return job;
  };
  const scopedResumePendingSyncJob = async () => {
    await loadPersistedSyncJob();
    const job = getSyncJob();
    if (!job || syncJobTerminal(job.status) || state.syncJob.promise) return job;
    const scope = await resolveCurrentScope(false);
    if (!scope.scopeId || String(job.scopeId || '') !== scope.scopeId) return job;
    void scopedExecuteBackgroundJob().catch(() => {});
    return getSyncJob();
  };
  const scopedWaitForSyncJob = async (jobId = '', timeoutMs = 15 * 60 * 1000) => {
    const wanted = String(jobId || state.syncJob.current?.jobId || state.syncJob.current?.id || '');
    if (!wanted) return null;
    const current = state.syncJob.current;
    if ((current?.jobId === wanted || current?.id === wanted) && syncJobTerminal(current.status)) return cloneSyncJob(current);
    return await new Promise((resolve, reject) => {
      let timer = null;
      const unsubscribe = subscribeSyncJob(job => {
        if (!job || (job.jobId !== wanted && job.id !== wanted) || !syncJobTerminal(job.status)) return;
        if (timer) clearTimeout(timer);
        unsubscribe();
        resolve(job);
      });
      timer = setTimeout(() => {
        unsubscribe();
        reject(new Error(`memory_suite_sync_job_wait_timeout:${wanted}`));
      }, Math.max(1000, Number(timeoutMs || 0) || 15 * 60 * 1000));
    });
  };

  const scopedDeletePluginStorageAfterVerification = async () => {
    const scope = await resolveCurrentScope(true);
    const checked = await scopedVerifyPreservation(state.legacy.plugin, { scope });
    await persistScopedMode(MODE_SERVER_ONLY, scope, { source:'scope_pluginstorage_delete' });
    const result = {
      ok:true, schema:'memory-suite.scope-pluginstorage-delete.v2', namespace, scope,
      deleted:0, deletedPlugin:0, deletedLocal:0, checked:checked.checked,
      mode:MODE_SERVER_ONLY, spaces:{ plugin:null, local:null }
    };
    const deleteSpace = async (legacy, space) => {
      if (!legacy || typeof legacy.keys !== 'function') return null;
      const rows = await collectScopedLegacyRows(legacy, space, scope);
      const rowResult = { space, examined:rows.length, deleted:0, retainedShared:0, failures:[] };
      for (const row of rows) {
        if (row.route.kind !== 'scope') { rowResult.retainedShared += 1; continue; }
        try {
          const ok = await routeRemoveLocal(
            row.route,
            async()=>legacyRead(legacy,row.key),
            async next=>legacyWriteVerified(legacy,row.key,next),
            async()=>legacyRemoveVerified(legacy,row.key)
          );
          if (!ok) throw new Error('scope_local_delete_readback_failed');
          rowResult.deleted += 1;
        } catch (error) {
          rowResult.failures.push({ key:row.key, error:compact(error?.message || error, 240) });
        }
      }
      if (rowResult.failures.length) {
        const error = new Error(`memory_suite_scope_local_delete_incomplete:${space}:${rowResult.failures.length}`);
        error.code='MEMORY_SUITE_SCOPE_LOCAL_DELETE_INCOMPLETE'; error.result=rowResult; throw error;
      }
      return rowResult;
    };
    result.spaces.plugin = await deleteSpace(state.legacy.plugin, 'plugin');
    result.spaces.local = await deleteSpace(state.legacy.local, 'local');
    result.deletedPlugin = Number(result.spaces.plugin?.deleted || 0);
    result.deletedLocal = Number(result.spaces.local?.deleted || 0);
    result.deleted = result.deletedPlugin + result.deletedLocal;
    return result;
  };

  const scopedPrepareServerScopeDeletion = async (deleteOptions = {}) => {
    const scope = normalizeScopeDescriptor(deleteOptions.scope || { scopeId:deleteOptions.scopeId, scopeKey:deleteOptions.scopeId, label:deleteOptions.scopeLabel || deleteOptions.scopeId });
    if (!scope.scopeId) throw new Error('memory_suite_scope_delete_owner_scope_missing');
    // Restore only this scope before allowing RE:TRACE to delete its server copy.
    await scopedRestoreAll({ scope });
    const localRows = await collectScopedLegacyRows(state.legacy.plugin, 'plugin', scope).catch(() => []);
    await persistScopedMode(MODE_PLUGIN_ONLY, scope, { source:'retrace_server_scope_delete_owner_proof' });
    return {
      schema:'memory-suite.server-scope-delete-owner-receipt.v1', namespace, pluginId, scopeId:scope.scopeId,
      verified:true, modeAfter:MODE_PLUGIN_ONLY, restoredKeys:localRows.length, checkedAt:Date.now(),
      members:Array.isArray(deleteOptions.members)?deleteOptions.members.length:0
    };
  };

  const scopedEnsureHandoffReady = async (handoffOptions = {}) => {
    const phase = String(handoffOptions.phase || 'handoff').trim() || 'handoff';
    const scope = normalizeScopeDescriptor(handoffOptions.scope || await resolveCurrentScope(true));
    const modeState = await readScopeMode(scope, true);
    const base = { schema:'memory-suite.handoff-storage.v2', namespace, pluginId, phase, scope, scopeId:scope.scopeId, mode:modeState.mode, modeLabel:modeLabel(modeState.mode), serverRequired:modeState.mode!==MODE_PLUGIN_ONLY, verified:true, pluginSync:null, localSync:null, integrity:null, checkedAt:Date.now() };
    if (modeState.mode === MODE_PLUGIN_ONLY) return base;
    const before = await remoteIntegrity({ allowPluginOnly:true });
    let sync = null;
    if (modeState.mode === MODE_MIRROR) sync = await scopedSynchronizeAll({ scope, allowOverwrite:true, restoreMissingLocal:true });
    const after = await remoteIntegrity({ allowPluginOnly:true });
    return { ...base, checkedAt:Date.now(), pluginSync:sync?.plugin||null, localSync:sync?.local||null, integrity:after, integrityBefore:before };
  };

  const scopedMountConnectionPanel = async (container, panelOptions = {}) => {
    if (!container || typeof container.innerHTML === 'undefined') throw new Error('memory_suite_connection_panel_container_required');
    const initial = await scopedGetConnectionSettings({ force:true });
    const rootId = `memory-suite-scope-connection-${namespace}-${Math.random().toString(36).slice(2,8)}`;
    const esc = value => safeText(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    container.innerHTML = `<div id="${rootId}" class="mscx-scope-root"><style>
      #${rootId}{font-family:system-ui,-apple-system,sans-serif;color:#e8eefc;display:grid;gap:14px} #${rootId} *{box-sizing:border-box}
      #${rootId} .mscx-card{border:1px solid #34425b;background:#111a2a;border-radius:14px;padding:15px;display:grid;gap:12px}
      #${rootId} h3{margin:0;font-size:18px} #${rootId} .muted{color:#9eacc3;font-size:12px;line-height:1.5}
      #${rootId} .scope{padding:11px 12px;background:#172236;border:1px solid #3b4d6b;border-radius:10px} #${rootId} .scope b{display:block;margin-bottom:4px}
      #${rootId} .modes{display:grid;gap:8px} #${rootId} label.mode{display:flex;gap:9px;align-items:flex-start;border:1px solid #34425b;border-radius:10px;padding:10px;cursor:pointer}
      #${rootId} input[type=text],#${rootId} input[type=password]{width:100%;padding:10px 11px;border-radius:9px;border:1px solid #465a79;background:#0b1321;color:#fff}
      #${rootId} .actions{display:flex;flex-wrap:wrap;gap:8px} #${rootId} button{border:1px solid #50658a;background:#1d2a42;color:#fff;border-radius:9px;padding:9px 12px;font-weight:700;cursor:pointer} #${rootId} button.primary{background:#2d5bd1;border-color:#4c79e4} #${rootId} button.danger{background:#51212a;border-color:#8e4350}
      #${rootId} button:disabled{opacity:.45;cursor:not-allowed} #${rootId} .status{white-space:pre-wrap;border:1px solid #34425b;background:#0c1422;border-radius:10px;padding:11px;min-height:46px;font-size:12px;line-height:1.55}
      #${rootId} .job{display:none;border:1px solid #365275;background:#101d31;border-radius:12px;padding:12px;gap:9px} #${rootId} .job.show{display:grid}
      #${rootId} .bar{height:9px;background:#25344d;border-radius:99px;overflow:hidden} #${rootId} .bar>i{display:block;height:100%;background:#5d88ff;width:0%}
      #${rootId} .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;font-size:12px} @media(max-width:540px){#${rootId} .grid{grid-template-columns:1fr}}
    </style>
      <div class="mscx-card"><div><h3>${esc(panelOptions.title || `${displayName} · 서버 연결`)}</h3><div class="muted">${esc(panelOptions.description || '현재 스코프의 저장 방식만 변경합니다.')}</div></div>
        <div class="scope"><b>현재 스코프</b><span data-scope-label>${esc(initial.scopeLabel || '확인 불가')}</span><div class="muted" data-scope-id>${esc(initial.scopeId || '')}</div></div>
        <div class="muted"><b>이 설정은 현재 스코프에만 적용됩니다.</b><br>새 스코프의 기본값은 항상 플러그인 단독입니다. 서버 주소만 플러그인 공통 설정입니다.</div>
        <div class="modes">
          <label class="mode"><input type="radio" name="${rootId}-mode" value="plugin_only"><span><b>플러그인 단독 · 기본</b><br><small>현재 스코프를 RisuAI pluginStorage에만 저장합니다.</small></span></label>
          <label class="mode"><input type="radio" name="${rootId}-mode" value="mirror"><span><b>플러그인 + 서버 병존</b><br><small>현재 스코프만 양쪽에 실시간 동기화합니다.</small></span></label>
          <label class="mode"><input type="radio" name="${rootId}-mode" value="server_only"><span><b>서버 단독</b><br><small>현재 스코프의 영구 정본을 Memory Suite DATA에 저장합니다.</small></span></label>
        </div>
        <label><b>서버 주소</b><input data-url type="text" value="${esc(initial.url)}"></label>
        <div class="actions"><button data-test>연결 테스트</button><button class="primary" data-apply>설정 적용</button><button data-sync>지금 동기화</button><button data-restore>서버 → pluginStorage 복구</button><button class="danger" data-delete>현재 스코프 pluginStorage 삭제</button></div>
        <div class="status" data-status>현재 모드: ${esc(initial.modeLabel)}\n서버 상태를 확인할 수 있습니다.</div>
      </div>
      <div class="job" data-job><b data-job-title>작업 진행 중</b><div class="bar"><i data-job-bar></i></div><div class="grid"><span data-job-phase></span><span data-job-count></span><span data-job-bytes></span><span data-job-time></span><span data-job-retry></span><span data-job-key></span></div></div>
    </div>`;
    const root = container.querySelector(`#${rootId}`);
    const q = sel => root.querySelector(sel);
    const setMessage = (message, tone='') => { const box=q('[data-status]'); box.textContent=String(message||''); box.dataset.tone=tone; };
    const radio = root.querySelector(`input[name="${rootId}-mode"][value="${initial.mode}"]`) || root.querySelector(`input[name="${rootId}-mode"][value="plugin_only"]`); if (radio) radio.checked=true;
    const formatBytes = bytes => { const n=Math.max(0,Number(bytes||0)); if(n<1024)return `${n} B`; if(n<1048576)return `${(n/1024).toFixed(1)} KB`; if(n<1073741824)return `${(n/1048576).toFixed(1)} MB`; return `${(n/1073741824).toFixed(2)} GB`; };
    const renderJob = job => {
      const card=q('[data-job]');
      if (!job || job.scopeId !== initial.scopeId || syncJobTerminal(job.status)) { card.classList.remove('show'); return; }
      card.classList.add('show'); const total=Math.max(0,Number(job.totalItems||0)), done=Math.max(0,Number(job.processedItems||0)); const percent=total?Math.min(100,Math.round(done/total*100)):0;
      q('[data-job-title]').textContent = `${job.message || '작업 진행 중'}${total ? ` · ${percent}%` : ''}`; q('[data-job-bar]').style.width=`${percent}%`;
      q('[data-job-phase]').textContent=`현재 단계: ${job.phase || '준비'}`; q('[data-job-count]').textContent=`진행: ${done.toLocaleString()} / ${total ? total.toLocaleString() : '조사 중'}`;
      q('[data-job-bytes]').textContent=`처리: ${formatBytes(job.processedBytes)} · 전송: ${formatBytes(job.transferredBytes)}`; q('[data-job-time]').textContent=`경과: ${Math.max(0,Math.floor((Date.now()-Number(job.startedAt||Date.now()))/1000))}초`;
      q('[data-job-retry]').textContent=`재시도 ${Number(job.retryCount||0)} · 실패 ${Number(job.failures||0)}`; q('[data-job-key]').textContent=`현재: ${job.currentKey || job.currentAction || '-'}`;
    };
    q('[data-test]').onclick = async()=>{ setMessage('서버 연결을 확인하고 있습니다…'); const result=await testConnection(q('[data-url]').value); setMessage(result.ok?`연결됨\nMemory Suite ${result.serverVersion}\nProtocol ${result.protocol?.major}.${result.protocol?.minor}\nnamespace ${namespace} · 항목 ${result.liveRecords}`:`연결 실패\n${result.error}`,result.ok?'good':'error'); };
    q('[data-apply]').onclick = async()=>{ const mode=root.querySelector(`input[name="${rootId}-mode"]:checked`)?.value||MODE_PLUGIN_ONLY; try{const job=await scopedStartConnectionConfigurationJob({mode,url:q('[data-url]').value,scope:initial.scope}); setMessage('설정 적용과 현재 스코프 초기 동기화를 시작했습니다.'); renderJob(job);}catch(error){setMessage(`설정 적용 시작 실패\n${error?.message||error}`,'error');} };
    q('[data-sync]').onclick = async()=>{ try{const job=await scopedStartSynchronizationJob();setMessage('현재 스코프 동기화를 시작했습니다.');renderJob(job);}catch(error){setMessage(`동기화 시작 실패\n${error?.message||error}`,'error');} };
    q('[data-restore]').onclick = async()=>{ try{const job=await scopedStartRestoreJob();setMessage('현재 스코프 복구를 시작했습니다.');renderJob(job);}catch(error){setMessage(`복구 시작 실패\n${error?.message||error}`,'error');} };
    let armedUntil=0;
    q('[data-delete]').onclick = async()=>{ const button=q('[data-delete]'); if(Date.now()>armedUntil){button.disabled=true;setMessage('현재 스코프가 서버에 안전하게 보존됐는지 확인하고 있습니다…');try{const checked=await scopedVerifyPreservation(state.legacy.plugin,{scope:initial.scope});armedUntil=Date.now()+30000;button.textContent='검증 완료 · 다시 눌러 삭제';setMessage(`보존 검증 완료 · ${checked.checked}개\n30초 안에 다시 누르면 현재 스코프의 payload만 삭제합니다.`,'good');}catch(error){armedUntil=0;setMessage(`삭제 차단\n${error?.message||error}`,'error');}finally{button.disabled=false;}return;} armedUntil=0;button.disabled=true;try{const result=await scopedDeletePluginStorageAfterVerification();button.textContent='현재 스코프 pluginStorage 삭제';setMessage(`삭제 완료 · ${result.deleted}개\n현재 스코프는 서버 단독입니다.`,'good');}catch(error){setMessage(`삭제 실패\n${error?.message||error}`,'error');}finally{button.disabled=false;} };
    const unsubscribe=subscribeSyncJob(renderJob); const tick=setInterval(()=>{if(!root.isConnected){clearInterval(tick);unsubscribe();return;}renderJob(getSyncJob());},1000); try{tick?.unref?.();}catch(_){}
    await scopedResumePendingSyncJob().catch(()=>null); renderJob(getSyncJob());
    return true;
  };


  const ensureHandoffReady = async (options = {}) => {
    const phase = String(options.phase || 'handoff').trim() || 'handoff';
    const config = await readConfig(true);
    const base = {
      schema: 'memory-suite.handoff-storage.v1',
      namespace,
      pluginId,
      phase,
      mode: config.mode,
      modeLabel: modeLabel(config.mode),
      serverRequired: config.mode !== MODE_PLUGIN_ONLY,
      verified: true,
      pluginSync: null,
      localSync: null,
      integrity: null,
      checkedAt: Date.now()
    };
    if (config.mode === MODE_PLUGIN_ONLY) return base;

    const before = await remoteIntegrity();
    let pluginSync = null;
    let localSync = null;
    if (config.mode === MODE_MIRROR) {
      if (state.legacy.plugin) {
        pluginSync = await synchronizeLegacyWithServer(state.legacy.plugin, 'plugin', {
          allowOverwrite: true,
          restoreMissingLocal: true
        });
        if (Array.isArray(pluginSync?.failures) && pluginSync.failures.length) {
          const error = new Error(`memory_suite_handoff_plugin_sync_failed:${pluginSync.failures.length}`);
          error.code = 'MEMORY_SUITE_HANDOFF_SYNC_FAILED';
          error.sync = pluginSync;
          throw error;
        }
      }
      if (state.legacy.local && typeof state.legacy.local?.keys === 'function') {
        localSync = await synchronizeLegacyWithServer(state.legacy.local, 'local', {
          allowOverwrite: true,
          restoreMissingLocal: true
        });
        if (Array.isArray(localSync?.failures) && localSync.failures.length) {
          const error = new Error(`memory_suite_handoff_local_sync_failed:${localSync.failures.length}`);
          error.code = 'MEMORY_SUITE_HANDOFF_SYNC_FAILED';
          error.sync = localSync;
          throw error;
        }
      }
    }
    const after = await remoteIntegrity();
    const result = {
      ...base,
      checkedAt: Date.now(),
      pluginSync,
      localSync,
      integrity: after,
      integrityBefore: before
    };
    setStatus('handoff_storage_ready', '', {
      mode: config.mode,
      phase,
      serverVersion: state.status.serverVersion || '',
      records: Number(after?.records || 0) || 0
    });
    return result;
  };

  const serverGet = async (space, key) => await remoteGet(String(space || 'plugin'), String(key || ''));
  const serverGetMany = async (space = 'plugin', keys = []) => await remoteGetMany(String(space || 'plugin'), keys);
  const serverKeys = async (space = 'plugin', prefix = '') => await remoteKeys(String(space || 'plugin'), String(prefix || ''));
  const serverIntegrity = async () => await remoteIntegrity();

  const cloneDiagnosticValue = value => {
    if (!value || typeof value !== 'object') return value || null;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return { ...value }; }
  };
  const offlineDiagnostics = async (error = null, manager = false) => {
    let scope = null;
    let mode = MODE_PLUGIN_ONLY;
    try {
      scope = await resolveCurrentScope(false);
      mode = (await readScopeMode(scope, false)).mode;
    } catch (_) {}
    return {
      schema: manager ? 'memory-suite.manager-server-diagnostics.v1' : 'memory-suite.plugin-server-diagnostics.v1',
      generatedAt: Date.now(),
      reachable: false,
      namespace: manager ? '' : namespace,
      pluginId,
      pluginVersion,
      scope: scope ? { label: String(scope.label || ''), available: scope.available !== false } : null,
      storageMode: mode,
      error: compact(error?.message || error || 'server_unavailable', 900),
      status: { ...state.status }
    };
  };
  const getCachedDiagnostics = () => cloneDiagnosticValue(state.diagnostics.value) || {
    schema: 'memory-suite.plugin-server-diagnostics.v1',
    generatedAt: 0,
    reachable: null,
    namespace,
    pluginId,
    pluginVersion,
    status: { ...state.status },
    reason: 'diagnostics_not_loaded'
  };
  const getDiagnostics = async (options = {}) => {
    const force = options.force === true;
    const maxAgeMs = Math.max(0, Math.min(10 * 60 * 1000, Number(options.maxAgeMs ?? 30000) || 0));
    if (!force && state.diagnostics.value && Date.now() - Number(state.diagnostics.at || 0) <= maxAgeMs) return cloneDiagnosticValue(state.diagnostics.value);
    if (!force && state.diagnostics.pending) return await state.diagnostics.pending;
    const pending = (async () => {
      let scope = null;
      let mode = MODE_PLUGIN_ONLY;
      try {
        scope = normalizeScopeDescriptor(options.scope || await resolveCurrentScope(false));
        mode = (await readScopeMode(scope, false)).mode;
        if (mode === MODE_PLUGIN_ONLY && options.probeServer !== true) {
          const result = {
            schema: 'memory-suite.plugin-server-diagnostics.v1', generatedAt: Date.now(), reachable: null,
            reason: 'plugin_only_no_server_probe', namespace, pluginId, pluginVersion, storageMode: mode,
            scope: scope ? { label: String(scope.label || ''), available: scope.available !== false } : null,
            clientStatus: { ...state.status }
          };
          state.diagnostics.value = result;
          state.diagnostics.at = Date.now();
          return cloneDiagnosticValue(result);
        }
        const connection = await bootstrap(force, true);
        if (connection?.capabilities?.['server-diagnostics.v1'] !== true) {
          const result = {
            schema: 'memory-suite.plugin-server-diagnostics.v1',
            generatedAt: Date.now(),
            reachable: true,
            supported: false,
            reason: 'server_diagnostics_unsupported',
            namespace,
            pluginId,
            pluginVersion,
            storageMode: mode,
            scope: scope ? { label: String(scope.label || ''), available: scope.available !== false } : null,
            server: { version: String(connection?.version || ''), protocol: cloneDiagnosticValue(connection?.protocol || {}) },
            clientStatus: { ...state.status }
          };
          state.diagnostics.value = result;
          state.diagnostics.at = Date.now();
          return cloneDiagnosticValue(result);
        }
        const limit = Math.max(1, Math.min(1000, Number(options.limit || 500) || 500));
        const since = Math.max(0, Number(options.since || 0) || 0);
        const query = [
          `namespace=${encodeURIComponent(namespace)}`,
          `limit=${limit}`,
          `since=${since}`,
          `includeGlobal=${options.includeGlobal === false ? '0' : '1'}`,
          `includeTextLogs=${options.includeTextLogs === true ? '1' : '0'}`,
          ...(scope?.scopeId ? [`scopeId=${encodeURIComponent(scope.scopeId)}`] : [])
        ].join('&');
        const payload = await request('GET', `/v1/diagnostics?${query}`, null, { allowPluginOnly: true, scope, storageMode: mode, forceBootstrap: force });
        const result = {
          ...(payload?.result || {}),
          schema: 'memory-suite.plugin-server-diagnostics.v1',
          reachable: true,
          namespace,
          pluginId,
          pluginVersion,
          storageMode: mode,
          scope: scope ? { label: String(scope.label || ''), available: scope.available !== false } : null,
          clientStatus: { ...state.status }
        };
        state.diagnostics.value = result;
        state.diagnostics.at = Date.now();
        return cloneDiagnosticValue(result);
      } catch (error) {
        const result = await offlineDiagnostics(error, false);
        state.diagnostics.value = result;
        state.diagnostics.at = Date.now();
        return cloneDiagnosticValue(result);
      } finally {
        state.diagnostics.pending = null;
      }
    })();
    state.diagnostics.pending = pending;
    return await pending;
  };
  const refreshDiagnostics = async (options = {}) => await getDiagnostics({ ...options, force: true });
  const scheduleDiagnosticsRefresh = (delayMs = 0, options = {}) => {
    if (state.diagnostics.timer) clearTimeout(state.diagnostics.timer);
    state.diagnostics.timer = setTimeout(() => {
      state.diagnostics.timer = null;
      void (async () => {
        const registry = await loadScopeRegistry(false, false);
        const hasServerScope = Object.values(registry?.entries || {}).some(row => normalizeMode(row?.mode) !== MODE_PLUGIN_ONLY);
        // Once legacy mode migration is complete, a fully plugin-only registry
        // needs no startup chat lookup and no diagnostics request.
        if (registry?.legacyGlobalModeImported === true && !hasServerScope) return;
        const scope = await resolveCurrentScope(false);
        if ((await readScopeMode(scope, false)).mode === MODE_PLUGIN_ONLY) return;
        await refreshDiagnostics(options);
      })().catch(() => {});
    }, Math.max(0, Number(delayMs || 0) || 0));
    return true;
  };

  const decorateDebugExport = async (payload, options = {}) => {
    const source = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : { value: payload };
    const memorySuite = await getDiagnostics({ force: options.force !== false, limit: options.limit || 500, since: options.since || 0, includeGlobal: options.includeGlobal !== false, includeTextLogs: options.includeTextLogs === true });
    return { ...source, memorySuite };
  };
  const decorateDebugExportSync = payload => {
    const source = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : { value: payload };
    return { ...source, memorySuite: getCachedDiagnostics() };
  };

  const assertManagerOwner = () => {
    if (pluginId !== 'flashback_hayaku_bridge') {
      const error = new Error('memory_suite_manager_is_retrace_only');
      error.code = 'MEMORY_SUITE_MANAGER_OWNER_REQUIRED';
      throw error;
    }
  };
  const managerHeaders = Object.freeze({
    'X-Memory-Suite-Manager': 'retrace',
    'X-Memory-Suite-Plugin': 'flashback_hayaku_bridge'
  });
  const managerRequest = async (method, route, body = null) => {
    assertManagerOwner();
    return await request(method, route, body, { extraHeaders: managerHeaders, allowPluginOnly: true });
  };
  const managerConnection = async () => {
    assertManagerOwner();
    return await bootstrap(false, true);
  };
  const managerGetDiagnostics = async (options = {}) => {
    try {
      const connection = await managerConnection();
      if (connection?.capabilities?.['manager-diagnostics.v1'] !== true) {
        return {
          schema: 'memory-suite.manager-server-diagnostics.v1',
          generatedAt: Date.now(),
          reachable: true,
          supported: false,
          reason: 'manager_server_diagnostics_unsupported',
          pluginId,
          pluginVersion,
          server: { version: String(connection?.version || ''), protocol: cloneDiagnosticValue(connection?.protocol || {}) },
          clientStatus: { ...state.status }
        };
      }
      const limit = Math.max(1, Math.min(1000, Number(options.limit || 1000) || 1000));
      const since = Math.max(0, Number(options.since || 0) || 0);
      const namespaceFilter = String(options.namespace || '').trim().toLowerCase();
      const scope = options.scope || options.currentScope === true
        ? normalizeScopeDescriptor(options.scope || await resolveCurrentScope(false))
        : null;
      const query = [
        `limit=${limit}`,
        `since=${since}`,
        `includeGlobal=${options.includeGlobal === false ? '0' : '1'}`,
        `includeTextLogs=${options.includeTextLogs === false ? '0' : '1'}`,
        ...(namespaceFilter ? [`namespace=${encodeURIComponent(namespaceFilter)}`] : []),
        ...(scope?.scopeId ? [`scopeId=${encodeURIComponent(scope.scopeId)}`] : [])
      ].join('&');
      const payload = await managerRequest('GET', `/v1/manager/diagnostics?${query}`);
      return { ...(payload?.result || {}), reachable: true, pluginId, pluginVersion, clientStatus: { ...state.status } };
    } catch (error) {
      return await offlineDiagnostics(error, true);
    }
  };
  const managerServerGet = async (targetNamespace, space, key) => {
    const ns = String(targetNamespace || '').trim().toLowerCase();
    const payload = await managerRequest('GET', `/v1/kv/get?namespace=${encodeURIComponent(ns)}&space=${encodeURIComponent(String(space || 'plugin'))}&key=${encodeURIComponent(String(key || ''))}`);
    return payload?.result || {};
  };
  const managerServerGetMany = async (targetNamespace, space = 'plugin', keys = []) => {
    const ns = String(targetNamespace || '').trim().toLowerCase();
    const list = Array.isArray(keys) ? keys.map(String).filter(Boolean).slice(0, 512) : [];
    if (!list.length) return { values: {} };
    const payload = await managerRequest('POST', '/v1/kv/get-many', { namespace: ns, space: String(space || 'plugin'), keys: list });
    return payload?.result || { values: {} };
  };
  const managerServerKeys = async (targetNamespace, space = 'plugin', prefix = '') => {
    const ns = String(targetNamespace || '').trim().toLowerCase();
    const payload = await managerRequest('GET', `/v1/kv/keys?namespace=${encodeURIComponent(ns)}&space=${encodeURIComponent(String(space || 'plugin'))}&prefix=${encodeURIComponent(String(prefix || ''))}`);
    return payload?.result || { keys: [], tombstones: [], records: [] };
  };
  const managerServerIntegrity = async targetNamespace => {
    const ns = String(targetNamespace || '').trim().toLowerCase();
    const payload = await managerRequest('GET', `/v1/integrity?namespace=${encodeURIComponent(ns)}`);
    const result = payload?.result || {};
    if (result.ok !== true || String(result.result || '') !== 'ok') throw new Error(`memory_suite_manager_integrity_failed:${ns}:${result.result || 'unknown'}`);
    return result;
  };
  const managerReplaceScopeIndex = async (targetNamespace, scopes = []) => {
    const connection = await managerConnection();
    if (connection?.capabilities?.['scope-catalog.v1'] !== true) {
      const error = new Error('memory_suite_scope_catalog_capability_missing');
      error.code = 'MEMORY_SUITE_MANAGER_CAPABILITY_MISSING';
      throw error;
    }
    const response = await managerRequest('POST', '/v1/manager/scopes/index', {
      namespace: String(targetNamespace || namespace || ''),
      scopes: Array.isArray(scopes) ? scopes : []
    });
    return response?.result || null;
  };
  const managerListScopes = async () => {
    const response = await managerRequest('GET', '/v1/manager/scopes');
    return response?.result || { scopes: [] };
  };
  const managerPlanScopeDeletion = async payload => {
    const connection = await managerConnection();
    if (connection?.capabilities?.['scope-delete-preview.v1'] !== true) {
      const error = new Error('memory_suite_scope_delete_capability_missing');
      error.code = 'MEMORY_SUITE_MANAGER_CAPABILITY_MISSING';
      throw error;
    }
    const response = await managerRequest('POST', '/v1/manager/scope-delete/plan', payload || {});
    return response?.result || null;
  };
  const managerExecuteScopeDeletion = async (planId, mutationFingerprint) => {
    const connection = await managerConnection();
    if (connection?.capabilities?.['scope-delete-commit.v1'] !== true) throw new Error('memory_suite_scope_delete_commit_capability_missing');
    const response = await managerRequest('POST', '/v1/manager/scope-delete/execute', {
      planId: String(planId || ''),
      mutationFingerprint: String(mutationFingerprint || '')
    });
    return response?.result || null;
  };
  const managerSetScopePinned = async (targetNamespace, scopeId, pinned) => {
    const connection = await managerConnection();
    if (connection?.capabilities?.['scope-pin.v1'] !== true) {
      const error = new Error('memory_suite_scope_pin_capability_missing');
      error.code = 'MEMORY_SUITE_MANAGER_CAPABILITY_MISSING';
      throw error;
    }
    const response = await managerRequest('POST', '/v1/manager/scope-pin', {
      namespace: String(targetNamespace || namespace || ''),
      scopeId: String(scopeId || ''),
      pinned: pinned === true
    });
    return response?.result || null;
  };

  const bridge = Object.freeze({
    namespace,
    pluginId,
    get: scopedGet,
    set: scopedSet,
    remove: scopedRemove,
    keys: scopedKeys,
    bootstrap: scopedBootstrap,
    shouldRoute: matchesRoute,
    createPluginStorageProxy: legacy => createScopedProxy(legacy, 'plugin', proxyCache),
    createLocalStorageProxy: legacy => createScopedProxy(legacy, 'local', localProxyCache),
    synchronizeNow: async () => await scopedSynchronizeAll({ allowOverwrite: true, restoreMissingLocal: true }),
    startSynchronizationJob: scopedStartSynchronizationJob,
    startConnectionConfigurationJob: scopedStartConnectionConfigurationJob,
    startRestoreJob: scopedStartRestoreJob,
    resumePendingSyncJob: scopedResumePendingSyncJob,
    waitForSyncJob: scopedWaitForSyncJob,
    getSyncJob,
    subscribeSyncJob,
    verifyServerPreservation: async () => await scopedVerifyPreservation(state.legacy.plugin),
    restorePluginStorage: async () => await scopedRestoreAll({}),
    testConnection,
    setServerUrl: persistServerUrl,
    configureConnection: scopedConfigureConnection,
    getConnectionSettings: scopedGetConnectionSettings,
    mountConnectionPanel: scopedMountConnectionPanel,
    restoreServerSpaceToLegacy: scopedRestoreSpace,
    prepareServerScopeDeletion: scopedPrepareServerScopeDeletion,
    deletePluginStorageAfterServerVerification: scopedDeletePluginStorageAfterVerification,
    setMode: scopedSetModeSafely,
    getMode: async () => (await readScopeMode(null, true)).mode,
    getCurrentScope: async () => await resolveCurrentScope(true),
    getScopeMode: async scope => await readScopeMode(scope, true),
    setScopeMode: async (scope, mode) => await scopedSetModeSafely(mode, { scope }),
    ensureHandoffReady: scopedEnsureHandoffReady,
    serverGet: scopedServerGet,
    serverGetMany: scopedServerGetMany,
    serverKeys: scopedServerKeys,
    serverIntegrity: scopedServerIntegrity,
    getDiagnostics,
    refreshDiagnostics,
    scheduleDiagnosticsRefresh,
    getCachedDiagnostics,
    decorateDebugExport,
    decorateDebugExportSync,
    managerGetDiagnostics,
    managerConnection,
    managerServerGet,
    managerServerGetMany,
    managerServerKeys,
    managerServerIntegrity,
    managerReplaceScopeIndex,
    managerListScopes,
    managerPlanScopeDeletion,
    managerExecuteScopeDeletion,
    managerSetScopePinned,
    openManagementDialog,
    registerManagementButton,
    status: () => ({
      ...state.status,
      scope: state.scopeRouting.current ? { ...state.scopeRouting.current } : null,
      mode: state.config.mode,
      modeLabel: modeLabel(state.config.mode),
      lastLegacyImport: state.scopeRouting.lastLegacyImport,
      lastManagementResult: state.management.lastResult,
      migration: { plugin: { ...state.migration.plugin }, local: { ...state.migration.local } },
      syncJob: getSyncJob()
    })
  });
  scheduleManagementRegistration();
  const startupDiagnosticsDelayMs = Math.max(1200, Math.min(15000, Number(options.startupDiagnosticsDelayMs || (3500 + (namespaceDelaySeed % 7) * 350)) || 3500));
  scheduleDiagnosticsRefresh(startupDiagnosticsDelayMs, { limit: 250 });
  return bridge;

};

  const PLUGIN_NAME = 'RE:TRACE';
const PLUGIN_VERSION = '1.9.48';
  const HANDOFF_SCHEMA = 'memory-session-bridge-v2';
  const HANDOFF_ACCEPTED_SCHEMAS = new Set(['memory-session-bridge-v1', HANDOFF_SCHEMA]);
  const HANDOFF_JOURNAL_SCHEMA = 'memory-session-bridge-handoff-journal-v1';
  const RETRACE_PEER_COMPATIBILITY_SCHEMA = 'retrace.peer_compatibility.v1';
  const RETRACE_PEER_PROTOCOL_MAJOR = 1;
  const FLASHBACK_HANDOFF_RECEIPT_SCHEMA = 'flashback_memory.session_handoff_adoption.v4';
  const HAYAKU_HANDOFF_RECEIPT_SCHEMA = 'hayaku.session_handoff.receipt.v1';
  const HAYAKU_REQUIRED_HANDOFF_CONTRACT = 'hayaku.handoff_immutable_source.v1';
  const LIBRA_REQUIRED_HANDOFF_CONTRACT = 'libra.handoff_immutable_source.v1';
  const LIA_REQUIRED_HANDOFF_CONTRACT = 'lia.live_persona_handoff_immutable_source.v1';
  const LIBRA_PLUGIN_ID = 'libra';
  const LIBRA_IPC_SCHEMA = 'libra-retrace-ipc-v1';
  const LIBRA_IPC_REQUEST_CHANNEL = 'libra_memory_bridge_request_v1';
  const LIBRA_IPC_RESPONSE_CHANNEL = 'libra_memory_bridge_response_v1';
  const LIBRA_INSPECT_SCHEMA = 'libra.retrace.inspect.v1';
  const LIBRA_CAPABILITIES_SCHEMA = 'libra.retrace.capabilities.v1';
  const LIBRA_HANDOFF_RECEIPT_SCHEMA = 'libra.session_handoff.receipt.v1';
  const LIBRA_CHAT_HANDOFF_MARKER_SCHEMA = 'retrace.libra_handoff_marker.v1';
  const LIBRA_IPC_TIMEOUT_MAX_MS = 120000;
  const LIBRA_INSPECT_TIMEOUT_MS = 15000;
  const LIBRA_INSPECT_SUMMARY_TIMEOUT_MS = 5000;
  const LIBRA_PREPARE_TIMEOUT_MS = 90000;
  const LIBRA_ADOPT_TIMEOUT_MS = 90000;
  const LIBRA_VERIFY_TIMEOUT_MS = 60000;
  const LIA_PLUGIN_ID = 'lia_persona_linker';
  const LIA_IPC_SCHEMA = 'lia-persona-handoff-ipc-v1';
  const LIA_IPC_REQUEST_CHANNEL = 'lia_persona_handoff_request_v1';
  const LIA_IPC_RESPONSE_CHANNEL = 'lia_persona_handoff_response_v1';
  const LIA_HANDOFF_RECEIPT_SCHEMA = 'lia.live_persona_handoff.receipt.v1';
  const LIA_CHAT_HANDOFF_MARKER_SCHEMA = 'retrace.lia_live_persona_handoff.v1';
  const LIA_LIVE_PERSONA_ID_PREFIX = 'lia-live-persona::';
  const FLASHBACK_PLUGIN_ID = 'flashback_memory';
  const FLASHBACK_IPC_SCHEMA = 'flashback-memory-bridge-ipc-v1';
  const FLASHBACK_IPC_REQUEST_CHANNEL = 'flashback_memory_bridge_request_v1';
  const FLASHBACK_IPC_RESPONSE_CHANNEL = 'flashback_memory_bridge_response_v1';
  const FLASHBACK_IPC_TIMEOUT_MAX_MS = 120000;
  const FLASHBACK_INSPECT_SUMMARY_TIMEOUT_MS = 1800;
  const FLASHBACK_INSPECT_SUMMARY_CIRCUIT_MS = 60000;
  const FLASHBACK_CAPABILITY_TIMEOUT_MS = 8000;
  const FLASHBACK_INSPECT_RECORDS_TIMEOUT_MS = 30000;
  const FLASHBACK_ADOPT_TIMEOUT_MS = 90000;
  const FLASHBACK_LATE_READBACK_TIMEOUT_MS = 6000;
  const FLASHBACK_REQUIRED_HANDOFF_CONTRACT = 'flashback_memory.handoff_immutable_source.v2';
  const HAYAKU_PLUGIN_ID = 'hayaku_locator_continuity';
  const HAYAKU_IPC_SCHEMA = 'hayaku-memory-bridge-ipc-v1';
  const HAYAKU_IPC_REQUEST_CHANNEL = 'hayaku_memory_bridge_request_v1';
  const HAYAKU_IPC_RESPONSE_CHANNEL = 'hayaku_memory_bridge_response_v1';
  const HAYAKU_RECOVERY_DEBT_EVENT_SCHEMA = 'hayaku-retrace-event-v1';
  const HAYAKU_RECOVERY_DEBT_EVENT_CHANNEL = 'hayaku_retrace_event_v1';
  const HAYAKU_RECOVERY_DEBT_CONTRACT = 'hayaku_recovery_debt_worldline_v1';
  const HAYAKU_AUTO_REPAIR_RUN_SCHEMA = 'retrace.hayaku_auto_repair_run.v1';
  const HAYAKU_AUTO_REPAIR_RUN_PREFIX = 'memory_session_bridge:hayaku_auto_repair_run:';
  const HAYAKU_AUTO_REPAIR_CAPSULE_PREFIX = 'memory_session_bridge:hayaku_auto_repair_capsule:';
  const HAYAKU_OWNER_GATE_CACHE_MS = 10_000;
  const HAYAKU_AUTO_REPAIR_RETRY_MS = 15_000;
  const HAYAKU_RETRACE_COMPATIBILITY_BEACON_SCHEMA = 'hayaku.retrace_compatibility_beacon.v1';
  const HAYAKU_RETRACE_COMPATIBILITY_BEACON_KEY = 'hayaku.v2.retrace_compatibility.v1';
  const HAYAKU_IPC_MUTATION_ACTIONS = new Set([
    'adopt_cold_start',
    'adopt_incremental_recovery',
    'sync_analysis_capsules',
    'acquire_recovery_debt_lease',
    'release_recovery_debt_lease',
    'adopt_session_handoff',
    'forget'
  ]);
  const FLASHBACK_REGISTRY_KEY = 'vector_rag_memory:scope_registry:v2';
  const FLASHBACK_SCOPE_PREFIX = 'vector_rag_memory:scope:';
  const FLASHBACK_ARCHIVE_REF_SCHEMA = 'flashback_memory.archive_ref.v1';
  const FLASHBACK_ARCHIVE_SHARD_GZIP_SCHEMA = 'flashback_memory.archive_shard_gzip.v1';
  const FLASHBACK_ARCHIVE_SHARD_GZIP_ENCODING = 'gzip+base64';
  const FLASHBACK_ARCHIVE_MAX_DEPTH = 256;
  const HAYAKU_LEDGER_PREFIX = 'hayaku.v2.ledger.';
  const HAYAKU_LEDGER_SCHEMAS = new Set(['hayaku_storage_ledger_v1', 'hayaku_storage_ledger_v2']);
  const HAYAKU_ARCHIVE_SCHEMA = 'hayaku.shared_archive.v1';
  const HAYAKU_ARCHIVE_GZIP_SCHEMA = 'hayaku.shared_archive.gzip.v1';
  const HAYAKU_ARCHIVE_GZIP_ENCODING = 'gzip+base64';
  const HAYAKU_ARCHIVE_META_SCHEMA = 'hayaku.shared_archive_meta.v1';
  const HAYAKU_ARCHIVE_REF_SCHEMA = 'hayaku.shared_archive_ref.v1';
  const HAYAKU_ARCHIVE_META_KEY_PREFIX = 'hayaku.v2.shared_archive_meta.';
  const HAYAKU_ARCHIVE_MAX_DEPTH = 256;
  const SETTINGS_KEY = 'memory_session_bridge:settings:v1';
  const LOCAL_SETTINGS_BACKUP_KEY = 'memory_session_bridge:settings_local_backup:v1';
  const SETTINGS_PERSISTENCE_SCHEMA = 'retrace.provider_settings_backup.v1';
  const COLD_START_PREFIX = 'memory_session_bridge:hayaku_cold_start:';
  const COLD_START_SCHEMA = 'memory-session-bridge-hayaku-cold-start-v1';
  const COLD_START_RUN_PREFIX = 'memory_session_bridge:hayaku_cold_start_run:';
  const COLD_START_RUN_SCHEMA = 'memory-session-bridge-hayaku-cold-start-run-v1';
  const INCREMENTAL_RECOVERY_PREFIX = 'memory_session_bridge:hayaku_incremental_recovery:';
  const INCREMENTAL_RECOVERY_SCHEMA = 'memory-session-bridge-hayaku-incremental-recovery-v1';
  const INCREMENTAL_RECOVERY_RUN_PREFIX = 'memory_session_bridge:hayaku_incremental_recovery_run:';
  const INCREMENTAL_RECOVERY_RUN_SCHEMA = 'memory-session-bridge-hayaku-incremental-recovery-run-v1';
  const HAYAKU_BACKUP_PREFIX = 'memory_session_bridge:hayaku_ledger_backup:';
  const HAYAKU_BACKUP_SCHEMA = 'memory-session-bridge-hayaku-ledger-backup-v1';
  const HAYAKU_BACKUP_CATALOG_PREFIX = 'memory_session_bridge:hayaku_ledger_backup_catalog:';
  const HAYAKU_BACKUP_CATALOG_SCHEMA = 'memory-session-bridge-hayaku-ledger-backup-catalog-v1';
  const COLD_START_CHUNK_CHARS = 9000;
  // Keep the legacy 24,000-character contract as the fallback for older HAYAKU
  // builds. Patched/current HAYAKU advertises its actual capacity at runtime.
  const HAYAKU_PACKET_FALLBACK_MAX_CHARS = 24000;
  const HAYAKU_PACKET_MAX_CHARS = HAYAKU_PACKET_FALLBACK_MAX_CHARS; // compatibility alias
  const HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS = 8192;
  const HAYAKU_ANALYSIS_RECOVERY_POLICY = 'libra_pair_boundary_repair_v1';
  const HAYAKU_PACKET_AUTHORING_PROFILE_SCHEMA = 'hayaku-packet-authoring-profile-v1';
  const HAYAKU_PACKET_AUTHORING_ALIAS_LANGUAGES = Object.freeze(['ko', 'en', 'ja', 'zh']);
  const HAYAKU_CANONICAL_ANCHOR_PREFIXES = Object.freeze([
    'object', 'color', 'place', 'position', 'relation', 'state', 'info', 'time',
    'intent', 'emotion', 'event', 'promise', 'person', 'entity', 'world',
    'narrative', 'story', 'locator'
  ]);
  const FLASHBACK_VIEWER_MAX_RENDERED_RECORDS = 240;
  const HAYAKU_VIEWER_MAX_RENDERED_RECORDS = 240;
  const LIBRA_VIEWER_MAX_RENDERED_RECORDS = 240;

  const Runtime = {
    visible: false,
    mounted: false,
    root: null,
    activeTab: 'session',
    busy: false,
    analysisTask: null,
    analysisProgress: null,
    analysisRefreshTimer: null,
    registered: { setting: null, hamburger: null },
    lastPreview: null,
    lastTransition: null,
    lastColdStart: null,
    lastIncrementalRecovery: null,
    lastHayakuBackup: null,
    memorySuitePeerServer: null,
    compatibilitySuite: null,
    compatibilityCheckedAt: 0,
    compatibilityAcknowledgedAt: 0,
    compatibilityAutoRetryTimer: null,
    compatibilityAutoRetryAttempt: 0,
    hayakuActionRecords: [],
    hayakuMaxTurn: 0,
    settings: null,
    providerHealth: new Map(),
    providerModelLoading: new Set(),
    flashbackIpcRegistered: false,
    flashbackIpcPending: new Map(),
    flashbackIpcLastSeenAt: 0,
    flashbackIpcLastError: '',
    flashbackIpcLastTimeoutAt: 0,
    flashbackInspectCircuitUntil: 0,
    flashbackInspectCircuitTrips: 0,
    flashbackInspectFallbackCount: 0,
    flashbackInspectLastFallbackAt: 0,
    flashbackInspectLastFallbackReason: '',
    flashbackInspectIpcSuccesses: 0,
    flashbackInspectSummaryPromise: null,
    hayakuIpcRegistered: false,
    hayakuIpcPending: new Map(),
    hayakuIpcUnavailableUntil: 0,
    hayakuRecoveryEventRegistered: false,
    hayakuRecoveryEventHandler: null,
    hayakuOwnerGate: { state: 'unknown', ready: false, reason: '', checkedAt: 0, capabilities: null },
    hayakuAutoRepair: {
      timer: null,
      inFlight: false,
      queuedReason: '',
      runId: '',
      debtId: '',
      lastResult: null,
      lastError: '',
      runs: 0,
      successes: 0,
      failures: 0
    },
    libraIpcRegistered: false,
    libraIpcPending: new Map(),
    libraIpcLastSeenAt: 0,
    libraIpcLastError: '',
    liaIpcRegistered: false,
    liaIpcPending: new Map(),
    liaIpcLastError: '',
    handoffResumePromises: new Map(),
    dialogResolver: null,
    dialogKeyHandler: null,
    dialogSequence: 0,
    lastUiDialog: null,
    warnings: []
  };

  const text = value => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    try { return JSON.stringify(value); } catch (_) { return String(value); }
  };
  const isPermanentSessionHistory = record => Boolean(
    record?.permanentSessionHistory === true
    || record?.deletionProtected === true
    || text(record?.historicalProtection || '').trim() === 'permanent_session_history'
  );
  const compact = (value, max = 180) => {
    const source = text(value).replace(/\s+/g, ' ').trim();
    return source.length <= max ? source : `${source.slice(0, Math.max(1, max - 1))}…`;
  };
  const clone = (value, fallback = null) => {
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return fallback; }
  };
  const numericVersionParts = value => text(value || '').match(/\d+/g)?.slice(0, 3).map(Number) || [];
  const versionAtLeast = (value, minimum) => {
    const left = numericVersionParts(value);
    const right = numericVersionParts(minimum);
    for (let index = 0; index < 3; index += 1) {
      const a = Number(left[index] || 0);
      const b = Number(right[index] || 0);
      if (a !== b) return a > b;
    }
    return true;
  };

  const RETRACE_REQUIRED_PEER_FEATURES = Object.freeze([
    'inspect',
    'nextSessionHandoff',
    'sourceImmutableHandoff',
    'durableTargetReadback',
    'idempotentHandoff',
    'inheritedStateUsable'
  ]);

  const RETRACE_PEER_REQUIREMENTS = Object.freeze({
    flashback: Object.freeze({
      key: 'flashback',
      label: 'FLASHBACK',
      pluginId: FLASHBACK_PLUGIN_ID,
      handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
      receiptSchema: FLASHBACK_HANDOFF_RECEIPT_SCHEMA,
      peerRole: 'episodic_memory'
    }),
    hayaku: Object.freeze({
      key: 'hayaku',
      label: 'HAYAKU',
      pluginId: HAYAKU_PLUGIN_ID,
      handoffContract: HAYAKU_REQUIRED_HANDOFF_CONTRACT,
      receiptSchema: HAYAKU_HANDOFF_RECEIPT_SCHEMA,
      peerRole: 'packet_continuity_memory'
    }),
    libra: Object.freeze({
      key: 'libra',
      label: 'LIBRA',
      pluginId: LIBRA_PLUGIN_ID,
      handoffContract: LIBRA_REQUIRED_HANDOFF_CONTRACT,
      receiptSchema: LIBRA_HANDOFF_RECEIPT_SCHEMA,
      peerRole: 'canonical_long_term_memory'
    }),
    lia: Object.freeze({
      key: 'lia',
      label: 'LIA',
      pluginId: LIA_PLUGIN_ID,
      handoffContract: LIA_REQUIRED_HANDOFF_CONTRACT,
      receiptSchema: LIA_HANDOFF_RECEIPT_SCHEMA,
      peerRole: 'live_persona_state'
    })
  });
  const ACTIVE_RETRACE_PEER_KEYS = Object.freeze(['flashback', 'hayaku', 'libra', 'lia']);

  const peerCompatibilityPayload = value => {
    const source = value && typeof value === 'object' ? value : {};
    const candidates = [
      source.compatibility,
      source.retraceCompatibility,
      source.capabilities?.retraceCompatibility,
      source.features?.retraceCompatibility,
      source.ipcCapabilities?.retraceCompatibility,
      source.runtime?.capabilities?.retraceCompatibility,
      source
    ];
    return candidates.find(item => item && typeof item === 'object' && text(item.schema || '') === RETRACE_PEER_COMPATIBILITY_SCHEMA) || null;
  };

  const evaluatePeerCompatibility = (requirement, rawCompatibility, installed = true, options = {}) => {
    const payload = peerCompatibilityPayload(rawCompatibility);
    const required = options.required === true;
    const errors = [];
    if (!installed) {
      return {
        key: requirement.key,
        label: requirement.label,
        pluginId: requirement.pluginId,
        installed: false,
        required,
        compatible: !required,
        blocking: required,
        status: required ? 'missing_required' : 'not_installed',
        pluginVersion: '',
        protocolMajor: 0,
        handoffContract: '',
        reason: required ? `${requirement.label}가 현재 세션 승계에 필요하지만 연결되지 않았습니다.` : `${requirement.label}가 설치/연결되지 않았습니다.`,
        errors: required ? ['peer_not_installed'] : [],
        compatibility: null
      };
    }
    if (!payload) errors.push('compatibility_contract_missing');
    if (payload && Number(payload.protocolMajor || 0) !== RETRACE_PEER_PROTOCOL_MAJOR) errors.push('protocol_major_mismatch');
    if (payload && text(payload.pluginId || '') !== requirement.pluginId) errors.push('plugin_id_mismatch');
    if (payload && requirement.peerRole && text(payload.peerRole || '') !== requirement.peerRole) errors.push('peer_role_mismatch');
    for (const feature of RETRACE_REQUIRED_PEER_FEATURES) {
      if (payload && payload.features?.[feature] !== true) errors.push(`feature_missing:${feature}`);
    }
    if (payload && text(payload.handoff?.contract || '') !== requirement.handoffContract) errors.push('handoff_contract_mismatch');
    if (payload && !Array.isArray(payload.handoff?.receiptSchemas)) errors.push('receipt_schema_list_missing');
    if (payload && Array.isArray(payload.handoff?.receiptSchemas)
      && !payload.handoff.receiptSchemas.map(value => text(value)).includes(requirement.receiptSchema)) {
      errors.push('receipt_schema_mismatch');
    }
    if (payload && payload.handoff?.sourceMutationAllowed !== false) errors.push('source_mutation_not_forbidden');
    if (payload && payload.handoff?.sourceCompactionAllowed !== false) errors.push('source_compaction_not_forbidden');
    if (payload && payload.handoff?.physicalCopyRequired !== false) errors.push('physical_copy_requirement_unsupported');
    const compatible = errors.length === 0;
    const blocking = required && !compatible;
    return {
      key: requirement.key,
      label: requirement.label,
      pluginId: requirement.pluginId,
      installed: true,
      required,
      compatible,
      blocking,
      status: compatible ? 'compatible' : (blocking ? 'incompatible_required' : 'incompatible_optional'),
      pluginVersion: text(payload?.pluginVersion || rawCompatibility?.pluginVersion || rawCompatibility?.version || ''),
      protocolMajor: Number(payload?.protocolMajor || 0) || 0,
      handoffContract: text(payload?.handoff?.contract || ''),
      reason: compatible
        ? `${requirement.label} 호환 계약이 확인되었습니다.`
        : blocking
          ? `${requirement.label}가 이번 승계에 필요하지만 호환 계약이 맞지 않습니다: ${errors.join(', ')}`
          : `${requirement.label}가 설치되어 있지만 이번 승계에는 필요하지 않습니다. 호환 계약 불일치는 경고만 표시합니다: ${errors.join(', ')}`,
      errors,
      compatibility: payload ? clone(payload, {}) : null
    };
  };

  const sourcePreservationReceiptMatches = (receipt, requirement, options = {}) => {
    if (!receipt || typeof receipt !== 'object') return false;
    const physicalField = text(options.physicalField || 'physicalCopies');
    const physicalValue = Number(receipt?.[physicalField] || 0) || 0;
    return text(receipt?.handoffContract || '') === requirement.handoffContract
      && receipt?.sourcePreserved === true
      && receipt?.sourceMutationAllowed === false
      && receipt?.sourceCompactionAllowed === false
      && text(receipt?.sourceFingerprintBefore || '').length > 0
      && text(receipt?.sourceFingerprintBefore || '') === text(receipt?.sourceFingerprintAfter || '')
      && physicalValue === 0;
  };
  const memorySuiteStorageReceiptMatches = (receipt, namespace = '') => {
    const storage = receipt?.memorySuiteStorage;
    if (!storage || typeof storage !== 'object') {
      const serverRow = Runtime.memorySuitePeerServer?.namespaces?.[text(namespace || '').trim().toLowerCase()];
      // If RE:TRACE can see durable server data for this owner, a legacy/runtime
      // receipt without Memory Suite synchronization proof is not enough to claim
      // that the server-side copy moved with the handoff.
      return !(serverRow?.available === true && Number(serverRow?.liveRecords || 0) > 0);
    }
    const phases = storage.before || storage.after
      ? [storage.before, storage.after].filter(Boolean)
      : [storage];
    if (!phases.length) return false;
    return phases.every(phase => {
      if (!phase || typeof phase !== 'object') return false;
      const mode = text(phase.mode || 'plugin_only').trim().toLowerCase();
      if (mode === 'plugin_only') return phase.verified !== false;
      return phase.schema === 'memory-suite.handoff-storage.v1'
        && phase.serverRequired === true
        && phase.verified === true
        && phase.integrity?.ok === true
        && text(phase.integrity?.result || '') === 'ok';
    });
  };

  const normalizedHayakuPacketMaxChars = value => {
    const number = Math.floor(Number(value));
    return Number.isFinite(number) && number >= HAYAKU_PACKET_FALLBACK_MAX_CHARS
      ? number
      : 0;
  };
  const hayakuPacketMaxCharsFrom = value => {
    if (!value || (typeof value !== 'object' && typeof value !== 'function')) return 0;
    const candidates = [
      value.maxPacketChars,
      value.storageLimits?.maxPacketChars,
      value.storage?.maxPacketChars,
      value.runtime?.storageLimits?.maxPacketChars,
      value.runtime?.storage?.maxPacketChars,
      value.ledger?.storageLimits?.maxPacketChars,
      value.ledger?.storage?.maxPacketChars,
      value.hayaku?.storageLimits?.maxPacketChars,
      value.hayaku?.storage?.maxPacketChars
    ];
    for (const candidate of candidates) {
      const normalized = normalizedHayakuPacketMaxChars(candidate);
      if (normalized) return normalized;
    }
    return 0;
  };
  const effectiveHayakuPacketMaxChars = (...sources) => {
    for (const source of sources) {
      const advertised = hayakuPacketMaxCharsFrom(source);
      if (advertised) return advertised;
    }
    try {
      const runtime = globalThis?.HAYAKU
        || globalThis?.__pluginApis__?.HAYAKU
        || globalThis?.__pluginApis__?.hayaku;
      const direct = hayakuPacketMaxCharsFrom(runtime);
      if (direct) return direct;
      const snapshot = typeof runtime?.runtime === 'function' ? runtime.runtime() : null;
      const advertised = hayakuPacketMaxCharsFrom(snapshot);
      if (advertised) return advertised;
    } catch (_) {}
    return HAYAKU_PACKET_FALLBACK_MAX_CHARS;
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  const parseJson = (value, fallback = null) => {
    if (value && typeof value === 'object') return value;
    try { return JSON.parse(String(value)); } catch (_) { return fallback; }
  };
  const retraceBase64ToBytes = encoded => {
    const source = text(encoded || '');
    if (!source) return new Uint8Array(0);
    if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(source, 'base64'));
    if (typeof atob !== 'function') throw new Error('base64_decoder_unavailable');
    const binary = atob(source);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  };
  const retraceGunzipText = async bytesInput => {
    if (typeof DecompressionStream !== 'function' || typeof TextDecoder !== 'function' || typeof Response !== 'function') {
      throw new Error('gzip_decompression_unavailable');
    }
    const bytes = bytesInput instanceof Uint8Array ? bytesInput : new Uint8Array(bytesInput || []);
    const input = new Response(bytes).body;
    if (!input?.pipeThrough) throw new Error('gunzip_input_stream_unavailable');
    const decompressed = input.pipeThrough(new DecompressionStream('gzip'));
    return new TextDecoder().decode(await new Response(decompressed).arrayBuffer());
  };
  const decodeFlashbackShardPayloadForRetrace = async rawInput => {
    const outer = parseJson(rawInput, null);
    if (!outer || typeof outer !== 'object' || Array.isArray(outer) || outer.schema !== FLASHBACK_ARCHIVE_SHARD_GZIP_SCHEMA) {
      return { parsed: outer, compressed: false, reason: '' };
    }
    try {
      if (outer.encoding !== FLASHBACK_ARCHIVE_SHARD_GZIP_ENCODING) throw new Error('archive_gzip_encoding_invalid');
      const raw = await retraceGunzipText(retraceBase64ToBytes(outer.data || ''));
      if (!raw || (outer.rawHash && flashbackKeyHash(raw) !== text(outer.rawHash))) throw new Error('archive_gzip_digest_mismatch');
      const parsed = parseJson(raw, null);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('archive_gzip_body_invalid');
      return { parsed, compressed: true, reason: '' };
    } catch (error) {
      return { parsed: null, compressed: true, reason: compact(error?.message || error, 240) };
    }
  };
  const decodeHayakuArchivePayloadForRetrace = async rawInput => {
    const outer = parseJson(rawInput, null);
    if (!outer || typeof outer !== 'object' || Array.isArray(outer) || outer.schema !== HAYAKU_ARCHIVE_GZIP_SCHEMA) {
      return { parsed: outer, compressed: false, reason: '' };
    }
    try {
      if (outer.encoding !== HAYAKU_ARCHIVE_GZIP_ENCODING) throw new Error('archive_gzip_encoding_invalid');
      const raw = await retraceGunzipText(retraceBase64ToBytes(outer.data || ''));
      if (!raw || (outer.rawHash && stableHash64(raw) !== text(outer.rawHash))) throw new Error('archive_gzip_digest_mismatch');
      const parsed = parseJson(raw, null);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || parsed.schema !== HAYAKU_ARCHIVE_SCHEMA) throw new Error('archive_gzip_body_invalid');
      if (outer.archiveId && text(parsed.archiveId || '') !== text(outer.archiveId || '')) throw new Error('archive_gzip_identity_mismatch');
      return { parsed, compressed: true, reason: '' };
    } catch (error) {
      return { parsed: null, compressed: true, reason: compact(error?.message || error, 240) };
    }
  };
  const isFlashbackInheritedRecord = record => Boolean(
    isPermanentSessionHistory(record)
    || record?.inheritedSessionHistory === true
    || text(record?.inheritedFromScopeKey || record?.clonedFromScopeKey || '').trim()
  );
  const compareFlashbackTimelineRecords = (left, right) => {
    const leftInherited = isFlashbackInheritedRecord(left);
    const rightInherited = isFlashbackInheritedRecord(right);
    if (leftInherited !== rightInherited) return leftInherited ? -1 : 1;
    const turnOf = record => Math.max(0, Number(record?.turnIndex || record?.pairIndex || 0) || 0);
    const chunkOf = record => Math.max(0, Number(record?.chunkIndex || 0) || 0);
    const timeOf = record => Date.parse(text(
      record?.historicalEpochAt
      || record?.clonedAt
      || record?.createdAt
      || record?.updatedAt
      || ''
    )) || 0;
    if (leftInherited) {
      return timeOf(left) - timeOf(right)
        || turnOf(left) - turnOf(right)
        || chunkOf(left) - chunkOf(right)
        || text(left?.id || left?.hash).localeCompare(text(right?.id || right?.hash));
    }
    return turnOf(left) - turnOf(right)
      || timeOf(left) - timeOf(right)
      || chunkOf(left) - chunkOf(right)
      || text(left?.id || left?.hash).localeCompare(text(right?.id || right?.hash));
  };
  const compareHayakuTimelineRecords = (left, right) => {
    const leftHistorical = left?.inheritedSessionHistory === true
      || left?.memoryClass === 'historical'
      || isPermanentSessionHistory(left);
    const rightHistorical = right?.inheritedSessionHistory === true
      || right?.memoryClass === 'historical'
      || isPermanentSessionHistory(right);
    if (leftHistorical !== rightHistorical) return leftHistorical ? -1 : 1;
    const ordinalOf = (record, historical) => Math.max(0, Number(
      historical
        ? record?.historicalOrdinal || record?.requestSequence || record?.targetPairIndex || 0
        : record?.targetPairIndex || record?.requestSequence || 0
    ) || 0);
    return ordinalOf(left, leftHistorical) - ordinalOf(right, rightHistorical)
      || Number(left?.capturedAt || left?.createdAt || 0) - Number(right?.capturedAt || right?.createdAt || 0)
      || text(left?.recordId || left?.hash).localeCompare(text(right?.recordId || right?.hash));
  };
  const escapeHtml = value => text(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const formatNumber = value => {
    const number = Number(value || 0);
    try { return number.toLocaleString(); } catch (_) { return String(number); }
  };
  const warn = (message, error = null) => {
    const detail = compact(error?.message || error || '', 240);
    Runtime.warnings.push({ at: Date.now(), message: text(message), detail });
    Runtime.warnings = Runtime.warnings.slice(-30);
    try { console.warn(`[${PLUGIN_NAME}] ${message}`, error || ''); } catch (_) {}
  };

  const baseApiCandidates = () => {
    const out = [];
    const add = api => {
      if (!api || (typeof api !== 'object' && typeof api !== 'function') || out.includes(api)) return;
      out.push(api);
    };
    try { if (typeof risuai !== 'undefined') add(risuai); } catch (_) {}
    try { if (typeof risuApi !== 'undefined') add(risuApi); } catch (_) {}
    try { if (typeof risuAPI !== 'undefined') add(risuAPI); } catch (_) {}
    try { if (typeof Risuai !== 'undefined') add(Risuai); } catch (_) {}
    try { if (typeof RisuAI !== 'undefined') add(RisuAI); } catch (_) {}
    try {
      add(globalThis.risuai);
      add(globalThis.risuApi);
      add(globalThis.risuAPI);
      add(globalThis.Risuai);
      add(globalThis.RisuAI);
      add(globalThis.__pluginApis__);
    } catch (_) {}
    return out;
  };

  const legacyAdapter = legacy => {
    if (!legacy || typeof legacy !== 'object') return null;
    const wrap = fn => typeof fn === 'function' ? (...args) => Promise.resolve().then(() => fn(...args)) : undefined;
    return {
      getCharacter: wrap(legacy.getChar),
      getChar: wrap(legacy.getChar),
      setCharacter: wrap(legacy.setChar),
      setCharacterToIndex: wrap(legacy.setCharacterToIndex),
      getCurrentCharacterIndex: wrap(legacy.getCurrentCharacterIndex),
      getCurrentChatIndex: wrap(legacy.getCurrentChatIndex),
      getCharacterFromIndex: wrap(legacy.getCharacterFromIndex),
      getChatFromIndex: wrap(legacy.getChatFromIndex),
      registerSetting: legacy.registerSetting,
      registerButton: legacy.registerButton,
      unregisterUIPart: legacy.unregisterUIPart,
      showContainer: legacy.showContainer,
      hideContainer: legacy.hideContainer,
      onUnload: legacy.onUnload,
      pluginStorage: legacy.pluginStorage || null
    };
  };

  const apiCandidates = () => {
    const base = baseApiCandidates();
    const out = [...base];
    for (const api of base) {
      if (api === globalThis.__pluginApis__) {
        const adapted = legacyAdapter(api);
        if (adapted) out.unshift(adapted);
      }
    }
    return out;
  };

  const liveApi = (required = []) => {
    const methods = Array.isArray(required) ? required : [required];
    const candidates = apiCandidates();
    const exact = candidates.find(api => methods.every(name => !name || typeof api?.[name] === 'function'));
    if (exact) return exact;
    return candidates.sort((a, b) => {
      const score = api => [
        'getCurrentCharacterIndex', 'getCurrentChatIndex', 'getCharacterFromIndex', 'getChatFromIndex',
        'setCharacterToIndex', 'setCharacter', 'registerSetting', 'registerButton', 'showContainer'
      ].reduce((sum, name) => sum + (typeof api?.[name] === 'function' ? 1 : 0), 0)
        + (api?.pluginStorage?.getItem ? 2 : 0);
      return score(b) - score(a);
    })[0] || null;
  };

  const legacyStorageGet = async key => {
    const api = liveApi();
    if (!api?.pluginStorage?.getItem) return null;
    try { return await api.pluginStorage.getItem(key); }
    catch (error) { warn(`storage read failed: ${key}`, error); return null; }
  };

  const legacyStorageSet = async (key, value) => {
    const api = liveApi();
    if (!api?.pluginStorage?.setItem) return false;
    try {
      const result = await api.pluginStorage.setItem(key, value);
      if (result === false) return false;
      if (typeof api.pluginStorage.getItem === 'function') {
        const expected = JSON.stringify(value);
        let matched = false;
        for (const waitMs of [0, 40, 120, 240]) {
          if (waitMs) await delay(waitMs);
          const readback = await api.pluginStorage.getItem(key);
          if (JSON.stringify(readback) === expected) {
            matched = true;
            break;
          }
        }
        if (!matched) throw new Error('retrace_pluginstorage_readback_mismatch');
      }
      return true;
    } catch (error) {
      warn(`storage write failed: ${key}`, error);
      return false;
    }
  };

  const legacyStorageRemove = async key => {
    const api = liveApi();
    if (!api?.pluginStorage) return false;
    try {
      if (typeof api.pluginStorage.removeItem === 'function') return (await api.pluginStorage.removeItem(key)) !== false;
      if (typeof api.pluginStorage.setItem === 'function') return (await api.pluginStorage.setItem(key, null)) !== false;
    } catch (error) { warn(`storage remove failed: ${key}`, error); }
    return false;
  };

  const legacyStorageKeys = async () => {
    const api = liveApi();
    if (typeof api?.pluginStorage?.keys !== 'function') return [];
    try {
      const values = await api.pluginStorage.keys();
      return Array.isArray(values) ? values.map(String).filter(Boolean) : [];
    } catch (error) {
      warn('storage key enumeration failed', error);
      return [];
    }
  };

  const RetraceLegacyPluginStorage = Object.freeze({
    getItem: legacyStorageGet,
    setItem: legacyStorageSet,
    removeItem: legacyStorageRemove,
    keys: legacyStorageKeys
  });


const memorySuiteRetraceCurrentScope = async () => {
  let context = null;
  try { context = await getCurrentContext(); } catch (_) {}
  const scope = context ? hayakuScopeFor(context) : null;
  if (!scope?.scopeKey) return null;
  return {
    scopeId: scope.scopeKey, scopeKey: scope.scopeKey,
    characterId: String(context?.character?.chaId || context?.character?.id || ''), chatId: String(context?.chat?.id || ''),
    characterName: String(context?.character?.name || ''), chatTitle: String(context?.chat?.name || context?.chat?.title || ''),
    label: [context?.character?.name, context?.chat?.name || context?.chat?.title].filter(Boolean).join(' / ') || scope.scopeKey,
    aliases: [scope.scopeKey, String(context?.chat?.id || '')].filter(Boolean)
  };
};
const memorySuiteRetraceResolveKeyScope = async ({ key, currentScope, registry }) => {
  const prefixes = [COLD_START_PREFIX,COLD_START_RUN_PREFIX,INCREMENTAL_RECOVERY_PREFIX,INCREMENTAL_RECOVERY_RUN_PREFIX,HAYAKU_BACKUP_PREFIX,HAYAKU_BACKUP_CATALOG_PREFIX];
  const prefix = prefixes.find(item => key.startsWith(item));
  if (!prefix) return { kind:'global' };
  const tail = key.slice(prefix.length);
  const candidates = [currentScope, ...Object.values(registry?.entries || {})]
    .filter(item => item?.scopeId)
    .sort((a, b) => String(b.scopeId).length - String(a.scopeId).length);
  for (const candidate of candidates) {
    const ids = [candidate.scopeId, candidate.scopeKey, ...(candidate.aliases || [])].map(String).filter(Boolean)
      .sort((a, b) => b.length - a.length);
    if (ids.some(id => tail === id || tail.startsWith(`${id}:`))) return { kind:'scope', ...candidate };
  }
  const scopeId = prefix === HAYAKU_BACKUP_PREFIX && tail.includes(':') ? tail.slice(0, tail.lastIndexOf(':')) : tail;
  return scopeId ? { kind:'scope',scopeId,scopeKey:scopeId,aliases:[scopeId],label:scopeId } : { kind:'scope',scopeAlias:tail };
};
  const MemorySuiteStorageBridge = createMemorySuiteStorageBridge({
    namespace:'retrace', displayName:'RE:TRACE', pluginId:'flashback_hayaku_bridge', pluginVersion:PLUGIN_VERSION, managementButton:false,
    pluginPrefixes:[COLD_START_PREFIX,COLD_START_RUN_PREFIX,INCREMENTAL_RECOVERY_PREFIX,INCREMENTAL_RECOVERY_RUN_PREFIX,HAYAKU_BACKUP_PREFIX,HAYAKU_BACKUP_CATALOG_PREFIX],
    excludedKeys:[SETTINGS_KEY,LOCAL_SETTINGS_BACKUP_KEY],
    excludedContains:['api_key','apikey','authorization','bearer','credential','secret','password','token'],
    currentScopeProvider:memorySuiteRetraceCurrentScope, resolveKeyScope:memorySuiteRetraceResolveKeyScope,
    preResolveKeyScope:true
  });

  const RetracePluginStorage = MemorySuiteStorageBridge.createPluginStorageProxy(RetraceLegacyPluginStorage);

  const MemorySuitePeerServerBridges = Object.freeze(Object.fromEntries([
    ['flashback', 'flashback_memory'],
    ['hayaku', 'hayaku_locator_continuity'],
    ['libra', 'libra'],
    ['lia', 'lia_persona_linker']
  ].map(([namespace, peerPluginId]) => [namespace, createMemorySuiteStorageBridge({
    namespace,
    displayName: `RE:TRACE peer ${namespace}`,
    pluginId: `flashback_hayaku_bridge:peer:${peerPluginId}`,
    pluginVersion: PLUGIN_VERSION,
    managementButton: false,
    autoMigratePlugin: false,
    autoMigrateLocal: false,
    scopeRouting: false
  })])));

  const memorySuitePeerNamespaceForKey = keyValue => {
    const key = text(keyValue || '');
    if (key.startsWith('vector_rag_memory:')) return 'flashback';
    if (key.startsWith('hayaku.v1') || key.startsWith('hayaku.archive.v1') || key.startsWith('hayaku.v2.')) return 'hayaku';
    if (key.startsWith('libra:v1:')) return 'libra';
    if (key.startsWith('liaPersona') || key.startsWith('dynamicPersonaLorebookGeneratorResultVault')) return 'lia';
    return '';
  };

  const memorySuitePeerSpaceForKey = keyValue => {
    const key = text(keyValue || '');
    if (key.startsWith('vector_rag_memory:local-vector-shard:')) return 'local';
    if (key.startsWith('libra:v1:local-vector:')) return 'local';
    return 'plugin';
  };

  const retraceMemorySuiteMode = async () => {
    try { return text(await MemorySuiteStorageBridge.getMode()).trim() || 'plugin_only'; }
    catch (_) { return 'plugin_only'; }
  };

  const peerServerRead = async (namespace, key, space = 'plugin', options = {}) => {
    const bridge = MemorySuitePeerServerBridges[namespace];
    if (!bridge) return { available: false, exists: false, tombstone: false, value: null, reason: 'unknown_namespace' };
    if (options?.forceServer !== true && await retraceMemorySuiteMode() === 'plugin_only') {
      return { available: false, skipped: true, exists: false, tombstone: false, value: null, reason: 'plugin_only_no_server_probe' };
    }
    try {
      const result = await bridge.serverGet(space, key);
      return { available: true, ...result };
    } catch (error) {
      return { available: false, exists: false, tombstone: false, value: null, reason: compact(error?.message || error, 240) };
    }
  };

  const inspectMemorySuitePeerServerData = async (options = {}) => {
    const rows = {};
    const allEntries = Object.entries({ ...MemorySuitePeerServerBridges, retrace: MemorySuiteStorageBridge });
    const peerAvailability = options?.peerAvailability && typeof options.peerAvailability === 'object'
      ? options.peerAvailability
      : {};
    const entries = allEntries.filter(([namespace]) => namespace === 'retrace' || peerAvailability[namespace] !== false);
    for (const [namespace] of allEntries) {
      if (namespace !== 'retrace' && peerAvailability[namespace] === false) {
        rows[namespace] = {
          available: false, skipped: true, integrityOk: false, records: 0, liveRecords: 0, tombstones: 0,
          reason: `${namespace}_owner_absent_disabled`
        };
      }
    }
    if (await retraceMemorySuiteMode() === 'plugin_only') {
      for (const [namespace] of entries) {
        rows[namespace] = {
          available: false, skipped: true, integrityOk: false, records: 0, liveRecords: 0, tombstones: 0,
          reason: 'plugin_only_no_server_probe'
        };
      }
      Runtime.memorySuitePeerServer = { at: Date.now(), skipped: true, reason: 'plugin_only_no_server_probe', namespaces: rows };
      return Runtime.memorySuitePeerServer;
    }
    try {
      // A single RE:TRACE bootstrap preflight prevents every peer bridge from
      // independently waiting on the same dead loopback endpoint.
      await MemorySuiteStorageBridge.bootstrap(false);
    } catch (error) {
      const reason = text(error?.code || '') === 'MEMORY_SUITE_SERVER_UNAVAILABLE'
        ? 'memory_suite_server_unavailable'
        : compact(error?.message || error, 240);
      for (const [namespace] of entries) {
        rows[namespace] = { available: false, integrityOk: false, records: 0, liveRecords: 0, tombstones: 0, reason };
      }
      Runtime.memorySuitePeerServer = { at: Date.now(), available: false, reason, namespaces: rows };
      return Runtime.memorySuitePeerServer;
    }
    await Promise.all(entries.map(async ([namespace, bridge]) => {
      try {
        const integrity = await bridge.serverIntegrity();
        const [pluginListing, localListing] = await Promise.all([
          bridge.serverKeys('plugin', ''),
          bridge.serverKeys('local', '')
        ]);
        rows[namespace] = {
          available: true,
          integrityOk: integrity?.ok === true && text(integrity?.result || '') === 'ok',
          records: Math.max(0, Number(integrity?.records || 0) || 0),
          liveRecords: Math.max(0, Number(integrity?.liveRecords || 0) || 0),
          tombstones: Math.max(0, Number(integrity?.tombstones || 0) || 0),
          pluginKeys: Array.isArray(pluginListing?.keys) ? pluginListing.keys.length : 0,
          pluginTombstones: Array.isArray(pluginListing?.tombstones) ? pluginListing.tombstones.length : 0,
          localKeys: Array.isArray(localListing?.keys) ? localListing.keys.length : 0,
          localTombstones: Array.isArray(localListing?.tombstones) ? localListing.tombstones.length : 0
        };
      } catch (error) {
        rows[namespace] = { available: false, integrityOk: false, records: 0, liveRecords: 0, tombstones: 0, reason: compact(error?.message || error, 240) };
      }
    }));
    Runtime.memorySuitePeerServer = { at: Date.now(), namespaces: rows };
    return Runtime.memorySuitePeerServer;
  };

  const storageGet = async key => {
    const peerNamespace = memorySuitePeerNamespaceForKey(key);
    if (peerNamespace) {
      const space = memorySuitePeerSpaceForKey(key);
      const localValue = await legacyStorageGet(key);
      if (await retraceMemorySuiteMode() === 'plugin_only') return localValue;
      const remote = await peerServerRead(peerNamespace, key, space, { forceServer: true });
      // A server tombstone is authoritative for a serverized key and prevents
      // stale pluginStorage remnants from resurrecting data after guarded deletion.
      if (remote.available && remote.tombstone === true) return null;
      // Mirror/plugin-only peers may have a newer local value while a background
      // server sync is settling, so preserve local-first semantics when it exists.
      if (localValue !== null && localValue !== undefined && localValue !== '') return localValue;
      if (remote.available && remote.exists === true) return remote.value;
      return null;
    }
    try { return await RetracePluginStorage.getItem(key); }
    catch (error) { warn(`RE:TRACE storage read failed: ${key}`, error); return null; }
  };

  const storageSet = async (key, value) => {
    try { return (await RetracePluginStorage.setItem(key, value)) !== false; }
    catch (error) {
      warn(`RE:TRACE storage write failed: ${key}`, error);
      return false;
    }
  };

  let localSettingsStorePromise = null;
  const getLocalSettingsStore = async () => {
    if (!localSettingsStorePromise) {
      localSettingsStorePromise = (async () => {
        for (const candidate of baseApiCandidates()) {
          try {
            if (typeof candidate?.getLocalPluginStorage === 'function') {
              const store = await candidate.getLocalPluginStorage();
              if (store?.getItem && store?.setItem) return { store, structured: true };
            }
          } catch (_) {}
          try {
            if (candidate?.safeLocalStorage?.getItem && candidate?.safeLocalStorage?.setItem) return { store: candidate.safeLocalStorage, structured: false };
          } catch (_) {}
        }
        return { store: null, structured: false };
      })();
    }
    return await localSettingsStorePromise;
  };

  const settingsPersistenceState = raw => {
    if (raw == null || raw === '') return { present: false, savedAt: 0, settings: null };
    let parsed = raw;
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch (_) { return { present: false, savedAt: 0, settings: null }; }
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { present: false, savedAt: 0, settings: null };
    if (parsed.schema === SETTINGS_PERSISTENCE_SCHEMA && parsed.settings && typeof parsed.settings === 'object') {
      return { present: true, savedAt: Math.max(0, Number(parsed.savedAt || 0) || 0), settings: parsed.settings };
    }
    const savedAt = Math.max(0, Number(parsed?._credentialPersistence?.savedAt || 0) || 0);
    return { present: Boolean(parsed.primary || parsed.aux), savedAt, settings: parsed };
  };

  const settingsPersistenceEnvelope = (settings, savedAt = Date.now()) => ({
    schema: SETTINGS_PERSISTENCE_SCHEMA,
    version: 1,
    savedAt: Math.max(0, Number(savedAt || Date.now()) || Date.now()),
    settings,
  });

  const readLocalSettingsBackup = async () => {
    try {
      const holder = await getLocalSettingsStore();
      if (!holder.store?.getItem) return { present: false, savedAt: 0, settings: null, available: false };
      return { ...settingsPersistenceState(await holder.store.getItem(LOCAL_SETTINGS_BACKUP_KEY)), available: true };
    } catch (_) {
      return { present: false, savedAt: 0, settings: null, available: false };
    }
  };

  const writeLocalSettingsBackup = async (settings, savedAt = Date.now()) => {
    try {
      const holder = await getLocalSettingsStore();
      if (!holder.store?.setItem || !holder.store?.getItem) return { attempted: false, verified: false };
      const envelope = settingsPersistenceEnvelope(settings, savedAt);
      await holder.store.setItem(LOCAL_SETTINGS_BACKUP_KEY, holder.structured ? envelope : JSON.stringify(envelope));
      const readback = settingsPersistenceState(await holder.store.getItem(LOCAL_SETTINGS_BACKUP_KEY));
      const expected = normalizeSettings(settings);
      const actual = normalizeSettings(readback.settings || {});
      return { attempted: true, verified: readback.present && JSON.stringify(actual) === JSON.stringify(expected) };
    } catch (_) {
      return { attempted: true, verified: false };
    }
  };

  // GRADIA v0.24.3 계열의 provider/reasoning 계층을 Bridge의 단일
  // Primary 프로필 구조에 맞게 이식한 카탈로그다.
  const DIRECT_PROVIDER_REGISTRY = Object.freeze({
    deepseek: Object.freeze({ label: 'DeepSeek', baseUrl: 'https://api.deepseek.com', chatPath: '/chat/completions' }),
    kimi: Object.freeze({ label: 'Kimi / Moonshot AI', baseUrl: 'https://api.moonshot.ai/v1', chatPath: '/chat/completions' }),
    together: Object.freeze({ label: 'Together AI', baseUrl: 'https://api.together.xyz/v1', chatPath: '/chat/completions' }),
    fireworks: Object.freeze({ label: 'Fireworks AI', baseUrl: 'https://api.fireworks.ai/inference/v1', chatPath: '/chat/completions', responsesPath: '/responses' }),
    arliai: Object.freeze({ label: 'ArliAI', baseUrl: 'https://api.arliai.com/v1', chatPath: '/chat/completions' }),
    cerebras: Object.freeze({ label: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1', chatPath: '/chat/completions' }),
    'cloudflare-ai-gateway': Object.freeze({ label: 'Cloudflare AI Gateway', baseUrl: 'https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/ai/v1', chatPath: '/chat/completions', responsesPath: '/responses', requiresConfiguredUrl: true }),
    crofai: Object.freeze({ label: 'CrofAI', baseUrl: 'https://ai.nahcrof.com/v1', chatPath: '/chat/completions' }),
    digitalocean: Object.freeze({ label: 'DigitalOcean Gradient AI', baseUrl: 'https://inference.do-ai.run/v1', chatPath: '/chat/completions', responsesPath: '/responses' }),
    featherless: Object.freeze({ label: 'Featherless AI', baseUrl: 'https://api.featherless.ai/v1', chatPath: '/chat/completions' }),
    'heroku-us': Object.freeze({ label: 'Heroku Managed Inference (US)', baseUrl: 'https://us.inference.heroku.com/v1', chatPath: '/chat/completions' }),
    'heroku-eu': Object.freeze({ label: 'Heroku Managed Inference (EU)', baseUrl: 'https://eu.inference.heroku.com/v1', chatPath: '/chat/completions' }),
    'lightning-ai': Object.freeze({ label: 'Lightning AI', baseUrl: 'https://lightning.ai/api/v1', chatPath: '/chat/completions' }),
    'llm-gateway': Object.freeze({ label: 'LLM Gateway', baseUrl: 'https://api.llmgateway.io/v1', chatPath: '/chat/completions' }),
    neuralwatt: Object.freeze({ label: 'Neuralwatt', baseUrl: 'https://api.neuralwatt.com/v1', chatPath: '/chat/completions' }),
    novita: Object.freeze({ label: 'Novita AI', baseUrl: 'https://api.novita.ai/openai/v1', chatPath: '/chat/completions' }),
    'novita-coding': Object.freeze({ label: 'Novita Coding', baseUrl: 'https://api.novita.ai/openai/v1', chatPath: '/chat/completions' }),
    'opencode-go': Object.freeze({ label: 'OpenCode Go', baseUrl: 'https://opencode.ai/zen/go/v1', chatPath: '/chat/completions' }),
    siliconflow: Object.freeze({ label: 'SiliconFlow', baseUrl: 'https://api.siliconflow.com/v1', chatPath: '/chat/completions' }),
    synthetic: Object.freeze({ label: 'Synthetic', baseUrl: 'https://api.synthetic.new/v1', chatPath: '/chat/completions' }),
    'venice-ai': Object.freeze({ label: 'Venice AI', baseUrl: 'https://api.venice.ai/api/v1', chatPath: '/chat/completions' }),
    'vercel-ai': Object.freeze({ label: 'Vercel AI Gateway', baseUrl: 'https://ai-gateway.vercel.sh/v1', chatPath: '/chat/completions', responsesPath: '/responses' }),
    'z-ai': Object.freeze({ label: 'Z.ai', baseUrl: 'https://api.z.ai/api/paas/v4', chatPath: '/chat/completions' }),
    'z-ai-coding': Object.freeze({ label: 'Z.ai Coding Plan', baseUrl: 'https://api.z.ai/api/coding/paas/v4', chatPath: '/chat/completions' }),
    'xiaomi-mimo': Object.freeze({ label: 'Xiaomi MiMo', baseUrl: 'https://api.xiaomimimo.com/v1', chatPath: '/chat/completions' }),
    'xiaomi-mimo-token-plan-cn': Object.freeze({ label: 'Xiaomi MiMo Token Plan (China)', baseUrl: 'https://token-plan-cn.xiaomimimo.com/v1', chatPath: '/chat/completions' }),
    'xiaomi-mimo-token-plan-sgp': Object.freeze({ label: 'Xiaomi MiMo Token Plan (Singapore)', baseUrl: 'https://token-plan-sgp.xiaomimimo.com/v1', chatPath: '/chat/completions' }),
    'xiaomi-mimo-token-plan-ams': Object.freeze({ label: 'Xiaomi MiMo Token Plan (Europe)', baseUrl: 'https://token-plan-ams.xiaomimimo.com/v1', chatPath: '/chat/completions' })
  });

  const CORE_PROVIDER_REGISTRY = Object.freeze({
    openai: Object.freeze({ label: 'OpenAI', mode: 'openai', url: 'https://api.openai.com/v1/chat/completions', responsesUrl: 'https://api.openai.com/v1/responses' }),
    openrouter: Object.freeze({ label: 'OpenRouter', mode: 'openai', url: 'https://openrouter.ai/api/v1/chat/completions', responsesUrl: 'https://openrouter.ai/api/v1/responses' }),
    anthropic: Object.freeze({ label: 'Claude / Anthropic', mode: 'anthropic', url: 'https://api.anthropic.com/v1/messages' }),
    gemini: Object.freeze({ label: 'Gemini AI Studio', mode: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta' }),
    lmstudio: Object.freeze({ label: 'LM Studio', mode: 'openai', url: 'http://localhost:1234/v1/chat/completions', local: true }),
    ollama: Object.freeze({ label: 'Ollama local', mode: 'ollama', url: 'http://localhost:11434/api/chat', local: true }),
    ollama_cloud: Object.freeze({ label: 'Ollama Cloud', mode: 'openai', url: 'https://ollama.com/v1/chat/completions' }),
    nanogpt: Object.freeze({ label: 'NanoGPT', mode: 'openai', url: 'https://nano-gpt.com/api/v1/chat/completions' }),
    vertex: Object.freeze({ label: 'Vertex Gemini', mode: 'vertex-gemini', url: 'https://aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/global/publishers/google/models', requiresConfiguredUrl: true }),
    'vertex-openai': Object.freeze({ label: 'Vertex OpenAI-compatible', mode: 'vertex-openai', url: 'https://aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/global/endpoints/openapi/chat/completions', requiresConfiguredUrl: true }),
    copilot: Object.freeze({ label: 'GitHub Copilot', mode: 'openai', url: 'https://api.githubcopilot.com/chat/completions' }),
    custom: Object.freeze({ label: 'Custom OpenAI-compatible', mode: 'openai', url: '', local: true })
  });

  const PROVIDER_ALIASES = Object.freeze({
    claude: 'anthropic',
    google: 'gemini',
    'google-ai': 'gemini',
    google_ai: 'gemini',
    'lm-studio': 'lmstudio',
    lm_studio: 'lmstudio',
    'ollama-cloud': 'ollama_cloud',
    'vertex-gemini': 'vertex',
    vertex_gemini: 'vertex',
    vertex_openai: 'vertex-openai',
    github_copilot: 'copilot',
    'github-copilot': 'copilot',
    cloudflare: 'cloudflare-ai-gateway',
    'cloudflare-ai': 'cloudflare-ai-gateway',
    'lightning-ai-studio': 'lightning-ai',
    llmgateway: 'llm-gateway',
    vercel: 'vercel-ai',
    zai: 'z-ai',
    'zai-coding': 'z-ai-coding',
    moonshot: 'kimi',
    'moonshot-ai': 'kimi',
    moonshotai: 'kimi',
    'kimi-api': 'kimi',
    'fireworks-ai': 'fireworks',
    firework: 'fireworks',
    crof: 'crofai',
    'neural-watt': 'neuralwatt',
    'novita-ai': 'novita',
    'novita-coding-plan': 'novita-coding',
    opencode: 'opencode-go',
    'silicon-flow': 'siliconflow',
    'synthetic-new': 'synthetic',
    venice: 'venice-ai',
    'vercel-ai-gateway': 'vercel-ai',
    mimo: 'xiaomi-mimo',
    'mimo-token-plan-cn': 'xiaomi-mimo-token-plan-cn',
    'mimo-token-plan-sgp': 'xiaomi-mimo-token-plan-sgp',
    'mimo-token-plan-ams': 'xiaomi-mimo-token-plan-ams'
  });

  const PROVIDER_KEYS = Object.freeze([
    'openai', 'openrouter', 'anthropic', 'gemini', 'deepseek', 'lmstudio', 'ollama',
    'ollama_cloud', 'nanogpt', 'vertex', 'vertex-openai', 'copilot', 'custom',
    ...Object.keys(DIRECT_PROVIDER_REGISTRY).filter(key => key !== 'deepseek')
  ]);

  const normalizeProvider = value => {
    const raw = text(value || 'openai').trim().toLowerCase().replace(/[\s_]+/g, '-');
    const aliased = PROVIDER_ALIASES[raw] || raw;
    const key = aliased === 'ollama-cloud' ? 'ollama_cloud' : aliased;
    return CORE_PROVIDER_REGISTRY[key] || DIRECT_PROVIDER_REGISTRY[key] ? key : 'custom';
  };
  const providerDefinition = provider => CORE_PROVIDER_REGISTRY[normalizeProvider(provider)] || DIRECT_PROVIDER_REGISTRY[normalizeProvider(provider)] || CORE_PROVIDER_REGISTRY.openai;
  const providerLabel = provider => providerDefinition(provider)?.label || normalizeProvider(provider);
  const joinProviderEndpoint = (base = '', endpointPath = '') => {
    const rawBase = text(base).trim().replace(/\/+$/, '');
    const rawPath = text(endpointPath).trim();
    if (!rawBase || !rawPath) return rawBase;
    const normalizedPath = `/${rawPath.replace(/^\/+/, '')}`;
    const current = rawBase.match(/\/(chat\/completions|responses|messages|models)(?:\?.*)?$/i);
    const target = normalizedPath.match(/\/(chat\/completions|responses|messages|models)$/i)?.[1] || '';
    if (current) {
      if (current[1].toLowerCase() === target.toLowerCase()) return rawBase;
      return joinProviderEndpoint(rawBase.slice(0, current.index), normalizedPath);
    }
    const segments = normalizedPath.split('/').filter(Boolean);
    let overlap = '';
    for (let count = segments.length; count > 0; count -= 1) {
      const candidate = `/${segments.slice(0, count).join('/')}`;
      if (rawBase.toLowerCase().endsWith(candidate.toLowerCase())) { overlap = candidate; break; }
    }
    return `${rawBase}${overlap ? normalizedPath.slice(overlap.length) : normalizedPath}`;
  };
  const defaultProviderUrl = provider => {
    const key = normalizeProvider(provider);
    const core = CORE_PROVIDER_REGISTRY[key];
    if (core) return core.url;
    const direct = DIRECT_PROVIDER_REGISTRY[key];
    return direct ? joinProviderEndpoint(direct.baseUrl, direct.chatPath) : '';
  };
  const supportsResponses = provider => {
    const key = normalizeProvider(provider);
    return Boolean(CORE_PROVIDER_REGISTRY[key]?.responsesUrl || DIRECT_PROVIDER_REGISTRY[key]?.responsesPath || key === 'custom');
  };
  const providerMode = provider => CORE_PROVIDER_REGISTRY[normalizeProvider(provider)]?.mode || 'openai';
  const providerAllowsEmptyKey = provider => Boolean(CORE_PROVIDER_REGISTRY[normalizeProvider(provider)]?.local);

  const PROVIDER_MODEL_CATALOG_BUILTINS = Object.freeze({
    openai: Object.freeze({ label: 'OpenAI', modelsPath: '/v1/models', modelsUrl: 'https://api.openai.com/v1/models' }),
    openrouter: Object.freeze({ label: 'OpenRouter', modelsPath: '/api/v1/models', modelsUrl: 'https://openrouter.ai/api/v1/models' }),
    anthropic: Object.freeze({ label: 'Claude / Anthropic', modelsPath: '/v1/models', modelsUrl: 'https://api.anthropic.com/v1/models' }),
    gemini: Object.freeze({ label: 'Gemini AI Studio', modelsPath: '/v1beta/models', modelsUrl: 'https://generativelanguage.googleapis.com/v1beta/models' }),
    lmstudio: Object.freeze({ label: 'LM Studio', modelsPath: '/v1/models', modelsUrl: 'http://localhost:1234/v1/models' }),
    ollama: Object.freeze({ label: 'Ollama local', nativeOllama: true }),
    ollama_cloud: Object.freeze({ label: 'Ollama Cloud', modelsPath: '/v1/models', modelsUrl: 'https://ollama.com/v1/models' }),
    nanogpt: Object.freeze({ label: 'NanoGPT', modelsPath: '/api/v1/models', modelsUrl: 'https://nano-gpt.com/api/v1/models' })
  });
  const ProviderModelCache = new Map();
  const PROVIDER_MODEL_CACHE_TTL_MS = 5 * 60 * 1000;
  const providerCredentialCacheFingerprint = value => {
    const source = text(value || '');
    if (!source) return 'anonymous';
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `credential-${(hash >>> 0).toString(36)}-${source.length}`;
  };
  const ollamaBaseUrl = rawUrl => {
    let raw = text(rawUrl || defaultProviderUrl('ollama')).trim();
    if (!raw) raw = 'http://localhost:11434';
    raw = raw.replace(/[?#].*$/, '').replace(/\/+$/, '');
    raw = raw
      .replace(/\/api\/(?:chat|tags|version|show)$/i, '')
      .replace(/\/v1\/(?:chat\/completions|models)$/i, '')
      .replace(/\/chat\/completions$/i, '')
      .replace(/\/(?:api|v1)$/i, '')
      .replace(/\/+$/, '');
    return raw || 'http://localhost:11434';
  };
  const ollamaApiUrl = (rawUrl, action) => `${ollamaBaseUrl(rawUrl)}/api/${text(action).replace(/^\/+/, '')}`;
  const providerModelMetadata = (provider = '', rawUrl = '') => {
    const key = normalizeProvider(provider);
    const direct = DIRECT_PROVIDER_REGISTRY[key];
    if (direct?.modelsPath) return {
      key, label: direct.label, baseUrl: direct.baseUrl,
      modelsUrl: joinProviderEndpoint(rawUrl || direct.baseUrl, direct.modelsPath),
      requiresConfiguredUrl: direct.requiresConfiguredUrl === true,
      nativeOllama: false
    };
    const builtin = PROVIDER_MODEL_CATALOG_BUILTINS[key];
    if (!builtin) return null;
    if (builtin.nativeOllama) return {
      key, label: builtin.label, baseUrl: ollamaBaseUrl(rawUrl),
      modelsUrl: ollamaApiUrl(rawUrl, 'tags'),
      versionUrl: ollamaApiUrl(rawUrl, 'version'),
      requiresConfiguredUrl: false,
      nativeOllama: true
    };
    const raw = text(rawUrl).trim();
    return {
      key, label: builtin.label, baseUrl: defaultProviderUrl(key),
      modelsUrl: raw ? joinProviderEndpoint(raw, builtin.modelsPath) : builtin.modelsUrl,
      requiresConfiguredUrl: false,
      nativeOllama: false
    };
  };
  const normalizeProviderModels = (payload = {}, provider = '') => {
    const source = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data) ? payload.data
        : Array.isArray(payload?.models) ? payload.models
          : Array.isArray(payload?.items) ? payload.items
            : [];
    const seen = new Set();
    return source.map(item => {
      const record = typeof item === 'string' ? { id: item } : (item || {});
      let id = text(record.id || record.model || record.slug || record.name).trim();
      if (normalizeProvider(provider) === 'gemini') id = id.replace(/^models\//i, '');
      if (!id || seen.has(id)) return null;
      seen.add(id);
      const rawLabel = text(record.display_name || record.displayName || record.label || record.name || record.model || id).trim();
      const label = (normalizeProvider(provider) === 'gemini' ? rawLabel.replace(/^models\//i, '') : rawLabel) || id;
      return {
        id,
        label,
        contextWindow: Math.max(0, Number(record.context_length || record.context_window || record.contextWindow || 0) || 0),
        maxOutputTokens: Math.max(0, Number(record.max_output_tokens || record.maxOutputTokens || record.max_completion_tokens || 0) || 0),
        sizeBytes: Math.max(0, Number(record.size || record.size_bytes || record.sizeBytes || 0) || 0),
        modifiedAt: text(record.modified_at || record.modifiedAt || record.updated_at || record.updatedAt || '')
      };
    }).filter(Boolean).sort((left, right) => left.id.localeCompare(right.id));
  };
  const providerModelCacheKey = profile => {
    const meta = providerModelMetadata(profile?.provider, profile?.url);
    return meta?.modelsUrl
      ? `${meta.key}|${meta.modelsUrl}|${providerCredentialCacheFingerprint(profile?.key)}`
      : '';
  };
  const cachedProviderModelEntry = profile => {
    const key = providerModelCacheKey(profile);
    if (!key) return null;
    const cached = ProviderModelCache.get(key);
    if (!cached || Date.now() - Number(cached.at || 0) >= PROVIDER_MODEL_CACHE_TTL_MS) return null;
    return { ...cached, models: (cached.models || []).map(item => ({ ...item })) };
  };
  const clampNumber = (value, min, max, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  };
  const normalizeChoice = (value, choices, fallback) => choices.includes(text(value).trim()) ? text(value).trim() : fallback;

  const DEFAULT_PROFILE = Object.freeze({
    provider: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    key: '',
    model: 'gpt-4.1-mini',
    timeoutMs: 120000,
    maxTokens: 16000,
    temperature: 0.3,
    requestFormat: 'chat_completions',
    reasoningPreset: 'off',
    reasoningEffort: 'none',
    reasoningBudgetTokens: 0,
    thinkingType: 'disabled',
    stream: false,
    serviceTier: 'off',
    vertexFlexMode: 'off',
    customServiceTierPassthrough: false,
    extraHeadersJson: '',
    extraBodyJson: ''
  });
  const DEFAULT_SETTINGS = Object.freeze({
    primary: Object.freeze({ ...DEFAULT_PROFILE }),
    hayakuAutoRepair: false
  });

  // GRADIA v0.24.3 provider 추론 프리셋. auto는 provider/model 계열만
  // 감지하고 사용자가 effort/budget을 지정하지 않은 추론을 몰래 켜지 않는다.
  const REASONING_PRESETS = Object.freeze({
    auto: Object.freeze({ label: 'Auto · provider/model 감지', reasoningEffort: 'none', reasoningBudgetTokens: 0, maxTokens: 16000, thinkingType: 'enabled', controls: ['thinking', 'effort', 'budget'], hint: 'Provider와 모델명으로 요청 스키마만 자동 선택합니다. Effort 또는 budget을 지정하지 않으면 숨은 추론을 자동으로 켜지 않습니다.' }),
    off: Object.freeze({ label: 'Off / provider default', reasoningEffort: 'none', reasoningBudgetTokens: 0, maxTokens: 16000, thinkingType: 'disabled', controls: [], hint: '추론 전용 파라미터를 보내지 않습니다. 모델 자체 기본 동작은 provider가 결정합니다.' }),
    gpt: Object.freeze({ label: 'OpenAI reasoning', reasoningEffort: 'medium', reasoningBudgetTokens: 0, maxTokens: 20000, thinkingType: 'enabled', controls: ['effort'], hint: 'OpenAI Chat Completions의 reasoning_effort 또는 Responses의 reasoning.effort를 사용합니다.' }),
    openrouter: Object.freeze({ label: 'OpenRouter unified reasoning', reasoningEffort: 'medium', reasoningBudgetTokens: 0, maxTokens: 20000, thinkingType: 'enabled', controls: ['thinking', 'effort', 'budget'], hint: 'OpenRouter의 reasoning 객체(enabled / effort / max_tokens)를 사용합니다.' }),
    claude: Object.freeze({ label: 'Claude adaptive thinking', reasoningEffort: 'medium', reasoningBudgetTokens: 0, maxTokens: 20000, thinkingType: 'enabled', controls: ['thinking', 'effort'], hint: '최신 Claude용 thinking.type=adaptive와 output_config.effort를 사용합니다.' }),
    claude_budget: Object.freeze({ label: 'Claude manual budget (legacy)', reasoningEffort: 'none', reasoningBudgetTokens: 4096, maxTokens: 20000, thinkingType: 'enabled', controls: ['thinking', 'budget'], hint: '구형 Claude용 thinking.type=enabled + budget_tokens 방식입니다. 최신 모델에서는 deprecated 또는 미지원입니다.' }),
    gemini: Object.freeze({ label: 'Gemini 3 thinking level', reasoningEffort: 'medium', reasoningBudgetTokens: 0, maxTokens: 20000, thinkingType: 'enabled', controls: ['effort'], hint: 'Gemini 3 계열의 generationConfig.thinkingConfig.thinkingLevel을 사용합니다.' }),
    gemini_budget: Object.freeze({ label: 'Gemini 2.5 thinking budget', reasoningEffort: 'none', reasoningBudgetTokens: -1, maxTokens: 20000, thinkingType: 'enabled', controls: ['budget'], hint: 'Gemini 2.5 계열의 thinkingBudget을 사용합니다. -1은 dynamic, 0은 가능한 모델에서 off입니다.' }),
    deepseek: Object.freeze({ label: 'DeepSeek Reasoner', reasoningEffort: 'none', reasoningBudgetTokens: 0, maxTokens: 64000, thinkingType: 'enabled', controls: [], hint: 'deepseek-reasoner가 자체 추론합니다. max_tokens만 적용하고 temperature는 보내지 않습니다.' }),
    kimi: Object.freeze({ label: 'Kimi reasoning', reasoningEffort: 'none', reasoningBudgetTokens: 0, maxTokens: 32000, thinkingType: 'enabled', controls: ['thinking', 'effort'], hint: 'Kimi K3는 reasoning_effort(low/high/max), 이전 Kimi는 thinking.type을 사용합니다.' }),
    glm: Object.freeze({ label: 'GLM thinking', reasoningEffort: 'none', reasoningBudgetTokens: 0, maxTokens: 24000, thinkingType: 'enabled', controls: ['thinking'], hint: 'Z.AI GLM의 thinking.type=enabled/disabled를 사용합니다.' }),
    ollama: Object.freeze({ label: 'Ollama native thinking', reasoningEffort: 'medium', reasoningBudgetTokens: 0, maxTokens: 20000, thinkingType: 'enabled', controls: ['thinking', 'effort'], hint: 'Ollama /api/chat의 think boolean 또는 low/medium/high/max 레벨을 사용합니다.' }),
    custom: Object.freeze({ label: 'Custom / no transform', reasoningEffort: 'none', reasoningBudgetTokens: 0, maxTokens: 16000, thinkingType: 'disabled', controls: [], hint: '브릿지가 추론 전용 파라미터를 변환하지 않습니다.' })
  });
  const REASONING_PRESET_KEYS = Object.freeze(Object.keys(REASONING_PRESETS));
  const normalizeReasoningPresetKey = value => {
    const raw = text(value || 'auto').trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (['none', 'disabled'].includes(raw)) return 'off';
    if (raw === 'anthropic') return 'claude';
    if (raw === 'anthropic_budget') return 'claude_budget';
    if (['gemini_2_5', 'gemini25'].includes(raw)) return 'gemini_budget';
    return REASONING_PRESET_KEYS.includes(raw) ? raw : 'auto';
  };
  const reasoningPresetDefinition = value => REASONING_PRESETS[normalizeReasoningPresetKey(value)] || REASONING_PRESETS.off;

  const normalizeProfileSettings = (value = {}, fallback = DEFAULT_PROFILE) => {
    const provider = normalizeProvider(value.provider || fallback.provider);
    const model = text(value.model || fallback.model).trim();
    const rawBudget = Number(value.reasoningBudgetTokens ?? value.reasoning_budget_tokens ?? fallback.reasoningBudgetTokens);
    const reasoningEffort = normalizeChoice(value.reasoningEffort || value.reasoning_effort, ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'], fallback.reasoningEffort);
    const reasoningBudgetTokens = rawBudget === -1 ? -1 : Math.round(clampNumber(rawBudget, 0, 200000, fallback.reasoningBudgetTokens));
    const thinkingType = normalizeChoice(value.thinkingType || value.thinking_type, ['enabled', 'disabled'], fallback.thinkingType);
    const reasoningPreset = normalizeReasoningPresetKey(value.reasoningPreset || value.reasoning_preset || fallback.reasoningPreset);
    return {
      provider,
      url: text(value.url || defaultProviderUrl(provider) || fallback.url).trim(),
      key: text(value.key || value.apiKey || value.api_key || '').trim(),
      model,
      timeoutMs: Math.round(clampNumber(value.timeoutMs ?? value.timeout_ms, 5000, 300000, fallback.timeoutMs)),
      maxTokens: Math.round(clampNumber(value.maxTokens ?? value.max_tokens, 64, 200000, fallback.maxTokens)),
      temperature: clampNumber(value.temperature ?? value.temp, 0, 2, fallback.temperature),
      requestFormat: supportsResponses(provider)
        ? normalizeChoice(value.requestFormat || value.request_format, ['chat_completions', 'responses'], fallback.requestFormat)
        : 'chat_completions',
      reasoningPreset,
      reasoningEffort,
      reasoningBudgetTokens,
      thinkingType,
      stream: value.stream === true || text(value.stream).toLowerCase() === 'true',
      serviceTier: normalizeChoice(value.serviceTier || value.service_tier, ['off', 'auto', 'default', 'flex', 'priority', 'scale'], fallback.serviceTier),
      vertexFlexMode: normalizeChoice(value.vertexFlexMode || value.vertex_flex_mode, ['off', 'provisioned_then_flex', 'flex_only'], fallback.vertexFlexMode),
      customServiceTierPassthrough: value.customServiceTierPassthrough === true || text(value.custom_service_tier_passthrough).toLowerCase() === 'true',
      extraHeadersJson: text(value.extraHeadersJson || value.extra_headers_json || '').trim(),
      extraBodyJson: text(value.extraBodyJson || value.extra_body_json || '').trim()
    };
  };
  const normalizeSettings = value => {
    const primary = normalizeProfileSettings(value?.primary, DEFAULT_SETTINGS.primary);
    const legacyAux = value?.aux ? normalizeProfileSettings(value.aux, DEFAULT_SETTINGS.primary) : null;
    const primaryHasConnection = Boolean(primary.key || providerAllowsEmptyKey(primary.provider));
    const legacyAuxHasConnection = Boolean(legacyAux && (legacyAux.key || providerAllowsEmptyKey(legacyAux.provider)));
    return {
      primary: !primaryHasConnection && legacyAuxHasConnection ? legacyAux : primary,
      hayakuAutoRepair: value?.hayakuAutoRepair === true
        || text(value?.hayakuAutoRepair ?? value?.retrace_hayaku_auto_repair).trim().toLowerCase() === 'true'
    };
  };
  const loadSettings = async force => {
    if (!force && Runtime.settings) return Runtime.settings;
    const pluginRaw = await storageGet(SETTINGS_KEY);
    const pluginState = settingsPersistenceState(pluginRaw);
    const localState = await readLocalSettingsBackup();
    let chosen = pluginState.present ? pluginState : (localState.present ? localState : null);
    if (pluginState.present && localState.present) {
      if (pluginState.savedAt && localState.savedAt) chosen = pluginState.savedAt >= localState.savedAt ? pluginState : localState;
      else if (!pluginState.savedAt && localState.savedAt) chosen = pluginState;
      else chosen = pluginState;
    }
    let settingsSource = chosen?.settings && typeof chosen.settings === 'object'
      ? { ...chosen.settings }
      : {};
    if (!Object.prototype.hasOwnProperty.call(settingsSource, 'hayakuAutoRepair')) {
      try {
        const argumentApi = liveApi(['getArgument']);
        const rawAutoRepair = typeof argumentApi?.getArgument === 'function'
          ? text(await argumentApi.getArgument('retrace_hayaku_auto_repair')).trim()
          : '';
        if (rawAutoRepair) settingsSource.retrace_hayaku_auto_repair = rawAutoRepair;
      } catch (_) {}
    }
    const settings = normalizeSettings(settingsSource);
    Runtime.settings = settings;
    const savedAt = Math.max(pluginState.savedAt, localState.savedAt, Date.now());
    const pluginNormalized = pluginState.present ? normalizeSettings(pluginState.settings || {}) : null;
    if (!pluginState.present || JSON.stringify(pluginNormalized) !== JSON.stringify(settings)) {
      const payload = { ...settings, _credentialPersistence: { schema: SETTINGS_PERSISTENCE_SCHEMA, savedAt } };
      await storageSet(SETTINGS_KEY, JSON.stringify(payload));
    }
    const localNormalized = localState.present ? normalizeSettings(localState.settings || {}) : null;
    if (!localState.present || JSON.stringify(localNormalized) !== JSON.stringify(settings)) await writeLocalSettingsBackup(settings, savedAt);
    return Runtime.settings;
  };
  const saveSettings = async value => {
    const settings = normalizeSettings(value);
    const savedAt = Date.now();
    const payload = { ...settings, _credentialPersistence: { schema: SETTINGS_PERSISTENCE_SCHEMA, savedAt } };
    if (!await storageSet(SETTINGS_KEY, JSON.stringify(payload))) throw new Error('프로바이더 설정을 저장하지 못했습니다.');
    const pluginReadback = settingsPersistenceState(await storageGet(SETTINGS_KEY));
    if (!pluginReadback.present || JSON.stringify(normalizeSettings(pluginReadback.settings || {})) !== JSON.stringify(settings)) {
      throw new Error('프로바이더 설정 pluginStorage readback 검증에 실패했습니다.');
    }
    await writeLocalSettingsBackup(settings, savedAt);
    Runtime.settings = settings;
    return settings;
  };

  const providerConfigurationIssues = profile => {
    const issues = [];
    const provider = normalizeProvider(profile?.provider);
    const url = text(profile?.url || defaultProviderUrl(provider)).trim();
    if (!text(profile?.model).trim()) issues.push('model');
    if (!url) issues.push('endpoint');
    if (!profile?.key && !providerAllowsEmptyKey(provider)) issues.push('API key');
    const credentials = parseJson(profile?.key, null);
    const vertexProjectResolvable = ['vertex', 'vertex-openai'].includes(provider)
      && Boolean(credentials?.project_id || credentials?.projectId);
    if (providerDefinition(provider)?.requiresConfiguredUrl
      && /(?:PROJECT_ID|ACCOUNT_ID|GATEWAY_ID|\{[^}]+\})/i.test(url)
      && !vertexProjectResolvable) issues.push('endpoint placeholder');
    if (profile?.requestFormat === 'responses' && !supportsResponses(provider)) issues.push('Responses API unsupported');
    return issues;
  };
  const providerConfigured = profile => providerConfigurationIssues(profile).length === 0;

  const providerFetch = async (url, init, timeoutMs) => {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const request = {
      ...init,
      ...(controller && !init?.signal ? { signal: controller.signal } : {}),
      requestTimeoutMs: timeoutMs,
      logFetch: false
    };
    if (/^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/i.test(url)) {
      request.networkRoute ||= 'local_network';
    }
    try {
      const api = liveApi(['nativeFetch']) || liveApi(['risuFetch']) || liveApi();
      if (typeof api?.nativeFetch === 'function') return await api.nativeFetch(url, request);
      if (typeof api?.risuFetch === 'function') return await api.risuFetch(url, request);
      throw new Error('RisuAI nativeFetch/risuFetch API가 없습니다.');
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const responseText = async response => {
    if (!response) throw new Error('프로바이더 응답이 없습니다.');
    if (typeof response === 'string') return response;
    if (typeof response.text === 'function') return await response.text();
    if (response.body?.getReader) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let output = '';
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        output += decoder.decode(next.value, { stream: true });
      }
      return output + decoder.decode();
    }
    if (typeof response.json === 'function') return JSON.stringify(await response.json());
    return text(response?.data ?? response);
  };
  const responseJson = async response => {
    const status = Number(response?.status || 0) || 0;
    let payload;
    try { payload = typeof response?.json === 'function' ? await response.json() : parseJson(await responseText(response), null); }
    catch (_) { payload = parseJson(await responseText(response).catch(() => ''), null); }
    if (response?.ok === false || status >= 400) {
      const message = payload?.error?.message || payload?.error || payload?.message || payload || `HTTP ${status || 'error'}`;
      const error = new Error(compact(message, 700));
      error.status = status;
      throw error;
    }
    return payload;
  };

  const listProviderModels = async (profile = {}, options = {}) => {
    const clean = normalizeProfileSettings(profile, DEFAULT_PROFILE);
    const meta = providerModelMetadata(clean.provider, clean.url);
    if (!meta?.modelsUrl) {
      throw new Error(`${providerLabel(clean.provider)}는 자동 모델 목록 조회가 등록되어 있지 않습니다. 모델 ID를 직접 입력하세요.`);
    }
    if (meta.requiresConfiguredUrl && /(?:PROJECT_ID|ACCOUNT_ID|GATEWAY_ID|\{[^}]+\})/i.test(meta.modelsUrl)) {
      throw new Error(`${meta.label} 모델 목록 URL의 placeholder를 실제 값으로 바꿔 주세요.`);
    }
    if (!providerAllowsEmptyKey(meta.key) && !clean.key) {
      throw new Error('모델 목록을 불러오려면 API 키가 필요합니다.');
    }
    const cacheKey = providerModelCacheKey(clean);
    const cached = cacheKey ? ProviderModelCache.get(cacheKey) : null;
    if (options.force !== true && cached && Date.now() - Number(cached.at || 0) < PROVIDER_MODEL_CACHE_TTL_MS) {
      return (cached.models || []).map(item => ({ ...item }));
    }
    const headers = { Accept: 'application/json', ...extraHeaders(clean) };
    if (clean.key && meta.key === 'gemini') headers['x-goog-api-key'] = stripBearer(clean.key);
    else if (clean.key && meta.key === 'anthropic') {
      headers['x-api-key'] = stripBearer(clean.key);
      headers['anthropic-version'] ||= '2023-06-01';
    } else if (clean.key) {
      headers.authorization ||= `Bearer ${stripBearer(clean.key)}`;
    }
    applyOpenAiHeaders(headers, meta.key);
    const timeoutMs = Math.max(5000, Math.min(60000, Number(clean.timeoutMs || 20000) || 20000));
    const response = await providerFetch(meta.modelsUrl, { method: 'GET', headers }, timeoutMs);
    const payload = await responseJson(response);
    const models = normalizeProviderModels(payload, meta.key);
    if (cacheKey) ProviderModelCache.set(cacheKey, { at: Date.now(), models: models.map(item => ({ ...item })), meta: { ...meta } });
    return models;
  };

  const extractTextParts = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(extractTextParts).join('');
    if (value.text) return text(value.text);
    if (value.output_text) return text(value.output_text);
    if (value.content) return extractTextParts(value.content);
    if (value.parts) return extractTextParts(value.parts);
    return '';
  };
  const extractCompletionText = payload => text(
    extractTextParts(payload?.choices?.[0]?.message?.content)
    || extractTextParts(payload?.choices?.[0]?.delta?.content)
    || extractTextParts(payload?.choices?.[0]?.text)
    || extractTextParts(payload?.output_text)
    || extractTextParts(payload?.output)
    || extractTextParts(payload?.content)
    || extractTextParts(payload?.message?.content)
    || extractTextParts(payload?.response)
    || extractTextParts(payload?.candidates?.[0]?.content?.parts)
  );
  const providerFinishReason = payload => {
    if (!payload || typeof payload !== 'object') return '';
    const direct = payload?.choices?.[0]?.finish_reason
      ?? payload?.choices?.[0]?.finishReason
      ?? payload?.stop_reason
      ?? payload?.stopReason
      ?? payload?.candidates?.[0]?.finishReason
      ?? payload?.candidates?.[0]?.finish_reason
      ?? payload?.done_reason
      ?? payload?.finish_reason
      ?? payload?.finishReason
      ?? payload?.incomplete_details?.reason
      ?? payload?.response?.incomplete_details?.reason
      ?? payload?.delta?.stop_reason
      ?? payload?.message_delta?.stop_reason;
    if (direct != null && text(direct).trim()) return text(direct).trim();
    const status = text(payload?.status || payload?.response?.status).trim();
    return status && status !== 'completed' ? status : '';
  };
  const parseStreamText = raw => {
    let output = '';
    let usage = null;
    let finishReason = '';
    let events = 0;
    let toolJson = '';
    for (const line of text(raw).split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const body = trimmed.replace(/^data:\s*/i, '').trim();
      if (!body || body === '[DONE]' || /^event:/i.test(body)) continue;
      const packet = parseJson(body, null);
      if (!packet) continue;
      events += 1;
      usage = packet.usage || packet.usageMetadata || packet.message_delta?.usage || usage;
      finishReason = providerFinishReason(packet) || finishReason;
      output += packet.choices?.[0]?.delta?.content || '';
      output += packet.choices?.[0]?.message?.content || '';
      output += packet.delta?.text || '';
      output += typeof packet.delta === 'string' ? packet.delta : '';
      output += packet.output_text || '';
      output += packet.message?.content || '';
      output += typeof packet.response === 'string' ? packet.response : '';
      output += packet.response?.output_text || '';
      output += packet.text || '';
      output += (packet.candidates?.[0]?.content?.parts || []).map(part => text(part?.text)).join('');
      output += Array.isArray(packet.content) ? packet.content.map(block => text(block?.text)).join('') : '';
      if (packet?.delta?.type === 'input_json_delta') toolJson += text(packet.delta.partial_json);
      if (packet?.content_block?.type === 'tool_use'
        && packet.content_block.input
        && typeof packet.content_block.input === 'object'
        && Object.keys(packet.content_block.input).length) {
        toolJson = JSON.stringify(packet.content_block.input);
      }
    }
    const toolObject = toolJson ? parseJson(toolJson, null) : null;
    const content = output.trim() || (toolObject && typeof toolObject === 'object' ? JSON.stringify(toolObject) : toolJson.trim());
    return { content, usage, finishReason, streamMeta: { events, finishReason } };
  };

  const parseJsonObject = (value, label) => {
    const raw = text(value).trim();
    if (!raw) return {};
    const parsed = parseJson(raw, null);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(`${label}는 JSON 객체여야 합니다.`);
    return parsed;
  };
  const deepMerge = (base, override) => {
    const plain = value => value && typeof value === 'object' && !Array.isArray(value);
    if (!plain(base) || !plain(override)) return override;
    const output = { ...base };
    for (const [key, value] of Object.entries(override)) {
      output[key] = plain(value) && plain(output[key]) ? deepMerge(output[key], value) : value;
    }
    return output;
  };
  const extraHeaders = profile => Object.fromEntries(
    Object.entries(parseJsonObject(profile.extraHeadersJson, '추가 HTTP 헤더 JSON')).map(([key, value]) => [key, text(value)])
  );
  const withExtraBody = (body, profile) => deepMerge(body, parseJsonObject(profile.extraBodyJson, '추가 요청 Body JSON'));
  const stripBearer = value => text(value).trim().replace(/^Bearer\s+/i, '').trim();

  const configuredThinkingType = profile => text(profile?.thinkingType || profile?.thinking_type || 'enabled').trim().toLowerCase() === 'disabled' ? 'disabled' : 'enabled';
  const providerModelLeaf = model => {
    const normalized = text(model).trim().replace(/^models\//i, '');
    const parts = normalized.split('/').filter(Boolean);
    return text(parts[parts.length - 1] || normalized).toLowerCase();
  };
  const isGpt56Model = model => /^gpt-5\.6(?:$|[-_.])/i.test(providerModelLeaf(model));
  const isKimiK3Model = model => /^kimi-k3(?:$|[-_.\[])/i.test(providerModelLeaf(model));
  const isClaudeOpus5Model = model => /^claude-opus-5(?:$|[-_.])/i.test(providerModelLeaf(model));
  const isGemini3Model = model => /^gemini[-_.]?3(?:[-_.]|$)/i.test(providerModelLeaf(model));
  const geminiSupportsMinimalThinking = model => /^gemini-(?:3\.6-flash|3\.5-flash(?:-lite)?|3(?:-flash)|3\.1-flash-lite)/i.test(providerModelLeaf(model));
  const effectiveReasoningFamily = profile => {
    const requested = normalizeReasoningPresetKey(profile?.reasoningPreset || 'auto');
    if (requested !== 'auto') return requested;
    const provider = normalizeProvider(profile?.provider || 'custom');
    const model = text(profile?.model).trim().toLowerCase();
    const leaf = providerModelLeaf(model);
    if (provider === 'openrouter') return 'openrouter';
    if (provider === 'anthropic' || /claude/.test(model)) return 'claude';
    if (['gemini', 'vertex'].includes(provider) || /gemini|gemma/.test(model)) return 'gemini';
    if (provider === 'deepseek' || /deepseek/.test(model)) return 'deepseek';
    if (provider === 'kimi' || /kimi|moonshot/.test(model)) return 'kimi';
    if (['z-ai', 'z-ai-coding'].includes(provider) || /(?:^|[\/_-])glm(?:[\d._-]|$)|zai/.test(model)) return 'glm';
    if (provider === 'ollama') return 'ollama';
    if (['openai', 'vertex-openai', 'copilot'].includes(provider) || /^(o\d|gpt-)/.test(leaf)) return 'gpt';
    return 'custom';
  };
  const reasoningState = (profile, options = {}) => {
    const requestedTokens = Math.max(1, Math.min(200000, Number(options.maxTokens || profile.maxTokens) || 1));
    const configuredCap = Math.max(1, Math.min(200000, Number(profile.maxTokens) || requestedTokens));
    const maxTokens = Math.max(1, Math.min(requestedTokens, configuredCap));
    const family = effectiveReasoningFamily(profile);
    const configuredPreset = normalizeReasoningPresetKey(profile.reasoningPreset || 'auto');
    const rawBudget = Math.floor(Number(profile.reasoningBudgetTokens) || 0);
    const requestedBudget = rawBudget === -1 ? -1 : Math.max(0, rawBudget);
    const effort = text(profile.reasoningEffort || 'none').trim().toLowerCase();
    const familyDefaultsToReasoning = configuredPreset !== 'auto'
      && ['deepseek', 'kimi', 'glm', 'claude', 'claude_budget', 'gemini', 'gemini_budget', 'ollama', 'openrouter'].includes(family);
    const requestDisablesReasoning = options.disableReasoning === true
      || options.noReasoning === true
      || options.forceNoThinking === true
      || options.suppressThink === true;
    const explicitlyDisabled = requestDisablesReasoning || configuredPreset === 'off' || configuredPreset === 'custom';
    const requested = requestedBudget !== 0 || (effort && effort !== 'none') || familyDefaultsToReasoning;
    const toggleCanDisable = ['kimi', 'glm', 'claude', 'claude_budget', 'gemini', 'gemini_budget', 'ollama', 'openrouter'].includes(family);
    const enabled = !explicitlyDisabled && requested && !(toggleCanDisable && configuredThinkingType(profile) === 'disabled');
    const minimumVisible = Math.min(maxTokens, Math.max(128, Math.ceil(maxTokens * 0.35)));
    const budget = enabled && requestedBudget === -1
      ? -1
      : enabled ? Math.max(0, Math.min(requestedBudget, maxTokens - minimumVisible)) : 0;
    const transformActive = requestDisablesReasoning || !['auto', 'off', 'custom'].includes(configuredPreset) || enabled;
    return {
      family,
      enabled,
      budget,
      maxTokens,
      requestedTokens,
      configuredCap,
      requestedBudget,
      minimumVisible,
      transformActive,
      requestDisablesReasoning,
      configuredPreset
    };
  };

  const kimiK3ReasoningEffort = (profile, state) => {
    if (state.requestDisablesReasoning || state.configuredPreset === 'off') return 'low';
    const effort = text(profile.reasoningEffort || 'none').trim().toLowerCase();
    if (['low', 'high', 'max'].includes(effort)) return effort;
    if (effort === 'medium') return 'high';
    if (effort === 'xhigh') return 'max';
    if (state.transformActive && !state.enabled) return 'low';
    return '';
  };
  const providerAllowsServiceTier = profile => {
    const provider = normalizeProvider(profile?.provider);
    return provider === 'openai' || (provider === 'custom' && profile?.customServiceTierPassthrough === true);
  };
  const applyVertexFlexHeaders = (headers, profile = {}) => {
    const mode = normalizeChoice(profile.vertexFlexMode || profile.vertex_flex_mode, ['off', 'provisioned_then_flex', 'flex_only'], 'off');
    if (mode === 'provisioned_then_flex') {
      headers['X-Vertex-AI-LLM-Shared-Request-Type'] = 'flex';
    } else if (mode === 'flex_only') {
      headers['X-Vertex-AI-LLM-Request-Type'] = 'shared';
      headers['X-Vertex-AI-LLM-Shared-Request-Type'] = 'flex';
    }
    return headers;
  };
  const shouldUseMaxCompletionTokens = (profile, family = effectiveReasoningFamily(profile)) => {
    const provider = normalizeProvider(profile.provider);
    if (isKimiK3Model(profile.model)) return true;
    if (['heroku-us', 'heroku-eu', 'xiaomi-mimo', 'xiaomi-mimo-token-plan-cn', 'xiaomi-mimo-token-plan-sgp', 'xiaomi-mimo-token-plan-ams'].includes(provider)) return true;
    if (!['openai', 'vertex-openai', 'copilot'].includes(provider)) return family === 'gpt';
    return family === 'gpt'
      || text(profile.reasoningEffort).trim().toLowerCase() !== 'none'
      || /^(o\d|gpt-5|gpt-4\.1|gpt-4o-mini-search|gpt-4o-search)/i.test(providerModelLeaf(profile.model));
  };

  const applyOpenAiHeaders = (headers, provider) => {
    if (['openrouter', 'featherless'].includes(provider)) {
      headers['HTTP-Referer'] ||= 'https://risuai.xyz';
      headers['X-Title'] ||= PLUGIN_NAME;
    }
    if (['z-ai', 'z-ai-coding'].includes(provider)) headers['Accept-Language'] ||= 'en-US,en';
    if (provider === 'copilot') {
      headers['Editor-Version'] ||= 'vscode/1.85.0';
      headers['Editor-Plugin-Version'] ||= 'copilot-chat/0.22.0';
      headers['Copilot-Integration-Id'] ||= 'vscode-chat';
      headers['User-Agent'] ||= 'GitHubCopilotChat/0.22.0';
      headers['X-Initiator'] ||= 'user';
    }
    return headers;
  };
  const resolveChatEndpoint = profile => {
    const provider = normalizeProvider(profile.provider);
    const raw = text(profile.url || defaultProviderUrl(provider)).trim();
    const direct = DIRECT_PROVIDER_REGISTRY[provider];
    if (direct) return joinProviderEndpoint(raw || direct.baseUrl, direct.chatPath);
    if (provider === 'custom') return joinProviderEndpoint(raw, '/v1/chat/completions');
    const configured = CORE_PROVIDER_REGISTRY[provider];
    if (!configured) return raw || defaultProviderUrl(provider);
    let endpointPath = '';
    try { endpointPath = new URL(configured.url).pathname; } catch (_) {}
    return endpointPath ? joinProviderEndpoint(raw || configured.url, endpointPath) : (raw || configured.url);
  };
  const resolveResponsesEndpoint = profile => {
    const provider = normalizeProvider(profile.provider);
    const direct = DIRECT_PROVIDER_REGISTRY[provider];
    if (direct?.responsesPath) return joinProviderEndpoint(profile.url || direct.baseUrl, direct.responsesPath);
    if (CORE_PROVIDER_REGISTRY[provider]?.responsesUrl) {
      return joinProviderEndpoint(profile.url || CORE_PROVIDER_REGISTRY[provider].responsesUrl, '/v1/responses');
    }
    if (provider === 'custom') return joinProviderEndpoint(profile.url, '/v1/responses');
    throw new Error(`${providerLabel(provider)}는 Responses API가 등록되어 있지 않습니다.`);
  };

  const CopilotTokenCache = new Map();
  const getCopilotBearerToken = async profile => {
    const source = stripBearer(profile.key);
    const cached = CopilotTokenCache.get(source);
    if (cached?.token && cached.expiresAt > Date.now()) return cached.token;
    if (!/^(eyJ|ghu_|gho_|ghp_|github_pat_|oauth_)/i.test(source)) return source;
    const response = await providerFetch('https://api.github.com/copilot_internal/v2/token', {
      method: 'GET',
      headers: { Authorization: `token ${source}`, Accept: 'application/json', 'Editor-Version': 'vscode/1.85.0', 'Editor-Plugin-Version': 'copilot-chat/0.22.0' }
    }, 30000);
    const payload = await responseJson(response);
    const token = text(payload?.token || payload?.access_token).trim();
    if (!token) throw new Error('Copilot token 교환 응답에 token이 없습니다.');
    const expiresAt = Number(payload?.expires_at || 0) * 1000 || Date.now() + 25 * 60 * 1000;
    CopilotTokenCache.set(source, { token, expiresAt });
    return token;
  };

  const readProviderResult = async (response, stream) => {
    if (response?.ok === false || Number(response?.status || 0) >= 400) await responseJson(response);
    if (stream) {
      const raw = await responseText(response);
      return { ...parseStreamText(raw), raw };
    }
    const payload = await responseJson(response);
    return {
      content: extractCompletionText(payload),
      usage: payload?.usage || payload?.usageMetadata || {},
      finishReason: providerFinishReason(payload),
      raw: payload
    };
  };

  const openAiCompatibleCall = async (profile, systemPrompt, userContent, options = {}) => {
    const provider = normalizeProvider(profile.provider);
    const state = reasoningState(profile, options);
    const headers = applyOpenAiHeaders({ 'content-type': 'application/json', ...extraHeaders(profile) }, provider);
    let authToken = profile.key;
    if (provider === 'copilot') authToken = await getCopilotBearerToken(profile);
    if (authToken) headers.authorization = `Bearer ${stripBearer(authToken)}`;
    const temperature = options.temperature ?? profile.temperature;
    const useMaxCompletion = shouldUseMaxCompletionTokens(profile, state.family);
    let body = {
      model: profile.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature,
      stream: profile.stream
    };
    body[useMaxCompletion ? 'max_completion_tokens' : 'max_tokens'] = state.maxTokens;
    if (options.jsonMode && options.omitNativeJsonMode !== true) body.response_format = { type: 'json_object' };
    if (provider === 'llm-gateway') {
      if (!state.enabled) body.reasoning_effort = 'none';
      else if (state.budget > 0) body.reasoning = { max_tokens: state.budget };
      else if (profile.reasoningEffort !== 'none') body.reasoning_effort = profile.reasoningEffort;
    } else if (state.family === 'openrouter' && state.transformActive) {
      body.reasoning = state.enabled
        ? { enabled: true, ...(profile.reasoningEffort !== 'none' ? { effort: profile.reasoningEffort } : state.budget > 0 ? { max_tokens: state.budget } : {}) }
        : { enabled: false };
    } else if (isGpt56Model(profile.model) && state.configuredPreset !== 'custom') {
      if (state.requestDisablesReasoning || state.configuredPreset === 'off') body.reasoning_effort = 'none';
      else if (state.enabled && profile.reasoningEffort !== 'none') body.reasoning_effort = profile.reasoningEffort;
      if (body.reasoning_effort && body.reasoning_effort !== 'none') delete body.temperature;
    } else if (state.family === 'gpt' && state.enabled && profile.reasoningEffort !== 'none') {
      body.reasoning_effort = profile.reasoningEffort;
      delete body.temperature;
    } else if (state.family === 'deepseek') {
      delete body.temperature;
    } else if (isKimiK3Model(profile.model) && state.configuredPreset !== 'custom') {
      const effort = kimiK3ReasoningEffort(profile, state);
      delete body.thinking;
      delete body.temperature;
      if (effort) body.reasoning_effort = effort;
    } else if (['kimi', 'glm'].includes(state.family) && state.transformActive && options.omitThinkingField !== true) {
      body.thinking = { type: state.enabled ? configuredThinkingType(profile) : 'disabled' };
    }
    if (providerAllowsServiceTier(profile) && profile.serviceTier !== 'off') body.service_tier = profile.serviceTier;
    if (body.stream && ['openai', 'openrouter'].includes(provider)) body.stream_options = { include_usage: true };
    body = withExtraBody(body, profile);
    const response = await providerFetch(resolveChatEndpoint(profile), { method: 'POST', headers, body: JSON.stringify(body) }, profile.timeoutMs);
    const result = await readProviderResult(response, profile.stream);
    if (!text(result.content).trim()) throw new Error(`${providerLabel(provider)}가 빈 응답을 반환했습니다.`);
    return { content: text(result.content), usage: result.usage || {}, finishReason: result.finishReason || '', raw: result.raw, provider, model: profile.model, streamed: profile.stream };
  };

  const openAiResponsesCall = async (profile, systemPrompt, userContent, options = {}) => {
    const provider = normalizeProvider(profile.provider);
    const state = reasoningState(profile, options);
    const headers = applyOpenAiHeaders({ 'content-type': 'application/json', ...extraHeaders(profile) }, provider);
    if (profile.key) headers.authorization = `Bearer ${stripBearer(profile.key)}`;
    let body = {
      model: profile.model,
      instructions: systemPrompt,
      input: [{ role: 'user', content: [{ type: 'input_text', text: userContent }] }],
      max_output_tokens: state.maxTokens,
      stream: profile.stream
    };
    if (options.jsonMode && options.omitNativeJsonMode !== true) body.text = { format: { type: 'json_object' } };
    if (state.family === 'openrouter' && state.transformActive) {
      if (!state.enabled) body.reasoning = { enabled: false };
      else if (profile.reasoningEffort !== 'none') body.reasoning = { effort: profile.reasoningEffort };
      else if (state.budget > 0) body.reasoning = { max_tokens: state.budget };
      else body.reasoning = { enabled: true };
    } else if (isGpt56Model(profile.model) && state.configuredPreset !== 'custom') {
      if (state.requestDisablesReasoning || state.configuredPreset === 'off') body.reasoning = { effort: 'none' };
      else if (state.enabled && profile.reasoningEffort !== 'none') body.reasoning = { effort: profile.reasoningEffort };
    } else if (state.family === 'gpt' && state.enabled && profile.reasoningEffort !== 'none') {
      body.reasoning = { effort: profile.reasoningEffort };
    }
    if (providerAllowsServiceTier(profile) && profile.serviceTier !== 'off') body.service_tier = profile.serviceTier;
    body = withExtraBody(body, profile);
    const response = await providerFetch(resolveResponsesEndpoint(profile), { method: 'POST', headers, body: JSON.stringify(body) }, profile.timeoutMs);
    const result = await readProviderResult(response, profile.stream);
    if (!text(result.content).trim()) throw new Error(`${providerLabel(provider)} Responses API가 빈 응답을 반환했습니다.`);
    return { content: text(result.content), usage: result.usage || {}, finishReason: result.finishReason || '', raw: result.raw, provider, model: profile.model, streamed: profile.stream };
  };

  const anthropicCall = async (profile, systemPrompt, userContent, options = {}) => {
    const state = reasoningState(profile, options);
    const headers = { 'content-type': 'application/json', 'anthropic-version': '2023-06-01', ...extraHeaders(profile) };
    if (profile.key) headers['x-api-key'] = profile.key;
    let body = {
      model: profile.model,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
      temperature: options.temperature ?? profile.temperature,
      max_tokens: state.maxTokens,
      stream: profile.stream
    };
    const omitThinking = options.omitThinkingField === true;
    const requestNoThinking = options.forceNoThinking === true || options.suppressThink === true;
    const explicitOpus5Off = isClaudeOpus5Model(profile.model) && state.configuredPreset === 'off';
    if (!omitThinking && isClaudeOpus5Model(profile.model) && (requestNoThinking || explicitOpus5Off)) {
      body.thinking = { type: 'disabled' };
    } else if (!omitThinking && state.family === 'claude' && state.transformActive) {
      const effort = text(profile.reasoningEffort || 'none').trim().toLowerCase();
      const opus5RequiresThinking = isClaudeOpus5Model(profile.model) && ['xhigh', 'max'].includes(effort);
      const adaptiveThinking = state.enabled || opus5RequiresThinking;
      body.thinking = { type: adaptiveThinking ? 'adaptive' : 'disabled' };
      if (effort !== 'none' && (adaptiveThinking || isClaudeOpus5Model(profile.model))) {
        body.output_config = { effort };
      }
      if (adaptiveThinking) delete body.temperature;
    } else if (!omitThinking
      && state.family === 'claude_budget'
      && state.transformActive
      && state.enabled
      && state.budget >= 1024
      && state.maxTokens > state.budget) {
      body.thinking = { type: 'enabled', budget_tokens: state.budget };
      delete body.temperature;
    } else if (!omitThinking && state.family === 'claude_budget' && state.transformActive) {
      body.thinking = { type: 'disabled' };
    }
    if (options.jsonMode === true && options.omitNativeJsonMode !== true) {
      if (options.jsonSchema && typeof options.jsonSchema === 'object' && !Array.isArray(options.jsonSchema)) {
        body.output_config = {
          ...(body.output_config && typeof body.output_config === 'object' ? body.output_config : {}),
          format: { type: 'json_schema', schema: options.jsonSchema }
        };
      } else {
        body.tools = [{
          name: 'return_json',
          description: 'Return the required JSON object and no prose.',
          input_schema: { type: 'object', additionalProperties: true }
        }];
        body.tool_choice = { type: 'tool', name: 'return_json', disable_parallel_tool_use: true };
      }
    }
    body = withExtraBody(body, profile);
    const endpoint = joinProviderEndpoint(profile.url || defaultProviderUrl('anthropic'), '/v1/messages');
    const response = await providerFetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) }, profile.timeoutMs);
    const result = await readProviderResult(response, profile.stream);
    const toolBlock = !profile.stream && options.jsonMode === true && Array.isArray(result.raw?.content)
      ? result.raw.content.find(block => block?.type === 'tool_use' && block?.name === 'return_json' && block?.input && typeof block.input === 'object')
      : null;
    const content = toolBlock ? JSON.stringify(toolBlock.input) : text(result.content);
    if (!content.trim()) throw new Error('Anthropic이 빈 응답을 반환했습니다.');
    return { content, usage: result.usage || {}, finishReason: result.finishReason || '', raw: result.raw, provider: 'anthropic', model: profile.model, streamed: profile.stream };
  };

  const normalizeGeminiEndpoint = (profile, vertex = false) => {
    const action = profile.stream ? 'streamGenerateContent' : 'generateContent';
    let base = text(profile.url || defaultProviderUrl(vertex ? 'vertex' : 'gemini')).trim().replace(/\/+$/, '');
    if (/:generateContent|:streamGenerateContent/i.test(base)) return base.replace(/:(?:generateContent|streamGenerateContent)(?:\?.*)?$/i, `:${action}`);
    if (/\/models\/[^/]+$/i.test(base)) return `${base}:${action}`;
    if (/\/models$/i.test(base)) return `${base}/${encodeURIComponent(profile.model)}:${action}`;
    return `${base}/models/${encodeURIComponent(profile.model)}:${action}`;
  };

  const VertexTokenCache = new Map();
  const base64Url = bytes => {
    const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let binary = '';
    for (const byte of array) binary += String.fromCharCode(byte);
    const encoded = typeof btoa === 'function'
      ? btoa(binary)
      : typeof Buffer !== 'undefined' ? Buffer.from(array).toString('base64') : '';
    if (!encoded) throw new Error('Base64 인코더가 없습니다.');
    return encoded.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  };
  const vertexAccessToken = async rawKey => {
    const key = text(rawKey).trim();
    const cached = VertexTokenCache.get(key);
    if (cached?.token && cached.expiresAt > Date.now()) return cached.token;
    const credentials = parseJson(key, null);
    if (!credentials || typeof credentials !== 'object') return stripBearer(key);
    if (credentials.access_token || credentials.token) return text(credentials.access_token || credentials.token).trim();
    if (!credentials.client_email || !credentials.private_key) throw new Error('Vertex 자격 증명에 access_token 또는 client_email/private_key가 필요합니다.');
    if (!globalThis.crypto?.subtle) throw new Error('Vertex 서비스 계정 서명에 crypto.subtle이 필요합니다.');
    const now = Math.floor(Date.now() / 1000);
    const encodeJson = object => base64Url(new TextEncoder().encode(JSON.stringify(object)));
    const head = encodeJson({ alg: 'RS256', typ: 'JWT' });
    const claims = encodeJson({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    });
    const pem = text(credentials.private_key).replace(/\\n/g, '\n').replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g, '');
    const binary = typeof atob === 'function' ? atob(pem) : Buffer.from(pem, 'base64').toString('binary');
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const cryptoKey = await globalThis.crypto.subtle.importKey('pkcs8', bytes.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const unsigned = `${head}.${claims}`;
    const signature = await globalThis.crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(unsigned));
    const jwt = `${unsigned}.${base64Url(new Uint8Array(signature))}`;
    const response = await providerFetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${encodeURIComponent(jwt)}`
    }, 45000);
    const payload = await responseJson(response);
    const token = text(payload?.access_token).trim();
    if (!token) throw new Error('Vertex token 응답에 access_token이 없습니다.');
    VertexTokenCache.set(key, { token, expiresAt: Date.now() + 3500 * 1000 });
    return token;
  };

  const geminiCall = async (profile, systemPrompt, userContent, options = {}, vertex = false) => {
    const state = reasoningState(profile, options);
    let endpoint = normalizeGeminiEndpoint(profile, vertex);
    if (vertex) {
      const credentials = parseJson(profile.key, null);
      const projectId = text(credentials?.project_id || credentials?.projectId).trim();
      const location = text(credentials?.location || credentials?.region || 'global').trim() || 'global';
      if (projectId) endpoint = endpoint.replace(/PROJECT_ID|\{project_id\}/g, projectId);
      endpoint = endpoint.replace(/LOCATION|\{location\}/g, location);
    }
    if (profile.stream) endpoint += `${endpoint.includes('?') ? '&' : '?'}alt=sse`;
    const headers = { 'content-type': 'application/json', ...extraHeaders(profile) };
    if (vertex) {
      headers.authorization = `Bearer ${await vertexAccessToken(profile.key)}`;
      applyVertexFlexHeaders(headers, profile);
    }
    else if (profile.key) headers['x-goog-api-key'] = stripBearer(profile.key);
    const modelLeaf = providerModelLeaf(profile.model);
    const gemini3 = isGemini3Model(profile.model);
    const gemini25Pro = /gemini[-_.]?2\.5[-_.]?pro/i.test(modelLeaf);
    const generationConfig = {
      maxOutputTokens: state.maxTokens,
      ...(!gemini3 ? { temperature: options.temperature ?? profile.temperature } : {}),
      ...(options.jsonMode && options.omitNativeJsonMode !== true ? { responseMimeType: 'application/json' } : {})
    };
    const omitThinking = options.omitThinkingField === true;
    if (!omitThinking && gemini3 && state.transformActive) {
      const effort = text(profile.reasoningEffort).trim().toLowerCase();
      const configuredLevel = effort === 'minimal'
        ? (geminiSupportsMinimalThinking(profile.model) ? 'MINIMAL' : 'LOW')
        : effort === 'low' ? 'LOW'
          : ['high', 'xhigh', 'max'].includes(effort) ? 'HIGH'
            : 'MEDIUM';
      generationConfig.thinkingConfig = {
        thinkingLevel: state.enabled ? configuredLevel : (geminiSupportsMinimalThinking(profile.model) ? 'MINIMAL' : 'LOW'),
        includeThoughts: false
      };
    } else if (!omitThinking && gemini25Pro && state.transformActive) {
      generationConfig.thinkingConfig = {
        thinkingBudget: state.enabled ? Math.max(128, state.budget || 128) : 128,
        includeThoughts: false
      };
    } else if (!omitThinking && state.family === 'gemini' && state.transformActive && state.enabled) {
      const effort = text(profile.reasoningEffort).trim().toLowerCase();
      generationConfig.thinkingConfig = {
        includeThoughts: false,
        thinkingLevel: effort === 'minimal' ? 'LOW'
          : effort === 'low' ? 'LOW'
            : ['high', 'xhigh', 'max'].includes(effort) ? 'HIGH' : 'MEDIUM'
      };
    } else if (!omitThinking && state.family === 'gemini_budget' && state.transformActive && state.enabled) {
      generationConfig.thinkingConfig = { includeThoughts: false, thinkingBudget: state.budget };
    } else if (!omitThinking && ['gemini', 'gemini_budget'].includes(state.family) && state.transformActive && !state.enabled) {
      generationConfig.thinkingConfig = { includeThoughts: false, thinkingBudget: 0 };
    }
    let body = withExtraBody({
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      generationConfig
    }, profile);
    if (gemini3) {
      const config = body.generationConfig || body.generation_config;
      if (config && typeof config === 'object') {
        for (const key of ['temperature', 'topP', 'topK', 'top_p', 'top_k', 'candidateCount', 'candidate_count']) delete config[key];
        const thinking = config.thinkingConfig || config.thinking_config;
        if (thinking && typeof thinking === 'object' && (thinking.thinkingLevel || thinking.thinking_level)) {
          delete thinking.thinkingBudget;
          delete thinking.thinking_budget;
        }
      }
    }
    const response = await providerFetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) }, profile.timeoutMs);
    const result = await readProviderResult(response, profile.stream);
    if (!text(result.content).trim()) throw new Error(`${vertex ? 'Vertex Gemini' : 'Gemini'}가 빈 응답을 반환했습니다.`);
    return { content: text(result.content), usage: result.usage || {}, finishReason: result.finishReason || '', raw: result.raw, provider: vertex ? 'vertex' : 'gemini', model: profile.model, streamed: profile.stream };
  };

  const vertexOpenAiCall = async (profile, systemPrompt, userContent, options = {}) => {
    const credentials = parseJson(profile.key, {});
    const endpoint = text(profile.url || defaultProviderUrl('vertex-openai'))
      .replace(/PROJECT_ID|\{project_id\}/g, text(credentials?.project_id || credentials?.projectId || 'PROJECT_ID'))
      .replace(/LOCATION|\{location\}/g, text(credentials?.location || credentials?.region || 'global'));
    const copy = {
      ...profile,
      url: endpoint,
      key: await vertexAccessToken(profile.key),
      provider: 'vertex-openai',
      extraHeadersJson: JSON.stringify(applyVertexFlexHeaders({ ...extraHeaders(profile) }, profile))
    };
    return profile.requestFormat === 'responses'
      ? await openAiResponsesCall(copy, systemPrompt, userContent, options)
      : await openAiCompatibleCall(copy, systemPrompt, userContent, options);
  };

  const ollamaCall = async (profile, systemPrompt, userContent, options = {}) => {
    const state = reasoningState(profile, options);
    let body = {
      model: profile.model,
      messages: [
        systemPrompt ? { role: 'system', content: systemPrompt } : null,
        { role: 'user', content: userContent }
      ].filter(Boolean),
      stream: profile.stream,
      options: { temperature: options.temperature ?? profile.temperature, num_predict: state.maxTokens },
      ...(options.jsonMode && options.omitNativeJsonMode !== true ? { format: 'json' } : {})
    };
    if (state.family === 'ollama' && state.transformActive && options.omitThinkingField !== true) {
      const effort = text(profile.reasoningEffort).trim().toLowerCase();
      const think = ['low', 'medium', 'high', 'max'].includes(effort)
        ? effort
        : effort === 'minimal' ? 'low' : effort === 'xhigh' ? 'max' : true;
      body.think = state.enabled ? think : false;
    }
    if (options.suppressThink === true || options.forceNoThinking === true) {
      body.think = false;
      if (body.options && typeof body.options === 'object') {
        delete body.options.think;
        delete body.options.thinking;
      }
    }
    body = withExtraBody(body, profile);
    const headers = { 'content-type': 'application/json', ...extraHeaders(profile) };
    if (profile.key) headers.authorization = `Bearer ${stripBearer(profile.key)}`;
    const endpoint = ollamaApiUrl(profile.url || defaultProviderUrl('ollama'), 'chat');
    const response = await providerFetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) }, profile.timeoutMs);
    const result = await readProviderResult(response, profile.stream);
    if (!text(result.content).trim()) throw new Error('Ollama가 빈 응답을 반환했습니다.');
    return { content: text(result.content), usage: result.usage || {}, finishReason: result.finishReason || '', raw: result.raw, provider: 'ollama', model: profile.model, streamed: profile.stream };
  };

  const providerHealthKey = profile => `${profile.provider}|${profile.url}|${profile.model}`;
  const unsupportedThinkingErrorInfo = error => {
    const message = text(error?.message || error);
    return /(does not support thinking|thinking.*not supported|unsupported.*thinking|think.*not supported)/i.test(message)
      ? { message: compact(message, 500) }
      : null;
  };
  const unsupportedNativeJsonErrorInfo = error => {
    const message = text(error?.message || error);
    const rejectedField = /(response_format|responseMimeType|response_mime_type|output_config\.format|output_format|json_schema|json object|tool_choice|tools)/i;
    const unsupportedWording = /(unsupported|not supported|unknown|invalid|not allowed|unrecognized)/i;
    const requiredAlternativeWording = /(response_format(?:\.type)?|responseMimeType|response_mime_type|output_config\.format|output_format).*(?:must be|must equal|expected|requires?|allowed values?).*(?:json_schema|text|application\/json)/i;
    return ((rejectedField.test(message) && unsupportedWording.test(message)) || requiredAlternativeWording.test(message))
      ? { message: compact(message, 500) }
      : null;
  };
  const transientProviderErrorInfo = error => {
    const message = text(error?.message || error);
    return /(?:HTTP\s*)?(?:408|409|425|429|500|502|503|504)\b|rate.?limit|temporar(?:y|ily) unavailable|service unavailable|gateway timeout|network (?:error|failure)|fetch failed|econnreset|econnrefused|etimedout|socket hang up|signal is aborted|aborterror|request timed? out|\btimeout\b/i.test(message)
      ? { message: compact(message, 500) }
      : null;
  };
  const providerLengthLimitInfo = finishReason => {
    const reason = text(finishReason).trim();
    return /(?:^|[_\s-])(?:length|max_tokens?|max_output_tokens?|token_limit)(?:$|[_\s-])/i.test(reason)
      ? { reason: compact(reason, 160) }
      : null;
  };
  const recordProviderHealth = (profile, ok, error = null) => {
    const key = providerHealthKey(profile);
    const previous = Runtime.providerHealth.get(key) || { failures: 0, consecutiveFailures: 0, successes: 0, openedUntil: 0 };
    const next = { ...previous };
    if (ok) {
      next.successes += 1;
      next.consecutiveFailures = 0;
      next.openedUntil = 0;
      next.lastSuccessAt = Date.now();
    } else {
      next.failures += 1;
      next.consecutiveFailures += 1;
      next.lastFailureAt = Date.now();
      next.lastError = compact(error?.message || error || '', 240);
      if (next.consecutiveFailures >= 2) next.openedUntil = Date.now() + Math.min(300000, 30000 * (2 ** Math.min(3, next.consecutiveFailures - 2)));
    }
    Runtime.providerHealth.set(key, next);
    return next;
  };

  const callProfile = async (_profileName, systemPrompt, userContent, options = {}) => {
    const settings = await loadSettings();
    const profile = settings.primary;
    if (!providerConfigured(profile)) {
      throw new Error(`Primary 프로바이더 설정이 필요합니다: ${providerConfigurationIssues(profile).join(', ')}`);
    }
    try {
      let result;
      const mode = providerMode(profile.provider);
      if (mode === 'anthropic') result = await anthropicCall(profile, systemPrompt, userContent, options);
      else if (mode === 'gemini') result = await geminiCall(profile, systemPrompt, userContent, options, false);
      else if (mode === 'vertex-gemini') result = await geminiCall(profile, systemPrompt, userContent, options, true);
      else if (mode === 'vertex-openai') result = await vertexOpenAiCall(profile, systemPrompt, userContent, options);
      else if (mode === 'ollama') result = await ollamaCall(profile, systemPrompt, userContent, options);
      else if (profile.requestFormat === 'responses') result = await openAiResponsesCall(profile, systemPrompt, userContent, options);
      else result = await openAiCompatibleCall(profile, systemPrompt, userContent, options);
      const lengthLimit = providerLengthLimitInfo(result.finishReason);
      if (result.content && lengthLimit && !options.lengthLimitRetry) {
        const absoluteMaxTokens = Math.max(
          1,
          Number(options.absoluteMaxTokens || profile.maxTokens || 200000) || 200000
        );
        const currentMaxTokens = Math.min(
          Number(profile.maxTokens) || 200000,
          absoluteMaxTokens,
          Number(options.maxTokens || profile.maxTokens) || 1
        );
        const expandedMaxTokens = Math.min(
          Number(profile.maxTokens) || 200000,
          absoluteMaxTokens,
          Math.max(currentMaxTokens + 1024, Math.ceil(currentMaxTokens * 1.5))
        );
        if (expandedMaxTokens > currentMaxTokens) {
          warn('provider length retry', `${lengthLimit.reason}; ${expandedMaxTokens} output tokens`);
          return await callProfile('primary', systemPrompt, userContent, {
            ...options,
            maxTokens: expandedMaxTokens,
            lengthLimitRetry: true
          });
        }
      }
      if (result.content && lengthLimit) throw new Error(`provider_output_truncated:${lengthLimit.reason}`);
      recordProviderHealth(profile, true);
      return { ...result, profile: 'primary' };
    } catch (error) {
      const thinkingUnsupported = unsupportedThinkingErrorInfo(error);
      if (thinkingUnsupported && !options.thinkingUnsupportedRetry) {
        warn('thinking unsupported retry', thinkingUnsupported.message);
        return await callProfile('primary', systemPrompt, userContent, {
          ...options,
          suppressThink: true,
          forceNoThinking: true,
          omitThinkingField: true,
          thinkingUnsupportedRetry: true
        });
      }
      const nativeJsonUnsupported = options.jsonMode === true ? unsupportedNativeJsonErrorInfo(error) : null;
      if (nativeJsonUnsupported && !options.nativeJsonUnsupportedRetry) {
        warn('native JSON unsupported retry', nativeJsonUnsupported.message);
        return await callProfile('primary', systemPrompt, userContent, {
          ...options,
          omitNativeJsonMode: true,
          nativeJsonUnsupportedRetry: true
        });
      }
      const transient = transientProviderErrorInfo(error);
      if (transient && !options.transientRetry) {
        warn('transient provider retry', transient.message);
        await new Promise(resolve => setTimeout(resolve, 750));
        return await callProfile('primary', systemPrompt, userContent, {
          ...options,
          transientRetry: true
        });
      }
      recordProviderHealth(profile, false, error);
      throw error;
    }
  };

  const uuid = () => {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    } catch (_) {}
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, token => {
      const random = (Math.random() * 16) | 0;
      return (token === 'x' ? random : ((random & 0x3) | 0x8)).toString(16);
    });
  };

  const fnv1a = value => {
    let hash = 0x811c9dc5;
    const source = text(value);
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  };
  const flashbackKeyHash = value => fnv1a(value).toString(36).replace(/[^a-zA-Z0-9_-]/g, '_');

  const stableHash64Fallback = value => {
    const source = text(value);
    let left = 2166136261;
    let right = 3266489917;
    for (let index = 0; index < source.length; index += 1) {
      const code = source.charCodeAt(index);
      left ^= code;
      left = Math.imul(left, 16777619);
      right ^= code + index + ((left >>> 7) & 0xffff);
      right = Math.imul(right, 2246822519);
      right ^= right >>> 13;
    }
    return `h64${(left >>> 0).toString(36).padStart(7, '0')}${(right >>> 0).toString(36).padStart(7, '0')}`;
  };
  const stableHash64 = value => {
    if (typeof BigInt !== 'function') return stableHash64Fallback(value);
    try {
      let hash = BigInt('14695981039346656037');
      const prime = BigInt('1099511628211');
      const mask = BigInt('18446744073709551615');
      const source = text(value);
      for (let index = 0; index < source.length; index += 1) {
        hash ^= BigInt(source.charCodeAt(index));
        hash = (hash * prime) & mask;
      }
      return `h64${hash.toString(36)}`;
    } catch (_) {
      return stableHash64Fallback(value);
    }
  };

  const normalizeHayakuMemoryLanguage = value => {
    const language = text(value || '').trim().toLowerCase().replace(/_/g, '-');
    if (/^(?:ko|ko-kr|kr|korean)$/.test(language)) return 'ko';
    if (/^(?:en|en-us|en-gb|english)$/.test(language)) return 'en';
    if (/^(?:ja|ja-jp|jp|japanese)$/.test(language)) return 'ja';
    if (/^(?:zh|zh-cn|zh-tw|chinese)$/.test(language)) return 'zh';
    return 'source';
  };
  const bridgeFallbackLanguageInstruction = language => {
    const normalized = normalizeHayakuMemoryLanguage(language);
    if (normalized === 'source') {
      return 'Use one language for all human-readable JSON values, following the TARGET TURN and established story facts. Only meta.summary_memory.recallAliases may carry compact ko/en/ja/zh paraphrases of the same fact; each paraphrase must add no new detail. Preserve JSON keys, enum tokens, refs, names, and canonical anchors.';
    }
    const labels = { ko: 'Korean', en: 'English', ja: 'Japanese', zh: 'Chinese' };
    return `Write all human-readable JSON values in ${labels[normalized]}. Only meta.summary_memory.recallAliases may carry compact ko/en/ja/zh paraphrases of the same fact; each paraphrase must add no new detail. Preserve JSON keys, enum tokens, refs, names, and canonical anchors.`;
  };
  const fallbackHayakuPacketAuthoringProfile = (source = 'bridge_safe_fallback') => {
    const base = {
      schema: HAYAKU_PACKET_AUTHORING_PROFILE_SCHEMA,
      version: 1,
      packet: {
        schema: 'hayaku_packet_v1',
        revision: 2,
        topLevelKeys: ['meta', 'entity', 'world', 'narrative', 'planner', 'importance']
      },
      memoryLanguage: 'source',
      humanReadableInstruction: bridgeFallbackLanguageInstruction('source'),
      schemaInstructions: [
        'Schema/revision: meta.schema="hayaku_packet_v1" and meta.packet_schema_rev=2.',
        'Use strict JSON with object-valued meta, entity, world, narrative, planner, and importance; use canonical snake_case collection keys.'
      ],
      recallAliases: {
        field: 'meta.summary_memory.recallAliases',
        languages: [...HAYAKU_PACKET_AUTHORING_ALIAS_LANGUAGES],
        mode: 'compact_same_fact_paraphrases',
        addNewDetail: false,
        internalOnly: true
      },
      canonicalAnchors: {
        field: 'meta.summary_memory.canonicalAnchors',
        prefixes: [...HAYAKU_CANONICAL_ANCHOR_PREFIXES],
        preserveStableNamesAndRefs: true
      },
      pluginLlmCalls: 0,
      source,
      authoritative: false
    };
    return { ...base, contractHash: stableHash64(JSON.stringify(base)) };
  };
  const normalizeHayakuPacketAuthoringProfile = (value, source = '') => {
    const fallback = fallbackHayakuPacketAuthoringProfile(source || 'bridge_safe_fallback');
    if (!value || typeof value !== 'object' || Array.isArray(value)
      || value.schema !== HAYAKU_PACKET_AUTHORING_PROFILE_SCHEMA) return fallback;
    const memoryLanguage = normalizeHayakuMemoryLanguage(value.memoryLanguage);
    const aliasLanguages = [...new Set((Array.isArray(value?.recallAliases?.languages)
      ? value.recallAliases.languages : HAYAKU_PACKET_AUTHORING_ALIAS_LANGUAGES)
      .map(normalizeHayakuMemoryLanguage)
      .filter(language => HAYAKU_PACKET_AUTHORING_ALIAS_LANGUAGES.includes(language)))];
    const prefixes = [...new Set((Array.isArray(value?.canonicalAnchors?.prefixes)
      ? value.canonicalAnchors.prefixes : HAYAKU_CANONICAL_ANCHOR_PREFIXES)
      .map(prefix => text(prefix).trim().toLowerCase())
      .filter(prefix => HAYAKU_CANONICAL_ANCHOR_PREFIXES.includes(prefix)))];
    const schemaInstructions = (Array.isArray(value.schemaInstructions) ? value.schemaInstructions : [])
      .map(instruction => text(instruction).trim()).filter(Boolean).slice(0, 12);
    const normalized = {
      ...fallback,
      ...clone(value, {}),
      packet: { ...fallback.packet, ...clone(value.packet, {}) },
      memoryLanguage,
      humanReadableInstruction: text(value.humanReadableInstruction).trim()
        || bridgeFallbackLanguageInstruction(memoryLanguage),
      schemaInstructions: schemaInstructions.length ? schemaInstructions : fallback.schemaInstructions,
      recallAliases: {
        ...fallback.recallAliases,
        ...clone(value.recallAliases, {}),
        field: 'meta.summary_memory.recallAliases',
        languages: aliasLanguages.length ? aliasLanguages : [...HAYAKU_PACKET_AUTHORING_ALIAS_LANGUAGES]
      },
      canonicalAnchors: {
        ...fallback.canonicalAnchors,
        ...clone(value.canonicalAnchors, {}),
        field: 'meta.summary_memory.canonicalAnchors',
        prefixes: prefixes.length ? prefixes : [...HAYAKU_CANONICAL_ANCHOR_PREFIXES]
      },
      pluginLlmCalls: 0,
      source: source || text(value.source || 'hayaku_runtime'),
      authoritative: true
    };
    normalized.contractHash = text(value.contractHash).trim()
      || stableHash64(JSON.stringify({ ...normalized, contractHash: undefined }));
    return normalized;
  };

  const CURRENT_CONTEXT_HOST_TIMEOUT_MS = 1800;
  const currentContextHostCall = async (label, operation, fallback = null) => {
    let timer = null;
    try {
      return await Promise.race([
        Promise.resolve().then(operation),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            const error = new Error(`${text(label || 'host context call')} timed out after ${CURRENT_CONTEXT_HOST_TIMEOUT_MS}ms`);
            error.code = 'RETRACE_HOST_CONTEXT_TIMEOUT';
            reject(error);
          }, CURRENT_CONTEXT_HOST_TIMEOUT_MS);
        })
      ]);
    } catch (error) {
      const detail = compact(error?.message || error || '', 180);
      const chatSelectionRace = /(?:chatPage|reading ['"]chatPage['"]|undefined.*chatPage)/i.test(detail);
      Runtime.warnings.push({
        at: Date.now(),
        message: chatSelectionRace ? 'Current chat selection was transient; retrying context resolution' : 'Current chat host call failed; using fallback',
        detail: `${text(label)}: ${detail}`
      });
      Runtime.warnings = Runtime.warnings.slice(-30);
      return fallback;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const getCurrentContext = async () => {
    const indexed = liveApi(['getCurrentCharacterIndex', 'getCurrentChatIndex', 'getCharacterFromIndex', 'getChatFromIndex']);
    if (indexed) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const characterIndexRaw = await currentContextHostCall(
          attempt ? `retry${attempt}:getCurrentCharacterIndex` : 'getCurrentCharacterIndex',
          () => indexed.getCurrentCharacterIndex(),
          -1
        );
        const characterIndex = Number(characterIndexRaw);
        if (Number.isInteger(characterIndex) && characterIndex >= 0) {
          const [character, chatIndexRaw] = await Promise.all([
            currentContextHostCall(
              attempt ? `retry${attempt}:getCharacterFromIndex` : 'getCharacterFromIndex',
              () => indexed.getCharacterFromIndex(characterIndex),
              null
            ),
            currentContextHostCall(
              attempt ? `retry${attempt}:getCurrentChatIndex` : 'getCurrentChatIndex',
              () => indexed.getCurrentChatIndex(),
              -1
            )
          ]);
          let chatIndex = Number(chatIndexRaw);
          let usedCharacterChatPageFallback = false;
          if ((!Number.isInteger(chatIndex) || chatIndex < 0) && character) {
            const characterChatPage = Number(character?.chatPage);
            if (Number.isInteger(characterChatPage) && characterChatPage >= 0) {
              chatIndex = characterChatPage;
              usedCharacterChatPageFallback = true;
            }
          }
          if (character && Number.isInteger(chatIndex) && chatIndex >= 0) {
            let chat = await currentContextHostCall(
              attempt ? `retry${attempt}:getChatFromIndex` : 'getChatFromIndex',
              () => indexed.getChatFromIndex(characterIndex, chatIndex),
              null
            );
            if (!chat && Array.isArray(character?.chats)) chat = character.chats[chatIndex] || null;
            if (chat) return { character, chat, characterIndex, chatIndex, source: usedCharacterChatPageFallback ? 'indexed_character_chatPage_fallback' : 'indexed' };
          }
        }
        if (attempt < 2) await delay(attempt === 0 ? 45 : 120);
      }
    }
    const direct = liveApi(['getCharacter']) || liveApi(['getChar']) || liveApi();
    const character = typeof direct?.getCharacter === 'function'
      ? await currentContextHostCall('direct:getCharacter', () => direct.getCharacter(), null)
      : typeof direct?.getChar === 'function'
        ? await currentContextHostCall('direct:getChar', () => direct.getChar(), null)
        : null;
    if (!character) throw new Error('현재 캐릭터를 불러올 수 없습니다.');
    const chats = Array.isArray(character?.chats) ? character.chats : [];
    const directChatPage = Number(character?.chatPage);
    const chatIndex = Number.isInteger(directChatPage) && directChatPage >= 0 ? directChatPage : 0;
    const chat = chats[chatIndex] || chats[0] || null;
    if (!chat) throw new Error('현재 채팅을 불러올 수 없습니다.');
    return { character, chat, characterIndex: -1, chatIndex, source: 'character' };
  };

  const identityValue = value => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return text(value).trim();
    if (typeof value !== 'object') return '';
    return text(value.id || value._id || value.uid || value.uuid || value.key || value.name || '').trim();
  };

  const contextIdentity = context => ({
    characterId: text(
      context?.character?.id
      || context?.character?._id
      || context?.character?.chaId
      || context?.character?.uid
      || context?.character?.uuid
      || context?.character?.key
      || context?.character?.name
      || ''
    ).trim(),
    chatId: text(
      context?.chat?.id
      || context?.chat?._id
      || context?.chat?.uid
      || context?.chat?.uuid
      || context?.chat?.key
      || context?.chat?.chatId
      || context?.chat?.fileName
      || context?.chat?.filename
      || ''
    ).trim(),
    personaId: identityValue(
      context?.chat?.bindedPersona
      ?? context?.chat?.boundPersona
      ?? context?.chat?.personaId
      ?? context?.chat?.selectedPersona
      ?? context?.chat?.persona
    )
  });

  const registerFlashbackIpc = async () => {
    if (Runtime.flashbackIpcRegistered) return true;
    const api = liveApi(['addPluginChannelListener', 'postPluginChannelMessage']);
    if (typeof api?.addPluginChannelListener !== 'function'
      || typeof api?.postPluginChannelMessage !== 'function') return false;
    await api.addPluginChannelListener(
      FLASHBACK_IPC_RESPONSE_CHANNEL,
      (message, metadata = {}) => {
        const response = message && typeof message === 'object' && !Array.isArray(message)
          ? message
          : {};
        if (response.schema !== FLASHBACK_IPC_SCHEMA || response.kind !== 'response') return;
        const sender = text(metadata?.sender || '').trim();
        if (sender !== FLASHBACK_PLUGIN_ID) return;
        const requestId = text(response.requestId || '').trim();
        const pending = Runtime.flashbackIpcPending.get(requestId);
        if (!pending) return;
        if (text(response.action || '').trim() !== pending.action) return;
        Runtime.flashbackIpcPending.delete(requestId);
        Runtime.flashbackIpcLastSeenAt = Date.now();
        Runtime.flashbackIpcLastError = response.ok === true ? '' : text(response.error || 'Flashback IPC request failed.');
        if (response.ok === true && pending.action === 'inspect') {
          Runtime.flashbackInspectCircuitUntil = 0;
          Runtime.flashbackInspectIpcSuccesses += 1;
        }
        clearTimeout(pending.timer);
        if (response.ok === true) pending.resolve(response.result);
        else {
          const error = new Error(Runtime.flashbackIpcLastError || 'Flashback IPC request failed.');
          error.code = 'FLASHBACK_IPC_REJECTED';
          error.remoteReachable = true;
          error.action = pending.action;
          pending.reject(error);
        }
      }
    );
    Runtime.flashbackIpcRegistered = true;
    return true;
  };

  const requestFlashbackIpc = async (action, payload = {}, options = {}) => {
    const registered = await registerFlashbackIpc().catch(error => {
      warn('Flashback IPC listener registration failed', error);
      return false;
    });
    const api = liveApi(['postPluginChannelMessage']);
    if (!registered || typeof api?.postPluginChannelMessage !== 'function') {
      const error = new Error('Flashback IPC API is unavailable.');
      error.code = 'FLASHBACK_IPC_UNAVAILABLE';
      throw error;
    }
    const requestId = uuid();
    const timeoutMs = Math.max(400, Math.min(FLASHBACK_IPC_TIMEOUT_MAX_MS, Number(options.timeoutMs || 4000) || 4000));
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        Runtime.flashbackIpcPending.delete(requestId);
        const error = new Error(`Flashback IPC timed out after ${timeoutMs}ms.`);
        error.code = 'FLASHBACK_IPC_TIMEOUT';
        error.action = text(action || '').trim();
        Runtime.flashbackIpcLastTimeoutAt = Date.now();
        Runtime.flashbackIpcLastError = error.message;
        reject(error);
      }, timeoutMs);
      Runtime.flashbackIpcPending.set(requestId, { resolve, reject, timer, action, at: Date.now() });
      Promise.resolve(api.postPluginChannelMessage(
        FLASHBACK_PLUGIN_ID,
        FLASHBACK_IPC_REQUEST_CHANNEL,
        {
          schema: FLASHBACK_IPC_SCHEMA,
          kind: 'request',
          requestId,
          action: text(action || '').trim(),
          payload: clone(payload, {})
        }
      )).catch(error => {
        const pending = Runtime.flashbackIpcPending.get(requestId);
        if (!pending) return;
        Runtime.flashbackIpcPending.delete(requestId);
        clearTimeout(pending.timer);
        Runtime.flashbackIpcLastError = text(error?.message || error);
        reject(error);
      });
    });
  };

  const registerHayakuIpc = async () => {
    if (Runtime.hayakuIpcRegistered) return true;
    const api = liveApi(['addPluginChannelListener', 'postPluginChannelMessage']);
    if (typeof api?.addPluginChannelListener !== 'function'
      || typeof api?.postPluginChannelMessage !== 'function') return false;
    await api.addPluginChannelListener(
      HAYAKU_IPC_RESPONSE_CHANNEL,
      (message, metadata = {}) => {
        const response = message && typeof message === 'object' && !Array.isArray(message)
          ? message
          : {};
        if (response.schema !== HAYAKU_IPC_SCHEMA || response.kind !== 'response') return;
        const sender = text(metadata?.sender || '').trim();
        if (sender && sender !== HAYAKU_PLUGIN_ID) return;
        const requestId = text(response.requestId || '').trim();
        const pending = Runtime.hayakuIpcPending.get(requestId);
        if (!pending) return;
        if (text(response.action || '').trim() !== text(pending.action || '').trim()) return;
        // Mutation receipts must be authenticated by the host-provided sender.
        // Read-only compatibility probes may still accept legacy hosts that omit it.
        if ((HAYAKU_IPC_MUTATION_ACTIONS.has(pending.action) || pending.requireAuthenticatedSender === true)
          && sender !== HAYAKU_PLUGIN_ID) return;
        Runtime.hayakuIpcPending.delete(requestId);
        Runtime.hayakuIpcUnavailableUntil = 0;
        clearTimeout(pending.timer);
        if (response.ok === true) pending.resolve(response.result);
        else {
          const error = new Error(text(response.error || 'HAYAKU IPC request failed.'));
          error.code = 'HAYAKU_IPC_REJECTED';
          pending.reject(error);
        }
      }
    );
    Runtime.hayakuIpcRegistered = true;
    return true;
  };

  const requestHayakuIpc = async (action, payload = {}, options = {}) => {
    if (options.ignoreCooldown !== true && Date.now() < Number(Runtime.hayakuIpcUnavailableUntil || 0)) {
      const error = new Error('HAYAKU IPC is temporarily unavailable after a recent timeout.');
      error.code = 'HAYAKU_IPC_UNAVAILABLE';
      throw error;
    }
    const registered = await registerHayakuIpc().catch(error => {
      warn('HAYAKU IPC listener registration failed', error);
      return false;
    });
    const api = liveApi(['postPluginChannelMessage']);
    if (!registered || typeof api?.postPluginChannelMessage !== 'function') {
      const error = new Error('HAYAKU IPC API is unavailable.');
      error.code = 'HAYAKU_IPC_UNAVAILABLE';
      throw error;
    }
    const requestId = uuid();
    const timeoutMs = Math.max(250, Math.min(15000, Number(options.timeoutMs || 5000) || 5000));
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        Runtime.hayakuIpcPending.delete(requestId);
        if (options.suppressCooldown !== true) Runtime.hayakuIpcUnavailableUntil = Date.now() + 10000;
        const error = new Error(`HAYAKU IPC timed out after ${timeoutMs}ms.`);
        error.code = 'HAYAKU_IPC_TIMEOUT';
        reject(error);
      }, timeoutMs);
      Runtime.hayakuIpcPending.set(requestId, {
        resolve, reject, timer, action, at: Date.now(),
        requireAuthenticatedSender: options.requireAuthenticatedSender === true
      });
      Promise.resolve(api.postPluginChannelMessage(
        HAYAKU_PLUGIN_ID,
        HAYAKU_IPC_REQUEST_CHANNEL,
        {
          schema: HAYAKU_IPC_SCHEMA,
          kind: 'request',
          requestId,
          action: text(action || '').trim(),
          payload: clone(payload, {})
        }
      )).catch(error => {
        const pending = Runtime.hayakuIpcPending.get(requestId);
        if (!pending) return;
        Runtime.hayakuIpcPending.delete(requestId);
        clearTimeout(pending.timer);
        reject(error);
      });
    });
  };

  const setHayakuOwnerGate = (state, ready, reason = '', capabilities = null) => {
    Runtime.hayakuOwnerGate = {
      state,
      ready: ready === true,
      reason: compact(reason || '', 240),
      checkedAt: Date.now(),
      capabilities: capabilities ? clone(capabilities, {}) : null
    };
    return Runtime.hayakuOwnerGate;
  };
  const probeLiveHayakuOwner = async (options = {}) => {
    const cached = Runtime.hayakuOwnerGate || {};
    if (options.force !== true && Number(cached.checkedAt || 0) > 0
      && Date.now() - Number(cached.checkedAt || 0) <= HAYAKU_OWNER_GATE_CACHE_MS) return cached;
    try {
      const capabilities = await requestHayakuIpc('capabilities', {}, {
        timeoutMs: Math.max(600, Math.min(8000, Number(options.timeoutMs || 2200) || 2200)),
        ignoreCooldown: true,
        suppressCooldown: true,
        requireAuthenticatedSender: true
      });
      const ownerMatches = text(capabilities?.ownerPluginId || '').trim() === HAYAKU_PLUGIN_ID;
      const inspectReady = capabilities?.ipcCapabilities?.inspect === true || capabilities?.features?.inspect === true;
      if (!ownerMatches || !inspectReady) {
        return setHayakuOwnerGate('incompatible', false, 'hayaku_owner_contract_incomplete', capabilities);
      }
      return setHayakuOwnerGate('ready', true, 'hayaku_owner_ready', capabilities);
    } catch (error) {
      const code = text(error?.code || '').trim();
      return setHayakuOwnerGate(
        code === 'HAYAKU_IPC_REJECTED' ? 'incompatible' : 'absent',
        false,
        compact(error?.message || code || 'hayaku_owner_unavailable', 240),
        null
      );
    }
  };
  const ensureHayakuOwnerReady = async (options = {}) => {
    const gate = await probeLiveHayakuOwner(options);
    if (gate.ready !== true) {
      const error = new Error(gate.state === 'incompatible'
        ? `HAYAKU owner가 호환되지 않아 ${options.action || 'HAYAKU 작업'}을 실행하지 않습니다.`
        : `활성 HAYAKU owner가 없어 ${options.action || 'HAYAKU 작업'}을 실행하지 않습니다.`);
      error.code = gate.state === 'incompatible' ? 'HAYAKU_OWNER_INCOMPATIBLE' : 'HAYAKU_OWNER_ABSENT';
      error.ownerGate = gate;
      throw error;
    }
    if (options.requireRecoveryDebtContract === true) {
      const ipc = gate.capabilities?.ipcCapabilities || {};
      if (ipc.recoveryDebtWorldlineV1 !== true
        || ipc.inspectRecoveryDebts !== true
        || ipc.acquireRecoveryDebtLease !== true
        || ipc.releaseRecoveryDebtLease !== true
        || ipc.repairTargetAdoptionV1 !== true) {
        const error = new Error('HAYAKU owner가 자동 복구 debt/worldline 계약을 지원하지 않습니다.');
        error.code = 'HAYAKU_RECOVERY_DEBT_CONTRACT_UNAVAILABLE';
        throw error;
      }
    }
    return gate;
  };

  const registerLibraIpc = async () => {
    if (Runtime.libraIpcRegistered) return true;
    const api = liveApi(['addPluginChannelListener', 'postPluginChannelMessage']);
    if (typeof api?.addPluginChannelListener !== 'function'
      || typeof api?.postPluginChannelMessage !== 'function') return false;
    await api.addPluginChannelListener(
      LIBRA_IPC_RESPONSE_CHANNEL,
      (message, metadata = {}) => {
        const response = message && typeof message === 'object' && !Array.isArray(message) ? message : {};
        if (response.schema !== LIBRA_IPC_SCHEMA || response.kind !== 'response') return;
        const sender = text(metadata?.sender || '').trim();
        if (sender !== LIBRA_PLUGIN_ID) return;
        const requestId = text(response.requestId || '').trim();
        const pending = Runtime.libraIpcPending.get(requestId);
        if (!pending) return;
        if (text(response.action || '').trim() !== pending.action) return;
        Runtime.libraIpcPending.delete(requestId);
        Runtime.libraIpcLastSeenAt = Date.now();
        Runtime.libraIpcLastError = response.ok === true ? '' : text(response.error || 'LIBRA IPC request failed.');
        clearTimeout(pending.timer);
        if (response.ok === true) pending.resolve(response.result);
        else {
          const error = new Error(Runtime.libraIpcLastError || 'LIBRA IPC request failed.');
          error.code = 'LIBRA_IPC_REJECTED';
          error.remoteCode = text(response.errorCode || '').trim();
          error.remoteReachable = true;
          error.action = pending.action;
          pending.reject(error);
        }
      }
    );
    Runtime.libraIpcRegistered = true;
    return true;
  };

  const requestLibraIpc = async (action, payload = {}, options = {}) => {
    const registered = await registerLibraIpc().catch(error => {
      warn('LIBRA IPC listener registration failed', error);
      return false;
    });
    const api = liveApi(['postPluginChannelMessage']);
    if (!registered || typeof api?.postPluginChannelMessage !== 'function') {
      const error = new Error('LIBRA IPC API is unavailable. LIBRA v1.0.4 or later is required.');
      error.code = 'LIBRA_IPC_UNAVAILABLE';
      throw error;
    }
    const requestId = uuid();
    const timeoutMs = Math.max(400, Math.min(LIBRA_IPC_TIMEOUT_MAX_MS, Number(options.timeoutMs || 4000) || 4000));
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        Runtime.libraIpcPending.delete(requestId);
        const error = new Error(`LIBRA IPC timed out after ${timeoutMs}ms.`);
        error.code = 'LIBRA_IPC_TIMEOUT';
        error.action = text(action || '').trim();
        Runtime.libraIpcLastError = error.message;
        reject(error);
      }, timeoutMs);
      Runtime.libraIpcPending.set(requestId, { resolve, reject, timer, action: text(action || '').trim(), at: Date.now() });
      Promise.resolve(api.postPluginChannelMessage(
        LIBRA_PLUGIN_ID,
        LIBRA_IPC_REQUEST_CHANNEL,
        { schema: LIBRA_IPC_SCHEMA, kind: 'request', requestId, action: text(action || '').trim(), payload: clone(payload, {}) }
      )).catch(error => {
        const pending = Runtime.libraIpcPending.get(requestId);
        if (!pending) return;
        Runtime.libraIpcPending.delete(requestId);
        clearTimeout(pending.timer);
        Runtime.libraIpcLastError = text(error?.message || error);
        reject(error);
      });
    });
  };


  const registerLiaIpc = async () => {
    if (Runtime.liaIpcRegistered) return true;
    const api = liveApi(['addPluginChannelListener', 'postPluginChannelMessage']);
    if (typeof api?.addPluginChannelListener !== 'function'
      || typeof api?.postPluginChannelMessage !== 'function') return false;
    await api.addPluginChannelListener(
      LIA_IPC_RESPONSE_CHANNEL,
      (message, metadata = {}) => {
        const response = message && typeof message === 'object' && !Array.isArray(message) ? message : {};
        if (response.schema !== LIA_IPC_SCHEMA || response.kind !== 'response') return;
        const sender = text(metadata?.sender || '').trim();
        if (sender !== LIA_PLUGIN_ID) return;
        const requestId = text(response.requestId || '').trim();
        const pending = Runtime.liaIpcPending.get(requestId);
        if (!pending) return;
        if (text(response.action || '').trim() !== pending.action) return;
        Runtime.liaIpcPending.delete(requestId);
        clearTimeout(pending.timer);
        Runtime.liaIpcLastError = response.ok === true ? '' : text(response.error || 'LIA IPC request failed.');
        if (response.ok === true) pending.resolve(response.result);
        else {
          const error = new Error(Runtime.liaIpcLastError || 'LIA IPC request failed.');
          error.code = 'LIA_IPC_REJECTED';
          pending.reject(error);
        }
      }
    );
    Runtime.liaIpcRegistered = true;
    return true;
  };

  const requestLiaIpc = async (action, payload = {}, options = {}) => {
    const registered = await registerLiaIpc().catch(error => {
      warn('LIA IPC listener registration failed', error);
      return false;
    });
    const api = liveApi(['postPluginChannelMessage']);
    if (!registered || typeof api?.postPluginChannelMessage !== 'function') {
      const error = new Error('LIA IPC API is unavailable.');
      error.code = 'LIA_IPC_UNAVAILABLE';
      throw error;
    }
    const requestId = uuid();
    const timeoutMs = Math.max(500, Math.min(10000, Number(options.timeoutMs || 3500) || 3500));
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        Runtime.liaIpcPending.delete(requestId);
        const error = new Error(`LIA IPC timed out after ${timeoutMs}ms.`);
        error.code = 'LIA_IPC_TIMEOUT';
        Runtime.liaIpcLastError = error.message;
        reject(error);
      }, timeoutMs);
      Runtime.liaIpcPending.set(requestId, { resolve, reject, timer, action: text(action || '').trim(), at: Date.now() });
      Promise.resolve(api.postPluginChannelMessage(
        LIA_PLUGIN_ID,
        LIA_IPC_REQUEST_CHANNEL,
        { schema: LIA_IPC_SCHEMA, kind: 'request', requestId, action: text(action || '').trim(), payload: clone(payload, {}) }
      )).catch(error => {
        const pending = Runtime.liaIpcPending.get(requestId);
        if (!pending) return;
        Runtime.liaIpcPending.delete(requestId);
        clearTimeout(pending.timer);
        Runtime.liaIpcLastError = text(error?.message || error);
        reject(error);
      });
    });
  };

  const isLiaLivePersonaId = value => text(value || '').trim().startsWith(LIA_LIVE_PERSONA_ID_PREFIX);

  const liaAdoptionReceiptMatches = (receipt, options = {}) => {
    const sourceChatId = text(options.sourceChatId || '').trim();
    const targetChatId = text(options.targetChatId || '').trim();
    const transferId = text(options.transferId || '').trim();
    const sourceLivePersonaId = text(options.sourceLivePersonaId || '').trim();
    const livePersonaId = text(receipt?.livePersonaId || '').trim();
    const sourceScopeKey = text(receipt?.sourceScopeKey || '').trim();
    const targetScopeKey = text(receipt?.targetScopeKey || '').trim();
    return receipt?.schema === LIA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'adopted'
      && typeof receipt?.adopted === 'boolean'
      && receipt?.verified === true
      && receipt?.durable === true
      && receipt?.durableReadbackVerified === true
      && text(receipt?.ownerPluginId || '') === LIA_PLUGIN_ID
      && text(receipt?.authorizedRequester || '') === 'flashback_hayaku_bridge'
      && text(receipt?.mutation || '') === 'adopt_chat_handoff'
      && text(receipt?.sourceChatId || '') === sourceChatId
      && text(receipt?.targetChatId || '') === targetChatId
      && text(receipt?.transferId || '') === transferId
      && text(receipt?.sourceLivePersonaId || '') === sourceLivePersonaId
      && isLiaLivePersonaId(livePersonaId)
      && livePersonaId !== sourceLivePersonaId
      && sourceScopeKey.length > 0
      && targetScopeKey.length > 0
      && targetScopeKey !== sourceScopeKey
      && text(receipt?.forkedFromScopeKey || '') === sourceScopeKey
      && text(receipt?.forkedFromLivePersonaId || '') === sourceLivePersonaId
      && text(receipt?.handoffSourceChatId || '') === sourceChatId
      && text(receipt?.handoffTransferId || '') === transferId
      && sourcePreservationReceiptMatches(receipt, RETRACE_PEER_REQUIREMENTS.lia, { physicalField: 'physicalCopies' })
      && memorySuiteStorageReceiptMatches(receipt, 'lia');
  };

  const adoptLiaLivePersonaHandoff = async options => {
    const sourceLivePersonaId = text(options?.sourceLivePersonaId || '').trim();
    const required = isLiaLivePersonaId(sourceLivePersonaId);
    if (!required) return {
      schema: LIA_HANDOFF_RECEIPT_SCHEMA,
      action: 'adopted', adopted: false, verified: true, durable: true,
      sourceChatId: text(options?.sourceChatId || ''), targetChatId: text(options?.targetChatId || ''),
      transferId: text(options?.transferId || ''), sourceLivePersonaId: '', livePersonaId: '', reason: 'no_lia_live_persona'
    };
    try {
      const result = await requestLiaIpc('adopt_chat_handoff', {
        sourceChatId: text(options?.sourceChatId || ''),
        targetChatId: text(options?.targetChatId || ''),
        transferId: text(options?.transferId || ''),
        sourceLivePersonaId,
        mode: 'retrace'
      }, { timeoutMs: 5000 });
      return result && typeof result === 'object' ? result : {
        schema: LIA_HANDOFF_RECEIPT_SCHEMA, action: 'adopted', adopted: false, verified: false, durable: false,
        sourceChatId: text(options?.sourceChatId || ''), targetChatId: text(options?.targetChatId || ''),
        transferId: text(options?.transferId || ''), sourceLivePersonaId, livePersonaId: '', reason: 'lia_invalid_response'
      };
    } catch (error) {
      return {
        schema: LIA_HANDOFF_RECEIPT_SCHEMA, action: 'adopted', adopted: false, verified: false, durable: false,
        sourceChatId: text(options?.sourceChatId || ''), targetChatId: text(options?.targetChatId || ''),
        transferId: text(options?.transferId || ''), sourceLivePersonaId, livePersonaId: '',
        reason: text(error?.code || error?.message || 'lia_handoff_failed'), error: text(error?.message || error)
      };
    }
  };

  const probeLibraIpc = async (options = {}) => {
    const timeoutMs = Math.max(500, Math.min(5000, Number(options.timeoutMs || 1800) || 1800));
    const attempts = Math.max(1, Math.min(3, Number(options.attempts || 2) || 2));
    let lastError = null;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const result = await requestLibraIpc('ping', {}, { timeoutMs });
        const schemaOk = result?.schema === LIBRA_CAPABILITIES_SCHEMA;
        return {
          available: true,
          reachable: true,
          schemaOk,
          legacy: !schemaOk,
          pluginVersion: text(result?.pluginVersion || ''),
          capabilities: result && typeof result === 'object' ? clone(result, {}) : {},
          attempts: attempt,
          reason: schemaOk ? 'libra_ping_ok' : 'libra_ping_legacy_response'
        };
      } catch (error) {
        lastError = error;
        // An explicit IPC rejection proves that LIBRA received the request. Older
        // LIBRA builds do not know the ping action, so continue with inspect rather
        // than misreporting the plugin as absent.
        if (error?.remoteReachable === true || text(error?.code) === 'LIBRA_IPC_REJECTED') {
          return {
            available: true, reachable: true, schemaOk: false, legacy: true,
            pluginVersion: '', capabilities: {}, attempts: attempt,
            reason: 'libra_ping_rejected_but_reachable', error: text(error?.message || error)
          };
        }
        if (attempt < attempts) await delay(120);
      }
    }
    return {
      available: false, reachable: false, schemaOk: false, legacy: false, pluginVersion: '', capabilities: {}, attempts,
      reason: text(lastError?.code || 'libra_ipc_unavailable'), error: text(lastError?.message || lastError || '')
    };
  };

  const activeLibraRuntime = () => {
    try {
      const candidate = globalThis.__LIBRA__ || globalThis.__pluginApis__?.libra || globalThis.__pluginApis__?.LIBRA;
      if (candidate && typeof candidate === 'object') return candidate;
    } catch (_) {}
    return null;
  };

  const activeFlashbackRuntime = () => {
    const candidates = [];
    try {
      candidates.push(
        globalThis.__FlashbackMemory,
        globalThis.__VectorRagMemory,
        globalThis.__pluginApis__?.FLASHBACK,
        globalThis.__pluginApis__?.flashback_memory
      );
    } catch (_) {}
    for (const candidate of candidates) {
      const adopt = typeof candidate?.memory?.adoptSessionHandoff === 'function'
        ? (...args) => candidate.memory.adoptSessionHandoff(...args)
        : typeof candidate?.adoptSessionHandoff === 'function'
          ? (...args) => candidate.adoptSessionHandoff(...args)
          : null;
      if (typeof candidate?.memory?.inspect === 'function') {
        return {
          api: candidate,
          inspect: (...args) => candidate.memory.inspect(...args),
          adopt,
          runtime: typeof candidate.runtime === 'function' ? (...args) => candidate.runtime(...args) : null
        };
      }
      if (typeof candidate?.inspectMemoryLedger === 'function') {
        return {
          api: candidate,
          inspect: (...args) => candidate.inspectMemoryLedger(...args),
          adopt,
          runtime: typeof candidate.runtime === 'function' ? (...args) => candidate.runtime(...args) : null
        };
      }
      // v0.9.14 compatibility while users update Flashback and the bridge
      // independently. New releases expose the production memory.inspect API.
      if (typeof candidate?._test?.debugRecords === 'function') {
        return {
          api: candidate,
          inspect: (...args) => candidate._test.debugRecords(...args),
          adopt,
          runtime: typeof candidate.runtime === 'function' ? (...args) => candidate.runtime(...args) : null
        };
      }
    }
    return null;
  };

  const inspectFlashbackNonDestructiveHandoffCapability = async () => {
    let raw = null;
    let source = 'none';
    let errorText = '';
    const runtime = activeFlashbackRuntime();
    if (typeof runtime?.runtime === 'function') {
      try {
        const snapshot = await Promise.resolve(runtime.runtime());
        raw = snapshot?.capabilities?.retraceCompatibility
          || snapshot?.capabilities
          || snapshot;
        source = 'same_realm_runtime';
      } catch (error) {
        errorText = text(error?.message || error);
      }
    }
    if (!peerCompatibilityPayload(raw)) {
      try {
        raw = await requestFlashbackIpc('capabilities', {}, { timeoutMs: FLASHBACK_CAPABILITY_TIMEOUT_MS });
        source = 'flashback_plugin_ipc';
      } catch (error) {
        errorText = text(error?.message || error);
      }
    }
    if (!peerCompatibilityPayload(raw)) {
      try {
        raw = await requestFlashbackIpc('inspect', { includeRecords: false }, { timeoutMs: FLASHBACK_INSPECT_SUMMARY_TIMEOUT_MS });
        source = 'flashback_plugin_ipc_inspect';
      } catch (error) {
        errorText = errorText || text(error?.message || error);
      }
    }
    const evaluated = evaluatePeerCompatibility(RETRACE_PEER_REQUIREMENTS.flashback, raw, Boolean(peerCompatibilityPayload(raw)), { required: true });
    return {
      supported: evaluated.compatible,
      pluginVersion: evaluated.pluginVersion,
      capabilities: clone(raw?.capabilities || raw || {}, {}),
      compatibility: clone(evaluated.compatibility, null),
      source,
      handoffContract: evaluated.handoffContract,
      sourcePreserving: evaluated.compatible,
      sourceCompactionAllowed: evaluated.compatible ? false : null,
      reason: evaluated.compatible ? 'flashback_universal_compatibility_contract' : evaluated.reason,
      errors: evaluated.errors,
      error: errorText
    };
  };

  const flashbackSourceStorageIntegritySnapshotForRetrace = async scopeKey => {
    const key = text(scopeKey || '').trim();
    if (!key) throw new Error('flashback_source_integrity_scope_missing');
    const prefix = `${FLASHBACK_SCOPE_PREFIX}${flashbackKeyHash(key)}`;
    const manifestKey = `${prefix}:manifest:v2`;
    const rawManifest = await storageGet(manifestKey);
    const manifest = parseJson(rawManifest, null);
    if (!manifest || text(manifest.scopeKey || '') !== key) {
      throw new Error('flashback_source_manifest_missing');
    }
    const shardCount = Math.max(0, Number(manifest.shardCount || 0) || 0);
    const commitId = text(manifest.commitId || '').trim();
    const shards = [];
    let missingShards = 0;
    for (let index = 0; index < shardCount; index += 1) {
      const suffix = String(index).padStart(4, '0');
      const commitKey = commitId
        ? `${prefix}:records:commit:${commitId}:shard:${suffix}`
        : `${prefix}:records:shard:${suffix}`;
      let storageKey = commitKey;
      let raw = await storageGet(storageKey);
      if ((raw == null || raw === '') && commitId) {
        const legacyKey = `${prefix}:records:shard:${suffix}`;
        const legacyRaw = await storageGet(legacyKey);
        if (legacyRaw != null && legacyRaw !== '') {
          storageKey = legacyKey;
          raw = legacyRaw;
        }
      }
      const present = raw != null && raw !== '';
      if (!present) missingShards += 1;
      const serialized = typeof raw === 'string' ? raw : JSON.stringify(raw ?? null);
      shards.push({ index, storageKey, present, hash: present ? flashbackKeyHash(serialized) : '' });
    }
    const worldlineKey = `${prefix}:turn_worldline:v1`;
    const rawWorldline = await storageGet(worldlineKey);
    const archiveRef = normalizeFlashbackArchiveRefForRetrace(manifest.archiveRef);
    const legacyCompacted = Boolean(
      archiveRef
      && shardCount === 0
      && Math.max(0, Number(archiveRef.recordCount || 0) || 0) > 0
      && text(manifest.archiveCompactedAt || '').trim()
    );
    const core = {
      scopeKey: key,
      manifestHash: flashbackKeyHash(typeof rawManifest === 'string' ? rawManifest : JSON.stringify(rawManifest ?? null)),
      commitId,
      count: Math.max(0, Number(manifest.count || 0) || 0),
      shardCount,
      archiveRef,
      worldlineHash: rawWorldline == null || rawWorldline === ''
        ? ''
        : flashbackKeyHash(typeof rawWorldline === 'string' ? rawWorldline : JSON.stringify(rawWorldline)),
      shards,
      missingShards,
      legacyCompacted
    };
    return { ...core, fingerprint: flashbackKeyHash(JSON.stringify(core)) };
  };

  const compareFlashbackSourceStorageIntegrityForRetrace = (before = {}, after = {}) => {
    const changed = [];
    for (const key of ['manifestHash', 'commitId', 'count', 'shardCount', 'worldlineHash', 'missingShards', 'legacyCompacted']) {
      if (JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])) changed.push(key);
    }
    if (JSON.stringify(before?.archiveRef || null) !== JSON.stringify(after?.archiveRef || null)) changed.push('archiveRef');
    if (JSON.stringify(before?.shards || []) !== JSON.stringify(after?.shards || [])) changed.push('shards');
    return {
      identical: changed.length === 0 && text(before?.fingerprint || '') === text(after?.fingerprint || ''),
      changed
    };
  };

  const verifyFlashbackSessionHandoffFromStorage = async (options = {}) => {
    const targetChatId = text(options.targetChatId || '').trim();
    const transferId = text(options.transferId || '').trim();
    const sourceScopeKey = text(options.sourceScopeKey || '').trim();
    const expectedRecords = Math.max(0, Number(options.expectedRecords || 0) || 0);
    const base = {
      schema: 'flashback_memory.session_handoff_adoption.v4',
      ok: false, available: false, attempted: false, adopted: false, verified: false, durable: false,
      handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
      sourceMutationAllowed: false, sourceCompactionAllowed: false, sourcePreserved: false,
      targetChatId, transferId, sourceScopeKey, records: 0, expectedRecords, transport: 'plugin_storage_readback'
    };
    try {
      const context = await getCurrentContext();
      if (contextIdentity(context).chatId !== targetChatId) return { ...base, reason: 'target_chat_not_active' };
      const inspected = await readFlashbackSource(context, { includeRecords: false, skipRuntime: true, skipIpc: true });
      const manifest = inspected?.manifest && typeof inspected.manifest === 'object' ? inspected.manifest : {};
      const targetScope = inspected?.sourceScope && typeof inspected.sourceScope === 'object' ? inspected.sourceScope : {};
      const targetMatches = !targetScope.chatId || text(targetScope.chatId || '').trim() === targetChatId;
      const transferMatches = text(manifest.copyTransferId || '').trim() === transferId;
      const sourceMatches = !sourceScopeKey || text(manifest.copiedFromScopeKey || '').trim() === sourceScopeKey;
      const expectedMatches = Number(manifest.copyExpectedRecordCount || 0) === expectedRecords;
      const records = Math.max(0, Number(inspected?.records || manifest.count || 0) || 0);
      const recordsMatch = records === expectedRecords;
      const adoptionMode = text(manifest.copyAdoptionMode || '').trim();
      const modeMatches = adoptionMode === 'shared_archive';
      const contractMatches = text(manifest.handoffContract || '') === FLASHBACK_REQUIRED_HANDOFF_CONTRACT
        && manifest.sourcePreservationRequired === true;
      const archiveVerified = manifest.archiveVerified !== false && inspected?.integrityOk !== false;
      let sourceStorageAfter = null;
      let sourceStoragePreserved = false;
      const sourceStorageBefore = options.sourceStorageIntegrityBefore && typeof options.sourceStorageIntegrityBefore === 'object'
        ? options.sourceStorageIntegrityBefore
        : null;
      if (sourceScopeKey && sourceStorageBefore?.fingerprint) {
        sourceStorageAfter = await flashbackSourceStorageIntegritySnapshotForRetrace(sourceScopeKey);
        sourceStoragePreserved = compareFlashbackSourceStorageIntegrityForRetrace(sourceStorageBefore, sourceStorageAfter).identical;
      }
      const verified = targetMatches
        && manifest.copyAdoptedComplete === true
        && transferMatches && sourceMatches && expectedMatches && recordsMatch
        && modeMatches && contractMatches && archiveVerified && sourceStoragePreserved;
      return {
        ...base, ok: verified, available: true, attempted: true, adopted: false, verified, durable: verified, records,
        sourcePreserved: sourceStoragePreserved,
        targetScopeKey: text(targetScope.scopeKey || ''), copyAdoptionMode: adoptionMode,
        archiveId: text(manifest?.archiveRef?.archiveId || ''), archiveDigest: text(manifest?.archiveRef?.digest || ''),
        archiveGeneration: Math.max(0, Number(manifest?.archiveRef?.generation || 0) || 0),
        sourceStorageFingerprintBefore: text(sourceStorageBefore?.fingerprint || ''),
        sourceStorageFingerprintAfter: text(sourceStorageAfter?.fingerprint || ''),
        reason: verified ? 'flashback_handoff_storage_readback_verified_non_destructive' : 'flashback_handoff_storage_readback_not_ready',
        diagnostics: { targetMatches, transferMatches, sourceMatches, expectedMatches, recordsMatch, modeMatches, contractMatches, archiveVerified, sourceStoragePreserved }
      };
    } catch (error) {
      return { ...base, reason: 'flashback_handoff_storage_readback_failed', error: text(error?.message || error) };
    }
  };

  const waitForFlashbackSessionHandoffReadback = async (options = {}, timeoutMs = FLASHBACK_LATE_READBACK_TIMEOUT_MS) => {
    const deadline = Date.now() + Math.max(0, Number(timeoutMs || 0) || 0);
    let last = null;
    do {
      last = await verifyFlashbackSessionHandoffFromStorage(options);
      if (last?.verified === true && last?.durable === true) return last;
      if (Date.now() >= deadline) break;
      await delay(300);
    } while (Date.now() <= deadline);
    return last;
  };

  const adoptFlashbackSessionHandoff = async (options = {}) => {
    const targetChatId = text(options.targetChatId || '').trim();
    const transferId = text(options.transferId || '').trim();
    const sourceScopeKey = text(options.sourceScopeKey || '').trim();
    const expectedRecords = Math.max(0, Number(options.expectedRecords || 0) || 0);
    const runtime = activeFlashbackRuntime();
    if (expectedRecords <= 0) {
      return {
        ok: true,
        available: Boolean(runtime),
        attempted: false,
        verified: true,
        adopted: false,
        durable: true,
        sourcePreserved: true,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        sourceMutationAllowed: false,
        sourceCompactionAllowed: false,
        records: 0,
        reason: 'no_flashback_records'
      };
    }

    const capability = await inspectFlashbackNonDestructiveHandoffCapability();
    if (!capability.supported) {
      return {
        ok: false, available: Boolean(runtime) || Runtime.flashbackIpcRegistered, attempted: false,
        verified: false, adopted: false, durable: false, sourcePreserved: true,
        records: 0, expectedRecords,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        requiredCompatibilitySchema: RETRACE_PEER_COMPATIBILITY_SCHEMA,
        pluginVersion: capability.pluginVersion,
        reason: 'flashback_non_destructive_handoff_required',
        diagnostics: capability
      };
    }
    if (!sourceScopeKey) {
      return {
        ok: false, available: true, attempted: false, verified: false, adopted: false, durable: false,
        sourcePreserved: true, records: 0, expectedRecords,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        reason: 'flashback_source_scope_missing'
      };
    }

    let sourceStorageBefore = await flashbackSourceStorageIntegritySnapshotForRetrace(sourceScopeKey);
    const expectedSourceFingerprint = text(options.expectedSourceStorageFingerprint || '').trim();
    if (sourceStorageBefore.legacyCompacted) {
      return {
        ok: false, available: true, attempted: false, verified: false, adopted: false, durable: false,
        sourcePreserved: true, records: 0, expectedRecords,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        sourceStorageFingerprintBefore: sourceStorageBefore.fingerprint,
        reason: 'flashback_source_legacy_compacted_restore_required'
      };
    }
    if (sourceStorageBefore.missingShards > 0) {
      return {
        ok: false, available: true, attempted: false, verified: false, adopted: false, durable: false,
        sourcePreserved: true, records: 0, expectedRecords,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        sourceStorageFingerprintBefore: sourceStorageBefore.fingerprint,
        reason: 'flashback_source_storage_incomplete',
        diagnostics: { missingShards: sourceStorageBefore.missingShards }
      };
    }
    if (expectedSourceFingerprint && expectedSourceFingerprint !== sourceStorageBefore.fingerprint) {
      return {
        ok: false, available: true, attempted: false, verified: false, adopted: false, durable: false,
        sourcePreserved: true, records: 0, expectedRecords,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        sourceStorageFingerprintBefore: sourceStorageBefore.fingerprint,
        expectedSourceStorageFingerprint: expectedSourceFingerprint,
        reason: 'flashback_source_changed_before_owner_adoption'
      };
    }

    let last = null;
    const defaultAttempts = typeof runtime?.adopt === 'function' ? 8 : 2;
    const attempts = Math.max(1, Math.min(10, Number(options.attempts || defaultAttempts) || defaultAttempts));
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const request = {
        targetChatId, transferId, sourceScopeKey, expectedRecords,
        requiredHandoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        requireSourcePreservation: true,
        allowSourceMutation: false,
        allowSourceCompaction: false,
        sourceStorageFingerprint: sourceStorageBefore.fingerprint
      };
      try {
        let transport = '';
        try {
          // Prefer the authenticated owner IPC because patched owners attach
          // Memory Suite mirror/server synchronization proof to the receipt.
          last = await requestFlashbackIpc('adopt_session_handoff', request, {
            timeoutMs: Math.max(5000, Math.min(FLASHBACK_IPC_TIMEOUT_MAX_MS, Number(options.ipcTimeoutMs || FLASHBACK_ADOPT_TIMEOUT_MS) || FLASHBACK_ADOPT_TIMEOUT_MS))
          });
          transport = 'risu_plugin_ipc';
        } catch (ipcError) {
          if (typeof runtime?.adopt !== 'function') throw ipcError;
          last = await runtime.adopt(request);
          transport = 'same_realm_runtime';
        }
        const strictReceipt = text(last?.schema || '') === 'flashback_memory.session_handoff_adoption.v4';
        const identityMatches = text(last?.targetChatId || '') === targetChatId
          && text(last?.transferId || '') === transferId
          && text(last?.sourceScopeKey || '') === sourceScopeKey
          && Number(last?.records || 0) === expectedRecords
          && Number(last?.expectedRecords || 0) === expectedRecords;
        const ownerMatches = transport !== 'risu_plugin_ipc' || (
          text(last?.mutation || '') === 'adopt_session_handoff'
          && text(last?.ownerPluginId || '') === FLASHBACK_PLUGIN_ID
          && text(last?.authorizedRequester || '') === 'flashback_hayaku_bridge'
        );
        const preservationReceipt = text(last?.schema || '') === FLASHBACK_HANDOFF_RECEIPT_SCHEMA
          && sourcePreservationReceiptMatches(last, RETRACE_PEER_REQUIREMENTS.flashback, { physicalField: 'physicalCopies' })
          && memorySuiteStorageReceiptMatches(last, 'flashback')
          && Number(last?.compactedSourceRecords || 0) === 0;
        const sourceStorageAfter = await flashbackSourceStorageIntegritySnapshotForRetrace(sourceScopeKey);
        const sourceStorageComparison = compareFlashbackSourceStorageIntegrityForRetrace(sourceStorageBefore, sourceStorageAfter);
        if (!sourceStorageComparison.identical) {
          return {
            ...(last && typeof last === 'object' ? last : {}),
            ok: false, available: true, attempted: true, attempts: attempt,
            verified: false, durable: false, sourcePreserved: false,
            reason: 'SOURCE_MUTATION_DETECTED',
            sourceStorageFingerprintBefore: sourceStorageBefore.fingerprint,
            sourceStorageFingerprintAfter: sourceStorageAfter.fingerprint,
            diagnostics: { changed: sourceStorageComparison.changed }
          };
        }
        const receiptMatches = strictReceipt
          && last?.verified === true
          && last?.durable === true
          && identityMatches
          && ownerMatches
          && preservationReceipt;
        if (receiptMatches) {
          return {
            ...last,
            ok: true,
            available: true,
            attempted: true,
            attempts: attempt,
            verified: true,
            durable: true,
            sourcePreserved: true,
            transport,
            sourceStorageFingerprintBefore: sourceStorageBefore.fingerprint,
            sourceStorageFingerprintAfter: sourceStorageAfter.fingerprint
          };
        }
        const readback = await waitForFlashbackSessionHandoffReadback({
          ...request,
          sourceStorageIntegrityBefore: sourceStorageBefore
        }, Math.min(1800, FLASHBACK_LATE_READBACK_TIMEOUT_MS));
        if (readback?.verified === true && readback?.durable === true && readback?.sourcePreserved === true) {
          return { ...readback, ok: true, attempted: true, attempts: attempt, transport: readback.transport || 'plugin_storage_readback_after_ipc' };
        }
      } catch (error) {
        last = {
          ok: false,
          verified: false,
          durable: false,
          sourcePreserved: true,
          reason: text(error?.code || error?.message || error) || 'flashback_adoption_failed',
          error: text(error?.message || error)
        };
        if (['FLASHBACK_IPC_TIMEOUT', 'FLASHBACK_IPC_UNAVAILABLE'].includes(text(error?.code || ''))) {
          const readback = await waitForFlashbackSessionHandoffReadback({
            targetChatId, transferId, sourceScopeKey, expectedRecords,
            sourceStorageIntegrityBefore: sourceStorageBefore
          }, FLASHBACK_LATE_READBACK_TIMEOUT_MS);
          if (readback?.verified === true && readback?.durable === true && readback?.sourcePreserved === true) {
            return { ...readback, ok: true, attempted: true, attempts: attempt, transport: 'plugin_storage_readback_after_ipc_timeout' };
          }
        }
      }
      if (attempt < attempts) await delay(Math.min(900, 250 * attempt));
    }
    const sourceStorageAfter = await flashbackSourceStorageIntegritySnapshotForRetrace(sourceScopeKey).catch(() => null);
    const sourceStorageComparison = sourceStorageAfter
      ? compareFlashbackSourceStorageIntegrityForRetrace(sourceStorageBefore, sourceStorageAfter)
      : { identical: false, changed: ['source_readback_failed'] };
    return {
      ...(last && typeof last === 'object' ? last : {}),
      ok: false,
      available: Boolean(runtime) || Runtime.flashbackIpcRegistered,
      attempted: true,
      attempts,
      verified: false,
      adopted: false,
      durable: false,
      sourcePreserved: sourceStorageComparison.identical,
      records: Math.max(0, Number(last?.records || 0) || 0),
      handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
      sourceStorageFingerprintBefore: sourceStorageBefore.fingerprint,
      sourceStorageFingerprintAfter: text(sourceStorageAfter?.fingerprint || ''),
      reason: text(last?.reason || 'flashback_adoption_not_verified'),
      diagnostics: { sourceChanged: sourceStorageComparison.changed }
    };
  };

  const flashbackSourceFromInspection = (inspected, identity, readSource) => {
    if (readSource === 'flashback_plugin_ipc'
      && inspected?.schema !== 'flashback_memory_ledger_inspection_v1') return null;
    const sourceScope = inspected?.scope && typeof inspected.scope === 'object'
      ? inspected.scope
      : null;
    const scopeMatches = sourceScope?.scopeKey
      && (!identity.chatId || !sourceScope.chatId || text(sourceScope.chatId).trim() === identity.chatId);
    if (!scopeMatches) return null;
    const manifest = inspected?.manifest && typeof inspected.manifest === 'object'
      ? inspected.manifest
      : {};
    const recordsIncluded = inspected?.recordsIncluded !== false;
    const runtimeItems = !recordsIncluded
      ? null
      : Array.isArray(inspected?.records)
        ? inspected.records.filter(record => record && typeof record === 'object' && !Array.isArray(record))
        : null;
    const canonicalRecords = Math.max(
      0,
      Number(manifest.count ?? manifest.expectedCount ?? manifest.stats?.recordTotal ?? runtimeItems?.length ?? 0) || 0
    );
    const shards = Math.max(0, Number(manifest.shardCount || 0) || 0);
    const missingShards = Math.max(0, Number(manifest.missingShards || 0) || 0);
    const corruptShards = Math.max(0, Number(manifest.corruptShards || 0) || 0);
    const recordCountMismatch = manifest.recordCountMismatch === true
      || (runtimeItems != null && runtimeItems.length !== canonicalRecords);
    const manifestCorrupt = manifest.manifestCorrupt === true;
    const archiveVerified = manifest.archiveVerified !== false;
    const integrityOk = !manifestCorrupt && archiveVerified && missingShards === 0 && corruptShards === 0 && !recordCountMismatch;
    return {
      available: canonicalRecords > 0 && integrityOk,
      reason: !integrityOk ? 'partial' : canonicalRecords > 0 ? 'loaded' : 'empty',
      records: canonicalRecords,
      shards,
      sourceScope,
      manifest,
      manifestKey: '',
      readSource,
      recordsIncluded,
      ...(runtimeItems == null ? {} : { runtimeItems }),
      runtimeStats: inspected?.stats && typeof inspected.stats === 'object' ? inspected.stats : null,
      pluginVersion: text(inspected?.version || inspected?.pluginVersion || ''),
      capabilities: inspected?.capabilities && typeof inspected.capabilities === 'object' ? clone(inspected.capabilities, {}) : {},
      missingShards,
      corruptShards,
      recordCountMismatch,
      manifestCorrupt,
      archiveVerified,
      archiveReason: text(manifest.archiveReason || ''),
      integrityOk
    };
  };


  const flashbackArchiveRefPointerForRetrace = value => {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const archiveId = text(source.archiveId || '').trim();
    const archiveScopeKey = text(source.archiveScopeKey || '').trim();
    if (!archiveId || !archiveScopeKey) return null;
    return {
      schema: text(source.schema || FLASHBACK_ARCHIVE_REF_SCHEMA),
      archiveId,
      archiveScopeKey,
      generation: Math.max(1, Number(source.generation || 1) || 1),
      depth: Math.max(1, Number(source.depth || 1) || 1),
      deltaCount: Math.max(0, Number(source.deltaCount ?? source.recordCount ?? 0) || 0),
      recordCount: Math.max(0, Number(source.recordCount || 0) || 0),
      digest: text(source.digest || '').trim(),
      responseTurnMax: Math.max(0, Number(source.responseTurnMax || 0) || 0),
      createdAt: text(source.createdAt || ''),
      updatedAt: text(source.updatedAt || '')
    };
  };

  const normalizeFlashbackArchiveRefForRetrace = value => {
    const pointer = flashbackArchiveRefPointerForRetrace(value);
    if (!pointer) return null;
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return { ...pointer, parentRef: flashbackArchiveRefPointerForRetrace(source.parentRef || source.parentArchiveRef) };
  };

  // Summary inspection traverses only immutable layer manifests. It never opens
  // record shards or embedding vectors, so RE:TRACE does not recreate the OOM peak
  // that the shared-archive contract is intended to remove.
  const readFlashbackArchiveLayerMetas = async archiveRefValue => {
    const head = normalizeFlashbackArchiveRefForRetrace(archiveRefValue);
    if (!head) return { archiveRef: null, layers: [], records: 0, shards: 0, verified: true, reason: 'archive_ref_absent', memberIds: [] };
    const seen = new Set();
    const memberSet = new Set();
    const layers = [];
    let cursor = head;
    let reason = '';
    while (cursor && layers.length < FLASHBACK_ARCHIVE_MAX_DEPTH) {
      if (seen.has(cursor.archiveScopeKey)) { reason = 'archive_cycle'; break; }
      seen.add(cursor.archiveScopeKey);
      const manifestKey = `${FLASHBACK_SCOPE_PREFIX}${flashbackKeyHash(cursor.archiveScopeKey)}:manifest:v2`;
      const manifest = parseJson(await storageGet(manifestKey), null);
      if (!manifest
        || text(manifest.scopeKey || '') !== cursor.archiveScopeKey
        || manifest.archiveOwner !== true
        || text(manifest.archiveId || '') !== cursor.archiveId) {
        reason = 'archive_layer_missing_or_invalid';
        break;
      }
      const deltaCount = Math.max(0, Number(manifest.count ?? manifest.archiveDeltaCount ?? 0) || 0);
      const cumulativeCount = Math.max(0, Number(manifest.archiveRecordCount ?? cursor.recordCount ?? 0) || 0);
      const deltaMemberIds = Array.from(new Set((Array.isArray(manifest.archiveDeltaMemberIds) ? manifest.archiveDeltaMemberIds : [])
        .map(value => text(value || '').trim()).filter(Boolean))).sort();
      const deltaDigest = flashbackKeyHash(deltaMemberIds.join('\u0001'));
      const deltaCountMatches = deltaCount === Math.max(0, Number(cursor.deltaCount ?? deltaCount) || 0)
        && Number(manifest.archiveDeltaCount || 0) === deltaCount
        && Number(manifest.archiveMemberCatalogVersion || 0) >= 1
        && deltaMemberIds.length === deltaCount
        && text(manifest.archiveDeltaDigest || '') === deltaDigest;
      const cumulativeMatches = cumulativeCount === cursor.recordCount
        && (!manifest.archiveDigest || !cursor.digest || text(manifest.archiveDigest || '') === cursor.digest)
        && (!manifest.archiveGeneration || Number(manifest.archiveGeneration || 0) === cursor.generation);
      if (!deltaCountMatches || !cumulativeMatches || manifest.manifestCorrupt === true) {
        reason = !deltaCountMatches ? 'archive_delta_catalog_mismatch' : 'archive_layer_manifest_mismatch';
        break;
      }
      for (const memberId of deltaMemberIds) {
        if (memberSet.has(memberId)) { reason = 'archive_member_duplicate'; break; }
        memberSet.add(memberId);
      }
      if (reason) break;
      layers.push({ ref: cursor, manifest, manifestKey, scopeKey: cursor.archiveScopeKey, deltaCount, memberIds: deltaMemberIds });
      cursor = normalizeFlashbackArchiveRefForRetrace(cursor.parentRef || manifest.parentArchiveRef);
    }
    if (!reason && cursor) reason = 'archive_depth_exceeded';
    const memberIds = Array.from(memberSet).sort();
    const records = memberIds.length;
    const digest = flashbackKeyHash(memberIds.join('\u0001'));
    const shards = layers.reduce((sum, layer) => sum + Math.max(0, Number(layer.manifest?.shardCount || 0) || 0), 0);
    const depthMatches = !head.depth || layers.length === head.depth;
    const verified = !reason && records === head.recordCount && digest === head.digest && depthMatches;
    return {
      archiveRef: head,
      layers,
      records,
      shards,
      memberIds,
      digest,
      verified,
      reason: verified ? 'archive_chain_verified' : reason || (records !== head.recordCount ? 'archive_record_count_mismatch' : digest !== head.digest ? 'archive_digest_mismatch' : 'archive_depth_mismatch')
    };
  };

  const requestFlashbackLedgerInspection = async includeRecords => {
    if (includeRecords) {
      return await requestFlashbackIpc('inspect', { includeRecords: true }, { timeoutMs: FLASHBACK_INSPECT_RECORDS_TIMEOUT_MS });
    }
    if (Runtime.flashbackInspectSummaryPromise) return await Runtime.flashbackInspectSummaryPromise;
    const task = requestFlashbackIpc('inspect', { includeRecords: false }, { timeoutMs: FLASHBACK_INSPECT_SUMMARY_TIMEOUT_MS });
    Runtime.flashbackInspectSummaryPromise = task;
    try { return await task; }
    finally {
      if (Runtime.flashbackInspectSummaryPromise === task) Runtime.flashbackInspectSummaryPromise = null;
    }
  };

  const readFlashbackSource = async (context, options = {}) => {
    const identity = contextIdentity(context);
    const includeRecords = options?.includeRecords !== false;
    const runtime = activeFlashbackRuntime();
    const skipRuntime = options?.skipRuntime === true;
    const skipIpc = options?.skipIpc === true;
    if (runtime && !skipRuntime) {
      try {
        const inspected = await runtime.inspect(null, { includeRecords });
        const normalized = flashbackSourceFromInspection(inspected, identity, 'flashback_runtime_api');
        if (normalized && (!includeRecords || Array.isArray(normalized.runtimeItems))) return normalized;
        warn('Flashback runtime ledger scope or record payload mismatch; trying IPC/pluginStorage', {
          expectedChatId: identity.chatId,
          runtimeChatId: text(inspected?.scope?.chatId || ''),
          runtimeScopeKey: text(inspected?.scope?.scopeKey || ''),
          recordsIncluded: inspected?.recordsIncluded === true
        });
      } catch (error) {
        warn('Flashback runtime ledger inspection failed', error);
      }
    }

    const summaryInspectCircuitOpen = !includeRecords
      && Runtime.flashbackInspectCircuitUntil > Date.now();
    if (summaryInspectCircuitOpen) {
      Runtime.flashbackInspectFallbackCount += 1;
      Runtime.flashbackInspectLastFallbackAt = Date.now();
      Runtime.flashbackInspectLastFallbackReason = 'summary_ipc_circuit_open';
    }
    if (!skipIpc && !summaryInspectCircuitOpen) try {
      const inspected = await requestFlashbackLedgerInspection(includeRecords);
      const normalized = flashbackSourceFromInspection(inspected, identity, 'flashback_plugin_ipc');
      if (normalized && (!includeRecords || Array.isArray(normalized.runtimeItems))) return normalized;
      warn('Flashback IPC ledger scope or requested record payload unavailable; falling back to pluginStorage', {
        expectedChatId: identity.chatId,
        ipcChatId: text(inspected?.scope?.chatId || ''),
        ipcScopeKey: text(inspected?.scope?.scopeKey || ''),
        recordsIncluded: inspected?.recordsIncluded === true
      });
    } catch (error) {
      const code = text(error?.code || '');
      if (!includeRecords && code === 'FLASHBACK_IPC_TIMEOUT') {
        const nowAt = Date.now();
        Runtime.flashbackInspectCircuitUntil = nowAt + FLASHBACK_INSPECT_SUMMARY_CIRCUIT_MS;
        Runtime.flashbackInspectCircuitTrips += 1;
        Runtime.flashbackInspectFallbackCount += 1;
        Runtime.flashbackInspectLastFallbackAt = nowAt;
        Runtime.flashbackInspectLastFallbackReason = 'summary_ipc_timeout';
        Runtime.warnings.push({
          at: nowAt,
          message: 'Flashback IPC summary timed out; pluginStorage fallback circuit opened',
          detail: compact(error?.message || error || '', 240)
        });
        Runtime.warnings = Runtime.warnings.slice(-30);
      } else if (code !== 'FLASHBACK_IPC_UNAVAILABLE') {
        warn('Flashback IPC ledger inspection unavailable; using pluginStorage fallback', error);
      }
    }

    const registry = parseJson(await storageGet(FLASHBACK_REGISTRY_KEY), { scopes: [] });
    const scopes = Array.isArray(registry?.scopes) ? registry.scopes : [];
    const candidates = scopes.filter(scope => text(scope?.chatId || '').trim() === identity.chatId)
      .map(scope => ({
        scope,
        actorScore: (
          identity.personaId && text(scope?.personaId || '').trim() === identity.personaId ? 4 : 0
        ) + (
          identity.characterId && text(scope?.characterId || '').trim() === identity.characterId ? 2 : 0
        )
      }))
      .sort((a, b) => b.actorScore - a.actorScore || Number(b.scope?.seenAt || 0) - Number(a.scope?.seenAt || 0));
    const sourceScope = candidates[0]?.scope || null;
    if (!sourceScope?.scopeKey) {
      return { available: false, reason: 'scope_not_registered', records: 0, shards: 0, sourceScope: null, recordsIncluded: false, readSource: 'plugin_storage_fallback' };
    }
    const manifestKey = `${FLASHBACK_SCOPE_PREFIX}${flashbackKeyHash(sourceScope.scopeKey)}:manifest:v2`;
    const manifest = parseJson(await storageGet(manifestKey), null);
    if (!manifest || text(manifest.scopeKey || '') !== text(sourceScope.scopeKey)) {
      return { available: false, reason: 'manifest_not_found', records: 0, shards: 0, sourceScope, manifest: null, recordsIncluded: false, readSource: 'plugin_storage_fallback' };
    }
    const archiveRef = normalizeFlashbackArchiveRefForRetrace(manifest.archiveRef);
    const archiveState = await readFlashbackArchiveLayerMetas(archiveRef);
    const localRecords = Math.max(0, Number(manifest.count || manifest.stats?.recordTotal || 0) || 0);
    const archiveRecords = Math.max(0, Number(archiveState.records || 0) || 0);
    const records = localRecords + archiveRecords;
    const shards = Math.max(0, Number(manifest.shardCount || 0) || 0) + Math.max(0, Number(archiveState.shards || 0) || 0);
    const archiveIntegrityOk = !archiveRef || archiveState.verified === true;
    const integrityOk = manifest.manifestCorrupt !== true && archiveIntegrityOk;
    return {
      available: records > 0 && integrityOk,
      reason: !integrityOk ? 'partial' : records > 0 ? 'loaded' : 'empty',
      records,
      shards,
      sourceScope,
      manifest: {
        ...manifest,
        count: records,
        localCount: localRecords,
        archiveCount: archiveRecords,
        archiveRef,
        archiveVerified: archiveIntegrityOk,
        archiveReason: archiveState.reason
      },
      manifestKey,
      archiveLayers: archiveState.layers,
      archiveVerified: archiveIntegrityOk,
      archiveReason: archiveState.reason,
      recordsIncluded: false,
      readSource: 'plugin_storage_fallback',
      integrityOk
    };
  };

  const flashbackShardStorageKey = (scopeKey, manifest, shardIndex) => {
    const prefix = `${FLASHBACK_SCOPE_PREFIX}${flashbackKeyHash(scopeKey)}`;
    const suffix = String(shardIndex).padStart(4, '0');
    const commitId = text(manifest?.commitId || '').trim();
    return commitId
      ? `${prefix}:records:commit:${commitId}:shard:${suffix}`
      : `${prefix}:records:shard:${suffix}`;
  };

  const flashbackLegacyShardStorageKey = (scopeKey, shardIndex) => {
    const prefix = `${FLASHBACK_SCOPE_PREFIX}${flashbackKeyHash(scopeKey)}`;
    return `${prefix}:records:shard:${String(shardIndex).padStart(4, '0')}`;
  };

  // Flashback의 safeStringify는 2칸 들여쓰기를 사용한다. checksum은 저장 당시의
  // 직렬화 형식까지 포함하므로 compact JSON으로 계산하면 정상 shard도 손상으로 오인된다.
  const flashbackShardChecksum = records => flashbackKeyHash(JSON.stringify(Array.isArray(records) ? records : [], null, 2));

  const readFlashbackShard = async (scopeKey, manifest, shardIndex) => {
    let storageKey = flashbackShardStorageKey(scopeKey, manifest, shardIndex);
    let raw = await storageGet(storageKey);
    let fallback = false;
    const commitId = text(manifest?.commitId || '').trim();
    if ((raw == null || raw === '') && commitId) {
      const fallbackKey = flashbackLegacyShardStorageKey(scopeKey, shardIndex);
      const fallbackRaw = await storageGet(fallbackKey);
      const fallbackDecoded = await decodeFlashbackShardPayloadForRetrace(fallbackRaw);
      const fallbackParsed = fallbackDecoded.parsed;
      if (fallbackParsed && typeof fallbackParsed === 'object' && !Array.isArray(fallbackParsed)
        && text(fallbackParsed.commitId || '') === commitId) {
        storageKey = fallbackKey;
        raw = fallbackRaw;
        fallback = true;
      }
    }
    if (raw == null || raw === '') return { storageKey, shardIndex, records: [], missing: true, corrupt: false };
    const decoded = await decodeFlashbackShardPayloadForRetrace(raw);
    const parsed = decoded.parsed;
    const objectPayload = parsed && typeof parsed === 'object' && !Array.isArray(parsed);
    const records = objectPayload && Array.isArray(parsed.records)
      ? parsed.records
      : Array.isArray(parsed)
        ? parsed
        : null;
    const validEnvelope = Array.isArray(records)
      && records.every(record => record && typeof record === 'object' && !Array.isArray(record))
      && (!commitId || (objectPayload && text(parsed.commitId || '') === commitId))
      && (!objectPayload || !parsed.scopeKey || text(parsed.scopeKey) === text(scopeKey))
      && (!objectPayload || parsed.shard == null || Number(parsed.shard) === Number(shardIndex));
    const checksumValid = !objectPayload || !parsed.checksum
      || text(parsed.checksum) === flashbackShardChecksum(records || []);
    const expectedSummary = Array.isArray(manifest?.shardSummaries)
      ? manifest.shardSummaries.find((item, index) => Number(item?.shardIndex ?? index) === Number(shardIndex))
      : null;
    const countValid = !expectedSummary || !Number.isFinite(Number(expectedSummary.recordCount))
      || records.length === Number(expectedSummary.recordCount);
    const corrupt = !validEnvelope || !checksumValid || !countValid;
    return {
      storageKey,
      shardIndex,
      records: corrupt ? [] : records,
      missing: corrupt,
      corrupt,
      fallback,
      compressed: decoded.compressed === true,
      decodeReason: decoded.reason || '',
      checksumValid,
      countValid
    };
  };

  const summarizeFlashbackRecords = items => {
    const stats = {
      byType: {},
      chars: 0,
      tokens: 0,
      inherited: 0,
      vectorRecords: 0
    };
    for (const record of items || []) {
      const type = text(record.sourceType || record.type || 'unknown').trim() || 'unknown';
      stats.byType[type] = Number(stats.byType[type] || 0) + 1;
      stats.chars += text(record.text || '').length;
      stats.tokens += Math.max(0, Number(record.tokenEstimate || 0) || 0);
      if (record.inheritedSessionHistory === true
        || isPermanentSessionHistory(record)
        || text(record.inheritedFromScopeKey || record.clonedFromScopeKey || '').trim()) stats.inherited += 1;
      if (Array.isArray(record.vector) && record.vector.length) stats.vectorRecords += 1;
    }
    return stats;
  };

  const readFlashbackViewer = async context => {
    const source = await readFlashbackSource(context, { includeRecords: false });
    if (!source.sourceScope?.scopeKey || !source.manifest) {
      return { ...source, items: [], loadedRecords: Math.max(0, Number(source.records || 0) || 0), viewerLoadedRecords: 0, missingShards: 0, corruptShards: 0, stats: source.runtimeStats || { byType: {} } };
    }
    const localScopeKey = source.sourceScope.scopeKey;
    const localManifest = source.manifest;
    const archiveRef = normalizeFlashbackArchiveRefForRetrace(localManifest.archiveRef);
    const archiveState = await readFlashbackArchiveLayerMetas(archiveRef);
    const physicalScopes = [{
      scopeKey: localScopeKey,
      manifest: { ...localManifest, count: Number(localManifest.localCount ?? localManifest.count ?? 0) || 0 },
      kind: 'local'
    }];
    // readFlashbackArchiveLayerMetas is head -> parent. This is also newest -> oldest.
    for (const layer of archiveState.layers || []) {
      physicalScopes.push({
        scopeKey: layer.scopeKey || layer.ref?.archiveScopeKey || '',
        manifest: layer.manifest || null,
        kind: 'archive_layer',
        archiveId: layer.ref?.archiveId || ''
      });
    }
    const limit = FLASHBACK_VIEWER_MAX_RENDERED_RECORDS;
    const byId = new Map();
    const sampledShards = [];
    let missingShards = 0;
    let corruptShards = 0;
    let compressedShards = 0;
    let totalPhysicalShards = 0;
    for (const physical of physicalScopes) totalPhysicalShards += Math.max(0, Math.min(2048, Number(physical.manifest?.shardCount || 0) || 0));
    for (const physical of physicalScopes) {
      if (byId.size >= limit) break;
      if (!physical.manifest) continue;
      const shardCount = Math.max(0, Math.min(2048, Number(physical.manifest.shardCount || 0) || 0));
      for (let shardIndex = shardCount - 1; shardIndex >= 0 && byId.size < limit; shardIndex -= 1) {
        const shard = await readFlashbackShard(physical.scopeKey, physical.manifest, shardIndex);
        sampledShards.push({ ...shard, scopeKey: physical.scopeKey, kind: physical.kind });
        if (shard.missing) {
          missingShards += 1;
          if (shard.corrupt) corruptShards += 1;
          continue;
        }
        if (shard.compressed) compressedShards += 1;
        // Newer records in the shard win. Local scope is scanned before archive layers,
        // so a repaired current-session alias also wins over its historical predecessor.
        for (const record of shard.records.slice().reverse()) {
          const identity = text(record?.permanentHistoryId || record?.id || record?.recordId || record?.sourceHash || '')
            || flashbackKeyHash(JSON.stringify(record || {}));
          if (!identity || byId.has(identity)) continue;
          byId.set(identity, record);
          if (byId.size >= limit) break;
        }
      }
    }
    const items = Array.from(byId.values()).sort(compareFlashbackTimelineRecords);
    const totalRecords = Math.max(0, Number(source.records ?? localManifest.count ?? 0) || 0);
    const manifestCorrupt = source.manifestCorrupt === true || localManifest.manifestCorrupt === true;
    const partial = manifestCorrupt || source.archiveVerified === false || corruptShards > 0;
    const stats = source.runtimeStats || localManifest.stats || summarizeFlashbackRecords(items);
    return {
      ...source,
      manifest: localManifest,
      available: totalRecords > 0 && !partial,
      reason: partial ? 'partial' : totalRecords > 0 ? 'loaded' : 'empty',
      items,
      loadedRecords: totalRecords,
      viewerLoadedRecords: items.length,
      manifestRecords: totalRecords,
      missingShards,
      corruptShards,
      recordCountMismatch: source.recordCountMismatch === true,
      manifestCorrupt,
      integrityOk: !partial && source.recordCountMismatch !== true,
      shardCount: totalPhysicalShards,
      viewerScannedShards: sampledShards.length,
      viewerCompressedShards: compressedShards,
      viewerLimited: totalRecords > items.length,
      viewerReadMode: 'latest_shards_only',
      shards: sampledShards.map(({ storageKey, shardIndex, missing, corrupt, fallback, compressed, scopeKey, kind }) => ({ storageKey, shardIndex, missing, corrupt, fallback, compressed, scopeKey, kind })),
      stats
    };
  };

  const hayakuScopeFor = context => {
    const characterId = text(context?.character?.chaId || '').trim();
    const chatId = text(context?.chat?.id || '').trim();
    if (!characterId || !chatId) return { available: false, reason: 'ids_missing' };
    const scopeKey = `chat_${stableHash64(`${characterId}\n${chatId}`)}`;
    return { available: true, scopeKey, storageKey: `${HAYAKU_LEDGER_PREFIX}${scopeKey}` };
  };
  const hayakuRecordSlotId = record => {
    const direct = text(record?.slotId || '').trim();
    if (direct) return direct;
    const packetType = text(record?.packetType || 'current_snapshot').trim();
    if (record?.inheritedSessionHistory === true || record?.memoryClass === 'historical') {
      const permanentHistoryId = text(record?.permanentHistoryId || '').trim();
      if (permanentHistoryId) return ['historical_permanent', permanentHistoryId, packetType].join('\u0001');
      return [
        'historical',
        text(record?.coldStartEpochId || record?.inheritedFromScopeKey || 'session').trim(),
        Math.max(0, Number(record?.historicalOrdinal || 0) || 0),
        packetType
      ].join('\u0001');
    }
    const incrementalRecoveryId = text(record?.incrementalRecoveryId || '').trim();
    if (incrementalRecoveryId) {
      return [
        'incremental_recovery',
        text(record?.ownerTurnNodeId || record?.ownerNodeId || `pair:${Math.max(1, Number(record?.targetPairIndex || 1) || 1)}`).trim(),
        incrementalRecoveryId,
        packetType
      ].join('\u0001');
    }
    const ownerTurnNodeId = text(record?.ownerTurnNodeId || record?.ownerNodeId || '').trim();
    if (ownerTurnNodeId) return ['node', ownerTurnNodeId, packetType].join('\u0001');
    const requestNonce = text(record?.requestNonce || '').trim();
    if (requestNonce) return ['pending', requestNonce, packetType].join('\u0001');
    return [
      'pair',
      Math.max(1, Number(record?.targetPairIndex || 1) || 1),
      text(record?.userHash || record?.userMessageIdHash || '').trim(),
      packetType
    ].join('\u0001');
  };
  const hayakuTombstoneSuppressesRecord = (record, tombstone) => {
    if (!record || !tombstone || tombstone?.active === false || Number(tombstone?.restoredAt || 0) > 0) return false;
    if (text(tombstone?.slotId || '').trim() !== hayakuRecordSlotId(record)) return false;
    const tombstoneRecordId = text(tombstone?.recordId || '').trim();
    const tombstoneVariantHash = text(tombstone?.variantHash || '').trim();
    const recordId = text(record?.recordId || '').trim();
    const recordHash = text(record?.hash || '').trim();
    if (!tombstoneRecordId && !tombstoneVariantHash) return true;
    if (tombstoneRecordId && tombstoneRecordId === recordId) return true;
    if (tombstoneVariantHash && tombstoneVariantHash === recordHash) return true;
    return false;
  };
  const activeHayakuLedgerTombstones = ledger => (
    Array.isArray(ledger?.tombstones) ? ledger.tombstones : []
  ).filter(tombstone => (
    tombstone
    && typeof tombstone === 'object'
    && tombstone.active !== false
    && !(Number(tombstone.restoredAt || 0) > 0)
    && text(tombstone.slotId || '').trim()
  ));
  const effectiveHayakuRecords = ledger => {
    const records = Array.isArray(ledger?.records)
      ? ledger.records.filter(record => record && typeof record === 'object' && text(record.raw || '').trim())
      : [];
    const heads = Array.isArray(ledger?.slotHeads) ? ledger.slotHeads.filter(Boolean) : [];
    const tombstones = new Map((Array.isArray(ledger?.tombstones) ? ledger.tombstones : [])
      .filter(value => value?.active !== false && !(Number(value?.restoredAt || 0) > 0) && text(value?.slotId || '').trim())
      .map(value => [text(value.slotId).trim(), value]));
    const suppressed = record => {
      const tombstone = tombstones.get(hayakuRecordSlotId(record));
      return hayakuTombstoneSuppressesRecord(record, tombstone);
    };
    if (!heads.length) {
      return records.filter(record => (
        !['quarantined', 'superseded', 'orphaned', 'detached', 'tombstoned'].includes(text(record.recordState || '').trim())
        && !suppressed(record)
      )).sort(compareHayakuTimelineRecords);
    }
    const byId = new Map(records.map(record => [text(record.recordId || '').trim(), record]));
    const byHash = new Map(records.map(record => [text(record.hash || '').trim(), record]));
    return heads
      .filter(head => ['active', 'historical', 'unbound'].includes(text(head?.state || '').trim()))
      .map(head => byId.get(text(head?.selectedRecordId || '').trim())
        || byHash.get(text(head?.selectedVariantHash || '').trim())
        || null)
      .filter(record => record && !suppressed(record))
      .sort(compareHayakuTimelineRecords);
  };

  const hayakuArchiveRecordIdentityForRetrace = record => text(record?.permanentHistoryId || record?.archiveCanonicalId || '').trim()
    || stableHash64([
      text(record?.inheritedFromScopeKey || '').trim(),
      hayakuRecordSlotId(record),
      text(record?.hash || '').trim(),
      text(record?.packetType || '').trim()
    ].join('\u0001'));

  const hayakuArchiveRefPointerForRetrace = value => {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const archiveId = text(source.archiveId || '').trim();
    const storageKey = text(source.storageKey || '').trim();
    if (!archiveId || !storageKey) return null;
    return {
      schema: text(source.schema || HAYAKU_ARCHIVE_REF_SCHEMA),
      archiveId,
      storageKey,
      metaKey: text(source.metaKey || `${HAYAKU_ARCHIVE_META_KEY_PREFIX}${archiveId}`).trim(),
      generation: Math.max(1, Number(source.generation || 1) || 1),
      depth: Math.max(1, Number(source.depth || 1) || 1),
      deltaCount: Math.max(0, Number(source.deltaCount ?? source.recordCount ?? 0) || 0),
      recordCount: Math.max(0, Number(source.recordCount || 0) || 0),
      localOverlapCount: Math.max(0, Number(source.localOverlapCount || 0) || 0),
      digest: text(source.digest || '').trim(),
      createdAt: Math.max(0, Number(source.createdAt || 0) || 0),
      updatedAt: Math.max(0, Number(source.updatedAt || 0) || 0)
    };
  };

  const normalizeHayakuArchiveRefForRetrace = value => {
    const pointer = hayakuArchiveRefPointerForRetrace(value);
    if (!pointer) return null;
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return { ...pointer, parentRef: hayakuArchiveRefPointerForRetrace(source.parentRef || source.parentArchiveRef) };
  };

  const readHayakuArchiveLayerMetas = async archiveRefValue => {
    const head = normalizeHayakuArchiveRefForRetrace(archiveRefValue);
    if (!head) return { archiveRef: null, layers: [], records: 0, memberIds: [], verified: true, reason: 'archive_ref_absent' };
    const seen = new Set();
    const memberSet = new Set();
    const layers = [];
    let cursor = head;
    let reason = '';
    while (cursor && layers.length < HAYAKU_ARCHIVE_MAX_DEPTH) {
      if (seen.has(cursor.metaKey)) { reason = 'archive_cycle'; break; }
      seen.add(cursor.metaKey);
      const meta = parseJson(await storageGet(cursor.metaKey), null);
      if (!meta || meta.schema !== HAYAKU_ARCHIVE_META_SCHEMA || text(meta.archiveId || '') !== cursor.archiveId) {
        reason = 'archive_meta_missing_or_invalid';
        break;
      }
      const deltaMemberIds = Array.from(new Set((Array.isArray(meta.deltaMemberIds) ? meta.deltaMemberIds : [])
        .map(value => text(value || '').trim()).filter(Boolean))).sort();
      const deltaDigest = stableHash64(deltaMemberIds.join('\u0001'));
      const deltaCount = Math.max(0, Number(meta.deltaCount || 0) || 0);
      if (deltaMemberIds.length !== deltaCount
        || deltaCount !== cursor.deltaCount
        || deltaDigest !== text(meta.deltaDigest || '')) {
        reason = 'archive_meta_delta_mismatch';
        break;
      }
      for (const memberId of deltaMemberIds) {
        if (memberSet.has(memberId)) { reason = 'archive_member_duplicate'; break; }
        memberSet.add(memberId);
      }
      if (reason) break;
      layers.push({ ref: cursor, meta, memberIds: deltaMemberIds });
      cursor = normalizeHayakuArchiveRefForRetrace(cursor.parentRef || meta.parentRef || meta.parentArchiveRef);
    }
    if (!reason && cursor) reason = 'archive_depth_exceeded';
    const memberIds = Array.from(memberSet).sort();
    const digest = stableHash64(memberIds.join('\u0001'));
    const depthMatches = !head.depth || layers.length === head.depth;
    const verified = !reason && memberIds.length === head.recordCount && digest === head.digest && depthMatches;
    return {
      archiveRef: head,
      layers,
      records: memberIds.length,
      memberIds,
      digest,
      verified,
      reason: verified ? 'archive_meta_chain_verified' : reason || (memberIds.length !== head.recordCount ? 'archive_record_count_mismatch' : digest !== head.digest ? 'archive_digest_mismatch' : 'archive_depth_mismatch')
    };
  };

  const hydrateHayakuArchiveForRetrace = async ledger => {
    const head = normalizeHayakuArchiveRefForRetrace(ledger?.archiveRef);
    if (!head) return { ledger: { ...ledger, archiveRef: null }, archiveVerified: true, archiveRecords: 0, archiveLayers: [] };
    const seen = new Set();
    const layers = [];
    let cursor = head;
    let reason = '';
    while (cursor && layers.length < HAYAKU_ARCHIVE_MAX_DEPTH) {
      if (seen.has(cursor.storageKey)) { reason = 'archive_cycle'; break; }
      seen.add(cursor.storageKey);
      const decodedArchive = await decodeHayakuArchivePayloadForRetrace(await storageGet(cursor.storageKey));
      const archive = decodedArchive.parsed;
      if (!archive || archive.schema !== HAYAKU_ARCHIVE_SCHEMA || text(archive.archiveId || '') !== cursor.archiveId) {
        reason = decodedArchive.reason || 'archive_missing_or_invalid';
        break;
      }
      const records = Array.isArray(archive.records) ? archive.records.filter(record => record && typeof record === 'object') : [];
      const deltaDigest = stableHash64(records.map(hayakuArchiveRecordIdentityForRetrace).sort().join('\u0001'));
      const deltaCountMatches = records.length === Math.max(0, Number(archive.deltaCount ?? records.length) || 0)
        && records.length === cursor.deltaCount;
      const layerMatches = Number(archive.recordCount || 0) === cursor.recordCount
        && (!archive.digest || !cursor.digest || text(archive.digest || '') === cursor.digest)
        && (!archive.deltaDigest || text(archive.deltaDigest || '') === deltaDigest)
        && (!archive.generation || Number(archive.generation || 0) === cursor.generation);
      if (!deltaCountMatches || !layerMatches) {
        reason = !deltaCountMatches ? 'archive_delta_count_mismatch' : 'archive_layer_manifest_mismatch';
        break;
      }
      layers.push({ ref: cursor, archive, records, deltaDigest });
      cursor = normalizeHayakuArchiveRefForRetrace(cursor.parentRef || archive.parentRef || archive.parentArchiveRef);
    }
    if (!reason && cursor) reason = 'archive_depth_exceeded';
    const mergedArchive = new Map();
    for (const layer of layers.slice().reverse()) {
      for (const record of layer.records) {
        const identity = hayakuArchiveRecordIdentityForRetrace(record) || text(record?.recordId || record?.hash || '');
        if (identity) mergedArchive.set(identity, record);
      }
    }
    const archiveRecords = Array.from(mergedArchive.values()).sort(compareHayakuTimelineRecords);
    const digest = stableHash64(archiveRecords.map(hayakuArchiveRecordIdentityForRetrace).sort().join('\u0001'));
    const depthMatches = !head.depth || layers.length === head.depth;
    const verified = !reason && archiveRecords.length === head.recordCount && digest === head.digest && depthMatches;
    const merged = new Map();
    for (const record of [...archiveRecords, ...(Array.isArray(ledger.records) ? ledger.records : [])]) {
      const identity = hayakuArchiveRecordIdentityForRetrace(record) || text(record?.recordId || record?.hash || '');
      if (identity) merged.set(identity, record);
    }
    return {
      ledger: {
        ...ledger,
        archiveRef: head,
        records: Array.from(merged.values()),
        archiveVerified: verified,
        archiveRecords: archiveRecords.length,
        archiveReason: verified ? 'archive_chain_verified' : reason || 'archive_digest_mismatch'
      },
      archiveVerified: verified,
      archiveRecords: archiveRecords.length,
      archiveLayers: layers,
      archiveReason: verified ? 'archive_chain_verified' : reason || 'archive_digest_mismatch'
    };
  };

  const hayakuSourceResult = (ledger, scope, readSource, packetAuthoring = null) => {
    if (!ledger) return { available: false, reason: 'ledger_not_found', records: [], recordCount: 0, scope };
    if (!HAYAKU_LEDGER_SCHEMAS.has(ledger.version)) {
      return {
        available: false,
        reason: 'unsupported_schema',
        schema: text(ledger.version || ''),
        records: [],
        recordCount: 0,
        scope,
        ledger,
        readSource
      };
    }
    if (text(ledger.scopeKey || '') !== scope.scopeKey) {
      return { available: false, reason: 'scope_mismatch', records: [], recordCount: 0, scope, ledger, readSource };
    }
    const recordsIncluded = ledger.recordsIncluded !== false;
    const allRecords = recordsIncluded && Array.isArray(ledger.records)
      ? ledger.records.filter(record => record && typeof record === 'object' && text(record.raw || '').trim())
      : [];
    const records = recordsIncluded ? effectiveHayakuRecords(ledger) : [];
    const recordCount = Math.max(0, Number(ledger.recordCount ?? ledger.logicalRecordCount ?? records.length) || 0);
    const archiveVerified = ledger.archiveVerified !== false;
    const integrityOk = archiveVerified;
    return {
      available: recordCount > 0 && integrityOk,
      reason: !integrityOk ? 'archive_partial' : recordCount ? 'loaded' : 'empty',
      records,
      recordCount,
      recordsIncluded,
      allRecords,
      scope,
      ledger,
      readSource,
      archiveRef: ledger.archiveRef && typeof ledger.archiveRef === 'object' ? clone(ledger.archiveRef, {}) : null,
      archiveVerified,
      archiveVerificationDeferred: ledger.archiveVerificationDeferred === true,
      storageLimits: clone(ledger?.storageLimits || ledger?.storage || {}, {}),
      packetAuthoring: normalizeHayakuPacketAuthoringProfile(
        packetAuthoring || ledger?.packetAuthoring,
        readSource
      )
    };
  };

  const readHayakuSource = async (context, options = {}) => {
    const scope = hayakuScopeFor(context);
    const includeRecords = options?.includeRecords !== false;
    if (!scope.available) return { available: false, ownerReady: false, reason: scope.reason, records: [], recordCount: 0, scope };
    let gate;
    try {
      gate = options?.ownerGate?.ready === true
        ? options.ownerGate
        : await ensureHayakuOwnerReady({ action: 'HAYAKU 원장 조회', force: options?.forceOwnerProbe === true });
    } catch (error) {
      return {
        available: false,
        ownerReady: false,
        ownerState: error?.ownerGate?.state || Runtime.hayakuOwnerGate?.state || 'absent',
        reason: text(error?.code || 'hayaku_owner_absent').toLowerCase(),
        error: text(error?.message || error),
        records: [],
        recordCount: 0,
        scope
      };
    }
    try {
      const inspected = await requestHayakuIpc('inspect', { includeRecords }, {
        timeoutMs: includeRecords ? 15000 : 5000,
        ignoreCooldown: true,
        suppressCooldown: true,
        requireAuthenticatedSender: true
      });
      const inspectedLedger = inspected?.ledger && typeof inspected.ledger === 'object' ? inspected.ledger : inspected;
      if (!inspectedLedger || typeof inspectedLedger !== 'object') {
        return { available: false, ownerReady: true, ownerState: 'ready', reason: 'owner_inspect_empty', records: [], recordCount: 0, scope };
      }
      const ipcLedger = {
        ...clone(inspectedLedger, {}),
        version: text(inspectedLedger.version || inspected?.version || '').trim(),
        scopeKey: text(inspectedLedger.scopeKey || inspected?.scopeKey || '').trim(),
        recordsIncluded: inspected?.recordsIncluded ?? inspectedLedger?.recordsIncluded ?? includeRecords,
        recordCount: Number(inspected?.recordCount ?? inspectedLedger?.recordCount ?? 0) || 0,
        archiveRef: clone(inspected?.archiveRef || inspectedLedger?.archiveRef || null, null),
        archiveVerified: inspected?.archiveVerified ?? inspectedLedger?.archiveVerified,
        archiveVerificationDeferred: inspected?.archiveVerificationDeferred === true || inspectedLedger?.archiveVerificationDeferred === true,
        storageLimits: clone(inspected?.storageLimits || inspectedLedger?.storageLimits || {}, {})
      };
      return {
        ...hayakuSourceResult(ipcLedger, scope, 'hayaku_plugin_ipc', inspected?.packetAuthoring || inspectedLedger?.packetAuthoring),
        ownerReady: true,
        ownerState: gate.state,
        ownerCapabilities: clone(gate.capabilities, {})
      };
    } catch (error) {
      setHayakuOwnerGate('absent', false, error?.message || 'hayaku_owner_inspect_failed', null);
      return {
        available: false,
        ownerReady: false,
        ownerState: 'absent',
        reason: 'hayaku_owner_inspect_failed',
        error: text(error?.message || error),
        records: [],
        recordCount: 0,
        scope
      };
    }
  };
  const readHayakuViewerSource = async (context, limit = HAYAKU_VIEWER_MAX_RENDERED_RECORDS) => {
    const source = await readHayakuSource(context, { includeRecords: true });
    if (source.ownerReady !== true) return source;
    const maxRecords = Math.max(1, Math.min(1000, Number(limit || HAYAKU_VIEWER_MAX_RENDERED_RECORDS) || HAYAKU_VIEWER_MAX_RENDERED_RECORDS));
    const allRecords = Array.isArray(source.allRecords) && source.allRecords.length
      ? source.allRecords
      : (Array.isArray(source.ledger?.records) ? source.ledger.records : source.records || []);
    const sampled = [...allRecords].filter(Boolean).sort(compareHayakuTimelineRecords).slice(-maxRecords);
    return {
      ...source,
      records: sampled,
      allRecords,
      recordsIncluded: true,
      viewerPaged: allRecords.length > sampled.length,
      viewerTotalRecords: allRecords.length,
      viewerRenderedRecords: sampled.length,
      readSource: 'hayaku_plugin_ipc'
    };
  };
  const readPendingColdStartCapsule = async (context, options = {}) => {
    const ownerGate = options?.ownerGate?.ready === true
      ? options.ownerGate
      : await ensureHayakuOwnerReady({ action: 'HAYAKU 콜드스타트 캡슐 조회', force: options?.forceOwnerProbe === true });
    const scope = hayakuScopeFor(context);
    if (!scope.available) return { available: false, reason: scope.reason, packets: [], scope };
    const storageKey = `${COLD_START_PREFIX}${scope.scopeKey}`;
    const capsule = parseJson(await storageGet(storageKey), null);
    if (!capsule) return { available: false, reason: 'capsule_not_found', packets: [], scope, storageKey };
    if (capsule.schema !== COLD_START_SCHEMA || capsule.scopeKey !== scope.scopeKey || !Array.isArray(capsule.packets)) {
      return { available: false, reason: 'capsule_invalid', packets: [], scope, storageKey, capsule };
    }
    const validation = validateBridgeCapsulePacketSet(capsule);
    const packets = validation.valid ? capsule.packets : [];
    return {
      available: validation.valid,
      reason: validation.valid ? 'loaded' : validation.reason,
      packets,
      scope,
      storageKey,
      capsule
    };
  };

  const readColdStartRun = async (context, options = {}) => {
    const ownerGate = options?.ownerGate?.ready === true
      ? options.ownerGate
      : await ensureHayakuOwnerReady({ action: 'HAYAKU 콜드스타트 실행 상태 조회', force: options?.forceOwnerProbe === true });
    const scope = hayakuScopeFor(context);
    if (!scope.available) return { available: false, reason: scope.reason, scope };
    const storageKey = `${COLD_START_RUN_PREFIX}${scope.scopeKey}`;
    const run = parseJson(await storageGet(storageKey), null);
    if (!run) return { available: false, reason: 'run_not_found', scope, storageKey };
    if (run.schema !== COLD_START_RUN_SCHEMA || run.scopeKey !== scope.scopeKey || !Array.isArray(run.chunks)) {
      return { available: false, reason: 'run_invalid', scope, storageKey, run };
    }
    return {
      available: true,
      reason: text(run.state || 'loaded'),
      scope,
      storageKey,
      run
    };
  };

  const readIncrementalRecoveryRun = async (context, options = {}) => {
    const ownerGate = options?.ownerGate?.ready === true
      ? options.ownerGate
      : await ensureHayakuOwnerReady({ action: 'HAYAKU 증분 복구 실행 상태 조회', force: options?.forceOwnerProbe === true });
    const scope = hayakuScopeFor(context);
    if (!scope.available) return { available: false, reason: scope.reason, scope };
    const storageKey = `${INCREMENTAL_RECOVERY_RUN_PREFIX}${scope.scopeKey}`;
    const run = parseJson(await storageGet(storageKey), null);
    if (!run) return { available: false, reason: 'run_not_found', scope, storageKey };
    if (run.schema !== INCREMENTAL_RECOVERY_RUN_SCHEMA || run.scopeKey !== scope.scopeKey || !Array.isArray(run.chunks)) {
      return { available: false, reason: 'run_invalid', scope, storageKey, run };
    }
    return {
      available: true,
      reason: text(run.state || 'loaded'),
      scope,
      storageKey,
      run
    };
  };

  const readPendingIncrementalRecoveryCapsule = async (context, options = {}) => {
    const ownerGate = options?.ownerGate?.ready === true
      ? options.ownerGate
      : await ensureHayakuOwnerReady({ action: 'HAYAKU 증분 복구 캡슐 조회', force: options?.forceOwnerProbe === true });
    const scope = hayakuScopeFor(context);
    if (!scope.available) return { available: false, reason: scope.reason, packets: [], scope };
    const storageKey = `${INCREMENTAL_RECOVERY_PREFIX}${scope.scopeKey}`;
    const capsule = parseJson(await storageGet(storageKey), null);
    if (!capsule) return { available: false, reason: 'capsule_not_found', packets: [], scope, storageKey };
    if (capsule.schema !== INCREMENTAL_RECOVERY_SCHEMA
      || capsule.scopeKey !== scope.scopeKey
      || !Array.isArray(capsule.packets)) {
      return { available: false, reason: 'capsule_invalid', packets: [], scope, storageKey, capsule };
    }
    const validation = validateBridgeCapsulePacketSet(capsule);
    const packets = validation.valid ? capsule.packets : [];
    return {
      available: validation.valid,
      reason: validation.valid ? 'loaded' : validation.reason,
      packets,
      scope,
      storageKey,
      capsule
    };
  };
  const validateBridgeCapsulePacketSet = capsule => {
    const entries = Array.isArray(capsule?.packets) ? capsule.packets : [];
    if (!entries.length) return { valid: false, reason: 'capsule_empty', entries: [], bodies: [] };
    if (capsule?.packetCount === undefined || capsule?.packetCount === null || capsule?.packetCount === '') {
      return { valid: false, reason: 'capsule_packet_count_missing', entries, bodies: [] };
    }
    const declaredPacketCount = Number(capsule.packetCount);
    if (!Number.isInteger(declaredPacketCount) || declaredPacketCount < 1) {
      return { valid: false, reason: 'capsule_packet_count_invalid', entries, bodies: [] };
    }
    if (declaredPacketCount !== entries.length) {
      return { valid: false, reason: 'capsule_packet_count_mismatch', entries, bodies: [] };
    }
    const bodies = [];
    const ordinals = new Set();
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const body = text(typeof entry === 'string' ? entry : entry?.body).trim();
      if (!body) return { valid: false, reason: `capsule_packet_body_missing:${index + 1}`, entries, bodies };
      const ordinal = Math.max(0, Number(typeof entry === 'string' ? index + 1 : entry?.ordinal) || 0);
      if (ordinal !== index + 1 || ordinals.has(ordinal)) {
        return { valid: false, reason: `capsule_packet_ordinal_invalid:${index + 1}`, entries, bodies };
      }
      ordinals.add(ordinal);
      const declaredHash = text(typeof entry === 'string' ? '' : entry?.packetHash).trim();
      if (declaredHash && declaredHash !== stableHash64(body)) {
        return { valid: false, reason: `capsule_packet_hash_mismatch:${index + 1}`, entries, bodies };
      }
      bodies.push(body);
    }
    return { valid: true, reason: 'capsule_packet_set_verified', entries, bodies };
  };
  const bridgeCapsulePacketBodies = capsule => {
    const validation = validateBridgeCapsulePacketSet(capsule);
    return validation.valid ? validation.bodies : [];
  };
  const verifyDurableHayakuColdStart = async (capsule, options = {}) => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 콜드스타트 영속 검증', force: options?.forceOwnerProbe === true });
    const scopeKey = text(capsule?.scopeKey || '').trim();
    const packetSet = validateBridgeCapsulePacketSet(capsule);
    const packetBodies = packetSet.bodies;
    if (!scopeKey || capsule?.schema !== COLD_START_SCHEMA || !packetSet.valid) {
      return { verified: false, durable: false, reason: 'cold_start_capsule_invalid', records: 0 };
    }
    const ledger = parseJson(await storageGet(`${HAYAKU_LEDGER_PREFIX}${scopeKey}`), null);
    const records = Array.isArray(ledger?.records) ? ledger.records.filter(record => (
      record?.captureSource === 'bridge_cold_start'
      && text(record?.coldStartEpochId || '') === text(capsule?.epochId || '')
      && text(record?.coldStartTransferId || '') === text(capsule?.transferId || '')
      && text(record?.coldStartSourceHash || '') === text(capsule?.sourceHash || '')
      && record?.recordState === 'historical'
    )) : [];
    const metadataMatches = text(ledger?.scopeKey || '') === scopeKey
      && text(ledger?.coldStart?.activeEpochId || '') === text(capsule?.epochId || '')
      && text(ledger?.coldStart?.transferId || '') === text(capsule?.transferId || '')
      && text(ledger?.coldStart?.sourceHash || '') === text(capsule?.sourceHash || '')
      && Number(ledger?.coldStart?.recordCount || 0) === packetBodies.length;
    const expectedBodies = [...packetBodies].sort();
    const storedBodies = records.map(record => text(record?.raw || '').trim()).sort();
    const packetsMatch = expectedBodies.length === storedBodies.length
      && expectedBodies.every((body, index) => body === storedBodies[index]);
    return {
      verified: metadataMatches && packetsMatch,
      durable: metadataMatches && packetsMatch,
      reason: metadataMatches && packetsMatch ? 'cold_start_ledger_verified' : 'cold_start_ledger_not_verified',
      records: records.length,
      expectedRecords: packetBodies.length,
      scopeKey,
      epochId: text(capsule?.epochId || ''),
      transferId: text(capsule?.transferId || ''),
      sourceHash: text(capsule?.sourceHash || '')
    };
  };
  const verifyDurableHayakuIncrementalRecovery = async (capsule, options = {}) => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 증분 복구 영속 검증', force: options?.forceOwnerProbe === true });
    const scopeKey = text(capsule?.scopeKey || '').trim();
    const packetSet = validateBridgeCapsulePacketSet(capsule);
    const packetBodies = packetSet.bodies;
    if (!scopeKey || capsule?.schema !== INCREMENTAL_RECOVERY_SCHEMA || !packetSet.valid) {
      return { verified: false, durable: false, reason: 'incremental_recovery_capsule_invalid', records: 0 };
    }
    const ledger = parseJson(await storageGet(`${HAYAKU_LEDGER_PREFIX}${scopeKey}`), null);
    const recoveryId = text(capsule?.recoveryId || capsule?.runId || '');
    const sourceHash = text(capsule?.sourceHash || '');
    const records = Array.isArray(ledger?.records) ? ledger.records.filter(record => (
      record?.captureSource === 'bridge_incremental_recovery'
      && text(record?.incrementalRecoveryRunId || '') === recoveryId
      && text(record?.incrementalRecoverySourceHash || '') === sourceHash
    )) : [];
    const activeRecords = records.filter(record => record?.recordState === 'active');
    const recoveredTurns = (Array.isArray(ledger?.incrementalRecovery?.recoveredTurns)
      ? ledger.incrementalRecovery.recoveredTurns : []).map(Number).filter(Number.isInteger);
    const expectedTurns = [...new Set((Array.isArray(capsule?.packets) ? capsule.packets : []).flatMap(entry => {
      const start = Math.max(1, Number(entry?.startTurn || entry?.targetPairIndex || 1) || 1);
      const end = Math.max(start, Number(entry?.endTurn || entry?.targetPairIndex || start) || start);
      return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }))];
    const activeTurns = new Set();
    activeRecords.forEach(record => {
      const range = packetSourceTurnRange(record);
      for (let turn = Math.max(1, range.start); turn <= Math.max(range.start, range.end); turn += 1) {
        activeTurns.add(turn);
      }
    });
    const activeCoverageMatches = expectedTurns.length > 0
      && expectedTurns.every(turn => activeTurns.has(turn));
    const metadataMatches = text(ledger?.scopeKey || '') === scopeKey
      && text(ledger?.incrementalRecovery?.lastRecoveryId || '') === recoveryId
      && text(ledger?.incrementalRecovery?.sourceHash || '') === sourceHash
      && Number(ledger?.incrementalRecovery?.recordCount || 0) === packetBodies.length
      && expectedTurns.every(turn => recoveredTurns.includes(turn));
    const expectedBodies = [...packetBodies].sort();
    const storedBodies = records.map(record => text(record?.raw || '').trim()).sort();
    const packetsMatch = expectedBodies.length === storedBodies.length
      && expectedBodies.every((body, index) => body === storedBodies[index]);
    const replacementIds = [...new Set((Array.isArray(capsule?.replacementRecordIds)
      ? capsule.replacementRecordIds : []).map(value => text(value).trim()).filter(Boolean))];
    const replacementsMatch = replacementIds.every(recordId => (
      Array.isArray(ledger?.records)
      && ledger.records.some(record => record?.recordId === recordId && record?.recordState === 'tombstoned')
    ));
    return {
      verified: metadataMatches && packetsMatch && replacementsMatch && activeCoverageMatches,
      durable: metadataMatches && packetsMatch && replacementsMatch && activeCoverageMatches,
      reason: metadataMatches && packetsMatch && replacementsMatch && activeCoverageMatches
        ? 'incremental_recovery_ledger_verified'
        : 'incremental_recovery_ledger_not_verified',
      records: records.length,
      activeRecords: activeRecords.length,
      expectedRecords: packetBodies.length,
      replacedRecords: replacementIds.length,
      recoveredTurns,
      diagnostics: {
        metadataMatches,
        packetsMatch,
        replacementsMatch,
        activeCoverageMatches,
        activeTurns: [...activeTurns].sort((a, b) => a - b),
        expectedTurns
      },
      scopeKey,
      recoveryId,
      sourceHash
    };
  };

  const hayakuIncrementalRecoveryEntryProjection = (capsule, entry, index = 0) => {
    const body = text(typeof entry === 'string' ? entry : entry?.body).trim();
    if (!body) return null;
    const ordinal = Math.max(1, Number(typeof entry === 'string' ? index + 1 : entry?.ordinal || index + 1) || index + 1);
    const scopeKey = text(capsule?.scopeKey || '').trim();
    const recoveryId = text(capsule?.recoveryId || capsule?.runId || '').trim();
    const sourceHash = text(capsule?.sourceHash || '').trim();
    const parsedPacket = parseJson(body, null);
    const packetMeta = parsedPacket?.meta || {};
    const sourceRange = packetMeta?.source_turn_range || packetMeta?.sourceTurnRange || {};
    const targetPairIndex = Math.max(1, Number(
      (typeof entry === 'string' ? 0 : entry?.targetPairIndex)
      ?? sourceRange?.end
      ?? sourceRange?.end_turn
      ?? packetMeta?.source_turn_index
      ?? packetMeta?.sourceTurnIndex
      ?? 1
    ) || 1);
    const startTurn = Math.max(1, Number((typeof entry === 'string' ? 0 : entry?.startTurn) ?? sourceRange?.start ?? sourceRange?.start_turn ?? targetPairIndex) || targetPairIndex);
    const endTurn = Math.max(startTurn, Number((typeof entry === 'string' ? 0 : entry?.endTurn) ?? sourceRange?.end ?? sourceRange?.end_turn ?? targetPairIndex) || targetPairIndex);
    const bodyHash = stableHash64(body);
    const chunkHash = text(typeof entry === 'string' ? '' : entry?.chunkHash || '').trim();
    const incrementalRecoveryId = stableHash64([
      scopeKey,
      recoveryId,
      ordinal,
      targetPairIndex,
      chunkHash,
      bodyHash
    ].join('\u0001'));
    return {
      identity: incrementalRecoveryId,
      body,
      bodyHash,
      ordinal,
      targetPairIndex,
      startTurn,
      endTurn,
      recoveryId,
      sourceHash,
      record: {
        recordId: `retrace_capsule:${incrementalRecoveryId}:recovery_snapshot`,
        hash: bodyHash,
        raw: body,
        packetType: 'recovery_snapshot',
        targetPairIndex,
        recordState: 'active',
        memoryClass: 'live',
        captureSource: 'bridge_incremental_recovery_capsule_readonly',
        sourcePriority: 1,
        inheritedSessionHistory: false,
        incrementalRecoveryId,
        incrementalRecoveryRunId: recoveryId,
        incrementalRecoverySourceHash: sourceHash,
        recoveryTurnStart: startTurn,
        recoveryTurnEnd: endTurn,
        requestSequence: ordinal,
        capturedAt: Math.max(0, Number(capsule?.createdAt || 0) || 0) + ordinal,
        retraceVirtualRecovery: true,
        retraceReadOnly: true
      }
    };
  };

  const hayakuLocalPacketTypeCounts = ledgerValue => {
    const ledger = ledgerValue && typeof ledgerValue === 'object' ? ledgerValue : {};
    const localLedger = { ...ledger, archiveRef: null };
    const effective = effectiveHayakuRecords(localLedger);
    const classify = records => {
      let current = 0;
      let recovery = 0;
      let other = 0;
      for (const record of records) {
        const packetType = text(record?.packetType || 'current_snapshot').trim().toLowerCase();
        if (packetType === 'recovery_snapshot') recovery += 1;
        else if (packetType === 'current_snapshot') current += 1;
        else other += 1;
      }
      return { total: records.length, current, recovery, other };
    };
    if (effective.length) return { ...classify(effective), source: 'effective_records' };
    const heads = (Array.isArray(ledger?.slotHeads) ? ledger.slotHeads : [])
      .filter(head => ['active', 'unbound'].includes(text(head?.state || '').trim().toLowerCase()));
    if (heads.length) {
      const bySlot = new Map();
      for (const head of heads) {
        const slotId = text(head?.slotId || '').trim();
        if (!slotId) continue;
        bySlot.set(slotId, head);
      }
      const projected = Array.from(bySlot.values()).map(head => ({
        packetType: text(head?.packetType || '').trim().toLowerCase() || (
          text(head?.slotId || '').includes('recovery_snapshot') ? 'recovery_snapshot' : 'current_snapshot'
        )
      }));
      return { ...classify(projected), source: 'slot_heads' };
    }
    const migrationRecovery = Math.max(0, Number(
      ledger?.migration?.nativeCopyRecoveryExamined
      || ledger?.migration?.nativeCopyRecoverySourceRecords
      || 0
    ) || 0);
    return {
      total: 0,
      current: 0,
      recovery: migrationRecovery,
      other: 0,
      source: migrationRecovery > 0 ? 'migration_recovery_metadata' : 'unavailable'
    };
  };

  const hayakuIncrementalRecoveryAccounting = async (hayaku, pendingIncremental, options = {}) => {
    const baseRecordCount = Math.max(0, Number(
      options?.baseRecordCount
      ?? hayaku?.recordCount
      ?? hayaku?.records?.length
      ?? 0
    ) || 0);
    const archiveRecordCount = Math.max(0, Number(
      hayaku?.archiveRecordCount
      ?? hayaku?.ledger?.archiveRecords
      ?? hayaku?.archiveRef?.recordCount
      ?? 0
    ) || 0);
    const localRecordCountBase = Math.max(0, baseRecordCount - archiveRecordCount);
    const localTypeCounts = hayakuLocalPacketTypeCounts(hayaku?.ledger || hayaku);
    const typeCountsUsable = localTypeCounts.total > 0 && (localRecordCountBase <= 0 || localTypeCounts.total <= localRecordCountBase);
    const durableRecoveryCount = Math.min(
      localRecordCountBase,
      Math.max(0, Number(localTypeCounts.recovery || 0) || 0)
    );
    const durableCurrentCount = typeCountsUsable
      ? Math.min(Math.max(0, localRecordCountBase - durableRecoveryCount), Math.max(0, Number(localTypeCounts.current || 0) || 0))
      : Math.max(0, localRecordCountBase - durableRecoveryCount);
    const base = {
      available: pendingIncremental?.available === true || durableRecoveryCount > 0,
      baseRecordCount,
      logicalRecordCount: baseRecordCount,
      localRecordCount: localRecordCountBase,
      archiveRecordCount,
      currentSnapshotRecordCount: durableCurrentCount,
      recoveryRecordCount: durableRecoveryCount,
      recoveryExpectedCount: durableRecoveryCount,
      recoveryDurableCount: durableRecoveryCount,
      missingRecoveryCount: 0,
      replacedEffectiveCount: 0,
      durableVerified: durableRecoveryCount > 0,
      virtualRecords: [],
      localPacketTypeCounts: localTypeCounts,
      reason: durableRecoveryCount > 0
        ? 'materialized_recovery_classified'
        : (pendingIncremental?.available === true ? 'recovery_accounting_pending' : 'recovery_capsule_absent')
    };
    // A consumed/cleaned-up RE:TRACE capsule must not erase the type identity of
    // recovery_snapshot records that are already durable in the HAYAKU ledger.
    if (pendingIncremental?.available !== true || !pendingIncremental?.capsule) return base;
    const capsule = pendingIncremental.capsule;
    const validation = validateBridgeCapsulePacketSet(capsule);
    if (!validation.valid) return { ...base, reason: validation.reason || 'recovery_capsule_invalid' };
    const projections = validation.entries.map((entry, index) => hayakuIncrementalRecoveryEntryProjection(capsule, entry, index)).filter(Boolean);
    const scopeKey = text(capsule.scopeKey || pendingIncremental?.scope?.scopeKey || hayaku?.scope?.scopeKey || '').trim();
    const rawLedger = scopeKey ? parseJson(await storageGet(`${HAYAKU_LEDGER_PREFIX}${scopeKey}`), null) : null;
    const effectiveLocal = rawLedger && typeof rawLedger === 'object'
      ? effectiveHayakuRecords({ ...rawLedger, archiveRef: null })
      : [];
    const recoveryId = text(capsule.recoveryId || capsule.runId || '').trim();
    const sourceHash = text(capsule.sourceHash || '').trim();
    const allDurableRecovery = effectiveLocal.filter(record => (
      text(record?.packetType || '').trim().toLowerCase() === 'recovery_snapshot'
      && record?.inheritedSessionHistory !== true
      && !isPermanentSessionHistory(record)
    ));
    const activeRecovery = allDurableRecovery.filter(record => (
      text(record?.captureSource || '').trim() === 'bridge_incremental_recovery'
      && text(record?.recordState || '').trim() === 'active'
      && (!recoveryId || text(record?.incrementalRecoveryRunId || '').trim() === recoveryId)
      && (!sourceHash || text(record?.incrementalRecoverySourceHash || '').trim() === sourceHash)
    ));
    const representedIds = new Set(activeRecovery.map(record => text(record?.incrementalRecoveryId || '').trim()).filter(Boolean));
    const representedFallback = new Set(activeRecovery.filter(record => !text(record?.incrementalRecoveryId || '').trim()).map(record => [
      text(record?.hash || stableHash64(text(record?.raw || ''))).trim(),
      Math.max(1, Number(record?.targetPairIndex || 1) || 1)
    ].join('\u0001')));
    const missing = projections.filter(item => (
      !representedIds.has(item.identity)
      && !representedFallback.has([item.bodyHash, item.targetPairIndex].join('\u0001'))
    ));
    const replacementIds = new Set((Array.isArray(capsule?.replacementRecordIds) ? capsule.replacementRecordIds : [])
      .map(value => text(value || '').trim()).filter(Boolean));
    const replacedEffective = effectiveLocal.filter(record => replacementIds.has(text(record?.recordId || '').trim()));
    const replacedEffectiveCount = replacedEffective.length;
    const replacedRecoveryCount = replacedEffective.filter(record => text(record?.packetType || '').trim().toLowerCase() === 'recovery_snapshot').length;
    const replacedCurrentCount = replacedEffective.filter(record => text(record?.packetType || 'current_snapshot').trim().toLowerCase() === 'current_snapshot').length;
    const durableVerification = await verifyDurableHayakuIncrementalRecovery(capsule).catch(() => ({ verified: false, records: activeRecovery.length }));
    const logicalRecordCount = Math.max(0, baseRecordCount - replacedEffectiveCount + missing.length);
    const localRecordCount = Math.max(0, logicalRecordCount - archiveRecordCount);
    const effectiveCurrent = effectiveLocal.filter(record => (
      text(record?.packetType || 'current_snapshot').trim().toLowerCase() === 'current_snapshot'
      && record?.inheritedSessionHistory !== true
      && !isPermanentSessionHistory(record)
    )).length;
    const expectedRecoveryCount = projections.length;
    const recoveryRecordCount = Math.max(0, allDurableRecovery.length - replacedRecoveryCount + missing.length);
    const currentSnapshotRecordCount = Math.max(0, effectiveCurrent - replacedCurrentCount);
    return {
      ...base,
      logicalRecordCount,
      localRecordCount,
      currentSnapshotRecordCount,
      recoveryRecordCount,
      recoveryExpectedCount: Math.max(recoveryRecordCount, expectedRecoveryCount),
      recoveryDurableCount: allDurableRecovery.length,
      missingRecoveryCount: missing.length,
      replacedEffectiveCount,
      durableVerified: durableVerification?.verified === true,
      durableVerification,
      virtualRecords: missing.map(item => item.record),
      recoveryId,
      sourceHash,
      scopeKey,
      localPacketTypeCounts: hayakuLocalPacketTypeCounts(rawLedger || hayaku?.ledger || hayaku),
      reason: durableVerification?.verified === true
        ? 'recovery_capsule_durable'
        : missing.length
          ? 'recovery_capsule_projected_readonly'
          : 'recovery_capsule_present_not_fully_verified'
    };
  };

  const mergeHayakuRecoveryAccountingForViewer = async (result, pendingIncremental) => {
    if (!result || pendingIncremental?.available !== true) return result;
    const accounting = await hayakuIncrementalRecoveryAccounting(result, pendingIncremental);
    const virtualRecords = Array.isArray(accounting.virtualRecords) ? accounting.virtualRecords : [];
    if (!virtualRecords.length) {
      return {
        ...result,
        recordCount: accounting.logicalRecordCount,
        localRecordCount: accounting.localRecordCount,
        archiveRecordCount: accounting.archiveRecordCount,
        currentSnapshotRecordCount: accounting.currentSnapshotRecordCount,
        recoveryRecordCount: accounting.recoveryRecordCount,
        pendingRecoveryRecordCount: accounting.missingRecoveryCount,
        recoveryDurableVerified: accounting.durableVerified,
        recoveryAccounting: accounting
      };
    }
    const existingAll = Array.isArray(result.allRecords) ? result.allRecords : (Array.isArray(result.records) ? result.records : []);
    const existingEffective = Array.isArray(result.records) ? result.records : existingAll;
    const allRecords = [...existingAll, ...virtualRecords].sort(compareHayakuTimelineRecords);
    const records = [...existingEffective, ...virtualRecords].sort(compareHayakuTimelineRecords);
    return {
      ...result,
      allRecords,
      records,
      recordCount: accounting.logicalRecordCount,
      localRecordCount: accounting.localRecordCount,
      archiveRecordCount: accounting.archiveRecordCount,
      currentSnapshotRecordCount: accounting.currentSnapshotRecordCount,
      recoveryRecordCount: accounting.recoveryRecordCount,
      pendingRecoveryRecordCount: accounting.missingRecoveryCount,
      recoveryDurableVerified: accounting.durableVerified,
      recoveryAccounting: accounting,
      viewerLoadedRecords: Math.max(0, Number(result.viewerLoadedRecords ?? existingAll.length) || 0) + virtualRecords.length,
      viewerLimited: accounting.logicalRecordCount > (Math.max(0, Number(result.viewerLoadedRecords ?? existingAll.length) || 0) + virtualRecords.length)
    };
  };

  const activeHayakuRuntime = capability => {
    const candidates = [];
    try {
      candidates.push(
        globalThis.HAYAKU,
        globalThis.__pluginApis__?.HAYAKU,
        globalThis.__pluginApis__?.hayaku
      );
    } catch (_) {}
    const method = text(capability || 'adoptColdStart').trim();
    return candidates.find(candidate => typeof candidate?.ledger?.[method] === 'function') || null;
  };

  const hayakuMutationReceiptMatches = (result, transport, mutation) => (
    transport !== 'hayaku_plugin_ipc'
    || (
      text(result?.mutation || '') === mutation
      && text(result?.ownerPluginId || '') === HAYAKU_PLUGIN_ID
      && text(result?.authorizedRequester || '') === 'flashback_hayaku_bridge'
    )
  );

  const verifyHayakuSessionHandoffFromStorage = async (options = {}) => {
    const targetChatId = text(options.targetChatId || '').trim();
    const transferId = text(options.transferId || '').trim();
    const sourceScopeKey = text(options.sourceScopeKey || '').trim();
    const expectedRecords = Math.max(0, Number(options.expectedRecords || 0) || 0);
    const base = {
      schema: HAYAKU_HANDOFF_RECEIPT_SCHEMA,
      ok: false,
      available: false,
      attempted: false,
      adopted: false,
      verified: false,
      durable: false,
      handoffContract: HAYAKU_REQUIRED_HANDOFF_CONTRACT,
      sourceMutationAllowed: false,
      sourceCompactionAllowed: false,
      physicalCopies: 0,
      sourcePreserved: false,
      targetChatId,
      transferId,
      sourceScopeKey,
      records: 0,
      expectedRecords,
      transport: 'plugin_storage_readback'
    };
    try {
      await ensureHayakuOwnerReady({ action: 'HAYAKU 세션 승계 검증', force: true });
      const context = await getCurrentContext();
      const currentIdentity = contextIdentity(context);
      if (!targetChatId || currentIdentity.chatId !== targetChatId) {
        return { ...base, reason: 'target_chat_not_active' };
      }
      const scope = hayakuScopeFor(context);
      if (!scope.available) return { ...base, reason: scope.reason || 'hayaku_scope_unavailable' };
      const ledger = parseJson(await storageGet(scope.storageKey), null);
      if (!ledger || !HAYAKU_LEDGER_SCHEMAS.has(text(ledger.version || '')) || text(ledger.scopeKey || '') !== scope.scopeKey) {
        return { ...base, available: false, reason: 'hayaku_target_ledger_missing' };
      }
      const archiveRef = normalizeHayakuArchiveRefForRetrace(ledger.archiveRef);
      const archive = archiveRef
        ? await readHayakuArchiveLayerMetas(archiveRef)
        : { verified: expectedRecords === 0, records: 0, reason: 'archive_ref_absent' };
      const session = ledger.sessionHandoff && typeof ledger.sessionHandoff === 'object' ? ledger.sessionHandoff : {};
      const transferMatches = text(session.transferId || '') === transferId;
      const sourceMatches = !sourceScopeKey || text(session.sourceScopeKey || '') === sourceScopeKey;
      const archiveCount = Math.max(0, Number(archive.records ?? archiveRef?.recordCount ?? 0) || 0);
      const recordsMatch = archiveCount === expectedRecords
        && (!archiveRef || Math.max(0, Number(archiveRef.recordCount || 0) || 0) === expectedRecords);
      const proofBefore = text(session.sourceFingerprintBefore || '').trim();
      const proofAfter = text(session.sourceFingerprintAfter || '').trim();
      let liveSourceFingerprint = '';
      if (sourceScopeKey) {
        const rawSource = await storageGet(`${HAYAKU_LEDGER_PREFIX}${sourceScopeKey}`);
        if (rawSource != null && rawSource !== '') {
          const serialized = typeof rawSource === 'string' ? rawSource : JSON.stringify(rawSource);
          liveSourceFingerprint = stableHash64(serialized);
        }
      }
      const sourcePreserved = expectedRecords === 0
        ? (!sourceScopeKey || (!!proofBefore && proofBefore === proofAfter && (!liveSourceFingerprint || proofAfter === liveSourceFingerprint)))
        : (!!sourceScopeKey && !!proofBefore && proofBefore === proofAfter && !!liveSourceFingerprint && proofAfter === liveSourceFingerprint);
      const verified = session.verified === true
        && session.sourcePreserved === true
        && transferMatches
        && sourceMatches
        && archive.verified === true
        && recordsMatch
        && sourcePreserved;
      return {
        ...base,
        ok: verified,
        available: true,
        verified,
        durable: verified,
        sourcePreserved,
        records: archiveCount,
        targetScopeKey: scope.scopeKey,
        archiveId: text(archiveRef?.archiveId || ''),
        archiveGeneration: Math.max(0, Number(archiveRef?.generation || 0) || 0),
        archiveDigest: text(archiveRef?.digest || ''),
        archiveRecordCount: Math.max(0, Number(archiveRef?.recordCount || 0) || 0),
        sourceFingerprintBefore: proofBefore,
        sourceFingerprintAfter: proofAfter,
        sourceFingerprintLive: liveSourceFingerprint,
        reason: verified ? 'hayaku_handoff_storage_readback_verified' : 'hayaku_handoff_storage_readback_not_verified',
        diagnostics: {
          transferMatches,
          sourceMatches,
          archiveVerified: archive.verified === true,
          archiveReason: text(archive.reason || ''),
          recordsMatch,
          sessionVerified: session.verified === true,
          sessionSourcePreserved: session.sourcePreserved === true,
          sourcePreserved
        }
      };
    } catch (error) {
      return { ...base, reason: 'hayaku_handoff_storage_readback_failed', error: text(error?.message || error) };
    }
  };

  const adoptHayakuSessionHandoff = async (options = {}) => {
    try {
      await ensureHayakuOwnerReady({ action: 'HAYAKU 다음 세션 승계', force: true });
    } catch (error) {
      return {
        ok: false, available: false, attempted: false, adopted: false, verified: false, durable: false,
        reason: text(error?.code || 'HAYAKU_OWNER_ABSENT'), error: text(error?.message || error),
        handoffContract: HAYAKU_REQUIRED_HANDOFF_CONTRACT, sourcePreserved: true,
        sourceMutationAllowed: false, sourceCompactionAllowed: false, physicalCopies: 0, records: 0
      };
    }
    const targetChatId = text(options.targetChatId || '').trim();
    const transferId = text(options.transferId || '').trim();
    const sourceScopeKey = text(options.sourceScopeKey || '').trim();
    const expectedRecords = Math.max(0, Number(options.expectedRecords || 0) || 0);
    if (expectedRecords > 0) {
      const existingReadback = await verifyHayakuSessionHandoffFromStorage({ targetChatId, transferId, sourceScopeKey, expectedRecords });
      if (existingReadback?.verified === true && existingReadback?.durable === true && existingReadback?.sourcePreserved === true) {
        return { ...existingReadback, ok: true, adopted: false, attempted: false, transport: 'plugin_storage_readback_existing' };
      }
    }
    if (expectedRecords <= 0) {
      return {
        ok: true,
        available: true,
        attempted: false,
        verified: true,
        adopted: false,
        durable: true,
        records: 0,
        handoffContract: HAYAKU_REQUIRED_HANDOFF_CONTRACT,
        sourcePreserved: true,
        sourceMutationAllowed: false,
        sourceCompactionAllowed: false,
        physicalCopies: 0,
        reason: 'no_hayaku_records'
      };
    }
    let last = null;
    let lastTransport = '';
    let lastError = null;
    let attempted = false;
    const attempts = Math.max(1, Math.min(10, Number(options.attempts || 8) || 8));
    const request = { targetChatId, transferId, sourceScopeKey, expectedRecords };
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        attempted = true;
        lastTransport = 'hayaku_plugin_ipc';
        last = await requestHayakuIpc(
          'adopt_session_handoff',
          clone(request, request),
          { timeoutMs: 7000 }
        );
        lastError = null;
      } catch (error) {
        lastError = error;
        last = null;
        // HAYAKU owner mutations are never attempted through cross-realm globals.
        // An authenticated live plugin-channel owner is the only allowed authority.
      }
      const ownerReceipt = hayakuMutationReceiptMatches(
        last,
        lastTransport,
        'adopt_session_handoff'
      );
      const identityMatches = text(last?.targetChatId || '') === targetChatId
        && text(last?.transferId || '') === transferId
        && text(last?.sourceScopeKey || '') === sourceScopeKey;
      const recordsMatch = Math.max(0, Number(last?.records || 0) || 0) === expectedRecords;
      const preservationReceipt = text(last?.schema || '') === HAYAKU_HANDOFF_RECEIPT_SCHEMA
        && sourcePreservationReceiptMatches(last, RETRACE_PEER_REQUIREMENTS.hayaku, { physicalField: 'physicalCopies' })
        && memorySuiteStorageReceiptMatches(last, 'hayaku');
      if (last?.verified === true && last?.durable === true
        && ownerReceipt && identityMatches && recordsMatch && preservationReceipt) {
          return {
            ...last,
            ok: true,
            available: true,
            attempted: true,
            attempts: attempt,
            transport: lastTransport,
            verified: true,
            durable: true
          };
      }
      const readback = await verifyHayakuSessionHandoffFromStorage({ targetChatId, transferId, sourceScopeKey, expectedRecords });
      if (readback?.verified === true && readback?.durable === true && readback?.sourcePreserved === true) {
        return { ...readback, ok: true, adopted: false, attempted: true, attempts: attempt, transport: 'plugin_storage_readback_after_owner' };
      }
      if (attempt < attempts) await delay(100);
    }
    const errorCode = text(lastError?.code || '').trim();
    const errorReason = text(lastError?.message || lastError || '').trim();
    return {
      ...(last && typeof last === 'object' ? last : {}),
      ok: false,
      available: Boolean(last) || !['HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT'].includes(errorCode),
      attempted,
      attempts,
      transport: lastTransport || 'hayaku_plugin_ipc',
      verified: false,
      adopted: false,
      durable: false,
      records: Math.max(0, Number(last?.records || 0) || 0),
      reason: text(last?.reason || errorReason || 'hayaku_adoption_not_verified'),
      diagnostics: {
        expectedRecords,
        observedRecords: Math.max(0, Number(last?.records || 0) || 0),
        targetChatMatches: text(last?.targetChatId || '') === targetChatId,
        transferMatches: text(last?.transferId || '') === transferId,
        sourceScopeMatches: text(last?.sourceScopeKey || '') === sourceScopeKey,
        ownerReceipt: hayakuMutationReceiptMatches(
          last,
          lastTransport,
          'adopt_session_handoff'
        ),
        errorCode
      }
    };
  };

  const dispatchHayakuAdoption = async (ipcAction, runtimeCapability, capsule) => {
    try {
      await ensureHayakuOwnerReady({ action: `HAYAKU ${ipcAction} 채택`, force: true });
      const result = await requestHayakuIpc(
        ipcAction,
        { capsule: clone(capsule, capsule) },
        { timeoutMs: 7000, ignoreCooldown: true, requireAuthenticatedSender: true }
      );
      return { available: true, attempted: true, transport: 'hayaku_plugin_ipc', result, error: null };
    } catch (error) {
      if (!['HAYAKU_OWNER_ABSENT', 'HAYAKU_OWNER_INCOMPATIBLE', 'HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT'].includes(text(error?.code))) {
        warn(`HAYAKU ${ipcAction} IPC failed`, error);
      }
      return { available: false, attempted: false, transport: 'hayaku_owner_unavailable', result: null, error };
    }
  };

  const requestImmediateHayakuColdStartAdoption = async capsule => {
    const existing = await verifyDurableHayakuColdStart(capsule);
    if (existing.verified === true) {
      return {
        ...existing,
        ok: true,
        adopted: false,
        pending: false,
        available: true,
        attempted: false,
        transport: 'plugin_storage_readback',
        reason: 'already_imported'
      };
    }
    const dispatched = await dispatchHayakuAdoption('adopt_cold_start', 'adoptColdStart', capsule);
    if (!dispatched.result) {
      return {
        ok: false,
        adopted: false,
        verified: false,
        durable: false,
        pending: true,
        queued: true,
        available: dispatched.available,
        attempted: dispatched.attempted,
        transport: dispatched.transport,
        reason: dispatched.error
          ? text(dispatched.error?.code || dispatched.error?.message || 'hayaku_adoption_unavailable')
          : 'queued_for_next_hayaku_request',
        records: 0
      };
    }
    try {
      const result = dispatched.result;
      const persistent = await verifyDurableHayakuColdStart(capsule);
      const verified = result?.verified === true
        && result?.durable === true
        && hayakuMutationReceiptMatches(result, dispatched.transport, 'adopt_cold_start')
        && persistent.verified === true;
      return {
        ok: verified,
        adopted: verified && result?.adopted === true,
        verified,
        durable: verified,
        pending: !verified,
        queued: !verified,
        available: true,
        attempted: true,
        transport: dispatched.transport,
        reason: text(verified ? persistent.reason : (result?.reason || persistent.reason || 'adoption_failed')),
        records: Math.max(0, Number(
          Number.isFinite(Number(persistent?.records)) ? persistent.records : result?.records
        ) || 0),
        activeRecords: Math.max(0, Number(
          Number.isFinite(Number(persistent?.activeRecords)) ? persistent.activeRecords : result?.activeRecords
        ) || 0),
        expectedRecords: Math.max(0, Number(
          Number.isFinite(Number(persistent?.expectedRecords)) ? persistent.expectedRecords : result?.expectedRecords
        ) || 0),
        scopeKey: text(result?.scopeKey || persistent.scopeKey || ''),
        epochId: text(result?.epochId || persistent.epochId || ''),
        transferId: text(result?.transferId || persistent.transferId || ''),
        sourceHash: text(result?.sourceHash || persistent.sourceHash || ''),
        mutation: text(result?.mutation || ''),
        ownerPluginId: text(result?.ownerPluginId || ''),
        authorizedRequester: text(result?.authorizedRequester || '')
      };
    } catch (error) {
      warn('HAYAKU cold-start immediate adoption failed', error);
      return {
        ok: false,
        adopted: false,
        verified: false,
        durable: false,
        pending: true,
        queued: true,
        available: true,
        attempted: true,
        transport: dispatched.transport,
        reason: text(error?.message || 'adoption_failed'),
        records: 0
      };
    }
  };

  const requestImmediateHayakuIncrementalRecoveryAdoption = async capsule => {
    const existing = await verifyDurableHayakuIncrementalRecovery(capsule);
    if (existing.verified === true) {
      return {
        ...existing,
        ok: true,
        adopted: false,
        pending: false,
        available: true,
        attempted: false,
        transport: 'plugin_storage_readback',
        reason: 'already_imported'
      };
    }
    const dispatched = await dispatchHayakuAdoption(
      'adopt_incremental_recovery',
      'adoptIncrementalRecovery',
      capsule
    );
    if (!dispatched.result) {
      return {
        ok: false,
        adopted: false,
        verified: false,
        durable: false,
        pending: true,
        queued: true,
        available: dispatched.available,
        attempted: dispatched.attempted,
        transport: dispatched.transport,
        reason: dispatched.error
          ? text(dispatched.error?.code || dispatched.error?.message || 'hayaku_adoption_unavailable')
          : 'queued_for_next_hayaku_request',
        records: 0
      };
    }
    try {
      const result = dispatched.result;
      const persistent = await verifyDurableHayakuIncrementalRecovery(capsule);
      const verified = result?.verified === true
        && result?.durable === true
        && hayakuMutationReceiptMatches(result, dispatched.transport, 'adopt_incremental_recovery')
        && persistent.verified === true;
      return {
        ok: verified,
        adopted: verified && result?.adopted === true,
        verified,
        durable: verified,
        pending: !verified,
        queued: !verified,
        available: true,
        attempted: true,
        transport: dispatched.transport,
        reason: text(verified ? persistent.reason : (result?.reason || persistent.reason || 'adoption_failed')),
        records: Math.max(0, Number(persistent.records || result?.records || 0) || 0),
        expectedRecords: Math.max(0, Number(persistent.expectedRecords || result?.expectedRecords || 0) || 0),
        scopeKey: text(result?.scopeKey || persistent.scopeKey || ''),
        recoveryId: text(result?.recoveryId || persistent.recoveryId || ''),
        sourceHash: text(result?.sourceHash || persistent.sourceHash || ''),
        recoveredTurns: Array.isArray(persistent?.recoveredTurns)
          ? persistent.recoveredTurns
          : (Array.isArray(result?.recoveredTurns) ? result.recoveredTurns : []),
        replacedRecords: Math.max(0, Number(persistent.replacedRecords || result?.replacedRecords || 0) || 0),
        diagnostics: persistent?.diagnostics || result?.diagnostics || null,
        retryable: result?.retryable === true,
        targetWorldlineStatus: text(result?.targetWorldlineStatus || ''),
        staleRepairTarget: result?.staleRepairTarget ? clone(result.staleRepairTarget, {}) : null,
        mutation: text(result?.mutation || ''),
        ownerPluginId: text(result?.ownerPluginId || ''),
        authorizedRequester: text(result?.authorizedRequester || '')
      };
    } catch (error) {
      warn('HAYAKU incremental recovery immediate adoption failed', error);
      return {
        ok: false,
        adopted: false,
        verified: false,
        durable: false,
        pending: true,
        queued: true,
        available: true,
        attempted: true,
        transport: dispatched.transport,
        reason: text(error?.message || 'adoption_failed'),
        records: 0
      };
    }
  };

  const HAYAKU_COLD_START_PROMPT = [
    'You build HAYAKU first-use continuity packets from raw chat evidence.',
    'Use the TARGET TURN as evidence to record; CONTEXT ONLY text may resolve references but must not add changes from other turns.',
    'Evidence rules:',
    '- Treat each user message as an attempted action, request, or intention.',
    '- Treat the following assistant message as the authoritative narrated outcome and world reaction.',
    '- If intention and outcome conflict, preserve the distinction and prefer the narrated outcome for established facts.',
    '- A trailing pending user message is not an accomplished fact; it may only become an open invitation.',
    '- Do not invent names, states, relationships, secrets, events, rules, or outcomes.',
    '- Preserve uncertainty when the chunk does not establish a fact.',
    '- Do not omit a distinct detail because it appears minor, repetitive, low-confidence, or unlikely to matter soon.',
    '- Preserve every established change, object, location, time, relationship, promise, rule, knowledge boundary, and continuity-relevant line of dialogue in this turn.',
    '- When evidence is weak, retain the detail with explicit uncertainty instead of deleting it.',
    '- If CONTEXT ONLY evidence is present, use it only to resolve names, pronouns, locations, and causal references. Record changes from TARGET TURN only.',
    '- Item shapes: character{name}; relation{from,to}; pov_memory{ownerEntityId,summary}; secret{summary}; critical_dialogue{text}. If an endpoint or owner is unknown, retain the evidence in summary_memory or scene_deltas without inventing one.',
    '- Put established future obligations in continuity_locks and unresolved choices in open_invitations.',
    'Return one JSON object only with exactly these top-level objects:',
    'meta, entity, world, narrative, planner, importance.',
    'Use this structure:',
    '{"meta":{"scene_id":"","turn_anchor":"","summary_memory":{"summary":"","recallAnchors":[],"recallAliases":{},"canonicalAnchors":[],"mentionedEntityNames":[],"directEvidenceSnippets":[],"related_refs":[],"confidence":0.0},"speaker_boundaries":[],"overpromotion_risks":[],"consent_memory":{},"confidence":0.0},"entity":{"characters":[],"relations":[],"pov_memories":[],"secrets":[]},"world":{"location":"","time":"","scene":"","weather":"","active_events":[],"historical_events":[],"world_rules":[],"offscreen_threads":[],"factions":[],"regions":[]},"narrative":{"scene_phase":"","current_arc":"","pacing":"","conflict_traces":[],"scene_deltas":[],"theme_motifs":[],"critical_dialogue":[]},"planner":{"continuity_locks":[],"do_not_resolve_yet":[],"consequence_ledger":[],"payoff_tracker":[],"open_invitations":[]},"importance":{"overall":0.0,"reason":[]}}',
    'Cover every established change in this single-turn chunk. JSON only.'
  ].join('\n');

  const HAYAKU_INCREMENTAL_RECOVERY_PROMPT = [
    'You reconstruct one missing HAYAKU continuity turn from raw user+assistant evidence.',
    'This is incremental recovery, not a cold start and not a rewrite of already covered turns.',
    'Use the TARGET TURN as evidence to record; CONTEXT ONLY text may resolve references but must not add changes from other turns.',
    'Evidence rules:',
    '- The user message is an attempted action, request, or intention.',
    '- The assistant message is the authoritative narrated outcome and world reaction.',
    '- Preserve the distinction when intention and outcome conflict.',
    '- Do not invent names, states, relationships, secrets, events, rules, or outcomes.',
    '- Preserve uncertainty when the turn does not establish a fact.',
    '- Do not omit a distinct detail because it appears minor, repetitive, low-confidence, or unlikely to matter soon.',
    '- Preserve every established change, object, location, time, relationship, promise, rule, knowledge boundary, and continuity-relevant line of dialogue in this turn.',
    '- When evidence is weak, retain the detail with explicit uncertainty instead of deleting it.',
    '- If CONTEXT ONLY evidence is present, use it only to resolve names, pronouns, locations, and causal references. Record changes from TARGET TURN only.',
    '- Item shapes: character{name}; relation{from,to}; pov_memory{ownerEntityId,summary}; secret{summary}; critical_dialogue{text}. If an endpoint or owner is unknown, retain the evidence in summary_memory or scene_deltas without inventing one.',
    '- Put established future obligations in continuity_locks and unresolved choices in open_invitations.',
    'Return one JSON object only with exactly these top-level objects:',
    'meta, entity, world, narrative, planner, importance.',
    'Use this structure:',
    '{"meta":{"scene_id":"","turn_anchor":"","summary_memory":{"summary":"","recallAnchors":[],"recallAliases":{},"canonicalAnchors":[],"mentionedEntityNames":[],"directEvidenceSnippets":[],"related_refs":[],"confidence":0.0},"speaker_boundaries":[],"overpromotion_risks":[],"consent_memory":{},"confidence":0.0},"entity":{"characters":[],"relations":[],"pov_memories":[],"secrets":[]},"world":{"location":"","time":"","scene":"","weather":"","active_events":[],"historical_events":[],"world_rules":[],"offscreen_threads":[],"factions":[],"regions":[]},"narrative":{"scene_phase":"","current_arc":"","pacing":"","conflict_traces":[],"scene_deltas":[],"theme_motifs":[],"critical_dialogue":[]},"planner":{"continuity_locks":[],"do_not_resolve_yet":[],"consequence_ledger":[],"payoff_tracker":[],"open_invitations":[]},"importance":{"overall":0.0,"reason":[]}}',
    'Cover every established change in this missing turn. JSON only.'
  ].join('\n');

  const hayakuAnalysisRepairPrompt = basePrompt => [
    basePrompt,
    '',
    'RECOVERY PASS:',
    '- The previous response could not be parsed or durably normalized.',
    '- Re-read the complete TARGET TURN and return one compact JSON object only.',
    '- Keep every distinct established fact, uncertainty, boundary, promise, and unresolved invitation.',
    '- Do not add commentary, Markdown fences, or text before or after the JSON object.'
  ].join('\n');
  const HAYAKU_COLD_START_REPAIR_PROMPT = hayakuAnalysisRepairPrompt(HAYAKU_COLD_START_PROMPT);
  const HAYAKU_INCREMENTAL_RECOVERY_REPAIR_PROMPT = hayakuAnalysisRepairPrompt(HAYAKU_INCREMENTAL_RECOVERY_PROMPT);
  const buildBridgeHayakuAuthoringPrompt = (basePrompt, packetAuthoring) => {
    const profile = normalizeHayakuPacketAuthoringProfile(
      packetAuthoring,
      text(packetAuthoring?.source || 'bridge_safe_fallback')
    );
    const aliasLanguages = profile.recallAliases.languages.join(', ');
    const canonicalPrefixes = profile.canonicalAnchors.prefixes.map(prefix => `${prefix}:`).join(', ');
    return [
      basePrompt,
      '',
      '[HAYAKU CANONICAL PACKET AUTHORING CONTRACT]',
      profile.humanReadableInstruction,
      ...profile.schemaInstructions,
      `Populate meta.summary_memory.recallAliases as an object with the language keys ${aliasLanguages}. Each language value must be an array containing one or two compact paraphrases of the same established summary fact.`,
      'The aliases are retrieval-only: add no fact, inference, outcome, relationship, secret, or knowledge transfer that is absent from the TARGET TURN. Do not flatten private POV or secret-holder boundaries into public aliases.',
      'Keep each canonical name or ref in its exact established spelling. A language alias may additionally include a plain transliteration, but it must not create a second identity.',
      `Use canonicalAnchors only with these HAYAKU-supported prefixes: ${canonicalPrefixes}`,
      'Do not emit next_direction, suggested_hooks, reasoning, validation commentary, prompt text, or unrealized futures.',
      `Authoring profile: schema=${profile.schema}; memoryLanguage=${profile.memoryLanguage}; contract=${profile.contractHash}.`,
      '[/HAYAKU CANONICAL PACKET AUTHORING CONTRACT]'
    ].join('\n');
  };
  const bridgeHayakuPromptSet = (kind, packetAuthoring) => {
    const profile = normalizeHayakuPacketAuthoringProfile(
      packetAuthoring,
      text(packetAuthoring?.source || 'bridge_safe_fallback')
    );
    const base = kind === 'incremental_recovery'
      ? HAYAKU_INCREMENTAL_RECOVERY_PROMPT
      : HAYAKU_COLD_START_PROMPT;
    const primary = buildBridgeHayakuAuthoringPrompt(base, profile);
    const repair = hayakuAnalysisRepairPrompt(primary);
    return {
      kind,
      profile,
      primary,
      repair,
      contractHash: stableHash64([kind, profile.contractHash, primary, repair].join('\u0001'))
    };
  };

  const messageRole = message => {
    const raw = text(message?.role || message?.type || '').trim().toLowerCase();
    if (raw === 'system') return 'system';
    if (['user', 'human'].includes(raw) || message?.isUser === true) return 'user';
    if (['assistant', 'ai', 'char', 'bot', 'model'].includes(raw) || message?.isUser === false) return 'assistant';
    if (raw) return 'system';
    return '';
  };
  const messageText = message => {
    const candidates = [message?.data, message?.content, message?.text, message?.message]
      .filter(value => value != null);
    const render = value => {
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value.map(part => text(part?.text ?? part?.content ?? part)).filter(Boolean).join('\n');
      if (value && typeof value === 'object') {
        try { return JSON.stringify(value); } catch (_) {}
      }
      return text(value);
    };
    const rendered = candidates.map(render);
    return rendered.find(value => text(value).trim()) ?? rendered[0] ?? '';
  };
  const stripInternalArtifacts = value => text(value)
    .replace(/<!--\s*HAYAKU_STATE_PACKET_START[\s\S]*?HAYAKU_STATE_PACKET_END\s*-->/gi, '')
    .replace(/<<<\s*HAYAKU_STATE_PACKET_START\s*>>>[\s\S]*?<<<\s*HAYAKU_STATE_PACKET_END\s*>>>/gi, '')
    .replace(/<!--\s*lmai_(?:hayaku|libra)[\s\S]*?-->/gi, '')
    .trim();

  const chunkEvidenceUnits = (units, options = {}) => {
    const keepTurnBoundaries = options.keepTurnBoundaries === true;
    const chunks = [];
    let current = null;
    const flush = () => {
      if (current?.text?.trim()) chunks.push(current);
      current = null;
    };
    for (const unit of Array.isArray(units) ? units : []) {
      const parts = [];
      // LIBRA's adaptive reanalysis keeps a completed U+A pair indivisible.
      // A large pair may exceed the preferred input budget, but slicing it at
      // an arbitrary character would separate an attempted action from its
      // authoritative narrated outcome.
      if (keepTurnBoundaries || unit.text.length <= COLD_START_CHUNK_CHARS) parts.push(unit.text);
      else {
        const budget = COLD_START_CHUNK_CHARS - 80;
        for (let offset = 0; offset < unit.text.length; offset += budget) {
          parts.push(`[Long turn part ${Math.floor(offset / budget) + 1}]\n${unit.text.slice(offset, offset + budget)}`);
        }
      }
      for (const part of parts) {
        if (keepTurnBoundaries && current && Number(current.endTurn || 0) !== Number(unit.turn || 0)) flush();
        const extra = current ? part.length + 7 : part.length;
        if (current && current.text.length + extra > COLD_START_CHUNK_CHARS) flush();
        if (!current) current = { text: '', startTurn: unit.turn, endTurn: unit.turn, includesPendingUser: false, messageIndexes: [] };
        current.text += `${current.text ? '\n\n---\n\n' : ''}${part}`;
        current.startTurn = Math.min(current.startTurn, unit.turn);
        current.endTurn = Math.max(current.endTurn, unit.turn);
        current.includesPendingUser ||= unit.pending === true;
        current.messageIndexes.push(...unit.indexes);
      }
    }
    flush();
    return chunks;
  };
  const priorTurnContextForChunk = (evidence, chunk, maxPriorTurns = 2) => {
    const targetTurn = Math.max(0, Number(chunk?.startTurn || 0) || 0);
    if (!targetTurn) return '';
    const floor = Math.max(0, targetTurn - Math.max(1, Number(maxPriorTurns || 2) || 2));
    return (Array.isArray(evidence?.allUnits) ? evidence.allUnits : evidence?.units || [])
      .filter(unit => (
        unit?.pending !== true
        && Number(unit?.turn || 0) >= floor
        && Number(unit?.turn || 0) < targetTurn
      ))
      .map(unit => text(unit?.text || '').trim())
      .filter(Boolean)
      .join('\n\n---\n\n');
  };

  const collectColdStartEvidence = chat => {
    const sourceRows = (Array.isArray(chat?.message) ? chat.message : [])
      .map((message, index) => ({
        index,
        id: text(message?.id || message?.messageId || message?.chatId || ''),
        role: messageRole(message),
        originalText: messageText(message),
        text: stripInternalArtifacts(messageText(message))
      }));
    const rows = sourceRows.filter(row => row.role && row.text);
    const skippedRows = sourceRows.filter(row => !row.role || !row.text).map(row => ({
      index: row.index,
      id: row.id,
      reason: !row.role
        ? 'unsupported_role'
        : text(row.originalText).trim() ? 'transport_only' : 'empty'
    }));
    const units = [];
    let pendingUsers = [];
    let completedTurns = 0;
    for (const row of rows) {
      if (row.role === 'user') {
        pendingUsers.push(row);
        continue;
      }
      if (row.role === 'system') {
        units.push({ turn: completedTurns, pending: false, indexes: [row.index], text: `[System context]\n${row.text}` });
        continue;
      }
      if (pendingUsers.length) {
        completedTurns += 1;
        units.push({
          turn: completedTurns,
          pending: false,
          indexes: [...pendingUsers.map(item => item.index), row.index],
          text: `[Turn ${completedTurns}]\n[User attempt]\n${pendingUsers.map(item => item.text).join('\n\n')}\n\n[Assistant outcome]\n${row.text}`
        });
        pendingUsers = [];
      } else {
        units.push({
          turn: completedTurns,
          pending: false,
          indexes: [row.index],
          text: `${completedTurns ? `[Assistant continuation after turn ${completedTurns}]` : '[Assistant opening]'}\n${row.text}`
        });
      }
    }
    if (pendingUsers.length) {
      units.push({
        turn: completedTurns + 1,
        pending: true,
        indexes: pendingUsers.map(item => item.index),
        text: `[Pending user input; not an established outcome]\n${pendingUsers.map(item => item.text).join('\n\n')}`
      });
    }
    // A range-wide packet allowed one omitted turn to make the whole range look
    // covered forever. Cold start therefore owns one analysis packet per U+A
    // turn (and one separate packet for a pending user boundary).
    const chunks = chunkEvidenceUnits(units, { keepTurnBoundaries: true });
    return {
      sourceRows,
      rows,
      units,
      chunks,
      completedTurns,
      pendingUserMessages: pendingUsers.length,
      skippedRows,
      sourceHash: stableHash64(sourceRows.map(row => [
        row.index,
        row.id,
        row.role || 'unsupported',
        row.text,
        text(row.originalText).trim() && !row.text ? 'transport_only' : ''
      ].join(':')).join('\n\n'))
    };
  };

  const compareEvidenceSourceSnapshot = (originalEvidence, latestChat) => {
    const originalRows = Array.isArray(originalEvidence?.sourceRows) ? originalEvidence.sourceRows : [];
    const latestEvidence = collectColdStartEvidence(latestChat);
    const latestRows = Array.isArray(latestEvidence.sourceRows) ? latestEvidence.sourceRows : [];
    if (latestRows.length < originalRows.length) {
      return {
        compatible: false,
        reason: 'source_messages_deleted',
        appendedMessageCount: 0,
        latestEvidence
      };
    }
    for (let index = 0; index < originalRows.length; index += 1) {
      const before = originalRows[index] || {};
      const after = latestRows[index] || {};
      const beforeTransportOnly = Boolean(text(before.originalText).trim() && !text(before.text).trim());
      const afterTransportOnly = Boolean(text(after.originalText).trim() && !text(after.text).trim());
      const stableId = !before.id || !after.id || text(before.id) === text(after.id);
      if (!stableId
        || Number(before.index) !== Number(after.index)
        || text(before.role) !== text(after.role)
        || text(before.text) !== text(after.text)
        || beforeTransportOnly !== afterTransportOnly) {
        return {
          compatible: false,
          reason: 'source_message_changed',
          changedMessageIndex: index,
          appendedMessageCount: Math.max(0, latestRows.length - originalRows.length),
          latestEvidence
        };
      }
    }
    const appendedMessageCount = Math.max(0, latestRows.length - originalRows.length);
    if (appendedMessageCount > 0 && Number(originalEvidence?.pendingUserMessages || 0) > 0) {
      return {
        compatible: false,
        reason: 'pending_turn_completed_during_analysis',
        appendedMessageCount,
        latestEvidence
      };
    }
    return {
      compatible: true,
      reason: appendedMessageCount ? 'prefix_unchanged_messages_appended' : 'source_unchanged',
      appendedMessageCount,
      latestEvidence
    };
  };

  const analysisIsRunning = () => Runtime.analysisTask?.active === true;
  const analysisProgressSnapshot = () => {
    if (!Runtime.analysisProgress) return null;
    const snapshot = clone(Runtime.analysisProgress, null);
    if (!snapshot) return null;
    snapshot.elapsedMs = Math.max(0, Number((snapshot.finishedAt || Date.now()) - snapshot.startedAt) || 0);
    return snapshot;
  };
  const scheduleAnalysisConsoleRender = () => {
    if (!Runtime.visible || !Runtime.root) return;
    Promise.resolve().then(() => {
      try { renderAnalysisConsole(); } catch (_) {}
    });
  };
  const updateAnalysisProgress = (taskId, event = {}) => {
    const progress = Runtime.analysisProgress;
    if (!progress || (taskId && progress.taskId !== taskId)) return null;
    const numericFields = [
      'totalChunks', 'verifiedChunks', 'failedChunks', 'attemptCount',
      'repairChunkCount', 'sourceFallbackChunkCount', 'reusedChunkCount',
      'appendedMessageCount'
    ];
    for (const key of numericFields) {
      if (event[key] != null) progress[key] = Math.max(0, Number(event[key]) || 0);
    }
    if (Array.isArray(event.runningChunks)) {
      progress.runningChunks = [...new Set(event.runningChunks.map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
    }
    for (const key of ['state', 'phase', 'mode', 'runId']) {
      if (event[key] != null && text(event[key]).trim()) progress[key] = text(event[key]).trim();
    }
    if (event.error != null) progress.error = text(event.error);
    progress.updatedAt = Number(event.at || Date.now()) || Date.now();
    const message = text(event.message || '').trim();
    if (message) {
      const previous = progress.logs.at(-1);
      if (!previous || previous.message !== message || previous.type !== text(event.type || 'status')) {
        progress.logs.push({
          at: progress.updatedAt,
          type: text(event.type || 'status'),
          message
        });
        if (progress.logs.length > 160) progress.logs.splice(0, progress.logs.length - 160);
      }
    }
    scheduleAnalysisConsoleRender();
    return analysisProgressSnapshot();
  };
  const notifyAnalysisProgress = (callback, event) => {
    if (typeof callback !== 'function') return;
    try { callback({ at: Date.now(), ...event }); } catch (error) { warn('analysis progress callback failed', error); }
  };
  const reportAnalysisRun = (callback, kind, run, event = {}) => {
    const chunks = Array.isArray(run?.chunks) ? run.chunks : [];
    notifyAnalysisProgress(callback, {
      kind,
      totalChunks: chunks.length,
      verifiedChunks: chunks.filter(chunk => chunk?.status === 'verified').length,
      failedChunks: chunks.filter(chunk => chunk?.status === 'failed').length,
      runningChunks: chunks.filter(chunk => chunk?.status === 'running').map(chunk => Number(chunk.ordinal || 0)).filter(Boolean),
      attemptCount: chunks.reduce((sum, chunk) => sum + Math.max(0, Number(chunk?.attempts || 0) || 0), 0),
      repairChunkCount: chunks.filter(chunk => chunk?.recoveryMode === 'repair').length,
      sourceFallbackChunkCount: chunks.filter(chunk => chunk?.recoveryMode === 'source_fallback').length,
      ...event
    });
  };
  const createAnalysisProgress = (kind, mode) => {
    const startedAt = Date.now();
    const taskId = `lihafl-analysis-${stableHash64(`${kind}|${mode}|${startedAt}|${Math.random()}`)}`;
    Runtime.analysisProgress = {
      taskId,
      kind,
      mode,
      state: 'preparing',
      phase: '대상 확인',
      startedAt,
      updatedAt: startedAt,
      finishedAt: 0,
      totalChunks: 0,
      verifiedChunks: 0,
      failedChunks: 0,
      runningChunks: [],
      attemptCount: 0,
      repairChunkCount: 0,
      sourceFallbackChunkCount: 0,
      reusedChunkCount: 0,
      appendedMessageCount: 0,
      error: '',
      logs: [{ at: startedAt, type: 'start', message: `${kind === 'cold_start' ? '콜드스타트' : '증분 재분석'} 작업을 준비합니다.` }]
    };
    return Runtime.analysisProgress;
  };
  const startBackgroundAnalysisTask = (kind, mode, runner) => {
    if (analysisIsRunning()) throw new Error('이미 콜드스타트 또는 증분 재분석이 실행 중입니다.');
    const progress = createAnalysisProgress(kind, mode);
    const task = {
      id: progress.taskId,
      kind,
      mode,
      active: true,
      startedAt: progress.startedAt,
      promise: null,
      result: null,
      error: null
    };
    Runtime.analysisTask = task;
    const onProgress = event => updateAnalysisProgress(task.id, event);
    scheduleAnalysisConsoleRender();
    task.promise = Promise.resolve()
      .then(() => runner(onProgress))
      .then(result => {
        task.result = result;
        updateAnalysisProgress(task.id, {
          type: 'complete',
          state: 'completed',
          phase: result?.reflected ? '원장 반영 완료' : '분석 완료 · 원장 반영 대기',
          message: result?.reflected
            ? '분석 결과가 HAYAKU canonical 원장에 반영되고 검증되었습니다.'
            : '분석 캡슐을 검증해 저장했습니다. 다음 HAYAKU 요청에서 자동 채택됩니다.'
        });
        return { ok: true, result };
      })
      .catch(error => {
        task.error = error;
        updateAnalysisProgress(task.id, {
          type: 'failed',
          state: 'failed',
          phase: '작업 중단',
          error: compact(error?.message || error, 640),
          message: `작업 실패: ${compact(error?.message || error, 640)}`
        });
        return { ok: false, error };
      })
      .finally(async () => {
        task.active = false;
        task.finishedAt = Date.now();
        if (Runtime.analysisProgress?.taskId === task.id) {
          Runtime.analysisProgress.finishedAt = task.finishedAt;
          Runtime.analysisProgress.runningChunks = [];
        }
        scheduleAnalysisConsoleRender();
        if (Runtime.visible) {
          try {
            if (kind === 'cold_start') await refreshColdStart();
            else await refreshIncrementalRecovery();
            await refreshHayaku();
          } catch (_) {}
          scheduleAnalysisConsoleRender();
        }
      });
    return task;
  };

  const resolveTurnNavigationTarget = (chat, requestedTurn) => {
    const evidence = collectColdStartEvidence(chat);
    const maxTurn = Math.max(0, Number(evidence.completedTurns || 0) || 0);
    const numeric = text(requestedTurn).trim() ? Number(requestedTurn) : Number.NaN;
    if (!Number.isFinite(numeric)) {
      return { ok: false, reason: 'turn_number_required', requestedTurn, turn: 0, maxTurn, messageIndex: -1 };
    }
    if (maxTurn < 1) {
      return { ok: false, reason: 'completed_turn_unavailable', requestedTurn: numeric, turn: 0, maxTurn, messageIndex: -1 };
    }
    const turn = Math.min(maxTurn, Math.max(1, Math.floor(numeric)));
    const unit = evidence.units.find(entry => (
      entry?.pending !== true
      && Number(entry?.turn || 0) === turn
      && Array.isArray(entry?.indexes)
      && entry.indexes.length > 1
    )) || evidence.units.find(entry => (
      entry?.pending !== true
      && Number(entry?.turn || 0) === turn
      && Array.isArray(entry?.indexes)
      && entry.indexes.length
    ));
    const messageIndex = Math.max(-1, Number(unit?.indexes?.[0] ?? -1) || 0);
    return {
      ok: messageIndex >= 0,
      reason: messageIndex >= 0 ? (turn === Math.floor(numeric) ? 'exact' : 'clamped') : 'turn_message_not_found',
      requestedTurn: numeric,
      turn,
      maxTurn,
      messageIndex,
      assistantMessageIndex: Math.max(messageIndex, Number(unit?.indexes?.at?.(-1) ?? messageIndex) || messageIndex)
    };
  };

  const safeElementArray = async collection => {
    if (!collection) return [];
    if (Array.isArray(collection)) return collection;
    if (typeof collection.length === 'function' && typeof collection.at === 'function') {
      const length = Math.max(0, Number(await collection.length()) || 0);
      const out = [];
      for (let index = 0; index < length; index += 1) out.push(await collection.at(index));
      return out.filter(Boolean);
    }
    if (Number.isFinite(Number(collection.length))) return Array.from(collection);
    return [];
  };

  const scrollToChatMessageIndex = async messageIndex => {
    const api = liveApi(['getRootDocument']);
    if (!api || typeof api.getRootDocument !== 'function') {
      throw new Error('RisuAI root document API is unavailable.');
    }
    const rootDocument = await api.getRootDocument();
    if (!rootDocument || typeof rootDocument.querySelector !== 'function') {
      throw new Error('RisuAI chat document could not be opened.');
    }
    const selector = `.default-chat-screen [data-chat-index="${Math.max(0, Number(messageIndex || 0) || 0)}"]`;
    let target = await rootDocument.querySelector(selector);
    for (let attempt = 0; !target && attempt < 60; attempt += 1) {
      const collection = typeof rootDocument.querySelectorAll === 'function'
        ? await rootDocument.querySelectorAll('.default-chat-screen [data-chat-index]')
        : null;
      const rendered = await safeElementArray(collection);
      let oldest = null;
      let oldestIndex = Number.MAX_SAFE_INTEGER;
      for (const element of rendered) {
        const value = Number(await element?.getAttribute?.('data-chat-index'));
        if (Number.isFinite(value) && value < oldestIndex) {
          oldest = element;
          oldestIndex = value;
        }
      }
      if (!oldest || typeof oldest.scrollIntoView !== 'function') break;
      await oldest.scrollIntoView({ behavior: 'auto', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 100));
      target = await rootDocument.querySelector(selector);
    }
    if (!target || typeof target.scrollIntoView !== 'function') {
      throw new Error('The requested turn could not be rendered in the current chat.');
    }
    await closeUi();
    await target.scrollIntoView({ behavior: 'auto', block: 'start' });
    return { ok: true, messageIndex };
  };

  const jumpToHayakuTurn = async requestedTurn => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 턴 이동', force: true });
    const context = await getCurrentContext();
    const target = resolveTurnNavigationTarget(context.chat, requestedTurn);
    Runtime.hayakuMaxTurn = target.maxTurn;
    if (!target.ok) throw new Error(target.reason);
    await scrollToChatMessageIndex(target.messageIndex);
    return target;
  };

  const packetSourceTurnRange = record => {
    const packet = parseJson(text(record?.raw || ''), null);
    const meta = objectValue(packet?.meta);
    const range = objectValue(meta.source_turn_range || meta.sourceTurnRange);
    const end = Math.max(0, Number(range.end || meta.turn_anchor || record?.recoveryTurnEnd || 0) || 0);
    const start = Math.max(0, Number(range.start || record?.recoveryTurnStart || end || 0) || 0);
    return {
      start,
      end,
      packetType: text(meta.packet_type || meta.packetType || record?.packetType || '').trim().toLowerCase()
    };
  };

  const activeHayakuTombstones = hayaku => (
    Array.isArray(hayaku?.ledger?.tombstones) ? hayaku.ledger.tombstones : []
  ).filter(tombstone => (
    tombstone
    && typeof tombstone === 'object'
    && tombstone.active !== false
    && !(Number(tombstone.restoredAt || 0) > 0)
    && text(tombstone.slotId || '').trim()
  ));

  const hayakuTombstoneIsUserSuppressed = tombstone => {
    const intent = text(tombstone?.intent || '').trim().toLowerCase();
    if (intent) return intent === 'user_suppressed';
    return ['bridge_packet_viewer_delete', 'explicit_forget', 'user_suppressed']
      .includes(text(tombstone?.reason || '').trim().toLowerCase());
  };

  const hayakuTombstoneRecord = (tombstone, allRecords = []) => {
    const recordId = text(tombstone?.recordId || '').trim();
    const slotId = text(tombstone?.slotId || '').trim();
    const variantHash = text(tombstone?.variantHash || '').trim();
    return allRecords.find(record => (
      (recordId && text(record?.recordId || '').trim() === recordId)
      || (
        slotId
        && hayakuRecordSlotId(record) === slotId
        && (!variantHash || text(record?.hash || '').trim() === variantHash)
      )
    )) || null;
  };

  const hayakuTombstoneTurnRange = (tombstone, allRecords = []) => {
    const sourceRecord = hayakuTombstoneRecord(tombstone, allRecords);
    const recordRange = sourceRecord ? packetSourceTurnRange(sourceRecord) : { start: 0, end: 0 };
    const targetPairIndex = Math.max(0, Number(
      tombstone?.targetPairIndex || sourceRecord?.targetPairIndex || 0
    ) || 0);
    let start = Math.max(0, Number(
      tombstone?.turnStart || tombstone?.sourceTurnStart || recordRange.start || targetPairIndex
    ) || 0);
    let end = Math.max(0, Number(
      tombstone?.turnEnd || tombstone?.sourceTurnEnd || recordRange.end || targetPairIndex
    ) || 0);
    if (!start && end) start = end;
    if (!end && start) end = start;
    if (end < start) [start, end] = [end, start];
    return { start, end, targetPairIndex };
  };

  const hayakuTombstoneMatchesActiveWorldline = (hayaku, tombstone, allRecords = []) => {
    const sourceRecord = hayakuTombstoneRecord(tombstone, allRecords);
    if (!sourceRecord) return true;
    const nodes = Array.isArray(hayaku?.ledger?.worldline?.nodes)
      ? hayaku.ledger.worldline.nodes
      : [];
    if (!nodes.length) return true;
    const ownerTurnNodeId = text(sourceRecord?.ownerTurnNodeId || sourceRecord?.ownerNodeId || '').trim();
    if (ownerTurnNodeId) {
      const ownerNode = nodes.find(node => text(node?.turnNodeId || '').trim() === ownerTurnNodeId);
      if (ownerNode) return text(ownerNode.status || '').trim() === 'active';
    }
    const pairIndex = Math.max(0, Number(
      sourceRecord?.targetPairIndex || tombstone?.targetPairIndex || 0
    ) || 0);
    if (!pairIndex) return true;
    const activeNode = nodes.find(node => (
      text(node?.status || '').trim() === 'active'
      && Math.max(0, Number(node?.pairIndex || node?.activeOrdinal || 0) || 0) === pairIndex
    ));
    if (!activeNode) return false;
    const userHash = text(sourceRecord?.userHash || sourceRecord?.userMessageIdHash || '').trim();
    const assistantHash = text(sourceRecord?.assistantVisibleHash || '').trim();
    if (userHash && text(activeNode?.userHash || '').trim() && userHash !== text(activeNode.userHash).trim()) return false;
    if (assistantHash && text(activeNode?.assistantVisibleHash || '').trim()
      && assistantHash !== text(activeNode.assistantVisibleHash).trim()) return false;
    return true;
  };

  const hayakuTurnCoverage = (hayaku, completedTurns = 0) => {
    const covered = new Set();
    const maxTurn = Math.max(0, Number(completedTurns || 0) || 0);
    const allRecords = Array.isArray(hayaku?.allRecords) ? hayaku.allRecords : [];
    const effective = Array.isArray(hayaku?.records) ? hayaku.records : [];
    const accountingRecords = allRecords.length ? allRecords : effective;
    const records = [...effective];
    const activeColdStartEpochId = text(hayaku?.ledger?.coldStart?.activeEpochId || '').trim();
    const expectedColdRecords = Math.max(0, Number(hayaku?.ledger?.coldStart?.recordCount || 0) || 0);
    const activeColdRecords = accountingRecords.filter(record => (
      text(record?.captureSource).includes('cold_start')
      && text(record?.recordState) === 'historical'
      && (!activeColdStartEpochId || text(record?.coldStartEpochId) === activeColdStartEpochId)
    ));
    const coldGroupComplete = expectedColdRecords > 0 && activeColdRecords.length === expectedColdRecords;
    const activeRecoveryId = text(hayaku?.ledger?.incrementalRecovery?.lastRecoveryId || '').trim();
    const activeRecoverySourceHash = text(hayaku?.ledger?.incrementalRecovery?.sourceHash || '').trim();
    const expectedRecoveryRecords = Math.max(0, Number(hayaku?.ledger?.incrementalRecovery?.recordCount || 0) || 0);
    const storedRecoveryRecords = accountingRecords.filter(record => (
      text(record?.captureSource) === 'bridge_incremental_recovery'
      && (!activeRecoveryId || text(record?.incrementalRecoveryRunId) === activeRecoveryId)
      && (!activeRecoverySourceHash || text(record?.incrementalRecoverySourceHash) === activeRecoverySourceHash)
    ));
    const activeRecoveryRecords = storedRecoveryRecords.filter(record => (
      text(record?.recordState) === 'active'
    ));
    const recoveryGroupComplete = expectedRecoveryRecords > 0
      && storedRecoveryRecords.length === expectedRecoveryRecords;
    for (const record of allRecords) {
      const source = text(record?.captureSource);
      const state = text(record?.recordState);
      const eligibleColdStart = source.includes('cold_start')
        && state === 'historical'
        && (!activeColdStartEpochId || text(record?.coldStartEpochId) === activeColdStartEpochId);
      const eligibleIncremental = source === 'bridge_incremental_recovery'
        && state === 'active';
      if (eligibleColdStart || eligibleIncremental) {
        if (!records.some(candidate => candidate?.recordId === record?.recordId && candidate?.hash === record?.hash)) records.push(record);
      }
    }
    for (const record of records) {
      const state = text(record?.recordState || '').trim();
      if (['superseded', 'orphaned', 'quarantined', 'detached', 'tombstoned'].includes(state)) continue;
      const source = text(record?.captureSource || '').trim();
      if (source.includes('cold_start') && (
        !coldGroupComplete
        || (activeColdStartEpochId && text(record?.coldStartEpochId) !== activeColdStartEpochId)
      )) continue;
      if (source === 'bridge_incremental_recovery'
        && activeRecoveryId
        && text(record?.incrementalRecoveryRunId) === activeRecoveryId
        && (
          !recoveryGroupComplete
          || (activeRecoverySourceHash
            && text(record?.incrementalRecoverySourceHash) !== activeRecoverySourceHash)
        )) continue;
      if (source === 'bridge_incremental_recovery' && state !== 'active') continue;
      const range = packetSourceTurnRange(record);
      if (source.includes('cold_start') || source === 'bridge_incremental_recovery') {
        let rangeEnd = Math.min(maxTurn, range.end);
        if (range.packetType === 'cold_start_pending_boundary') rangeEnd = Math.max(0, rangeEnd - 1);
        for (let turn = Math.max(1, range.start); turn <= rangeEnd; turn += 1) covered.add(turn);
        continue;
      }
      if (record?.inheritedSessionHistory === true || record?.memoryClass === 'historical') continue;
      const pairIndex = Math.max(0, Number(record?.targetPairIndex || 0) || 0);
      if (pairIndex > 0 && pairIndex <= maxTurn) covered.add(pairIndex);
    }
    const coveredTurns = [...covered].sort((a, b) => a - b);
    const uncoveredTurns = [];
    for (let turn = 1; turn <= maxTurn; turn += 1) {
      if (!covered.has(turn)) uncoveredTurns.push(turn);
    }
    const userSuppressed = new Set();
    for (const tombstone of activeHayakuTombstones(hayaku)) {
      if (!hayakuTombstoneIsUserSuppressed(tombstone)) continue;
      if (!hayakuTombstoneMatchesActiveWorldline(hayaku, tombstone, allRecords)) continue;
      const range = hayakuTombstoneTurnRange(tombstone, allRecords);
      for (let turn = Math.max(1, range.start); turn <= Math.min(maxTurn, range.end); turn += 1) {
        if (!covered.has(turn)) userSuppressed.add(turn);
      }
    }
    const userSuppressedTurns = [...userSuppressed].sort((a, b) => a - b);
    const captureMissingTurns = uncoveredTurns.filter(turn => !userSuppressed.has(turn));
    return {
      completedTurns: maxTurn,
      coveredTurns,
      uncoveredTurns,
      captureMissingTurns,
      userSuppressedTurns,
      missingTurns: captureMissingTurns,
      groupDiagnostics: {
        activeColdStartEpochId,
        expectedColdRecords,
        activeColdRecords: activeColdRecords.length,
        coldGroupComplete,
        activeRecoveryId,
        expectedRecoveryRecords,
        storedRecoveryRecords: storedRecoveryRecords.length,
        activeRecoveryRecords: activeRecoveryRecords.length,
        recoveryGroupComplete
      },
      coverageHash: stableHash64([
        maxTurn,
        coveredTurns.join(','),
        captureMissingTurns.join(','),
        userSuppressedTurns.join(',')
      ].join('\n'))
    };
  };

  const collectIncrementalRecoveryEvidence = (chat, hayaku, options = {}) => {
    const base = collectColdStartEvidence(chat);
    const coverage = hayakuTurnCoverage(hayaku, base.completedTurns);
    const rawTargetTurns = Array.isArray(options.targetTurns) ? options.targetTurns : [];
    const normalizedTargets = rawTargetTurns.map(value => Math.max(0, Number(value || 0) || 0));
    const requestedTurns = [...new Set(normalizedTargets
      .filter(turn => turn > 0 && turn <= base.completedTurns))].sort((a, b) => a - b);
    const rejectedTargets = normalizedTargets.filter(turn => turn <= 0 || turn > base.completedTurns);
    const recoveryTurns = rawTargetTurns.length ? requestedTurns : coverage.missingTurns;
    const missing = new Set(recoveryTurns);
    const units = base.units.filter(unit => (
      unit.pending !== true
      && Number(unit.turn || 0) > 0
      && missing.has(Number(unit.turn || 0))
    ));
    const chunks = chunkEvidenceUnits(units, { keepTurnBoundaries: true });
    const evidencedTurns = new Set(units.map(unit => Number(unit?.turn || 0)).filter(Boolean));
    const missingEvidenceTurns = recoveryTurns.filter(turn => !evidencedTurns.has(turn));
    return {
      ...base,
      allUnits: base.units,
      units,
      chunks,
      coverage,
      requestedTurns,
      rejectedTargets,
      missingEvidenceTurns,
      recoveryTurns,
      sourceHash: stableHash64([
        base.sourceHash,
        coverage.coverageHash,
        requestedTurns.join(','),
        chunks.map(chunk => `${chunk.startTurn}-${chunk.endTurn}:${chunk.text}`).join('\n\n')
      ].join('\u0002'))
    };
  };

  const extractJsonObject = value => {
    const source = text(value).replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, '').trim();
    const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || source;
    const direct = parseJson(fenced, null);
    if (direct) return direct;
    const start = fenced.indexOf('{');
    const end = fenced.lastIndexOf('}');
    return start >= 0 && end > start ? parseJson(fenced.slice(start, end + 1), null) : null;
  };
  const objectValue = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const PACKET_ITEM_HINT_KEYS = new Set([
    'id', 'ref', 'name', 'title', 'label', 'summary', 'text', 'rawText',
    'from', 'to', 'source', 'target', 'owner', 'ownerEntityId', 'type',
    'state', 'status', 'event', 'fact', 'rule', 'quote', 'dialogue'
  ]);
  const arrayValue = value => {
    if (value == null) return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== 'object') return [value];
    const entries = Object.entries(value);
    if (!entries.length) return [];
    if (entries.some(([key]) => PACKET_ITEM_HINT_KEYS.has(key))) return [value];
    // Providers sometimes emit a keyed object instead of an array. Preserve
    // every keyed entry instead of silently replacing the collection with [].
    return entries.map(([ref, item]) => (
      item && typeof item === 'object' && !Array.isArray(item)
        ? { ref, ...item }
        : { ref, summary: text(item), value: item }
    ));
  };
  const mergeArrayValues = (...values) => values.flatMap(arrayValue);
  const recallAliasLeafValues = value => {
    if (value == null) return [];
    if (Array.isArray(value)) return value.flatMap(recallAliasLeafValues);
    if (value && typeof value === 'object') return Object.values(value).flatMap(recallAliasLeafValues);
    const alias = compact(value, 420);
    return alias ? [alias] : [];
  };
  const normalizeBridgeRecallAliases = summary => {
    const source = summary?.recallAliases
      ?? summary?.recall_aliases
      ?? summary?.multilingualRecallAnchors
      ?? summary?.multilingual_recall_anchors
      ?? {};
    const normalized = {};
    if (source && typeof source === 'object' && !Array.isArray(source)) {
      Object.entries(source).forEach(([key, value]) => {
        const aliases = [...new Set(recallAliasLeafValues(value))].slice(0, 4);
        if (aliases.length) normalized[text(key).trim() || 'aliases'] = aliases;
      });
      return normalized;
    }
    const aliases = [...new Set(recallAliasLeafValues(source))].slice(0, 8);
    return aliases.length ? { aliases } : {};
  };
  const shapedArrayValues = (kind, ...values) => mergeArrayValues(...values).map(raw => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      const body = text(raw);
      if (kind === 'character') return { name: body, summary: body };
      if (kind === 'pov_memory') return { summary: body, text: body };
      if (kind === 'secret') return { summary: body, text: body };
      if (kind === 'critical_dialogue') return { text: body, summary: body };
      return raw;
    }
    const item = { ...raw };
    if (kind === 'character' && !text(item.name).trim()) {
      item.name = item.title || item.label || item.id || item.ref || '';
    }
    if (kind === 'relation') {
      const endpoints = text(item.ref || item.id || '').split(/\s*(?:->|→|↔|<->|\|)\s*/).filter(Boolean);
      if (!text(item.from).trim()) item.from = item.source || item.entityA || item.a || item.subject || endpoints[0] || '';
      if (!text(item.to).trim()) item.to = item.target || item.entityB || item.b || item.object || endpoints[1] || '';
    }
    if (kind === 'pov_memory') {
      if (!text(item.ownerEntityId).trim()) {
        item.ownerEntityId = item.ownerEntity || item.owner || item.entity || item.character || item.characterName || item.ref || '';
      }
      if (!text(item.summary).trim()) {
        item.summary = item.text || item.rawText || item.memory || item.content || item.description || '';
      }
    }
    if (kind === 'secret' && !text(item.summary).trim()) {
      item.summary = item.text || item.rawText || item.content || item.description || item.title || item.secret || item.fact || item.detail || '';
    }
    if (kind === 'critical_dialogue' && !text(item.text).trim()) {
      item.text = item.quote || item.dialogue || item.line || item.content || item.summary || item.detail || '';
    }
    return item;
  });
  const semanticValuePresent = value => {
    if (value == null) return false;
    if (typeof value === 'string') return Boolean(value.trim());
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.some(semanticValuePresent);
    if (typeof value === 'object') {
      return Object.entries(value).some(([key, item]) => (
        !['confidence', 'importance', 'salience', 'overall'].includes(key)
        && semanticValuePresent(item)
      ));
    }
    return Boolean(text(value).trim());
  };
  const bridgePacketHasSemanticPayload = packet => {
    const summary = objectValue(packet?.meta?.summary_memory);
    const world = objectValue(packet?.world);
    const narrative = objectValue(packet?.narrative);
    const planner = objectValue(packet?.planner);
    return Boolean(
      text(summary.summary).trim()
      || semanticValuePresent(mergeArrayValues(
        summary.recallAnchors,
        summary.canonicalAnchors,
        summary.mentionedEntityNames,
        summary.directEvidenceSnippets,
        packet?.entity?.characters,
        packet?.entity?.relations,
        packet?.entity?.pov_memories,
        packet?.entity?.secrets,
        world.active_events,
        world.historical_events,
        world.world_rules,
        world.offscreen_threads,
        world.factions,
        world.regions,
        narrative.conflict_traces,
        narrative.scene_deltas,
        narrative.theme_motifs,
        narrative.critical_dialogue,
        planner.continuity_locks,
        planner.do_not_resolve_yet,
        planner.consequence_ledger,
        planner.payoff_tracker,
        planner.open_invitations,
        packet?.importance?.reason
      ))
      || [
        world.location, world.time, world.scene, world.weather,
        narrative.scene_phase, narrative.current_arc, narrative.pacing
      ].some(value => text(value).trim())
    );
  };
  const rawEvidenceSegments = (value, maxCodePoints = 1200) => {
    const points = Array.from(text(value).trim());
    const out = [];
    for (let offset = 0; offset < points.length; offset += maxCodePoints) {
      out.push(points.slice(offset, offset + maxCodePoints).join(''));
    }
    return out;
  };
  const ensureBridgePacketSemanticPayload = (packet, chunk) => {
    if (bridgePacketHasSemanticPayload(packet)) return false;
    const rawEvidence = text(chunk?.text || '').trim();
    const turnStart = Math.max(0, Number(chunk?.startTurn || 0) || 0);
    const turnEnd = Math.max(turnStart, Number(chunk?.endTurn || turnStart) || turnStart);
    packet.meta.summary_memory.summary = compact(rawEvidence, 700);
    packet.meta.summary_memory.recallAnchors = mergeArrayValues(
      packet.meta.summary_memory.recallAnchors,
      `raw evidence turn ${turnStart}-${turnEnd}`
    );
    packet.meta.summary_memory.canonicalAnchors = mergeArrayValues(
      packet.meta.summary_memory.canonicalAnchors,
      `event:raw_evidence_turn_${turnEnd}`
    );
    packet.meta.summary_memory.confidence = 0.35;
    packet.meta.confidence = 0.35;
    packet.meta.analysis_status = 'raw_evidence_fallback';
    packet.meta.source_evidence_hash = stableHash64(rawEvidence);
    packet.narrative.scene_deltas = rawEvidenceSegments(rawEvidence).map((body, index) => ({
      id: `raw_evidence:${turnStart}:${turnEnd}:${index + 1}`,
      type: 'raw_evidence_fallback',
      summary: body,
      text: body,
      confidence: 0.35,
      time_scope: 'past'
    }));
    return true;
  };
  const normalizeColdStartPacket = (candidate, chunk, context) => {
    const source = objectValue(candidate?.packet || candidate);
    const summary = objectValue(source?.meta?.summary_memory || source?.meta?.summaryMemory);
    const entity = objectValue(source.entity || source.entities);
    const world = objectValue(source.world);
    const narrative = objectValue(source.narrative);
    const planner = objectValue(source.planner);
    const sourceTurnIndex = Math.max(0, Number(chunk.endTurn || 0) || 0);
    const providerSceneId = text(source?.meta?.scene_id || source?.meta?.sceneId).trim();
    const providerTurnAnchor = text(source?.meta?.turn_anchor || source?.meta?.turnAnchor).trim();
    const packet = {
      ...source,
      meta: {
        ...objectValue(source.meta),
        schema: 'hayaku_packet_v1',
        packet_type: chunk.includesPendingUser ? 'cold_start_pending_boundary' : 'cold_start_snapshot',
        packet_schema_rev: 2,
        ledger_profile: COLD_START_SCHEMA,
        cold_start_source: 'CHAT_TRANSCRIPT_COLD_START',
        cold_start_executor: 'MEMORY_SESSION_BRIDGE_PROVIDER',
        generative_llm_calls: true,
        automatic_repair: context?.automaticRepair === true,
        repair_target: context?.repairTarget ? clone(context.repairTarget, {}) : undefined,
        scene_id: providerSceneId || `bridge-hayaku-scene-${stableHash64(
          text(world.location || world.scene || 'unspecified_scene').trim().toLowerCase()
        )}`,
        turn_anchor: providerTurnAnchor || compact(summary.summary || `turn:${sourceTurnIndex}`, 240),
        source_turn_index: sourceTurnIndex,
        source_turn_range: {
          start: Math.max(0, Number(chunk.startTurn || 0) || 0),
          end: Math.max(0, Number(chunk.endTurn || 0) || 0)
        },
        source_message_indexes: [...new Set(arrayValue(chunk.messageIndexes).map(value => Math.max(0, Number(value || 0) || 0)))],
        summary_memory: {
          ...summary,
          summary: text(summary.summary || '').trim(),
          recallAnchors: mergeArrayValues(summary.recallAnchors, summary.recall_anchors),
          recallAliases: normalizeBridgeRecallAliases(summary),
          canonicalAnchors: mergeArrayValues(
            summary.canonicalAnchors,
            summary.canonical_anchors,
            summary.canonicalTokens,
            summary.canonical_tokens
          ),
          mentionedEntityNames: mergeArrayValues(
            summary.mentionedEntityNames,
            summary.mentioned_entity_names
          ),
          directEvidenceSnippets: mergeArrayValues(
            summary.directEvidenceSnippets,
            summary.direct_evidence_snippets
          ),
          related_refs: mergeArrayValues(
            summary.related_refs,
            summary.relatedRefs,
            summary.source_refs,
            summary.sourceRefs
          ),
          confidence: Math.max(0, Math.min(1, Number(summary.confidence ?? source?.meta?.confidence ?? 0.7) || 0.7))
        },
        speaker_boundaries: mergeArrayValues(
          source?.meta?.speaker_boundaries,
          source?.meta?.speakerBoundaries
        ),
        overpromotion_risks: mergeArrayValues(
          source?.meta?.overpromotion_risks,
          source?.meta?.overpromotionRisks,
          source?.meta?.false_inferences,
          source?.meta?.falseInferences
        )
      },
      entity: {
        ...entity,
        characters: shapedArrayValues('character', entity.characters, entity.character, entity.people, source.characters, source.people),
        relations: shapedArrayValues('relation', entity.relations, entity.relationships, source.relations, source.relationships),
        pov_memories: shapedArrayValues('pov_memory',
          entity.pov_memories,
          entity.povMemories,
          entity.entityMemories,
          entity.entity_memories,
          entity.knowledge,
          source.povMemories,
          source.entityMemories,
          source.entity_knowledge
        ),
        secrets: shapedArrayValues('secret',
          entity.secrets,
          entity.secret_boundaries,
          entity.secretBoundaries,
          entity.hiddenKnowledge,
          entity.privateThoughts,
          source.secrets,
          source.hiddenKnowledge,
          source.privateThoughts
        )
      },
      world: {
        ...world,
        active_events: mergeArrayValues(world.active_events, world.activeEvents, world.events),
        historical_events: mergeArrayValues(world.historical_events, world.historicalEvents),
        world_rules: mergeArrayValues(world.world_rules, world.worldRules, world.rules),
        offscreen_threads: mergeArrayValues(world.offscreen_threads, world.offscreenThreads),
        factions: mergeArrayValues(world.factions),
        regions: mergeArrayValues(world.regions)
      },
      narrative: {
        ...narrative,
        conflict_traces: mergeArrayValues(narrative.conflict_traces, narrative.conflictTraces, narrative.conflicts),
        scene_deltas: mergeArrayValues(narrative.scene_deltas, narrative.sceneDeltas, narrative.deltas),
        theme_motifs: mergeArrayValues(narrative.theme_motifs, narrative.themeMotifs, narrative.motifs),
        critical_dialogue: shapedArrayValues('critical_dialogue',
          narrative.critical_dialogue,
          narrative.criticalDialogue,
          narrative.dialogue_evidence,
          narrative.dialogueEvidence,
          source?.meta?.critical_dialogue,
          source?.meta?.criticalDialogue
        )
      },
      planner: {
        ...planner,
        continuity_locks: mergeArrayValues(planner.continuity_locks, planner.continuityLocks),
        do_not_resolve_yet: mergeArrayValues(planner.do_not_resolve_yet, planner.doNotResolveYet, planner.avoid),
        consequence_ledger: mergeArrayValues(planner.consequence_ledger, planner.consequenceLedger, planner.consequences),
        payoff_tracker: mergeArrayValues(
          planner.payoff_tracker,
          planner.payoffTracker,
          planner.payoffs,
          planner.payover_tracker,
          planner.payoverTracker,
          planner.payovers
        ),
        open_invitations: mergeArrayValues(planner.open_invitations, planner.openInvitations)
      },
      importance: {
        ...objectValue(source.importance),
        overall: Math.max(0, Math.min(1, Number(source?.importance?.overall || 0) || 0)),
        reason: arrayValue(source?.importance?.reason)
      }
    };
    const fallbackApplied = ensureBridgePacketSemanticPayload(packet, chunk);
    packet.meta.confidence = fallbackApplied
      ? 0.35
      : Math.max(0, Math.min(1, Number(source?.meta?.confidence ?? packet.meta.summary_memory.confidence) || 0.7));
    for (const key of ['meta', 'entity', 'world', 'narrative', 'planner', 'importance']) {
      if (!packet[key] || typeof packet[key] !== 'object' || Array.isArray(packet[key])) throw new Error(`콜드스타트 패킷 ${key} 형식이 올바르지 않습니다.`);
    }
    const serialized = JSON.stringify(packet);
    const maxPacketChars = effectiveHayakuPacketMaxChars(context);
    if (serialized.length > maxPacketChars) {
      throw new Error(`콜드스타트 패킷이 HAYAKU 수용 한도(${maxPacketChars.toLocaleString()}자)를 초과했습니다.`);
    }
    return serialized;
  };

  const normalizeIncrementalRecoveryPacket = (candidate, chunk, context) => {
    const source = objectValue(candidate?.packet || candidate);
    const summary = objectValue(source?.meta?.summary_memory || source?.meta?.summaryMemory);
    const entity = objectValue(source.entity || source.entities);
    const world = objectValue(source.world);
    const narrative = objectValue(source.narrative);
    const planner = objectValue(source.planner);
    const sourceTurnIndex = Math.max(1, Number(chunk.endTurn || 0) || 1);
    const providerSceneId = text(source?.meta?.scene_id || source?.meta?.sceneId).trim();
    const providerTurnAnchor = text(source?.meta?.turn_anchor || source?.meta?.turnAnchor).trim();
    const packet = {
      ...source,
      meta: {
        ...objectValue(source.meta),
        schema: 'hayaku_packet_v1',
        packet_type: 'recovery_snapshot',
        packet_schema_rev: 2,
        ledger_profile: INCREMENTAL_RECOVERY_SCHEMA,
        incremental_recovery_source: 'CHAT_TRANSCRIPT_MISSING_TURN',
        incremental_recovery_executor: 'MEMORY_SESSION_BRIDGE_PROVIDER',
        generative_llm_calls: true,
        scene_id: providerSceneId || `bridge-hayaku-scene-${stableHash64(
          text(world.location || world.scene || 'unspecified_scene').trim().toLowerCase()
        )}`,
        turn_anchor: providerTurnAnchor || compact(summary.summary || `turn:${sourceTurnIndex}`, 240),
        source_turn_index: sourceTurnIndex,
        source_turn_range: {
          start: Math.max(1, Number(chunk.startTurn || 0) || 1),
          end: Math.max(1, Number(chunk.endTurn || 0) || 1)
        },
        source_message_indexes: [...new Set(arrayValue(chunk.messageIndexes).map(value => Math.max(0, Number(value || 0) || 0)))],
        summary_memory: {
          ...summary,
          summary: text(summary.summary || '').trim(),
          recallAnchors: mergeArrayValues(summary.recallAnchors, summary.recall_anchors),
          recallAliases: normalizeBridgeRecallAliases(summary),
          canonicalAnchors: mergeArrayValues(
            summary.canonicalAnchors,
            summary.canonical_anchors,
            summary.canonicalTokens,
            summary.canonical_tokens
          ),
          mentionedEntityNames: mergeArrayValues(
            summary.mentionedEntityNames,
            summary.mentioned_entity_names
          ),
          directEvidenceSnippets: mergeArrayValues(
            summary.directEvidenceSnippets,
            summary.direct_evidence_snippets
          ),
          related_refs: mergeArrayValues(
            summary.related_refs,
            summary.relatedRefs,
            summary.source_refs,
            summary.sourceRefs
          ),
          confidence: Math.max(0, Math.min(1, Number(summary.confidence ?? source?.meta?.confidence ?? 0.7) || 0.7))
        },
        speaker_boundaries: mergeArrayValues(
          source?.meta?.speaker_boundaries,
          source?.meta?.speakerBoundaries
        ),
        overpromotion_risks: mergeArrayValues(
          source?.meta?.overpromotion_risks,
          source?.meta?.overpromotionRisks,
          source?.meta?.false_inferences,
          source?.meta?.falseInferences
        )
      },
      entity: {
        ...entity,
        characters: shapedArrayValues('character', entity.characters, entity.character, entity.people, source.characters, source.people),
        relations: shapedArrayValues('relation', entity.relations, entity.relationships, source.relations, source.relationships),
        pov_memories: shapedArrayValues('pov_memory',
          entity.pov_memories,
          entity.povMemories,
          entity.entityMemories,
          entity.entity_memories,
          entity.knowledge,
          source.povMemories,
          source.entityMemories,
          source.entity_knowledge
        ),
        secrets: shapedArrayValues('secret',
          entity.secrets,
          entity.secret_boundaries,
          entity.secretBoundaries,
          entity.hiddenKnowledge,
          entity.privateThoughts,
          source.secrets,
          source.hiddenKnowledge,
          source.privateThoughts
        )
      },
      world: {
        ...world,
        active_events: mergeArrayValues(world.active_events, world.activeEvents, world.events),
        historical_events: mergeArrayValues(world.historical_events, world.historicalEvents),
        world_rules: mergeArrayValues(world.world_rules, world.worldRules, world.rules),
        offscreen_threads: mergeArrayValues(world.offscreen_threads, world.offscreenThreads),
        factions: mergeArrayValues(world.factions),
        regions: mergeArrayValues(world.regions)
      },
      narrative: {
        ...narrative,
        conflict_traces: mergeArrayValues(narrative.conflict_traces, narrative.conflictTraces, narrative.conflicts),
        scene_deltas: mergeArrayValues(narrative.scene_deltas, narrative.sceneDeltas, narrative.deltas),
        theme_motifs: mergeArrayValues(narrative.theme_motifs, narrative.themeMotifs, narrative.motifs),
        critical_dialogue: shapedArrayValues('critical_dialogue',
          narrative.critical_dialogue,
          narrative.criticalDialogue,
          narrative.dialogue_evidence,
          narrative.dialogueEvidence,
          source?.meta?.critical_dialogue,
          source?.meta?.criticalDialogue
        )
      },
      planner: {
        ...planner,
        continuity_locks: mergeArrayValues(planner.continuity_locks, planner.continuityLocks),
        do_not_resolve_yet: mergeArrayValues(planner.do_not_resolve_yet, planner.doNotResolveYet, planner.avoid),
        consequence_ledger: mergeArrayValues(planner.consequence_ledger, planner.consequenceLedger, planner.consequences),
        payoff_tracker: mergeArrayValues(
          planner.payoff_tracker,
          planner.payoffTracker,
          planner.payoffs,
          planner.payover_tracker,
          planner.payoverTracker,
          planner.payovers
        ),
        open_invitations: mergeArrayValues(planner.open_invitations, planner.openInvitations)
      },
      importance: {
        ...objectValue(source.importance),
        overall: Math.max(0, Math.min(1, Number(source?.importance?.overall || 0) || 0)),
        reason: arrayValue(source?.importance?.reason)
      }
    };
    const fallbackApplied = ensureBridgePacketSemanticPayload(packet, chunk);
    packet.meta.confidence = fallbackApplied
      ? 0.35
      : Math.max(0, Math.min(1, Number(source?.meta?.confidence ?? packet.meta.summary_memory.confidence) || 0.7));
    for (const key of ['meta', 'entity', 'world', 'narrative', 'planner', 'importance']) {
      if (!packet[key] || typeof packet[key] !== 'object' || Array.isArray(packet[key])) {
        throw new Error(`증분 재분석 패킷 ${key} 형식이 올바르지 않습니다.`);
      }
    }
    const serialized = JSON.stringify(packet);
    const maxPacketChars = effectiveHayakuPacketMaxChars(context);
    if (serialized.length > maxPacketChars) {
      throw new Error(`증분 재분석 패킷이 HAYAKU 수용 한도(${maxPacketChars.toLocaleString()}자)를 초과했습니다.`);
    }
    return serialized;
  };

  const runPool = async (items, worker, concurrency = 3) => {
    const results = new Array(items.length);
    let cursor = 0;
    const runners = Array.from({ length: Math.min(concurrency, Math.max(1, items.length)) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await worker(items[index], index);
      }
    });
    await Promise.all(runners);
    return results;
  };

  const bridgeAnalysisError = (code, message) => {
    const error = new Error(message || code);
    error.code = code;
    return error;
  };
  const bridgeAnalysisErrorIsRepairable = error => {
    const code = text(error?.code || '').trim();
    const message = text(error?.message || error);
    return code === 'bridge_analysis_invalid_json'
      || code === 'bridge_analysis_normalization_failed'
      || /provider_output_truncated|HAYAKU.*(?:limit|maximum|exceed)|packet.*(?:limit|maximum|exceed)/i.test(message);
  };
  const analyzeBridgeEvidenceChunk = async ({
    state,
    chunk,
    context,
    profile,
    primaryPrompt,
    repairPrompt,
    payload,
    normalizePacket,
    maxTokens,
    temperature,
    checkpoint,
    invalidJsonMessage,
    onProgress,
    allowSourceFallback = true
  }) => {
    const attempts = [
      { mode: 'primary', prompt: primaryPrompt, temperature },
      { mode: 'repair', prompt: repairPrompt, temperature: 0 }
    ];
    let lastError = null;
    for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex += 1) {
      const attempt = attempts[attemptIndex];
      state.status = 'running';
      state.attempts = Math.max(0, Number(state.attempts || 0)) + 1;
      state.lastAttemptAt = Date.now();
      state.recoveryMode = attempt.mode;
      state.error = '';
      await checkpoint();
      notifyAnalysisProgress(onProgress, {
        type: 'chunk_attempt',
        state: 'running',
        phase: 'LLM 청크 분석',
        ordinal: Number(state.ordinal || 0),
        attemptMode: attempt.mode,
        message: `청크 ${Number(state.ordinal || 0)} · ${attempt.mode === 'repair' ? '형식 복구 재시도' : 'Primary 분석'} 시작`
      });
      try {
        const providerResult = await callProfile(profile, attempt.prompt, payload, {
          maxTokens,
          absoluteMaxTokens: HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS,
          temperature: attempt.temperature,
          jsonMode: true
        });
        const candidate = extractJsonObject(providerResult.content);
        if (!candidate) {
          throw bridgeAnalysisError('bridge_analysis_invalid_json', invalidJsonMessage);
        }
        try {
          state.body = normalizePacket(candidate, chunk, context);
        } catch (error) {
          const wrapped = bridgeAnalysisError(
            'bridge_analysis_normalization_failed',
            compact(error?.message || error || 'packet_normalization_failed', 320)
          );
          wrapped.cause = error;
          throw wrapped;
        }
        state.packetHash = stableHash64(state.body);
        state.status = 'verified';
        state.recoveryMode = parseJson(state.body, {})?.meta?.analysis_status === 'raw_evidence_fallback'
          ? 'source_fallback'
          : attempt.mode;
        state.fallbackReason = '';
        state.error = '';
        notifyAnalysisProgress(onProgress, {
          type: 'chunk_verified',
          state: 'running',
          phase: 'LLM 청크 분석',
          ordinal: Number(state.ordinal || 0),
          attemptMode: state.recoveryMode,
          message: `청크 ${Number(state.ordinal || 0)} 검증 완료${state.recoveryMode === 'repair' ? ' · 복구 응답 사용' : ''}`
        });
        return state;
      } catch (error) {
        lastError = error;
        state.error = compact(error?.message || error || 'chunk_failed', 320);
        await checkpoint();
        notifyAnalysisProgress(onProgress, {
          type: 'chunk_attempt_failed',
          state: 'running',
          phase: 'LLM 청크 분석',
          ordinal: Number(state.ordinal || 0),
          attemptMode: attempt.mode,
          message: `청크 ${Number(state.ordinal || 0)} ${attempt.mode === 'primary' && bridgeAnalysisErrorIsRepairable(error) ? '응답 형식 오류 · 복구 재시도 예정' : `실패 · ${state.error}`}`
        });
        if (attemptIndex === 0 && bridgeAnalysisErrorIsRepairable(error)) continue;
        break;
      }
    }

    // Match LIBRA's source-fallback principle only for malformed/truncated
    // model output. Transport, permission, and provider outages remain failed
    // checkpoints so a later resume cannot silently masquerade as analysis.
    if (allowSourceFallback !== false && lastError && bridgeAnalysisErrorIsRepairable(lastError)) {
      try {
        state.body = normalizePacket({}, chunk, context);
        state.packetHash = stableHash64(state.body);
        state.status = 'verified';
        state.recoveryMode = 'source_fallback';
        state.fallbackReason = compact(lastError?.message || lastError, 320);
        state.error = '';
        notifyAnalysisProgress(onProgress, {
          type: 'chunk_source_fallback',
          state: 'running',
          phase: '원문 안전 폴백',
          ordinal: Number(state.ordinal || 0),
          message: `청크 ${Number(state.ordinal || 0)} · 모델 형식 복구 실패로 원문 증거 패킷을 사용합니다.`
        });
        return state;
      } catch (fallbackError) {
        lastError = fallbackError;
      }
    }
    throw lastError || bridgeAnalysisError('bridge_analysis_failed', 'Bridge analysis failed.');
  };

  const coldStartChunkHash = chunk => stableHash64([
    Number(chunk?.startTurn || 0),
    Number(chunk?.endTurn || 0),
    chunk?.includesPendingUser === true ? 'pending' : 'complete',
    text(chunk?.text || '')
  ].join('\u0001'));

  const coldStartConfigHash = (settings, promptSet = null) => stableHash64([
    'cold_start_config_v2',
    HAYAKU_ANALYSIS_RECOVERY_POLICY,
    settings?.primary?.provider || '',
    settings?.primary?.url || '',
    settings?.primary?.model || '',
    settings?.primary?.maxTokens || '',
    promptSet?.contractHash || '',
    promptSet?.primary || HAYAKU_COLD_START_PROMPT,
    promptSet?.repair || HAYAKU_COLD_START_REPAIR_PROMPT
  ].join('\u0001'));

  const incrementalRecoveryConfigHash = (settings, promptSet = null) => stableHash64([
    'incremental_recovery_config_v2',
    HAYAKU_ANALYSIS_RECOVERY_POLICY,
    settings?.primary?.provider || '',
    settings?.primary?.url || '',
    settings?.primary?.model || '',
    settings?.primary?.maxTokens || '',
    promptSet?.contractHash || '',
    promptSet?.primary || HAYAKU_INCREMENTAL_RECOVERY_PROMPT,
    promptSet?.repair || HAYAKU_INCREMENTAL_RECOVERY_REPAIR_PROMPT
  ].join('\u0001'));


  // Incremental recovery checkpoints are salvaged per evidence chunk instead of
  // invalidating the whole run when transport metadata, provider settings, or
  // unrelated chunks change. A verified checkpoint is reusable only when its
  // evidence hash and serialized recovery packet are still structurally valid.
  const incrementalRecoveryCheckpointBodyReusable = (entry, chunk, maxPacketChars = HAYAKU_PACKET_FALLBACK_MAX_CHARS) => {
    if (!entry || text(entry.status).trim() !== 'verified') return false;
    const expectedChunkHash = coldStartChunkHash(chunk);
    if (!expectedChunkHash || text(entry.chunkHash).trim() !== expectedChunkHash) return false;
    const body = text(entry.body || '').trim();
    if (!body) return false;
    const limit = Math.max(
      HAYAKU_PACKET_FALLBACK_MAX_CHARS,
      Math.floor(Number(maxPacketChars || 0) || HAYAKU_PACKET_FALLBACK_MAX_CHARS)
    );
    if (body.length > limit) return false;
    const declaredPacketHash = text(entry.packetHash || '').trim();
    if (declaredPacketHash && declaredPacketHash !== stableHash64(body)) return false;
    const packet = parseJson(body, null);
    if (!packet || typeof packet !== 'object' || Array.isArray(packet)) return false;
    const meta = objectValue(packet.meta);
    if (text(meta.schema).trim() !== 'hayaku_packet_v1') return false;
    if (text(meta.packet_type || meta.packetType).trim().toLowerCase() !== 'recovery_snapshot') return false;
    if (Number(meta.packet_schema_rev ?? meta.packetSchemaRev) !== 2) return false;
    const range = objectValue(meta.source_turn_range || meta.sourceTurnRange);
    const expectedStart = Math.max(1, Number(chunk?.startTurn || 0) || 1);
    const expectedEnd = Math.max(expectedStart, Number(chunk?.endTurn || expectedStart) || expectedStart);
    const actualStart = Math.max(0, Number(range.start || range.start_turn || 0) || 0);
    const actualEnd = Math.max(0, Number(range.end || range.end_turn || 0) || 0);
    if (actualStart !== expectedStart || actualEnd !== expectedEnd) return false;
    for (const key of ['meta', 'entity', 'world', 'narrative', 'planner', 'importance']) {
      if (!packet[key] || typeof packet[key] !== 'object' || Array.isArray(packet[key])) return false;
    }
    return true;
  };

  const incrementalRecoveryCheckpointPlan = (previousRun, evidence, maxPacketChars = HAYAKU_PACKET_FALLBACK_MAX_CHARS) => {
    const currentChunks = Array.isArray(evidence?.chunks) ? evidence.chunks : [];
    const previousChunks = Array.isArray(previousRun?.chunks) ? previousRun.chunks : [];
    const buckets = new Map();
    previousChunks.forEach((entry, index) => {
      const chunkHash = text(entry?.chunkHash || '').trim();
      if (!chunkHash) return;
      const bucket = buckets.get(chunkHash) || [];
      bucket.push({ entry, index });
      buckets.set(chunkHash, bucket);
    });
    const usedPrevious = new Set();
    let reusedVerifiedCount = 0;
    let retryCheckpointCount = 0;
    let newOrChangedCount = 0;
    const chunks = currentChunks.map((chunk, index) => {
      const chunkHash = coldStartChunkHash(chunk);
      const candidates = (buckets.get(chunkHash) || []).filter(candidate => !usedPrevious.has(candidate.index));
      const reusableCandidate = candidates.find(candidate => (
        incrementalRecoveryCheckpointBodyReusable(candidate.entry, chunk, maxPacketChars)
      )) || null;
      const matchedCandidate = reusableCandidate || candidates[0] || null;
      if (matchedCandidate) usedPrevious.add(matchedCandidate.index);
      const common = {
        ordinal: index + 1,
        startTurn: chunk.startTurn,
        endTurn: chunk.endTurn,
        targetPairIndex: chunk.endTurn,
        chunkHash
      };
      if (reusableCandidate) {
        reusedVerifiedCount += 1;
        return {
          ...clone(reusableCandidate.entry, {}),
          ...common,
          status: 'verified',
          body: text(reusableCandidate.entry.body || '').trim(),
          packetHash: text(reusableCandidate.entry.packetHash || '').trim() || stableHash64(text(reusableCandidate.entry.body || '').trim()),
          error: '',
          checkpointReused: true,
          reusedFromOrdinal: Math.max(1, Number(reusableCandidate.entry.ordinal || reusableCandidate.index + 1) || 1)
        };
      }
      if (matchedCandidate) {
        retryCheckpointCount += 1;
        return {
          ...common,
          status: 'pending',
          attempts: Math.max(0, Number(matchedCandidate.entry?.attempts || 0) || 0),
          lastAttemptAt: Math.max(0, Number(matchedCandidate.entry?.lastAttemptAt || 0) || 0),
          recoveryMode: '',
          fallbackReason: '',
          body: '',
          packetHash: '',
          error: compact(matchedCandidate.entry?.error || '', 320),
          checkpointReused: false,
          retryingCheckpoint: true,
          reusedFromOrdinal: Math.max(1, Number(matchedCandidate.entry?.ordinal || matchedCandidate.index + 1) || 1)
        };
      }
      newOrChangedCount += 1;
      return {
        ...common,
        status: 'pending',
        attempts: 0,
        lastAttemptAt: 0,
        recoveryMode: '',
        fallbackReason: '',
        body: '',
        packetHash: '',
        error: '',
        checkpointReused: false,
        retryingCheckpoint: false,
        reusedFromOrdinal: 0
      };
    });
    const previousVerifiedCount = previousChunks.filter(entry => text(entry?.status).trim() === 'verified').length;
    const matchedCheckpointCount = usedPrevious.size;
    return {
      available: Boolean(previousRun && previousChunks.length),
      sourceHashMatch: Boolean(previousRun && text(previousRun?.sourceHash || '') === text(evidence?.sourceHash || '')),
      totalChunkCount: currentChunks.length,
      previousChunkCount: previousChunks.length,
      previousVerifiedCount,
      matchedCheckpointCount,
      reusedVerifiedCount,
      retryCheckpointCount,
      newOrChangedCount,
      discardedVerifiedCount: Math.max(0, previousVerifiedCount - reusedVerifiedCount),
      pendingChunkCount: Math.max(0, currentChunks.length - reusedVerifiedCount),
      chunks
    };
  };

  const inspectColdStart = async () => {
    const ownerGate = await ensureHayakuOwnerReady({ action: 'HAYAKU 콜드스타트', force: true });
    const context = await getCurrentContext();
    const evidence = collectColdStartEvidence(context.chat);
    const [hayaku, pendingColdStart, stagedRun] = await Promise.all([
      readHayakuSource(context, { ownerGate }),
      readPendingColdStartCapsule(context, { ownerGate }),
      readColdStartRun(context, { ownerGate })
    ]);
    const pendingAdoptionVerification = pendingColdStart.available
      ? await verifyDurableHayakuColdStart(pendingColdStart.capsule)
      : null;
    const capsuleNeedsAdoption = pendingColdStart.available
      && pendingAdoptionVerification?.verified !== true;
    const resumableRun = stagedRun.available
      && stagedRun.run?.sourceHash === evidence.sourceHash
      && stagedRun.run?.chunks?.some(chunk => ['pending', 'running', 'failed'].includes(chunk?.status));
    const hasLiveRecords = (Array.isArray(hayaku.allRecords) ? hayaku.allRecords : hayaku.records)
      .some(record => record?.inheritedSessionHistory !== true
        && !['superseded', 'orphaned', 'detached', 'tombstoned'].includes(text(record?.recordState || '').trim()));
    const hasHayakuRecords = (Array.isArray(hayaku.allRecords) ? hayaku.allRecords : hayaku.records)
      .some(record => record && text(record.raw || '').trim());
    const hasUsedHayaku = hasHayakuRecords || pendingColdStart.available === true
      || Boolean(text(hayaku?.ledger?.coldStart?.activeEpochId || ''));
    const eligible = evidence.chunks.length > 0
      && (capsuleNeedsAdoption || resumableRun || !hasUsedHayaku);
    const recommendedMode = capsuleNeedsAdoption
      ? 'readopt'
      : resumableRun ? 'resume'
        : !hasUsedHayaku ? 'initial' : 'blocked';
    return {
      context,
      evidence,
      hayaku,
      pendingColdStart,
      pendingAdoptionVerification,
      stagedRun,
      eligible,
      hasLiveRecords,
      hasUsedHayaku,
      canReadopt: capsuleNeedsAdoption,
      canResume: resumableRun,
      recommendedMode,
      reason: !evidence.chunks.length ? 'chat_transcript_unavailable'
        : capsuleNeedsAdoption ? 'cold_start_readopt'
          : resumableRun ? 'cold_start_resume'
            : hasUsedHayaku ? 'cold_start_already_used' : 'ready'
    };
  };

  const reAdoptColdStart = async () => {
    const inspection = await inspectColdStart();
    if (!inspection.pendingColdStart.available) {
      throw new Error('다시 채택할 콜드스타트 캡슐이 없습니다.');
    }
    const adoption = await requestImmediateHayakuColdStartAdoption(inspection.pendingColdStart.capsule);
    if (inspection.stagedRun?.available && inspection.stagedRun?.run) {
      const staged = clone(inspection.stagedRun.run, {});
      staged.state = adoption.verified === true && adoption.durable === true ? 'adopted' : 'verified';
      staged.adoptionReceipt = { ...clone(adoption, {}), at: Date.now() };
      staged.updatedAt = Date.now();
      await storageSet(inspection.stagedRun.storageKey, JSON.stringify(staged));
    }
    const result = {
      ok: adoption.verified === true && adoption.durable === true,
      capsuleVerified: true,
      reflected: adoption.verified === true && adoption.durable === true,
      pendingAdoption: !(adoption.verified === true && adoption.durable === true),
      mode: 'readopt',
      transferId: inspection.pendingColdStart.capsule.transferId,
      scopeKey: inspection.pendingColdStart.scope.scopeKey,
      packetCount: inspection.pendingColdStart.packets.length,
      storageKey: inspection.pendingColdStart.storageKey,
      adoption
    };
    Runtime.lastColdStart = result;
    return result;
  };

  const executeColdStart = async (options = {}) => {
    const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : null;
    const inspection = await inspectColdStart();
    if (!inspection.eligible) {
      throw new Error(inspection.reason === 'cold_start_already_used'
        ? '이미 HAYAKU를 사용한 세션입니다. 누락 복구는 증분 재분석을 사용하세요.'
        : '분석할 채팅 대화가 없습니다.');
    }
    const requestedMode = text(options?.mode || inspection.recommendedMode || 'resume').toLowerCase();
    if (requestedMode === 'readopt') return reAdoptColdStart();
    if (!['initial', 'resume'].includes(requestedMode)) {
      throw new Error('콜드스타트는 HAYAKU를 한 번도 사용하지 않은 세션에서만 실행할 수 있습니다.');
    }
    if (requestedMode === 'initial' && inspection.hasUsedHayaku) {
      throw new Error('이미 HAYAKU 원장이 있는 세션입니다. 누락 복구는 증분 재분석을 사용하세요.');
    }
    const mode = requestedMode;
    const settings = await loadSettings();
    const profile = 'primary';
    const { context, evidence } = inspection;
    const promptSet = bridgeHayakuPromptSet('cold_start', inspection.hayaku?.packetAuthoring);
    const identity = contextIdentity(context);
    const scope = hayakuScopeFor(context);
    if (!scope.available) throw new Error('HAYAKU 스코프를 계산하지 못했습니다.');
    const maxPacketChars = effectiveHayakuPacketMaxChars(inspection.hayaku);
    const configHash = coldStartConfigHash(settings, promptSet);
    const runStorageKey = `${COLD_START_RUN_PREFIX}${scope.scopeKey}`;
    const previousRun = inspection.stagedRun.available ? inspection.stagedRun.run : null;
    const reusable = mode === 'resume'
      && previousRun?.sourceHash === evidence.sourceHash
      && previousRun?.configHash === configHash
      && previousRun?.chunks?.length === evidence.chunks.length
      && previousRun.chunks.every((entry, index) => entry.chunkHash === coldStartChunkHash(evidence.chunks[index]));
    const createdAt = reusable ? Number(previousRun.createdAt || Date.now()) : Date.now();
    const runId = reusable
      ? text(previousRun.runId)
      : `bridge-cold-run-${stableHash64(`${scope.scopeKey}|${evidence.sourceHash}|${configHash}|${createdAt}`)}`;
    const run = reusable ? clone(previousRun, {}) : {
      schema: COLD_START_RUN_SCHEMA,
      runId,
      scopeKey: scope.scopeKey,
      sourceChatId: identity.chatId,
      sourceHash: evidence.sourceHash,
      configHash,
      packetAuthoring: clone(promptSet.profile, {}),
      packetAuthoringContractHash: promptSet.contractHash,
      createdAt,
      updatedAt: createdAt,
      state: 'building',
      chunks: evidence.chunks.map((chunk, index) => ({
        ordinal: index + 1,
        chunkHash: coldStartChunkHash(chunk),
        status: 'pending',
        attempts: 0,
        lastAttemptAt: 0,
        recoveryMode: '',
        fallbackReason: '',
        body: '',
        packetHash: '',
        error: ''
      }))
    };
    run.maxPacketChars = maxPacketChars;
    const reportProgress = event => reportAnalysisRun(onProgress, 'cold_start', run, {
      maxPacketChars,
      reusedChunkCount: run.chunks.filter(chunk => chunk?.status === 'verified').length,
      ...event
    });
    run.state = 'building';
    run.updatedAt = Date.now();
    if (!await storageSet(runStorageKey, JSON.stringify(run))) {
      throw new Error('콜드스타트 실행 상태를 저장하지 못했습니다.');
    }
    reportProgress({
      type: 'run_ready',
      state: 'running',
      phase: '청크 분석 준비',
      runId,
      message: `분석 청크 ${run.chunks.length}개 · 동시 처리 최대 3개 · 재사용 ${run.chunks.filter(chunk => chunk?.status === 'verified').length}개`
    });
    let checkpointQueue = Promise.resolve(true);
    const checkpoint = () => {
      const snapshot = JSON.stringify({ ...run, updatedAt: Date.now() });
      checkpointQueue = checkpointQueue.then(() => storageSet(runStorageKey, snapshot));
      return checkpointQueue;
    };
    const work = run.chunks.filter(chunk => chunk.status !== 'verified');
    await runPool(work, async state => {
      const index = Math.max(0, Number(state.ordinal || 1) - 1);
      const chunk = evidence.chunks[index];
      try {
        const priorContext = priorTurnContextForChunk(evidence, chunk);
        const payload = [
          `[Chunk ${index + 1}/${evidence.chunks.length}]`,
          `[Source turn range ${chunk.startTurn}-${chunk.endTurn}]`,
          `[Contains pending user input: ${chunk.includesPendingUser ? 'yes' : 'no'}]`,
          '',
          ...(priorContext ? [
            '[CONTEXT ONLY — resolve references, but do not write a packet for these turns]',
            priorContext,
            '',
          ] : []),
          '[TARGET TURN — write the packet only for this evidence]',
          chunk.text
        ].join('\n');
        await analyzeBridgeEvidenceChunk({
          state,
          chunk,
          context: {
            sourceHash: evidence.sourceHash,
            ordinal: index + 1,
            authoringProfile: promptSet.profile,
            maxPacketChars
          },
          profile,
          primaryPrompt: promptSet.primary,
          repairPrompt: promptSet.repair,
          payload,
          normalizePacket: normalizeColdStartPacket,
          maxTokens: Math.min(
            Math.max(64, Number(settings.primary.maxTokens || HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS) || HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS),
            HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS
          ),
          temperature: 0.2,
          checkpoint,
          invalidJsonMessage: `Cold-start chunk ${index + 1} response did not contain a JSON object.`,
          onProgress: reportProgress
        });
      } catch (error) {
        state.status = 'failed';
        state.error = compact(error?.message || error || 'chunk_failed', 320);
        reportProgress({
          type: 'chunk_failed',
          state: 'running',
          phase: 'LLM 청크 분석',
          message: `청크 ${state.ordinal} 실패 · ${state.error}`
        });
      }
      await checkpoint();
    }, 3);
    await checkpointQueue;
    const failedChunks = run.chunks.filter(chunk => chunk.status !== 'verified');
    if (failedChunks.length) {
      run.state = 'partial';
      run.updatedAt = Date.now();
      await storageSet(runStorageKey, JSON.stringify(run));
      const ordinals = failedChunks.map(chunk => chunk.ordinal).join(', ');
      throw new Error(`콜드스타트 일부 청크가 실패했습니다(${ordinals}). 다음 실행에서 실패한 청크만 이어서 분석합니다.`);
    }
    reportProgress({
      type: 'source_guard',
      state: 'running',
      phase: '대화 정합성 확인',
      message: '분석 시작 시점의 대화가 현재 대화의 변경되지 않은 접두부인지 확인합니다.'
    });
    const latest = await getCurrentContext();
    const latestIdentity = contextIdentity(latest);
    if (latestIdentity.characterId !== identity.characterId || latestIdentity.chatId !== identity.chatId) {
      run.state = 'failed';
      run.error = 'active_chat_changed';
      await storageSet(runStorageKey, JSON.stringify(run));
      throw new Error('콜드스타트 분석 중 활성 캐릭터 또는 채팅이 바뀌었습니다.');
    }
    const sourceCompatibility = compareEvidenceSourceSnapshot(evidence, latest.chat);
    if (!sourceCompatibility.compatible) {
      run.state = 'failed';
      run.error = sourceCompatibility.reason;
      run.updatedAt = Date.now();
      await storageSet(runStorageKey, JSON.stringify(run));
      throw new Error(sourceCompatibility.reason === 'pending_turn_completed_during_analysis'
        ? '분석 중이던 미결 사용자 입력에 새 응답이 붙었습니다. 새 대화 상태로 다시 분석하세요.'
        : '분석 중 기존 메시지가 수정·삭제·재생성되었습니다. 이전 결과는 채택하지 않고 체크포인트만 보존합니다.');
    }
    reportProgress({
      type: 'source_guard_verified',
      state: 'running',
      phase: '캡슐 저장',
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      message: sourceCompatibility.appendedMessageCount
        ? `기존 대화는 그대로이며 분석 중 새 메시지 ${sourceCompatibility.appendedMessageCount}개가 추가되었습니다. 새 턴은 후속 증분 복구 대상으로 남깁니다.`
        : '분석 대상 대화가 변경되지 않았음을 확인했습니다.'
    });
    const completedAt = Date.now();
    const transferId = `bridge-cold-${stableHash64(`${runId}|${evidence.sourceHash}|${completedAt}`)}`;
    const epochId = `coldstart:${stableHash64(`${scope.scopeKey}|${transferId}|${evidence.sourceHash}`)}`;
    const packetBodies = run.chunks.map(chunk => chunk.body);
    const capsule = {
      schema: COLD_START_SCHEMA,
      transferId,
      epochId,
      runId,
      scopeKey: scope.scopeKey,
      sourceChatId: identity.chatId,
      sourceHash: evidence.sourceHash,
      configHash,
      packetAuthoring: clone(promptSet.profile, {}),
      packetAuthoringContractHash: promptSet.contractHash,
      createdAt: completedAt,
      sourceMessageCount: evidence.rows.length,
      completedTurnCount: evidence.completedTurns,
      pendingUserMessageCount: evidence.pendingUserMessages,
      profile,
      packetCount: packetBodies.length,
      packets: packetBodies.map((body, index) => ({
        ordinal: index + 1,
        chunkHash: run.chunks[index].chunkHash,
        packetHash: run.chunks[index].packetHash,
        body
      }))
    };
    const key = `${COLD_START_PREFIX}${scope.scopeKey}`;
    if (!await storageSet(key, JSON.stringify(capsule))) throw new Error('HAYAKU 콜드스타트 캡슐을 저장하지 못했습니다.');
    const verified = parseJson(await storageGet(key), null);
    const packetSetVerification = validateBridgeCapsulePacketSet(verified);
    const packetsVerified = packetSetVerification.valid
      && packetSetVerification.bodies.length === packetBodies.length;
    if (!verified || verified.schema !== COLD_START_SCHEMA || verified.transferId !== transferId || !packetsVerified) {
      throw new Error('HAYAKU 콜드스타트 캡슐 저장 검증에 실패했습니다.');
    }
    reportProgress({
      type: 'capsule_verified',
      state: 'running',
      phase: 'HAYAKU 원장 채택',
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      message: '콜드스타트 캡슐 저장 및 readback 검증을 완료했습니다. HAYAKU에 즉시 채택을 요청합니다.'
    });
    run.state = 'verified';
    run.transferId = transferId;
    run.epochId = epochId;
    run.updatedAt = Date.now();
    await storageSet(runStorageKey, JSON.stringify(run));
    const adoption = await requestImmediateHayakuColdStartAdoption(verified);
    const adoptionVerified = adoption.ok === true
      && adoption.verified === true
      && adoption.durable === true
      && adoption.transferId === transferId
      && adoption.sourceHash === evidence.sourceHash
      && adoption.epochId === epochId;
    run.state = adoptionVerified ? 'adopted' : 'verified';
    run.adoptionReceipt = {
      ...adoption,
      verified: adoptionVerified,
      at: Date.now()
    };
    await storageSet(runStorageKey, JSON.stringify(run));
    const result = {
      ok: true,
      capsuleVerified: true,
      reflected: adoptionVerified,
      pendingAdoption: !adoptionVerified,
      mode: reusable ? 'resume' : mode,
      transferId,
      epochId,
      runId,
      scopeKey: scope.scopeKey,
      packetCount: packetBodies.length,
      chunkCount: evidence.chunks.length,
      reusedChunkCount: run.chunks.length - work.length,
      repairChunkCount: run.chunks.filter(chunk => chunk.recoveryMode === 'repair').length,
      sourceFallbackChunkCount: run.chunks.filter(chunk => chunk.recoveryMode === 'source_fallback').length,
      sourceMessageCount: evidence.rows.length,
      completedTurnCount: evidence.completedTurns,
      pendingUserMessageCount: evidence.pendingUserMessages,
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      profile,
      packetAuthoring: clone(promptSet.profile, {}),
      packetAuthoringContractHash: promptSet.contractHash,
      storageKey: key,
      runStorageKey,
      createdAt: completedAt,
      adoption: { ...adoption, verified: adoptionVerified }
    };
    Runtime.lastColdStart = result;
    reportProgress({
      type: 'adoption_complete',
      state: 'running',
      phase: adoptionVerified ? '원장 반영 검증 완료' : '캡슐 검증 완료',
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      message: adoptionVerified
        ? 'HAYAKU canonical 원장 반영과 영속 readback을 확인했습니다.'
        : '즉시 채택은 대기 상태입니다. 검증된 캡슐은 다음 HAYAKU 요청에서 자동 채택됩니다.'
    });
    return result;
  };

  const inspectIncrementalRecovery = async (options = {}) => {
    const ownerGate = await ensureHayakuOwnerReady({ action: 'HAYAKU 증분 재분석', force: true });
    const targetTurns = Array.isArray(options?.targetTurns) ? options.targetTurns : [];
    const targeted = targetTurns.length > 0;
    const context = await getCurrentContext();
    const [hayaku, stagedRun, pendingCapsule] = await Promise.all([
      readHayakuSource(context, { ownerGate }),
      readIncrementalRecoveryRun(context, { ownerGate }),
      readPendingIncrementalRecoveryCapsule(context, { ownerGate })
    ]);
    const evidence = collectIncrementalRecoveryEvidence(context.chat, hayaku, { targetTurns });
    const allRecords = Array.isArray(hayaku?.allRecords) ? hayaku.allRecords : hayaku?.records;
    const hasHayakuHistory = (
      Array.isArray(allRecords)
      && allRecords.some(record => record && text(record.raw || '').trim())
    ) || activeHayakuTombstones(hayaku).length > 0;
    const pendingAdoptionVerification = pendingCapsule.available
      ? await verifyDurableHayakuIncrementalRecovery(pendingCapsule.capsule)
      : null;
    const activeRecoveryId = text(hayaku?.ledger?.incrementalRecovery?.lastRecoveryId || '');
    const pendingRecoveryId = text(pendingCapsule?.capsule?.recoveryId || '');
    const pendingRecoveryTurns = (Array.isArray(pendingCapsule?.capsule?.missingTurns)
      ? pendingCapsule.capsule.missingTurns : []).map(Number).filter(Number.isInteger);
    const suppressedTurns = new Set(evidence.coverage.userSuppressedTurns.map(Number));
    const pendingWasAdoptedThenUserSuppressed = Boolean(
      activeRecoveryId
      && activeRecoveryId === pendingRecoveryId
      && pendingRecoveryTurns.length > 0
      && pendingRecoveryTurns.every(turn => suppressedTurns.has(turn))
    );
    const pendingAlreadyAdopted = pendingAdoptionVerification?.verified === true
      || pendingWasAdoptedThenUserSuppressed;
    const pendingMatchesEvidence = pendingCapsule.available
      && text(pendingCapsule?.capsule?.sourceHash || '') === text(evidence.sourceHash)
      && text(pendingCapsule?.capsule?.coverageHash || '') === text(evidence.coverage.coverageHash);
    const stalePendingCapsule = pendingCapsule.available
      && !pendingAlreadyAdopted
      && !pendingMatchesEvidence;
    const capsuleNeedsAdoption = !targeted && pendingMatchesEvidence
      && !pendingAlreadyAdopted;
    const maxPacketChars = effectiveHayakuPacketMaxChars(hayaku);
    const checkpointPlan = !targeted && stagedRun.available
      ? incrementalRecoveryCheckpointPlan(stagedRun.run, evidence, maxPacketChars)
      : incrementalRecoveryCheckpointPlan(null, evidence, maxPacketChars);
    const stagedHasUnfinishedWork = stagedRun.available
      && stagedRun.run?.chunks?.some(chunk => ['pending', 'running', 'failed'].includes(text(chunk?.status).trim()));
    const stagedNeedsFinalization = stagedRun.available
      && ['building', 'partial', 'failed', 'verified'].includes(text(stagedRun.run?.state || '').trim())
      && checkpointPlan.totalChunkCount > 0
      && checkpointPlan.reusedVerifiedCount === checkpointPlan.totalChunkCount;
    const resumableRun = !targeted
      && (stagedHasUnfinishedWork || stagedNeedsFinalization)
      && checkpointPlan.matchedCheckpointCount > 0
      && (checkpointPlan.pendingChunkCount > 0 || stagedNeedsFinalization);
    // A verified capsule awaiting owner adoption is already past analysis. Do
    // not simultaneously advertise its older staged run as resumable work.
    const canResume = resumableRun && !capsuleNeedsAdoption;
    const eligible = hasHayakuHistory
      && evidence.recoveryTurns.length > 0
      && evidence.chunks.length > 0;
    return {
      context,
      hayaku,
      stagedRun,
      pendingCapsule,
      pendingAdoptionVerification,
      evidence,
      checkpointPlan,
      hasHayakuHistory,
      eligible: eligible || capsuleNeedsAdoption || canResume,
      canReadopt: capsuleNeedsAdoption,
      canResume,
      stalePendingCapsule,
      targeted,
      recommendedMode: capsuleNeedsAdoption ? 'readopt' : canResume ? 'resume' : 'incremental',
      reason: !hasHayakuHistory ? 'cold_start_required'
        : stalePendingCapsule ? 'incremental_recovery_stale_capsule'
          : capsuleNeedsAdoption ? 'incremental_recovery_readopt'
          : canResume ? 'incremental_recovery_resume'
            : targeted && evidence.chunks.length ? 'targeted_regeneration'
            : evidence.coverage.missingTurns.length === 0 && evidence.coverage.userSuppressedTurns.length
              ? 'user_suppressed_only'
            : evidence.coverage.missingTurns.length === 0 ? 'coverage_complete'
              : evidence.chunks.length ? 'missing_turns_detected' : 'missing_evidence_unavailable'
    };
  };

  const reAdoptIncrementalRecovery = async () => {
    const inspection = await inspectIncrementalRecovery();
    if (!inspection.pendingCapsule.available || !inspection.canReadopt) {
      throw new Error('다시 채택할 증분 재분석 캡슐이 없습니다.');
    }
    const adoption = await requestImmediateHayakuIncrementalRecoveryAdoption(inspection.pendingCapsule.capsule);
    if (inspection.stagedRun?.available && inspection.stagedRun?.run) {
      const staged = clone(inspection.stagedRun.run, {});
      staged.state = adoption.verified === true && adoption.durable === true ? 'adopted' : 'verified';
      staged.adoptionReceipt = { ...clone(adoption, {}), at: Date.now() };
      staged.updatedAt = Date.now();
      await storageSet(inspection.stagedRun.storageKey, JSON.stringify(staged));
    }
    const result = {
      ok: adoption.verified === true && adoption.durable === true,
      capsuleVerified: true,
      reflected: adoption.verified === true && adoption.durable === true,
      pendingAdoption: !(adoption.verified === true && adoption.durable === true),
      mode: 'readopt',
      recoveryId: inspection.pendingCapsule.capsule.recoveryId,
      scopeKey: inspection.pendingCapsule.scope.scopeKey,
      packetCount: inspection.pendingCapsule.packets.length,
      recoveredTurns: Array.isArray(adoption.recoveredTurns)
        ? adoption.recoveredTurns
        : inspection.pendingCapsule.capsule.missingTurns || [],
      storageKey: inspection.pendingCapsule.storageKey,
      adoption
    };
    Runtime.lastIncrementalRecovery = result;
    return result;
  };

  const executeIncrementalRecovery = async (options = {}) => {
    const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : null;
    const replacementRecordIds = [...new Set((Array.isArray(options?.replacementRecordIds)
      ? options.replacementRecordIds : []).map(value => text(value).trim()).filter(Boolean))];
    const targetTurns = Array.isArray(options?.targetTurns) ? options.targetTurns : [];
    const inspection = await inspectIncrementalRecovery({ targetTurns });
    const requestedMode = text(options?.mode || inspection.recommendedMode || 'incremental').toLowerCase();
    if (requestedMode === 'readopt') return reAdoptIncrementalRecovery();
    if (!inspection.eligible) {
      throw new Error(inspection.reason === 'coverage_complete'
        ? '누락된 완료 턴이 없습니다.'
        : inspection.reason === 'cold_start_required'
          ? 'HAYAKU를 한 번도 사용하지 않은 세션입니다. 먼저 콜드스타트를 실행하세요.'
          : '증분 재분석에 사용할 누락 턴 증거가 없습니다.');
    }
    if (!['incremental', 'resume'].includes(requestedMode)) {
      throw new Error('증분 재분석은 누락 턴 복구 또는 실패 청크 이어서만 지원합니다.');
    }
    const settings = await loadSettings();
    const profile = 'primary';
    const { context, evidence } = inspection;
    const promptSet = bridgeHayakuPromptSet('incremental_recovery', inspection.hayaku?.packetAuthoring);
    const identity = contextIdentity(context);
    const scope = hayakuScopeFor(context);
    if (!scope.available) throw new Error('HAYAKU 스코프를 계산하지 못했습니다.');
    const maxPacketChars = effectiveHayakuPacketMaxChars(inspection.hayaku);
    const configHash = incrementalRecoveryConfigHash(settings, promptSet);
    const runStorageKey = `${INCREMENTAL_RECOVERY_RUN_PREFIX}${scope.scopeKey}`;
    const previousRun = inspection.stagedRun.available ? inspection.stagedRun.run : null;
    const resumePlan = requestedMode === 'resume' && previousRun
      ? incrementalRecoveryCheckpointPlan(previousRun, evidence, maxPacketChars)
      : incrementalRecoveryCheckpointPlan(null, evidence, maxPacketChars);
    const resumeFromPrevious = requestedMode === 'resume'
      && Boolean(previousRun)
      && resumePlan.matchedCheckpointCount > 0;
    if (requestedMode === 'resume' && !resumeFromPrevious) {
      throw new Error('기존 증분 재분석 체크포인트와 현재 누락 턴 증거가 일치하지 않습니다. 자동으로 전체 재분석하지 않았습니다. 누락 다시 확인 후 새 증분 분석을 명시적으로 시작하세요.');
    }
    const exactRunIdentity = resumeFromPrevious
      && text(previousRun?.sourceHash || '') === text(evidence.sourceHash)
      && text(previousRun?.configHash || '') === text(configHash);
    const createdAt = resumeFromPrevious
      ? Number(previousRun?.createdAt || Date.now())
      : Date.now();
    const runId = exactRunIdentity && text(previousRun?.runId || '').trim()
      ? text(previousRun.runId)
      : `bridge-recovery-run-${stableHash64(`${scope.scopeKey}|${evidence.sourceHash}|${configHash}|${createdAt}|${text(previousRun?.runId || '')}`)}`;
    const effectiveReplacementRecordIds = replacementRecordIds.length
      ? replacementRecordIds
      : resumeFromPrevious && Array.isArray(previousRun?.replacementRecordIds)
        ? [...new Set(previousRun.replacementRecordIds.map(value => text(value).trim()).filter(Boolean))]
        : [];
    const freshChunks = evidence.chunks.map((chunk, index) => ({
      ordinal: index + 1,
      startTurn: chunk.startTurn,
      endTurn: chunk.endTurn,
      targetPairIndex: chunk.endTurn,
      chunkHash: coldStartChunkHash(chunk),
      status: 'pending',
      attempts: 0,
      lastAttemptAt: 0,
      recoveryMode: '',
      fallbackReason: '',
      body: '',
      packetHash: '',
      error: '',
      checkpointReused: false,
      retryingCheckpoint: false,
      reusedFromOrdinal: 0
    }));
    const run = {
      schema: INCREMENTAL_RECOVERY_RUN_SCHEMA,
      runId,
      scopeKey: scope.scopeKey,
      sourceChatId: identity.chatId,
      sourceHash: evidence.sourceHash,
      coverageHash: evidence.coverage.coverageHash,
      missingTurns: evidence.recoveryTurns,
      replacementRecordIds: effectiveReplacementRecordIds,
      configHash,
      packetAuthoring: clone(promptSet.profile, {}),
      packetAuthoringContractHash: promptSet.contractHash,
      resumedFromRunId: resumeFromPrevious ? text(previousRun?.runId || '') : '',
      checkpointSalvage: resumeFromPrevious ? {
        sourceHashMatch: resumePlan.sourceHashMatch,
        previousChunkCount: resumePlan.previousChunkCount,
        previousVerifiedCount: resumePlan.previousVerifiedCount,
        matchedCheckpointCount: resumePlan.matchedCheckpointCount,
        reusedVerifiedCount: resumePlan.reusedVerifiedCount,
        retryCheckpointCount: resumePlan.retryCheckpointCount,
        newOrChangedCount: resumePlan.newOrChangedCount,
        discardedVerifiedCount: resumePlan.discardedVerifiedCount,
        pendingChunkCount: resumePlan.pendingChunkCount,
        configHashMatch: text(previousRun?.configHash || '') === text(configHash)
      } : null,
      createdAt,
      updatedAt: Date.now(),
      state: 'building',
      chunks: resumeFromPrevious ? resumePlan.chunks : freshChunks
    };
    run.maxPacketChars = maxPacketChars;
    const reportProgress = event => reportAnalysisRun(onProgress, 'incremental_recovery', run, {
      maxPacketChars,
      reusedChunkCount: run.chunks.filter(chunk => chunk?.status === 'verified').length,
      ...event
    });
    run.state = 'building';
    run.updatedAt = Date.now();
    if (!await storageSet(runStorageKey, JSON.stringify(run))) {
      throw new Error('증분 재분석 실행 상태를 저장하지 못했습니다.');
    }
    const readyReusedChunks = run.chunks.filter(chunk => chunk?.status === 'verified').length;
    const readyPendingChunks = Math.max(0, run.chunks.length - readyReusedChunks);
    reportProgress({
      type: 'run_ready',
      state: 'running',
      phase: '청크 분석 준비',
      runId,
      message: `누락 턴 분석 전체 ${run.chunks.length}개 · 재사용 ${readyReusedChunks}개 · 실제 처리 ${readyPendingChunks}개 · 동시 처리 최대 3개`
    });
    let checkpointQueue = Promise.resolve(true);
    const checkpoint = () => {
      const snapshot = JSON.stringify({ ...run, updatedAt: Date.now() });
      checkpointQueue = checkpointQueue.then(() => storageSet(runStorageKey, snapshot));
      return checkpointQueue;
    };
    const work = run.chunks.filter(chunk => chunk.status !== 'verified');
    await runPool(work, async state => {
      const index = Math.max(0, Number(state.ordinal || 1) - 1);
      const chunk = evidence.chunks[index];
      try {
        const priorContext = priorTurnContextForChunk(evidence, chunk);
        const payload = [
          `[Missing turn ${chunk.startTurn}${chunk.endTurn !== chunk.startTurn ? `-${chunk.endTurn}` : ''}]`,
          `[Recovery chunk ${index + 1}/${evidence.chunks.length}]`,
          '',
          ...(priorContext ? [
            '[CONTEXT ONLY — resolve references, but do not write a packet for these turns]',
            priorContext,
            '',
          ] : []),
          '[TARGET TURN — write the packet only for this evidence]',
          chunk.text
        ].join('\n');
        await analyzeBridgeEvidenceChunk({
          state,
          chunk,
          context: {
            sourceHash: evidence.sourceHash,
            ordinal: index + 1,
            authoringProfile: promptSet.profile,
            maxPacketChars
          },
          profile,
          primaryPrompt: promptSet.primary,
          repairPrompt: promptSet.repair,
          payload,
          normalizePacket: normalizeIncrementalRecoveryPacket,
          maxTokens: Math.min(
            Math.max(64, Number(settings.primary.maxTokens || HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS) || HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS),
            HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS
          ),
          temperature: 0.1,
          checkpoint,
          invalidJsonMessage: `Incremental recovery chunk ${index + 1} response did not contain a JSON object.`,
          onProgress: reportProgress
        });
      } catch (error) {
        state.status = 'failed';
        state.error = compact(error?.message || error || 'chunk_failed', 320);
        reportProgress({
          type: 'chunk_failed',
          state: 'running',
          phase: 'LLM 청크 분석',
          message: `청크 ${state.ordinal} 실패 · ${state.error}`
        });
      }
      await checkpoint();
    }, 3);
    await checkpointQueue;
    const failedChunks = run.chunks.filter(chunk => chunk.status !== 'verified');
    if (failedChunks.length) {
      run.state = 'partial';
      run.updatedAt = Date.now();
      await storageSet(runStorageKey, JSON.stringify(run));
      const ordinals = failedChunks.map(chunk => chunk.ordinal).join(', ');
      throw new Error(`증분 재분석 일부 청크가 실패했습니다(${ordinals}). 다음 실행에서 실패한 청크만 이어서 분석합니다.`);
    }
    reportProgress({
      type: 'source_guard',
      state: 'running',
      phase: '대화 정합성 확인',
      message: '분석 시작 시점의 대화가 현재 대화의 변경되지 않은 접두부인지 확인합니다.'
    });
    const latest = await getCurrentContext();
    const latestIdentity = contextIdentity(latest);
    if (latestIdentity.characterId !== identity.characterId || latestIdentity.chatId !== identity.chatId) {
      run.state = 'failed';
      run.error = 'active_chat_changed';
      await storageSet(runStorageKey, JSON.stringify(run));
      throw new Error('증분 재분석 중 활성 캐릭터 또는 채팅이 바뀌었습니다.');
    }
    const sourceCompatibility = compareEvidenceSourceSnapshot(evidence, latest.chat);
    if (!sourceCompatibility.compatible) {
      run.state = 'failed';
      run.error = sourceCompatibility.reason;
      run.updatedAt = Date.now();
      await storageSet(runStorageKey, JSON.stringify(run));
      throw new Error(sourceCompatibility.reason === 'pending_turn_completed_during_analysis'
        ? '증분 재분석 중이던 미결 사용자 입력에 새 응답이 붙었습니다. 새 대화 상태로 다시 분석하세요.'
        : '증분 재분석 중 기존 메시지가 수정·삭제·재생성되었습니다. 이전 결과는 채택하지 않고 체크포인트만 보존합니다.');
    }
    reportProgress({
      type: 'source_guard_verified',
      state: 'running',
      phase: '복구 캡슐 저장',
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      message: sourceCompatibility.appendedMessageCount
        ? `기존 대화는 그대로이며 분석 중 새 메시지 ${sourceCompatibility.appendedMessageCount}개가 추가되었습니다. 현재 복구 범위만 채택합니다.`
        : '분석 대상 대화가 변경되지 않았음을 확인했습니다.'
    });
    const completedAt = Date.now();
    const recoveryId = `bridge-recovery-${stableHash64(`${runId}|${evidence.sourceHash}|${completedAt}`)}`;
    const capsule = {
      schema: INCREMENTAL_RECOVERY_SCHEMA,
      recoveryId,
      runId,
      scopeKey: scope.scopeKey,
      sourceChatId: identity.chatId,
      sourceHash: evidence.sourceHash,
      coverageHash: evidence.coverage.coverageHash,
      packetAuthoring: clone(promptSet.profile, {}),
      packetAuthoringContractHash: promptSet.contractHash,
      createdAt: completedAt,
      sourceMessageCount: evidence.rows.length,
      completedTurnCount: evidence.completedTurns,
      coveredTurns: evidence.coverage.coveredTurns,
      missingTurns: evidence.recoveryTurns,
      replacementRecordIds: effectiveReplacementRecordIds,
      profile,
      packetCount: run.chunks.length,
      packets: run.chunks.map(state => ({
        ordinal: state.ordinal,
        startTurn: state.startTurn,
        endTurn: state.endTurn,
        targetPairIndex: state.targetPairIndex,
        chunkHash: state.chunkHash,
        packetHash: state.packetHash,
        body: state.body
      }))
    };
    const key = `${INCREMENTAL_RECOVERY_PREFIX}${scope.scopeKey}`;
    if (!await storageSet(key, JSON.stringify(capsule))) {
      throw new Error('HAYAKU 증분 재분석 캡슐을 저장하지 못했습니다.');
    }
    const verified = parseJson(await storageGet(key), null);
    const packetSetVerification = validateBridgeCapsulePacketSet(verified);
    const packetsVerified = packetSetVerification.valid
      && packetSetVerification.bodies.length === run.chunks.length;
    if (!verified || verified.schema !== INCREMENTAL_RECOVERY_SCHEMA
      || verified.recoveryId !== recoveryId || !packetsVerified) {
      throw new Error('HAYAKU 증분 재분석 캡슐 저장 검증에 실패했습니다.');
    }
    reportProgress({
      type: 'capsule_verified',
      state: 'running',
      phase: 'HAYAKU 원장 채택',
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      message: '증분 복구 캡슐 저장 및 readback 검증을 완료했습니다. HAYAKU에 즉시 채택을 요청합니다.'
    });
    run.state = 'verified';
    run.recoveryId = recoveryId;
    run.updatedAt = Date.now();
    await storageSet(runStorageKey, JSON.stringify(run));
    const adoption = await requestImmediateHayakuIncrementalRecoveryAdoption(verified);
    const adoptionVerified = adoption.ok === true
      && adoption.verified === true
      && adoption.durable === true
      && adoption.recoveryId === recoveryId
      && adoption.sourceHash === evidence.sourceHash;
    run.state = adoptionVerified ? 'adopted' : 'verified';
    run.adoptionReceipt = { ...adoption, verified: adoptionVerified, at: Date.now() };
    await storageSet(runStorageKey, JSON.stringify(run));
    const result = {
      ok: true,
      capsuleVerified: true,
      reflected: adoptionVerified,
      pendingAdoption: !adoptionVerified,
      mode: resumeFromPrevious ? 'resume' : 'incremental',
      recoveryId,
      runId,
      scopeKey: scope.scopeKey,
      packetCount: run.chunks.length,
      chunkCount: evidence.chunks.length,
      reusedChunkCount: run.chunks.length - work.length,
      retriedChunkCount: work.length,
      checkpointSalvage: clone(run.checkpointSalvage, null),
      repairChunkCount: run.chunks.filter(chunk => chunk.recoveryMode === 'repair').length,
      sourceFallbackChunkCount: run.chunks.filter(chunk => chunk.recoveryMode === 'source_fallback').length,
      completedTurnCount: evidence.completedTurns,
      coveredTurns: evidence.coverage.coveredTurns,
      recoveredTurns: evidence.recoveryTurns,
      replacementRecordIds: effectiveReplacementRecordIds,
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      packetAuthoring: clone(promptSet.profile, {}),
      packetAuthoringContractHash: promptSet.contractHash,
      storageKey: key,
      runStorageKey,
      createdAt: completedAt,
      adoption: { ...adoption, verified: adoptionVerified }
    };
    Runtime.lastIncrementalRecovery = result;
    reportProgress({
      type: 'adoption_complete',
      state: 'running',
      phase: adoptionVerified ? '원장 반영 검증 완료' : '캡슐 검증 완료',
      appendedMessageCount: sourceCompatibility.appendedMessageCount,
      message: adoptionVerified
        ? 'HAYAKU canonical 원장 반영과 영속 readback을 확인했습니다.'
        : '즉시 채택은 대기 상태입니다. 검증된 복구 캡슐은 다음 HAYAKU 요청에서 자동 채택됩니다.'
    });
    return result;
  };

  const hayakuAutoRepairRunStorageKey = (scopeKey, debtId) => `${HAYAKU_AUTO_REPAIR_RUN_PREFIX}${stableHash64(`${scopeKey}\u0001${debtId}`)}`;
  const hayakuAutoRepairCapsuleStorageKey = (scopeKey, debtId) => `${HAYAKU_AUTO_REPAIR_CAPSULE_PREFIX}${stableHash64(`${scopeKey}\u0001${debtId}`)}`;
  const scheduleHayakuAutoRepairSweep = (reason = 'event', delayMs = 250) => {
    const state = Runtime.hayakuAutoRepair;
    state.queuedReason = compact(reason || 'event', 96);
    if (state.timer != null || state.inFlight) return false;
    state.timer = setTimeout(() => {
      state.timer = null;
      void runHayakuAutoRepairSweep(state.queuedReason || reason).catch(error => {
        state.lastError = compact(error?.message || error, 320);
      });
    }, Math.max(0, Number(delayMs || 0) || 0));
    return true;
  };
  const automaticRepairChunkFromDebt = debt => {
    const pairIndex = Math.max(1, Number(debt?.pairIndex || 1) || 1);
    const user = text(debt?.evidence?.user || '').trim();
    const assistant = text(debt?.evidence?.assistant || '').trim();
    return {
      startTurn: pairIndex,
      endTurn: pairIndex,
      targetPairIndex: pairIndex,
      messageIndexes: [],
      text: `[USER T${pairIndex}]\n${user}\n\n[ASSISTANT T${pairIndex}]\n${assistant}`,
      includesPendingUser: false
    };
  };
  const automaticRepairTargetMatches = (left = {}, right = {}) => [
    'debtId', 'scopeKey', 'ownerTurnNodeId', 'logicalTurnId', 'variantId', 'parentTurnNodeId',
    'pairIndex', 'userHash', 'userMessageIdHash', 'assistantVisibleHash', 'assistantMessageIdHash',
    'sourceEvidenceHash'
  ].every(key => {
    if (key === 'pairIndex') return Number(left?.[key] || 0) === Number(right?.[key] || 0);
    return text(left?.[key] || '') === text(right?.[key] || '');
  });
  const cachedAutomaticRepairCapsuleForTarget = async (storageKey, repairTarget) => {
    const capsule = parseJson(await storageGet(storageKey), null);
    const validation = validateBridgeCapsulePacketSet(capsule);
    const entry = Array.isArray(capsule?.packets) ? capsule.packets[0] : null;
    if (!validation.valid
      || capsule?.automaticRepair !== true
      || capsule?.repairMode !== 'retrace_auto'
      || capsule?.packetCount !== 1
      || !entry?.repairTarget
      || !automaticRepairTargetMatches(entry.repairTarget, repairTarget)) return null;
    return capsule;
  };
  const automaticRepairAdoptionDisposition = adoption => {
    if (adoption?.verified === true && adoption?.durable === true) return 'adopted';
    const reason = text(adoption?.reason || 'automatic_repair_adoption_failed');
    if (reason === 'recovery_target_worldline_unstable'
      || adoption?.retryable === true
      || text(adoption?.targetWorldlineStatus || '') === 'quarantined') return 'suspended';
    if (reason === 'stale_recovery_target_not_active'
      || ['superseded', 'orphaned', 'detached_branch', 'detached', 'retired'].includes(text(adoption?.targetWorldlineStatus || ''))) return 'cancelled';
    return 'failed';
  };
  const executeHayakuAutomaticRepairDebt = async (debtSummary, ownerGate, reason = 'event') => {
    const settings = await loadSettings();
    if (settings.hayakuAutoRepair !== true) return { ok: false, skipped: true, reason: 'auto_repair_disabled' };
    const state = Runtime.hayakuAutoRepair;
    const debtId = text(debtSummary?.debtId || '').trim();
    const scopeKey = text(debtSummary?.scopeKey || '').trim();
    if (!debtId || !scopeKey) return { ok: false, skipped: true, reason: 'debt_identity_missing' };
    const runId = `retrace-auto-${stableHash64(`${scopeKey}|${debtId}|${Date.now()}`)}`;
    const leaseResponse = await requestHayakuIpc('acquire_recovery_debt_lease', { debtId, runId }, {
      timeoutMs: 15000,
      ignoreCooldown: true,
      suppressCooldown: true,
      requireAuthenticatedSender: true
    });
    if (leaseResponse?.acquired !== true || !leaseResponse?.debt?.evidence) {
      const leaseReason = leaseResponse?.reason || 'lease_not_acquired';
      if (['hayaku_inband_recovery_pending', 'recovery_debt_already_leased', 'recovery_debt_backoff_active'].includes(leaseReason)) {
        scheduleHayakuAutoRepairSweep(leaseReason, HAYAKU_AUTO_REPAIR_RETRY_MS);
      }
      return { ok: false, skipped: true, reason: leaseReason };
    }
    const lease = leaseResponse.lease || {};
    const debt = leaseResponse.debt;
    state.runId = runId;
    state.debtId = debtId;
    const chunk = automaticRepairChunkFromDebt(debt);
    const repairTarget = {
      contract: HAYAKU_RECOVERY_DEBT_CONTRACT,
      debtId,
      scopeKey,
      ownerTurnNodeId: debt.ownerTurnNodeId || '',
      logicalTurnId: debt.logicalTurnId || '',
      variantId: debt.variantId || '',
      parentTurnNodeId: debt.parentTurnNodeId || '',
      pairIndex: debt.pairIndex,
      userHash: debt.userHash || '',
      userMessageIdHash: debt.userMessageIdHash || '',
      assistantVisibleHash: debt.assistantVisibleHash || '',
      assistantMessageIdHash: debt.assistantMessageIdHash || '',
      sourceEvidenceHash: debt.sourceEvidenceHash || '',
      observedWorldlineRevision: debt.observedWorldlineRevision || 0
    };
    const runStorageKey = hayakuAutoRepairRunStorageKey(scopeKey, debtId);
    const capsuleKey = hayakuAutoRepairCapsuleStorageKey(scopeKey, debtId);
    const releaseLease = async (outcome, error = '') => await requestHayakuIpc('release_recovery_debt_lease', {
      debtId,
      leaseId: lease.leaseId,
      outcome,
      error: compact(error || '', 240)
    }, {
      timeoutMs: 8000,
      ignoreCooldown: true,
      suppressCooldown: true,
      requireAuthenticatedSender: true
    }).catch(() => null);
    const persistTerminalRun = async (run, nextState, adoption = null, error = '') => {
      run.state = nextState;
      run.error = compact(error || '', 320);
      if (adoption) run.adoption = clone(adoption, {});
      run.updatedAt = Date.now();
      await storageSet(runStorageKey, JSON.stringify(run)).catch(() => false);
    };
    let run = {
      schema: HAYAKU_AUTO_REPAIR_RUN_SCHEMA,
      runId,
      debtId,
      scopeKey,
      sourceHash: '',
      repairTarget,
      reason,
      state: 'building',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attempts: 0,
      body: '',
      packetHash: '',
      error: ''
    };
    try {
      // A valid candidate generated before a transient rollback is retained as a
      // suspended checkpoint. Reactivation of the exact variant can adopt it with
      // zero additional LLM calls.
      const cachedCapsule = await cachedAutomaticRepairCapsuleForTarget(capsuleKey, repairTarget);
      if (cachedCapsule) {
        run = {
          ...run,
          sourceHash: text(cachedCapsule.sourceHash || ''),
          state: 'cached_candidate',
          body: text(cachedCapsule.packets?.[0]?.body || ''),
          packetHash: text(cachedCapsule.packets?.[0]?.packetHash || '')
        };
        await storageSet(runStorageKey, JSON.stringify(run));
        const cachedAdoption = await requestImmediateHayakuIncrementalRecoveryAdoption(cachedCapsule);
        const disposition = automaticRepairAdoptionDisposition(cachedAdoption);
        if (disposition === 'adopted') {
          await persistTerminalRun(run, 'adopted', cachedAdoption);
          await releaseLease('adopted');
          return {
            ok: true, debtId, runId,
            recoveryId: text(cachedCapsule.recoveryId || ''),
            adoption: cachedAdoption,
            repairTarget,
            cachedCandidate: true
          };
        }
        if (disposition === 'suspended') {
          await persistTerminalRun(run, 'suspended', cachedAdoption, cachedAdoption.reason);
          await releaseLease('suspended', cachedAdoption.reason);
          return {
            ok: false, skipped: true, suspended: true,
            reason: 'recovery_target_worldline_unstable', debtId, runId,
            recoveryId: text(cachedCapsule.recoveryId || ''),
            adoption: cachedAdoption, repairTarget, cachedCandidate: true
          };
        }
        if (disposition === 'cancelled') {
          await persistTerminalRun(run, 'cancelled', cachedAdoption, cachedAdoption.reason);
          await releaseLease('cancelled', cachedAdoption.reason);
          return {
            ok: false, skipped: true, cancelled: true,
            reason: cachedAdoption.reason || 'stale_recovery_target_not_active',
            debtId, runId, adoption: cachedAdoption, repairTarget, cachedCandidate: true
          };
        }
        const cachedError = new Error(cachedAdoption?.reason || 'automatic_repair_cached_adoption_failed');
        cachedError.adoption = cachedAdoption;
        throw cachedError;
      }

      const context = await getCurrentContext();
      const hayaku = await readHayakuSource(context, { includeRecords: false, ownerGate });
      const promptSet = bridgeHayakuPromptSet('incremental_recovery', hayaku?.packetAuthoring);
      const maxPacketChars = effectiveHayakuPacketMaxChars(hayaku);
      const sourceHash = stableHash64([
        repairTarget.sourceEvidenceHash,
        chunk.text,
        promptSet.contractHash,
        settings.primary.provider,
        settings.primary.model
      ].join('\u0001'));
      run.sourceHash = sourceHash;
      await storageSet(runStorageKey, JSON.stringify(run));
      const packetState = {
        ordinal: 1,
        startTurn: chunk.startTurn,
        endTurn: chunk.endTurn,
        targetPairIndex: chunk.targetPairIndex,
        chunkHash: coldStartChunkHash(chunk),
        status: 'pending',
        attempts: 0,
        lastAttemptAt: 0,
        recoveryMode: '',
        fallbackReason: '',
        body: '',
        packetHash: '',
        error: ''
      };
      const payload = [
        `[Automatic HAYAKU recovery · T${chunk.startTurn}]`,
        '[TARGET TURN — write one recovery packet only for this exact evidence]',
        chunk.text
      ].join('\n\n');
      await analyzeBridgeEvidenceChunk({
        state: packetState,
        chunk,
        context: {
          sourceHash,
          ordinal: 1,
          authoringProfile: promptSet.profile,
          maxPacketChars,
          repairTarget,
          automaticRepair: true
        },
        profile: 'primary',
        primaryPrompt: promptSet.primary,
        repairPrompt: promptSet.repair,
        payload,
        normalizePacket: normalizeIncrementalRecoveryPacket,
        maxTokens: Math.min(
          Math.max(64, Number(settings.primary.maxTokens || HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS) || HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS),
          HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS
        ),
        temperature: 0.1,
        checkpoint: async () => {
          run.attempts = packetState.attempts;
          run.state = packetState.status;
          run.body = packetState.body;
          run.packetHash = packetState.packetHash;
          run.error = packetState.error;
          run.updatedAt = Date.now();
          await storageSet(runStorageKey, JSON.stringify(run));
        },
        invalidJsonMessage: 'Automatic HAYAKU recovery response did not contain a JSON object.',
        onProgress: null,
        allowSourceFallback: false
      });
      const completedAt = Date.now();
      const recoveryId = `bridge-auto-recovery-${stableHash64(`${runId}|${sourceHash}|${completedAt}`)}`;
      const capsule = {
        schema: INCREMENTAL_RECOVERY_SCHEMA,
        automaticRepair: true,
        repairMode: 'retrace_auto',
        recoveryId,
        runId,
        scopeKey,
        sourceHash,
        coverageHash: sourceHash,
        packetAuthoring: clone(promptSet.profile, {}),
        packetAuthoringContractHash: promptSet.contractHash,
        createdAt: completedAt,
        sourceMessageCount: 2,
        completedTurnCount: debt.pairIndex,
        coveredTurns: [],
        missingTurns: [debt.pairIndex],
        replacementRecordIds: [],
        profile: 'primary',
        packetCount: 1,
        packets: [{
          ordinal: 1,
          startTurn: debt.pairIndex,
          endTurn: debt.pairIndex,
          targetPairIndex: debt.pairIndex,
          chunkHash: coldStartChunkHash(chunk),
          packetHash: packetState.packetHash,
          repairTarget,
          body: packetState.body
        }]
      };
      if (!await storageSet(capsuleKey, JSON.stringify(capsule))) throw new Error('automatic_repair_capsule_write_failed');
      const readback = parseJson(await storageGet(capsuleKey), null);
      const validation = validateBridgeCapsulePacketSet(readback);
      if (!validation.valid || readback?.recoveryId !== recoveryId) throw new Error('automatic_repair_capsule_readback_failed');
      const adoption = await requestImmediateHayakuIncrementalRecoveryAdoption(readback);
      const disposition = automaticRepairAdoptionDisposition(adoption);
      if (disposition === 'adopted') {
        run.recoveryId = recoveryId;
        await persistTerminalRun(run, 'adopted', adoption);
        await releaseLease('adopted');
        return { ok: true, debtId, runId, recoveryId, adoption, repairTarget, cachedCandidate: false };
      }
      if (disposition === 'suspended') {
        run.recoveryId = recoveryId;
        await persistTerminalRun(run, 'suspended', adoption, adoption.reason);
        await releaseLease('suspended', adoption.reason);
        return {
          ok: false, skipped: true, suspended: true,
          reason: 'recovery_target_worldline_unstable', debtId, runId, recoveryId,
          adoption, repairTarget, cachedCandidate: false
        };
      }
      if (disposition === 'cancelled') {
        run.recoveryId = recoveryId;
        await persistTerminalRun(run, 'cancelled', adoption, adoption.reason);
        await releaseLease('cancelled', adoption.reason);
        return {
          ok: false, skipped: true, cancelled: true,
          reason: adoption.reason || 'stale_recovery_target_not_active', debtId, runId, recoveryId,
          adoption, repairTarget, cachedCandidate: false
        };
      }
      const error = new Error(adoption?.reason || 'automatic_repair_adoption_failed');
      error.adoption = adoption;
      throw error;
    } catch (error) {
      await persistTerminalRun(run, 'failed', error?.adoption || null, error?.message || error);
      await releaseLease('failed', run.error);
      throw error;
    }
  };

  const runHayakuAutoRepairSweep = async (reason = 'event') => {
    const state = Runtime.hayakuAutoRepair;
    if (state.inFlight) return state.lastResult || { ok: false, skipped: true, reason: 'auto_repair_already_running' };
    const settings = await loadSettings();
    if (settings.hayakuAutoRepair !== true) return { ok: false, skipped: true, reason: 'auto_repair_disabled' };
    if (analysisIsRunning()) {
      scheduleHayakuAutoRepairSweep('manual_analysis_busy', HAYAKU_AUTO_REPAIR_RETRY_MS);
      return { ok: false, skipped: true, reason: 'analysis_busy' };
    }
    state.inFlight = true;
    state.runs += 1;
    try {
      const ownerGate = await ensureHayakuOwnerReady({
        action: 'HAYAKU 자동 복구',
        force: true,
        requireRecoveryDebtContract: true
      });
      // The recovery event listener is part of the HAYAKU subsystem, so it is
      // registered only after an authenticated live owner has passed the gate.
      await registerHayakuRecoveryEventIpc().catch(error => warn('HAYAKU recovery event registration failed', error));
      const inspection = await requestHayakuIpc('inspect_recovery_debts', { includeEvidence: false, limit: 1 }, {
        timeoutMs: 8000,
        ignoreCooldown: true,
        suppressCooldown: true,
        requireAuthenticatedSender: true
      });
      const debt = Array.isArray(inspection?.debts) ? inspection.debts[0] : null;
      if (!debt) {
        const result = { ok: true, repaired: false, reason: inspection?.reason || 'no_active_packet_debt' };
        state.lastResult = result;
        state.lastError = '';
        return result;
      }
      const result = await executeHayakuAutomaticRepairDebt(debt, ownerGate, reason);
      state.lastResult = result;
      state.lastError = '';
      if (result.ok === true) {
        state.successes += 1;
        scheduleHayakuAutoRepairSweep('next_debt', 250);
      }
      return result;
    } catch (error) {
      state.failures += 1;
      state.lastError = compact(error?.message || error, 320);
      state.lastResult = { ok: false, reason: text(error?.code || 'auto_repair_failed'), error: state.lastError };
      if (!['HAYAKU_OWNER_ABSENT', 'HAYAKU_OWNER_INCOMPATIBLE', 'HAYAKU_RECOVERY_DEBT_CONTRACT_UNAVAILABLE'].includes(text(error?.code))) {
        scheduleHayakuAutoRepairSweep('retry_after_failure', HAYAKU_AUTO_REPAIR_RETRY_MS);
      }
      return state.lastResult;
    } finally {
      state.inFlight = false;
      state.runId = '';
      state.debtId = '';
    }
  };
  const registerHayakuRecoveryEventIpc = async () => {
    if (Runtime.hayakuRecoveryEventRegistered) return true;
    const api = liveApi(['addPluginChannelListener']);
    if (typeof api?.addPluginChannelListener !== 'function') return false;
    const handler = (message, metadata = {}) => {
      const event = message && typeof message === 'object' && !Array.isArray(message) ? message : {};
      if (event.schema !== HAYAKU_RECOVERY_DEBT_EVENT_SCHEMA || event.kind !== 'event') return;
      if (text(metadata?.sender || '').trim() !== HAYAKU_PLUGIN_ID) return;
      if (!/^packet_debt_(?:ready|reactivated|retry_scheduled)$/.test(text(event.event || ''))) return;
      void loadSettings().then(settings => {
        if (settings.hayakuAutoRepair === true) scheduleHayakuAutoRepairSweep(event.event, 150);
      }).catch(() => {});
    };
    await api.addPluginChannelListener(HAYAKU_RECOVERY_DEBT_EVENT_CHANNEL, handler);
    Runtime.hayakuRecoveryEventHandler = handler;
    Runtime.hayakuRecoveryEventRegistered = true;
    return true;
  };

  const recordRegenerationTurns = (record, completedTurns = Number.MAX_SAFE_INTEGER) => {
    if (!record || isPermanentSessionHistory(record)) return [];
    const packet = parseJson(record.raw, {});
    const meta = objectValue(packet?.meta);
    const range = objectValue(meta.source_turn_range || meta.sourceTurnRange);
    const fallback = Math.max(0, Number(record.targetPairIndex || meta.turn_anchor || meta.turnAnchor || 0) || 0);
    let start = Math.max(0, Number(range.start || range.start_turn || fallback) || fallback);
    let end = Math.max(0, Number(range.end || range.end_turn || fallback) || fallback);
    if (!start && end) start = end;
    if (!end && start) end = start;
    if (end < start) [start, end] = [end, start];
    const ceiling = Math.max(0, Number(completedTurns || 0) || 0);
    const turns = [];
    for (let turn = Math.max(1, start); turn <= Math.min(end, ceiling); turn += 1) {
      turns.push(turn);
      if (turns.length >= 512) break;
    }
    return turns;
  };

  const resolveHayakuRecordTarget = (hayaku, target) => {
    const records = Array.isArray(hayaku?.allRecords) ? hayaku.allRecords : hayaku?.records;
    const recordId = text(typeof target === 'string' ? target : target?.recordId || '').trim();
    const hash = text(typeof target === 'object' ? target?.variantHash || target?.hash || '' : '').trim();
    return (Array.isArray(records) ? records : []).find(record => (
      (recordId && text(record?.recordId) === recordId)
      || (hash && text(record?.hash) === hash)
    )) || null;
  };

  const verifyHayakuRecordDeletion = async (context, record, deletionResult = null) => {
    const slotId = text(deletionResult?.slotId || hayakuRecordSlotId(record)).trim();
    const recordId = text(deletionResult?.recordId || record?.recordId || '').trim();
    const variantHash = text(deletionResult?.variantHash || record?.hash || '').trim();
    let last = null;
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const refreshed = await readHayakuSource(context);
      const tombstones = activeHayakuLedgerTombstones(refreshed?.ledger);
      const tombstone = tombstones.find(value => {
        if (text(value?.slotId || '').trim() !== slotId) return false;
        const valueRecordId = text(value?.recordId || '').trim();
        const valueHash = text(value?.variantHash || '').trim();
        return Boolean(
          (!valueRecordId && !valueHash)
          || (recordId && valueRecordId === recordId)
          || (variantHash && valueHash === variantHash)
        );
      }) || null;
      const stillEffective = (Array.isArray(refreshed?.records) ? refreshed.records : []).some(candidate => {
        if (hayakuRecordSlotId(candidate) !== slotId) return false;
        const candidateRecordId = text(candidate?.recordId || '').trim();
        const candidateHash = text(candidate?.hash || '').trim();
        return Boolean(
          (recordId && candidateRecordId === recordId)
          || (variantHash && candidateHash === variantHash)
        );
      });
      last = {
        verified: Boolean(tombstone) && !stillEffective,
        available: refreshed?.available === true || Boolean(refreshed?.ledger),
        slotId,
        recordId,
        variantHash,
        tombstone: tombstone ? clone(tombstone, tombstone) : null,
        stillEffective,
        readSource: refreshed?.readSource || ''
      };
      if (last.verified) return last;
      if (attempt < 4) await delay(70 * attempt);
    }
    return last || { verified: false, slotId, recordId, variantHash, stillEffective: true };
  };

  const deleteHayakuRecord = async target => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 패킷 삭제', force: true });
    const context = await getCurrentContext();
    const hayaku = await readHayakuSource(context);
    const record = resolveHayakuRecordTarget(hayaku, target);
    if (!record) throw new Error('HAYAKU packet was not found in the current ledger.');
    if (isPermanentSessionHistory(record)) {
      throw new Error('Permanent session history is protected from deletion.');
    }
    if (text(record.recordState).toLowerCase() === 'tombstoned') {
      return { ok: true, forgotten: false, reason: 'already_tombstoned', recoverable: true, verified: true };
    }
    const mutationTarget = {
      recordId: text(record.recordId),
      variantHash: text(record.hash),
      slotId: hayakuRecordSlotId(record),
      targetPairIndex: Math.max(0, Number(record?.targetPairIndex || 0) || 0),
      reason: 'bridge_packet_viewer_delete',
      intent: 'user_suppressed'
    };
    const transport = 'hayaku_plugin_ipc';
    const result = await requestHayakuIpc(
      'forget',
      { target: clone(mutationTarget, mutationTarget) },
      { timeoutMs: 7000, ignoreCooldown: true, requireAuthenticatedSender: true }
    );
    if (transport === 'hayaku_plugin_ipc'
      && (
        result?.mutation !== 'forget'
        || result?.ownerPluginId !== HAYAKU_PLUGIN_ID
        || result?.authorizedRequester !== 'flashback_hayaku_bridge'
      )) {
      throw new Error('HAYAKU returned an invalid owner-ledger deletion receipt.');
    }
    if (result?.ok !== true || result?.durable !== true) {
      throw new Error(`${text(result?.reason || 'HAYAKU packet deletion failed.')}: ${JSON.stringify({
        recordId: text(record.recordId),
        variantHash: text(record.hash),
        targetRecordId: text(result?.targetRecordId),
        slotRecordIds: Array.isArray(result?.slotRecordIds) ? result.slotRecordIds : []
      })}`);
    }
    const verification = await verifyHayakuRecordDeletion(context, record, result);
    if (verification?.verified !== true) {
      throw new Error(`deletion_not_durable: ${JSON.stringify({
        slotId: verification?.slotId || result?.slotId || '',
        recordId: verification?.recordId || text(record.recordId),
        variantHash: verification?.variantHash || text(record.hash),
        tombstoneFound: Boolean(verification?.tombstone),
        stillEffective: verification?.stillEffective === true,
        readSource: verification?.readSource || ''
      })}`);
    }
    return clone({ ...result, transport, verified: true, verification }, result);
  };

  const regenerateHayakuRecord = async target => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 패킷 재생성', force: true });
    const context = await getCurrentContext();
    const hayaku = await readHayakuSource(context);
    const record = resolveHayakuRecordTarget(hayaku, target);
    if (!record) throw new Error('HAYAKU packet was not found in the current ledger.');
    if (isPermanentSessionHistory(record)) {
      throw new Error('Permanent session history is protected from regeneration.');
    }
    const completedTurns = collectColdStartEvidence(context.chat).completedTurns;
    const targetTurns = recordRegenerationTurns(record, completedTurns);
    if (!targetTurns.length) throw new Error('No completed U+A turn can be regenerated for this packet.');
    const result = await executeIncrementalRecovery({
      mode: 'incremental',
      targetTurns,
      replacementRecordIds: [text(record.recordId)]
    });
    if (result?.adoption?.verified !== true) {
      const reason = text(result?.adoption?.reason || 'The regenerated packet could not be adopted.');
      const diagnostic = JSON.stringify({
        durable: result?.adoption?.durable === true,
        records: Math.max(0, Number(result?.adoption?.records || 0) || 0),
        activeRecords: Math.max(0, Number(result?.adoption?.activeRecords || 0) || 0),
        expectedRecords: Math.max(0, Number(result?.adoption?.expectedRecords || 0) || 0),
        replacedRecords: Math.max(0, Number(result?.adoption?.replacedRecords || 0) || 0),
        recoveredTurns: Array.isArray(result?.adoption?.recoveredTurns)
          ? result.adoption.recoveredTurns : [],
        verification: result?.adoption?.diagnostics || null
      });
      throw new Error(`${reason}: ${diagnostic}`);
    }
    return result;
  };

  const normalizeLibraInspection = (inspection, identity = {}, readSource = 'libra_plugin_ipc') => {
    const source = inspection && typeof inspection === 'object' && !Array.isArray(inspection) ? inspection : {};
    const recordsIncluded = source.recordsIncluded !== false;
    const memories = Array.isArray(source.memories) ? source.memories.filter(Boolean) : [];
    const memoryRefs = Array.isArray(source.memoryRefs) ? source.memoryRefs.filter(Boolean) : [];
    const worldAdditional = Array.isArray(source.worldAdditional) ? source.worldAdditional.filter(Boolean) : [];
    const worldAdditionalRefs = Array.isArray(source.worldAdditionalRefs) ? source.worldAdditionalRefs.filter(Boolean) : [];
    const scope = source.scope && typeof source.scope === 'object' ? source.scope : {};
    const chatId = text(scope.chatId || '').trim();
    const requestedChatId = text(identity?.chatId || '').trim();
    const scopeMatches = !requestedChatId || !chatId || requestedChatId === chatId;
    const schemaOk = source.schema === LIBRA_INSPECT_SCHEMA;
    const integrityOk = schemaOk && scopeMatches && source?.integrity?.ok !== false;
    const recordCount = Math.max(0, Number(source?.counts?.memories ?? (recordsIncluded ? memories.length : memoryRefs.length)) || 0);
    const worldAdditionalCount = Math.max(0, Number(source?.counts?.worldAdditional ?? (recordsIncluded ? worldAdditional.length : worldAdditionalRefs.length)) || 0);
    const liveCount = Math.max(0, Number(source?.counts?.liveMemories ?? (recordsIncluded
      ? memories.filter(memory => memory?.inheritedSessionHistory !== true && Number(memory?.sessionEpoch || 0) >= 0).length
      : memoryRefs.filter(memory => memory?.inheritedSessionHistory !== true && Number(memory?.sessionEpoch || 0) >= 0).length)) || 0);
    const inheritedCount = Math.max(0, Number(source?.counts?.inheritedMemories ?? recordCount - liveCount) || 0);
    const partialCount = Math.max(0, Number(source?.counts?.partialMemories ?? (recordsIncluded
      ? memories.filter(memory => memory?.pipeline?.status === 'partial').length
      : memoryRefs.filter(memory => text(memory?.pipelineStatus || '') === 'partial').length)) || 0);
    const canonicalRows = (recordsIncluded ? memories : memoryRefs).map(memory => [
      text(memory.memoryId || ''), Number(memory.revision || 0), text(memory.sourceDigest || ''),
      Math.max(0, Number(memory?.turnRange?.start || 0) || 0), Math.max(0, Number(memory?.turnRange?.end || 0) || 0),
      Number(memory.sessionEpoch || 0), memory?.inheritedSessionHistory === true,
      text(memory.status || ''), text(memory?.pipeline?.status || memory?.pipelineStatus || ''),
      stableHash64(text(memory.text || memory.summary || ''))
    ]);
    // LIBRA archive preparation is allowed to attach archiveCanonicalId/archiveRef
    // metadata to the same canonical records. This fingerprint intentionally excludes
    // those transport fields so a valid prepare_session_handoff cannot invalidate the
    // transition's own source-stability check.
    const canonicalStateHash = text(source.canonicalStateHash || source.canonicalSnapshotHash || '')
      || stableHash64(JSON.stringify({ scopeKey: text(scope.scopeKey || ''), memories: canonicalRows }));
    const fallbackSnapshotHash = stableHash64(JSON.stringify({
      scopeKey: text(scope.scopeKey || ''),
      memories: canonicalRows,
      worldAdditional: recordsIncluded
        ? worldAdditional.map(item => [text(item.itemId || ''), text(item.status || ''), stableHash64(text(item.content || ''))])
        : worldAdditionalRefs.map(item => text(typeof item === 'string' ? item : item?.itemId || item?.key || ''))
    }));
    const snapshotHash = text(source.snapshotHash || fallbackSnapshotHash);
    return {
      available: schemaOk && scopeMatches && (recordCount > 0 || worldAdditionalCount > 0),
      pluginAvailable: schemaOk,
      inspectionAvailable: schemaOk && scopeMatches,
      integrityOk,
      reason: !schemaOk ? 'libra_ipc_contract_unavailable'
        : !scopeMatches ? 'libra_scope_mismatch'
          : !integrityOk ? text(source?.integrity?.reason || 'libra_integrity_failed')
            : (recordCount || worldAdditionalCount) ? 'loaded' : 'empty',
      readSource,
      pluginVersion: text(source.pluginVersion || ''),
      recordsIncluded,
      scope,
      manifest: clone(source.manifest, {}),
      integrity: clone(source.integrity, { ok: integrityOk }),
      memories,
      memoryRefs,
      worldAdditional,
      worldAdditionalRefs,
      recordCount,
      liveRecordCount: liveCount,
      inheritedRecordCount: inheritedCount,
      partialRecordCount: partialCount,
      worldAdditionalCount,
      canonicalStateHash,
      snapshotHash,
      inspectedAt: source.inspectedAt || ''
    };
  };

  const readLibraSource = async (context, options = {}) => {
    const identity = contextIdentity(context || await getCurrentContext());
    const includeRecords = options?.includeRecords !== false;
    const probe = await probeLibraIpc({ timeoutMs: 1800, attempts: 2 });
    if (probe.available) {
      try {
        const inspected = await requestLibraIpc('inspect', { includeRecords }, { timeoutMs: includeRecords ? Math.max(30000, LIBRA_INSPECT_TIMEOUT_MS) : LIBRA_INSPECT_SUMMARY_TIMEOUT_MS });
        const normalized = normalizeLibraInspection(inspected, identity, 'libra_plugin_ipc');
        normalized.capabilities = clone(probe.capabilities, {});
        normalized.probe = clone(probe, {});
        return normalized;
      } catch (error) {
        const code = text(error?.code || '').trim();
        const reason = code === 'LIBRA_IPC_TIMEOUT' ? 'libra_inspect_timeout' : 'libra_inspect_failed';
        warn('LIBRA IPC inspection failed after successful discovery', error);
        return {
          available: false,
          pluginAvailable: true,
          inspectionAvailable: false,
          integrityOk: false,
          reason,
          readSource: 'libra_plugin_ipc',
          pluginVersion: text(probe.pluginVersion || ''),
          recordsIncluded: includeRecords,
          scope: {}, manifest: {}, integrity: { ok: false, reason },
          memories: [], memoryRefs: [], worldAdditional: [], worldAdditionalRefs: [], recordCount: 0, liveRecordCount: 0,
          inheritedRecordCount: 0, partialRecordCount: 0, worldAdditionalCount: 0,
          snapshotHash: '', capabilities: clone(probe.capabilities, {}), probe: clone(probe, {}),
          errors: [text(error?.message || error || reason)]
        };
      }
    }

    const runtime = activeLibraRuntime();
    if (runtime && typeof runtime.inspectForRetrace === 'function') {
      try {
        const inspected = await runtime.inspectForRetrace({ includeRecords });
        const normalized = normalizeLibraInspection(inspected, identity, 'libra_runtime_api');
        normalized.probe = clone(probe, {});
        return normalized;
      } catch (error) {
        warn('LIBRA runtime inspection failed', error);
      }
    }
    return {
      available: false,
      pluginAvailable: false,
      inspectionAvailable: false,
      integrityOk: false,
      reason: 'libra_ipc_unavailable',
      readSource: 'none',
      pluginVersion: '', recordsIncluded: includeRecords, scope: {}, manifest: {}, integrity: { ok: false },
      memories: [], memoryRefs: [], worldAdditional: [], worldAdditionalRefs: [], recordCount: 0, liveRecordCount: 0,
      inheritedRecordCount: 0, partialRecordCount: 0, worldAdditionalCount: 0,
      snapshotHash: '', probe: clone(probe, {}), errors: [probe.error || 'LIBRA v1.0.4 or later IPC contract is required.']
    };
  };

  const libraReceiptCountMatches = (receipt, field, expected) => (
    Boolean(receipt && Object.prototype.hasOwnProperty.call(receipt, field))
    && Number.isInteger(Number(receipt[field]))
    && Number(receipt[field]) === expected
  );

  // World Additional was retired from current LIBRA handoff. Keep only a strict
  // compatibility bridge for older LIBRA builds: a missing counter is valid when
  // RE:TRACE expects zero, while any non-zero legacy transfer must still prove both
  // counters exactly. This does not recreate World Additional storage or transport.
  const libraLegacyOptionalCountMatches = (receipt, field, expected) => {
    const wanted = Math.max(0, Number(expected || 0) || 0);
    const hasField = Boolean(receipt && Object.prototype.hasOwnProperty.call(receipt, field));
    if (!hasField) return wanted === 0;
    return Number.isInteger(Number(receipt[field])) && Number(receipt[field]) === wanted;
  };

  const libraLegacyWorldAdditionalMatches = (receipt, options = {}) => {
    const expected = Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0);
    return libraLegacyOptionalCountMatches(receipt, 'worldAdditional', expected)
      && libraLegacyOptionalCountMatches(receipt, 'expectedWorldAdditional', expected);
  };

  const libraOwnerReceiptMatches = (receipt, transport, mutation) => (
    transport !== 'libra_plugin_ipc'
    || (
      text(receipt?.ownerPluginId || '') === LIBRA_PLUGIN_ID
      && text(receipt?.authorizedRequester || '') === 'flashback_hayaku_bridge'
      && text(receipt?.mutation || '') === mutation
    )
  );



  const readHayakuCompatibilityBeacon = async () => {
    const raw = await storageGet(HAYAKU_RETRACE_COMPATIBILITY_BEACON_KEY);
    const parsed = parseJson(raw, null);
    if (!parsed || parsed.schema !== HAYAKU_RETRACE_COMPATIBILITY_BEACON_SCHEMA) return null;
    if (text(parsed.pluginId || '') !== HAYAKU_PLUGIN_ID) return null;
    const compatibility = peerCompatibilityPayload(parsed);
    if (!compatibility) return null;
    return {
      raw: compatibility,
      pluginVersion: text(parsed.pluginVersion || compatibility.pluginVersion || ''),
      ownerIpcRegistered: parsed.ownerIpc?.registered === true,
      writtenAt: Math.max(0, Number(parsed.writtenAt || 0) || 0),
      source: 'plugin_storage_beacon'
    };
  };

  const staticHayakuCompatibilityFromPluginMetadata = plugin => {
    if (!plugin || text(plugin.name || '') !== HAYAKU_PLUGIN_ID || plugin.enabled === false) return null;
    const script = text(plugin.script || '');
    if (!script) return null;
    const requiredMarkers = [
      'retrace.peer_compatibility.v1',
      'hayaku.handoff_immutable_source.v1',
      'hayaku.session_handoff.receipt.v1',
      'sourceImmutableHandoff: true',
      'durableTargetReadback: true',
      'idempotentHandoff: true',
      'inheritedStateUsable: true',
      'sourceMutationAllowed: false',
      'sourceCompactionAllowed: false',
      'physicalCopyRequired: false'
    ];
    if (!requiredMarkers.every(marker => script.includes(marker))) return null;
    return {
      schema: RETRACE_PEER_COMPATIBILITY_SCHEMA,
      protocolMajor: RETRACE_PEER_PROTOCOL_MAJOR,
      protocolMinor: 0,
      pluginId: HAYAKU_PLUGIN_ID,
      pluginVersion: text(plugin.versionOfPlugin || plugin.pluginVersion || ''),
      peerRole: 'packet_continuity_memory',
      features: {
        inspect: true,
        nextSessionHandoff: true,
        sourceImmutableHandoff: true,
        durableTargetReadback: true,
        idempotentHandoff: true,
        inheritedStateUsable: true
      },
      handoff: {
        contract: HAYAKU_REQUIRED_HANDOFF_CONTRACT,
        receiptSchemas: [HAYAKU_HANDOFF_RECEIPT_SCHEMA],
        sourceMutationAllowed: false,
        sourceCompactionAllowed: false,
        physicalCopyRequired: false
      }
    };
  };

  const inspectInstalledHayakuMetadata = async () => {
    const api = liveApi(['getDatabase']);
    if (typeof api?.getDatabase !== 'function') return null;
    try {
      const db = await api.getDatabase(['plugins']);
      const plugins = Array.isArray(db?.plugins) ? db.plugins : [];
      const plugin = plugins.find(item => text(item?.name || '') === HAYAKU_PLUGIN_ID) || null;
      if (!plugin) return null;
      return {
        installed: true,
        enabled: plugin.enabled !== false,
        pluginVersion: text(plugin.versionOfPlugin || plugin.pluginVersion || ''),
        allowedIPC: Array.isArray(plugin.allowedIPC) ? plugin.allowedIPC.map(value => text(value)) : [],
        raw: staticHayakuCompatibilityFromPluginMetadata(plugin),
        source: 'risu_plugin_metadata'
      };
    } catch (_) {
      return null;
    }
  };

  const probeHayakuRuntimeCompatibility = async () => {
    const candidates = [];
    try {
      candidates.push(
        globalThis?.HAYAKU,
        globalThis?.__pluginApis__?.HAYAKU,
        globalThis?.__pluginApis__?.hayaku
      );
    } catch (_) {}
    for (const candidate of candidates) {
      if (!candidate || typeof candidate !== 'object') continue;
      let raw = peerCompatibilityPayload(candidate);
      if (!raw && typeof candidate.runtime === 'function') {
        try { raw = peerCompatibilityPayload(await Promise.resolve(candidate.runtime())); } catch (_) {}
      }
      if (!raw) continue;
      return {
        raw,
        pluginVersion: text(raw?.pluginVersion || candidate?.version || ''),
        runtime: candidate
      };
    }
    return null;
  };

  const probeUniversalPeerCompatibility = async (key, options = {}) => {
    const requirement = RETRACE_PEER_REQUIREMENTS[key];
    const timeoutMs = Math.max(700, Math.min(8000, Number(options.timeoutMs || 2400) || 2400));
    const required = options.required === true;
    if (key === 'hayaku') {
      const gate = await probeLiveHayakuOwner({
        force: options.forceProbe === true,
        timeoutMs
      });
      if (gate.ready !== true) {
        if (gate.state === 'incompatible') {
          const evaluated = evaluatePeerCompatibility(requirement, gate.capabilities, true, { required });
          return {
            ...evaluated,
            installed: true,
            ownerReachable: false,
            transport: 'hayaku_plugin_ipc',
            status: 'owner_incompatible',
            blocking: required === true,
            compatible: false,
            reason: '활성 HAYAKU owner가 호환 계약을 충족하지 않아 HAYAKU 관련 기능을 실행하지 않습니다.',
            error: gate.reason || 'hayaku_owner_incompatible'
          };
        }
        return {
          key: requirement?.key || 'hayaku',
          label: requirement?.label || 'HAYAKU',
          pluginId: HAYAKU_PLUGIN_ID,
          installed: false,
          required: false,
          compatible: true,
          blocking: false,
          status: 'owner_absent_disabled',
          pluginVersion: '',
          protocolMajor: 0,
          handoffContract: '',
          errors: [],
          warnings: [],
          reason: '활성 HAYAKU owner가 없어 RE:TRACE의 HAYAKU 하위 시스템을 전부 실행하지 않습니다.',
          sourceDetected: false,
          ownerReachable: false,
          transport: 'hayaku_owner_probe',
          error: gate.reason || 'hayaku_owner_absent'
        };
      }
      const evaluated = evaluatePeerCompatibility(requirement, gate.capabilities, true, { required });
      return {
        ...evaluated,
        installed: true,
        ownerReachable: true,
        transport: 'hayaku_plugin_ipc',
        sourceDetected: false,
        error: ''
      };
    }
    let raw = null;
    let installed = false;
    let transport = 'none';
    let errorText = '';
    let ownerReachable = false;
    let pluginVersionHint = '';
    let sourceDetected = options.sourceEvidence === true;
    try {
      if (key === 'flashback') {
        raw = await requestFlashbackIpc('capabilities', {}, { timeoutMs });
        installed = true;
        ownerReachable = true;
        transport = 'flashback_plugin_ipc';
      } else if (key === 'hayaku') {
        const attempts = options.forceProbe === true ? 3 : 2;
        let lastError = null;
        for (let attempt = 1; attempt <= attempts && !raw; attempt += 1) {
          try {
            raw = await requestHayakuIpc('capabilities', {}, {
              timeoutMs,
              ignoreCooldown: options.forceProbe === true || attempt > 1,
              suppressCooldown: attempt < attempts
            });
            installed = true;
            ownerReachable = true;
            transport = 'hayaku_plugin_ipc';
            Runtime.hayakuIpcUnavailableUntil = 0;
          } catch (error) {
            lastError = error;
            if (attempt < attempts) await delay(Math.min(700, 250 * attempt));
          }
        }
        if (!raw && lastError) throw lastError;
      } else if (key === 'libra') {
        const probe = await probeLibraIpc({ timeoutMs, attempts: 1 });
        installed = probe.available === true || probe.reachable === true;
        ownerReachable = installed;
        raw = probe.capabilities;
        transport = 'libra_plugin_ipc';
        errorText = text(probe.error || '');
      } else if (key === 'lia') {
        raw = await requestLiaIpc('capabilities', {}, { timeoutMs });
        installed = true;
        ownerReachable = true;
        transport = 'lia_plugin_ipc';
      }
    } catch (error) {
      const code = text(error?.code || '');
      errorText = text(error?.message || error);
      installed = [
        'FLASHBACK_IPC_REJECTED',
        'HAYAKU_IPC_REJECTED',
        'LIBRA_IPC_REJECTED',
        'LIA_IPC_REJECTED'
      ].includes(code) || error?.remoteReachable === true;
      ownerReachable = installed;
    }

    if (key === 'hayaku' && !raw) {
      // API v3 plugins normally live in isolated iframes, so cross-plugin globalThis
      // is only a legacy/shared-realm fallback, never the primary discovery path.
      const runtimeProbe = await probeHayakuRuntimeCompatibility().catch(() => null);
      if (runtimeProbe?.raw) {
        raw = runtimeProbe.raw;
        installed = true;
        ownerReachable = true;
        pluginVersionHint = runtimeProbe.pluginVersion;
        transport = 'hayaku_runtime_compatibility';
      }
    }
    if (key === 'hayaku' && !raw) {
      const beacon = await readHayakuCompatibilityBeacon().catch(() => null);
      if (beacon?.raw) {
        raw = beacon.raw;
        installed = true;
        pluginVersionHint = beacon.pluginVersion;
        transport = 'hayaku_plugin_storage_beacon';
      }
    }
    if (key === 'hayaku' && !raw && options.inspectInstalledMetadata === true) {
      const metadata = await inspectInstalledHayakuMetadata().catch(() => null);
      if (metadata?.installed) {
        installed = true;
        pluginVersionHint = metadata.pluginVersion;
        if (metadata.raw) {
          raw = metadata.raw;
          transport = 'hayaku_static_contract_attestation';
        } else if (transport === 'none') {
          transport = 'hayaku_plugin_metadata';
        }
      }
    }
    if (key === 'hayaku' && sourceDetected) {
      installed = true;
      if (transport === 'none') transport = 'hayaku_storage_detected';
    }

    let evaluated = evaluatePeerCompatibility(requirement, raw, installed, { required });
    if (pluginVersionHint && !evaluated.pluginVersion) evaluated.pluginVersion = pluginVersionHint;
    if (key === 'hayaku') {
      const contractCompatible = evaluated.compatible === true;
      // A beacon/static contract can identify the installed build, but a required
      // handoff still needs the live owner channel to perform and verify mutation.
      if (required && installed && ownerReachable !== true) {
        evaluated = {
          ...evaluated,
          compatible: false,
          blocking: true,
          status: contractCompatible ? 'owner_unreachable_required' : 'detected_unreachable_required',
          reason: contractCompatible
            ? `HAYAKU 설치 및 호환 계약은 확인됐지만 owner IPC가 응답하지 않습니다. 호환성 다시 확인을 눌러 재연결을 시도해 주세요.`
            : `HAYAKU 데이터/설치는 감지됐지만 owner IPC에서 호환 계약을 확인하지 못했습니다. 플러그인이 실행 중인지 확인한 뒤 호환성 다시 확인을 눌러 주세요.`,
          errors: [...new Set([...(evaluated.errors || []), 'owner_ipc_unreachable'])],
          contractCompatible
        };
      } else {
        evaluated = { ...evaluated, contractCompatible, ownerReachable };
      }
    }
    return {
      ...evaluated,
      sourceDetected,
      ownerReachable,
      transport,
      error: errorText
    };
  };

  const compatibilityRequiredForPreview = (preview = {}) => ({
    flashback: Math.max(0, Number(preview?.flashback?.loadedRecords ?? preview?.flashback?.records ?? 0) || 0) > 0,
    hayaku: preview?.includeHayaku === true && Math.max(0, Number(preview?.hayakuRecordCount || 0) || 0) > 0,
    libra: preview?.includeLibra === true,
    lia: isLiaLivePersonaId(preview?.identity?.personaId)
  });

  const inspectCompatibilitySuite = async (previewValue = null, options = {}) => {
    const preview = previewValue || Runtime.lastPreview || await inspectTransition();
    const required = compatibilityRequiredForPreview(preview);
    const entries = await Promise.all(ACTIVE_RETRACE_PEER_KEYS.map(key => (
      probeUniversalPeerCompatibility(key, {
        required: required[key] === true,
        timeoutMs: options.timeoutMs,
        forceProbe: options.forceProbe === true,
        inspectInstalledMetadata: options.forceProbe === true,
        sourceEvidence: key === 'hayaku' && (
          required.hayaku === true
          || preview?.hayaku?.available === true
          || Math.max(0, Number(preview?.hayakuRecordCount || 0) || 0) > 0
        )
      })
    )));
    const self = {
      key: 'retrace',
      label: 'RE:TRACE',
      pluginId: 'flashback_hayaku_bridge',
      installed: true,
      required: true,
      compatible: true,
      blocking: false,
      status: 'compatible',
      pluginVersion: PLUGIN_VERSION,
      protocolMajor: RETRACE_PEER_PROTOCOL_MAJOR,
      handoffContract: 'compatibility_hub',
      reason: '호환성 허브가 준비되었습니다.',
      errors: []
    };
    const peers = [self, ...entries];
    const blocking = entries.filter(entry => entry.blocking === true);
    const warnings = entries.filter(entry => entry.installed === true && entry.compatible !== true && entry.blocking !== true);
    const suite = {
      schema: 'retrace.compatibility_suite.v1',
      protocolMajor: RETRACE_PEER_PROTOCOL_MAJOR,
      compatible: blocking.length === 0,
      handoffAllowed: blocking.length === 0,
      blocking,
      warnings,
      peers,
      required,
      checkedAt: Date.now()
    };
    Runtime.compatibilitySuite = suite;
    Runtime.compatibilityCheckedAt = suite.checkedAt;
    return suite;
  };

  const renderCompatibilitySuite = suiteValue => {
    const root = Runtime.root;
    const panel = root?.querySelector?.('#compatibilityPanel');
    if (!panel) return;
    const suite = suiteValue || Runtime.compatibilitySuite;
    if (!suite) {
      panel.className = 'compatibility-panel checking';
      panel.innerHTML = '<div class="compatibility-head"><div><strong>플러그인 호환성</strong><span>연동 계약을 확인하는 중입니다.</span></div><em>CHECKING</em></div>';
      return;
    }
    const warningCount = Math.max(0, Number(suite.warnings?.length || 0) || 0);
    const statusText = suite.compatible
      ? (warningCount ? '승계 가능 · 경고' : '호환됨')
      : '승계 차단';
    const statusClass = suite.compatible
      ? (warningCount ? 'compat-warn' : 'compat-ok')
      : 'compat-bad';
    const rows = (suite.peers || []).map(peer => {
      const state = peer.status === 'owner_unreachable_required'
        ? '연결 재확인 필요'
        : peer.status === 'detected_unreachable_required'
          ? '설치 감지 · 연결 실패'
          : peer.installed === false && peer.required !== true
            ? '미연결'
            : peer.installed === false
              ? '연결 안 됨'
              : peer.compatible
                ? '정상'
                : peer.blocking
                  ? '호환 불일치 · 차단'
                  : '호환 불일치 · 현재 미사용';
      const rowClass = peer.installed === false && peer.required !== true ? 'muted' : peer.compatible ? 'ok' : peer.blocking ? 'bad' : 'muted';
      const version = peer.pluginVersion ? `v${escapeHtml(peer.pluginVersion)}` : '-';
      return `<div class="compat-row ${rowClass}">
        <div class="compat-name"><strong>${escapeHtml(peer.label)}</strong><span>${version}</span></div>
        <div class="compat-state">${escapeHtml(state)}</div>
        <small>${escapeHtml(peer.reason || '')}</small>
      </div>`;
    }).join('');
    const warning = !suite.compatible
      ? `이번 승계에 필요한 플러그인 중 호환성 문제가 ${formatNumber(suite.blocking?.length || 0)}개 있어 승계를 차단합니다. 경고 확인은 표시만 확인할 뿐 안전장치를 우회하지 않습니다.`
      : warningCount
        ? `이번 승계에 사용되지 않는 설치 플러그인 ${formatNumber(warningCount)}개에서 호환 계약 불일치가 감지됐습니다. 현재 승계에는 참여하지 않으므로 진행할 수 있지만, 해당 플러그인의 데이터가 있는 세션에서는 업데이트가 필요합니다.`
        : '이번 승계에 필요한 모든 플러그인이 공통 비파괴 승계 계약을 만족합니다. 미설치 또는 사용하지 않는 플러그인은 승계를 막지 않습니다.';
    panel.className = `compatibility-panel ${statusClass}`;
    panel.innerHTML = `<div class="compatibility-head"><div><strong>${formatNumber((suite.peers || []).length)}개 플러그인 호환성</strong><span>${escapeHtml(warning)}</span></div><em>${escapeHtml(statusText)}</em></div>
      <div class="compat-grid">${rows}</div>
      <div class="compat-actions"><button id="refreshCompatibility" class="btn" type="button">호환성 다시 확인</button>${(!suite.compatible || warningCount) ? '<button id="ackCompatibility" class="btn" type="button">경고 확인</button>' : ''}</div>`;
    bindCompatibilityControls();
  };

  const bindCompatibilityControls = () => {
    const root = Runtime.root;
    const refresh = root?.querySelector?.('#refreshCompatibility');
    if (refresh && refresh.dataset.bound !== 'true') {
      refresh.dataset.bound = 'true';
      refresh.addEventListener('click', async () => {
        if (Runtime.busy) return;
        setBusy(true);
        try {
          Runtime.hayakuIpcUnavailableUntil = 0;
          cancelCompatibilityAutoRetry();
          Runtime.compatibilityAutoRetryAttempt = 0;
          const preview = await inspectTransition();
          const suite = await inspectCompatibilitySuite(preview, { timeoutMs: 3200, forceProbe: true });
          renderCompatibilitySuite(suite);
        } catch (error) {
          const panel = Runtime.root?.querySelector?.('#compatibilityPanel');
          if (panel) panel.innerHTML = `<div class="compatibility-head"><div><strong>플러그인 호환성</strong><span>${escapeHtml(error?.message || error)}</span></div><em>ERROR</em></div>`;
        } finally {
          setBusy(false);
        }
      });
    }
    const acknowledge = root?.querySelector?.('#ackCompatibility');
    if (acknowledge && acknowledge.dataset.bound !== 'true') {
      acknowledge.dataset.bound = 'true';
      acknowledge.addEventListener('click', () => {
        Runtime.compatibilityAcknowledgedAt = Date.now();
        const panel = Runtime.root?.querySelector?.('#compatibilityPanel');
        panel?.classList?.add('acknowledged');
        acknowledge.textContent = '경고 확인됨';
        acknowledge.disabled = true;
      });
    }
  };

  const cancelCompatibilityAutoRetry = () => {
    if (Runtime.compatibilityAutoRetryTimer) clearTimeout(Runtime.compatibilityAutoRetryTimer);
    Runtime.compatibilityAutoRetryTimer = null;
  };

  const hayakuCompatibilityNeedsOwnerRetry = suite => {
    const peer = (suite?.peers || []).find(item => item?.key === 'hayaku');
    if (!peer || peer.required !== true) return false;
    return peer.ownerReachable !== true && (
      peer.sourceDetected === true
      || peer.installed === true
      || ['missing_required', 'owner_unreachable_required', 'detected_unreachable_required'].includes(peer.status)
    );
  };

  const scheduleCompatibilityAutoRetry = previewValue => {
    if (!Runtime.visible || !Runtime.root) return;
    if (Runtime.compatibilityAutoRetryAttempt >= 3) return;
    cancelCompatibilityAutoRetry();
    const attempt = Runtime.compatibilityAutoRetryAttempt + 1;
    Runtime.compatibilityAutoRetryAttempt = attempt;
    const delayMs = [0, 1800, 4200, 8200][attempt] || 8200;
    Runtime.compatibilityAutoRetryTimer = setTimeout(async () => {
      Runtime.compatibilityAutoRetryTimer = null;
      if (!Runtime.visible || Runtime.busy) {
        scheduleCompatibilityAutoRetry(previewValue);
        return;
      }
      try {
        Runtime.hayakuIpcUnavailableUntil = 0;
        const preview = previewValue || Runtime.lastPreview || await inspectTransition();
        const suite = await inspectCompatibilitySuite(preview, { timeoutMs: 3400, forceProbe: true });
        renderCompatibilitySuite(suite);
        if (hayakuCompatibilityNeedsOwnerRetry(suite)) scheduleCompatibilityAutoRetry(preview);
        else Runtime.compatibilityAutoRetryAttempt = 0;
      } catch (_) {
        scheduleCompatibilityAutoRetry(previewValue);
      }
    }, delayMs);
  };

  const refreshCompatibility = async (previewValue = null) => {
    const panel = Runtime.root?.querySelector?.('#compatibilityPanel');
    if (panel) {
      panel.className = 'compatibility-panel checking';
      panel.innerHTML = '<div class="compatibility-head"><div><strong>플러그인 호환성</strong><span>공통 승계 계약과 버전 독립 호환성을 확인하는 중입니다.</span></div><em>CHECKING</em></div>';
    }
    try {
      const suite = await inspectCompatibilitySuite(previewValue, { timeoutMs: 2800 });
      renderCompatibilitySuite(suite);
      if (hayakuCompatibilityNeedsOwnerRetry(suite)) scheduleCompatibilityAutoRetry(previewValue);
      else {
        cancelCompatibilityAutoRetry();
        Runtime.compatibilityAutoRetryAttempt = 0;
      }
      return suite;
    } catch (error) {
      if (panel) {
        panel.className = 'compatibility-panel compat-bad';
        panel.innerHTML = `<div class="compatibility-head"><div><strong>호환성 검사 실패</strong><span>${escapeHtml(error?.message || error)}</span></div><em>ERROR</em></div>`;
      }
      throw error;
    }
  };

  const libraArchiveReceiptMatches = (receipt, options) => {
    const expectedArchiveId = text(options?.expectedArchiveId || '').trim();
    const expectedArchiveDigest = text(options?.expectedArchiveDigest || '').trim();
    const expectedArchiveGeneration = Math.max(0, Number(options?.expectedArchiveGeneration || 0) || 0);
    if (expectedArchiveId && text(receipt?.archiveId || '') !== expectedArchiveId) return false;
    if (expectedArchiveDigest && text(receipt?.archiveDigest || '') !== expectedArchiveDigest) return false;
    if (expectedArchiveGeneration && Number(receipt?.archiveGeneration || 0) !== expectedArchiveGeneration) return false;
    return true;
  };

  const libraPreparationReceiptMatches = (receipt, options, transport) => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    return receipt?.schema === LIBRA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'prepared'
      && receipt?.prepared === true
      && receipt?.durable === true
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && libraReceiptCountMatches(receipt, 'records', expectedRecords)
      && libraReceiptCountMatches(receipt, 'expectedRecords', expectedRecords)
      && libraLegacyWorldAdditionalMatches(receipt, options)
      && text(receipt?.archiveId || '').trim().length > 0
      && Number.isInteger(Number(receipt?.archiveGeneration))
      && Number(receipt.archiveGeneration) >= 1
      && text(receipt?.archiveDigest || '').trim().length > 0
      && libraReceiptCountMatches(receipt, 'archiveRecordCount', expectedRecords)
      && libraArchiveReceiptMatches(receipt, options)
      && sourcePreservationReceiptMatches(receipt, RETRACE_PEER_REQUIREMENTS.libra, { physicalField: 'physicalMemoryCopies' })
      && memorySuiteStorageReceiptMatches(receipt, 'libra')
      && libraOwnerReceiptMatches(receipt, transport, 'prepare_session_handoff');
  };

  const libraAdoptionReceiptMatches = (receipt, options, transport) => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    return receipt?.schema === LIBRA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'adopted'
      && receipt?.adopted === true
      && receipt?.verified === true
      && receipt?.durable === true
      && text(receipt?.targetChatId || '') === text(options?.targetChatId || '')
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && libraReceiptCountMatches(receipt, 'records', expectedRecords)
      && libraReceiptCountMatches(receipt, 'expectedRecords', expectedRecords)
      && libraLegacyWorldAdditionalMatches(receipt, options)
      && libraArchiveReceiptMatches(receipt, options)
      && sourcePreservationReceiptMatches(receipt, RETRACE_PEER_REQUIREMENTS.libra, { physicalField: 'physicalMemoryCopies' })
      && memorySuiteStorageReceiptMatches(receipt, 'libra')
      && libraOwnerReceiptMatches(receipt, transport, 'adopt_session_handoff');
  };

  const libraVerificationReceiptMatches = (receipt, options, transport) => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    return receipt?.schema === LIBRA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'verified'
      && receipt?.verified === true
      && receipt?.durable === true
      && text(receipt?.targetChatId || '') === text(options?.targetChatId || '')
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && libraReceiptCountMatches(receipt, 'records', expectedRecords)
      && libraReceiptCountMatches(receipt, 'expectedRecords', expectedRecords)
      && libraLegacyWorldAdditionalMatches(receipt, options)
      && libraArchiveReceiptMatches(receipt, options)
      && sourcePreservationReceiptMatches(receipt, RETRACE_PEER_REQUIREMENTS.libra, { physicalField: 'physicalMemoryCopies' })
      && memorySuiteStorageReceiptMatches(receipt, 'libra')
      && libraOwnerReceiptMatches(receipt, transport, 'verify_session_handoff');
  };

  const withLegacyLibraWorldAdditionalExpectation = (options = {}, count = 0) => {
    const expected = Math.max(0, Number(count || 0) || 0);
    return expected > 0 ? { ...options, expectedWorldAdditional: expected } : { ...options };
  };

  const libraIpcAllowsRuntimeFallback = error => {
    const code = text(error?.code || '').trim();
    // Once the official owner replied, a rejection is semantic and must not be
    // repeated through a second transport. Retrying SOURCE_MUTATION_DETECTED or any
    // other fail-closed owner error can duplicate archive preparation and obscures
    // the real reason. Only transport/unreachable failures may use the runtime API.
    if (error?.remoteReachable === true || code === 'LIBRA_IPC_REJECTED') return false;
    return true;
  };

  const prepareLibraSessionHandoff = async options => {
    const runtime = activeLibraRuntime();
    try {
      const result = await requestLibraIpc('prepare_session_handoff', options || {}, { timeoutMs: LIBRA_PREPARE_TIMEOUT_MS });
      if (!libraPreparationReceiptMatches(result, options, 'libra_plugin_ipc')) {
        throw new Error('LIBRA handoff preparation receipt is invalid.');
      }
      return { ...result, transport: 'libra_plugin_ipc' };
    } catch (error) {
      if (libraIpcAllowsRuntimeFallback(error) && runtime && typeof runtime.prepareSessionHandoff === 'function') {
        const result = await runtime.prepareSessionHandoff(options || {});
        if (!libraPreparationReceiptMatches(result, options, 'libra_runtime_api')) {
          throw new Error('LIBRA runtime handoff preparation receipt is invalid.');
        }
        return { ...result, transport: 'libra_runtime_api' };
      }
      throw error;
    }
  };

  const adoptLibraSessionHandoff = async options => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    const runtime = activeLibraRuntime();
    try {
      const result = await requestLibraIpc('adopt_session_handoff', options || {}, { timeoutMs: LIBRA_ADOPT_TIMEOUT_MS });
      return { ...result, transport: 'libra_plugin_ipc' };
    } catch (error) {
      if (libraIpcAllowsRuntimeFallback(error) && runtime && typeof runtime.adoptSessionHandoff === 'function') {
        try {
          const result = await runtime.adoptSessionHandoff(options || {});
          return { ...result, transport: 'libra_runtime_api' };
        } catch (runtimeError) {
          error = runtimeError;
        }
      }
      return {
        schema: LIBRA_HANDOFF_RECEIPT_SCHEMA,
        action: 'adopted', adopted: false, verified: false, durable: false,
        records: 0, expectedRecords,
        targetChatId: text(options?.targetChatId || ''),
        transferId: text(options?.transferId || ''), transport: 'unavailable',
        reason: text(error?.message || error || 'libra_handoff_adoption_failed')
      };
    }
  };

  const adoptLibraSessionHandoffDurable = async options => {
    let last = null;
    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      last = await adoptLibraSessionHandoff(options || {});
      const receiptMatches = libraAdoptionReceiptMatches(last, options, last?.transport);
      if (receiptMatches) {
        return { ...last, attempts: attempt };
      }
      if (attempt < maxAttempts) await delay(Math.min(1200, 220 * attempt));
    }
    return {
      ...(last || {}),
      attempts: maxAttempts,
      verified: false,
      durable: false,
      reason: 'libra_handoff_receipt_mismatch'
    };
  };

  const verifyDurableLibraSessionHandoff = async options => {
    if (options?.included !== true) return {
      schema: LIBRA_HANDOFF_RECEIPT_SCHEMA, action: 'verified', verified: true, durable: true,
      adopted: false, records: 0, expectedRecords: 0, reason: 'no_libra_data'
    };
    const payload = withLegacyLibraWorldAdditionalExpectation({
      transferId: text(options?.transferId || ''),
      targetChatId: text(options?.targetChatId || ''),
      expectedRecords: Math.max(0, Number(options?.expectedRecords || 0) || 0),
      expectedArchiveId: text(options?.expectedArchiveId || ''),
      expectedArchiveGeneration: Math.max(0, Number(options?.expectedArchiveGeneration || 0) || 0),
      expectedArchiveDigest: text(options?.expectedArchiveDigest || '')
    }, options?.expectedWorldAdditional);
    const runtime = activeLibraRuntime();
    try {
      const result = await requestLibraIpc('verify_session_handoff', payload, { timeoutMs: LIBRA_VERIFY_TIMEOUT_MS });
      const receiptMatches = libraVerificationReceiptMatches(result, payload, 'libra_plugin_ipc');
      return receiptMatches
        ? { ...result, transport: 'libra_plugin_ipc' }
        : { ...result, verified: false, durable: false, transport: 'libra_plugin_ipc', reason: 'libra_handoff_receipt_mismatch' };
    } catch (error) {
      if (libraIpcAllowsRuntimeFallback(error) && runtime && typeof runtime.verifySessionHandoff === 'function') {
        try {
          const result = await runtime.verifySessionHandoff(payload);
          return libraVerificationReceiptMatches(result, payload, 'libra_runtime_api')
            ? { ...result, transport: 'libra_runtime_api' }
            : { ...result, verified: false, durable: false, transport: 'libra_runtime_api', reason: 'libra_handoff_receipt_mismatch' };
        } catch (runtimeError) {
          error = runtimeError;
        }
      }
      return {
        schema: LIBRA_HANDOFF_RECEIPT_SCHEMA, action: 'verified', verified: false, durable: false,
        records: 0, expectedRecords: payload.expectedRecords,
        targetChatId: payload.targetChatId,
        transferId: payload.transferId, transport: 'unavailable',
        reason: text(error?.message || error || 'libra_handoff_verification_failed')
      };
    }
  };

  const inspectTransition = async (options = {}) => {
    const context = await getCurrentContext();
    const identity = contextIdentity(context);
    const pendingHandoff = await inspectPendingNextSessionHandoff({ context });
    const hayakuOwnerGate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
    const hayakuDisabled = { available: false, ownerReady: false, reason: 'hayaku_owner_absent', records: [], recordCount: 0, scope: hayakuScopeFor(context) };
    const noCapsule = { available: false, reason: 'hayaku_owner_absent', packets: [] };
    const [flashback, hayaku, pendingColdStart, pendingIncrementalRecovery, libra] = await Promise.all([
      readFlashbackSource(context, { includeRecords: false }),
      hayakuOwnerGate.ready === true ? readHayakuSource(context, { includeRecords: false, ownerGate: hayakuOwnerGate }) : Promise.resolve(hayakuDisabled),
      hayakuOwnerGate.ready === true ? readPendingColdStartCapsule(context, { ownerGate: hayakuOwnerGate }) : Promise.resolve(noCapsule),
      hayakuOwnerGate.ready === true ? readPendingIncrementalRecoveryCapsule(context, { ownerGate: hayakuOwnerGate }) : Promise.resolve(noCapsule),
      readLibraSource(context, { includeRecords: false })
    ]);
    let memorySuiteServer = Runtime.memorySuitePeerServer;
    if (options?.includeServerData === true) {
      memorySuiteServer = await inspectMemorySuitePeerServerData({
        peerAvailability: {
          flashback: Boolean(activeFlashbackRuntime()) || Runtime.flashbackIpcLastSeenAt > 0 || flashback?.readSource === 'flashback_plugin_ipc',
          hayaku: hayakuOwnerGate.ready === true,
          libra: libra?.pluginAvailable === true,
          lia: isLiaLivePersonaId(identity.personaId)
        }
      });
    } else if (!memorySuiteServer || Date.now() - Number(memorySuiteServer.at || 0) > 30000) {
      memorySuiteServer = { at: Date.now(), skipped: true, reason: 'server_probe_deferred', namespaces: {} };
    }
    const baseHayakuRecordCount = hayakuOwnerGate.ready === true && hayaku.available
      ? Math.max(0, Number(hayaku.recordCount ?? hayaku.records?.length ?? 0) || 0)
      : 0;
    const hayakuRecoveryAccounting = hayakuOwnerGate.ready === true
      ? await hayakuIncrementalRecoveryAccounting(hayaku, pendingIncrementalRecovery, { baseRecordCount: baseHayakuRecordCount })
      : {
          available: false, logicalRecordCount: 0, localRecordCount: 0, archiveRecordCount: 0,
          currentSnapshotRecordCount: 0, recoveryRecordCount: 0, missingRecoveryCount: 0,
          durableVerified: false, reason: 'hayaku_owner_absent'
        };
    const preview = {
      context,
      identity,
      flashback,
      hayaku,
      hayakuOwnerGate,
      libra,
      pendingColdStart,
      pendingIncrementalRecovery,
      hayakuRecoveryAccounting,
      pendingHandoff,
      includeHayaku: hayakuOwnerGate.ready === true && (hayaku.available === true || pendingColdStart.available === true || pendingIncrementalRecovery.available === true),
      includeLibra: libra.available === true,
      hayakuRecordCount: hayakuRecoveryAccounting.logicalRecordCount,
      hayakuCurrentRecordCount: hayakuRecoveryAccounting.currentSnapshotRecordCount,
      hayakuRecoveryRecordCount: hayakuRecoveryAccounting.recoveryRecordCount,
      hayakuPendingRecoveryRecordCount: hayakuRecoveryAccounting.missingRecoveryCount,
      hayakuArchiveRecordCount: hayakuRecoveryAccounting.archiveRecordCount,
      hayakuRecoveryDurableVerified: hayakuRecoveryAccounting.durableVerified,
      libraRecordCount: libra.recordCount,
      memorySuiteServer,
      serverDataDetected: Object.fromEntries(Object.entries(memorySuiteServer?.namespaces || {}).map(([key, value]) => [
        key,
        key === 'hayaku' && hayakuOwnerGate.ready !== true
          ? false
          : value?.available === true && Number(value?.liveRecords || 0) > 0
      ])),
      inspectedAt: Date.now()
    };
    Runtime.lastPreview = preview;
    return preview;
  };
  const hayakuBackupCatalogKey = scopeKey => `${HAYAKU_BACKUP_CATALOG_PREFIX}${scopeKey}`;
  const listHayakuLedgerBackups = async () => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 백업 목록 조회', force: true });
    const context = await getCurrentContext();
    const scope = hayakuScopeFor(context);
    if (!scope.available) return { available: false, reason: scope.reason, scopeKey: '', entries: [] };
    const key = hayakuBackupCatalogKey(scope.scopeKey);
    const catalog = parseJson(await storageGet(key), null);
    const entries = catalog?.schema === HAYAKU_BACKUP_CATALOG_SCHEMA && Array.isArray(catalog.entries)
      ? catalog.entries.filter(entry => entry && text(entry.storageKey || '').trim())
      : [];
    return {
      available: true,
      reason: entries.length ? 'loaded' : 'empty',
      scopeKey: scope.scopeKey,
      storageKey: key,
      entries: entries.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    };
  };

  const backupHayakuLedger = async () => {
    await ensureHayakuOwnerReady({ action: 'HAYAKU 원장 백업', force: true });
    const context = await getCurrentContext();
    const hayaku = await readHayakuSource(context, { includeRecords: true });
    const scope = hayaku.scope || hayakuScopeFor(context);
    if (!scope?.available) throw new Error('HAYAKU 스코프를 계산하지 못했습니다.');
    if (!hayaku.ledger || !HAYAKU_LEDGER_SCHEMAS.has(text(hayaku.ledger.version))) {
      throw new Error('백업할 HAYAKU 미러 원장이 없습니다.');
    }
    const createdAt = Date.now();
    const ledgerJson = JSON.stringify(hayaku.ledger);
    const checksum = stableHash64(ledgerJson);
    const backupId = `hayaku-backup-${createdAt}-${checksum.slice(-10)}`;
    const storageKey = `${HAYAKU_BACKUP_PREFIX}${scope.scopeKey}:${backupId}`;
    const recordCount = Array.isArray(hayaku.ledger.records) ? hayaku.ledger.records.length : 0;
    const slotHeadCount = Array.isArray(hayaku.ledger.slotHeads) ? hayaku.ledger.slotHeads.length : 0;
    const tombstoneCount = Array.isArray(hayaku.ledger.tombstones) ? hayaku.ledger.tombstones.length : 0;
    const envelopeMeta = {
      schema: HAYAKU_BACKUP_SCHEMA,
      backupId,
      scopeKey: scope.scopeKey,
      sourceStorageKey: scope.storageKey || `${HAYAKU_LEDGER_PREFIX}${scope.scopeKey}`,
      sourceReadMethod: text(hayaku.readSource || 'unknown'),
      sourceLedgerVersion: text(hayaku.ledger.version || ''),
      createdAt,
      checksum,
      recordCount,
      slotHeadCount,
      tombstoneCount,
      immutable: true
    };
    // Insert the already-serialized ledger as raw JSON so a large ledger is not
    // deep-cloned and serialized yet another time merely to build the envelope.
    const metaJson = JSON.stringify(envelopeMeta);
    const envelopeJson = `${metaJson.slice(0, -1)},"ledger":${ledgerJson}}`;
    if (!await storageSet(storageKey, envelopeJson)) {
      throw new Error('HAYAKU 미러 원장 백업을 저장하지 못했습니다.');
    }
    const verifiedRaw = await storageGet(storageKey);
    if (typeof verifiedRaw !== 'string' || stableHash64(verifiedRaw) !== stableHash64(envelopeJson)) {
      throw new Error('HAYAKU 미러 원장 백업 저장 검증에 실패했습니다.');
    }
    const catalogKey = hayakuBackupCatalogKey(scope.scopeKey);
    const previous = parseJson(await storageGet(catalogKey), null);
    const entries = previous?.schema === HAYAKU_BACKUP_CATALOG_SCHEMA && Array.isArray(previous.entries)
      ? previous.entries.filter(entry => entry?.backupId !== backupId)
      : [];
    entries.push({ backupId, storageKey, createdAt, checksum, recordCount, slotHeadCount, tombstoneCount });
    const catalog = {
      schema: HAYAKU_BACKUP_CATALOG_SCHEMA,
      scopeKey: scope.scopeKey,
      updatedAt: createdAt,
      entries: entries.sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0))
    };
    const catalogSaved = await storageSet(catalogKey, JSON.stringify(catalog));
    const result = {
      ok: true,
      verified: true,
      backupId,
      scopeKey: scope.scopeKey,
      storageKey,
      catalogKey,
      catalogSaved,
      checksum,
      createdAt,
      recordCount,
      slotHeadCount,
      tombstoneCount,
      serializationMode: 'single_ledger_json'
    };
    Runtime.lastHayakuBackup = result;
    return result;
  };

  const saveCharacter = async (character, characterIndex) => {
    const payload = clone(character, null);
    if (!payload) throw new Error('캐릭터 저장 데이터를 복제하지 못했습니다.');
    const indexed = liveApi(['setCharacterToIndex']);
    if (characterIndex >= 0 && typeof indexed?.setCharacterToIndex === 'function') {
      const saved = await indexed.setCharacterToIndex(characterIndex, payload);
      if (saved === false) throw new Error('setCharacterToIndex 저장이 거부되었습니다.');
      return { writer: 'setCharacterToIndex', characterIndex };
    }
    const direct = liveApi(['setCharacter']) || liveApi();
    if (typeof direct?.setCharacter !== 'function') throw new Error('RisuAI 캐릭터 저장 API가 없습니다.');
    const saved = await direct.setCharacter(payload);
    if (saved === false) throw new Error('setCharacter 저장이 거부되었습니다.');
    return { writer: 'setCharacter', characterIndex };
  };

  const sealNextSessionHandoffJournal = value => {
    const journal = clone(value, {});
    delete journal.journalDigest;
    journal.journalDigest = stableHash64(JSON.stringify(journal));
    return journal;
  };

  const nextSessionHandoffJournalFromChat = chat => {
    const targetChatId = contextIdentity({ chat }).chatId;
    const bridge = chat?.memorySessionBridge && typeof chat.memorySessionBridge === 'object'
      ? chat.memorySessionBridge
      : null;
    const journal = bridge?.handoffJournal && typeof bridge.handoffJournal === 'object'
      ? bridge.handoffJournal
      : null;
    if (!bridge || !HANDOFF_ACCEPTED_SCHEMAS.has(text(bridge.schema || '')) || !journal || journal.schema !== HANDOFF_JOURNAL_SCHEMA) {
      return { available: false, reason: 'handoff_journal_absent', targetChatId, bridge: null, journal: null };
    }
    const identityMatches = text(bridge.targetChatId || '') === targetChatId
      && text(journal.targetChatId || '') === targetChatId
      && text(journal.transferId || '') === text(bridge.transferId || '')
      && text(journal.sourceChatId || '') === text(bridge.sourceChatId || '')
      && targetChatId !== text(journal.sourceChatId || '');
    const expectedDigest = text(journal.journalDigest || '');
    const actualDigest = sealNextSessionHandoffJournal(journal).journalDigest;
    const integrityOk = identityMatches && expectedDigest.length > 0 && expectedDigest === actualDigest;
    return {
      available: integrityOk,
      reason: !identityMatches ? 'handoff_journal_identity_mismatch'
        : expectedDigest !== actualDigest ? 'handoff_journal_digest_mismatch'
          : 'handoff_journal_loaded',
      targetChatId,
      bridge: clone(bridge, {}),
      journal: clone(journal, {}),
      integrityOk
    };
  };

  const inspectPendingNextSessionHandoff = async (options = {}) => {
    const context = options?.context || await getCurrentContext();
    const requestedTargetChatId = text(options?.targetChatId || '').trim();
    const currentChatId = contextIdentity(context).chatId;
    const targetChatId = requestedTargetChatId || currentChatId;
    const chats = Array.isArray(context?.character?.chats) ? context.character.chats : [];
    const chat = chats.find(item => contextIdentity({ chat: item }).chatId === targetChatId) || null;
    if (!chat) return { available: false, pending: false, reason: 'handoff_target_chat_missing', targetChatId };
    const loaded = nextSessionHandoffJournalFromChat(chat);
    const pending = loaded.available === true && text(loaded.journal?.state || '') !== 'completed';
    return { ...loaded, context, chat, pending };
  };

  const inspectPendingHandoffDurableStatus = async loaded => {
    const bridge = loaded?.bridge && typeof loaded.bridge === 'object' ? loaded.bridge : {};
    const journal = loaded?.journal && typeof loaded.journal === 'object' ? loaded.journal : {};
    const targetChatId = text(bridge.targetChatId || journal.targetChatId || '').trim();
    const transferId = text(bridge.transferId || journal.transferId || '').trim();
    const hayakuExpectedRecords = Math.max(0, Number(bridge.hayakuRecordCount || 0) || 0);
    const hayakuRequired = bridge.includeHayaku === true && hayakuExpectedRecords > 0;
    const hayaku = hayakuRequired
      ? await verifyHayakuSessionHandoffFromStorage({
        targetChatId,
        transferId,
        sourceScopeKey: text(bridge.sourceHayakuScopeKey || ''),
        expectedRecords: hayakuExpectedRecords
      })
      : { verified: true, durable: true, sourcePreserved: true, records: 0, expectedRecords: 0, reason: 'no_hayaku_data' };
    return { hayakuRequired, hayakuExpectedRecords, hayaku };
  };

  const reconcilePendingHandoffJournalFromDurableReadback = async loaded => {
    if (!loaded?.available || !loaded?.pending) return { ...loaded, reconciled: false };
    const durable = await inspectPendingHandoffDurableStatus(loaded);
    const ownerStatus = clone(loaded.journal?.ownerStatus, {}) || {};
    let changed = false;
    if (durable?.hayakuRequired === true
      && durable?.hayaku?.verified === true
      && durable?.hayaku?.durable === true
      && durable?.hayaku?.sourcePreserved === true
      && ownerStatus?.hayaku?.verified !== true) {
      ownerStatus.hayaku = {
        required: true,
        verified: true,
        durable: true,
        sourcePreserved: true,
        reason: text(durable.hayaku.reason || 'hayaku_handoff_storage_readback_verified'),
        receipt: clone(durable.hayaku, {})
      };
      changed = true;
    }
    if (!changed) return { ...loaded, reconciled: false, durableStatus: durable };
    const complete = Object.values(ownerStatus).every(status => status?.required !== true || status?.verified === true);
    const journal = await persistNextSessionHandoffJournal(loaded.targetChatId, loaded.journal.transferId, {
      state: complete ? 'completed' : 'pending_owner_handoffs',
      ownerStatus,
      completedAt: complete ? Date.now() : Number(loaded.journal?.completedAt || 0) || 0,
      lastError: complete ? '' : text(loaded.journal?.lastError || 'one_or_more_required_owner_handoffs_not_verified'),
      reconciledAt: Date.now(),
      reconcileReason: 'durable_owner_readback'
    });
    const refreshed = await inspectPendingNextSessionHandoff({ targetChatId: loaded.targetChatId });
    return { ...refreshed, reconciled: true, durableStatus: durable, journal };
  };

  const persistNextSessionHandoffJournal = async (targetChatIdValue, transferIdValue, patch = {}) => {
    const targetChatId = text(targetChatIdValue || '').trim();
    const transferId = text(transferIdValue || '').trim();
    const latest = await getCurrentContext();
    const nextCharacter = clone(latest.character, null);
    const chats = Array.isArray(nextCharacter?.chats) ? nextCharacter.chats : [];
    const targetIndex = chats.findIndex(chat => contextIdentity({ chat }).chatId === targetChatId);
    if (!nextCharacter || targetIndex < 0) throw new Error('RE:TRACE pending handoff target chat was not found.');
    const loaded = nextSessionHandoffJournalFromChat(chats[targetIndex]);
    if (!loaded.available || text(loaded.journal?.transferId || '') !== transferId) {
      throw new Error(`RE:TRACE pending handoff journal is invalid: ${loaded.reason || 'identity_mismatch'}`);
    }
    const nextJournal = sealNextSessionHandoffJournal({
      ...clone(loaded.journal, {}),
      ...clone(patch, {}),
      ownerStatus: {
        ...clone(loaded.journal?.ownerStatus, {}),
        ...clone(patch?.ownerStatus, {})
      },
      updatedAt: Date.now()
    });
    chats[targetIndex] = {
      ...clone(chats[targetIndex], {}),
      memorySessionBridge: {
        ...clone(loaded.bridge, {}),
        handoffJournal: nextJournal
      }
    };
    await saveCharacter(nextCharacter, latest.characterIndex);
    const readbackContext = await getCurrentContext();
    const readbackChat = (Array.isArray(readbackContext?.character?.chats) ? readbackContext.character.chats : [])
      .find(chat => contextIdentity({ chat }).chatId === targetChatId);
    const readback = nextSessionHandoffJournalFromChat(readbackChat);
    if (!readback.available
      || text(readback.journal?.transferId || '') !== transferId
      || text(readback.journal?.journalDigest || '') !== text(nextJournal.journalDigest || '')) {
      throw new Error('RE:TRACE pending handoff journal durable readback failed.');
    }
    return readback.journal;
  };

  const requiredHandoffsVerified = status => (
    (status?.flashbackRequired !== true || status?.flashbackVerified === true)
    && (status?.hayakuRequired !== true || status?.hayakuVerified === true)
    && (status?.libraRequired !== true || status?.libraVerified === true)
    && (status?.liaRequired !== true || status?.liaVerified === true)
  );

  const performPendingNextSessionHandoff = async loaded => {
    const bridge = clone(loaded?.bridge, {});
    const journal = clone(loaded?.journal, {});
    const targetChatId = text(bridge.targetChatId || '').trim();
    const transferId = text(bridge.transferId || '').trim();
    const sourceChatId = text(bridge.sourceChatId || '').trim();
    if (!loaded?.available || !targetChatId || !transferId || !sourceChatId || sourceChatId === targetChatId) {
      throw new Error('RE:TRACE pending handoff journal identity is invalid.');
    }
    const activeChatId = contextIdentity(await getCurrentContext()).chatId;
    if (activeChatId !== targetChatId) {
      throw new Error('Select the pending target chat before resuming its owner handoffs.');
    }
    const attempt = Math.max(0, Number(journal.attempts || 0) || 0) + 1;

    const flashbackRecords = Math.max(0, Number(bridge.flashbackRecordCount || 0) || 0);
    const hayakuRecords = Math.max(0, Number(bridge.hayakuRecordCount || 0) || 0);
    const libraRecords = Math.max(0, Number(bridge.libraRecordCount || 0) || 0);
    const libraWorldAdditional = Math.max(0, Number(bridge.libraWorldAdditionalCount || 0) || 0);
    const sourceLivePersonaId = text(bridge.sourceLiaLivePersonaId || '').trim();
    const flashbackRequired = bridge.includeFlashback === true && flashbackRecords > 0;
    const hayakuRequired = bridge.includeHayaku === true && hayakuRecords > 0;
    const libraRequired = bridge.includeLibra === true;
    const liaRequired = bridge.includeLiaLivePersona === true && isLiaLivePersonaId(sourceLivePersonaId);
    const libraOptions = withLegacyLibraWorldAdditionalExpectation({
      targetChatId, transferId,
      expectedRecords: libraRecords,
      expectedArchiveId: text(bridge.libraArchiveId || ''),
      expectedArchiveGeneration: Math.max(0, Number(bridge.libraArchiveGeneration || 0) || 0),
      expectedArchiveDigest: text(bridge.libraArchiveDigest || '')
    }, libraWorldAdditional);
    const [flashbackAdoption, hayakuAdoption, libraAdoption, liaAdoption] = await Promise.all([
      adoptFlashbackSessionHandoff({
        targetChatId, transferId,
        sourceScopeKey: text(bridge.sourceFlashbackScopeKey || ''),
        expectedRecords: flashbackRequired ? flashbackRecords : 0,
        expectedSourceStorageFingerprint: text(bridge.sourceFlashbackFingerprint || '')
      }),
      adoptHayakuSessionHandoff({
        targetChatId, transferId,
        sourceScopeKey: text(bridge.sourceHayakuScopeKey || ''),
        expectedRecords: hayakuRequired ? hayakuRecords : 0
      }),
      libraRequired
        ? adoptLibraSessionHandoffDurable(libraOptions)
        : Promise.resolve({ schema: LIBRA_HANDOFF_RECEIPT_SCHEMA, action: 'adopted', adopted: false, verified: true, durable: true, records: 0, expectedRecords: 0, reason: 'no_libra_data' }),
      adoptLiaLivePersonaHandoff({ sourceChatId, targetChatId, transferId, sourceLivePersonaId })
    ]);
    // A successful adoption response is not used as a substitute for a current
    // target-ledger readback. The prepared archive identity is carried through
    // both mutation and verification.
    const libraVerification = libraRequired
      ? await verifyDurableLibraSessionHandoff({ included: true, ...libraOptions })
      : { schema: LIBRA_HANDOFF_RECEIPT_SCHEMA, action: 'verified', verified: true, durable: true, records: 0, expectedRecords: 0, reason: 'no_libra_data' };

    const flashbackVerified = !flashbackRequired || (
      flashbackAdoption?.ok === true
      && flashbackAdoption?.verified === true
      && flashbackAdoption?.durable === true
      && flashbackAdoption?.sourcePreserved === true
      && text(flashbackAdoption?.handoffContract || '') === FLASHBACK_REQUIRED_HANDOFF_CONTRACT
      && Number(flashbackAdoption?.records || 0) === flashbackRecords
    );
    const hayakuVerified = !hayakuRequired || (
      hayakuAdoption?.ok === true
      && hayakuAdoption?.verified === true
      && hayakuAdoption?.durable === true
      && Number(hayakuAdoption?.records || 0) === hayakuRecords
    );
    const libraVerified = !libraRequired
      || libraVerificationReceiptMatches(libraVerification, libraOptions, libraVerification?.transport);
    const liaVerified = !liaRequired || liaAdoptionReceiptMatches(liaAdoption, {
      sourceChatId, targetChatId, transferId, sourceLivePersonaId
    });
    const ok = requiredHandoffsVerified({
      flashbackRequired, flashbackVerified,
      hayakuRequired, hayakuVerified,
      libraRequired, libraVerified,
      liaRequired, liaVerified
    });
    const ownerStatus = {
      flashback: { required: flashbackRequired, verified: flashbackVerified, durable: flashbackAdoption?.durable === true, sourcePreserved: flashbackAdoption?.sourcePreserved === true, reason: text(flashbackAdoption?.reason || ''), receipt: clone(flashbackAdoption, {}) },
      hayaku: { required: hayakuRequired, verified: hayakuVerified, durable: hayakuAdoption?.durable === true, reason: text(hayakuAdoption?.reason || ''), receipt: clone(hayakuAdoption, {}) },
      libra: { required: libraRequired, verified: libraVerified, durable: libraVerification?.durable === true, reason: text(libraVerification?.reason || libraAdoption?.reason || ''), receipt: clone(libraVerification, {}) },
      lia: { required: liaRequired, verified: liaVerified, durable: liaAdoption?.durable === true && liaAdoption?.durableReadbackVerified === true, reason: text(liaAdoption?.reason || ''), receipt: clone(liaAdoption, {}) }
    };
    const finalJournal = await persistNextSessionHandoffJournal(targetChatId, transferId, {
      state: ok ? 'completed' : 'pending_owner_handoffs',
      attempts: attempt,
      ownerStatus,
      writer: clone(loaded?.writer || journal.writer, null),
      lastAttemptAt: Date.now(),
      completedAt: ok ? Date.now() : 0,
      lastError: ok ? '' : 'one_or_more_required_owner_handoffs_not_verified'
    });
    if (!ok) {
      const failedOwners = Object.entries(ownerStatus)
        .filter(([, status]) => status?.required === true && status?.verified !== true)
        .map(([owner, status]) => ({ owner, reason: text(status?.reason || 'not_verified'), receipt: clone(status?.receipt, {}) }));
      warn('Next-session handoff remains incomplete', { targetChatId, transferId, attempt, failedOwners });
    }
    const result = {
      ok,
      schema: HANDOFF_SCHEMA,
      transferId,
      sourceChatId,
      targetChatId,
      resumed: attempt > 1,
      handoffJournalState: finalJournal.state,
      handoffAttempts: attempt,
      flashbackScheduled: flashbackRequired && !flashbackVerified,
      flashbackVerified, flashbackAdoption, flashbackRecords,
      hayakuScheduled: hayakuRequired && !hayakuVerified,
      hayakuVerified, hayakuAdoption, hayakuRecords,
      hayakuSource: text(bridge.hayakuSource || 'none'),
      libraScheduled: libraRequired && !libraVerified,
      libraVerified, libraAdoption, libraVerification,
      libraRecords, libraWorldAdditional,
      libraSource: text(bridge.libraSource || 'none'),
      liaRequired, liaVerified, liaAdoption,
      sourceLivePersonaId: liaRequired ? sourceLivePersonaId : '',
      targetLivePersonaId: liaRequired ? text(liaAdoption?.livePersonaId || '') : '',
      writer: clone(finalJournal.writer, null),
      createdAt: Number(bridge.createdAt || journal.createdAt || Date.now())
    };
    Runtime.lastTransition = result;
    return result;
  };

  const resumeNextSessionHandoff = async (options = {}) => {
    const loaded = await inspectPendingNextSessionHandoff(options || {});
    if (!loaded.available) throw new Error(`RE:TRACE resumable handoff is unavailable: ${loaded.reason || 'not_found'}`);
    const expectedTransferId = text(options?.transferId || '').trim();
    if (expectedTransferId && expectedTransferId !== text(loaded.journal?.transferId || '')) {
      throw new Error('RE:TRACE resumable handoff transfer identity does not match.');
    }
    if (text(loaded.journal?.state || '') === 'completed') {
      throw new Error('RE:TRACE handoff is already durably completed.');
    }
    loaded.writer = clone(options?.writer || loaded.journal?.writer, null);
    const lockKey = `${loaded.targetChatId}:${loaded.journal.transferId}`;
    const existing = Runtime.handoffResumePromises.get(lockKey);
    if (existing) return await existing;
    const promise = (async () => {
      try {
        return await performPendingNextSessionHandoff(loaded);
      } catch (error) {
        try {
          await persistNextSessionHandoffJournal(loaded.targetChatId, loaded.journal.transferId, {
            state: 'pending_owner_handoffs',
            lastError: text(error?.message || error || 'handoff_retry_failed')
          });
        } catch (journalError) {
          warn('RE:TRACE could not persist the failed handoff retry state', journalError);
        }
        throw error;
      } finally {
        Runtime.handoffResumePromises.delete(lockKey);
      }
    })();
    Runtime.handoffResumePromises.set(lockKey, promise);
    return await promise;
  };

  const waitForActiveNextSessionChat = async (targetChatId, timeoutMs = 5000) => {
    const wanted = text(targetChatId || '').trim();
    const deadline = Date.now() + Math.max(500, Number(timeoutMs || 5000) || 5000);
    let lastChatId = '';
    do {
      try {
        const current = await getCurrentContext();
        lastChatId = contextIdentity(current).chatId;
        if (lastChatId === wanted) return { active: true, chatId: lastChatId };
      } catch (_) {}
      await delay(80);
    } while (Date.now() < deadline);
    return { active: false, chatId: lastChatId };
  };

  const continueToNextSession = async () => {
    const pending = await inspectPendingNextSessionHandoff();
    if (pending.pending) {
      return await resumeNextSessionHandoff({
        targetChatId: pending.targetChatId,
        transferId: pending.journal.transferId
      });
    }
    const preview = await inspectTransition({ includeServerData: true });
    const { context, identity, flashback, hayaku, libra, pendingColdStart, pendingIncrementalRecovery } = preview;
    const compatibilitySuite = await inspectCompatibilitySuite(preview, { timeoutMs: 3800, forceProbe: true });
    if (!compatibilitySuite.compatible) {
      const blocking = (compatibilitySuite.blocking || []).map(item => `${item.label}: ${item.reason}`).join(' / ');
      const error = new Error(`RE:TRACE 호환성 검사를 통과하지 못해 다음 세션 승계를 중단했습니다. ${blocking}`);
      error.code = 'RETRACE_PEER_COMPATIBILITY_BLOCKED';
      error.compatibilitySuite = compatibilitySuite;
      throw error;
    }
    if (!identity.chatId) throw new Error('현재 채팅에 안정적인 id가 없습니다.');
    if (flashback.integrityOk === false) {
      throw new Error(`Flashback 원장이 완전하지 않아 다음 세션 승계를 중단했습니다. ${JSON.stringify({
        reason: flashback.reason,
        manifestRecords: Math.max(0, Number(flashback.manifestRecords || flashback.records || 0) || 0),
        loadedRecords: Math.max(0, Number(flashback.loadedRecords || 0) || 0),
        missingShards: Math.max(0, Number(flashback.missingShards || 0) || 0),
        corruptShards: Math.max(0, Number(flashback.corruptShards || 0) || 0),
        recordCountMismatch: flashback.recordCountMismatch === true
      })}`);
    }
    const flashbackRecordCountForHandoff = Math.max(0, Number(flashback.loadedRecords ?? flashback.records ?? 0) || 0);
    let flashbackHandoffCapability = null;
    let flashbackSourceIntegrity = null;
    if (flashbackRecordCountForHandoff > 0) {
      flashbackHandoffCapability = await inspectFlashbackNonDestructiveHandoffCapability();
      if (!flashbackHandoffCapability.supported) {
        throw new Error(`Flashback의 공통 비파괴 승계 계약을 확인할 수 없어 승계를 중단했습니다. 버전 번호가 아니라 ${RETRACE_PEER_COMPATIBILITY_SCHEMA} 계약을 확인합니다. ${JSON.stringify({
          pluginVersion: flashbackHandoffCapability.pluginVersion,
          requiredContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
          reason: flashbackHandoffCapability.reason
        })}`);
      }
      const sourceScopeKey = text(flashback.sourceScope?.scopeKey || '').trim();
      if (!sourceScopeKey) throw new Error('Flashback 원본 scope를 확인할 수 없어 다음 세션 승계를 중단했습니다.');
      flashbackSourceIntegrity = await flashbackSourceStorageIntegritySnapshotForRetrace(sourceScopeKey);
      if (flashbackSourceIntegrity.legacyCompacted) {
        throw new Error('Flashback 원본이 구형 handoff에 의해 archive-only로 compact된 상태입니다. Flashback v0.11.3의 원본 복구를 먼저 완료한 뒤 다시 시도하세요.');
      }
      if (flashbackSourceIntegrity.missingShards > 0) {
        throw new Error(`Flashback 원본 shard가 ${flashbackSourceIntegrity.missingShards}개 누락되어 비파괴 승계를 시작하지 않습니다.`);
      }
    }
    if (libra.pluginAvailable && libra.integrityOk === false) {
      const inspectionFailed = ['libra_inspect_timeout', 'libra_inspect_failed'].includes(text(libra.reason));
      throw new Error(`${inspectionFailed
        ? 'LIBRA is connected, but canonical memory inspection could not be verified; next-session handoff was stopped.'
        : 'LIBRA canonical memory integrity is incomplete; next-session handoff was stopped.'} ${JSON.stringify({
        reason: libra.reason, records: libra.recordCount, integrity: libra.integrity, errors: libra.errors || []
      })}`);
    }
    const targetChatId = uuid();
    const transferId = uuid();
    const createdAt = Date.now();
    const sourceLivePersonaId = text(identity.personaId || '').trim();
    const liaRequired = isLiaLivePersonaId(sourceLivePersonaId);
    const libraPrepareOptions = withLegacyLibraWorldAdditionalExpectation({
      transferId,
      expectedRecords: libra.recordCount
    }, libra.worldAdditionalCount);
    const libraPreparation = preview.includeLibra
      ? await prepareLibraSessionHandoff(libraPrepareOptions)
      : { schema: LIBRA_HANDOFF_RECEIPT_SCHEMA, prepared: false, records: 0, reason: 'no_libra_data' };
    if (preview.includeLibra && (
      libraPreparation.prepared !== true
      || Number(libraPreparation.records || 0) !== Number(libra.recordCount || 0)
      || !libraLegacyWorldAdditionalMatches(libraPreparation, libraPrepareOptions)
    )) {
      throw new Error(`LIBRA next-session handoff preparation failed before creating the new chat: ${libraPreparation.reason || 'record_count_mismatch'}`);
    }

    const nextCharacter = clone(context.character, null);
    if (!nextCharacter) throw new Error('캐릭터를 복제하지 못했습니다.');
    nextCharacter.chats = Array.isArray(nextCharacter.chats) ? nextCharacter.chats : [];
    const newChat = {
      message: [],
      note: text(context.chat?.note || ''),
      name: `Session ${nextCharacter.chats.length + 1} (RE:TRACE)`,
      localLore: [],
      fmIndex: -1,
      id: targetChatId,
      copiedFromChatId: identity.chatId,
      ...(liaRequired ? {
        liaLivePersonaHandoff: {
          schema: LIA_CHAT_HANDOFF_MARKER_SCHEMA,
          transferId, sourceChatId: identity.chatId, targetChatId, sourceLivePersonaId, createdAt
        }
      } : {}),
      ...(flashback.sourceScope?.scopeKey ? { copiedFromScopeKey: text(flashback.sourceScope.scopeKey) } : {}),
      ...(preview.includeLibra ? {
        libraMemoryHandoff: {
          schema: LIBRA_CHAT_HANDOFF_MARKER_SCHEMA,
          transferId, sourceChatId: identity.chatId, targetChatId,
          sourceScopeKey: text(libra.scope?.scopeKey || ''),
          recordCount: libra.recordCount,
          ...(Number(libra.worldAdditionalCount || 0) > 0 ? { worldAdditionalCount: libra.worldAdditionalCount } : {}),
          archiveId: text(libraPreparation?.archiveId || ''),
          archiveGeneration: Math.max(0, Number(libraPreparation?.archiveGeneration || 0) || 0),
          archiveDigest: text(libraPreparation?.archiveDigest || ''),
          preparedAt: libraPreparation.preparedAt || new Date(createdAt).toISOString()
        }
      } : {}),
      memorySessionBridge: {
        schema: HANDOFF_SCHEMA,
        timelineContract: 'session_epoch_then_completed_pair_v1',
        storageContract: 'immutable_source_shared_archive_reference_v2',
        compatibilitySchema: RETRACE_PEER_COMPATIBILITY_SCHEMA,
        compatibilityProtocolMajor: RETRACE_PEER_PROTOCOL_MAJOR,
        handoffContract: FLASHBACK_REQUIRED_HANDOFF_CONTRACT,
        sourcePreservationRequired: true,
        sourceMutationAllowed: false,
        sourceCompactionAllowed: false,
        transferId,
        sourceChatId: identity.chatId,
        sourceFlashbackScopeKey: text(flashback.sourceScope?.scopeKey || ''),
        sourceFlashbackFingerprint: text(flashbackSourceIntegrity?.fingerprint || ''),
        sourceFlashbackOwnerVersion: text(flashbackHandoffCapability?.pluginVersion || flashback.pluginVersion || ''),
        sourceHayakuScopeKey: text(hayaku.scope?.scopeKey || pendingIncrementalRecovery?.scope?.scopeKey || pendingColdStart?.scope?.scopeKey || ''),
        sourceLibraScopeKey: text(libra.scope?.scopeKey || ''),
        targetChatId,
        includeFlashback: true,
        includeHayaku: preview.includeHayaku === true,
        includeLibra: preview.includeLibra === true,
        includeLiaLivePersona: liaRequired,
        sourceLiaLivePersonaId: liaRequired ? sourceLivePersonaId : '',
        flashbackRecordCount: Math.max(0, Number(flashback.loadedRecords ?? flashback.records ?? 0) || 0),
        hayakuRecordCount: preview.hayakuRecordCount,
        hayakuCurrentRecordCount: Math.max(0, Number(preview.hayakuCurrentRecordCount || 0) || 0),
        hayakuRecoveryRecordCount: Math.max(0, Number(preview.hayakuRecoveryRecordCount || 0) || 0),
        hayakuPendingRecoveryRecordCount: Math.max(0, Number(preview.hayakuPendingRecoveryRecordCount || 0) || 0),
        hayakuArchiveRecordCount: Math.max(0, Number(preview.hayakuArchiveRecordCount || 0) || 0),
        libraRecordCount: libra.recordCount,
        ...(Number(libra.worldAdditionalCount || 0) > 0 ? { libraWorldAdditionalCount: libra.worldAdditionalCount } : {}),
              hayakuSource: hayaku.available
          ? (preview.hayakuPendingRecoveryRecordCount > 0 ? 'canonical_ledger+incremental_recovery_capsule' : 'canonical_ledger')
          : pendingColdStart.available
            ? (pendingIncrementalRecovery?.available ? 'pending_cold_start+incremental_recovery_capsule' : 'pending_cold_start')
            : pendingIncrementalRecovery?.available ? 'incremental_recovery_capsule' : 'none',
        libraSource: preview.includeLibra ? text(libra.readSource || 'unknown') : 'none',
        libraArchiveId: text(libraPreparation?.archiveId || ''),
        libraArchiveGeneration: Math.max(0, Number(libraPreparation?.archiveGeneration || 0) || 0),
        libraArchiveDigest: text(libraPreparation?.archiveDigest || ''),
        createdAt
      }
    };
    newChat.memorySessionBridge.handoffJournal = sealNextSessionHandoffJournal({
      schema: HANDOFF_JOURNAL_SCHEMA,
      state: 'pending_owner_handoffs',
      transferId,
      sourceChatId: identity.chatId,
      targetChatId,
      attempts: 0,
      createdAt,
      updatedAt: createdAt,
      completedAt: 0,
      lastError: '',
      ownerStatus: {
        flashback: { required: Math.max(0, Number(flashback.loadedRecords ?? flashback.records ?? 0) || 0) > 0, verified: false },
        hayaku: { required: preview.includeHayaku === true && Number(preview.hayakuRecordCount || 0) > 0, verified: false },
        libra: { required: preview.includeLibra === true, verified: false },
        lia: { required: liaRequired, verified: false }
      }
    });
    // Never make the new chat temporarily share an LIA-managed Live Persona.
    // LIA creates and verifies a target-chat-specific fork through IPC below.
    // Sharing the source Live ID even briefly can race with cleanup/rebinding logic.
    if (!liaRequired) {
      for (const key of ['bindedPersona', 'boundPersona', 'personaId', 'selectedPersona', 'persona']) {
        if (Object.prototype.hasOwnProperty.call(context.chat, key)) newChat[key] = clone(context.chat[key], context.chat[key]);
      }
    }
    nextCharacter.chats.unshift(newChat);
    nextCharacter.chatPage = 0;

    const latest = await getCurrentContext();
    const latestIdentity = contextIdentity(latest);
    if (latestIdentity.characterId !== identity.characterId || latestIdentity.chatId !== identity.chatId) {
      throw new Error('전환 준비 중 활성 캐릭터 또는 채팅이 바뀌었습니다.');
    }
    if (flashbackSourceIntegrity?.fingerprint) {
      const latestFlashbackSourceIntegrity = await flashbackSourceStorageIntegritySnapshotForRetrace(text(flashback.sourceScope?.scopeKey || ''));
      const sourceComparison = compareFlashbackSourceStorageIntegrityForRetrace(flashbackSourceIntegrity, latestFlashbackSourceIntegrity);
      if (!sourceComparison.identical) {
        throw new Error(`Flashback 원본이 다음 세션 준비 중 변경되어 승계를 중단했습니다. ${JSON.stringify({ changed: sourceComparison.changed })}`);
      }
    }
    if (preview.includeLibra) {
      const latestLibra = await readLibraSource(latest, { includeRecords: false });
      const legacyWorldAdditionalChanged = Math.max(0, Number(libra.worldAdditionalCount || 0) || 0) > 0
        && latestLibra.worldAdditionalCount !== libra.worldAdditionalCount;
      if (!latestLibra.integrityOk
        || latestLibra.canonicalStateHash !== libra.canonicalStateHash
        || latestLibra.recordCount !== libra.recordCount
        || legacyWorldAdditionalChanged) {
        throw new Error('LIBRA canonical memory changed during handoff preparation. Run the transition again.');
      }
    }
    const writer = await saveCharacter(nextCharacter, context.characterIndex);
    const activation = await waitForActiveNextSessionChat(targetChatId, 5000);
    if (!activation.active) {
      throw new Error(`새 RE:TRACE 세션은 저장되었지만 대상 채팅 활성화가 아직 완료되지 않았습니다. 새 세션을 선택한 뒤 이어서 실행하세요. target=${targetChatId} active=${activation.chatId || '(unknown)'}`);
    }
    if (flashbackSourceIntegrity?.fingerprint) {
      const activatedFlashbackSourceIntegrity = await flashbackSourceStorageIntegritySnapshotForRetrace(text(flashback.sourceScope?.scopeKey || ''));
      const sourceComparison = compareFlashbackSourceStorageIntegrityForRetrace(flashbackSourceIntegrity, activatedFlashbackSourceIntegrity);
      if (!sourceComparison.identical) {
        const error = new Error(`Flashback 원본이 새 세션 활성화 과정에서 변경되었습니다. owner handoff를 실행하지 않습니다. ${JSON.stringify({ changed: sourceComparison.changed })}`);
        error.code = 'SOURCE_MUTATION_DETECTED';
        throw error;
      }
    }
    const persistedPending = await inspectPendingNextSessionHandoff({ targetChatId });
    if (!persistedPending.available
      || !persistedPending.pending
      || text(persistedPending.journal?.transferId || '') !== transferId) {
      throw new Error(`RE:TRACE pending handoff journal was not durably created: ${persistedPending.reason || 'readback_failed'}`);
    }
    return await resumeNextSessionHandoff({ targetChatId, transferId, writer });

  };

  const packetItemText = (value, max = 180) => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return compact(value, max);
    if (Array.isArray(value)) return compact(value.map(item => packetItemText(item, 80)).filter(Boolean).join(' / '), max);
    if (typeof value !== 'object') return compact(value, max);
    const name = compact(value.name || value.label || value.title || value.entity || value.character || value.id || '', 70);
    const detail = compact(
      value.current_state || value.currentState || value.state || value.status || value.summary || value.text
      || value.description || value.action || value.event || value.reason || value.goal || value.location || '',
      Math.max(80, max - name.length)
    );
    if (name && detail && name !== detail) return compact(`${name} · ${detail}`, max);
    if (name || detail) return name || detail;
    return compact(JSON.stringify(value), max);
  };

  const packetRows = (value, limit = 5, max = 180) => {
    const values = Array.isArray(value) ? value : value == null || value === '' ? [] : [value];
    return values.map(item => packetItemText(item, max)).filter(Boolean).slice(0, limit);
  };

  const packetInfo = record => {
    const packet = parseJson(record?.raw, null);
    const meta = packet?.meta || {};
    const summaryMemory = meta?.summary_memory || meta?.summaryMemory || {};
    const entity = packet?.entity || {};
    const world = packet?.world || {};
    const narrative = packet?.narrative || {};
    const planner = packet?.planner || {};
    const importance = packet?.importance || {};
    const turnAnchor = meta?.turn_anchor || meta?.turnAnchor || '';
    const summary = summaryMemory?.summary || turnAnchor || '';
    const characters = packetRows(entity.characters, 6, 200);
    const relations = packetRows(entity.relations, 4, 180);
    const memories = packetRows(entity.pov_memories || entity.povMemories || entity.entity_memories || entity.entityMemories, 4, 190);
    const secrets = packetRows(entity.secrets, 3, 180);
    const worldRows = [
      ...packetRows(world.active_events || world.activeEvents || world.events, 4, 190),
      ...packetRows(world.world_rules || world.worldRules, 2, 190),
      ...packetRows(world.offscreen_threads || world.offscreenThreads, 2, 190)
    ].slice(0, 6);
    const narrativeRows = [
      ...packetRows(narrative.conflict_traces || narrative.conflictTraces, 4, 190),
      ...packetRows(narrative.scene_deltas || narrative.sceneDeltas, 3, 190),
      ...packetRows(narrative.critical_dialogue || narrative.criticalDialogue, 2, 190)
    ].slice(0, 6);
    const plannerRows = [
      ...packetRows(planner.continuity_locks || planner.continuityLocks, 4, 190),
      ...packetRows(planner.do_not_resolve_yet || planner.doNotResolveYet, 4, 190),
      ...packetRows(planner.open_invitations || planner.openInvitations, 3, 190),
      ...packetRows(planner.next_direction || planner.next_response_direction || planner.nextResponseDirection, 3, 190)
    ].slice(0, 8);
    const anchors = [
      ...packetRows(summaryMemory.recallAnchors || summaryMemory.recall_anchors, 8, 70),
      ...packetRows(summaryMemory.canonicalAnchors || summaryMemory.canonical_anchors, 8, 70),
      ...packetRows(summaryMemory.mentionedEntityNames || summaryMemory.mentioned_entity_names, 6, 70)
    ].filter((value, index, all) => all.indexOf(value) === index).slice(0, 14);
    const capturedAt = Number(record?.capturedAt || record?.createdAt || 0) || 0;
    const importanceOverall = Number(importance.overall);
    return {
      packet,
      title: compact(turnAnchor || summary || `${record?.packetType || 'packet'} · turn ${record?.targetPairIndex || 0}`, 140),
      summary: compact(summary, 700),
      location: compact(world.location || '', 100),
      time: compact(world.time || '', 100),
      scenePhase: compact(narrative.scene_phase || narrative.scenePhase || narrative.current_arc || narrative.currentArc || '', 100),
      importance: Number.isFinite(importanceOverall) ? Math.max(0, Math.min(1, importanceOverall)) : null,
      importanceReasons: packetRows(importance.reason || importance.reasons, 3, 150),
      characters,
      relations,
      memories,
      secrets,
      worldRows,
      narrativeRows,
      plannerRows,
      anchors,
      capturedAt,
      capturedAtText: capturedAt ? new Date(capturedAt).toLocaleString() : '',
      chars: text(record?.raw || '').length
    };
  };

  const renderPacketSection = (key, title, rows) => {
    const values = Array.isArray(rows) ? rows.filter(Boolean) : [];
    if (!values.length) return '';
    return `<section class="packet-section" data-packet-section="${escapeHtml(key)}"><b>${escapeHtml(title)}</b>${values.map(value => `<span>${escapeHtml(value)}</span>`).join('')}</section>`;
  };

  const flashbackRecordInfo = record => {
    const body = text(record?.text || '').trim();
    const sourceType = text(record?.sourceType || record?.type || 'unknown').trim() || 'unknown';
    const permanent = isPermanentSessionHistory(record);
    const inherited = permanent
      || record?.inheritedSessionHistory === true
      || Boolean(text(record?.inheritedFromScopeKey || record?.clonedFromScopeKey || '').trim());
    const episode = sourceType === 'episode_index' || record?.autoEpisode === true;
    const vectorDim = Number(record?.dim || (Array.isArray(record?.vector) ? record.vector.length : 0)) || 0;
    return {
      title: compact(record?.title || record?.sourceId || `${sourceType} memory`, 140),
      body,
      preview: compact(body, 700),
      sourceType,
      inherited,
      permanent,
      episode,
      turn: Number(record?.turnIndex || record?.pairIndex || 0) || 0,
      chunkIndex: Number(record?.chunkIndex || 0) || 0,
      chunkCount: Number(record?.chunkCount || 0) || 0,
      provider: compact(record?.provider || '', 48),
      model: compact(record?.model || '', 90),
      vectorDim,
      tokens: Math.max(0, Number(record?.tokenEstimate || 0) || 0),
      createdAt: text(record?.createdAt || record?.updatedAt || ''),
      tags: Array.isArray(record?.tags) ? record.tags.map(item => compact(item, 60)).filter(Boolean).slice(0, 10) : [],
      anchors: Array.isArray(record?.entityAnchors) ? record.entityAnchors.map(item => compact(item, 60)).filter(Boolean).slice(0, 10) : []
    };
  };

  const flashbackRecordJsonForViewer = record => {
    const value = clone(record, {}) || {};
    if (Array.isArray(value.vector)) {
      value.vector = {
        omittedFromViewer: true,
        dimensions: value.vector.length,
        note: 'Use JSON 내보내기 to export the complete vector.'
      };
    }
    return value;
  };

  const libraMemoryViewerInfo = memory => {
    const epoch = Number(memory?.sessionEpoch || 0);
    const inherited = memory?.inheritedSessionHistory === true || epoch < 0;
    const turnStart = Math.max(0, Number(memory?.turnRange?.start || 0) || 0);
    const turnEnd = Math.max(turnStart, Number(memory?.turnRange?.end || turnStart) || turnStart);
    const sections = memory?.sections && typeof memory.sections === 'object' ? Object.keys(memory.sections).filter(key => text(memory.sections[key]).trim()) : [];
    return {
      title: inherited ? `이전 세션 ${Math.abs(epoch || -1)} · TURN ${turnStart}~${turnEnd}` : `현재 세션 · TURN ${turnStart}~${turnEnd}`,
      inherited,
      epoch,
      partial: memory?.pipeline?.status === 'partial',
      revision: Math.max(0, Number(memory?.revision || 0) || 0),
      summary: text(memory?.summary || '').trim(),
      text: text(memory?.text || '').trim(),
      sections,
      embedding: text(memory?.embedding?.status || ''),
      memoryId: text(memory?.memoryId || ''),
      updatedAt: text(memory?.updatedAt || memory?.createdAt || '')
    };
  };

  const renderLibra = result => {
    if (!result?.pluginAvailable) {
      return `<div class="empty"><strong>LIBRA 연결 없음</strong><span>LIBRA v1.0.4 이상을 함께 설치해야 IPC 기억 뷰어와 다음 세션 승계를 사용할 수 있습니다.</span></div>`;
    }
    if (!result?.integrityOk) {
      const inspectFailure = ['libra_inspect_timeout', 'libra_inspect_failed'].includes(text(result?.reason));
      const title = inspectFailure ? 'LIBRA 연결됨 · 정본 조회 실패' : 'LIBRA 무결성 확인 실패';
      const detail = Array.isArray(result?.errors) && result.errors.length
        ? `${result.reason || 'unknown'} · ${result.errors[0]}`
        : (result?.reason || 'unknown');
      return `<div class="empty"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`;
    }
    const memories = Array.isArray(result.memories) ? result.memories : [];
    const ordered = memories.slice().sort((a, b) => (
      Number(b?.sessionEpoch || 0) - Number(a?.sessionEpoch || 0)
      || Number(b?.turnRange?.start || 0) - Number(a?.turnRange?.start || 0)
    ));
    const visible = ordered.slice(0, LIBRA_VIEWER_MAX_RENDERED_RECORDS);
    const worldAdditional = Array.isArray(result.worldAdditional) ? result.worldAdditional : [];
    return `<div class="metrics">
      <div><span>정본 메모리</span><strong>${formatNumber(result.recordCount || memories.length)}</strong></div>
      <div><span>현재 / 승계</span><strong>${formatNumber(result.liveRecordCount || 0)} / ${formatNumber(result.inheritedRecordCount || 0)}</strong></div>
      <div><span>부분 정본</span><strong>${formatNumber(result.partialRecordCount || 0)}</strong></div>
      <div><span>월드 에디셔널</span><strong>${formatNumber(result.worldAdditionalCount || worldAdditional.length)}</strong></div>
    </div>
    <div class="ledger-key"><span>LIBRA IPC</span><code>${escapeHtml(result.scope?.scopeKey || '')}</code><small>v${escapeHtml(result.pluginVersion || '?')}</small></div>
    ${result.viewerLimited ? `<div class="settings-callout">OOM 방지를 위해 최신 ${formatNumber(result.viewerLoadedRecords ?? visible.length)}개 레코드의 shard만 실제로 읽었습니다. 저장된 ${formatNumber(result.loadedRecords || ordered.length)}개 전체는 유지되며, 명시적 JSON 내보내기에서만 전체 조회를 시도합니다.</div>` : (ordered.length > visible.length ? `<div class="settings-callout">최신 ${formatNumber(visible.length)}개만 화면에 표시합니다.</div>` : '')}
    ${!memories.length ? '<div class="empty"><strong>아직 정본 메모리가 없습니다.</strong><span>LIBRA에서 5턴 분석이 완료되면 여기에 바로 표시됩니다.</span></div>' : ''}
    <div class="record-list">${visible.map(memory => {
      const info = libraMemoryViewerInfo(memory);
      const label = info.inherited ? 'PERMANENT HISTORY' : info.partial ? 'PARTIAL CANON' : 'CANON';
      return `<article class="record libra-record">
        <div class="record-head"><div><strong>${escapeHtml(info.title)}</strong><span>${escapeHtml(info.memoryId)} · revision ${formatNumber(info.revision)}</span></div><em>${label}</em></div>
        ${info.summary ? `<p>${escapeHtml(info.summary)}</p>` : ''}
        <div class="meta"><span>embedding ${escapeHtml(info.embedding || '-')}</span>${info.sections.length ? `<span>${escapeHtml(info.sections.join(' · '))}</span>` : ''}${info.updatedAt ? `<span>${escapeHtml(info.updatedAt)}</span>` : ''}</div>
        <details><summary>정본 메모리 전체 보기</summary><pre>${escapeHtml(info.text || '(empty)')}</pre></details>
        <details><summary>메타데이터 JSON</summary><pre>${escapeHtml(JSON.stringify({ ...memory, text: undefined }, null, 2))}</pre></details>
      </article>`;
    }).join('')}</div>
    ${worldAdditional.length ? `<div class="card"><div class="heading"><div><strong>월드 에디셔널</strong><span>아직 이야기에서 구현되기 전인 비정본 후보입니다.</span></div><em class="badge">NON-CANON</em></div><div class="record-list">${worldAdditional.map(item => `<article class="record"><div class="record-head"><div><strong>${escapeHtml(item.title || item.itemId || 'World Additional')}</strong><span>${escapeHtml(item.kind || 'world')} · ${escapeHtml(item.status || '')}</span></div></div><p>${escapeHtml(item.content || '')}</p></article>`).join('')}</div></div>` : ''}`;
  };

  const renderFlashback = result => {
    if (!result?.available) {
      const reason = {
        scope_not_registered: '현재 채팅에 등록된 Flashback 스코프가 없습니다.',
        manifest_not_found: '현재 채팅의 Flashback manifest를 찾지 못했습니다.',
        empty: 'Flashback 저장소는 있지만 저장된 기억이 없습니다.',
        partial: 'Flashback shard 일부를 읽지 못했습니다.'
      }[result?.reason] || `Flashback 저장소를 읽을 수 없습니다: ${result?.reason || 'unknown'}`;
      return `<div class="empty"><strong>Flashback 기억 없음</strong><span>${escapeHtml(reason)}</span></div>`;
    }
    const items = Array.isArray(result.items) ? result.items : [];
    const ordered = items.slice().sort((a, b) => compareFlashbackTimelineRecords(b, a));
    const visible = ordered.slice(0, FLASHBACK_VIEWER_MAX_RENDERED_RECORDS);
    const responseRecords = Number(result.stats?.byType?.response || result.stats?.byType?.chat_turn || 0) || 0;
    const episodeRecords = Number(result.stats?.byType?.episode_index || 0) || 0;
    const integrity = result.missingShards || result.corruptShards || result.recordCountMismatch
      ? `<div class="settings-callout viewer-warning">무결성 경고 · 누락 shard ${formatNumber(result.missingShards)} · 손상 shard ${formatNumber(result.corruptShards)}${result.recordCountMismatch ? ' · manifest 기록 수 불일치' : ''}</div>`
      : '';
    return `<div class="metrics">
      <div><span>저장 기억</span><strong>${formatNumber(result.loadedRecords)}</strong></div>
      <div><span>표시 로드</span><strong>${formatNumber(result.viewerLoadedRecords ?? visible.length)}</strong></div>
      <div><span>응답 / 에피소드</span><strong>${formatNumber(responseRecords)} / ${formatNumber(episodeRecords)}</strong></div>
      <div><span>조회 Shard</span><strong>${formatNumber(result.viewerScannedShards ?? result.shardCount)} / ${formatNumber(result.shardCount)}</strong></div>
      <div><span>추정 토큰</span><strong>${formatNumber(result.stats?.tokens || 0)}</strong></div>
    </div>
    <div class="ledger-key"><span>READ ONLY</span><code>${escapeHtml(result.manifestKey || '')}</code></div>
    ${integrity}
    ${ordered.length > visible.length ? `<div class="settings-callout">최신 ${formatNumber(visible.length)}개만 화면에 표시합니다. JSON 내보내기에는 ${formatNumber(ordered.length)}개 전체가 포함됩니다.</div>` : ''}
    <div class="record-list">${visible.map(record => {
      const info = flashbackRecordInfo(record);
      const label = info.permanent ? 'PERMANENT HISTORY' : info.inherited ? 'INHERITED' : info.episode ? 'EPISODE' : 'LIVE';
      const chunk = info.chunkCount > 1 ? ` · chunk ${formatNumber(info.chunkIndex + 1)}/${formatNumber(info.chunkCount)}` : '';
      const details = [...info.tags.map(tag => `#${tag}`), ...info.anchors.map(anchor => `@${anchor}`)].slice(0, 12);
      return `<article class="record flashback-record">
        <div class="record-head"><div><strong>${escapeHtml(info.title)}</strong><span>turn ${formatNumber(info.turn)}${chunk} · ${escapeHtml(info.sourceType)}</span></div><em>${label}</em></div>
        ${info.preview ? `<p>${escapeHtml(info.preview)}</p>` : ''}
        <div class="meta">${info.provider ? `<span>${escapeHtml(info.provider)}${info.model ? ` · ${escapeHtml(info.model)}` : ''}</span>` : ''}${info.vectorDim ? `<span>vector ${formatNumber(info.vectorDim)}d</span>` : ''}${info.tokens ? `<span>${formatNumber(info.tokens)} tokens</span>` : ''}${info.createdAt ? `<span>${escapeHtml(info.createdAt)}</span>` : ''}</div>
        ${details.length ? `<div class="memory-tags">${details.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>` : ''}
        <details><summary>기억 레코드 JSON</summary><pre>${escapeHtml(JSON.stringify(flashbackRecordJsonForViewer(record), null, 2))}</pre></details>
      </article>`;
    }).join('')}</div>`;
  };

  const renderHayaku = result => {
    if (!result?.available) {
      Runtime.hayakuActionRecords = [];
      const reason = {
        ids_missing: '현재 캐릭터의 chaId 또는 채팅 id가 없습니다.',
        ledger_not_found: '현재 채팅에 HAYAKU 원장이 없습니다.',
        unsupported_schema: `지원하지 않는 HAYAKU 원장 형식입니다${result?.schema ? `: ${result.schema}` : ''}.`,
        scope_mismatch: '원장의 채팅 범위가 현재 채팅과 일치하지 않습니다.',
        empty: 'HAYAKU 원장은 있지만 저장된 패킷이 없습니다.'
      }[result?.reason] || `HAYAKU 원장을 읽을 수 없습니다: ${result?.reason || 'unknown'}`;
      return `<div class="empty"><strong>HAYAKU 원장 없음</strong><span>${escapeHtml(reason)}</span></div>`;
    }
    const allRecords = Array.isArray(result.allRecords) ? result.allRecords : (Array.isArray(result.records) ? result.records : []);
    const tombstones = activeHayakuLedgerTombstones(result.ledger);
    const tombstonesBySlot = new Map(tombstones.map(value => [text(value.slotId).trim(), value]));
    const deletedRecords = allRecords.filter(record => (
      text(record?.recordState || '').trim().toLowerCase() === 'tombstoned'
      || hayakuTombstoneSuppressesRecord(record, tombstonesBySlot.get(hayakuRecordSlotId(record)))
    ));
    const records = allRecords.filter(record => !deletedRecords.includes(record));
    const ordered = records.slice().sort((a, b) => compareHayakuTimelineRecords(b, a));
    const visible = ordered.slice(0, HAYAKU_VIEWER_MAX_RENDERED_RECORDS);
    Runtime.hayakuActionRecords = visible.map(record => clone(record, record));
    const chars = records.reduce((sum, record) => sum + text(record.raw || '').length, 0);
    const nodes = Array.isArray(result.ledger?.worldline?.nodes) ? result.ledger.worldline.nodes : [];
    const activeNodes = nodes.filter(node => !node?.status || text(node.status).toLowerCase() === 'active').length;
    const inheritedRecords = records.filter(record => record?.inheritedSessionHistory === true || isPermanentSessionHistory(record)).length;
    const liveRecords = records.length - inheritedRecords;
    const currentSnapshotRecords = Math.max(0, Number(result.currentSnapshotRecordCount ?? records.filter(record => (
      text(record?.packetType || 'current_snapshot').trim().toLowerCase() === 'current_snapshot'
      && record?.inheritedSessionHistory !== true
      && !isPermanentSessionHistory(record)
    )).length) || 0);
    const recoveryRecords = Math.max(0, Number(result.recoveryRecordCount ?? records.filter(record => (
      text(record?.packetType || '').trim().toLowerCase() === 'recovery_snapshot'
    )).length) || 0);
    const archiveRecords = Math.max(0, Number(result.archiveRecordCount ?? inheritedRecords) || 0);
    const updatedAt = result.ledger?.updatedAt ? new Date(result.ledger.updatedAt).toLocaleString() : '-';
    return `<div class="metrics">
      <div><span>저장 패킷</span><strong>${formatNumber(result.recordCount || records.length)}</strong></div>
      <div><span>Current</span><strong>${formatNumber(currentSnapshotRecords)}</strong></div>
      <div><span>Recovery</span><strong>${formatNumber(recoveryRecords)}</strong></div>
      <div><span>Archive</span><strong>${formatNumber(archiveRecords)}</strong></div>
      <div><span>표시 로드</span><strong>${formatNumber(result.viewerLoadedRecords ?? records.length)}</strong></div>
      <div><span>표시 삭제됨</span><strong>${formatNumber(deletedRecords.length)}</strong></div>
      <div><span>활성 / 전체 월드라인</span><strong>${formatNumber(activeNodes)} / ${formatNumber(nodes.length)}</strong></div>
      <div><span>표시 본문</span><strong>${formatNumber(chars)} chars</strong></div>
    </div>
    <div class="ledger-key"><span>READ ONLY</span><code>${escapeHtml(result.scope.storageKey)}</code><small>갱신 ${escapeHtml(updatedAt)}</small></div>
    ${Number(result.pendingRecoveryRecordCount || 0) > 0 ? `<div class="settings-callout viewer-warning">RE:TRACE Recovery ${formatNumber(result.pendingRecoveryRecordCount)}개는 검증된 recovery capsule에서 읽기 전용으로 표시 중입니다. HAYAKU durable 원장 반영이 확인되면 자동으로 실제 recovery_snapshot 레코드로 전환됩니다.</div>` : ''}
    ${deletedRecords.length ? `<div class="settings-callout">사용자가 삭제한 패킷 ${formatNumber(deletedRecords.length)}개는 tombstone으로 보존되지만 활성 목록과 자동 누락 복구에서 제외됩니다.</div>` : ''}
    ${result.viewerLimited ? `<div class="settings-callout">OOM 방지를 위해 현재 원장과 최신 Archive layer에서 ${formatNumber(result.viewerLoadedRecords ?? visible.length)}개만 해제했습니다. 전체 ${formatNumber(result.recordCount || ordered.length)}개는 Archive에 그대로 보존됩니다.</div>` : (ordered.length > visible.length ? `<div class="settings-callout">최신 ${formatNumber(visible.length)}개만 화면에 표시합니다.</div>` : '')}
    <div class="record-list">${visible.map((record, actionIndex) => {
      const info = packetInfo(record);
      const inherited = record.inheritedSessionHistory === true || isPermanentSessionHistory(record);
      const permanent = isPermanentSessionHistory(record);
      const coldStart = text(record.captureSource).includes('cold_start');
      const virtualRecovery = record?.retraceVirtualRecovery === true;
      const state = text(record.recordState || '').trim().toUpperCase();
      const deleteDisabled = permanent || virtualRecovery || state === 'TOMBSTONED';
      const regenerateDisabled = permanent || virtualRecovery || recordRegenerationTurns(record).length === 0;
      const protectedTitle = permanent ? 'Permanent session history is protected.' : virtualRecovery ? 'Read-only RE:TRACE recovery capsule projection.' : '';
      const label = virtualRecovery
        ? 'RECOVERY CAPSULE'
        : ['TOMBSTONED', 'SUPERSEDED', 'QUARANTINED', 'ORPHANED', 'DETACHED'].includes(state)
          ? state
          : permanent ? 'PERMANENT HISTORY' : inherited ? 'INHERITED' : coldStart ? 'COLD START' : state || 'LIVE';
      const entityRows = [...info.characters, ...info.relations].slice(0, 8);
      const knowledgeRows = [...info.memories, ...info.secrets].slice(0, 6);
      const plannerRows = [...info.plannerRows, ...info.importanceReasons.map(value => `중요도 · ${value}`)].slice(0, 9);
      return `<article class="record hayaku-record">
        <div class="record-head"><div><strong>${escapeHtml(info.title)}</strong><span>turn ${formatNumber(record.targetPairIndex || 0)} · ${escapeHtml(record.packetType || 'packet')} · ${escapeHtml(record.captureSource || 'unknown')}</span></div><em>${label}</em></div>
        <div class="record-actions"><button type="button" class="record-action danger hayaku-delete-record" data-hayaku-action-index="${actionIndex}" ${deleteDisabled ? 'disabled' : ''} title="${escapeHtml(protectedTitle || (state === 'TOMBSTONED' ? 'This packet is already deleted.' : 'Delete this packet with a recoverable tombstone.'))}">&#49325;&#51228;</button><button type="button" class="record-action hayaku-regenerate-record" data-hayaku-action-index="${actionIndex}" ${regenerateDisabled ? 'disabled' : ''} title="${escapeHtml(protectedTitle || (regenerateDisabled ? 'No completed turn is available.' : 'Regenerate and atomically replace this packet.'))}">&#51116;&#49373;&#49457;</button></div>
        ${info.summary ? `<p>${escapeHtml(info.summary)}</p>` : ''}
        <div class="meta">${info.location ? `<span>장소 ${escapeHtml(info.location)}</span>` : ''}${info.time ? `<span>시간 ${escapeHtml(info.time)}</span>` : ''}${info.scenePhase ? `<span>장면 ${escapeHtml(info.scenePhase)}</span>` : ''}${info.importance != null ? `<span>중요도 ${formatNumber(Math.round(info.importance * 100))}%</span>` : ''}<span>${formatNumber(info.chars)} chars</span>${info.capturedAtText ? `<span>${escapeHtml(info.capturedAtText)}</span>` : ''}</div>
        ${info.anchors.length ? `<div class="memory-tags">${info.anchors.map(anchor => `<span>@${escapeHtml(anchor)}</span>`).join('')}</div>` : ''}
        <div class="packet-sections">
          ${renderPacketSection('entity', '인물 · 관계', entityRows)}
          ${renderPacketSection('knowledge', '시점 기억 · 비밀', knowledgeRows)}
          ${renderPacketSection('world', '세계 · 진행 사건', info.worldRows)}
          ${renderPacketSection('narrative', '서사 · 갈등', info.narrativeRows)}
          ${renderPacketSection('planner', '연속성 · 다음 방향', plannerRows)}
        </div>
        <details><summary>패킷 JSON</summary><pre>${escapeHtml(JSON.stringify(info.packet || parseJson(record.raw, record.raw), null, 2))}</pre></details>
      </article>`;
    }).join('')}</div>`;
  };

  const closeRetraceDialog = result => {
    const root = Runtime.root;
    const layer = root?.querySelector?.('#retraceDialogLayer');
    const resolver = Runtime.dialogResolver;
    Runtime.dialogResolver = null;
    if (Runtime.dialogKeyHandler) {
      try { document.removeEventListener('keydown', Runtime.dialogKeyHandler, true); } catch (_) {}
      Runtime.dialogKeyHandler = null;
    }
    if (layer) {
      layer.hidden = true;
      layer.setAttribute('aria-hidden', 'true');
    }
    if (typeof resolver === 'function') resolver(Boolean(result));
  };

  const showRetraceDialog = (message, options = {}) => new Promise(resolve => {
    const root = Runtime.root;
    const layer = root?.querySelector?.('#retraceDialogLayer');
    const titleNode = root?.querySelector?.('#retraceDialogTitle');
    const messageNode = root?.querySelector?.('#retraceDialogMessage');
    const cancelButton = root?.querySelector?.('#retraceDialogCancel');
    const confirmButton = root?.querySelector?.('#retraceDialogConfirm');
    if (!layer || !titleNode || !messageNode || !confirmButton) {
      Runtime.lastUiDialog = { at: Date.now(), type: options.confirm === true ? 'confirm' : 'alert', result: false, reason: 'dialog_dom_unavailable' };
      warn('RE:TRACE internal dialog unavailable; action cancelled fail-closed');
      resolve(false);
      return;
    }
    if (typeof Runtime.dialogResolver === 'function') {
      if (Runtime.dialogKeyHandler) {
        try { document.removeEventListener('keydown', Runtime.dialogKeyHandler, true); } catch (_) {}
        Runtime.dialogKeyHandler = null;
      }
      const previous = Runtime.dialogResolver;
      Runtime.dialogResolver = null;
      try { previous(false); } catch (_) {}
    }
    const sequence = ++Runtime.dialogSequence;
    Runtime.dialogResolver = value => {
      Runtime.lastUiDialog = {
        at: Date.now(),
        sequence,
        type: options.confirm === true ? 'confirm' : 'alert',
        result: Boolean(value),
        title: text(options.title || (options.confirm === true ? '확인' : '알림'))
      };
      resolve(Boolean(value));
    };
    titleNode.textContent = text(options.title || (options.confirm === true ? '확인' : '알림'));
    messageNode.textContent = text(message || '');
    confirmButton.textContent = text(options.confirmLabel || (options.confirm === true ? '계속' : '확인'));
    confirmButton.classList.toggle('danger', options.danger === true);
    // The surrounding action may already be in Runtime.busy state. Dialog controls are
    // the only controls that must stay interactive while background actions remain locked.
    confirmButton.disabled = false;
    delete confirmButton.dataset.bridgeBusyDisabled;
    if (cancelButton) {
      cancelButton.hidden = options.confirm !== true;
      cancelButton.textContent = text(options.cancelLabel || '취소');
      cancelButton.disabled = false;
      delete cancelButton.dataset.bridgeBusyDisabled;
    }
    layer.hidden = false;
    layer.setAttribute('aria-hidden', 'false');
    const finish = value => {
      if (Runtime.dialogSequence !== sequence) return;
      closeRetraceDialog(value);
    };
    confirmButton.onclick = () => finish(true);
    if (cancelButton) cancelButton.onclick = () => finish(false);
    layer.onclick = event => {
      if (event.target === layer && options.confirm === true) finish(false);
    };
    const onKey = event => {
      if (Runtime.dialogSequence !== sequence) {
        document.removeEventListener('keydown', onKey, true);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        document.removeEventListener('keydown', onKey, true);
        finish(options.confirm === true ? false : true);
      } else if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.removeEventListener('keydown', onKey, true);
        finish(true);
      }
    };
    Runtime.dialogKeyHandler = onKey;
    document.addEventListener('keydown', onKey, true);
    queueMicrotask(() => { try { confirmButton.focus(); } catch (_) {} });
  });

  const retraceConfirm = (message, options = {}) => showRetraceDialog(message, {
    ...options,
    confirm: true
  });

  const retraceAlert = (message, options = {}) => showRetraceDialog(message, {
    ...options,
    confirm: false,
    confirmLabel: options.confirmLabel || '확인'
  });

  const MEMORY_SUITE_SCOPE_NAMESPACES = Object.freeze(['flashback', 'hayaku', 'libra', 'lia', 'retrace']);
  const MEMORY_SUITE_SCOPE_READ_MAX_BYTES = 20 * 1024 * 1024;
  const MEMORY_SUITE_SCOPE_PLAN_TTL_MS = 90 * 1000;
  const MEMORY_SUITE_SCOPE_STATUS_ORDER = Object.freeze(['active', 'referenced_ancestor', 'orphan_candidate', 'unverified']);
  const MEMORY_SUITE_SCOPE_STATUS_LABELS = Object.freeze({
    active: '활성 스코프',
    referenced_ancestor: '승계 조상',
    orphan_candidate: '고아 메모리 후보',
    unverified: '확인 불가'
  });
  const MEMORY_SUITE_NAMESPACE_LABELS = Object.freeze({
    flashback: 'Flashback', hayaku: 'HAYAKU', libra: 'LIBRA', lia: 'LIA', retrace: 'RE:TRACE'
  });

  const MEMORY_SUITE_SCOPED_REMOTE_KEY_MARKER = '::memory-suite-scope:v1:';
  const scopeManagerScopedRemoteKeyInfo = keyValue => {
    const key = text(keyValue || '');
    const index = key.lastIndexOf(MEMORY_SUITE_SCOPED_REMOTE_KEY_MARKER);
    if (index < 0) return { key, logicalKey: key, scopeId: '', scoped: false };
    let scopeId = '';
    try { scopeId = decodeURIComponent(key.slice(index + MEMORY_SUITE_SCOPED_REMOTE_KEY_MARKER.length)); } catch (_) {}
    return { key, logicalKey: key.slice(0, index), scopeId, scoped: !!scopeId };
  };
  const scopeManagerRecordsForLogicalKey = (snapshot, space, logicalKey) => snapshot.records.filter(record => {
    if (record.space !== space) return false;
    const info = scopeManagerScopedRemoteKeyInfo(record.key);
    return info.logicalKey === logicalKey;
  });
  const MEMORY_SUITE_RETRACE_SCOPE_PREFIXES = Object.freeze([
    COLD_START_PREFIX,
    COLD_START_RUN_PREFIX,
    INCREMENTAL_RECOVERY_PREFIX,
    INCREMENTAL_RECOVERY_RUN_PREFIX,
    HAYAKU_BACKUP_PREFIX,
    HAYAKU_BACKUP_CATALOG_PREFIX
  ]);

  const scopeManagerObject = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const scopeManagerArray = value => Array.isArray(value) ? value : [];
  const scopeManagerFirst = (...values) => values.map(value => text(value || '').trim()).find(Boolean) || '';
  const scopeManagerStoredValue = remote => {
    const value = remote?.value;
    if (typeof value !== 'string') return { parsed: value, original: value, stringEncoded: false, ok: value !== undefined };
    const trimmed = value.trim();
    if (!trimmed) return { parsed: value, original: value, stringEncoded: false, ok: true };
    try { return { parsed: JSON.parse(trimmed), original: value, stringEncoded: true, ok: true }; }
    catch (_) { return { parsed: value, original: value, stringEncoded: false, ok: true }; }
  };
  const scopeManagerEncodeLike = (original, value) => typeof original === 'string' ? JSON.stringify(value) : value;
  const scopeManagerRecordId = (space, key) => `${text(space || 'plugin')}\n${text(key || '')}`;
  const scopeManagerRecordMap = records => new Map(scopeManagerArray(records).map(record => [scopeManagerRecordId(record.space, record.key), record]));
  const scopeManagerMember = (record, sharedRecord = false) => ({
    space: text(record?.space || 'plugin'),
    key: text(record?.key || ''),
    sharedRecord: sharedRecord === true,
    exists: record?.tombstone !== true,
    tombstone: record?.tombstone === true,
    revision: Math.max(0, Number(record?.revision || 0) || 0),
    digest: text(record?.digest || ''),
    updatedAt: Math.max(0, Number(record?.updatedAt || 0) || 0),
    valueBytes: Math.max(0, Number(record?.valueBytes || 0) || 0)
  });
  const scopeManagerMutationFor = (member, kind = 'remove', value = undefined) => ({
    kind,
    space: member.space,
    key: member.key,
    expectedRevision: Math.max(0, Number(member.revision || 0) || 0),
    expectedDigest: text(member.digest || ''),
    expectedExists: member.exists === true,
    expectedTombstone: member.tombstone === true,
    ...(kind === 'set' ? { value } : {})
  });
  const scopeManagerUniqueMembers = members => {
    const out = [];
    const seen = new Set();
    for (const member of scopeManagerArray(members)) {
      const id = scopeManagerRecordId(member?.space, member?.key);
      if (!member?.key || seen.has(id)) continue;
      seen.add(id);
      out.push(member);
    }
    return out;
  };
  const scopeManagerUniqueLinks = links => {
    const out = [];
    const seen = new Set();
    for (const link of scopeManagerArray(links)) {
      const targetRef = text(link?.targetRef || '').trim();
      const kind = text(link?.kind || 'reference').trim() || 'reference';
      const id = `${targetRef}\n${kind}`;
      if (!targetRef || seen.has(id)) continue;
      seen.add(id);
      out.push({ targetRef, kind });
    }
    return out;
  };
  const scopeManagerCollectLinks = (value, options = {}) => {
    const out = [];
    const seenObjects = new Set();
    const visit = (node, depth = 0) => {
      if (depth > 7 || node == null) return;
      if (typeof node === 'string') return;
      if (Array.isArray(node)) {
        for (const item of node.slice(0, 512)) visit(item, depth + 1);
        return;
      }
      if (typeof node !== 'object' || seenObjects.has(node)) return;
      seenObjects.add(node);
      for (const [key, raw] of Object.entries(node).slice(0, 600)) {
        const lower = key.toLowerCase();
        if (typeof raw === 'string' && raw.trim()) {
          if (/(?:source|forkedfrom|copiedfrom|predecessor|inheritedfrom).*scope(?:key|id)$/.test(lower)
            || /^(?:sourcescopekey|forkedfromscopekey|copiedfromscopekey|predecessorscopekey|inheritedfromscopekey)$/.test(lower)) {
            out.push({ targetRef: raw.trim(), kind: lower.includes('fork') ? 'forked_from' : lower.includes('copy') ? 'copied_from' : lower.includes('inherit') ? 'inherited_from' : 'session_predecessor' });
          }
        }
        visit(raw, depth + 1);
      }
    };
    visit(value, 0);
    if (options.archiveId) out.push({ targetRef: `archive:${text(options.archiveId).trim()}`, kind: 'archive_reference' });
    return scopeManagerUniqueLinks(out);
  };
  const scopeManagerCollectLocalKeys = (value, prefixes = []) => {
    const out = new Set();
    const seenObjects = new Set();
    const visit = (node, depth = 0) => {
      if (depth > 8 || node == null) return;
      if (typeof node === 'string') {
        for (const prefix of prefixes) if (node.startsWith(prefix)) out.add(node);
        return;
      }
      if (Array.isArray(node)) {
        for (const item of node.slice(0, 2048)) visit(item, depth + 1);
        return;
      }
      if (typeof node !== 'object' || seenObjects.has(node)) return;
      seenObjects.add(node);
      for (const raw of Object.values(node).slice(0, 1200)) visit(raw, depth + 1);
    };
    visit(value, 0);
    return Array.from(out);
  };
  const scopeManagerDescriptorFrom = (value, fallback = {}) => {
    const source = scopeManagerObject(value);
    const scope = scopeManagerObject(source.scope);
    const identity = scopeManagerObject(source.identity);
    const context = scopeManagerObject(source.context);
    const character = scopeManagerObject(source.character);
    const chat = scopeManagerObject(source.chat);
    const characterId = scopeManagerFirst(
      source.characterId, source.chaId, scope.characterId, identity.characterId, context.characterId,
      character.id, character._id, character.chaId, fallback.characterId
    );
    const chatId = scopeManagerFirst(
      source.chatId, source.targetChatId, scope.chatId, identity.chatId, context.chatId,
      chat.id, chat._id, chat.chatId, fallback.chatId
    );
    const canonicalCharacterId = scopeManagerFirst(
      source.canonicalCharacterId, source.chaId, character.chaId,
      source.characterId, scope.characterId, identity.characterId, context.characterId,
      character.id, character._id, fallback.characterId
    );
    const canonicalChatId = scopeManagerFirst(
      source.canonicalChatId, chat.id, source.chatId, source.targetChatId,
      scope.chatId, identity.chatId, context.chatId, chat.chatId, chat._id, fallback.chatId
    );
    const canonicalScopeId = scopeManagerFirst(
      source.canonicalScopeId,
      canonicalCharacterId && canonicalChatId ? `canonical:char:${canonicalCharacterId}|chat:${canonicalChatId}` : ""
    );
    const personaId = scopeManagerFirst(
      source.personaId, source.livePersonaId, scope.personaId, identity.personaId, context.personaId,
      fallback.personaId
    );
    const scopeKey = scopeManagerFirst(source.scopeKey, scope.scopeKey, identity.scopeKey, fallback.scopeKey);
    const displayName = scopeManagerFirst(
      source.displayName, source.chatTitle, source.title, scope.displayName, scope.chatTitle,
      chat.name, chat.title, fallback.displayName
    );
    return { characterId, chatId, canonicalCharacterId, canonicalChatId, canonicalScopeId, personaId, scopeKey, displayName };
  };
  const scopeManagerCharacterAliases = character => new Set([
    character?.chaId, character?.id, character?._id, character?.uid, character?.uuid,
    character?.key, character?.name
  ].map(value => text(value || '').trim()).filter(Boolean));
  const scopeManagerChatAliases = chat => new Set([
    chat?.id, chat?._id, chat?.uid, chat?.uuid, chat?.key, chat?.chatId,
    chat?.fileName, chat?.filename
  ].map(value => text(value || '').trim()).filter(Boolean));
  const scopeManagerHostInventoryOnce = async () => {
    const context = await getCurrentContext();
    let character = context.character;
    if ((!Array.isArray(character?.chats) || !character.chats.length) && Number.isInteger(Number(context.characterIndex)) && Number(context.characterIndex) >= 0) {
      const api = liveApi(['getCharacterFromIndex']);
      if (typeof api?.getCharacterFromIndex === 'function') {
        try { character = await api.getCharacterFromIndex(Number(context.characterIndex)) || character; } catch (_) {}
      }
    }
    const chats = Array.isArray(character?.chats) ? character.chats : [];
    const characterAliases = scopeManagerCharacterAliases(character);
    const chatRows = chats.map((chat, index) => ({
      index,
      aliases: Array.from(scopeManagerChatAliases(chat)),
      chatId: Array.from(scopeManagerChatAliases(chat))[0] || '',
      title: scopeManagerFirst(chat?.name, chat?.title, chat?.chatName, chat?.filename, `Chat ${index + 1}`)
    })).filter(row => row.aliases.length);
    const currentIdentity = contextIdentity({ ...context, character });
    const fingerprint = stableHash64(JSON.stringify({
      character: Array.from(characterAliases).sort(),
      chats: chatRows.map(row => row.aliases.slice().sort()).sort((a, b) => text(a[0]).localeCompare(text(b[0])))
    }));
    const currentChatPresent = !!currentIdentity.chatId
      && chatRows.some(row => scopeManagerArray(row.aliases).includes(currentIdentity.chatId));
    return {
      context: { ...context, character },
      // An empty or partial chat list must never prove that old scopes are orphans.
      // Require a non-empty authoritative list that also contains the currently
      // selected chat, then repeat the same inventory once more before classifying.
      complete: Array.isArray(character?.chats)
        && chats.length > 0
        && characterAliases.size > 0
        && currentChatPresent,
      observedAt: Date.now(),
      characterAliases,
      characterId: currentIdentity.characterId,
      currentChatId: currentIdentity.chatId,
      currentPersonaId: currentIdentity.personaId,
      chatRows,
      fingerprint
    };
  };
  const scopeManagerStableHostInventory = async () => {
    try {
      const first = await scopeManagerHostInventoryOnce();
      await delay(120);
      const second = await scopeManagerHostInventoryOnce();
      const stable = first.complete === true && second.complete === true && first.fingerprint === second.fingerprint;
      return { ...second, stable, firstObservedAt: first.observedAt, reason: stable ? 'stable_current_character_chat_inventory' : 'host_inventory_changed_or_incomplete' };
    } catch (error) {
      return {
        context: null, complete: false, stable: false, observedAt: Date.now(), firstObservedAt: 0,
        characterAliases: new Set(), characterId: '', currentChatId: '', currentPersonaId: '', chatRows: [], fingerprint: '',
        reason: compact(error?.message || error, 240)
      };
    }
  };
  const scopeManagerClassification = (descriptor, inventory, forced = '') => {
    if (forced === 'active') return 'active';
    const characterId = text(descriptor?.characterId || '').trim();
    const chatId = text(descriptor?.chatId || '').trim();
    if (!characterId || !chatId || inventory?.stable !== true) return 'unverified';
    if (!inventory.characterAliases?.has(characterId)) return 'unverified';
    const chatFound = scopeManagerArray(inventory.chatRows).some(row => scopeManagerArray(row.aliases).includes(chatId));
    return chatFound ? 'active' : 'orphan_candidate';
  };
  const scopeManagerDisplayName = (namespace, descriptor, scopeId) => {
    const title = text(descriptor?.displayName || '').trim();
    if (title) return title;
    const chatId = text(descriptor?.chatId || '').trim();
    return `${MEMORY_SUITE_NAMESPACE_LABELS[namespace] || namespace} · ${chatId ? compact(chatId, 48) : compact(scopeId, 64)}`;
  };
  const scopeManagerPriorMap = catalog => new Map(scopeManagerArray(catalog?.scopes).map(scope => [`${scope.namespace}:${scope.scopeId}`, scope]));
  const scopeManagerPreviousFor = (priorMap, namespace, scopeId) => priorMap.get(`${namespace}:${scopeId}`) || null;
  const scopeManagerFinalize = (namespace, raw, inventory, priorMap) => {
    const prior = scopeManagerPreviousFor(priorMap, namespace, raw.scopeId);
    const priorDescriptor = scopeManagerObject(prior?.descriptor);
    const descriptor = {
      ...priorDescriptor,
      ...scopeManagerObject(raw.descriptor),
      characterId: scopeManagerFirst(raw.characterId, raw.descriptor?.characterId, prior?.characterId, priorDescriptor.characterId),
      chatId: scopeManagerFirst(raw.chatId, raw.descriptor?.chatId, prior?.chatId, priorDescriptor.chatId),
      personaId: scopeManagerFirst(raw.personaId, raw.descriptor?.personaId, prior?.personaId, priorDescriptor.personaId),
      scopeKey: scopeManagerFirst(raw.scopeKey, raw.descriptor?.scopeKey, prior?.scopeKey, priorDescriptor.scopeKey),
      displayName: scopeManagerFirst(raw.displayName, raw.descriptor?.displayName, prior?.displayName, priorDescriptor.displayName),
      inventoryFingerprint: inventory?.fingerprint || '',
      inventoryStable: inventory?.stable === true,
      classificationReason: raw.classificationReason || ''
    };
    const members = scopeManagerUniqueMembers(raw.members);
    const priorLinks = raw.keepPriorLinks === true && raw.coverageComplete !== true
      ? scopeManagerArray(prior?.links)
      : [];
    const links = scopeManagerUniqueLinks([...(raw.links || []), ...priorLinks])
      .filter(link => link.targetRef !== raw.scopeId && link.targetRef !== descriptor.scopeKey);
    const baseClassification = scopeManagerClassification(descriptor, inventory, raw.forceClassification || '');
    return {
      namespace,
      scopeId: text(raw.scopeId || '').trim(),
      scopeKey: descriptor.scopeKey || text(raw.scopeId || '').trim(),
      kind: text(raw.kind || 'unknown'),
      characterId: descriptor.characterId,
      chatId: descriptor.chatId,
      personaId: descriptor.personaId,
      displayName: scopeManagerDisplayName(namespace, descriptor, raw.scopeId),
      baseClassification,
      coverageComplete: raw.coverageComplete === true,
      inventoryObservedAt: inventory?.observedAt || Date.now(),
      descriptor,
      members,
      links,
      _mutations: scopeManagerArray(raw.mutations)
    };
  };
  const scopeManagerNamespaceSnapshot = async namespace => {
    const [integrity, pluginListing, localListing] = await Promise.all([
      MemorySuiteStorageBridge.managerServerIntegrity(namespace),
      MemorySuiteStorageBridge.managerServerKeys(namespace, 'plugin', ''),
      MemorySuiteStorageBridge.managerServerKeys(namespace, 'local', '')
    ]);
    const records = [
      ...scopeManagerArray(pluginListing?.records),
      ...scopeManagerArray(localListing?.records)
    ];
    const recordMap = scopeManagerRecordMap(records);
    const cache = new Map();
    const read = async (space, key) => {
      const id = scopeManagerRecordId(space, key);
      if (cache.has(id)) return cache.get(id);
      const record = recordMap.get(id);
      if (!record || record.tombstone === true) {
        const result = { record, remote: null, parsed: null, original: null, ok: false, reason: record?.tombstone ? 'tombstone' : 'record_missing' };
        cache.set(id, result);
        return result;
      }
      if (Number(record.valueBytes || 0) > MEMORY_SUITE_SCOPE_READ_MAX_BYTES) {
        const result = { record, remote: null, parsed: null, original: null, ok: false, reason: 'record_too_large_for_safe_scope_index' };
        cache.set(id, result);
        return result;
      }
      try {
        const remote = await MemorySuiteStorageBridge.managerServerGet(namespace, space, key);
        const decoded = scopeManagerStoredValue(remote);
        const result = { record, remote, ...decoded, reason: decoded.ok ? '' : 'decode_failed' };
        cache.set(id, result);
        return result;
      } catch (error) {
        const result = { record, remote: null, parsed: null, original: null, ok: false, reason: compact(error?.message || error, 240) };
        cache.set(id, result);
        return result;
      }
    };
    return { namespace, integrity, pluginListing, localListing, records, recordMap, read };
  };
  const scopeManagerRecordsWithPrefix = (snapshot, space, prefix) => snapshot.records.filter(record => record.space === space && text(record.key).startsWith(prefix));
  const scopeManagerRecord = (snapshot, space, key) => snapshot.recordMap.get(scopeManagerRecordId(space, key)) || null;
  // Logical scope deletion keeps server tombstones so a later mirror migration cannot silently resurrect deleted data from stale pluginStorage.
  const scopeManagerPurgeMutations = members => scopeManagerUniqueMembers(members).filter(member => member.sharedRecord !== true && member.exists === true).map(member => scopeManagerMutationFor(member, 'remove'));

  const scopeManagerScanFlashback = async (snapshot, inventory, priorMap) => {
    const registryKey = 'vector_rag_memory:scope_registry:v2';
    const registryRecord = scopeManagerRecord(snapshot, 'plugin', registryKey);
    const registryLoaded = registryRecord ? await snapshot.read('plugin', registryKey) : null;
    const registry = scopeManagerObject(registryLoaded?.parsed);
    const entries = scopeManagerArray(registry.scopes);
    const scopes = [];
    const knownHashes = new Set();
    for (const meta of entries) {
      const scopeKey = text(meta?.scopeKey || '').trim();
      if (!scopeKey) continue;
      const storageHash = text(meta?.storageHash || '').trim();
      if (storageHash) knownHashes.add(storageHash);
      const pluginPrefix = storageHash ? `vector_rag_memory:scope:${storageHash}:` : '';
      const localPrefix = storageHash ? `vector_rag_memory:local-vector-shard:v1:${storageHash}:` : '';
      const uniqueMembers = [
        ...(pluginPrefix ? scopeManagerRecordsWithPrefix(snapshot, 'plugin', pluginPrefix).map(record => scopeManagerMember(record, false)) : []),
        ...(localPrefix ? scopeManagerRecordsWithPrefix(snapshot, 'local', localPrefix).map(record => scopeManagerMember(record, false)) : [])
      ];
      const members = [...uniqueMembers];
      const mutations = scopeManagerPurgeMutations(uniqueMembers);
      if (registryRecord && registryLoaded?.ok) {
        const shared = scopeManagerMember(registryRecord, true);
        members.push(shared);
        const next = { ...registry, scopes: entries.filter(item => text(item?.scopeKey || '').trim() !== scopeKey), updatedAt: Date.now() };
        mutations.push(scopeManagerMutationFor(shared, 'set', scopeManagerEncodeLike(registryLoaded.original, next)));
      }
      let manifest = null;
      if (pluginPrefix) {
        const manifestRecord = snapshot.records.find(record => record.space === 'plugin' && record.key.startsWith(pluginPrefix) && /:manifest:v\d+$/.test(record.key));
        if (manifestRecord) manifest = (await snapshot.read('plugin', manifestRecord.key)).parsed;
      }
      const descriptor = scopeManagerDescriptorFrom(meta, scopeManagerObject(scopeManagerPreviousFor(priorMap, 'flashback', scopeKey)?.descriptor));
      const links = scopeManagerCollectLinks({ meta, manifest });
      scopes.push(scopeManagerFinalize('flashback', {
        scopeId: scopeKey, scopeKey, kind: 'chat_memory', descriptor,
        displayName: scopeManagerFirst(meta.chatTitle, meta.characterName && meta.chatTitle ? `${meta.characterName} · ${meta.chatTitle}` : '', descriptor.displayName),
        members, links, mutations,
        coverageComplete: !!storageHash && (!registryRecord || registryLoaded?.ok === true),
        keepPriorLinks: true
      }, inventory, priorMap));
    }
    const unknown = new Map();
    for (const record of snapshot.records) {
      let match = record.space === 'plugin' ? /^vector_rag_memory:scope:([^:]+):/.exec(record.key) : /^vector_rag_memory:local-vector-shard:v1:([^:]+):/.exec(record.key);
      if (!match || knownHashes.has(match[1])) continue;
      const list = unknown.get(match[1]) || [];
      list.push(scopeManagerMember(record, false));
      unknown.set(match[1], list);
    }
    for (const [storageHash, members] of unknown.entries()) {
      if (!members.some(member => member.exists === true)) continue;
      scopes.push(scopeManagerFinalize('flashback', {
        scopeId: `unregistered:${storageHash}`, scopeKey: '', kind: 'unregistered_storage',
        descriptor: { displayName: `등록되지 않은 Flashback 저장소 · ${storageHash}` },
        members, links: [], mutations: scopeManagerPurgeMutations(members), coverageComplete: true
      }, inventory, priorMap));
    }
    return scopes;
  };

  const scopeManagerScanHayaku = async (snapshot, inventory, priorMap) => {
    const ledgerRecords = snapshot.records.filter(record => record.space === 'plugin' && record.tombstone !== true && record.key.startsWith(HAYAKU_LEDGER_PREFIX));
    const scopes = [];
    let graphComplete = true;
    for (const record of ledgerRecords) {
      const scopeKey = record.key.slice(HAYAKU_LEDGER_PREFIX.length);
      const loaded = await snapshot.read('plugin', record.key);
      if (!loaded.ok || !scopeManagerObject(loaded.parsed).scopeKey) graphComplete = false;
      const ledger = scopeManagerObject(loaded.parsed);
      const prior = scopeManagerPreviousFor(priorMap, 'hayaku', scopeKey);
      const hayakuCharacterId = scopeManagerText(inventory?.context?.character?.chaId || inventory.characterId || '');
      const matchedChat = inventory?.stable && hayakuCharacterId
        ? scopeManagerArray(inventory.chatRows).find(row => scopeManagerArray(row?.aliases).some(chatAlias => (
            `chat_${stableHash64(`${hayakuCharacterId}\n${scopeManagerText(chatAlias)}`)}` === scopeKey
          ))) || null
        : null;
      const forcedCurrent = !!matchedChat;
      const descriptor = forcedCurrent
        ? {
          characterId: hayakuCharacterId,
          chatId: scopeManagerText(matchedChat.chatId || ''),
          personaId: scopeManagerText(matchedChat.personaId || ''),
          scopeKey,
          displayName: scopeManagerFirst(matchedChat.title, matchedChat.chatId, prior?.displayName)
        }
        : scopeManagerDescriptorFrom(ledger, scopeManagerObject(prior?.descriptor));
      const archiveId = scopeManagerFirst(ledger?.archiveRef?.archiveId, ledger?.archiveId);
      const links = scopeManagerCollectLinks(ledger, { archiveId });
      const member = scopeManagerMember(record, false);
      scopes.push(scopeManagerFinalize('hayaku', {
        scopeId: scopeKey, scopeKey, kind: 'packet_ledger', descriptor,
        members: [member], links, mutations: [scopeManagerMutationFor(member, 'remove')],
        coverageComplete: loaded.ok === true,
        forceClassification: forcedCurrent ? 'active' : '', keepPriorLinks: true,
        classificationReason: forcedCurrent ? 'stable_host_chat_scope_match' : ''
      }, inventory, priorMap));
    }
    if (!graphComplete) for (const scope of scopes) scope.coverageComplete = false;
    const archives = new Map();
    for (const record of snapshot.records.filter(item => item.space === 'plugin' && item.tombstone !== true)) {
      const meta = /^hayaku\.v2\.shared_archive_meta\.(.+)$/.exec(record.key);
      const body = /^hayaku\.v2\.shared_archive\.(.+)$/.exec(record.key);
      const match = meta || body;
      if (!match) continue;
      const id = match[1];
      const row = archives.get(id) || [];
      row.push(scopeManagerMember(record, false));
      archives.set(id, row);
    }
    for (const [archiveId, members] of archives.entries()) {
      scopes.push(scopeManagerFinalize('hayaku', {
        scopeId: `archive:${archiveId}`, scopeKey: `archive:${archiveId}`, kind: 'shared_archive',
        descriptor: { displayName: `HAYAKU 승계 아카이브 · ${archiveId}` },
        members, links: [], mutations: scopeManagerPurgeMutations(members), coverageComplete: false
      }, inventory, priorMap));
    }
    return scopes;
  };

  const scopeManagerScanLibra = async (snapshot, inventory, priorMap) => {
    const registryKey = 'libra:v1:scope-registry:v1';
    const registryRecord = scopeManagerRecord(snapshot, 'plugin', registryKey);
    const registryLoaded = registryRecord ? await snapshot.read('plugin', registryKey) : null;
    const registry = scopeManagerObject(registryLoaded?.parsed);
    const manifestRecords = snapshot.records.filter(record => record.space === 'plugin' && record.tombstone !== true && /^libra:v1:scope:.+:manifest$/.test(record.key));
    const scopes = [];
    const knownScopeKeys = new Set();
    const associatedLocal = new Set();
    for (const manifestRecord of manifestRecords) {
      const match = /^libra:v1:scope:(.+):manifest$/.exec(manifestRecord.key);
      if (!match) continue;
      const scopeKey = match[1];
      knownScopeKeys.add(scopeKey);
      const prefix = `libra:v1:scope:${scopeKey}:`;
      const pluginRecords = scopeManagerRecordsWithPrefix(snapshot, 'plugin', prefix);
      const manifestLoaded = await snapshot.read('plugin', manifestRecord.key);
      const manifest = scopeManagerObject(manifestLoaded.parsed);
      const localKeys = new Set();
      for (const vectorRecord of pluginRecords.filter(record => /(?:^|:)(?:vector|predecessor-vector):/.test(record.key))) {
        const loaded = await snapshot.read('plugin', vectorRecord.key);
        if (!loaded.ok) continue;
        for (const key of scopeManagerCollectLocalKeys(loaded.parsed, ['libra:v1:local-vector:'])) localKeys.add(key);
      }
      const localMembers = [];
      for (const key of localKeys) {
        const record = scopeManagerRecord(snapshot, 'local', key);
        if (!record) continue;
        associatedLocal.add(key);
        localMembers.push(scopeManagerMember(record, false));
      }
      const uniqueMembers = [...pluginRecords.map(record => scopeManagerMember(record, false)), ...localMembers];
      const members = [...uniqueMembers];
      const mutations = scopeManagerPurgeMutations(uniqueMembers);
      if (registryRecord && registryLoaded?.ok) {
        const shared = scopeManagerMember(registryRecord, true);
        members.push(shared);
        const next = { ...registry };
        for (const [id, entry] of Object.entries(registry)) if (text(entry?.scopeKey || '').trim() === scopeKey) delete next[id];
        mutations.push(scopeManagerMutationFor(shared, 'set', scopeManagerEncodeLike(registryLoaded.original, next)));
      }
      const descriptor = scopeManagerDescriptorFrom(manifest, scopeManagerObject(scopeManagerPreviousFor(priorMap, 'libra', scopeKey)?.descriptor));
      const links = scopeManagerCollectLinks(manifest, { archiveId: manifest?.archiveRef?.archiveId });
      scopes.push(scopeManagerFinalize('libra', {
        scopeId: scopeKey, scopeKey, kind: 'canonical_memory', descriptor,
        displayName: scopeManagerFirst(manifest.chatTitle, descriptor.displayName),
        members, links, mutations, coverageComplete: manifestLoaded.ok === true && (!registryRecord || registryLoaded?.ok === true),
        keepPriorLinks: true
      }, inventory, priorMap));
    }
    const unknownByScope = new Map();
    for (const record of snapshot.records.filter(item => item.space === 'plugin')) {
      const match = /^libra:v1:scope:(.+?):(?:manifest|memory:|vector:|work:|run:|predecessor:|predecessor-vector:|recall-catalog:)/.exec(record.key);
      if (!match || knownScopeKeys.has(match[1])) continue;
      const members = unknownByScope.get(match[1]) || [];
      members.push(scopeManagerMember(record, false));
      unknownByScope.set(match[1], members);
    }
    for (const [scopeKey, members] of unknownByScope.entries()) {
      if (!members.some(member => member.exists === true)) continue;
      scopes.push(scopeManagerFinalize('libra', {
        scopeId: scopeKey, scopeKey, kind: 'manifest_missing', descriptor: { displayName: `LIBRA manifest 누락 스코프 · ${scopeKey}` },
        members, links: [], mutations: scopeManagerPurgeMutations(members), coverageComplete: false
      }, inventory, priorMap));
    }
    const unassignedLocal = snapshot.records.filter(record => record.space === 'local' && record.tombstone !== true && record.key.startsWith('libra:v1:local-vector:') && !associatedLocal.has(record.key));
    if (unassignedLocal.length) {
      const members = unassignedLocal.map(record => scopeManagerMember(record, false));
      scopes.push(scopeManagerFinalize('libra', {
        scopeId: 'unassigned-local-vectors', kind: 'unassigned_local_vectors', descriptor: { displayName: 'LIBRA 연결 미확인 로컬 벡터' },
        members, mutations: scopeManagerPurgeMutations(members), links: [], coverageComplete: false
      }, inventory, priorMap));
    }
    const archives = new Map();
    for (const record of snapshot.records.filter(item => item.space === 'plugin')) {
      const match = /^libra:v1:shared-archive:([^:]+):/.exec(record.key);
      if (!match) continue;
      const rows = archives.get(match[1]) || [];
      rows.push(scopeManagerMember(record, false));
      archives.set(match[1], rows);
    }
    for (const [archiveId, members] of archives.entries()) {
      scopes.push(scopeManagerFinalize('libra', {
        scopeId: `archive:${archiveId}`, kind: 'shared_archive', descriptor: { displayName: `LIBRA 승계 아카이브 · ${archiveId}` },
        members, mutations: scopeManagerPurgeMutations(members), links: [], coverageComplete: false
      }, inventory, priorMap));
    }
    return scopes;
  };

  const scopeManagerContainer = (parsed, field) => {
    const root = scopeManagerObject(parsed);
    const explicit = root[field];
    if (explicit && typeof explicit === 'object' && !Array.isArray(explicit)) return explicit;
    const copy = { ...root };
    for (const key of ['version', 'savedAt', 'updatedAt', 'schema']) delete copy[key];
    return copy;
  };

  const scopeManagerScanLia = async (snapshot, inventory, priorMap) => {
    const indexKey = 'liaPersonaLinkerLivePersonaIndexV2';
    const proofKey = 'liaPersonaRequestProofV1';
    const legacyKey = 'liaPersonaLinkerLivePersonaSyncV1';
    const indexSources = [];
    const proofSources = [];
    const assigned = new Set();
    const readSources = async (logicalKey, field, target) => {
      for (const record of scopeManagerRecordsForLogicalKey(snapshot, 'plugin', logicalKey).filter(item => item.tombstone !== true)) {
        assigned.add(record.key);
        const loaded = await snapshot.read('plugin', record.key);
        const info = scopeManagerScopedRemoteKeyInfo(record.key);
        const parsed = scopeManagerObject(loaded?.parsed);
        const rows = scopeManagerObject(parsed[field]);
        target.push({ logicalKey, field, record, loaded, parsed, rows, info });
      }
    };
    await readSources(indexKey, 'entries', indexSources);
    await readSources(proofKey, 'proofs', proofSources);
    const legacyRecord = scopeManagerRecord(snapshot, 'plugin', legacyKey);
    const legacyLoaded = legacyRecord ? await snapshot.read('plugin', legacyKey) : null;
    const legacyStore = scopeManagerObject(legacyLoaded?.parsed);
    if (legacyRecord) assigned.add(legacyRecord.key);

    const scopeIds = new Set();
    for (const source of [...indexSources, ...proofSources]) {
      if (source.info.scopeId) scopeIds.add(source.info.scopeId);
      for (const scopeId of Object.keys(source.rows)) if (scopeId) scopeIds.add(scopeId);
    }
    const shardRecords = snapshot.records.filter(record => record.space === 'plugin' && record.tombstone !== true && record.key.startsWith('liaPersonaLinkerLivePersonaScopeV2::'));
    const shardByScope = new Map();
    for (const record of shardRecords) {
      const loaded = await snapshot.read('plugin', record.key);
      const binding = scopeManagerObject(loaded?.parsed);
      const scopeId = scopeManagerFirst(binding.scopeKey, binding.scopeId);
      if (!scopeId) continue;
      assigned.add(record.key);
      scopeIds.add(scopeId);
      shardByScope.set(scopeId, { record, loaded, binding });
    }

    const sourceContainsScope = (source, scopeId) => source.info.scopeId === scopeId || Object.prototype.hasOwnProperty.call(source.rows, scopeId);
    const scopedRow = (sources, scopeId) => {
      const candidates = sources.filter(source => sourceContainsScope(source, scopeId));
      candidates.sort((a, b) => Number(b.record?.updatedAt || 0) - Number(a.record?.updatedAt || 0));
      const source = candidates[0] || null;
      return { source, row: source ? (source.rows[scopeId] || Object.values(source.rows)[0] || null) : null, candidates };
    };
    const mutationsForSources = (sources, scopeId) => {
      const out = [];
      const members = [];
      for (const source of sources.filter(item => sourceContainsScope(item, scopeId))) {
        if (!source.loaded?.ok) continue;
        if (source.info.scoped) {
          const owned = scopeManagerMember(source.record, false);
          members.push(owned); out.push(scopeManagerMutationFor(owned, 'remove'));
        } else {
          const shared = scopeManagerMember(source.record, true);
          members.push(shared);
          const next = clone(source.parsed, {});
          next[source.field] = { ...scopeManagerObject(next[source.field]) };
          delete next[source.field][scopeId];
          next.updatedAt = new Date().toISOString();
          out.push(scopeManagerMutationFor(shared, 'set', scopeManagerEncodeLike(source.loaded.original, next)));
        }
      }
      return { members, mutations: out };
    };

    const scopes = [];
    for (const scopeKey of scopeIds) {
      const indexMatch = scopedRow(indexSources, scopeKey);
      const proofMatch = scopedRow(proofSources, scopeKey);
      const meta = scopeManagerObject(indexMatch.row);
      let shard = shardByScope.get(scopeKey) || null;
      const storageKey = scopeManagerFirst(meta.storageKey, shard?.record?.key);
      if (!shard && storageKey) {
        const shardRecord = scopeManagerRecord(snapshot, 'plugin', storageKey);
        if (shardRecord) {
          const shardLoaded = await snapshot.read('plugin', storageKey);
          shard = { record: shardRecord, loaded: shardLoaded, binding: scopeManagerObject(shardLoaded?.parsed) };
          assigned.add(storageKey);
        }
      }
      const binding = scopeManagerObject(shard?.binding);
      const members = [];
      const mutations = [];
      if (shard?.record) {
        const owned = scopeManagerMember(shard.record, false);
        members.push(owned); mutations.push(scopeManagerMutationFor(owned, 'remove'));
      }
      for (const collection of [mutationsForSources(indexSources, scopeKey), mutationsForSources(proofSources, scopeKey)]) {
        members.push(...collection.members); mutations.push(...collection.mutations);
      }
      if (legacyRecord && legacyLoaded?.ok && scopeManagerObject(legacyStore.bindings)[scopeKey]) {
        const shared = scopeManagerMember(legacyRecord, true);
        const next = clone(legacyStore, {});
        next.bindings = { ...scopeManagerObject(next.bindings) };
        delete next.bindings[scopeKey];
        next.updatedAt = new Date().toISOString();
        members.push(shared);
        mutations.push(scopeManagerMutationFor(shared, 'set', scopeManagerEncodeLike(legacyLoaded.original, next)));
      }
      const descriptor = scopeManagerDescriptorFrom(binding, scopeManagerObject(scopeManagerPreviousFor(priorMap, 'lia', scopeKey)?.descriptor));
      const links = scopeManagerCollectLinks(binding);
      const indexParsed = indexMatch.candidates.every(source => source.loaded?.ok === true);
      const proofParsed = proofMatch.candidates.every(source => source.loaded?.ok === true);
      scopes.push(scopeManagerFinalize('lia', {
        scopeId: scopeKey, scopeKey, kind: 'live_persona', descriptor,
        displayName: scopeManagerFirst(binding.livePersonaName, binding.sourcePersonaName, descriptor.displayName),
        members, links, mutations,
        coverageComplete: !!shard?.record && shard?.loaded?.ok === true && indexParsed && proofParsed,
        keepPriorLinks: true
      }, inventory, priorMap));
    }
    const globalRecords = snapshot.records.filter(record => record.space === 'plugin' && record.tombstone !== true
      && !assigned.has(record.key) && !record.key.startsWith('__memory_suite_'));
    if (globalRecords.length) {
      const members = globalRecords.map(record => scopeManagerMember(record, false));
      scopes.push(scopeManagerFinalize('lia', {
        scopeId: 'global-data', kind: 'global_vault_and_assets', descriptor: { displayName: 'LIA 전역 보관함·블루프린트·에셋' },
        members, mutations: scopeManagerPurgeMutations(members), links: [], coverageComplete: false
      }, inventory, priorMap));
    }
    return scopes;
  };

  const scopeManagerScanRetrace = async (snapshot, inventory, priorMap) => {
    const groups = new Map();
    for (const record of snapshot.records.filter(item => item.space === 'plugin' && item.tombstone !== true)) {
      const prefix = MEMORY_SUITE_RETRACE_SCOPE_PREFIXES.find(item => record.key.startsWith(item));
      if (!prefix) continue;
      const scopeKey = record.key.slice(prefix.length);
      if (!scopeKey) continue;
      const group = groups.get(scopeKey) || { members: [], values: [], links: [], parsed: true };
      const member = scopeManagerMember(record, false);
      group.members.push(member);
      const loaded = await snapshot.read('plugin', record.key);
      if (loaded.ok) {
        group.values.push(loaded.parsed);
        group.links.push(...scopeManagerCollectLinks(loaded.parsed));
      } else group.parsed = false;
      groups.set(scopeKey, group);
    }
    const scopes = [];
    const retraceCharacterId = scopeManagerText(inventory?.context?.character?.chaId || inventory.characterId || '');
    for (const [scopeKey, group] of groups.entries()) {
      const matchedChat = inventory?.stable && retraceCharacterId
        ? scopeManagerArray(inventory.chatRows).find(row => scopeManagerArray(row?.aliases).some(chatAlias => (
            `chat_${stableHash64(`${retraceCharacterId}\n${scopeManagerText(chatAlias)}`)}` === scopeKey
          ))) || null
        : null;
      const forcedCurrent = !!matchedChat;
      const descriptor = forcedCurrent
        ? {
          characterId: retraceCharacterId,
          chatId: scopeManagerText(matchedChat.chatId || ''),
          personaId: scopeManagerText(matchedChat.personaId || ''),
          scopeKey,
          displayName: scopeManagerFirst(matchedChat.title, matchedChat.chatId)
        }
        : group.values.reduce((current, value) => {
          const next = scopeManagerDescriptorFrom(value, current);
          return { ...current, ...Object.fromEntries(Object.entries(next).filter(([, item]) => item)) };
        }, scopeManagerObject(scopeManagerPreviousFor(priorMap, 'retrace', scopeKey)?.descriptor));
      scopes.push(scopeManagerFinalize('retrace', {
        scopeId: scopeKey, scopeKey, kind: 'analysis_recovery', descriptor,
        members: group.members, links: group.links, mutations: scopeManagerPurgeMutations(group.members),
        coverageComplete: group.parsed, forceClassification: forcedCurrent ? 'active' : '', keepPriorLinks: true,
        classificationReason: forcedCurrent ? 'stable_host_chat_scope_match' : ''
      }, inventory, priorMap));
    }
    return scopes;
  };

  const scopeManagerScanNamespace = async (namespace, snapshot, inventory, priorMap) => {
    if (namespace === 'flashback') return await scopeManagerScanFlashback(snapshot, inventory, priorMap);
    if (namespace === 'hayaku') return await scopeManagerScanHayaku(snapshot, inventory, priorMap);
    if (namespace === 'libra') return await scopeManagerScanLibra(snapshot, inventory, priorMap);
    if (namespace === 'lia') return await scopeManagerScanLia(snapshot, inventory, priorMap);
    if (namespace === 'retrace') return await scopeManagerScanRetrace(snapshot, inventory, priorMap);
    return [];
  };

  const scopeManagerRecipeKey = (namespace, scopeId) => `${namespace}\n${scopeId}`;
  const refreshServerScopeManagement = async () => {
    if (Runtime.serverScopeManagerLoading) return Runtime.serverScopeCatalog;
    Runtime.serverScopeManagerLoading = true;
    Runtime.serverScopeManagerError = '';
    const body = Runtime.root?.querySelector?.('#serverDataBody');
    if (body) body.innerHTML = '<div class="empty"><strong>서버 스코프 검사 중</strong><span>5개 namespace와 현재 RisuAI 채팅 목록을 비교하고 있습니다.</span></div>';
    try {
      const inventory = await scopeManagerStableHostInventory();
      const priorCatalog = await MemorySuiteStorageBridge.managerListScopes().catch(() => ({ scopes: [] }));
      const priorMap = scopeManagerPriorMap(priorCatalog);
      const recipes = new Map();
      const scanErrors = {};
      const hayakuOwnerGate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
      for (const namespace of MEMORY_SUITE_SCOPE_NAMESPACES) {
        try {
          if (namespace === 'hayaku' && hayakuOwnerGate.ready !== true) {
            scanErrors.hayaku = '활성 HAYAKU owner 없음 · namespace 검사 생략';
            continue;
          }
          const snapshot = await scopeManagerNamespaceSnapshot(namespace);
          const scopes = await scopeManagerScanNamespace(namespace, snapshot, inventory, priorMap);
          for (const scope of scopes) recipes.set(scopeManagerRecipeKey(namespace, scope.scopeId), scope._mutations || []);
          await MemorySuiteStorageBridge.managerReplaceScopeIndex(namespace, scopes.map(({ _mutations, ...scope }) => scope));
        } catch (error) {
          scanErrors[namespace] = compact(error?.message || error, 360);
          warn(`서버 스코프 색인 실패: ${namespace}`, error);
        }
      }
      const catalog = await MemorySuiteStorageBridge.managerListScopes();
      Runtime.serverScopeCatalog = {
        ...catalog,
        at: Date.now(),
        hostInventory: {
          stable: inventory.stable === true,
          complete: inventory.complete === true,
          fingerprint: inventory.fingerprint,
          observedAt: inventory.observedAt,
          reason: inventory.reason,
          characterId: inventory.characterId,
          currentChatId: inventory.currentChatId,
          chatCount: inventory.chatRows.length
        },
        scanErrors
      };
      Runtime.serverScopeRecipes = recipes;
      Runtime.serverScopePlans = new Map();
      renderServerScopeManagement();
      return Runtime.serverScopeCatalog;
    } catch (error) {
      Runtime.serverScopeManagerError = compact(error?.message || error, 500);
      renderServerScopeManagement();
      throw error;
    } finally {
      Runtime.serverScopeManagerLoading = false;
    }
  };

  const scopeManagerFormatBytes = bytes => {
    const value = Math.max(0, Number(bytes || 0) || 0);
    if (value < 1024) return `${formatNumber(value)} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };
  const scopeManagerFormatTime = value => {
    const number = Number(value || 0) || 0;
    if (!number) return '-';
    try { return new Date(number).toLocaleString('ko-KR'); } catch (_) { return String(number); }
  };
  const scopeManagerDeleteBlockedReason = scope => {
    if (scope?.pinned === true) return '사용자가 보존 상태로 고정한 스코프입니다.';
    if (Number(scope?.referenceCount || 0) > 0 || scope.classification === 'referenced_ancestor') {
      return `다른 스코프 ${formatNumber(scope.referenceCount || 0)}개가 참조 중입니다.`;
    }
    if (scope.classification === 'unverified') return 'RisuAI 채팅 존재 여부를 안전하게 확정할 수 없습니다.';
    if (scope.coverageComplete !== true) return '스코프의 전체 키·참조 관계를 완전히 확인하지 못했습니다.';
    if (!Runtime.serverScopeRecipes?.has(scopeManagerRecipeKey(scope.namespace, scope.scopeId))) return '현재 새로고침에서 안전한 삭제 계획을 만들지 못했습니다.';
    return '';
  };
  const renderServerScopeManagement = () => {
    const body = Runtime.root?.querySelector?.('#serverDataBody');
    if (!body) return;
    if (Runtime.serverScopeManagerLoading) {
      body.innerHTML = '<div class="empty"><strong>서버 스코프 검사 중</strong><span>데이터를 변경하지 않고 읽기 전용 검사 중입니다.</span></div>';
      return;
    }
    if (Runtime.serverScopeManagerError) {
      body.innerHTML = `<div class="empty error"><strong>서버 데이터 관리 실패</strong><span>${escapeHtml(Runtime.serverScopeManagerError)}</span></div>`;
      return;
    }
    const catalog = Runtime.serverScopeCatalog;
    if (!catalog) {
      body.innerHTML = '<div class="empty"><strong>서버 데이터 조회 대기</strong><span>새로고침을 누르면 스코프별 서버 데이터를 검사합니다.</span></div>';
      return;
    }
    const inventory = catalog.hostInventory || {};
    const errors = Object.entries(catalog.scanErrors || {});
    const scopes = scopeManagerArray(catalog.scopes);
    const groups = MEMORY_SUITE_SCOPE_STATUS_ORDER.map(status => ({ status, rows: scopes.filter(scope => scope.classification === status) }));
    const inventoryHtml = `<div class="server-data-summary ${inventory.stable ? 'ok' : 'warn'}"><div><strong>${inventory.stable ? '채팅 목록 안정 확인' : '채팅 목록 확인 불완전'}</strong><span>${inventory.stable ? `현재 캐릭터의 채팅 ${formatNumber(inventory.chatCount || 0)}개와 비교했습니다.` : '고아 판정과 삭제가 보수적으로 차단됩니다.'}</span></div><em>${scopeManagerFormatTime(catalog.at)}</em></div>`;
    const errorHtml = errors.length ? `<div class="server-data-scan-errors"><strong>색인 보류</strong>${errors.map(([namespace, reason]) => `<span>${escapeHtml(MEMORY_SUITE_NAMESPACE_LABELS[namespace] || namespace)}: ${escapeHtml(reason)}</span>`).join('')}</div>` : '';
    const groupHtml = groups.map(group => {
      if (!group.rows.length) return '';
      return `<section class="server-scope-group" data-scope-status="${group.status}"><div class="server-scope-group-head"><div><h3>${escapeHtml(MEMORY_SUITE_SCOPE_STATUS_LABELS[group.status])}</h3><p>${group.status === 'orphan_candidate' ? '원본 채팅은 발견되지 않았지만 서버 데이터는 보존되어 있습니다.' : group.status === 'referenced_ancestor' ? '다른 세션이 이 스코프를 승계 조상으로 참조합니다.' : group.status === 'unverified' ? '자동 판단에 필요한 안정적인 채팅·참조 정보가 부족합니다.' : 'RisuAI에 원본 채팅이 존재합니다.'}</p></div><em>${formatNumber(group.rows.length)}</em></div>${group.rows.map((scope, index) => {
        const blocked = scopeManagerDeleteBlockedReason(scope);
        const plan = Runtime.serverScopePlans?.get(scopeManagerRecipeKey(scope.namespace, scope.scopeId));
        const refs = scopeManagerArray(scope.inboundReferences);
        const statusClass = scope.classification.replace(/_/g, '-');
        return `<article class="server-scope-card ${statusClass}"><div class="server-scope-main"><div class="server-scope-title"><span class="server-plugin-badge ${escapeHtml(scope.namespace)}">${escapeHtml(MEMORY_SUITE_NAMESPACE_LABELS[scope.namespace] || scope.namespace)}</span><div><strong>${escapeHtml(scope.displayName || scope.scopeId)}</strong><small>${escapeHtml(scope.kind || 'unknown')} · ${escapeHtml(compact(scope.scopeKey || scope.scopeId, 110))}</small></div></div><div class="server-scope-stats"><span>레코드 <b>${formatNumber(scope.liveRecords || 0)}</b></span><span>tombstone <b>${formatNumber(scope.tombstones || 0)}</b></span><span>크기 <b>${scopeManagerFormatBytes(scope.bytes || 0)}</b></span><span>마지막 저장 <b>${scopeManagerFormatTime(scope.latestStoredAt)}</b></span></div>${refs.length ? `<div class="server-scope-refs"><strong>참조 중</strong>${refs.slice(0, 8).map(ref => `<span>${escapeHtml(ref.sourceDisplayName || ref.sourceScopeId)} · ${escapeHtml(ref.kind || 'reference')}</span>`).join('')}</div>` : ''}${blocked ? `<div class="server-scope-blocked">${escapeHtml(blocked)}</div>` : plan ? `<div class="server-scope-ready">서버 백업과 삭제 조건 검증 완료 · 다시 눌러 실제 삭제</div>` : ''}</div><div class="server-scope-actions"><button class="btn" data-server-scope-detail="${escapeHtml(scope.namespace)}|${escapeHtml(scope.scopeId)}">내용 확인</button><button class="btn" data-server-scope-pin="${escapeHtml(scope.namespace)}|${escapeHtml(scope.scopeId)}">${scope.pinned === true ? '보존 해제' : '보존'}</button><button class="btn danger" data-server-scope-delete="${escapeHtml(scope.namespace)}|${escapeHtml(scope.scopeId)}" ${blocked ? 'disabled' : ''}>${plan ? '검증 완료 · 삭제 실행' : '서버 스코프 삭제'}</button></div></article>`;
      }).join('')}</section>`;
    }).join('');
    body.innerHTML = `${inventoryHtml}${errorHtml}${groupHtml || '<div class="empty"><strong>서버 스코프 없음</strong><span>서버에 관리할 스코프별 데이터가 없습니다.</span></div>'}`;
  };

  const scopeManagerFindCatalogScope = (namespace, scopeId) => scopeManagerArray(Runtime.serverScopeCatalog?.scopes)
    .find(scope => scope.namespace === namespace && scope.scopeId === scopeId) || null;
  const scopeManagerTogglePinned = async scope => {
    const result = await MemorySuiteStorageBridge.managerSetScopePinned(scope.namespace, scope.scopeId, scope.pinned !== true);
    Runtime.serverScopePlans?.delete(scopeManagerRecipeKey(scope.namespace, scope.scopeId));
    const catalog = await MemorySuiteStorageBridge.managerListScopes();
    Runtime.serverScopeCatalog = { ...(Runtime.serverScopeCatalog || {}), ...catalog, at: Date.now() };
    renderServerScopeManagement();
    return result;
  };
  const scopeManagerOwnerProof = async scope => {
    const pluginKeys = scopeManagerArray(scope.members).filter(member => member.space === 'plugin').map(member => member.key);
    const localKeys = scopeManagerArray(scope.members).filter(member => member.space === 'local').map(member => member.key);
    const payload = { scopeId: scope.scopeId, scopeKey: scope.scopeKey, pluginKeys, localKeys };
    const options = { timeoutMs: 120000 };
    let receipt;
    if (scope.namespace === 'flashback') receipt = await requestFlashbackIpc('memory_suite_prepare_server_scope_delete', payload, options);
    else if (scope.namespace === 'hayaku') {
      await ensureHayakuOwnerReady({ action: 'HAYAKU 서버 스코프 삭제 증명', force: true });
      receipt = await requestHayakuIpc('memory_suite_prepare_server_scope_delete', payload, { ...options, requireAuthenticatedSender: true });
    }
    else if (scope.namespace === 'libra') receipt = await requestLibraIpc('memory_suite_prepare_server_scope_delete', payload, options);
    else if (scope.namespace === 'lia') receipt = await requestLiaIpc('memory_suite_prepare_server_scope_delete', payload, options);
    else if (scope.namespace === 'retrace') receipt = await MemorySuiteStorageBridge.prepareServerScopeDeletion(payload);
    else throw new Error(`지원하지 않는 owner namespace입니다: ${scope.namespace}`);
    if (receipt?.schema !== 'memory-suite.server-scope-delete-owner-receipt.v1'
      || receipt?.verified !== true
      || text(receipt.modeAfter || '') !== 'plugin_only'
      || text(receipt.namespace || '') !== scope.namespace) {
      const error = new Error(`owner pluginStorage 보존 증명이 유효하지 않습니다: ${scope.namespace}`);
      error.receipt = receipt;
      throw error;
    }
    return receipt;
  };
  const scopeManagerCreatePlan = async scope => {
    const namespace = scope.namespace;
    const scopeId = scope.scopeId;
    const recipeKey = scopeManagerRecipeKey(namespace, scopeId);
    // Owner proof may repair mirror drift or restore server-only records, which can
    // legitimately advance server revisions. Re-index after that proof so the
    // conditional deletion plan is built from the exact post-proof revision/digest set.
    const modeProof = await scopeManagerOwnerProof(scope);
    await refreshServerScopeManagement();
    const refreshedScope = scopeManagerFindCatalogScope(namespace, scopeId);
    if (!refreshedScope) throw new Error('owner 보존 검증 후 서버 스코프를 다시 찾을 수 없습니다.');
    const blocked = scopeManagerDeleteBlockedReason(refreshedScope);
    if (blocked) throw new Error(`owner 보존 검증 후 삭제 조건이 바뀌었습니다: ${blocked}`);
    const mutations = Runtime.serverScopeRecipes?.get(recipeKey);
    if (!Array.isArray(mutations) || !mutations.length) throw new Error('owner 보존 검증 후 삭제 mutation을 다시 만들 수 없습니다.');
    const inventory = Runtime.serverScopeCatalog?.hostInventory || {};
    const inventoryProof = {
      hostInventoryStable: inventory.stable === true,
      complete: inventory.complete === true,
      fingerprint: text(inventory.fingerprint || ''),
      observedAt: Number(inventory.observedAt || 0),
      characterId: text(inventory.characterId || ''),
      currentChatId: text(inventory.currentChatId || '')
    };
    const plan = await MemorySuiteStorageBridge.managerPlanScopeDeletion({
      namespace,
      scopeId,
      modeProof,
      inventoryProof,
      mutations,
      metadata: { requestedBy: PLUGIN_NAME, requestedAt: Date.now(), classification: refreshedScope.classification }
    });
    if (!plan?.planId || !plan?.mutationFingerprint || plan?.conditionsVerified !== true) throw new Error('서버가 유효한 삭제 계획을 반환하지 않았습니다.');
    Runtime.serverScopePlans.set(recipeKey, { ...plan, scopeSnapshot: clone(refreshedScope, {}), preparedAt: Date.now() });
    renderServerScopeManagement();
    return plan;
  };
  const scopeManagerExecutePlan = async scope => {
    const recipeKey = scopeManagerRecipeKey(scope.namespace, scope.scopeId);
    const plan = Runtime.serverScopePlans?.get(recipeKey);
    if (!plan || Date.now() - Number(plan.preparedAt || 0) > MEMORY_SUITE_SCOPE_PLAN_TTL_MS) {
      Runtime.serverScopePlans?.delete(recipeKey);
      renderServerScopeManagement();
      throw new Error('삭제 계획이 만료되었습니다. 다시 검증하세요.');
    }
    // Verify the owner is still in plugin_only immediately before the destructive
    // commit. If the user changed modes after plan creation, this re-proof either
    // restores safety or advances revisions, in which case the server's conditional
    // batch rejects the now-stale plan instead of deleting against old state.
    await scopeManagerOwnerProof(plan.scopeSnapshot || scope);
    const receipt = await MemorySuiteStorageBridge.managerExecuteScopeDeletion(plan.planId, plan.mutationFingerprint);
    Runtime.serverScopePlans.delete(recipeKey);
    return receipt;
  };
  const scopeManagerShowDetail = async scope => {
    const members = scopeManagerArray(scope.members).map(member => `${member.space} · ${member.tombstone ? '[tombstone] ' : ''}${member.key} · rev ${member.revision}`).join('\n');
    const refs = scopeManagerArray(scope.inboundReferences).map(ref => `${ref.sourceNamespace}/${ref.sourceDisplayName || ref.sourceScopeId} → ${ref.kind}`).join('\n');
    await retraceAlert([
      `${MEMORY_SUITE_NAMESPACE_LABELS[scope.namespace] || scope.namespace} · ${scope.displayName || scope.scopeId}`,
      `상태: ${MEMORY_SUITE_SCOPE_STATUS_LABELS[scope.classification] || scope.classification}`,
      `scope: ${scope.scopeKey || scope.scopeId}`,
      `characterId: ${scope.characterId || '(확인 불가)'}`,
      `chatId: ${scope.chatId || '(확인 불가)'}`,
      `레코드: ${scope.liveRecords || 0} / tombstone: ${scope.tombstones || 0}`,
      '',
      refs ? `[이 스코프를 참조하는 자료]\n${refs}\n` : '',
      `[서버 키]\n${members || '(없음)'}`
    ].filter(Boolean).join('\n'));
  };
  const handleServerScopeManagementClick = async event => {
    const detail = event.target?.closest?.('[data-server-scope-detail]');
    const pin = event.target?.closest?.('[data-server-scope-pin]');
    const deletion = event.target?.closest?.('[data-server-scope-delete]');
    const target = detail || pin || deletion;
    if (!target || target.disabled || Runtime.busy) return;
    const attribute = detail ? 'data-server-scope-detail' : pin ? 'data-server-scope-pin' : 'data-server-scope-delete';
    const raw = text(target.getAttribute(attribute) || '');
    const separator = raw.indexOf('|');
    if (separator < 1) return;
    const namespace = raw.slice(0, separator);
    const scopeId = raw.slice(separator + 1);
    const scope = scopeManagerFindCatalogScope(namespace, scopeId);
    if (!scope) return;
    if (detail) return await scopeManagerShowDetail(scope);
    if (pin) {
      setBusy(true);
      try {
        const result = await scopeManagerTogglePinned(scope);
        await retraceAlert(result?.pinned === true ? '이 서버 스코프를 보존 상태로 고정했습니다.' : '서버 스코프의 보존 상태를 해제했습니다.');
      } finally { setBusy(false); }
      return;
    }
    const blocked = scopeManagerDeleteBlockedReason(scope);
    if (blocked) return await retraceAlert(`서버 스코프를 삭제할 수 없습니다.\n${blocked}`);
    const recipeKey = scopeManagerRecipeKey(namespace, scopeId);
    const existingPlan = Runtime.serverScopePlans?.get(recipeKey);
    if (!existingPlan) {
      const message = scope.classification === 'orphan_candidate'
        ? `원본 RisuAI 채팅을 찾을 수 없는 고아 메모리 후보입니다.\n\n${MEMORY_SUITE_NAMESPACE_LABELS[namespace] || namespace} owner가 서버 자료를 pluginStorage/로컬 저장소에 복원·검증하고 플러그인 단독 모드로 전환합니다. 그 뒤 서버는 참조 관계를 다시 검사하고 삭제 직전 namespace DB 백업을 만듭니다. 아직 실제 삭제는 하지 않습니다. 검증을 시작할까요?`
        : `활성 채팅의 서버 데이터를 삭제하려면 ${MEMORY_SUITE_NAMESPACE_LABELS[namespace] || namespace} owner가 해당 데이터를 pluginStorage/로컬 저장소에 복원하고 검증한 뒤 플러그인 단독 모드로 전환해야 합니다.\n\n검증을 시작할까요?`;
      if (!(await retraceConfirm(message, { title: '서버 스코프 삭제 검증', confirmLabel: '검증 시작', danger: true }))) return;
      setBusy(true);
      try {
        const plan = await scopeManagerCreatePlan(scope);
        await retraceAlert(`삭제 전 검증을 완료했습니다.\n백업 ID: ${plan.backupId || '(unknown)'}\n\n실제 삭제하려면 같은 버튼을 다시 누르세요.`);
      } catch (error) {
        await retraceAlert(`서버 스코프 삭제 검증 실패\n${error?.message || error}`);
      } finally { setBusy(false); }
      return;
    }
    if (!(await retraceConfirm(
      `검증과 서버 백업이 완료된 스코프를 실제 삭제합니다.\n\n${scope.displayName || scope.scopeId}\n레코드 ${scope.liveRecords || 0}개 · ${scopeManagerFormatBytes(scope.bytes || 0)}\n\n삭제 후에는 자동으로 되살리지 않습니다. 계속할까요?`,
      { title: '서버 스코프 영구 삭제', confirmLabel: '삭제 실행', danger: true }
    ))) return;
    setBusy(true);
    try {
      const receipt = await scopeManagerExecutePlan(scope);
      await retraceAlert(`서버 스코프를 삭제했습니다.\n백업 ID: ${receipt.backupId || '(unknown)'}\n삭제 mutation: ${receipt.counts?.total || 0}개`);
      await refreshServerScopeManagement();
    } catch (error) {
      Runtime.serverScopePlans?.delete(recipeKey);
      await retraceAlert(`서버 스코프 삭제 실패\n${error?.message || error}\n\n데이터가 바뀌었을 수 있으므로 새로고침 후 다시 검증하세요.`);
      await refreshServerScopeManagement().catch(() => {});
    } finally { setBusy(false); }
  };


  const renderShell = () => {
    const root = Runtime.root;
    if (!root) return;
    const settings = Runtime.settings || normalizeSettings({});
    const providerOptions = selected => PROVIDER_KEYS
      .map(provider => `<option value="${provider}" ${selected === provider ? 'selected' : ''}>${escapeHtml(providerLabel(provider))} · ${provider}</option>`).join('');
    const selectOptions = (selected, choices) => choices
      .map(([value, label]) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('');
    const providerBlock = (name, title) => {
      const profile = settings[name];
      const issues = providerConfigurationIssues(profile);
      const reasoningDefinition = reasoningPresetDefinition(profile.reasoningPreset);
      const reasoningControls = new Set(reasoningDefinition.controls || []);
      const effortSupport = profile.reasoningPreset === 'claude'
        ? new Set(['none', 'low', 'medium', 'high', 'xhigh', 'max'])
        : profile.reasoningPreset === 'gemini'
          ? new Set(['none', 'minimal', 'low', 'medium', 'high'])
          : profile.reasoningPreset === 'ollama'
            ? new Set(['none', 'low', 'medium', 'high', 'max'])
            : null;
      const effortOptions = [
        ['none', 'Provider default / omit'], ['minimal', 'Minimal'], ['low', 'Low'], ['medium', 'Medium'],
        ['high', 'High'], ['xhigh', 'XHigh'], ['max', 'Max']
      ].map(([value, label]) => `<option value="${value}" ${profile.reasoningEffort === value ? 'selected' : ''} ${effortSupport && !effortSupport.has(value) ? 'disabled' : ''}>${label}</option>`).join('');
      const modelMeta = providerModelMetadata(profile.provider, profile.url);
      const cachedModelEntry = cachedProviderModelEntry(profile);
      const cachedModels = Array.isArray(cachedModelEntry?.models) ? cachedModelEntry.models : [];
      const cachedModelOptions = cachedModels.map(item => `<option value="${escapeHtml(item.id)}" ${profile.model === item.id ? 'selected' : ''}>${escapeHtml(item.label === item.id ? item.id : `${item.label} · ${item.id}`)}</option>`).join('');
      const modelCatalogHint = modelMeta?.nativeOllama
        ? 'Ollama의 /api/tags에서 현재 호스트에 실제 설치된 모델을 읽습니다. 수동 모델 입력도 그대로 사용할 수 있습니다.'
        : modelMeta?.modelsUrl
          ? `${modelMeta.label} 모델 카탈로그를 조회합니다. 수동 모델 입력도 그대로 사용할 수 있습니다.`
          : '자동 모델 목록 조회가 등록되지 않은 프로바이더는 Model 칸에 ID를 직접 입력하세요.';
      return `<section class="settings-feature-group">
        <div class="settings-feature-group-head"><h4>${title}</h4><p>HAYAKU 콜드스타트 분석에 사용하는 단일 프로필</p></div>
        <div class="settings-feature-grid">
          <label class="fld"><span>Provider</span><select data-provider-field="${name}.provider">${providerOptions(profile.provider)}</select></label>
          <label class="fld"><span>Model</span><input data-provider-field="${name}.model" value="${escapeHtml(profile.model)}" /></label>
          <label class="fld field-wide"><span>Endpoint URL</span><input data-provider-field="${name}.url" value="${escapeHtml(profile.url)}" /></label>
          <label class="fld"><span>API Key / Vertex credentials</span><input type="password" data-provider-field="${name}.key" value="${escapeHtml(profile.key)}" autocomplete="off" /></label>
          <div class="provider-model-catalog field-wide" data-provider-model-catalog="${name}">
            <div class="provider-model-catalog-head"><span>Provider model list</span><em data-provider-model-status="${name}">${cachedModelEntry ? `${formatNumber(cachedModels.length)}개 로드됨` : (modelMeta ? '목록 미조회' : '자동 조회 미지원')}</em></div>
            <div class="provider-model-actions"><button type="button" class="btn load-provider-models" data-load-models-profile="${name}" ${modelMeta ? '' : 'disabled'}>모델 목록 불러오기</button></div>
            <select data-provider-model-select="${name}" ${cachedModels.length ? '' : 'hidden'}><option value="">불러온 모델에서 선택</option>${cachedModelOptions}</select>
            <small data-provider-model-hint="${name}">${escapeHtml(modelCatalogHint)}</small>
          </div>
          <label class="fld"><span>Timeout (ms)</span><input type="number" min="5000" max="300000" data-provider-field="${name}.timeoutMs" value="${profile.timeoutMs}" /></label>
          <label class="fld"><span>Max output tokens</span><input type="number" min="64" max="200000" data-provider-field="${name}.maxTokens" value="${profile.maxTokens}" /></label>
          <label class="fld"><span>Temperature</span><input type="number" min="0" max="2" step="0.05" data-provider-field="${name}.temperature" value="${profile.temperature}" /></label>
          <label class="fld"><span>Request format</span><select data-provider-field="${name}.requestFormat">${selectOptions(profile.requestFormat, supportsResponses(profile.provider) ? [['chat_completions', 'Chat Completions'], ['responses', 'Responses API']] : [['chat_completions', 'Chat Completions']])}</select></label>
          <label class="fld"><span>Streaming</span><select data-provider-field="${name}.stream">${selectOptions(String(profile.stream), [['false', '끄기'], ['true', '켜기']])}</select></label>
          <label class="fld"><span>OpenAI Service tier</span><select data-provider-field="${name}.serviceTier">${selectOptions(profile.serviceTier, [['off', '사용 안 함'], ['auto', 'auto'], ['default', 'default'], ['flex', 'flex'], ['priority', 'priority'], ['scale', 'scale']])}</select><small>OpenAI 및 명시적으로 허용한 Custom에만 전송됩니다.</small></label>
          <label class="fld"><span>Vertex Flex mode</span><select data-provider-field="${name}.vertexFlexMode">${selectOptions(profile.vertexFlexMode, [['off', '사용 안 함'], ['provisioned_then_flex', 'Provisioned → Flex'], ['flex_only', 'Flex only']])}</select><small>Vertex 호출에서 전용 X-Vertex-AI 헤더로 전송됩니다.</small></label>
          <details class="provider-advanced field-wide" data-provider-section="reasoning">
            <summary>추론 요청 설정</summary>
            <div class="settings-feature-grid advanced-grid">
              <label class="fld field-wide"><span>Reasoning Request Preset · 수동 선택</span><select data-provider-field="${name}.reasoningPreset">${selectOptions(profile.reasoningPreset, REASONING_PRESET_KEYS.map(key => [key, REASONING_PRESETS[key].label]))}</select></label>
              <div class="reasoning-hint field-wide" data-reasoning-preset-hint="${name}">${escapeHtml(reasoningDefinition.hint)}</div>
              <label class="fld" data-reasoning-control="effort" ${reasoningControls.has('effort') ? '' : 'hidden'}><span>Reasoning Effort / Thinking Level</span><select data-provider-field="${name}.reasoningEffort">${effortOptions}</select></label>
              <label class="fld" data-reasoning-control="budget" ${reasoningControls.has('budget') ? '' : 'hidden'}><span>Reasoning Budget Tokens</span><input type="number" min="-1" max="200000" data-provider-field="${name}.reasoningBudgetTokens" value="${profile.reasoningBudgetTokens}" /><small>Gemini 2.5에서 -1은 dynamic입니다. Claude manual budget은 최소 1024입니다.</small></label>
              <label class="fld" data-reasoning-control="thinking" ${reasoningControls.has('thinking') ? '' : 'hidden'}><span>Thinking</span><select data-provider-field="${name}.thinkingType">${selectOptions(profile.thinkingType, [['enabled', 'Enabled'], ['disabled', 'Disabled']])}</select></label>
            </div>
          </details>
          <details class="provider-advanced field-wide" data-provider-section="custom-passthrough">
            <summary>Custom Provider 전달 옵션</summary>
            <div class="settings-feature-grid advanced-grid">
              <div class="advanced-note field-wide"><strong>Custom Provider 전용</strong><span>선택한 Service tier 값을 Custom API에도 보낼 때만 켜세요. 지원하지 않는 서버에서는 요청 오류가 발생할 수 있습니다.</span></div>
              <label class="fld field-wide"><span>Custom service_tier passthrough</span><select data-provider-field="${name}.customServiceTierPassthrough">${selectOptions(String(profile.customServiceTierPassthrough), [['false', '끄기'], ['true', '켜기']])}</select></label>
            </div>
          </details>
          <details class="provider-advanced provider-danger-zone field-wide" data-provider-section="extra-json">
            <summary>고급 요청 JSON</summary>
            <div class="settings-feature-grid advanced-grid">
              <div class="advanced-note advanced-note-warning field-wide"><strong>고급 사용자용</strong><span>Provider가 요구하는 추가 파라미터만 입력하세요. 핵심 요청 필드를 덮어쓰면 호출이 실패할 수 있습니다.</span></div>
              <label class="fld field-wide"><span>Extra HTTP headers JSON</span><textarea data-provider-field="${name}.extraHeadersJson" placeholder='{"HTTP-Referer":"..."}'>${escapeHtml(profile.extraHeadersJson)}</textarea></label>
              <label class="fld field-wide"><span>Extra request body JSON</span><textarea data-provider-field="${name}.extraBodyJson" placeholder='{"top_p":0.9}'>${escapeHtml(profile.extraBodyJson)}</textarea></label>
            </div>
          </details>
          <div class="settings-callout field-wide">${issues.length ? `설정 확인 필요: ${escapeHtml(issues.join(', '))}` : `${escapeHtml(providerLabel(profile.provider))} 호출 준비됨`}</div>
          <div class="profile-actions"><button class="btn test-provider" data-test-profile="${name}">${title} 연결 테스트</button></div>
        </div>
      </section>`;
    };
    root.innerHTML = `<style>
      :root{--lra-surface:var(--risu-theme-bgcolor,#fff);--lra-surface-2:color-mix(in srgb,var(--risu-theme-darkbg,#f4f6fb) 72%,var(--lra-surface));--lra-surface-3:color-mix(in srgb,var(--risu-theme-selected,#eef2f8) 72%,var(--lra-surface));--lra-text:var(--risu-theme-textcolor,#172033);--lra-text-2:var(--risu-theme-textcolor2,#59667a);--lra-text-3:color-mix(in srgb,var(--lra-text-2) 72%,transparent);--lra-line:color-mix(in srgb,var(--risu-theme-borderc,#dfe5ef) 78%,transparent);--lra-primary:var(--risu-theme-primary-600,#5267e8);--lra-primary-soft:color-mix(in srgb,var(--lra-primary) 12%,var(--lra-surface));--lra-green:var(--risu-theme-success-500,#1b9a6c);--lra-green-soft:color-mix(in srgb,var(--lra-green) 12%,var(--lra-surface));--lra-red:var(--risu-theme-danger-500,#ca4b55);--lra-shadow:0 18px 55px rgba(12,20,38,.18);--lra-shadow-sm:0 3px 12px rgba(12,20,38,.055)}
      *{box-sizing:border-box}body{margin:0}.bridge{width:min(1320px,100%);height:min(94dvh,940px);max-height:calc(100dvh - 28px);display:grid;grid-template-columns:226px minmax(0,1fr);grid-template-rows:72px minmax(0,1fr);overflow:hidden;border:1px solid var(--lra-line);border-radius:24px;background:var(--lra-surface);color:var(--lra-text);box-shadow:var(--lra-shadow);font:12px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
      .top{grid-column:1/3;display:flex;align-items:center;gap:12px;padding:0 20px;border-bottom:1px solid var(--lra-line);background:color-mix(in srgb,var(--lra-surface) 94%,transparent)}.mark{width:38px;height:38px;display:grid;place-items:center;border-radius:13px;color:#fff;background:linear-gradient(145deg,var(--lra-primary),#8869e9);box-shadow:0 7px 20px color-mix(in srgb,var(--lra-primary) 28%,transparent)}.mark svg{width:25px;height:25px;display:block}.brand{display:grid;gap:1px}.brand strong{font-size:16px}.brand span{color:var(--lra-text-3);font-size:11px}.top-actions{margin-left:auto;display:flex;align-items:center;gap:8px}.global-status{display:flex;align-items:center;gap:7px;color:var(--lra-text-2)}.status-dot{width:8px;height:8px;border-radius:50%;background:var(--lra-green)}
      .side{padding:14px 10px;border-right:1px solid var(--lra-line);background:var(--lra-surface-2);display:flex;flex-direction:column;gap:6px}.nav-group-label{padding:8px 10px 2px;color:var(--lra-text-3);font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.nav{display:flex;align-items:center;gap:9px;min-height:38px;padding:7px 10px;border:0;border-radius:11px;background:transparent;color:var(--lra-text-2);font:650 12px inherit;text-align:left;cursor:pointer}.nav:hover{background:var(--lra-surface);color:var(--lra-text)}.nav.active{background:var(--lra-surface);color:var(--lra-primary);box-shadow:var(--lra-shadow-sm)}.nav .ic{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;background:var(--lra-primary-soft);color:var(--lra-primary)}.scope-card{margin-top:auto;padding:11px;border:1px solid var(--lra-line);border-radius:13px;background:var(--lra-surface)}.scope-card b{display:block}.scope-card span{display:block;margin-top:3px;color:var(--lra-text-3);font-size:9px}.version{margin-top:6px;color:var(--lra-text-3);font-size:9px;text-align:center}
      .main{min-width:0;min-height:0;overflow:hidden}.panel{display:none;width:100%;height:100%;max-width:1120px;margin:0 auto;padding:20px 24px 80px;overflow-y:auto}.panel.active{display:flex;flex-direction:column;gap:13px}.panel-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:3px}.panel-heading h2{margin:0;font-size:20px}.panel-heading p{margin:4px 0 0;color:var(--lra-text-3);font-size:12px}
      .card,.settings-feature-group{padding:15px;border:1px solid var(--lra-line);border-radius:17px;background:var(--lra-surface);box-shadow:var(--lra-shadow-sm)}.heading{display:flex;justify-content:space-between;gap:16px}.heading>div{display:grid;gap:4px}.heading strong{font-size:17px}.heading span,.muted{color:var(--lra-text-3)}.badge{padding:3px 8px;border-radius:999px;background:var(--lra-green-soft);color:var(--lra-green);font-size:10px;font-weight:800;height:max-content}
      .flow{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:16px 0}.session-handoff-flow{grid-template-columns:repeat(3,minmax(0,1fr))}.flow div{padding:13px;border:1px solid var(--lra-line);border-radius:14px;background:var(--lra-surface-2);display:flex;flex-direction:column;gap:4px}.flow b{color:var(--lra-primary)}.flow small{color:var(--lra-text-3)}.status{padding:11px 12px;border:1px solid color-mix(in srgb,var(--lra-primary) 28%,var(--lra-line));background:var(--lra-primary-soft);color:var(--lra-primary);border-radius:10px;white-space:pre-line;font-weight:700}.note{margin:12px 0;color:var(--lra-text-2)}.actions,.profile-actions{display:flex;justify-content:flex-end;gap:7px}.btn{min-height:31px;padding:4px 10px;border:1px solid var(--lra-line);border-radius:10px;background:var(--lra-surface);color:var(--lra-text);font:650 12px inherit;cursor:pointer}.btn:hover{background:var(--lra-surface-2)}.primary{background:var(--lra-primary);border-color:var(--lra-primary);color:#fff}.primary:hover{filter:brightness(.97)}.btn:disabled{opacity:.5;cursor:not-allowed}
      .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.metrics div{padding:13px;border:1px solid var(--lra-line);border-radius:14px;background:var(--lra-surface);box-shadow:var(--lra-shadow-sm);display:flex;flex-direction:column;gap:3px}.metrics span{color:var(--lra-text-3)}.metrics strong{font-size:15px}.ledger-key{display:flex;align-items:center;gap:8px;color:var(--lra-text-2)}.ledger-key span{padding:3px 7px;border-radius:999px;background:var(--lra-primary-soft);color:var(--lra-primary);font-weight:800;font-size:9px}.ledger-key code{min-width:0;overflow:hidden;text-overflow:ellipsis}.ledger-key small{margin-left:auto;color:var(--lra-text-3);white-space:nowrap}.record-list{display:grid;gap:9px}.record{padding:13px;border:1px solid var(--lra-line);border-radius:14px;background:var(--lra-surface);box-shadow:var(--lra-shadow-sm)}.record-head{display:flex;justify-content:space-between;gap:12px}.record-head>div{display:flex;flex-direction:column}.record-head span,.meta{color:var(--lra-text-3);font-size:10px}.record-head em{font-style:normal;color:var(--lra-green);font-size:9px}.record p{color:var(--lra-text-2);white-space:pre-wrap}.meta{display:flex;gap:10px;flex-wrap:wrap}.record details{margin-top:8px}.record summary{cursor:pointer;color:var(--lra-text-2)}.record pre{max-height:340px;overflow:auto;padding:10px;border:1px solid var(--lra-line);border-radius:9px;background:var(--lra-surface-2);color:var(--lra-text-2);white-space:pre-wrap;word-break:break-word}.memory-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.memory-tags span{padding:2px 6px;border-radius:999px;background:var(--lra-primary-soft);color:var(--lra-primary);font-size:9px}.packet-sections{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.packet-section{min-width:0;padding:9px 10px;border:1px solid var(--lra-line);border-radius:10px;background:var(--lra-surface-2)}.packet-section b{display:block;margin-bottom:4px;color:var(--lra-text);font-size:10px}.packet-section span{display:block;margin-top:2px;color:var(--lra-text-2);font-size:10px;white-space:pre-wrap;overflow-wrap:anywhere}.viewer-warning{border-color:color-mix(in srgb,var(--lra-red) 28%,var(--lra-line));background:color-mix(in srgb,var(--lra-red) 7%,var(--lra-surface));color:var(--lra-red)}
      .record-actions{display:flex;justify-content:flex-end;gap:6px;margin-top:8px}.record-action{min-height:27px;padding:3px 9px;border:1px solid var(--lra-line);border-radius:8px;background:var(--lra-surface-2);color:var(--lra-text-2);font:700 10px inherit;cursor:pointer}.record-action:hover{border-color:var(--lra-primary);color:var(--lra-primary)}.record-action.danger:hover{border-color:var(--lra-red);color:var(--lra-red)}.record-action:disabled{opacity:.42;cursor:not-allowed}.record-action:disabled:hover{border-color:var(--lra-line);color:var(--lra-text-2)}
      .turn-jump{align-self:flex-start;display:flex;align-items:center;gap:9px;padding:8px 9px;border:1px solid var(--lra-line);border-radius:11px;background:var(--lra-surface);box-shadow:var(--lra-shadow-sm)}.turn-jump>strong{font-size:11px}.turn-jump>span{color:var(--lra-text-3);font-size:9px}.turn-jump>div{display:flex;align-items:center;gap:6px}.turn-jump input{width:92px;min-height:31px;padding:4px 8px;border:1px solid var(--lra-line);border-radius:9px;background:var(--lra-surface-2);color:var(--lra-text);font:650 11px inherit}.turn-jump input:focus{outline:0;border-color:var(--lra-primary);box-shadow:inset 0 0 0 1px var(--lra-primary)}
      .settings-feature-group{margin-bottom:11px}.settings-feature-group-head{display:grid;gap:3px;margin-bottom:12px}.settings-feature-group-head h4{margin:0;font-size:15px}.settings-feature-group-head p{margin:0;color:var(--lra-text-3)}.settings-feature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 14px}.fld{display:grid;gap:5px}.fld[hidden]{display:none!important}.fld span{font-weight:650}.fld small{color:var(--lra-text-3)}.fld input,.fld select,.fld textarea,.provider-model-catalog select{width:100%;min-height:34px;padding:6px 9px;border:1px solid var(--lra-line);border-radius:10px;background:var(--lra-surface);color:var(--lra-text);font:12px inherit}.fld textarea{min-height:76px;resize:vertical;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.fld input:focus,.fld select:focus,.fld textarea:focus,.provider-model-catalog select:focus{outline:0;border-color:var(--lra-primary);box-shadow:inset 0 0 0 1px var(--lra-primary)}.field-wide,.profile-actions{grid-column:1/-1}.settings-callout{padding:10px 11px;border:1px solid color-mix(in srgb,var(--lra-primary) 18%,var(--lra-line));border-radius:10px;background:var(--lra-primary-soft);color:var(--lra-text-2)}.provider-model-catalog{display:grid;gap:8px;padding:10px 11px;border:1px solid var(--lra-line);border-radius:12px;background:var(--lra-surface-2)}.provider-model-catalog-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.provider-model-catalog-head>span{font-weight:750}.provider-model-catalog-head>em{font-style:normal;padding:2px 7px;border-radius:999px;background:var(--lra-primary-soft);color:var(--lra-primary);font-size:9px;font-weight:800}.provider-model-actions{display:flex;align-items:center;gap:7px}.provider-model-catalog small{color:var(--lra-text-3)}.provider-model-catalog select[hidden]{display:none!important}.provider-advanced{padding:10px 11px;border:1px solid var(--lra-line);border-radius:12px;background:var(--lra-surface-2)}.provider-advanced summary{cursor:pointer;font-weight:750;color:var(--lra-text-2)}.provider-danger-zone{border-color:color-mix(in srgb,var(--lra-red) 22%,var(--lra-line))}.advanced-grid{margin-top:12px}.reasoning-hint{padding:9px 10px;border:1px solid var(--lra-line);border-radius:9px;background:var(--lra-surface);color:var(--lra-text-3)}.advanced-note{display:grid;gap:2px;padding:9px 10px;border:1px solid var(--lra-line);border-radius:9px;background:var(--lra-surface);color:var(--lra-text-3)}.advanced-note strong{color:var(--lra-text);font-size:11px}.advanced-note-warning{border-color:color-mix(in srgb,var(--lra-red) 24%,var(--lra-line));background:color-mix(in srgb,var(--lra-red) 5%,var(--lra-surface))}
      .analysis-console{display:grid;gap:11px}.analysis-console-head{display:flex;align-items:center;gap:10px}.analysis-console-head strong{font-size:14px}.analysis-console-head span{margin-left:auto;padding:3px 8px;border-radius:999px;background:var(--lra-primary-soft);color:var(--lra-primary);font-size:10px;font-weight:800}.analysis-progress-track{height:9px;overflow:hidden;border-radius:999px;background:var(--lra-surface-2);border:1px solid var(--lra-line)}.analysis-progress-bar{height:100%;width:0;background:linear-gradient(90deg,var(--lra-primary),#8869e9);transition:width .25s ease}.analysis-progress-summary{display:flex;justify-content:space-between;gap:12px;color:var(--lra-text-2);font-size:11px}.analysis-console-metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px}.analysis-console-metrics div{padding:8px;border:1px solid var(--lra-line);border-radius:10px;background:var(--lra-surface-2);display:grid;gap:2px}.analysis-console-metrics span{color:var(--lra-text-3);font-size:9px}.analysis-console-metrics b{font-size:12px}.analysis-current{padding:9px 10px;border-radius:10px;background:var(--lra-primary-soft);color:var(--lra-primary);font-weight:700;white-space:pre-line}.analysis-log{max-height:190px;overflow:auto;margin:0;padding:9px 11px;border:1px solid var(--lra-line);border-radius:10px;background:#111622;color:#d8e0f0;font:10px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;word-break:break-word}.analysis-log .log-time{color:#8492aa}.analysis-log .log-error{color:#ff9ca4}.analysis-console-card[data-state="failed"]{border-color:color-mix(in srgb,var(--lra-red) 35%,var(--lra-line))}.analysis-console-card[data-state="completed"]{border-color:color-mix(in srgb,var(--lra-green) 35%,var(--lra-line))}
      .empty{min-height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:var(--lra-text-3);border:1px dashed var(--lra-line);border-radius:14px}.empty strong{color:var(--lra-text)}.busy .status-dot{background:var(--lra-primary)}
      .compatibility-panel{border:1px solid var(--lra-line);border-radius:16px;padding:14px;background:var(--lra-surface);display:flex;flex-direction:column;gap:12px;margin-bottom:14px}
      .compatibility-panel.compat-ok{border-color:color-mix(in srgb,var(--lra-green) 42%,var(--lra-line));background:color-mix(in srgb,var(--lra-green) 5%,var(--lra-surface))}
      .compatibility-panel.compat-warn{border-color:color-mix(in srgb,#d8a52f 48%,var(--lra-line));background:color-mix(in srgb,#d8a52f 6%,var(--lra-surface))}
      .compatibility-panel.compat-bad{border-color:color-mix(in srgb,#d75050 48%,var(--lra-line));background:color-mix(in srgb,#d75050 6%,var(--lra-surface))}
      .compatibility-panel.acknowledged{opacity:.82}
      .compatibility-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.compatibility-head>div{display:flex;flex-direction:column;gap:4px}.compatibility-head strong{font-size:15px}.compatibility-head span{font-size:12px;color:var(--lra-text-2);line-height:1.55}.compatibility-head em{font-style:normal;font-size:11px;font-weight:800;white-space:nowrap;padding:5px 8px;border-radius:999px;background:var(--lra-surface-3)}
      .compat-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.compat-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;padding:9px 10px;border:1px solid var(--lra-line);border-radius:11px;background:var(--lra-surface-2)}.compat-row small{grid-column:1/-1;color:var(--lra-text-2);line-height:1.4}.compat-row.bad{border-color:color-mix(in srgb,#d75050 46%,var(--lra-line))}.compat-row.muted{opacity:.68}.compat-name{display:flex;align-items:center;gap:6px;min-width:0}.compat-name>span{font-size:11px;color:var(--lra-text-2)}.compat-state{font-size:11px;font-weight:800}.compat-row.ok .compat-state{color:var(--lra-green)}.compat-row.bad .compat-state{color:#b83d3d}.compat-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
      .retrace-dialog-layer[hidden]{display:none!important}.retrace-dialog-layer{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(5,8,14,.72);backdrop-filter:blur(5px)}.retrace-dialog{width:min(560px,calc(100vw - 32px));max-height:min(78vh,680px);overflow:auto;border:1px solid var(--lra-line);border-radius:18px;background:var(--lra-surface);box-shadow:0 24px 80px rgba(0,0,0,.45);padding:20px}.retrace-dialog h3{margin:0 0 12px;font-size:17px;color:var(--lra-text)}.retrace-dialog-message{white-space:pre-wrap;word-break:break-word;color:var(--lra-text-2);font-size:13px;line-height:1.65}.retrace-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.retrace-dialog .btn.danger{border-color:rgba(239,68,68,.6);background:rgba(127,29,29,.45);color:#fecaca}.retrace-dialog .btn.danger:hover{background:rgba(153,27,27,.58)}
      @media(max-width:820px){.session-handoff-flow{grid-template-columns:1fr 1fr}.bridge{grid-template-columns:78px minmax(0,1fr)}.side{padding:10px 7px}.nav-group-label,.nav>span:not(.ic),.scope-card,.version{display:none}.nav{justify-content:center;padding:6px}.panel{padding:18px 14px 70px}.flow,.metrics{grid-template-columns:1fr 1fr}}
      @media(max-width:560px){.session-handoff-flow{grid-template-columns:1fr}.bridge{height:100dvh;max-height:100dvh;border-radius:0;grid-template-columns:64px minmax(0,1fr);grid-template-rows:62px minmax(0,1fr)}.top{padding:0 10px}.brand span,.global-status{display:none}.flow,.metrics,.settings-feature-grid,.packet-sections,.analysis-console-metrics{grid-template-columns:1fr}.ledger-key small{display:none}.field-wide,.profile-actions{grid-column:1}}
      .server-scope-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.server-scope-filters{display:flex;gap:6px;flex-wrap:wrap}.server-scope-filters .btn.active{border-color:var(--lra-primary);background:var(--lra-primary-soft);color:var(--lra-primary)}.server-scope-list{display:grid;gap:10px}.server-scope-card{padding:14px;border:1px solid var(--lra-line);border-radius:15px;background:var(--lra-surface);box-shadow:var(--lra-shadow-sm)}.server-scope-card.orphan{border-color:color-mix(in srgb,var(--lra-red) 38%,var(--lra-line))}.server-scope-card.ancestor{border-color:color-mix(in srgb,var(--lra-primary) 38%,var(--lra-line))}.server-scope-card.pinned{border-color:color-mix(in srgb,var(--lra-green) 45%,var(--lra-line))}.server-scope-head{display:flex;justify-content:space-between;gap:12px}.server-scope-head>div{min-width:0;display:grid;gap:2px}.server-scope-head strong{font-size:14px;overflow-wrap:anywhere}.server-scope-head small{color:var(--lra-text-3);overflow-wrap:anywhere}.server-scope-namespace{width:max-content;padding:2px 6px;border-radius:999px;background:var(--lra-surface-2);color:var(--lra-text-2);font-size:9px;font-weight:800}.server-scope-badge{height:max-content;padding:3px 8px;border-radius:999px;font-style:normal;font-size:9px;font-weight:800}.server-scope-badge.active{background:var(--lra-green-soft);color:var(--lra-green)}.server-scope-badge.ancestor{background:var(--lra-primary-soft);color:var(--lra-primary)}.server-scope-badge.orphan{background:color-mix(in srgb,var(--lra-red) 12%,var(--lra-surface));color:var(--lra-red)}.server-scope-badge.unverified{background:var(--lra-surface-2);color:var(--lra-text-2)}.server-scope-badge.pinned{background:var(--lra-green-soft);color:var(--lra-green)}.server-scope-card>p{margin:9px 0;color:var(--lra-text-2)}.server-scope-meta{display:flex;gap:8px;flex-wrap:wrap;color:var(--lra-text-3);font-size:10px}.server-scope-meta span{padding:2px 6px;border-radius:999px;background:var(--lra-surface-2)}.server-scope-references{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.server-scope-references b{width:100%;font-size:10px}.server-scope-references span{padding:2px 6px;border-radius:7px;background:var(--lra-primary-soft);color:var(--lra-primary);font-size:9px}.server-scope-blocked,.server-scope-safe{margin:10px 0;padding:8px 10px;border-radius:9px;font-size:10px}.server-scope-blocked{background:var(--lra-surface-2);color:var(--lra-text-2)}.server-scope-safe{background:color-mix(in srgb,var(--lra-red) 7%,var(--lra-surface));color:var(--lra-red)}.btn.danger{border-color:color-mix(in srgb,var(--lra-red) 45%,var(--lra-line));color:var(--lra-red)}.btn.danger:hover{background:color-mix(in srgb,var(--lra-red) 8%,var(--lra-surface))}

      .server-data-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 14px;border:1px solid var(--lra-line);border-radius:14px;background:var(--lra-surface);box-shadow:var(--lra-shadow-sm)}.server-data-summary>div{display:grid;gap:3px}.server-data-summary span,.server-data-summary em{color:var(--lra-text-3);font-style:normal;font-size:10px}.server-data-summary.ok{border-color:color-mix(in srgb,var(--lra-green) 35%,var(--lra-line));background:color-mix(in srgb,var(--lra-green) 5%,var(--lra-surface))}.server-data-summary.warn{border-color:color-mix(in srgb,var(--lra-red) 28%,var(--lra-line));background:color-mix(in srgb,var(--lra-red) 4%,var(--lra-surface))}.server-data-scan-errors{display:grid;gap:5px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--lra-red) 28%,var(--lra-line));border-radius:13px;background:color-mix(in srgb,var(--lra-red) 5%,var(--lra-surface));color:var(--lra-red)}.server-data-scan-errors span{font-size:10px;overflow-wrap:anywhere}.server-scope-group{display:grid;gap:9px}.server-scope-group-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:4px 2px}.server-scope-group-head h3{margin:0;font-size:15px}.server-scope-group-head p{margin:2px 0 0;color:var(--lra-text-3);font-size:10px}.server-scope-group-head em{padding:3px 8px;border-radius:999px;background:var(--lra-surface-2);color:var(--lra-text-2);font-style:normal;font-weight:800}.server-scope-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:start}.server-scope-card.active{border-color:color-mix(in srgb,var(--lra-green) 34%,var(--lra-line))}.server-scope-card.referenced-ancestor{border-color:color-mix(in srgb,var(--lra-primary) 42%,var(--lra-line))}.server-scope-card.orphan-candidate{border-color:color-mix(in srgb,var(--lra-red) 38%,var(--lra-line))}.server-scope-card.unverified{border-style:dashed}.server-scope-main{min-width:0;display:grid;gap:10px}.server-scope-title{display:flex;align-items:flex-start;gap:9px;min-width:0}.server-scope-title>div{min-width:0;display:grid;gap:2px}.server-scope-title strong,.server-scope-title small{overflow-wrap:anywhere}.server-scope-title small{color:var(--lra-text-3);font-size:9px}.server-plugin-badge{flex:0 0 auto;padding:3px 7px;border-radius:999px;background:var(--lra-primary-soft);color:var(--lra-primary);font-size:9px;font-weight:850}.server-plugin-badge.hayaku{background:color-mix(in srgb,#e29a2b 13%,var(--lra-surface));color:#a96706}.server-plugin-badge.libra{background:color-mix(in srgb,#815bd9 13%,var(--lra-surface));color:#6840bf}.server-plugin-badge.flashback{background:color-mix(in srgb,#3d79d8 13%,var(--lra-surface));color:#2b62b7}.server-plugin-badge.lia{background:color-mix(in srgb,#24977d 13%,var(--lra-surface));color:#18755f}.server-plugin-badge.retrace{background:color-mix(in srgb,#4f5b6d 13%,var(--lra-surface));color:#354052}.server-scope-stats{display:flex;gap:7px;flex-wrap:wrap}.server-scope-stats span{padding:3px 7px;border-radius:8px;background:var(--lra-surface-2);color:var(--lra-text-3);font-size:9px}.server-scope-stats b{color:var(--lra-text)}.server-scope-refs{display:flex;gap:6px;flex-wrap:wrap}.server-scope-refs strong{width:100%;font-size:10px}.server-scope-refs span{padding:3px 7px;border-radius:8px;background:var(--lra-primary-soft);color:var(--lra-primary);font-size:9px}.server-scope-blocked,.server-scope-ready{padding:8px 10px;border-radius:9px;font-size:10px}.server-scope-blocked{background:var(--lra-surface-2);color:var(--lra-text-2)}.server-scope-ready{background:var(--lra-green-soft);color:var(--lra-green);font-weight:750}.server-scope-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.server-scope-actions .btn{white-space:nowrap}@media(max-width:760px){.server-scope-card{grid-template-columns:1fr}.server-scope-actions{justify-content:flex-start}.server-data-summary{align-items:flex-start;flex-direction:column}}
    </style>
    <div class="bridge${Runtime.busy ? ' busy' : ''}">
      <header class="top"><span class="mark" aria-label="Bridge">${bridgeIconSvg}</span><div class="brand"><strong>${PLUGIN_NAME}</strong><span>FLASHBACK · HAYAKU · LIBRA · LIA Compatibility Hub</span></div><div class="top-actions"><div class="global-status"><span class="status-dot"></span><span>준비됨</span></div><button id="exportRetraceDebug" class="btn">디버그 로그 내보내기</button><button id="closeBridge" class="btn">닫기</button></div></header>
      <aside class="side">
        <div class="nav-group-label">Operations</div>
        <button class="nav ${Runtime.activeTab === 'session' ? 'active' : ''}" data-tab="session"><span class="ic">↪</span><span>다음 세션</span></button>
        <button class="nav ${Runtime.activeTab === 'coldstart' ? 'active' : ''}" data-tab="coldstart"><span class="ic">✦</span><span>분석 복구</span></button>
        <div class="nav-group-label">Data</div>
        <button class="nav ${Runtime.activeTab === 'libra' ? 'active' : ''}" data-tab="libra"><span class="ic">L</span><span>LIBRA 뷰어</span></button>
        <button class="nav ${Runtime.activeTab === 'flashback' ? 'active' : ''}" data-tab="flashback"><span class="ic">F</span><span>Flashback 뷰어</span></button>
        <button class="nav ${Runtime.activeTab === 'hayaku' ? 'active' : ''}" data-tab="hayaku"><span class="ic">H</span><span>HAYAKU 뷰어</span></button>
        <button class="nav ${Runtime.activeTab === 'serverdata' ? 'active' : ''}" data-tab="serverdata"><span class="ic">DB</span><span>서버 데이터 관리</span></button>
        <div class="nav-group-label">Settings</div>
        <button class="nav ${Runtime.activeTab === 'serverconnection' ? 'active' : ''}" data-tab="serverconnection"><span class="ic">⇄</span><span>서버 연결</span></button>
        <button class="nav ${Runtime.activeTab === 'provider' ? 'active' : ''}" data-tab="provider"><span class="ic">⚙</span><span>프로바이더</span></button>
        <div class="scope-card"><b>현재 스코프</b><span id="sidebarScope">확인 중</span></div><div class="version">v${PLUGIN_VERSION}</div>
      </aside>
      <main class="main">
        <section class="panel ${Runtime.activeTab === 'session' ? 'active' : ''}" data-panel="session">
          <div class="panel-heading"><div><h2>다음 세션</h2><p>RE:TRACE가 FLASHBACK, HAYAKU, LIBRA, LIA의 호환 계약과 원본 보존을 확인한 뒤 새 세션을 승계합니다.</p></div></div>
          <div id="compatibilityPanel" class="compatibility-panel checking"><div class="compatibility-head"><div><strong>플러그인 호환성</strong><span>공통 승계 계약을 확인하는 중입니다.</span></div><em>CHECKING</em></div></div>
          <div class="card"><div class="heading"><div><strong>대화 이어가기</strong><span>새 채팅 저장 전후로 다섯 owner 플러그인의 비파괴 승계 계약과 영속 반영을 검증합니다.</span></div><em class="badge">원본 보존</em></div>
            <div class="flow session-handoff-flow"><div><b>1 · LIBRA</b><small>정본 메모리를 IPC로 이전 세션 영구 기억에 채택·검증</small></div><div><b>2 · Flashback</b><small>원본은 그대로 보존하고 immutable archive reference만 새 세션에 연결·검증</small></div><div><b>3 · HAYAKU</b><small>이전 원장을 라이브 월드라인과 분리해 즉시 저장·검증</small></div><div><b>4 · LIA</b><small>활성 Live Persona를 새 채팅 전용 Persona로 Fork·재바인딩</small></div><div><b>5 · 새 채팅</b><small>원본은 그대로 두고 새 라이브 계보로 시작</small></div></div>
            <div id="transitionStatus" class="status">전환 대상을 확인하는 중입니다.</div><p class="note">모든 owner는 RE:TRACE 공통 호환 계약을 통과해야 합니다. 승계 과정은 원본 세션의 정본/원장/벡터/바인딩을 삭제·비우기·compact·이동하지 않으며, 새 세션은 immutable archive/reference 또는 안전한 fork를 통해 과거 기억을 실제 조회 가능한 상태로 이어받습니다.</p>
            <div class="actions"><button id="refreshTransition" class="btn">다시 확인</button><button id="createSession" class="btn primary">다음 세션 만들기</button></div>
          </div>
        </section>
        <section class="panel ${Runtime.activeTab === 'coldstart' ? 'active' : ''}" data-panel="coldstart">
          <div class="panel-heading"><div><h2>HAYAKU 분석 복구</h2><p>최초 구축인 콜드스타트와 누락 턴 복구인 증분 재분석을 분리합니다.</p></div></div>
          <div class="card"><div class="heading"><div><strong>옵션형 자동 LLM 복구</strong><span>HAYAKU Recovery Vault에 확정된 packet debt만 자동으로 고품질 recovery_snapshot으로 승격합니다.</span></div><em class="badge">Owner gated</em></div>
            <div class="settings-feature-grid"><label class="fld field-wide"><span>자동 복구</span><select id="hayakuAutoRepairEnabled"><option value="false" ${settings.hayakuAutoRepair ? '' : 'selected'}>끄기</option><option value="true" ${settings.hayakuAutoRepair ? 'selected' : ''}>켜기</option></select><small>활성 HAYAKU owner가 없으면 HAYAKU 관련 검사·LLM 호출·패킷 생성이 모두 중지됩니다. 자동 모드에서는 원문 source-fallback 패킷을 만들지 않습니다.</small></label></div>
            <div id="hayakuAutoRepairStatus" class="status">자동 복구 상태를 확인하는 중입니다.</div>
          </div>
          <div class="card"><div class="heading"><div><strong>콜드스타트 · 최초 1회</strong><span>HAYAKU를 한 번도 사용하지 않은 세션만 최초 원장을 구축합니다.</span></div><em class="badge">First use only</em></div>
            <div class="flow"><div><b>증거 수집</b><small>완료된 U+A 턴과 미결 user 입력을 구분</small></div><div><b>생성 분석</b><small>Primary 프로필 · 최대 3개 동시 처리</small></div><div><b>원장 채택</b><small>다음 HAYAKU 요청 전에 canonical storage로 가져오기</small></div></div>
            <div id="coldStartStatus" class="status">실행 가능 여부를 확인하는 중입니다.</div><p class="note">기존 HAYAKU 기록이 감지되면 실행을 차단합니다. 실패 청크 이어서와 검증된 캡슐 다시 채택만 예외로 허용합니다.</p>
            <div class="actions"><button id="refreshColdStart" class="btn">다시 확인</button><button id="runColdStart" class="btn primary">콜드스타트 실행</button></div>
          </div>
          <div class="card"><div class="heading"><div><strong>증분 재분석 · 누락 복구</strong><span>현재 원장의 커버리지를 검사하고 패킷이 없는 완료 U+A 턴만 분석합니다.</span></div><em class="badge">Recovery only</em></div>
            <div class="flow"><div><b>누락 감지</b><small>활성·콜드스타트·기존 복구 범위와 완료 턴 대조</small></div><div><b>증분 분석</b><small>누락 턴만 Primary 프로필로 처리</small></div><div><b>월드라인 결속</b><small>recovery_snapshot을 원래 턴에 연결</small></div></div>
            <div id="incrementalRecoveryStatus" class="status">원장 커버리지를 확인하는 중입니다.</div><p class="note">이미 커버된 턴과 기존 콜드스타트 epoch는 재분석하거나 교체하지 않습니다.</p>
            <div class="actions"><button id="refreshIncrementalRecovery" class="btn">누락 다시 확인</button><button id="runIncrementalRecovery" class="btn primary">누락 턴 증분 재분석</button></div>
          </div>
          <div id="analysisConsoleCard" class="card analysis-console-card" data-state="idle"><div class="analysis-console">
            <div class="analysis-console-head"><strong>실시간 분석 콘솔</strong><span id="analysisStateBadge">대기</span></div>
            <div class="analysis-progress-track" role="progressbar" aria-label="분석 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="analysisProgressBar" class="analysis-progress-bar"></div></div>
            <div class="analysis-progress-summary"><b id="analysisPhase">실행할 작업이 없습니다.</b><span id="analysisElapsed">00:00</span></div>
            <div class="analysis-console-metrics"><div><span>완료</span><b id="analysisCompleted">0 / 0</b></div><div><span>현재 청크</span><b id="analysisRunning">-</b></div><div><span>호출 시도</span><b id="analysisAttempts">0</b></div><div><span>형식 복구</span><b id="analysisRepairs">0</b></div><div><span>원문 폴백</span><b id="analysisFallbacks">0</b></div><div><span>실패</span><b id="analysisFailures">0</b></div></div>
            <div id="analysisCurrent" class="analysis-current">콜드스타트나 증분 재분석을 시작하면 청크별 상태가 여기에 표시됩니다.</div>
            <div id="analysisLog" class="analysis-log" aria-live="polite">[대기] 실시간 로그가 준비되었습니다.</div>
            <div class="actions"><button id="analysisReturnToRisu" class="btn primary" hidden>RisuAI로 돌아가기 · 백그라운드 계속</button></div>
          </div></div>
        </section>
        <section class="panel ${Runtime.activeTab === 'libra' ? 'active' : ''}" data-panel="libra">
          <div class="panel-heading"><div><h2>LIBRA 정본 기억</h2><p>현재 채팅의 LIBRA pluginStorage 정본과 이전 세션 승계 기억을 공식 IPC로 읽기 전용 표시합니다.</p></div><div class="actions"><button id="exportLibra" class="btn">JSON 내보내기</button><button id="refreshLibra" class="btn primary">새로고침</button></div></div>
          <div id="libraBody"><div class="empty"><strong>LIBRA 조회 대기</strong><span>새로고침을 누르면 LIBRA IPC로 정본 기억을 읽습니다.</span></div></div>
        </section>
        <section class="panel ${Runtime.activeTab === 'flashback' ? 'active' : ''}" data-panel="flashback">
          <div class="panel-heading"><div><h2>Flashback 기억</h2><p>현재 채팅의 manifest와 활성 shard를 읽기 전용으로 표시합니다.</p></div><div class="actions"><button id="exportFlashback" class="btn">JSON 내보내기</button><button id="refreshFlashback" class="btn primary">새로고침</button></div></div>
          <div id="flashbackBody"><div class="empty"><strong>Flashback 조회 대기</strong><span>새로고침을 누르면 pluginStorage를 읽습니다.</span></div></div>
        </section>
        <section class="panel ${Runtime.activeTab === 'hayaku' ? 'active' : ''}" data-panel="hayaku">
          <div class="panel-heading"><div><h2>HAYAKU 원장</h2><p>현재 채팅의 패킷·월드라인·연속성 데이터를 읽기 전용 카드로 표시합니다.</p></div><div class="actions"><button id="backupHayaku" class="btn">미러 원장 백업</button><button id="exportHayaku" class="btn">JSON 내보내기</button><button id="refreshHayaku" class="btn primary">새로고침</button></div></div>
          <div class="turn-jump"><strong>빠른 턴 이동</strong><span id="hayakuTurnMax">최대 턴 확인 중</span><div><input id="hayakuTurnInput" type="number" min="1" step="1" inputmode="numeric" aria-label="이동할 턴 번호" placeholder="턴 번호"><button id="jumpHayakuTurn" type="button" class="btn primary">턴 이동</button></div></div>
          <div id="hayakuBody" style="display:flex;flex-direction:column;gap:10px;min-height:0"><div class="empty"><strong>조회 대기</strong><span>현재 채팅의 HAYAKU 원장을 읽습니다.</span></div></div>
        </section>
        <section class="panel ${Runtime.activeTab === 'serverdata' ? 'active' : ''}" data-panel="serverdata">
          <div class="panel-heading"><div><h2>서버 데이터 관리</h2><p>Memory Suite 서버의 스코프를 현재 RisuAI 채팅 목록과 대조합니다. 채팅이 보이지 않아도 자동 삭제하지 않으며 승계 조상과 확인 불가 데이터는 보호합니다.</p></div><div class="actions"><button id="refreshServerData" class="btn primary">새로고침</button></div></div>
          <div class="settings-callout">상태는 활성 · 승계 조상 · 고아 메모리 후보 · 확인 불가로 구분됩니다. 활성 스코프는 owner 플러그인이 서버 데이터를 pluginStorage/로컬 저장소에 복원하고 플러그인 단독 모드 전환을 증명한 뒤에만 서버에서 삭제됩니다. 고아 후보는 안정적인 채팅 목록 확인, 참조 관계 재검사, 삭제 직전 서버 백업과 두 단계 확인을 모두 통과해야 합니다.</div>
          <div id="serverDataBody"><div class="empty"><strong>서버 스코프 조회 대기</strong><span>새로고침을 누르면 5개 namespace의 서버 데이터와 현재 캐릭터의 채팅 목록을 대조합니다.</span></div></div>
        </section>
        <section class="panel ${Runtime.activeTab === 'serverconnection' ? 'active' : ''}" data-panel="serverconnection"><div id="retraceMemorySuiteServerConnectionPanel"></div></section>
        <section class="panel ${Runtime.activeTab === 'provider' ? 'active' : ''}" data-panel="provider">
          <div class="panel-heading"><div><h2>LLM 프로바이더</h2><p>공통 provider·reasoning 계층을 Primary 단일 프로필로 사용합니다.</p></div></div>
          <div class="settings-callout">콜드스타트와 증분 재분석은 아래 Primary 프로필을 사용합니다. 이전 버전의 Aux 설정만 구성되어 있었다면 최초 로드 시 Primary로 자동 이전됩니다.</div>
          ${providerBlock('primary', 'Primary profile')}
          <div id="providerStatus" class="status">설정을 수정한 뒤 저장하거나 연결 테스트를 실행하세요.</div>
          <div class="actions"><button id="saveProvider" class="btn primary">프로바이더 설정 저장</button></div>
        </section>
      </main>
    </div>
    <div id="retraceDialogLayer" class="retrace-dialog-layer" hidden aria-hidden="true"><div class="retrace-dialog" role="dialog" aria-modal="true" aria-labelledby="retraceDialogTitle"><h3 id="retraceDialogTitle">확인</h3><div id="retraceDialogMessage" class="retrace-dialog-message"></div><div class="retrace-dialog-actions"><button id="retraceDialogCancel" type="button" class="btn">취소</button><button id="retraceDialogConfirm" type="button" class="btn primary">계속</button></div></div></div>`;
    bindUi();
    renderAnalysisConsole();
    if (Runtime.activeTab === 'serverconnection') {
      const host = root.querySelector('#retraceMemorySuiteServerConnectionPanel');
      if (host) void MemorySuiteStorageBridge.mountConnectionPanel(host, {
        title: 'RE:TRACE · 서버 연결',
        description: 'RE:TRACE 복구 자료의 저장 방식과 Memory Suite 서버 연결을 관리합니다. 전체 스코프 조회·삭제는 별도의 서버 데이터 관리 화면에서 수행합니다.'
      }).catch(error => warn('RE:TRACE server connection panel failed', error));
    }
    if (Runtime.activeTab === 'serverdata') renderServerScopeManagement();
  };

  const formatElapsed = milliseconds => {
    const seconds = Math.max(0, Math.floor((Number(milliseconds) || 0) / 1000));
    const minutes = Math.floor(seconds / 60);
    const remain = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`;
  };
  const renderAnalysisConsole = () => {
    const root = Runtime.root;
    const card = root?.querySelector?.('#analysisConsoleCard');
    if (!card) return;
    const progress = analysisProgressSnapshot();
    const running = analysisIsRunning();
    const state = progress?.state || 'idle';
    const stateLabel = {
      idle: '대기', preparing: '준비 중', running: '실행 중', completed: '완료', failed: '실패'
    }[state] || state;
    const total = Math.max(0, Number(progress?.totalChunks || 0) || 0);
    const verified = Math.max(0, Number(progress?.verifiedChunks || 0) || 0);
    const percent = state === 'completed' ? 100 : total ? Math.min(100, Math.round((verified / total) * 100)) : 0;
    card.dataset.state = state;
    const badge = root.querySelector('#analysisStateBadge');
    if (badge) badge.textContent = stateLabel;
    const track = card.querySelector('.analysis-progress-track');
    track?.setAttribute?.('aria-valuenow', String(percent));
    const bar = root.querySelector('#analysisProgressBar');
    if (bar) bar.style.width = `${percent}%`;
    const phase = root.querySelector('#analysisPhase');
    if (phase) phase.textContent = progress?.phase || '실행할 작업이 없습니다.';
    const elapsed = root.querySelector('#analysisElapsed');
    if (elapsed) elapsed.textContent = formatElapsed(progress?.elapsedMs || 0);
    const setText = (selector, value) => {
      const node = root.querySelector(selector);
      if (node) node.textContent = value;
    };
    setText('#analysisCompleted', `${verified} / ${total}`);
    setText('#analysisRunning', progress?.runningChunks?.length ? progress.runningChunks.join(', ') : '-');
    setText('#analysisAttempts', formatNumber(progress?.attemptCount || 0));
    setText('#analysisRepairs', formatNumber(progress?.repairChunkCount || 0));
    setText('#analysisFallbacks', formatNumber(progress?.sourceFallbackChunkCount || 0));
    setText('#analysisFailures', formatNumber(progress?.failedChunks || 0));
    const current = root.querySelector('#analysisCurrent');
    if (current) {
      const additions = Number(progress?.appendedMessageCount || 0) > 0
        ? `\n분석 중 새 메시지 ${progress.appendedMessageCount}개 추가 · 기존 접두부 검증 후 현재 범위만 채택`
        : '';
      current.textContent = progress
        ? `${progress.kind === 'cold_start' ? '콜드스타트' : '증분 재분석'} · ${progress.phase}${progress.runningChunks?.length ? `\n처리 중 청크: ${progress.runningChunks.join(', ')}` : ''}${additions}${progress.error ? `\n오류: ${progress.error}` : ''}`
        : '콜드스타트나 증분 재분석을 시작하면 청크별 상태가 여기에 표시됩니다.';
    }
    const log = root.querySelector('#analysisLog');
    if (log) {
      const rows = Array.isArray(progress?.logs) ? progress.logs.slice(-80) : [];
      log.innerHTML = rows.length
        ? rows.map(entry => {
          const time = new Date(Number(entry.at || 0)).toLocaleTimeString('ko-KR', { hour12: false });
          const errorClass = /fail|error/i.test(text(entry.type)) ? ' log-error' : '';
          return `<div class="${errorClass.trim()}"><span class="log-time">[${escapeHtml(time)}]</span> ${escapeHtml(entry.message)}</div>`;
        }).join('')
        : '[대기] 실시간 로그가 준비되었습니다.';
      log.scrollTop = log.scrollHeight;
    }
    const returnButton = root.querySelector('#analysisReturnToRisu');
    if (returnButton) returnButton.hidden = !running;
    for (const selector of ['#runColdStart', '#runIncrementalRecovery']) {
      const button = root.querySelector(selector);
      if (button && running) button.disabled = true;
    }
  };

  const setBusy = value => {
    Runtime.busy = Boolean(value);
    Runtime.root?.querySelector?.('.bridge')?.classList?.toggle('busy', Runtime.busy);
    Runtime.root?.querySelectorAll?.('button:not(#closeBridge):not(.nav):not(#analysisReturnToRisu):not(#retraceDialogConfirm):not(#retraceDialogCancel)').forEach(button => {
      if (Runtime.busy) {
        if (!button.disabled) button.dataset.bridgeBusyDisabled = 'true';
        button.disabled = true;
      } else if (button.dataset.bridgeBusyDisabled === 'true') {
        delete button.dataset.bridgeBusyDisabled;
        button.disabled = false;
      }
    });
  };

  const refreshTransition = async () => {
    const node = Runtime.root?.querySelector?.('#transitionStatus');
    if (!node) return null;
    node.textContent = '전환 대상을 확인하는 중입니다.';
    try {
      let preview = await inspectTransition();
      const scopeNode = Runtime.root?.querySelector?.('#sidebarScope');
      if (preview.pendingHandoff?.pending) {
        try {
          const reconciled = await reconcilePendingHandoffJournalFromDurableReadback(preview.pendingHandoff);
          if (reconciled?.reconciled === true && reconciled?.pending !== true) {
            preview = await inspectTransition();
          } else if (reconciled?.reconciled === true) {
            preview = { ...preview, pendingHandoff: reconciled };
          }
        } catch (error) {
          warn('pending handoff durable journal reconciliation failed', error);
        }
      }
      if (preview.pendingHandoff?.pending) {
        const failedOwners = Object.entries(preview.pendingHandoff.journal?.ownerStatus || {})
          .filter(([, status]) => status?.required === true && status?.verified !== true)
          .map(([owner]) => owner)
          .join(', ');
        let durableHint = '';
        try {
          const durable = await inspectPendingHandoffDurableStatus(preview.pendingHandoff);
          if (durable?.hayakuRequired && durable?.hayaku?.verified === true) {
            durableHint = `\nHAYAKU 실제 target 원장은 ${formatNumber(durable.hayaku.records)}개 승계가 이미 검증되었습니다. 다음 세션 만들기를 다시 누르면 journal을 완료 처리합니다.`;
          }
        } catch (_) {}
        node.textContent = `미완료 다음 세션 handoff가 있습니다. 같은 target/transfer로 재시도합니다.\n실패 또는 미검증 owner: ${failedOwners || '확인 중'}${durableHint}`;
        await refreshCompatibility(preview).catch(error => warn('compatibility refresh failed', error));
        return preview;
      }
      if (scopeNode) scopeNode.textContent = compact(preview.context?.chat?.name || preview.identity.chatId || '현재 채팅', 44);
      const flashbackLine = preview.flashback.available
        ? `Flashback 기억 ${formatNumber(preview.flashback.records)}개 · ${formatNumber(preview.flashback.shards)}개 샤드`
        : `Flashback 저장 기억 0개 (${preview.flashback.reason})`;
      const hayakuLine = preview.includeHayaku
        ? `HAYAKU 패킷 ${formatNumber(preview.hayakuRecordCount)}개 자동 포함 · Current ${formatNumber(preview.hayakuCurrentRecordCount || 0)} · Recovery ${formatNumber(preview.hayakuRecoveryRecordCount || 0)} · Archive ${formatNumber(preview.hayakuArchiveRecordCount || 0)}${preview.hayakuPendingRecoveryRecordCount ? ` · Recovery 원장 반영 대기 ${formatNumber(preview.hayakuPendingRecoveryRecordCount)}` : ''}${preview.hayaku.available ? '' : ' (캡슐 기반)'}`
        : `HAYAKU 제외 (${preview.hayaku.reason})`;
      const libraLine = preview.includeLibra
        ? `LIBRA 정본 메모리 ${formatNumber(preview.libraRecordCount)}개 IPC 승계 준비`
        : preview.libra.pluginAvailable
          ? ['libra_inspect_timeout', 'libra_inspect_failed'].includes(text(preview.libra.reason))
            ? `LIBRA 연결됨 · 정본 조회 실패 (${preview.libra.reason})`
            : `LIBRA 연결됨 · 정본 없음 (${preview.libra.reason})`
          : 'LIBRA IPC 연결 없음 · LIBRA v1.0.4+ 필요';
      const serverNamespaces = preview.memorySuiteServer?.namespaces || {};
      const serverDetected = Object.entries(serverNamespaces)
        .filter(([, row]) => row?.available === true && Number(row?.liveRecords || 0) > 0)
        .map(([name, row]) => `${name.toUpperCase()} ${formatNumber(row.liveRecords)}`);
      const memorySuiteLine = preview.memorySuiteServer?.reason === 'server_probe_deferred'
        ? 'Memory Suite 서버 자동 조회 생략 · pluginStorage/owner IPC 경로 사용'
        : preview.memorySuiteServer?.reason === 'plugin_only_no_server_probe'
          ? 'Memory Suite 플러그인 단독 모드 · 서버 요청 없음'
          : Object.values(serverNamespaces).some(row => row?.available === true)
        ? `Memory Suite 서버 인식 · ${serverDetected.length ? serverDetected.join(' · ') : '저장 데이터 없음'}`
        : 'Memory Suite 서버 미연결 · pluginStorage/owner IPC 경로 사용';
      node.textContent = `${memorySuiteLine}\n${libraLine}\n${flashbackLine}\n${hayakuLine}`;
      // Transition data is already complete. The secondary contract sweep must
      // not keep the whole RE:TRACE window in a loading state.
      void refreshCompatibility(preview).catch(error => warn('compatibility refresh failed', error));
      return preview;
    } catch (error) {
      node.textContent = `확인 실패: ${error?.message || error}`;
      return null;
    }
  };

  const refreshColdStart = async () => {
    const node = Runtime.root?.querySelector?.('#coldStartStatus');
    const button = Runtime.root?.querySelector?.('#runColdStart');
    if (!node) return null;
    node.textContent = '실행 가능 여부를 확인하는 중입니다.';
    try {
      const inspection = await inspectColdStart();
      const reasonText = {
        ready: 'HAYAKU를 아직 사용하지 않은 채팅입니다. 콜드스타트를 실행할 수 있습니다.',
        cold_start_readopt: '콜드스타트 캡슐은 검증됐지만 HAYAKU 원장의 영속 채택이 아직 확인되지 않았습니다.',
        cold_start_resume: '미완료 콜드스타트 실행이 있습니다. 성공한 청크는 유지하고 실패·누락 청크만 이어서 분석합니다.',
        cold_start_already_used: '이미 HAYAKU 기록이 있는 세션입니다. 콜드스타트는 차단되며 누락 복구는 증분 재분석을 사용합니다.',
        chat_transcript_unavailable: '분석할 채팅 대화가 없습니다.'
      }[inspection.reason] || inspection.reason;
      const failedChunks = inspection.stagedRun?.run?.chunks?.filter(chunk => chunk?.status === 'failed').length || 0;
      const lastResultAdoption = Runtime.lastColdStart?.transferId === inspection.pendingColdStart?.capsule?.transferId
        ? Runtime.lastColdStart?.adoption
        : null;
      const adoptionReceipt = lastResultAdoption
        || inspection.stagedRun?.run?.adoptionReceipt
        || inspection.hayaku?.ledger?.bridgeSync?.coldStart
        || inspection.pendingAdoptionVerification
        || null;
      const adoptionText = inspection.reason === 'cold_start_readopt'
        ? `\n${hayakuAdoptionDiagnosticText(adoptionReceipt)}`
        : '';
      node.textContent = `${reasonText}${adoptionText}\n대화 ${formatNumber(inspection.evidence.rows.length)}개 · 완료 턴 ${formatNumber(inspection.evidence.completedTurns)}개 · 분석 청크 ${formatNumber(inspection.evidence.chunks.length)}개${failedChunks ? ` · 실패 청크 ${formatNumber(failedChunks)}개` : ''}`;
      if (button) button.disabled = !inspection.eligible || analysisIsRunning();
      if (button) button.textContent = {
        readopt: '캡슐 다시 채택',
        resume: '실패 청크 이어서',
        initial: '콜드스타트 실행'
      }[inspection.recommendedMode] || '콜드스타트 실행';
      return inspection;
    } catch (error) {
      node.textContent = `확인 실패: ${error?.message || error}`;
      if (button) button.disabled = true;
      return null;
    }
  };

  const hayakuAdoptionDiagnosticText = adoption => {
    if (!adoption || typeof adoption !== 'object') return '채택 상세: 이전 버전의 실행으로 상세 영수증이 없습니다.';
    const reason = text(adoption.reason || 'unknown').trim();
    const transport = text(adoption.transport || '').trim();
    const diagnostics = adoption.diagnostics && typeof adoption.diagnostics === 'object'
      ? adoption.diagnostics
      : {};
    const transportText = {
      hayaku_plugin_ipc: '공식 HAYAKU IPC',
      shared_runtime_fallback: '공유 런타임 호환 경로',
      plugin_storage_queue: 'pluginStorage 대기열',
      plugin_storage_readback: 'pluginStorage 영속 확인'
    }[transport] || transport || '미확인 경로';
    if (adoption.verified === true && adoption.durable === true) {
      return `채택 상세: ${transportText} · 영속 검증 완료`;
    }
    if (['HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT', 'queued_for_next_hayaku_request'].includes(reason)) {
      return `채택 상세: ${transportText} · HAYAKU IPC 응답 없음 · 다음 HAYAKU 요청에서 자체 동기화 예정`;
    }
    const failedChecks = [
      diagnostics.metadataMatches === false ? 'metadata' : '',
      diagnostics.packetsMatch === false ? 'packet readback' : '',
      diagnostics.replacementsMatch === false ? 'replacement' : '',
      diagnostics.activeCoverageMatches === false ? 'worldline binding' : ''
    ].filter(Boolean);
    const turnDetail = diagnostics.activeCoverageMatches === false
      ? ` · 기대 턴 ${(diagnostics.expectedTurns || []).join(', ') || '-'} · 활성 턴 ${(diagnostics.activeTurns || []).join(', ') || '-'}`
      : '';
    return `채택 상세: ${transportText} · ${reason}${failedChecks.length ? ` · 실패 검사 ${failedChecks.join(', ')}` : ''}${turnDetail}`;
  };

  const refreshIncrementalRecovery = async () => {
    const node = Runtime.root?.querySelector?.('#incrementalRecoveryStatus');
    const button = Runtime.root?.querySelector?.('#runIncrementalRecovery');
    if (!node) return null;
    node.textContent = '원장 커버리지를 확인하는 중입니다.';
    try {
      const inspection = await inspectIncrementalRecovery();
      const reasonText = {
        cold_start_required: 'HAYAKU 기록이 없습니다. 이 세션은 증분 재분석이 아니라 콜드스타트 대상입니다.',
        incremental_recovery_readopt: '증분 재분석 캡슐은 검증됐지만 HAYAKU 원장의 영속 채택이 아직 확인되지 않았습니다.',
        incremental_recovery_stale_capsule: '이전 복구 캡슐의 전체 해시는 현재 대화와 다릅니다. 일치하는 청크 체크포인트만 선별 재사용합니다.',
        incremental_recovery_resume: '미완료 증분 재분석이 있습니다. 검증된 청크는 재사용하고 실패·누락·변경 청크만 이어서 처리합니다.',
        coverage_complete: '모든 완료 U+A 턴에 HAYAKU 커버리지가 있습니다.',
        user_suppressed_only: '사용자가 삭제한 턴만 있습니다. 자동 복구에서는 제외되며 해당 패킷 카드의 재생성 버튼으로만 복구합니다.',
        missing_turns_detected: 'HAYAKU 패킷이 없는 완료 턴을 감지했습니다.',
        missing_evidence_unavailable: '누락 턴은 감지했지만 분석할 대화 증거를 구성하지 못했습니다.'
      }[inspection.reason] || inspection.reason;
      const coverage = inspection.evidence.coverage;
      const missingText = coverage.missingTurns.length
        ? ` · 누락 턴 ${coverage.missingTurns.join(', ')}`
        : '';
      const suppressedText = coverage.userSuppressedTurns.length
        ? ` · 사용자 삭제 ${formatNumber(coverage.userSuppressedTurns.length)}개 · 삭제 턴 ${coverage.userSuppressedTurns.join(', ')}`
        : '';
      const failedChunks = inspection.stagedRun?.run?.chunks?.filter(chunk => chunk?.status === 'failed').length || 0;
      const checkpointPlan = inspection.checkpointPlan || {};
      const checkpointText = inspection.recommendedMode === 'resume'
        ? ` · 체크포인트 재사용 ${formatNumber(checkpointPlan.reusedVerifiedCount || 0)}개 · 실제 재처리 ${formatNumber(checkpointPlan.pendingChunkCount || 0)}개`
        : '';
      const lastResultAdoption = Runtime.lastIncrementalRecovery?.recoveryId === inspection.pendingCapsule?.capsule?.recoveryId
        ? Runtime.lastIncrementalRecovery?.adoption
        : null;
      const adoptionReceipt = lastResultAdoption
        || inspection.stagedRun?.run?.adoptionReceipt
        || inspection.hayaku?.ledger?.bridgeSync?.incrementalRecovery
        || inspection.pendingAdoptionVerification
        || null;
      const adoptionText = inspection.reason === 'incremental_recovery_readopt'
        ? `\n${hayakuAdoptionDiagnosticText(adoptionReceipt)}`
        : '';
      node.textContent = `${reasonText}${adoptionText}\n완료 턴 ${formatNumber(coverage.completedTurns)}개 · 커버 ${formatNumber(coverage.coveredTurns.length)}개 · 캡처 누락 ${formatNumber(coverage.missingTurns.length)}개${missingText}${suppressedText}${failedChunks ? ` · 실패 청크 ${formatNumber(failedChunks)}개` : ''}${checkpointText}`;
      if (button) button.disabled = !inspection.eligible || analysisIsRunning();
      if (button) button.textContent = {
        readopt: '복구 캡슐 다시 채택',
        resume: '실패 청크 이어서',
        incremental: '누락 턴 증분 재분석'
      }[inspection.recommendedMode] || '누락 턴 증분 재분석';
      return inspection;
    } catch (error) {
      node.textContent = `확인 실패: ${error?.message || error}`;
      if (button) button.disabled = true;
      return null;
    }
  };

  const refreshLibra = async () => {
    const body = Runtime.root?.querySelector?.('#libraBody');
    if (!body) return null;
    body.innerHTML = '<div class="empty"><strong>LIBRA 조회 중</strong><span>공식 IPC로 현재 스코프 정본을 읽고 있습니다.</span></div>';
    try {
      const result = await readLibraSource(await getCurrentContext());
      body.innerHTML = renderLibra(result);
      return result;
    } catch (error) {
      body.innerHTML = `<div class="empty"><strong>조회 실패</strong><span>${escapeHtml(error?.message || error)}</span></div>`;
      return null;
    }
  };

  const refreshFlashback = async () => {
    const body = Runtime.root?.querySelector?.('#flashbackBody');
    if (!body) return null;
    body.innerHTML = '<div class="empty"><strong>기억 조회 중</strong><span>Flashback manifest를 확인하고 최신 shard만 지연 로드하고 있습니다.</span></div>';
    try {
      const result = await readFlashbackViewer(await getCurrentContext());
      body.innerHTML = renderFlashback(result);
      return result;
    } catch (error) {
      body.innerHTML = `<div class="empty"><strong>조회 실패</strong><span>${escapeHtml(error?.message || error)}</span></div>`;
      return null;
    }
  };

  const refreshHayaku = async () => {
    const body = Runtime.root?.querySelector?.('#hayakuBody');
    if (!body) return null;
    body.innerHTML = '<div class="empty"><strong>원장 조회 중</strong><span>HAYAKU 메타데이터를 확인하고 최신 Archive layer만 지연 해제하고 있습니다.</span></div>';
    try {
      const ownerGate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
      if (ownerGate.ready !== true) {
        body.innerHTML = '<div class="empty"><strong>HAYAKU 연결되지 않음</strong><span>활성 HAYAKU owner가 없어 원장·캡슐·누락 복구·채택 로직을 실행하지 않습니다.</span></div>';
        return { available: false, ownerReady: false, reason: 'hayaku_owner_absent' };
      }
      const context = await getCurrentContext();
      const navigation = resolveTurnNavigationTarget(context.chat, Number.MAX_SAFE_INTEGER);
      Runtime.hayakuMaxTurn = navigation.maxTurn;
      const turnInput = Runtime.root?.querySelector?.('#hayakuTurnInput');
      const turnButton = Runtime.root?.querySelector?.('#jumpHayakuTurn');
      const turnMax = Runtime.root?.querySelector?.('#hayakuTurnMax');
      if (turnInput) {
        turnInput.max = String(Math.max(1, navigation.maxTurn));
        if (!turnInput.value) turnInput.value = navigation.maxTurn > 0 ? String(navigation.maxTurn) : '';
      }
      if (turnButton) turnButton.disabled = navigation.maxTurn < 1;
      if (turnMax) turnMax.textContent = navigation.maxTurn > 0
        ? `최대 ${formatNumber(navigation.maxTurn)}턴`
        : '완료된 턴 없음';
      let [result, pending, pendingIncremental] = await Promise.all([
        readHayakuViewerSource(context),
        readPendingColdStartCapsule(context, { ownerGate }),
        readPendingIncrementalRecoveryCapsule(context, { ownerGate })
      ]);
      const coldStartNeedsAdoption = pending.available
        && text(result?.ledger?.coldStart?.transferId || '') !== text(pending?.capsule?.transferId || '');
      // lastRecoveryId alone is not proof: metadata may survive while one or more
      // recovery records/slot heads are absent. Verify durable packet bodies and
      // recovered-turn coverage before deciding adoption is complete.
      let incrementalVerification = pendingIncremental.available
        ? await verifyDurableHayakuIncrementalRecovery(pendingIncremental.capsule)
        : null;
      const incrementalNeedsAdoption = pendingIncremental.available
        && incrementalVerification?.verified !== true;
      let adoptionChanged = false;
      if (coldStartNeedsAdoption) {
        const adoption = await requestImmediateHayakuColdStartAdoption(pending.capsule);
        adoptionChanged = adoption.verified === true || adoptionChanged;
      }
      if (incrementalNeedsAdoption) {
        const adoption = await requestImmediateHayakuIncrementalRecoveryAdoption(pendingIncremental.capsule);
        adoptionChanged = adoption.verified === true || adoptionChanged;
        incrementalVerification = adoption.verified === true
          ? await verifyDurableHayakuIncrementalRecovery(pendingIncremental.capsule)
          : incrementalVerification;
      }
      if (adoptionChanged) result = await readHayakuViewerSource(context);
      result = await mergeHayakuRecoveryAccountingForViewer(result, pendingIncremental);
      if (incrementalVerification) result = { ...result, recoveryDurableVerification: incrementalVerification };
      if (!result.available && pending.available) {
        body.innerHTML = `<div class="empty"><strong>콜드스타트 반영 대기</strong><span>패킷 ${formatNumber(pending.packets.length)}개가 검증 저장됐습니다.</span><span>다음 모델 요청의 시작 단계에서 HAYAKU가 원장에 반영하고 같은 요청부터 리콜합니다.</span></div>`;
      } else {
        body.innerHTML = renderHayaku(result);
      }
      return { ...result, pendingColdStart: pending, pendingIncrementalRecovery: pendingIncremental };
    } catch (error) {
      body.innerHTML = `<div class="empty"><strong>조회 실패</strong><span>${escapeHtml(error?.message || error)}</span></div>`;
      return null;
    }
  };

  const readProviderSettingsFromUi = () => {
    const current = clone(Runtime.settings || normalizeSettings({}), {});
    const autoRepairNode = Runtime.root?.querySelector?.('#hayakuAutoRepairEnabled');
    if (autoRepairNode) current.hayakuAutoRepair = autoRepairNode.value === 'true';
    for (const node of Runtime.root?.querySelectorAll?.('[data-provider-field]') || []) {
      const [profileName, field] = text(node.getAttribute('data-provider-field')).split('.');
      if (!current[profileName] || !field) continue;
      if (['timeoutMs', 'maxTokens', 'temperature', 'reasoningBudgetTokens'].includes(field)) {
        current[profileName][field] = Number(node.value);
      } else if (['stream', 'customServiceTierPassthrough'].includes(field)) {
        current[profileName][field] = node.value === 'true';
      } else {
        current[profileName][field] = node.value;
      }
    }
    return normalizeSettings(current);
  };

  const saveHayakuAutoRepairSelection = async selectNode => {
    if (!selectNode || selectNode.dataset.saving === 'true') return Runtime.settings;
    const previous = Runtime.settings?.hayakuAutoRepair === true;
    const requested = selectNode.value === 'true';
    selectNode.dataset.saving = 'true';
    selectNode.disabled = true;
    try {
      const draft = readProviderSettingsFromUi();
      draft.hayakuAutoRepair = requested;
      const settings = await saveSettings(draft);
      selectNode.value = String(settings.hayakuAutoRepair === true);
      if (settings.hayakuAutoRepair !== true) {
        if (Runtime.hayakuAutoRepair.timer != null) clearTimeout(Runtime.hayakuAutoRepair.timer);
        Runtime.hayakuAutoRepair.timer = null;
        Runtime.hayakuAutoRepair.queuedReason = '';
      }
      await refreshHayakuAutoRepairStatus();
      return settings;
    } catch (error) {
      selectNode.value = String(previous);
      await refreshHayakuAutoRepairStatus().catch(() => {});
      throw error;
    } finally {
      delete selectNode.dataset.saving;
      selectNode.disabled = false;
    }
  };

  const refreshHayakuAutoRepairStatus = async () => {
    const node = Runtime.root?.querySelector?.('#hayakuAutoRepairStatus');
    if (!node) return null;
    const settings = await loadSettings();
    if (settings.hayakuAutoRepair !== true) {
      node.textContent = '자동 복구 꺼짐 · HAYAKU Recovery Vault의 raw fallback은 그대로 유지됩니다.';
      return { enabled: false };
    }
    const gate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
    if (gate.ready !== true) {
      node.textContent = '활성 HAYAKU owner 없음 · HAYAKU 관련 자동 검사와 LLM 호출을 전부 실행하지 않습니다.';
      return { enabled: true, ownerReady: false };
    }
    const ipc = gate.capabilities?.ipcCapabilities || {};
    const compatible = ipc.recoveryDebtWorldlineV1 === true && ipc.repairTargetAdoptionV1 === true;
    node.textContent = compatible
      ? `자동 복구 대기 · 실행 ${Runtime.hayakuAutoRepair.runs} · 성공 ${Runtime.hayakuAutoRepair.successes} · 실패 ${Runtime.hayakuAutoRepair.failures}${Runtime.hayakuAutoRepair.lastError ? `\n최근 오류: ${Runtime.hayakuAutoRepair.lastError}` : ''}`
      : 'HAYAKU는 연결됐지만 Recovery Debt Worldline v1 계약을 지원하지 않아 자동 복구를 실행하지 않습니다.';
    return { enabled: true, ownerReady: true, compatible };
  };

  const setProviderStatus = (message, kind = '') => {
    const node = Runtime.root?.querySelector?.('#providerStatus');
    if (!node) return;
    node.textContent = text(message);
    node.style.color = kind === 'error' ? 'var(--lra-red)' : kind === 'ok' ? 'var(--lra-green)' : 'var(--lra-primary)';
  };

  const retraceDebugSafeValue = (value, key = '', depth = 0) => {
    if (depth > 10) return '[DEPTH_LIMIT]';
    const name = text(key || '').toLowerCase();
    if (/(?:api.?key|authorization|bearer|password|secret|credential|private.?key|client.?secret|access.?token|refresh.?token|(^|_)token$)/i.test(name)) {
      return value ? '[REDACTED]' : '';
    }
    if (/(?:extraheadersjson|extrabodyjson)/i.test(name)) return value ? '[REDACTED_CONFIGURED]' : '';
    if (value == null || typeof value === 'number' || typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      if (/(?:characterid|chatid|personaid|scopekey|storagekey|manifestkey|metakey|archivescopekey)$/i.test(name)) {
        return value ? `hash:${stableHash64(value)}` : '';
      }
      if (/(?:^raw$|packetbody|memorytext|chatmessages|messagebody)$/i.test(name) || value.length > 4000) {
        return value ? `[OMITTED ${value.length} chars · ${stableHash64(value)}]` : '';
      }
      return value;
    }
    if (Array.isArray(value)) return value.slice(0, 120).map((item, index) => retraceDebugSafeValue(item, `${key}[${index}]`, depth + 1));
    if (typeof value === 'object') {
      const out = {};
      for (const [childKey, childValue] of Object.entries(value)) {
        if (['character', 'chat', 'runtimeItems', 'items', 'records', 'allRecords', 'shards', 'archiveLayers'].includes(childKey)) {
          if (Array.isArray(childValue)) out[childKey] = `[OMITTED ARRAY ${childValue.length}]`;
          else if (childValue && typeof childValue === 'object') out[childKey] = '[OMITTED OBJECT]';
          else out[childKey] = childValue;
          continue;
        }
        out[childKey] = retraceDebugSafeValue(childValue, childKey, depth + 1);
      }
      return out;
    }
    return text(value);
  };

  const retraceDebugProviderSummary = settings => {
    const profile = settings?.primary || {};
    return {
      provider: text(profile.provider || ''),
      url: text(profile.url || ''),
      model: text(profile.model || ''),
      timeoutMs: Math.max(0, Number(profile.timeoutMs || 0) || 0),
      maxTokens: Math.max(0, Number(profile.maxTokens || 0) || 0),
      requestFormat: text(profile.requestFormat || ''),
      reasoningPreset: text(profile.reasoningPreset || ''),
      reasoningEffort: text(profile.reasoningEffort || ''),
      reasoningBudgetTokens: Number(profile.reasoningBudgetTokens || 0) || 0,
      thinkingType: text(profile.thinkingType || ''),
      stream: profile.stream === true,
      serviceTier: text(profile.serviceTier || ''),
      credentialConfigured: Boolean(text(profile.key || '').trim()),
      extraHeadersConfigured: Boolean(text(profile.extraHeadersJson || '').trim()),
      extraBodyConfigured: Boolean(text(profile.extraBodyJson || '').trim())
    };
  };

  const buildRetraceDebugExport = async () => {
    const exportedAt = new Date().toISOString();
    let context = null;
    let contextError = '';
    try { context = await getCurrentContext(); } catch (error) { contextError = text(error?.message || error); }
    const identity = context ? contextIdentity(context) : {};
    let pending = null;
    let durableStatus = null;
    let transition = null;
    let pendingColdStart = null;
    let pendingIncremental = null;
    let hayakuSummary = null;
    let flashbackSummary = null;
    let libraSummary = null;
    let hayakuOwnerGate = null;
    if (context) {
      try { pending = await inspectPendingNextSessionHandoff({ context }); } catch (error) { pending = { available: false, error: text(error?.message || error) }; }
      if (pending?.available) {
        try { durableStatus = await inspectPendingHandoffDurableStatus(pending); } catch (error) { durableStatus = { error: text(error?.message || error) }; }
      }
      try { transition = await inspectTransition(); } catch (error) { transition = { error: text(error?.message || error) }; }
      hayakuOwnerGate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
      if (hayakuOwnerGate.ready === true) {
        try { pendingColdStart = await readPendingColdStartCapsule(context, { ownerGate: hayakuOwnerGate }); } catch (error) { pendingColdStart = { available: false, error: text(error?.message || error) }; }
        try { pendingIncremental = await readPendingIncrementalRecoveryCapsule(context, { ownerGate: hayakuOwnerGate }); } catch (error) { pendingIncremental = { available: false, error: text(error?.message || error) }; }
        try { hayakuSummary = await readHayakuSource(context, { includeRecords: false, ownerGate: hayakuOwnerGate }); } catch (error) { hayakuSummary = { available: false, error: text(error?.message || error) }; }
      } else {
        const disabled = { available: false, ownerReady: false, reason: 'hayaku_owner_absent', ownerState: hayakuOwnerGate.state };
        pendingColdStart = { ...disabled, packets: [] };
        pendingIncremental = { ...disabled, packets: [] };
        hayakuSummary = { ...disabled, records: [], recordCount: 0 };
      }
      try { flashbackSummary = await readFlashbackSource(context, { includeRecords: false, skipRuntime: true, skipIpc: true }); } catch (error) { flashbackSummary = { available: false, error: text(error?.message || error) }; }
      try { libraSummary = await readLibraSource(context, { includeRecords: false }); } catch (error) { libraSummary = { available: false, error: text(error?.message || error) }; }
    }
    let settings = null;
    try { settings = await loadSettings(); } catch (_) {}
    let memorySuite = null;
    try {
      // A missing live HAYAKU owner disables every HAYAKU-related code path,
      // including the manager-wide server diagnostics sweep. Use RE:TRACE's own
      // namespace diagnostics only so a stale HAYAKU server namespace is neither
      // probed nor interpreted as an installed owner.
      memorySuite = hayakuOwnerGate?.ready === true
        ? await MemorySuiteStorageBridge.managerGetDiagnostics({ limit: 1000 })
        : await MemorySuiteStorageBridge.getDiagnostics({ force: true, limit: 500 });
    } catch (managerError) {
      memorySuite = await MemorySuiteStorageBridge.getDiagnostics({ force: true, limit: 500 }).catch(error => ({
        schema: 'memory-suite.plugin-server-diagnostics.v1', reachable: false,
        error: text(error?.message || error || managerError?.message || managerError),
        managerError: text(managerError?.message || managerError), status: MemorySuiteStorageBridge.status()
      }));
    }
    const payload = {
      schema: 'retrace_debug_export_v1',
      schemaVersion: 1,
      exportedAt,
      plugin: PLUGIN_NAME,
      pluginVersion: PLUGIN_VERSION,
      privacy: {
        credentialValues: 'redacted',
        rawChatMessages: 'omitted',
        rawMemoryBodies: 'omitted',
        characterChatPersonaIds: 'hashed'
      },
      environment: {
        timezone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) { return ''; } })(),
        language: text(globalThis.navigator?.language || ''),
        userAgent: text(globalThis.navigator?.userAgent || '')
      },
      context: {
        available: Boolean(context),
        error: contextError,
        characterIdHash: identity.characterId ? stableHash64(identity.characterId) : '',
        chatIdHash: identity.chatId ? stableHash64(identity.chatId) : '',
        personaIdHash: identity.personaId ? stableHash64(identity.personaId) : '',
        chatTitle: compact(context?.chat?.name || context?.chat?.title || '', 120),
        chatMessageCount: Array.isArray(context?.chat?.message) ? context.chat.message.length : 0,
        source: text(context?.source || '')
      },
      provider: retraceDebugProviderSummary(settings),
      memorySuite,
      runtime: {
        visible: Runtime.visible === true,
        mounted: Runtime.mounted === true,
        activeTab: text(Runtime.activeTab || ''),
        busy: Runtime.busy === true,
        analysis: analysisProgressSnapshot(),
        ipc: {
          flashback: {
            registered: Runtime.flashbackIpcRegistered === true,
            lastSeenAt: Runtime.flashbackIpcLastSeenAt || 0,
            lastError: Runtime.flashbackIpcLastError || '',
            lastTimeoutAt: Runtime.flashbackIpcLastTimeoutAt || 0,
            pending: Runtime.flashbackIpcPending?.size || 0,
            summaryTimeoutMs: FLASHBACK_INSPECT_SUMMARY_TIMEOUT_MS,
            inspectCircuitUntil: Runtime.flashbackInspectCircuitUntil || 0,
            inspectCircuitOpen: Runtime.flashbackInspectCircuitUntil > Date.now(),
            inspectCircuitTrips: Runtime.flashbackInspectCircuitTrips || 0,
            inspectFallbackCount: Runtime.flashbackInspectFallbackCount || 0,
            inspectLastFallbackAt: Runtime.flashbackInspectLastFallbackAt || 0,
            inspectLastFallbackReason: Runtime.flashbackInspectLastFallbackReason || '',
            inspectIpcSuccesses: Runtime.flashbackInspectIpcSuccesses || 0,
            summaryInFlight: Boolean(Runtime.flashbackInspectSummaryPromise)
          },
          hayaku: { registered: Runtime.hayakuIpcRegistered === true, unavailableUntil: Runtime.hayakuIpcUnavailableUntil || 0, pending: Runtime.hayakuIpcPending?.size || 0 },
          libra: { registered: Runtime.libraIpcRegistered === true, lastSeenAt: Runtime.libraIpcLastSeenAt || 0, lastError: Runtime.libraIpcLastError || '', pending: Runtime.libraIpcPending?.size || 0 },
          lia: { registered: Runtime.liaIpcRegistered === true, lastError: Runtime.liaIpcLastError || '', pending: Runtime.liaIpcPending?.size || 0 }
        },
        handoffResumeInFlight: Runtime.handoffResumePromises?.size || 0,
        lastUiDialog: clone(Runtime.lastUiDialog, null),
        warnings: clone(Runtime.warnings, [])
      },
      handoff: {
        pending: pending ? {
          available: pending.available === true,
          pending: pending.pending === true,
          reason: text(pending.reason || ''),
          targetChatId: text(pending.targetChatId || ''),
          bridge: pending.bridge,
          journal: pending.journal
        } : null,
        durableStatus,
        lastTransition: Runtime.lastTransition,
        transitionPreview: transition ? {
          includeHayaku: transition.includeHayaku === true,
          hayakuRecordCount: Math.max(0, Number(transition.hayakuRecordCount || 0) || 0),
          hayakuCurrentRecordCount: Math.max(0, Number(transition.hayakuCurrentRecordCount || 0) || 0),
          hayakuRecoveryRecordCount: Math.max(0, Number(transition.hayakuRecoveryRecordCount || 0) || 0),
          hayakuPendingRecoveryRecordCount: Math.max(0, Number(transition.hayakuPendingRecoveryRecordCount || 0) || 0),
          hayakuArchiveRecordCount: Math.max(0, Number(transition.hayakuArchiveRecordCount || 0) || 0),
          includeLibra: transition.includeLibra === true,
          pendingHandoff: transition.pendingHandoff
        } : null
      },
      owners: {
        hayaku: hayakuSummary,
        flashback: flashbackSummary,
        libra: libraSummary,
        pendingColdStart: pendingColdStart ? { available: pendingColdStart.available === true, reason: text(pendingColdStart.reason || ''), packetCount: Array.isArray(pendingColdStart.packets) ? pendingColdStart.packets.length : 0, scope: pendingColdStart.scope } : null,
        pendingIncrementalRecovery: pendingIncremental ? { available: pendingIncremental.available === true, reason: text(pendingIncremental.reason || ''), packetCount: Array.isArray(pendingIncremental.packets) ? pendingIncremental.packets.length : 0, recoveryId: text(pendingIncremental.capsule?.recoveryId || ''), sourceHash: text(pendingIncremental.capsule?.sourceHash || ''), scope: pendingIncremental.scope } : null
      },
      compatibility: Runtime.compatibilitySuite,
      recent: {
        lastColdStart: Runtime.lastColdStart,
        lastIncrementalRecovery: Runtime.lastIncrementalRecovery,
        lastHayakuBackup: Runtime.lastHayakuBackup
      }
    };
    return retraceDebugSafeValue(payload);
  };

  const exportRetraceDebugLogFile = async () => {
    const payload = await buildRetraceDebugExport();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (!downloadJson(`retrace-debug-${stamp}.json`, payload)) throw new Error('브라우저 다운로드를 시작하지 못했습니다.');
    return payload;
  };

  const downloadJson = (filename, value) => {
    const payload = JSON.stringify(value, null, 2);
    try {
      const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 500);
      return true;
    } catch (error) {
      warn('JSON download failed', error);
      console.log(payload);
      return false;
    }
  };

  const bindUi = () => {
    const root = Runtime.root;
    if (!root) return;
    const syncReasoningPresetEditor = (profileName, options = {}) => {
      const field = key => root.querySelector(`[data-provider-field="${profileName}.${key}"]`);
      const presetNode = field('reasoningPreset');
      if (!presetNode) return 'off';
      const presetKey = normalizeReasoningPresetKey(presetNode.value);
      const definition = reasoningPresetDefinition(presetKey);
      const controls = new Set(definition.controls || []);
      root.querySelectorAll(`[data-provider-field^="${profileName}."]`).forEach(node => {
        const holder = node.closest?.('[data-reasoning-control]');
        if (holder) holder.hidden = !controls.has(text(holder.dataset?.reasoningControl));
      });
      const effort = field('reasoningEffort');
      const effortSupport = presetKey === 'claude'
        ? new Set(['none', 'low', 'medium', 'high', 'xhigh', 'max'])
        : presetKey === 'gemini'
          ? new Set(['none', 'minimal', 'low', 'medium', 'high'])
          : presetKey === 'ollama'
            ? new Set(['none', 'low', 'medium', 'high', 'max'])
            : null;
      effort?.querySelectorAll?.('option').forEach(option => {
        option.disabled = Boolean(effortSupport && !effortSupport.has(option.value));
      });
      const hint = root.querySelector(`[data-reasoning-preset-hint="${profileName}"]`);
      if (hint) hint.textContent = definition.hint;
      if (options.applyDefaults === true) {
        if (effort) effort.value = definition.reasoningEffort;
        if (field('reasoningBudgetTokens')) field('reasoningBudgetTokens').value = String(definition.reasoningBudgetTokens);
        if (field('maxTokens')) field('maxTokens').value = String(definition.maxTokens);
        if (field('thinkingType')) field('thinkingType').value = definition.thinkingType;
      }
      return presetKey;
    };
    const providerProfileFromUi = profileName => {
      const settings = readProviderSettingsFromUi();
      return settings?.[profileName] || settings?.primary || normalizeProfileSettings({}, DEFAULT_PROFILE);
    };
    const populateProviderModelPicker = (profileName, profile, models, options = {}) => {
      const select = root.querySelector(`[data-provider-model-select="${profileName}"]`);
      const status = root.querySelector(`[data-provider-model-status="${profileName}"]`);
      if (!select) return;
      while (select.firstChild) select.removeChild(select.firstChild);
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = models.length ? '불러온 모델에서 선택' : '조회된 모델 없음';
      select.appendChild(placeholder);
      for (const item of models) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.label === item.id ? item.id : `${item.label} · ${item.id}`;
        if (text(profile?.model) === item.id) option.selected = true;
        select.appendChild(option);
      }
      select.hidden = models.length === 0;
      select.dataset.providerModelIdentity = providerModelCacheKey(profile);
      if (status) status.textContent = `${formatNumber(models.length)}개 ${options.cached ? '캐시됨' : '로드됨'}`;
    };
    const syncProviderModelPicker = (profileName, options = {}) => {
      const profile = providerProfileFromUi(profileName);
      const meta = providerModelMetadata(profile.provider, profile.url);
      const button = root.querySelector(`[data-load-models-profile="${profileName}"]`);
      const select = root.querySelector(`[data-provider-model-select="${profileName}"]`);
      const status = root.querySelector(`[data-provider-model-status="${profileName}"]`);
      const hint = root.querySelector(`[data-provider-model-hint="${profileName}"]`);
      const identity = providerModelCacheKey(profile);
      if (button && !Runtime.providerModelLoading.has(profileName)) button.disabled = !meta;
      if (hint) hint.textContent = meta?.nativeOllama
        ? 'Ollama의 /api/tags에서 현재 호스트에 실제 설치된 모델을 읽습니다. 수동 모델 입력도 그대로 사용할 수 있습니다.'
        : meta?.modelsUrl
          ? `${meta.label} 모델 카탈로그를 조회합니다. 수동 모델 입력도 그대로 사용할 수 있습니다.`
          : '자동 모델 목록 조회가 등록되지 않은 프로바이더는 Model 칸에 ID를 직접 입력하세요.';
      const stale = Boolean(select && select.dataset.providerModelIdentity && select.dataset.providerModelIdentity !== identity);
      if ((options.clear === true || stale) && select) {
        while (select.firstChild) select.removeChild(select.firstChild);
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '불러온 모델에서 선택';
        select.appendChild(placeholder);
        select.hidden = true;
        select.dataset.providerModelIdentity = identity;
        if (status) status.textContent = meta ? '목록 미조회' : '자동 조회 미지원';
      }
      const cached = cachedProviderModelEntry(profile);
      if (cached && (!select || select.options.length <= 1 || select.hidden)) {
        populateProviderModelPicker(profileName, profile, cached.models || [], { cached: true });
      } else if (!meta && status) {
        status.textContent = '자동 조회 미지원';
      }
      return { profile, meta };
    };
    root.querySelector('#exportRetraceDebug')?.addEventListener('click', async () => {
      const button = root.querySelector('#exportRetraceDebug');
      const previous = button?.textContent || '디버그 로그 내보내기';
      if (button) { button.disabled = true; button.textContent = '내보내는 중…'; }
      try { await exportRetraceDebugLogFile(); }
      catch (error) { await retraceAlert(`RE:TRACE 디버그 로그 내보내기 실패\n${error?.message || error}`); }
      finally { if (button) { button.disabled = false; button.textContent = previous; } }
    });
    root.querySelector('#closeBridge')?.addEventListener('click', () => closeUi());
    root.querySelector('#analysisReturnToRisu')?.addEventListener('click', () => closeUi());
    for (const button of root.querySelectorAll('.nav[data-tab]')) {
      button.addEventListener('click', () => {
        Runtime.activeTab = button.getAttribute('data-tab') || 'session';
        renderShell();
        if (Runtime.activeTab === 'session') refreshTransition();
        if (Runtime.activeTab === 'coldstart') {
          refreshColdStart();
          refreshIncrementalRecovery();
        }
        if (Runtime.activeTab === 'libra') refreshLibra();
        if (Runtime.activeTab === 'flashback') refreshFlashback();
        if (Runtime.activeTab === 'hayaku') refreshHayaku();
        if (Runtime.activeTab === 'serverdata') refreshServerScopeManagement().catch(error => warn('server scope manager refresh failed', error));
      });
    }
    root.querySelector('#refreshTransition')?.addEventListener('click', () => refreshTransition());
    bindCompatibilityControls();
    root.querySelector('#refreshColdStart')?.addEventListener('click', () => refreshColdStart());
    root.querySelector('#refreshIncrementalRecovery')?.addEventListener('click', () => refreshIncrementalRecovery());
    root.querySelector('#refreshLibra')?.addEventListener('click', () => refreshLibra());
    root.querySelector('#refreshFlashback')?.addEventListener('click', () => refreshFlashback());
    root.querySelector('#refreshHayaku')?.addEventListener('click', () => refreshHayaku());
    root.querySelector('#refreshServerData')?.addEventListener('click', () => refreshServerScopeManagement().catch(async error => {
      warn('server scope manager refresh failed', error);
      await retraceAlert(`서버 데이터 관리 새로고침 실패
${error?.message || error}`);
    }));
    root.querySelector('#serverDataBody')?.addEventListener('click', event => {
      void handleServerScopeManagementClick(event).catch(async error => {
        warn('server scope management action failed', error);
        await retraceAlert(`서버 데이터 관리 작업 실패
${error?.message || error}`);
      });
    });
    const runHayakuTurnJump = async () => {
      const input = root.querySelector('#hayakuTurnInput');
      if (!input || Runtime.busy) return;
      setBusy(true);
      try {
        const context = await getCurrentContext();
        const target = resolveTurnNavigationTarget(context.chat, input.value);
        Runtime.hayakuMaxTurn = target.maxTurn;
        if (!target.ok) {
          throw new Error(target.reason === 'turn_number_required'
            ? '\uC774\uB3D9\uD560 \uD134 \uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694.'
            : '\uC774\uB3D9\uD560 \uC218 \uC788\uB294 \uC644\uB8CC U+A \uD134\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.');
        }
        input.value = String(target.turn);
        input.max = String(target.maxTurn);
        const maxNode = root.querySelector('#hayakuTurnMax');
        if (maxNode) maxNode.textContent = `\uCD5C\uB300 ${formatNumber(target.maxTurn)}\uD134`;
        await scrollToChatMessageIndex(target.messageIndex);
      } catch (error) {
        await retraceAlert(`HAYAKU \uD134 \uC774\uB3D9 \uC2E4\uD328\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    };
    root.querySelector('#jumpHayakuTurn')?.addEventListener('click', runHayakuTurnJump);
    root.querySelector('#hayakuTurnInput')?.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      runHayakuTurnJump();
    });
    root.querySelector('#hayakuBody')?.addEventListener('click', async event => {
      const button = event.target?.closest?.('[data-hayaku-action-index]');
      if (!button || button.disabled || Runtime.busy) return;
      const index = Math.max(0, Number(button.getAttribute('data-hayaku-action-index') || 0) || 0);
      const record = Runtime.hayakuActionRecords[index];
      if (!record) return;
      const deleting = button.classList.contains('hayaku-delete-record');
      const regenerating = button.classList.contains('hayaku-regenerate-record');
      if (!deleting && !regenerating) return;
      event.preventDefault();
      if (deleting) {
        const message = '\uC774 \uD328\uD0B7\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?\n\n'
          + '\uBCF5\uAD6C \uAC00\uB2A5\uD55C tombstone\uC73C\uB85C \uCC98\uB9AC\uD558\uBA70, \uC601\uAD6C \uBCF4\uC874 \uAE30\uB85D\uC740 \uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.';
        if (!(await retraceConfirm(message, { title: 'HAYAKU 패킷 삭제', confirmLabel: '삭제', danger: true }))) return;
        setBusy(true);
        try {
          const deletion = await deleteHayakuRecord(record);
          await retraceAlert(`패킷 삭제를 확인했습니다. 활성 원장에서 제외되었으며 tombstone으로 보존됩니다.${deletion?.suppressedRecords ? `\n동일 variant alias ${formatNumber(deletion.suppressedRecords)}개 억제` : ''}`);
          await refreshHayaku();
          await refreshIncrementalRecovery();
        } catch (error) {
          await retraceAlert(`HAYAKU \uD328\uD0B7 \uC0AD\uC81C \uC2E4\uD328\n${error?.message || error}`);
        } finally {
          setBusy(false);
        }
        return;
      }
      const turns = recordRegenerationTurns(record);
      const message = `\uC774 \uD328\uD0B7\uC744 \uC7AC\uC0DD\uC131\uD560\uAE4C\uC694?\n\n\uB300\uC0C1 \uD134: ${turns.join(', ')}\n`
        + '\uC0C8 \uD328\uD0B7\uC774 \uAC80\uC99D\uB41C \uB4A4\uC5D0\uB9CC \uAE30\uC874 \uD328\uD0B7\uC744 tombstone \uCC98\uB9AC\uD558\uACE0 \uAD50\uCCB4\uD569\uB2C8\uB2E4.';
      if (!(await retraceConfirm(message, { title: 'HAYAKU 패킷 재생성', confirmLabel: '재생성' }))) return;
      setBusy(true);
      try {
        const result = await regenerateHayakuRecord(record);
        await retraceAlert(
          `HAYAKU \uD328\uD0B7 \uC7AC\uC0DD\uC131\uC744 \uC644\uB8CC\uD588\uC2B5\uB2C8\uB2E4.\n`
          + `\uD134 ${(result.recoveredTurns || []).join(', ')} \u00B7 \uAD50\uCCB4 ${formatNumber(result.adoption?.replacedRecords || 0)}\uAC1C`
        );
        await refreshHayaku();
        await refreshIncrementalRecovery();
      } catch (error) {
        await retraceAlert(`HAYAKU \uD328\uD0B7 \uC7AC\uC0DD\uC131 \uC2E4\uD328\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    for (const select of root.querySelectorAll('select[data-provider-field$=".provider"]')) {
      select.addEventListener('change', () => {
        const profileName = text(select.getAttribute('data-provider-field')).split('.')[0];
        const url = root.querySelector(`[data-provider-field="${profileName}.url"]`);
        if (url && (!url.value.trim() || PROVIDER_KEYS.map(defaultProviderUrl).includes(url.value.trim()))) {
          url.value = defaultProviderUrl(select.value);
        }
        const requestFormat = root.querySelector(`[data-provider-field="${profileName}.requestFormat"]`);
        if (requestFormat && !supportsResponses(select.value)) requestFormat.value = 'chat_completions';
        syncProviderModelPicker(profileName, { clear: true });
      });
    }
    for (const node of root.querySelectorAll('[data-provider-field$=".url"], [data-provider-field$=".key"]')) {
      const profileName = text(node.getAttribute('data-provider-field')).split('.')[0];
      node.addEventListener('change', () => syncProviderModelPicker(profileName, { clear: true }));
    }
    for (const select of root.querySelectorAll('[data-provider-model-select]')) {
      select.addEventListener('change', () => {
        const profileName = text(select.getAttribute('data-provider-model-select')).trim();
        const model = text(select.value).trim();
        if (!profileName || !model) return;
        const modelInput = root.querySelector(`[data-provider-field="${profileName}.model"]`);
        if (modelInput) modelInput.value = model;
        setProviderStatus(`모델 선택 · ${model} · 저장 버튼을 누르면 적용됩니다.`, 'ok');
      });
    }
    for (const button of root.querySelectorAll('.load-provider-models[data-load-models-profile]')) {
      const profileName = text(button.getAttribute('data-load-models-profile')).trim() || 'primary';
      syncProviderModelPicker(profileName);
      button.addEventListener('click', async () => {
        if (Runtime.providerModelLoading.has(profileName)) return;
        const { profile, meta } = syncProviderModelPicker(profileName);
        if (!meta) {
          setProviderStatus(`${providerLabel(profile.provider)}는 자동 모델 목록 조회가 등록되어 있지 않습니다.`, 'error');
          return;
        }
        Runtime.providerModelLoading.add(profileName);
        const status = root.querySelector(`[data-provider-model-status="${profileName}"]`);
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = '불러오는 중…';
        if (status) status.textContent = '조회 중';
        setProviderStatus(`${meta.label} 모델 목록을 불러오는 중…`);
        try {
          const models = await listProviderModels(profile, { force: true });
          populateProviderModelPicker(profileName, profile, models);
          setProviderStatus(`${meta.label} 모델 ${formatNumber(models.length)}개를 불러왔습니다.`, 'ok');
        } catch (error) {
          if (status) status.textContent = '조회 실패';
          setProviderStatus(`모델 목록 조회 실패: ${error?.message || error}`, 'error');
        } finally {
          Runtime.providerModelLoading.delete(profileName);
          button.textContent = originalText || '모델 목록 불러오기';
          syncProviderModelPicker(profileName);
        }
      });
    }
    for (const node of root.querySelectorAll('[data-provider-field$=".reasoningPreset"]')) {
      const profileName = text(node.getAttribute('data-provider-field')).split('.')[0];
      node.addEventListener('change', () => {
        const presetKey = syncReasoningPresetEditor(profileName, { applyDefaults: true });
        const definition = reasoningPresetDefinition(presetKey);
        setProviderStatus(`Reasoning preset ${definition.label} 기본값을 적용했습니다.`);
      });
      syncReasoningPresetEditor(profileName);
    }
    root.querySelector('#hayakuAutoRepairEnabled')?.addEventListener('change', async event => {
      try {
        const settings = await saveHayakuAutoRepairSelection(event.currentTarget);
        if (settings.hayakuAutoRepair === true) {
          const gate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
          if (gate.ready === true) {
            await registerHayakuRecoveryEventIpc().catch(error => warn('HAYAKU recovery event registration failed', error));
            scheduleHayakuAutoRepairSweep('setting_enabled', 100);
          }
        }
      } catch (error) {
        await retraceAlert(`자동 복구 설정 저장 실패\n${error?.message || error}`);
      }
    });
    root.querySelector('#saveProvider')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const settings = await saveSettings(readProviderSettingsFromUi());
        setProviderStatus(`저장 완료 · Primary 프로필 · ${providerLabel(settings.primary.provider)} · HAYAKU 자동 복구 ${settings.hayakuAutoRepair ? 'ON' : 'OFF'}`, 'ok');
        await refreshHayakuAutoRepairStatus();
        if (settings.hayakuAutoRepair === true) {
          const gate = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
          if (gate.ready === true) {
            await registerHayakuRecoveryEventIpc().catch(error => warn('HAYAKU recovery event registration failed', error));
            scheduleHayakuAutoRepairSweep('provider_saved', 100);
          }
        }
      } catch (error) {
        setProviderStatus(`저장 실패: ${error?.message || error}`, 'error');
      } finally {
        setBusy(false);
      }
    });
    for (const button of root.querySelectorAll('.test-provider[data-test-profile]')) {
      button.addEventListener('click', async () => {
        const profile = 'primary';
        setBusy(true);
        try {
          await saveSettings(readProviderSettingsFromUi());
          setProviderStatus(`${profile} 연결 테스트 중…`);
          const result = await callProfile(
            profile,
            'Return exactly the token MEMORY_SESSION_BRIDGE_PROVIDER_OK and nothing else.',
            'Provider connection test.',
            { maxTokens: 64, temperature: 0 }
          );
          if (!result.content.includes('MEMORY_SESSION_BRIDGE_PROVIDER_OK')) {
            throw new Error(`예상 토큰이 없는 응답: ${compact(result.content, 120)}`);
          }
          setProviderStatus(`${profile} 연결 성공 · ${result.provider} · ${result.model}`, 'ok');
        } catch (error) {
          setProviderStatus(`${profile} 연결 실패: ${error?.message || error}`, 'error');
        } finally {
          setBusy(false);
        }
      });
    }
    root.querySelector('#runColdStart')?.addEventListener('click', async () => {
      if (analysisIsRunning()) {
        await retraceAlert('이미 분석 작업이 실행 중입니다. 실시간 분석 콘솔에서 진행 상태를 확인하세요.');
        return;
      }
      setBusy(true);
      try {
        const inspection = await inspectColdStart();
        if (!inspection.eligible) throw new Error(inspection.reason);
        const mode = inspection.recommendedMode;
        const pendingChunks = inspection.stagedRun?.run?.chunks
          ?.filter(chunk => chunk?.status !== 'verified').length || inspection.evidence.chunks.length;
        const confirmed = mode === 'readopt'
          ? '저장된 검증 캡슐을 HAYAKU 원장에 다시 채택합니다. 모델은 호출하지 않습니다.\n\n계속할까요?'
          : `현재 채팅 ${formatNumber(inspection.evidence.rows.length)}개 메시지의 ${formatNumber(pendingChunks)}개 청크를 분석합니다.\n`
            + `라이브 원장은 보존되며, Primary 프로필로 생성형 LLM을 최대 ${formatNumber(pendingChunks)}회 호출할 수 있습니다.\n\n계속할까요?`;
        if (!(await retraceConfirm(confirmed, { title: 'HAYAKU 콜드스타트', confirmLabel: '분석 시작' }))) return;
        const status = root.querySelector('#coldStartStatus');
        if (status) status.textContent = mode === 'readopt'
          ? '검증된 콜드스타트 캡슐을 다시 채택하는 중입니다.'
          : '콜드스타트를 백그라운드에서 시작합니다. GUI를 닫아도 분석은 계속됩니다.';
        setBusy(false);
        startBackgroundAnalysisTask('cold_start', mode, onProgress => executeColdStart({ mode, onProgress }));
        renderAnalysisConsole();
      } catch (error) {
        await retraceAlert(`HAYAKU 콜드스타트 실패\n${error?.message || error}`);
        await refreshColdStart();
      } finally {
        if (Runtime.busy) setBusy(false);
      }
    });
    root.querySelector('#runIncrementalRecovery')?.addEventListener('click', async () => {
      if (analysisIsRunning()) {
        await retraceAlert('이미 분석 작업이 실행 중입니다. 실시간 분석 콘솔에서 진행 상태를 확인하세요.');
        return;
      }
      setBusy(true);
      try {
        const inspection = await inspectIncrementalRecovery();
        if (!inspection.eligible) throw new Error(inspection.reason);
        const mode = inspection.recommendedMode;
        const pendingChunks = mode === 'resume'
          ? Math.max(0, Number(inspection.checkpointPlan?.pendingChunkCount ?? inspection.evidence.chunks.length) || 0)
          : inspection.evidence.chunks.length;
        const reusedChunks = mode === 'resume'
          ? Math.max(0, Number(inspection.checkpointPlan?.reusedVerifiedCount || 0) || 0)
          : 0;
        const confirmed = mode === 'readopt'
          ? '저장된 증분 재분석 캡슐을 HAYAKU 원장에 다시 채택합니다. 모델은 호출하지 않습니다.\n\n계속할까요?'
          : mode === 'resume'
            ? `기존 검증 청크 ${formatNumber(reusedChunks)}개는 그대로 재사용하고 실패·누락·변경 청크 ${formatNumber(pendingChunks)}개만 다시 분석합니다.\n`
              + `전체 누락 범위는 ${formatNumber(inspection.evidence.chunks.length)}개 청크이며, 실제 Primary 프로필 호출은 최대 ${formatNumber(pendingChunks)}회입니다.\n\n계속할까요?`
            : `누락 완료 턴 ${inspection.evidence.coverage.missingTurns.join(', ')}를 ${formatNumber(pendingChunks)}개 청크로 증분 분석합니다.\n`
              + `이미 커버된 턴과 콜드스타트 epoch는 변경하지 않습니다. Primary 프로필을 최대 ${formatNumber(pendingChunks)}회 호출할 수 있습니다.\n\n계속할까요?`;
        if (!(await retraceConfirm(confirmed, { title: 'HAYAKU 누락 복구', confirmLabel: '재분석 시작' }))) return;
        const status = root.querySelector('#incrementalRecoveryStatus');
        if (status) status.textContent = mode === 'readopt'
          ? '검증된 증분 재분석 캡슐을 다시 채택하는 중입니다.'
          : '누락 턴 증분 재분석을 백그라운드에서 시작합니다. GUI를 닫아도 분석은 계속됩니다.';
        setBusy(false);
        startBackgroundAnalysisTask('incremental_recovery', mode, onProgress => executeIncrementalRecovery({ mode, onProgress }));
        renderAnalysisConsole();
      } catch (error) {
        await retraceAlert(`HAYAKU 증분 재분석 실패\n${error?.message || error}`);
        await refreshIncrementalRecovery();
      } finally {
        if (Runtime.busy) setBusy(false);
      }
    });
    root.querySelector('#exportLibra')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const result = await readLibraSource(await getCurrentContext());
        if (!result.pluginAvailable) throw new Error('LIBRA IPC를 사용할 수 없습니다.');
        if (!result.inspectionAvailable || result.integrityOk === false) {
          throw new Error(`LIBRA는 연결되어 있지만 정본 조회를 검증하지 못했습니다: ${result.reason || 'unknown'}${result.errors?.[0] ? ` · ${result.errors[0]}` : ''}`);
        }
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        if (!downloadJson(`libra-memory-${stamp}.json`, {
          exportedAt: new Date().toISOString(), plugin: PLUGIN_NAME, pluginVersion: PLUGIN_VERSION,
          source: result.readSource, libraVersion: result.pluginVersion, scope: result.scope,
          manifest: result.manifest, integrity: result.integrity, memories: result.memories,
          worldAdditional: result.worldAdditional
        })) throw new Error('브라우저 다운로드를 시작하지 못했습니다.');
      } catch (error) {
        await retraceAlert(`LIBRA 내보내기 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    root.querySelector('#exportFlashback')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const result = await readFlashbackViewer(await getCurrentContext());
        if (!result.available) throw new Error(`내보낼 Flashback 기억이 없습니다: ${result.reason}`);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const payload = {
          exportedAt: new Date().toISOString(),
          plugin: PLUGIN_NAME,
          pluginVersion: PLUGIN_VERSION,
          source: 'flashback_plugin_storage',
          scope: result.sourceScope,
          manifest: result.manifest,
          integrity: {
            loadedRecords: result.loadedRecords,
            manifestRecords: result.manifestRecords,
            shardCount: result.shardCount,
            missingShards: result.missingShards,
            corruptShards: result.corruptShards,
            recordCountMismatch: result.recordCountMismatch
          },
          records: result.items
        };
        if (!downloadJson(`flashback-memory-${stamp}.json`, payload)) throw new Error('브라우저 다운로드를 시작하지 못했습니다.');
      } catch (error) {
        await retraceAlert(`Flashback 내보내기 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    root.querySelector('#backupHayaku')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const result = await backupHayakuLedger();
        await retraceAlert(
          `HAYAKU 미러 원장 백업을 완료했습니다.\n`
          + `레코드 ${formatNumber(result.recordCount)}개 · 슬롯 ${formatNumber(result.slotHeadCount)}개\n`
          + `백업 ID ${result.backupId}\n검증 ${result.verified ? '완료' : '실패'}`
        );
      } catch (error) {
        await retraceAlert(`HAYAKU 미러 원장 백업 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    root.querySelector('#exportHayaku')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const context = await getCurrentContext();
        const result = await readHayakuSource(context);
        if (!result.available) throw new Error(`내보낼 HAYAKU 원장이 없습니다: ${result.reason}`);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        downloadJson(`hayaku-ledger-${stamp}.json`, {
          exportedAt: new Date().toISOString(),
          source: PLUGIN_NAME,
          scope: result.scope,
          ledger: result.ledger
        });
      } catch (error) {
        await retraceAlert(`HAYAKU 내보내기 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    root.querySelector('#createSession')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const preview = await inspectTransition();
        const compatibilitySuite = await inspectCompatibilitySuite(preview, { timeoutMs: 3800, forceProbe: true });
        renderCompatibilitySuite(compatibilitySuite);
        if (!compatibilitySuite.compatible) {
          const blocking = (compatibilitySuite.blocking || []).map(item => `${item.label}: ${item.reason}`).join('\n');
          await retraceAlert(`다음 세션 승계를 시작할 수 없습니다.\n\n${blocking}\n\nRE:TRACE 홈 상단의 호환성 패널에서 각 플러그인의 계약 상태를 확인하세요.`);
          return;
        }
        if (preview.pendingHandoff?.pending) {
          const retryMessage = '미완료 다음 세션 handoff를 같은 target/transfer로 다시 검증합니다. 새 채팅은 추가로 만들지 않습니다.\n\n계속할까요?';
          if (!(await retraceConfirm(retryMessage, { title: '미완료 승계 재검증', confirmLabel: '재검증' }))) return;
          const retried = await resumeNextSessionHandoff({
            targetChatId: preview.pendingHandoff.targetChatId,
            transferId: preview.pendingHandoff.journal.transferId
          });
          await retraceAlert(retried.ok
            ? `다음 세션 handoff 재개가 완료되었습니다.\ntransferId: ${retried.transferId}`
            : `다음 세션 handoff가 아직 미완료입니다. 같은 버튼으로 다시 재시도할 수 있습니다.\ntransferId: ${retried.transferId}`);
          await refreshTransition();
          return;
        }
        const message = `새 채팅을 만들고 기억을 이어갈까요?\n\n`
          + (preview.includeLibra
            ? `LIBRA 정본 레코드 ${formatNumber(preview.libraRecordCount)}개\n`
            : 'LIBRA 데이터 없음\n')
          + (isLiaLivePersonaId(preview.identity?.personaId) ? 'LIA Live Persona · 새 채팅 전용 Fork\n' : 'LIA Live Persona 없음\n')
          + `Flashback 기억 ${formatNumber(preview.flashback.records)}개\n`
          + (preview.includeHayaku
            ? `HAYAKU 패킷 ${formatNumber(preview.hayakuRecordCount)}개 (Current ${formatNumber(preview.hayakuCurrentRecordCount || 0)} · Recovery ${formatNumber(preview.hayakuRecoveryRecordCount || 0)} · Archive ${formatNumber(preview.hayakuArchiveRecordCount || 0)})`
            : 'HAYAKU 원장 없음')
          + '\n\n원본 채팅과 원장은 그대로 보존됩니다.';
        if (!(await retraceConfirm(message, { title: '다음 세션 만들기', confirmLabel: '승계 시작' }))) return;
        const result = await continueToNextSession();
        if (!result.ok) {
          const failedOwners = [
            result.flashbackVerified ? '' : result.flashbackRecords > 0 ? `Flashback: ${result.flashbackAdoption?.reason || 'not_verified'}` : '',
            result.hayakuVerified ? '' : result.hayakuRecords > 0 ? `HAYAKU: ${result.hayakuAdoption?.reason || 'not_verified'}` : '',
            result.libraVerified ? '' : result.libraScheduled ? `LIBRA: ${result.libraVerification?.reason || result.libraAdoption?.reason || 'not_verified'}` : '',
            result.liaVerified ? '' : result.liaRequired ? `LIA: ${result.liaAdoption?.reason || 'not_verified'}` : ''
          ].filter(Boolean);
          await retraceAlert(`새 채팅은 보존되었지만 일부 승계 대상의 owner handoff가 아직 미완료입니다. 같은 버튼으로 동일 target/transfer를 재시도할 수 있습니다.\ntransferId: ${result.transferId}${failedOwners.length ? `\n\n${failedOwners.join('\n')}` : ''}`);
          await refreshTransition();
          return;
        }
        const flashbackStatus = result.flashbackVerified
          ? `Flashback 기억 승계 확인: ${formatNumber(result.flashbackAdoption?.records || result.flashbackRecords)}개`
          : result.flashbackRecords > 0
            ? `Flashback 승계 표식 저장 · 즉시 검증 실패: ${result.flashbackAdoption?.reason || 'unknown'}`
            : 'Flashback 기억 없음';
        const hayakuStatus = result.hayakuVerified
          ? `HAYAKU 패킷 승계 확인: ${formatNumber(result.hayakuAdoption?.records || result.hayakuRecords)}개`
          : result.hayakuRecords > 0
            ? `HAYAKU 승계 표식 저장 · 즉시 검증 실패: ${result.hayakuAdoption?.reason || 'unknown'}`
            : 'HAYAKU 원장 없음';
        const libraStatus = result.libraVerified
          ? `LIBRA 데이터 승계 확인: ${formatNumber(result.libraAdoption?.records || result.libraRecords)}개`
          : result.libraRecords > 0
            ? `LIBRA 승계 표식 저장 · 영속 검증 실패: ${result.libraAdoption?.reason || 'unknown'}`
            : 'LIBRA 데이터 없음';
        const liaStatus = result.liaRequired
          ? result.liaVerified
            ? `LIA Live Persona Fork 확인: ${result.targetLivePersonaId || result.liaAdoption?.livePersonaName || 'new Live Persona'}`
            : `LIA Live Persona Fork 검증 실패: ${result.liaAdoption?.reason || 'unknown'}`
          : 'LIA Live Persona 없음';
        await retraceAlert(
          `다음 세션을 만들었습니다.\n`
          + `${libraStatus}\n`
          + `${liaStatus}\n`
          + `${flashbackStatus}\n`
          + hayakuStatus
          + '\n\n원본 채팅과 원장은 그대로 보존됩니다.'
        );
        await refreshTransition();
      } catch (error) {
        await retraceAlert(`다음 세션 만들기 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
  };

  const ensureRoot = () => {
    if (Runtime.root?.isConnected) return Runtime.root;
    const root = document.createElement('div');
    root.id = 'flashback-hayaku-bridge-root';
    root.style.width = '100%';
    root.style.height = '100vh';
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.justifyContent = 'center';
    root.style.background = '#090b10';
    document.body.appendChild(root);
    Runtime.root = root;
    return root;
  };

  const stopAnalysisRefreshTimer = () => {
    if (Runtime.analysisRefreshTimer != null) {
      try { globalThis.clearInterval?.(Runtime.analysisRefreshTimer); } catch (_) {}
      Runtime.analysisRefreshTimer = null;
    }
  };
  const startAnalysisRefreshTimer = () => {
    stopAnalysisRefreshTimer();
    if (typeof globalThis.setInterval !== 'function') return;
    Runtime.analysisRefreshTimer = globalThis.setInterval(() => {
      if (!Runtime.visible) return stopAnalysisRefreshTimer();
      renderAnalysisConsole();
    }, 1000);
    Runtime.analysisRefreshTimer?.unref?.();
  };

  const showUi = async () => {
    Runtime.visible = true;
    const api = liveApi(['showContainer']) || liveApi();
    try { if (typeof api?.showContainer === 'function') await api.showContainer('fullscreen'); } catch (error) { warn('showContainer failed', error); }
    await loadSettings();
    ensureRoot();
    renderShell();
    Runtime.mounted = true;
    startAnalysisRefreshTimer();
    if (Runtime.activeTab === 'flashback') await refreshFlashback();
    else if (Runtime.activeTab === 'hayaku') await refreshHayaku();
    else if (Runtime.activeTab === 'coldstart') {
      await Promise.all([refreshColdStart(), refreshIncrementalRecovery(), refreshHayakuAutoRepairStatus()]);
    }
    else await refreshTransition();
  };

  const closeUi = async () => {
    Runtime.visible = false;
    stopAnalysisRefreshTimer();
    const api = liveApi(['hideContainer']) || liveApi();
    try { if (typeof api?.hideContainer === 'function') await api.hideContainer(); } catch (error) { warn('hideContainer failed', error); }
  };

  const bridgeIconSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 17h18M4 20h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 7v13M17 7v13M5.5 7h3M15.5 7h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 13.5C5.2 13.5 5.3 8 7 8c1.8 0 2.5 4 5 4s3.2-4 5-4c1.7 0 1.8 5.5 4 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const iconSvg = bridgeIconSvg;

  const registerUi = async () => {
    const api = liveApi();
    if (!api) throw new Error('RisuAI API가 없습니다.');
    if (!Runtime.registered.setting && typeof api.registerSetting === 'function') {
      try { Runtime.registered.setting = await api.registerSetting(PLUGIN_NAME, showUi, iconSvg, 'html') || { uncertain: true }; }
      catch (error) { if (!/already|duplicate|exist/i.test(text(error?.message || error))) warn('registerSetting failed', error); }
    }
    if (!Runtime.registered.hamburger && typeof api.registerButton === 'function') {
      try {
        Runtime.registered.hamburger = await api.registerButton({
          name: PLUGIN_NAME,
          icon: iconSvg,
          iconType: 'html',
          location: 'hamburger'
        }, showUi) || { uncertain: true };
      } catch (error) {
        if (!/already|duplicate|exist/i.test(text(error?.message || error))) warn('registerButton failed', error);
      }
    }
  };

  const RetraceApi = Object.freeze({
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    showUi,
    closeUi,
    inspectTransition,
    inspectCompatibility: inspectCompatibilitySuite,
    continueToNextSession,
    inspectPendingNextSessionHandoff,
    inspectPendingHandoffDurableStatus,
    reconcilePendingHandoffJournalFromDurableReadback,
    resumeNextSessionHandoff,
    exportDebugLogFile: exportRetraceDebugLogFile,
    debugSnapshot: buildRetraceDebugExport,
    adoptFlashbackSessionHandoff,
    adoptHayakuSessionHandoff,
    inspectColdStart,
    executeColdStart,
    reAdoptColdStart,
    inspectIncrementalRecovery,
    executeIncrementalRecovery,
    reAdoptIncrementalRecovery,
    runHayakuAutoRepairSweep,
    probeLiveHayakuOwner,
    deleteHayakuRecord,
    regenerateHayakuRecord,
    jumpToHayakuTurn,
    backupHayakuLedger,
    listHayakuLedgerBackups,
    loadSettings,
    saveSettings,
    async listProviderModels(profile = null, options = {}) {
      const source = profile || (await loadSettings()).primary;
      return await listProviderModels(source, options || {});
    },
    resetProviderModelCache() { ProviderModelCache.clear(); return true; },
    testProvider: () => callProfile('primary', 'Return exactly MEMORY_SESSION_BRIDGE_PROVIDER_OK.', 'Connection test.', { maxTokens: 64, temperature: 0 }),
    readFlashbackViewer: async () => readFlashbackViewer(await getCurrentContext()),
    readHayakuViewer: async () => readHayakuViewerSource(await getCurrentContext()),
    readLibraViewer: async () => await readLibraSource(await getCurrentContext(), { includeRecords: true }),
    lastTransition: () => clone(Runtime.lastTransition, null),
    lastColdStart: () => clone(Runtime.lastColdStart, null),
    lastIncrementalRecovery: () => clone(Runtime.lastIncrementalRecovery, null),
    lastHayakuBackup: () => clone(Runtime.lastHayakuBackup, null),
    analysisStatus: analysisProgressSnapshot,
    waitForAnalysis: () => Runtime.analysisTask?.promise || Promise.resolve(null),
    _test: {
      fnv1a, flashbackKeyHash, flashbackShardChecksum, stableHash64, flashbackShardStorageKey, hayakuScopeFor, contextIdentity,
      requestFlashbackIpc, flashbackSourceFromInspection,
      inspectFlashbackNonDestructiveHandoffCapability,
      flashbackSourceStorageIntegritySnapshotForRetrace, compareFlashbackSourceStorageIntegrityForRetrace,
      verifyFlashbackSessionHandoffFromStorage,
      requestHayakuIpc, probeLiveHayakuOwner, ensureHayakuOwnerReady,
      scheduleHayakuAutoRepairSweep, runHayakuAutoRepairSweep, executeHayakuAutomaticRepairDebt,
      normalizeHayakuPacketAuthoringProfile, fallbackHayakuPacketAuthoringProfile,
      buildBridgeHayakuAuthoringPrompt, bridgeHayakuPromptSet,
      packetItemText, packetRows, packetInfo,
      isFlashbackInheritedRecord, compareFlashbackTimelineRecords, compareHayakuTimelineRecords,
      effectiveHayakuRecords,
      collectColdStartEvidence, collectIncrementalRecoveryEvidence, compareEvidenceSourceSnapshot, hayakuTurnCoverage,
      verifyDurableHayakuColdStart, verifyDurableHayakuIncrementalRecovery,
      activeHayakuTombstones, hayakuTombstoneIsUserSuppressed, hayakuTombstoneRecord,
      hayakuTombstoneTurnRange, hayakuTombstoneMatchesActiveWorldline,
      recordRegenerationTurns, resolveTurnNavigationTarget,
      extractJsonObject, normalizeBridgeRecallAliases, normalizeColdStartPacket, normalizeIncrementalRecoveryPacket,
      validateBridgeCapsulePacketSet, bridgePacketHasSemanticPayload, priorTurnContextForChunk,
      requestLibraIpc, probeLibraIpc, normalizeLibraInspection, readLibraSource,
      peerCompatibilityPayload, evaluatePeerCompatibility, inspectCompatibilitySuite, probeUniversalPeerCompatibility, sourcePreservationReceiptMatches,
      requestLiaIpc, adoptLiaLivePersonaHandoff, liaAdoptionReceiptMatches, isLiaLivePersonaId,
      prepareLibraSessionHandoff, adoptLibraSessionHandoff, adoptLibraSessionHandoffDurable, verifyDurableLibraSessionHandoff,
      requiredHandoffsVerified,
      sealNextSessionHandoffJournal, nextSessionHandoffJournalFromChat,
      inspectPendingNextSessionHandoff, inspectPendingHandoffDurableStatus, reconcilePendingHandoffJournalFromDurableReadback, persistNextSessionHandoffJournal, performPendingNextSessionHandoff,
      verifyHayakuSessionHandoffFromStorage, buildRetraceDebugExport, retraceDebugSafeValue,
      libraMemoryViewerInfo,
      coldStartChunkHash, coldStartConfigHash, incrementalRecoveryConfigHash,
      incrementalRecoveryCheckpointBodyReusable, incrementalRecoveryCheckpointPlan,
      analysisProgressSnapshot, analysisIsRunning, startBackgroundAnalysisTask,
      hayakuAdoptionDiagnosticText,
      HAYAKU_PACKET_MAX_CHARS, HAYAKU_PACKET_FALLBACK_MAX_CHARS,
      effectiveHayakuPacketMaxChars, hayakuPacketMaxCharsFrom,
      HAYAKU_ANALYSIS_MAX_OUTPUT_TOKENS,
      readColdStartRun, readIncrementalRecoveryRun,
      normalizeReasoningPresetKey, reasoningPresetDefinition,
      effectiveReasoningFamily, reasoningState,
      providerModelLeaf, isGpt56Model, isKimiK3Model, isClaudeOpus5Model, isGemini3Model,
      ollamaBaseUrl, ollamaApiUrl, providerModelMetadata, normalizeProviderModels, providerModelCacheKey, cachedProviderModelEntry, listProviderModels,
      callProfile
    }
  });
  globalThis.__RETRACE = RetraceApi;
  // Stable compatibility aliases for existing HAYAKU/Flashback integrations
  // and user scripts that already call the pre-rename bridge API.
  globalThis.__LihaflBridge = RetraceApi;
  globalThis.__MemorySessionBridge = RetraceApi;

  await registerFlashbackIpc().catch(error => warn('Flashback IPC registration failed', error));
  // Register only the response channel needed for the minimal live-owner probe.
  // Every other HAYAKU subsystem listener and worker remains absent until that
  // authenticated probe succeeds.
  await registerHayakuIpc().catch(error => warn('HAYAKU IPC registration failed', error));
  await loadSettings().catch(() => normalizeSettings({}));
  await registerLibraIpc().catch(error => warn('LIBRA IPC registration failed', error));
  await registerLiaIpc().catch(error => warn('LIA IPC registration failed', error));
  await registerUi();
  if (Runtime.settings?.hayakuAutoRepair === true) {
    const startupAutoRepairTimer = setTimeout(() => {
      void (async () => {
        const startupOwner = await probeLiveHayakuOwner({ force: true, timeoutMs: 2200 });
        if (startupOwner.ready === true) {
          await registerHayakuRecoveryEventIpc().catch(error => warn('HAYAKU recovery event registration failed', error));
          scheduleHayakuAutoRepairSweep('startup', 1200);
        }
      })().catch(error => warn('HAYAKU deferred startup probe failed', error));
    }, 700);
    startupAutoRepairTimer?.unref?.();
  }
  const unloadApi = liveApi(['onUnload']);
  if (typeof unloadApi?.onUnload === 'function') {
    await unloadApi.onUnload(async () => {
      Runtime.visible = false;
      stopAnalysisRefreshTimer();
      cancelCompatibilityAutoRetry();
      for (const pending of Runtime.flashbackIpcPending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error('RE:TRACE unloaded before Flashback IPC completed.'));
      }
      Runtime.flashbackIpcPending.clear();
      for (const pending of Runtime.hayakuIpcPending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error('RE:TRACE unloaded before HAYAKU IPC completed.'));
      }
      Runtime.hayakuIpcPending.clear();
      if (Runtime.hayakuAutoRepair.timer != null) clearTimeout(Runtime.hayakuAutoRepair.timer);
      Runtime.hayakuAutoRepair.timer = null;
      for (const pending of Runtime.libraIpcPending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error('RE:TRACE unloaded before LIBRA IPC completed.'));
      }
      Runtime.libraIpcPending.clear();
      for (const pending of Runtime.liaIpcPending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error('RE:TRACE unloaded before LIA IPC completed.'));
      }
      Runtime.liaIpcPending.clear();
      try { Runtime.root?.remove?.(); } catch (_) {}
      Runtime.root = null;
      Runtime.mounted = false;
    });
  }
  console.log(`[${PLUGIN_NAME}] v${PLUGIN_VERSION} ready.`);
})().catch(error => {
  try { console.error('[RE:TRACE] initialization failed', error); } catch (_) {}
});
