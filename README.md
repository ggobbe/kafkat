# kafka-cli

## Installation

Install dependencies with `yarn`

## Run

Run `yarn start`

## Environment variables

Add these environment variables to connect to your kafka cluster.

Name | Description
--- | ---
`KAFKACLI_BROKERS` | List of brokers (separated by comas)
`KAFKACLI_SSL` | `true` or `false`
`KAFKACLI_SASL_MECHANISM` | `PLAIN` or `SCRAM-SHA-256`
`KAFKACLI_SASL_USERNAME` | Username
`KAFKACLI_SASL_PASSWORD` | Password


## Configuration examples

### Using SASL/SCRAM on Cloud Karafka (single broker)
```
export KAFKACLI_BROKERS='broker-01.srvs.cloudkafka.com:9094'
export KAFKACLI_SSL='true'
export KAFKACLI_SASL_MECHANISM='SCRAM-SHA-256'
export KAFKACLI_SASL_USERNAME='some-user'
export KAFKACLI_SASL_PASSWORD='some-pass'
```

### Using SASL on Confluent Cloud (3 brokers)
```
export KAFKACLI_BROKERS='confluent-cloud-01:9092,confluent-cloud-02:9092,confluent-cloud-03:9092'
export KAFKACLI_SSL='true'
export KAFKACLI_SASL_MECHANISM='PLAIN'
export KAFKACLI_SASL_USERNAME='some-user'
export KAFKACLI_SASL_PASSWORD='some-pass'
```

### Using local kafka instance
```
export KAFKACLI_BROKERS='localhost:9092'
```

## Contributing

Feel free to send Pull Requests.

## Tested with

- Node 14.15
- yarn 1.22.10