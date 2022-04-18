FROM golang:1.17.6 AS go_build_env
ADD . /app
WORKDIR /app/backend
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

FROM node:alpine AS node_build_env
COPY --from=go_build_env /app/front-end ./
RUN npm install
RUN npm run build

FROM alpine:latest AS deployment_env
RUN apk --no-cache add ca-certificates
COPY --from=go_build_env /main ./
COPY --from=go_build_env /app/backend/.env ./
COPY --from=node_build_env /build ./web
RUN chmod 755 ./main
EXPOSE 8080
CMD ./main