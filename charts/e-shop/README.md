## Pre-requisites

1. Create secret from .env file

```
kubectl create secret generic e-shop-secret --from-env-file=.env
```

2. Install nginx ingress controller

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace default
```

## Installation

Run command

```
helm upgrade --atomic --timeout 10m --install --debug charts/e-shop .
```

## Deletion

Run command

```
helm delete e-shop
```
