{{/*
Expand the name of the chart.
*/}}
{{- define "chatkit.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "chatkit.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "chatkit.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "chatkit.labels" -}}
helm.sh/chart: {{ include "chatkit.chart" . }}
{{ include "chatkit.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "chatkit.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chatkit.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Backend labels
*/}}
{{- define "chatkit.backend.labels" -}}
{{ include "chatkit.labels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "chatkit.backend.selectorLabels" -}}
{{ include "chatkit.selectorLabels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Frontend labels
*/}}
{{- define "chatkit.frontend.labels" -}}
{{ include "chatkit.labels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "chatkit.frontend.selectorLabels" -}}
{{ include "chatkit.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Ollama labels
*/}}
{{- define "chatkit.ollama.labels" -}}
{{ include "chatkit.labels" . }}
app.kubernetes.io/component: ollama
{{- end }}

{{/*
Ollama selector labels
*/}}
{{- define "chatkit.ollama.selectorLabels" -}}
{{ include "chatkit.selectorLabels" . }}
app.kubernetes.io/component: ollama
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "chatkit.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "chatkit.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Backend service name
*/}}
{{- define "chatkit.backend.serviceName" -}}
{{- printf "%s-backend" (include "chatkit.fullname" .) }}
{{- end }}

{{/*
Frontend service name
*/}}
{{- define "chatkit.frontend.serviceName" -}}
{{- printf "%s-frontend" (include "chatkit.fullname" .) }}
{{- end }}

{{/*
Ollama service name
*/}}
{{- define "chatkit.ollama.serviceName" -}}
{{- printf "%s-ollama" (include "chatkit.fullname" .) }}
{{- end }}

{{/*
Backend API URL
*/}}
{{- define "chatkit.backend.apiUrl" -}}
{{- if .Values.frontend.widget.apiUrl }}
{{- .Values.frontend.widget.apiUrl }}
{{- else }}
{{- printf "http://%s:%d" (include "chatkit.backend.serviceName" .) (.Values.backend.service.port) }}
{{- end }}
{{- end }}

{{/*
Ollama API URL
*/}}
{{- define "chatkit.ollama.apiUrl" -}}
{{- printf "http://%s:%d" (include "chatkit.ollama.serviceName" .) (.Values.ollama.service.port) }}
{{- end }}

{{/*
Environment variables for backend
*/}}
{{- define "chatkit.backend.env" -}}
- name: NODE_ENV
  value: {{ .Values.backend.env.NODE_ENV | quote }}
- name: PORT
  value: {{ .Values.backend.env.PORT | quote }}
- name: ALLOWED_ORIGINS
  value: {{ .Values.backend.env.ALLOWED_ORIGINS | quote }}
- name: MAX_REQUESTS_PER_MINUTE
  value: {{ .Values.backend.env.MAX_REQUESTS_PER_MINUTE | quote }}
- name: MAX_REQUESTS_PER_HOUR
  value: {{ .Values.backend.env.MAX_REQUESTS_PER_HOUR | quote }}
- name: SESSION_MAX_AGE_HOURS
  value: {{ .Values.backend.env.SESSION_MAX_AGE_HOURS | quote }}
- name: RATE_LIMIT_BURST
  value: {{ .Values.backend.env.RATE_LIMIT_BURST | quote }}
- name: OLLAMA_BASE_URL
  value: {{ include "chatkit.ollama.apiUrl" . }}
- name: OLLAMA_MODEL
  value: {{ .Values.ollama.model | quote }}
- name: OLLAMA_API_KEY
  value: "ollama"
{{- if .Values.openai.enabled }}
- name: OPENAI_API_KEY
  valueFrom:
    secretKeyRef:
      name: {{ include "chatkit.fullname" . }}-secrets
      key: openai-api-key
{{- end }}
{{- if .Values.backend.security.sessionSecret }}
- name: SESSION_SECRET
  valueFrom:
    secretKeyRef:
      name: {{ include "chatkit.fullname" . }}-secrets
      key: session-secret
{{- end }}
{{- if .Values.backend.security.apiKeyHashSalt }}
- name: API_KEY_HASH_SALT
  valueFrom:
    secretKeyRef:
      name: {{ include "chatkit.fullname" . }}-secrets
      key: api-key-hash-salt
{{- end }}
{{- end }}
