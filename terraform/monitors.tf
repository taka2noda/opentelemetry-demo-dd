locals {
  common_tags = ["env:otel", "managed_by:terraform"]
}

resource "datadog_monitor" "dd_aiops_monitor_apm_error_rate" {
  name    = "APM Error Rate by Service"
  type    = "query alert"
  message = <<-EOT
    {{service.name}} error rate is above 5%%.
    {{#is_alert}}Service: {{service.name}} / Error rate: {{value}}%%{{/is_alert}}
    {{#is_recovery}}Recovered{{/is_recovery}}
  EOT

  query = "sum(last_1m):(sum:trace.grpc.server.request.errors{env:otel} by {service}.as_count() + sum:trace.server.request.errors{env:otel} by {service}.as_count()) / (sum:trace.grpc.server.request.hits{env:otel} by {service}.as_count() + sum:trace.server.request.hits{env:otel} by {service}.as_count() + 1) * 100 > 5"

  monitor_thresholds {
    critical = 5
    warning  = 3
  }

  evaluation_delay    = 15
  no_data_timeframe   = 10
  require_full_window = false
  notify_no_data      = false

  tags = local.common_tags
}

resource "datadog_monitor" "dd_aiops_monitor_log_error_count" {
  name    = "Log Error Count by Service"
  type    = "log alert"
  message = <<-EOT
    {{service.name}} has more than 5 error logs in 1 minute.
    {{#is_alert}}Service: {{service.name}} / Error count: {{value}}{{/is_alert}}
    {{#is_recovery}}Recovered{{/is_recovery}}
  EOT

  query = "logs(\"env:otel status:error\").rollup(\"count\").by(\"service\").last(\"1m\") > 5"

  monitor_thresholds {
    critical = 5
    warning  = 3
  }

  no_data_timeframe   = 10
  notify_no_data      = false

  tags = local.common_tags
}

resource "datadog_monitor" "dd_aiops_monitor_container_memory" {
  name    = "Container Memory Usage Spike"
  type    = "query alert"
  message = <<-EOT
    {{service.name}} memory usage is spiking.
    {{#is_alert}}Service: {{service.name}} / Memory: {{value}} bytes{{/is_alert}}
    {{#is_recovery}}Recovered{{/is_recovery}}
  EOT

  query = "avg(last_1m):avg:container.memory.usage{*} by {service} > 80000000"

  monitor_thresholds {
    warning  = 60000000
    critical = 80000000
  }

  evaluation_delay    = 15
  no_data_timeframe   = 10
  require_full_window = false
  notify_no_data      = false

  tags = local.common_tags
}

resource "datadog_monitor" "dd_aiops_monitor_apm_p99_latency" {
  name    = "APM P99 Latency Spike by Service"
  type    = "query alert"
  message = <<-EOT
    {{service.name}} P99 latency is above 1s.
    {{#is_alert}}Service: {{service.name}} / P99: {{value}}ns{{/is_alert}}
    {{#is_recovery}}Recovered{{/is_recovery}}
  EOT

  query = "avg(last_1m):p99:trace.grpc.server.request.duration{env:otel} by {service} > 1000000000"

  monitor_thresholds {
    warning  = 500000000
    critical = 1000000000
  }

  evaluation_delay    = 15
  no_data_timeframe   = 10
  require_full_window = false
  notify_no_data      = false

  tags = local.common_tags
}

resource "datadog_monitor" "dd_aiops_monitor_checkout_error_count" {
  name    = "Checkout Service Error Count"
  type    = "query alert"
  message = <<-EOT
    checkout service error count is elevated.
    {{#is_alert}}Error count: {{value}}{{/is_alert}}
    {{#is_recovery}}Recovered{{/is_recovery}}
  EOT

  query = "sum(last_1m):(sum:trace.grpc.server.request.errors{env:otel,service:checkout}.as_count() + sum:trace.server.request.errors{env:otel,service:checkout}.as_count()) > 3"

  monitor_thresholds {
    warning  = 1
    critical = 3
  }

  evaluation_delay    = 15
  no_data_timeframe   = 10
  require_full_window = false
  notify_no_data      = false

  tags = local.common_tags
}

resource "datadog_monitor" "dd_aiops_monitor_container_cpu" {
  name    = "Container CPU Utilization Spike"
  type    = "query alert"
  message = <<-EOT
    {{service.name}} CPU utilization is above 80%%.
    {{#is_alert}}Service: {{service.name}} / CPU: {{value}}%%{{/is_alert}}
    {{#is_recovery}}Recovered{{/is_recovery}}
  EOT

  query = "avg(last_1m):avg:container.cpu.utilization{*} by {service} > 80"

  monitor_thresholds {
    warning  = 50
    critical = 80
  }

  evaluation_delay    = 15
  no_data_timeframe   = 10
  require_full_window = false
  notify_no_data      = false

  tags = local.common_tags
}
