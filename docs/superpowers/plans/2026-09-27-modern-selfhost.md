# Modern PythonTutor Self-host Implementation Plan

**Goal:** Turn the public archive into a working, portable, maintained-runtime self-host application.

**Architecture:** Preserve Django data model, learning content and visualizer protocol. Replace obsolete framework APIs and isolate student execution behind an internal runner using disposable containers.

**Tech Stack:** Python 3.14.7, Django 5.2 LTS, SQLite, Gunicorn, WhiteNoise, Docker Compose.

## Global Constraints

- Preserve original attribution and MIT / CC BY-NC-SA notices.
- No default passwords, no import of old example users, no unisolated execution fallback.
- Keep original lesson/task paths and existing visualizer JSON contract.
- Browser assets must work without contacting the original site.
- Work in the dedicated downloaded repository on codex/modern-selfhost. No remote publishing.

## Task 1: Framework and persistence

Files: pythontutor/*.py, tutorial/*.py, tutorial/views/*.py, tutorial/templatetags/*.py, tutorial/migrations/, tutorial/management/, requirements.txt.

- [x] Replace Django 1.6 settings, middleware, URLs, auth calls and model declarations with Django 5.2 equivalents.
- [x] Create native migrations and idempotent seed command from archive content/catalog, excluding example users.
- [x] Preserve registration, profile, progress, grading, teaching and visualizer entry points; add auth/CSRF/ownership checks.
- [x] Verify fresh migration and import; test authenticated/anonymous/wrong-owner behavior and progress persistence.

## Task 2: Isolated Python execution

Files: evaldontevil/, runner/, tests/test_runner.py.

Contract: execute_python(code, stdin='', explain=False) returns object with result, stdout, stderr, optional trace and exception, compatible with current views and tutorial.tester.

- [x] Add internal authenticated runner HTTP API and disposable Docker worker with code/input through stdin JSON.
- [x] Preserve/port tracing encoder and protocol; enforce code/input/output/trace/time/memory/pid limits.
- [x] Verify normal execution, recursive/list traces, syntax/runtime errors, timeout and fail-closed Docker failure.

## Task 3: Autonomous browser UI

Files: tutorial/templates/, tutorial/static/.

- [x] Preserve Russian course layout/editor/step visualizer/test table; modernize auth forms and CSRF AJAX.
- [x] Remove automatic third-party requests and vendor required resources.
- [x] Verify edit/run/check/trace, logout and responsive navigation against backend routes.

## Task 4: Delivery and integration

Files: Dockerfile, compose.yaml, scripts/, .env.example, README.md, docs/VERIFICATION.md.

- [x] Add production entrypoint, persistent volumes, internal runner connectivity and environment configuration.
- [x] Run migrations, content audit, Django tests, runner integration and browser user journey.
- [x] Fix integration failures; review auth/execution boundaries and rerun affected checks.
- [x] Document verified commands, portability, backup/restore and differences from live website.

## Task 5: Image processing (user-requested extension)

Files: runner image support, tutorial/image_course.py, tutorial/views/images.py, ImageSubmission/ImageAssignment models, image templates/static, image_course catalog and fixture generator.

- [x] Add latest stable CPython3.14.7, pinned OpenCV/NumPy/Pillow wheels.
- [x] Add8tasks and24 independent expected image fixtures.
- [x] Add validated image upload/run/result preview/fixed-test grading.
- [x] Add teacher assignment form and per-student progress.
- [x] Verify actual container image operations, all24 reference checks and browser flow.
