---
name: performance-audit
description: Conducts a deep performance audit of a web application, identifying bottlenecks, memory leaks, and inefficient rendering patterns. Generates detailed reports with findings and remediation steps.
---
# SKILL: Performance Audit

## 1. Overview
This skill executes a comprehensive performance audit on the current workspace. It is designed to identify, measure, and diagnose performance issues in web applications, particularly those built with frameworks like React.

The audit process involves:
1.  **Codebase Analysis**: Statically analyzing the code to identify potential performance anti-patterns.
2.  **Dynamic Analysis**: Instrumenting the code and running the application to collect real-time performance data.
3.  **Root Cause Identification**: Correlating static and dynamic findings to pinpoint the exact sources of bottlenecks.
4.  **Reporting**: Generating detailed markdown reports with actionable recommendations.

## 2. Execution Steps

### Step 1: Initial Code Scan & Hypothesis Formation
- **Action**: Perform a high-level review of the codebase to understand its structure, dependencies, and key components.
- **Goal**: Identify components that are likely to be performance-intensive (e.g., large lists, complex state management, frequent updates).
- **Tools**: `list_dir`, `read_file`, `semantic_search`.

### Step 2: Create & Inject Profiling Tools
- **Action**: Create temporary TypeScript/JavaScript files (`performance-monitor.ts`, `debug-analysis.ts`) containing functions to profile:
    - Component render times and counts.
    - The frequency and cost of DOM queries.
    - The timing and cascade of state updates.
    - Event listener registrations to track potential memory leaks.
- **Action**: Inject these profiling tools into the application's main entry point (e.g., `main.tsx`, `index.js`).
- **Goal**: Prepare the application for dynamic analysis.
- **Tools**: `create_file`, `insert_edit_into_file`.

### Step 3: Run Application and Collect Data
- **Action**: Install dependencies (`npm install`) and start the development server (`npm run dev`).
- **Action**: Interact with the application (or simulate interaction) to trigger the performance-intensive code paths identified in Step 1.
- **Goal**: Capture live performance data using the injected profilers. The output from the dev server will contain the logs from the profilers.
- **Tools**: `run_in_terminal`.

### Step 4: Analyze Data and Identify Root Causes
- **Action**: Analyze the collected logs from the terminal output.
- **Goal**: Correlate the data to specific issues. For example:
    - **Memory Leaks**: An ever-increasing number of event listeners.
    - **Inefficient Rendering**: High render counts for components not directly affected by a state change.
    - **Expensive Computations**: Long execution times for specific functions.
    - **DOM Thrashing**: High frequency of DOM queries within component lifecycle methods or event handlers.

### Step 5: Generate Reports
- **Action**: Create a set of detailed markdown reports summarizing the audit.
- **Reports to Create**:
    - `PERFORMANCE_SUMMARY.md`: A high-level overview of the findings and overall performance score.
    - `PERFORMANCE_ROOT_CAUSE_ANALYSIS.md`: A deep dive into each identified issue, explaining the cause with code snippets.
    - `REMEDIATION_PLAN.md`: A step-by-step plan with code examples on how to fix each issue.
- **Goal**: Provide the user with clear, actionable documentation.
- **Tools**: `create_file`.

### Step 6: Cleanup
- **Action**: Remove the injected code from the application's entry point.
- **Action**: Delete the temporary profiling files (`performance-monitor.ts`, `debug-analysis.ts`).
- **Goal**: Restore the codebase to its original state.
- **Tools**: `replace_string_in_file`, `run_in_terminal` (using `rm`).

## 3. Example Invocation
`@workspace /apply-skill performance-audit`
