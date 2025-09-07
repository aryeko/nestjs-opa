package authz_test

import data.authz

# Public routes allowed

test_public_route_allowed if {
  res := authz.result with input as {"endpoint": {"public": true}}
  res.allow
}

# Missing decorator denies

test_missing_decorator_denied if {
  res := authz.result with input as {"endpoint": {}}
  not res.allow
}

# Unscoped RBAC allow/deny

test_unscoped_rbac_allow if {
  inp := {"subject": {"roles": ["viewer"]}, "endpoint": {"action": "home.read"}}
  res := authz.result with input as inp
  res.allow
}

test_unscoped_rbac_deny if {
  inp := {"subject": {"roles": ["viewer"]}, "endpoint": {"action": "home.update"}}
  res := authz.result with input as inp
  not res.allow
}

# Scoped allow

test_scoped_allow if {
  inp := {
    "subject": {"roles": ["operator"]},
    "endpoint": {"action": "camera.stream"},
    "resource": {"permissions": ["device_camera.view_camera"]}
  }
  res := authz.result with input as inp
  res.allow
}

# Time-window caveat

test_time_window_pass if {
  inp := {
    "subject": {"roles": ["babysitter"], "window": {"start": 1, "end": 10}},
    "request": {"time": 5},
    "endpoint": {"action": "camera.stream"},
    "resource": {"permissions": ["device_camera.view_camera"]}
  }
  res := authz.result with input as inp
  res.allow
}

test_time_window_fail if {
  inp := {
    "subject": {"roles": ["babysitter"], "window": {"start": 1, "end": 10}},
    "request": {"time": 15},
    "endpoint": {"action": "camera.stream"},
    "resource": {"permissions": ["device_camera.view_camera"]}
  }
  res := authz.result with input as inp
  not res.allow
}
