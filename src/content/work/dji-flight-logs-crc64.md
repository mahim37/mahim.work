---
title: "Reverse-engineering DJI flight logs, and cracking a CRC64"
description: "A forensics toolkit for DJI, Parrot and Anafi telemetry, built at DRDO, and the checksum that had to be recovered first."
date: 2026-09-20 # planned publish date
draft: true
period: "2023"
order: 3
# Outline. Target 900–1500 words, then cut a fifth. Stay within what the public repo and the
# paper already show. Add `repo:` once the Drone-Data-Toolkit README is rewritten, and `paper:`
# only once it is published; verify its status and word the mention to match.
---

## Context

*DIAT, DRDO, Pune, Aug–Nov 2023. What forensic auditors needed out of a drone's logs, and
why the vendor formats stood in the way.*

## Problem

*An undocumented binary format with a checksum you cannot regenerate. Without the checksum
you cannot validate records or detect tampering.*

## Design and trade-offs

*How you approach an unknown binary: finding record boundaries, spotting the checksum field,
narrowing to CRC64 and recovering the polynomial, init, reflection and final XOR. How the
decoder was generalised to Parrot and Anafi. What you rejected and why.*

*Diagram: the record layout with the checksum field and the recovered parameters.*

## What broke, and what I would do differently

*Mandatory.*

## Outcome

*What the toolkit let auditors do. The paper, worded to match its real status.*

## Links

- Repo
- Paper
