# Infrastructure as a Code Repository

> contains files to setup my master thesis project in a kubernetes cluster

## Getting Started

### Prerequisites

[`docker`](https://www.docker.com/)

[`kind`](https://github.com/kubernetes-sigs/kind)

[`kubectl`](https://github.com/kubernetes/kubectl)

## Deployment

`Kind cluster for testing purposes`

```
kind create cluster --config kubernetes/cluster.yml
```

```
kubectl apply -f kubernetes/nginx.yml
kubectl apply -f kubernetes/jenkins/ns.yml
kubectl apply -f kubernetes/jenkins/config
kubectl apply -f kubernetes/jenkins/pipelines
kubectl apply -f kubernetes/jenkins/
```


## Example

Pipeline has to run once to be able to use `buildWithParameters`

```
http://localhost:9888/job/compose-pipeline/build
```

POST request to trigger the pipeline:
```
http://localhost:9888/job/compose-pipeline/buildWithParameters?REPOSITORY=https://github.com/langleu/MA_Crawler
```

clair/klar usage - dry run outside of CI:
```
kubectl run -i --tty klar --image=langleu/klar --env=CLAIR_ADDR=clair-clair:6060 --env=JSON_OUTPUT=true -- node:10
```
