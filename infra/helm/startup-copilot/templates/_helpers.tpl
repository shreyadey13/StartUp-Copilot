{{- define "startup-copilot.name" -}}
startup-copilot
{{- end -}}

{{- define "startup-copilot.fullname" -}}
{{ include "startup-copilot.name" . }}
{{- end -}}

{{- define "startup-copilot.image" -}}
{{- $registry := .root.Values.image.registry -}}
{{- if $registry -}}{{ $registry }}/{{- end -}}{{ .repository }}:{{ .root.Values.image.tag }}
{{- end -}}

