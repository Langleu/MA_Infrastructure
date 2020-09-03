# Infrastructure as a Code Repository for Jenkins

> contains files to setup a kind cluster with 2 worker nodes and ingress nginx to expose the Jenkins instance.

## Getting Started

### Prerequisites

[`docker`](https://www.docker.com/)

[`kind`](https://github.com/kubernetes-sigs/kind)

[`kubectl`](https://github.com/kubernetes/kubectl)

## Deployment

```
kind create cluster --config cluster.yml
```

```
kubectl apply -f nginx.yml
kubectl apply -f jenkins/
```


## Example

POST request to trigger the pipeline:
```
http://localhost:9888/job/compose-pipeline/buildWithParameters?REPOSITORY=https://github.com/langleu/MA_Crawler
```
