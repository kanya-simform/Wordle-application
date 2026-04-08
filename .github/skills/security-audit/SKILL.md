---
name: security-audit
description: Run a comprehensive security audit of the codebase based on 16 critical rules covering secrets management, authentication, input validation, dependencies, CORS, logging, HTTPS, session management, rate limiting, file uploads, security headers, and debug mode. Generates a detailed report with PASS/FAIL/NA verdicts, evidence, and remediation steps for each rule.
---

​================================================================================ Security Audit — Version 3.4

Simform Edition
CONFIGURATION

Name: Security Audit

================================================================================

CORE BEHAVIORAL RULES
RULE: Evidence before verdict. Every FAIL verdict MUST cite at least one exact file path and line number. If no file evidence exists for a rule → assign NA, never FAIL.

RULE: Default to PASS on ambiguity. If signals are partial, incomplete, or unclear → assign PASS with a note. Only FAIL when the violation is explicit and confirmed in source code.

RULE: No inference allowed. Do NOT infer, assume, or guess implementations. Do NOT penalise the absence of patterns you expected but did not find. Only evaluate patterns physically present in the repository.

RULE: No invented violations. If a rule has no confirming or disconfirming evidence → NA. NA rules are excluded from scoring and violation tables.

================================================================================

EXECUTION STEPS
STEP 0 — Full Repository Inventory (MANDATORY — run before anything else)

Detect the operating system: Mac / Linux → use bash/zsh shell Windows → use PowerShell

Run the appropriate command for the detected OS:

MAC / LINUX (bash): find . -type f ( \ -name ".ts" -o -name ".tsx" -o -name ".js" -o -name ".jsx" \ -o -name ".java" -o -name ".kt" -o -name ".swift" -o -name ".dart" \ -o -name ".cs" -o -name ".py" -o -name ".go" -o -name ".rb" \ -o -name ".php" -o -name ".cpp" -o -name ".c" -o -name ".h" \ -o -name ".json" -o -name ".xml" -o -name ".yaml" -o -name ".yml" \ -o -name ".toml" -o -name ".env" -o -name ".conf" -o -name ".gradle"\ -o -name ".csproj" -o -name "\*.sln" -o -name ".pubspec.yaml" \ -o -name ".tf" -o -name ".bicep" -o -name ".lock" -o -name "Gemfile" \ -o -name "pom.xml" -o -name "go.mod" -o -name "composer.json" \ ) | grep -v node_modules | grep -v dist | grep -v .git \ | grep -v build | grep -v .dart_tool | grep -v pycache \ | grep -v .gradle | grep -v bin | grep -v obj \ | sort

WINDOWS (PowerShell): Get-ChildItem -Recurse -File | Where-Object { $.Extension -in @( '.ts','.tsx','.js','.jsx', '.java','.kt','.swift','.dart', '.cs','.py','.go','.rb', '.php','.cpp','.c','.h', '.json','.xml','.yaml','.yml', '.toml','.conf','.gradle','.lock', '.csproj','.sln','.tf','.bicep' ) -or $.Name -in @( 'pom.xml','go.mod','Gemfile','composer.json','pubspec.yaml' ) -and $.FullName -notmatch 'node*modules|\dist|.git|\build|\_\_pycache*|.dart_tool|.gradle|\bin|\obj\' } | Select-Object -ExpandProperty FullName | Sort-Object

Save the complete file list to: Audit Report Output/.file-inventory.txt

Record total file count in audit metadata. If count = 0 → abort and report: "Repository scan failed — no source files found."

Do NOT begin any rule evaluation until the full inventory is saved.

For every rule scan: read files from this inventory list — never from memory or assumption. Every file in the inventory MUST be checked against each applicable rule.

STEP 1 — Fingerprint Compute: git rev-parse HEAD + sha256 of repository tree Save to: Audit Report Output/.repo-fingerprint.json

STEP 2 — Cache check If fingerprint unchanged AND .security-audit-cache.json exists: Load cache → skip scanning → go to STEP 5.

STEP 3 — Project Type Detection Run detection against files in .file-inventory.txt (not memory).

STEP 4 — Scan For each of the 16 rules: a. Filter .file-inventory.txt for files relevant to the rule scope. b. Read each relevant file in full. c. Record finding: FAIL / PASS / NA with exact file path and line number. Save results to: Audit Report Output/.security-audit-cache.json

STEP 5 — Render Populate the HTML template below. Replace only the placeholder tokens listed in the TEMPLATE TOKENS section. Do NOT modify any other part of the template.

================================================================================

================================================================================

PROJECT TYPE DETECTION
Run detection against files in .file-inventory.txt (not memory).

STEP A — Detect language and platform:

JavaScript / TypeScript → package.json present in inventory React / Vue / Angular → react, vue, @angular found in package.json dependencies Java / Spring → pom.xml or _.gradle present .NET / C# → _.csproj or \*.sln present Flutter / Dart → pubspec.yaml present Python → requirements.txt, pyproject.toml, or setup.py present Go → go.mod present Ruby on Rails → Gemfile present PHP / Laravel → composer.json present

A repository may match multiple — detect ALL that apply.

STEP B — Classify layers:

Frontend detected if: react, vue, angular, svelte, next.js, nuxt, flutter/dart present Backend detected if: express, nestjs, spring, django, fastapi, koa, rails, laravel, .NET controllers, Go HTTP handlers, or Java servlets present IaC detected if: _.tf, _.bicep, \*.csproj with cloud SDK, serverless.yml present

A repository may be BOTH frontend and backend. Apply all applicable rules to each layer.

STEP C — Apply NA rules based on detected layers:

If NO frontend detected: RULE-02 (Env tokens in frontend bundle) → NA RULE-07 (XSS vulnerabilities) → NA

If NO backend detected: RULE-06 (SQL/NoSQL injection) → NA RULE-09 (CORS misconfiguration) → NA RULE-10 (Sensitive data in logs) — evaluate only if any logging found in frontend RULE-13 (Missing rate limiting) → NA

If NO IaC files detected: RULE-15 (Missing security headers) — evaluate nginx.conf/hosting config only; if neither found → NA

STEP D — Adjust secret patterns per language:

JavaScript / TypeScript: process.env., import.meta.env. Java: System.getenv(), @Value("${...}"), application.properties .NET / C#: Environment.GetEnvironmentVariable(), appsettings.json references Python: os.environ.get(), os.getenv(), .env via python-dotenv Dart / Flutter: String.fromEnvironment(), --dart-define flags Go: os.Getenv() Ruby: ENV["..."] PHP: $\_ENV["..."], getenv()

For each language, secrets are ALLOWED if loaded via the above patterns. FAIL only if a literal value is hardcoded directly in source.

================================================================================

SECURITY RULESET (LOCKED — DO NOT MODIFY RULES)
RULE-01 | Hardcoded secrets / credentials Severity: High | Scope: All FAIL ONLY if: A literal secret VALUE (API key, password, private key) is hardcoded directly in source — not loaded via environment variable or secret manager. Patterns (any language): JavaScript/TS: apiKey = "abc123", password = "secret", token = "xyz" Java: String password = "secret"; (not from System.getenv or @Value) C# / .NET: string apiKey = "abc123"; (not from GetEnvironmentVariable or appsettings ref) Python: API*KEY = "abc123" (not from os.environ or os.getenv) Dart: final apiKey = "abc123"; (not from String.fromEnvironment) Go: apiKey := "abc123" (not from os.Getenv) Ruby: API_KEY = "abc123" (not from ENV[]) PHP: $apiKey = "abc123"; (not from getenv or $\_ENV) PASS if: All sensitive values loaded via environment variables or secret manager per language. Placeholder values in *.example, \_.sample files are ALLOWED. Evidence required: exact file and line with the literal hardcoded value.

RULE-02 | Environment variables / tokens exposed in frontend bundle Severity: High | Scope: Frontend FAIL ONLY if: import.meta.env._ or process.env._ variables containing auth tokens, access keys, or session IDs are used directly as Bearer tokens or Authorization header values in frontend source code. Note: VITE* variables are embedded into the JS bundle at build time and readable by any user via DevTools. Auth tokens must NOT flow through frontend env vars. PASS if: Auth tokens come from httpOnly cookies or a backend session endpoint only. Non-sensitive config (base URLs, feature flags, public DSNs) via env vars is ALLOWED. NA if: No frontend env var usage found. Evidence required: exact file and line showing VITE*\_TOKEN or equivalent used as auth credential.

RULE-03 | API keys in source code Severity: High | Scope: All FAIL ONLY if: API key values are hardcoded as string literals in committed source files (not in .env files, not in git-ignored config). PASS if: All API keys loaded from environment variables or a git-ignored config file. NA if: No external API integrations in codebase. Evidence required: exact file and line.

RULE-04 | Weak authentication / authorization Severity: High | Scope: All FAIL ONLY if: A bypass authentication mode exists in source code — e.g. a flag or condition that skips SSO/token validation and uses static credentials instead. FAIL signal: isStaticTokenMode(), BYPASS_AUTH, USE_MOCK_AUTH patterns that set auth headers from hardcoded or env-var tokens rather than real auth flow. PASS if: Single authentication path enforced for all environments with no bypass conditions. Evidence required: exact file and line showing the bypass condition and static credential use.

RULE-05 | Missing input validation Severity: Medium | Scope: All SIGNALS by language: JavaScript/TS: zod, yup, joi, class-validator, react-hook-form, HTML5 required/pattern Java: javax.validation, jakarta.validation, Hibernate Validator, @Valid, @NotNull C# / .NET: DataAnnotations, FluentValidation, ModelState.IsValid Python: pydantic, marshmallow, cerberus, wtforms validators Dart/Flutter: Form + validator: callback, flutter_form_builder Go: go-playground/validator, ozzo-validation Ruby: ActiveRecord validations, dry-validation PHP: Laravel Validator, Symfony Validator, respect/validation PASS if: Any validation signal found for the detected language. Typed API schemas (OData, GraphQL, gRPC proto) count as PASS. FAIL if: No validation found AND user-facing inputs or API endpoints exist. NA if: No user-facing inputs or API endpoints in codebase. Evidence required: file confirming no validation library in dependencies.

RULE-06 | SQL / NoSQL injection risks Severity: Medium | Scope: Backend FAIL ONLY if: Raw user input concatenated directly into a database query string without parameterization or an ORM. Confirmed by direct code inspection. Safe patterns by language (PASS if any present): JavaScript/TS: Prisma, TypeORM, Sequelize, Mongoose, parameterized pg/mysql2 queries Java: JPA/Hibernate, PreparedStatement, Spring Data, MyBatis with #{} C# / .NET: Entity Framework, Dapper with parameters, SqlCommand with SqlParameter Python: SQLAlchemy ORM, Django ORM, parameterized cursor.execute("...", (val,)) Dart/Flutter: sqflite with parameterized queries, Drift ORM Go: GORM, sqlx with named params, db.Query with ? placeholders Ruby: ActiveRecord ORM, parameterized queries PHP: Eloquent ORM, PDO with prepared statements PASS if: ORM used OR parameterized queries confirmed OR typed API (OData, GraphQL, gRPC). NA if: No direct database queries in codebase (frontend-only or API-proxy pattern). Evidence required: exact file and line showing raw string concatenation into query.

RULE-07 | XSS vulnerabilities Severity: Medium | Scope: Frontend FAIL ONLY if: Unsanitized user-controlled HTML is rendered directly into the DOM. Patterns by framework (FAIL if found without sanitization): React: dangerouslySetInnerHTML without DOMPurify.sanitize() on same call Angular: [innerHTML] binding without DomSanitizer.bypassSecurityTrustHtml (Angular sanitizes by default — only fail if bypass used unsafely) Vue: v-html directive without sanitization library Vanilla JS: innerHTML =, document.write( with unsanitized user input Flutter/Dart: WebView.loadHtmlString with unsanitized user content Java (JSP/Thymeleaf): th:utext or <%= %> with unsanitized user input C# (Razor): @Html.Raw() with unsanitized user input PHP: echo $\_GET/POST values without htmlspecialchars() or htmlentities() Ruby (ERB): raw() or html_safe without sanitization PASS if: All dynamic HTML rendering uses framework-native sanitization or a library (DOMPurify, OWASP Java HTML Sanitizer, HtmlSanitizer .NET, Sanitize gem). NA if: No HTML rendering with user-controlled content found. Evidence required: exact file and line showing unsanitized dynamic HTML render.

RULE-08 | Insecure dependencies Severity: Medium | Scope: All Dependency manifest by language: JavaScript/TS: package.json + package-lock.json / yarn.lock / pnpm-lock.yaml Java: pom.xml (Maven) or build.gradle (Gradle) C# / .NET: \*.csproj NuGet packages Python: requirements.txt, pyproject.toml, Pipfile Dart/Flutter: pubspec.yaml + pubspec.lock Go: go.mod + go.sum Ruby: Gemfile + Gemfile.lock PHP: composer.json + composer.lock FAIL ONLY if: A dependency has a known critical CVE (CVSS >= 9.0) confirmed by direct inspection of the pinned version in the manifest. PASS if: No critical CVEs found in pinned versions, OR security audit tooling (npm audit, OWASP Dependency-Check, Snyk, Dependabot, trivy) configured. NA if: No dependency manifest found in repository. Evidence required: package name, pinned version, and CVE reference.

RULE-09 | CORS misconfiguration Severity: Medium | Scope: Backend FAIL ONLY if: CORS configured with wildcard origin (\*) AND credentials: true, OR CORS allows arbitrary untrusted origins without a whitelist. PASS if: CORS restricted to specific trusted origins OR withCredentials used with explicit origin whitelist only. NA if: No CORS configuration found (frontend-only project). Evidence required: exact file and line with the misconfigured CORS setting.

RULE-10 | Sensitive data in logs Severity: High | Scope: All FAIL ONLY if BOTH: (1) a logging statement exists AND (2) a sensitive field name (password, token, accessToken, sessionId, creditCard, ssn, secret, apiKey) is passed directly into it without masking. Logging statements by language: JavaScript/TS: console.log/error/warn, winston, pino, bunyan Java: log.info/debug/error, System.out.println, Logger.log C# / .NET: \_logger.Log, Console.WriteLine, Debug.WriteLine Python: logging.info/debug/error, print() in production code Dart/Flutter: print(), debugPrint(), Logger.log Go: log.Print, log.Fatal, fmt.Print in handlers Ruby: Rails.logger, puts in production PHP: error_log, Log::info PASS if: No logging found OR all sensitive fields are masked/redacted before logging. NA if: No logging of any kind found in codebase. Evidence required: exact file and line confirming sensitive field name inside log call.

RULE-11 | Missing HTTPS enforcement Severity: Medium | Scope: All FAIL ONLY if: Hardcoded http:// URL (not https://) found in production source pointing to an external API or backend endpoint. PASS if: All external URLs use https:// OR are loaded from environment config. NA if: No hardcoded external URLs in codebase. Note: localhost and 127.0.0.1 are ALLOWED — do NOT flag. Evidence required: exact file and line with the http:// URL.

RULE-12 | Inadequate session management Severity: High | Scope: Frontend FAIL ONLY if: Auth tokens or session identifiers stored in localStorage with no expiry, no refresh logic, and no httpOnly cookie alternative. PASS if: Tokens in sessionStorage only OR httpOnly cookies used OR expiry/refresh logic confirmed present. NA if: No session token storage found in codebase. Evidence required: exact file and line.

RULE-13 | Missing rate limiting Severity: Medium | Scope: Backend SIGNALS by framework: JavaScript/TS: express-rate-limit, rate-limiter-flexible, @nestjs/throttler, slowDown Java: Bucket4j, Resilience4j RateLimiter, Spring Cloud Gateway rate filter C# / .NET: AspNetCoreRateLimit, .NET 7+ rate limiting middleware Python: fastapi-limiter, django-ratelimit, Flask-Limiter, slowapi Dart/Flutter: server-side only; check backend framework used Go: golang.org/x/time/rate, tollbooth, ulule/limiter Ruby: rack-attack, throttle gem PHP: Laravel ThrottleRequests middleware, Symfony rate limiter Infrastructure: API Gateway rate limiting (AWS, Azure, GCP, Kong, Nginx limit_req) PASS if: Any signal found in source, dependencies, or infrastructure config. FAIL if: No signal found AND backend API endpoints exist. NA if: No backend detected in repository. Evidence required: file confirming no rate-limiting in source or dependencies.

RULE-14 | Insecure file uploads Severity: Medium | Scope: Backend FAIL ONLY if: File upload endpoint found with no MIME type validation, no file size limit, and no storage path restriction. PASS if: File type validation, size limits, and safe storage path confirmed. NA if: No file upload functionality in codebase. Evidence required: exact file and line showing upload handler without validation.

RULE-15 | Missing security headers Severity: High | Scope: All FAIL ONLY if: A production server or hosting config is found AND fewer than 2 of these headers are configured: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy. Qualifying config files by platform: Web server: nginx.conf, apache.conf, httpd.conf, .htaccess Hosting: vercel.json, netlify.toml, next.config.js, firebase.json Java: SecurityConfig.java (Spring Security headers), web.xml filter C# / .NET: Program.cs / Startup.cs with app.UseXContentTypeOptions etc., web.config customHeaders section Python: Django SECURE\_\* settings, Flask-Talisman, FastAPI middleware Go: HTTP middleware setting response headers Ruby: Rails config with secure_headers gem or SecurityHeaders middleware PHP: Laravel middleware setting headers, .htaccess headers PASS if: At least 2 security headers confirmed in any qualifying config for the detected stack. NA if: No production server config, hosting config, or security middleware found. Note: vite.config.ts and webpack.config.js are DEV configs — do NOT count for this rule. Evidence required: exact file confirming the production config and header absence.

RULE-16 | Debug mode in production Severity: Low | Scope: All FAIL ONLY if: Debug flags or verbose dev output are enabled unconditionally — NOT gated behind an environment check. Patterns by language (FAIL if ungated): JavaScript/TS: import.meta.env.DEV, process.env.NODE_ENV === "development" Java: Spring: spring.profiles.active=prod check; debug=true in application.properties C# / .NET: #if DEBUG blocks, IsDevelopment() checks in Startup Python: DEBUG = True in Django settings without env check, Flask debug=True Dart/Flutter: kDebugMode, kReleaseMode guards around debug output Go: gin.SetMode(gin.DebugMode) without environment check Ruby: Rails.env.development? guard, config.log_level = :debug ungated PHP: APP_DEBUG=true in .env without environment check PASS if: All debug output and dev features are gated behind environment checks. NA if: No debug flags or dev-only features found in codebase. Evidence required: exact file and line showing ungated debug flag or output.

================================================================================

SEVERITY LOCK (MANDATORY — NEVER CHANGE)
High: RULE-01, RULE-02, RULE-03, RULE-04, RULE-10, RULE-12, RULE-15 Medium: RULE-05, RULE-06, RULE-07, RULE-08, RULE-09, RULE-11, RULE-13, RULE-14 Low: RULE-16

NA vs PASS — HARD RULE (MANDATORY)
If a rule's NA condition is met → verdict MUST be NA. Never PASS.

NA means: the rule is not applicable to this project type or codebase. PASS means: the rule was evaluated and the code is compliant.

These are mutually exclusive. A rule with a met NA condition can NEVER be PASS.

Examples: RULE-06 (SQL injection) — frontend-only project → NA, not PASS RULE-09 (CORS) — no backend found → NA, not PASS RULE-13 (Rate limiting) — no backend found → NA, not PASS RULE-14 (File uploads) — no upload functionality → NA, not PASS

================================================================================

SORTING RULE (MANDATORY)
All tables MUST follow this order: 1. Severity: High → Medium → Low 2. Within same severity → Rule Number ascending 3. Within same rule → File path alphabetical 4. Within same file → Line number ascending

Applies to: Section 2 — Violated Rules Summary Section 3 — Passed & NA Rules Section 4 — Rule-Wise Analysis

================================================================================

OVERALL RISK CALCULATION (MANDATORY)
If any High rule FAILS → Overall Risk = HIGH Else if any Medium FAILS → Overall Risk = MEDIUM Else → Overall Risk = LOW

================================================================================

EVIDENCE FORMAT
Always use: filepath:lineNumber or filepath:startLine-endLine Example: src/api/userService.ts:42

If rule fails due to absent dependency or config: "No file found matching: [pattern list]"

================================================================================

ANTI-HALLUCINATION CHECKLIST (run before rendering)
[ ] STEP 0 completed — .file-inventory.txt exists and file count > 0. [ ] Language and platform detected from inventory before any rule evaluation. [ ] Rule signals matched to the detected language stack — not assumed to be JS/TS. [ ] Every rule was evaluated against the file inventory, not from memory. [ ] Every FAILED rule has a confirmed file path and line number from the inventory. [ ] No rule is FAILED based on assumption — only observed source code. [ ] No rule appears in both violated and passed sections. [ ] NA rules appear only in Section 3.2 — never in violated or passed sections. [ ] Every rule whose NA condition is met is marked NA — not PASS. [ ] RULE-02 — confirmed env var used as Bearer/auth token, not just config or DSN. [ ] RULE-07 — confirmed dangerouslySetInnerHTML has no DOMPurify.sanitize() on same call. [ ] RULE-10 — both logging statement AND sensitive field name confirmed in same log call. [ ] RULE-15 — production server config (nginx/vercel/netlify) confirmed present AND headers counted. vite.config.ts not used. [ ] Severity matches lock table for every rule. [ ] Overall risk calculation applied correctly. [ ] IST timestamp included in footer. [ ] Output path is correct.

================================================================================

OUTPUT LOCATION
Folder: Audit Report Output/ Filename: security-audit-report-YYYYMMDD-HHMMSS-IST.html

Side files written during execution: Audit Report Output/.file-inventory.txt — full file list from STEP 0 Audit Report Output/.repo-fingerprint.json — git hash + tree hash Audit Report Output/.security-audit-cache.json — scan results cache

If folder does not exist → create it.

================================================================================

HTML TEMPLATE — LOCKED
The template below is LOCKED. You MUST: • Copy it exactly as written • Replace ONLY the tokens listed in the TOKEN REFERENCE section • Never add new CSS, change colors, or alter layout • Never add new sections or rename sections

TOKEN REFERENCE — replace these tokens with actual values:

{{PROJECT_NAME}} — detected project name from package.json or repo root {{REPORT_DATE}} — e.g. 05 March 2026, 20:30 IST {{GIT_COMMIT}} — short commit hash {{PROJECT_TYPE}} — e.g. Frontend SPA (React + Vite) / Backend (Node + Express) {{OVERALL_RISK}} — HIGH / MEDIUM / LOW {{RISK_CLASS}} — risk-high / risk-medium / risk-low (used for CSS class) {{TOTAL_RULES}} — count of PASS + FAIL rules (exclude NA) {{PASSED_COUNT}} — count of PASSED rules {{FAILED_COUNT}} — count of FAILED rules {{NA_COUNT}} — count of NA rules {{HIGH_FAIL}} — count of High severity FAILs {{MEDIUM_FAIL}} — count of Medium severity FAILs {{LOW_FAIL}} — count of Low severity FAILs

{{VIOLATED_RULES_ROWS}} — one <tr> per FAILED rule (see row format below) {{PASSED_ROWS}} — one <tr> per PASSED rule (see row format below) {{NA_ROWS}} — one <tr> per NA rule (see row format below) {{RULE_ANALYSIS}} — one analysis block per FAILED rule (see block format below)

ROW FORMAT — Section 2 Violated Rules ({{VIOLATED_RULES_ROWS}}):

<tr> <td>1</td> <td><span class="rule-id">RULE-03</span> Secrets exposed in frontend code</td> <td>src/config/api.ts:12</td> <td>Hardcoded API key visible in client bundle; any user can extract it</td> <td>Move to import.meta.env.VITE_API_KEY and add to .gitignore</td> <td><span class="badge-high">High</span></td> </tr>

Severity badge classes: badge-high | badge-medium | badge-low

ROW FORMAT — Section 3.1 Passed Rules ({{PASSED_ROWS}}):

<tr> <td>1</td> <td><span class="rule-id">RULE-08</span> Insecure dependencies</td> <td>All dependencies on safe versions; no critical CVEs found in package.json</td> </tr>

ROW FORMAT — Section 3.2 NA Rules ({{NA_ROWS}}):

<tr> <td>1</td> <td><span class="rule-id">RULE-06</span> SQL / NoSQL injection risks</td> <td>No direct database queries in codebase; all data access through OData API</td> </tr>

BLOCK FORMAT — Section 4 Rule Analysis ({{RULE_ANALYSIS}}):

# <div class="analysis-block"> <div class="analysis-header"> <span class="rule-id">RULE-03</span> <span class="analysis-title">Secrets exposed in frontend code</span> <span class="badge-high">High</span> </div> <div class="analysis-body"> <p><strong>What was found:</strong> Hardcoded API key assigned to a string literal in production source.</p> <p><strong>Files affected:</strong> <code>src/config/api.ts:12</code></p> <p><strong>Remediation steps:</strong></p> <ol> <li>Remove the hardcoded value from source immediately.</li> <li>Add the variable to your .env file: <code>VITE_API_KEY=your_key_here</code></li> <li>Reference it in code as <code>import.meta.env.VITE_API_KEY</code></li> <li>Add .env to .gitignore and rotate the exposed key.</li> </ol> </div> </div>

BEGIN HTML TEMPLATE

<!DOCTYPE html> <html lang="en">

<head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Security Audit Report — {{PROJECT_NAME}}</title> <style> *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } :root { --brand: #ef5366; --brand-dark: #c73e52; --brand-light: #fdeef0; --brand-muted: #fbd5da; --pass: #16a34a; --pass-bg: #dcfce7; --fail: #dc2626; --fail-bg: #fee2e2; --warn: #d97706; --warn-bg: #fef3c7; --na: #6b7280; --na-bg: #f3f4f6; --text: #111827; --text-muted: #6b7280; --border: #e5e7eb; --surface: #ffffff; --bg: #f9fafb; --radius: 8px; --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05); } body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.6; } /* ── HEADER ── */ .report-header { background: var(--brand); color: #fff; padding: 32px 48px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; } .header-logo img { height: 36px; filter: brightness(0) invert(1); } .header-title h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; } .header-title p { font-size: 13px; opacity: 0.85; margin-top: 4px; } .header-meta { display: flex; gap: 12px; flex-wrap: wrap; } .meta-chip { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 4px 14px; font-size: 12px; white-space: nowrap; } /* ── SCORE BAR ── */ .score-bar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 24px 48px; display: flex; gap: 20px; flex-wrap: wrap; align-items: center; } .score-card { flex: 1; min-width: 120px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; text-align: center; } .score-card .sc-value { font-size: 30px; font-weight: 700; line-height: 1.1; } .score-card .sc-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-top: 4px; } .score-card.risk-high .sc-value { color: var(--fail); } .score-card.risk-medium .sc-value { color: var(--warn); } .score-card.risk-low .sc-value { color: var(--pass); } .score-card.green .sc-value { color: var(--pass); } .score-card.red .sc-value { color: var(--fail); } .score-card.orange .sc-value { color: var(--warn); } .score-card.gray .sc-value { color: var(--na); } /* ── LAYOUT ── */ .report-body { max-width: 1280px; margin: 0 auto; padding: 36px 48px; } /* ── SECTION ── */ .section { margin-bottom: 48px; } .section-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--brand); } .section-number { background: var(--brand); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 4px; letter-spacing: 0.5px; } .section-title { font-size: 17px; font-weight: 700; color: var(--text); } /* ── RISK BANNER ── */ .risk-banner { border-radius: var(--radius); padding: 18px 24px; font-size: 16px; font-weight: 700; margin-bottom: 28px; border: 2px solid; } .risk-banner.risk-high { background: var(--fail-bg); color: var(--fail); border-color: #fecaca; } .risk-banner.risk-medium { background: var(--warn-bg); color: var(--warn); border-color: #fde68a; } .risk-banner.risk-low { background: var(--pass-bg); color: var(--pass); border-color: #bbf7d0; } /* ── METADATA GRID ── */ .meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; } .meta-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; box-shadow: var(--shadow); } .meta-item .mi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-muted); margin-bottom: 4px; } .meta-item .mi-value { font-size: 15px; font-weight: 600; color: var(--text); } /* ── TABLES ── */ .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow); } table { width: 100%; border-collapse: collapse; background: var(--surface); } thead th { background: var(--brand); color: #fff; padding: 11px 14px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; } tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; } tbody tr:last-child { border-bottom: none; } tbody tr:hover { background: var(--brand-light); } tbody td { padding: 11px 14px; font-size: 13px; vertical-align: top; } tbody td:first-child { font-weight: 600; color: var(--text-muted); width: 40px; } code { background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 1px 6px; font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace; font-size: 12px; color: var(--brand-dark); } /* ── BADGES ── */ .rule-id { display: inline-block; background: var(--brand-light); color: var(--brand-dark); border: 1px solid var(--brand-muted); border-radius: 4px; padding: 1px 7px; font-size: 11px; font-weight: 700; margin-right: 6px; white-space: nowrap; } .badge-high, .badge-medium, .badge-low, .badge-pass, .badge-na { display: inline-block; border-radius: 12px; padding: 2px 10px; font-size: 11px; font-weight: 700; white-space: nowrap; } .badge-high { background: var(--fail-bg); color: var(--fail); border: 1px solid #fecaca; } .badge-medium { background: var(--warn-bg); color: var(--warn); border: 1px solid #fde68a; } .badge-low { background: var(--na-bg); color: var(--na); border: 1px solid #d1d5db; } .badge-pass { background: var(--pass-bg); color: var(--pass); border: 1px solid #bbf7d0; } .badge-na { background: var(--na-bg); color: var(--na); border: 1px solid #d1d5db; } /* ── RULE ANALYSIS BLOCKS ── */ .analysis-block { background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--brand); border-radius: var(--radius); margin-bottom: 16px; box-shadow: var(--shadow); overflow: hidden; } .analysis-header { background: var(--brand-light); border-bottom: 1px solid var(--brand-muted); padding: 12px 18px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; } .analysis-title { font-size: 14px; font-weight: 700; color: var(--text); flex: 1; } .analysis-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; font-size: 13px; } .analysis-body p { line-height: 1.6; } .analysis-body ol, .analysis-body ul { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; margin-top: 6px; } /* ── FOOTER ── */ .report-footer { background: var(--brand); color: rgba(255,255,255,0.85); text-align: center; padding: 20px 48px; font-size: 12px; margin-top: 40px; } .report-footer img { height: 24px; filter: brightness(0) invert(1); margin-bottom: 8px; } .report-footer p { margin-top: 4px; } </style> </head>
<body>

<!-- HEADER -->
<header class="report-header">

<div class="header-logo"> <img src="https://www.simform.com/wp-content/uploads/2024/12/simform-logo.svg" alt="Simform" /> </div> <div class="header-title"> <h1>Security Audit Report</h1> <p>{{PROJECT_NAME}}</p> </div> <div class="header-meta"> <span class="meta-chip">📅 {{REPORT_DATE}}</span> <span class="meta-chip">🔀 {{GIT_COMMIT}}</span> </div>
</header>

<!-- SCORE BAR --> <div class="score-bar"> <div class="score-card {{RISK_CLASS}}"> <div class="sc-value">{{OVERALL_RISK}}</div> <div class="sc-label">Overall Risk</div> </div> <div class="score-card green"> <div class="sc-value">{{PASSED_COUNT}}</div> <div class="sc-label">Passed</div> </div> <div class="score-card red"> <div class="sc-value">{{FAILED_COUNT}}</div> <div class="sc-label">Failed</div> </div> <div class="score-card gray"> <div class="sc-value">{{NA_COUNT}}</div> <div class="sc-label">N/A</div> </div> <div class="score-card red"> <div class="sc-value">{{HIGH_FAIL}}</div> <div class="sc-label">High Fails</div> </div> <div class="score-card orange"> <div class="sc-value">{{MEDIUM_FAIL}}</div> <div class="sc-label">Medium Fails</div> </div> <div class="score-card gray"> <div class="sc-value">{{LOW_FAIL}}</div> <div class="sc-label">Low Fails</div> </div> </div> <!-- REPORT BODY -->
<main class="report-body">

<!-- ── SECTION 1 — AUDIT METADATA ── -->
<section class="section"> <div class="section-heading"> <span class="section-number">SECTION 1</span> <span class="section-title">Audit Metadata</span> </div> <div class="risk-banner {{RISK_CLASS}}"> 🔐 Overall Risk Rating: {{OVERALL_RISK}} </div> <div class="meta-grid"> <div class="meta-item"><div class="mi-label">Project Name</div><div class="mi-value">{{PROJECT_NAME}}</div></div> <div class="meta-item"><div class="mi-label">Report Generated</div><div class="mi-value">{{REPORT_DATE}}</div></div> <div class="meta-item"><div class="mi-label">Git Commit</div><div class="mi-value">{{GIT_COMMIT}}</div></div> <div class="meta-item"><div class="mi-label">Project Type</div><div class="mi-value">{{PROJECT_TYPE}}</div></div> <div class="meta-item"><div class="mi-label">Execution Model</div><div class="mi-value">claude-sonnet-4-5</div></div> <div class="meta-item"><div class="mi-label">Total Rules Evaluated</div><div class="mi-value">16</div></div> <div class="meta-item"><div class="mi-label">Passed</div><div class="mi-value" style="color:var(--pass)">{{PASSED_COUNT}}</div></div> <div class="meta-item"><div class="mi-label">Failed</div><div class="mi-value" style="color:var(--fail)">{{FAILED_COUNT}}</div></div> <div class="meta-item"><div class="mi-label">Not Applicable</div><div class="mi-value" style="color:var(--na)">{{NA_COUNT}}</div></div> <div class="meta-item"></div> </div> </section>

<!-- ── SECTION 2 — VIOLATED RULES ── -->
<section class="section"> <div class="section-heading"> <span class="section-number">SECTION 2</span> <span class="section-title">Violated Rules Summary</span> </div> <div class="table-wrap"> <table> <thead> <tr> <th>#</th> <th>Rule</th> <th>File · Line</th> <th>Impact</th> <th>What to Fix</th> <th>Severity</th> </tr> </thead> <tbody> {{VIOLATED_RULES_ROWS}} </tbody> </table> </div> </section>

<!-- ── SECTION 3 — PASSED & NA RULES ── -->
<section class="section"> <div class="section-heading"> <span class="section-number">SECTION 3</span> <span class="section-title">Passed & NA Rules</span> </div>

<h3 style="font-size:14px; font-weight:700; color:var(--text); margin-bottom:12px;">3.1 — Passed Rules</h3>
<div class="table-wrap" style="margin-bottom:24px;">
  <table>
    <thead>
      <tr>
        <th style="width:8%">#</th>
        <th style="width:37%">Rule</th>
        <th style="width:55%">Why It's Passed</th>
      </tr>
    </thead>
    <tbody>
      {{PASSED_ROWS}}
    </tbody>
  </table>
</div>

<h3 style="font-size:14px; font-weight:700; color:var(--text); margin-bottom:12px;">3.2 — Not Applicable Rules</h3>
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th style="width:8%">#</th>
        <th style="width:37%">Rule</th>
        <th style="width:55%">Why It's NA</th>
      </tr>
    </thead>
    <tbody>
      {{NA_ROWS}}
    </tbody>
  </table>
</div>
</section>

<!-- ── SECTION 4 — RULE-WISE ANALYSIS ── -->
<section class="section"> <div class="section-heading"> <span class="section-number">SECTION 4</span> <span class="section-title">Rule-Wise Analysis (Violated Rules Only)</span> </div> {{RULE_ANALYSIS}} </section>

</main>

<!-- FOOTER -->
<footer class="report-footer">

Simform
Security Audit Report · {{REPORT_DATE}}

<p style="margin-top:4px; opacity:0.7;">Powered by Simform Engineering Excellence Program</p>
</footer>

</body> </html>

======================================================================

# END HTML TEMPLATE

STRICTLY PROHIBITED
Skipping STEP 0 file inventory or evaluating rules before inventory is complete
Evaluating any rule from memory instead of files listed in .file-inventory.txt
Applying JavaScript/TypeScript rule signals to a Java, .NET, Python, or other language codebase
Assuming project type without reading the inventory
Modifying the HTML template structure or CSS
Guessing or approximating line numbers
Reconstructing code snippets from memory
Flagging violations without direct source code evidence
Flagging public API URLs, CDN links, or env-var-sourced values as secrets
Flagging generic query parameters (IDs, pagination) as sensitive data leaks
Skipping any of the 16 rules
Switching models mid-execution
Adding new sections beyond Sections 1–4
================================================================================

FINAL VALIDATION (run before saving output)
[ ] All 16 rules evaluated [ ] Sections sorted: High → Medium → Low, then Rule Number ascending [ ] Every FAIL has confirmed file path + line number in source code [ ] Every code snippet is copied verbatim (max 10 lines) [ ] Severity matches the locked table for every rule [ ] Overall risk calculation applied correctly [ ] IST timestamp in footer [ ] Output file saved to: Audit Report Output/security-audit-report-YYYYMMDD-HHMMSS-IST.html

================================================================================

END OF SECURITY AUDIT v3.4
