output "team_id" {
  description = "AIOps Demo team ID"
  value       = datadog_team.dd_aiops_team.id
}

output "on_call_schedule_id" {
  description = "On-Call schedule ID"
  value       = datadog_on_call_schedule.dd_aiops_on_call_schedule.id
}

output "escalation_policy_id" {
  description = "Escalation policy ID"
  value       = datadog_on_call_escalation_policy.dd_aiops_on_call_escalation_policy.id
}

output "monitor_ids" {
  description = "Monitor IDs"
  value = {
    apm_error_rate        = datadog_monitor.dd_aiops_monitor_apm_error_rate.id
    log_error_count       = datadog_monitor.dd_aiops_monitor_log_error_count.id
    container_memory      = datadog_monitor.dd_aiops_monitor_container_memory.id
    container_cpu         = datadog_monitor.dd_aiops_monitor_container_cpu.id
    apm_p99_latency       = datadog_monitor.dd_aiops_monitor_apm_p99_latency.id
    checkout_error_count  = datadog_monitor.dd_aiops_monitor_checkout_error_count.id
  }
}

output "incident_type_id" {
  description = "Incident type ID"
  value       = datadog_incident_type.dd_aiops_incident_type.id
}
