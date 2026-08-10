//@name flashback_hayaku_bridge
//@display-name RE:TRACE
//@api 3.0
//@version 1.9.15
//@allowed-ipc libra
//@allowed-ipc flashback_memory
//@allowed-ipc hayaku_locator_continuity
//@allowed-ipc lia_persona_linker
//@allowed-ipc serial_gradation_agents_for_rp
//@update-url https://raw.githubusercontent.com/rusinus12-droid/RETRACE/refs/heads/main/RETRACE.js
//@description LIBRA, GRADIA, HAYAKU, Flashback, and LIA Live Persona continuity analysis and next-session handoff bridge
//@author Hayaku

(async () => {
  'use strict';

  const PLUGIN_NAME = 'RE:TRACE';
  const PLUGIN_VERSION = '1.9.15';
  const HANDOFF_SCHEMA = 'memory-session-bridge-v1';
  const LIBRA_PLUGIN_ID = 'libra';
  const LIBRA_IPC_SCHEMA = 'libra-retrace-ipc-v1';
  const LIBRA_IPC_REQUEST_CHANNEL = 'libra_memory_bridge_request_v1';
  const LIBRA_IPC_RESPONSE_CHANNEL = 'libra_memory_bridge_response_v1';
  const LIBRA_INSPECT_SCHEMA = 'libra.retrace.inspect.v1';
  const LIBRA_CAPABILITIES_SCHEMA = 'libra.retrace.capabilities.v1';
  const LIBRA_HANDOFF_RECEIPT_SCHEMA = 'libra.session_handoff.receipt.v1';
  const LIBRA_CHAT_HANDOFF_MARKER_SCHEMA = 'retrace.libra_handoff_marker.v1';
  const GRADIA_PLUGIN_ID = 'serial_gradation_agents_for_rp';
  const GRADIA_IPC_SCHEMA = 'gradia-retrace-ipc-v1';
  const GRADIA_IPC_REQUEST_CHANNEL = 'gradia_retrace_bridge_request_v1';
  const GRADIA_IPC_RESPONSE_CHANNEL = 'gradia_retrace_bridge_response_v1';
  const GRADIA_INSPECT_SCHEMA = 'gradia.retrace.inspect.v1';
  const GRADIA_CAPABILITIES_SCHEMA = 'gradia.retrace.capabilities.v1';
  const GRADIA_HANDOFF_RECEIPT_SCHEMA = 'gradia.session_handoff.receipt.v1';
  const GRADIA_CHAT_HANDOFF_MARKER_SCHEMA = 'retrace.gradia_handoff_marker.v1';
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
  const HAYAKU_PLUGIN_ID = 'hayaku_locator_continuity';
  const HAYAKU_IPC_SCHEMA = 'hayaku-memory-bridge-ipc-v1';
  const HAYAKU_IPC_REQUEST_CHANNEL = 'hayaku_memory_bridge_request_v1';
  const HAYAKU_IPC_RESPONSE_CHANNEL = 'hayaku_memory_bridge_response_v1';
  const HAYAKU_IPC_MUTATION_ACTIONS = new Set([
    'adopt_cold_start',
    'adopt_incremental_recovery',
    'sync_analysis_capsules',
    'adopt_session_handoff',
    'forget'
  ]);
  const FLASHBACK_REGISTRY_KEY = 'vector_rag_memory:scope_registry:v2';
  const FLASHBACK_SCOPE_PREFIX = 'vector_rag_memory:scope:';
  const HAYAKU_LEDGER_PREFIX = 'hayaku.v2.ledger.';
  const HAYAKU_LEDGER_SCHEMAS = new Set(['hayaku_storage_ledger_v1', 'hayaku_storage_ledger_v2']);
  const SETTINGS_KEY = 'memory_session_bridge:settings:v1';
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
    hayakuActionRecords: [],
    hayakuMaxTurn: 0,
    settings: null,
    providerHealth: new Map(),
    providerModelLoading: new Set(),
    flashbackIpcRegistered: false,
    flashbackIpcPending: new Map(),
    hayakuIpcRegistered: false,
    hayakuIpcPending: new Map(),
    hayakuIpcUnavailableUntil: 0,
    libraIpcRegistered: false,
    libraIpcPending: new Map(),
    libraIpcLastSeenAt: 0,
    libraIpcLastError: '',
    gradiaIpcRegistered: false,
    gradiaIpcPending: new Map(),
    gradiaIpcLastSeenAt: 0,
    gradiaIpcLastError: '',
    liaIpcRegistered: false,
    liaIpcPending: new Map(),
    liaIpcLastError: '',
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

  const storageGet = async key => {
    const api = liveApi();
    if (!api?.pluginStorage?.getItem) return null;
    try { return await api.pluginStorage.getItem(key); } catch (error) { warn(`storage read failed: ${key}`, error); return null; }
  };

  const storageSet = async (key, value) => {
    const api = liveApi();
    if (!api?.pluginStorage?.setItem) return false;
    try {
      await api.pluginStorage.setItem(key, value);
      return true;
    } catch (error) {
      warn(`storage write failed: ${key}`, error);
      return false;
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
    primary: Object.freeze({ ...DEFAULT_PROFILE })
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
      primary: !primaryHasConnection && legacyAuxHasConnection ? legacyAux : primary
    };
  };
  const loadSettings = async force => {
    if (!force && Runtime.settings) return Runtime.settings;
    Runtime.settings = normalizeSettings(parseJson(await storageGet(SETTINGS_KEY), {}));
    return Runtime.settings;
  };
  const saveSettings = async value => {
    const settings = normalizeSettings(value);
    if (!await storageSet(SETTINGS_KEY, JSON.stringify(settings))) throw new Error('프로바이더 설정을 저장하지 못했습니다.');
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

  const getCurrentContext = async () => {
    const indexed = liveApi(['getCurrentCharacterIndex', 'getCurrentChatIndex', 'getCharacterFromIndex', 'getChatFromIndex']);
    if (indexed) {
      const [characterIndexRaw, chatIndexRaw] = await Promise.all([
        indexed.getCurrentCharacterIndex(),
        indexed.getCurrentChatIndex()
      ]);
      const characterIndex = Number(characterIndexRaw);
      const chatIndex = Number(chatIndexRaw);
      if (Number.isInteger(characterIndex) && characterIndex >= 0 && Number.isInteger(chatIndex) && chatIndex >= 0) {
        const [character, chat] = await Promise.all([
          indexed.getCharacterFromIndex(characterIndex),
          indexed.getChatFromIndex(characterIndex, chatIndex)
        ]);
        if (character && chat) return { character, chat, characterIndex, chatIndex, source: 'indexed' };
      }
    }
    const direct = liveApi(['getCharacter']) || liveApi(['getChar']) || liveApi();
    const character = typeof direct?.getCharacter === 'function'
      ? await direct.getCharacter()
      : typeof direct?.getChar === 'function'
        ? await direct.getChar()
        : null;
    if (!character) throw new Error('현재 캐릭터를 불러올 수 없습니다.');
    const chats = Array.isArray(character.chats) ? character.chats : [];
    const chatIndex = Number.isInteger(character.chatPage) ? character.chatPage : 0;
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
        clearTimeout(pending.timer);
        if (response.ok === true) pending.resolve(response.result);
        else pending.reject(new Error(text(response.error || 'Flashback IPC request failed.')));
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
    const timeoutMs = Math.max(250, Math.min(15000, Number(options.timeoutMs || 2500) || 2500));
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        Runtime.flashbackIpcPending.delete(requestId);
        const error = new Error(`Flashback IPC timed out after ${timeoutMs}ms.`);
        error.code = 'FLASHBACK_IPC_TIMEOUT';
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
        if (HAYAKU_IPC_MUTATION_ACTIONS.has(pending.action) && sender !== HAYAKU_PLUGIN_ID) return;
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
    if (Date.now() < Number(Runtime.hayakuIpcUnavailableUntil || 0)) {
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
        Runtime.hayakuIpcUnavailableUntil = Date.now() + 10000;
        const error = new Error(`HAYAKU IPC timed out after ${timeoutMs}ms.`);
        error.code = 'HAYAKU_IPC_TIMEOUT';
        reject(error);
      }, timeoutMs);
      Runtime.hayakuIpcPending.set(requestId, { resolve, reject, timer, action, at: Date.now() });
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
    const timeoutMs = Math.max(400, Math.min(30000, Number(options.timeoutMs || 4000) || 4000));
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


  const registerGradiaIpc = async () => {
    if (Runtime.gradiaIpcRegistered) return true;
    const api = liveApi(['addPluginChannelListener', 'postPluginChannelMessage']);
    if (typeof api?.addPluginChannelListener !== 'function'
      || typeof api?.postPluginChannelMessage !== 'function') return false;
    await api.addPluginChannelListener(
      GRADIA_IPC_RESPONSE_CHANNEL,
      (message, metadata = {}) => {
        const response = message && typeof message === 'object' && !Array.isArray(message) ? message : {};
        if (response.schema !== GRADIA_IPC_SCHEMA || response.kind !== 'response') return;
        const sender = text(metadata?.sender || '').trim();
        if (sender !== GRADIA_PLUGIN_ID) return;
        const requestId = text(response.requestId || '').trim();
        const pending = Runtime.gradiaIpcPending.get(requestId);
        if (!pending) return;
        if (text(response.action || '').trim() !== pending.action) return;
        Runtime.gradiaIpcPending.delete(requestId);
        Runtime.gradiaIpcLastSeenAt = Date.now();
        Runtime.gradiaIpcLastError = response.ok === true ? '' : text(response.error || 'GRADIA IPC request failed.');
        clearTimeout(pending.timer);
        if (response.ok === true) pending.resolve(response.result);
        else {
          const error = new Error(Runtime.gradiaIpcLastError || 'GRADIA IPC request failed.');
          error.code = 'GRADIA_IPC_REJECTED';
          error.remoteReachable = true;
          error.action = pending.action;
          pending.reject(error);
        }
      }
    );
    Runtime.gradiaIpcRegistered = true;
    return true;
  };

  const requestGradiaIpc = async (action, payload = {}, options = {}) => {
    const registered = await registerGradiaIpc().catch(error => {
      warn('GRADIA IPC listener registration failed', error);
      return false;
    });
    const api = liveApi(['postPluginChannelMessage']);
    if (!registered || typeof api?.postPluginChannelMessage !== 'function') {
      const error = new Error('GRADIA IPC API is unavailable. GRADIA v0.25.25 or later is required.');
      error.code = 'GRADIA_IPC_UNAVAILABLE';
      throw error;
    }
    const requestId = uuid();
    const timeoutMs = Math.max(400, Math.min(30000, Number(options.timeoutMs || 4000) || 4000));
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        Runtime.gradiaIpcPending.delete(requestId);
        const error = new Error(`GRADIA IPC timed out after ${timeoutMs}ms.`);
        error.code = 'GRADIA_IPC_TIMEOUT';
        error.action = text(action || '').trim();
        Runtime.gradiaIpcLastError = error.message;
        reject(error);
      }, timeoutMs);
      Runtime.gradiaIpcPending.set(requestId, { resolve, reject, timer, action: text(action || '').trim(), at: Date.now() });
      Promise.resolve(api.postPluginChannelMessage(
        GRADIA_PLUGIN_ID,
        GRADIA_IPC_REQUEST_CHANNEL,
        { schema: GRADIA_IPC_SCHEMA, kind: 'request', requestId, action: text(action || '').trim(), payload: clone(payload, {}) }
      )).catch(error => {
        const pending = Runtime.gradiaIpcPending.get(requestId);
        if (!pending) return;
        Runtime.gradiaIpcPending.delete(requestId);
        clearTimeout(pending.timer);
        Runtime.gradiaIpcLastError = text(error?.message || error);
        reject(error);
      });
    });
  };

  const probeGradiaIpc = async (options = {}) => {
    const timeoutMs = Math.max(500, Math.min(5000, Number(options.timeoutMs || 1800) || 1800));
    const attempts = Math.max(1, Math.min(3, Number(options.attempts || 2) || 2));
    let lastError = null;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const result = await requestGradiaIpc('ping', {}, { timeoutMs });
        const schemaOk = result?.schema === GRADIA_CAPABILITIES_SCHEMA;
        return {
          available: true, reachable: true, schemaOk, legacy: !schemaOk,
          pluginVersion: text(result?.pluginVersion || ''), capabilities: clone(result, {}),
          attempts: attempt, reason: schemaOk ? 'gradia_ping_ok' : 'gradia_ping_legacy_response'
        };
      } catch (error) {
        lastError = error;
        if (error?.remoteReachable === true || text(error?.code) === 'GRADIA_IPC_REJECTED') {
          return {
            available: true, reachable: true, schemaOk: false, legacy: true,
            pluginVersion: '', capabilities: {}, attempts: attempt,
            reason: 'gradia_ping_rejected_but_reachable', error: text(error?.message || error)
          };
        }
        if (attempt < attempts) await delay(120);
      }
    }
    return {
      available: false, reachable: false, schemaOk: false, legacy: false,
      pluginVersion: '', capabilities: {}, attempts,
      reason: text(lastError?.code || 'gradia_ipc_unavailable'), error: text(lastError?.message || lastError || '')
    };
  };

  const activeGradiaRuntime = () => {
    try {
      const candidate = globalThis.__SerialGradationAgentsForRP
        || globalThis.__pluginApis__?.serial_gradation_agents_for_rp
        || globalThis.__pluginApis__?.GRADIA;
      if (candidate && typeof candidate === 'object') return candidate;
    } catch (_) {}
    return null;
  };

  const normalizeGradiaInspection = (inspection, identity = {}, readSource = 'gradia_plugin_ipc') => {
    const source = inspection && typeof inspection === 'object' && !Array.isArray(inspection) ? inspection : {};
    const schemaOk = source.schema === GRADIA_INSPECT_SCHEMA;
    const scope = source.scope && typeof source.scope === 'object' ? source.scope : {};
    const requestedChatId = text(identity?.chatId || '').trim();
    const chatId = text(scope.chatId || '').trim();
    const scopeMatches = !requestedChatId || !chatId || requestedChatId === chatId;
    const integrityOk = schemaOk && scopeMatches && source?.integrity?.ok !== false;
    const counts = source.counts && typeof source.counts === 'object' ? clone(source.counts, {}) : {};
    const storyArcCount = Math.max(0, Math.min(1, Number(counts.storyArc || (source.storyArc ? 1 : 0)) || 0));
    const writerDesignCount = Math.max(0, Math.min(1, Number(counts.writerDesign || (source.writerDesign ? 1 : 0)) || 0));
    return {
      available: schemaOk && scopeMatches && integrityOk && (storyArcCount > 0 || writerDesignCount > 0),
      pluginAvailable: schemaOk,
      inspectionAvailable: schemaOk && scopeMatches,
      integrityOk,
      reason: !schemaOk ? 'gradia_ipc_contract_unavailable'
        : !scopeMatches ? 'gradia_scope_mismatch'
          : !integrityOk ? text(source?.integrity?.reason || 'gradia_integrity_failed')
            : (storyArcCount || writerDesignCount) ? 'loaded' : 'empty',
      readSource,
      pluginVersion: text(source.pluginVersion || ''),
      scope,
      integrity: clone(source.integrity, { ok: integrityOk }),
      counts: { ...counts, storyArc: storyArcCount, writerDesign: writerDesignCount },
      storyArc: source.storyArc && typeof source.storyArc === 'object' ? clone(source.storyArc, {}) : null,
      writerDesign: source.writerDesign && typeof source.writerDesign === 'object' ? clone(source.writerDesign, {}) : null,
      storyArcCount,
      writerDesignCount,
      manualUserIntentCount: Math.max(0, Number(counts.manualUserIntent || 0) || 0),
      storyArcBeatCount: Math.max(0, Number(counts.storyArcBeats || source.storyArc?.beats?.length || 0) || 0),
      completedTurnCount: Math.max(0, Number(counts.completedTurns || 0) || 0),
      snapshotHash: text(source.snapshotHash || ''),
      inspectedAt: text(source.inspectedAt || '')
    };
  };

  const readGradiaSource = async context => {
    const identity = contextIdentity(context || await getCurrentContext());
    const probe = await probeGradiaIpc({ timeoutMs: 1800, attempts: 2 });
    if (probe.available) {
      try {
        const inspected = await requestGradiaIpc('inspect', {}, { timeoutMs: 8000 });
        const normalized = normalizeGradiaInspection(inspected, identity, 'gradia_plugin_ipc');
        normalized.capabilities = clone(probe.capabilities, {});
        normalized.probe = clone(probe, {});
        return normalized;
      } catch (error) {
        const code = text(error?.code || '').trim();
        const reason = code === 'GRADIA_IPC_TIMEOUT' ? 'gradia_inspect_timeout' : 'gradia_inspect_failed';
        warn('GRADIA IPC inspection failed after successful discovery', error);
        return {
          available: false, pluginAvailable: true, inspectionAvailable: false, integrityOk: false,
          reason, readSource: 'gradia_plugin_ipc', pluginVersion: text(probe.pluginVersion || ''),
          scope: {}, integrity: { ok: false, reason }, counts: {}, storyArc: null, writerDesign: null,
          storyArcCount: 0, writerDesignCount: 0, manualUserIntentCount: 0, storyArcBeatCount: 0,
          completedTurnCount: 0, snapshotHash: '', capabilities: clone(probe.capabilities, {}), probe: clone(probe, {}),
          errors: [text(error?.message || error || reason)]
        };
      }
    }
    const runtime = activeGradiaRuntime();
    if (runtime && typeof runtime.inspectForRetrace === 'function') {
      try {
        const inspected = await runtime.inspectForRetrace();
        const normalized = normalizeGradiaInspection(inspected, identity, 'gradia_runtime_api');
        normalized.probe = clone(probe, {});
        return normalized;
      } catch (error) { warn('GRADIA runtime inspection failed', error); }
    }
    return {
      available: false, pluginAvailable: false, inspectionAvailable: false, integrityOk: false,
      reason: 'gradia_ipc_unavailable', readSource: 'none', pluginVersion: '', scope: {}, integrity: { ok: false },
      counts: {}, storyArc: null, writerDesign: null, storyArcCount: 0, writerDesignCount: 0,
      manualUserIntentCount: 0, storyArcBeatCount: 0, completedTurnCount: 0, snapshotHash: '',
      probe: clone(probe, {}), errors: [probe.error || 'GRADIA v0.25.25 or later IPC contract is required.']
    };
  };

  const gradiaReceiptCountMatches = (receipt, field, expected) => (
    Boolean(receipt && Object.prototype.hasOwnProperty.call(receipt, field))
    && Number.isInteger(Number(receipt[field]))
    && Number(receipt[field]) === expected
  );

  const gradiaOwnerReceiptMatches = (receipt, transport, mutation) => (
    transport !== 'gradia_plugin_ipc'
    || (
      text(receipt?.ownerPluginId || '') === GRADIA_PLUGIN_ID
      && text(receipt?.authorizedRequester || '') === 'flashback_hayaku_bridge'
      && text(receipt?.mutation || '') === mutation
    )
  );

  const gradiaPreparationReceiptMatches = (receipt, options, transport) => {
    const expectedStoryArc = Math.max(0, Math.min(1, Number(options?.expectedStoryArc || 0) || 0));
    const expectedWriterDesign = Math.max(0, Math.min(1, Number(options?.expectedWriterDesign || 0) || 0));
    return receipt?.schema === GRADIA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'prepared'
      && receipt?.prepared === true
      && receipt?.durable === true
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && gradiaReceiptCountMatches(receipt, 'storyArc', expectedStoryArc)
      && gradiaReceiptCountMatches(receipt, 'expectedStoryArc', expectedStoryArc)
      && gradiaReceiptCountMatches(receipt, 'writerDesign', expectedWriterDesign)
      && gradiaReceiptCountMatches(receipt, 'expectedWriterDesign', expectedWriterDesign)
      && gradiaOwnerReceiptMatches(receipt, transport, 'prepare_session_handoff');
  };

  const gradiaAdoptionReceiptMatches = (receipt, options, transport) => {
    const expectedStoryArc = Math.max(0, Math.min(1, Number(options?.expectedStoryArc || 0) || 0));
    const expectedWriterDesign = Math.max(0, Math.min(1, Number(options?.expectedWriterDesign || 0) || 0));
    return receipt?.schema === GRADIA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'adopted'
      && receipt?.verified === true
      && receipt?.durable === true
      && text(receipt?.targetChatId || '') === text(options?.targetChatId || '')
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && gradiaReceiptCountMatches(receipt, 'storyArc', expectedStoryArc)
      && gradiaReceiptCountMatches(receipt, 'expectedStoryArc', expectedStoryArc)
      && gradiaReceiptCountMatches(receipt, 'writerDesign', expectedWriterDesign)
      && gradiaReceiptCountMatches(receipt, 'expectedWriterDesign', expectedWriterDesign)
      && gradiaOwnerReceiptMatches(receipt, transport, 'adopt_session_handoff');
  };

  const gradiaVerificationReceiptMatches = (receipt, options, transport) => {
    const expectedStoryArc = Math.max(0, Math.min(1, Number(options?.expectedStoryArc || 0) || 0));
    const expectedWriterDesign = Math.max(0, Math.min(1, Number(options?.expectedWriterDesign || 0) || 0));
    return receipt?.schema === GRADIA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'verified'
      && receipt?.verified === true
      && receipt?.durable === true
      && text(receipt?.targetChatId || '') === text(options?.targetChatId || '')
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && gradiaReceiptCountMatches(receipt, 'storyArc', expectedStoryArc)
      && gradiaReceiptCountMatches(receipt, 'expectedStoryArc', expectedStoryArc)
      && gradiaReceiptCountMatches(receipt, 'writerDesign', expectedWriterDesign)
      && gradiaReceiptCountMatches(receipt, 'expectedWriterDesign', expectedWriterDesign)
      && gradiaOwnerReceiptMatches(receipt, transport, 'verify_session_handoff');
  };

  const prepareGradiaSessionHandoff = async options => {
    const runtime = activeGradiaRuntime();
    try {
      const result = await requestGradiaIpc('prepare_session_handoff', options || {}, { timeoutMs: 6000 });
      if (!gradiaPreparationReceiptMatches(result, options, 'gradia_plugin_ipc')) throw new Error('GRADIA handoff preparation receipt is invalid.');
      return { ...result, transport: 'gradia_plugin_ipc' };
    } catch (error) {
      if (runtime && typeof runtime.prepareSessionHandoff === 'function') {
        const result = await runtime.prepareSessionHandoff(options || {});
        if (!gradiaPreparationReceiptMatches(result, options, 'gradia_runtime_api')) throw new Error('GRADIA runtime handoff preparation receipt is invalid.');
        return { ...result, transport: 'gradia_runtime_api' };
      }
      throw error;
    }
  };

  const adoptGradiaSessionHandoff = async options => {
    const expectedStoryArc = Math.max(0, Math.min(1, Number(options?.expectedStoryArc || 0) || 0));
    const expectedWriterDesign = Math.max(0, Math.min(1, Number(options?.expectedWriterDesign || 0) || 0));
    const runtime = activeGradiaRuntime();
    try {
      const result = await requestGradiaIpc('adopt_session_handoff', options || {}, { timeoutMs: 12000 });
      return { ...result, transport: 'gradia_plugin_ipc' };
    } catch (error) {
      if (runtime && typeof runtime.adoptSessionHandoff === 'function') {
        try { return { ...(await runtime.adoptSessionHandoff(options || {})), transport: 'gradia_runtime_api' }; }
        catch (runtimeError) { error = runtimeError; }
      }
      return {
        schema: GRADIA_HANDOFF_RECEIPT_SCHEMA, action: 'adopted', adopted: false, verified: false, durable: false,
        storyArc: 0, expectedStoryArc, writerDesign: 0, expectedWriterDesign,
        targetChatId: text(options?.targetChatId || ''), transferId: text(options?.transferId || ''),
        transport: 'unavailable', reason: text(error?.message || error || 'gradia_handoff_adoption_failed')
      };
    }
  };

  const adoptGradiaSessionHandoffDurable = async options => {
    let last = null;
    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      last = await adoptGradiaSessionHandoff(options || {});
      if (gradiaAdoptionReceiptMatches(last, options, last?.transport)) return { ...last, attempts: attempt };
      if (attempt < maxAttempts) await delay(Math.min(1200, 220 * attempt));
    }
    return { ...(last || {}), attempts: maxAttempts, verified: false, durable: false, reason: 'gradia_handoff_receipt_mismatch' };
  };

  const verifyDurableGradiaSessionHandoff = async options => {
    if (options?.included !== true) return {
      schema: GRADIA_HANDOFF_RECEIPT_SCHEMA, action: 'verified', verified: true, durable: true,
      adopted: false, storyArc: 0, expectedStoryArc: 0, writerDesign: 0, expectedWriterDesign: 0, reason: 'no_gradia_data'
    };
    const payload = {
      transferId: text(options?.transferId || ''),
      targetChatId: text(options?.targetChatId || ''),
      expectedStoryArc: Math.max(0, Math.min(1, Number(options?.expectedStoryArc || 0) || 0)),
      expectedWriterDesign: Math.max(0, Math.min(1, Number(options?.expectedWriterDesign || 0) || 0))
    };
    const runtime = activeGradiaRuntime();
    try {
      const result = await requestGradiaIpc('verify_session_handoff', payload, { timeoutMs: 6000 });
      return gradiaVerificationReceiptMatches(result, payload, 'gradia_plugin_ipc')
        ? { ...result, transport: 'gradia_plugin_ipc' }
        : { ...result, verified: false, durable: false, transport: 'gradia_plugin_ipc', reason: 'gradia_handoff_receipt_mismatch' };
    } catch (error) {
      if (runtime && typeof runtime.verifySessionHandoff === 'function') {
        try {
          const result = await runtime.verifySessionHandoff(payload);
          return gradiaVerificationReceiptMatches(result, payload, 'gradia_runtime_api')
            ? { ...result, transport: 'gradia_runtime_api' }
            : { ...result, verified: false, durable: false, transport: 'gradia_runtime_api', reason: 'gradia_handoff_receipt_mismatch' };
        } catch (runtimeError) { error = runtimeError; }
      }
      return {
        schema: GRADIA_HANDOFF_RECEIPT_SCHEMA, action: 'verified', verified: false, durable: false,
        storyArc: 0, expectedStoryArc: payload.expectedStoryArc, writerDesign: 0, expectedWriterDesign: payload.expectedWriterDesign,
        targetChatId: payload.targetChatId, transferId: payload.transferId, transport: 'unavailable',
        reason: text(error?.message || error || 'gradia_handoff_verification_failed')
      };
    }
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
          adopt
        };
      }
      if (typeof candidate?.inspectMemoryLedger === 'function') {
        return {
          api: candidate,
          inspect: (...args) => candidate.inspectMemoryLedger(...args),
          adopt
        };
      }
      // v0.9.14 compatibility while users update Flashback and the bridge
      // independently. New releases expose the production memory.inspect API.
      if (typeof candidate?._test?.debugRecords === 'function') {
        return {
          api: candidate,
          inspect: (...args) => candidate._test.debugRecords(...args),
          adopt
        };
      }
    }
    return null;
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
        records: 0,
        reason: 'no_flashback_records'
      };
    }

    let last = null;
    const defaultAttempts = typeof runtime?.adopt === 'function' ? 8 : 2;
    const attempts = Math.max(1, Math.min(10, Number(options.attempts || defaultAttempts) || defaultAttempts));
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const request = { targetChatId, transferId, sourceScopeKey, expectedRecords };
        let transport = '';
        if (typeof runtime?.adopt === 'function') {
          last = await runtime.adopt(request);
          transport = 'same_realm_runtime';
        } else {
          last = await requestFlashbackIpc('adopt_session_handoff', request, {
            timeoutMs: Math.max(800, Number(options.ipcTimeoutMs || 3000) || 3000)
          });
          transport = 'risu_plugin_ipc';
        }
        const strictReceipt = last?.schema === 'flashback_memory.session_handoff_adoption.v2';
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
        const receiptMatches = strictReceipt
          && last?.verified === true
          && last?.durable === true
          && identityMatches
          && ownerMatches;
        if (receiptMatches) {
          return {
            ...last,
            ok: true,
            available: true,
            attempted: true,
            attempts: attempt,
            verified: true,
            durable: true,
            transport
          };
        }
      } catch (error) {
        last = {
          ok: false,
          verified: false,
          durable: false,
          reason: text(error?.code || error?.message || error) || 'flashback_adoption_failed',
          error: text(error?.message || error)
        };
      }
      if (attempt < attempts) await delay(100);
    }
    return {
      ...(last && typeof last === 'object' ? last : {}),
      ok: false,
      available: Boolean(runtime) || Runtime.flashbackIpcRegistered,
      attempted: true,
      attempts,
      verified: false,
      adopted: false,
      durable: false,
      records: Math.max(0, Number(last?.records || 0) || 0),
      reason: text(last?.reason || 'flashback_adoption_not_verified')
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
    const runtimeItems = inspected?.recordsIncluded === false
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
    const integrityOk = !manifestCorrupt && missingShards === 0 && corruptShards === 0 && !recordCountMismatch;
    return {
      available: canonicalRecords > 0 && integrityOk,
      reason: !integrityOk ? 'partial' : canonicalRecords > 0 ? 'loaded' : 'empty',
      records: canonicalRecords,
      shards,
      sourceScope,
      manifest,
      manifestKey: '',
      readSource,
      ...(runtimeItems == null ? {} : { runtimeItems }),
      runtimeStats: inspected?.stats && typeof inspected.stats === 'object' ? inspected.stats : null,
      missingShards,
      corruptShards,
      recordCountMismatch,
      manifestCorrupt,
      integrityOk
    };
  };

  const readFlashbackSource = async context => {
    const identity = contextIdentity(context);
    const runtime = activeFlashbackRuntime();
    if (runtime) {
      try {
        const inspected = await runtime.inspect(null, { includeRecords: true });
        const normalized = flashbackSourceFromInspection(inspected, identity, 'flashback_runtime_api');
        if (normalized) return normalized;
        warn('Flashback runtime ledger scope mismatch; trying IPC/pluginStorage', {
          expectedChatId: identity.chatId,
          runtimeChatId: text(inspected?.scope?.chatId || ''),
          runtimeScopeKey: text(inspected?.scope?.scopeKey || '')
        });
      } catch (error) {
        warn('Flashback runtime ledger inspection failed', error);
      }
    }

    try {
      const inspected = await requestFlashbackIpc('inspect', { includeRecords: true }, { timeoutMs: 1800 });
      const normalized = flashbackSourceFromInspection(inspected, identity, 'flashback_plugin_ipc');
      if (normalized && Array.isArray(normalized.runtimeItems)) return normalized;
      warn('Flashback IPC ledger records or scope unavailable; falling back to legacy pluginStorage', {
        expectedChatId: identity.chatId,
        ipcChatId: text(inspected?.scope?.chatId || ''),
        ipcScopeKey: text(inspected?.scope?.scopeKey || ''),
        recordsIncluded: inspected?.recordsIncluded === true
      });
    } catch (error) {
      if (text(error?.code || '') !== 'FLASHBACK_IPC_UNAVAILABLE') {
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
      return { available: false, reason: 'scope_not_registered', records: 0, shards: 0, sourceScope: null, readSource: 'plugin_storage_fallback' };
    }
    const manifestKey = `${FLASHBACK_SCOPE_PREFIX}${flashbackKeyHash(sourceScope.scopeKey)}:manifest:v2`;
    const manifest = parseJson(await storageGet(manifestKey), null);
    if (!manifest || text(manifest.scopeKey || '') !== text(sourceScope.scopeKey)) {
      return { available: false, reason: 'manifest_not_found', records: 0, shards: 0, sourceScope, manifest: null, readSource: 'plugin_storage_fallback' };
    }
    const records = Math.max(0, Number(manifest.count || manifest.stats?.recordTotal || 0) || 0);
    const shards = Math.max(0, Number(manifest.shardCount || 0) || 0);
    return {
      available: records > 0 && shards > 0,
      reason: records > 0 && shards > 0 ? 'loaded' : 'empty',
      records,
      shards,
      sourceScope,
      manifest,
      manifestKey,
      readSource: 'plugin_storage_fallback',
      integrityOk: null
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
      const fallbackParsed = parseJson(fallbackRaw, null);
      if (fallbackParsed && typeof fallbackParsed === 'object' && !Array.isArray(fallbackParsed)
        && text(fallbackParsed.commitId || '') === commitId) {
        storageKey = fallbackKey;
        raw = fallbackRaw;
        fallback = true;
      }
    }
    if (raw == null || raw === '') return { storageKey, shardIndex, records: [], missing: true, corrupt: false };
    const parsed = parseJson(raw, null);
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
    const source = await readFlashbackSource(context);
    if (!source.sourceScope?.scopeKey || !source.manifest) {
      return { ...source, items: [], loadedRecords: 0, missingShards: 0, corruptShards: 0, stats: { byType: {} } };
    }
    if (Array.isArray(source.runtimeItems)) {
      const items = source.runtimeItems;
      const manifestRecords = Math.max(0, Number(source.manifest?.count || source.records || 0) || 0);
      const missingShards = Math.max(0, Number(source.missingShards || source.manifest?.missingShards || 0) || 0);
      const corruptShards = Math.max(0, Number(source.corruptShards || source.manifest?.corruptShards || 0) || 0);
      const recordCountMismatch = source.recordCountMismatch === true
        || source.manifest?.recordCountMismatch === true
        || items.length !== manifestRecords;
      const manifestCorrupt = source.manifestCorrupt === true || source.manifest?.manifestCorrupt === true;
      const partial = manifestCorrupt || missingShards > 0 || corruptShards > 0 || recordCountMismatch;
      return {
        ...source,
        available: items.length > 0 && !partial,
        reason: partial ? 'partial' : items.length ? 'loaded' : 'empty',
        items,
        loadedRecords: items.length,
        manifestRecords,
        missingShards,
        corruptShards,
        recordCountMismatch,
        manifestCorrupt,
        integrityOk: !partial,
        shardCount: Math.max(0, Number(source.manifest?.shardCount || source.shards || 0) || 0),
        shards: [],
        stats: source.runtimeStats || summarizeFlashbackRecords(items)
      };
    }
    const scopeKey = source.sourceScope.scopeKey;
    const manifest = source.manifest;
    const manifestKey = text(source.manifestKey || '');
    const shardCount = Math.max(0, Math.min(2048, Number(manifest.shardCount || 0) || 0));
    const shards = [];
    for (let offset = 0; offset < shardCount; offset += 8) {
      const batch = Array.from(
        { length: Math.min(8, shardCount - offset) },
        (_, index) => readFlashbackShard(scopeKey, manifest, offset + index)
      );
      shards.push(...await Promise.all(batch));
    }
    const items = shards.flatMap(shard => shard.records);
    const missingShards = shards.filter(shard => shard.missing).length;
    const corruptShards = shards.filter(shard => shard.corrupt).length;
    const manifestRecords = Math.max(0, Number(manifest.count || manifest.stats?.recordTotal || 0) || 0);
    const recordCountMismatch = missingShards === 0 && items.length !== manifestRecords;
    const stats = summarizeFlashbackRecords(items);
    const partial = manifest.manifestCorrupt === true
      || missingShards > 0
      || corruptShards > 0
      || recordCountMismatch;
    return {
      ...source,
      manifest,
      manifestKey,
      available: items.length > 0,
      reason: partial ? 'partial' : items.length ? 'loaded' : 'empty',
      items,
      loadedRecords: items.length,
      manifestRecords,
      missingShards,
      corruptShards,
      recordCountMismatch,
      manifestCorrupt: manifest.manifestCorrupt === true,
      integrityOk: !partial && manifest.manifestCorrupt !== true,
      shardCount,
      shards: shards.map(({ storageKey, shardIndex, missing, corrupt, fallback }) => ({ storageKey, shardIndex, missing, corrupt, fallback })),
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

  const hayakuSourceResult = (ledger, scope, readSource, packetAuthoring = null) => {
    if (!ledger) return { available: false, reason: 'ledger_not_found', records: [], scope };
    if (!HAYAKU_LEDGER_SCHEMAS.has(ledger.version)) {
      return {
        available: false,
        reason: 'unsupported_schema',
        schema: text(ledger.version || ''),
        records: [],
        scope,
        ledger,
        readSource
      };
    }
    if (text(ledger.scopeKey || '') !== scope.scopeKey) {
      return { available: false, reason: 'scope_mismatch', records: [], scope, ledger, readSource };
    }
    const allRecords = Array.isArray(ledger.records)
      ? ledger.records.filter(record => record && typeof record === 'object' && text(record.raw || '').trim())
      : [];
    const records = effectiveHayakuRecords(ledger);
    return {
      available: records.length > 0,
      reason: records.length ? 'loaded' : 'empty',
      records,
      allRecords,
      scope,
      ledger,
      readSource,
      storageLimits: clone(ledger?.storageLimits || ledger?.storage || {}, {}),
      packetAuthoring: normalizeHayakuPacketAuthoringProfile(
        packetAuthoring || ledger?.packetAuthoring,
        readSource
      )
    };
  };

  const readHayakuSource = async context => {
    const scope = hayakuScopeFor(context);
    if (!scope.available) return { available: false, reason: scope.reason, records: [], scope };

    try {
      const inspected = await requestHayakuIpc('inspect', {}, { timeoutMs: 1500 });
      const inspectedLedger = inspected?.ledger && typeof inspected.ledger === 'object'
        ? inspected.ledger
        : inspected;
      if (inspectedLedger && typeof inspectedLedger === 'object') {
        const ipcLedger = {
          ...clone(inspectedLedger, {}),
          version: text(inspectedLedger.version || inspected?.version || '').trim(),
          scopeKey: text(inspectedLedger.scopeKey || inspected?.scopeKey || '').trim(),
          storageLimits: clone(
            inspected?.storageLimits
            || inspectedLedger?.storageLimits
            || inspected?.runtime?.storageLimits
            || inspected?.runtime?.storage
            || {},
            {}
          )
        };
        const result = hayakuSourceResult(
          ipcLedger,
          scope,
          'hayaku_plugin_ipc',
          inspected?.packetAuthoring || inspectedLedger?.packetAuthoring
        );
        if (!['scope_mismatch', 'unsupported_schema'].includes(result.reason)) return result;
        warn(`HAYAKU IPC ledger rejected: ${result.reason}`, result.schema || ipcLedger.scopeKey);
      }
    } catch (error) {
      if (!['HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT'].includes(text(error?.code))) {
        warn('HAYAKU IPC ledger inspection failed', error);
      }
    }

    const runtime = activeHayakuRuntime('inspect');
    if (runtime) {
      try {
        const inspected = await runtime.ledger.inspect();
        const inspectedLedger = inspected?.ledger && typeof inspected.ledger === 'object'
          ? inspected.ledger
          : inspected;
        const runtimeSnapshot = typeof runtime.runtime === 'function'
          ? await Promise.resolve(runtime.runtime())
          : null;
        if (inspectedLedger && typeof inspectedLedger === 'object') {
          const runtimeLedger = {
            ...clone(inspectedLedger, {}),
            version: text(
              inspectedLedger.version
              || inspected?.version
              || runtimeSnapshot?.storage?.schema
              || ''
            ).trim(),
            scopeKey: text(inspectedLedger.scopeKey || inspected?.scopeKey || '').trim(),
            packetAuthoring: inspected?.packetAuthoring
              || inspectedLedger?.packetAuthoring
              || runtimeSnapshot?.packetAuthoring
              || (typeof runtime?.packet?.authoringProfile === 'function'
                ? runtime.packet.authoringProfile()
                : null),
            storageLimits: clone(
              inspected?.storageLimits
              || inspectedLedger?.storageLimits
              || runtimeSnapshot?.storageLimits
              || runtimeSnapshot?.storage
              || {},
              {}
            )
          };
          const result = hayakuSourceResult(
            runtimeLedger,
            scope,
            'hayaku_runtime_api',
            runtimeLedger.packetAuthoring
          );
          if (!['scope_mismatch', 'unsupported_schema'].includes(result.reason)) return result;
          warn(`HAYAKU runtime ledger rejected: ${result.reason}`, result.schema || runtimeLedger.scopeKey);
        }
      } catch (error) {
        warn('HAYAKU runtime ledger inspection failed', error);
      }
    }

    const ledger = parseJson(await storageGet(scope.storageKey), null);
    return hayakuSourceResult(ledger, scope, 'plugin_storage_fallback');
  };

  const readPendingColdStartCapsule = async context => {
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

  const readColdStartRun = async context => {
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

  const readIncrementalRecoveryRun = async context => {
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

  const readPendingIncrementalRecoveryCapsule = async context => {
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
  const verifyDurableHayakuColdStart = async capsule => {
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
  const verifyDurableHayakuIncrementalRecovery = async capsule => {
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

  const adoptHayakuSessionHandoff = async (options = {}) => {
    const targetChatId = text(options.targetChatId || '').trim();
    const transferId = text(options.transferId || '').trim();
    const sourceScopeKey = text(options.sourceScopeKey || '').trim();
    const expectedRecords = Math.max(0, Number(options.expectedRecords || 0) || 0);
    if (expectedRecords <= 0) {
      return {
        ok: true,
        available: true,
        attempted: false,
        verified: true,
        adopted: false,
        durable: true,
        records: 0,
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
        const code = text(error?.code || '').trim();
        const runtime = ['HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT'].includes(code)
          ? activeHayakuRuntime('adoptSessionHandoff')
          : null;
        if (runtime) {
          try {
            lastTransport = 'shared_runtime_fallback';
            last = await runtime.ledger.adoptSessionHandoff(clone(request, request));
            lastError = null;
          } catch (runtimeError) {
            lastError = runtimeError;
            last = null;
          }
        } else {
          last = null;
        }
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
      if (last?.verified === true && last?.durable === true
        && ownerReceipt && identityMatches && recordsMatch) {
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
    let ipcError = null;
    try {
      const result = await requestHayakuIpc(ipcAction, { capsule: clone(capsule, capsule) }, { timeoutMs: 7000 });
      return { available: true, attempted: true, transport: 'hayaku_plugin_ipc', result, error: null };
    } catch (error) {
      ipcError = error;
      if (!['HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT'].includes(text(error?.code))) {
        warn(`HAYAKU ${ipcAction} IPC failed`, error);
      }
    }
    const runtime = activeHayakuRuntime(runtimeCapability);
    if (runtime) {
      try {
        const result = await runtime.ledger[runtimeCapability](clone(capsule, capsule));
        return { available: true, attempted: true, transport: 'shared_runtime_fallback', result, error: null };
      } catch (error) {
        return { available: true, attempted: true, transport: 'shared_runtime_fallback', result: null, error };
      }
    }
    return {
      available: false,
      attempted: false,
      transport: 'plugin_storage_queue',
      result: null,
      error: ipcError
    };
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
    onProgress
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
    if (lastError && bridgeAnalysisErrorIsRepairable(lastError)) {
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
    const context = await getCurrentContext();
    const evidence = collectColdStartEvidence(context.chat);
    const [hayaku, pendingColdStart, stagedRun] = await Promise.all([
      readHayakuSource(context),
      readPendingColdStartCapsule(context),
      readColdStartRun(context)
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
    const targetTurns = Array.isArray(options?.targetTurns) ? options.targetTurns : [];
    const targeted = targetTurns.length > 0;
    const context = await getCurrentContext();
    const [hayaku, stagedRun, pendingCapsule] = await Promise.all([
      readHayakuSource(context),
      readIncrementalRecoveryRun(context),
      readPendingIncrementalRecoveryCapsule(context)
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
      eligible: eligible || capsuleNeedsAdoption || resumableRun,
      canReadopt: capsuleNeedsAdoption,
      canResume: resumableRun,
      stalePendingCapsule,
      targeted,
      recommendedMode: capsuleNeedsAdoption ? 'readopt' : resumableRun ? 'resume' : 'incremental',
      reason: !hasHayakuHistory ? 'cold_start_required'
        : stalePendingCapsule ? 'incremental_recovery_stale_capsule'
          : capsuleNeedsAdoption ? 'incremental_recovery_readopt'
          : resumableRun ? 'incremental_recovery_resume'
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
    let result = null;
    let transport = 'hayaku_plugin_ipc';
    try {
      result = await requestHayakuIpc(
        'forget',
        { target: clone(mutationTarget, mutationTarget) },
        { timeoutMs: 7000 }
      );
    } catch (error) {
      const code = text(error?.code || '').trim();
      if (!['HAYAKU_IPC_UNAVAILABLE', 'HAYAKU_IPC_TIMEOUT'].includes(code)) throw error;
      // Legacy/shared-realm hosts may expose HAYAKU directly. API v3 normally
      // reaches the owner ledger through the authenticated IPC branch above.
      const runtime = activeHayakuRuntime('forget');
      if (!runtime) {
        const unavailable = new Error(`HAYAKU owner-ledger deletion API is unavailable (${code || 'ipc_unavailable'}).`);
        unavailable.code = code || 'HAYAKU_IPC_UNAVAILABLE';
        throw unavailable;
      }
      transport = 'shared_runtime_fallback';
      result = await runtime.ledger.forget(clone(mutationTarget, mutationTarget));
    }
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
    const memories = Array.isArray(source.memories) ? source.memories.filter(Boolean) : [];
    const worldAdditional = Array.isArray(source.worldAdditional) ? source.worldAdditional.filter(Boolean) : [];
    const scope = source.scope && typeof source.scope === 'object' ? source.scope : {};
    const chatId = text(scope.chatId || '').trim();
    const requestedChatId = text(identity?.chatId || '').trim();
    const scopeMatches = !requestedChatId || !chatId || requestedChatId === chatId;
    const schemaOk = source.schema === LIBRA_INSPECT_SCHEMA;
    const integrityOk = schemaOk && scopeMatches && source?.integrity?.ok !== false;
    const liveCount = Math.max(0, Number(source?.counts?.liveMemories ?? memories.filter(memory => memory?.inheritedSessionHistory !== true && Number(memory?.sessionEpoch || 0) >= 0).length) || 0);
    const inheritedCount = Math.max(0, Number(source?.counts?.inheritedMemories ?? memories.length - liveCount) || 0);
    const partialCount = Math.max(0, Number(source?.counts?.partialMemories ?? memories.filter(memory => memory?.pipeline?.status === 'partial').length) || 0);
    const snapshotHash = stableHash64(JSON.stringify({
      scopeKey: text(scope.scopeKey || ''),
      memories: memories.map(memory => [
        text(memory.memoryId || ''), Number(memory.revision || 0), text(memory.sourceDigest || ''),
        Number(memory.sessionEpoch || 0), text(memory.status || ''), stableHash64(text(memory.text || memory.summary || ''))
      ]),
      worldAdditional: worldAdditional.map(item => [text(item.itemId || ''), text(item.status || ''), stableHash64(text(item.content || ''))])
    }));
    return {
      available: schemaOk && scopeMatches && (memories.length > 0 || worldAdditional.length > 0),
      pluginAvailable: schemaOk,
      inspectionAvailable: schemaOk && scopeMatches,
      integrityOk,
      reason: !schemaOk ? 'libra_ipc_contract_unavailable'
        : !scopeMatches ? 'libra_scope_mismatch'
          : !integrityOk ? 'libra_integrity_failed'
            : (memories.length || worldAdditional.length) ? 'loaded' : 'empty',
      readSource,
      pluginVersion: text(source.pluginVersion || ''),
      scope,
      manifest: clone(source.manifest, {}),
      integrity: clone(source.integrity, { ok: integrityOk }),
      memories,
      worldAdditional,
      recordCount: memories.length,
      liveRecordCount: liveCount,
      inheritedRecordCount: inheritedCount,
      partialRecordCount: partialCount,
      worldAdditionalCount: worldAdditional.length,
      snapshotHash,
      inspectedAt: source.inspectedAt || ''
    };
  };

  const readLibraSource = async context => {
    const identity = contextIdentity(context || await getCurrentContext());
    const probe = await probeLibraIpc({ timeoutMs: 1800, attempts: 2 });
    if (probe.available) {
      try {
        const inspected = await requestLibraIpc('inspect', {}, { timeoutMs: 12000 });
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
          scope: {}, manifest: {}, integrity: { ok: false, reason },
          memories: [], worldAdditional: [], recordCount: 0, liveRecordCount: 0,
          inheritedRecordCount: 0, partialRecordCount: 0, worldAdditionalCount: 0,
          snapshotHash: '', capabilities: clone(probe.capabilities, {}), probe: clone(probe, {}),
          errors: [text(error?.message || error || reason)]
        };
      }
    }

    // Same-realm fallback is retained for unusual hosts/tests, but API-v3 iframe
    // isolation means official plugin IPC remains the authoritative route.
    const runtime = activeLibraRuntime();
    if (runtime && typeof runtime.inspectForRetrace === 'function') {
      try {
        const inspected = await runtime.inspectForRetrace();
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
      pluginVersion: '', scope: {}, manifest: {}, integrity: { ok: false },
      memories: [], worldAdditional: [], recordCount: 0, liveRecordCount: 0,
      inheritedRecordCount: 0, partialRecordCount: 0, worldAdditionalCount: 0,
      snapshotHash: '', probe: clone(probe, {}), errors: [probe.error || 'LIBRA v1.0.4 or later IPC contract is required.']
    };
  };

  const libraReceiptCountMatches = (receipt, field, expected) => (
    Boolean(receipt && Object.prototype.hasOwnProperty.call(receipt, field))
    && Number.isInteger(Number(receipt[field]))
    && Number(receipt[field]) === expected
  );

  const libraOwnerReceiptMatches = (receipt, transport, mutation) => (
    transport !== 'libra_plugin_ipc'
    || (
      text(receipt?.ownerPluginId || '') === LIBRA_PLUGIN_ID
      && text(receipt?.authorizedRequester || '') === 'flashback_hayaku_bridge'
      && text(receipt?.mutation || '') === mutation
    )
  );

  const libraPreparationReceiptMatches = (receipt, options, transport) => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    const expectedWorldAdditional = Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0);
    return receipt?.schema === LIBRA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'prepared'
      && receipt?.prepared === true
      && receipt?.durable === true
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && libraReceiptCountMatches(receipt, 'records', expectedRecords)
      && libraReceiptCountMatches(receipt, 'expectedRecords', expectedRecords)
      && libraReceiptCountMatches(receipt, 'worldAdditional', expectedWorldAdditional)
      && libraReceiptCountMatches(receipt, 'expectedWorldAdditional', expectedWorldAdditional)
      && libraOwnerReceiptMatches(receipt, transport, 'prepare_session_handoff');
  };

  const libraAdoptionReceiptMatches = (receipt, options, transport) => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    const expectedWorldAdditional = Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0);
    return receipt?.schema === LIBRA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'adopted'
      && receipt?.adopted === true
      && receipt?.verified === true
      && receipt?.durable === true
      && text(receipt?.targetChatId || '') === text(options?.targetChatId || '')
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && libraReceiptCountMatches(receipt, 'records', expectedRecords)
      && libraReceiptCountMatches(receipt, 'expectedRecords', expectedRecords)
      && libraReceiptCountMatches(receipt, 'worldAdditional', expectedWorldAdditional)
      && libraReceiptCountMatches(receipt, 'expectedWorldAdditional', expectedWorldAdditional)
      && libraOwnerReceiptMatches(receipt, transport, 'adopt_session_handoff');
  };

  const libraVerificationReceiptMatches = (receipt, options, transport) => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    const expectedWorldAdditional = Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0);
    return receipt?.schema === LIBRA_HANDOFF_RECEIPT_SCHEMA
      && receipt?.action === 'verified'
      && receipt?.verified === true
      && receipt?.durable === true
      && text(receipt?.targetChatId || '') === text(options?.targetChatId || '')
      && text(receipt?.transferId || '') === text(options?.transferId || '')
      && libraReceiptCountMatches(receipt, 'records', expectedRecords)
      && libraReceiptCountMatches(receipt, 'expectedRecords', expectedRecords)
      && libraReceiptCountMatches(receipt, 'worldAdditional', expectedWorldAdditional)
      && libraReceiptCountMatches(receipt, 'expectedWorldAdditional', expectedWorldAdditional)
      && libraOwnerReceiptMatches(receipt, transport, 'verify_session_handoff');
  };

  const prepareLibraSessionHandoff = async options => {
    const runtime = activeLibraRuntime();
    try {
      const result = await requestLibraIpc('prepare_session_handoff', options || {}, { timeoutMs: 6000 });
      if (!libraPreparationReceiptMatches(result, options, 'libra_plugin_ipc')) {
        throw new Error('LIBRA handoff preparation receipt is invalid.');
      }
      return { ...result, transport: 'libra_plugin_ipc' };
    } catch (error) {
      if (runtime && typeof runtime.prepareSessionHandoff === 'function') {
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
    const expectedWorldAdditional = Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0);
    const runtime = activeLibraRuntime();
    try {
      const result = await requestLibraIpc('adopt_session_handoff', options || {}, { timeoutMs: 12000 });
      return { ...result, transport: 'libra_plugin_ipc' };
    } catch (error) {
      if (runtime && typeof runtime.adoptSessionHandoff === 'function') {
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
        records: 0, expectedRecords, worldAdditional: 0, expectedWorldAdditional,
        targetChatId: text(options?.targetChatId || ''),
        transferId: text(options?.transferId || ''), transport: 'unavailable',
        reason: text(error?.message || error || 'libra_handoff_adoption_failed')
      };
    }
  };

  const adoptLibraSessionHandoffDurable = async options => {
    const expectedRecords = Math.max(0, Number(options?.expectedRecords || 0) || 0);
    const expectedWorldAdditional = Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0);
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
    const payload = {
      transferId: text(options?.transferId || ''),
      targetChatId: text(options?.targetChatId || ''),
      expectedRecords: Math.max(0, Number(options?.expectedRecords || 0) || 0),
      expectedWorldAdditional: Math.max(0, Number(options?.expectedWorldAdditional || 0) || 0)
    };
    const runtime = activeLibraRuntime();
    try {
      const result = await requestLibraIpc('verify_session_handoff', payload, { timeoutMs: 6000 });
      const receiptMatches = libraVerificationReceiptMatches(result, payload, 'libra_plugin_ipc');
      return receiptMatches
        ? { ...result, transport: 'libra_plugin_ipc' }
        : { ...result, verified: false, durable: false, transport: 'libra_plugin_ipc', reason: 'libra_handoff_receipt_mismatch' };
    } catch (error) {
      if (runtime && typeof runtime.verifySessionHandoff === 'function') {
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
        worldAdditional: 0, expectedWorldAdditional: payload.expectedWorldAdditional,
        targetChatId: payload.targetChatId,
        transferId: payload.transferId, transport: 'unavailable',
        reason: text(error?.message || error || 'libra_handoff_verification_failed')
      };
    }
  };

  const inspectTransition = async () => {
    const context = await getCurrentContext();
    const [flashback, hayaku, pendingColdStart, libra, gradia] = await Promise.all([
      readFlashbackViewer(context),
      readHayakuSource(context),
      readPendingColdStartCapsule(context),
      readLibraSource(context),
      readGradiaSource(context)
    ]);
    const preview = {
      context,
      identity: contextIdentity(context),
      flashback,
      hayaku,
      libra,
      gradia,
      pendingColdStart,
      includeHayaku: hayaku.available === true || pendingColdStart.available === true,
      includeLibra: libra.available === true,
      includeGradia: gradia.available === true,
      hayakuRecordCount: hayaku.available ? hayaku.records.length : pendingColdStart.packets.length,
      libraRecordCount: libra.recordCount,
      gradiaStoryArcCount: gradia.storyArcCount,
      gradiaWriterDesignCount: gradia.writerDesignCount,
      inspectedAt: Date.now()
    };
    Runtime.lastPreview = preview;
    return preview;
  };

  const hayakuBackupCatalogKey = scopeKey => `${HAYAKU_BACKUP_CATALOG_PREFIX}${scopeKey}`;
  const listHayakuLedgerBackups = async () => {
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
    const context = await getCurrentContext();
    const hayaku = await readHayakuSource(context);
    const scope = hayaku.scope || hayakuScopeFor(context);
    if (!scope?.available) throw new Error('HAYAKU 스코프를 계산하지 못했습니다.');
    if (!hayaku.ledger || !HAYAKU_LEDGER_SCHEMAS.has(text(hayaku.ledger.version))) {
      throw new Error('백업할 HAYAKU 미러 원장이 없습니다.');
    }
    const createdAt = Date.now();
    const ledger = clone(hayaku.ledger, null);
    if (!ledger) throw new Error('HAYAKU 원장 스냅샷을 복제하지 못했습니다.');
    const ledgerJson = JSON.stringify(ledger);
    const checksum = stableHash64(ledgerJson);
    const backupId = `hayaku-backup-${createdAt}-${checksum.slice(-10)}`;
    const storageKey = `${HAYAKU_BACKUP_PREFIX}${scope.scopeKey}:${backupId}`;
    const envelope = {
      schema: HAYAKU_BACKUP_SCHEMA,
      backupId,
      scopeKey: scope.scopeKey,
      sourceStorageKey: scope.storageKey || `${HAYAKU_LEDGER_PREFIX}${scope.scopeKey}`,
      sourceReadMethod: text(hayaku.readSource || 'unknown'),
      sourceLedgerVersion: text(ledger.version || ''),
      createdAt,
      checksum,
      recordCount: Array.isArray(ledger.records) ? ledger.records.length : 0,
      slotHeadCount: Array.isArray(ledger.slotHeads) ? ledger.slotHeads.length : 0,
      tombstoneCount: Array.isArray(ledger.tombstones) ? ledger.tombstones.length : 0,
      immutable: true,
      ledger
    };
    if (!await storageSet(storageKey, JSON.stringify(envelope))) {
      throw new Error('HAYAKU 미러 원장 백업을 저장하지 못했습니다.');
    }
    const verified = parseJson(await storageGet(storageKey), null);
    if (!verified || verified.schema !== HAYAKU_BACKUP_SCHEMA
      || verified.backupId !== backupId
      || stableHash64(JSON.stringify(verified.ledger)) !== checksum) {
      throw new Error('HAYAKU 미러 원장 백업 저장 검증에 실패했습니다.');
    }
    const catalogKey = hayakuBackupCatalogKey(scope.scopeKey);
    const previous = parseJson(await storageGet(catalogKey), null);
    const entries = previous?.schema === HAYAKU_BACKUP_CATALOG_SCHEMA && Array.isArray(previous.entries)
      ? previous.entries.filter(entry => entry?.backupId !== backupId)
      : [];
    entries.push({
      backupId,
      storageKey,
      createdAt,
      checksum,
      recordCount: envelope.recordCount,
      slotHeadCount: envelope.slotHeadCount,
      tombstoneCount: envelope.tombstoneCount
    });
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
      recordCount: envelope.recordCount,
      slotHeadCount: envelope.slotHeadCount,
      tombstoneCount: envelope.tombstoneCount
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

  const requiredHandoffsVerified = status => (
    (status?.flashbackRequired !== true || status?.flashbackVerified === true)
    && (status?.hayakuRequired !== true || status?.hayakuVerified === true)
    && (status?.libraRequired !== true || status?.libraVerified === true)
    && (status?.gradiaRequired !== true || status?.gradiaVerified === true)
    && (status?.liaRequired !== true || status?.liaVerified === true)
  );

  const continueToNextSession = async () => {
    const preview = await inspectTransition();
    const { context, identity, flashback, hayaku, libra, gradia, pendingColdStart } = preview;
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
    if (libra.pluginAvailable && libra.integrityOk === false) {
      const inspectionFailed = ['libra_inspect_timeout', 'libra_inspect_failed'].includes(text(libra.reason));
      throw new Error(`${inspectionFailed
        ? 'LIBRA is connected, but canonical memory inspection could not be verified; next-session handoff was stopped.'
        : 'LIBRA canonical memory integrity is incomplete; next-session handoff was stopped.'} ${JSON.stringify({
        reason: libra.reason, records: libra.recordCount, integrity: libra.integrity, errors: libra.errors || []
      })}`);
    }
    if (gradia.pluginAvailable && gradia.integrityOk === false) {
      const inspectionFailed = ['gradia_inspect_timeout', 'gradia_inspect_failed'].includes(text(gradia.reason));
      throw new Error(`${inspectionFailed
        ? 'GRADIA is connected, but Story Arc/Writer inspection could not be verified; next-session handoff was stopped.'
        : 'GRADIA Story Arc/Writer state integrity is incomplete; next-session handoff was stopped.'} ${JSON.stringify({
        reason: gradia.reason, storyArc: gradia.storyArcCount, writerDesign: gradia.writerDesignCount,
        integrity: gradia.integrity, errors: gradia.errors || []
      })}`);
    }
    const targetChatId = uuid();
    const transferId = uuid();
    const createdAt = Date.now();
    const sourceLivePersonaId = text(identity.personaId || '').trim();
    const liaRequired = isLiaLivePersonaId(sourceLivePersonaId);
    const libraPreparation = preview.includeLibra
      ? await prepareLibraSessionHandoff({
        transferId,
        expectedRecords: libra.recordCount,
        expectedWorldAdditional: libra.worldAdditionalCount
      })
      : { schema: LIBRA_HANDOFF_RECEIPT_SCHEMA, prepared: false, records: 0, worldAdditional: 0, reason: 'no_libra_data' };
    if (preview.includeLibra && (
      libraPreparation.prepared !== true
      || Number(libraPreparation.records || 0) !== Number(libra.recordCount || 0)
      || Number(libraPreparation.worldAdditional || 0) !== Number(libra.worldAdditionalCount || 0)
    )) {
      throw new Error(`LIBRA next-session handoff preparation failed before creating the new chat: ${libraPreparation.reason || 'record_count_mismatch'}`);
    }
    const gradiaPreparation = preview.includeGradia
      ? await prepareGradiaSessionHandoff({
        transferId,
        expectedStoryArc: gradia.storyArcCount,
        expectedWriterDesign: gradia.writerDesignCount,
        expectedSnapshotHash: gradia.snapshotHash
      })
      : { schema: GRADIA_HANDOFF_RECEIPT_SCHEMA, prepared: false, storyArc: 0, writerDesign: 0, reason: 'no_gradia_data' };
    if (preview.includeGradia && (
      gradiaPreparation.prepared !== true
      || Number(gradiaPreparation.storyArc || 0) !== Number(gradia.storyArcCount || 0)
      || Number(gradiaPreparation.writerDesign || 0) !== Number(gradia.writerDesignCount || 0)
    )) {
      throw new Error(`GRADIA next-session handoff preparation failed before creating the new chat: ${gradiaPreparation.reason || 'record_count_mismatch'}`);
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
          worldAdditionalCount: libra.worldAdditionalCount,
          preparedAt: libraPreparation.preparedAt || new Date(createdAt).toISOString()
        }
      } : {}),
      ...(preview.includeGradia ? {
        gradiaSessionHandoff: {
          schema: GRADIA_CHAT_HANDOFF_MARKER_SCHEMA,
          transferId, sourceChatId: identity.chatId, targetChatId,
          sourceStoryArcScopeKey: text(gradia.scope?.storyArcScopeKey || ''),
          sourceWriterScopeKey: text(gradia.scope?.writerScopeKey || ''),
          storyArcCount: gradia.storyArcCount,
          writerDesignCount: gradia.writerDesignCount,
          sourceSnapshotHash: text(gradia.snapshotHash || ''),
          preparedAt: gradiaPreparation.preparedAt || new Date(createdAt).toISOString()
        }
      } : {}),
      memorySessionBridge: {
        schema: HANDOFF_SCHEMA,
        timelineContract: 'session_epoch_then_completed_pair_v1',
        transferId,
        sourceChatId: identity.chatId,
        sourceFlashbackScopeKey: text(flashback.sourceScope?.scopeKey || ''),
        sourceHayakuScopeKey: text(hayaku.scope?.scopeKey || ''),
        sourceLibraScopeKey: text(libra.scope?.scopeKey || ''),
        sourceGradiaStoryArcScopeKey: text(gradia.scope?.storyArcScopeKey || ''),
        sourceGradiaWriterScopeKey: text(gradia.scope?.writerScopeKey || ''),
        targetChatId,
        includeFlashback: true,
        includeHayaku: preview.includeHayaku === true,
        includeLibra: preview.includeLibra === true,
        includeGradia: preview.includeGradia === true,
        includeLiaLivePersona: liaRequired,
        sourceLiaLivePersonaId: liaRequired ? sourceLivePersonaId : '',
        flashbackRecordCount: Math.max(0, Number(flashback.loadedRecords ?? flashback.records ?? 0) || 0),
        hayakuRecordCount: preview.hayakuRecordCount,
        libraRecordCount: libra.recordCount,
        libraWorldAdditionalCount: libra.worldAdditionalCount,
        gradiaStoryArcCount: gradia.storyArcCount,
        gradiaWriterDesignCount: gradia.writerDesignCount,
        createdAt
      }
    };
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
    if (preview.includeLibra) {
      const latestLibra = await readLibraSource(latest);
      if (!latestLibra.integrityOk
        || latestLibra.snapshotHash !== libra.snapshotHash
        || latestLibra.recordCount !== libra.recordCount
        || latestLibra.worldAdditionalCount !== libra.worldAdditionalCount) {
        throw new Error('LIBRA canonical memory changed during handoff preparation. Run the transition again.');
      }
    }
    if (preview.includeGradia) {
      const latestGradia = await readGradiaSource(latest);
      if (!latestGradia.integrityOk
        || latestGradia.snapshotHash !== gradia.snapshotHash
        || latestGradia.storyArcCount !== gradia.storyArcCount
        || latestGradia.writerDesignCount !== gradia.writerDesignCount) {
        throw new Error('GRADIA Story Arc/Writer state changed during handoff preparation. Run the transition again.');
      }
    }
    const writer = await saveCharacter(nextCharacter, context.characterIndex);
    const flashbackRecords = Math.max(0, Number(flashback.loadedRecords ?? flashback.records ?? 0) || 0);
    const hayakuRecords = Math.max(0, Number(preview.hayakuRecordCount || 0) || 0);
    const [flashbackAdoption, hayakuAdoption, libraAdoptionInitial, gradiaAdoptionInitial, liaAdoption] = await Promise.all([
      adoptFlashbackSessionHandoff({
        targetChatId, transferId, sourceScopeKey: text(flashback.sourceScope?.scopeKey || ''), expectedRecords: flashbackRecords
      }),
      adoptHayakuSessionHandoff({
        targetChatId, transferId, sourceScopeKey: text(hayaku.scope?.scopeKey || ''), expectedRecords: preview.includeHayaku === true ? hayakuRecords : 0
      }),
      preview.includeLibra
        ? adoptLibraSessionHandoffDurable({
          targetChatId,
          transferId,
          expectedRecords: libra.recordCount,
          expectedWorldAdditional: libra.worldAdditionalCount
        })
        : Promise.resolve({
          schema: LIBRA_HANDOFF_RECEIPT_SCHEMA,
          verified: true,
          durable: true,
          records: 0,
          expectedRecords: 0,
          worldAdditional: 0,
          expectedWorldAdditional: 0,
          reason: 'no_libra_data'
        }),
      preview.includeGradia
        ? adoptGradiaSessionHandoffDurable({
          targetChatId,
          transferId,
          expectedStoryArc: gradia.storyArcCount,
          expectedWriterDesign: gradia.writerDesignCount
        })
        : Promise.resolve({
          schema: GRADIA_HANDOFF_RECEIPT_SCHEMA,
          verified: true,
          durable: true,
          storyArc: 0,
          expectedStoryArc: 0,
          writerDesign: 0,
          expectedWriterDesign: 0,
          reason: 'no_gradia_data'
        }),
      adoptLiaLivePersonaHandoff({ sourceChatId: identity.chatId, targetChatId, transferId, sourceLivePersonaId })
    ]);
    const libraAdoption = preview.includeLibra && libraAdoptionInitial?.verified !== true
      ? await verifyDurableLibraSessionHandoff({
        included: true,
        targetChatId,
        transferId,
        expectedRecords: libra.recordCount,
        expectedWorldAdditional: libra.worldAdditionalCount
      })
      : libraAdoptionInitial;
    const gradiaAdoption = preview.includeGradia && gradiaAdoptionInitial?.verified !== true
      ? await verifyDurableGradiaSessionHandoff({
        included: true,
        targetChatId,
        transferId,
        expectedStoryArc: gradia.storyArcCount,
        expectedWriterDesign: gradia.writerDesignCount
      })
      : gradiaAdoptionInitial;
    const flashbackVerified = flashbackAdoption?.verified === true
      && flashbackAdoption?.durable === true
      && Math.max(0, Number(flashbackAdoption?.records || 0) || 0) === flashbackRecords;
    const flashbackRequired = flashbackRecords > 0;
    const hayakuVerified = hayakuAdoption?.verified === true
      && hayakuAdoption?.durable === true
      && Math.max(0, Number(hayakuAdoption?.records || 0) || 0) === hayakuRecords;
    const hayakuRequired = preview.includeHayaku === true && hayakuRecords > 0;
    const libraRequired = preview.includeLibra === true;
    const libraVerified = libraAdoption?.verified === true
      && libraAdoption?.durable === true
      && text(libraAdoption?.targetChatId || '') === targetChatId
      && text(libraAdoption?.transferId || '') === transferId
      && Number(libraAdoption?.records || 0) === Number(libra.recordCount || 0)
      && Number(libraAdoption?.worldAdditional || 0) === Number(libra.worldAdditionalCount || 0);
    const gradiaRequired = preview.includeGradia === true;
    const gradiaVerified = gradiaAdoption?.verified === true
      && gradiaAdoption?.durable === true
      && text(gradiaAdoption?.targetChatId || '') === targetChatId
      && text(gradiaAdoption?.transferId || '') === transferId
      && Number(gradiaAdoption?.storyArc || 0) === Number(gradia.storyArcCount || 0)
      && Number(gradiaAdoption?.writerDesign || 0) === Number(gradia.writerDesignCount || 0);
    const liaVerified = !liaRequired || (
      liaAdoption?.schema === LIA_HANDOFF_RECEIPT_SCHEMA
      && liaAdoption?.verified === true
      && liaAdoption?.durable === true
      && text(liaAdoption?.sourceChatId || '') === identity.chatId
      && text(liaAdoption?.targetChatId || '') === targetChatId
      && text(liaAdoption?.transferId || '') === transferId
      && text(liaAdoption?.sourceLivePersonaId || '') === sourceLivePersonaId
      && isLiaLivePersonaId(liaAdoption?.livePersonaId || '')
      && text(liaAdoption?.livePersonaId || '') !== sourceLivePersonaId
    );
    const result = {
      ok: requiredHandoffsVerified({
        flashbackRequired,
        flashbackVerified,
        hayakuRequired,
        hayakuVerified,
        libraRequired,
        libraVerified,
        gradiaRequired,
        gradiaVerified,
        liaRequired,
        liaVerified
      }),
      schema: HANDOFF_SCHEMA,
      transferId,
      sourceChatId: identity.chatId,
      targetChatId,
      flashbackScheduled: flashbackRequired && !flashbackVerified,
      flashbackVerified,
      flashbackAdoption,
      flashbackRecords,
      hayakuScheduled: hayakuRequired && !hayakuVerified,
      hayakuVerified,
      hayakuAdoption,
      hayakuRecords,
      hayakuSource: hayaku.available ? 'canonical_ledger' : pendingColdStart.available ? 'pending_cold_start' : 'none',
      libraScheduled: libraRequired && !libraVerified,
      libraVerified,
      libraAdoption,
      libraRecords: libra.recordCount,
      libraWorldAdditional: libra.worldAdditionalCount,
      libraSource: preview.includeLibra ? text(libra.readSource || 'unknown') : 'none',
      gradiaScheduled: gradiaRequired && !gradiaVerified,
      gradiaVerified,
      gradiaAdoption,
      gradiaStoryArc: gradia.storyArcCount,
      gradiaWriterDesign: gradia.writerDesignCount,
      gradiaStoryArcBeats: gradia.storyArcBeatCount,
      gradiaSource: preview.includeGradia ? text(gradia.readSource || 'unknown') : 'none',
      liaRequired,
      liaVerified,
      liaAdoption,
      sourceLivePersonaId: liaRequired ? sourceLivePersonaId : '',
      targetLivePersonaId: liaRequired ? text(liaAdoption?.livePersonaId || '') : '',
      writer,
      createdAt
    };
    Runtime.lastTransition = result;
    return result;
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
    ${ordered.length > visible.length ? `<div class="settings-callout">최신 ${formatNumber(visible.length)}개만 화면에 표시합니다. JSON 내보내기에는 ${formatNumber(ordered.length)}개 전체가 포함됩니다.</div>` : ''}
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
      <div><span>응답 / 에피소드</span><strong>${formatNumber(responseRecords)} / ${formatNumber(episodeRecords)}</strong></div>
      <div><span>Shard</span><strong>${formatNumber(result.shardCount - result.missingShards)} / ${formatNumber(result.shardCount)}</strong></div>
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
    const updatedAt = result.ledger?.updatedAt ? new Date(result.ledger.updatedAt).toLocaleString() : '-';
    return `<div class="metrics">
      <div><span>저장 패킷</span><strong>${formatNumber(records.length)}</strong></div>
      <div><span>LIVE / 승계</span><strong>${formatNumber(liveRecords)} / ${formatNumber(inheritedRecords)}</strong></div>
      <div><span>삭제됨</span><strong>${formatNumber(deletedRecords.length)}</strong></div>
      <div><span>활성 / 전체 월드라인</span><strong>${formatNumber(activeNodes)} / ${formatNumber(nodes.length)}</strong></div>
      <div><span>원장 크기</span><strong>${formatNumber(chars)} chars</strong></div>
    </div>
    <div class="ledger-key"><span>READ ONLY</span><code>${escapeHtml(result.scope.storageKey)}</code><small>갱신 ${escapeHtml(updatedAt)}</small></div>
    ${deletedRecords.length ? `<div class="settings-callout">사용자가 삭제한 패킷 ${formatNumber(deletedRecords.length)}개는 tombstone으로 보존되지만 활성 목록과 자동 누락 복구에서 제외됩니다.</div>` : ''}
    ${ordered.length > visible.length ? `<div class="settings-callout">최신 ${formatNumber(visible.length)}개만 화면에 표시합니다. JSON 내보내기에는 tombstone을 포함한 원장 전체가 유지됩니다.</div>` : ''}
    <div class="record-list">${visible.map((record, actionIndex) => {
      const info = packetInfo(record);
      const inherited = record.inheritedSessionHistory === true || isPermanentSessionHistory(record);
      const permanent = isPermanentSessionHistory(record);
      const coldStart = text(record.captureSource).includes('cold_start');
      const state = text(record.recordState || '').trim().toUpperCase();
      const deleteDisabled = permanent || state === 'TOMBSTONED';
      const regenerateDisabled = permanent || recordRegenerationTurns(record).length === 0;
      const protectedTitle = permanent ? 'Permanent session history is protected.' : '';
      const label = ['TOMBSTONED', 'SUPERSEDED', 'QUARANTINED', 'ORPHANED', 'DETACHED'].includes(state)
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
      @media(max-width:820px){.session-handoff-flow{grid-template-columns:1fr 1fr}.bridge{grid-template-columns:78px minmax(0,1fr)}.side{padding:10px 7px}.nav-group-label,.nav>span:not(.ic),.scope-card,.version{display:none}.nav{justify-content:center;padding:6px}.panel{padding:18px 14px 70px}.flow,.metrics{grid-template-columns:1fr 1fr}}
      @media(max-width:560px){.session-handoff-flow{grid-template-columns:1fr}.bridge{height:100dvh;max-height:100dvh;border-radius:0;grid-template-columns:64px minmax(0,1fr);grid-template-rows:62px minmax(0,1fr)}.top{padding:0 10px}.brand span,.global-status{display:none}.flow,.metrics,.settings-feature-grid,.packet-sections,.analysis-console-metrics{grid-template-columns:1fr}.ledger-key small{display:none}.field-wide,.profile-actions{grid-column:1}}
    </style>
    <div class="bridge${Runtime.busy ? ' busy' : ''}">
      <header class="top"><span class="mark" aria-label="Bridge">${bridgeIconSvg}</span><div class="brand"><strong>${PLUGIN_NAME}</strong><span>LIBRA · HAYAKU · Flashback · LIA Continuity</span></div><div class="top-actions"><div class="global-status"><span class="status-dot"></span><span>준비됨</span></div><button id="closeBridge" class="btn">닫기</button></div></header>
      <aside class="side">
        <div class="nav-group-label">Operations</div>
        <button class="nav ${Runtime.activeTab === 'session' ? 'active' : ''}" data-tab="session"><span class="ic">↪</span><span>다음 세션</span></button>
        <button class="nav ${Runtime.activeTab === 'coldstart' ? 'active' : ''}" data-tab="coldstart"><span class="ic">✦</span><span>분석 복구</span></button>
        <div class="nav-group-label">Data</div>
        <button class="nav ${Runtime.activeTab === 'libra' ? 'active' : ''}" data-tab="libra"><span class="ic">L</span><span>LIBRA 뷰어</span></button>
        <button class="nav ${Runtime.activeTab === 'flashback' ? 'active' : ''}" data-tab="flashback"><span class="ic">F</span><span>Flashback 뷰어</span></button>
        <button class="nav ${Runtime.activeTab === 'hayaku' ? 'active' : ''}" data-tab="hayaku"><span class="ic">H</span><span>HAYAKU 뷰어</span></button>
        <div class="nav-group-label">Settings</div>
        <button class="nav ${Runtime.activeTab === 'provider' ? 'active' : ''}" data-tab="provider"><span class="ic">⚙</span><span>프로바이더</span></button>
        <div class="scope-card"><b>현재 스코프</b><span id="sidebarScope">확인 중</span></div><div class="version">v${PLUGIN_VERSION}</div>
      </aside>
      <main class="main">
        <section class="panel ${Runtime.activeTab === 'session' ? 'active' : ''}" data-panel="session">
          <div class="panel-heading"><div><h2>다음 세션</h2><p>LIBRA, GRADIA, HAYAKU, Flashback의 연속성 데이터를 새 채팅으로 함께 승계합니다.</p></div></div>
          <div class="card"><div class="heading"><div><strong>대화 이어가기</strong><span>새 채팅 저장 직후 세 시스템의 승계 계약과 영속 반영을 검증합니다.</span></div><em class="badge">원본 보존</em></div>
            <div class="flow session-handoff-flow"><div><b>1 · LIBRA</b><small>정본 메모리를 IPC로 이전 세션 영구 기억에 채택·검증</small></div><div><b>2 · GRADIA</b><small>Story Arc의 다음 5턴 비트와 Writer/OOC 상태를 새 세션 기준으로 재결속</small></div><div><b>3 · Flashback</b><small>이전 기억을 영구 과거로 즉시 채택·검증</small></div><div><b>4 · HAYAKU</b><small>이전 원장을 라이브 월드라인과 분리해 즉시 저장·검증</small></div><div><b>5 · LIA</b><small>활성 Live Persona를 새 채팅 전용 Persona로 Fork·재바인딩</small></div><div><b>6 · 새 채팅</b><small>원본은 그대로 두고 새 라이브 계보로 시작</small></div></div>
            <div id="transitionStatus" class="status">전환 대상을 확인하는 중입니다.</div><p class="note">LIBRA는 공식 IPC로 pluginStorage 정본을 이전 세션 영구 기억에 채택합니다. GRADIA는 Story Arc를 새 세션의 로컬 TURN 1~5 기준으로 재기준화해 다음 비트를 유지하고 Writer/OOC 상태도 독립 스코프로 승계합니다. Flashback과 HAYAKU도 각 공식 채택 경로를 사용합니다.</p>
            <div class="actions"><button id="refreshTransition" class="btn">다시 확인</button><button id="createSession" class="btn primary">다음 세션 만들기</button></div>
          </div>
        </section>
        <section class="panel ${Runtime.activeTab === 'coldstart' ? 'active' : ''}" data-panel="coldstart">
          <div class="panel-heading"><div><h2>HAYAKU 분석 복구</h2><p>최초 구축인 콜드스타트와 누락 턴 복구인 증분 재분석을 분리합니다.</p></div></div>
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
        <section class="panel ${Runtime.activeTab === 'provider' ? 'active' : ''}" data-panel="provider">
          <div class="panel-heading"><div><h2>LLM 프로바이더</h2><p>GRADIA v0.24.3 계열의 provider·reasoning 계층을 Primary 단일 프로필로 사용합니다.</p></div></div>
          <div class="settings-callout">콜드스타트와 증분 재분석은 아래 Primary 프로필을 사용합니다. 이전 버전의 Aux 설정만 구성되어 있었다면 최초 로드 시 Primary로 자동 이전됩니다.</div>
          ${providerBlock('primary', 'Primary profile')}
          <div id="providerStatus" class="status">설정을 수정한 뒤 저장하거나 연결 테스트를 실행하세요.</div>
          <div class="actions"><button id="saveProvider" class="btn primary">프로바이더 설정 저장</button></div>
        </section>
      </main>
    </div>`;
    bindUi();
    renderAnalysisConsole();
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
    Runtime.root?.querySelectorAll?.('button:not(#closeBridge):not(.nav):not(#analysisReturnToRisu)').forEach(button => {
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
      const preview = await inspectTransition();
      const scopeNode = Runtime.root?.querySelector?.('#sidebarScope');
      if (scopeNode) scopeNode.textContent = compact(preview.context?.chat?.name || preview.identity.chatId || '현재 채팅', 44);
      const flashbackLine = preview.flashback.available
        ? `Flashback 기억 ${formatNumber(preview.flashback.records)}개 · ${formatNumber(preview.flashback.shards)}개 샤드`
        : `Flashback 저장 기억 0개 (${preview.flashback.reason})`;
      const hayakuLine = preview.includeHayaku
        ? `HAYAKU 패킷 ${formatNumber(preview.hayakuRecordCount)}개 자동 포함${preview.hayaku.available ? '' : ' (콜드스타트 대기 캡슐)'}`
        : `HAYAKU 제외 (${preview.hayaku.reason})`;
      const libraLine = preview.includeLibra
        ? `LIBRA 정본 메모리 ${formatNumber(preview.libraRecordCount)}개 IPC 승계 준비`
        : preview.libra.pluginAvailable
          ? ['libra_inspect_timeout', 'libra_inspect_failed'].includes(text(preview.libra.reason))
            ? `LIBRA 연결됨 · 정본 조회 실패 (${preview.libra.reason})`
            : `LIBRA 연결됨 · 정본 없음 (${preview.libra.reason})`
          : 'LIBRA IPC 연결 없음 · LIBRA v1.0.4+ 필요';
      const gradiaLine = preview.includeGradia
        ? `GRADIA Story Arc ${formatNumber(preview.gradiaStoryArcCount)}개 · Writer/OOC ${formatNumber(preview.gradiaWriterDesignCount)}개 승계 준비`
        : preview.gradia.pluginAvailable
          ? ['gradia_inspect_timeout', 'gradia_inspect_failed'].includes(text(preview.gradia.reason))
            ? `GRADIA 연결됨 · Story Arc 조회 실패 (${preview.gradia.reason})`
            : `GRADIA 연결됨 · 승계할 Story Arc/Writer 상태 없음 (${preview.gradia.reason})`
          : 'GRADIA IPC 연결 없음 · GRADIA v0.25.25+ 필요';
      node.textContent = `${libraLine}\n${gradiaLine}\n${flashbackLine}\n${hayakuLine}`;
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
    body.innerHTML = '<div class="empty"><strong>기억 조회 중</strong><span>Flashback manifest와 shard를 읽고 있습니다.</span></div>';
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
    body.innerHTML = '<div class="empty"><strong>원장 조회 중</strong><span>pluginStorage를 읽고 있습니다.</span></div>';
    try {
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
        readHayakuSource(context),
        readPendingColdStartCapsule(context),
        readPendingIncrementalRecoveryCapsule(context)
      ]);
      const coldStartNeedsAdoption = pending.available
        && text(result?.ledger?.coldStart?.transferId || '') !== text(pending?.capsule?.transferId || '');
      const incrementalNeedsAdoption = pendingIncremental.available
        && text(result?.ledger?.incrementalRecovery?.lastRecoveryId || '')
          !== text(pendingIncremental?.capsule?.recoveryId || '');
      let adoptionChanged = false;
      if (coldStartNeedsAdoption) {
        const adoption = await requestImmediateHayakuColdStartAdoption(pending.capsule);
        adoptionChanged = adoption.verified === true || adoptionChanged;
      }
      if (incrementalNeedsAdoption) {
        const adoption = await requestImmediateHayakuIncrementalRecoveryAdoption(pendingIncremental.capsule);
        adoptionChanged = adoption.verified === true || adoptionChanged;
      }
      if (adoptionChanged) result = await readHayakuSource(context);
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

  const setProviderStatus = (message, kind = '') => {
    const node = Runtime.root?.querySelector?.('#providerStatus');
    if (!node) return;
    node.textContent = text(message);
    node.style.color = kind === 'error' ? 'var(--lra-red)' : kind === 'ok' ? 'var(--lra-green)' : 'var(--lra-primary)';
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
      });
    }
    root.querySelector('#refreshTransition')?.addEventListener('click', () => refreshTransition());
    root.querySelector('#refreshColdStart')?.addEventListener('click', () => refreshColdStart());
    root.querySelector('#refreshIncrementalRecovery')?.addEventListener('click', () => refreshIncrementalRecovery());
    root.querySelector('#refreshLibra')?.addEventListener('click', () => refreshLibra());
    root.querySelector('#refreshFlashback')?.addEventListener('click', () => refreshFlashback());
    root.querySelector('#refreshHayaku')?.addEventListener('click', () => refreshHayaku());
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
        globalThis.alert?.(`HAYAKU \uD134 \uC774\uB3D9 \uC2E4\uD328\n${error?.message || error}`);
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
        if (typeof globalThis.confirm === 'function' && !globalThis.confirm(message)) return;
        setBusy(true);
        try {
          const deletion = await deleteHayakuRecord(record);
          globalThis.alert?.(`패킷 삭제를 확인했습니다. 활성 원장에서 제외되었으며 tombstone으로 보존됩니다.${deletion?.suppressedRecords ? `\n동일 variant alias ${formatNumber(deletion.suppressedRecords)}개 억제` : ''}`);
          await refreshHayaku();
          await refreshIncrementalRecovery();
        } catch (error) {
          globalThis.alert?.(`HAYAKU \uD328\uD0B7 \uC0AD\uC81C \uC2E4\uD328\n${error?.message || error}`);
        } finally {
          setBusy(false);
        }
        return;
      }
      const turns = recordRegenerationTurns(record);
      const message = `\uC774 \uD328\uD0B7\uC744 \uC7AC\uC0DD\uC131\uD560\uAE4C\uC694?\n\n\uB300\uC0C1 \uD134: ${turns.join(', ')}\n`
        + '\uC0C8 \uD328\uD0B7\uC774 \uAC80\uC99D\uB41C \uB4A4\uC5D0\uB9CC \uAE30\uC874 \uD328\uD0B7\uC744 tombstone \uCC98\uB9AC\uD558\uACE0 \uAD50\uCCB4\uD569\uB2C8\uB2E4.';
      if (typeof globalThis.confirm === 'function' && !globalThis.confirm(message)) return;
      setBusy(true);
      try {
        const result = await regenerateHayakuRecord(record);
        globalThis.alert?.(
          `HAYAKU \uD328\uD0B7 \uC7AC\uC0DD\uC131\uC744 \uC644\uB8CC\uD588\uC2B5\uB2C8\uB2E4.\n`
          + `\uD134 ${(result.recoveredTurns || []).join(', ')} \u00B7 \uAD50\uCCB4 ${formatNumber(result.adoption?.replacedRecords || 0)}\uAC1C`
        );
        await refreshHayaku();
        await refreshIncrementalRecovery();
      } catch (error) {
        globalThis.alert?.(`HAYAKU \uD328\uD0B7 \uC7AC\uC0DD\uC131 \uC2E4\uD328\n${error?.message || error}`);
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
    root.querySelector('#saveProvider')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const settings = await saveSettings(readProviderSettingsFromUi());
        setProviderStatus(`저장 완료 · Primary 프로필 · ${providerLabel(settings.primary.provider)}`, 'ok');
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
        globalThis.alert?.('이미 분석 작업이 실행 중입니다. 실시간 분석 콘솔에서 진행 상태를 확인하세요.');
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
        if (typeof globalThis.confirm === 'function' && !globalThis.confirm(confirmed)) return;
        const status = root.querySelector('#coldStartStatus');
        if (status) status.textContent = mode === 'readopt'
          ? '검증된 콜드스타트 캡슐을 다시 채택하는 중입니다.'
          : '콜드스타트를 백그라운드에서 시작합니다. GUI를 닫아도 분석은 계속됩니다.';
        setBusy(false);
        startBackgroundAnalysisTask('cold_start', mode, onProgress => executeColdStart({ mode, onProgress }));
        renderAnalysisConsole();
      } catch (error) {
        globalThis.alert?.(`HAYAKU 콜드스타트 실패\n${error?.message || error}`);
        await refreshColdStart();
      } finally {
        if (Runtime.busy) setBusy(false);
      }
    });
    root.querySelector('#runIncrementalRecovery')?.addEventListener('click', async () => {
      if (analysisIsRunning()) {
        globalThis.alert?.('이미 분석 작업이 실행 중입니다. 실시간 분석 콘솔에서 진행 상태를 확인하세요.');
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
        if (typeof globalThis.confirm === 'function' && !globalThis.confirm(confirmed)) return;
        const status = root.querySelector('#incrementalRecoveryStatus');
        if (status) status.textContent = mode === 'readopt'
          ? '검증된 증분 재분석 캡슐을 다시 채택하는 중입니다.'
          : '누락 턴 증분 재분석을 백그라운드에서 시작합니다. GUI를 닫아도 분석은 계속됩니다.';
        setBusy(false);
        startBackgroundAnalysisTask('incremental_recovery', mode, onProgress => executeIncrementalRecovery({ mode, onProgress }));
        renderAnalysisConsole();
      } catch (error) {
        globalThis.alert?.(`HAYAKU 증분 재분석 실패\n${error?.message || error}`);
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
        globalThis.alert?.(`LIBRA 내보내기 실패\n${error?.message || error}`);
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
        globalThis.alert?.(`Flashback 내보내기 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    root.querySelector('#backupHayaku')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const result = await backupHayakuLedger();
        globalThis.alert?.(
          `HAYAKU 미러 원장 백업을 완료했습니다.\n`
          + `레코드 ${formatNumber(result.recordCount)}개 · 슬롯 ${formatNumber(result.slotHeadCount)}개\n`
          + `백업 ID ${result.backupId}\n검증 ${result.verified ? '완료' : '실패'}`
        );
      } catch (error) {
        globalThis.alert?.(`HAYAKU 미러 원장 백업 실패\n${error?.message || error}`);
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
        globalThis.alert?.(`HAYAKU 내보내기 실패\n${error?.message || error}`);
      } finally {
        setBusy(false);
      }
    });
    root.querySelector('#createSession')?.addEventListener('click', async () => {
      setBusy(true);
      try {
        const preview = await inspectTransition();
        const message = `새 채팅을 만들고 기억을 이어갈까요?\n\n`
          + (preview.includeLibra
            ? `LIBRA 정본 레코드 ${formatNumber(preview.libraRecordCount)}개\n`
            : 'LIBRA 데이터 없음\n')
          + (preview.includeGradia
            ? `GRADIA Story Arc ${formatNumber(preview.gradiaStoryArcCount)}개 · Writer/OOC ${formatNumber(preview.gradiaWriterDesignCount)}개\n`
            : 'GRADIA 세션 데이터 없음\n')
          + (isLiaLivePersonaId(preview.identity?.personaId) ? 'LIA Live Persona · 새 채팅 전용 Fork\n' : 'LIA Live Persona 없음\n')
          + `Flashback 기억 ${formatNumber(preview.flashback.records)}개\n`
          + (preview.includeHayaku
            ? `HAYAKU 패킷 ${formatNumber(preview.hayakuRecordCount)}개`
            : 'HAYAKU 원장 없음')
          + '\n\n원본 채팅과 원장은 그대로 보존됩니다.';
        if (typeof globalThis.confirm === 'function' && !globalThis.confirm(message)) return;
        const result = await continueToNextSession();
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
        const gradiaStatus = result.gradiaVerified
          ? `GRADIA 승계 확인: Story Arc ${formatNumber(result.gradiaAdoption?.storyArc || result.gradiaStoryArc)} · Writer/OOC ${formatNumber(result.gradiaAdoption?.writerDesign || result.gradiaWriterDesign)}`
          : (result.gradiaStoryArc > 0 || result.gradiaWriterDesign > 0)
            ? `GRADIA 승계 표식 저장 · 영속 검증 실패: ${result.gradiaAdoption?.reason || 'unknown'}`
            : 'GRADIA 세션 데이터 없음';
        const liaStatus = result.liaRequired
          ? result.liaVerified
            ? `LIA Live Persona Fork 확인: ${result.targetLivePersonaId || result.liaAdoption?.livePersonaName || 'new Live Persona'}`
            : `LIA Live Persona Fork 검증 실패: ${result.liaAdoption?.reason || 'unknown'}`
          : 'LIA Live Persona 없음';
        globalThis.alert?.(
          `다음 세션을 만들었습니다.\n`
          + `${libraStatus}\n`
          + `${gradiaStatus}\n`
          + `${liaStatus}\n`
          + `${flashbackStatus}\n`
          + hayakuStatus
          + '\n\n원본 채팅과 원장은 그대로 보존됩니다.'
        );
        await refreshTransition();
      } catch (error) {
        globalThis.alert?.(`다음 세션 만들기 실패\n${error?.message || error}`);
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
      await Promise.all([refreshColdStart(), refreshIncrementalRecovery()]);
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
    continueToNextSession,
    adoptFlashbackSessionHandoff,
    adoptHayakuSessionHandoff,
    inspectColdStart,
    executeColdStart,
    reAdoptColdStart,
    inspectIncrementalRecovery,
    executeIncrementalRecovery,
    reAdoptIncrementalRecovery,
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
    readHayakuViewer: async () => readHayakuSource(await getCurrentContext()),
    readLibraViewer: async () => await readLibraSource(await getCurrentContext()),
    readGradiaSource: async () => await readGradiaSource(await getCurrentContext()),
    lastTransition: () => clone(Runtime.lastTransition, null),
    lastColdStart: () => clone(Runtime.lastColdStart, null),
    lastIncrementalRecovery: () => clone(Runtime.lastIncrementalRecovery, null),
    lastHayakuBackup: () => clone(Runtime.lastHayakuBackup, null),
    analysisStatus: analysisProgressSnapshot,
    waitForAnalysis: () => Runtime.analysisTask?.promise || Promise.resolve(null),
    _test: {
      fnv1a, flashbackKeyHash, flashbackShardChecksum, stableHash64, flashbackShardStorageKey, hayakuScopeFor, contextIdentity,
      requestFlashbackIpc, flashbackSourceFromInspection,
      requestHayakuIpc,
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
      requestGradiaIpc, probeGradiaIpc, normalizeGradiaInspection, readGradiaSource,
      requestLiaIpc, adoptLiaLivePersonaHandoff, isLiaLivePersonaId,
      prepareLibraSessionHandoff, adoptLibraSessionHandoff, adoptLibraSessionHandoffDurable, verifyDurableLibraSessionHandoff,
      prepareGradiaSessionHandoff, adoptGradiaSessionHandoff, adoptGradiaSessionHandoffDurable, verifyDurableGradiaSessionHandoff,
      requiredHandoffsVerified,
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
  await registerHayakuIpc().catch(error => warn('HAYAKU IPC registration failed', error));
  await registerLibraIpc().catch(error => warn('LIBRA IPC registration failed', error));
  await registerGradiaIpc().catch(error => warn('GRADIA IPC registration failed', error));
  await registerLiaIpc().catch(error => warn('LIA IPC registration failed', error));
  await registerUi();
  const unloadApi = liveApi(['onUnload']);
  if (typeof unloadApi?.onUnload === 'function') {
    await unloadApi.onUnload(async () => {
      Runtime.visible = false;
      stopAnalysisRefreshTimer();
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
      for (const pending of Runtime.libraIpcPending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error('RE:TRACE unloaded before LIBRA IPC completed.'));
      }
      Runtime.libraIpcPending.clear();
      for (const pending of Runtime.gradiaIpcPending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error('RE:TRACE unloaded before GRADIA IPC completed.'));
      }
      Runtime.gradiaIpcPending.clear();
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
