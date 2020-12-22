# these are opinionated rules for score calculation
package main

database := [
  "couchbase",
  "mysql",
  "mongo",
  "postgres",
  "influxdb",
  "crate",
  "couchdb",
  "neo4j",
  "rethinkdb",
  "arangodb",
  "grakn",
  "realm",
  "elasticsearch",
  "redis",
  "sqlite3",
  "mariadb",
  "cassandra"
  ]

# images should be pinned
deny[msg] {
  endswith(input.services[_].image, ":latest")
  msg := "No images tagged latest"
}

# images should have a tag
deny[msg] {
  not split(input.services[_].image, ":")[1]
  msg := "No images without tag"
}

# the compose file should define a version
deny[msg] {
  not input.version

  msg := "Version is not set"
}

# a service that is being build should have an image as well
warn[msg] {
  service := input.services[_]
  service.build
  not service.image
  
  msg := "Image should be set even for a build"
}

# depends_on should be set if there is a database involved
warn[msg] {
  service := input.services[_]
  image := split(service.image, ":")

  count(input.services) > 1

  any_database_service(input.services)
  not any_database(image[0])
  not service.depends_on

  msg := sprintf("depends_on should be set %s", [image])
}

any_database_service(services) {
  service := services[_]
  image := split(service.image, ":")

  any_database(image[0])
}

any_database(image) {
  some i
  db := database[i]
  image == db
}

# if a volume is defined the global volumes is defined as well
warn[msg] {
  any_volumes(input.services)

  not input.volumes

  msg := "volumes is not defined properly"
}

any_volumes(services) {
  some i
  service := services[i]
  service.volumes
}

# if a network is defined the global networks is defined as well
warn[msg] {
  any_networks(input.services)

  not input.networks

  msg := "networks is not defined properly"
}

any_networks(services) {
  some i
  service := services[i]
  service.networks
}
