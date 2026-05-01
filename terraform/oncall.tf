resource "datadog_on_call_schedule" "dd_aiops_on_call_schedule" {
  name      = "AIOps Demo On-Call"
  time_zone = "Asia/Tokyo"
  teams     = [datadog_team.dd_aiops_team.id]

  layer {
    effective_date = "2026-05-01T00:00:00Z"
    name           = "Primary"
    rotation_start = "2026-05-19T00:00:00Z"
    interval {
      days = 7
    }
    users = [data.datadog_user.takaaki.id]
  }
}

resource "datadog_on_call_escalation_policy" "dd_aiops_on_call_escalation_policy" {
  name  = "AIOps Demo Escalation Policy"
  teams = [datadog_team.dd_aiops_team.id]

  step {
    escalate_after_seconds = 300
    target {
      schedule = datadog_on_call_schedule.dd_aiops_on_call_schedule.id
    }
  }
}

resource "datadog_on_call_team_routing_rules" "dd_aiops_on_call_team_routing_rules" {
  id = datadog_team.dd_aiops_team.id

  rule {
    urgency           = "high"
    escalation_policy = datadog_on_call_escalation_policy.dd_aiops_on_call_escalation_policy.id
  }
}
