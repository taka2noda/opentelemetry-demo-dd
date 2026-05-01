data "datadog_user" "takaaki" {
  filter = "takaaki.tsunoda@datadoghq.com"
}

resource "datadog_team" "dd_aiops_team" {
  name        = "AIOps Demo"
  handle      = "aiops-demo"
  description = "AIOps Demo team for Datadog Live Tokyo 2026-05-20"
}

resource "datadog_team_membership" "dd_aiops_team_membership" {
  team_id = datadog_team.dd_aiops_team.id
  user_id = data.datadog_user.takaaki.id
  role    = "admin"
}
