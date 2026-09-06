---
title: "Orchestrating ten LLM agents behind one Django API"
description: "FNCR's backend at Fischer Jordan: Django REST, ten-plus LLM agents, partner APIs, one backend behind iOS, Android and web."
date: 2026-10-04 # planned publish date
draft: true
period: "2024–now"
order: 1
# Outline. Target 900–1500 words, then cut a fifth. First person, past tense, pattern level only:
# no schemas, metrics, partner names, prompts or internal screenshots. The manager gets a 48-hour
# note before this publishes.
---

## Context

*Two or three sentences. What FNCR is at a level the public site already states, who the
backend serves (iOS, Android, web), and the constraint that made it hard: one small team, one
backend, many agents, real users.*

## Problem

*The thing a naive design would have got wrong. Candidates: agent boundaries; long-running
work behind a request/response API; partner APIs that fail in interesting ways; the same
result consumed by three clients.*

## Design and trade-offs

*The longest section. Where the agent boundaries were drawn and why. Tool calling. Timeouts,
retries and idempotency. Cost and latency budgets. Observability: what you log about an LLM
call so you can explain it a week later. What you rejected (a single mega-agent, a
third-party orchestration framework, synchronous calls) and why.*

*One hand-drawn diagram minimum: the request path from a client through the API to an agent
and back, with the async seam marked.*

## What broke, and what I would do differently

*Mandatory. The failure modes you actually hit. What you would sequence or design
differently with what you know now.*

## Outcome

*Only claims you would defend in an interview. Qualitative is fine: shipped on three
platforms, agents added without touching clients, on-call quieter after X change.*

## Links

- Fischer Jordan
- Related post: JSONB filtering in Django REST Framework (after launch)
