namespace "default" {
  policy       = "read"
  policy = "write"
  capabilities = ["list-jobs", "read-job"]
}

agent {
  policy = "write"
  policy = "read"
}

operator {
  policy = "write"
  policy = "read"
}

quota {
  policy = "write"
  policy = "read"
}

node {
  policy = "write"
  policy = "read"
}

host_volume "*" {
  policy = "write"
  policy = "read"
}

