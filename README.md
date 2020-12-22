# Infrastructure as a Code Repository

> contains files to setup my master thesis project in a kubernetes cluster

## Getting Started

### Prerequisites

[`docker`](https://www.docker.com/)

[`kind`](https://github.com/kubernetes-sigs/kind)

[`kubectl`](https://github.com/kubernetes/kubectl)

## Contents
[Proxy](./proxy) - information funnel and orchestrator for tests

All Infrastructure as Code related files in [Kubernetetes](./kubernetes)

[Conftest](./conftest) containing best practices to be checked against

## Development

`Kind cluster for testing purposes`

```
kind create cluster --config kubernetes/cluster.yml
```

```
kubectl apply -f kubernetes/nginx.yml
kubectl apply -f kubernetes/...
```

## Example

POST request to trigger the pipeline:
```
http://localhost:9888/job/compose-pipeline/buildWithParameters?REPOSITORY=https://github.com/langleu/MA_Crawler
```
