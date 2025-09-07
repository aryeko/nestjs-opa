package authz

default allow = false

result = {"allow": allow}

allow if {
  input.endpoint.public
}

allow if {
  action := input.endpoint.action
  some role
  input.subject.roles[_] == role
  data.roles[role].actions[_] == action
  resource_allowed(action)
  time_window_ok
}

resource_allowed(action) if {
  not data.actionMaps.scoped_actions[action]
}

resource_allowed(action) if {
  data.actionMaps.scoped_actions[action]
  perm := data.actionMaps.action_to_spicedb_perm[action]
  some p
  input.resource.permissions[p] == perm
}

time_window_ok if {
  not input.subject.window
}

time_window_ok if {
  start := input.subject.window.start
  end := input.subject.window.end
  t := input.request.time
  t >= start
  t <= end
}
