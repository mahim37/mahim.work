---
title: "Moving a live fintech backend from AWS to Azure"
description: "Deployment architecture, data-refresh pipelines and the production release workflow, moved while the product stayed up."
date: 2026-09-27 # planned publish date
draft: true
period: "2025"
order: 2
# Outline. Target 900–1500 words, then cut a fifth. Pattern level only: no customer or partner
# names, no volumes, no costs. The manager gets a 48-hour note before this publishes.
---

## Context

*What was running on AWS, roughly (compute, database, storage, scheduled jobs), and why the
move happened at the level you can state publicly.*

## Problem

*Why this was harder than lift-and-shift: the data-refresh pipelines, the release workflow that
depended on AWS-specific pieces, and doing it while the product stayed up.*

## Design and trade-offs

*Service inventory and how each piece mapped. How the data-refresh pipelines were rebuilt.
Cutover order and why that order. The rollback plan and what would have triggered it. How the
staging-to-production release workflow changed. What you rejected (big-bang cutover, running
both clouds for longer) and why.*

*Diagram: before and after, with the cutover boundary marked.*

## What broke, and what I would do differently

*Mandatory. What you would sequence differently.*

## Outcome

*Defensible claims only.*

## Links

- Fischer Jordan
