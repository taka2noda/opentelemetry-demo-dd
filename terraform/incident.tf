resource "datadog_incident_type" "dd_aiops_incident_type" {
  name        = "AIOps Demo"
  description = "Incident type for AIOps Demo scenarios (Datadog Live Tokyo 2026-05-20)"
  is_default  = false
}
