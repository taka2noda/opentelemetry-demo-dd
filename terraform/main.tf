terraform {
  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.50"
    }
  }
}

provider "datadog" {
  # DD_API_KEY, DD_APP_KEY, DD_SITE are read from environment variables
}
