CREATE TABLE companies (
    company_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL
);

INSERT INTO companies (company_id, company_name)
VALUES
    ('gtco', 'Guaranty Trust Holding Company Plc'),
    ('zenith_bank', 'Zenith Bank Plc');

CREATE TABLE import_batches (
    import_batch_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_file TEXT NOT NULL,
    imported_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_observations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    company_id TEXT NOT NULL
        REFERENCES companies(company_id) ON DELETE RESTRICT,
    import_batch_id BIGINT NOT NULL
        REFERENCES import_batches(import_batch_id) ON DELETE RESTRICT,

    metric_key TEXT NOT NULL,
    period_kind TEXT NOT NULL,
    period_start DATE,
    period_end DATE,
    observation_date DATE,
    target_period TEXT,
    comparison_period_start DATE,
    comparison_period_end DATE,

    value NUMERIC,
    unit TEXT NOT NULL,
    source_value NUMERIC,
    source_unit TEXT,

    source_name TEXT,
    source_locator TEXT,
    source_label TEXT,
    basis TEXT,
    statement_scope TEXT,

    capture_method TEXT,
    capture_method_original TEXT,

    status TEXT NOT NULL,
    verification_status TEXT NOT NULL,

    published_on DATE,
    published_at TIMESTAMPTZ,
    retrieved_on DATE,
    retrieved_at TIMESTAMPTZ,

    content_fingerprint TEXT NOT NULL,

    CONSTRAINT market_observations_status_check
        CHECK (status IN (
            'available',
            'missing',
            'unavailable',
            'not_applicable',
            'conflicting',
            'stale'
        )),

    CONSTRAINT market_observations_verification_status_check
        CHECK (verification_status IN (
            'not_assessed',
            'primary_source_checked',
            'independently_reconciled'
        )),

    CONSTRAINT market_observations_capture_method_check
        CHECK (
            capture_method IS NULL
            OR capture_method IN (
                'manual_transcription',
                'provider_api_response',
                'other'
            )
        ),

    CONSTRAINT market_observations_available_evidence_check
        CHECK (
            status <> 'available'
            OR (
                value IS NOT NULL
                AND capture_method IS NOT NULL
                AND NULLIF(BTRIM(source_name), '') IS NOT NULL
                AND NULLIF(BTRIM(source_locator), '') IS NOT NULL
                AND NULLIF(BTRIM(source_label), '') IS NOT NULL
            )
        ),

    CONSTRAINT market_observations_missing_value_check
        CHECK (
            status NOT IN ('missing', 'unavailable')
            OR value IS NULL
        ),

    CONSTRAINT market_observations_fingerprint_format_check
        CHECK (content_fingerprint ~ '^[0-9a-f]{64}$'),

    CONSTRAINT market_observations_content_fingerprint_unique
        UNIQUE (content_fingerprint)
);

CREATE INDEX market_observations_company_metric_period_idx
    ON market_observations (
        company_id,
        metric_key,
        period_end,
        observation_date
    );

CREATE INDEX market_observations_import_batch_idx
    ON market_observations (import_batch_id);
