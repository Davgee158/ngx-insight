# Day 1 banking data fixture

`day1-banking-fy2024-pbt.csv` is a historical validation fixture, not runtime
application data. It contains group profit-before-tax values from the audited
FY2024 issuer filings for GTCO and Zenith Bank, plus FY2023 comparatives. Both
periods end on December 31, 2024 and December 31, 2023 respectively, so they
can be used to validate the period-alignment and PBT-growth peer-comparison
path.

The raw source units differ: GTCO reports in thousands of NGN and Zenith Bank
in millions of NGN. `value` and `prior_value` are normalized to NGN; raw values
and units remain in the CSV for traceability. The growth formula is
`(current_period / prior_period - 1) * 100`, yielding 107.8% for GTCO and
66.7% for Zenith Bank when rounded to one decimal place.

This fixture validates **one metric only**. It does not supply enough evidence
to produce a full Company Analysis, a banking-sector statistic, or a Quick
Check strength/watch insight. Other absent metrics are missing, never zero or
implicitly passed. `published_at` is blank because the exact filing publication
timestamp has not yet been captured; `retrieved_at` records when this fixture
was assembled.
