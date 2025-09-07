package authz_test

import data.authz

roles := {
  "viewer": {"actions": ["read"]},
  "operator": {"actions": ["stream"]},
  "babysitter": {"actions": ["stream"]},
}

actionMaps := {
  "scoped_actions": {"stream": true},
  "action_to_spicedb_perm": {"stream": "device.view"},
}

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
  inp := {"subject": {"roles": ["viewer"]}, "endpoint": {"action": "read"}}
  res := authz.result with input as inp with data.roles as roles with data.actionMaps as actionMaps
  res.allow
}

test_unscoped_rbac_deny if {
  inp := {"subject": {"roles": ["viewer"]}, "endpoint": {"action": "update"}}
  res := authz.result with input as inp with data.roles as roles with data.actionMaps as actionMaps
  not res.allow
}

# Scoped allow

test_scoped_allow if {
  inp := {
    "subject": {"roles": ["operator"]},
    "endpoint": {"action": "stream"},
    "resource": {"permissions": ["device.view"]},
  }
  res := authz.result with input as inp with data.roles as roles with data.actionMaps as actionMaps
  res.allow
}

# Time-window caveat

test_time_window_pass if {
  inp := {
    "subject": {"roles": ["babysitter"], "window": {"start": 1, "end": 10}},
    "request": {"time": 5},
    "endpoint": {"action": "stream"},
    "resource": {"permissions": ["device.view"]},
  }
  res := authz.result with input as inp with data.roles as roles with data.actionMaps as actionMaps
  res.allow
}

test_time_window_fail if {
  inp := {
    "subject": {"roles": ["babysitter"], "window": {"start": 1, "end": 10}},
    "request": {"time": 15},
    "endpoint": {"action": "stream"},
    "resource": {"permissions": ["device.view"]},
  }
  res := authz.result with input as inp with data.roles as roles with data.actionMaps as actionMaps
  not res.allow
}
